# Autumn edition QA

Check the 63 supplied places (8 vibes, 33 food, 13 drinks, 9 unique desserts), six date ideas, duplicate Venchi as two visits, unrated Taverna Veranda, all notes, stars, and uncapped 12/10 and 100/10 ratings.

Functional coverage: wrong/correct gate password, case-insensitive password, escape prevention, lock/reopen, category filter, search punctuation, empty search, sorting with unrated last, saving/unsaving, favorites filter, reload persistence, cross-tab storage, checklist toggle/undo, date selection excluding completed dates, reroll, all-done state, dialog Escape/close/focus, spotlight links, archive and return.

Visual coverage: desktop 1440×1000 and phone 390×844; hero, cards, filtered results, date list, gate and dialog. Also narrow 320px, 200% desktop text scaling and reduced motion. Check no horizontal overflow, readable text, unclipped controls, adequate touch targets and no browser exceptions.

Off-happy-path coverage: malformed storage, storage unavailable, zero matches, no saved places, all dates completed.

## Results — September 28, 2026

- `node test_browser.cjs`: 32 checks passed using isolated Chrome and a temporary local server. Screenshots written to `/tmp/dsn-qa` by default (`DSN_QA_DIR` overrides).
- Supplemental Playwright pass: real mobile touch, native select options, two-tab heart/checklist synchronization, specific venue searches, Enter/Escape dialog behavior, and reduced-motion emulation passed.
- Visual review: opening gate, desktop/mobile hero, featured places, list controls and cards, filtered results, checklist, and date dialog. Widths 320, 390, 768, and 1440 checked; no horizontal overflow. Desktop 200% CSS zoom also checked.
- No JavaScript exceptions; syntax and whitespace checks passed.
- Hearts and checkmarks are browser-local, with graceful in-memory fallback if storage is unavailable. This site retains the existing casual client-side password gate; it is not server-side authentication.
- The previous August edition is preserved in `archive.html` with a link back to the current page.

The supplemental Playwright dependency was installed in a temporary directory and is not a site dependency. Production is static HTML/CSS/JavaScript with no build step.
