/**
 * f의 두 개의 인수를 커링하는 헬퍼 함수
 * 커링 변환을 하는 curry(f) 함수
 * curriedSum(1)같은 함수가 호출되었을 때, 그 인수는 렉시컬 환경에 저장이 되고 새로운 래퍼 function(b)이 반환됩니다
 */
const curry = f => {
  return function (a) {
    return function (b) {
      return f(a, b)
    }
  }
}

// usage
const sum = (a, b) => a + b
console.log(sum.length);    // 함수의 길이 = 함수 인수 갯수

const curriedSum = curry(sum);

console.log(curriedSum(1)(2));
console.log(curriedSum(1));

/**
 * 함수의 평가시점 미루기, curry
 * @param {*} func 
 * @returns 
 */

const curry2 = func => {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args)
    }
    return function pass(...args2) {
      return curried.apply(this, args.concat(args2))
    }
  }
}

/**
 * 커링을 이용해서 로직을 더 간단하게 나타내기
 * 고정된 길이(=2)의 함수들만 사용 가능
 */

const curry3 = func => (a, ...args) => {
  console.log(args.length, func.length);
  return args.length >= func.length - 1 ? func(a, ...args) : (...args) => {
    console.log("a:", a);
    console.log("args:", args);
    return func(a, ...args)
  }
}

const map = curry3((func, iter) => {
  const result = []

  for (const el of iter) {
    result.push(func(el))
  }

  return result
})

const filter = curry3((func, iter) => {
  const result = []

  for (const el of iter) {
    if (func(el)) {
      result.push(el)
    }
  }

  return result
})

const reduce = curry3((func, acc, iter) => {
  if (iter === undefined) {
    iter = acc[Symbol.iterator]()   // iterator
    acc = iter.next().value
  }

  for (const el of iter) {
    acc = func(acc, el)
  }

  return acc
})

const pipe = (iter, ...functions) => {
  console.log("iter:", iter);
  return reduce((prev, func) => {
    console.log("prev:", prev);
    return func(prev)
  }, iter, functions)
}

const arr = [1, 2, 3, 4, 5];

pipe(
  arr,
  arr => filter(el => el % 2 === 1)(arr),
  arr => map(el => el * 2)(arr),
  arr => reduce((prev, curr) => prev + curr)(arr),
  result => console.log(result)
)

console.log("==========")

pipe(
  arr,
  filter(el => el % 2 === 1),
  map(el => el * 2),
  reduce((prev, curr) => prev + curr),
  console.log
)

/**
 * 첫 번째 filter(el => el % 2 === 1) 을 호출할 때 func를 렉시컬 환경에 기억하고 래퍼를 반환합니다
 * ...
 * pipe => reduce 가 호출됩니다
 * 래퍼가 prev와 함께 호출됩니다 -> 원래의 함수에 전달됩니다.
 * ...
 */

const people = [
  {
    name: 'jenny',
    age: 30,
    city: 'seoul',
  },
  {
    name: 'jenifer',
    age: 20,
    city: 'seoul',
  },
  {
    name: 'chris',
    age: 15,
    city: 'tokyo',
  },
  {
    name: 'dave',
    age: 40,
    city: 'london',
  },
];

pipe(
  people,
  filter((person) => person.city === 'seoul'),
  map((person) => person.name),
  console.log,
)

const add = (a, b) => a + b;

pipe(
  people,
  filter((person) => person.city === 'seoul'),
  map((person) => person.age),
  reduce(add),
  console.log,
)

pipe(
  people,
  filter((person) => person.name.startsWith('j')), // j로 시작하는 이름을 가진 사람들의
  filter((person) => person.age <= 20), // 나이가 20살 이하인 사람만 데이터를 뽑아주세요
  map((person) => person.city), // 나이가 20살 이하인 사람만 데이터를 뽑아주세요
  console.log,
);