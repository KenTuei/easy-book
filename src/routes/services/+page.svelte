<script lang="ts">
  import ServiceCard from '$lib/components/ServiceCard/ServiceCard.svelte';
  import BookingModal from '$lib/components/BookingModal.svelte';
  import { onMount } from 'svelte';
  import type { Booking } from '$lib/utils/conflictChecker';

  // your services — replace /wire up to whatever data source you use
  const services = [
    { id: 'svc-barber', name: 'Barber Shop', description: 'Clean fades, beard trims & modern haircuts.', category: 'Grooming', img: '/barber.jpg' },
    { id: 'svc-salon',  name: 'Beauty Salon', description: 'Hair styling, makeup, skincare & more.', category: 'Beauty', img: '/salon.jpg' },
    { id: 'svc-gym',    name: 'Gym Session', description: 'Personal training & guided workouts.', category: 'Fitness', img: '/gym.jpg' }
  ];

  let modalOpen = false;
  let selectedServiceId = '';
  let selectedServiceName = '';
  let initialDateISO: string | null = null;
  let bookings: Booking[] = [];

  function loadBookings() {
    try {
      const raw = localStorage.getItem('bookings');
      bookings = raw ? (JSON.parse(raw) as Booking[]) : [];
    } catch (e) {
      bookings = [];
    }
  }

  onMount(loadBookings);

  // handler from ServiceCard
  function onBook(payload: { id: string; name: string; defaultDateISO?: string }) {
    selectedServiceId = payload.id;
    selectedServiceName = payload.name;
    initialDateISO = payload.defaultDateISO ?? null;
    modalOpen = true;
  }

  // handle events from BookingModal
  function onModalBooked(e: CustomEvent) {
    // booking created — refresh local list
    loadBookings();
    modalOpen = false;
    // small notification — you can replace with nicer toast
    window.setTimeout(() => alert('Booking successful!'), 100);
  }
</script>

<div class="container mx-auto px-6 py-8">
  <h2 class="text-2xl font-semibold mb-6">Services</h2>

  <div class="grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px,1fr)); gap:24px;">
    {#each services as svc}
      <ServiceCard
        id={svc.id}
        name={svc.name}
        description={svc.description}
        category={svc.category}
        img={svc.img}
        onBook={onBook}
      />
    {/each}
  </div>

  <BookingModal
    open={modalOpen}
    serviceId={selectedServiceId}
    serviceName={selectedServiceName}
    initialDateISO={initialDateISO}
    redirectAfterBooking={false}
    on:close={() => modalOpen = false}
    on:booked={onModalBooked}
  />

  <section class="mt-8">
    <h3 class="text-lg font-medium mb-2">Your Bookings (localStorage)</h3>
    {#if bookings.length === 0}
      <p class="text-sm text-gray-500">No bookings yet.</p>
    {:else}
      <ul class="space-y-2">
        {#each bookings as b}
          <li class="p-3 rounded-md border">
            <strong>{b.serviceName}</strong>
            <div class="text-sm text-gray-600">{new Date(b.fullDateISO).toLocaleString()}</div>
            <div class="text-sm">{b.customerName} — {b.phone}</div>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</div>
