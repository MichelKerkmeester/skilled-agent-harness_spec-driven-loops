---
title: "Implementation Plan: Rename @improve-agent → @deep-agent-improvement"
description: "Three-phase atomic rename: (1) physical file renames + frontmatter rotation; (2) reference rotation across active scope via direct sed; (3) verification + new changelog entry. Mirrors 085/001 precedent. Direct shell execution (per 079 lesson on CLI dispatch unreliability under heavy parallelism)."
trigger_phrases:
  - "087 plan"
  - "agent rename plan"
  - "deep-agent-improvement agent"
  - "improve-agent migration plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/017-improve-agent-to-deep-agent-improvement-rename"
    last_updated_at: "2026-05-06T15:35:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "plan.md authored"
    next_safe_action: "validate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000088"
      session_id: "087-plan-author"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Rename `@improve-agent` → `@deep-agent-improvement`

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML + TOML + JSON (frontmatter, configs, docs) |
| **Framework** | OpenCode skill+command runtime (4-runtime mirror discipline) |
| **Storage** | Filesystem only |
| **Testing** | Strict spec validation; advisor recommendation smoke; script-level dispatch smoke |
| **Implementation executor** | Claude direct (shell + sed + Edit + git mv) — per 079 lesson, CLI dispatches under heavy parallelism are unreliable; mechanical sed work is faster and deterministic |
| **Concurrency** | N/A (single-threaded execution within this packet) |

### Overview

Symbolic rename of one agent across 4 runtimes + reference propagation through ~30 active files. Atomic ordering: agent file renames + YAML asset renames first, then content sed across both old + new locations is safe because sed targets the literal `@improve-agent` string regardless of file path. New changelog entry + implementation-summary close the packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem documented (`spec.md` §2-3)
- [x] Predecessor 079 verified complete (skill renamed, advisor returns top hit)
- [x] Direct precedent 085/001 shape understood
- [x] Active-scope reference inventory complete (18 files, 31 `@improve-agent` refs + 4 frontmatter `name:` + 8 file renames)

### Definition of Done

- [ ] All P0 acceptance criteria from `spec.md` REQ-001..REQ-007 met
- [ ] All P1 from REQ-008..REQ-012 met
- [ ] `validate.sh ... --strict` exits 0
- [ ] Active-scope residual `rg -F '@improve-agent'` returns 0
- [ ] Advisor recommendation parity confirmed
- [ ] Smoke dispatch resolves new agent path
- [ ] On `main` branch, no auto-branch
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**Sequenced 3-phase rename**: (1) physical renames, (2) reference rotation, (3) verification. No new components. Rollback = `git revert`.

### Key Components

- **Agent files** (4): one per runtime mirror. Frontmatter `name:` field is the canonical identity.
- **YAML asset files** (4): `improve_<TARGET>_<MODE>.yaml` pattern. Filename rename + content sed.
- **Reference surfaces**: command files, skill docs, root governance, runtime READMEs.
- **`/deep:start-agent-improvement-loop` slash command** and `.gemini/commands/deep/start-agent-improvement-loop.toml` (Gemini slash-command file): UNCHANGED — these are command-scoped names, not agent-scoped.

### Data Flow

```
T-001..T-004: git mv 4 agent files
   │
   ▼
T-005..T-008: rotate frontmatter `name:` + body self-refs in renamed files
   │
   ▼
T-009..T-012: git mv 4 YAML asset files (.opencode + .claude × auto + confirm)
   │
   ▼
T-013: update agent.md body refs to new YAML filenames (atomic with T-009..T-012)
   │
   ▼
T-014..T-016: mass sed @improve-agent → @deep-agent-improvement across active scope
              (skill docs + command bodies + YAML internal content + root + runtime READMEs)
   │
   ▼
T-017: author new changelog v1.5.0.0.md documenting the rename
   │
   ▼
T-018..T-022: verification (residual grep + frontmatter grep + advisor smoke + smoke dispatch + validate.sh)
   │
   ▼
T-023: implementation-summary.md authored
   │
   ▼
T-024: /memory:save
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Producer: 4 agent files | Authoritative agent identity | Rename via `git mv` + frontmatter `name:` field rotation | `ls` + `grep '^name:'` |
| Producer: 4 YAML asset files | Workflow definition for `/deep:start-agent-improvement-loop` | Rename via `git mv` + content sed | `ls` + `grep -F '@improve-agent'` |
| Consumer: command files | Reference agent in dispatch matrix + YAML filenames | sed refs + filename refs | `rg -F '@improve-agent'` |
| Consumer: skill docs | Reference agent in evaluator-first loop docs | sed refs | `rg -F '@improve-agent'` |
| Consumer: root governance (AGENTS.md, README.md) | Public agent registry | sed line 324 + line 1097 | `grep` |
| Consumer: runtime READMEs | Agent inventory listings | sed refs | `grep` |
| Not-a-consumer: slash command `/deep:start-agent-improvement-loop` | Command identifier (independent of agent name) | Unchanged | `grep '/deep:start-agent-improvement-loop'` count parity |
| Not-a-consumer: `.gemini/commands/deep/start-agent-improvement-loop.toml` filename | Gemini slash-command file (named after slash command, not agent) | Filename stays; only content updates | `ls` |
| Not-a-consumer: `cp-improve-target.md` test fixture | Different agent | Unchanged | grep parity |
| Not-a-consumer: z_archive/specs/ research | Historical record | Unchanged | excluded from residual grep |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Physical renames (T-001..T-013)

- [ ] T-001..T-004: `git mv` 4 agent files (one per runtime)
- [ ] T-005..T-008: Update frontmatter `name:` field + body self-refs in each renamed file
- [ ] T-009..T-012: `git mv` 4 YAML asset files (.opencode + .claude × auto + confirm)
- [ ] T-013: Update `agent.md` body refs to new YAML filenames (atomic with T-009..T-012)

### Phase 2: Reference rotation (T-014..T-017)

- [ ] T-014: Mass sed `@improve-agent` → `@deep-agent-improvement` across active scope (skill docs + command bodies + YAML internal content)
- [ ] T-015: Update root governance (AGENTS.md line 324, README.md line 1097)
- [ ] T-016: Update runtime READMEs (.opencode/agents/README.txt, etc.)
- [ ] T-017: Author new changelog `v1.5.0.0.md` documenting the rename + 079 + 085/001 precedents

### Phase 3: Verification (T-018..T-024)

- [ ] T-018: `rg -F '@improve-agent' .opencode .claude .gemini .codex AGENTS.md README.md | grep -v specs/ | grep -v z_archive/ | grep -v barter/` → 0
- [ ] T-019: `rg -F 'name: improve-agent'` and `rg -F 'name = "improve-agent"'` in active scope → 0
- [ ] T-020: Advisor `recommend({prompt: "improve agent loop"})` still returns `deep-agent-improvement` top hit (no scoring regression)
- [ ] T-021: Smoke dispatch `scan-integration.cjs --agent <renamed sandbox>` exits 0
- [ ] T-022: `validate.sh specs/skilled-agent-orchestration/z_archive/073-improve-agent-to-deep-agent-improvement-rename --strict` exits 0
- [ ] T-023: Author `implementation-summary.md` with verification evidence
- [ ] T-024: `/memory:save` to refresh continuity
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | Spec docs | `validate.sh ... --strict` |
| Static check | Active-scope residual `@improve-agent` and `name: improve-agent` | `rg -F` with category filters |
| Integration | Skill advisor recommendation | `handleAdvisorRecommend` MCP handler |
| Smoke | Sandbox agent script-level dispatch | `node scan-integration.cjs --agent <sandbox>` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 079 skill rename complete | Internal | Green (`.opencode/skills/deep-agent-improvement/` exists) | Cannot rename agent without skill rename predecessor |
| Sandbox agent at `.opencode/skills/deep-agent-improvement/test-fixtures/...` | Internal | Green | Smoke dispatch test |
| `validate.sh` working | Internal | Green | Strict validation gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 acceptance criterion fails or smoke dispatch breaks.
- **Procedure**:
  1. `git log --oneline | head -10` — identify rename commits
  2. `git revert <commit-hash>` for each commit in reverse order
  3. Verify: `ls .opencode/agents/improve-agent.md` returns the file again; `rg -F '@improve-agent'` returns ~31 hits
  4. Verify smoke dispatch on the restored agent
  5. Document rollback in `implementation-summary.md`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Physical renames)
   │
   ▼
Phase 2 (Reference rotation)
   │
   ▼
Phase 3 (Verification + changelog + summary + memory:save)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 | None (079 already complete) | 2, 3 |
| 2 | 1 | 3 |
| 3 | 1, 2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1 Physical renames | Low | 5-10 min |
| 2 Reference rotation | Med | 10-15 min (sed + spot-check) |
| 3 Verification | Low | 10-15 min |
| **Total** | | **~30-40 min** end-to-end |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] On `main` branch
- [ ] No staged changes that would conflict with rename commits
- [ ] Sandbox agent path identified for smoke test

### Rollback Procedure

1. `git log --oneline -- .opencode/agent .claude/agents .gemini/agents .codex/agents` — list rename commits
2. `git revert` in reverse chronological order
3. Verify residual grep returns ~31 `@improve-agent` (restored state)
4. Smoke dispatch on restored agent
5. Annotate implementation-summary.md with `## Rollback` section

### Data Reversal

- **Has data migrations?** No — symbolic rename only.
- **Reversal procedure**: Git revert covers all state.
<!-- /ANCHOR:enhanced-rollback -->
