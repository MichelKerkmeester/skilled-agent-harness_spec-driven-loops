---
title: "Implementation Summary"
description: "Provisioning a worktree now builds the two packages whose output runtime suites import, targets the worktree it runs in rather than the primary checkout, and an unprovisioned checkout fails those suites with the command that fixes it."
trigger_phrases:
  - "worktree build provisioning"
  - "provision builds missing outputs evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/061-worktree-build-provisioning"
    last_updated_at: "2026-10-05T09:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Named spec-kit's runtime and CLI build outputs in the provision list"
    next_safe_action: "Continue with the v4 parent data repairs phase"
    blockers: []
    key_files:
      - ".skilled/skills/sk-git/scripts/worktree-naming.sh"
      - ".skilled/skills/sk-git/scripts/worktree-provision-paths.txt"
    session_dedup:
      fingerprint: "sha256:4fb013e5b6b1aa6c01d2a3af00fea46f0d2e55c90b85e1eb02b0fb3b194d095a"
      session_id: "scaffold-061-worktree-build-provisioning"
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
| **Spec Folder** | 061-worktree-build-provisioning |
| **Completed** | 2026-09-24; follow-up 2026-10-05 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A worktree you provision can now run the whole runtime suite. Before, two suites failed in any worktree with "Cannot find module", because they import build output that provisioning never produced.

### Provision builds what the suites import

Each line of the provision path list can now name a file the package's build writes. Provision installs as before, then builds the package when that file is missing. A build that fails, or exits 0 without writing the file, counts as a failure, so provisioning never reports a tree ready that is not. The advisor runtime and the communication projection package carry their outputs, and the projection package is on the list for the first time.

### Provision works on the worktree you run it in

Run with no argument, provision used to check the primary checkout, because it borrowed the default the number allocator needs. From inside a worktree it therefore did nothing to that worktree and still exited 0. It now defaults to the working tree it runs in; allocation still counts across the whole clone.

### A missing build says how to fix it

The plugin purity suite and the pi-extension suite now fail with `Run: bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision` when the build output they need is missing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt` | Modified | Optional build output per line; projection package added. Follow-up: build outputs for spec-kit's `runtime` and `runtime/cli` |
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modified | Build step; default to the current worktree |
| `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modified | Provisioning tests with npm stubbed, including a linked worktree. Follow-up: fails when a listed package with a build script and an untracked `main` names no output |
| `.skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts` | Modified | Name the fix for a missing plugin build |
| `.skilled/skills/system-spec-kit/runtime/tests/spec-gate-pi-extension.vitest.ts` | Modified | Check for the advisor build before the imports load |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A GPT-6 Luna executor made the script, list and test changes from a brief. The orchestrator reverted two `--no-provision` flags it had added to existing tests unasked, since the suite passes without them. Running provision for real then built nothing and still exited 0, which exposed the primary-checkout default; a second short Luna brief changed that default and added a linked-worktree test. The orchestrator ran each check, both negative controls and the real provisioning run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Name the build output in the list rather than guess it | Packages keep their output in different places; guessing would build the wrong package or none |
| Count a zero-exit build without its output as failed | A build that exits 0 having written nothing is the exact failure provisioning exists to catch |
| Default provision to the current worktree | Its documented use is to run inside a worktree made another way; the allocator keeps its clone-wide default |
| Follow-up: list spec-kit's runtime and CLI outputs after all | The out-of-scope reason covered `validate.sh` only. In worktree 089, made by `worktree-naming.sh create`, `repair-derived` failed because `@spec-kit/runtime/dist/api/index.js` was missing, and the continuity writer's `dist/continuity/generate-context.js` was missing too. Each build pulls in `shared` through its project references, so `shared` needs no output of its own |
| Fail the suites with the command rather than skip them | A skipped suite hides a broken checkout; a named failure tells the reader what to run |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `worktree-naming.test.sh` | PASS, 80 of 80 |
| Naming suite against the previous script | 7 FAIL as intended; the other 73 pass |
| Both suites before provisioning | Each fails with the provision command in its message |
| `worktree-naming.sh provision`, no argument, from this worktree | `0 installed, 1 built, 9 already present, 0 failed`; primary checkout status unchanged |
| Both suites after provisioning | PASS, 10 of 10 |
| `tsc -p runtime/tsconfig.tests.json` | Same 91 errors with and without this phase's edits |
| `validate.sh --strict` on this phase | PASS, `RESULT: PASSED` |
| Follow-up: provision with spec-kit's `shared/dist` and `runtime/dist` removed, before the fix | `0 installed, 0 built, 9 already present, 0 failed`; both outputs missing; `repair-derived` reports `failed=1` |
| Follow-up: the same, after the fix | `0 installed, 2 built, 9 already present, 0 failed`; both outputs present; `repair-derived` reports `failed=0`; a second run builds 0 |
| Follow-up: `worktree-naming.test.sh` | PASS, 83 of 83 |
| Follow-up: the suite with the output check | PASS, 85 of 85 |
| Follow-up: the same suite against the list before the fix | FAIL, 84 of 85: "every buildable listed package names its build output" names `.skilled/skills/system-spec-kit/runtime` and `.skilled/skills/system-spec-kit/runtime/cli` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Spec-kit's own packages list no build output.** A fresh worktree still needs its CLI and runtime built; `validate.sh` fails closed with its own message when they are stale or missing.
2. **Other worktrees are not provisioned by this change.** Each picks up the build step the next time `create` or `provision` runs in it.
<!-- /ANCHOR:limitations -->

---
