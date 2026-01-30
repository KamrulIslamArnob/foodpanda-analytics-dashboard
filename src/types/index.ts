export interface User {
  id: string;
  username: string;
  displayName?: string;
  email?: string;
  lastLogin?: Date | null;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  order_code: string;
  restaurant_name: string;
  total_value: number;
  subtotal: number;
  delivery_fee: number;
  service_fee: number;
  voucher_discount: number;
  status: string;
  date: string;
  items: OrderItem[];
  payment_method: string;
}

export interface SpendingAnalytics {
  total_spent: number;
  average_order_value: number;
  median_order_value: number;
  total_delivery_fees: number;
  total_service_fees: number;
  total_voucher_savings: number;
  voucher_usage_rate: number;
  monthly_spending: Record<string, number>;
  spending_category: {
    type: string;
    description: string;
    color: string;
  };
}

export interface RestaurantAnalytics {
  top_restaurants_by_orders: Record<string, number>;
  unique_restaurants: number;
  loyalty_analysis: {
    level: string;
    description: string;
    top_restaurant: string;
    top_restaurant_percentage: number;
  };
}

export interface FoodAnalytics {
  top_food_items: Record<string, number>;
  food_categories: Record<string, number>;
  average_items_per_order: number;
  total_unique_items: number;
}

export interface PatternAnalytics {
  peak_hour: number;
  peak_day: string;
  weekend_vs_weekday: {
    weekend_orders: number;
    weekday_orders: number;
    weekend_percentage: number;
  };
  hourly_patterns: Record<string, number>;
}

export interface PaymentAnalytics {
  payment_method_counts: Record<string, number>;
  preferred_payment_method: string;
}

export interface PriceAnalytics {
  average_price_per_item: number;
  price_range: { min: number; max: number };
  restaurant_value_scores: Record<string, number>; // avg order value per restaurant
  discount_effectiveness: number; // avg discount when voucher used
  price_trend_over_time: Record<string, number>; // monthly avg price per item
}

export interface OrderBehaviorAnalytics {
  order_size_distribution: {
    small: number; // 1-2 items
    medium: number; // 3-5 items
    large: number; // 6+ items
  };
  average_basket_size: number;
  addon_frequency: {
    drinks_percentage: number;
    desserts_percentage: number;
  };
  reorder_patterns: {
    exact_reorder_count: number;
    similar_items_frequency: Record<string, number>; // top reordered items
  };
}

export interface DiversityAnalytics {
  cuisine_switching_rate: number; // % orders with different cuisine than previous
  new_restaurants_per_month: Record<string, number>;
  restaurant_discovery_rate: number; // avg new restaurants per month
  cuisine_preference_evolution: Record<string, Record<string, number>>; // cuisine per month
  variety_score: number; // 0-100, based on restaurant diversity
}

export interface TimeAnalytics {
  order_frequency_trend: Record<string, number>; // orders per month
  average_days_between_orders: number;
  spending_by_day_of_week: Record<string, number>;
  seasonal_patterns: Record<string, number>; // spending by quarter/season
  time_gap_distribution: {
    same_day: number;
    within_week: number;
    within_month: number;
    over_month: number;
  };
  ordering_acceleration: number; // % change in frequency (positive = ordering more)
}

export interface CostOptimizationAnalytics {
  fee_to_food_ratio: number; // % of total spent on fees
  average_fee_percentage: number;
  optimal_order_value: number; // suggested minimum to justify fees
  voucher_impact: {
    avg_savings_with_voucher: number;
    avg_order_value_with_voucher: number;
    avg_order_value_without_voucher: number;
  };
  delivery_fee_variance: {
    min: number;
    max: number;
    avg: number;
  };
  potential_savings: number; // estimated if all orders optimized
}

export interface HealthDietaryAnalytics {
  healthy_vs_indulgent_ratio: number; // healthy / total
  meal_type_distribution: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
  };
  drink_to_food_ratio: number;
  healthy_food_percentage: number;
  indulgent_food_percentage: number;
  category_health_scores: Record<string, number>; // cuisine healthiness
}

export interface PredictiveAnalytics {
  forecasted_monthly_spending: number;
  spending_trend: 'increasing' | 'decreasing' | 'stable';
  trend_percentage: number;
  predicted_next_order_days: number;
  estimated_annual_spending: number;
}

export interface AdvancedMetrics {
  customer_lifetime_value: number;
  order_efficiency_score: number; // 0-100, lower = more exploration
  brand_loyalty_score: number; // 0-100, composite metric
  spontaneity_index: number; // 0-100, variance in order times
  deal_dependency_ratio: number; // % orders with vouchers
  churn_risk_score: number; // 0-100, based on decreasing frequency
  exploration_vs_exploitation: {
    exploration_percentage: number; // % orders from new restaurants
    exploitation_percentage: number; // % orders from favorites
  };
}

export interface ComparativeMetrics {
  spending_percentile: number; // estimated based on avg spending
  order_frequency_category: string; // "Light", "Moderate", "Heavy"
  value_consciousness_score: number; // based on voucher usage and deal seeking
}

export interface Insight {
  category: 'spending' | 'voucher' | 'timing' | 'loyalty' | 'frequency' | 'optimization' | 'health' | 'prediction' | 'other';
  icon: string;
  title: string;
  description: string;
  detailedExplanation: string; // Shown in tooltip on hover
  color: string;
}

export interface FullAnalytics {
  spending: SpendingAnalytics;
  restaurants: RestaurantAnalytics;
  food: FoodAnalytics;
  patterns: PatternAnalytics;
  payments: PaymentAnalytics;
  prices: PriceAnalytics;
  behavior: OrderBehaviorAnalytics;
  diversity: DiversityAnalytics;
  timeAnalysis: TimeAnalytics;
  costOptimization: CostOptimizationAnalytics;
  healthDietary: HealthDietaryAnalytics;
  predictive: PredictiveAnalytics;
  advanced: AdvancedMetrics;
  comparative: ComparativeMetrics;
  insights: Insight[];
}
