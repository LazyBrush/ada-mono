import { boardIndexAtCoord } from "./board-functional";

describe("Board Functional", () => {
    const sampleCoord = {
        x: 3,
        y: 1
    };
    let result: number;

    beforeAll(() => {
        result = boardIndexAtCoord(sampleCoord);
    })

    it("boardIndexAtCoord should return correct value for sample", () => {
        expect(result).toEqual(11);
    })
    it("boardIndexAtCoord should return correct value for 2nd example", () => {
        expect(boardIndexAtCoord({x:5,y:0})).toEqual(5);
    })

});