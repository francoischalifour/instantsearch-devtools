import React from 'react';

export function getJsonItemString(
  type: string,
  _data: object,
  _itemType: string,
  itemString: string
) {
  const itemsCount = itemString.split(' ')[0];

  return (
    <span>
      {type}({itemsCount})
    </span>
  );
}
