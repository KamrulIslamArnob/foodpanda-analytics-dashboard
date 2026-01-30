"use client";

import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTheme } from "next-themes";
import { useMemo } from "react";

// FoodPanda brand colors - vibrant pink palette
const CHART_COLORS = {
    rainbow: ["#ec4899", "#f43f5e", "#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"],
};

const FONT_FAMILY = "var(--font-lexend-deca), system-ui, sans-serif";

interface SpendingBreakdownChartProps {
    foodCost: number;
    deliveryFees: number;
    serviceFees: number;
}

export function SpendingBreakdownChart({ foodCost, deliveryFees, serviceFees }: SpendingBreakdownChartProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const data = useMemo(() => [
        { id: 0, value: foodCost, label: "Food", color: "#ec4899" },
        { id: 1, value: deliveryFees, label: "Delivery", color: "#f43f5e" },
        { id: 2, value: serviceFees, label: "Service", color: "#fb7185" },
    ], [foodCost, deliveryFees, serviceFees]);

    return (
        <PieChart
            series={[
                {
                    data,
                    innerRadius: "45%",
                    outerRadius: "85%",
                    paddingAngle: 3,
                    cornerRadius: 6,
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: { innerRadius: 30, additionalRadius: -10, color: "gray" },
                    valueFormatter: (value) => `৳${value.value.toLocaleString()}`,
                },
            ]}
            sx={{
                "& .MuiPieArc-root": {
                    filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
                },
                "& .MuiChartsLegend-root": {
                    fontSize: 12,
                    fill: isDark ? "#a1a1aa" : "#71717a",
                    fontFamily: FONT_FAMILY,
                },
            }}
        />
    );
}

interface MonthlySpendingChartProps {
    monthlyData: Record<string, number>;
}

export function MonthlySpendingChart({ monthlyData }: MonthlySpendingChartProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const chartData = useMemo(() => {
        const entries = Object.entries(monthlyData);
        return {
            months: entries.map(([date]) => date.slice(5)), // "2024-01" -> "01"
            values: entries.map(([, value]) => value),
        };
    }, [monthlyData]);

    return (
        <BarChart
            xAxis={[
                {
                    data: chartData.months,
                    scaleType: "band",
                    tickLabelStyle: {
                        fontSize: 11,
                        fill: isDark ? "#a1a1aa" : "#71717a",
                        fontFamily: FONT_FAMILY,
                    },
                },
            ]}
            yAxis={[
                {
                    valueFormatter: (value: number) => `৳${value}`,
                    tickLabelStyle: {
                        fontSize: 11,
                        fill: isDark ? "#a1a1aa" : "#71717a",
                        fontFamily: FONT_FAMILY,
                    },
                },
            ]}
            series={[
                {
                    data: chartData.values,
                    color: "#ec4899",
                    valueFormatter: (value) => `৳${value?.toLocaleString() ?? 0}`,
                },
            ]}
            borderRadius={8}
            sx={{
                "& .MuiBarElement-root": {
                    filter: "drop-shadow(0 2px 4px rgba(236, 72, 153, 0.3))",
                },
                "& .MuiChartsAxis-line": {
                    stroke: isDark ? "#3f3f46" : "#e4e4e7",
                },
                "& .MuiChartsAxis-tick": {
                    stroke: "transparent",
                },
            }}
            grid={{ horizontal: true }}
        />
    );
}

interface HourlyPatternChartProps {
    hourlyData: Record<string, number>;
}

export function HourlyPatternChart({ hourlyData }: HourlyPatternChartProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const chartData = useMemo(() => {
        const sortedEntries = Object.entries(hourlyData)
            .map(([hour, count]) => ({ hour: parseInt(hour), count }))
            .sort((a, b) => a.hour - b.hour);

        return {
            hours: sortedEntries.map((d) => `${d.hour}h`),
            counts: sortedEntries.map((d) => d.count),
        };
    }, [hourlyData]);

    return (
        <BarChart
            xAxis={[
                {
                    data: chartData.hours,
                    scaleType: "band",
                    tickLabelStyle: {
                        fontSize: 10,
                        fill: isDark ? "#a1a1aa" : "#71717a",
                        fontFamily: FONT_FAMILY,
                    },
                },
            ]}
            yAxis={[
                {
                    tickLabelStyle: {
                        fontSize: 11,
                        fill: isDark ? "#a1a1aa" : "#71717a",
                        fontFamily: FONT_FAMILY,
                    },
                },
            ]}
            series={[
                {
                    data: chartData.counts,
                    color: "#8b5cf6",
                    valueFormatter: (value) => `${value} orders`,
                },
            ]}
            borderRadius={6}
            sx={{
                "& .MuiBarElement-root": {
                    filter: "drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3))",
                },
                "& .MuiChartsAxis-line": {
                    stroke: isDark ? "#3f3f46" : "#e4e4e7",
                },
                "& .MuiChartsAxis-tick": {
                    stroke: "transparent",
                },
            }}
            grid={{ horizontal: true }}
        />
    );
}

interface CuisineChartProps {
    cuisineData: Record<string, number>;
}

export function CuisineChart({ cuisineData }: CuisineChartProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const data = useMemo(() => {
        return Object.entries(cuisineData).map(([name, value], index) => ({
            id: index,
            value,
            label: name,
            color: CHART_COLORS.rainbow[index % CHART_COLORS.rainbow.length],
        }));
    }, [cuisineData]);

    return (
        <PieChart
            series={[
                {
                    data,
                    innerRadius: "40%",
                    outerRadius: "80%",
                    paddingAngle: 2,
                    cornerRadius: 4,
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: { innerRadius: 30, additionalRadius: -10, color: "gray" },
                },
            ]}
            sx={{
                "& .MuiPieArc-root": {
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                },
                "& .MuiChartsLegend-root": {
                    fontSize: 11,
                    fill: isDark ? "#a1a1aa" : "#71717a",
                    fontFamily: FONT_FAMILY,
                },
            }}
        />
    );
}

interface PaymentMethodsChartProps {
    paymentData: Record<string, number>;
}

export function PaymentMethodsChart({ paymentData }: PaymentMethodsChartProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const data = useMemo(() => {
        const total = Object.values(paymentData).reduce((a, b) => a + b, 0);
        return Object.entries(paymentData).map(([name, value], index) => ({
            id: index,
            value,
            label: `${name} (${((value / total) * 100).toFixed(0)}%)`,
            color: CHART_COLORS.rainbow[index % CHART_COLORS.rainbow.length],
        }));
    }, [paymentData]);

    return (
        <PieChart
            series={[
                {
                    data,
                    outerRadius: "80%",
                    arcLabel: (item) => `${((item.value / Object.values(paymentData).reduce((a, b) => a + b, 0)) * 100).toFixed(0)}%`,
                    arcLabelMinAngle: 20,
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: { additionalRadius: -10, color: "gray" },
                },
            ]}
            sx={{
                "& .MuiPieArc-root": {
                    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))",
                },
                "& .MuiChartsLegend-root": {
                    fontSize: 12,
                    fill: isDark ? "#a1a1aa" : "#71717a",
                    fontFamily: FONT_FAMILY,
                },
                "& .MuiChartsLegend-mark": {
                    rx: 4,
                },
            }}
        />
    );
}

interface SpendingTrendChartProps {
    monthlyData: Record<string, number>;
}

export function SpendingTrendChart({ monthlyData }: SpendingTrendChartProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const chartData = useMemo(() => {
        const entries = Object.entries(monthlyData);
        return {
            months: entries.map(([date]) => date.slice(5)),
            values: entries.map(([, value]) => value),
        };
    }, [monthlyData]);

    return (
        <LineChart
            xAxis={[
                {
                    data: chartData.months,
                    scaleType: "point",
                    tickLabelStyle: {
                        fontSize: 11,
                        fill: isDark ? "#a1a1aa" : "#71717a",
                        fontFamily: FONT_FAMILY,
                    },
                },
            ]}
            yAxis={[
                {
                    valueFormatter: (value: number) => `৳${value}`,
                    tickLabelStyle: {
                        fontSize: 11,
                        fill: isDark ? "#a1a1aa" : "#71717a",
                        fontFamily: FONT_FAMILY,
                    },
                },
            ]}
            series={[
                {
                    data: chartData.values,
                    color: "#ec4899",
                    area: true,
                    showMark: true,
                    valueFormatter: (value) => `৳${value?.toLocaleString() ?? 0}`,
                },
            ]}
            sx={{
                "& .MuiAreaElement-root": {
                    fill: "url(#pinkGradient)",
                    opacity: 0.3,
                },
                "& .MuiLineElement-root": {
                    strokeWidth: 3,
                    filter: "drop-shadow(0 2px 4px rgba(236, 72, 153, 0.4))",
                },
                "& .MuiMarkElement-root": {
                    stroke: "#ec4899",
                    fill: isDark ? "#18181b" : "#ffffff",
                    strokeWidth: 2,
                },
                "& .MuiChartsAxis-line": {
                    stroke: isDark ? "#3f3f46" : "#e4e4e7",
                },
            }}
            grid={{ horizontal: true }}
        >
            <defs>
                <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.05} />
                </linearGradient>
            </defs>
        </LineChart>
    );
}

// NEW CHARTS FOR ADVANCED ANALYTICS

interface OrderSizeDistributionChartProps {
    distribution: { small: number; medium: number; large: number };
}

export function OrderSizeDistributionChart({ distribution }: OrderSizeDistributionChartProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const data = useMemo(() => [
        { id: 0, value: distribution.small, label: "Small (1-2)", color: "#10b981" },
        { id: 1, value: distribution.medium, label: "Medium (3-5)", color: "#f59e0b" },
        { id: 2, value: distribution.large, label: "Large (6+)", color: "#ef4444" },
    ], [distribution]);

    return (
        <PieChart
            series={[{
                data,
                innerRadius: "45%",
                outerRadius: "80%",
                paddingAngle: 3,
                cornerRadius: 6,
            }]}
            sx={{
                "& .MuiChartsLegend-root": { fontSize: 11, fill: isDark ? "#a1a1aa" : "#71717a", fontFamily: FONT_FAMILY }
            }}
        />
    );
}

interface SpendingByDayChartProps {
    dayData: Record<string, number>;
}

export function SpendingByDayChart({ dayData }: SpendingByDayChartProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const chartData = useMemo(() => {
        const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return {
            days: dayOrder,
            values: dayOrder.map(day => dayData[day] || 0),
        };
    }, [dayData]);

    return (
        <BarChart
            xAxis={[{
                data: chartData.days.map(d => d.slice(0, 3)),
                scaleType: "band",
                tickLabelStyle: { fontSize: 10, fill: isDark ? "#a1a1aa" : "#71717a", fontFamily: FONT_FAMILY },
            }]}
            yAxis={[{
                valueFormatter: (value: number) => `৳${value}`,
                tickLabelStyle: { fontSize: 11, fill: isDark ? "#a1a1aa" : "#71717a", fontFamily: FONT_FAMILY },
            }]}
            series={[{
                data: chartData.values,
                color: "#0ea5e9",
                valueFormatter: (value) => `৳${value?.toLocaleString() ?? 0}`,
            }]}
            borderRadius={6}
            grid={{ horizontal: true }}
        />
    );
}

interface PriceTrendChartProps {
    trendData: Record<string, number>;
}

export function PriceTrendChart({ trendData }: PriceTrendChartProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const chartData = useMemo(() => {
        const entries = Object.entries(trendData);
        return {
            months: entries.map(([date]) => date.slice(5)),
            values: entries.map(([, value]) => value),
        };
    }, [trendData]);

    return (
        <LineChart
            xAxis={[{
                data: chartData.months,
                scaleType: "point",
                tickLabelStyle: { fontSize: 10, fill: isDark ? "#a1a1aa" : "#71717a", fontFamily: FONT_FAMILY },
            }]}
            yAxis={[{
                valueFormatter: (value: number) => `৳${value.toFixed(0)}`,
                tickLabelStyle: { fontSize: 11, fill: isDark ? "#a1a1aa" : "#71717a", fontFamily: FONT_FAMILY },
            }]}
            series={[{
                data: chartData.values,
                color: "#f59e0b",
                showMark: true,
                curve: "catmullRom",
            }]}
            sx={{
                "& .MuiLineElement-root": { strokeWidth: 2 },
                "& .MuiMarkElement-root": { fill: "#f59e0b" },
            }}
            grid={{ horizontal: true }}
        />
    );
}

interface MealTypeChartProps {
    mealData: { breakfast: number; lunch: number; dinner: number; snack: number };
}

export function MealTypeChart({ mealData }: MealTypeChartProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const data = useMemo(() => [
        { id: 0, value: mealData.breakfast, label: "Breakfast", color: "#f59e0b" },
        { id: 1, value: mealData.lunch, label: "Lunch", color: "#10b981" },
        { id: 2, value: mealData.dinner, label: "Dinner", color: "#8b5cf6" },
        { id: 3, value: mealData.snack, label: "Snack", color: "#ec4899" },
    ], [mealData]);

    return (
        <PieChart
            series={[{
                data,
                innerRadius: "50%",
                outerRadius: "85%",
                paddingAngle: 2,
                cornerRadius: 5,
            }]}
            sx={{
                "& .MuiChartsLegend-root": { fontSize: 11, fill: isDark ? "#a1a1aa" : "#71717a", fontFamily: FONT_FAMILY }
            }}
        />
    );
}

interface OrderFrequencyTrendChartProps {
    frequencyData: Record<string, number>;
}

export function OrderFrequencyTrendChart({ frequencyData }: OrderFrequencyTrendChartProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const chartData = useMemo(() => {
        const entries = Object.entries(frequencyData);
        return {
            months: entries.map(([date]) => date.slice(5)),
            values: entries.map(([, value]) => value),
        };
    }, [frequencyData]);

    return (
        <LineChart
            xAxis={[{
                data: chartData.months,
                scaleType: "point",
                tickLabelStyle: { fontSize: 10, fill: isDark ? "#a1a1aa" : "#71717a", fontFamily: FONT_FAMILY },
            }]}
            yAxis={[{
                valueFormatter: (value: number) => `${value} orders`,
                tickLabelStyle: { fontSize: 11, fill: isDark ? "#a1a1aa" : "#71717a", fontFamily: FONT_FAMILY },
            }]}
            series={[{
                data: chartData.values,
                color: "#ec4899",
                area: true,
                showMark: true,
            }]}
            sx={{
                "& .MuiAreaElement-root": { fill: "rgba(236, 72, 153, 0.2)" },
                "& .MuiLineElement-root": { strokeWidth: 2.5 },
            }}
            grid={{ horizontal: true }}
        />
    );
}

interface ExplorationChartProps {
    exploration: number;
    exploitation: number;
}

export function ExplorationChart({ exploration, exploitation }: ExplorationChartProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const data = useMemo(() => [
        { id: 0, value: exploration, label: "Exploration", color: "#8b5cf6" },
        { id: 1, value: exploitation, label: "Favorites", color: "#ec4899" },
    ], [exploration, exploitation]);

    return (
        <PieChart
            series={[{
                data,
                innerRadius: "55%",
                outerRadius: "90%",
                paddingAngle: 4,
                cornerRadius: 8,
            }]}
            sx={{
                "& .MuiChartsLegend-root": { fontSize: 12, fill: isDark ? "#a1a1aa" : "#71717a", fontFamily: FONT_FAMILY }
            }}
        />
    );
}
