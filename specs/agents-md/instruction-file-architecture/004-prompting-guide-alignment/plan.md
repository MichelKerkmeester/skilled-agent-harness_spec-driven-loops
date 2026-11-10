---
title: "Implementation Plan: Align AGENTS.md, repo rules and sk-prompt with current vendor prompting guides"
description: "Add GPT-6 Luna to the cli-devin roster, run three blind model lenses over AGENTS.md, the repo rules and sk-prompt against five vendor prompting pages, then apply what survives citation checks."
trigger_phrases:
  - "prompting guide alignment plan"
  - "three lens dispatch plan"
  - "devin roster gpt-6 luna"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Align AGENTS.md, repo rules and sk-prompt with current vendor prompting guides

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and CommonJS (roster), Markdown (instruction surfaces) |
| **Framework** | system-deep-loop fan-out runtime; cli-devin and cli-pi executors |
| **Storage** | None |
| **Testing** | vitest (`fanout-run`, `combo-matrix`); sk-doc `validate_document.py`; spec-kit `validate.sh --strict` |

### Overview
First the roster change lets the fan-out accept GPT-6 Luna on devin, and one comma restores the MiMo route. Then three lenses read the same surfaces against the same vendor snapshots: Opus in this session, written first, and Luna and MiMo as read-only CLI delegates with one angle per brief. The synthesis checks every citation it repeats and turns each surviving finding into a surgical edit on the surface that owns it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified: the devin account, the LLM Gateway credential and the worktree provisioning

### Definition of Done
- [ ] All acceptance criteria met
- [ ] vitest suites pass with counts read
- [ ] Every edited `.md` passes the sk-doc validator
- [ ] `validate.sh --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One orchestrator and three blind lenses, followed by a verified synthesis.

### Key Components
- **Roster**: `DEVIN_SUPPORTED_MODELS` in `executor-config.ts` is the source list. `fanout-run.cjs` carries a hand copy, and `fanout-run.vitest.ts` pins both.
- **Sources**: five vendor pages as markdown in `scratch/sources/`, read by every lens.
- **Lenses**: `research/lens-opus.md`, `research/lens-luna-{agents,rules,prompt}.md` and `research/lens-mimo-{agents,rules,prompt}.md`.
- **Synthesis**: `research/synthesis.md`, ranked, verified and split into applied and rejected.

### Data Flow
Vendor pages and repo files feed each lens independently. The lenses feed the synthesis. Applied findings become edits in the owning file, and rejected ones stay in the synthesis with a reason.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The roster change touches a shared runtime allowlist, so its consumers are inventoried here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `executor-config.ts` `DEVIN_SUPPORTED_MODELS` | Source allowlist for devin model ids | update | vitest `combo-matrix` reads it directly |
| `fanout-run.cjs` devin list | Hand-copied allowlist enforced at dispatch | update | vitest `fanout-run` parity check against the source list |
| `fanout-run.vitest.ts` expected roster | Pins the list and its must-reject ids | update | the suite passes; new ids are absent from the reject list |
| cli-devin docs and Hermes mirror | Human-facing roster | update | `rg -n 'gpt-6-luna-max'` over the skill after the edit |
| `dispatch-model.cjs` | Delegates command building to the fan-out | not a consumer | holds no list of its own |

Inventory command: `rg -n 'gpt-5-6-luna-max' .skilled .hermes` finds every place that lists the existing pair, because the new pair belongs beside it.
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
| Unit | Devin roster parity and reject list | vitest `fanout-run.vitest.ts`, `combo-matrix.vitest.ts` |
| Integration | A real dispatch on `gpt-6-luna-max-priority` and on `llmgateway/mimo-v2.6-pro` | `devin -p`, `pi -p` |
| Document | Every edited rule, skill and instruction file | sk-doc `validate_document.py`; spec-kit `validate.sh --strict` |
| Manual | Citation resolution for every repeated `file:line` | `sed -n` on the cited span |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Devin CLI with GPT-6 Luna access | External | Green (`devin models list` shows it) | No Luna lens |
| LLM Gateway credential | External | Green once `.pi/models.json` parses | No MiMo lens |
| Worktree dependency trees | Internal | Green (4 installed at creation) | vitest cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a changed instruction produces worse agent behavior, or a roster test fails after the change.
- **Procedure**: nothing is committed, so `git checkout -- <path>` in the worktree reverts any file, and removing the worktree reverts everything. The main-checkout comma reverts by deleting that one character.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Roster + MiMo unblock ──► Lenses (Opus first, then 6 delegate briefs) ──► Synthesis ──► Apply ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Roster + unblock | Worktree | Lenses |
| Lenses | Roster + unblock, sources | Synthesis |
| Synthesis | All lenses returned or recorded as failed | Apply |
| Apply | Synthesis | Verify |
| Verify | Apply | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Roster + unblock | Low | Under an hour |
| Lenses | Med | One to two hours, mostly delegate wall time |
| Synthesis + apply | Med | Two to three hours |
| Verification | Low | Under an hour |
| **Total** | | **Four to seven hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Work isolated in worktree `067-prompting-guide-alignment`
- [x] No feature flag needed: instruction text and an allowlist entry
- [x] No monitoring surface

### Rollback Procedure
1. `git -C .worktrees/067-prompting-guide-alignment checkout -- <path>` for any single file.
2. Remove the worktree through sk-git's reaping path to drop the whole change.
3. Re-run vitest to confirm the roster is back to its baseline count.
4. Tell the operator which instruction change was reverted and why.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
