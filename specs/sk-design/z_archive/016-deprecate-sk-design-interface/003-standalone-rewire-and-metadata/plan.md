---
title: "Implementation Plan: Rewire the relocated skill and give it a standalone identity"
description: "Fix relocation paths, author Class-S metadata, generate manifests, prove functional via tests and the root-metadata contract."
trigger_phrases:
  - "rewire standalone plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/003-standalone-rewire-and-metadata"
    last_updated_at: "2026-08-19T05:51:14Z"
    last_updated_by: "spec-author"
    recent_action: "Authored rewire plan"
    next_safe_action: "Phase 004 fold design knowledge"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Rewire the relocated skill and give it a standalone identity

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Repair the two code paths the 002 move broke, author the standalone-root metadata a Class-S skill requires, generate its derived manifests, and prove the whole thing works by running the real test suite and the root-metadata contract — watching each check fail (or be missing) first, then pass.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- **Ready:** 002 landed the move; the dependency-map named the 5 outward refs; the skill-root-metadata contract defines Class-S requirements.
- **Done:** backend suite green; styles engine resolves; Class-S contract passes for the new skill; forbidden hub files absent.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Aspect | Value |
|--------|-------|
| **Code fixes** | `corpus-baseline-v3.test.ts` manifest path; `output-policy.ts` `SKILLS_ROOT` (skill is one level shallower post-move) |
| **Authored metadata** | `graph-metadata.json` (advisor identity), `leaf-manifest.config.json` |
| **Generated metadata** | `leaf-manifest.json`, `leaf-aliases.json` (via `generate-leaf-manifest.cjs` + `ci-skill-root-metadata.cjs --fix`) |
| **Class** | S (standalone): forbids `description.json`/`mode-registry.json`/`hub-router.json`/`command-metadata.json` |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Scan the moved skill for every depth-dependent path computation (multi-`..` resolves, repo-root counting); confirm styles kept its relative depth.

### Phase 2: Implementation

Apply the two code-path fixes; author `graph-metadata.json` + `leaf-manifest.config.json`; generate `leaf-manifest.json` + `leaf-aliases.json`.

### Phase 3: Verification

Run the backend vitest suite; verify styles engine resolution; run `ci-skill-root-metadata` and confirm the new skill passes Class-S.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Real command evidence: `npm test` in `backend/` (173 tests), a node import of `styles/lib/paths.mjs` asserting `STYLES_ROOT`/manifest/DB, and `ci-skill-root-metadata.cjs` for the Class-S verdict. The output-policy fix was validated as a negative control — the suite failed 4/173 before the fix and 0 after.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 002 move (upstream); 004 shared-link repair + 006 advisor re-scan (downstream).
- Tools: `vitest` (bundled in `backend/node_modules`), `generate-leaf-manifest.cjs`, `ci-skill-root-metadata.cjs`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Uncommitted. Code fixes revert via `git checkout -- <file>`; the 4 authored/generated root JSONs are new files removable with `rm`. Reversing them returns the skill to its post-002 (moved-but-unwired) state.
<!-- /ANCHOR:rollback -->
