import { MongoClient } from 'mongodb';
import { expect } from 'chai';
import { getUserByUsername } from './db';

describe('getUserByUsername', () => {
  it('gets the correct user from the db given a username', async () => {
    const client = await MongoClient.connect(
      `mongodb://localhost:27017/TEST_DB`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    const db = client.db('TEST_DB');

    const fakeData = [{
      id: '123',
      username: 'abc',
      email: 'abc@gmail.com',
    },
    {
      id: '124',
      username: 'wrong',
      email: 'wrong@wrong.com'
    }]
    
    await db.collection('users').insertMany(fakeData);
    const actual = await getUserByUsername('abc');
    const finalDBState = await db.collection('users').find().toArray();
    await db.dropDatabase();
    
    client.close();

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
