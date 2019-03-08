import * as React from 'react';
import { on } from 'cluster';

export interface IErrorAlertProps {
  error: string | undefined,
  onClick: any
}

export default class ErrorAlert extends React.Component<IErrorAlertProps, any> {
  render() {
    if (!this.props.error) {
      return null;
    }
    return (
      <div className="toast toast-primary">
        <button className="btn btn-clear float-right" onClick={this.props.onClick}></button>
        {this.props.error}
      </div>
    ); 
  }
}