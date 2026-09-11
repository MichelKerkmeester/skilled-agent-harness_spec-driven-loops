---
title: "Implementation Plan: Phase 3: contract-and-hook"
description: "Four cli-pi dispatches on DeepSeek V4.1 Flash, in the order the decisions fixed: hook whitelist and harness, ordinal allocator and harness, stamper hook and harness, then the skill documents through sk-doc."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: contract-and-hook

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash hooks and scripts under sk-code opencode shell standards; Markdown under sk-doc create-skill |
| **Framework** | git hooks installed by install-git-hooks.sh; sk-git allocator pattern |
| **Storage** | high-water and lock files under the common Git directory |
| **Testing** | shell harnesses beside each script, run-all-drift-guards.sh, validate_document.py |

### Overview
Each dispatch is one change with one brief: files named, verification named, evidence returned. The conductor runs every harness again before committing. The hook change commits first so the body gate survives the stamper.
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
Hook pipeline: prepare-commit-msg stamps, commit-msg validates, allocator mints

### Key Components
- **commit-msg**: validates shape, whitelists trailers, refuses duplicates
- **commit-id-naming.sh**: mints ordinals under a lock with a history-derived high-water
- **prepare-commit-msg**: stamps Spec and Commit-Id, keeps on amend, re-mints on cherry-pick
- **sk-git documents**: state the contract the hooks enforce

### Data Flow
git commit runs prepare-commit-msg, which asks the allocator for the next ordinal and appends the trailer paragraph. commit-msg then validates the whole message and scans history for a duplicate id.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| commit-msg TRAILER_RE | decides prose versus trailer | update | commit-msg.test.sh |
| install-git-hooks.sh | symlinks every file in the hook dir | unchanged | new hook picked up by the loop |
| worktree-naming.sh | allocator pattern | unchanged | separate lock and counter |
| sk-git SKILL.md and references | state the contract | update | validate_document.py |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
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
| Unit | hook regexes, allocator commands, stamper cases | bash harnesses |
| Integration | commit through both hooks in a fixture repo | prepare-commit-msg.test.sh |
| Manual | an empty commit on the main clone after merge | git commit --allow-empty |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| decision-record.md | Internal | Green | no contract to implement |
| pi with the llmgateway credential | External | Green | no dispatch |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a harness fails on the main clone after merge
- **Procedure**: revert the phase commits; ids already stamped stay valid text
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
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
| Setup | Low | 30 minutes |
| Core Implementation | Med | 2 hours across four dispatches |
| Verification | Low | 30 minutes |
| **Total** | | **about 3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Not applicable, no data changes
- [x] Bypass variables exist for both hooks
- [x] Not applicable

### Rollback Procedure
1. Set the hook's bypass variable if a commit is blocked wrongly
2. Revert the phase commits
3. Run the three harnesses
4. Nothing user-facing

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Hook whitelist | decisions | commit-msg, harness | stamper commit order |
| Allocator | decisions | commit-id-naming.sh, harness | stamper |
| Stamper | allocator, hook | prepare-commit-msg, harness | docs |
| Docs | all three | four skill files | 004 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Hook whitelist** - 30 minutes - CRITICAL
2. **Allocator then stamper** - 90 minutes - CRITICAL
3. **Docs** - 30 minutes - CRITICAL

**Total Critical Path**: about 3 hours

**Parallel Opportunities**:
- The docs brief is written while the allocator runs
- The stamper waits for the allocator
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Hook committed | commit-msg.test.sh PASS=9 | 2026-09-11, done |
| M2 | Allocator and stamper committed | both harnesses exit 0 | 2026-09-11 |
| M3 | Docs validated | validate_document.py exit 0 x4 | 2026-09-11 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Attached dispatch, one change per brief

**Status**: Accepted

**Context**: The first detached `nohup pi` child died silently with an empty log after writing the hook edit and before its harness.

**Decision**: Dispatch every cli-pi child through the tool's attached background runner, one change per brief, and diff the tree after every return.

**Consequences**:
- A dead child is visible as a non-zero return, not an empty file
- The conductor waits per dispatch. Mitigation: independent work continues on files the child does not touch

**Alternatives Rejected**:
- Detached nohup launch: lost the process once already

---

### ADR-002: No preflight advisory rule for the message shape

**Status**: Accepted

**Context**: The parent spec scoped an advisory rule in `git-rule-checks.mjs` for the new commit shape. Research iteration 10 found the advisory engine inspects command shape, never message text, and that the blocking commit-msg hook already holds the contract.

**Decision**: No message-shape rule is added to the advisory engine. The hook is the single enforcement point.

**Consequences**:
- One place to change when the grammar changes
- A committer learns of a bad message at commit time, not before; the hook's error names the fix

**Alternatives Rejected**:
- An advisory that parses the message from a `-m` argument: it would cover one command form and miss editors and templates

