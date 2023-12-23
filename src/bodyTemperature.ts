import axios from 'axios';

interface General {
    page: number,
    per_page: number,
    total: number,
    total_pages: number,
    data: DataItem[]
}

interface DataItem {
    id: number;
    timestamp: number;
    diagnosis: {
        id: number,
        name: string,
        severity: number
    }
    vitals: {
        bloodPressureDiastole: number;
        bloodPressureSystole: number;
        pulse: number;
        breathingRate: number;
        bodyTemperature: number;
    };
    doctor: {
        id: number;
        name: string;
    };
    userId: number;
    userName: string;
    userDob: string;
    meta: {
        height: number;
        weight: number;
    };
}


export async function bodyTemperature(doctorName: string, diagnosisId: number): Promise<number[]> {

    let temperatures: number[] = [Number.MAX_VALUE, Number.MIN_VALUE]

    let currentPage = 1;

    while (true) {
        const response = await fetchDataForPage(currentPage, doctorName, diagnosisId);
        const min = Math.min(response[1], temperatures[0])
        const max = Math.max(response[2], temperatures[1])

        temperatures.length = 0
        temperatures = [min, max]

        if (currentPage > response[0]) {
            break;
        }
        currentPage++
    }

    return temperatures
}


async function fetchDataForPage(page: number, doctorName: string, diagnosisId: number): Promise<number[]> {
    const url = `https://jsonmock.hackerrank.com/api/medical_records?page=${page}`

    const result = await axios.get(url)
    const diagnosisFound: General = result.data

    const diagnosisFiltered = diagnosisFound.data.filter(d => d.diagnosis.id === diagnosisId && d.doctor.name === doctorName)

    if (diagnosisFiltered.length === 0) return [diagnosisFound.total_pages, Number.MAX_VALUE, Number.MIN_VALUE]

    const minBodyTemperature = Math.min(...diagnosisFiltered.map(d => d.vitals.bodyTemperature))
    const maxBodyTemperature = Math.max(...diagnosisFiltered.map(d => d.vitals.bodyTemperature))

    return [diagnosisFound.total_pages, Math.trunc(minBodyTemperature), Math.trunc(maxBodyTemperature)]
}

