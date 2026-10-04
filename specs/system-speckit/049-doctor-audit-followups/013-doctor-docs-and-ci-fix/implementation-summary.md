---
title: "Implementation Summary"
description: "The doctor-scripts CI job now installs the yaml package its route-contract test needs, the root README describes the saved hook settings and rule changes, and each skill a doctor command checks names that command."
trigger_phrases:
  - "doctor docs and ci fix summary"
  - "doctor pointers shipped"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/013-doctor-docs-and-ci-fix"
    last_updated_at: "2026-10-04T10:40:00Z"
    last_updated_by: "doctor-docs-and-ci-fix"
    recent_action: "Fixed the doctor CI install and added doctor pointers to the README and targeted skills"
    next_safe_action: "Confirm the doctor-scripts job passes on the pushed commit"
    blockers: []
    key_files:
      - ".github/workflows/spec-kit-check.yml"
      - ".skilled/package.json"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-docs-and-ci-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-doctor-docs-and-ci-fix |
| **Completed** | 2026-10-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The doctor suite can now run on a clean CI runner, and a reader who opens the root README or a targeted skill finds the doctor command that checks it.

### Phase 13: doctor-docs-and-ci-fix

- **CI fix.** `skill-advisor-route-contract.test.cjs` requires `yaml`, which `.skilled` only carried as a dependency of vite and effect. The doctor-scripts job never installed `.skilled`, so the test failed with MODULE_NOT_FOUND. `.skilled/package.json` now declares `yaml` 2.9.0 exactly, and the job runs `npm --prefix .skilled ci`.
- **Root README.** The Git Hooks section names the saved `speckit.hooks.<key>` settings, `/doctor:git hooks` and `/doctor:git standards`, and says an unreadable staged file or a crashed checker blocks. The Off Switches line no longer says the gate bypasses only cover one command.
- **Skill pointers.** system-skill-advisor, system-deep-loop, system-spec-kit, sk-git and mcp-code-mode each name their doctor command, and `ENV-REFERENCE.md` names `/doctor:env`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/package.json`, `.skilled/package-lock.json` | Modified | Declare `yaml` 2.9.0 |
| `.github/workflows/spec-kit-check.yml` | Modified | Install `.skilled` in the doctor-scripts job |
| `README.md` | Modified | Hook settings and rule changes |
| Five skill READMEs and `ENV-REFERENCE.md` | Modified | Doctor command pointers |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each pointer was checked against the command's `argument-hint` and description before it went in. The v4.0.0.3 entry was rechecked against the code: ten savable gates and two per-push approvals in `gates.tsv`, the `--include-prerelease` option in the updater, and the install-state read in the hooks workflow. It needed no change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pin `yaml` at 2.9.0 exactly | The lock already resolved 2.9.0, so the fix adds no new code to the tree |
| Keep "19 underlying YAML workflows" in the root README | `assets/` holds 19 workflows plus `mcp-mutation-class-manifest.yaml`, which is not a workflow |
| Leave the changelog unchanged | The CI install and the doc pointers are not changes a release reader meets |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Clean `npm ci` of `.skilled` in a scratch copy | yaml 2.9.0 installed |
| `run-all.sh` | 7 of 7 suites pass, exit 0 |
| `validate_document.py` on the seven edited docs | Six VALID with 0 issues; `ENV-REFERENCE.md` carries the same two warnings as the committed copy |
| `hvr_scan.py` | Hard-blocker counts equal the committed copies in every file |
| Mirror, prompt, hook, Hermes skill, metadata and route-guard checks | All pass |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Other Spec-Kit Check jobs.** Other jobs in the workflow were already failing before this phase, and this phase fixes only the doctor-scripts job.
<!-- /ANCHOR:limitations -->

---
