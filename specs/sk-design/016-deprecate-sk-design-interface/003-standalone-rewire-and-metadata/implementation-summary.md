---
title: "Implementation Summary: Rewire the relocated skill and give it a standalone identity"
description: "Rewire complete: two relocation-broken code paths fixed (173/173 backend tests pass), styles engine resolves at the new depth, and Class-S standalone-root metadata authored + generated so the advisor sees a proper standalone skill."
trigger_phrases:
  - "rewire standalone summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/003-standalone-rewire-and-metadata"
    last_updated_at: "2026-08-19T05:51:14Z"
    last_updated_by: "spec-author"
    recent_action: "Fixed relocation path bugs, authored standalone metadata, proved 173/173 tests + Class-S PASS"
    next_safe_action: "Phase 004: fold the condensed design-knowledge layer and repair the 4 shared links"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/backend/scripts/output-policy.ts"
      - ".opencode/skills/sk-design-md-generator/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary: Rewire the relocated skill and give it a standalone identity

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 1 |
| **Mutation Class** | mutates (two code-path fixes + authored/generated root metadata) |
| **Executor** | main agent (context-loaded mechanical rewire; cli-devin reserved for the cognitive phases 004/006) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The relocated skill now works detached from the hub and carries its own standalone identity:

- Two relocation-broken code paths repaired (`output-policy.ts` write-boundary root, `corpus-baseline-v3.test.ts` styles-manifest path).
- Standalone-root metadata: `graph-metadata.json` (advisor identity) + `leaf-manifest.config.json` authored; `leaf-manifest.json` + `leaf-aliases.json` generated.
- The forbidden hub-root files (`description.json`/`mode-registry.json`/`hub-router.json`/`command-metadata.json`) are absent — the new root is a clean Class-S standalone, not a hub mode.

The 4 `../shared/*` markdown doc-links remain dangling by design; they are repaired in 004 when the shared content is folded in.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The 002 move dropped the skill one directory level shallower, so any path computed by counting `..` from the package root drifted. `output-policy.ts` computed `SKILLS_ROOT` as up-two from `PACKAGE_ROOT` (`backend/`'s grandparent); post-move that overshot `.opencode/skills` to `.opencode`, so the write-boundary allowlist rejected every legitimate spec-folder write — the backend suite surfaced it as 4 failing tests. Corrected to up-one. The corpus-baseline test hard-coded a `../../../styles` manifest path that lost a hop in the move; corrected to `../../styles`.

For identity, `graph-metadata.json` was authored from the sk-git Class-S reference shape (schema_version 2), with trigger phrases spanning both the surviving extraction capability and the condensed design-knowledge layer 004 will fold in; pure interface-direction phrases were deliberately dropped. `leaf-manifest.config.json` names the four routable leaf roots; the derived `leaf-manifest.json` + `leaf-aliases.json` were generated, never hand-written.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Fix the root, not the callers** — `output-policy.ts` is the single write-boundary enforcement point; correcting `SKILLS_ROOT` there fixes every writing script at once rather than patching each caller.
- **Author trigger phrases for the final identity now** — the advisor vocabulary already reflects extraction + condensed design knowledge, so 006's advisor re-scan finalizes a stable identity rather than re-churning it after 004.
- **Leave the shared links dangling** — repairing them belongs with 004's fold (that is where the linked content lands); fixing them here would point at soon-to-move files.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- Backend: `npm test` in `backend/` = **173/173 pass** (19 files). Negative control: the same suite reported 4 failures ("refusing to write inside the skills directory") before the `output-policy.ts` fix, 0 after.
- Styles engine: node import of `styles/lib/paths.mjs` — `STYLES_ROOT` ends `sk-design-md-generator/styles`, the retrieval manifest resolves, the DB root resolves at the new location.
- Class-S contract: `ci-skill-root-metadata.cjs` → `sk-design-md-generator [S]` PASS; fleet run `checked=14 passed=13 failed=1`, the single failure being the still-present `sk-design` hub (deleted in 005) — expected transient breakage, not a regression from this phase.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The 4 `../shared/*` markdown links (`SKILL.md`, `authoring-boundary.md`, `source-of-truth-router-card.md`, `procedure-card-inventory.md`) still dangle — repaired in 004.
- The advisor skill-graph / compiled-routing corpus has not been regenerated yet — that is 006's reconcile step; until then the fleet still shows the doomed hub.
- Fully reversible while uncommitted (revert the two code files; remove the four new root JSONs). Nothing committed or pushed.
<!-- /ANCHOR:limitations -->
