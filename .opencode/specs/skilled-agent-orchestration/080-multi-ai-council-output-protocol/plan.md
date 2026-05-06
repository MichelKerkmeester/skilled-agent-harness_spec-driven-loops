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
    packet_pointer: "skilled-agent-orchestration/080-multi-ai-council-output-protocol"
    last_updated_at: "2026-05-06T10:00:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Drafted Level 3 plan.md with phased rollout"
    next_safe_action: "Author tasks.md + checklist.md + decision-record.md"
    blockers: []
    completion_pct: 50
---

# Implementation Plan: Multi-AI Council Output Protocol

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

---

## 1. SUMMARY

Three implementation phases under packet 080:

1. **Phase 1: Spec + design lock-in** (this packet finalizes the contract).
2. **Phase 2: Agent body + references** (update `.opencode/agent/multi-ai-council.md`; add `system-spec-kit/references/multi-ai-council/` with 4 reference files).
3. **Phase 3: Validator awareness + smoke test** (validator recognizes the subfolder; run a council dispatch on a real packet to verify end-to-end).

---

## 2. ARCHITECTURE

### Pattern
Lightweight subfolder convention. One agent + 4 reference files + 1 validator nudge. No skill folder, no YAML workflow, no command surface.

### Key components
- **`ai-council/`** subfolder (the new convention)
- **`@multi-ai-council` agent** (the writer)
- **`system-spec-kit/references/multi-ai-council/`** (shared specs)
- **`validate.sh`** (validator awareness)

### Data flow

```
User dispatches @multi-ai-council on spec_folder X
   │
   ▼
Agent reads spec_folder; locates X/ai-council/ (or creates skeleton)
   │
   ▼
Agent dispatches seats via Task tool (cli-codex, etc.)
   │
   ▼
Each seat returns plan; agent writes seats/round-NNN/seat-MMM-<executor>.md
   │
   ▼
Agent synthesizes deliberations/round-NNN.md
   │
   ▼
If convergence: write council-report.md + memory_save snippet
If not: increment round; loop
```

---

## 3. IMPLEMENTATION PHASES

### Phase 1 — Spec + design lock-in (THIS PACKET)
- [x] description.json
- [x] graph-metadata.json
- [x] spec.md
- [ ] plan.md (in progress)
- [ ] tasks.md
- [ ] checklist.md
- [ ] decision-record.md (3-4 ADRs)
- [ ] implementation-summary.md (placeholder; written after Phase 3)

### Phase 2 — Agent body + references (NEW SUB-PACKET 080/001)
- Update `.opencode/agent/multi-ai-council.md`:
  - Add §"Output Protocol" documenting the `ai-council/` layout
  - Add §"Invocation Contract" with first-call vs subsequent-call vs resume rules
  - Add §"State Schema" with the jsonl event types
  - Add §"Convergence Signal" with the 2/3 agreement rule
- Create `.opencode/skill/system-spec-kit/references/multi-ai-council/`:
  - `folder-layout.md` (one page reference for the directory tree)
  - `seat-diversity-patterns.md` (lens combination guidance)
  - `convergence-signals.md` (the 2/3 rule + escape hatches)
  - `state-format.md` (jsonl schema with examples)
- Mirror agent updates across `.claude/agents/`, `.codex/agents/`, `.gemini/agents/` (per the runtime mirror convention)

### Phase 3 — Validator awareness + smoke test (NEW SUB-PACKET 080/002)
- Update `validate.sh` (or its Node orchestrator) to recognize `ai-council/` as a known optional subfolder. Do NOT require any specific files inside; treat as free-form.
- Add a vitest case (in `system-spec-kit/scripts/tests/`) that confirms validator does not flag `ai-council/` as unknown.
- Smoke test: dispatch the council on a low-stakes existing packet (e.g., a sandbox spec under z_archive or a fresh test packet). Verify:
  - All canonical files appear in `ai-council/`
  - `council-report.md` matches the structure
  - Strict validation passes
  - Resume after manual interruption works

---

## 4. TESTING STRATEGY

### Unit / vitest
- Validator recognizes `ai-council/` (1 test)
- Agent invocation contract — round 1 creates skeleton (1 fixture-based test)
- State.jsonl event schema (1 test)

### Integration / live dispatch
- Smoke test in Phase 3 (real council on a real packet)

### Regression
- Existing strict validation suite must still pass on packets without `ai-council/`

---

## 5. ROLLOUT

- Phase 1 commits and pushes (this packet)
- Phase 2 dispatched as packet 080/001
- Phase 3 dispatched as packet 080/002
- After all 3: announce in next CHANGELOG entry as a new convention

No flag, no migration. Existing packets without `ai-council/` continue to function unchanged. New council dispatches start using the new layout immediately.

---

## 6. RISKS

See `spec.md` §7 Risks. Phase 2 carries the highest risk (agent body update is non-trivial; mirror sync across 4 runtime directories must stay consistent).

---

## 7. SUCCESS CRITERIA

See `spec.md` §5. All seven success criteria (SC-1 through SC-7) must be evidenced before declaring 080 complete.
