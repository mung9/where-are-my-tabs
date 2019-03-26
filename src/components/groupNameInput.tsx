import * as React from 'react';
import Input, { InputProps } from './input';

export interface GroupNameInputProps extends InputProps {
}

const GroupNameInput: React.SFC<GroupNameInputProps> = (props) => {
  const xProps = { ...props, maxLength: 20 };
  xProps.className += "group-name-input";

  return <Input {...xProps}></Input>;
}

export default GroupNameInput;