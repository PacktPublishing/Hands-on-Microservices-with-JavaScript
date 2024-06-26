
export class AccountApiResponse {
    success: boolean;
    account: Account;
  
    constructor(success: boolean, account: Account) {
      this.success = success;
      this.account = account;
    }
  }

interface Account {
    name: string;
    number: string;
    type: 'root' | 'sub'; // Use type alias for enum
    status: 'new' | 'active' | 'inactive' | 'blocked'; // Use type alias for enum
    createdAt: Date;
    updatedAt?: Date; // Optional updatedAt property
  }

 class Account implements Account {
    name: string;
    number: string;
    type: 'root' | 'sub';
    status: 'new' | 'active' | 'inactive' | 'blocked';
    createdAt: Date;
    updatedAt?: Date;
  }