import React, { Component } from 'react';
import {CSSTransition, TransitionGroup } from "react-transition-group";
import {firebaseTeams,firebaseArticles,firebaseLooper} from "../../../firebase";

import { Link } from 'react-router-dom';
import Buttons from "../../widgets/Buttons/buttons";
import CardInfo from "../../widgets/Cardinfo/card_info";

class NewsList extends Component {

    state = {
        teams:[],
        items:[],
        start:this.props.start,
        end:this.props.start + this.props.amount,
        amount:this.props.amount
    }
    componentWillMount(){
        this.request(this.state.start,this.state.end)
    }

    request = (start,end) =>{
        if(this.state.teams.length < 1){
            firebaseTeams.once("value")
            .then((snapshot)=>{
                const teams = firebaseLooper(snapshot)
                this.setState({
                    teams
                })
            })

            // axios.get(`${URL}/teams`)
            // .then(response=>{
            //     this.setState({
            //         teams:response.data
            //     })
            // })
        }

        firebaseArticles.orderByChild("id").startAt(start).endAt(end).once("value")
        .then((snapshot)=>{
            const articles = firebaseLooper(snapshot);
            this.setState({
                items : [...this.state.items,...articles],
                start,
                end
            })
        })
        .catch(e=>{
            console.log(e)
        })

        // axios.get(`${URL}/articles?_start=${start}&_end=${end}`)
        // .then(response=>{
        //     this.setState({
        //         items : [...this.state.items,...response.data],
        //         start,
        //         end
        //     })
        // })
    }

    loadMore = () => {
        let end = this.state.end + this.state.amount
        this.request(this.state.end + 1,end)
    }



    showNews = (type) => {

        let template = null;
        switch(type){
            case "card":
                template = this.state.items.map((item,i)=>{
                    return(
                      <CSSTransition
                        classNames={{
                            enter:"NewsList_wrapper",
                            enterActive:"NewsList_wrapper_enter"
                        }}
                        timeout={500}
                        key={i}
                      >
                        <div  className="news_card">
                            <div className="news_Item">
                                <Link to={`/articles/${item.id}`}>
                                    <CardInfo teams={this.state.teams} team={item.team} date={item.date}/>
                                    <h2>{item.title}</h2>
                                </Link>
                            </div>
                        </div>
                      </CSSTransition>
                    )
                })

                break;
            case "cardMain":
                template = this.state.items.map((item,i)=>{
                    return(
                        <CSSTransition
                        classNames={{
                            enter:"NewsList_wrapper",
                            enterActive:"NewsList_wrapper_enter"
                        }}
                        timeout={500}
                        key={i}
                      >


                          <Link to={`/articles/${item.id}`}>
                                <div className="flex_Wrapper">
                                    <div className="left" style={{background:`url('/images/articles/${item.image}')`}}>
                                        <div></div>
                                    </div>
                                    <div className="right">
                                        <CardInfo teams={this.state.teams} team={item.team} date={item.date}/>
                                        <h2>{item.title}</h2>
                                    </div>
                                </div>
                          </Link>

                      </CSSTransition>
                    )
                })
            break;
            default:
                template = null;
                    
        }


        return template;
    }


    render() {
        
        return (
            <div>
                <TransitionGroup
                    component="div"
                    className="List"
                >
                     {this.showNews(this.props.type)}
                </TransitionGroup>  
                <Buttons
                    type="loadMore"
                    loadMore={()=>this.loadMore()}
                    cta="Load More News"
                />             
                
            </div>
        );
    }
}

export default NewsList;