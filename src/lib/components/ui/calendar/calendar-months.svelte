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
	class={cn("relative flex flex-col gap-4 md:flex-row", className)}
	{...restProps}
>
	{@render children?.()}
</div>