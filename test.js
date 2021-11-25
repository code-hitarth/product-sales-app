const date = new Date("2021-11-25T06:27:06.644Z")
const yesterday = date.setDate(date.getDate() - 1)
const a = new Date(yesterday).toDateString()
const moment = require('moment');

// console.log(a);





// console.log(new Date(date).toDateString())
// const findlastWeeksDate = (date) => {
//     const yesterday = date.setDate(date.getDate() - 7)
//     const getYesterdayDate = new Date(yesterday).toDateString()
//     return getYesterdayDate;
// }



// console.log(findlastWeeksDate(date));

const calcPercentage = (a, b) => {
    if (a > b) {
        console.log("a should be greater than b")
    }
    else {
        const c = (b - a) / b
        console.log(c * 100)
    }
}

calcPercentage(120, 200)
calcPercentage(80, 200)
calcPercentage(150, 200)
