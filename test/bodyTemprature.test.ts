import axios from "axios";
import { bodyTemperature } from "../src/bodyTemperature";
import value from "./mockData.json";

// Mocking axios
jest.mock('axios');


describe('bodyTemperature', () => {
    it('returns the correct temperatures', async () => {
        const doctorName = 'Dr Arnold Bullock'
        const diagnosisId = 2
        const mockedAxios = axios as jest.Mocked<typeof axios>;

        mockedAxios.get.mockResolvedValue(value);

        const result = await bodyTemperature(doctorName, diagnosisId);

        expect(result).toEqual([99, 101]);
    });


    it('returns the default values when the arguments passed do not match', async () => {
        const doctorName = 'Dr Andy'
        const diagnosisId = 2

        const mockedAxios = axios as jest.Mocked<typeof axios>;

        mockedAxios.get.mockResolvedValue(value);

        const result = await bodyTemperature(doctorName, diagnosisId);

        expect(result).toEqual([Number.MAX_VALUE, Number.MIN_VALUE]);
    });

});