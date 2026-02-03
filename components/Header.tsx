import Link from "next/link";
import Image from "next/image";
import Navitems from "@/components/Navitems";
import Userdropdown from "@/components/Userdropdown";
import MarketPulseLogo from "@/components/Marketpulselogo";

export default function Header({user} : {user: user}) {
    return (
        <header className="sticky top-0 header">
            <div className="container header-wrapper">
                <Link href="/" >
            <MarketPulseLogo/>

                </Link>
                <nav className=" hidden sm:block">
                    <Navitems/>
                </nav>

                <Userdropdown user = {user}/>
            </div>
        </header>
    );
}
