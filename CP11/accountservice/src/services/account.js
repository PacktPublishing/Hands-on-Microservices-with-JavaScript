const Account = require('../models/account')

//get account info by id
function getAccountById(id) {
    return Account.findById(id);
}

//get all account information
function getAllAccounts() {
    return Account.find({});
}

//create account based on name,number,type and status
function createAccount(name, number, type, status) {
    return Account.create({ number, name, type, status });
}

//delete account by account id
async function deleteAccountById(id) {
   const deletedAccount = await Account.findByIdAndDelete(id);
   if(deletedAccount)
    return true;
    else
    return false;
}

//'new', 'active', 'inactive', 'blocked'
const availableAccountStatusesForUpdate = {
    new: ['active', 'blocked'],
    active: ['inactive', 'blocked'],
    inactive: ['active'],
    blocked: ['active'],
};

//'root', 'sub'
const availableAccountTypesForUpdate = {
    root: ['sub'],
    sub: ['root'],
};

const NO_VALID_DATA_TO_UPDATE = 0;
const INVALID_STATUS_CODE = 1;
const INVALID_TYPE_CODE = 2;
const INVALID_ACCOUNT = 3;
const INVALID_STATE_TRANSITION = 4;
const INVALID_TYPE_TRANSITION = 5;

async function updateAccountById(id, { name, number, type, status }) {
    if (!name && !number && !type && !status) {
        return { error: 'provide at least one valid data to be updated', code: NO_VALID_DATA_TO_UPDATE };
    }

    if (status && !(status in availableAccountStatusesForUpdate)) {
        return { error: 'invalid status for account', code: INVALID_STATUS_CODE };
    }

    if (type && !(type in availableAccountTypesForUpdate)) {
        return { error: 'invalid type for account', code: INVALID_TYPE_CODE };
    }

    const account = await Account.findById(id);
    if (!account) {
        return { error: 'account not found', code: INVALID_ACCOUNT };
    }

    //check for available status and transition
    if (status) {
        const allowedStatuses = availableAccountStatusesForUpdate[account.status];
        if (!allowedStatuses.includes(status)) {
            return {
                error: `cannot update status from '${account.status}' to '${status}'`,
                code: INVALID_STATE_TRANSITION,
            };
        }
    }

    //check for available type and transition
    if (type) {
        const allowedTypes = availableAccountTypesForUpdate[account.type];
        if (!allowedTypes.includes(type)) {
            return {
                error: `cannot update type from '${account.type}' to '${type}'`,
                code: INVALID_TYPE_TRANSITION,
            };
        }
    }

    account.status = status ?? account.status;
    account.type = type ?? account.type;
    account.name = name ?? account.name;
    account.number = number ?? account.number;
    account.updatedAt = Date.now();

    await account.save();

    return account;
}

module.exports = {
    getAccountById,
    getAllAccounts,
    createAccount,
    updateAccountById,
    deleteAccountById,
    errorCodes: {
        NO_VALID_DATA_TO_UPDATE,
        INVALID_STATUS_CODE,
        INVALID_TYPE_CODE,
        INVALID_ACCOUNT,
        INVALID_STATE_TRANSITION,
        INVALID_TYPE_TRANSITION,
    },
};
