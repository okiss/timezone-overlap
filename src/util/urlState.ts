export enum URL_PARAMS {
  TIME_ZONE_A = 'tz1',
  TIME_ZONE_B = 'tz2',
}

export class URLState {
  searchParams;

  constructor() {
    this.searchParams = new URLSearchParams(window.location.search);
  }

  get(param: URL_PARAMS) {
    switch (param) {
      case URL_PARAMS.TIME_ZONE_A:
      case URL_PARAMS.TIME_ZONE_B:
        return Number(this.searchParams.get(param));
    }
  }

  saveState(state: Record<URL_PARAMS, string | number>) {
    const newParams = new URLSearchParams();
    for (const [param, value] of Object.entries(state)) {
      switch (param) {
        case URL_PARAMS.TIME_ZONE_A:
        case URL_PARAMS.TIME_ZONE_B:
          newParams.set(param, String(value));
      }
    }
    window.history.replaceState(null, '', `?${newParams.toString()}`);
    this.searchParams = newParams;
  }
}
