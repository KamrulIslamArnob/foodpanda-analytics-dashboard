import Image from 'next/image';

interface BDTIconProps {
    className?: string;
    size?: number;
}

/**
 * BDT Currency Icon Component
 * Displays the Bangladeshi Taka symbol as a small inline icon
 */
export function BDTIcon({ className = '', size = 16 }: BDTIconProps) {
    return (
        <Image
            src="/image.png"
            alt="৳"
            width={size}
            height={size}
            className={`inline-block ${className}`}
            style={{
                verticalAlign: 'middle',
                marginRight: '4px',
                marginBottom: '2px'
            }}
            unoptimized
        />
    );
}
