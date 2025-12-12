<script lang="ts">
	import { FullCalendar } from 'fullcalendar-svelte'; 
    import type { FullCalendarOptions } from 'fullcalendar-svelte';

    let { 
        options, 
        calendarEvents,
        calendarRef = null 
    } = $props<{
        options: FullCalendarOptions;
        calendarEvents: any[];
        calendarRef: any; 
    }>();
</script>

<FullCalendar
    {options}
    events={calendarEvents}
    bind:this={calendarRef} 
    
    class="h-[350px] overflow-y-auto"
/>