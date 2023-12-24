import { HTTP_INTERCEPTORS, HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import chunk from 'lodash-es/chunk';
import uniqBy from 'lodash-es/uniqBy';
import { format } from 'date-fns/format';

@Injectable()
export class FakeBackendHttpInterceptor implements HttpInterceptor {

    constructor(public httpClient: HttpClient) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): 
                Observable<HttpEvent<any>> {
        return this.handleRequests(req, next);
    }

    handleRequests(req: HttpRequest<any>, next: HttpHandler): any {
        let { url, method } = req;
        let queryParams = new URLSearchParams('');
        const segments = url.split('?');
        if (segments[1] !== undefined) {
            url = segments[0];
            queryParams = new URLSearchParams(segments[1]);
        }
        console.log({
            url, 
            method, 
            queryParams: queryParams.toString(),
            filters: queryParams.get('filters'),
            page: +queryParams.get('page'),
            perPage: +queryParams.get('per-page')
        });
        switch(url) {
            case '/v1/users/subscriptions':
                switch (method) {
                    case 'GET':
                        return this.httpClient.get('/assets/users.json')
                            .pipe(
                                map((users: any[]) => {
                                    let page: number = +queryParams.get('page') || 1;
                                    let perPage: number = +queryParams.get('per-page') || 20;
                                    let filters: any[] = queryParams.get('filters') ? JSON.parse(queryParams.get('filters')) : [];
                                    const subscriptions = uniqBy(users.map(user => {
                                        return {
                                            tierId: user.subscriptionTier,
                                            tierName: user.subscriptionTier
                                        };
                                    }), 'tierId');

                                    let subscriptionChunks = chunk(subscriptions, perPage);
                                    return new HttpResponse({ 
                                        status: 200, 
                                        headers: new HttpHeaders({
                                            'X-Pagination-Current-Page': subscriptionChunks.length > 0 ? (subscriptionChunks[page - 1] ? page : subscriptionChunks.length - 1) : 0,
                                            'X-Pagination-Page-Count': subscriptionChunks.length,
                                            'X-Pagination-Total-Count': subscriptions.length,
                                            'X-Pagination-Per-Page': perPage
                                        }),
                                        body: subscriptionChunks[page - 1] ? subscriptionChunks[page - 1] : subscriptionChunks[subscriptionChunks.length - 1] || []
                                    })
                                })
                            )
                        break;
                }
                break;
            case '/v1/users':
                switch (method) {
                    case 'GET':
                        return this.httpClient.get('/assets/users.json')
                            .pipe(
                                map((users: any[]) => {
                                    let page: number = +queryParams.get('page') || 1;
                                    let perPage: number = +queryParams.get('per-page') || 20;
                                    let filters: any[] = queryParams.get('filters') ? JSON.parse(queryParams.get('filters')) : [];
                                    const filteredUsers = users
                                        .filter((user) => {
                                            let matchesAny = true;
                                            for (let filter of filters) {
                                                if (filter.value) {
                                                    switch (filter.name) {
                                                        case 'searchField':
                                                            // for searchField we ignore the operator.
                                                            let matchesSearchFilter = user.firstName.indexOf(filter.value) !== -1 || user.lastName.indexOf(filter.value) !== -1;
                                                            if (matchesSearchFilter === false) {
                                                                matchesAny = false;
                                                            }
                                                        break;
                                                        case 'subscription':
                                                            switch (filter.operator) {
                                                                case 'IN':
                                                                    if (filter.value.length && filter.value.indexOf(user.subscriptionTier) === -1) {
                                                                        matchesAny = false;
                                                                    }
                                                                    break;
                                                            }
                                                        break;
                                                        case 'birthday':
                                                            switch (filter.operator) {
                                                                case '=':
                                                                    if (filter.value !== format(new Date(user.birthday), 'yyyy-MM-dd')) {
                                                                        matchesAny = false;
                                                                    }
                                                                    break;
                                                            }
                                                        break;
                                                    }
                                                }
                                            }
                                            return matchesAny;
                                        });
                                    let userChunks = chunk(filteredUsers, perPage);
                                    return new HttpResponse({ 
                                        status: 200, 
                                        headers: new HttpHeaders({
                                            'X-Pagination-Current-Page': userChunks.length > 0 ? (userChunks[page - 1] ? page : userChunks.length - 1) : 0,
                                            'X-Pagination-Page-Count': userChunks.length,
                                            'X-Pagination-Total-Count': filteredUsers.length,
                                            'X-Pagination-Per-Page': perPage
                                        }),
                                        body: userChunks[page - 1] ? userChunks[page - 1] : userChunks[userChunks.length - 1] || []
                                    })
                                })
                            );
                        break;
                }
                break;
            default:
                // if there is not any matches return default request.
                return next.handle(req);
                break;

        }
   }

}
/**
* Mock backend provider definition for app.module.ts provider.
*/
export const fakeBackendProvider = {
   provide: HTTP_INTERCEPTORS,
   useClass: FakeBackendHttpInterceptor,
   multi: true,
};

