<script lang="ts">
  import { businesses } from "$lib/store";
  import type { Business } from "$lib/types";
  import ServiceCard from "$lib/components/ui/ServiceCard/ServiceCard.svelte";
  import BookingModal from "$lib/components/BookingModal.svelte";

  import { writable } from "svelte/store";

  let selectedBusiness: Business | null = null;
  let showModal = false;

  // Subscribe to businesses
  let businessList: Business[] = [];
  businesses.subscribe((b) => (businessList = b));

  // Open booking modal
  function openBooking(business: Business) {
    selectedBusiness = business;
    showModal = true;
  }

  // Close modal
  function closeModal() {
    showModal = false;
    selectedBusiness = null;
  }
</script>

<div class="max-w-5xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">Available Businesses</h1>

  {#if businessList.length === 0}
    <p>No businesses registered yet.</p>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each businessList as business (business.id)}
      <ServiceCard on:book={() => openBooking(business)} {business} />
    {/each}
  </div>
</div>

{#if showModal && selectedBusiness}
  <BookingModal
    open={showModal}
    businessId={selectedBusiness.id}
    businessName={selectedBusiness.name}
    on:close={closeModal}
  />
{/if}
