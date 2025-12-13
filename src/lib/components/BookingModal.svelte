<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { goto } from '$app/navigation';
  import type { Booking } from '$lib/utils/conflictChecker';
  import { hasConflict } from '$lib/utils/conflictChecker';

  export let open: boolean = false;
  export let serviceId: string = "";
  export let serviceName: string = "";
  export let initialDateISO: string | null = null; // optional preselected date/time
  export let redirectAfterBooking: boolean = false; // if true, navigate after success

  const dispatch = createEventDispatcher();

  let customerName = "";
  let phone = "";
  let date = ""; // yyyy-mm-dd
  let time = ""; // hh:mm
  let loading = false;
  let message: { type: 'error'|'success'|'info', text: string } | null = null;

  // Load defaults when modal opens
  $: if (open && initialDateISO) {
    try {
      const dt = new Date(initialDateISO);
      // convert to local date/time input values
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      date = `${yyyy}-${mm}-${dd}`;

      const hh = String(dt.getHours()).padStart(2, '0');
      const min = String(dt.getMinutes()).padStart(2, '0');
      time = `${hh}:${min}`;
    } catch (e) {
      // ignore parse errors
    }
  }

  // helper to load bookings from localStorage
  function loadBookings(): Booking[] {
    try {
      const raw = localStorage.getItem('bookings');
      return raw ? (JSON.parse(raw) as Booking[]) : [];
    } catch {
      return [];
    }
  }

  function saveBookings(bookings: Booking[]) {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }

  // create UUID (simple)
  function uuid() {
    return crypto?.randomUUID?.() ?? (Date.now().toString(36) + Math.random().toString(36).slice(2));
  }

  async function submitForm() {
    message = null;
    if (!customerName.trim() || !phone.trim() || !date || !time) {
      message = { type: 'error', text: 'Please fill all fields.' };
      return;
    }

    loading = true;

    try {
      // combine date + time into a full ISO
      const combined = new Date(`${date}T${time}`);
      const fullISO = combined.toISOString();

      const newBooking: Booking = {
        id: uuid(),
        serviceId: serviceId || 'unknown',
        serviceName: serviceName || 'Service',
        fullDateISO: fullISO,
        customerName: customerName.trim(),
        phone: phone.trim()
      };

      const bookings = loadBookings();

      if (hasConflict(newBooking, bookings)) {
        message = { type: 'error', text: 'Time slot is already booked for this service. Try another time.' };
        loading = false;
        return;
      }

      // push and save
      bookings.push(newBooking);
      saveBookings(bookings);

      message = { type: 'success', text: 'Booking successful! Redirecting…' };

      // dispatch event so parent can react (e.g. refresh a list)
      dispatch('booked', { booking: newBooking });

      // small delay so user sees success
      await new Promise(res => setTimeout(res, 700));

      // optional redirect to appointments page (or anywhere)
      if (redirectAfterBooking) {
        goto(`/appointments?status=success`);
      }

      // close modal
      close();

    } catch (err) {
      console.error(err);
      message = { type: 'error', text: 'Something went wrong saving the booking.' };
    } finally {
      loading = false;
    }
  }

  function close() {
    // reset a few fields (but keep date/time if you want)
    // customerName = ""; phone = "";
    dispatch('close');
  }

  // allow Esc key to close
  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  onMount(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>

{#if open}
  <div class="overlay" on:click={close} aria-modal="true" role="dialog">
    <div class="modal" on:click|stopPropagation>
      <header class="modal-header">
        <h3 class="modal-title">Book: {serviceName}</h3>
        <button class="close-btn" on:click={close} aria-label="Close">✕</button>
      </header>

      <form class="modal-form" on:submit|preventDefault={submitForm}>
        <label>
          <span class="label">Your name</span>
          <input type="text" bind:value={customerName} placeholder="John Doe" required />
        </label>

        <label>
          <span class="label">Phone</span>
          <input type="tel" bind:value={phone} placeholder="+2547..." required />
        </label>

        <div class="row">
          <label class="col">
            <span class="label">Date</span>
            <input type="date" bind:value={date} required />
          </label>
          <label class="col">
            <span class="label">Time</span>
            <input type="time" bind:value={time} required />
          </label>
        </div>

        {#if message}
          <div class="message {message.type}">{message.text}</div>
        {/if}

        <div class="actions">
          <button type="button" class="btn secondary" on:click={close} disabled={loading}>Cancel</button>
          <button type="submit" class="btn primary" disabled={loading}>
            {#if loading}Saving…{:else}Confirm Booking{/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index: 9999;
    backdrop-filter: blur(4px);
    padding: 24px;
  }

  .modal {
    width: 420px;
    max-width: calc(100% - 48px);
    background: white;
    border-radius: 14px;
    box-shadow: 0 18px 40px rgba(0,0,0,0.3);
    padding: 18px;
    animation: zoomIn .22s cubic-bezier(.2,.9,.2,1);
    transform-origin: center;
  }

  @keyframes zoomIn {
    from { transform: scale(.7); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }

  .modal-header {
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom: 12px;
  }

  .modal-title { font-weight:700; font-size:1.05rem; }

  .close-btn {
    background:transparent; border:0; font-size:1.05rem; cursor:pointer;
  }

  .modal-form label { display:block; margin-bottom:10px; }
  .modal-form input {
    width:100%;
    padding:9px 10px;
    border-radius:8px;
    border:1px solid #e2e8f0;
    box-sizing: border-box;
  }

  .row { display:flex; gap:10px; }
  .col { flex:1; }

  .actions {
    display:flex;
    gap:10px;
    margin-top:14px;
  }

  .btn { padding:9px 12px; border-radius:8px; border:0; cursor:pointer; }
  .btn.primary { background:#111827; color:white; flex:1; }
  .btn.secondary { background:#f3f4f6; color:#111827; }

  .message { margin-top: 8px; padding:8px; border-radius:8px; font-size:0.95rem }
  .message.error { background:#fee2e2; color:#991b1b; }
  .message.success { background:#ecfdf5; color:#065f46; }
</style>
