---
title: "Implementation Summary: Clone path and messages"
description: "The README adapting block names the provision command, hook trust and the tree's real removal and add steps; the guard's stale line names the refresh and copy; an unprovisioned checker names the provision command instead of a stack."
trigger_phrases:
  - "clone path and messages implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages"
    last_updated_at: "2026-10-13T19:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built R1, R2, R4 and R5 on three concurrent DeepSeek dispatches"
    next_safe_action: "Run the clone and copy ledger rows, then the five-iteration review"
    blockers: []
    key_files:
      - "README.md"
      - ".skilled/bin/compiled-route-guard.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-029-001"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Clone path and messages

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-clone-path-and-messages |
| **Status** | In Progress |
| **Completed** | Not yet |
| **Level** | 2 |
| **Branch** | `worktrees/133-surface-setup-build`, from origin/main `732f9e9d30` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A user who clones the repository now finds the setup steps the checks need in the README block, and the two failures that named no fix now name one.

- `README.md` "Before you start" opens with `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .` for a fresh clone and `git config --local skilled.trustRepoHooks true` for a clone that should run the hooks. Removal step 6 names the two feature-catalog files, step 7 runs `regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write` for `graph-metadata.json` and leaves only `causal_summary` to edit by hand, and add step 3 names the surface-count files and `leaf-scopes.json` for a packet copied from an example.
- `compiled-route-guard.cjs` keeps `Re-mint: <hubs>` and prints, per stale hub, `<hub>: run node .skilled/bin/compiled-route-manifest.cjs refresh --hub <hub> --skill-root .skilled/skills/<hub>, then copy <runtime manifest> over <authored manifest>, or commit with the hooks installed so the pre-commit gate does both`. The stale result carries the same text as `fix`, so `--json` has it too.
- `root-router-contract.cjs` throws `@spec-kit/shared/frontmatter/parse-frontmatter.js is not built here; run bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision . from the repository root` with code `SHARED_NOT_BUILT` when that package cannot be resolved; any other load error is rethrown. `ci-skill-root-metadata.cjs` prints that one line and exits 1; the doctor's 12-lib line carries it unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `README.md` | Modified | R1 and R4 |
| `.skilled/bin/compiled-route-guard.cjs` | Modified | R2 stale line; shared `manifestPair` derivation; `staleFix` exported |
| `.skilled/bin/tests/compiled-route-manifest.test.cjs` | Modified | T1, T2 |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` | Modified | R5 named failure |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Modified | R5 stack-free exit |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs` | Modified | T3, T4 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three cli-devin dispatches ran at once on `deepseek-v4-1-flash-max` with `--permission-mode dangerous`, each with `AI_SESSION_CHILD=1`, `</dev/null` and a 1,500 s alarm: README (R1 and R4 together, since both edit the block), guard (R2) and contract library (R5). Each exited 0 and stayed inside its named files. The orchestrator read each diff, reran the battery and both test files, and proved each test against the origin/main source.

The ledger rows follow once the build is committed.

| ID | Test | Before | After |
|----|------|--------|-------|
| T1 | guard stale fix names the refresh command, the skill root and both manifest paths | before: exit 1 | after: exit 0 |
| T2 | guard stale fix gives a second hub its own skill root and manifest | before: exit 1 | after: exit 0 |
| T3 | an unprovisioned tree names the provision command in one line with no stack frame | before: exit 1 | after: exit 0 |
| T4 | an unrelated missing module keeps its own error | before: exit 0 | after: exit 0 |

T1 and T2 ran alone with `--test-name-pattern` against `git show origin/main:.skilled/bin/compiled-route-guard.cjs`, then against the final file. T3 and T4 ran from temporary copies of the test file with the other call removed, against `git show origin/main:` of the library, then against the final library; the copies were deleted. T4 passes before because it guards behavior the old library already had.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The `Re-mint:` line stays and the command goes on the next line | The authored-drift branch prints its fix that way, and nothing that reads `Re-mint:` has to change |
| `ci-skill-root-metadata.cjs` catches only `SHARED_NOT_BUILT` | An uncaught throw prints Node's stack, so the CLI needs the catch for the stack-free line; every other error still throws |
| The `provision` usage line in `worktree-naming.sh` stays | Research called the retitle optional, and a usage string does not justify a sk-git release |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline at `732f9e9d30` | Battery all exit 0; `compiled-route-manifest.test.cjs` 46 of 46; `root-router-contract.test.cjs` exit 0; drift guards 4 passed, 278 warnings |
| After the build | Battery all exit 0; `compiled-route-manifest.test.cjs` 48 of 48; `root-router-contract.test.cjs` exit 0; drift guards 4 passed, 278 warnings; `node --check` on the three scripts |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A half-provisioned tree still prints Node's error.** When the `@spec-kit/shared` link exists but its `dist` was never built, the require fails on the absolute `dist` path, which the relabel does not match. The contract builder observed it; a fresh clone has no link at all, so it gets the named line.
<!-- /ANCHOR:limitations -->
