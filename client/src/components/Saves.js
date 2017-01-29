import React, {Component} from 'react';
import './../App.css';
var _ = require('lodash');
import {FormControl} from 'react-bootstrap';
import reddit from './../js/reddit.js';
import SavedItem from './SavedItem';
//import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Saves extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterText: ''
        };
    }

    htmldecode(input) {
        var doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }

    filterText(filterText) {
        this.setState({filterText: filterText});

    }

    opentext(id) {

        this.setState({open: id});

    }

    render() {

        // is there a filter search?
        var filter = [];
        if (this.state.filterText.length) {
            this.props.mylinks.forEach((item) => {
                if (item.data.title) {
                    if (item.data.title.toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1) {
                        filter.push(item)
                    }

                } else {
                    if (item.data.link_title) {
                        if (item.data.link_title.toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1) {
                            filter.push(item)
                        }
                    }
                }

            });
        } else {
            filter = this.props.currentSubreddit !== 'all'
                ? (_.filter(this.props.mylinks, ['data.subreddit', this.props.currentSubreddit]))
                : (this.props.mylinks)

        }

        const savedrows = [];

        filter.forEach((item) => {
            let data = reddit.normalize(item);
            savedrows.push(<SavedItem key={data.id} data={data}/>);

        })

        return (
            <div>
                <Search filterText={(e) => this.filterText(e)}/>
                <div>{savedrows}</div>
            </div>

        )

    }

}

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }


handleChange(event) {
    this.setState({value: event.target.value});
    this.props.filterText(event.target.value);

}

render() {

    return (
        <div>
            <form>
                <FormControl type="text" value={this.state.value} placeholder="Search by title..." onChange={(e) => this.handleChange(e)}/>
            </form>
        </div>
    )
}

}

export default Saves;
