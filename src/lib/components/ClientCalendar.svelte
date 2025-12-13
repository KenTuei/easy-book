<script lang="ts">
  import FullCalendar from "svelte-fullcalendar";
  import dayGridPlugin from "@fullcalendar/daygrid";
  import interactionPlugin from "@fullcalendar/interaction";
  import type { Booking } from "$lib/types";

  export let businessBookings: Booking[] = [];

  // Convert bookings to FullCalendar events
  $: events = businessBookings.map((b) => ({
    id: b.id,
    title: `${b.clientName} - ${b.time}`,
    start: `${b.date}T${b.time}:00`,
  }));
</script>

<div class="border rounded-lg p-4 shadow">
  <FullCalendar
    plugins={[dayGridPlugin, interactionPlugin]}
    initialView="dayGridMonth"
    events={events}
    height="auto"
  />
</div>
