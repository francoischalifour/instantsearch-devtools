export function getObjectWithoutEmptyValues(obj: object): object {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];

    if (
      (Array.isArray(value) && value.length === 0) ||
      value === undefined ||
      Object.keys(value).length === 0
    ) {
      return acc;
    }

    acc[key] = value;

    return acc;
  }, {});
}
