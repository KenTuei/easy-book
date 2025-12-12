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

<thead
	bind:this={ref}
	data-slot="table-header"
	class={cn("[&_tr]:border-b", className)}
	{...restProps}
>
	{@render children?.()}
</thead>