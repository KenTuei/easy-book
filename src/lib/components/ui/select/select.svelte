<script lang="ts">
  import { Select as SelectPrimitive } from "bits-ui";
  import { cn, type WithElementRef } from "$lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  // Props definition
  let { 
      ref = $bindable(null),
      class: className,
      ...restProps 
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & SelectPrimitive.Props = $props();

  // Export the Value sub-component from bits-ui
  // This fixes the "SelectValue is not a function" error
  export let Value = SelectPrimitive.Value;

  // You can export Trigger and Content if needed
  // export { Trigger, Content };
</script>

<!-- Optional: comment outside the tag -->
<!-- All other necessary SelectPrimitive.Root attributes go here -->

<SelectPrimitive.Root
    bind:value={restProps.value}
    bind:open={restProps.open}
    disabled={restProps.disabled}
    {...restProps}
>
    <slot />
</SelectPrimitive.Root>
