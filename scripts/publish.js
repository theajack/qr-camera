/*
 * @Author: chenzhongsheng
 * @Date: 2023-03-19 16:37:53
 * @Description: Coding something
 */
const {exec} = require('./utils');

async function main () {
    const version = process.argv[2];
    console.log(`Start build version=${version}`);
    await exec(`npm run build ${version}`);
    console.log(`Build success, publishing...`);
    await exec(`cd npm`);
    await exec(`npm publish`);
    console.log(`Publish success`);
}

main();
