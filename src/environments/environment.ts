// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
function getBaseUrl(val:any){
  let baseUrl;
  switch(val){
    case 'user':
      baseUrl = 'http://127.0.0.1:8860/user-service-zuul';
      break;
    case 'company':
      baseUrl = 'http://127.0.0.1:8860/company-service-zuul';
  //    baseUrl = 'http://127.0.0.1:8855';
      break;
    case 'import':
      baseUrl = 'http://127.0.0.1:8860/import-service-zuul';
      break;
    case 'exchanges':
      baseUrl = 'http://127.0.0.1:8860/exchanges-service-zuul';
      break;  
    case 'price':
      baseUrl = 'http://127.0.0.1:8860/price-service-zuul';
      break;  
    default:
      baseUrl = 'http://127.0.0.1/';  
  }
  return baseUrl;
}

export const environment = {
  production: false,
  baseUrl:'http://localhost:8855',
  getBaseUrl
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
