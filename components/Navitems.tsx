'use client'
import React from 'react'
import {NAV_ITEMS} from "@/lib/constant";
import Link from "next/link";
import {usePathname} from "next/navigation";
import SearchCommond from "@/components/SearchCommond";

const Navitems = () => {
    const pathname = usePathname()
    const isActive =(path : string)=> {
        if(path==='/') return pathname === "/";

        return pathname.startsWith(path);
    }
    return (
        <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
        {NAV_ITEMS.map(({href,label}) => {

            // Use the command palette when the item is the Search route
            if (href === '/search') return (
                <li key="search-trigger">
                    <SearchCommond
                    renderAs ="text"
                    label="Search"
                    initialStocks={[]}
                    />
                    </li>
            )
           return  <li key={href}>
                <Link href={href} className={`hover:text-yellow-500 transition-colors 
                    ${isActive(href) ? 'text-gray-100' : ''}`}>
                    {label}
                </Link>
            </li>

        })}
        </ul>
    )
}
export default Navitems
