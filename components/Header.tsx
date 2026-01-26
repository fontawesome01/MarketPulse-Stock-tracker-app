import Link from "next/link";
import Image from "next/image";
import Navitems from "@/components/Navitems";
import Userdropdown from "@/components/Userdropdown";

export default function Header() {
    return (
        <header className="sticky top-0 header">
            <div className="container header-wrapper">
                <Link href="/">
                    <Image
                        src="/assets/icons/logo.png"
                        alt="market-pulse logo"
                        width={50}
                        height={50}
                        className="h-8 w-auto cursor-pointer"
                    />
                </Link>
                <nav className=" hidden sm:block">
                    <Navitems/>
                </nav>

                <Userdropdown/>
            </div>
        </header>
    );
}
