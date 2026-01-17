import { readdir } from "node:fs/promises";
import type { BunFile } from "bun";

export class Storage<T> {
    storageFolder: string;

    constructor(storageFolder: string) {
        this.storageFolder = storageFolder;
    }

    async set(key: string, obj: T) {
        const filePath: string = `${this.storageFolder}/${key}`;
        await Bun.write(filePath, JSON.stringify(obj));
    }

    async set_raw(key: string, content: string) {
        const filePath: string = `${this.storageFolder}/${key}`;
        await Bun.write(filePath, content);
    }

    async get(key: string): Promise<T> {
        const filePath: string = `${this.storageFolder}/${key}`;
        const file: BunFile = Bun.file(filePath);
        return await file.json();
    }

    async get_raw(key: string): Promise<string> {
        const filePath: string = `${this.storageFolder}/${key}`;
        const file: BunFile = Bun.file(filePath);
        return await file.text();
    }

    async has(key: string): Promise<boolean> {
        const filePath: string = `${this.storageFolder}/${key}`;
        return await Bun.file(filePath).exists();
    }

    async keys(): Promise<string[] | null> {
        try {
            const files = await readdir(this.storageFolder, {
                withFileTypes: true,
            });
            return files
                .filter((dirent) => dirent.isFile())
                .map((dirent) => dirent.name);
        } catch (error) {
            // If directory doesn't exist or other error, return null
            return null;
        }
    }
}
