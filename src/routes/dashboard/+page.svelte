<script lang="ts">
  import { businesses, appointments, currentUser, isBusinessOwner } from "$lib/store";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import type { Business, Appointment } from "$lib/types";
  import ClientCalendar from "$lib/components/ClientCalendar.svelte";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";

  // Protect route - redirect if not business owner
  onMount(() => {
    const unsubscribeUser = currentUser.subscribe(user => {
      if (!user) {
        alert('Please login to access the dashboard');
        goto('/login');
      }
    });

    const unsubscribeRole = isBusinessOwner.subscribe(isOwner => {
      if ($currentUser && !isOwner) {
        alert('Only business owners can access the dashboard');
        goto('/');
      }
    });

    return () => {
      unsubscribeUser();
      unsubscribeRole();
    };
  });

  // Selected business ID for dropdown
  let selectedBusinessId = "";

  // Current logged-in user
  $: loggedInUser = $currentUser?.id || "";

  // Filter businesses for the logged-in user
  $: userBusinesses = $businesses.filter(b => b.ownerId === loggedInUser);

  // Current business based on selection or default to first
  $: currentBusiness = userBusinesses.find(b => b.id === selectedBusinessId) || userBusinesses[0] || null;

  // Bookings for the current business (convert appointments to bookings format)
  $: businessBookings = currentBusiness
    ? $appointments
        .filter(a => a.businessId === currentBusiness.id)
        .map(a => ({
          id: a.id,
          businessId: a.businessId,
          clientName: a.customerName,
          date: a.startTime.split('T')[0],
          time: a.startTime.split('T')[1]?.substring(0, 5) || '00:00',
          price: currentBusiness.price
        }))
    : [];

  // Stats
  $: totalBookings = businessBookings.length;
  $: totalRevenue = businessBookings.reduce((sum, b) => sum + (b.price || 0), 0);
  $: upcomingBookings = businessBookings.filter(b => new Date(b.date) > new Date()).length;

  // Set default selection on mount
  $: if (userBusinesses.length > 0 && !selectedBusinessId) {
    selectedBusinessId = userBusinesses[0].id;
  }
</script>

<div class="max-w-7xl mx-auto p-6">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-2">Business Dashboard</h1>
    <p class="text-gray-600">Manage your bookings and business operations</p>
  </div>

  {#if !$currentUser}
    <Card class="max-w-md mx-auto">
      <CardContent class="pt-6 text-center">
        <p class="mb-4 text-gray-600">Please log in to access your dashboard</p>
        <Button href="/login" class="w-full">Log In</Button>
      </CardContent>
    </Card>
  {:else if userBusinesses.length === 0}
    <Card class="max-w-md mx-auto">
      <CardContent class="pt-6 text-center">
        <p class="mb-4 text-gray-600">You haven't registered any businesses yet</p>
        <Button href="/onboarding" class="w-full">Register Your Business</Button>
      </CardContent>
    </Card>
  {:else}
    <!-- Business Selector -->
    <div class="mb-6">
      <label for="business-select" class="block mb-2 font-medium text-lg">Select Business:</label>
      <select
        id="business-select"
        class="border rounded-lg px-4 py-3 w-full md:w-auto min-w-[300px] text-lg"
        bind:value={selectedBusinessId}
      >
        {#each userBusinesses as b}
          <option value={b.id}>{b.name} ({b.type})</option>
        {/each}
      </select>
    </div>

    {#if currentBusiness}
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle class="text-sm text-gray-600">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-4xl font-bold">{totalBookings}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-sm text-gray-600">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-4xl font-bold text-blue-600">{upcomingBookings}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-sm text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-4xl font-bold text-green-600">KES {totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <!-- Business Info -->
      <Card class="mb-8">
        <CardHeader>
          <CardTitle>{currentBusiness.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Type</p>
              <Badge>{currentBusiness.type}</Badge>
            </div>
            <div>
              <p class="text-sm text-gray-600">Location</p>
              <p class="font-medium">{currentBusiness.location}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Opening Hours</p>
              <p class="font-medium">{currentBusiness.openingHours.start} - {currentBusiness.openingHours.end}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Price per Session</p>
              <p class="font-medium">KES {currentBusiness.price}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Calendar -->
      <Card>
        <CardHeader>
          <CardTitle>Bookings Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientCalendar {businessBookings} />
        </CardContent>
      </Card>

      <!-- Bookings List -->
      {#if businessBookings.length > 0}
        <Card class="mt-8">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              {#each businessBookings.slice(0, 5) as booking}
                <div class="border rounded-lg p-4 hover:bg-gray-50 transition">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-semibold">{booking.clientName}</p>
                      <p class="text-sm text-gray-600">{booking.date} at {booking.time}</p>
                    </div>
                    <Badge>KES {booking.price || currentBusiness.price}</Badge>
                  </div>
                </div>
              {/each}
            </div>
          </CardContent>
        </Card>
      {:else}
        <Card class="mt-8">
          <CardContent class="pt-6 text-center">
            <p class="text-gray-500">No bookings yet for this business</p>
          </CardContent>
        </Card>
      {/if}
    {/if}
  {/if}
</div>