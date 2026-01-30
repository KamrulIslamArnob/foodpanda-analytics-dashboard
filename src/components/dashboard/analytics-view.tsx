"use client";
import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate, Variants } from "framer-motion";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { FullAnalytics, Insight } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditCard, DollarSign, Lightbulb, ShoppingBag, TrendingUp, Utensils, Clock, MapPin, PieChart as PieChartIcon, BarChart as BarChartIcon, Wallet, TrendingDown, Activity, Target, HelpCircle, Calendar } from "lucide-react";
import {
    SpendingBreakdownChart,
    MonthlySpendingChart,
    HourlyPatternChart,
    CuisineChart,
    PaymentMethodsChart,
    OrderSizeDistributionChart,
    SpendingByDayChart,
    PriceTrendChart,
    MealTypeChart,
    OrderFrequencyTrendChart,
    ExplorationChart
} from "./charts/mui-charts";

interface AnalyticsViewProps {
    analytics: FullAnalytics;
}

export function AnalyticsView({ analytics }: AnalyticsViewProps) {
    const totalOrders = Object.values(analytics.payments.payment_method_counts).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-6 md:space-y-10 container mx-auto">
            {/* Insights Section */}
            <section className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="flex items-center gap-2 mb-3 md:mb-5 px-1">
                    <Lightbulb className="h-4 w-4 md:h-5 md:w-5 text-pink-600" />
                    <h3 className="text-sm md:text-lg font-bold text-foreground">Insights</h3>
                </div>
                {/* Mobile: Swipe Row | Desktop: Grid */}
                <motion.div
                    className="flex gap-3 pb-2 overflow-x-auto scrollbar-none touch-pan-x -mx-1 px-1 md:grid md:grid-cols-2 xl:grid-cols-4 md:overflow-visible md:pb-0"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.05, delayChildren: 0.1 }
                        }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {analytics.insights.map((insight, idx) => (
                        <InsightCard
                            key={idx}
                            insight={insight}
                            analytics={analytics}
                        />
                    ))}
                </motion.div>
            </section>

            {/* Navigation & Content */}
            <Tabs defaultValue="spending" className="w-full">
                {/* Tabs Navigation Bar */}
                <TabsList className="flex w-full bg-transparent p-0 mb-6 !h-auto md:mb-8 justify-start flex-nowrap overflow-visible md:overflow-visible">
                    <div className="flex w-full overflow-x-auto pb-4 pt-2 px-1 -mx-1 scrollbar-none gap-2 md:gap-3 snap-x">
                        <TabButton value="spending" icon={<Wallet className="w-4 h-4 md:w-4.5 md:h-4.5" />}>Spending</TabButton>
                        <TabButton value="restaurants" icon={<MapPin className="w-4 h-4 md:w-4.5 md:h-4.5" />}>Places</TabButton>
                        <TabButton value="food" icon={<Utensils className="w-4 h-4 md:w-4.5 md:h-4.5" />}>Food</TabButton>
                        <TabButton value="patterns" icon={<Clock className="w-4 h-4 md:w-4.5 md:h-4.5" />}>Time</TabButton>
                        <TabButton value="payments" icon={<CreditCard className="w-4 h-4 md:w-4.5 md:h-4.5" />}>Payments</TabButton>
                        <TabButton value="advanced" icon={<Activity className="w-4 h-4 md:w-4.5 md:h-4.5" />}>Advanced</TabButton>

                    </div>
                </TabsList>

                {/* Spending Tab (Overview) */}
                <TabsContent value="spending" className="mt-0 space-y-4 md:space-y-8 animate-in fade-in duration-500">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                        <StatCard
                            label="Total Spent"
                            value={`৳${analytics.spending.total_spent.toLocaleString()}`}
                            icon={<DollarSign className="h-4 w-4" />}
                            color="text-pink-600 dark:text-pink-400"
                            help={{
                                shows: "Total money spent on all orders.",
                                data: "Sum of all order totals.",
                                insight: "How much you've invested in delivery.",
                                useful: "Tracks your overall budget."
                            }}
                        />
                        <StatCard
                            label="Orders"
                            value={totalOrders.toString()}
                            icon={<ShoppingBag className="h-4 w-4" />}
                            color="text-blue-600"
                            help={{
                                shows: "Total number of orders placed.",
                                data: "Count of all completed orders.",
                                insight: "How frequently you use the service.",
                                useful: "Indicates your usage volume."
                            }}
                        />
                        <StatCard
                            label="Avg Order"
                            value={`৳${analytics.spending.average_order_value.toFixed(0)}`}
                            icon={<TrendingUp className="h-4 w-4" />}
                            color="text-green-600"
                            help={{
                                shows: "Average cost per order.",
                                data: "Total Spent divided by Total Orders.",
                                insight: "Your typical spending per meal.",
                                useful: "Helps you plan future meals."
                            }}
                        />
                        <StatCard
                            label="Saved"
                            value={`৳${analytics.spending.total_voucher_savings.toLocaleString()}`}
                            icon={<Badge className="bg-green-500 text-[10px] md:text-xs px-1.5 py-0.5">SAVED</Badge>}
                            color="text-green-600"
                            help={{
                                shows: "Money saved via vouchers.",
                                data: "Sum of all discount values.",
                                insight: "How much value you reclaimed.",
                                useful: "Shows deal effectiveness."
                            }}
                        />
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        <Card className="overflow-hidden md:hover:shadow-lg transition-all duration-300">
                            <CardHeader className="py-3 px-4 md:py-5 md:px-6 border-b bg-muted/20">
                                <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
                                    <PieChartIcon className="h-4 w-4 text-pink-500" /> Fees vs Food
                                    <MetricHelp
                                        shows="Cost breakdown."
                                        data="Food cost vs fees."
                                        insight="Hidden costs of delivery."
                                        useful="Understand true delivery cost."
                                    />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[220px] md:h-[320px] p-4">
                                <SpendingBreakdownChart
                                    foodCost={analytics.spending.total_spent - analytics.spending.total_delivery_fees - analytics.spending.total_service_fees}
                                    deliveryFees={analytics.spending.total_delivery_fees}
                                    serviceFees={analytics.spending.total_service_fees}
                                />
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden md:hover:shadow-lg transition-all duration-300">
                            <CardHeader className="py-3 px-4 md:py-5 md:px-6 border-b bg-muted/20">
                                <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
                                    <BarChartIcon className="h-4 w-4 text-pink-500" /> Monthly Trend
                                    <MetricHelp
                                        shows="Spending habits over time."
                                        data="Aggregated monthly totals."
                                        insight="If spending is rising or falling."
                                        useful="Identifies budget drifts."
                                    />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[200px] md:h-[320px] p-4">
                                <MonthlySpendingChart monthlyData={analytics.spending.monthly_spending} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Places Tab */}
                <TabsContent value="restaurants" className="mt-0 animate-in fade-in duration-500">
                    <Card className="overflow-hidden md:hover:shadow-lg transition-all duration-300 h-full">
                        <CardHeader className="py-3 px-4 md:py-5 md:px-6 border-b bg-muted/20">
                            <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-orange-500" /> Top Restaurants
                                <MetricHelp
                                    shows="Most frequented places."
                                    data="Order count by restaurant."
                                    insight="Your favorite dining spots."
                                    useful="Quick reordering or variety check."
                                />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[400px] md:h-[450px]">
                                <div className="divide-y">
                                    {Object.entries(analytics.restaurants.top_restaurants_by_orders).map(([name, count], i) => (
                                        <div key={name} className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 hover:bg-muted/30 transition-colors group">
                                            <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                                <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 font-bold text-xs md:text-sm group-hover:scale-110 transition-transform">
                                                    {i + 1}
                                                </div>
                                                <span className="font-medium text-sm md:text-base truncate">{name}</span>
                                            </div>
                                            <Badge variant="secondary" className="shrink-0 text-xs md:text-sm md:px-3 md:py-1">{count} Orders</Badge>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Food Tab */}
                <TabsContent value="food" className="mt-0 space-y-4 md:space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        <Card className="overflow-hidden md:hover:shadow-lg transition-all duration-300">
                            <CardHeader className="py-3 px-4 md:py-5 md:px-6 border-b bg-muted/20">
                                <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
                                    <Utensils className="h-4 w-4 text-amber-500" /> Top Items
                                    <MetricHelp
                                        shows="Most ordered dishes."
                                        data="Frequency of item names."
                                        insight="Your absolute favorites."
                                        useful="Reveals dietary preferences."
                                    />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[250px] md:h-[350px]">
                                    <div className="divide-y">
                                        {Object.entries(analytics.food.top_food_items).slice(0, 15).map(([name, count]) => (
                                            <div key={name} className="flex items-center justify-between px-4 py-3 md:px-6 md:py-3.5 hover:bg-muted/30 transition-colors">
                                                <span className="text-sm md:text-base truncate max-w-[200px] md:max-w-xs capitalize">{name}</span>
                                                <Badge variant="outline" className="text-xs">{count}x</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden md:hover:shadow-lg transition-all duration-300">
                            <CardHeader className="py-3 px-4 md:py-5 md:px-6 border-b bg-muted/20">
                                <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
                                    <PieChartIcon className="h-4 w-4 text-amber-500" /> Cuisines
                                    <MetricHelp
                                        shows="Food categories you eat."
                                        data="Cuisine tag analysis."
                                        insight="Diversity of your diet."
                                        useful="Encourages trying new foods."
                                    />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[250px] md:h-[350px] p-4">
                                <CuisineChart cuisineData={analytics.food.food_categories} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Time Tab */}
                <TabsContent value="patterns" className="mt-0 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                        <Card className="md:col-span-2 overflow-hidden md:hover:shadow-lg transition-all duration-300">
                            <CardHeader className="py-3 px-4 md:py-5 md:px-6 border-b bg-muted/20">
                                <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-violet-500" /> Ordering Hours
                                    <MetricHelp
                                        shows="Time of day you order."
                                        data="Timestamps of orders."
                                        insight="Mealtime habits."
                                        useful="Predicts when you get hungry."
                                    />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[200px] md:h-[320px] p-4">
                                <HourlyPatternChart hourlyData={analytics.patterns.hourly_patterns} />
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-4 md:gap-6">
                            <div className="grid grid-cols-2 gap-3 md:gap-4 flex-1">
                                <Card className="text-center p-4 md:p-6 flex flex-col justify-center items-center md:hover:scale-105 transition-transform duration-300 bg-pink-50/50 dark:bg-pink-900/10 border-pink-200 dark:border-pink-800/30">
                                    <div className="text-2xl md:text-4xl font-bold text-pink-600 mb-1">
                                        {analytics.patterns.weekend_vs_weekday.weekend_percentage.toFixed(0)}%
                                    </div>
                                    <div className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">Weekend</div>
                                </Card>
                                <Card className="text-center p-4 md:p-6 flex flex-col justify-center items-center md:hover:scale-105 transition-transform duration-300 bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30">
                                    <div className="text-2xl md:text-4xl font-bold text-blue-600 mb-1">
                                        {(100 - analytics.patterns.weekend_vs_weekday.weekend_percentage).toFixed(0)}%
                                    </div>
                                    <div className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">Weekday</div>
                                </Card>
                            </div>

                            <Card className="p-4 md:p-6 text-center bg-muted/30 md:flex-1 md:flex md:flex-col md:justify-center">
                                <span className="text-xs md:text-sm text-muted-foreground mb-1 block">Peak Ordering Day</span>
                                <span className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-pink-600">
                                    {analytics.patterns.peak_day}
                                </span>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Payments Tab */}
                <TabsContent value="payments" className="mt-0 animate-in fade-in duration-500">
                    <Card className="overflow-hidden md:hover:shadow-lg transition-all duration-300">
                        <CardHeader className="py-3 px-4 md:py-5 md:px-6 border-b bg-muted/20">
                            <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-emerald-500" /> Payment Methods
                                <MetricHelp
                                    shows="How you pay."
                                    data="Cash vs Digital payments."
                                    insight="Your financial preference."
                                    useful="Helps budget planning."
                                />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[250px] md:h-[400px] p-4">
                            <PaymentMethodsChart paymentData={analytics.payments.payment_method_counts} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Advanced Analytics Tab */}
                <TabsContent value="advanced" className="mt-0 space-y-4 md:space-y-8 animate-in fade-in duration-500">
                    {/* Advanced Metrics Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                        {/* CLV */}
                        <Card className="p-6 flex flex-col justify-between hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm font-medium text-muted-foreground">CLV (Annual)</span>
                                <MetricHelp shows="Estimated yearly value." data="Avg spend projected." insight="Your value to the platform." useful="Fun economic metric." />
                            </div>
                            <div className="text-3xl lg:text-4xl font-bold text-pink-600 dark:text-pink-400 tracking-tight">
                                ৳{(analytics.advanced?.customer_lifetime_value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </div>
                        </Card>

                        {/* Loyalty Score */}
                        <Card className="p-6 flex flex-col justify-between hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-medium text-muted-foreground">Loyalty Score</span>
                                <MetricHelp shows="Repeat order habit." data="Reorders vs new places." insight="How consistent you are." useful="Shows brand preference." />
                            </div>
                            <div>
                                <div className="flex items-baseline gap-1 mb-3">
                                    <span className="text-3xl lg:text-4xl font-bold text-purple-600 dark:text-purple-400">{(analytics.advanced?.brand_loyalty_score ?? 0).toFixed(0)}</span>
                                    <span className="text-sm text-muted-foreground font-medium">/100</span>
                                </div>
                                <div className="h-2 w-full bg-purple-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${analytics.advanced?.brand_loyalty_score ?? 0}%` }} />
                                </div>
                            </div>
                        </Card>

                        {/* Variety Score */}
                        <Card className="p-6 flex flex-col justify-between hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-medium text-muted-foreground">Variety Score</span>
                                <MetricHelp shows="Food diversity." data="Unique items ratio." insight="If you explore new foods." useful="Encourages trying new things." />
                            </div>
                            <div>
                                <div className="flex items-baseline gap-1 mb-3">
                                    <span className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400">{(analytics.diversity?.variety_score ?? 0).toFixed(0)}</span>
                                    <span className="text-sm text-muted-foreground font-medium">/100</span>
                                </div>
                                <div className="h-2 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${analytics.diversity?.variety_score ?? 0}%` }} />
                                </div>
                            </div>
                        </Card>

                        {/* Spontaneity */}
                        <Card className="p-6 flex flex-col justify-between hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-medium text-muted-foreground">Spontaneity</span>
                                <MetricHelp shows="Unpredictability." data="Time/Place variance." insight="How routine-based you are." useful="Fun personality stats." />
                            </div>
                            <div>
                                <div className="flex items-baseline gap-1 mb-3">
                                    <span className="text-3xl lg:text-4xl font-bold text-orange-600 dark:text-orange-400">{(analytics.advanced?.spontaneity_index ?? 0).toFixed(0)}</span>
                                    <span className="text-sm text-muted-foreground font-medium">/100</span>
                                </div>
                                <div className="h-2 w-full bg-orange-100 dark:bg-orange-900/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${analytics.advanced?.spontaneity_index ?? 0}%` }} />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        <Card className="overflow-hidden hover:shadow-lg transition-all">
                            <CardHeader className="py-3 px-4 md:py-5 md:px-6 border-b bg-muted/20">
                                <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
                                    <Target className="h-4 w-4 text-purple-500" /> Exploration vs Favorites
                                    <MetricHelp
                                        shows="New vs Repeat places."
                                        data="Order history analysis."
                                        insight="If you are adventurous."
                                        useful="Understand your risk tolerance."
                                    />
                                </CardTitle>
                                <CardDescription className="text-xs">How adventurous are you?</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[220px] md:h-[280px] p-4">
                                <ExplorationChart
                                    exploration={analytics.advanced?.exploration_vs_exploitation?.exploration_percentage ?? 50}
                                    exploitation={analytics.advanced?.exploration_vs_exploitation?.exploitation_percentage ?? 50}
                                />
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden hover:shadow-lg transition-all">
                            <CardHeader className="py-3 px-4 md:py-5 md:px-6 border-b bg-muted/20">
                                <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-blue-500" /> Order Size Distribution
                                    <MetricHelp
                                        shows="Order value grouping."
                                        data="Small/Med/Large split."
                                        insight="If you order for one or many."
                                        useful="Contextualizes spending."
                                    />
                                </CardTitle>
                                <CardDescription className="text-xs">Small, medium, or large orders?</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[220px] md:h-[280px] p-4">
                                <OrderSizeDistributionChart distribution={analytics.behavior?.order_size_distribution ?? { small: 0, medium: 0, large: 0 }} />
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden hover:shadow-lg transition-all">
                            <CardHeader className="py-3 px-4 md:py-5 md:px-6 border-b bg-muted/20">
                                <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
                                    <PieChartIcon className="h-4 w-4 text-amber-500" /> Meal Types
                                    <MetricHelp
                                        shows="Orders by mealtime."
                                        data="Hour of day classification."
                                        insight="Which meals you outsource."
                                        useful="Planning meal prep."
                                    />
                                </CardTitle>
                                <CardDescription className="text-xs">Breakfast, lunch, dinner, or snacks?</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[220px] md:h-[280px] p-4">
                                <MealTypeChart mealData={analytics.healthDietary?.meal_type_distribution ?? { breakfast: 0, lunch: 0, dinner: 0, snack: 0 }} />
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden hover:shadow-lg transition-all">
                            <CardHeader className="py-3 px-4 md:py-5 md:px-6 border-b bg-muted/20">
                                <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-green-500" /> Order Frequency Trend
                                    <MetricHelp
                                        shows="Orders per month."
                                        data="Monthly order count."
                                        insight="If usage is increasing."
                                        useful="Tracks dependency."
                                    />
                                </CardTitle>
                                <CardDescription className="text-xs">Orders per month over time</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[220px] md:h-[280px] p-4">
                                <OrderFrequencyTrendChart frequencyData={analytics.timeAnalysis?.order_frequency_trend ?? {}} />
                            </CardContent>
                        </Card>
                    </div>
                    {/* Cost Optimization Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">Cost Optimization Insights</h3>
                            <MetricHelp
                                shows="How to save money."
                                data="Fee analysis vs cart size."
                                insight="Ways to reduce per-order cost."
                                useful="Maximizing value."
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                            <Card className="p-5 hover:shadow-md transition-all">
                                <div className="text-sm text-muted-foreground mb-2">Fee to Food Ratio</div>
                                <div className="text-2xl lg:text-3xl font-bold text-red-500">
                                    {(analytics.costOptimization?.fee_to_food_ratio ?? 0).toFixed(1)}%
                                </div>
                            </Card>
                            <Card className="p-5 hover:shadow-md transition-all">
                                <div className="text-sm text-muted-foreground mb-2">Optimal Order Value</div>
                                <div className="text-2xl lg:text-3xl font-bold text-green-600">
                                    ৳{(analytics.costOptimization?.optimal_order_value ?? 0).toFixed(0)}
                                </div>
                            </Card>
                            <Card className="p-5 hover:shadow-md transition-all">
                                <div className="text-sm text-muted-foreground mb-2">Potential Savings</div>
                                <div className="text-2xl lg:text-3xl font-bold text-orange-600">
                                    ৳{(analytics.costOptimization?.potential_savings ?? 0).toLocaleString()}
                                </div>
                            </Card>
                            <Card className="p-5 hover:shadow-md transition-all">
                                <div className="text-sm text-muted-foreground mb-2">Avg Voucher Savings</div>
                                <div className="text-2xl lg:text-3xl font-bold text-purple-600">
                                    ৳{(analytics.costOptimization?.voucher_impact?.avg_savings_with_voucher ?? 0).toLocaleString()}
                                </div>
                            </Card>
                        </div>

                        {/* Money Saving Tip */}
                        <div className="relative overflow-hidden rounded-xl border border-yellow-200 bg-yellow-50/50 p-4 dark:border-yellow-900/50 dark:bg-yellow-950/20">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-full shrink-0">
                                    <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-500 mb-1">💡 Smart Saving Tip</h4>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-400/90 leading-relaxed">
                                        Try to keep your orders above <span className="font-bold">৳{(analytics.costOptimization?.optimal_order_value ?? 250).toFixed(0)}</span> to maximize value and minimize the impact of delivery and service fees!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Grid - Spending & Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        {/* Spending by Day */}
                        <Card className="hover:shadow-lg transition-all border-none shadow-sm md:shadow">
                            <CardHeader className="bg-white dark:bg-zinc-900 border-b-0 pb-2">
                                <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                                    <BarChartIcon className="h-5 w-5 text-blue-500" /> Spending by Day
                                    <MetricHelp
                                        shows="Daily spending patterns."
                                        data="Total spent per weekday."
                                        insight="Most expensive days."
                                        useful="Budget allocation."
                                    />
                                </CardTitle>
                                <CardDescription className="text-sm font-medium text-muted-foreground">Which days do you spend most?</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[280px] p-4">
                                <SpendingByDayChart dayData={analytics.timeAnalysis?.spending_by_day_of_week ?? {}} />
                            </CardContent>
                        </Card>

                        {/* Price Trend */}
                        <Card className="hover:shadow-lg transition-all border-none shadow-sm md:shadow">
                            <CardHeader className="bg-white dark:bg-zinc-900 border-b-0 pb-2">
                                <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                                    <TrendingDown className="h-5 w-5 text-orange-500" /> Price Trend
                                    <MetricHelp
                                        shows="Item price changes."
                                        data="Average item cost over time."
                                        insight="Inflation or taste change."
                                        useful="Understanding cost drivers."
                                    />
                                </CardTitle>
                                <CardDescription className="text-sm font-medium text-muted-foreground">Average item price over time</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[280px] p-4">
                                <PriceTrendChart trendData={analytics.prices?.price_trend_over_time ?? {}} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Comparative & Health Stats */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-bold text-foreground">Additional Insights</h3>
                        <Card className="p-6 border-none shadow-sm md:shadow hover:shadow-lg transition-all">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Profile Stats */}
                                <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-xl space-y-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                            <BarChartIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="font-bold text-blue-700 dark:text-blue-300">Your Profile</span>
                                    </div>
                                    <ul className="space-y-2.5">
                                        <li className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                            {analytics.comparative?.order_frequency_category ?? 'N/A'} User
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                            {analytics.comparative?.spending_percentile ?? 50}th percentile spending
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                            Value Score: {(analytics.comparative?.value_consciousness_score ?? 0).toFixed(0)}/100
                                        </li>
                                    </ul>
                                </div>

                                {/* Health Stats */}
                                <div className="p-5 bg-green-50 dark:bg-green-900/10 rounded-xl space-y-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
                                            <Utensils className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        <span className="font-bold text-green-700 dark:text-green-300">Health Stats</span>
                                    </div>
                                    <ul className="space-y-2.5">
                                        <li className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            Healthy: {(analytics.healthDietary?.healthy_food_percentage ?? 0).toFixed(0)}%
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            Indulgent: {(analytics.healthDietary?.indulgent_food_percentage ?? 0).toFixed(0)}%
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            Avg Basket: {(analytics.behavior?.average_basket_size ?? 0).toFixed(1)} items
                                        </li>
                                    </ul>
                                </div>

                                {/* Time Patterns */}
                                <div className="p-5 bg-purple-50 dark:bg-purple-900/10 rounded-xl space-y-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                                            <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <span className="font-bold text-purple-700 dark:text-purple-300">Time Patterns</span>
                                    </div>
                                    <ul className="space-y-2.5">
                                        <li className="flex items-center gap-2 text-sm text-purple-800 dark:text-purple-200 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                            Avg gap: {(analytics.timeAnalysis?.average_days_between_orders ?? 0).toFixed(1)} days
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-purple-800 dark:text-purple-200 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                            Discovery rate: {(analytics.diversity?.restaurant_discovery_rate ?? 0).toFixed(1)} new/month
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-purple-800 dark:text-purple-200 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                            {(analytics.timeAnalysis?.ordering_acceleration ?? 0) > 0 ? 'Ordering more often' : (analytics.timeAnalysis?.ordering_acceleration ?? 0) < 0 ? 'Ordering less often' : 'Stable frequency'}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function MetricHelp({ title, shows, data, insight, useful }: { title?: string, shows: string, data: string, insight: string, useful: string }) {
    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger asChild>
                <div className="cursor-help inline-flex items-center justify-center ml-1.5 align-text-bottom md:align-middle">
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/40 hover:text-primary/80 transition-colors" />
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 z-50 p-4 border-2 shadow-xl" side="top" align="start">
                <div className="space-y-3">
                    <h4 className="font-bold text-sm text-foreground border-b pb-2 mb-2">{title || "About this metric"}</h4>
                    <div className="grid gap-3 text-xs md:text-sm">
                        <div className="space-y-1">
                            <p className="font-bold text-primary text-[10px] uppercase tracking-wider">What it shows</p>
                            <p className="text-muted-foreground leading-relaxed">{shows}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-primary text-[10px] uppercase tracking-wider">Data Source</p>
                            <p className="text-muted-foreground leading-relaxed">{data}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-primary text-[10px] uppercase tracking-wider">Key Insight</p>
                            <p className="text-muted-foreground leading-relaxed">{insight}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-primary text-[10px] uppercase tracking-wider">Why it helps</p>
                            <p className="text-muted-foreground leading-relaxed">{useful}</p>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}

// TabButton Component - Responsive Grid/Flex logic
function TabButton({ value, children, className = "", icon }: { value: string; children: React.ReactNode; className?: string; icon?: React.ReactNode }) {
    return (
        <TabsTrigger
            value={value}
            className={`
                data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_-4px_rgba(236,72,153,0.6)] data-[state=active]:ring-1 data-[state=active]:ring-pink-400/50
                data-[state=inactive]:bg-white data-[state=inactive]:text-zinc-600 data-[state=inactive]:hover:bg-zinc-50 data-[state=inactive]:border-zinc-100 data-[state=inactive]:dark:bg-zinc-900 data-[state=inactive]:dark:text-zinc-400 data-[state=inactive]:dark:hover:bg-zinc-800 data-[state=inactive]:dark:border-zinc-800 data-[state=inactive]:shadow-sm
                bg-white text-zinc-600 border border-zinc-100/50 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800
                rounded-full py-2.5 px-4 md:px-6 md:py-3 text-sm font-semibold tracking-tight
                transition-all duration-300 ease-out
                flex items-center justify-center gap-2.5
                hover:-translate-y-0.5 active:translate-y-0
                flex-1 md:flex-none w-auto h-auto whitespace-nowrap shrink-0
                ring-0 outline-none
                ${className}
            `}
        >
            {icon && <span className="shrink-0 opacity-80">{icon}</span>}
            <span>{children}</span>
        </TabsTrigger>
    );
}

// Compact/Expanded Stat Card
function StatCard({ label, value, icon, color, help }: { label: string; value: string; icon: React.ReactNode; color: string; help?: { shows: string, data: string, insight: string, useful: string } }) {
    return (
        <Card className="p-3 md:p-5 animate-in fade-in zoom-in-95 duration-500 md:hover:shadow-md md:hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-1 md:mb-2">
                <div className="flex items-center">
                    <span className="text-xs md:text-sm font-medium text-muted-foreground">{label}</span>
                    {help && <MetricHelp title={label} {...help} />}
                </div>
                <span className={`${color} bg-muted/20 p-1.5 rounded-full`}>{icon}</span>
            </div>
            <div className="text-lg md:text-2xl font-bold truncate tracking-tight">{value}</div>
        </Card>
    );
}

// === MOTION DESIGN SYSTEM ===
const EASING = {
    deceleration: [0.0, 0.0, 0.2, 1],
    standard: [0.4, 0.0, 0.2, 1],
};

const TIMING = {
    instant: 0.1,
    fast: 0.15,
    medium: 0.35,
};

// ============================================================================
// INSIGHT CARD - Horizontal Data-Driven Design
// ============================================================================

interface InsightCardProps {
    insight: Insight;
    analytics: FullAnalytics;
}

function InsightCard({ insight, analytics }: InsightCardProps) {
    const category = insight.category;

    // Extract real data based on category
    const getDataDisplay = () => {
        switch (category) {
            case 'spending':
                const avgOrder = analytics.spending.average_order_value;
                const spendingType = analytics.spending.spending_category.type;
                return {
                    metric: `Avg Order Value: ৳${avgOrder.toFixed(0)}`,
                    level: `(${spendingType})`,
                    icon: '💰',
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-600',
                    tagLabel: 'Spending',
                    tagClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                    visualization: 'progress',
                    progress: Math.min(avgOrder / 500, 1) // Normalized to 500 BDT max
                };
            case 'voucher':
                const savingsRate = analytics.spending.voucher_usage_rate;
                const totalSaved = analytics.spending.total_voucher_savings;
                return {
                    metric: `Voucher Usage: ${savingsRate.toFixed(1)}%`,
                    level: `(Saved ৳${totalSaved.toFixed(0)})`,
                    icon: '🎫',
                    iconBg: 'bg-purple-100',
                    iconColor: 'text-purple-600',
                    tagLabel: 'Savings',
                    tagClass: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-purple-200 dark:border-purple-800',
                    visualization: 'circle',
                    progress: savingsRate / 100
                };
            case 'timing':
                const peakHour = analytics.patterns.peak_hour;
                const formattedTime = peakHour >= 12
                    ? `${peakHour === 12 ? 12 : peakHour - 12} PM`
                    : `${peakHour === 0 ? 12 : peakHour} AM`;
                return {
                    metric: `Peak Hour: ${formattedTime}`,
                    level: '',
                    icon: '⏰',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    tagLabel: 'Schedule',
                    tagClass: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                    visualization: 'chart',
                    progress: 0
                };
            case 'loyalty':
                const loyaltyPct = analytics.restaurants.loyalty_analysis.top_restaurant_percentage;
                const loyaltyLevel = analytics.restaurants.loyalty_analysis.level;
                return {
                    metric: `Top Restaurant %: ${loyaltyPct.toFixed(0)}%`,
                    level: `(${loyaltyLevel})`,
                    icon: '❤️',
                    iconBg: 'bg-orange-100',
                    iconColor: 'text-orange-600',
                    tagLabel: 'Loyalty',
                    tagClass: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border-orange-200 dark:border-orange-800',
                    visualization: 'pie',
                    progress: loyaltyPct / 100
                };
            default:
                return {
                    metric: '',
                    level: '',
                    icon: '📊',
                    iconBg: 'bg-gray-100',
                    iconColor: 'text-gray-600',
                    tagLabel: 'Insight',
                    tagClass: 'bg-gray-100 text-gray-700 border-gray-200',
                    visualization: 'none',
                    progress: 0
                };
        }
    };

    const data = getDataDisplay();

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 16 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: TIMING.medium,
                ease: EASING.deceleration as any // eslint-disable-line @typescript-eslint/no-explicit-any
            }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="idle"
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            className="
                bg-white dark:bg-zinc-900 
                border border-zinc-200 dark:border-zinc-800
                rounded-xl p-4
                shrink-0 min-w-[280px] w-[85vw] max-w-[320px] md:w-full
                min-h-[120px]
                cursor-pointer
                will-change-transform
                group
            "
        >
            <div className="flex gap-4 h-full items-center">
                {/* Left: Icon */}
                <motion.div
                    className={`
                        shrink-0 w-12 h-12 rounded-xl 
                        ${data.iconBg} 
                        flex items-center justify-center
                        text-2xl
                    `}
                    variants={{
                        idle: { scale: 1 },
                        hover: { scale: 1.1, rotate: [0, -5, 5, 0], transition: { duration: 0.4 } }
                    }}
                >
                    {data.icon}
                </motion.div>

                {/* Center: Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center py-2">
                    <div className="flex items-center gap-1.5 mb-1">
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-tight">
                            {insight.title}
                        </h4>
                        {/* Help Icon with Tooltip */}
                        <HoverCard openDelay={0} closeDelay={0}>
                            <HoverCardTrigger asChild>
                                <div className="cursor-help inline-flex items-center justify-center">
                                    <HelpCircle className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" />
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64 z-50 p-3 text-xs" side="bottom" align="start">
                                <div className="font-semibold mb-1 text-primary">Key Insight</div>
                                <div className="text-muted-foreground leading-relaxed">
                                    {insight.detailedExplanation}
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1.5">
                        <span className="font-medium">{data.metric}</span>
                        {data.level && <span className="text-zinc-400 dark:text-zinc-500 ml-1">{data.level}</span>}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-500 leading-snug">
                        {insight.description}
                    </p>
                </div>

                {/* Right: Visualization + Tag */}
                <div className="shrink-0 flex flex-col items-center gap-3">
                    {/* Mini Visualization */}
                    <div className="w-12 h-8 flex items-center justify-center">
                        {data.visualization === 'progress' && (
                            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-emerald-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${data.progress * 100}%` }}
                                    variants={{
                                        hover: {
                                            width: [0, `${data.progress * 100}%`],
                                            transition: { duration: 0.6, ease: "easeOut" }
                                        }
                                    }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                                />
                            </div>
                        )}
                        {data.visualization === 'circle' && (
                            <svg className="w-8 h-8 -rotate-90">
                                <circle cx="16" cy="16" r="12" stroke="#e5e7eb" strokeWidth="3" fill="none" />
                                <motion.circle
                                    cx="16" cy="16" r="12"
                                    stroke="#8b5cf6" strokeWidth="3" fill="none"
                                    strokeDasharray={75.4}
                                    strokeLinecap="round"
                                    initial={{ strokeDashoffset: 75.4 }}
                                    animate={{ strokeDashoffset: 75.4 * (1 - data.progress) }}
                                    variants={{
                                        hover: {
                                            strokeDashoffset: [75.4, 75.4 * (1 - data.progress)],
                                            transition: { duration: 0.8, ease: "easeOut" }
                                        }
                                    }}
                                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                                />
                            </svg>
                        )}
                        {data.visualization === 'chart' && (
                            <svg className="w-10 h-6" viewBox="0 0 40 24">
                                <motion.path
                                    d="M2 20 L10 12 L18 16 L26 6 L34 10 L38 4"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    variants={{
                                        hover: {
                                            pathLength: [0, 1],
                                            transition: { duration: 0.6, ease: "easeOut" }
                                        }
                                    }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                                />
                            </svg>
                        )}
                        {data.visualization === 'pie' && (
                            <svg className="w-8 h-8">
                                <circle cx="16" cy="16" r="14" fill="#fed7aa" />
                                <motion.path
                                    d={`M 16 16 L 16 2 A 14 14 0 ${data.progress > 0.5 ? 1 : 0} 1 ${16 + 14 * Math.sin(data.progress * 2 * Math.PI)
                                        } ${16 - 14 * Math.cos(data.progress * 2 * Math.PI)} Z`}
                                    fill="#f97316"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    variants={{
                                        hover: {
                                            opacity: [0, 1],
                                            scale: [0.8, 1],
                                            transition: { duration: 0.4 }
                                        }
                                    }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                />
                            </svg>
                        )}
                    </div>

                    {/* Tag */}
                    <div
                        className={`
                            text-[10px] font-semibold px-2 py-0.5 rounded-full
                            border ${data.tagClass}
                            tracking-tight
                        `}
                    >
                        {data.tagLabel}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}



