// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCpvdIUv9lME4ew2pa4a7hCmwMm_z_bdLw",
    authDomain: "taskifyyy.firebaseapp.com",
    databaseURL: "https://taskifyyy.firebaseio.com",
    projectId: "taskifyyy",
    storageBucket: "taskifyyy.appspot.com",
    messagingSenderId: "217420154262"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
