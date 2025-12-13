<script lang="ts">
  import { businesses, bookings, currentUser } from "$lib/store";
  import type { Business, Booking } from "$lib/types";
  import ClientCalendar from "$lib/components/ClientCalendar.svelte";

  // Selected business ID for dropdown
  let selectedBusinessId = "";

  // Current logged-in user
  $: loggedInUser = $currentUser;

  // Filter businesses for the logged-in user
  $: userBusinesses = $businesses.filter(b => b.ownerId === loggedInUser);

  // Current business based on selection or default to first
  $: currentBusiness = userBusinesses.find(b => b.id === selectedBusinessId) || userBusinesses[0] || null;

  // Bookings for the current business
  $: businessBookings = currentBusiness
    ? $bookings.filter(b => b.businessId === currentBusiness.id)
    : [];
</script>

<div class="max-w-6xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">Business Dashboard</h1>

  {#if !loggedInUser}
    <p>Please <a href="/login" class="text-blue-600 underline">log in</a> first.</p>
  {:else if userBusinesses.length === 0}
    <p>No businesses registered yet. Please onboard first.</p>
  {:else}
    <!-- Select business -->
    <div class="mb-6">
      <label class="block mb-2 font-medium">Select Business:</label>
      <select
        class="border rounded px-3 py-2"
        bind:value={selectedBusinessId}
      >
        {#each userBusinesses as b}
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
