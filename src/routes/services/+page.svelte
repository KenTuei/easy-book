<script lang="ts">
  import { goto } from '$app/navigation';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';

  // All available services that can be booked
  const services = [
    { 
      id: 'svc-barber', 
      name: 'Barber Shop', 
      description: 'Clean fades, beard trims & modern haircuts.', 
      category: 'Grooming', 
      img: '/images/kin.jpg',
      price: 500,
      businessName: 'Elite Barbers'
    },
    { 
      id: 'svc-salon',  
      name: 'Beauty Salon', 
      description: 'Hair styling, makeup, skincare & more.', 
      category: 'Beauty', 
      img: '/images/salon.jpg',
      price: 1500,
      businessName: 'Glam Salon'
    },
    { 
      id: 'svc-gym',    
      name: 'Gym Session', 
      description: 'Personal training & guided workouts.', 
      category: 'Fitness', 
      img: '/images/gym.jpg',
      price: 2000,
      businessName: 'FitZone'
    },
    { 
      id: 'svc-therapy',    
      name: 'Therapy Session', 
      description: 'Professional counselling & mental wellness.', 
      category: 'Health', 
      img: '/images/pretty.jpg',
      price: 3000,
      businessName: 'Wellness Center'
    },
    { 
      id: 'svc-massage',    
      name: 'Massage', 
      description: 'Deep tissue, relaxation & hot stone massage.', 
      category: 'Wellness', 
      img: '/images/spa.jpg',
      price: 2500,
      businessName: 'Zen Spa'
    },
    { 
      id: 'svc-photo',    
      name: 'Photography', 
      description: 'Studio & outdoor professional photography.', 
      category: 'Media', 
      img: '/images/spa1.jpg',
      price: 4000,
      businessName: 'SnapShot Studio'
    }
  ];

  function bookService(serviceId: string) {
    const defaultDate = new Date();
    defaultDate.setHours(defaultDate.getHours() + 1, 0, 0, 0);
    goto(`/appointments/new?serviceId=${serviceId}&date=${defaultDate.toISOString()}`);
  }
</script>

<div class="container mx-auto px-6 py-8 max-w-7xl">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-2">All Services</h1>
    <p class="text-gray-600">Browse and book from our wide range of professional services</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each services as service}
      <Card class="overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
        <img src={service.img} alt={service.name} class="h-52 w-full object-cover" />
        
        <CardHeader>
          <div class="flex justify-between items-center">
            <CardTitle>{service.name}</CardTitle>
            <Badge>{service.category}</Badge>
          </div>
        </CardHeader>
        
        <CardContent class="space-y-3">
          <p class="text-gray-600">{service.description}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">by {service.businessName}</span>
            <span class="text-lg font-bold">KES {service.price}</span>
          </div>
          <Button class="w-full" on:click={() => bookService(service.id)}>
            BOOK NOW
          </Button>
        </CardContent>
      </Card>
    {/each}
  </div>
</div>