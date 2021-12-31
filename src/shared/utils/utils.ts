export const snakeToCamelcase = (text: string): string => {
  return text
    .split('_')
    .map((word, index) => {
      if (index !== 0) {
        return word.replace(word[0], word[0].toUpperCase());
      } else {
        return word;
      }
    })
    .join('');
};

export const snakeCaseObjectTocamelCase = <RetDto>(object: unknown): RetDto => {
  const final = {} as RetDto;
  Object.keys(object).forEach((key) => {
    final[snakeToCamelcase(key)] = object[key];
  });
  return final;
};
