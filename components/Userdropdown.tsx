'use client'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"
import Navitems from "@/components/Navitems"
import { useIsMobile } from "@/lib/useIsMobile"

const Userdropdown = () => {
    const router = useRouter()
    const isMobile = useIsMobile()

    const HandleSignOut = async () => {
        router.push("/SignOut")
    }

    const user = { name: "Harsh", email: "harshrajput20030101@gmail.com" }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-3 text-gray-400 hover:text-yellow-500
                     focus:outline-none focus:ring-0 focus-visible:ring-0"
                >
                    <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                            {user.name[0]}
                        </AvatarFallback>
                    </Avatar>

                    <div className="hidden sm:flex flex-col items-start">
            <span className="text-base font-medium text-gray-400">
              {user.name}
            </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="text-gray-400">
                <DropdownMenuLabel>
                    <div className="flex items-center gap-3 py-2">
                        <Avatar>
                            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                                {user.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-base font-medium">{user.name}</span>
                            <span className="text-sm">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-600" />

                <DropdownMenuItem
                    onClick={HandleSignOut}
                    className="text-gray-400 font-medium focus:bg-transparent
                     focus:text-yellow-500 cursor-pointer"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </DropdownMenuItem>
                {isMobile && (
                    <>
                        <DropdownMenuSeparator className="bg-gray-600" />
                        <nav>
                            <Navitems />
                        </nav>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Userdropdown
