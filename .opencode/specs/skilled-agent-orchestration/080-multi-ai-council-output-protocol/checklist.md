---
title: "Verification Checklist: Multi-AI Council Output Protocol"
description: "P0/P1/P2 verification checklist for packet 080 across spec, agent, references, validator, and smoke-test surfaces."
trigger_phrases:
  - "ai-council checklist"
importance_tier: "normal"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/080-multi-ai-council-output-protocol"
    last_updated_at: "2026-05-06T10:00:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Drafted P0/P1/P2 checklist"
    next_safe_action: "Author decision-record.md + commit"
    blockers: []
    completion_pct: 80
---

# Verification Checklist: Multi-AI Council Output Protocol

<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

---

## P0 — Blockers

- [ ] **C-P0-1** spec.md describes the `ai-council/` folder layout, file shapes, and invocation contract unambiguously.
- [ ] **C-P0-2** Agent body in `.opencode/agent/multi-ai-council.md` documents the new output protocol and is mirrored across `.claude/`, `.codex/`, `.gemini/` runtime directories.
- [ ] **C-P0-3** Validator (`validate.sh`) does NOT flag `ai-council/` as unknown when present in a packet.
- [ ] **C-P0-4** A live council dispatch on a real packet writes all expected files into `ai-council/` and produces `council-report.md`.

## P1 — Required

- [ ] **C-P1-1** `system-spec-kit/references/multi-ai-council/` contains 4 reference files (folder-layout, seat-diversity-patterns, convergence-signals, state-format).
- [ ] **C-P1-2** A second council dispatch on the same packet produces `round-002` files without overwriting round-001.
- [ ] **C-P1-3** `council-report.md` matches the canonical structure (composition table, comparison table, roadmap, confidence score).
- [ ] **C-P1-4** State.jsonl schema is documented in `references/multi-ai-council/state-format.md` with examples.
- [ ] **C-P1-5** Decision record contains 3-4 ADRs covering: lightweight bound (no skill folder), folder layout, state schema, validator policy.
- [ ] **C-P1-6** No new skill folder created at `.opencode/skill/multi-ai-council/`.

## P2 — Suggestions

- [ ] **C-P2-1** Agent body stays under 750 LOC (current ~616). Spill to references if growth needed.
- [ ] **C-P2-2** Memory save after council completion writes a templated continuity payload pointing at `council-report.md`.
- [ ] **C-P2-3** README §3 agent count updated if the council agent's role shifts materially.
- [ ] **C-P2-4** A regression test in `system-spec-kit/scripts/tests/` confirms the validator's new awareness.

---

## Completion Criteria

- [ ] All P0 items checked with evidence (commit SHA, file path, or vitest output)
- [ ] All P1 items checked OR explicitly deferred with reason
- [ ] P2 items reviewed; lift-or-document
- [ ] Strict validation exit 0 on packet 080 + sub-packets 080/001 and 080/002
- [ ] All seven success criteria from spec.md §5 evidenced
