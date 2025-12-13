<script lang="ts">
  import { addBusiness, currentUser } from "$lib/store";
  import { BUSINESS_TYPES, type BusinessType } from "$lib/types";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";

  // Simple ID generator (no extra deps)
  function generateId() {
    return crypto.randomUUID();
  }

  let name = "";
  let type: BusinessType = "salon";
  let location = "";
  let openingStart = "08:00";
  let openingEnd = "18:00";
  let price = 1000;

  function submit() {
    const loggedInUser = get(currentUser);
    if (!loggedInUser) {
      alert("You must be logged in to create a business");
      return;
    }

    if (!name || !location) {
      alert("Please fill all required fields");
      return;
    }

    addBusiness({
      id: generateId(),
      name,
      type,
      location,
      openingHours: {
        start: openingStart,
        end: openingEnd
      },
      price,
      ownerId: loggedInUser // <-- attach ownerId
    });

    // Redirect to dashboard after creation
    goto("/dashboard");
  }
</script>

<div class="max-w-2xl mx-auto p-6">
  <h1 class="text-2xl font-bold mb-6">Create Your Business</h1>

  <form class="space-y-5" on:submit|preventDefault={submit}>
    <!-- Business Name -->
    <div>
      <label class="block text-sm font-medium mb-1">Business Name</label>
      <input
        type="text"
        class="w-full border rounded px-3 py-2"
        bind:value={name}
        placeholder="e.g. Glow Salon"
        required
      />
    </div>

    <!-- Business Type -->
    <div>
      <label class="block text-sm font-medium mb-1">Business Type</label>
      <select class="w-full border rounded px-3 py-2" bind:value={type}>
        {#each BUSINESS_TYPES as bt}
          <option value={bt.value}>{bt.label}</option>
        {/each}
      </select>
    </div>

    <!-- Location -->
    <div>
      <label class="block text-sm font-medium mb-1">Location</label>
      <input
        type="text"
        class="w-full border rounded px-3 py-2"
        bind:value={location}
        placeholder="Nairobi, Westlands"
        required
      />
    </div>

    <!-- Opening Hours -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-1">Opening Time</label>
        <input
          type="time"
          class="w-full border rounded px-3 py-2"
          bind:value={openingStart}
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Closing Time</label>
        <input
          type="time"
          class="w-full border rounded px-3 py-2"
          bind:value={openingEnd}
        />
      </div>
    </div>

    <!-- Price -->
    <div>
      <label class="block text-sm font-medium mb-1">Base Price (KES)</label>
      <input
        type="number"
        min="0"
        class="w-full border rounded px-3 py-2"
        bind:value={price}
      />
    </div>

    <!-- Submit -->
    <button
      type="submit"
      class="w-full bg-black text-white py-2 rounded hover:opacity-90"
    >
      Create Business
    </button>
  </form>
</div>
