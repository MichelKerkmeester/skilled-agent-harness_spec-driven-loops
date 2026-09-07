---
title: "Implementation Plan: Phase 13: gate1-instruction-parity"
description: "Confirm Pi's real AGENTS.md behavior, generate a Codex pointer outside the nodeterm block, share one pointer between Cursor and Devin and add a doctor check that reads all five surfaces instead of assuming them."
trigger_phrases:
  - "gate 1 instruction parity"
  - "runtime instruction file drift"
  - "codex nodeterm block boundary"
  - "trigger index lookup pointer"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: gate1-instruction-parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS generator scripts), Bash (doctor workflow YAML activities), TypeScript (Pi extension hooks) |
| **Framework** | None. Follows the existing `sync-runtime-mirrors.cjs` / `sync-prompts.cjs` generate-plus-check convention |
| **Storage** | None. All state is the checked-in instruction files themselves |
| **Testing** | The doctor workflow's own read-only phase 0 discovery activities. No new automated test framework introduced |

### Overview
The Gate 1 lookup instruction lives once in root `AGENTS.md`. This phase does not duplicate the whole document. It confirms and closes the gap between "the instruction is written once" and "every runtime actually reaches it." Codex gets a small generated pointer block placed outside nodeterm's owned markers. Cursor and Devin share one pointer through their already-shared rules file. Pi's real behavior is investigated first, since the repository's own docs do not state it, and the design (static pointer or hook injection) follows from that answer. A new doctor activity then reads all five surfaces live and reports drift, closing the loop the retrieval README currently only asserts.
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
- [ ] Doctor parity check runs clean against the repository (or reports a documented, accepted gap)
- [ ] Docs updated (spec/plan/tasks, retrieval README, `.pi/SYNC.md`, `.cursor/SYNC.md`)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Generate-and-check, the same pattern `sync-runtime-mirrors.cjs` and `sync-prompts.cjs` already use for per-runtime derived files: one canonical source, a small generator that derives the per-runtime artifact and a `--check` mode that reports drift without writing.

### Key Components
- **Gate 1 pointer generator**: reads the Gate 1 lookup line from root `AGENTS.md` (currently `AGENTS.md:83`) and writes a short pointer block into `.codex/AGENTS.md` (placed outside the nodeterm markers) and into `.cursor/rules/skill-routing.md`.
- **Pi investigation step**: a one-time research task (not a generator) that determines whether Pi's CLI ingests a root `AGENTS.md` automatically. Its answer decides whether Pi needs the generator's output or a hook-based injection through an existing session-start extension.
- **Doctor Gate 1 parity signal**: a new `staleness_signals` entry and `phase_0_discovery` activity in `doctor-speckit-retrieval.yaml` that reads each runtime's real surface (root AGENTS.md, `.codex/AGENTS.md`, `.cursor/rules/skill-routing.md` and the Pi surface the investigation identifies) and reports per-runtime reach.

### Data Flow
Root `AGENTS.md`'s Gate 1 line is the single source of truth. The generator reads it and writes derived pointer text into the two files that need one. The doctor activity reads the same root line plus each runtime's resulting surface and compares presence, never trusting a cached or assumed state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Root `AGENTS.md` (`AGENTS.md:83`) | Sole authored copy of the Gate 1 lookup instruction | Unchanged. Remains the single source the generator reads from | `rg -n "trigger index lookup" AGENTS.md` still returns line 83 |
| `.codex/AGENTS.md` | Entirely occupied (lines 1-122) by a nodeterm-generated block. No hand-authored content currently present | Update: gains a generated pointer block outside the nodeterm markers | Diff the nodeterm-marked region before and after. It must be byte-identical |
| `.cursor/rules/skill-routing.md` | Hand-authored rules file, read natively by Cursor and inherited by Devin per `.devin/SYNC.md:83` | Update: gains the Gate 1 pointer | `grep -n "trigger index" .cursor/rules/skill-routing.md` returns a match after the change |
| `.pi/extensions/` and `.pi/SYNC.md` | Pi's discovery mirror and its own sync documentation. Neither currently states root-AGENTS.md consumption | Update: `.pi/SYNC.md` gains a documented answer. `.pi/extensions/` gains a hook edit only if the investigation finds Pi does not read root AGENTS.md natively | The investigation's finding is quoted with its source (vendor doc link or probe transcript) in `.pi/SYNC.md` |
| `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml` | Owns the retrieval doctor's phase 0 discovery and staleness signals. Currently has no cross-runtime instruction signal | Update: one new signal, one new phase 0 activity | Running the doctor workflow's phase 0 activities against the repository reports a `gate1_instruction_parity` result |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md:87` | States "no runtime-specific instruction file carries a copy" | Update: correct once some runtimes do | The line no longer contradicts the generator's output |
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
| Generator drift check | The Gate 1 pointer generator's `--check` mode against a repository with and without the pointer present | `node <generator script> --check`, mirroring `node runtime-mirrors/sync-runtime-mirrors.cjs --check` |
| Doctor workflow read-only run | The new `gate1_instruction_parity` signal and its phase 0 activity | `doctor-speckit-retrieval.yaml`'s own phase 0 discovery, run through the `/doctor speckit-retrieval` command |
| Nodeterm boundary regression | Confirm the generator never touches the nodeterm-owned lines in `.codex/AGENTS.md` | A diff of lines 1-122 (or wherever the current markers fall) before and after a generator run |
| Manual | Confirm the Cursor/Devin shared pointer reads correctly in both runtimes' own instruction-loading path | Not automatable from this repository alone. Documented as a manual verification step in tasks.md |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `doctor-speckit-retrieval.yaml`'s existing phase 0 structure | Internal | Green | The new signal and activity are additive. A structural change upstream would need re-anchoring but would not block other requirements |
| Pi vendor documentation or a live probe, to answer the open AGENTS.md-consumption question | External | Yellow | REQ-003 and the Pi row of the Codex/Cursor generator both depend on this answer. Without it, the doctor check can still ship for the four confirmed runtimes and report Pi as unresolved rather than blocking entirely |
| nodeterm's ownership of `.codex/AGENTS.md`'s generated block | External | Green | The generator writes only outside the markers. If nodeterm's markers move, the generator's placement check fails closed rather than corrupting the file |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The generator writes inside the nodeterm markers by mistake, or the doctor parity check produces false positives/negatives that make the retrieval doctor workflow unreliable.
- **Procedure**: Revert the generator's commit and the doctor workflow YAML edit. `.codex/AGENTS.md` and `.cursor/rules/skill-routing.md` return to their pre-phase state through a plain `git revert`, since neither file gains any state outside version control.
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
| Setup (Pi investigation) | Medium | The one step this plan cannot size precisely, since it depends on external documentation quality |
| Core Implementation (generator, pointer files, doctor signal) | Low | Small, additive changes to existing generator and doctor patterns |
| Verification | Low | Read-only checks against files already produced |
| **Total** | | Small relative to the program's other phases. The Pi investigation is the only open-ended step |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No backup needed. Every changed file is tracked in git with no external data migration
- [ ] No feature flag needed. The doctor check is advisory (a staleness signal), not a blocking gate
- [ ] No monitoring alert needed. The check runs on demand through `/doctor speckit-retrieval`

### Rollback Procedure
1. Revert the generator script's commit and the two pointer-file edits.
2. Revert the `doctor-speckit-retrieval.yaml` addition.
3. Re-run `/doctor speckit-retrieval` phase 0 to confirm the workflow still executes cleanly without the new signal.
4. No stakeholder notification needed. This phase has no user-facing surface.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---
