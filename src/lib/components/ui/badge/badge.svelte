<script lang="ts">
	export let label: string;
	export let variant: 'default' | 'success' | 'danger' = 'default';

	const base = "px-2 py-1 rounded text-xs font-medium";
	const style = {
		default: "bg-gray-200 text-gray-900",
		success: "bg-green-200 text-green-900",
		danger: "bg-red-200 text-red-900"
	}[variant];
</script>

<span class="{base} {style}">
	{label}
</span>
