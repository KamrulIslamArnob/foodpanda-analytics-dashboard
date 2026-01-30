import { Order, OrderItem } from "@/types";
import { mapPaymentMethod } from "@/lib/constants";

const API_URL = "https://bd.fd-api.com/api/v5/orders/order_history";
const PAGE_SIZE = 20;
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Type for raw API response order
interface RawOrderProduct {
    name?: string;
    quantity?: number;
    total_price?: number;
    price?: number;
}

interface RawOrder {
    code?: string;
    order_code?: string;
    id?: string;
    vendor?: { name?: string };
    restaurant_name?: string;
    total_value?: string | number;
    subtotal?: string | number;
    delivery_fee?: string | number;
    service_fee_total?: string | number;
    voucher?: { value?: number };
    current_status?: { message?: string };
    status?: string;
    ordered_at?: { date?: string };
    createdAt?: string;
    delivery_date?: string;
    payment_type_code?: string;
    order_products?: RawOrderProduct[];
    products?: RawOrderProduct[];
}

export const foodpandaService = {
    async fetchOrders(token: string): Promise<Order[]> {
        const headers = {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'en,en-US;q=0.9,en-GB;q=0.8',
            'authorization': `Bearer ${token}`,
            'origin': 'https://www.foodpanda.com.bd',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'x-fp-api-key': 'volo',
        };

        let allOrders: RawOrder[] = [];
        let offset = 0;

        // Safety limit to prevent infinite loops or huge fetches in guest mode
        const MAX_PAGES = 10;

        for (let i = 0; i < MAX_PAGES; i++) {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

            try {
                const response = await fetch(`${API_URL}?language_id=1&offset=${offset}&limit=${PAGE_SIZE}&item_replacement=true&include=order_products,order_details`, {
                    headers,
                    cache: 'no-store',
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.status === 401) {
                    throw new Error("Invalid or expired bearer token");
                }

                if (!response.ok) {
                    throw new Error(`Failed to fetch orders: ${response.statusText}`);
                }

                const data = await response.json();
                const items = data.data?.items;

                if (!items || !Array.isArray(items) || items.length === 0) {
                    break;
                }

                allOrders = [...allOrders, ...items];

                if (items.length < PAGE_SIZE) {
                    break;
                }

                offset += items.length;
            } catch (error: unknown) {
                clearTimeout(timeoutId);
                if (error instanceof Error && error.name === 'AbortError') {
                    throw new Error("Request timed out. Please try again.");
                }
                throw error;
            }
        }

        return this.normalizeOrders(allOrders);
    },

    normalizeOrders(rawOrders: RawOrder[]): Order[] {
        return rawOrders.map((order: RawOrder) => {
            // Extract Items
            const rawItems = order.order_products || order.products || [];
            const items: OrderItem[] = rawItems.map((p: RawOrderProduct) => ({
                name: p.name || "Unknown Item",
                quantity: p.quantity || 1,
                price: p.total_price || p.price || 0
            }));

            // Extract Voucher
            const voucher = order.voucher;
            const voucherDiscount = voucher?.value || 0;

            // Payment
            const paymentCode = order.payment_type_code || "unknown";

            return {
                id: order.code || order.order_code || order.id || `temp-${Math.random()}`,
                order_code: order.code || order.order_code || order.id || "N/A",
                restaurant_name: order.vendor?.name || order.restaurant_name || "Unknown Restaurant",
                total_value: parseFloat(String(order.total_value ?? 0)) || 0,
                subtotal: parseFloat(String(order.subtotal ?? 0)) || 0,
                delivery_fee: parseFloat(String(order.delivery_fee ?? 0)) || 0,
                service_fee: parseFloat(String(order.service_fee_total ?? 0)) || 0,
                voucher_discount: parseFloat(String(voucherDiscount ?? 0)),
                status: order.current_status?.message || order.status || "",
                date: order.ordered_at?.date || order.createdAt || order.delivery_date || new Date().toISOString(),
                items: items,
                payment_method: mapPaymentMethod(paymentCode)
            };
        });
    }
};

