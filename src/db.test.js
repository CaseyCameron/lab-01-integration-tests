import { expect } from 'chai';
import { afterEach } from 'mocha';
import { getUserByUsername } from './db';
import { getDatabaseData, setDatabaseData, resetDatabase } from './test-helpers';

describe('getUserByUsername', () => {
  afterEach('reset the database', async () => {
    await resetDatabase();
  });

  it('gets the correct user from the db given a username', async () => {
    const fakeData = [{
      id: '123',
      username: 'abc',
      email: 'abc@gmail.com'
    },
    {
      id: '124',
      username: 'wrong',
      email: 'wrong@wrong.com'
    }];

    await setDatabaseData('users', fakeData);
    const actual = await getUserByUsername('abc');
    const finalDBState = await getDatabaseData('users');

    const expected = {
      id: '123',
      username: 'abc',
      email: 'abc@gmail.com',
    }

    // we expect the actual value excluding the _id value it has to deep equal our expected
    expect(actual).excludingEvery('_id').to.deep.equal(expected);
    expect(finalDBState).excludingEvery('_id').to.deep.equal(fakeData);

  });
});
