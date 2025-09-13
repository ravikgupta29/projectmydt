import Link from "next/link";
import { NavbarProps } from "../type/type";
import { usePathname } from "next/navigation";

const NavLink = ({ href, pathName, children, onClick }: NavbarProps) => {
    
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`text-md px-4 py-2 rounded-full transition duration-300 ${pathName === pathName ? "text-gray-800 font-bold bg-slate-300" : "text-black font-medium"
                }`}
        >
            {children}
        </Link>
    )


        
}

export default NavLink