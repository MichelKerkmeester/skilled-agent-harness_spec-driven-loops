---
title: "Feature Specification: embed engine"
description: "A repository cannot take the shipped template without a way to keep its own instruction lines. This child builds plan, apply and restore around a preservation invariant, a plan digest, backups and a write allowlist enforced in code."
trigger_phrases:
  - "agents md embed engine"
  - "preservation check"
  - "plan digest apply restore"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/003-embed-engine"
    last_updated_at: "2026-10-30T13:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Built the plan, apply and restore engine, the preservation proof and its suite"
    next_safe_action: "Child 004 wires check, embed and restore into the command plumbing"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: embed engine

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/292-doctor-agents-md` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-check-engine |
| **Successor** | 004-command-plumbing |
| **Handoff Criteria** | Plan, apply and restore hold the preservation invariant on temporary copies of the foreign and forked fixtures, and a planted drop restores automatically |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the `/doctor:agents-md` build inside `agents/021-doctor-agents-md`.

**Scope Boundary**: The engine, its suite, the preservation function, the backups and the restore route. It adds no route manifest entry and no human-facing presentation, which child 004 owns.

**Dependencies**:
- `/doctor:sk-skill` (packet `sk-doc/075-doctor-sk-skill-command`) must be on `main` before implementation starts, and every phrase, route, bridge and mirror count is re-measured then.
- The check report from child 002 is this engine's input, and the exported three-way classifier from the update engine is its merge primitive.

**Deliverables**:
- `scripts/agents-md-embed.cjs` with `plan`, `apply --plan-digest` and `restore --run`.
- `scripts/tests/agents-md-embed.test.cjs` driving temporary copies only.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Carrying a repository's own lines into a block is where this command can do real damage. A composition that misses one section silently deletes work somebody wrote, and a backup taken after the first write is not a backup. Nothing today composes a template plus a repository block at all, so the safety properties have to be built rather than inherited.

### Purpose
Make the write path provable. Compose in memory, show the diff and the ledger, hash what was shown, refuse an apply that would write anything else, back up before the first byte, and prove after the write that every repo-unique line is still there. When the proof fails, restore automatically.

### Precondition
Implementation starts only after `/doctor:sk-skill` (packet `sk-doc/075-doctor-sk-skill-command`) lands on `main`. That command adds a router, a route and an advisor bridge, so the route, bridge, phrase and mirror counts this packet quotes are re-measured from the branch the child starts on, and recorded in `scratch/baseline.txt` before the first edit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured on this worktree at `006d96370d`, before any implementation. These are the numbers this child's criteria are read against.
```text
$ node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js
OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).
  16374  #### Blast-Radius Management

$ node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs
[repo-rules-check] RESULT: PASSED (11/11 checks)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `plan`: compose in memory, print each target path with its action, a unified diff per file, the full new block, the byte budget before and after, the preservation ledger, the backup location, the undo command and a plan digest.
- `apply --plan-digest <d>`: recompose, refuse a digest mismatch, back up first, check every path against the allowlist and write.
- `restore --run=<dir>`: put back exactly the recorded files, print its own plan, take one yes and verify byte equality.
- The preservation check as a pure function, `preservationCheck(old, new, manifest) -> {dropped, foreign}`.

### Out of Scope
- Deciding what should move out of the block: budget overflow is a finding, never an automatic move.
- Any write outside the allowlist, including `.skilled/**` and `~/.claude/CLAUDE.md`.
- Route, workflow and presentation wiring.

### Composition rules

`AGENTS.md` becomes every current shipped section from `derived`, in manifest order, then the block. The block carries, in this order: the existing block content verbatim; every unmarked section verbatim in original order; for each edited or unknown-base section, a `### Carried from <id>` subheading followed by its local-only lines verbatim; and the unique lines of a divergent `CLAUDE.md` and `.codex/AGENTS.md`, each under `### Carried from <path>`. A `stale-known` section is replaced with no carry, because every line of it is a known shipped line. For an edited section whose base is known, the engine first tries a three-way merge through the update engine's exported classifier; when that merge is clean it still defaults to adopt-and-carry, because a merged section stays edited forever.

### The preservation invariant

A line is a trimmed line, excluding blank lines and lines that are only `---`. A known shipped line is any line of any body in `derived.sections` or `derived.history`. Checked after every apply:

1. Every line of the old `AGENTS.md` that sat in an unmarked section or in the old block appears in the new block at least as many times as before.
2. Every line of the old `AGENTS.md` that sat in a matched shipped section and is not a known shipped line appears in the new block at least as many times as before.
3. Every unique line of a removed `CLAUDE.md` or `.codex/AGENTS.md` appears in the new `AGENTS.md` at least as many times as before.
4. Every line of the new `AGENTS.md` outside the block is a line of a current shipped body.

### Write allowlist

`AGENTS.md`, `CLAUDE.md`, `.codex/AGENTS.md` (remove only), `.cursor/rules/repo-local.md`, `.cursor/rules/skill-routing.md` (only by invoking the pointer sync generator) and `REPO RULES.md`, plus the backup directory. Nothing else, ever.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/agents-md-embed.cjs` | Create | `plan`, `apply` and `restore`, with the preservation function |
| `.skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` | Create | The failing-first suite, driving temporary copies |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `plan` writes nothing: a write-spy over a plan run records zero filesystem writes. |
| REQ-002 | `apply` without the matching plan digest exits 2 and writes nothing. |
| REQ-003 | On the `foreign` and `forked` fixtures, `plan` then `apply --plan-digest` reports `dropped: []` and the fourth part of the preservation invariant holds. |
| REQ-004 | A planted drop, composed through a test seam, triggers automatic restore and ends `STATUS=FAIL` with the dropped lines printed. |
| REQ-005 | `restore --run=<dir>` makes every recorded file byte-identical to its backup, recreates a removed file and deletes a file the run created. |
| REQ-006 | A second `embed` on the result prints `NOTHING TO DO`. |
| REQ-007 | The set of written paths is a subset of the allowlist, checked before each write. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | A backup path that `git check-ignore` does not match falls back to the OS temp directory and the plan shows that path. |
| REQ-009 | The `claude-only` fixture creates `AGENTS.md` and removes `CLAUDE.md`, and `--keep-claude-md` keeps it. |
| REQ-010 | `REPO RULES.md` gains only the missing shipped rows, and the repo-rules checker passes against a temporary root afterwards. |
| REQ-011 | `.cursor/rules/repo-local.md` exists exactly when the block is non-empty. |
| REQ-012 | The engine never deletes a backup directory and never stages or commits. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` reports `fail 0`.
- **SC-002**: On a temporary copy of the `foreign` fixture, `plan` then `apply --plan-digest` prints `preservation: kept <n>, carried <m>, shipped-replaced <k>, dropped 0`.
- **SC-003**: On the same copy, `restore --run=<dir>` followed by a comparison against the pristine copy exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The update engine's exported three-way classifier | The section merge falls back to adopt-and-carry | Named in the plan output so the operator sees which path ran |
| Risk | A composition that drops a line deletes someone's work | High: silent data loss | REQ-004's automatic restore and the printed dropped lines |
| Risk | The engine writes outside its allowlist | High: the boundary is the point of the command | REQ-007 checks every path in code before each write |
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A plan over a 38 KB file finishes in under five seconds, because composition is in memory and the merge call happens at most once per edited section.

### Security
- **NFR-S01**: The engine writes only under the target root and the backup directory, and prints consumer paths at run time rather than into any tracked file.

### Reliability
- **NFR-R01**: A restore verifies byte equality against the recorded hashes and exits non-zero when one differs.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a repository with no `AGENTS.md` gets the template plus the empty block.
- Maximum input: the observed 38 KB fork is carried verbatim, and budget overflow is reported as a finding rather than refused.
- Failure path: a plan digest mismatch exits 2 before the first write.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | One engine with three targets, one pure invariant function and a suite over temporary copies |
| Risk | 15/25 | The write path is the only place this packet can lose a line |
| Research | 8/20 | The merge primitive and the backup precedent are read from the tools that own them |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a clean three-way merge ever beat adopt-and-carry? The design keeps adopt-and-carry as the default and shows both options in the plan, so the operator can still choose.
- What happens when the backup directory is inside a repository that ignores it only by path? The plan shows the resolved path either way, which is the mitigation the design records.
<!-- /ANCHOR:questions -->

---
