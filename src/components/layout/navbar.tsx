import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { BarChart3 } from "lucide-react";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between mx-auto px-4 md:px-8">
                <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
                    <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    <span className="font-bold sm:inline-block hidden">
                        FoodPanda Analytics
                    </span>
                    <span className="font-bold sm:hidden">
                        FPA
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
