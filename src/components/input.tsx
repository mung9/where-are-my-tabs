import * as React from 'react';

export interface InputProps {
  name?: string;
  value: string;
  className?: string;
  onChange: React.ChangeEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
  placeholder?: string;
  type?: string;
  ref?: React.RefObject<HTMLInputElement>
}
 
const Input: React.SFC<InputProps> = (props) => {
  return ( 
    <input {...props}/>
   );
}
 
export default Input;