const fs = require('fs');

const tempPath = 'd:\\Games\\AI Game\\Silly Tavern Card\\Lo Than Quoc\\Ban Dich\\lo than quoc\\sillytavern-translation-card-thienmenh\\temp.json';
const basePath = 'd:\\Games\\AI Game\\Silly Tavern Card\\Lo Than Quoc\\Ban Dich\\lo than quoc\\sillytavern-translation-card-thienmenh\\data_03\\baseInfo.json';

try {
  const tempStr = fs.readFileSync(tempPath, 'utf8');
  const baseStr = fs.readFileSync(basePath, 'utf8');

  const temp = JSON.parse(tempStr);
  const base = JSON.parse(baseStr);

  function compareArrays(name, arr1, arr2) {
    const diff1 = arr1.filter(item => !arr2.includes(item));
    const diff2 = arr2.filter(item => !arr1.includes(item));
    if (diff1.length > 0 || diff2.length > 0) {
      console.log(`\n[${name}] Khác biệt:`);
      if (diff1.length > 0) console.log(`+ Chỉ có trong temp.json:`, diff1);
      if (diff2.length > 0) console.log(`- Chỉ có trong baseInfo.json:`, diff2);
    } else {
      console.log(`\n[${name}] Mảng hoàn toàn giống nhau.`);
    }
  }

  function compareObjects(name, obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    const diff1 = keys1.filter(k => !keys2.includes(k));
    const diff2 = keys2.filter(k => !keys1.includes(k));

    let valDiffs = [];
    for (let k of keys1) {
      if (keys2.includes(k) && obj1[k] !== obj2[k]) {
        valDiffs.push(`Khóa "${k}": temp.json = ${obj1[k]}, baseInfo.json = ${obj2[k]}`);
      }
    }

    if (diff1.length > 0 || diff2.length > 0 || valDiffs.length > 0) {
      console.log(`\n[${name}] Khác biệt:`);
      if (diff1.length > 0) console.log(`+ Khóa chỉ có trong temp.json:`, diff1);
      if (diff2.length > 0) console.log(`- Khóa chỉ có trong baseInfo.json:`, diff2);
      if (valDiffs.length > 0) {
        console.log(`~ Giá trị khác nhau ở cùng một khóa:`);
        valDiffs.forEach(v => console.log('  ' + v));
      }
    } else {
      console.log(`\n[${name}] Object hoàn toàn giống nhau.`);
    }
  }

  compareArrays('genders', temp.genders, base.genders);
  compareObjects('raceCosts', temp.raceCosts, base.raceCosts);
  compareObjects('identityCosts', temp.identityCosts, base.identityCosts);
  compareArrays('startLocations', temp.startLocations, base.startLocations);

} catch (err) {
  console.error(err);
}
