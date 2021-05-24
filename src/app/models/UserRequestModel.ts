export interface UserRequestModel{
    UserId:string,
    UserName:string,
    AppliedFor: string,
    Amount: number,
    IsActive: boolean,
    RequestedOn: Date,
    JsonId?: string,
    ApprovedOn?:Date,
    ID?: string
}