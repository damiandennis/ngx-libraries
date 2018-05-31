import objectToParams from '../utils/object.to.params';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {BaseModel} from '../models/base.model';
import isJsObject from '../utils/is.js.object';
import * as _ from 'lodash';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export abstract class EndPointService {

  /**
   * Angular http library
   */
  public http: HttpClient;

  /**
   * The number of items to show per page.
   * @type {number}
   */
  public perPage = 20;

  /**
   * Current page index (perPage times the current offset)
   *
   * @type {number}
   */
  public page = 1;

  /**
   * The expandable relationships.
   *
   * @type {Array}
   */
  public expand: Array<string> = [];

  /**
   * The fields to select
   *
   * @type {Array}
   */
  public fields: Array<string> = [];

  /**
   * The filters to apply on the search.
   *
   * @type {Array}
   */
  public filters: Array<{name: string, value: string, operator?: string}> = [];

  /**
   *
   * @type {Array}
   */
  public sort: Array<{key: string, direction: string}> = [];

  /**
   * Parameters that are allowed by setParam and addParam
   * @type {Array}
   */
  public allowedParams: Array<string> = [
      'perPage',
      'page',
      'expand',
      'filters',
      'sort',
      'fields'
  ];

  /**
   * The headers to send one each request.
   * @type {Object}
   * @private
   */
  public headers: {[key: string]: string} = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  };

  /**
   * The primary key name.
   */
  public abstract primaryKey(): string;

  /**
   * Initiates each instance of the model.
   *
   * @param data The data for the model.
   */
  public abstract initModel(data: any): BaseModel;

  /**
   * Returns the base endpoint url for this service.
   */
  public abstract endPointUrl(): string;

  constructor(http: HttpClient) {
      this.http = http;
  }

  /**
   * Sets the headers for most requests.
   *
   * @returns {RequestOptions}
   * @private
   */
  public _headerOptions() {
      const headers = new HttpHeaders(this.headers);
      return { headers: headers };
  }

  /**
   * Appends headers for each request.
   *
   * @param id
   * @param value
   */
  public addHeader(id: string, value: string) {
      this.headers[id] = value;
      return this;
  }

  /**
   * Sets a single parameter.
   *
   * @param id
   * @param value
   * @returns {EndPointService}
   */
  public setParam(id: string, value: any) {
      if (typeof this[id] === 'undefined' || this.allowedParams.indexOf(id) === -1) {
          throw new Error(`Invalid parameter '${id}' set on endpoint.`);
      }
      this[id] = value;
      return this;
  }

  /**
   * Adds a parameter onto an existing parameter if its an array.
   * @param id
   * @param value
   * @returns {EndPointService}
   */
  public addParam(id: string, value: any) {
      if (this[id] !== undefined && Array.isArray(this[id])) {
          value = this[id].concat(value);
      }
      this.setParam(id, value);
      return this;
  }

  /**
   * Sets a group of parameters.
   *
   * @param params
   * @returns {EndPointService}
   */
  public setParams(params: any) {
      Object.keys(params).map((id) => {
          this.setParam(id, params[id]);
      });
      return this;
  }

  /**
   * Fetches the current filters.
   *
   * @returns {Array<{name: string, value: string, operator?: string}>}
   */
  public getFilters() {
      return this.filters;
  }

  /**
   * Converts parameters set to a string that is to be sent to the server.
   *
   * @returns {string}
   */
  public paramsToString() {
      const params = {
          'per-page': this.perPage,
          expand: this.expand.join(','),
          fields: this.fields.join(','),
          filters: this.filters.length > 0 ? this.filters : [],
          page: this.page,
          sort: this.sort.map((sort) => {
              return (sort.direction === 'DESC' ? '-' : '') + sort.key;
          }).join(',')
      };
      return objectToParams(params);
  }

  /**
   * Updates a single record.
   */
  public updateOne(id: number, params: any): any {

      const httpUrl = this.fetchEndPoint() + '/' + id + '?' + this.paramsToString();
      const body = JSON.stringify(params);
      const options = this._headerOptions();
      return this.http.patch<any>(httpUrl, body, options)
        .pipe(
          map(res => {
            return this.initModel(res);
          })
        );
  }

  /**
   * Inserts a single record.
   */
  public insertOne(params: any): any {

      const httpUrl = this.fetchEndPoint() + '?' + this.paramsToString();
      const body = JSON.stringify(params);
      const options = this._headerOptions();

      return this.http.post<any>(httpUrl, body, options)
        .pipe(
          map(res => {
            return this.initModel(res);
          })
        );
  }

  /**
   * Fetches the endpoint url.
   *
   * @returns {string}
   */
  protected fetchEndPoint() {
      return this.endPointUrl();
  }

  /**
   * Fetches a single item.
   *
   * @param id
   * @returns {Observable<Response>}
   */
  public fetchOne(id: number) {
      return this.http.get<any>(this.fetchEndPoint() + '/' + id + '?' + this.paramsToString(), this._headerOptions())
        .pipe(
          map(res => {
            return this.initModel(res);
          })
        );
  }

  /**
   * Deletes a single item
   * @param id
   * @param field
   * @returns {Observable<Response>}
   */
  public deleteOne (id: number, field: string = null) {
      let httpUrl = this.fetchEndPoint() + '/' + id;
      if (field) {
          httpUrl += '/' + field;
      }
      const options = this._headerOptions();

      return this.http.delete<any>(httpUrl, options);
  }

  /**
   * Fetches multiple items and returns as one object.
   */
  public fetchResult(): any {
      return this.http.get(this.endPointUrl() + '?' + this.paramsToString(), this._headerOptions())
          .pipe(
            map(res => {
              return {
                  payload: res.map((row: any) => {
                      return this.initModel(row);
                  })
              };
            })
          );
  }

  /**
   * Fetches multiple items and separates them into pages.
   */
  public fetchAll (id: any = null, payloadOnly = false) {

      let url = this.fetchEndPoint();
      if (id !== null) {
          url += `/${id}`;
      }
      url += '?' + this.paramsToString();
      const options = this._headerOptions();
      options['observe'] = 'response';
      return this.http.get(url, this._headerOptions())
          .pipe(
            map(res => {
              if (payloadOnly) {
                  return res.body.map((row: any) => {
                      return this.initModel(row);
                  });
              } else {
                  const data = res.body;
                  const meta = _(res.headers.toJSON())
                      .mapKeys((v: Array<any>, k: string) => {
                          return (k.charAt(0).toLowerCase() + k.slice(1)).replace(/-/g, '');
                      })
                      .mapValues((v: Array<any>) => {
                          return v.length === 1 ? v.pop() : v;
                      })
                      .assign({ // Added for backward compatibility.
                          page: res.headers.get('X-Pagination-Current-Page'),
                          pageCount: res.headers.get('X-Pagination-Page-Count'),
                          totalCount: res.headers.get('X-Pagination-Total-Count'),
                          perPage: res.headers.get('X-Pagination-Per-Page')
                      })
                      .value();
                  return {
                      meta: meta,
                      payload: isJsObject(data)
                          ? Object.keys(data).map((key: any) => this.initModel(data[key]))
                          : data.map((row: any) => this.initModel(row))
                  };
              }
            })
          );
  }

  /**
   * Fetches all data from the server using multiple requests
   * (use sparingly, if using in every circumstance change server default or if results change frequency and are not stable)
   * 'pageSizeLimit' => [1] is a hacky workaround on server to fetch all results.
   */
  public fetchComplete() {
      return new Promise((resolve, reject) => {
          this.setParam('page', 1)
              .fetchAll()
              .subscribe(
                  (data: any) => {
                      const pageCount = Number(data.meta.pageCount);
                      if (pageCount < 2) {
                          resolve(data.payload);
                      } else {
                          let pagesUpdated = 1;
                          const combinedData: Array<any> = [];
                          combinedData.fill([], 0, pageCount - 1);
                          combinedData[0] = data.payload;
                          for (let i = 1; i < pageCount; i ++) {
                              this.setParam('page', i + 1)
                                  .fetchAll()
                                  .subscribe(
                                      (data2: any) => {
                                          pagesUpdated++;
                                          combinedData[Number(data2.meta.page) - 1] = data2.payload;
                                          // We merge into one once all data is retrieved to ensure correct order.
                                          if (pagesUpdated === pageCount) {
                                              let flattenedData: Array<any> = [];
                                              combinedData.forEach((data3) => {
                                                  flattenedData = flattenedData.concat(data3);
                                              });
                                              resolve(flattenedData);
                                          }
                                      },
                                      (err) => {
                                          reject(err);
                                      }
                                  );
                          }
                      }
                  },
                  (err) => {
                      reject(err);
                  }
              );
      });
  }
}
