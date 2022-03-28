import https, {RequestOptions} from 'https';
import http, {OutgoingHttpHeaders} from 'http';

interface BaseOptions {
  hostname: string;
  port: number;
  headers: OutgoingHttpHeaders;
}

export class RestAPI {
  private baseOptions: BaseOptions;
  private request: typeof http.request | typeof https.request;

  constructor(host: string, bearerToken?: string) {
    const separeted = host.replace(/(:\/\/|:)/g, '#');
    const splited = separeted.split('#');

    if (splited[0] === 'http') {
      this.request = http.request;

      if (!splited[2]) splited[2] = '80';
    } else this.request = https.request;

    this.baseOptions = {
      hostname: splited[1],
      port: splited[2] ? parseInt(splited[2]) : 443,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
    };
  }

  public setAuthorization(auth: string) {
    this.baseOptions.headers = {
      ...this.baseOptions.headers,
      Authorization: auth,
    };
  }

  public setContentType(contentType: string) {
    this.baseOptions.headers = {
      ...this.baseOptions.headers,
      'Content-Type': contentType,
    };
  }

  public get(endpoint: string) {
    const options: RequestOptions = {
      ...this.baseOptions,
      path: endpoint,
      method: 'GET',
    };

    return this.alterRequest(options);
  }

  public post(endpoint: string, body: object) {
    const options: RequestOptions = {
      ...this.baseOptions,
      path: endpoint,
      method: 'POST',
    };

    return this.alterRequest(options, body);
  }

  public patch(endpoint: string, body: object) {
    const options: RequestOptions = {
      ...this.baseOptions,
      path: endpoint,
      method: 'PATCH',
    };

    return this.alterRequest(options, body);
  }

  public put(endpoint: string, body: object) {
    const options: RequestOptions = {
      ...this.baseOptions,
      path: endpoint,
      method: 'PUT',
    };

    return this.alterRequest(options, body);
  }

  public delete(endpoint: string, body?: object) {
    const options: RequestOptions = {
      ...this.baseOptions,
      path: endpoint,
      method: 'DELETE',
    };

    return this.alterRequest(options, body);
  }

  public async alterRequest(options: RequestOptions, body?: object) {
    try {
      const result = await new Promise((resolve, reject) => {
        const req = this.request(options, (response) => {
          const resCode = response.statusCode || 500;
          let data = '';

          response.on('data', (chunk) => {
            data += chunk;
          });
          response.on('end', () => {
            const parsed = JSON.parse(data);

            if (resCode >= 400 && resCode < 600)
              reject({code: resCode, data: parsed});
            else resolve(parsed);
          });
        });

        if (body) req.write(JSON.stringify(body));

        req.on('error', (error) => reject(error));
        req.end();
      });

      return result;
    } catch (err) {
      console.log(err, '<<< error');
    }
  }
}
