(function () {
    // 1. Restore theme immediately to prevent flash
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
    ).matches;

    // Default to 'dark' if no saved preference, or whatever the user prefers
    // If we want to strictly follow system pref when no save:
    // const defaultTheme = prefersDark ? "dark" : "light";

    // But since the CSS default is light (in :root), let's stick to that unless overriden
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute("data-theme", "dark");
    }

    // 2. Expose global toggle function
    window.setTheme = function (themeName) {
        document.documentElement.setAttribute("data-theme", themeName);
        localStorage.setItem("theme", themeName);
    };
})();
