import {Injectable} from '@angular/core';
import objectToParams from '../utils/object.to.params';
import {BehaviorSubject} from 'rxjs';
import {BaseModel} from '../models/base.model';
import {Observable} from 'rxjs';
import {AuthRequestInterface} from '../interfaces/auth-request.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export abstract class AuthService {

    public http: HttpClient;
    public user: BehaviorSubject<BaseModel|boolean> = new BehaviorSubject(null);
    protected _headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

    /**
     * Returns a model that represents a user of the system (usually UserModel).
     *
     * @param data
     */
    protected abstract userModel(data: any): BaseModel;

    /**
     * Returns the session url.
     */
    protected abstract sessionUrl(): string;

    /**
     * Returns the session params to send at session url.
     */
    protected abstract sessionParams(): {expand: string};

    /**
     * Returns the auth url.
     */
    protected abstract authUrl(): string;

    /**
     * Returns the payload to send to the auth url.
     *
     * @param params
     */
    protected abstract authParams(params: any): AuthRequestInterface;

    /**
     * Adds header
     *
     * @param key
     * @param value
     * @returns {AuthService}
     */
    public addHeader(key: string, value: string) {
        this._headers[key] = value;
        return this;
    }

    /**
     * Authenticates the user...
     *
     * @param username
     * @param password
     * @returns {Observable<Response>}
     */
    public authenticate(username: string, password: string): Observable<Response> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const options = { headers: headers };
        const body = this.authParams({
            username,
            password
        });

        // Fetch token from api.
        return this.http.post<any>(this.authUrl(), objectToParams(body), options);
    }

    /**
    * Fetches the data for the user.
    *
    * @returns {Observable<BaseModel|boolean>}
    */
    public async fetchSession(): Observable<BaseModel|boolean> {

        const headers = new HttpHeaders(this._headers);
        const options = { headers: headers };
        const body = objectToParams(this.sessionParams());
        const userDetails =  await this.http.get<any>(this.sessionUrl() + '?' + body, options);

        return userDetails
          .pipe(
            map((data: any) => {
              let user: BaseModel = null;
              // Logged in?
              if (data.id !== undefined) {
                user = this.setIdentity(data);
              } else {
                user = false;
                this.user.next(user);
              }

              return user;
            })
          );
    }

    /**
     * The data that was fetched from the server.
     * @param data
     */
    protected setIdentity(data: any) {
        const user = this.userModel(data);
        this.user.next(user);
        return user;
    }

    /**
     * Logs the current user out of the system.
     */
    public logOut(): void {
        this.user.next(false);
    }

}
