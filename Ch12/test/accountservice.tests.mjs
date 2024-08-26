import * as chai from 'chai';
import sinon from 'sinon';
const expect = chai.expect;
import * as accountService from '../src/services/account.js';
import account from '../src/models/account.js'
const { errorCodes } = accountService.default;
describe('getAccountById service', () => {
    let findByIdStub;
 
    beforeEach(() => {
        findByIdStub = sinon.stub(account, 'findById');
    });

    afterEach(async () => {
        await findByIdStub.restore();
    });

    it('should return the account if found by  id', async () => {
        const expectedAccountId = '12345';
        const expectedAccount = { name: 'Test Account', number: '123-456-7890' };
        findByIdStub.withArgs(expectedAccountId).resolves(expectedAccount);

        const account = await accountService.getAccountById(expectedAccountId);

        expect(account).to.deep.equal(expectedAccount);
        expect(findByIdStub.calledOnceWith(expectedAccountId)).to.be.true;
    });

    it('should return null if account not found', async () => {
        const expectedAccountId = '54321';
        findByIdStub.withArgs(expectedAccountId).resolves(null);

        const account = await accountService.getAccountById(expectedAccountId);

        expect(account).to.be.null;
        expect(findByIdStub.calledOnceWith(expectedAccountId)).to.be.true;
    });

    it('should rethrow errors from findById', async () => {
        const expectedAccountId = '98765';
        const expectedError = new Error('Database error');
        findByIdStub.withArgs(expectedAccountId).rejects(expectedError);

        try {
            await accountService.getAccountById(expectedAccountId);
        } catch (error) {
            expect(error).to.equal(expectedError);
            expect(findByIdStub.calledOnceWith(expectedAccountId)).to.be.true;
        }
    });
});

describe('getAllAccounts  service', () => {
    let findStub;

    beforeEach(() => {
        findStub = sinon.stub(account, 'find');
    });

    afterEach(async () => {
        await findStub.restore();
    });

    it('should return all accounts', async () => {
        const expectedAccounts = [{ name: 'Account 1' }, { name: 'Account 2' }];
        findStub.resolves(expectedAccounts);

        const accounts = await accountService.getAllAccounts();

        expect(accounts).to.deep.equal(expectedAccounts);
        expect(findStub.calledOnceWith({})).to.be.true;
    });

    it('should return null if accounts is empty', async () => {
        findStub.resolves(null);

        const accounts = await accountService.getAllAccounts();

        expect(accounts).to.be.null;
        expect(findStub.calledOnceWith({})).to.be.true;
    });
});