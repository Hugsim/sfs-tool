document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const lawList = document.getElementById("law-list");

    // legislationData is loaded from search-index.js which defines it as a global const
    // We expect window.legislationData to be available.

    if (!searchInput || !lawList) return;

    // Safety check
    if (typeof window.legislationData === "undefined") {
        console.error("Data not loaded");
        lawList.innerHTML = "<li>Error loading data.</li>";
        return;
    }

    const allLaws = window.legislationData;

    function renderList(items) {
        // Limit to 50 items for performance
        const displayItems = items.slice(0, 50);

        lawList.innerHTML = displayItems
            .map(
                (law) => `
            <li class="law-item">
                <a href="${law.id}.html" class="law-title">${law.title || "Utan rubrik"}</a>
                <div class="law-meta">SFS ${law.id.replace("sfs-", "").replace("-", ":")}</div>
                <div class="law-meta">${law.date}</div>
            </li>
        `
            )
            .join("");

        if (items.length > 50) {
            lawList.innerHTML += `<li style="text-align: center; padding: 1rem; color: var(--muted-text);">...och ${items.length - 50} till. Sök för att filtrera.</li>`;
        }
    }

    // Initial render
    renderList(allLaws);

    // Search handler
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();

        if (!query) {
            renderList(allLaws);
            return;
        }

        const filtered = allLaws.filter((law) => {
            const titleMatch = (law.title || "").toLowerCase().includes(query);
            const idMatch = law.id.toLowerCase().includes(query);
            // Also partial match on human readable SFS id like "1999:123"
            const humanId = law.id.replace("sfs-", "").replace("-", ":");
            const humanIdMatch = humanId.includes(query);

            return titleMatch || idMatch || humanIdMatch;
        });

        renderList(filtered);
    });
});
