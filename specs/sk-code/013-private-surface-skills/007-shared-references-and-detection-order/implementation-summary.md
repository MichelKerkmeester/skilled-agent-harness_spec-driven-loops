---
title: "Implementation Summary"
description: "sk-code shared references now hold only hub and mode doctrine, and SKILLED is the one declared fallback surface that always ranks last, so a private or repo-added surface leads it."
trigger_phrases:
  - "shared references and detection order implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/007-shared-references-and-detection-order"
    last_updated_at: "2026-10-25T22:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed the phase after CI rebuilt the trigger index in fbfc4bfe22"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-shared-references-and-detection-order"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Naming severity: Operator ruled 2026-10-25: P1 in both"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.3 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-shared-references-and-detection-order |
| **Status** | Complete |
| **Completed** | 2026-10-25, change `c02124d0ff`, trigger index rebuild `fbfc4bfe22` |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A private or repo-added sk-code surface now leads SKILLED when both match, and a SKILLED hint no longer reorders anything. The shared references folder lost four files that repeated the workflow docs or served one web surface.

### Phase 7: shared-references-and-detection-order

Surface order is data now. `sk-code-skilled` declares `surfaceDetection` with role `fallback` in `mode-registry.json`, and an outside sk-code family skill declares its own block under `surface_detection` in its `graph-metadata.json`. The registry compiler, the canary router, the replay library and the advisor plugin all read the same order: hub specific surfaces, then outside surfaces by `skill_id`, then SKILLED, then UNKNOWN.

Four optimizers then rewrote the shared references to that doctrine. Their before and after scores:

| File | DQI before | DQI after | HVR before | HVR after |
|------|-----------|-----------|------------|-----------|
| `shared/references/phase-detection.md` | 92 | 97 | ceiling 65, 7 hard blockers | ceiling 100, 0 hard blockers |
| `shared/README.md` | 91 | 97 | not scored | 0 em dashes, 0 semicolons |
| `shared/references/universal/code-quality-standards.md` | 92 | 92 | 28 em dashes, 11 semicolon lines | 0 em dashes, 0 semicolons |
| `shared/references/stack-detection.md` | 97 | 99 | not scored | 0 em dashes, 0 semicolons outside code |
| `shared/references/workflow-implement.md` | 92 | 93 | ceiling 55, 8 hard blockers | ceiling 100, 0 hard blockers |
| `shared/references/workflow-debug.md` | 91 | 93 | ceiling 76, 4 hard blockers | ceiling 100, 0 hard blockers |
| `shared/references/workflow-verify.md` | 93 | 93 | ceiling 76, 4 hard blockers | ceiling 100, 0 hard blockers |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/shared/references/universal-debugging-checklist.md`, `universal-verification-checklist.md`, `universal/error-recovery.md`, `universal/multi-agent-research.md` | Deleted | Repeated the workflow docs or served one web surface |
| `.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` | Moved | From `shared/references/universal/`, to the mode that owns style |
| `.skilled/skills/sk-code/shared/` README and six references | Modified | Folded rules, scrubbed web wording, declared order |
| `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` | Modified | Naming moved from P0 to P1 per the operator ruling, version `1.5.4.0` |
| `.skilled/skills/sk-code/mode-registry.json`, `ROUTER.md`, `SKILL.md`, `graph-metadata.json`, `leaf-manifest.json` | Modified | Declared fallback, repointed maps, regenerated manifest |
| `registry-compiler.cjs`, `canary-router.cjs` (served and authored twin), both activation `manifest.json` copies | Modified | Order validation and hint resolution, re-minted policy hash `acbe381f` |
| `router-replay-lib.cjs`, `.skilled/plugins/system-skill-advisor.js` | Modified | Read the declared order |
| `ci-skill-root-metadata.cjs` and its contract test | Modified | Accept `surface_detection` as an optional object |
| `.hermes/skills/sk-code`, `sk-code-quality`, `sk-code-review` `SKILL.md` | Regenerated | Hermes sync |
| Style guide readers, playbook files, hooks, `.skilled/bin/README.md`, `verify-router-sync.cjs` | Modified | Repointed paths and corrected hint prose |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two workers built the cleanup and the declared order in parallel. Four optimizers then rewrote the seven shared files. The integration step accepted the outside key in the fleet gate, corrected the stale prose and citations, regenerated `leaf-manifest.json`, refreshed the sk-code activation manifest and copied it to its authored twin, ran the Hermes sync and then the full gate set.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| SKILLED is a declared fallback (ADR-001) | A hard-coded first match let no other surface lead |
| Outside skills declare in `graph-metadata.json` (ADR-002) | A hub registry entry would put a private id in a tracked file |
| Workflow docs stay shared controls (ADR-003) | A surface symlink path fails router-sync leg 2 |
| The `stack-detection.md` example uses `local-example` | The optimizer's draft named the private Webflow skill id and its markers in a tracked file |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | PASS, `router-sync: 5/5 checks passed`, exit 0 |
| `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` | PASS, all 4 guards, exit 0 |
| `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` | PASS, all hard invariants, 0 warnings |
| `node --test .skilled/bin/tests/compiled-route-{surface-hint,manifest,admission,front-door}.test.cjs` | PASS, 12, 48, 29 and 1, no failures |
| `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | PASS, 9 of 9 |
| `node .skilled/bin/compiled-route-sync.cjs --check` and `compiled-route-admission.cjs --hub sk-code` | PASS, 55 copies match, `7 pass, 0 drift` |
| `check-rule-copies.js` and `check-rule-copies.test.sh` | PASS, 72 cases |
| `verify-doc-claims.cjs` | PASS, 4/4 |
| `ci-skill-root-metadata.cjs` and its contract test | PASS, `checked=14 passed=14 failed=0` |
| `command-catalog-mirror-check.cjs`, `test_readme_manifest.py`, the six mirror sync checks | PASS, `STATUS=OK`, manifest reproducible, Hermes 67 copies in sync |
| Advisor vitest, `advisor-surface-hint` and `system-skill-advisor-plugin` | PASS, 97 of 97 |
| CI on `c02124d0ff` and `fbfc4bfe22` (`gh run list --commit`) | 19 of 20 runs pass on `c02124d0ff`. Spec-Kit Check fails on two `resource-map-extractor.vitest.ts` fixture tests that also fail on `5cb598cf3f`, before this phase. `fbfc4bfe22` Push on main passes |
| Naming ruling gates: `check-rule-copies.js`, its test, drift guards, `generate-leaf-manifest.cjs --check` | PASS, each exit 0 |
| Stale path search with `rg` on `origin/main` after the CI rebuild | PASS, no old path in `trigger-index.json` or `corpus-manifest.json`, the new style guide path once in each |

The full outputs are in `scratch/evidence/phase-b-gates.log`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Trigger index and retrieval fixtures.** Closed. CI rebuilt both files in `fbfc4bfe22` and neither names an old path now. The archived anchor-repair fixture still quotes one old path and stays out of scope.
2. **Naming severity.** Operator ruled 2026-10-25: P1 in both. `code-quality-standards.md` now lists naming under P1, matching the sk-code-skilled universal checklist. The JS/CSS overlay `naming-init-formatting-and-css.md` still marks CHK-NAM-01, 02 and 05 P0. It stays out of this phase's scope, as the spec records.
<!-- /ANCHOR:limitations -->
