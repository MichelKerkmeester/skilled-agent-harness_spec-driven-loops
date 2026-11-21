---
title: "Tasks: CLI transport proof"
description: "Ordered work for proving a UTCP cli manual registers and answers through Code Mode."
trigger_phrases:
  - "cli transport proof tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CLI transport proof

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the pre-change baseline of `.utcp_config.json` — evidence: sha256 `2fdac285941e9d99` with 13 manuals (aside, chrome_devtools_1, chrome_devtools_2, clickup_official, figma, github, gitkraken, magnific, mobbin, notion, obsidian, refero, webflow)
- [x] T002 Confirm the probe command answers without credentials — evidence: `magicpath-ai info -o json` returns `authenticated:false` alongside `cli.version 2.3.2` and its own command list, exit 0
- [x] T003 [P] Read the `cli` manual schema from the installed `@utcp/cli` — evidence: the call template accepts `commands`, `env_vars`, `working_dir` and `auth` only; there is no inline `tools` field, so registration is discovery-only
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Register the probe as `call_template_type: "cli"` — evidence: registered at runtime through `register_manual` rather than by editing the shared config, since four live code_mode servers read that file; `success:true` with 3 tools returned
- [x] T005 Confirm the config still parses and the pre-existing manuals are byte-identical — evidence: sha256 unchanged at `2fdac285941e9d99`, `diff` reports identical, manual count still 13, `git status` clean
- [x] T006 Call the probe through Code Mode and record the returned payload — evidence: `magicpath_probe.info_abs({})` returned MagicPath's own JSON including `cli.version "2.3.2"` and `auth.authenticated false`
- [x] T007 [P] Prove argument substitution reaches the CLI — evidence: `echo_arg({token:"SUBST-9f3a-PROOF"})` returned exactly `SUBST-9f3a-PROOF`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Break the command deliberately and confirm the failure is reported — evidence: a missing binary returned `/bin/bash: line 2: magicpath-ai-does-not-exist: command not found` and an unknown subcommand returned `error: unknown command 'definitely-not-a-command'`; both with `threw:false`, so the transport swallows exit codes and reports failure as returned text rather than an exception
- [x] T009 Restore the working command and re-run the success call — evidence: `info_bare` and `info_abs` both returned `version 2.3.2, authenticated false`
- [x] T010 Answer whether one manual can carry several tools — evidence: yes, and only via discovery; `node_modules/@utcp/cli/dist/index.js` declares the template fields `commands`, `env_vars`, `working_dir`, `auth` and no `tools`, so one `register_manual` call against a discovery command yielded 3 tools (`magicpath_probe.info_bare`, `magicpath_probe.info_abs`, `magicpath_probe.echo_arg`)
- [x] T011 [P] Confirm whether Code Mode's tool search surfaces `cli` tools — evidence: `search_tools` returned all five probe tools with generated TypeScript interfaces, and `echo_arg` was typed `token: string` from its input schema
- [x] T012 Promote or remove the probe — evidence: nothing to remove; `.utcp_config.json` closes at sha256 `2fdac285941e9d99`, identical to its pre-phase baseline, with 13 manuals and `git status --porcelain` empty for that path
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] A recorded Code Mode call returns MagicPath's own output through a `cli` manual, and a broken command is visibly rejected
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:protocol -->
## Verification Checklist

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P0] The config baseline is captured before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The probe registers one command and claims no capability it does not exercise
- [x] CHK-011 [P1] The added entry matches the shape the installed plugin declares
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria in spec.md are met
- [x] CHK-021 [P0] The success path is an observed call result, not an inspected config
- [x] CHK-022 [P0] The failure path is exercised, so a green result carries information
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The thirteen pre-existing manuals are unchanged
- [x] CHK-FIX-002 [P1] No probe entry outlives the phase without an owner
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] The probe command only reads; no MagicPath state is created
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks stay synchronized with what shipped
- [x] CHK-041 [P1] The two open questions are answered or carried forward explicitly
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 6 | 6/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-29
<!-- /ANCHOR:summary -->

---
