import { Outlet } from "react-router-dom"
import { Footer, Navbar } from "../sections"


const UserLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}

export default UserLayout