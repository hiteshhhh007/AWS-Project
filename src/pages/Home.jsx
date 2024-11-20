import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Tags, Search, Shield, Share2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-background">
      <Hero />
      <Features />
      <Pricing />
      <CallToAction />
    </div>
  );
}

// Hero component
function Hero() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Your Smart Image Gallery
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Automatically organize and tag your images with AI. Search, filter, and manage your photos effortlessly.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Features component
function Features() {
  const features = [
    {
      title: 'AI-Powered Tagging',
      description: 'Automatically detect objects and scenes in your images',
      icon: Tags
    },
    {
      title: 'Smart Search',
      description: 'Find images instantly using tags or text search',
      icon: Search
    },
    {
      title: 'Secure Storage',
      description: 'Your images are encrypted and safely stored',
      icon: Shield
    },
    {
      title: 'Easy Sharing',
      description: 'Share your galleries securely with others',
      icon: Share2
    }
  ];

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage your images
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.title} className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <dt className="text-base font-semibold leading-7">
                  {feature.title}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

// Pricing component
function Pricing() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        'Up to 100 images',
        'Basic AI tagging',
        'Standard search',
        'Community support'
      ]
    },
    {
      name: 'Pro',
      price: '$9.99',
      description: 'For serious photographers',
      features: [
        'Up to 10,000 images',
        'Advanced AI tagging',
        'Smart search & filters',
        'Priority support',
        'Custom galleries',
        'Analytics'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For professional teams',
      features: [
        'Unlimited images',
        'Custom AI models',
        'Advanced analytics',
        'Dedicated support',
        'API access',
        'Custom integrations'
      ]
    }
  ];

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Choose your plan
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col justify-between rounded-3xl bg-card p-8 ring-1 ring-muted xl:p-10"
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8">
                    {tier.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight">
                    {tier.price}
                  </span>
                  {tier.price !== 'Custom' && (
                    <span className="text-sm font-semibold leading-6">/month</span>
                  )}
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <svg
                        className="h-6 w-5 flex-none text-primary"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/signup"
                className="mt-8"
              >
                <Button className="w-full" variant={tier.name === 'Pro' ? 'default' : 'outline'}>
                  Get started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Call to Action component
function CallToAction() {
  return (
    <div className="relative isolate overflow-hidden bg-primary py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Get Started Today
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Join thousands of users who trust us with their image management. Start organizing your photos with AI today.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link to="/signup">
              <Button variant="secondary" size="lg">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/contact" className="text-sm font-semibold leading-6 text-white">
              Contact Sales <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
