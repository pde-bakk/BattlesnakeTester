import chai from 'chai';
import chaiHttp from 'chai-http';
import s from 'sleep';

chai.use(chaiHttp);
const expect = chai.expect;
const chaiWithHttp = chai as any;

interface ResponseHandler {
    (err: any, res: ChaiHttp.Response): void;
}

export function checkForGoodResponse(err: any, res: ChaiHttp.Response): void {
    expect(err).to.be.null;
    expect(res).to.have.status(200);
}

export function sendMoveRequest(url: string, requestBody: any, responseHandler: ResponseHandler): void {
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
    const host: string | undefined = process.env.npm_config_host;
    const port: string | undefined = process.env.npm_config_port;

    let url = 'http://' + host;
    if (port) {
        url += ':' + port;
    }

    return url;
}
