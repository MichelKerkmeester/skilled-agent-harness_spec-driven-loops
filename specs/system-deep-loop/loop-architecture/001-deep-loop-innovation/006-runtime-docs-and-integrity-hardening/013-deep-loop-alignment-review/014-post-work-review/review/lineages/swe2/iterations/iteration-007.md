# Iteration 7 — Version Authority Audit

**Focus:** D1 Correctness + D3 Traceability — Angle 7: phases 003 + 010 claim one version per hub declared in SKILL.md, carried by five routing artifacts, matching the newest changelog entry, with the schema doc giving `version` one meaning and the compiled route guard reporting every hub fresh.
**Phase records audited:** `003-version-authority`, `010-version-authority-completion`

## Method

1. Enumerated the five named routing artifacts (`SKILL.md`, `description.json`, `mode-registry.json`, `hub-router.json`, `ROUTER.md`) for all five hubs and read each version field.
2. Compared each hub's carried value against its newest `changelog/` entry.
3. Read the schema doc's version definition, sk-doc's authored `v2.1.0.0` entry, the sk-code `0.1.*` record, and `frontmatter-versioning.md`'s enforcement disclosure.
4. Ran the compiled route guard (read-only — no fs.write calls in `compiled-route-guard.cjs`) for the freshness claim.
5. Swept every other hub-root `.md`/`.json` for competing version fields.

## Evidence

### All five hubs: five artifacts × one value = newest changelog

| Hub | SKILL.md | description.json | mode-registry.json | hub-router.json | ROUTER.md | Newest changelog |
|-----|----------|------------------|--------------------|-----------------|-----------|------------------|
| system-deep-loop | 3.0.0.0 | 3.0.0.0 | 3.0.0.0 | 3.0.0.0 | 3.0.0.0 | v3.0.0.0 |
| sk-code | 4.2.2.0 | 4.2.2.0 | 4.2.2.0 | 4.2.2.0 | 4.2.2.0 | v4.2.2.0 |
| cli-external-orchestration | 1.5.0.0 | 1.5.0.0 | 1.5.0.0 | 1.5.0.0 | 1.5.0.0 | v1.5.0.0 |
| sk-doc | 2.1.0.0 | 2.1.0.0 | 2.1.0.0 | 2.1.0.0 | 2.1.0.0 | v2.1.0.0 |
| mcp-tooling | 1.6.1.0 | 1.6.1.0 | 1.6.1.0 | 1.6.1.0 | 1.6.1.0 | v1.6.1.0 |

- Authority sentence present in all five `SKILL.md` files naming the same five artifacts [SOURCE: each SKILL.md:14-17].
- Schema doc now gives `version` one meaning: "the hub's release version … One meaning only — the router tracks the hub release, it does not carry an independent schema generation" [SOURCE: parent-hub-router-schema.md:53].
- sk-doc `v2.1.0.0` changelog entry exists and is authored content, not a stub [SOURCE: sk-doc/changelog/v2.1.0.0.md].
- `frontmatter-versioning.md` §"What nothing enforces" records the absent parity gate exactly as REQ-004 requires [SOURCE: frontmatter-versioning.md:170-172].
- Compiled route guard, run read-only: all five hubs `ok: true, reason: "fresh"`, `failures: 0`, exit 0 [SOURCE: `node .opencode/bin/compiled-route-guard.cjs --json`].

### sk-code `0.1.*` surfaces — REQ-003

- `sk-code-mobile-cli` at 0.1.11.0, `sk-code-obsidian` at 0.1.0.0 — confirmed the two `0.1.*` surfaces exist.
- `sk-code/SKILL.md:17` records the independence rule and points at the packet changelog; `sk-code-mobile-cli/changelog/v0.1.7.1.md` §Versioning records the renumber: "Renumbered the skill to the pre-release `0.x` scheme (formerly `1.7.1.0`); all changelog versions map `W.X.Y.Z` -> `0.W.X.Y`."

### Candidates adjudicated — not defects

- **Mobile-cli changelog titles vs version fields.** All 13 entries carry `title: "…v1.x.y.z"` against `version: 0.1.x.y`. The packet's own changelog declares the display mapping (`W.X.Y.Z -> 0.W.X.Y`) — consistent, self-documented historical titles, not a competing value. Refuted.
- **Hub README frontmatter versions** (system-deep-loop `2.2.3.0`, sk-code `4.2.1.0`, cli-ext `1.4.0.15`, sk-doc `2.1.0.65`): under the 4-part standard, child docs inherit `X.Y` from the anchor *at versioning time* and `W` is a per-doc edit count; the gate checks format only [SOURCE: frontmatter-versioning.md:82-85,127-129]. These are stale-era doc versions the standard explicitly tolerates, and README is not one of the five named routing artifacts. Refuted — though the era lag is worth noting as a known-tolerated staleness.
- **`package.json`/`package-lock.json` "1.0.0"** in two hubs: npm workspace placeholders, outside the doc-version standard and the artifact contract. Refuted.

## Findings

None new. Every load-bearing claim of both phases verified against the tree; the only live caveat is the half of SC-002 I could not execute (the deep-loop suite run is not write-safe under this lineage's constraints — the guard half was run and passes).

## Verdict rationale

All five hubs verified: 25 routing artifacts, five values, each equal to its newest changelog; schema doc single-meaning; guard exits 0. Adjudicated candidates all sanctioned conventions.

Review verdict: PASS
