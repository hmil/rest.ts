import * as fs from 'fs';
import * as inquirer from 'inquirer';
import * as path from 'path';
import { cd, echo, exec } from 'shelljs';

const prompt = inquirer.createPromptModule();

function updatePackageJSON(pkgJSONLocation: string, version: string) {
    const pkgJSON = require(pkgJSONLocation);
    pkgJSON.version = version;
    if (pkgJSON.peerDependencies) {
        for (let i of Object.keys(pkgJSON.peerDependencies)) {
            if (i.startsWith('rest-ts')) {
                pkgJSON.peerDependencies[i] = `^${version}`;
            }
        }
    }
    fs.writeFileSync(pkgJSONLocation, JSON.stringify(pkgJSON, null, 4), { encoding: 'utf-8' });
}

(async () => {

    if (exec('git status --porcelain').stdout.trim() !== '') {
        echo('Your repository is dirty. Aborting');
        process.exit(1);
        return;
    }

    const { version, message } = await prompt<{version: string, message: string}>([{
        type: 'input',
        name: 'version',
        message: 'Version?',
        filter: (val) => {
        return val.toLowerCase();
        }
    }, {
        type: 'input',
        name: 'message',
        message: 'Short release message'
    }]);

    echo(`About to release ${version}: ${message}.`);

    const { proceed } = await prompt<{proceed: boolean}>([{
        type: 'confirm',
        name: 'proceed',
        message: 'Proceed?',
        default: false
    }]);

    if (proceed !== true) {
        echo('Aborting');
        process.exit(1);
        return;
    }

    updatePackageJSON('./packages/rest-ts-core/package.json', version);
    updatePackageJSON('./packages/rest-ts-axios/package.json', version);
    updatePackageJSON('./packages/rest-ts-express/package.json', version);
    exec(`make test`);
    exec(`git add -u && git commit -m "release v${version}"`);
    exec(`git tag -s -m "${message}" "v${version}"`);
    exec('git push --tags origin master');
})();
