---
title: "Implementation Plan: Phase 1: release-line-split"
description: "The orchestrator moves the released notes into the release line by a byte-identical script, then DeepSeek V4.1 Flash Max lanes on cli-devin make the literal edits and write the new entries, each lane reviewed before the next in its chain."
trigger_phrases:
  - "release-line-split plan"
  - "skilled release line plan"
  - "release notes split lanes"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: release-line-split

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML command workflows, Node ESM (`corpus.mjs`) |
| **Framework** | sk-doc changelog mode, system-spec-kit retrieval runtime |
| **Storage** | Files in git, no database |
| **Testing** | vitest retrieval suites, `validate_document.py`, `hvr_scan.py`, the playbook validator, a Ruby YAML parse |

### Overview
The orchestrator moves every released note into `.skilled/changelog/skilled/` with a plain `mv` from a fixed list, so the bytes stay the same and the commit reads as renames. DeepSeek V4.1 Flash Max lanes on cli-devin then make one literal change each, in three chains, and the orchestrator reviews every lane's diff and validators before the next lane in its chain starts. The orchestrator runs the deterministic steps itself: the version bumps, the Hermes sync, the index rebuild and the commits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a documentation split with a matching workflow change

### Key Components
- **`.skilled/changelog/skilled/`**: the framework release line, one entry per Skilled release, grouped by generation below v4
- **system-spec-kit changelog**: the skill's own entries from 4.0.0.0 on, each linking to the Skilled release it shipped in
- **sk-create-changelog**: resolves `skilled` only by name, matches components by whole path segment, publishes releases for `skilled` alone and reads versions from generation folders
- **Gate 1 corpus**: `CORPUS_ROOTS` gains `.skilled/changelog/skilled` so the trigger index keeps the release notes

### Data Flow
An operator runs `/create:changelog skilled`. The workflow resolves the release line from the hint, reads the newest version across the folder and its generation folders, writes the entry and, with `--release`, tags and publishes it. A component run resolves its folder from changed paths or a hint and never publishes. The trigger-index generator walks the corpus roots, so the release notes stay reachable from Gate 1.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Component matching in both command YAMLs | Picks the changelog folder from changed paths | update: whole path segment, `skilled` only by hint | `rg` of the strategy lines, CHG-009 |
| Release step in both command YAMLs | Tags and publishes a written entry | update: guard for `skilled`, title from the H1 | `rg` of the guard, CHG-010 |
| Step 3 version reader | Finds the latest version in a folder | update: top level plus generation folders | reader run on nine real folders |
| `CORPUS_ROOTS` in `corpus.mjs` | Decides which folders feed the trigger index | update: add the release line | retrieval suites and a scratch lookup |

Required inventories:
- Same-class producers: `rg -n 'changelog/system-spec-kit/v|system-spec-kit/changelog/v' --glob '!specs/**'` for stale note paths.
- Consumers of changed symbols: `rg -n 'CORPUS_ROOTS|corpusRootsFor' .skilled/skills/system-spec-kit/runtime --glob '*.mjs' --glob '*.ts'`.
- Matrix axes: component kind (skill, hub mode, release line) against the version reader's inputs (top level only, generation folders only, both).
- Algorithm invariant: a changed path never resolves to `skilled`, and a component other than `skilled` never reaches `git tag`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Corpus roots and the trigger index | `retrieval-coverage-parity`, `retrieval-repo-root` and `trigger-index` vitest suites |
| Integration | The version reader on real folders, a scratch trigger index with a positive and a negative lookup | `find`, `generate-trigger-index.mjs`, `lookup-trigger-index.mjs` |
| Manual | The release line in the workflow | Playbook scenarios CHG-008 to CHG-010 and the playbook validator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin with DeepSeek V4.1 Flash Max | External | Green | Lanes fall back to MiMo v2.6 Pro high on cli-pi |
| GitHub release list | External | Green | The history rule cannot be checked without it |
| Phase 2 | Internal | Yellow | Phase 2 holds the moved notes until the move commit lands |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a verification step fails and cannot be repaired, or the operator rejects the split
- **Procedure**: move the notes back from the recorded move list, restore the edited files from `git diff`, and remove the new entries. Nothing is committed before the operator asks.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (move) ─────┐
                  ├──► Core (chains A, B, C) ──► Verify
Config (roots) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under an hour |
| Core Implementation | Med | Two to three hours of lanes |
| Verification | Med | About an hour |
| **Total** | | **Four to five hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): the move list and a hash of every note before and after the move sit in the session scratchpad
- [x] Feature flag configured: not applicable, nothing here runs as a service
- [x] Monitoring alerts set: not applicable, nothing here runs as a service

### Rollback Procedure
1. Move each note back to its old path from the recorded move list
2. Restore the edited files by reversing their diffs
3. Rerun the retrieval suites and the version reader
4. Tell the operator what was rolled back

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
