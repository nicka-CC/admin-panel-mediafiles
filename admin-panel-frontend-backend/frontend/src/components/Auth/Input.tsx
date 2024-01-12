import React, { ChangeEventHandler, useState } from 'react';

type Props = {
    type: string,
    className: string,
    value: string,
    onChange: ChangeEventHandler,
}
function Input(props: Props) {
  const [readOnly, setReadOnly] = useState(true);
  const handleFocus = () => {
    setReadOnly(false);
  };

  return (
    <input
      type={props.type}
      readOnly={readOnly}
      onFocus={handleFocus}
      value={props.value}
      onChange={props.onChange}
      autoComplete='none'
    />
  );
}

export default Input;