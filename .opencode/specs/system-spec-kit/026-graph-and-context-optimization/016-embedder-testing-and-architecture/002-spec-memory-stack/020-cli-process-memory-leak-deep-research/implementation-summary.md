---
title: "Implementation Summary: CLI Process Memory Leak Deep Research Packet"
description: "Initial documentation summary for the research packet that will drive a 10-iteration memory leak and process-containment investigation."
trigger_phrases:
  - "memory leak research packet summary"
  - "CLI process containment summary"
  - "020 deep research packet"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/020-cli-process-memory-leak-deep-research"
    last_updated_at: "2026-05-22T05:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Created initial research spec packet."
    next_safe_action: "Run strict validation, then execute the requested deep-research iterations when ready."
    blockers:
      - "Deep-research execution is pending."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000020"
      session_id: "020-cli-process-memory-leak-deep-research"
      parent_session_id: null
    completion_pct: 15
    open_questions:
      - "Exact Claude model id for Opus 4.7 still needs preflight confirmation."
    answered_questions:
      - "This packet documents the research run; it does not implement leak fixes."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/020-cli-process-memory-leak-deep-research` |
| **Completed** | Initial packet authored 2026-05-22; research execution pending |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The initial Level 3 research packet now exists for the requested broad memory-leak investigation. It turns the report of runaway cross-CLI process buildup into a controlled `/spec_kit:deep-research` contract with executor split, telemetry gates, cleanup rules, halt thresholds, and follow-up boundaries.

### Research Contract

The packet defines a 10-iteration plan against `.opencode/skills/system-spec-kit`, with five `cli-claude-code` Opus-route iterations and five `cli-codex` GPT-5.5 xhigh fast iterations. It explicitly blocks ad hoc shell loops, nested self-invocation, and parallel dispatcher storms unless the operator authorizes a specific concurrency experiment.

### Safety Model

The plan requires `sysctl vm.swapusage`, `vm_stat`, process inventory, cleanup verification, and state validation between iterations. It treats Apple Silicon swap and wired memory as first-class failure modes, not as generic process leaks.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet was scaffolded through `create.sh` as a Level 3 system-spec-kit child phase, then the placeholders were replaced with a research-specific spec, plan, task list, checklist, ADR, and continuity summary. The expensive deep-research run has not been executed in this authoring step.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use sequential telemetry-gated deep research. | The investigation must not recreate the process-spam failure mode by launching concurrent CLI dispatches. |
| Split executors 5 Claude and 5 Codex. | The user requested both perspectives, and cross-model review reduces blind spots in process lifecycle analysis. |
| Keep implementation fixes out of this packet. | Leak fixes need reproduction evidence, owner mapping, and verification design before code changes. |
| Treat kernel-side memory pressure separately from user-process leaks. | Prior evidence can show low user RSS while swap or wired memory remains saturated. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `create.sh --level 3 --path .../020-cli-process-memory-leak-deep-research` | PASS: scaffold created `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md`, `decision-record.md`, `description.json`, `graph-metadata.json`, and `scratch/.gitkeep`. |
| Template placeholders replaced | PASS: initial packet content authored for the memory-leak deep-research request. |
| Strict spec validation | PASS: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/020-cli-process-memory-leak-deep-research --strict` returned 0 errors and 0 warnings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Research not executed yet.** The packet is ready for the controlled 10-iteration run, but no iteration artifacts or final synthesis exist yet.
2. **Claude Opus 4.7 flag needs preflight.** The installed Claude CLI must confirm the exact model id before the five Claude iterations launch.
3. **Cleanup commands are not pre-authorized for unrelated processes.** The future run may kill only dispatcher-owned children unless the operator approves broader cleanup.
<!-- /ANCHOR:limitations -->
