export interface LocaleData {
  locale: string;
  timezones: Record<string, string>;
}

export interface TimezoneEntry {
  key: string;
  iana: string | undefined;
  name: string;
  display: string;
  utcOffset: number;
}

export interface DisplayOptions {
  offsetFormat?: 'GMT' | 'UTC';
}
