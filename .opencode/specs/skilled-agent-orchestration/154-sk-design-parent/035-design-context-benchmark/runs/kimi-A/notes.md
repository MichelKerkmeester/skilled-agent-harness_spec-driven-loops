# Design notes — Bestellimieten card

## Constraints
- Single self-contained HTML file, inline CSS only.
- No external assets, no gradients, flat visual language.
- Exact card size: 560 × 480 px.
- Brand palette only.

## Layout decisions
- **Fixed card frame** with a single-pixel `var(--tint-300)` border; no shadows to keep the surface flat.
- **Header band in brand blue** establishes hierarchy immediately and anchors the Anobel identity.
- **Summary row** sits directly under the header so the three high-order numbers (total limit, total spent, remaining) are read before the table.
- **Full-width alert banner** for the overspend condition; red is reserved exclusively for alerts.
- **Table body** holds per-ship / per-location rows; sticky header keeps column labels visible if rows grow.

## Color usage
- `var(--blue)` / `var(--blue-deep)` for the header and primary brand presence.
- `var(--tint-100)` for page background, `var(--white)` for card surface, `var(--tint-200/300)` for structural rules.
- `var(--green)` only for positive remaining balances.
- `var(--red)` only for the overspend alert, the negative remaining value, and the alert row highlight (5 % tint + left border).
- `var(--gold)` used once for the near-limit row; kept rare as specified.
- `var(--text)` (`#0a1a2f`) for body text; `var(--muted)` for secondary labels.

## Typography
- Font stack leads with `"Hanken Grotesk"`, falling back to system sans-serifs for self-contained rendering without an external font request.
- Numeric values use `font-variant-numeric: tabular-nums` so columns align cleanly.
- Size scale: 20 px title, 18 px summary values, 14 px body, 12 px metadata, 10 px labels.

## Data shape
- Each row maps a location to a ship, then shows limit, spent, and remaining.
- One row is healthy, one overspent, one near-limit — covering all three requested states.
- Footer provides provenance without adding visual weight.

## Accessibility / contrast
- White text (`#fefefe`) on blue header and red alert meets high-contrast requirements.
- Body text stays on white for maximum readability.
- Alert uses both color and an icon to avoid relying on color alone.
