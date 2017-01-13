import React, {Component} from 'react';
import './../App.css';
var _ = require('lodash');
import plus_open from './../img/plus-open.png'
//import ReactCSSTransitionGroup from 'react-addons-css-transition-group';



class Saves extends Component {
  constructor(props) {
      super(props);
      this.state = {
          open: 0
      };
  }

  htmldecode(input){
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }

  opentext(id){

    this.setState({open: id});
    console.log('open ', id)

  }

  render() {
    const filter = this.props.currentSubreddit !== 'all' ? ( _.filter(this.props.mylinks,['data.subreddit', this.props.currentSubreddit]) ) :
    (
      this.props.mylinks
    )



     const saves = filter.map((item) =>
           <div key={item.data.id} className="saveContainer">
           { item.data.thumbnail === 'default' || item.data.thumbnail === 'self' || item.data.thumbnail === '' ? '' : <div className="saveImg"><img className="imgthumb" alt="" src={item.data.thumbnail} /></div> }
           <div className="saveContent"><a href={item.data.url ? item.data.url : item.data.link_url} target="_blank">{item.data.title ? item.data.title : item.data.link_title}</a></div>
           <div className="top-description"><img className="openimg" onClick={()=>this.opentext(item.data.id)} role="presentation" src={plus_open} /> {item.data.subreddit} | {item.data.domain ? item.data.domain : 'reddit.com'} | {item.data.author ? item.data.author : item.data.link_author }</div>

           {this.state.open === item.data.id &&
           <div dangerouslySetInnerHTML={{__html: this.htmldecode(item.data.body_html)}} />
         }

         </div>




     )

    return(

      <div>{saves}</div>

    )

  }




}


export default Saves;
