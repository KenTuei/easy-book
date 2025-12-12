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
	data-slot="card-header"
	class={cn("flex flex-col space-y-1.5 p-6", className)}
	{...restProps}
>
	{@render children?.()}
</div>