---
title: "Implementation Summary: Fix the Shared Naming Standard and Wire the Kebab Guards"
description: "Aligned core-standards.md with the kebab-case canon and added a CI-only guard that checks changed names and runs the guard unit tests."
trigger_phrases:
  - "core-standards kebab summary"
  - "kebab guard wiring summary"
  - "phase 001 implemented"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-naming-standard-hardening/001-fix-shared-standard-and-wire-guards"
    last_updated_at: "2026-07-20T12:06:56Z"
    last_updated_by: "codex"
    recent_action: "Aligned the shared standard and added the CI-only naming guard"
    next_safe_action: "Run central metadata and packet validation"
    blockers: []
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Gate host: CI only; pre-commit wiring remains a documented follow-up"
      - "Comparison mode: --changed-since the PR base or push's previous commit"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-fix-shared-standard-and-wire-guards |
| **Status** | Implemented; central validation pending |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The shared naming standard now states kebab-case as the canonical form for in-scope filesystem names. Its filename transformations, exemption list, safe-auto-fix claims, numbered-document framing, and common-violations table agree with the canonical naming reference.

A new CI workflow checks pull requests and `skilled/v*` release-branch pushes. It fetches full history, selects the event-specific comparison base, runs the repo-wide guard with `--changed-since`, and runs the guard and root-resolver unit tests.

### Changed Files

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/shared/references/core-standards.md` | Modified | Flip §2/§4/§5 to kebab and remove nonexistent filename auto-fixes |
| `.github/workflows/naming-standard-guard.yml` | Added | Enforce changed-name and unit-test checks in CI |
| `spec.md` | Modified | Record the resolved CI-only gate contract |
| `plan.md` | Modified | Mark the chosen gate and implementation steps resolved |
| `tasks.md` | Modified | Reconcile tasks with the implemented CI-only scope and evidence |
| `implementation-summary.md` | Rewritten | Record the delivered work, decisions, evidence, and follow-up |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation reused the existing guard without changing its detection logic. Pull requests compare against `origin/$PR_BASE_REF`; release pushes compare against `github.event.before`, with a first-push fallback to `HEAD^`. The job fails naturally on guard exit 1 or any pytest failure.

The documentation change stayed within the shared standard. No files were renamed, and no per-mode, guard-script, guard-test, metadata-generator, or hook files were edited.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reconcile the doc rather than delete it | core-standards.md is cited by other modes; it must state the canon, not vanish. |
| Wire the existing guard rather than write new detection | The guard exists and passes its unit tests; the gap was that no gate ran it. |
| Use CI only | The guard takes about 28 seconds against the current dirty workspace, has no staged-only mode, and could flag another session's unstaged files from a local hook. |
| Use event-specific `--changed-since` bases | This enforces new names without scanning legacy underscore roots as whole-tree violations. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Command | Result |
|---------|--------|
| `python3 -m pytest .opencode/skills/sk-doc/scripts/tests/test_no_new_snake_case_guard.py .opencode/skills/sk-doc/scripts/tests/test_naming_root_resolver.py -q` | Exit 0; `4 passed in 0.97s` |
| `python3 .opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py --changed-since "$base_ref"` with temporary `new_snake_name.md` | Exit 1; one offender reported |
| Same guard command with temporary `new-kebab-name.md` | Exit 0; no offenders reported |
| PyYAML `BaseLoader` assertions over `.github/workflows/naming-standard-guard.yml` | Exit 0; valid YAML, expected triggers, `fetch-depth: 0`, `actions/checkout@v4`, and `actions/setup-python@v5` |
| `sed -n '37,184p' core-standards.md` piped to the forbidden-rule grep | Exit 0 wrapper; no snake_case filename rule or kebab-to-snake fix matched |
| `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/shared/references/core-standards.md` | Exit 0; reference document valid, 0 issues |
| `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/skills/sk-doc/shared/references/core-standards.md` | Exit 0; 5/5 checks, DQI 99 (`excellent`) |
| `python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py .opencode/skills/sk-doc` | Exit 0; skill valid, with one soft description-length warning |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pre-commit follow-up.** Add a staged-only guard mode before reconsidering local hook wiring. The existing hook remains unchanged by design.
2. **Legacy underscore roots.** CI uses `--changed-since`; whole-tree enforcement remains unsuitable until the separate content workstream migrates the remaining roots.
3. **Central closeout pending.** The orchestrator still owns generated metadata and strict packet validation, so this record stops short of a final packet-complete claim.
<!-- /ANCHOR:limitations -->
