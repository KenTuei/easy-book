<script lang="ts">
  import { onMount } from "svelte";
  import { businesses, bookings } from "$lib/store";
  import type { Business, Booking } from "$lib/types";
  import ClientCalendar from "$lib/components/ClientCalendar.svelte";

  import { writable } from "svelte/store";

  // For this simple example, assume the first business is the "logged-in business"
  let businessList: Business[] = [];
  let currentBusiness: Business | null = null;
  let businessBookings: Booking[] = [];

  businesses.subscribe((b) => {
    businessList = b;
    if (!currentBusiness && b.length > 0) currentBusiness = b[0];
  });

  bookings.subscribe((all) => {
    if (currentBusiness) {
      businessBookings = all.filter(
        (booking) => booking.businessId === currentBusiness.id
      );
    }
  });

  // Optional: allow switching between multiple businesses (if logged-in owner has more)
  let selectedBusinessId = currentBusiness?.id || "";

  function changeBusiness(event: Event) {
    const target = event.target as HTMLSelectElement;
    selectedBusinessId = target.value;
    currentBusiness = businessList.find((b) => b.id === selectedBusinessId) || null;

    if (currentBusiness) {
      businessBookings = $bookings.filter(
        (b) => b.businessId === currentBusiness!.id
      );
    }
  }
</script>

<div class="max-w-6xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">Business Dashboard</h1>

  {#if businessList.length === 0}
    <p>No businesses registered yet. Please onboard first.</p>
  {:else}
    <!-- Select current business -->
    <div class="mb-6">
      <label class="block mb-2 font-medium">Select Business:</label>
      <select
        class="border rounded px-3 py-2"
        bind:value={selectedBusinessId}
        on:change={changeBusiness}
      >
        {#each businessList as b}
          <option value={b.id}>{b.name} ({b.type})</option>
        {/each}
      </select>
    </div>

    <!-- Calendar -->
    {#if currentBusiness}
      <h2 class="text-xl font-semibold mb-4">
        Bookings for {currentBusiness.name}
      </h2>
      <ClientCalendar {businessBookings} />
    {/if}
  {/if}
</div>
