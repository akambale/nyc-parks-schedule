export interface ParkConfig {
  fieldID: string;
  parkID: string;
  parkName: string;
  lat: number;
  lng: number;
  zoom: number;
}

export const parks: Record<string, ParkConfig> = {
  houston: {
    fieldID: 'M120A-BASEBALL-1',
    parkID: 'M120A',
    parkName: 'William+F.+Passannante+Ballfield',
    lat: 40.727588506318085,
    lng: -74.00146162541944,
    zoom: 16,
  },
  mccarren: {
    fieldID: 'B058-ZN04-BASEBALL-2',
    parkID: 'B058',
    parkName: 'McCarren+Park',
    lat: 40.72117650729871,
    lng: -73.95483645537303,
    zoom: 18,
  },
  ericsson: {
    fieldID: 'B346-BASEBALL-1',
    parkID: 'B346',
    parkName: 'Ericsson+Playground',
    lat: 40.72018458559799,
    lng: -73.94831182312959,
    zoom: 18,
  },
};
