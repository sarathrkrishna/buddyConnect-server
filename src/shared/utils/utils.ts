import { UUID_REGEX } from '../const/server-constants';
import * as bcrypt from 'bcrypt';

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

export const camelToSnake = (camel: string): string => {
  return camel.replace(/\B([A-Z])/g, (match) => `_${match.toLowerCase()}`);
};

export const snakeCaseObjectTocamelCase = <RetDto>(object: unknown): RetDto => {
  const final = {} as RetDto;
  Object.keys(object).forEach((key) => {
    final[snakeToCamelcase(key)] = object[key];
  });
  return final;
};

export const isUUID = (value: string) => {
  return value.match(UUID_REGEX);
};

export const prepareUpdateQueryKeyValuesString = (datas: unknown) => {
  const valueArr: unknown[] = [];
  const returningColumnsList: string[] = [];

  const query = Object.keys(datas)
    .map((key) => {
      const columnName = camelToSnake(key);
      valueArr.push(datas[key]);
      returningColumnsList.push(columnName);
      return `${columnName} = %L`;
    })
    .join(', ');

  return {
    query,
    valueArr,
    returningColumns: returningColumnsList.join(', '),
  };
};
