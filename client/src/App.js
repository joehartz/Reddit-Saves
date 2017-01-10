import React, {Component} from 'react';
import './App.css';
import Results from './components/Results.js';

// my stuff
import reddit from './js/reddit.js';

// It all starts here ...  YAY!
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            username: '',
            data: []
        };
    }

    componentDidMount() {
        // get the access token....
        reddit.getAccessToken((data) => {
            // set the acces toksn for later use
            reddit.setAccesToken(data.access_code);

            // set the username
            reddit.username = data.username;
            this.setState({username: data.username, auth: true})
        });

    }

    render() {
        const auth = this.state.auth;
        return (
            <div className="App">
                <div className="App-header">
                    <h1>The Reddit Saves App</h1>
                    <h4>Easily manage your Reddit saves! Click the button below to grant access to this application. It will connect to your reddit account and display your saves by category.</h4>
                    <div className="login">

                         {auth ? <h4>Hello, {this.state.username}</h4> :   <button>
                               <a href={reddit.getAuthURL()}>Authenticate With Reddit</a>
                           </button> }
                    </div>
                </div>

                <div>
                    {auth
                        ? (<Results />)
                        : ''}

                </div>
            </div>
        );
    }
}


export default App;
