import inquirer from 'inquirer';

export class GupyInquirer {

  async typeInquirer(): Promise<string> {

    const { dataType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'dataType',
        message: 'Which data do you want to retrieve?',
        choices: [
          '❌ Jobs Only', 
          '✅ Jobs and Applications', 
          '❌ Stages', 
          '❌ Email Templates',
          '❌ Job Templates'
        ],
      },
    ]);

    return dataType;

  }
}