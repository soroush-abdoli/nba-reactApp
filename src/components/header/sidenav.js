import React from "react";
import SideNav from "react-simple-sidenav"; 
import SideNavItems from "./sidenavitems";
const Sidenav = (props) => {
    
   

    return(
        <SideNav
            showNav={props.showNav}
            onHideNav={props.onHideNav}
            navStyle={{
                background:"#242424",
                maxWidth:"220px"
            }}
        >


            <SideNavItems {...props}/>
        </SideNav>
    )
}

export default Sidenav;