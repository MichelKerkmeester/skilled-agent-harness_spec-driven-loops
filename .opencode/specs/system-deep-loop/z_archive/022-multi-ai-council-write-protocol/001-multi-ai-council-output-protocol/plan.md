---
title: "Implementation Plan: Multi-AI Council Output Protocol"
description: "Sequenced implementation of the ai-council/ subfolder convention, agent body update, optional shared references, and validator awareness."
trigger_phrases:
  - "ai-council implementation plan"
  - "multi-ai-council folder rollout"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-multi-ai-council-write-protocol/001-multi-ai-council-output-protocol"
    last_updated_at: "2026-05-06T11:30:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Refactored plan.md to canonical template structure"
    next_safe_action: "Run Phase 2 implementation"
    blockers: []
    key_files:
      - ".opencode/agents/multi-ai-council.md"
      - ".opencode/skills/system-spec-kit/references/"
    session_dedup:
      fingerprint: "sha256:921f7e22b80aef0cf063bf9bec0a8e6cd479b01138e86e5fea7b08048c72f86c"
      session_id: "plan-080-author"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Multi-AI Council Output Protocol

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Three implementation phases under packet 080:

1. **Phase 1: Spec + design lock-in** (this packet finalizes the contract).
2. **Phase 2: Agent body + references** (update `.opencode/agents/multi-ai-council.md`; add `system-spec-kit/references/multi-ai-council/` with 4 reference files; mirror agent across 3 sibling runtime dirs).
3. **Phase 3: Validator awareness + smoke test** (validator regression test confirms `ai-council/` is not flagged; live council dispatch on a real packet to verify end-to-end).

The packet is being implemented as a single Level 3 leaf packet rather than a phase parent — all phases land in one packet's tasks.md.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Threshold | Blocking | Evidence |
|------|-----------|----------|----------|
| Pre-Implementation | spec.md + plan.md + tasks.md + checklist.md present | Yes | `validate.sh --strict` exit 0 on packet 080 |
| Mid-Implementation | All P0 checklist items have evidence | No (warning) | tasks.md and checklist.md updated as Phase 2 progresses |
| Post-Implementation | All tasks [x], all P0 verified, validator regression test passes | Yes | implementation-summary.md cites commit SHAs and test output |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Lightweight subfolder convention. One agent + 4 reference files + 1 validator nudge. No skill folder, no YAML workflow, no command surface.

### Key components
- **`ai-council/`** subfolder (the new convention)
- **`@multi-ai-council` agent** (the writer)
- **`system-spec-kit/references/multi-ai-council/`** (shared specs)
- **`validate.sh`** (validator awareness — already free-form on subfolders; regression test prevents future regressions)

### Data flow

```
User dispatches @multi-ai-council on spec_folder X
   |
   v
Agent reads spec_folder; locates X/ai-council/ (or creates skeleton)
   |
   v
Agent dispatches seats via Task tool (cli-codex, cli-copilot, etc.)
   |
   v
Each seat returns plan; agent writes seats/round-NNN/seat-MMM-<executor>.md
   |
   v
Agent synthesizes deliberations/round-NNN.md
   |
   v
If convergence: write council-report.md + memory_save snippet
If not: increment round; loop
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Spec + design lock-in (THIS PACKET)
- description.json
- graph-metadata.json
- spec.md (Level 3, canonical template)
- plan.md (this file)
- tasks.md
- checklist.md
- decision-record.md (4 ADRs)
- implementation-summary.md (post-implementation real version)

### Phase 2 — Agent body + references
- Update `.opencode/agents/multi-ai-council.md`:
  - Add §Output Protocol documenting the `ai-council/` layout
  - Add §Invocation Contract with first-call vs subsequent-call vs resume rules
  - Add §State Schema with the jsonl event types
  - Add §Convergence Signal with the 2/3 agreement rule
- Create `.opencode/skills/system-spec-kit/references/multi-ai-council/`:
  - `folder-layout.md` (one page reference for the directory tree)
  - `seat-diversity-patterns.md` (lens combination guidance)
  - `convergence-signals.md` (the 2/3 rule + escape hatches)
  - `state-format.md` (jsonl schema with examples)
- Mirror agent updates across `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`

### Phase 3 — Validator awareness + smoke test
- Add a vitest case (in `system-spec-kit/scripts/tests/`) that confirms validator does not flag `ai-council/` as unknown.
- Smoke test: dispatch the council on this packet to verify:
  - All canonical files appear in `ai-council/`
  - `council-report.md` matches the structure
  - Strict validation passes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Unit / vitest
- Validator recognizes `ai-council/` (1 test)
- Validator does not flag the new subfolder regardless of internal contents (1 test)

### Integration / live dispatch
- Smoke test in Phase 3 (real council on packet 080 itself)

### Regression
- Existing strict validation suite must still pass on packets without `ai-council/`
- All 4-runtime agent mirrors stay in lockstep (manual diff check)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `.opencode/agents/multi-ai-council.md` — agent body (will be updated)
- `.claude/agents/multi-ai-council.md`, `.codex/agents/multi-ai-council.toml`, `.gemini/agents/multi-ai-council.md` — runtime mirrors
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` — validator (regression-tested)
- `.opencode/skills/system-spec-kit/references/` — shared reference home (new subfolder)
- Existing CLI skills (`cli-codex`, `cli-copilot`, `cli-gemini`, `cli-claude-code`, `cli-opencode`) — used by council seats
- Existing patterns from `deep-research/` and `deep-review/` (for layout inspiration only; no code reuse)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If the new convention causes a regression:

1. **Revert agent body changes** (4 runtimes) — `git revert` the agent commits; deep skills and validator are untouched, so revert is local.
2. **Delete reference files** — `rm -rf .opencode/skills/system-spec-kit/references/multi-ai-council/` (no consumers besides the agent).
3. **Remove vitest case** — `git rm system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts`.
4. **Existing council dispatches** that produced `ai-council/` artifacts: leave on disk (free-form subfolder, harmless to validator); reference docs in chat history.

No database or production state is touched. Rollback is purely git-level.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

- Phase 1 -> Phase 2: spec + plan + tasks must be locked before agent body update.
- Phase 2 -> Phase 3: agent body must document the protocol before vitest validates it and smoke test exercises it.
- Phase 3 has no external dependencies once Phase 2 lands.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort | Wall-clock |
|-------|--------|------------|
| Phase 1 (spec lock-in) | M | ~1h authoring + validation |
| Phase 2 (agent + refs + mirrors) | L | ~2-3h structural editing |
| Phase 3 (validator + smoke) | M | ~1h test + live dispatch |
| **Total** | **L** | **~4-5h end-to-end** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Per-phase rollback granularity:

- **Phase 2 partial revert**: if only mirrors are bad, revert .claude/.codex/.gemini files and keep `.opencode/agents/multi-ai-council.md` (canonical). Operator dispatches via `.opencode/` only until mirrors are fixed.
- **Phase 3 partial revert**: drop the vitest case; `ai-council/` remains free-form. Smoke test failure means the agent body needs a fix, not a revert.
- **Reference file cleanup**: each reference file is independently revertable; deletion does not break the agent (agent is self-contained per ADR-001).
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
spec.md -> plan.md -> tasks.md -> checklist.md -> decision-record.md
                                       |
                                       v
                          [Phase 2: agent + references]
                                       |
                                       v
                          [Phase 3: validator + smoke]
                                       |
                                       v
                          implementation-summary.md
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The critical path runs:

1. Spec lock-in (this packet's Phase 1)
2. Agent body update (`.opencode/agents/multi-ai-council.md`)
3. 4-runtime mirror sync
4. Vitest regression test
5. Smoke test dispatch

References authoring is parallel to the agent body update — references can be authored independently and concurrently.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Trigger | Evidence |
|-----------|---------|----------|
| M1: Spec locked | All Phase 1 docs validate strict | `validate.sh --strict` exit 0 |
| M2: Agent body authoritative | `.opencode/agents/multi-ai-council.md` documents 4 new sections | grep §Output Protocol/§Invocation Contract/§State Schema/§Convergence Signal |
| M3: 4-runtime parity | All 4 mirrors agree on output protocol | manual diff |
| M4: Validator regression-proof | Vitest case passes | `npm test` output |
| M5: End-to-end smoke | Council dispatch on packet 080 produces canonical `ai-council/` artifacts | `ls ai-council/` shows skeleton + report |
<!-- /ANCHOR:milestones -->
