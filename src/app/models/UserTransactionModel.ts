export interface UserTransactionModel{
    FromAccountID: string,
    FromUserName: string,
    FromAccountNumber?: string,
    ToAccountID?: string,
    ToUserName: string,
    ToAccountNumber?: string,
    TransferedAmount: number,
    TransferedOn: Date,
    TransactionID?: string
    IsSuccess: boolean,
    TransactionId: string,
    TYPE? : string
}