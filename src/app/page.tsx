import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Zap, Lock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-white via-pink-50/30 to-pink-100/50 dark:from-zinc-950 dark:via-pink-950/10 dark:to-zinc-900">

      {/* Wavy Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top right curve */}
        <div className="absolute -top-20 -right-20 md:-right-40 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-gradient-to-br from-pink-200/40 to-pink-300/20 blur-3xl dark:from-pink-900/20 dark:to-pink-800/10" />
        {/* Bottom left curve */}
        <div className="absolute -bottom-20 -left-20 md:-left-40 w-[250px] md:w-[500px] h-[250px] md:h-[500px] rounded-full bg-gradient-to-tr from-pink-200/50 to-pink-100/30 blur-3xl dark:from-pink-900/30 dark:to-pink-800/10" />
        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[200px] md:h-[400px] rounded-full bg-gradient-to-r from-transparent via-pink-100/40 to-transparent blur-3xl dark:via-pink-900/20" />
      </div>

      {/* Floating Food Images - Mobile Optimized */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Taco - Top Left - Small on mobile, pushed to edge */}
        <div className="absolute top-[8%] left-[2%] md:top-[12%] md:left-[8%] lg:left-[12%] animate-float text-3xl sm:text-4xl md:text-6xl lg:text-7xl transform -rotate-12 drop-shadow-2xl">
          🌮
        </div>

        {/* Burger - Left Center */}
        <div className="absolute top-[38%] -left-[2%] md:left-[3%] lg:left-[8%] animate-float-slow text-3xl sm:text-4xl md:text-5xl lg:text-6xl transform rotate-6 drop-shadow-2xl" style={{ animationDelay: '0.5s' }}>
          🍔
        </div>

        {/* Coffee - Bottom Left */}
        <div className="absolute bottom-[12%] left-[3%] md:bottom-[18%] md:left-[10%] lg:left-[15%] animate-float text-3xl sm:text-4xl md:text-5xl lg:text-6xl transform -rotate-6 drop-shadow-2xl" style={{ animationDelay: '1s' }}>
          ☕
        </div>

        {/* Pizza - Top Right */}
        <div className="absolute top-[10%] right-[2%] md:top-[15%] md:right-[8%] lg:right-[12%] animate-float-slow text-3xl sm:text-4xl md:text-6xl lg:text-7xl transform rotate-12 drop-shadow-2xl" style={{ animationDelay: '0.3s' }}>
          🍕
        </div>

        {/* Ramen - Right Center */}
        <div className="absolute top-[35%] -right-[2%] md:right-[3%] lg:right-[8%] animate-float text-3xl sm:text-4xl md:text-5xl lg:text-6xl transform -rotate-12 drop-shadow-2xl" style={{ animationDelay: '0.8s' }}>
          🍜
        </div>

        {/* Bubble Tea - Bottom Right */}
        <div className="absolute bottom-[10%] right-[3%] md:bottom-[16%] md:right-[10%] lg:right-[15%] animate-float-slow text-3xl sm:text-4xl md:text-5xl lg:text-6xl transform rotate-6 drop-shadow-2xl" style={{ animationDelay: '1.2s' }}>
          🧋
        </div>

        {/* Extra decorations - Hidden on mobile, visible on larger screens */}
        <div className="hidden md:block absolute top-[28%] left-[18%] lg:left-[22%] animate-float text-3xl lg:text-4xl transform rotate-12 drop-shadow-xl opacity-50" style={{ animationDelay: '1.5s' }}>
          🍩
        </div>

        <div className="hidden md:block absolute bottom-[30%] right-[16%] lg:right-[20%] animate-float-slow text-3xl lg:text-4xl transform -rotate-6 drop-shadow-xl opacity-50" style={{ animationDelay: '0.7s' }}>
          🍣
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-8 py-8 sm:py-12">
        <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8 text-center">

          {/* Header Group - Logo & Title */}
          <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
            {/* FoodPanda Logo */}
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="interactive-breathe inline-flex items-center justify-center">
                <Image
                  src="https://www.foodpanda.com/wp-content/uploads/2023/06/foodpanda_logo_2023.svg"
                  alt="FoodPanda Logo"
                  width={240}
                  height={80}
                  className="h-14 sm:h-16 w-auto drop-shadow-xl"
                  priority
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2 sm:space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                Analytics
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xs sm:max-w-sm mx-auto px-2">
                Visualize & Master Your Food
                <br />
                Delivery Habits.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 pt-1 sm:pt-2">
            <Link
              href="/analyze"
              className="interactive-breathe inline-flex items-center justify-center gap-2 
                         px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-base sm:text-lg font-semibold text-white
                         bg-gradient-to-r from-pink-500 via-pink-600 to-pink-500 
                         bg-[length:200%_auto] hover:bg-right
                         shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/60
                         transition-all duration-500"
            >
              Start Analyzing
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>

        </div>

        {/* Feature Badges - Stack on mobile, row on tablet+ */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 w-full max-w-4xl px-4">
          <div className="flex items-center gap-2 px-5 py-3 rounded-xl 
                          bg-white/80 dark:bg-zinc-900/60 
                          border border-zinc-200 dark:border-zinc-800
                          shadow-lg shadow-zinc-200/50 dark:shadow-none
                          backdrop-blur-sm w-full sm:w-auto justify-center sm:justify-start transition-transform hover:scale-105">
            <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-900/40 shrink-0">
              <Zap className="h-4 w-4 text-pink-600" />
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">Instant Insights</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-3 rounded-xl 
                          bg-white/80 dark:bg-zinc-900/60 
                          border border-zinc-200 dark:border-zinc-800
                          shadow-lg shadow-zinc-200/50 dark:shadow-none
                          backdrop-blur-sm w-full sm:w-auto justify-center sm:justify-start transition-transform hover:scale-105">
            <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-900/40 shrink-0">
              <Shield className="h-4 w-4 text-pink-600" />
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">Private & Secure</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-3 rounded-xl 
                          bg-white/80 dark:bg-zinc-900/60 
                          border border-zinc-200 dark:border-zinc-800
                          shadow-lg shadow-zinc-200/50 dark:shadow-none
                          backdrop-blur-sm w-full sm:w-auto justify-center sm:justify-start transition-transform hover:scale-105">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 shrink-0">
              <Lock className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">Local Processing</span>
          </div>
        </div>
      </main>


    </div>
  );
}
