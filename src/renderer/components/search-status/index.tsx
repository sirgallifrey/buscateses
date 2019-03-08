import { ipcRenderer } from 'electron';
import * as React from 'react';

export default class SearchStatus extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.onSearchStatus = this.onSearchStatus.bind(this);
    this.state = {
      page: 0,
      totalPages: 0,
      query: ''
    }
  }

  componentDidMount() {
    ipcRenderer.on('search-status', this.onSearchStatus);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('search-status', this.onSearchStatus);
  }

  onSearchStatus(event, state) {
    this.setState(state);
  }

  render() {
    const { page, totalPages, query } = this.state
    if (page && totalPages && query && query.length > 0) {
      return (
        <div>
          <span>{`Página ${page} de ${totalPages}`}</span>
        </div>          
      );
    }
    return (
      <div></div>
    );
  }
}
