<script lang="ts">
  import { businesses, bookings } from "$lib/store";
  import type { Business, Booking } from "$lib/types";
  import ClientCalendar from "$lib/components/ClientCalendar.svelte";

  import { derived } from "svelte/store";

  // Reactive selected business ID
  let selectedBusinessId = "";

  // Automatically update current business based on selection
  $: currentBusiness = $businesses.find(b => b.id === selectedBusinessId) || $businesses[0] || null;

  // Automatically update bookings for the current business
  $: businessBookings = currentBusiness
    ? $bookings.filter(b => b.businessId === currentBusiness.id)
    : [];
</script>

<div class="max-w-6xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">Business Dashboard</h1>

  {#if $businesses.length === 0}
    <p>No businesses registered yet. Please onboard first.</p>
  {:else}
    <!-- Select current business -->
    <div class="mb-6">
      <label class="block mb-2 font-medium">Select Business:</label>
      <select
        class="border rounded px-3 py-2"
        bind:value={selectedBusinessId}
      >
        {#each $businesses as b}
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
