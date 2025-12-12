<script lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import { appointments, services } from '$lib/store';
  import { checkConflict } from '$lib/utils/conflictChecker';
  import type { Appointment, Service } from '$lib/types';
  import { format, parseISO, setHours, setMinutes, getHours, getMinutes } from 'date-fns';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  // Shadcn components
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select';
  import { Calendar } from '$lib/components/ui/calendar';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Separator } from '$lib/components/ui/separator';

  // State
  let selectedServiceId: string = '';
  let selectedDate: Date = new Date(); // Date picker
  let startTimeHour: number = 9; // Default start hour
  let startTimeMinute: number = 0; // Default start minute

  let customerName: string = '';
  let notes: string = '';
  let conflictMessage: string = '';

  // Get date from URL query parameter (if clicked from the calendar)
  $: {
    const dateQuery = $page.url.searchParams.get('date');
    if (dateQuery) {
      selectedDate = parseISO(dateQuery);
      // Pre-set time to a reasonable default, like 9:00 AM
      selectedDate = setHours(selectedDate, 9);
      selectedDate = setMinutes(selectedDate, 0);
      startTimeHour = 9;
      startTimeMinute = 0;
    }
  }

  // Reactive variables
  $: selectedService = $services.find(s => s.id === selectedServiceId);
  
  // Calculate the end time of the appointment, including duration
  $: appointmentEndTime = selectedService && selectedDate
    ? format(
        setMinutes(
          setHours(selectedDate, startTimeHour),
          startTimeMinute + selectedService.durationMinutes
        ),
        "yyyy-MM-dd'T'HH:mm:ss"
      )
    : null;

  /**
   * Main function to handle the booking submission.
   */
  function handleBooking() {
    conflictMessage = ''; // Clear previous messages

    if (!selectedService || !customerName || !selectedDate) {
      conflictMessage = "Please select a service, date, and customer name.";
      return;
    }

    // 1. Combine Date and Time into a single StartTime Date object
    let finalStartDate = setMinutes(selectedDate, startTimeMinute);
    finalStartDate = setHours(finalStartDate, startTimeHour);

    const startTimeISO = format(finalStartDate, "yyyy-MM-dd'T'HH:mm:ss");

    if (!appointmentEndTime) {
        // This should not happen if selectedService is defined, but as a safeguard
        conflictMessage = "Could not calculate end time. Please check the service duration.";
        return;
    }

    // 2. Create the Prospective Appointment object
    const prospectiveAppointment: Appointment = {
      id: uuidv4(), // Give it a temporary ID for conflict check exclusion (not needed here)
      serviceId: selectedService.id,
      customerName: customerName,
      startTime: startTimeISO,
      endTime: appointmentEndTime + 'Z', // Convert to ISO string and assume Z (UTC/local)
      notes: notes,
    };

    // 3. Run the Conflict Check
    const isConflict = checkConflict(
      prospectiveAppointment,
      $appointments,
      selectedService
    );

    if (isConflict) {
      conflictMessage = "❌ Booking conflict detected! This time slot is already reserved (including buffer time).";
      return;
    }

    // 4. Save the Appointment
    appointments.update(a => [...a, prospectiveAppointment]);
    
    // 5. Success and Navigation
    alert(`Appointment successfully booked for ${customerName} (${selectedService.name})!`);
    goto('/');
  }

  // Helper arrays for time selection (0 to 23 hours, 00 and 30 minutes)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 30];

</script>

<div class="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
  <h1 class="text-3xl font-bold">📝 Book New Appointment</h1>
  <Card class="shadow-xl">
    <CardHeader>
      <CardTitle>Schedule a Service</CardTitle>
      <CardDescription>Select a service, date, and time. Conflicts will be automatically checked.</CardDescription>
    </CardHeader>
    <CardContent>
      <form on:submit|preventDefault={handleBooking} class="space-y-6">

        <div class="space-y-2">
          <Label for="service">Select Service</Label>
          <Select bind:value={selectedServiceId}>
            <SelectTrigger id="service">
              <SelectValue placeholder="Choose a Service..." />
            </SelectTrigger>
            <SelectContent>
              {#if $services.length === 0}
                <SelectItem value="" disabled>No services defined. Please go to /services first.</SelectItem>
              {:else}
                {#each $services as service}
                  <SelectItem value={service.id}>
                    {service.name} ({service.durationMinutes} min + {service.bufferMinutes} min buffer, ${service.price})
                  </SelectItem>
                {/each}
              {/if}
            </SelectContent>
          </Select>
        </div>
        
        <Separator />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <Label>Select Date</Label>
                <div class="flex justify-center">
                    <Calendar bind:date={selectedDate} mode="single" class="rounded-md border shadow" />
                </div>
            </div>

            <div class="space-y-4">
                <Label>Select Time</Label>
                <div class="flex space-x-4">
                    <div class="space-y-2 flex-1">
                        <Label for="hour">Hour</Label>
                        <Select bind:value={startTimeHour}>
                            <SelectTrigger id="hour">
                                <SelectValue placeholder="HH" />
                            </SelectTrigger>
                            <SelectContent>
                                {#each hours as hour}
                                    <SelectItem value={hour}>
                                        {format(setHours(new Date(), hour), 'HH')}
                                    </SelectItem>
                                {/each}
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="space-y-2 flex-1">
                        <Label for="minute">Minute</Label>
                        <Select bind:value={startTimeMinute}>
                            <SelectTrigger id="minute">
                                <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                                {#each minutes as minute}
                                    <SelectItem value={minute}>
                                        {format(setMinutes(new Date(), minute), 'mm')}
                                    </SelectItem>
                                {/each}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {#if selectedService}
                    <div class="pt-4 text-sm text-muted-foreground">
                        <p>Total time blocked:</p>
                        <p class="font-medium">{selectedService.durationMinutes} min (Service) + {selectedService.bufferMinutes} min (Buffer)</p>
                    </div>
                {/if}
            </div>
        </div>

        <Separator />

        <div class="space-y-2">
          <Label for="customerName">Customer Name</Label>
          <Input id="customerName" required bind:value={customerName} placeholder="John Doe" />
        </div>

        <div class="space-y-2">
          <Label for="notes">Notes (Optional)</Label>
          <Textarea id="notes" bind:value={notes} placeholder="Allergies, specific requests, etc." />
        </div>

        {#if conflictMessage}
          <div class="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
            {conflictMessage}
          </div>
        {/if}

        <Button type="submit" class="w-full">Confirm Booking</Button>
      </form>
    </CardContent>
  </Card>
</div>