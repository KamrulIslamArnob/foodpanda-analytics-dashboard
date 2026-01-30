"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ExternalLink, X, Loader2 } from "lucide-react";

function ImageWithLoader({ className, ...props }: React.ComponentProps<typeof Image>) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800/50">
                    <Loader2 className="h-6 w-6 animate-spin text-pink-600" />
                </div>
            )}
            <Image
                {...props}
                className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
            />
        </>
    );
}

export function TokenGuide() {
    const [isOpen, setIsOpen] = useState(true);

    const steps = [
        {
            title: "1. Log in to FoodPanda",
            description: "Go to the FoodPanda website and log in to your account.",
            image: "http://cdn.bcrypt.website/cdn/file-1769723464253-342184420.png"
        },
        {
            title: "2. Open Developer Tools",
            description: "Right-click anywhere on the page and select 'Inspect' (or press F12 / Cmd+Option+I on Mac).",
            image: "http://cdn.bcrypt.website/cdn/file-1769723444888-28416241.png"
        },
        {
            title: "3. Go to Network Tab",
            description: "In the developer tools panel, click on the 'Network' tab at the top.",
            image: "http://cdn.bcrypt.website/cdn/file-1769723428184-648505988.png"
        },
        {
            title: "4. Find a Request",
            description: "Refresh the page. Look for a request named 'verify', 'login', or similar in the list. Click on it.",
            image: "http://cdn.bcrypt.website/cdn/file-1769723405915-83144556.png"
        },
        {
            title: "5. Copy the Bearer Token",
            description: "In the 'Headers' section on the right, scroll to 'Request Headers'. Find 'Authorization' and copy the long text starting with 'Bearer'.",
            image: "http://cdn.bcrypt.website/cdn/file-1769723190464-214145295.png"
        }
    ];

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className="w-full max-w-md mx-auto mt-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center gap-2 w-full py-2 text-sm text-muted-foreground hover:text-pink-600 transition-colors"
                type="button"
            >
                <HelpCircle className="h-4 w-4" />
                <span>{isOpen ? "Hide Guide" : "How to get my token?"}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-6 pt-4 pb-8">
                            {steps.map((step, idx) => (
                                <div key={idx} className="space-y-2">
                                    <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                                        <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                            {idx + 1}
                                        </span>
                                        {step.title.substring(3)} {/* Remove number prefix since we use badge */}
                                    </h4>
                                    <p className="text-xs text-muted-foreground pl-8">
                                        {step.description}
                                    </p>
                                    <div className="pl-8 pt-1">
                                        <div
                                            className="relative rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm cursor-zoom-in group"
                                            onClick={() => setSelectedImage(step.image)}
                                        >
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10 flex items-center justify-center">
                                                <ExternalLink className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                                            </div>
                                            <ImageWithLoader
                                                src={step.image}
                                                alt={step.title}
                                                width={600}
                                                height={300}
                                                className="w-full h-auto object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Full Screen Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="relative max-w-5xl w-full max-h-[90vh] bg-transparent flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-12 right-0 md:-right-12 text-white/80 hover:text-white transition-colors"
                            >
                                <X className="h-8 w-8" />
                            </button>
                            <ImageWithLoader
                                src={selectedImage}
                                alt="Step detail"
                                width={1200}
                                height={800}
                                className="rounded-lg shadow-2xl object-contain max-h-[85vh]"
                                unoptimized
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
