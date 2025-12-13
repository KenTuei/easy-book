<script lang="ts">
  import FullCalendar from "svelte-fullcalendar";
  import dayGridPlugin from "@fullcalendar/daygrid";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import interactionPlugin from "@fullcalendar/interaction";
  import type { Booking } from "$lib/types";

  export let businessBookings: Booking[] = [];

  // Convert bookings to FullCalendar events
  $: events = businessBookings.map((b) => {
    const startISO = `${b.date}T${b.time}:00`;
    return {
      id: b.id,
      title: `${b.clientName}`, // Show client name
      start: startISO,
      allDay: false,
      extendedProps: {
        price: b.price || 0,
      },
    };
  });

  const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    height: "auto",
    events,
    eventDidMount: (info) => {
      // Add tooltip showing client and price
      info.el.setAttribute(
        "title",
        `${info.event.title} - KES ${info.event.extendedProps.price}`
      );
      info.el.classList.add("cursor-pointer", "hover:bg-gray-200");
    },
  };
</script>

<div class="border rounded-lg p-4 shadow">
  <FullCalendar {...calendarOptions} />
</div>
