<script lang="ts">
	import FullCalendar from 'fullcalendar-svelte';
    import type { FullCalendarOptions } from 'fullcalendar-svelte';

    // 1. Define component props using $props()
    let { 
        options, 
        calendarEvents,
        // 2. Declare calendarRef as a $bindable prop
        calendarRef = $bindable(null)
    } = $props<{
        options: FullCalendarOptions;
        calendarEvents: any[];
        calendarRef?: any; // Optional, as it might be null initially
    }>();
</script>

<FullCalendar
    {options}
    events={calendarEvents}
    bind:this={calendarRef} 
    class="calendar-container"
/>