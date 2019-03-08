import * as React from 'react';
import MainInputField from './components/main-input-field';
import SearchStatus from './components/search-status';
import AnalysisResult from './components/analysis-result';
import * as debounce from 'lodash.debounce';
import { ipcRenderer } from 'electron';
import classnames from 'classnames';
import ErrorAlert from './components/error-alert';

export default class App extends React.Component<any,any> {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onStartSearchIPC = this.onStartSearchIPC.bind(this);
    this.state = {
      query: '',
      searching: false
    };
  }

  analyseResult = debounce(() => ipcRenderer.send('analyse-search', this.state.query),
    300,
    { leading: true, trailing: true });

  handleChange(event) {
    let query = event.target.value;
    this.setState({ query }, this.analyseResult);
  }

  handleSubmit(e) {
    e.preventDefault();
    ipcRenderer.send('start-search', this.state.query);
  }

  componentDidMount() {
    ipcRenderer.on('start-search', this.onStartSearchIPC);
  }

  componentWillUmount() {
    ipcRenderer.removeListener('start-search', this.onStartSearchIPC);
  }

  onStartSearchIPC (event, state) {
    this.setState(state);
  }

  render() {
    return (
      <div className="container">
        <div className="column col-8 col-mx-auto">
        <div style={{paddingTop: "30px"}}>
          <h2>Bem vindo ao BuscaTeses!</h2>
          <p>Use o campo abaixo para fazer uma busca no catálogo de teses e dissertações da Capes</p>
          <ErrorAlert error={this.state.error} onClick={() => this.setState({error: null})}/>
          <form onSubmit={this.handleSubmit}>
            <div>
              <MainInputField onChange={this.handleChange} value={this.state.query}/>
              <AnalysisResult query={this.state.query}/>
            </div>
            <div>
              <button type="submit" className={
                classnames({
                  'btn btn-block btn-large': true,
                  'loading': this.state.searching 
                })
              } style={{marginTop: '30px'}} disabled={this.state.searching} onClick={this.handleSubmit}>
              Salvar</button>
            </div>
          </form>
          <br/>
          <SearchStatus/>
          </div>
        </div>
      </div>
    );
  }
}
