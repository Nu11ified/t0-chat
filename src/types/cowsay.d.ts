declare module 'cowsay-browser' {
    interface CowsayOptions {
        text: string;
        e?: string; // eyes
        T?: string; // tongue
        f?: string; // cowfile
        r?: boolean; // random
        n?: boolean; // no wrap
        W?: number; // wrap column
    }
    export function say(options: CowsayOptions): string;
    export function think(options: CowsayOptions): string;
} 