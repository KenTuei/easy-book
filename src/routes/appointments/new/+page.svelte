<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Calendar } from '@fullcalendar/core';
  import dayGridPlugin from "@fullcalendar/daygrid";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import interactionPlugin from "@fullcalendar/interaction";

  // Reactive variables for modal
  let showModal = false;
  let selectedEvent: any | null = null; 
  let calendarEl: HTMLDivElement;
  let calendar: Calendar | null = null;

  // Sample events 
  let events = [
    { 
      id: '1', 
      title: "Haircut", 
      start: "2025-12-15T10:00:00", 
      end: "2025-12-15T11:00:00", 
      allDay: false 
    },
    { 
      id: '2', 
      title: "Makeup Session", 
      start: "2025-12-16T14:00:00", 
      end: "2025-12-16T15:30:00", 
      allDay: false 
    }
  ];

  // Handle clicks on events
  function handleEventClick(info: any) {
    selectedEvent = info.event;
    showModal = true;
  }

  // Handle date click
  function handleDateClick(info: any) {
    console.log(`Date clicked: ${info.dateStr}`);
    alert(`Date clicked: ${info.dateStr}. You could open a new booking form here.`);
  }

  function bookNow() {
    alert(`Booking "${selectedEvent?.title}" successfully!`);
    showModal = false;
  }

  // Handle keyboard events for modal backdrop
  function handleBackdropKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showModal = false;
    }
  }

  onMount(() => {
    calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      editable: true,
      selectable: true,
      events,
      eventClick: handleEventClick,
      dateClick: handleDateClick,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      buttonText: {
        today: 'TODAY',
        month: 'MONTH',
        week: 'WEEK',
        day: 'DAY'
      },
      height: 'auto'
    });

    calendar.render();
  });

  onDestroy(() => {
    if (calendar) {
      calendar.destroy();
    }
  });
</script>

<div class="calendar-container">
  <div bind:this={calendarEl}></div>
</div>

{#if showModal && selectedEvent}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="modal-backdrop"
    on:click={() => showModal = false}
    on:keydown={handleBackdropKeydown}
    role="button"
    tabindex="0"
  >
    <div class="modal" on:click|stopPropagation role="dialog" aria-modal="true">
      <h2>{selectedEvent.title}</h2>
      <p>
        <strong>Start:</strong> {selectedEvent.start.toLocaleString()}
      </p>
      <p>
        <strong>End:</strong> {selectedEvent.end?.toLocaleString() || 'N/A'}
      </p>
      
      <button on:click={bookNow}>Book Now</button>
      <button class="modal-cancel" on:click={() => showModal = false}>Cancel</button>
    </div>
  </div>
{/if}

<style>
  /* Zoom effect on event cards */
  :global(.fc-event) {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    border: none !important; 
  }
  
  :global(.fc-event:hover) {
    transform: scale(1.05);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }

  :global(.fc-daygrid-event) {
    border-radius: 4px;
  }

  :global(.fc-timegrid-slot) {
    height: 3em;
  }

  :global(.fc) {
    font-family: inherit;
  }

  /* Calendar container */
  .calendar-container {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Modal styles */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }

  .modal h2 {
    margin-top: 0;
    color: #1f2937;
  }

  .modal p {
    margin: 0.5rem 0;
    color: #4b5563;
  }

  .modal button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    background-color: #4f46e5;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
  }

  .modal button:hover {
    background-color: #4338ca;
  }

  .modal-cancel {
    margin-left: 0.5rem;
    background: #e5e7eb;
    color: #111;
  }

  .modal-cancel:hover {
    background: #d1d5db;
  }
</style>