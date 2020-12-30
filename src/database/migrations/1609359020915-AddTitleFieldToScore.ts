import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddTitleFieldToScore1609359020915
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'scores',
      new TableColumn({
        name: 'title',
        type: 'varchar',
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('scores', 'title');
  }
}
