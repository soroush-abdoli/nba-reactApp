import React from 'react';
import { Link } from 'react-router-dom';
import Slick from "react-slick";

const SliderTemplates = (props) => {
    let template = null;
    const settings = {
        dots:true,
        infinite:true,
        arrows:false,
        speed:500,
        slidesToShow:1,
        slidesToScroll:1,
        ...props.settings
    }

    switch(props.type){
        case "featured":
            template = props.data.map((item,i)=>{
                return(
                    <div key={i}>
                        <div className="featured_item">
                            <div className="featured_image"
                                style={{
                                    background:`url(${item.image})`
                                }}></div>
                                <Link to={`/articles/${item.id}`}>
                                    <div className="featured_caption">
                                        {item.title}
                                    </div>
                                </Link>
                        </div>
                    </div>
                )
            })


            break;
           default: 
           template = null;
    }






    console.log(props)
    return (
        <Slick {...settings}>
            {/* <div>slide1</div>
            <div>slide2</div> */}
            {template}
        </Slick>
    );
};

export default SliderTemplates;