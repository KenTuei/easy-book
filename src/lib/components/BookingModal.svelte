<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { addBooking } from "$lib/store";
  import type { Business } from "$lib/types";

  export let selectedBusiness: Business;

  const dispatch = createEventDispatcher();

  let clientName = "";
  let date = "";
  let time = "";

  function generateId() {
    return crypto.randomUUID();
  }

  function submitBooking() {
    if (!clientName || !date || !time) {
      alert("Please fill all fields");
      return;
    }

    addBooking({
      id: generateId(),
      businessId: selectedBusiness.id,
      clientName,
      date,
      time
    });

    dispatch("close");
  }

  function close() {
    dispatch("close");
  }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 w-full max-w-md">
    <h2 class="text-xl font-bold mb-4">Book {selectedBusiness.name}</h2>

    <form on:submit|preventDefault={submitBooking} class="space-y-4">
      <div>
        <label class="block mb-1 font-medium">Your Name</label>
        <input
          type="text"
          bind:value={clientName}
          class="w-full border rounded px-3 py-2"
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Date</label>
        <input
          type="date"
          bind:value={date}
          class="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Time</label>
        <input
          type="time"
          bind:value={time}
          class="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div class="flex justify-end gap-2">
        <button type="button" class="px-4 py-2 rounded border" on:click={close}>Cancel</button>
        <button type="submit" class="px-4 py-2 bg-black text-white rounded hover:opacity-90">
          Book
        </button>
      </div>
    </form>
  </div>
</div>
