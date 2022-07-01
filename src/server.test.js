import sinon from 'sinon';
import request from 'supertest';
import { expect } from 'chai';
import db from './db';
import { app } from './server';


describe('GET /users/:username', () => {
  it('sends the correct response when a user with the username is found', async () => {
    // create a test double aka fake version of getUserByUsername
    const fakeData = {
      id: '123',
      username: 'abc',
      email: 'abc@gmail.com'
    };

    // getUserByUsername, when called, will provide this fake data instead
    const stub = sinon
      .stub(db, 'getUserByUsername')
      .resolves(fakeData);

    // test how the server receives a get request at this endpoint
    await request(app).get('/users/abc')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(fakeData);

    // on the 1st call of the stub the 1st argument should be the 'abc' username
    expect(stub.getCall(0).args[0]).to.equal('abc');

    //  return the getUserByUsername method to normal (remove the stub)
    stub.restore();
  });
});
