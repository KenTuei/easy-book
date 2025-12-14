<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<!-- Navigation Bar -->
	<nav class="bg-white border-b shadow-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<a href="/" class="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
					📅 BookingApp
				</a>
				
				<div class="flex items-center gap-4">
					<a href="/" class="text-gray-700 hover:text-purple-600 transition-colors">Home</a>
					<a href="/services" class="text-gray-700 hover:text-purple-600 transition-colors">Services</a>
					<a href="/businesses" class="text-gray-700 hover:text-purple-600 transition-colors">Businesses</a>
					<a href="/dashboard" class="text-gray-700 hover:text-purple-600 transition-colors">Dashboard</a>
					<Button href="/login" variant="outline" size="sm">Login</Button>
					<Button href="/onboarding" size="sm">List Your Business</Button>
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="flex-1">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="bg-gray-50 border-t py-6 mt-auto">
		<div class="max-w-7xl mx-auto px-4 text-center text-gray-600">
			<p>&copy; 2025 BookingApp. All rights reserved.</p>
		</div>
	</footer>
</div>