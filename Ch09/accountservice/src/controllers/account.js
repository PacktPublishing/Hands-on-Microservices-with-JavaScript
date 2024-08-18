const accountService = require('../services/account');
//const { logger } = require('../log/logger');

const getAccountById = async (req, res) => {
    // logger.info('getAccountById method called', { accountId: req.params.id });
    const result = await accountService.getAccountById(req.params.id);

    if (result) {
        res.status(200).json({ success: true, account: mapToResponse(result) });
    } else {
        res.status(404).json({ success: false, message: 'Account not found' });
    }
};

const getAccounts = async (req, res) => {
    const result = await accountService.getAllAccounts();
    res.status(200).json({ success: true, account: result.map(x => mapToResponse(x)) });
};

const createAccount = async (req, res) => {
    const { name, number, type, status } = req.body;
    const result = await accountService.createAccount(name, number, type, status);

    res.status(201).json({
        success: true,
        Account: mapToResponse(result),
    });
};

const deleteAccountById = async (req, res) => {
    await accountService.deleteAccountById(req.params.id);

    res.status(204).json({
        success: true
    });
};

const updateAccountById = async (req, res) => {
    const result = await accountService.updateAccountById(req.params.id, req.body);
    if (result.error) {
        switch (result.code) {
            case accountService.errorCodes.NO_VALID_DATA_TO_UPDATE:
                res.status(400).json({ success: false, message: result.error });
                return;
            case accountService.errorCodes.INVALID_STATUS_CODE:
                res.status(400).json({ success: false, message: 'invalid status' });
                return;
            case accountService.errorCodes.INVALID_TYPE_CODE:
                res.status(400).json({ success: false, message: 'invalid type' });
                return;
            case accountService.errorCodes.INVALID_ACCOUNT:
                res.status(404).json({ success: false, message: 'Account not found' });
                return;
            case accountService.errorCodes.INVALID_STATE_TRANSITION:
                res.status(400).json({ success: false, message: result.error });
                return;
            case accountService.errorCodes.INVALID_TYPE_TRANSITION:
                res.status(400).json({ success: false, message: result.error });
                return;
            default:
                res.status(500).json({ success: false, message: 'internal server error' });
                return;
        }
    }

    res.status(200).json({
        success: true,
        Account: mapToResponse(result),
    });
};

//helper function to return required account fields to user
function mapToResponse(account) {
    const {
        id, name, number, type, status,
    } = account;

    return {
        id,
        name,
        number,
        type,
        status
    };
}

module.exports = {
    getAccountById,
    getAccounts,
    createAccount,
    deleteAccountById,
    updateAccountById,
};
