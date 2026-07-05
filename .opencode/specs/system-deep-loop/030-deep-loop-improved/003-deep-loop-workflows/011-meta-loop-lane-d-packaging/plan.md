---
title: "Implementation Plan: Meta-Loop Deep-Loop-Runtime Lane D Self-Improvement Packaging"
description: "Documents the completed deep-loop-runtime self-target packaging profile and guard work."
trigger_phrases:
  - "meta loop lane D packaging"
  - "deep-loop-runtime self improvement profile"
  - "allowed_diff_relpaths self target"
  - "Lane D packaging deep loop"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/003-deep-loop-workflows/011-meta-loop-lane-d-packaging"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/non_dev_ai_system/profiles/deep-loop-runtime.json"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/non_dev_ai_system/templates/loop.py.template"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/packaging_config.schema.json"
      - ".opencode/commands/deep/ai-system-improvement.md"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/references/non_dev_ai_system/loop_contract.md"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Meta-Loop Deep-Loop-Runtime Lane D Self-Improvement Packaging

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode deep-improvement JSON packaging profiles, command markdown, templates, schema docs |
| **Framework** | Lane D non-dev AI-system improvement packaging for `deep-loop-runtime` |
| **Storage** | Packaging profile JSON, schema validation, self-improvement template files |
| **Testing** | Packaging schema validation and `--self-target` dry-run guard checks |

### Overview
This completed work created a safe self-target packaging profile for improving `deep-loop-runtime`. The profile separates frozen scorer and harness surfaces from editable technique docs, and the command adds a `--self-target` fork that defaults to dry-run, clean-tree, lock, confirm, and serial execution controls.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Risk identified: self-improvement must not mutate its own scorer or harness.
- [x] Lane D packaging profile fields are defined.
- [x] Running an actual self-improvement cycle remains out of scope.

### Definition of Done
- [x] `deep-loop-runtime.json` defines frozen surfaces, editable tech docs, allowed diffs, and excluded session prefixes.
- [x] Scorer and harness files are absent from `allowedDiffRelpaths`.
- [x] Packaging schema validates the new profile fields.
- [x] `--self-target deep-loop-runtime --dry-run` produces a plan without mutation.
- [x] Serial single-candidate execution is the default for self-target runs.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guarded self-target profile: package the target with explicit mutable and frozen surfaces, then route command execution through a dry-run-first self-target fork.

### Key Components
- **`deep-loop-runtime.json`**: Lane D profile containing frozen surfaces, editable docs, allowed diff paths, and excluded session prefixes.
- **`loop.py.template`**: Setup template for self-improvement cycle scaffolding.
- **`packaging_config.schema.json`**: Validates the new profile fields.
- **`ai-system-improvement.md`**: Adds `--self-target` guard behavior.
- **`loop_contract.md`**: Documents frozen scorer interface boundaries.

### Data Flow
The command reads the self-target profile, validates mutable paths against the schema and allow-list, forks into dry-run/clean-tree/lock/confirm setup, and uses serial single-candidate execution unless a separate explicit parallel override is supplied.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Packaging profile | Defines self-target boundaries | Add deep-loop-runtime profile | Schema validates profile |
| Packaging schema | Validates profile fields | Add frozen/editable/allow-list fields | New profile passes schema |
| Command doc | Runs AI-system improvement | Add `--self-target` guarded fork | Dry-run produces plan only |
| Loop contract | Defines scorer boundary | Document frozen scorer interface | Scorer paths excluded from allow-list |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and capture self-target packaging requirements.
- [x] Identify profile, template, schema, command, and contract surfaces.
- [x] Keep live self-improvement execution out of scope.

### Phase 2: Core Implementation
- [x] Create `deep-loop-runtime.json` profile with required fields.
- [x] Create `loop.py.template` for self-improvement setup.
- [x] Extend packaging schema for new profile fields.
- [x] Add `--self-target` fork behavior to `ai-system-improvement.md`.
- [x] Set self-target default to dry-run and serial single-candidate flow.
- [x] Add frozen scorer interface contract documentation.

### Phase 3: Verification
- [x] Validate `deep-loop-runtime.json` against packaging schema.
- [x] Confirm scorer and harness files are excluded from allowed diff paths.
- [x] Verify `--self-target deep-loop-runtime --dry-run` produces a non-mutating plan.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | `deep-loop-runtime.json` profile | Packaging schema validator |
| Allow-list review | Frozen scorer and harness exclusions | Profile inspection |
| Command dry-run | `--self-target deep-loop-runtime --dry-run` | Command dry-run path |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES


| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packaging schema | Internal | Complete | Profile cannot validate without field support |
| Live self-improvement cycle | Operational follow-up | Out of scope | This leaf only packages and guards the target |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Profile validation fails, scorer files become mutable, or `--self-target` can run live without the required guard.
- **Procedure**: Revert the profile, template, schema, command guard, and loop contract changes, then disable deep-loop-runtime as a self-improvement target until packaging boundaries are corrected.
<!-- /ANCHOR:rollback -->
