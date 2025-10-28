import chai from 'chai';

import s from 'sleep';
import {httpRequest} from "./test_setup";

interface ResponseHandler {
    (err: any, res: ChaiHttp.Response): void;
}

export function checkForGoodResponse(err: any, res: ChaiHttp.Response): void {
    chai.expect(err).to.be.null;
    chai.expect(res).to.have.status(200);
}

export function sendMoveRequest(url: string, requestBody: any, responseHandler: ResponseHandler): void {
    httpRequest.execute(url)
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
