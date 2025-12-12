<script lang="ts">
  import { onMount } from 'svelte';
  import { appointments, services } from '$lib/store';
  import type { Appointment, Service } from '$lib/types';

  // Import shadcn components
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import FullCalendar from 'fullcalendar-svelte';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import interactionPlugin from '@fullcalendar/interaction';

  // State
  let calendarEvents: any[] = [];
  let calendarRef: FullCalendar;
  
  // Combine appointments and services for display logic
  $: allServices = $services;
  $: allAppointments = $appointments;

  /**
   * Transforms the raw appointment data into a format FullCalendar understands.
   * @param appts The list of appointments.
   * @param svcs The list of services.
   * @returns An array of FullCalendar events.
   */
  function mapAppointmentsToEvents(appts: Appointment[], svcs: Service[]) {
    return appts.map(appt => {
      const service = svcs.find(s => s.id === appt.serviceId);
      const serviceName = service ? service.name : 'Unknown Service';

      return {
        id: appt.id,
        title: `${serviceName} - ${appt.customerName}`,
        start: appt.startTime, // ISO string is understood by FullCalendar
        end: appt.endTime,     // ISO string
        // Optional: Style the event
        backgroundColor: service ? 'hsl(210 40% 98%)' : 'hsl(0 0% 90%)', 
        borderColor: service ? 'hsl(210 40% 98%)' : 'hsl(0 0% 90%)',
        textColor: 'hsl(210 40% 2%)', 
        extendedProps: {
          customerName: appt.customerName,
          notes: appt.notes
        }
      };
    });
  }

  // Reactive block to update events whenever stores change
  $: calendarEvents = mapAppointmentsToEvents(allAppointments, allServices);

  // FullCalendar Configuration
  const options = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek', // Start with a weekly time view
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    // Customize slot label text (e.g., show time slots)
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      meridiem: 'short'
    },
    // When a date/time slot is clicked
    dateClick: (info: any) => {
      // Navigate to the new appointment page with the clicked date pre-filled
      window.location.href = `/appointments/new?date=${info.dateStr}`;
    },
    // When an event is clicked
    eventClick: (info: any) => {
      // Simple alert for MVP; later navigate to edit page
      alert(`Appointment Details:\nCustomer: ${info.event.extendedProps.customerName}\nService: ${info.event.title}\nTime: ${info.event.start.toLocaleTimeString()}`);
    },
    editable: true, // Allows drag-and-drop editing (requires robust backend/store logic later)
    selectable: true,
    height: 'auto'
  };
</script>

<div class="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
  <div class="flex justify-between items-center">
    <h1 class="text-3xl font-bold">📅 Scheduler Dashboard</h1>
    <Button href="/appointments/new">Book New Appointment</Button>
  </div>
  
  <Card class="shadow-xl">
    <CardHeader>
      <CardTitle>Schedule View</CardTitle>
    </CardHeader>
    <CardContent>
      <FullCalendar
        {options}
        events={calendarEvents}
        bind:this={calendarRef}
        class="calendar-container"
      />
    </CardContent>
  </Card>

</div>

<style global>
  /* Basic styling adjustments for FullCalendar inside shadcn card */
  .fc-event {
    /* Use Tailwind/Shadcn border radius */
    border-radius: 0.375rem; 
    padding: 2px 4px;
    font-size: 0.875rem; /* text-sm */
  }
  .fc-daygrid-event {
    white-space: normal;
  }
  /* Optional: Make the time slots look cleaner */
  .fc-timegrid-slot {
      height: 2em; /* Adjust slot height */
  }
</style>