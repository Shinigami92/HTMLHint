const inquirer = require('inquirer');

async function initConfiguration() {
    const answer1 = await inquirer.prompt([
        {
            type: 'list',
            name: 'source',
            message: 'How would you like to configure HTMLHint? (Use arrow keys)',
            choices: [
                { name: 'Use a popular style guide', value: 'guide' },
                { name: 'Answer questions about your style', value: 'prompt' },
                { name: 'Inspect your HTML file(s)', value: 'auto' }
            ],
            default: 'prompt'
        }
    ]);
    const answer2 = await inquirer.prompt([
        {
            type: 'list',
            name: 'htmlVersion',
            message: 'Which version of HTML do you use?',
            choices: [
                { name: 'HTML 5', value: 'html5' },
                { name: 'HTML 4.01 Transitional', value: 'html41t' },
                { name: 'HTML 4.01 Strict', value: 'html41s' },
                { name: 'HTML 4.01 Frameset', value: 'html41f' },
                { name: 'XHTML 1.1', value: 'xhtml11' },
                { name: 'XHTML 1.0 Transitional', value: 'xhtml1t' },
                { name: 'XHTML 1.0 Strict', value: 'xhtml1s' },
                { name: 'XHTML 1.0 Frameset', value: 'xhtml1f' }
            ],
            default: 'html5'
        }
    ]);
    const answer3 = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'svg',
            message: 'Are you using svg?',
            default: false
        }
    ]);
    const answer4 = await inquirer.prompt([
        {
            type: 'list',
            name: 'framework',
            message: 'Will you use a frontend framework?',
            choices: [
                { name: 'No', value: 'no' },
                { name: 'Angular', value: 'angular' },
                { name: 'AngularJS', value: 'angularjs' },
                { name: 'Vue', value: 'vue' }
            ],
            default: 'no'
        }
    ]);
    const answer5 = await inquirer.prompt([
        {
            type: 'list',
            name: 'indent',
            message: 'What style of indentation do you use?',
            choices: [{ name: 'Tabs', value: 'tab' }, { name: 'Spaces', value: 'space' }],
            default: 'tab'
        }
    ]);
    const answer6 = await inquirer.prompt([
        {
            type: 'list',
            name: 'quote',
            message: 'What quotes do you use for attribute values?',
            choices: [{ name: 'Double', value: 'double' }, { name: 'Single', value: 'single' }],
            default: 'double'
        }
    ]);
    const answer7 = await inquirer.prompt([
        {
            type: 'list',
            name: 'quote',
            message: 'What format do you want your config file to be in?',
            choices: [{ name: 'JSON', value: 'json' }, { name: 'YAML', value: 'yaml' }],
            default: 'json'
        }
    ]);
    console.info({
        ...answer1,
        ...answer2,
        ...answer3,
        ...answer4,
        ...answer5,
        ...answer6,
        ...answer7
    });
    console.log('Successfully created .htmlhintrc.json file in ...');
}

module.exports = initConfiguration;
