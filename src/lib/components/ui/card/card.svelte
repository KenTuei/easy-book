<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	// 💡 FIX APPLIED HERE: Changed "$lib/lib/utils.js" to "$lib/utils"
	import { cn, type WithElementRef } from "$lib/utils"; 

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card"
	class={cn(
		"bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>