import { useEffect } from "react";
import { useLocation } from "react-router-dom";

//this function is used to scroll to top whenever someone signs in
const ScrollToTop = () =>{
    const {pathname} = useLocation();
    useEffect(()=>{
        window.scrollTo(0,0);
    },[pathname]); //useEffect when pathname is changed
    return null;
}

export default ScrollToTop;