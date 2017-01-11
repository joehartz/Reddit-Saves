import React, {Component} from 'react';
import './../App.css';
var _ = require('lodash');
//import ReactCSSTransitionGroup from 'react-addons-css-transition-group';



class Saves extends Component {

  render() {
    const filter = this.props.currentSubreddit !== 'all' ? ( _.filter(this.props.mylinks,['data.subreddit', this.props.currentSubreddit]) ) :
    (
      this.props.mylinks
    )

     const saves = filter.map((item) =>
           <div key={item.data.id} className="saveContainer">
           { item.data.thumbnail === 'default' || item.data.thumbnail === 'self' || item.data.thumbnail === '' ? '' : <div className="saveImg"><img className="imgthumb" alt="" src={item.data.thumbnail} /></div> }
           <div className="saveContent">[+] <a href={item.data.url} target="_blank">{item.data.title ? item.data.title : item.data.link_title}</a></div>
         </div>

         


     )

    return(

      <div>{saves}</div>

    )

  }




}


export default Saves;
