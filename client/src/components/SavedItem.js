import React, {Component} from 'react';
import './../App.css';
import plus_open from './../img/plus-open.png'

class SavedItem extends Component {
  constructor(props) {
      super(props);
      this.state = {
          open: false
      };
  }
  opentext(id) {

      this.setState({open: !this.state.open});

  }

  componentWillReceiveProps() {
    this.setState({open: false}) // close all open text snippets
  }

  htmldecode(input) {
      var doc = new DOMParser().parseFromString(input, "text/html");
      return doc.documentElement.textContent;
  }

    render() {

        return (
            <div className="saveContainer">
                <div>
                    {this.props.data.thumbnail !== false && <div className="saveImg"><img className="imgthumb" alt="" src={this.props.data.thumbnail}/></div>}
                </div>

                <div className="saveContent">
                    <a href={this.props.data.url} target="_blank">{this.props.data.title}</a>
                </div>

                <div className="top-description">
                  {this.props.data.body_html !== false && <img className="openimg" onClick={() => this.opentext(this.props.data.id)} role="presentation" src={plus_open}/>} {this.props.data.subreddit} | {this.props.data.domain} | {this.props.data.author} | {this.props.data.time}</div>
                  <div><a href={this.props.data.permalink} target="_blank">Comments</a></div>

                {this.state.open === true && <div dangerouslySetInnerHTML={{
                    __html: this.htmldecode(this.props.data.body_html)
                }}></div>}
            </div>

        )

    }

}

export default SavedItem;
