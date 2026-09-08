---
title: "Implementation Summary: CI push gates and runtime document truth"
description: "The spec-kit check and the changed-packet gate run on direct pushes, the workflows README says which gate answers to which trigger, the four standalone rule harnesses run in the validation lane, the skip switch is documented, the save command names the route categories the runtime accepts, and a stale wiring comment is gone."
trigger_phrases:
  - "ci push triggers summary"
  - "what shipped round three"
  - "spec-kit check on push"
  - "changed packet validation on push"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/019-ci-push-gates-and-runtime-doc-truth"
    last_updated_at: "2026-09-07T15:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "None; continue the round-three closeout"
    blockers: []
    key_files:
      - ".github/workflows/spec-kit-check.yml"
    session_dedup:
      fingerprint: "sha256:c73784700cba868645f4aa0cb6d91b5ed14f39760d68d7ff97a0053081551726"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: CI push gates and runtime document truth

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-ci-push-gates-and-runtime-doc-truth |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The CLI runtime lane's third round found that the artifact the round-one census presented as closing the CI-invisibility gap was itself invisible: the spec-kit check workflow ran only on pull requests while the repository pushes release lines directly, and the changed-packet gate had the same shape. Both now run on pushes to main and the release lines, the changed-packet gate picks its diff base by event and falls back to the parent commit on a first push, and the mirror checks that require the shared package get the install they were missing. The workflows README carries a table of which gate answers to which trigger and why.

### Harnesses that run, documents that match

Four rule harnesses under the CLI tests folder were named by no lane; they now run at the end of the validation lane and the tests README names them. The environment reference gains the skip switch `validate.sh` reads. The save command listed eight route categories where the runtime folds everything into six; it now lists those six and the aliases the runtime accepts. A comment in the save workflow announced wiring the lines below it already did.

### Rows that did not reproduce

The pi adapters import a shared module by a path that does not resolve from their folder, and their README says why: they are written for the `.pi/extensions/` symlink base, from which the fallback import resolves. The root `.env.example` the reference points at exists; the lane searched under `.opencode` only.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/spec-kit-check.yml` | Modify | Push trigger with the same path filter; install step before the mirror checks |
| `.github/workflows/changed-packet-validation.yml` | Modify | Push trigger; base commit chosen by event |
| `.github/workflows/README.md` | Modify | Push versus pull-request table with the reason per gate |
| `runtime/ENV-REFERENCE.md` | Modify | The skip switch row |
| `runtime/cli/package.json` | Modify | The four rule harnesses join the validation lane |
| `runtime/cli/tests/README.md` | Modify | The harnesses named |
| `.opencode/commands/speckit/save.md` | Modify | The six route categories and their aliases |
| `runtime/cli/core/workflow.ts` | Modify | Comment says what the code does |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every row was re-read in the main checkout first; two rows fell to a README sentence and a directory listing. The workflow files changed and were parsed; the harnesses were run by hand before joining the lane; the documents changed in one literal pass. The commit was assembled in a private index.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the path filter on the push trigger | Six suites on every unrelated push would be pure cost; the README says so |
| Fall back to the parent commit on a first push | An all-zero before-sha has no diff base; the parent is the honest one |
| Record the pi adapter rows | The adapters are written for the `.pi/extensions/` symlink base and their README says so; the fallback resolves from there |
| Record the `.env.example` row | The file is at the repository root where the reference points |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| YAML parse of both workflows | ok |
| First push run of the spec-kit check (`e43388b921`) | Two failures the pull-request-only history had hidden: the mirror job required the shared package's compiled output, and the runner has no ripgrep, so the recipe and residue-sweep suites exited 2. The mirror step now builds the package and a step installs ripgrep before the CLI project |
| Second push run of the spec-kit check (`82d2b58c36`) | The CLI project passed; the runtime project failed on Linux for three environmental reasons: four embedder suites hard-coded the macOS `/private/tmp` root, the plugin-purity suite imports the OpenCode plugin SDK that only `.opencode/package.json` declares, and the adapter-parity discovery case spawned the live advisor. The suites use a short real temp root, the workflow installs the plugin SDK, and the discovery case stubs the advisor target the way its sibling cases do; 104 files and 1,260 tests pass locally after the change |
| The four harnesses run by hand | exit 0 each |
| Full runtime project | 104 files, 1,260 tests pass |
| Full CLI project | 139 files, 1,358 tests pass |
| Legacy and validation lanes | the runtime project passed 104 files and 1,260 tests, the CLI project 139 files and 1,358 tests, the legacy lane exit 0, and the validation lane 31 and 83 checks plus the four harnesses with exit 0 |
| `validate.sh --strict --recursive` on the program | 23 × RESULT: PASSED |
| sk-doc validator on touched documents | exit 0 on all 49 touched documents |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The push triggers were verified by the first push after this commit** it failed on two gaps that a pull-request-only gate had never exercised, both closed in the follow-up commit.
2. **The review-time gates stay pull-request only** The README table says which and why.
<!-- /ANCHOR:limitations -->

---
