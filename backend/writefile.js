const fs = require('fs');

const interval = process.argv[2] || 4;
const data = [];
const cates = ['A', 'B', 'C', 'D'];
let rows, minNum;
if (interval === 4) {
    rows = 25;
    minNum = 50
} else {
    rows = 20;
    minNum = 0;
}


// 生成A、B、C、D 分区的座位数据  a plain array
for (let index = 0; index < cates.length; index++) {
    const cate = cates[index];
    for (let row = 0; row < rows; row++) {
        const colCount = minNum + row * 2;
        for (let col = 0; col < colCount; col++) {
            const item = {
                id: `${cate}-${row}-${col}`,
                row: row,
                col: col,
                interval: interval,
                x: (col * interval) + (index * interval * (rows * 2  + minNum) ),
                y: row * interval * 2,
                area: index, // 分类
                price: (row + 1) * 10,
                sold: 0 // 是否已售 1-已售 0-未售
            };
            data.push(item)
        }
    }
}

fs.writeFile('data.json', JSON.stringify(data), (err) => {
    if (err) {
        console.log(err)
        return;
    }
    console.log('data has been generated!');
});