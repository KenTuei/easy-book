<script lang="ts">
  import type { Business } from "$lib/types";
  import { createEventDispatcher } from "svelte";

  export let business: Business;

  const dispatch = createEventDispatcher();

  function book() {
    dispatch("book");
  }
</script>

<div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
  <h2 class="text-xl font-semibold mb-2">{business.name}</h2>
  <p class="text-sm text-gray-600 mb-1">Type: {business.type}</p>
  <p class="text-sm text-gray-600 mb-1">Location: {business.location}</p>
  <p class="text-sm text-gray-600 mb-1">
    Hours: {business.openingHours.start} - {business.openingHours.end}
  </p>
  <p class="text-sm text-gray-600 mb-3">Price: KES {business.price}</p>

  <button
    class="bg-black text-white px-4 py-2 rounded hover:opacity-90"
    on:click={book}
  >
    Book
  </button>
</div>
