/**
 * Array 내장 메서드
 * map, filter, reduce 구현하기
 */

 const arr = [1, 2, 3, 4, 5];   // iterable

/**
 * map: 배열을 순회하면서 func 을 적용해서 새로운 결과 값을 담은 배열을 리턴한다.
 * func: (el) => value
 */
const map = (func, iter) => {
    const result = []

    for (const el of iter) {
        result.push(func(el))
    }

    return result
}

console.log(map((el) => el * 2, arr));

/**
 * filter: 배열을 순회하면서 func 의 truthy 값(조건에 맞는 값)만 배열에 담아 리턴한다.
 * func: (el) => truthy | falsy
 */
const filter = (func, iter) => {
    const result = []

    for (const el of iter) {
        if (func(el)) {
            result.push(el)
        }
    }

    return result
}

console.log(filter((el) => el % 2 === 1, arr));

/**
 * reduce: 배열을 순회면서 func 을 반복 적용해서 새로운 결과 값을 얻어낸다. (쪼개는 함수)
 * func: (acc, el) => acc
 * func: (prev, curr) => acc
 */
const reduce = (func, acc, iter) => {
    if (iter === undefined) {
        iter = acc[Symbol.iterator]()   // iterator
        acc = iter.next().value
    }

    for (const el of iter) {
        acc = func(acc, el)
    }

    return acc
}

console.log(reduce((prev, curr) => prev + curr, 0, arr));
console.log(reduce((prev, curr) => prev + curr, arr));

const sum2 = arr.filter(el => el % 2 === 1).map(el => el * 2).reduce((acc, el) => acc + el)
 console.log(sum2);

 

/**
 * 함수의 합성, pipe
 * 순회 가능한 객체를 받아서 함수의 파이프라인을 타고 최종 결과값을 리턴한다.
 */
const pipe = (iter, ...functions) => {
    reduce((prev, func) => func(prev), iter, functions)
}

pipe(
    arr,
    arr => filter(el => el % 2 === 1, arr),
    arr => map(el => el * 2, arr),
    arr => reduce((prev, curr) => prev + curr, arr),
    result => console.log(result)
)