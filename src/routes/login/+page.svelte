<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  import { currentUser } from "$lib/store";
  import { goto } from "$app/navigation";
  import { writable } from "svelte/store";

  let username = "";
  let error = "";

  function login() {
    if (!username.trim()) {
      error = "Please enter a username.";
      return;
    }

    // Fake signup/login
    currentUser.set(username.trim());

    // Redirect to dashboard
    goto("/dashboard");
  }
</script>

<div class="max-w-md mx-auto mt-20 p-6 border rounded shadow">
  <h1 class="text-2xl font-bold mb-4">Login / Sign Up</h1>

  {#if error}
    <div class="mb-4 text-red-600">{error}</div>
  {/if}

  <input
    type="text"
    placeholder="Enter your username"
    bind:value={username}
    class="w-full border rounded px-3 py-2 mb-4"
  />

  <button
    class="w-full bg-black text-white py-2 rounded hover:opacity-90"
    on:click={login}
  >
    Continue
  </button>
</div>
