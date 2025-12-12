<script lang="ts">
	// 💡 FIX APPLIED HERE: Changed "$lib/lib/utils.js" to "$lib/utils"
	import { cn, type WithElementRef } from "$lib/utils";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableSectionElement>> = $props();
</script>

<tfoot
	bind:this={ref}
	data-slot="table-footer"
	class={cn("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className)}
	{...restProps}
>
	{@render children?.()}
</tfoot>