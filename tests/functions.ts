import { join } from 'node:path';
import { URL } from 'node:url';

export const isNotUndefined = <T>(v: T | undefined): v is T => typeof v !== 'undefined';

export const getParsedUrl = (url: string): URL => new URL(url);

export const USE_LOCALHOST = process.env.TARGET === 'local';

export const DEV_DOMAIN = 'https://kaka.intern.dev.nav.no';
export const LOCAL_DOMAIN = 'http://localhost:8062';

export const UI_DOMAIN = USE_LOCALHOST ? LOCAL_DOMAIN : DEV_DOMAIN;

export const createApiUrl = (api: string, path: string) => `${DEV_DOMAIN}/${join('api', api, path)}`;
