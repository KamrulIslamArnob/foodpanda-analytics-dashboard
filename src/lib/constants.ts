export const paymentMethodMapping: Record<string, string> = {
    'card': 'Card',
    'creditcard': 'Card',
    'bkash': 'bKash',
    'delivery': 'Cash on Delivery',
    'payment_on_delivery': 'Cash on Delivery'
};

export function mapPaymentMethod(code: string): string {
    const lowerCode = code.toLowerCase();
    for (const [key, method] of Object.entries(paymentMethodMapping)) {
        if (lowerCode.includes(key)) return method;
    }
    return code.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export const foodCategories: Record<string, string[]> = {
    'Burger': ['burger', 'beef burger', 'chicken burger'],
    'Pizza': ['pizza'],
    'Rice/Biriyani': ['rice', 'biriyani', 'biryani', 'kacchi', 'khichuri', 'polao'],
    'Chicken': ['chicken', 'grilled chicken', 'fried chicken', 'wings'],
    'Fast Food': ['fries', 'sandwich', 'wrap', 'sub', 'shawarma', 'taco', 'nachos'],
    'Drinks': ['coke', 'pepsi', 'juice', 'water', 'drink', 'faluda', 'shake', 'smoothie', 'coffee', 'tea'],
    'Dessert': ['ice cream', 'cake', 'dessert', 'sweet', 'kulfi', 'waffle', 'donut', 'cookie', 'brownie'],
    'Pasta': ['pasta', 'spaghetti', 'lasagna', 'macaroni'],
    'Healthy': ['salad', 'soup', 'veg', 'fruit']
};
