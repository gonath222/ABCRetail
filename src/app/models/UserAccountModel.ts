export interface UserAccountModel{
    UserId: string,
    Accounts: AccountTypeValue[],
    ID?: string
}

export interface AccountTypeValue{
    AccountType: string,
    AccountValue: string,
    AccountNumber: string,
    IsActiveAccount: boolean
}