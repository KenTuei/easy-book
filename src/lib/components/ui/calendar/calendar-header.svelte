<script lang="ts">
	import { Calendar as CalendarPrimitive } from "bits-ui";
	// 💡 FIX APPLIED HERE: Changed "$lib/lib/utils.js" to "$lib/utils"
	import { cn } from "$lib/utils";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CalendarPrimitive.HeaderProps = $props();
</script>

<CalendarPrimitive.Header
	bind:ref
	class={cn(
		"h-(--cell-size) flex w-full items-center justify-center gap-1.5 text-sm font-medium",
		className
	)}
	{...restProps}
/>