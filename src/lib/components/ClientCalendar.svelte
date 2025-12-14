<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Calendar } from '@fullcalendar/core';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import type { Booking } from '$lib/types';

  export let businessBookings: Booking[] = [];

  let calendarEl: HTMLDivElement;
  let calendar: Calendar | null = null;

  // Convert bookings to FullCalendar events
  $: events = businessBookings.map((b) => {
    const startISO = `${b.date}T${b.time}:00`;
    return {
      id: b.id,
      title: b.clientName,
      start: startISO,
      allDay: false,
      extendedProps: {
        price: b.price || 0,
      },
    };
  });

  // Update events when they change
  $: if (calendar && events) {
    calendar.getEventSources().forEach(source => source.remove());
    calendar.addEventSource(events);
  }

  onMount(() => {
    calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      height: 'auto',
      events,
      eventDidMount(info) {
        info.el.setAttribute(
          'title',
          `${info.event.title} - KES ${info.event.extendedProps.price}`
        );
        info.el.classList.add('cursor-pointer');
      },
    });

    calendar.render();
  });

  onDestroy(() => {
    if (calendar) {
      calendar.destroy();
    }
  });
</script>

<div class="border rounded-lg p-4 shadow">
  <div bind:this={calendarEl}></div>
</div>