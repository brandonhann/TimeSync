import tzdata from 'tzdata';

export interface CityOption {
    value: string;
    label: string;
    displayLabel: string;
    displayLabel2: string;
    region: string;
}

const cityNames = Object.keys(tzdata.zones);

export const cityOptions: CityOption[] = cityNames.map(city => {
    const parts = city.split('/');
    const region = parts[0].replace(/_/g, ' ');
    const cityName = parts.pop()!.replace(/_/g, ' ');
    return { value: city, label: city, displayLabel2: `${cityName} (${region})`, displayLabel: `${region} - ${cityName}`, region };
});
