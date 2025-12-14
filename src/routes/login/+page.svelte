<script lang="ts">
  import { login, currentUser } from '$lib/store';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import type { User } from '$lib/types';

  let email = '';
  let password = '';
  let accountType: 'user' | 'business_owner' = 'user';

  // Redirect if already logged in
  onMount(() => {
    const unsubscribe = currentUser.subscribe(user => {
      if (user) {
        goto('/');
      }
    });
    return unsubscribe;
  });

  function handleLogin() {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    // Mock login - create user based on account type
    const user: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0],
      role: accountType
    };

    login(user);
    
    // Redirect based on role
    if (accountType === 'business_owner') {
      goto('/dashboard');
    } else {
      goto('/');
    }
  }
</script>

<div class="min-h-[80vh] flex items-center justify-center p-4">
  <Card class="w-full max-w-md">
    <CardHeader>
      <CardTitle class="text-2xl text-center">Login to BookingApp</CardTitle>
    </CardHeader>
    <CardContent>
      <form on:submit|preventDefault={handleLogin} class="space-y-4">
        <div>
          <label for="email" class="block mb-2 font-medium">Email</label>
          <input
            id="email"
            type="email"
            bind:value={email}
            class="w-full border rounded-lg px-3 py-2"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label for="password" class="block mb-2 font-medium">Password</label>
          <input
            id="password"
            type="password"
            bind:value={password}
            class="w-full border rounded-lg px-3 py-2"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label class="block mb-2 font-medium">Account Type</label>
          <div class="space-y-2">
            <label class="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                bind:group={accountType}
                value="user"
                class="w-4 h-4"
              />
              <div>
                <div class="font-medium">Regular User</div>
                <div class="text-sm text-gray-600">Browse and book services</div>
              </div>
            </label>
            <label class="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                bind:group={accountType}
                value="business_owner"
                class="w-4 h-4"
              />
              <div>
                <div class="font-medium">Business Owner</div>
                <div class="text-sm text-gray-600">List and manage your business</div>
              </div>
            </label>
          </div>
        </div>

        <Button type="submit" class="w-full">Login</Button>
      </form>

      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <p class="text-sm text-blue-900 font-medium mb-2">Demo Mode</p>
        <p class="text-xs text-blue-700">
          Just enter any email and password to test the app. Choose "Business Owner" to list businesses.
        </p>
      </div>
    </CardContent>
  </Card>
</div>