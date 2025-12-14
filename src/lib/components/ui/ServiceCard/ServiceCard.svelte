<script lang="ts">
  import type { Business } from "$lib/types";
  import { createEventDispatcher } from "svelte";
  import { Badge } from "$lib/components/ui/badge";

  export let business: Business;

  const dispatch = createEventDispatcher();

  function book() {
    dispatch("book", {
      businessId: business.id,
      businessName: business.name,
      openingHours: business.openingHours,
      price: business.price
    });
  }
</script>

<div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
  <h2 class="text-xl font-semibold mb-2">{business.name}</h2>
  <div class="flex items-center gap-2 mb-2">
    <Badge>{business.type}</Badge>
    <p class="text-sm text-gray-600 mb-0">KES {business.price}</p>
  </div>
  <p class="text-sm text-gray-600 mb-1">Location: {business.location}</p>
  <p class="text-sm text-gray-600 mb-1">
    Hours: {business.openingHours.start} - {business.openingHours.end}
  </p>

  <button
    class="bg-black text-white px-4 py-2 rounded hover:opacity-90 mt-3"
    on:click={book}
  >
    Book
  </button>
</div>