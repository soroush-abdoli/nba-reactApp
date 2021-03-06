import React from 'react';
import {Link, withRouter} from "react-router-dom";
import FontAwesome from "react-fontawesome";
import {firebase} from "../../firebase";

const SideNavItems = (props) => {
    console.log(props)
    const Items = [
        {
            type:"options",
            icon:"home",
            text:"Home",
            link:"/",
            login: ""
        },
        {
            type:"options",
            icon:"newspaper",
            text:"News",
            link:"/news",
            login: ""
        },
        {
            type:"options",
            icon:"play",
            text:"Videos",
            link:"/videos",
            login: ""
        },
        {
            type:"options",
            icon:"sign-in-alt",
            text:"Dashboard",
            link:"/dashboard",
            login: false
        },
        {
            type:"options",
            icon:"sign-in-alt",
            text:"Sign in",
            link:"/sign-in",
            login: true
        },
        {
            type:"options",
            icon:"sign-out-alt",
            text:"Sign out",
            link:"/sign-out",
            login: false
        },
    ]


    const element = (item,i) => (
        <div key={i} className={item.type}>
                            <Link to={item.link}>
                            <FontAwesome name={item.icon} />
                                {item.text}
                            </Link>
        </div>
    )
    
    const restricted = (item,i) => {
        let template = null;
        if(props.user === null && item.login){
            template = element(item,i)
        }
        if(props.user !== null && !item.login){
            if(item.link === "/sign-out"){
                template = (
                    <div key={i} className={item.type} onClick={()=>{
                        firebase.auth().signOut()
                        .then(()=>{
                            props.history.push("/")
                        })
                    }}>
                    
                    <FontAwesome name={item.icon} />
                        {item.text}
                    
                    </div>  
                )
            }else{
                template = element(item,i)
            }
        }


        return template;
    }


    const showItems = () => {
        return Items.map((item,i)=>{
            return item.login !== "" ? 
             restricted(item,i)
            :
            element(item,i)
        })
    }


    return (
        
        <div>
            {showItems()}
        </div>
    );
};

export default withRouter(SideNavItems);