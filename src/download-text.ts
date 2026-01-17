import { Storage } from "./storage-lib/storage";
import type { Dokument } from "./model/RiksdagenResponse";

// Configuration
const STORAGE_DIR: string = "./storage";
const DELAY_MS: number = 200;

// Type definition for potential future formats
type DownloadFormat = "html" | "text";
const DOWNLOAD_FORMAT: DownloadFormat = "html";

const metadataStorage = new Storage<Dokument>(STORAGE_DIR);
const textStorage = new Storage<string>(STORAGE_DIR);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const keys: string[] | null = await metadataStorage.keys();

if (keys !== null) {
    console.log(`Found ${keys.length} documents in metadata storage.`);

    for (const id of keys) {
        const textKey: string = `text/${id}`;

        // Use Storage interface for checking existence
        if (await textStorage.has(textKey)) {
            // console.log(`Skipping ${id}, already downloaded.`);
            continue;
        }

        try {
            const doc: Dokument = await metadataStorage.get(id);

            let urlToFetch: string | undefined = undefined;
            if (DOWNLOAD_FORMAT === "html") {
                // Ensure protocol is present
                urlToFetch = doc.dokument_url_html.startsWith("//")
                    ? `https:${doc.dokument_url_html}`
                    : doc.dokument_url_html;
            } else {
                // Future support for text
                urlToFetch = doc.dokument_url_text.startsWith("//")
                    ? `https:${doc.dokument_url_text}`
                    : doc.dokument_url_text;
            }

            if (urlToFetch === undefined) {
                console.warn(`No URL found for ${id}`);
                continue;
            }

            const response: Response = await fetch(urlToFetch);
            if (!response.ok) {
                console.error(
                    `Failed to fetch ${id}: ${response.status} ${response.statusText}`
                );
                continue;
            }

            const content: string = await response.text();

            // Use Storage interface to write raw text (bypassing JSON stringify)
            await textStorage.set_raw(textKey, content);
            console.log(`Downloaded ${id}`);

            await sleep(DELAY_MS);
        } catch (error) {
            console.error(`Error processing ${id}:`, error);
        }
    }
} else {
    console.error("Failed to list keys from storage.");
}
