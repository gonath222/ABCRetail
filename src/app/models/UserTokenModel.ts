export class UserTokenModel {

    constructor(public email: string,
        public userId: string,
        public userName: string,
        public isAdmin: boolean,
        public jsonId: string | undefined,
        public token: string,
        public tokenExpirationDate: Date) { }
}