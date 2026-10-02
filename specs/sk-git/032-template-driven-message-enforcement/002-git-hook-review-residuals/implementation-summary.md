---
title: "Implementation Summary"
description: "The ten findings a five-iteration deep review left after phase 1 are closed: a crashed checker blocks, no hook names a spec packet, the node-free rules probe answers as the validator does, a bad contract regex cannot hang a gate, and the docs match the code."
trigger_phrases:
  - "git hook residuals summary"
  - "rules probe parity shipped"
  - "contract regex backtracking fixed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/032-template-driven-message-enforcement/002-git-hook-review-residuals"
    last_updated_at: "2026-10-02T16:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All residual review findings fixed and verified in worktree 075"
    next_safe_action: "Commit in worktree 075, then merge to main on the operator's go-ahead"
    blockers: []
    key_files:
      - ".skilled/scripts/git-hooks/lib/message-contract-gate.sh"
      - ".skilled/bin/lib/compiled-route-layout.cjs"
      - ".skilled/skills/sk-git/scripts/validate-message.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fd6197bf-4447-484a-82b8-d9015d93169d"
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
| **Spec Folder** | 002-git-hook-review-residuals |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A contract template can no longer hang your commits. A pattern such as `^(a+)+$` used to keep the validator busy past any patience; the two processes the hooks and agent gates start now switch V8 to its linear-time engine after excessive backtracking, and the same input fails its rule in about 200 ms.

### Phase 2: git-hook-review-residuals

The node-free check that decides whether a repository declares rules now looks where the validator looks and reads the heading the way it does. Before, it disagreed four ways, so without node a commit could pass silently or block on rules nobody declared. The legacy pre-commit blocks when its comment checker crashes instead of reading the crash as a clean commit. The router program packet's path lives in one place, the route layout module, so the machine-wide hook, the guard and the sync tool move together when that packet does. A test now fails when the stamper's attribution keys drift from the commit template's. The parent packet's acceptance criteria, the sk-git feature catalog and the CI gate map now say what the code does. One review finding, the copied source-root block, needed no change: a test already compares all nine copies.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/git/pre-commit` | Modified | Block on a checker crash |
| `.skilled/bin/lib/compiled-route-layout.cjs` | Modified | One definition of the authored program dir |
| `.skilled/bin/compiled-route-guard.cjs`, `.skilled/bin/compiled-route-sync.cjs`, `.skilled/scripts/git-hooks/pre-commit` | Modified | Read it from the layout module |
| `.skilled/scripts/git-hooks/lib/message-contract-gate.sh` | Modified | Validator-parity probe |
| `.skilled/skills/sk-git/scripts/validate-message.mjs`, `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | Modified | Linear-time regex fallback |
| `.skilled/scripts/git-hooks/prepare-commit-msg` | Modified | Comment naming the drift test |
| Hook and sk-git tests (3 files) | Modified | Regression and drift tests |
| `../acceptance-criteria.md`, sk-git feature catalog, `continuous-integration.md` | Modified | Doc drift |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Claude wrote each change as literal text in a single-change brief, and DeepSeek V4.1 Flash at max effort applied it through cli-opencode in worktree 075, in six serial dispatches. After each one Claude read the diff, ran the affected suites, and ran the new test against the old code to see it fail there. Nothing is committed yet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A runtime regex-engine switch, not a pattern lint | A nested-quantifier lint rejects two safe patterns the shipped templates use, `(-[a-z0-9]+)*`, so it would block every commit |
| Set the flag in the CLI entry points only | The OpenCode and Pi transports import the library into a host process, whose flags are not ours to change |
| A drift test for attribution keys, not a template read | prepare-commit-msg stays node-free; the test makes drift visible instead |
| A configured contractDir that points nowhere counts as declared | The validator reports it as a broken contract, so the gate must stay closed without node too |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Hook suites | autostash 9, commit-msg 34, mass-deletion 12, pre-commit 67, pre-push-message-contract 15, pre-push 46, prepare-commit-msg 66, source-root-selection 58; all 0 failed |
| Node tests | message-contract 23, git-rule-checks 26, git-preflight-advisory 7; all 0 failed |
| Comment hygiene checker test | All cases pass |
| New tests on the old code | All fail there (crash rc 0; moved packet 2 failures; probe 4 wrong answers; validator still running after 12 s; drifted key detected) |
| Route guard | Exit 0 before and after |
| Route tests | The same 14 failures before and after; none introduced |
| Agent gate smoke test | Still denies a bad `git commit -m` with the flag set |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The linear-time fallback covers the hooks' and agent gate's own processes only.** A host that imports the library directly keeps V8's default engine.
2. **The probe still trims nothing.** A `skgit.contractDir` value with surrounding spaces is trimmed by the validator but not by the probe; git config values rarely carry them.
3. **Fourteen route tests fail in this worktree before and after the change.** They are outside this packet.
<!-- /ANCHOR:limitations -->

---
