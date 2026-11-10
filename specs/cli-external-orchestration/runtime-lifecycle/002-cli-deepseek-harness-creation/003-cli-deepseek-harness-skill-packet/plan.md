---
title: "Implementation Plan: Phase 3: cli-deepseek-harness-skill-packet"
description: "Author the cli-deepseek-harness packet with sk-create-skill and sk-create-changelog in the orchestrating Claude session, citing phase 002 evidence for every flag, then prove it with sk-skill-check, a hard-rules id scan and a flag loop."
trigger_phrases:
  - "cli deepseek harness skill packet plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: cli-deepseek-harness-skill-packet

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON |
| **Framework** | `sk-doc` `sk-create-skill` packet conventions, `sk-create-changelog` |
| **Storage** | None |
| **Testing** | `sk-skill-check.cjs`, `node -e` JSON parse, `rg` loops |

### Overview
The orchestrating Claude session authors one new packet at `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/` with `sk-create-skill`, modelled on `cli-pi` in shape but not in flags. Every flag and composition claim cites a phase 002 capture. Three checks prove it: the skill checker, an id scan of `hard-rules.json` and a flag loop against the help capture. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/phase-plan.md:85-101]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `002-dsh-offline-contract-pin/acceptance-criteria.md` shows every row Met (six `| Met |` rows on 2026-11-06)
- [x] `test -s 002-dsh-offline-contract-pin/evidence/headless-help.txt` exits 0
- [x] `ls .skilled/skills/cli-external-orchestration/cli-deepseek-harness` still reports no such directory (true before T003 wrote the first file)

### Definition of Done
- [x] All acceptance criteria met
- [x] `node .skilled/commands/doctor/scripts/sk-skill-check.cjs .skilled/skills/cli-external-orchestration/cli-deepseek-harness` reports no errors (no ERROR row, C3 strict format PASS, three FINDING rows explained in `implementation-summary.md`)
- [x] `validate.sh <phase folder> --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: progressive-disclosure skill packet.

### Key Components
- **`SKILL.md` and `ROUTER.md`**: the always-loaded contract and the intent map that points at each reference.
- **`hard-rules.json`**: eleven fail-closed rules a dispatch preflight reads.
- **`references/`**: CLI flags, providers and models, runtime folder and sync, guards and hooks, MCP, fan-out executor.

### Data Flow
A caller loads `SKILL.md`, follows `ROUTER.md` to the reference its intent needs and composes `dsh --profile headless --patch <route> --patch <lineage> --json --permission-mode <preset> --approval-policy never -` with the prompt on stdin. The preflight later checks that command against `hard-rules.json`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this phase fixes no reported finding. It creates one new packet and changes no existing consumer.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup loads the `sk-create-skill` contract and the phase 002 evidence. Implementation writes the packet. Verification runs the checker, the id scan and the flag loop.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `hard-rules.json` parse and the eleven ids | `node -e`, `rg` |
| Integration | Packet structure and frontmatter | `sk-skill-check.cjs` exits with no errors |
| Manual | Each flag in `references/cli-reference.md` | `rg` loop against `002-dsh-offline-contract-pin/evidence/headless-help.txt` exits 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 evidence | Internal | Green (phase 002 Complete, captures present) | References cannot cite observed output and REQ-003 cannot run |
| `sk-create-skill` and `sk-create-changelog` | Internal | Green | Packet shape would be unchecked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the packet fails `sk-skill-check.cjs` after three fix attempts, or a hard rule contradicts phase 002 evidence.
- **Procedure**: remove the `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/` folder. No hub or advisor file references it yet, so nothing else changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (contracts, evidence read) | Phase 002 closed | Implementation |
| Implementation (packet files) | Setup | Verification |
| Verification (checker, scan, loop) | Implementation | Phases 004, 007 and 011 |
<!-- /ANCHOR:phase-deps -->

---

