import React, {Component} from 'react';
import {Badge} from 'react-bootstrap';

class ListSubreddits extends Component {
  constructor(props) {
      super(props);
      this.state = {
          active: 'all',
      };
  }

  setActive(subreddit, e) {
    // set the active state to the subreddit clicked
    this.setState({active:subreddit});
    this.props.handelSubredditChange(subreddit);
  }


    render() {

      const subreddits = this.props.subreddits.map((item) =>
        <li className="list-group-item" onClick={this.setActive.bind(this, item.name)} id={item.name} key={item.name}>{item.name}  <Badge>{item.count}</Badge></li>

      )

      return(

        <div>
          <ul className="list-group" id="subreddit-list">
            <li className="list-group-item" onClick={this.setActive.bind(this, 'all')}>All Saves</li>
            {subreddits}
          </ul>
        </div>


      )
    }

}


export default ListSubreddits;
