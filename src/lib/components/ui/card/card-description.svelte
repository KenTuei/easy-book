<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	// 💡 FIX APPLIED HERE: Changed "$lib/lib/utils.js" to "$lib/utils"
	import { cn, type WithElementRef } from "$lib/utils"; 

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props();
</script>

<p
	bind:this={ref}
	data-slot="card-description"
	class={cn("text-muted-foreground text-sm", className)}
	{...restProps}
>
	{@render children?.()}
</p>