import inquirer from 'inquirer';

export class GupyInquirer {

  async typeInquirer(): Promise<string> {

    const { dataType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'dataType',
        message: 'Which data do you want to retrieve?',
        choices: [
          '1✅ - Jobs Only', 
          '2✅ - Applications', 
          '3✅ - Stages', 
          '4❌ - Email Templates',
          '5❌ - Job Templates'
        ],
      },
    ]);

    return dataType.slice(0,1);

  }
}