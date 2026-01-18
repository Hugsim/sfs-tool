export interface Meta {
    id: string;
    titel: string;
    datum?: string;
    [key: string]: any;
}

const THEME_SELECTOR = `
<select onchange="window.setTheme(this.value)" style="padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-color);">
    <option value="light">Ljust läge</option>
    <option value="dark">Mörkt läge</option>
    <option value="sepia">Sepia</option>
</select>
<script>
    (function() {
        const saved = localStorage.getItem("theme");
        const sel = document.currentScript.previousElementSibling;
        if(saved) sel.value = saved;
        else if(window.matchMedia("(prefers-color-scheme: dark)").matches) sel.value = "dark";
    })();
</script>`;

export function renderIndexPage(): string {
    return `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Svensk Författningssamling (SFS)</title>
    <link rel="stylesheet" href="style.css">
    <script src="theme.js"></script>
</head>
<body>
    <div class="container">
        <header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h1><a href="index.html">Svensk Författningssamling</a></h1>
                ${THEME_SELECTOR}
            </div>
            <p>Sökbart register över svenska lagar och förordningar.</p>
        </header>
        
        <main>
            <input type="text" id="search-input" placeholder="Sök på titel, år eller SFS-nummer (t.ex. 1999:175)..." autofocus>
            
            <ul id="law-list">
                <!-- Populated by search.js -->
                <li style="text-align:center; padding: 2rem; color: #666;">Laddar register...</li>
            </ul>
        </main>
    </div>

    <script src="search-index.js"></script>
    <script src="search.js"></script>
</body>
</html>`;
}

export function renderLawPage(meta: Meta, content: string): string {
    return `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${meta.titel} - SFS ${meta.id}</title>
    <link rel="stylesheet" href="style.css">
    <script src="theme.js"></script>
</head>
<body>
    <div class="container">
        <a href="index.html" class="back-link">← Tillbaka till sök</a>
        
        <header>
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h1>${meta.titel}</h1>
                ${THEME_SELECTOR}
            </div>
            <div class="meta-info">
                <span><strong>SFS:</strong> ${meta.id.replace("sfs-", "").replace("-", ":")}</span> •
                <span><strong>Utfärdad:</strong> ${meta.datum}</span>
            </div>
        </header>

        <main class="law-content">
            ${content}
        </main>
        
        <footer style="margin-top: 3rem; border-top: 1px solid #ccc; padding-top: 1rem; color: #666; font-size: 0.8rem;">
            <p>Källa: data.riksdagen.se</p>
        </footer>
    </div>
</body>
</html>`;
}
