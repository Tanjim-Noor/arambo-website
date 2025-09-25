import Image from "next/image";
import { MapPin } from "lucide-react";

type CardProps = {
    img: string;
    price: number | string;
    location: string;
    bed?: number;
    bath?: number;
    area?: number | string;
    status?: string;
    tag?: string;
};

const Card = ({ img, price, location, bed, bath, area, status, tag }: CardProps) => {
    return (
        <div className="rounded-xl bg-white shadow-lg overflow-hidden">
            {/* Image container with fixed aspect ratio */}
            <div className="relative w-full h-48 lg:h-72 overflow-hidden">
                <Image
                    src={img}
                    alt="property"
                    fill
                    className="object-cover transform transition-transform duration-500 ease-in-out hover:scale-110"  // keeps aspect ratio, no distortion
                />
            </div>

            <div className="flex flex-col justify-between space-y-4 p-4">
                <p className="text-Arambo-Accent text-2xl font-bold">৳{price}</p>
                <div className="flex items-center space-x-2">
                    <MapPin size={20} className="text-Arambo-Accent" />
                    <span>{location}</span>
                </div>
                <div className="w-full rounded-full bg-[color-arambo-accent] h-1"></div>
            </div>
        </div>
    );
};

export default Card;
