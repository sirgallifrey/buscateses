import * as React from 'react';

export default class InputField extends React.Component<any, any> {
  render () {
    return (
      <textarea className="form-input" {...this.props} autoFocus={true}></textarea>
    );
  }
}