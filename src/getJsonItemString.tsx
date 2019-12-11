import React from 'react';

export function getJsonItemString(
  type: string,
  _data: object,
  _itemType: string,
  itemString: string
) {
  return (
    <span>
      {type}({itemString.split(' ')[0]})
    </span>
  );
}
