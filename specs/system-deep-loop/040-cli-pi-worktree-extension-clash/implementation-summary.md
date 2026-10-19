---
title: "Implementation Summary"
description: "A Pi run in a git worktree of this repo no longer has to fail on the doubled --fast flag: the first fast-mode copy in a load claims the package and a second copy registers nothing. It takes effect for the operator's global link once this change reaches main."
trigger_phrases:
  - "cli pi worktree extension clash implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/040-cli-pi-worktree-extension-clash"
    last_updated_at: "2026-10-19T11:44:12Z"
    last_updated_by: "orchestrator"
    recent_action: "Built the copy claim, proved it live and reviewed it"
    next_safe_action: "Packet complete. Merging into the live branch waits for the operator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-040-cli-pi-worktree-extension-clash"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 040-cli-pi-worktree-extension-clash |
| **Completed** | 2026-10-19 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Pi run started in a git worktree of this repo used to exit 1 before reaching the model: the worktree's fast-mode copy and the copy behind your user-level link both registered `--fast`, and Pi rejects that. Now the first copy in a load claims the package and any later copy registers nothing, so a cli-pi deep-loop child, the cli-pi kit or an interactive Pi session can start from a worktree.

### Let a second copy of the Pi fast-mode extension stand down, so cli-pi runs from a git worktree

Pi drops a duplicate extension only when two paths share a real path. In the main checkout your link and the project copy are the same file, so Pi loads one. In a worktree they are two files. Every extension in one Pi load shares one event bus, so the first copy emits a probe, hears no answer, answers later probes and registers. A second copy's probe is answered, and it returns before registering anything. Pi drops a load's listeners before a reload or a session switch, so a stale claim never silences the next load.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts` | Modified | `claimPackage` and the early return in the factory |
| `.pi/extensions/pi-fast-mode-w-subagent-support/tests/extension.test.ts` | Modified | A synchronous fake bus and three second-copy tests |
| `.pi/extensions/pi-fast-mode-w-subagent-support/tests/precedence.test.ts` | Modified | The same fake bus |
| `.pi/extensions/pi-fast-mode-w-subagent-support/tests/README.md` | Modified | Test count and coverage row |
| `specs/system-deep-loop/040-cli-pi-worktree-extension-clash/` | Created | This packet, its evidence and the smoke driver |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator reproduced the crash, read Pi's loader to find the cause and captured every baseline before a change. DeepSeek wrote the code and tests through cli-pi in five short briefs. The first design picked the winner by working directory; Luna found that Pi resolves resources against the session's cwd, which `--resume` can move, so that design could leave no copy registered. It was reverted and replaced by the bus claim, which Luna passed in round 2. The orchestrator reran every suite and drove five live cli-pi runs through the real `fanout-run.cjs` builder, using a temporary `PI_CODING_AGENT_DIR` overlay to stand in for a fixed copy behind your link.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the extension, not the cli-pi builder | Pi's CLI has only `--no-extensions` plus explicit `-e`, and no project setting can disable a user-scope auto-discovered extension, so a builder fix would re-implement Pi's loader |
| First copy in a load wins | Pi's own conflict rule is load order, and the extension API exposes no cwd at load time. In print mode Pi loads the project copy first (`scratch/smoke-*.json`) |
| Withdraw the cwd-based check | It reads `process.cwd()`, which differs from the session cwd on `--resume`, and could leave no copy registered |
| Leave `~/.pi` alone | Out of bounds; the live proof used an overlay in the session scratchpad |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Extension `npx vitest run` and `npx tsc --noEmit` | 80 passed (baseline 77), tsc exit 0 (`scratch/after-ext.txt`, `scratch/base-ext.txt`) |
| New same-bus test on the pre-change `index.ts` | Fails: 1 failed, 11 passed in `extension.test.ts` |
| `fanout-run.vitest.ts` and the deep-loop suite | 2,742 passed, 1 failed, 8 skipped before; 2,743 passed, 0 failed, 8 skipped after. The one baseline failure is the containment-mode test timing out under load; it passes alone (`scratch/base-deeploop.txt`, `scratch/after-deeploop.txt`) |
| Live run 1: worktree, your link as it is | Exit 1, the original `--fast` conflict (`scratch/smoke-1-worktree-unfixed-global.json`) |
| Live run 2: worktree, two fixed copies | Exit 0, `PI-OK` (`scratch/smoke-2-worktree-two-fixed-copies.json`) |
| Live run 3: control, second copy unfixed | Exit 1 (`scratch/smoke-3-control-unfixed-overlay-copy.json`) |
| Live run 4: main checkout, your link as it is | Exit 0, `PI-OK` (`scratch/smoke-4-main-plain.json`) |
| Live run 5: main checkout, fixed overlay copy, main's own copy unfixed | Exit 1, the mixed-version case in Known Limitations (`scratch/smoke-5-main-fixed-overlay.json`) |
| Luna review | Round 1 FAIL (P1 on the cwd design), round 2 PASS with no findings |
| `validate.sh --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Your global link still points at the main checkout's copy, which lacks the fix until this change reaches `main`.** Until then a worktree run still fails; `pi -ne` remains the workaround.
2. **A copy without the fix still collides.** A worktree whose branch predates this change keeps failing after `main` has it, until that branch takes the change (live run 5).
3. **The serving copy can be the user-scope one.** In Pi's pre-trust pass user extensions load first, so your link's copy can serve a worktree session. It is the same package, so only an uncommitted edit to the worktree's copy would differ.
<!-- /ANCHOR:limitations -->

---


