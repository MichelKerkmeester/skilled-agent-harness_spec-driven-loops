---
title: "Implementation Summary: Phase 21: repo-rules-source-root-migration"
description: "The rule corpus moves under .skilled, the root path becomes a tracked per-entry farm, and every live reference plus the corpus checker follows the canonical path."
trigger_phrases:
  - "repo rules source migration summary"
  - "phase 21 status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/021-repo-rules-source-root-migration"
    last_updated_at: "2026-09-20T10:30:00Z"
    last_updated_by: "pi"
    recent_action: "Packet closed: docs, research synthesis, verification receipt"
    next_safe_action: "Open the PR and leave the merge to the operator"
    blockers: []
    key_files:
      - ".skilled/repo-rules/blast-radius.md"
      - ".skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs"
      - "REPO RULES.md"
      - "AGENTS.md"
      - ".github/workflows/repo-rules-corpus.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "021-repo-rules-source-root-migration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the three sibling repositories be re-pointed at the canonical path?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 21: repo-rules-source-root-migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 21 of 22 |
| **Status** | Complete |
| **Started** | 2026-09-20 |
| **Branch** | `worktrees/056-repo-rules-source-root-migration` |
| **Base Commit** | `c1817442b2` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The rule corpus moves to `.skilled/repo-rules/` and the repository-root `repo-rules/` becomes a
farm of 13 tracked per-entry symlinks, so every existing consumer keeps resolving while the
canonical path is the one the repository points at.

### The Move

A rename-only commit carries the 13 files, and the farm entries are added in the same unit so no
commit leaves the corpus unreachable. `git log --follow` still walks each rule's history.

### The References

`REPO RULES.md` stays at the root and its 26 router rows point at the canonical path, as do
`AGENTS.md`'s five links and the 13 rule-body backlinks, which gain one directory level.

### The Checker

`check-repo-rules.cjs` probes `.skilled/repo-rules` and then `repo-rules`, and identifies router
rows by resolving each link into the chosen directory. It keeps its nine checks and its output
format, so the phase's claim is a verdict delta on an unchanged instrument. The farm-integrity
assertion lives beside it in the phase's own `scratch/check-farm.cjs`, because a tenth check
inside the checker would change the very contract the claim is measured on.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ordered as: baselines, a bounded research loop over the consumer census, the move and the farm,
the reference rewrite, the machine and consumer surfaces, then the verification list. Each unit is
its own commit, and the divider fix in `answer-the-actual-request.md` is separable from the move so
the corpus fix can be reverted without reverting the relocation.

### Where the plan and the tree disagreed

- **The research surface.** The plan names `/deep:research`; its contract is a thin router over the
  deep-loop fan-out engine, and a Pi child running it with `--executor=cli-pi` would dispatch Pi
  from inside a Pi stack, which the shared runtime refuses. The engine was invoked directly with
  the arguments the command would compute — one `cli-pi` lineage, three iterations. `scratch/research-dispatch.sh`
  is the run's own record and `research/research.md` §2 states the deviation.
- **The commit order.** A rename-only commit was planned, with the farm, the divider fix and the
  checker as separate steps. The backlink depth and the checker's link resolution have to change
  together or the checker is transiently red, so the farm, the divider fix and the layout-aware
  checker ship in one commit (`6eedc5f930`) behind the rename-only move (`f1b798914e`).
- **`.claude/agents/**` is hand-authored, not generated.** Its body parity with `.skilled/agents/**`
  is what the mirror gate enforces, so both sides were edited identically and the generated trees
  (`.pi`, `.codex`, `.hermes`) were regenerated.
- **The benchmark cases.** The generator reads `cases.json` and never writes it; the case set is
  frozen word-for-word from the measurement baseline and its coverage case keys on bare filenames,
  so there was no case artifact to refresh and the frozen set was left alone.
- **The CI filter needs its twin.** `check-gate-inputs.sh` fails a path filter that names one source
  root without its twin in the same block, so the canonical filter carries a deliberately inert
  `.opencode/repo-rules/**` twin with the reason written beside it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Root path after the move | Per-entry symlink farm | A whole-directory link collapses in the GitHub web view and degrades in clones without symlink support, and deleting the root path breaks three sibling repositories |
| `REPO RULES.md` | Stays at the repository root | Gate 5, the checker's sentinel probe and the CI trigger filter all key on that path |
| Checker portability | Probe both layouts, canonical preferred | The skill is documented to work in repositories with no `.skilled/` tree |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Corpus checker, worktree | `RESULT: PASSED (9/9 checks)` — 13 files, 8 trigger rows, 13 index rows, 252 unique phrases, 45 resolving rule links |
| Corpus checker, plain-layout fixture | `RESULT: PASSED (9/9 checks)` in a temp tree carrying only `repo-rules/` |
| Farm integrity | `PASSED files=13 links=13 every link resolves`, and the mutated fixture names a deleted entry |
| Gate inputs, mirror gates, derived artifacts | `check-gate-inputs.sh` `RESULT: PASSED`; runtime mirrors, Codex agents and prompts and Pi agents `PASS`; doctor roster and catalog `STATUS=OK`; the Hermes drift set equals the base (`DRIFT cli-devin`) |
| Frozen set unchanged | No modified or deleted frozen file since `c1817442`; the one activation manifest the commit gate re-minted differs by `effectivePolicyHash` |
| Links and history | Every `AGENTS.md` rule link resolves; `git log --follow` reaches 11 commits per rule through the move |
| Packet validation | Child `RESULT: PASSED`, parent `--recursive --strict` `RESULT: PASSED` |
| Full harness | `scratch/verify.sh` — `RESULT: PASSED (passed=20 failed=0)`, receipt in `scratch/verify-run.txt` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The three sibling repositories keep reading the root farm path and are not written to by this
  phase; re-pointing them at the canonical path needs the operator's explicit go-ahead.
- The `sk-orca` and `.pi/settings.json` changes in the main checkout belong to other work and are
  deliberately absent from every commit here.
<!-- /ANCHOR:limitations -->

---
