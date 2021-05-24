export interface UserDetails
{
    UserId: string,
    Email: string,
    FName: string,
    LName: string,
    AType: AccountTypes[],
    PanCard: string,
    AadharNumber: number,
    PhoneNumber: number,
    Address: string,
    City: string,
    State: string,
    Pincode: number,
    Gender: string,
    RegisteredDate: Date,
    IsAdmin: boolean ,
    ID?: string ,
    IsActive: boolean,
    CompanyName: string,
    Designation:string,
    OpenBalance: string
}

export interface AccountTypes
{
    Types: string,
    IsActive: boolean
}