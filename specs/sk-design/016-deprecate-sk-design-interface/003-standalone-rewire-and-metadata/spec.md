---
title: "Feature Specification: Rewire the relocated skill and give it a standalone identity"
description: "Phase 003 repairs the code paths broken by the 002 move, authors the standalone-root metadata (graph-metadata + leaf-manifest.config, generated leaf-manifest + leaf-aliases), and proves the skill functional (173/173 backend tests, styles engine resolves, Class-S contract passes)."
trigger_phrases:
  - "rewire standalone md-generator"
  - "standalone skill metadata"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/003-standalone-rewire-and-metadata"
    last_updated_at: "2026-08-19T05:51:14Z"
    last_updated_by: "spec-author"
    recent_action: "Fixed relocation path bugs, authored standalone metadata, proved 173/173 tests"
    next_safe_action: "Phase 004: fold the condensed design-knowledge layer and rewire the 4 shared links"
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

# Feature Specification: Rewire the relocated skill and give it a standalone identity

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Structure** | Phase child of `016-deprecate-sk-design-interface` |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/016-deprecate-sk-design-interface` |
| **Parent Spec** | ../spec.md |
| **Mutation Class** | mutates (code path fixes + authored/generated root metadata) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 002 move relocated the skill one directory level shallower, breaking two code paths, and left the skill without the root metadata a standalone skill needs (it was a hub *mode* carrying only `SKILL.md`).

**Purpose:** repair the relocation-broken code, author the Class-S standalone-root metadata, generate its derived manifests, and prove the skill is fully functional detached from the hub. The 4 `../shared/*` markdown doc-links stay dangling — they are repaired in 004 when the shared content is folded in.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- Fix `backend/tests/corpus-baseline-v3.test.ts` styles manifest path (`../../../styles` → `../../styles`).
- Fix `backend/scripts/output-policy.ts` `SKILLS_ROOT` (up-two → up-one; the skill is a level shallower).
- Author `graph-metadata.json` (advisor identity) + `leaf-manifest.config.json`; generate `leaf-manifest.json` + `leaf-aliases.json`.
- Prove functional: backend vitest suite, styles engine resolution, and the `ci-skill-root-metadata` Class-S contract.

**Out of scope**

- The 4 `../shared/*` markdown links (repaired in 004 with the folded copies).
- Deleting the hub or editing external references (005/006).
- Any styles-corpus change (styles kept its relative depth; nothing to fix there).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001** — The backend vitest suite passes fully after the path fixes (negative control: the two fixes address real pre-fix failures).
- **REQ-002** — The styles engine resolves `STYLES_ROOT`, the retrieval manifest, and the database root at the new location.
- **REQ-003** — `graph-metadata.json` and `leaf-manifest.config.json` are authored; `leaf-manifest.json` and `leaf-aliases.json` are generated; `description.json`/`mode-registry.json`/`hub-router.json` are absent (Class-S forbids them).
- **REQ-004** — `ci-skill-root-metadata` reports the new skill as a passing Class-S root.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Backend: 173/173 tests pass (19/19 files).
- Styles engine: `STYLES_ROOT` ends with `sk-design-md-generator/styles`; manifest exists; DB root resolves.
- `ci-skill-root-metadata`: `sk-design-md-generator [S]` passes (the only fleet failure left is the doomed `sk-design` hub).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk: undiscovered depth-dependent paths** — mitigated by running the full backend suite (which exercised and caught the output-policy bug) and scanning for multi-`..` resolves; styles verified depth-unchanged.
- **Dependency:** 002 (the move). Downstream: 004 repairs the shared links; 006 re-scans the advisor over the new identity.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The advisor trigger-phrase set authored here reflects the skill's final identity (extraction + condensed design knowledge). It is re-scanned/finalized by the advisor in 006 once 004's folded content lands.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phase-navigation -->
## PHASE NAVIGATION

- **Parent:** `../spec.md`
- **Predecessor:** `../002-extract-md-generator-and-styles/spec.md`
- **Successor:** `../004-fold-design-knowledge/spec.md`
<!-- /ANCHOR:phase-navigation -->
