# Origin of this Style Reference

> **No longer the stock.** Since v2.0.0.0 the corpus is derived from the evilcharts reference beside
> this one, and `--default` reads that. This capture is carried as an alternative: pass its path to
> the applicator to theme a delivery back to warm parchment and ink.

This directory is the chart corpus's own copy of the Style Reference its stock palette,
typeface and corner ladder were derived from. It is a severed copy, not a link: the style
library that produced it holds roughly twelve hundred captures and regenerates them, and a
regeneration upstream must not silently change what `--default` themes to or leave
`assets/color/palettes.json` derived from a capture that no longer exists. Re-copying is a
deliberate act with a diff.

**Captured from:** `.opencode/skills/sk-design/sk-design-md-generator/styles/library/bundles/cursor/`
**Copied:** 2026-09-09
**Copied verbatim.** `source.md` carries the upstream capture's own record of what was measured.

| File | sha256 | Read by |
|------|--------|---------|
| `DESIGN.md` | `c94a9bf3f2444540…` | `scripts/apply-design-md.cjs` — its colour table, its typography block, its border-radius table and its theme line |
| `source.md` | `3e0a8a069fcf99fc…` | a reader deciding whether this capture is still the right stock |
| `css-variables.css` | `62a54f794e7702c1…` | nothing here; carried as part of the capture |
| `tailwind-v4.css` | `94602309160cb3f1…` | nothing here; carried as part of the capture |
| `design-tokens.json` | `bcbb3df33a39c5ac…` | nothing here; carried as part of the capture |
| `cursor-canonical.json` | `e971eb74890255f7…` | nothing here; carried as part of the capture |

## Overriding it

`--default` reads `DESIGN.md` in this directory. Any other Style Reference is applied by
passing its path instead, and `sk-design-md-generator` is what produces one:

```
node scripts/apply-design-md.cjs --default --all --out <dir>
node scripts/apply-design-md.cjs <path-to-DESIGN.md> --all --out <dir>
```

A sibling directory here would hold a second stock reference without renaming this one. The
script also picks up a `tokens.json` sitting beside a `DESIGN.md`, and reads `darkMode` from
it; `design-tokens.json` is a different schema under a similar name, so renaming it to
`tokens.json` would make the script consult a file that cannot answer, and say nothing.
