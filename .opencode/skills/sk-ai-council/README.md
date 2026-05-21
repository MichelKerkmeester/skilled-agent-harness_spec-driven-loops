---
title: sk-ai-council
description: "AI Council: multi-seat planning, artifact persistence, convergence checks, packet-local ai-council outputs."
trigger_phrases:
  - "deep ai council"
  - "ai council deliberation"
  - "multi-seat planning council"
  - "council artifact persistence"
  - "council convergence"
  - "packet-local ai-council"
---

# sk-ai-council

> Planning-only deliberation skill for multi-seat strategy comparison, convergence checks, and packet-local `ai-council/**` artifact persistence.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
- [4. STRUCTURE](#4--structure)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. RUNTIME PARITY](#7--runtime-parity)
- [8. TROUBLESHOOTING](#8--troubleshooting)
- [9. FAQ](#9--faq)
- [10. RELATED DOCUMENTS](#10--related-documents)

---

## 1. OVERVIEW

`sk-ai-council` runs planning councils with two or three distinct reasoning seats. It compares strategies, forces cross-seat critique, checks convergence, and returns a plan that another agent or user can implement.

The skill is planning-only. Council writes are scoped to packet-local `ai-council/**` artifacts, including state, seat outputs, deliberations, failed-round forensics, and the final council report. It does not edit application code or authored spec docs.

Recovery outside a council run should use `/spec_kit:resume`, which rebuilds context from the packet continuity ladder before consulting generated memory artifacts. Graph-backed council storage is a derived SQLite projection exposed through the `council_graph_*` MCP tool family (`upsert`, `query`, `status`, `convergence`); packet-local `ai-council/**` artifacts remain authoritative and the graph rebuilds from them.

---

## 2. QUICK START

Top-level dispatch asks for a planning report, then the caller persists it:

```text
Use the deep AI council to compare these two implementation plans and persist the artifacts under <packet>.
```

Caller-owned persistence helper:

```bash
node .opencode/skills/sk-ai-council/scripts/persist-artifacts.cjs <packet> \
  --input-file <report> \
  --memory-save-payload-out <payload>
```

Completion advisory:

```bash
node .opencode/skills/sk-ai-council/scripts/advise-council-completion.cjs <packet>
```

---

## 3. FEATURES

- Multi-seat deliberation: Runs 2-3 seats with distinct strategy lenses and mandates.
- Seat diversity: Encourages different AI vantage targets when they actually run.
- Append-only state: Records council events in `ai-council-state.jsonl`.
- Two-of-three convergence: Declares convergence when 2 of 3 seats agree and critique finds no blocker.
- Rollback forensics: Preserves failed round artifacts under `failed/round-NNN-<timestamp>/`.
- Schema-evolution policy: Adds fields/events only; old state rows are never rewritten.

---

## 4. STRUCTURE

Skill package:

```text
.opencode/skills/sk-ai-council/
|-- SKILL.md
|-- README.md
|-- description.json
|-- graph-metadata.json
|-- changelog/
|   |-- v1.0.0.0.md
|   |-- v1.1.0.0.md
|-- references/
|   |-- anti_patterns.md
|   |-- command_wiring.md
|   |-- convergence_signals.md
|   |-- depth_dispatch.md
|   |-- failure_handling.md
|   |-- folder_layout.md
|   |-- graph_support.md
|   |-- output_schema.md
|   |-- scoring_rubric.md
|   |-- seat_diversity_patterns.md
|   |-- state_format.md
|-- scripts/
|   |-- advise-council-completion.cjs
|   |-- persist-artifacts.cjs
|   |-- replay-graph-from-artifacts.cjs
|   |-- lib/
|-- manual_testing_playbook/
|   |-- manual_testing_playbook.md
|   |-- 01--runtime-routing-and-rename/
|   |-- 02--council-deliberation-and-seat-diversity/
|   |-- 03--artifact-persistence-and-state-format/
|   |-- 04--convergence-and-rollback/
|   |-- 05--scope-boundaries/
|   |-- 06--depth-and-failure-handling/
|   |-- 07--writer-library-contract/
|   |-- 08--council-graph-integration/
|   |-- 09--council-graph-value-comparison/
|-- feature_catalog/
|   |-- 01--runtime-routing-and-rename/ .. 09--council-graph-value-comparison/  (32 entries total)
```

Runtime packet layout:

```text
{spec_folder}/ai-council/
|-- ai-council-config.json
|-- ai-council-strategy.md
|-- ai-council-state.jsonl
|-- council-report.md
|-- seats/
|   |-- round-001/
|-- deliberations/
|   |-- round-001.md
|-- critiques/
|   |-- round-002-critique.md
|-- failed/
|   |-- round-002-2026-05-08T22-31-00-000Z/
```

---

## 5. CONFIGURATION

`ai-council-config.json` tracks the current council run.

| Field | Meaning |
| --- | --- |
| `current_round` | Active round number. |
| `max_rounds` | Hard cap before non-converged completion. |
| `seats_per_round` | Seat count, usually 2 or 3. |
| `convergence_signal` | Rule such as `two-of-three-agree`. |
| `status` | Current run status, such as `in-progress`, `complete`, or `non-converged`. |

Optional parser flag:

```bash
node .opencode/skills/sk-ai-council/scripts/persist-artifacts.cjs <packet> --input-file <report> --strict-output
```

---

## 6. USAGE EXAMPLES

### Top-Level Dispatch

```text
Run a deep AI council to compare these two implementation plans and persist the artifacts.
```

Expected operator flow:

1. Resolve the target packet.
2. Capture the returned council report.
3. Run the persistence helper from the caller context.
4. Check the advisory helper before claiming completion.

### @orchestrate At Depth 1

```text
Depth: 1. Dispatch @sk-ai-council as a planning LEAF, then persist the returned report from the parent context.
```

Depth 1 runs should consume the orchestrator context package first and avoid broad rediscovery unless the provided context is insufficient.

### CLI-Skill Playbook Capture

```bash
node .opencode/skills/sk-ai-council/scripts/persist-artifacts.cjs <packet> --input-file /tmp/council-report.md
```

CLI captures are valid only when the external runtime actually produced the report. Simulated vantages must stay labeled as simulated in the council report.

Evidence to capture:
- The report input path
- The helper command transcript
- The final artifact tree

---

## 7. RUNTIME PARITY

| Runtime | Agent File |
| --- | --- |
| OpenCode | `.opencode/agents/sk-ai-council.md` |
| Claude | `.claude/agents/sk-ai-council.md` |
| Codex | `.codex/agents/sk-ai-council.toml` |

---

## 8. TROUBLESHOOTING

| Problem | Check |
| --- | --- |
| Missing `council_complete` event | Run `advise-council-completion.cjs` and inspect `ai-council-state.jsonl`. |
| Parser exits 1 on missing required section | Compare the report against `references/output_schema.md`. |
| Rollback artifacts remain in `failed/` | Inspect the failed round folder and matching `rollback` or `artifact_superseded` events. |
| Advisor does not route council prompts | Run the targeted skill advisor scorer test for `sk-ai-council`. |
| Council report exists but seats are missing | Check whether the report used per-seat headings or a valid composition table fallback. |
| A caller wants code changes from the council | Return the plan and hand implementation to the caller or implementation agent. |

---

## 9. FAQ

**Q: Can this skill implement the winning plan?**
A: No. It produces planning artifacts and hands off implementation to another actor.

**Q: Does graph support replace council artifacts?**
A: No. Graph support is a derived MCP projection. Packet-local `ai-council/**` artifacts and append-only state remain authoritative.

**Q: What counts as convergence?**
A: Two of three seats agree on the material plan and cross-seat critique finds no new high-severity blocker.

**Q: Can external CLIs participate?**
A: Yes, when the caller actually runs them. Otherwise the vantage must be labeled simulated.

**Q: How do I roll back a round?**
A: Preserve failed artifacts under `failed/round-NNN-<timestamp>/` and append rollback/audit events rather than rewriting prior rows.

---

## 10. RELATED DOCUMENTS

- `SKILL.md` - agent-facing router and operating contract.
- `changelog/` - per-release notes (`v1.0.0.0.md` skill extraction, `v1.1.0.0.md` graph + value-comparison + infra hardening series).
- `references/anti_patterns.md` - council failure modes to avoid.
- `references/command_wiring.md` - caller-owned persistence patterns.
- `references/convergence_signals.md` - convergence and escape hatches.
- `references/depth_dispatch.md` - Depth 0 / Depth 1 dispatch rules.
- `references/failure_handling.md` - rollback and recovery flows.
- `references/folder_layout.md` - runtime artifact tree.
- `references/graph_support.md` - derived graph support and MCP tool boundaries.
- `references/output_schema.md` - required report sections.
- `references/scoring_rubric.md` - 5-dimension scoring contract.
- `references/seat_diversity_patterns.md` - seat and vantage selection.
- `references/state_format.md` - append-only state events.
- `manual_testing_playbook/manual_testing_playbook.md` - operator validation package (32 scenarios across 9 categories).
- `feature_catalog/NN--<category>/` - 1:1 feature inventory mirroring the playbook (32 entries).

Agent definitions:

| Runtime | File |
| --- | --- |
| OpenCode | `.opencode/agents/sk-ai-council.md` |
| Claude | `.claude/agents/sk-ai-council.md` |
| Codex | `.codex/agents/sk-ai-council.toml` |

Related skills: `deep-research` for evidence-first research vantages and `system-spec-kit` for packet validation, resume, and continuity.
