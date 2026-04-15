const fs = require('fs');
const path = require('path');

// 获取命令行参数
const inputFile = process.argv[2];
if (!inputFile) {
    console.log('用法: node extract_names.js <xml文件路径>');
    console.log('示例: node extract_names.js src/main/webapp/stencils/alibaba_cloud.xml');
    process.exit(1);
}

// 生成输出文件名（输入文件名 + _names.txt）
const inputBasename = path.basename(inputFile, '.xml');
const outputFile = `${inputBasename}_names.txt`;

// 读取XML文件
const content = fs.readFileSync(inputFile, 'utf-8');

// 提取所有shape的name属性（排除shapes根元素）
const shapeRegex = /<shape\s[^>]*name="([^"]+)"/g;
const matches = [];
let match;
while ((match = shapeRegex.exec(content)) !== null) {
    matches.push(match[1]);
}

// 获取shapes的name作为前缀
const shapesMatch = content.match(/<shapes\s+name="([^"]+)"/);
const prefix = shapesMatch ? shapesMatch[1] : inputBasename;

// 转换并输出
const results = matches.map(name => {
    // 转为小写，空格和连字符替换为下划线
    const converted = name.toLowerCase().replace(/[\s-]/g, '_');
    return `${prefix}.${converted}`;
});

// 写入文件
fs.writeFileSync(outputFile, results.join('\n'), 'utf-8');

console.log(`共提取 ${results.length} 个图标名称 -> ${outputFile}`);
