
 const arr = [1, 2, 3, 4, 5];

 /**
  * 요구사항
  * 1. 홀수만 걸러주세요
  * 2. 걸러진 원소에 곱하기 2를 해주세요
  * 3. 모두 다 더해주세요
  */

 // 절차 지향: array 순회
 let sum = 0
 for (const el of arr) {
     if (el % 2 === 1) {
         sum += el * 2
     }
 }
 console.log(sum);

 // 함수형 프로그래밍
 const sum2 = arr.filter(el => el % 2 === 1).map(el => el * 2).reduce((acc, el) => acc + el)
 console.log(sum2);
