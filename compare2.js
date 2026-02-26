const fs = require('fs');

const tempPath = 'd:\\Games\\AI Game\\Silly Tavern Card\\Lo Than Quoc\\Ban Dich\\lo than quoc\\sillytavern-translation-card-thienmenh\\temp.json';
const basePath = 'd:\\Games\\AI Game\\Silly Tavern Card\\Lo Than Quoc\\Ban Dich\\lo than quoc\\sillytavern-translation-card-thienmenh\\data_03\\baseInfo.json';

try {
    const tempStr = fs.readFileSync(tempPath, 'utf8');
    const baseStr = fs.readFileSync(basePath, 'utf8');

    const temp = JSON.parse(tempStr);
    const base = JSON.parse(baseStr);

    let output = "# So sánh temp.json và baseInfo.json\n\n";

    function compareArrays(name, arr1, arr2) {
        const diff1 = arr1.filter(item => !arr2.includes(item));
        const diff2 = arr2.filter(item => !arr1.includes(item));
        output += `## ${name}\n`;
        if (diff1.length === 0 && diff2.length === 0) {
            output += `- Hoàn toàn giống nhau.\n\n`;
        } else {
            if (diff1.length > 0) {
                output += `- **Có trong temp.json nhưng KHÔNG có trong baseInfo.json:**\n`;
                diff1.forEach(i => output += `  - \`${i}\`\n`);
            }
            if (diff2.length > 0) {
                output += `- **Có trong baseInfo.json nhưng KHÔNG có trong temp.json:**\n`;
                diff2.forEach(i => output += `  - \`${i}\`\n`);
            }
            output += "\n";
        }
    }

    function compareObjects(name, obj1, obj2) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        const diff1 = keys1.filter(k => !keys2.includes(k));
        const diff2 = keys2.filter(k => !keys1.includes(k));

        output += `## ${name}\n`;
        let valDiffs = [];
        for (let k of keys1) {
            if (keys2.includes(k) && obj1[k] !== obj2[k]) {
                valDiffs.push(`- Key \`${k}\`: temp = ${obj1[k]}, base = ${obj2[k]}`);
            }
        }

        if (diff1.length === 0 && diff2.length === 0 && valDiffs.length === 0) {
            output += `- Hoàn toàn giống nhau.\n\n`;
        } else {
            if (diff1.length > 0) {
                output += `- **Key trị có trong temp.json nhưng KHÔNG có trong baseInfo.json:**\n`;
                diff1.forEach(i => output += `  - \`${i}\`\n`);
            }
            if (diff2.length > 0) {
                output += `- **Key có trong baseInfo.json nhưng KHÔNG có trong temp.json:**\n`;
                diff2.forEach(i => output += `  - \`${i}\`\n`);
            }
            if (valDiffs.length > 0) {
                output += `- **Trùng key nhưng khác giá trị:**\n`;
                valDiffs.forEach(v => output += `${v}\n`);
            }
            output += "\n";
        }
    }

    compareArrays('genders', temp.genders, base.genders);
    compareObjects('raceCosts', temp.raceCosts, base.raceCosts);
    compareObjects('identityCosts', temp.identityCosts, base.identityCosts);
    compareArrays('startLocations', temp.startLocations, base.startLocations);

    fs.writeFileSync('d:\\Games\\AI Game\\Silly Tavern Card\\Lo Than Quoc\\Ban Dich\\lo than quoc\\sillytavern-translation-card-thienmenh\\diff_report.md', output, 'utf8');
} catch (err) {
    console.error(err);
}
