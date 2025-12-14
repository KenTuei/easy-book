<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { currentUser, isBusinessOwner, logout } from '$lib/store';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';

	let { children } = $props();

	function handleLogout() {
		logout();
		window.location.href = '/';
	}
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
					
					{#if $currentUser}
						<!-- Show dashboard only for business owners -->
						{#if $isBusinessOwner}
							<a href="/dashboard" class="text-gray-700 hover:text-purple-600 transition-colors">Dashboard</a>
						{/if}

						<!-- User info and logout -->
						<div class="flex items-center gap-2">
							<Badge variant="outline">
								{$currentUser.name}
								{#if $isBusinessOwner}
									<span class="ml-1 text-xs">(Owner)</span>
								{/if}
							</Badge>
							<Button variant="outline" size="sm" on:click={handleLogout}>Logout</Button>
						</div>

						<!-- List Your Business - only for business owners -->
						{#if $isBusinessOwner}
							<Button href="/onboarding" size="sm" class="bg-gradient-to-r from-purple-500 to-blue-500">
								+ List Business
							</Button>
						{/if}
					{:else}
						<!-- Not logged in -->
						<Button href="/login" variant="outline" size="sm">Login</Button>
					{/if}
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