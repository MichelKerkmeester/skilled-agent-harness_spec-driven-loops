---
title: "Feature Specification: create-command + command-surface improvement research"
description: "Runs a two-lineage deep-research fan-out over the 066 benchmark findings and the create-command authoring canon, producing a prioritized cross-model improvement backlog for create-command and every OpenCode command that uses the defined templates and routing logic, ready to seed follow-on remediation packets."
status: in_progress
trigger_phrases:
  - "create-command improvement research"
  - "command surface improvement research"
  - "command canon improvements"
  - "command template logic research"
  - "066 command benchmark follow-on research"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/012-command-improvement-research"
    last_updated_at: "2026-07-16T08:42:19Z"
    last_updated_by: "claude"
    recent_action: "Synthesized 2-lineage fan-out into research/research.md"
    next_safe_action: "Open remediation packet on keystone K1"
    blockers: []
    key_files:
      - "research/research.md"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/skills/sk-doc/create-command/assets/command_template.md"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    open_questions:
      - "Which recurring per-family divergences are canon gaps vs one-off authoring errors?"
      - "What command-surface behaviors does validate_document.py --type command miss?"
      - "Which router-contract changes close dual-runtime (opencode/codex/claude) parity gaps?"
    answered_questions:
      - "Executor = 2-lineage fan-out: 5x cli-opencode/glm-5.2 max + 5x cli-codex/gpt-5.6-sol high/fast"
      - "Stop policy = max-iterations (forced 5 per lineage; convergence is telemetry only)"
      - "Grounding = 066 benchmark findings + create-command/create-benchmark canon"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: create-command + command-surface improvement research

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-16 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 066 command-surface benchmark surfaces where OpenCode commands diverge from the create-command authoring canon, but nothing turns those signals into an actionable improvement backlog for the canon itself. This packet runs a two-lineage deep-research fan-out with forced non-convergence — 5 iterations of GLM-5.2 at max reasoning via cli-opencode, and 5 iterations of GPT-5.6-Sol at high reasoning / fast service tier via cli-codex — so two independent model perspectives each explore the full question to depth without collapsing early. It mines the benchmark findings and the create-command canon (SKILL.md, command_router_template.md, command_template.md) for concrete, prioritized improvements to create-command and every command that uses the defined templates and routing logic. The deliverable is research/research.md: a reconciled cross-model synthesis with per-RQ candidate deltas (target file paths + acceptance criteria) ready to seed follow-on remediation packets.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Read the create-command and create-benchmark canon, the ~37 OpenCode command docs, the command validators, and the 066 benchmark artifacts.
- Run the two-lineage fan-out (glm52-max via cli-opencode, gpt56-sol-high-fast via cli-codex) through the skill-owned fanout-run.cjs driver with stop policy max-iterations.
- Synthesize per-RQ findings with evidence citations and candidate deltas into research/research.md, cross-checked across the two model lineages.
- Produce a prioritized improvement backlog (P0/P1/P2) with target paths and acceptance criteria for downstream remediation.

**Out of scope:**
- Implementing any change; deltas seed follow-on packets and no shipped runtime is touched.
- Memory-DB reindex, deferred per operator directive.
- Deciding Claude command parity, which is left as an open decision gate for the remediation packet.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** Both lineages complete all 5 iterations each (10 total) with stopReason in the max-iterations family and no early convergence.
- **REQ-002 (P0):** research/research.md synthesizes findings per RQ with evidence citations (file:line) and candidate deltas (target path + acceptance criterion) distinguished by priority.
- **REQ-003 (P0):** Findings are cross-checked across the two model lineages — agreements strengthened, model-unique findings flagged, disagreements noted — not a single-model dump.
- **REQ-004 (P1):** Each iteration state record carries the route-proof fields (target_agent deep-research, resolved_route, agent_definition_loaded true, mode research) available to that lineage's state schema.
- **REQ-005 (P1):** The backlog names a dependency spine and a sequencing recommendation so a remediation packet can open on the smallest first cut without re-deriving order.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Both lineages report 5/5 iterations with stopReason maxIterationsReached; 10 iterations total, no early stop.
- research/research.md contains an agreement matrix, model-unique findings, a prioritized backlog with acceptance criteria, and a run-provenance section.
- Every backlog item names concrete target files and a testable acceptance criterion.
- validate.sh --strict passes for this packet with Errors:0 Warnings:0.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Single-model bias — mitigated by the two-lineage cross-model design; agreements are marked HIGH confidence and single-lineage findings MEDIUM, worth a verify pass.
- False-positive findings — the GPT lineage flags that some 066 P0 route cycles are comment-derived false positives; the backlog routes that to a parser fix (K3) before acting on those P0s.
- Data-quality anomalies — GLM state records carry cosmetic UTC-labeled timestamp anomalies and a GPT stall heartbeat gap; neither truncated a lineage nor affects findings content.
- Dependencies: the 066 benchmark artifacts, the create-command and create-benchmark canon, and the skill-owned fanout-run.cjs driver.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is the router-gate alternative a P0 or P1 promotion given 35 commands rely on the prose form today, and does it need a migration window?
- Is Claude command parity intended at all, or should the canon formally scope to opencode and codex?
- Which P2 heuristic checks need a curated allowlist before promotion, once the semantic-validation enabler surfaces their true noise level?
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: 011-create-benchmark-completeness-remediation. Successor: 013-command-canon-remediation.
