// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  APIKey: "AIzaSyAd4_7yLT6NVBU_PD47ubISx111luOJVHc",
  FireBaseApiURL: "https://identitytoolkit.googleapis.com/v1/accounts:",
  FireBaseSignUp: "signUp?key=",
  FireBaseSignIn: "signInWithPassword?key=",
  FireBaseDataBase: "https://abc-retail-banking-default-rtdb.firebaseio.com/",
  AuthString: "?auth=",
  UserDataBase: "userdetails",
  UserTokenKey: "abcUserToken",
  AdminEmailId: "admin@abcretail.com",
  AccountDataBase: "accounts",
  TransactionDataBase: "transactions",
  UserRequest: "userrequest"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
