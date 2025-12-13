<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardHeader, CardContent, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';

  let {
    id,
    name,
    description,
    category,
    img
  } = $props<{
    id: string;
    name: string;
    description: string;
    category: string;
    img: string;
  }>();

  export let onBook: (payload: { id: string; name: string; defaultDateISO?: string }) => void = () => {};

  // Build a default date/time (next whole hour)
  function getDefaultISO() {
    const d = new Date();
    d.setHours(d.getHours() + 1, 0, 0, 0);
    return d.toISOString();
  }

  function handleBook(event: MouseEvent) {
    // small scale animation feedback
    const el = event.currentTarget as HTMLElement;
    onBook({ id, name, defaultDateISO: getDefaultISO() });
  }
</script>

<Card class="overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer">
  <img src={img} alt={name} class="h-52 w-full object-cover" />

  <CardHeader>
    <div class="flex justify-between items-center">
      <CardTitle>{name}</CardTitle>
      <Badge>{category}</Badge>
    </div>
  </CardHeader>

  <CardContent class="text-gray-600">
    <p>{description}</p>

    <Button class="mt-4 w-full" on:click={handleBook}>
      BOOK NOW
    </Button>
  </CardContent>
</Card>

<style>
  /* Ensure clickable area has nice focus outlines */
  :global(.card) { outline: none; }
</style>
