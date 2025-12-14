<script lang="ts">
  import { businesses } from "$lib/store";
  import type { Business } from "$lib/types";
  import ServiceCard from "$lib/components/ui/ServiceCard/ServiceCard.svelte";
  import BookingModal from "$lib/components/BookingModal.svelte";
  import { Button } from "$lib/components/ui/button";

  let selectedBusiness: Business | null = null;
  let showModal = false;

  // Subscribe to businesses from store
  let businessList: Business[] = [];
  businesses.subscribe((b) => (businessList = b));

  // Add some sample businesses if store is empty (for demo purposes)
  const sampleBusinesses: Business[] = [
    {
      id: "biz-1",
      name: "Elite Barbers",
      type: "Barber Shop",
      location: "Westlands, Nairobi",
      price: 500,
      openingHours: { start: "09:00", end: "19:00" }
    },
    {
      id: "biz-2",
      name: "Glam Beauty Salon",
      type: "Beauty Salon",
      location: "Kilimani, Nairobi",
      price: 1500,
      openingHours: { start: "08:00", end: "20:00" }
    },
    {
      id: "biz-3",
      name: "FitZone Gym",
      type: "Gym",
      location: "Parklands, Nairobi",
      price: 2000,
      openingHours: { start: "06:00", end: "22:00" }
    },
    {
      id: "biz-4",
      name: "Zen Spa & Wellness",
      type: "Spa",
      location: "Karen, Nairobi",
      price: 2500,
      openingHours: { start: "10:00", end: "20:00" }
    },
    {
      id: "biz-5",
      name: "SnapShot Studio",
      type: "Photography Studio",
      location: "Lavington, Nairobi",
      price: 4000,
      openingHours: { start: "09:00", end: "18:00" }
    },
    {
      id: "biz-6",
      name: "Wellness Therapy Center",
      type: "Therapy Center",
      location: "Runda, Nairobi",
      price: 3000,
      openingHours: { start: "08:00", end: "17:00" }
    }
  ];

  // Combine store businesses with sample ones
  $: allBusinesses = businessList.length > 0 ? businessList : sampleBusinesses;

  // Open booking modal
  function openBooking(event: CustomEvent) {
    const { businessId, businessName, openingHours, price } = event.detail;
    selectedBusiness = allBusinesses.find(b => b.id === businessId) || null;
    showModal = true;
  }

  // Close modal
  function closeModal() {
    showModal = false;
    selectedBusiness = null;
  }
</script>

<div class="max-w-7xl mx-auto p-6">
  <div class="mb-8 flex justify-between items-center">
    <div>
      <h1 class="text-4xl font-bold mb-2">All Businesses</h1>
      <p class="text-gray-600">Discover local businesses and service providers in Nairobi</p>
    </div>
    <Button href="/onboarding" size="lg" class="bg-gradient-to-r from-purple-500 to-blue-500">
      + List Your Business
    </Button>
  </div>

  {#if allBusinesses.length === 0}
    <div class="text-center py-12">
      <p class="text-gray-500 text-lg mb-4">No businesses registered yet.</p>
      <Button href="/onboarding">Be the first to list your business!</Button>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each allBusinesses as business (business.id)}
        <ServiceCard on:book={openBooking} {business} />
      {/each}
    </div>
  {/if}
</div>

{#if showModal && selectedBusiness}
  <BookingModal
    {selectedBusiness}
    on:close={closeModal}
  />
{/if}