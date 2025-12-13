<script lang="ts">
	import { onMount } from 'svelte';
	import { appointments, services } from '$lib/store';
	import type { Appointment, Service } from '$lib/types';
    import { goto } from '$app/navigation'; // <-- ADDED: for cleaner navigation

	import dayGridPlugin from '@fullcalendar/daygrid';
	import timeGridPlugin from '@fullcalendar/timegrid';
	import interactionPlugin from '@fullcalendar/interaction';

	// Shadcn components imports (assuming $lib is configured correctly)
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from "$lib/components/ui/badge";

	let ClientCalendar: any;
	let calendarIsLoaded = false;

	let calendarEvents: any[] = [];
	let calendarRef: any;

	$: allServices = $services;
	$: allAppointments = $appointments;

	onMount(async () => {
		// FIX: Use named import for ClientCalendar (which uses named export { FullCalendar })
        // This assumes ClientCalendar.svelte exports the component as 'ClientCalendar' or 'FullCalendar'
		const module = await import('$lib/components/ClientCalendar.svelte');
		ClientCalendar = module.FullCalendar || module.default; // Fallback to default
		
		// If ClientCalendar is the component name inside the module, use that:
		// ClientCalendar = module.ClientCalendar || module.default; 
		
        calendarIsLoaded = true;
	});

	function mapAppointmentsToEvents(appts: Appointment[], svcs: Service[]) {
		return appts.map(appt => {
			const service = svcs.find(s => s.id === appt.serviceId);
			const serviceName = service ? service.name : 'Unknown Service';
            
            // Generate a color based on service name for visual distinction
            const colorMap: { [key: string]: string } = {
                "Beauty Salon": 'hsl(330 80% 80%)', // Pink/Red
                "Gym Session": 'hsl(120 40% 60%)',    // Green
                "Barber Shop": 'hsl(210 50% 70%)',    // Blue
                // Default color
                "Unknown Service": 'hsl(0 0% 90%)'
            };

			return {
				id: appt.id,
				title: `${serviceName} - ${appt.customerName}`,
				start: appt.startTime,
				end: appt.endTime,
				backgroundColor: colorMap[serviceName] || 'hsl(210 40% 98%)',
				borderColor: 'transparent',
				textColor: 'hsl(0 0% 10%)',
				extendedProps: {
					customerName: appt.customerName,
					notes: appt.notes
				}
			};
		});
	}

	$: calendarEvents = mapAppointmentsToEvents(allAppointments, allServices);

	const options = {
		plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
		initialView: 'timeGridWeek',
        
        // ✅ FIX: Capitalize button text
        buttonText: {
            today: 'TODAY',
            month: 'MONTH',
            week: 'WEEK',
            day: 'DAY'
        },
        
		headerToolbar: {
			left: 'prev,next today', // TODAY will use capitalized buttonText
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay' // Views will use capitalized buttonText
		},
		slotLabelFormat: {
			hour: 'numeric',
			minute: '2-digit',
			meridiem: 'short'
		},
		dateClick: (info: any) => {
            // Calendar time slot click
			goto(`/appointments/new?date=${info.dateStr}`);
		},
		eventClick: (info: any) => {
			alert(`Appointment Details:\nCustomer: ${info.event.extendedProps.customerName}\nService: ${info.event.title}\nTime: ${info.event.start.toLocaleTimeString()}`);
		},
		editable: true,
		selectable: true,
		height: 'auto'
	};

	// PREMIUM SERVICE LIST
    // NOTE: ADDED 'id' property to match the service store/types for booking
	const premiumServices = [
		{
            id: 'svc-barber', // Unique ID for booking
			name: "Barber Shop",
			category: "Grooming",
			img: "/images/kin.jpg",
			description: "Clean fades, beard trims & modern haircuts.",
		},
		{
            id: 'svc-salon', // Unique ID for booking
			name: "Beauty Salon",
			category: "Beauty",
			img: "/images/salon.jpg",
			description: "Hair styling, makeup, skincare and more.",
		},
		{
            id: 'svc-gym', // Unique ID for booking
			name: "Gym Session",
			category: "Fitness",
			img: "/images/gym.jpg",
			description: "Personal training & guided workout sessions.",
		},
		{
            id: 'svc-therapy', // Unique ID for booking
			name: "Therapy Session",
			category: "Health",
			img: "/images/pretty.jpg",
			description: "Professional counselling & mental wellness.",
		},
		{
            id: 'svc-massage', // Unique ID for booking
			name: "Massage",
			category: "Wellness",
			img: "/images/spa.jpg",
			description: "Deep tissue, relaxation & hot stone massage.",
		},
		{
            id: 'svc-photo', // Unique ID for booking
			name: "Photography",
			category: "Media",
			img: "/images/spa1.jpg",
			description: "Studio & outdoor professional photography.",
		}
	];

    /**
     * Handles the click on the 'Book Now' button in the service card.
     * Passes the service ID and a default date/time for pre-selection.
     */
    function selectAndBookService(serviceId: string) {
        // Set a default date and time (e.g., today at the next whole hour)
        const defaultDate = new Date();
        defaultDate.setHours(defaultDate.getHours() + 1, 0, 0, 0); 
        
        const urlDateParam = defaultDate.toISOString(); 
        
        // Navigate to the booking form, passing Service ID and the default date/time
        goto(`/appointments/new?serviceId=${serviceId}&date=${urlDateParam}`);
    }
</script>

<div class="p-4 md:p-8 space-y-10 max-w-7xl mx-auto">

	<div class="flex justify-between items-center">
		<h1 class="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
			📅 Scheduler Dashboard
		</h1>

		<Button class="px-6 py-2 text-lg" href="/appointments/new">
			+ BOOK APPOINTMENT
		</Button>
	</div>

	<Card class="shadow-2xl border rounded-2xl">
		<CardHeader>
			<CardTitle class="text-xl font-semibold">Your Schedule</CardTitle>
		</CardHeader>

		<CardContent>
			{#if calendarIsLoaded}
                <svelte:component 
					this={ClientCalendar}
					{options}
					{calendarEvents}
					bind:calendarRef
                    class="h-[350px] overflow-y-auto"
				/>
			{:else}
				<div class="h-96 flex items-center justify-center text-muted-foreground">
					Loading Calendar...
				</div>
			{/if}
		</CardContent>
	</Card>

	<div>
		<h2 class="text-3xl font-bold mb-4">Premium Services</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each premiumServices as service}
				<Card class="overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer">
					
					<img 
						src={service.img} 
						alt={service.name} 
						class="h-52 w-full object-cover"
					/>

					<CardHeader>
						<div class="flex justify-between items-center">
							<CardTitle>{service.name}</CardTitle>
							<Badge>{service.category}</Badge>
						</div>
					</CardHeader>

					<CardContent class="text-gray-600">
						<p>{service.description}</p>

						<Button 
							class="mt-4 w-full"
							on:click={() => selectAndBookService(service.id)} >
							BOOK NOW
						</Button>
					</CardContent>

				</Card>
			{/each}
		</div>
	</div>

</div>

<style global>
	.fc-event {
		border-radius: 0.375rem;
		padding: 2px 4px;
		font-size: 0.875rem;
	}
	.fc-daygrid-event {
		white-space: normal;
	}
	/* Added style to ensure time slots don't take up excessive height if needed */
	.fc-timegrid-slot {
		height: 2em;
	}
    /* Ensure the main FullCalendar container is set to auto height (if using height: 'auto' option) */
    .fc {
        height: auto;
    }
</style>