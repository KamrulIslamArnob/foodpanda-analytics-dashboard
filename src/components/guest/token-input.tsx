"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Key, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TokenInputProps {
    // Legacy prop for backward compatibility or client-side handling
    onTokenSubmit?: (token: string) => Promise<void>;
    // Server Action props
    action?: (payload: FormData) => void;
    isPending?: boolean;
    error?: string;
}

export function TokenInput({ onTokenSubmit, action, isPending = false, error }: TokenInputProps) {
    const [token, setToken] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (action) {
            // Let the form action handle it naturally if provided
            return;
        }
        e.preventDefault();
        if (onTokenSubmit && token.trim()) {
            await onTokenSubmit(token);
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-pink-100 shadow-xl">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-pink-100 p-3 rounded-full w-fit mb-4">
                        <Key className="h-6 w-6 text-pink-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Enter Bearer Token</CardTitle>
                    <CardDescription>
                        Paste your FoodPanda bearer token to analyze your order history.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        action={action}
                        onSubmit={action ? undefined : handleSubmit}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Input
                                name="token"
                                type="password"
                                placeholder="Bearer eyJhbGciOiJIUz..."
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="font-mono text-sm"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-pink-600 hover:bg-pink-700"
                            disabled={isPending || !token.trim()}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Fetching Data...
                                </>
                            ) : (
                                "Fetch Analytics"
                            )}
                        </Button>

                        <div className="space-y-2">
                            {error && (
                                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                                    {error}
                                </div>
                            )}

                            <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Guest Mode Info</AlertTitle>
                                <AlertDescription className="text-xs mt-1">
                                    Your token is processed locally and not stored permanently.
                                    Refreshing the page will clear all data.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
