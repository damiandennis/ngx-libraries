import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class ErrorService {

    public loginRoute = '/login';
    public errorRoute = '/500';
    public forbiddenRoute = '/403';
    public criticalMessage = 'There was a problem with server. Please try again later.';
    public forbiddenMessage = 'Your request is lacking the required permissions.';
    public unAuthorisedMessage = 'Please login and try again.';
    public validationMessage = 'There were some validation issues with your request.';

    constructor(public router: Router) {}

    /**
     * This handles critical errors responses from server.
     *
     * @param error
     */
    handleCriticalResponse(error: any) {
        alert(this.criticalMessage);
    }

    /**
     * This handles validations errors that were not caught client side.
     *
     * @param error
     */
    handleValidationResponse(error: any) {
        const messages = error.error.map((item: any) => {
            return item.message;
        });
        alert(this.validationMessage + `\n\n \u2022 ` + messages.join(`\n \u2022 `));
    }

    /**
     * Handles unauthorized access.
     *
     * @param error
     */
    handleForbiddenResponse(error: any) {
        alert(this.forbiddenMessage);
    }

    /**
     * Handles when some is required to be logged in but has not passed the router.
     *
     * @param error
     */
    handleUnAuthorisedResponse(error: any) {
        alert(this.unAuthorisedMessage);
    }

    /**
     * Generic error response.
     *
     * @param error
     * @param useRouter
     * @param lastLocation
     * @param excludeRouter
     */
    response(error: any, useRouter: boolean = false, lastLocation: any = null, excludeRouter: any = []) {

        const queryParams = <any>{};
        if (lastLocation) {
            queryParams.lastLocation = lastLocation;
        }

        if (useRouter && excludeRouter.indexOf(error.status) === -1) {
            if (error.status) {
                switch (error.status) {
                    case 422:
                        this.handleValidationResponse(error);
                        break;
                    case 401:
                        this.router.navigate([this.loginRoute]);
                        break;
                    case 403:
                        this.router.navigate([this.forbiddenRoute], {
                            skipLocationChange: true,
                            queryParams: queryParams
                        });
                        break;
                    case 500:
                      console.error(error);
                      this.router.navigate([this.errorRoute], {
                          skipLocationChange: true,
                          queryParams: queryParams
                      });
                      break;
                    default:
                      console.error(error);
                      break;
                }
            } else {
              console.error(error);
              if (excludeRouter.indexOf('no-status') === -1) {
                this.router.navigate([this.errorRoute], {
                  skipLocationChange: true,
                  queryParams: queryParams
                });
              }
            }
        } else {
            if (error.status) {
                switch (error.status) {
                    case 422:
                        this.handleValidationResponse(error);
                        break;
                    case 401:
                        this.handleUnAuthorisedResponse(error);
                        break;
                    case 403:
                        this.handleForbiddenResponse(error);
                        break;
                    default:
                    case 500:
                        this.handleCriticalResponse(error);
                        break;
                }
            } else {
                this.handleCriticalResponse(error);
            }
            console.error(error);

        }
    }
}
