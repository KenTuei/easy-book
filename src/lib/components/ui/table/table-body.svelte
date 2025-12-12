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

<tbody
	bind:this={ref}
	data-slot="table-body"
	class={cn("[&_tr:last-child]:border-0", className)}
	{...restProps}
>
	{@render children?.()}
</tbody>