import { NextFunction, Request, Response } from "express";
import { map, pipe, entries, isString } from "@fxts/core";
import { ParsedQs } from "qs";

const SQL_INJECTION_CHARS_REGEXP =
  /'|"|=|<|>|\(|\)|union|sp_|xp_|select|drop|union|--|#|;|cmdshell|,|\s/gi;

type QueryStringValue = string | ParsedQs | string[] | ParsedQs[] | undefined

const filterSqlInjectionChars = function (value: QueryStringValue): QueryStringValue {
  if (value === undefined) {
    return
  }

  if (isString(value)) {
    return value.replace(SQL_INJECTION_CHARS_REGEXP, '')
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