import React, {Component} from 'react';
import './../App.css';
var _ = require('lodash');
// react bootsstrap
import {Grid, Row, Col} from 'react-bootstrap';

// my stuff
import reddit from './../js/reddit.js';
import ListSubreddits from './../components/ListSubreddits';
import Saves from './Saves';

class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            subreddits: [],
            currentSubreddit: 'all'
        };

        this.handelSubredditChange = this.handelSubredditChange.bind(this);
    }
    componentDidMount() {
        // we can ge the saves here...
        reddit.getSaves(() => {
          if(reddit.fetching === false) {

            // make subreddit array
            var sb = _(reddit.saves).groupBy('data.subreddit').map((items, name) => ({name, count: items.length})).value();

            var subredits = _.orderBy(sb, 'count', 'desc');
           // set state
           this.setState({subreddits:subredits, data: reddit.saves});

            console.log('Done fetching results');

            // time to set the state.....

          }
        });
    }

    handelSubredditChange(currentSubreddit) {
      this.setState({currentSubreddit: currentSubreddit});
          console.log(currentSubreddit);
    }

    componentWillReceiveProps(nextProps) {
        console.log('Component will recive props...')
    }
    render() {
        return (
            <div className="results">

                {this.state.data.length > 0 ? '' :
                      <div>Loading your saves.....</div>

                }

                <Grid>
                  <Row className="show-grid" >
                    <Col className="subReddits" md={2}><ListSubreddits handelSubredditChange={this.handelSubredditChange} subreddits={this.state.subreddits} /></Col>
                    <Col className="displaySaves" md={10}><Saves mylinks={this.state.data} currentSubreddit={this.state.currentSubreddit} /></Col>
                  </Row>



                </Grid>


            </div>
        )
    }

}

export default Results;
