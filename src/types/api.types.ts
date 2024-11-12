export type ApiEnvironment = 'LOCAL' | 'LAN' | 'NGROK';

export interface ApiConfig {
    baseURL: string;
    environment: ApiEnvironment;
}