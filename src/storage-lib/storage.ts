import type { BunFile } from "bun";

export class Storage<T> {
    storageFolder: string

    constructor(storageFolder: string) {
        this.storageFolder = storageFolder;
    }

    async set(key: string, obj: T) {
        const filePath: string = `${this.storageFolder}/${key}`;
        await Bun.write(filePath, JSON.stringify(obj));
    }

    async get(key: string): Promise<T> {
        const filePath: string = `${this.storageFolder}/${key}`;
        const file: BunFile = Bun.file(filePath);
        return await file.json();
    }
}