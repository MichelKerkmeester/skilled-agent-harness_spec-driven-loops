---
title: "Resource Map: Research Synthesis and Remediation Map"
description: "File ledger for phase 001 Level 3 docs and recovered source research archives."
trigger_phrases:
  - "phase 001 resource map"
  - "memory leak source research archive"
  - "research synthesis resource map"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/001-research-synthesis-and-remediation-map"
    last_updated_at: "2026-05-22T10:55:00Z"
    last_updated_by: "opencode"
    recent_action: "Documented recovered research archive and Level 3 file ledger."
    next_safe_action: "Validate phase 001 and delete old source packet folders."
    blockers: []
    key_files:
      - "resource-map.md"
      - "research/source-research/"
    session_dedup:
      fingerprint: "sha256:0101010101010101010101010101010101010101010101010101010101010101"
      session_id: "009-memory-leak-remediation-arc-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The phase-local source archive is canonical for original 020 and 024 research."
---
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v2.2 -->
# Resource Map: Research Synthesis and Remediation Map

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## Summary

This resource map inventories the phase 001 Level 3 documentation and the recovered original research artifacts from source packets 020 and 024. The archive under `research/source-research/` is canonical after the old packet folders are deleted.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:phase-docs -->
## Phase Documents

| Path | Status | Purpose |
| --- | --- | --- |
| `spec.md` | Updated | Level 3 phase scope, requirements, source archive paths, and handoff criteria. |
| `plan.md` | Updated | Harness-first implementation sequencing and dependencies. |
| `tasks.md` | Updated | Completed recovery, synthesis, Level 3 docs, and validation tasks. |
| `implementation-summary.md` | Updated | Current state, decisions, validation evidence, and limitations. |
| `checklist.md` | Created | Level 3 verification checklist for archive recovery and deletion readiness. |
| `decision-record.md` | Created | ADRs for phase-local archive, old packet deletion, and harness-first remediation. |
| `resource-map.md` | Created | This file ledger. |
| `description.json` | Updated | Spec discovery metadata. |
| `graph-metadata.json` | Updated | Graph metadata and source docs for phase 001. |
<!-- /ANCHOR:phase-docs -->

---

<!-- ANCHOR:research-docs -->
## Research Outputs

| Path | Status | Purpose |
| --- | --- | --- |
| `research/remediation-map.md` | Created | Consolidated priority order, dependencies, target phases, and verification gates. |
| `research/source-evidence-index.md` | Created | Archive inventory, source citation rule, and cross-packet overlap map. |
| `research/source-research/020-cli-process-memory-leak-deep-research/research/` | Recovered | Original 10-iteration packet 020 deep-research artifact tree. |
| `research/source-research/020-cli-process-memory-leak-deep-research/packet-docs/` | Recovered | Original packet 020 root docs and metadata before deletion. |
| `research/source-research/024-cli-deep-research-memory-leak-audit/research/` | Recovered | Original 15-iteration packet 024 deep-research artifact tree. |
| `research/source-research/024-cli-deep-research-memory-leak-audit/packet-docs/` | Recovered | Original packet 024 root docs, resource map, and metadata before deletion. |
<!-- /ANCHOR:research-docs -->

---

<!-- ANCHOR:archive-020 -->
## Packet 020 Archive

| Artifact | Expected Contents |
| --- | --- |
| `research/research.md` | Final synthesis and remediation backlog. |
| `research/iterations/` | `iteration-001.md` through `iteration-010.md`. |
| `research/deltas/` | `iter-001.jsonl` through `iter-010.jsonl`. |
| `research/prompts/` | Iteration prompts and iteration contract. |
| `research/deep-research-state.jsonl` | Reducer state log for the 10-iteration run. |
| `research/deep-research-dashboard.md` | Deep-research dashboard. |
| `research/deep-research-strategy.md` | Strategy file. |
| `research/deep-research-config.json` | Research config. |
| `research/findings-registry.json` | Findings registry. |
| `packet-docs/` | Root spec, plan, tasks, checklist, decision record, implementation summary, description, and graph metadata. |
<!-- /ANCHOR:archive-020 -->

---

<!-- ANCHOR:archive-024 -->
## Packet 024 Archive

| Artifact | Expected Contents |
| --- | --- |
| `research/research.md` | Final synthesis, continuation addendum, and remediation packet order. |
| `research/iterations/` | `iteration-001.md` through `iteration-015.md`. |
| `research/deltas/` | `iter-001.jsonl` through `iter-015.jsonl`. |
| `research/prompts/` | Iteration prompt artifacts. |
| `research/logs/` | Executor logs and `iteration-007-runtime-measurement.json`. |
| `research/deep-research-state.jsonl` | Reducer state log for the 15-iteration run. |
| `research/deep-research-dashboard.md` | Deep-research dashboard. |
| `research/deep-research-strategy.md` | Strategy file. |
| `research/deep-research-config.json` | Research config. |
| `research/findings-registry.json` | Findings registry. |
| `research/resource-map.md` | Research-local resource map. |
| `packet-docs/` | Root spec, plan, tasks, checklist, decision record, resource map, implementation summary, description, and graph metadata. |
<!-- /ANCHOR:archive-024 -->

---

<!-- ANCHOR:validation -->
## Validation Commands

| Command | Purpose |
| --- | --- |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/001-research-synthesis-and-remediation-map --strict` | Validate phase 001 Level 3 docs. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc --strict` | Validate the remediation arc parent. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture --strict` | Validate the umbrella parent after old packet deletion. |
<!-- /ANCHOR:validation -->
