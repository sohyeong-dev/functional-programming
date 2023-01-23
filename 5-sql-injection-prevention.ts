import { NextFunction, Request, Response } from "express";
import { filter, map, pipe, entries, isString, isArray, toArray } from "@fxts/core";
import { ParsedQs } from "qs";

const SQL_INJECTION_CHARS_REGEXP =
  /'|"|=|<|>|\(|\)|union|sp_|xp_|select|drop|union|--|#|;|cmdshell|,|\s/gi;

type QueryStringValue = string | ParsedQs | string[] | ParsedQs[] | undefined

const filterSqlInjectionChars = function recur (value: QueryStringValue): QueryStringValue {
  if (value === undefined) {
    return
  }

  if (isString(value)) {
    return pipe(
      value,
      str => str.replace(SQL_INJECTION_CHARS_REGEXP, ''),
      str => {
        if (SQL_INJECTION_CHARS_REGEXP.test(str)) {
          return recur(str)
        }

        return str
      }
    )
  }

  if (isArray(value)) {
    return pipe(
      value,
      filter(isString),
      map(recur),
      toArray
    ) as unknown as QueryStringValue
  }
  
  return value
}

export const sqlInjectionPrevention = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query = pipe(
    req.query,  // 객체의 형태
    entries,  // Object.entries() => 배열
    map(([key, value]) => [
      key,
      filterSqlInjectionChars(value)  // value 에 regular expression filter
    ]),
    Object.fromEntries  // 다시 객체를 만든다.
  )

  next()
}