import { 
    FullAnalytics, Order, Insight, SpendingAnalytics, RestaurantAnalytics, 
    FoodAnalytics, PatternAnalytics, PaymentAnalytics, PriceAnalytics,
    OrderBehaviorAnalytics, DiversityAnalytics, TimeAnalytics, 
    CostOptimizationAnalytics, HealthDietaryAnalytics, PredictiveAnalytics,
    AdvancedMetrics, ComparativeMetrics
} from "@/types";
import { foodCategories } from "@/lib/constants";
import _ from "lodash";

export const analyticsService = {
    analyze(orders: Order[]): FullAnalytics {
        // 1. Filter Delivered Orders
        const deliveredOrders = orders.filter(o =>
            !o.status.toLowerCase().includes('cancel') &&
            !o.status.toLowerCase().includes('fail')
        );

        if (deliveredOrders.length === 0) {
            return this.getEmptyAnalytics();
        }

        // Sort orders by date for time-based analysis
        const sortedOrders = [...deliveredOrders].sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // 2. Spending Analysis
        const spending = this.analyzeSpending(deliveredOrders);

        // 3. Restaurant Analysis
        const restaurants = this.analyzeRestaurants(deliveredOrders);

        // 4. Food Analysis
        const food = this.analyzeFood(deliveredOrders);

        // 5. Patterns Analysis
        const patterns = this.analyzePatterns(deliveredOrders);

        // 6. Payment Analysis
        const payments = this.analyzePayments(deliveredOrders);

        // 7. NEW: Price Analysis
        const prices = this.analyzePrices(sortedOrders);

        // 8. NEW: Order Behavior Analysis
        const behavior = this.analyzeOrderBehavior(deliveredOrders);

        // 9. NEW: Diversity Analysis
        const diversity = this.analyzeDiversity(sortedOrders);

        // 10. NEW: Time Analysis (deep dive)
        const timeAnalysis = this.analyzeTimePatterns(sortedOrders);

        // 11. NEW: Cost Optimization
        const costOptimization = this.analyzeCostOptimization(deliveredOrders);

        // 12. NEW: Health & Dietary
        const healthDietary = this.analyzeHealthDietary(deliveredOrders, patterns);

        // 13. NEW: Predictive Analytics
        const predictive = this.analyzePredictive(sortedOrders, spending, timeAnalysis);

        // 14. NEW: Advanced Metrics
        const advanced = this.analyzeAdvancedMetrics(sortedOrders, restaurants, timeAnalysis, spending);

        // 15. NEW: Comparative Metrics
        const comparative = this.analyzeComparative(spending, timeAnalysis, costOptimization);

        // 16. Enhanced Insights Generation
        const insights = this.generateInsights(
            spending, restaurants, patterns, costOptimization, 
            predictive, advanced, healthDietary, diversity
        );

        return {
            spending,
            restaurants,
            food,
            patterns,
            payments,
            prices,
            behavior,
            diversity,
            timeAnalysis,
            costOptimization,
            healthDietary,
            predictive,
            advanced,
            comparative,
            insights
        };
    },

    getEmptyAnalytics(): FullAnalytics {
        return {
            spending: { total_spent: 0, average_order_value: 0, median_order_value: 0, total_delivery_fees: 0, total_service_fees: 0, total_voucher_savings: 0, voucher_usage_rate: 0, monthly_spending: {}, spending_category: { type: 'N/A', description: 'No data', color: 'gray' } },
            restaurants: { top_restaurants_by_orders: {}, unique_restaurants: 0, loyalty_analysis: { level: 'N/A', description: 'No data', top_restaurant: '', top_restaurant_percentage: 0 } },
            food: { top_food_items: {}, food_categories: {}, average_items_per_order: 0, total_unique_items: 0 },
            patterns: { peak_hour: 0, peak_day: '', weekend_vs_weekday: { weekend_orders: 0, weekday_orders: 0, weekend_percentage: 0 }, hourly_patterns: {} },
            payments: { payment_method_counts: {}, preferred_payment_method: 'N/A' },
            prices: { average_price_per_item: 0, price_range: { min: 0, max: 0 }, restaurant_value_scores: {}, discount_effectiveness: 0, price_trend_over_time: {} },
            behavior: { order_size_distribution: { small: 0, medium: 0, large: 0 }, average_basket_size: 0, addon_frequency: { drinks_percentage: 0, desserts_percentage: 0 }, reorder_patterns: { exact_reorder_count: 0, similar_items_frequency: {} } },
            diversity: { cuisine_switching_rate: 0, new_restaurants_per_month: {}, restaurant_discovery_rate: 0, cuisine_preference_evolution: {}, variety_score: 0 },
            timeAnalysis: { order_frequency_trend: {}, average_days_between_orders: 0, spending_by_day_of_week: {}, seasonal_patterns: {}, time_gap_distribution: { same_day: 0, within_week: 0, within_month: 0, over_month: 0 }, ordering_acceleration: 0 },
            costOptimization: { fee_to_food_ratio: 0, average_fee_percentage: 0, optimal_order_value: 0, voucher_impact: { avg_savings_with_voucher: 0, avg_order_value_with_voucher: 0, avg_order_value_without_voucher: 0 }, delivery_fee_variance: { min: 0, max: 0, avg: 0 }, potential_savings: 0 },
            healthDietary: { healthy_vs_indulgent_ratio: 0, meal_type_distribution: { breakfast: 0, lunch: 0, dinner: 0, snack: 0 }, drink_to_food_ratio: 0, healthy_food_percentage: 0, indulgent_food_percentage: 0, category_health_scores: {} },
            predictive: { forecasted_monthly_spending: 0, spending_trend: 'stable', trend_percentage: 0, predicted_next_order_days: 0, estimated_annual_spending: 0 },
            advanced: { customer_lifetime_value: 0, order_efficiency_score: 0, brand_loyalty_score: 0, spontaneity_index: 0, deal_dependency_ratio: 0, churn_risk_score: 0, exploration_vs_exploitation: { exploration_percentage: 0, exploitation_percentage: 0 } },
            comparative: { spending_percentile: 50, order_frequency_category: 'N/A', value_consciousness_score: 0 },
            insights: []
        };
    },

    analyzeSpending(orders: Order[]): SpendingAnalytics {
        const totalSpent = _.sumBy(orders, 'total_value');
        const avgOrderValue = totalSpent / orders.length;
        const medianOrderValue = this.calculateMedian(orders.map(o => o.total_value));

        const monthlySpending = _.groupBy(orders, (o) => {
            const d = new Date(o.date);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        });
        const monthlySpendingTotal: Record<string, number> = {};
        Object.entries(monthlySpending).forEach(([k, v]) => {
            monthlySpendingTotal[k] = _.sumBy(v, 'total_value');
        });

        const voucherOrders = orders.filter(o => o.voucher_discount > 0);
        const voucherUsageRate = (voucherOrders.length / orders.length) * 100;

        return {
            total_spent: totalSpent,
            average_order_value: avgOrderValue,
            median_order_value: medianOrderValue,
            total_delivery_fees: _.sumBy(orders, 'delivery_fee'),
            total_service_fees: _.sumBy(orders, 'service_fee'),
            total_voucher_savings: _.sumBy(orders, 'voucher_discount'),
            voucher_usage_rate: voucherUsageRate,
            monthly_spending: monthlySpendingTotal,
            spending_category: this.categorizeSpending(avgOrderValue)
        };
    },

    categorizeSpending(avg: number) {
        if (avg > 400) return { type: 'Big Spender', description: 'You love premium food', color: '#e74c3c' };
        if (avg > 250) return { type: 'Medium Spender', description: 'Balanced spending', color: '#f39c12' };
        return { type: 'Light Spender', description: 'You save money', color: '#27ae60' };
    },

    analyzeRestaurants(orders: Order[]): RestaurantAnalytics {
        const restaurantCounts = _.countBy(orders, 'restaurant_name');
        const topRestaurants = this.getTopN(restaurantCounts, 10);

        const topRestName = Object.keys(topRestaurants)[0] || "";
        const topRestCount = topRestaurants[topRestName] || 0;
        const loyaltyPct = (topRestCount / orders.length) * 100;

        let loyaltyLevel = "Explorer";
        let desc = "You try many places";
        if (loyaltyPct > 30) { loyaltyLevel = "Super Loyal"; desc = "You have a favorite place"; }
        else if (loyaltyPct > 15) { loyaltyLevel = "Loyal"; desc = "You like some places more"; }

        return {
            top_restaurants_by_orders: topRestaurants,
            unique_restaurants: Object.keys(restaurantCounts).length,
            loyalty_analysis: {
                level: loyaltyLevel,
                description: desc,
                top_restaurant: topRestName,
                top_restaurant_percentage: loyaltyPct
            }
        };
    },

    analyzeFood(orders: Order[]): FoodAnalytics {
        const allItems = orders.flatMap(o => o.items.map(i => i.name.toLowerCase().trim()));
        const itemCounts = _.countBy(allItems);

        const categoriesCount: Record<string, number> = {};
        Object.entries(foodCategories).forEach(([cat, keywords]) => {
            const count = allItems.filter(item => keywords.some(k => item.includes(k))).length;
            if (count > 0) categoriesCount[cat] = count;
        });

        return {
            top_food_items: this.getTopN(itemCounts, 15),
            food_categories: categoriesCount,
            average_items_per_order: allItems.length / orders.length,
            total_unique_items: Object.keys(itemCounts).length
        };
    },

    analyzePatterns(orders: Order[]): PatternAnalytics {
        const hours = orders.map(o => new Date(o.date).getHours());
        const days = orders.map(o => new Date(o.date).toLocaleDateString('en-US', { weekday: 'long' }));

        const hourlyPatterns = _.countBy(hours);
        const dayPatterns = _.countBy(days);

        const peakHour = parseInt(Object.keys(hourlyPatterns).reduce((a, b) => hourlyPatterns[a] > hourlyPatterns[b] ? a : b, "0"));
        const peakDay = Object.keys(dayPatterns).reduce((a, b) => dayPatterns[a] > dayPatterns[b] ? a : b, "");

        const weekendOrders = orders.filter(o => {
            const day = new Date(o.date).getDay();
            return day === 5 || day === 6; // Fri/Sat is weekend in BD context? Or Sat/Sun? Python script used Fri>=5. Let's assume Fri(5)/Sat(6) for BD context or Sat(6)/Sun(0) standard. 
            // Python script: df['date'].dt.weekday >= 5. Python Monday=0, Sunday=6. So 5=Sat, 6=Sun. 
            // JS getDay(): Sun=0, Sat=6. 
            // Let's stick to standard Sat/Sun.
            return day === 0 || day === 6;
        }).length;

        return {
            peak_hour: peakHour,
            peak_day: peakDay,
            weekend_vs_weekday: {
                weekend_orders: weekendOrders,
                weekday_orders: orders.length - weekendOrders,
                weekend_percentage: (weekendOrders / orders.length) * 100
            },
            hourly_patterns: hourlyPatterns
        };
    },

    analyzePayments(orders: Order[]): PaymentAnalytics {
        const counts = _.countBy(orders, 'payment_method');
        const preferred = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, "N/A");

        return {
            payment_method_counts: counts,
            preferred_payment_method: preferred
        };
    },

    analyzePrices(orders: Order[]): PriceAnalytics {
        const allItems = orders.flatMap(o => o.items);
        const totalItems = allItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalItemCost = allItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const avgPricePerItem = totalItems > 0 ? totalItemCost / totalItems : 0;

        // Price range
        const itemPrices = allItems.map(item => item.price);
        const priceRange = {
            min: itemPrices.length > 0 ? Math.min(...itemPrices) : 0,
            max: itemPrices.length > 0 ? Math.max(...itemPrices) : 0
        };

        // Restaurant value scores (avg order value per restaurant)
        const restaurantOrders = _.groupBy(orders, 'restaurant_name');
        const restaurantValueScores: Record<string, number> = {};
        Object.entries(restaurantOrders).forEach(([name, orders]) => {
            restaurantValueScores[name] = _.meanBy(orders, 'total_value');
        });

        // Discount effectiveness
        const voucherOrders = orders.filter(o => o.voucher_discount > 0);
        const discountEffectiveness = voucherOrders.length > 0 
            ? _.meanBy(voucherOrders, 'voucher_discount')
            : 0;

        // Price trend over time (monthly avg price per item)
        const monthlyOrders = _.groupBy(orders, o => {
            const d = new Date(o.date);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        });
        const priceTrendOverTime: Record<string, number> = {};
        Object.entries(monthlyOrders).forEach(([month, monthOrders]) => {
            const monthItems = monthOrders.flatMap(o => o.items);
            const monthTotalItems = monthItems.reduce((sum, item) => sum + item.quantity, 0);
            const monthTotalCost = monthItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            priceTrendOverTime[month] = monthTotalItems > 0 ? monthTotalCost / monthTotalItems : 0;
        });

        return {
            average_price_per_item: avgPricePerItem,
            price_range: priceRange,
            restaurant_value_scores: restaurantValueScores,
            discount_effectiveness: discountEffectiveness,
            price_trend_over_time: priceTrendOverTime
        };
    },

    analyzeOrderBehavior(orders: Order[]): OrderBehaviorAnalytics {
        // Order size distribution
        let small = 0, medium = 0, large = 0;
        orders.forEach(order => {
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            if (itemCount <= 2) small++;
            else if (itemCount <= 5) medium++;
            else large++;
        });

        const avgBasketSize = orders.reduce((sum, o) => 
            sum + o.items.reduce((s, item) => s + item.quantity, 0), 0
        ) / orders.length;

        // Addon frequency (drinks and desserts)
        const drinkKeywords = ['coke', 'pepsi', 'juice', 'water', 'drink', 'shake', 'coffee', 'tea'];
        const dessertKeywords = ['ice cream', 'cake', 'dessert', 'sweet', 'waffle', 'donut'];
        
        let ordersWithDrinks = 0, ordersWithDesserts = 0;
        orders.forEach(order => {
            const itemNames = order.items.map(i => i.name.toLowerCase());
            if (itemNames.some(name => drinkKeywords.some(k => name.includes(k)))) ordersWithDrinks++;
            if (itemNames.some(name => dessertKeywords.some(k => name.includes(k)))) ordersWithDesserts++;
        });

        // Reorder patterns
        const itemSignatures = orders.map(order => 
            order.items.map(i => i.name.toLowerCase().trim()).sort().join('|')
        );
        const signatureCounts = _.countBy(itemSignatures);
        const exactReorderCount = Object.values(signatureCounts).filter(count => count > 1).length;

        const allItems = orders.flatMap(o => o.items.map(i => i.name.toLowerCase().trim()));
        const itemCounts = _.countBy(allItems);
        const reorderedItems = Object.entries(itemCounts)
            .filter(([, count]) => count > 2)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .reduce<Record<string, number>>((acc, [item, count]) => ({ ...acc, [item]: count }), {});

        return {
            order_size_distribution: { small, medium, large },
            average_basket_size: avgBasketSize,
            addon_frequency: {
                drinks_percentage: (ordersWithDrinks / orders.length) * 100,
                desserts_percentage: (ordersWithDesserts / orders.length) * 100
            },
            reorder_patterns: {
                exact_reorder_count: exactReorderCount,
                similar_items_frequency: reorderedItems
            }
        };
    },

    analyzeDiversity(orders: Order[]): DiversityAnalytics {
        if (orders.length < 2) {
            return {
                cuisine_switching_rate: 0,
                new_restaurants_per_month: {},
                restaurant_discovery_rate: 0,
                cuisine_preference_evolution: {},
                variety_score: 0
            };
        }

        // Cuisine switching rate (simplified: use restaurant as proxy)
        let switches = 0;
        for (let i = 1; i < orders.length; i++) {
            if (orders[i].restaurant_name !== orders[i - 1].restaurant_name) {
                switches++;
            }
        }
        const cuisineSwitchingRate = (switches / (orders.length - 1)) * 100;

        // New restaurants per month
        const seenRestaurants = new Set<string>();
        const monthlyNewRestaurants: Record<string, number> = {};
        
        orders.forEach(order => {
            const month = new Date(order.date).toISOString().slice(0, 7);
            if (!seenRestaurants.has(order.restaurant_name)) {
                seenRestaurants.add(order.restaurant_name);
                monthlyNewRestaurants[month] = (monthlyNewRestaurants[month] || 0) + 1;
            }
        });

        const discoveryRate = Object.values(monthlyNewRestaurants).length > 0
            ? _.mean(Object.values(monthlyNewRestaurants))
            : 0;

        // Cuisine preference evolution (restaurant frequency per month)
        const monthlyRestaurants = _.groupBy(orders, o => 
            new Date(o.date).toISOString().slice(0, 7)
        );
        const cuisinePreferenceEvolution: Record<string, Record<string, number>> = {};
        Object.entries(monthlyRestaurants).forEach(([month, monthOrders]) => {
            cuisinePreferenceEvolution[month] = _.countBy(monthOrders, 'restaurant_name');
        });

        // Variety score (0-100 based on restaurant diversity)
        const uniqueRestaurants = seenRestaurants.size;
        const totalOrders = orders.length;
        const varietyScore = Math.min(100, (uniqueRestaurants / totalOrders) * 100 * 2); // Scale up for impact

        return {
            cuisine_switching_rate: cuisineSwitchingRate,
            new_restaurants_per_month: monthlyNewRestaurants,
            restaurant_discovery_rate: discoveryRate,
            cuisine_preference_evolution: cuisinePreferenceEvolution,
            variety_score: varietyScore
        };
    },

    analyzeTimePatterns(orders: Order[]): TimeAnalytics {
        if (orders.length === 0) {
            return {
                order_frequency_trend: {},
                average_days_between_orders: 0,
                spending_by_day_of_week: {},
                seasonal_patterns: {},
                time_gap_distribution: { same_day: 0, within_week: 0, within_month: 0, over_month: 0 },
                ordering_acceleration: 0
            };
        }

        // Order frequency trend (orders per month)
        const monthlyFrequency = _.countBy(orders, o => 
            new Date(o.date).toISOString().slice(0, 7)
        );

        // Average days between orders
        const daysBetween: number[] = [];
        for (let i = 1; i < orders.length; i++) {
            const diff = (new Date(orders[i].date).getTime() - new Date(orders[i - 1].date).getTime()) / (1000 * 60 * 60 * 24);
            daysBetween.push(diff);
        }
        const avgDaysBetween = daysBetween.length > 0 ? _.mean(daysBetween) : 0;

        // Spending by day of week
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const spendingByDay: Record<string, number> = {};
        orders.forEach(order => {
            const dayName = dayNames[new Date(order.date).getDay()];
            spendingByDay[dayName] = (spendingByDay[dayName] || 0) + order.total_value;
        });

        // Seasonal patterns (quarterly spending)
        const seasonalSpending: Record<string, number> = {};
        orders.forEach(order => {
            const date = new Date(order.date);
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            const key = `${date.getFullYear()}-Q${quarter}`;
            seasonalSpending[key] = (seasonalSpending[key] || 0) + order.total_value;
        });

        // Time gap distribution
        const timeGaps = { same_day: 0, within_week: 0, within_month: 0, over_month: 0 };
        daysBetween.forEach(days => {
            if (days < 1) timeGaps.same_day++;
            else if (days <= 7) timeGaps.within_week++;
            else if (days <= 30) timeGaps.within_month++;
            else timeGaps.over_month++;
        });

        // Ordering acceleration (comparing first half vs second half frequency)
        const midPoint = Math.floor(orders.length / 2);
        if (midPoint > 0) {
            const firstHalfDays = (new Date(orders[midPoint].date).getTime() - new Date(orders[0].date).getTime()) / (1000 * 60 * 60 * 24);
            const secondHalfDays = (new Date(orders[orders.length - 1].date).getTime() - new Date(orders[midPoint].date).getTime()) / (1000 * 60 * 60 * 24);
            
            const firstHalfFreq = firstHalfDays > 0 ? midPoint / firstHalfDays : 0;
            const secondHalfFreq = secondHalfDays > 0 ? (orders.length - midPoint) / secondHalfDays : 0;
            
            const orderingAcceleration = firstHalfFreq > 0 
                ? ((secondHalfFreq - firstHalfFreq) / firstHalfFreq) * 100
                : 0;

            return {
                order_frequency_trend: monthlyFrequency,
                average_days_between_orders: avgDaysBetween,
                spending_by_day_of_week: spendingByDay,
                seasonal_patterns: seasonalSpending,
                time_gap_distribution: timeGaps,
                ordering_acceleration: orderingAcceleration
            };
        }

        return {
            order_frequency_trend: monthlyFrequency,
            average_days_between_orders: avgDaysBetween,
            spending_by_day_of_week: spendingByDay,
            seasonal_patterns: seasonalSpending,
            time_gap_distribution: timeGaps,
            ordering_acceleration: 0
        };
    },

    analyzeCostOptimization(orders: Order[]): CostOptimizationAnalytics {
        const totalSpent = _.sumBy(orders, 'total_value');
        const totalFees = _.sumBy(orders, o => o.delivery_fee + o.service_fee);
        const totalFood = totalSpent - totalFees;

        const feeToFoodRatio = totalFood > 0 ? (totalFees / totalFood) * 100 : 0;
        const avgFeePercentage = totalSpent > 0 ? (totalFees / totalSpent) * 100 : 0;

        // Voucher impact
        const voucherOrders = orders.filter(o => o.voucher_discount > 0);
        const nonVoucherOrders = orders.filter(o => o.voucher_discount === 0);

        const voucherImpact = {
            avg_savings_with_voucher: voucherOrders.length > 0 ? _.meanBy(voucherOrders, 'voucher_discount') : 0,
            avg_order_value_with_voucher: voucherOrders.length > 0 ? _.meanBy(voucherOrders, 'total_value') : 0,
            avg_order_value_without_voucher: nonVoucherOrders.length > 0 ? _.meanBy(nonVoucherOrders, 'total_value') : 0
        };

        // Delivery fee variance
        const deliveryFees = orders.map(o => o.delivery_fee);
        const deliveryFeeVariance = {
            min: Math.min(...deliveryFees),
            max: Math.max(...deliveryFees),
            avg: _.mean(deliveryFees)
        };

        // Optimal order value (assuming avg delivery fee should be <10% of order)
        const optimalOrderValue = deliveryFeeVariance.avg * 10;

        // Potential savings (orders below optimal threshold waste money on fees)
        const suboptimalOrders = orders.filter(o => o.subtotal < optimalOrderValue);
        const potentialSavings = suboptimalOrders.length * (deliveryFeeVariance.avg * 0.5); // Could save 50% of fees

        return {
            fee_to_food_ratio: feeToFoodRatio,
            average_fee_percentage: avgFeePercentage,
            optimal_order_value: optimalOrderValue,
            voucher_impact: voucherImpact,
            delivery_fee_variance: deliveryFeeVariance,
            potential_savings: potentialSavings
        };
    },

    analyzeHealthDietary(orders: Order[], patterns: PatternAnalytics): HealthDietaryAnalytics {
        const allItems = orders.flatMap(o => o.items.map(i => i.name.toLowerCase()));

        // Health categories
        const healthyKeywords = ['salad', 'soup', 'veg', 'fruit', 'grilled'];
        const indulgentKeywords = ['burger', 'pizza', 'fries', 'cake', 'ice cream', 'fried'];
        const drinkKeywords = ['coke', 'pepsi', 'juice', 'water', 'drink', 'shake'];

        let healthyCount = 0, indulgentCount = 0, drinkCount = 0;
        allItems.forEach(item => {
            if (healthyKeywords.some(k => item.includes(k))) healthyCount++;
            if (indulgentKeywords.some(k => item.includes(k))) indulgentCount++;
            if (drinkKeywords.some(k => item.includes(k))) drinkCount++;
        });

        const totalItems = allItems.length;
        const healthyPercentage = totalItems > 0 ? (healthyCount / totalItems) * 100 : 0;
        const indulgentPercentage = totalItems > 0 ? (indulgentCount / totalItems) * 100 : 0;
        const healthyVsIndulgentRatio = indulgentCount > 0 ? healthyCount / indulgentCount : healthyCount;

        // Meal type distribution based on peak hours
        const mealTypes = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };
        orders.forEach(order => {
            const hour = new Date(order.date).getHours();
            if (hour >= 5 && hour < 11) mealTypes.breakfast++;
            else if (hour >= 11 && hour < 16) mealTypes.lunch++;
            else if (hour >= 16 && hour < 22) mealTypes.dinner++;
            else mealTypes.snack++;
        });

        const drinkToFoodRatio = (totalItems - drinkCount) > 0 
            ? drinkCount / (totalItems - drinkCount) 
            : 0;

        return {
            healthy_vs_indulgent_ratio: healthyVsIndulgentRatio,
            meal_type_distribution: mealTypes,
            drink_to_food_ratio: drinkToFoodRatio,
            healthy_food_percentage: healthyPercentage,
            indulgent_food_percentage: indulgentPercentage,
            category_health_scores: {} // Placeholder for future enhancement
        };
    },

    analyzePredictive(orders: Order[], spending: SpendingAnalytics, timeAnalysis: TimeAnalytics): PredictiveAnalytics {
        if (orders.length < 2) {
            return {
                forecasted_monthly_spending: spending.average_order_value,
                spending_trend: 'stable',
                trend_percentage: 0,
                predicted_next_order_days: 7,
                estimated_annual_spending: spending.total_spent * 12 // varied guess
            };
        }

        const monthlySpendingEntries = Object.entries(spending.monthly_spending).sort();
        
        // 1. Calculate Lifetime Monthly Average
        // Span in months from first to last order
        const firstOrderDate = new Date(orders[0].date); // Orders are sorted? analyze() sorts them.
        const lastOrderDate = new Date(orders[orders.length - 1].date); 
        
        // Calculate month difference correctly
        const monthDiff = (lastOrderDate.getFullYear() - firstOrderDate.getFullYear()) * 12 + (lastOrderDate.getMonth() - firstOrderDate.getMonth()) + 1;
        const activeMonths = Math.max(1, monthDiff);
        
        const lifetimeMonthlyAvg = spending.total_spent / activeMonths;

        // 2. Calculate Weighted Moving Average for Recent Months (smoothing)
        // We take up to 6 recent months
        const recentMonthsData = monthlySpendingEntries.slice(-6); 
        let weightedSum = 0;
        let totalWeight = 0;
        
        recentMonthsData.forEach(([, val], idx) => {
            // More weight to recent months. 
            // If 6 months: weights 1, 2, 3, 4, 5, 6
            const weight = idx + 1; 
            weightedSum += val * weight;
            totalWeight += weight;
        });

        const recentWeightedAvg = recentMonthsData.length > 0 ? weightedSum / totalWeight : lifetimeMonthlyAvg;

        // 3. Trend Calculation (Linear Regression Slope on recent data)
        let trendPercentage = 0;
        if (recentMonthsData.length >= 2) {
             const yValues = recentMonthsData.map(([, val]) => val);
             const xValues = Array.from({length: yValues.length}, (_, i) => i);
             
             const n = yValues.length;
             const sumX = _.sum(xValues);
             const sumY = _.sum(yValues);
             const sumXY = _.sum(xValues.map((x, i) => x * yValues[i]));
             const sumXX = _.sum(xValues.map(x => x * x));
             
             const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
             const averageY = sumY / n;
             
             // Trend as percentage of average
             trendPercentage = averageY !== 0 ? (slope / averageY) * 100 : 0;
        }

        // Cap trend to avoid wild extrapolations (-15% to +15%)
        const cappedTrend = Math.max(-15, Math.min(15, trendPercentage));

        // 4. Forecast Formula
        // Blend: 70% Recent Weighted Avg + 30% Lifetime Avg
        // Then apply mild trend
        const baseForecast = (recentWeightedAvg * 0.7) + (lifetimeMonthlyAvg * 0.3);
        const forecastedMonthlySpending = baseForecast * (1 + (cappedTrend / 100));

        // 5. Annual Estimate
        const estimatedAnnualSpending = forecastedMonthlySpending * 12;

        let spendingTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
        if (cappedTrend > 5) spendingTrend = 'increasing';
        else if (cappedTrend < -5) spendingTrend = 'decreasing';

        // 6. Next Order Prediction (Weighted)
        // Use median days between orders for robustness against outliers
        // (Assuming timeAnalysis gives us something, but we might want to recalculate if not robust)
        const predictedNextOrderDays = Math.max(1, timeAnalysis.average_days_between_orders);

        return {
            forecasted_monthly_spending: forecastedMonthlySpending,
            spending_trend: spendingTrend,
            trend_percentage: cappedTrend,
            predicted_next_order_days: predictedNextOrderDays,
            estimated_annual_spending: estimatedAnnualSpending
        };
    },

    analyzeAdvancedMetrics(
        orders: Order[], 
        restaurants: RestaurantAnalytics, 
        timeAnalysis: TimeAnalytics,
        spending: SpendingAnalytics
    ): AdvancedMetrics {
        // Customer Lifetime Value
        const totalDays = orders.length > 1 
            ? (new Date(orders[orders.length - 1].date).getTime() - new Date(orders[0].date).getTime()) / (1000 * 60 * 60 * 24)
            : 30;
        const dailyValue = spending.total_spent / Math.max(1, totalDays);
        const clv = dailyValue * 365; // Projected annual value

        // Order Efficiency Score (0-100, based on orders per restaurant)
        const avgOrdersPerRestaurant = orders.length / Math.max(1, restaurants.unique_restaurants);
        const efficiencyScore = Math.min(100, avgOrdersPerRestaurant * 10);

        // Brand Loyalty Score (0-100)
        const loyaltyPct = restaurants.loyalty_analysis.top_restaurant_percentage;
        const voucherUsage = spending.voucher_usage_rate;
        const brandLoyaltyScore = Math.min(100, (loyaltyPct * 0.6 + (100 - voucherUsage) * 0.4));

        // Spontaneity Index (0-100, based on hour variance)
        const hours = orders.map(o => new Date(o.date).getHours());
        const hourVariance = hours.length > 1 ? this.calculateVariance(hours) : 0;
        const spontaneityIndex = Math.min(100, (hourVariance / 50) * 100);

        // Deal Dependency Ratio
        const dealDependencyRatio = spending.voucher_usage_rate;

        // Churn Risk Score (0-100, based on decreasing frequency)
        const churnRiskScore = timeAnalysis.ordering_acceleration < -20 ? 80 
            : timeAnalysis.ordering_acceleration < 0 ? 50 
            : 20;

        // Exploration vs Exploitation
        const restaurantCounts = _.countBy(orders, 'restaurant_name');
        const topRestaurantCount = Math.max(...Object.values(restaurantCounts));
        const exploitationPercentage = (topRestaurantCount / orders.length) * 100;
        const explorationPercentage = 100 - exploitationPercentage;

        return {
            customer_lifetime_value: clv,
            order_efficiency_score: efficiencyScore,
            brand_loyalty_score: brandLoyaltyScore,
            spontaneity_index: spontaneityIndex,
            deal_dependency_ratio: dealDependencyRatio,
            churn_risk_score: churnRiskScore,
            exploration_vs_exploitation: {
                exploration_percentage: explorationPercentage,
                exploitation_percentage: exploitationPercentage
            }
        };
    },

    analyzeComparative(
        spending: SpendingAnalytics, 
        timeAnalysis: TimeAnalytics,
        costOptimization: CostOptimizationAnalytics
    ): ComparativeMetrics {
        // Spending percentile (based on Bangladesh avg monthly food spending ~৳15000-20000)
        const avgMonthlySpending = Object.keys(spending.monthly_spending).length > 0
            ? _.mean(Object.values(spending.monthly_spending))
            : spending.average_order_value * 4;

        let spendingPercentile = 50;
        if (avgMonthlySpending > 30000) spendingPercentile = 90;
        else if (avgMonthlySpending > 20000) spendingPercentile = 75;
        else if (avgMonthlySpending > 15000) spendingPercentile = 60;
        else if (avgMonthlySpending > 10000) spendingPercentile = 45;
        else spendingPercentile = 30;

        // Order frequency category
        const monthlyOrderFreq = Object.keys(timeAnalysis.order_frequency_trend).length > 0
            ? _.mean(Object.values(timeAnalysis.order_frequency_trend))
            : 0;

        let frequencyCategory = 'Moderate';
        if (monthlyOrderFreq > 15) frequencyCategory = 'Heavy';
        else if (monthlyOrderFreq > 8) frequencyCategory = 'Moderate';
        else frequencyCategory = 'Light';

        // Value consciousness score (0-100)
        const voucherScore = spending.voucher_usage_rate;
        const feeScore = 100 - costOptimization.average_fee_percentage * 2;
        const valueConsciousnessScore = (voucherScore * 0.6 + Math.max(0, feeScore) * 0.4);

        return {
            spending_percentile: spendingPercentile,
            order_frequency_category: frequencyCategory,
            value_consciousness_score: valueConsciousnessScore
        };
    },

    generateInsights(
        spending: SpendingAnalytics, 
        restaurants: RestaurantAnalytics, 
        patterns: PatternAnalytics,
        costOptimization: CostOptimizationAnalytics,
        predictive: PredictiveAnalytics,
        advanced: AdvancedMetrics,
        healthDietary: HealthDietaryAnalytics,
        _diversity: DiversityAnalytics
    ): Insight[] {
        const insights: Insight[] = [];

        // Spending Insight
        insights.push({
            category: 'spending',
            icon: '💰',
            title: `${spending.spending_category.type}`,
            description: spending.spending_category.description,
            detailedExplanation: `Your average order is ৳${spending.average_order_value.toFixed(0)}. ${spending.spending_category.type === 'Big Spender' ? 'You enjoy premium meals and aren\'t afraid to spend more for quality food.' : spending.spending_category.type === 'Medium Spender' ? 'You balance between quality and budget, ordering moderately priced meals.' : 'You prefer budget-friendly options and focus on value for money.'}`,
            color: spending.spending_category.color
        });

        // Voucher Insight
        if (spending.voucher_usage_rate > 20) {
            const voucherTitle = spending.voucher_usage_rate > 50 ? 'Smart Saver' : 'Deal Hunter';
            insights.push({
                category: 'voucher',
                icon: '🎫',
                title: voucherTitle,
                description: `You used vouchers ${spending.voucher_usage_rate.toFixed(0)}% of the time`,
                detailedExplanation: `You saved a total of ৳${spending.total_voucher_savings.toFixed(0)} by using vouchers on ${spending.voucher_usage_rate.toFixed(1)}% of your orders. That's smart shopping! Keep looking for deals to save even more.`,
                color: '#9b59b6'
            });
        }

        // Time Insight
        const hour = patterns.peak_hour;
        let timeTitle = "Flexible Eater";
        let timeDesc = "You order at different times";
        let timeDetail = "You don't have a fixed schedule and order whenever you feel hungry. Your ordering times vary throughout the day.";
        let timeIcon = "⏰";
        
        if (hour >= 5 && hour < 12) { 
            timeTitle = "Morning Person"; 
            timeIcon = "🌞"; 
            timeDesc = "You order early in the day";
            timeDetail = `You usually order around ${hour}:00. You're an early bird who likes breakfast and brunch. Morning meals give you energy for the day.`;
        }
        else if (hour >= 12 && hour < 17) { 
            timeTitle = "Lunch Lover"; 
            timeIcon = "🍲"; 
            timeDesc = "You order at lunch time";
            timeDetail = `Your peak time is ${hour}:00. You prefer ordering during lunch hours. This is the most popular time to order food.`;
        }
        else if (hour >= 17 && hour < 22) { 
            timeTitle = "Evening Eater"; 
            timeIcon = "🌆"; 
            timeDesc = "You order for dinner";
            timeDetail = `You typically order around ${hour}:00. Evening is your main meal time, when you relax and enjoy dinner.`;
        }
        else { 
            timeTitle = "Night Owl"; 
            timeIcon = "🌙"; 
            timeDesc = "You order late at night";
            timeDetail = `You order around ${hour}:00. You're a night person who gets hungry late. Late-night ordering is your thing!`;
        }

        insights.push({ 
            category: 'timing', 
            icon: timeIcon, 
            title: timeTitle, 
            description: timeDesc, 
            detailedExplanation: timeDetail,
            color: '#3498db' 
        });

        // Loyalty Insight
        const topRestaurant = restaurants.loyalty_analysis.top_restaurant || 'various places';
        const loyaltyPct = restaurants.loyalty_analysis.top_restaurant_percentage;
        let loyaltyDetail = '';
        
        if (restaurants.loyalty_analysis.level === 'Super Loyal') {
            loyaltyDetail = `${loyaltyPct.toFixed(0)}% of your orders are from ${topRestaurant}. You really love this place! Having a favorite restaurant means you know what you like.`;
        } else if (restaurants.loyalty_analysis.level === 'Loyal') {
            loyaltyDetail = `${loyaltyPct.toFixed(0)}% of orders from ${topRestaurant}. You have some favorites but also like trying other places. Good balance!`;
        } else {
            loyaltyDetail = `You order from ${restaurants.unique_restaurants} different restaurants. You love variety and trying new places. That's adventurous!`;
        }

        insights.push({
            category: 'loyalty',
            icon: '❤️',
            title: restaurants.loyalty_analysis.level,
            description: restaurants.loyalty_analysis.description,
            detailedExplanation: loyaltyDetail,
            color: '#e67e22'
        });

        return insights;
    },

    calculateMedian(values: number[]) {
        if (values.length === 0) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    },

    calculateVariance(values: number[]) {
        if (values.length === 0) return 0;
        const mean = _.mean(values);
        const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
        return _.mean(squaredDiffs);
    },

    getTopN(record: Record<string, number>, n: number): Record<string, number> {
        return Object.entries(record)
            .sort(([, a], [, b]) => b - a)
            .slice(0, n)
            .reduce<Record<string, number>>((acc, [k, v]) => ({ ...acc, [k]: v }), {});
    }
};
