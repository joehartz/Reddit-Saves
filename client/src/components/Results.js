import React, {Component} from 'react';
import './../App.css';
var _ = require('lodash');
// react bootsstrap
import {Grid, Row, Col, ProgressBar} from 'react-bootstrap';

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
            currentSubreddit: 'all',
            progress: 25
        };

        this.handelSubredditChange = this.handelSubredditChange.bind(this);
    }
    componentDidMount() {
        // we can ge the saves here...
        reddit.getSaves(() => {
          this.setState({progress: this.state.progress + 35});

          if(reddit.fetching === false) {

            // make subreddit array
            var sb = _(reddit.saves).groupBy('data.subreddit').map((items, name) => ({name, count: items.length})).value();

            var subredits = _.orderBy(sb, 'count', 'desc');

           // set state
           this.setState({subreddits:subredits, data: reddit.saves});

            console.log('Done fetching results');


            // set progress to 100%
            this.setState({progress: 100});

          } else {
            this.setState({progress: this.state.progress + 35});

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

                {this.state.data.length > 0 ?
                                 <Grid>
                                  <Row className="show-grid" >
                                    <Col className="subReddits" md={3}>
                                      <ListSubreddits count={this.state.data.length} handelSubredditChange={this.handelSubredditChange} subreddits={this.state.subreddits} /></Col>
                                    <Col className="displaySaves" md={9}>
                                      <Saves mylinks={this.state.data} currentSubreddit={this.state.currentSubreddit} /></Col>
                                  </Row>
                                </Grid> :
                      <div className="loading">
                        <ProgressBar active now={this.state.progress} />
                    </div>

                }




            </div>
        )
    }

}

export default Results;
