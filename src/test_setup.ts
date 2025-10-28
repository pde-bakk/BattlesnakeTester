import chai from 'chai';
import * as chaiHttp from 'chai-http';
import { checkForGoodResponse, getUrl } from './test_helper';

chai.use(chaiHttp);
console.log('Has chai.request:', typeof (chai as any).request);

export const expect = chai.expect;

export const chaiWithHttp = chai;

// // Extend Chai with request method for proper typing
// export const chaiWithHttp = chai as typeof chai & {
//     request: (url: string) => any;
// };

export const url: string = getUrl();

export interface MoveResponse {
    move: string;
}

// Response handler factory functions
export function expectMove(expectedMove: string, done: Mocha.Done) {
    return function (err: any, res: ChaiHttp.Response): void {
        checkForGoodResponse(err, res);
        const response: MoveResponse = JSON.parse(res.text);
        expect(response).to.have.property('move').with.equal(expectedMove);
        done();
    };
}

export function expectNotMove(done: Mocha.Done, ...forbiddenMoves: string[]) {
    return function (err: any, res: ChaiHttp.Response): void {
        checkForGoodResponse(err, res);
        const response: MoveResponse = JSON.parse(res.text);
        forbiddenMoves.forEach(move => {
            expect(response).to.have.property('move').with.not.equal(move);
        });
        done();
    };
}

export function expectAnyMove(done: Mocha.Done) {
    return function (err: any, res: ChaiHttp.Response): void {
        checkForGoodResponse(err, res);
        const response: MoveResponse = JSON.parse(res.text);
        expect(response).to.have.property('move');
        done();
    };
}

export function expectSuccess(done: Mocha.Done) {
    return function (err: any, res: ChaiHttp.Response): void {
        checkForGoodResponse(err, res);
        done();
    };
}
