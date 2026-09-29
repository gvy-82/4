export interface RadioStation {
  changeuuid: string;
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  votes: number;
  codec: string;
  bitrate: number;
  hls: number;
  lastcheckok: number;
  lastchecktime: string;
  clicktimestamp: string;
  clickcount: number;
  clicktrend: number;
}

export interface Country {
  name: string;
  stationcount: number;
  iso: string;
}

export interface EQBand {
  frequency: number;
  label: string;
  gain: number;
}
