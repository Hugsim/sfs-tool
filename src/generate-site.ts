import { Storage } from "./storage-lib/storage";
import { readdir, mkdir, copyFile, writeFile } from "fs/promises";
import { join } from "path";

// Types based on the JSON structure we saw
import { renderIndexPage, renderLawPage, type Meta } from "./templates";

// Types based on the JSON structure we saw
// SfsMetadata is now an alias for Meta from templates, or we can just use Meta
type SfsMetadata = Meta;

const STORAGE_DIR = "./storage"; // Metadata JSONs
const TEXT_DIR = "./storage/text"; // Content (HTML/Text)
const OUTPUT_DIR = "./docs";
const ASSETS_DIR = "./src/site-assets";

function drawProgressBar(current: number, total: number) {
    const width = 30;
    const percentage = Math.min(100, Math.round((current / total) * 100));
    const filled = Math.round((width * current) / total);
    const empty = width - filled;
    const bar = "█".repeat(filled) + "-".repeat(empty);

    // Use \r to overwrite the line
    process.stdout.write(`\r[${bar}] ${percentage}% (${current}/${total})`);
}

async function main() {
    console.log("Starting static site generation...");

    // 1. Prepare Output Directory
    await mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`Cleaned/Created ${OUTPUT_DIR}`);

    // 2. Read All Metadata
    const metadataStorage = new Storage<SfsMetadata>(STORAGE_DIR);
    const keys = await metadataStorage.keys();

    if (!keys) {
        console.error("No keys found in storage!");
        return;
    }

    console.log(`Found ${keys.length} items in storage.`);
    const legislationList: any[] = [];
    const total = keys.length;
    let count = 0;

    // 3. Process each item
    for (const key of keys) {
        count++;
        // Skip text directory
        if (key === "text") continue;

        try {
            const meta = await metadataStorage.get(key);
            legislationList.push({
                id: meta.id,
                title: meta.titel,
                date: meta.datum,
            });

            // Generate Individual Page
            await generateLawPage(meta);
        } catch (e) {
            console.warn(`\nFailed to process ${key}:`, e);
        }

        // Progress updates
        if (count % 100 === 0) {
            // Clear current line before logging to avoid messing up the bar
            process.stdout.write(`\r${" ".repeat(50)}\r`);
            console.log(`Processed ${count}/${total} files...`);
        }
        drawProgressBar(count, total);
    }
    process.stdout.write("\n"); // Newline after progress bar finishes

    // Sort by date descending (newest first)
    legislationList.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    // 4. Generate Search Index (as a JS file to avoid fetching JSON separately)
    const indexContent = `window.legislationData = ${JSON.stringify(legislationList)};`;
    await writeFile(join(OUTPUT_DIR, "search-index.js"), indexContent);
    console.log("Generated search-index.js");

    // 5. Generate Landing Page
    await generateIndexPage();

    // 6. Copy Assets
    await copyFile(
        join(ASSETS_DIR, "style.css"),
        join(OUTPUT_DIR, "style.css"),
    );
    await copyFile(
        join(ASSETS_DIR, "search.js"),
        join(OUTPUT_DIR, "search.js"),
    );
    await copyFile(join(ASSETS_DIR, "theme.js"), join(OUTPUT_DIR, "theme.js"));
    console.log("Copied assets.");

    console.log("Build complete! 🚀");
}

async function generateIndexPage() {
    const html = renderIndexPage();
    await writeFile(join(OUTPUT_DIR, "index.html"), html);
}

async function generateLawPage(meta: SfsMetadata) {
    let content = "<p><em>Lagtext saknas i arkivet.</em></p>";

    // Try to read the content file
    const contentStorage = new Storage<string>(STORAGE_DIR);
    // Key format in text storage seems to be "text/{id}"
    const textKey = `text/${meta.id}`;

    if (await contentStorage.has(textKey)) {
        content = await contentStorage.get_raw(textKey);
    }

    const html = renderLawPage(meta, content);
    await writeFile(join(OUTPUT_DIR, `${meta.id}.html`), html);
}

// Run main
main().catch(console.error);
