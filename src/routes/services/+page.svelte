<script>
  const services = [
    {
      title: "Barber Shop",
      image: "/images/barber.jpg",
      description: "Clean fades, beard trims, and grooming."
    },
    {
      title: "Hair Salon",
      image: "/images/salon.jpg",
      description: "Braids, styling, blowouts, and treatments."
    },
    {
      title: "Gym Training",
      image: "/images/gym.jpg",
      description: "Personal training sessions and fitness plans."
    },
    {
      title: "Therapy Sessions",
      image: "/images/therapy.jpg",
      description: "1-on-1 mental health and wellness therapy."
    }
  ];
</script>

<div class="max-w-6xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">Our Services</h1>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each services as s}
      <div
        class="rounded-xl shadow-lg overflow-hidden border hover:shadow-2xl transition cursor-pointer"
      >
        <img src={s.image} alt={s.title} class="h-40 w-full object-cover" />
        <div class="p-4">
          <h2 class="font-semibold text-lg">{s.title}</h2>
          <p class="text-sm text-gray-600 mt-1">{s.description}</p>
        </div>
      </div>
    {/each}
  </div>
</div>
