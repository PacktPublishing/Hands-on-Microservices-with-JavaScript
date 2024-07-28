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

    it('should return the account if found by id', async () => {
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

describe('createAccount service', () => {
    let createStub;

    beforeEach(() => {
        createStub = sinon.stub(account, 'create');
    });

    afterEach(async () => {
        await createStub.restore();
    });

    it('should create a new account with correct data', async () => {
        const accountData = { name: 'Test Account', number: '1234567890', type: 'root', status: 'new' };
        const createdAccount = { _id: '123', ...accountData }; // Simulate created account

        createStub.resolves(createdAccount);

        const createdAccountResult = await accountService.createAccount(accountData.name, accountData.number, accountData.type, accountData.status);

        expect(createdAccountResult).to.deep.equal(createdAccount);
        expect(createStub.calledOnceWith(accountData)).to.be.true;
    });

    it('should handle errors from create', async () => {
        const accountData = { name: 'Test Account', number: '1234567890', type: 'root', status: 'new' };
        const expectedError = new Error('Database error');

        createStub.rejects(expectedError);

        try {
            await accountService.createAccount(accountData.name, accountData.number, accountData.type, accountData.status);
        } catch (error) {
            expect(error).to.equal(expectedError);
            expect(createStub.calledOnceWith(accountData)).to.be.true;
        }
    });
});

describe('updateAccountById service', () => {
    let findByIdStub, saveStub;

    beforeEach(() => {
        findByIdStub = sinon.stub(account, 'findById');
        saveStub = sinon.stub(account.prototype, 'save');
    });

    afterEach(async () => {
        await findByIdStub.restore();
        await saveStub.restore();
    });

    it('should return error for no data to update', async () => {
        const id = '12345';
        const updateData = {};

        const result = await accountService.updateAccountById(id, updateData);
        expect(result).to.deep.equal({
            error: 'provide at least one valid data to be updated',
            code: errorCodes.NO_VALID_DATA_TO_UPDATE,
        });
        expect(findByIdStub.calledOnceWith(id)).to.be.false;
        expect(saveStub.calledOnce).to.be.false;
    });

    it('should return error for invalid status update', async () => {
        const id = '12345';
        const updateData = { status: 'invalid_status' };

        const result = await accountService.updateAccountById(id, updateData);

        expect(result).to.deep.equal({
            error: 'invalid status for account',
            code: errorCodes.INVALID_STATUS_CODE,
        });
        expect(findByIdStub.calledOnceWith(id)).to.be.false;
        expect(saveStub.calledOnce).to.be.false;
    });

    it('should return error for invalid type update', async () => {
        const id = '12345';
        const updateData = { type: 'invalid_type' };

        const result = await accountService.updateAccountById(id, updateData);

        expect(result).to.deep.equal({
            error: 'invalid type for account',
            code: errorCodes.INVALID_TYPE_CODE,
        });
        expect(findByIdStub.calledOnceWith(id)).to.be.false;
        expect(saveStub.calledOnce).to.be.false;
    });

    it('should return error for account not found', async () => {
        const id = '54321';
        const updateData = { name: 'Updated Name' };

        findByIdStub.withArgs(id).resolves(null);

        const result = await accountService.updateAccountById(id, updateData);

        expect(result).to.deep.equal({
            error: 'account not found',
            code: errorCodes.INVALID_ACCOUNT,
        });
        expect(findByIdStub.calledOnceWith(id)).to.be.true;
        expect(saveStub.calledOnce).to.be.false;
    });

    it('should return error for invalid status transition', async () => {
        findByIdStub.resolves({
            status: 'active',
            name: 'Test Account',
            number: '123-456-7890'
        });

        const result = await accountService.updateAccountById('123', { status: 'active' });

        expect(result).to.deep.equal({
            error: `cannot update status from 'active' to 'active'`,
            code: errorCodes.INVALID_STATE_TRANSITION,
        });
    });

    it('should allow valid status transition', async () => {
        const account = {
            status: 'new',
            type: 'root',
            name: 'Test Account',
            number: '123-456-7890',
            save: saveStub,
        };

        findByIdStub.resolves(account);

        const result = await accountService.updateAccountById('123', { status: 'active' });

        expect(result).to.deep.equal(account);
        expect(account.status).to.equal('active');
        expect(saveStub.calledOnce).to.be.true;
    });

});

describe('updateAccountById - Type Transition Check', () => {
    let findByIdStub, saveStub;

    beforeEach(() => {
        findByIdStub = sinon.stub(account, 'findById');
        saveStub = sinon.stub(account.prototype, 'save');
    });

    afterEach(async () => {
        await findByIdStub.restore();
        await saveStub.restore();
    });

    it('should return error for invalid type transition', async () => {
        findByIdStub.resolves({
            status: 'active',
            type: 'root',
            save: saveStub,
        });

        const result = await accountService.updateAccountById('123', { type: 'root' });

        expect(result).to.deep.equal({
            error: `cannot update type from 'root' to 'root'`,
            code: errorCodes.INVALID_TYPE_TRANSITION,
        });
    });

    it('should allow valid type transition', async () => {
        const account = {
            status: 'active',
            type: 'root',
            name: 'old name',
            number: 'old number',
            save: saveStub,
        };

        findByIdStub.resolves(account);

        const result = await accountService.updateAccountById('123', { type: 'sub' });

        expect(result).to.deep.equal(account);
        expect(account.type).to.equal('sub');
        expect(saveStub.calledOnce).to.be.true;
    });
});