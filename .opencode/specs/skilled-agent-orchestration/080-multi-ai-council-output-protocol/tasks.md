---
title: "Tasks: Multi-AI Council Output Protocol"
description: "Task ledger for packet 080 implementation across spec, agent, references, and validator phases."
trigger_phrases:
  - "ai-council tasks"
importance_tier: "normal"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/080-multi-ai-council-output-protocol"
    last_updated_at: "2026-05-06T10:00:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Drafted task ledger"
    next_safe_action: "Author checklist.md + decision-record.md"
    blockers: []
    completion_pct: 70
---

# Tasks: Multi-AI Council Output Protocol

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

---

## Phase 1: Spec + design lock-in (THIS PACKET)

- [x] T001 Create folder + description.json
- [x] T002 Author graph-metadata.json
- [x] T003 Author spec.md (Level 3)
- [x] T004 Author plan.md
- [x] T005 Author tasks.md (this file)
- [ ] T006 Author checklist.md
- [ ] T007 Author decision-record.md (3-4 ADRs)
- [ ] T008 Author implementation-summary.md placeholder
- [ ] T009 Strict validation passes on packet 080
- [ ] T010 Commit + push spec packet

## Phase 2: Agent body + references (sub-packet 080/001)

- [ ] T101 Update `.opencode/agent/multi-ai-council.md` body with §Output Protocol
- [ ] T102 Add §Invocation Contract (first-call / subsequent / resume rules)
- [ ] T103 Add §State Schema (jsonl event types + examples)
- [ ] T104 Add §Convergence Signal (2/3 agreement rule)
- [ ] T105 Mirror agent update to `.claude/agents/multi-ai-council.md`
- [ ] T106 Mirror to `.codex/agents/multi-ai-council.toml` (sandbox-write adjusted)
- [ ] T107 Mirror to `.gemini/agents/multi-ai-council.md`
- [ ] T108 Update root README.md table-of-agents counts if changed
- [ ] T110 Create `system-spec-kit/references/multi-ai-council/folder-layout.md`
- [ ] T111 Create `references/multi-ai-council/seat-diversity-patterns.md`
- [ ] T112 Create `references/multi-ai-council/convergence-signals.md`
- [ ] T113 Create `references/multi-ai-council/state-format.md`
- [ ] T114 Strict validation on sub-packet 080/001 passes
- [ ] T115 Commit + push 080/001

## Phase 3: Validator awareness + smoke test (sub-packet 080/002)

- [ ] T201 Audit `validate.sh` (or Node orchestrator) for unknown-subfolder behavior
- [ ] T202 Update validator to treat `ai-council/` as known-optional, free-form inside
- [ ] T203 Add vitest case confirming validator does not flag `ai-council/`
- [ ] T204 Smoke test: dispatch `@multi-ai-council` on a real low-stakes packet
- [ ] T205 Verify canonical files appear in `ai-council/`
- [ ] T206 Verify `council-report.md` structure matches spec
- [ ] T207 Verify strict validation passes
- [ ] T208 Verify resume-after-interrupt works
- [ ] T209 Commit + push 080/002
- [ ] T210 Update implementation-summary.md with end-to-end evidence

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md` (after T007)
