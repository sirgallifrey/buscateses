import { ipcRenderer } from 'electron';
import * as React from 'react';

export default class AnalysisResult extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.onAnalysisResult = this.onAnalysisResult.bind(this);
    this.state = {
      total: 0,
      query: '',
      error: null
    }
  }

  componentDidMount() {
    ipcRenderer.on('analysis-result', this.onAnalysisResult);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('analysis-result', this.onAnalysisResult);
  }

  onAnalysisResult(event, state) {
    console.log(state);
    if (this.props.query !== this.state.query) {
      this.setState(state);
    }
  }

  render() {
    const { total, query, error } = this.state
    if (error) {
      return (
        <div>
          <span className="text-error">{`Não foi possível conseguir um resultado com este termo.`}</span>
        </div>
      );
    }
    if (query && query.length > 0 ) {
      return (
        <div>
          <span>{`Encontrados ${total} resultados.`}</span>
          <span className={this.state.query === this.props.query ? '' : 'loading'} style={{marginLeft: '16px'}}></span>
        </div>
      );  
    }
    return (
      <div></div>
    );
  }
}
