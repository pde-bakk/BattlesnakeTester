import chai from 'chai';
import chaiHttp from 'chai-http';
import s from 'sleep';

const expect = chai.expect;
chai.use(chaiHttp);

// Extend Chai with request method for proper typing
const chaiWithHttp = chai as typeof chai & {
    request: (url: string) => any;
};

interface ResponseHandler {
    (err: any, res: ChaiHttp.Response): void;
}

export function checkForGoodResponse(err: any, res: ChaiHttp.Response): void {
    expect(err).to.be.null;
    expect(res).to.have.status(200);
}

export function sendMoveRequest(url: string, requestBody: any, responseHandler: ResponseHandler): void {
    chaiWithHttp.request(url)
        .post('/move')
        .send(requestBody)
        .end(function(err: any, res: ChaiHttp.Response): void {
            console.log(res.text);
            responseHandler(err, res);
        });
    s.sleep(1);
    chaiWithHttp.request(url)
        .post('/move')
        .send(requestBody)
        .end(function(err: any, res: ChaiHttp.Response): void {
            console.log(res.text);
            responseHandler(err, res);
        });
}

export function getUrl(): string {
    // Priority: Environment variables > npm config > defaults
    const host: string = process.env.BATTLESNAKE_HOST
        || process.env.npm_config_host
        || 'localhost';

    const port: string | undefined = process.env.BATTLESNAKE_PORT
        || process.env.npm_config_port;

    console.log(`host: ${host}, port: ${port}`);

    let url = 'http://' + host;
    if (port) {
        url += ':' + port;
    }

    return url;
}
