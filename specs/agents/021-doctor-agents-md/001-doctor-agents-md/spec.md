---
title: "Feature Specification: /doctor:agents-md"
description: "A repository's root AGENTS.md drifts from the shipped template with nothing reporting what shipped, what is repo-unique and what is stale. This phase builds /doctor:agents-md around a shipped manifest, a read-only check, an embed that proves no repo-unique line was dropped, and a restore that puts the previous bytes back."
trigger_phrases:
  - "doctor agents md phase"
  - "agents md shipped manifest"
  - "embed repo unique instructions"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase parent and its five child phases from the approved design"
    next_safe_action: "Start child 001 once the doctor sk-skill command is on main"
    blockers: []
    key_files:
      - "specs/agents/021-doctor-agents-md/001-doctor-agents-md/001-manifest-and-template-block/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->

# Feature Specification: /doctor:agents-md

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/292-doctor-agents-md` |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | agents/021-doctor-agents-md |
| **Predecessor** | None |
| **Successor** | 002-doctor-helper |
| **Handoff Criteria** | All five children pass `validate.sh --strict` and the three agents-md routes are live in the route manifest |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The template at the repository root is the only copy of the shipped instructions anywhere in the framework, and `/doctor:update` never reads it because it enumerates release units from paths under `.skilled/`. A consumer therefore has no way to learn which shipped sections it still carries, which of its lines are its own, or which of its own lines sit inside a shipped section where the next release will overwrite them. Forks accumulate template text interleaved with local sections, and a 38 KB fork is the hard case: it is over the Codex ceiling, its local content sits before §1, and the delivery-prefix anchors no longer land where the canary expects them.

### Purpose
Build one command whose `check` answers where a repository stands against a shipped manifest, whose `embed` moves a repository's own lines into one marked block while proving none was dropped, and whose `restore` returns the previous bytes. The phase is a phase parent because the work spans a template edit, a CI filter change, two engines and the command plumbing that routes them.

> **Phase-parent note:** This spec.md carries the decisions the five children honour. All detailed planning, task breakdowns, checklists and decisions per child live in the child folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured on this worktree at `006d96370d` before any implementation, from the repository root. Every acceptance criterion below that names a count is read against these numbers, and they are re-measured when implementation starts.
```text
$ node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js
OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).
Delivery prefix (AGENTS.md, end byte <= 16384):
  16374  #### Blast-Radius Management

$ node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs --check
[gate1-pointer-sync] PASS: 1 instruction files carry the root Gate 1 lookup.

$ node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs
[repo-rules-check] RESULT: PASSED (11/11 checks)

$ bash .skilled/commands/doctor/scripts/route-validate.sh
OK: route-validate — 19 routes validated, 3 warnings

$ bash .skilled/commands/doctor/scripts/tests/run-all.sh
[run-all] node:test (35 files): tests 699, pass 699, fail 0
[run-all] 7 suite(s) passed, 0 failed

$ wc -c AGENTS.md
   27679 AGENTS.md
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One shipped manifest of sections, pins, runtime copies, delivery budget and router rows, with a generated `derived` key.
- A read-only `check` with twelve named rows and exit codes 0, 1 and 2.
- An `embed` that composes, plans, takes one yes, applies and proves preservation, plus a `restore` route.
- The command plumbing: router, three workflows, presentation, route manifest entry, setup row, contract test and generated mirrors.
- Verification and the documentation rows the doctor family is expected to carry.

### Out of Scope
- Any edit to `.skilled/**` content the update engine owns beyond this command's own files.
- Activating the advisor bridges the routes derive, which is deferred by decision.
- Any automatic move of repository content out of the block, which is the operator's call.
- Consumer repositories as fixtures, because they are private and gitignored.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | Line 3 wording per D26 and the empty marked block per D7, inside child 001 |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Create | The shipped manifest, child 001 |
| `.skilled/commands/doctor/scripts/agents-md-manifest.cjs` | Create | `--write` and `--check` for the derived key, child 001 |
| `.skilled/commands/doctor/scripts/lib/agents-md-sections.cjs` | Create | Shared segmenter and classifier, child 001 |
| `.skilled/commands/doctor/scripts/agents-md-check.cjs` | Create | Read-only check engine, child 002 |
| `.skilled/commands/doctor/scripts/agents-md-embed.cjs` | Create | `plan`, `apply` and `restore`, child 003 |
| `.skilled/commands/doctor/agents-md.md` | Create | Router with the six canonical sections, child 004 |
| `.skilled/commands/doctor/assets/doctor-agents-md-check.yaml` | Create | Read-only workflow, child 004 |
| `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml` | Create | Plan-then-yes workflow, child 004 |
| `.skilled/commands/doctor/assets/doctor-agents-md-restore.yaml` | Create | Restore workflow, child 004 |
| `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt` | Create | Presentation templates, child 004 |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Three routes and the header router list, child 004 |
| `.github/workflows/spec-kit-check.yml` | Modify | Both path filter lists per D27, child 001 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:decisions -->
## 4. DECISIONS

Copied from the approved design with the reasons that decided them. A change to any row is an amendment to this phase, not a detail of a child.

| ID | Decision | Reason |
|----|----------|--------|
| D1 | One command with three routes: `check` (read-only, the bare-command target), `embed` (mutates) and `restore` (mutates). | It mirrors the report-plus-confirmed-action shape `/doctor:ci` already ships, and an undo that is itself a route is validated like any other write. |
| D2 | The writing target is named `embed`. | It is the operator's own word, and `align` already means "write a proposals run directory" in `/doctor:update`. |
| D3 | Repository content is split by binding mode: always-on content in the marked `AGENTS.md` block, action-triggered rules in local rule files routed by `REPO RULES.md` and authored only through the create-repo-rule command. | Gate 5 never fires on a read-only turn, so `REPO RULES.md` cannot carry anything that must bind while an agent is only reading, and the router holds no rules of its own. |
| D4 | Markers are `<!-- skilled:repo-local:start -->` and `<!-- skilled:repo-local:end -->`. | They follow the namespaced lowercase convention of the existing gate 1 pointer block; uppercase markers would opt into the Pi cache optimizer's structural guard, and nothing needs that protection for static text. |
| D5 | The block heading is unnumbered: `## REPOSITORY-SPECIFIC INSTRUCTIONS`. | Shipped §1 to §10 carry about 1,590 citations, and a numbered local §11 would collide with any future shipped §11. |
| D6 | The block always sits after the last shipped section, never inside the 16 KB delivery prefix. | The prefix has 10 bytes of headroom, so any local byte there fails the canary in CI. |
| D7 | The shipped template carries the empty block (220 bytes, 27,899 total) and this repository's own block must stay empty. | This file is the template and it is also every Claude session's global instructions on this machine, so a repo-unique line here ships to every consumer. This repository's own needs go to routed rules. |
| D8 | One manifest at `assets/agents-md-manifest.json`, with authored keys plus a generated `derived` key. | One data list is what the brief asks for, the generated-key precedent exists, and a consumer has no other copy of the template. |
| D9 | `derived` is written only by `agents-md-manifest.cjs --write` in the source repository, and `--check` is the freshness gate; its test skips with a printed reason when the origin is not the source repository. | The suite ships to consumers, whose `AGENTS.md` legitimately differs, so the test must not fail there. |
| D10 | The manifest is not registered in the update engine's generated artifacts. | A derived entry would make the engine rebuild the template from the consumer's own `AGENTS.md`; consumers must take it from the release whole. |
| D11 | The boundary with `/doctor:update`: update owns `.skilled/**` including this manifest, and agents-md owns the root instruction files; update gains one next-step line and nothing else. | `AGENTS.md` is not a release unit, and the root file belongs to the consumer. |
| D12 | Reuse, never duplicate: the canary supplies the budget and pins, the gate 1 pointer sync the cursor block, the repo-rules checker the router, and the exported classifier the three-way section merge. | Each already has tests, CI and an owner, so a second implementation would be a second thing to keep correct. |
| D13 | Section classification uses sha256 against the current bodies and the release-tag history, deduped by hash. | It needs no per-repository base record, and consumers move by release rather than by commit. |
| D14 | Kept local edits are not persisted as decisions: a local edit inside a shipped section stays a finding until it moves into the block. | Shipped sections must stay present and current, and a local tightening belongs in the block because a rule may tighten but never relax. |
| D15 | The preservation check is the gate, with automatic restore on violation. | "Never drops a repo-unique line" must be proven, not promised. |
| D16 | Plan, digest, apply; apply refuses a digest mismatch. | What is written must equal what was shown. |
| D17 | Backups go in an ignored output directory or the OS temp directory and are never deleted by the command. | It follows the align precedent, and the backup is the rollback. |
| D18 | The write allowlist is enforced in code before every write, not only stated in YAML. | A boundary that lives only in prose is not a boundary. |
| D19 | A divergent `CLAUDE.md` is folded into the block and then removed, backed up, by default; a symlink or pointer-only file is left alone and `--keep-claude-md` keeps it. | Claude reads `AGENTS.md` directly, and Cursor and Hermes load both files, so a full copy double-loads or drifts. |
| D20 | `.codex/AGENTS.md` is folded and removed. | Codex loads the root file as project instructions, and nothing reads that path at the repository root. |
| D21 | A non-empty block is mirrored into a generated `.cursor/rules/repo-local.md`. | Devin cuts `AGENTS.md` at 16,384 bytes, so nothing after the shipped sections reaches it otherwise; the cost is one second Cursor load of the same text. |
| D22 | A foreign file is carried verbatim, and budget overflow is a finding, never an automatic move. | Moving a line into a file that binds only on writes changes when it binds, which is the operator's call. |
| D23 | A pure template gives `STATUS=OK` and `embed` writes nothing. | Idempotence is part of correctness. |
| D24 | Router writes are limited to missing shipped rows, plus router creation behind `--create-router` and its own plan line; the doctor never edits a local row or any non-shipped row, and the repo-rules checker must pass afterwards. | The router is generated from shipped rows and the checker counts rows against files, so an unlisted write breaks both. |
| D25 | No heuristic "this line looks trigger-bound" detector. | That judgment belongs to the create-repo-rule decision tests, and a guess dressed as a finding is noise. |
| D26 | `AGENTS.md:3` is rewritten to the measured, 6-byte-shorter wording. | The template must not contradict its own block, and the delivery prefix has no room for a longer line. |
| D27 | `AGENTS.md` and `REPO RULES.md` are added to both path-filter lists of `.github/workflows/spec-kit-check.yml`. | Otherwise a template edit never runs the freshness test. |
| D28 | Routes carry trigger phrases and are derived into the advisor, but activation in the scoring compatibility list is deferred. | The existing doctor skill command is derived and inactive, and activation shifts scoring for every prompt. |
| D29 | Skill owner is sk-doc. | Instruction-document authoring is sk-doc's, and the spec-kit generator is called, never owned. |
| D30 | This phase is a phase parent with five Level 2 children. | The comparable doctor skill command build took ten children, and this one spans a template edit, CI, two engines and plumbing. |
| D31 | Fixtures are synthetic only. | Real consumer files on this machine are private and gitignored, so they can never become fixtures. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-manifest-and-template-block/ | The manifest, the shared segmenter, the line 3 edit, the empty block and the CI path filters | Draft |
| 2 | 002-check-engine/ | The read-only check engine, its twelve rows and nine synthetic fixtures | Draft |
| 3 | 003-embed-engine/ | Plan, digest, apply, the preservation check and restore | Draft |
| 4 | 004-command-plumbing/ | Router, three workflows, presentation, route entry, contract test and generated mirrors | Draft |
| 5 | 005-verification-and-docs/ | End-to-end runs, the manual playbook rows and the documentation refresh | Draft |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- **Precondition.** No child starts implementation until `/doctor:sk-skill` (packet `sk-doc/075-doctor-sk-skill-command`) is on `main`. That command adds one route, one router file and one advisor bridge, so every count an acceptance criterion quotes is re-measured from the branch the child starts on before its first edit, and recorded in that child's `scratch/baseline.txt`.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-manifest-and-template-block | 002-check-engine | The manifest has 46 authored sections, a fresh `derived` key and one pin per tooling consumer | `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` exits 0 |
| 002-check-engine | 003-embed-engine | Every check row reports on all nine fixtures with exit codes 0, 1 and 2 | `node --test .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` reports `fail 0` |
| 003-embed-engine | 004-command-plumbing | `plan`, `apply` and `restore` hold the preservation invariant on temporary copies of the foreign and forked fixtures | `node --test .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` reports `fail 0` |
| 004-command-plumbing | 005-verification-and-docs | The three routes validate and every generated mirror is in sync | `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 and every sync `--check` passes |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 5. OPEN QUESTIONS

- How large does the manifest's history grow? Bodies are about 28 KB today and the history grows only when a section changes between release tags. Report the byte count in child 001 and add pruning only if a measured number earns it.
- Does Devin apply `.cursor/rules/*.md`? Until a live session reads the mirrored block, D21 is pure Cursor cost.
- Which documentation rows can be named today? Child 005 resolves the playbook and changelog locations at its own start, because the sk-doc router owns them and this spec does not fix their paths.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-manifest-and-template-block/`, `002-check-engine/`, `003-embed-engine/`, `004-command-plumbing/` and `005-verification-and-docs/`
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
