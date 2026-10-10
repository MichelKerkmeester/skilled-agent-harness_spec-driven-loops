---
title: "Implementation Summary"
description: "The agent-mirror gate now checks Codex agent mirrors in its checker and in both pre-commit hooks, and an orphaned Codex mirror blocks the commit."
trigger_phrases:
  - "codex mirror gate implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/003-codex-mirror-gate"
    last_updated_at: "2026-10-10T05:26:27Z"
    last_updated_by: "codex-mirror-gate-builder"
    recent_action: "Wrote the implementation record"
    next_safe_action: "Orchestrator reviews the packet and updates spec.md and goal.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-codex-mirror-gate"
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
| **Spec Folder** | 003-codex-mirror-gate |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The agent-mirror gate now sees Codex agent mirors. A commit that changes `.codex/agents/<name>.toml` reaches the checker from both pre-commit hooks, is compared with its canonical body, and is blocked when the two disagree. A Codex mirror left behind after its canonical is deleted blocks the commit too. Deleting an agent now means deleting its `.codex` mirror in the same commit, the same rule the Claude mirror already follows.

### Phase 3: codex-mirror-gate

Before this change, the gate recognized only the `.opencode`, `.skilled` and `.claude` agent roots. Both hook filters used the same three-root pattern, so a commit that touched only a Codex mirror skipped the gate. The checker printed `no agent files to check` for a Codex path and exited 0, and its orphan check looked only for the Claude mirror.

The change adds `codex` to the checker's path pattern and to the staged-path filter in each hook, and adds one explicit `.codex/agents/<name>.toml` entry to the orphan check. The shared verifier library and its Codex content comparison are unchanged, because the library already lists Codex as an optional TOML mirror.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs` | Modified | Added `codex` to `AGENT_PATH_RE` (line 32), and a `.codex/agents/<name>.toml` entry to the orphan check (line 88) |
| `.skilled/hooks/git/pre-commit` | Modified | Added `codex` to the staged-path filter (line 87) |
| `.skilled/scripts/git-hooks/pre-commit` | Modified | Added `codex` to the staged-path filter (line 170) |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-agent-mirror-sync.vitest.ts` | Modified | Added three Codex cases: a Codex mirror changed on its own, a drifted Codex mirror, and a Codex mirror whose canonical is missing |
| `scratch/before/` and `scratch/after/` in this folder | Created | Pre-edit copies of the five touched files, and the command output recorded for each check |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The three regression cases were written before any checker or hook edit. Run against the unchanged checker, they failed with `Tests  3 failed | 3 passed (6)` (`scratch/before/vitest-red.txt`). After the checker and both hook filters were edited, the same file passed all six cases (`scratch/after/vitest-after.txt`).

The checker was then run by hand on the Codex path and on `--all`, both hooks were checked with `bash -n`, and `diff` confirmed that the shared library is unchanged and that the checker differs from its pre-edit copy only in the planned hunks. Nothing is committed. The commit and any push are left to the orchestrator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add one explicit `.codex/agents/<name>.toml` entry to the orphan list instead of deriving the list from `RUNTIME_MIRRORS` | A literal entry matches the Claude behavior in one line. Deriving the list would add an export to the shared library for a single entry, so that change waits for a fourth runtime. |
| Leave `mirror-sync-verify.cjs` and its Codex content comparison untouched | The library already lists Codex and normalizes its paths, so the gap sat only in the checker and the hook filters. |
| Keep `.pi/`, `.cursor/`, `.devin/` and `.hermes/` agent folders outside the gate | Each one needs an operator decision on whether it is a repo-managed mirror. Adding them here would make that decision by accident. |
| Write the regression cases before the checker edit | The first run had to show the gap, so a passing run afterwards means the fix closed it. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Goal 1: checker on `.codex/agents/code.toml` prints `1 agent(s) checked` and exits 0 | PASS. Output reads `1 agent(s) checked` with `OK`, `exit=0` (`scratch/after/sc-001.txt`). Before the fix the same command printed `no agent files to check` (`scratch/before/codex-path.txt`) |
| Goal 2: Vitest file prints `Tests  6 passed (6)` and exits 0 | PASS. `Tests  6 passed (6)`, `exit=0` (`scratch/after/vitest-after.txt`). The single orphan case reports `1 passed | 5 skipped (6)` (`scratch/after/vitest-t014.txt`) |
| Goal 3: grep shows `claude|codex)/agents` at line 87 of the first hook and line 170 of the second, exit 0 | PASS. Both lines printed, `exit=0` |
| Goal 4: `--all` prints `12 agent(s) checked` and exits 0 | PASS. `12 agent(s) checked`, `exit=0` |
| Goal 5: `bash -n` on both hooks prints only `exit=0` | PASS. `exit=0` |
| Goal 6: validate.sh --strict prints `RESULT: PASSED` | PASS. `RESULT: PASSED` on the final run (`scratch/after/validate-final.txt`) |
| Scope: shared library unchanged (REQ-007) | PASS. `diff` against `scratch/before/mirror-sync-verify.cjs` printed nothing, `exit=0` |
| Scope: `.pi/agents/` gap still open and recorded (REQ-008) | PASS. `plan.md` names `.pi/agents/`, and the checker still prints `no agent files to check`, `exit=0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The main checkout runs the old second hook.** `core.hooksPath` links `pre-commit` to `Public/.skilled/scripts/git-hooks/pre-commit` in the main checkout, which still has the old filter. Commits made from this worktree keep the old filter until the change reaches that checkout. Running the worktree copy by hand proves the file, not the live gate.
2. **Other runtime folders are still outside the gate.** `.pi/agents/` (twelve tracked files), `.cursor/agents/`, `.devin/agents/` and `.hermes/agents/` are absent from the path pattern, both hook filters and `RUNTIME_MIRRORS`. Bringing them in needs an operator decision.
3. **`--all` never reports an orphan mirror.** It lists canonical names only, so the orphan proof runs in path mode through the Vitest case. Changing `--all` is a separate fix.
4. **No hook-level test covers the Codex filter.** `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` is outside the files this phase changes, so a test there is a proposed follow-up.
<!-- /ANCHOR:limitations -->

---
