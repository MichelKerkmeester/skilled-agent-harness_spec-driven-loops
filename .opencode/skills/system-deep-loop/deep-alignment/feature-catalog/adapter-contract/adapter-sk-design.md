---
title: "sk-design adapter"
description: "The static-only hybrid authority adapter that checks DESIGN.md structural conformance and tokens.json parse-validity against sk-design's Style Reference schema."
trigger_phrases:
  - "sk-design adapter"
  - "DESIGN.md structural conformance"
  - "design_md_format schema"
  - "tokens.json validity"
  - "static-only design audit"
version: 1.0.0.1
---

# sk-design adapter

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The static-only hybrid authority adapter that checks DESIGN.md structural conformance and tokens.json parse-validity against sk-design's Style Reference schema.

`sk-design.cjs` reads files; it never renders, never invokes design-md-generator's Playwright extraction pipeline, and never drives chrome-devtools (NFR-S01). Live-render audits are a separate authority adapter. Its own `standardSource` tags it `hybrid` and `static-only-v1` (ADR-004/ADR-009).

## 2. HOW IT WORKS

`discover()` walks the two static-artifact basenames — `DESIGN.md` and `tokens.json` — under a `paths`/`globs` scope. `standardSource('sk-design')` returns the structural-format doc, the token vocabulary, and the audit-rubric doc paths (some marked reasoning-agent-layer-input-only). `check()` runs a deterministic structural layer and a reasoning-agent audit-rubric layer. For a DESIGN.md, the structural layer verifies the H1 header and the eleven hard-required `##` sections from `design-md-format.md`'s section-presence table (missing → P0), a soft imagery-signal check (P2), Quick-Start-to-Tokens color-hex consistency (P1), and banned patterns (extractor-internal var leaks, `Variant-N` placeholder names, raw frequency dumps — all P1). For a tokens.json it confirms well-formed JSON only. The audit-rubric layer mirrors sk-doc's verify-first shape: it translates only caller-supplied, already-judged findings that cite a specific rubric dimension into findings, never inventing a "looks off" verdict.

Several regexes carry documented calibration from the adapter's own dry-run against real DESIGN.md files: the frequency-dump pattern was narrowed after a broader version false-positived on legitimate CSS-value prose, and the section-slicer is index-based after a lookahead version silently returned empty sections.

**Difference from deep-review:** deep-review audits general code/doc correctness with no notion of a Style Reference schema. sk-design-adapter audits a DESIGN.md against sk-design's *own* `design-md-format.md` structure and cardinal rules, and stays strictly static — it does not render or measure a live surface, which is exactly the boundary the separate live-render adapter exists to cross.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/adapters/sk-design.cjs` | Adapter | `discover`/`standardSource`/`check`, required-heading and banned-pattern checks, Quick-Start consistency, audit-rubric layer. |
| `references/adapters/sk-design-adapter.md` | Reference | Full specification: required-heading scope (Section 3), the section-slicer and frequency-dump calibration (Section 4), the determinism/static-only boundary (Section 4.3). |
| `references/adapters/sk-design-known-deviations.md` | Reference | The sk-design suppression list parsed by `loadKnownDeviations()`. |
| `.opencode/skills/sk-design/design-md-generator/references/design-md-format.md` | Standard source | The Style Reference schema and cardinal rules the structural layer checks against. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/adapters/sk-design.cjs` CLI (`discover`/`check`/`standard-source`) | Manual dry-run | Runs the adapter against real DESIGN.md example docs; the regex calibrations were caught this way. |

---

## 4. SOURCE METADATA

- Group: Adapter contract
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `adapter-contract/adapter-sk-design.md`
- Primary sources: `scripts/adapters/sk-design.cjs`, `references/adapters/sk-design-adapter.md`, `references/adapters/sk-design-known-deviations.md`
Related references:
- [adapter-sk-git.md](../adapter-contract/adapter-sk-git.md) — sk-git adapter
- [adapter-sk-design-live-render.md](../adapter-contract/adapter-sk-design-live-render.md) — sk-design live-render adapter
- [check.md](check.md) — check(artifact, rules)
