---
title: "Implementation Plan: sk-create-diagram review remediation"
description: "Direct execution of R1 + R2 remediation workstreams from the 013 deep-review, independently verified against real files."
trigger_phrases:
  - "diagram review remediation plan"
importance_tier: "important"
contextType: "planning"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/014-review-remediation"
    last_updated_at: "2026-08-13T05:55:33.000Z"
    last_updated_by: "claude"
    recent_action: "Authored plan"
    next_safe_action: "Execute R1 then R2"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-create-diagram review remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, YAML |
| **Framework** | The 013 deep-review's own remediation-workstream grouping and execution order |
| **Storage** | `.opencode/skills/sk-doc/` hub registries + `sk-create-diagram` packet content |
| **Testing** | `validate_skill_package.py --strict`, direct JSON parse, filesystem re-walk, `grep` sweeps |

### Overview

Direct execution, no model dispatch — every fix is either a mechanical registry/doc correction with a known, closed-form source of truth (the real filesystem, the real command file, the real SKILL.md section map) or a judgment call already resolved with strong evidence in `spec.md`'s answered-questions.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] `review-report.md` read in full; every P1 and its bundled P2s mapped to a concrete file-level fix.
- [x] The two judgment calls (F001, F009) resolved with cited evidence before touching any file.

### Definition of Done

- [x] R1 (5 items) fixed.
- [x] R2 (3 items, 1 no-op) fixed.
- [x] 3 additional same-class instances found by a repo-wide sweep, fixed.
- [x] Self-caught word-limit regression fixed.
- [x] `validate_skill_package.py --strict` passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fix-verify-sweep: apply each finding's fix directly against real files, independently re-verify the specific claim (JSON validity, filesystem existence, validator exit code), then run a repo-wide `grep` for the same defect *pattern* (not just the review's sampled lines) before moving to the next finding.

### Key Components

- **R1 registry refresh**: `leaf-manifest.json` regenerated from a real `find` over `references/`/`assets/`/`scripts/`; `command-metadata.json`, `hub-router.json`, feature-catalog docs, playbook sentence corrected to match real shipped state.
- **R2 contract reconciliation**: `SKILL.md`'s grid rule re-scoped to exempt typography (matching the already-shipped, already-deliberate type scale); every stale `SKILL.md §N` citation corrected across command YAML, reference files, and README — swept beyond the review's own cited sample.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigation

- [x] Read the full merged `review-report.md`; map every P1/bundled-P2 to a concrete fix.
- [x] Investigate F001 (grid vs. typography) and F009 (example corpus) evidence; resolve both without asking.

### Phase 2: Implementation

- [x] R1: regenerate `leaf-manifest.json`, fix `command-metadata.json`, add the `hub-router.json` alias, fix 2 alias-count docs, drop 1 stale playbook sentence.
- [x] R2: fix `SKILL.md`'s grid rule; fix 10 stale citations in the review's sampled files; sweep and fix 3 more instances the sample missed.

### Phase 3: Verification

- [x] Self-caught and fixed a word-limit regression introduced by the F001 edit.
- [x] Run `validate_skill_package.py --strict`, direct JSON parses, filesystem re-walk, validator smoke test.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Path integrity | `leaf-manifest.json`'s 96 leaves | Direct filesystem re-walk |
| JSON validity | All 3 touched hub files | `json.load` |
| Package contract | Whole `sk-create-diagram` skill | `validate_skill_package.py --strict` |
| Citation sweep | Whole packet + command surface | `grep` for `§[0789]`/`§1[0-9]` |
| Validator smoke | `ascii-markdown` path | `bash scripts/validate-flowchart.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 013's merged `review-report.md` | Internal | Satisfied | No findings to remediate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix breaks JSON validity, drops a real path from leaf-manifest, or a citation fix points at the wrong section.
- **Procedure**: `git checkout -- <path>` per file; every fix was independently re-verified before moving to the next, so a bad edit would surface immediately, not silently propagate.
<!-- /ANCHOR:rollback -->
