<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Building2, Shield, Users, ArrowRight, Menu } from 'lucide-vue-next'

const router = useRouter()

const goToATM = () => router.push({ name: 'login' })
const goToBank = () => router.push({ name: 'bank' })
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
    <!-- Navigation Bar -->
    <header class="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 class="h-5 w-5" aria-hidden="true" />
            </div>
            <span class="font-bold text-xl text-foreground">Nyi Bank</span>
          </div>
          <nav class="hidden md:flex items-center gap-6">
            <Button variant="ghost" size="sm" @click="goToATM">
              ATM Services
              <ArrowRight class="ml-1 h-3 w-3" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="sm" @click="goToBank">
              Bank Dashboard
              <ArrowRight class="ml-1 h-3 w-3" aria-hidden="true" />
            </Button>
          </nav>
          <Button variant="ghost" size="icon" class="md:hidden">
            <Menu class="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
      <div class="max-w-5xl w-full">
        <div class="text-center mb-16 animate-in">
          <div class="inline-flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Shield class="h-4 w-4" aria-hidden="true" />
            <span>Secure & Reliable Banking</span>
          </div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance">
            Your Trusted Partner in
            <br />
            <span class="text-primary">Modern Banking</span>
          </h1>
          <p class="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Experience seamless banking with Nyi Bank. Access your accounts, transfer funds, and manage your finances with confidence.
          </p>
        </div>

        <!-- Feature Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <!-- ATM Card -->
          <Card
            variant="elevated"
            padding="lg"
            class="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            @click="goToATM"
            role="button"
            tabindex="0"
            @keydown.enter="goToATM"
            @keydown.space.prevent="goToATM"
          >
            <CardContent class="flex flex-col items-center text-center h-full">
              <div class="group-hover:scale-110 transition-transform duration-300 mb-6">
                <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <CreditCard class="h-8 w-8" aria-hidden="true" />
                </div>
              </div>
              <h2 class="text-2xl font-bold text-foreground mb-3">ATM Services</h2>
              <p class="text-muted-foreground mb-6">Access your account, withdraw cash, check balance, and view transaction history 24/7.</p>
              <Button variant="outline" size="sm" class="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Get Started
                <ArrowRight class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>

          <!-- Bank Card -->
          <Card
            variant="elevated"
            padding="lg"
            class="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            @click="goToBank"
            role="button"
            tabindex="0"
            @keydown.enter="goToBank"
            @keydown.space.prevent="goToBank"
          >
            <CardContent class="flex flex-col items-center text-center h-full">
              <div class="group-hover:scale-110 transition-transform duration-300 mb-6">
                <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground transition-colors duration-300">
                  <Building2 class="h-8 w-8" aria-hidden="true" />
                </div>
              </div>
              <h2 class="text-2xl font-bold text-foreground mb-3">Bank Dashboard</h2>
              <p class="text-muted-foreground mb-6">Register new accounts, verify users, manage PINs, and handle OTP operations.</p>
              <Button variant="outline" size="sm" class="group-hover:bg-success group-hover:text-success-foreground transition-colors">
                Get Started
                <ArrowRight class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <!-- Features List -->
        <div class="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div class="text-center p-6 rounded-xl bg-card border border-border/50 animate-in" style="animation-delay: 100ms">
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield class="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 class="font-semibold text-foreground mb-2">Bank-Grade Security</h3>
            <p class="text-sm text-muted-foreground">End-to-end encryption and multi-factor authentication protect your data.</p>
          </div>
          <div class="text-center p-6 rounded-xl bg-card border border-border/50 animate-in" style="animation-delay: 200ms">
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
              <Users class="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 class="font-semibold text-foreground mb-2">24/7 Support</h3>
            <p class="text-sm text-muted-foreground">Our dedicated team is always ready to assist you with any banking needs.</p>
          </div>
          <div class="text-center p-6 rounded-xl bg-card border border-border/50 animate-in" style="animation-delay: 300ms">
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <CreditCard class="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 class="font-semibold text-foreground mb-2">Instant Transfers</h3>
            <p class="text-sm text-muted-foreground">Send and receive money instantly with real-time transaction processing.</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-border/50 bg-background/50 backdrop-blur-sm py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 Nyi Bank. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>