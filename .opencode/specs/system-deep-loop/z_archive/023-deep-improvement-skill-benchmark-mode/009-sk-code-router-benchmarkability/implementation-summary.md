---
title: "Implementation Summary: sk-code Router Benchmarkability"
description: "Shipped: Lane C harness reference-following fallback + sk-code machine-readable router projection + lint-clean fixtures + regression tests. sk-code benchmark moved BLOCKED-BY-STRUCTURE to CONDITIONAL with no inline-router regressions."
trigger_phrases:
  - "sk-code router benchmarkability summary"
  - "reference-following implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/023-deep-improvement-skill-benchmark-mode/009-sk-code-router-benchmarkability"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped + verified all tasks; wrote conformant spec docs"
    next_safe_action: "Final validate.sh --strict pass, then optional commit"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/skill-benchmark/router-replay.cjs"
      - ".opencode/skills/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs"
      - ".opencode/skills/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs"
      - ".opencode/skills/sk-code/references/smart_routing.md"
      - ".opencode/skills/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-router-benchmarkability"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Fix path = Option 3a-structured"
      - "Fixtures = empty-gold convention; positive gold deferred to Mode B"
---
# Implementation Summary: sk-code Router Benchmarkability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete (pending final strict-validate) |
| **Date** | 2026-06-01 |
| **Target** | `sk-code` benchmarkability |
| **Mutation surface** | `deep-improvement` Lane C harness + `sk-code/references/smart_routing.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Lane C harness enhancement that lets the skill-benchmark parser follow a **referenced** router doc, plus a machine-readable router projection for `sk-code`. `sk-code` is now benchmarkable end-to-end without changing how any inline-router skill is parsed.

### Reference-following router
`parseRouter(skillMdText, skillRoot)` inline-parses first; only when inline `INTENT_SIGNALS`/`RESOURCE_MAP` are absent and a `skillRoot` is given does it call new `findReferencedRouterDoc()` (explicit pointer near a routing keyword, else conventional `references/smart_routing.md`) and parse the same dictionaries from there. Adds a `routerSource` field.

### sk-code router projection
`references/smart_routing.md` §11: a machine-readable `DEFAULT_RESOURCE` + `INTENT_SIGNALS` (14 intents) + `RESOURCE_MAP` projection of the prose maps. All 94 content files mapped (0 dead paths); only the 3 router-internal docs remain orphans.

### Files Changed

| File | Change |
|------|--------|
| `scripts/skill-benchmark/router-replay.cjs` | `parseRouter` signature + `findReferencedRouterDoc` + `routerSource`; `routeSkillResources` passes `skillRoot` |
| `scripts/skill-benchmark/d5-connectivity.cjs` | Pass `skillRoot` to `parseRouter` |
| `scripts/skill-benchmark/contamination-lint.cjs` | Pass `skillRoot` to `parseRouter` |
| `sk-code/references/smart_routing.md` | Add §11 machine-readable router block |
| `sk-code/benchmark/fixtures/sk-code/*.json` | 2 lint-clean public/private pairs (skill-local; runs need `--fixtures-dir`) |
| `scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | +4 reference-following tests |
| `scripts/tests/sk-code-router-sync.vitest.ts` | +4 drift-guard tests (§11 vs filesystem + prose) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baseline-first: captured the BLOCKED-BY-STRUCTURE baseline, read the existing test suite to lock the backward-compat contract, enumerated all 94 sk-code reference files, then made the parser change additively (inline-first, guarded fallback). Verified by re-running the full vitest suite and re-benchmarking sk-code via `loop-host`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **ADR-001**: Option 3a-structured — teach the harness to follow a referenced router doc and add a machine-readable block to `smart_routing.md`, rather than scrape prose tables (fragile) or inline a router into `SKILL.md` (drift).
- **ADR-002**: Empty-gold fixtures (the shipped convention) — Mode A replays prompt text only and the contamination linter bans every router token, so positive routing gold is deferred to live Mode B.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Full `deep-improvement` vitest suite | **218 passed / 21 files** (incl. 4-test drift guard) |
| sk-code benchmark verdict | `BLOCKED-BY-STRUCTURE` → **`CONDITIONAL`** (aggregate 69) |
| D5 gate | score `0 → 91`, `gateFailed: true → false` |
| `router_unparseable` (P0) | `1 → 0` |
| `orphan_reference` (P2) | `94 → 3` (router-internal docs only) |
| Dead resource paths | `0` |
| Scenarios scored | `0 → 2` |
| Fixtures contamination-clean | both pass `lintFixture` vs 225-term vocab |

Reports: `.opencode/skills/sk-code/benchmark/{baseline,after,full}/` (+ `benchmark/README.md` with the exact `--fixtures-dir` run command). Fixtures are skill-local (`sk-code/benchmark/fixtures/`), not the harness default, so a bare run reports `NO-SCENARIOS` — always pass `--fixtures-dir`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The flat `RESOURCE_MAP` projection **unions surfaces**, cannot encode the **+5 phase boost**, and drops the **doc-only anti-signals** — all stay enforced by the prose contract + `SKILL.md` §2 surface detection.
- Mode A replays **prompt text only**; sk-code routes primarily on CWD + target paths, so positive D1-intra/D2/D3 gold is deferred to **live Mode B**. Current fixtures use empty gold (D3=0 is the empty-array artifact, not a real efficiency score).
- **Continuation**: when Mode B lands, populate the fixtures' `expected.intentKeys`/`resources` from the §11 mapping (recorded in each private `notes`) and replace the D2/D3 proxies with observed file-load telemetry.
<!-- /ANCHOR:limitations -->
