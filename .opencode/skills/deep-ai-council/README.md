---
title: "deep-ai-council: Multi-Seat Planning Council"
description: "Planning-only council skill: 2-3 distinct AI seats compare strategies, critique each other, converge on a plan and persist auditable packet-local artifacts."
trigger_phrases:
  - "deep ai council"
  - "ai council deliberation"
  - "multi-seat planning council"
  - "council artifact persistence"
  - "council convergence"
  - "packet-local ai-council"
---

# deep-ai-council

> Put two or three AI minds on your plan before you build it. Distinct seats, honest cross-critique and convergence you can audit.

---

<!-- ANCHOR:table-of-contents -->

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
  - [3.1 HOW IT WORKS](#31-how-it-works)
  - [3.2 FEATURE REFERENCE](#32-feature-reference)
- [4. STRUCTURE](#4--structure)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->

## 1. OVERVIEW

### What deep-ai-council Does

One AI answer is one point of view. When a plan carries real trade-offs, one view is not enough. `deep-ai-council` runs a planning council: two or three seats with distinct reasoning lenses each propose a direction, then critique each other before anything is declared settled. You get a recommended plan plus the disagreement that shaped it, not a single confident guess.

The council is planning-only. It compares strategies, forces adversarial cross-seat critique, checks convergence and hands the result to whoever implements it. Every council write stays inside packet-local `ai-council/**` artifacts: the state log, per-seat outputs, deliberations, failed-round forensics and the final report. It never edits application code or authored spec docs.

The council runs primarily in-CLI. When you invoke it from inside an active runtime, that runtime's own model bench supplies the seats (for example Opus, Sonnet and Haiku on Claude Code). External-CLI dispatch is a secondary mode for when a fresh AI vantage adds value. Both modes obey one rule: a single CLI per round.

### How This Compares

A plain single-model plan gives you one lens and no record of what it ruled out. A hand-run "ask three models" loop gives you diversity but no convergence rule, no persistence and no audit trail. `deep-ai-council` adds a two-of-three convergence signal, append-only state you can replay, preserved failed rounds for forensics and an optional derived graph that ranks unresolved disagreements. The graph is a projection rebuilt from the artifacts, so the packet-local files stay the source of truth.

### Key Statistics

| Metric | Value |
|---|---|
| Version | 2.1.0.0 |
| Operating modes | In-CLI (primary), external-CLI (secondary) |
| References | 11 |
| Features | 32 across 9 categories |
| Manual test scenarios | 32 across 9 categories |
| Scripts | 5 CLI helpers + a writer library + tests |
| Runtime mirrors | 4 (OpenCode, Claude, Codex, Gemini) |

### Key Features

| Feature | What It Does |
|---|---|
| Multi-seat deliberation | Runs 2-3 seats with distinct strategy lenses and mandates. |
| Cross-seat critique | Forces adversarial critique before convergence is allowed. |
| Two-of-three convergence | Declares convergence when 2 of 3 seats agree and critique finds no blocker. |
| Append-only state | Records every council event in `ai-council-state.jsonl`, additive only. |
| Rollback forensics | Preserves failed rounds under `failed/round-NNN-<timestamp>/`. |
| Derived council graph | Optional `council_graph_*` projection that ranks unresolved disagreements and rebuilds from artifacts. |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->

## 2. QUICK START

**Step 1: Ask for a council.**

Dispatch a planning request from your active runtime. The council selects 2-3 distinct seats and returns a report.

```text
Use the deep AI council to compare these two implementation plans and persist the artifacts under <packet>.
```

**Step 2: Persist the report from the caller.**

The council recommends; the caller writes. Run the persistence helper once you have the report:

```bash
node .opencode/skills/deep-ai-council/scripts/persist-artifacts.cjs <packet> \
  --input-file <report> \
  --memory-save-payload-out <payload>
```

Expected result: a packet-local `ai-council/` tree with state, seats, deliberations and `council-report.md`.

**Step 3: Verify before handoff.**

```bash
node .opencode/skills/deep-ai-council/scripts/advise-council-completion.cjs <packet>
```

Expected result: confirmation that `ai-council-state.jsonl` ends with a `council_complete` event.

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->

## 3. FEATURES

### 3.1 HOW IT WORKS

The council moves through three steps, like a review panel that proposes, argues, then signs off.

#### 3.1.1 RESOLVE AND PREPARE

The skill resolves the target spec folder before any persistence, loads packet context and selects 2-3 seats with different reasoning lenses (Analytical, Creative, Critical, Pragmatic, Holistic, Research). When real executors are available, seats also target different AI vantages. Simulated vantages stay labeled as simulated.

#### 3.1.2 DELIBERATE AND CONVERGE

Each seat proposes independently. Then an adversarial critique pass (Hunter, Skeptic and Referee roles) tries to break the proposals before agreement is allowed. Convergence needs two of three seats to agree on the material plan with no new high-severity blocker from critique. If `max_rounds` passes without that, the run completes as non-converged rather than faking consensus.

#### 3.1.3 PERSIST AND HAND OFF

The council produces a report with the required sections, the caller persists it to packet-local `ai-council/**` artifacts and a completion advisory confirms the final state. Implementation passes to an implementation agent or the top-level caller. Failed rounds move under `failed/` so the forensic trail survives.

### 3.2 FEATURE REFERENCE

The 32 features group into 9 categories. The feature catalog carries the full inventory with per-feature source anchors.

| Category | Features | Primary Resource |
|---|---|---|
| Runtime routing and rename | 2 | [`feature_catalog/01--runtime-routing-and-rename/`](feature_catalog/01--runtime-routing-and-rename/) |
| Council deliberation and seat diversity | 2 | [`references/seat_diversity_patterns.md`](references/seat_diversity_patterns.md) |
| Artifact persistence and state format | 3 | [`references/state_format.md`](references/state_format.md) |
| Convergence and rollback | 3 | [`references/convergence_signals.md`](references/convergence_signals.md) |
| Scope boundaries | 2 | [`references/graph_support.md`](references/graph_support.md) |
| Depth and failure handling | 2 | [`references/depth_dispatch.md`](references/depth_dispatch.md) |
| Writer library contract | 4 | [`references/output_schema.md`](references/output_schema.md) |
| Council graph integration | 8 | [`references/graph_support.md`](references/graph_support.md) |
| Council graph value comparison | 6 | [`feature_catalog/09--council-graph-value-comparison/`](feature_catalog/09--council-graph-value-comparison/) |

Full inventory: [`feature_catalog/FEATURE_CATALOG.md`](feature_catalog/FEATURE_CATALOG.md).

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->

## 4. STRUCTURE

```text
.opencode/skills/deep-ai-council/
├── SKILL.md                    # Runtime instructions and smart router
├── README.md                   # This file
├── changelog/                  # Per-release notes (v1.0.0.0 through v2.1.0.0)
├── references/                 # 11 operating-contract references
├── feature_catalog/            # Root inventory + 32 per-feature files across 9 categories
├── manual_testing_playbook/    # Root playbook + 32 scenarios across 9 categories
└── scripts/                    # CLI helpers, writer library (lib/) and tests
```

Runtime packet layout (what a council run writes):

```text
{spec_folder}/ai-council/
├── ai-council-config.json      # Current run config
├── ai-council-state.jsonl      # Append-only event log
├── council-report.md           # Final report
├── seats/round-NNN/            # Per-seat outputs
├── deliberations/              # Per-round deliberation notes
├── critiques/                  # Cross-seat critique notes
└── failed/                     # Preserved failed rounds
```

### Key Files

| Path | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Agent-facing router and operating contract |
| [`references/output_schema.md`](./references/output_schema.md) | Required report sections parsed by the persistence helper |
| [`scripts/persist-artifacts.cjs`](./scripts/persist-artifacts.cjs) | Caller-owned artifact writer |
| [`scripts/replay-graph-from-artifacts.cjs`](./scripts/replay-graph-from-artifacts.cjs) | Rebuilds the derived graph from `ai-council-state.jsonl` |
| [`feature_catalog/FEATURE_CATALOG.md`](./feature_catalog/FEATURE_CATALOG.md) | Full feature inventory |

### Runtime Mirrors

The council agent ships across four runtimes under its established `ai-council` filename:

| Runtime | Agent File |
|---|---|
| OpenCode | `.opencode/agents/ai-council.md` |
| Claude | `.claude/agents/ai-council.md` |
| Codex | `.codex/agents/ai-council.toml` |
| Gemini | `.gemini/agents/ai-council.md` |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->

## 5. CONFIGURATION

`ai-council-config.json` tracks the active council run.

| Field | Purpose |
|---|---|
| `current_round` | Active round number |
| `max_rounds` | Hard cap before a non-converged completion |
| `seats_per_round` | Seat count, usually 2 or 3 |
| `convergence_signal` | Rule such as `two-of-three-agree` |
| `status` | `in-progress`, `complete` or `non-converged` |

The parser fails closed on missing required report sections. Add `--strict-output` to enforce that during capture:

```bash
node .opencode/skills/deep-ai-council/scripts/persist-artifacts.cjs <packet> \
  --input-file <report> --strict-output
```

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->

## 6. USAGE EXAMPLES

**Top-level dispatch**

```text
User request: Run a deep AI council to compare these two implementation plans and persist the artifacts.
Skill routing: COUNCIL_RUN
Resources loaded: references/seat_diversity_patterns.md, references/convergence_signals.md, references/output_schema.md
Expected output: a council report plus a persisted ai-council/ tree ending in council_complete.
```

**@orchestrate at Depth 1**

```text
User request: Depth 1. Dispatch @deep-ai-council as a planning LEAF, then persist the returned report from the parent context.
Skill routing: DEPTH_DISPATCH
Resources loaded: references/depth_dispatch.md
Expected output: an inline planning result the orchestrator persists from its own write context.
```

**External CLI capture**

```text
User request: Run the council via an external CLI and capture the report it produced.
Skill routing: ARTIFACT_PERSISTENCE
Resources loaded: references/command_wiring.md, references/folder_layout.md
Expected output: persisted artifacts only when the external runtime actually produced the report. Simulated vantages stay labeled simulated.
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->

## 7. TROUBLESHOOTING

### Missing council_complete Event

**What you see**: The run looks done but downstream checks reject it.

**Common causes**: The final `council_complete` event was never appended to the state log.

**Fix**: Run `advise-council-completion.cjs <packet>` and inspect `ai-council-state.jsonl`.

---

### Parser Exits 1 on a Missing Section

**What you see**: `persist-artifacts.cjs` exits 1 during capture.

**Common causes**: The report is missing a required section from the output schema.

**Fix**: Compare the report against [`references/output_schema.md`](references/output_schema.md) and add the missing section.

---

### Council Report Exists but Seats Are Missing

**What you see**: A report persisted but per-seat files are absent.

**Common causes**: The report used a composition-table fallback instead of per-seat headings.

**Fix**: Confirm the report uses valid per-seat headings or a valid composition table the parser accepts.

### Quick Fixes

| Problem | Fix |
|---|---|
| Rollback artifacts remain in `failed/` | Inspect the failed round folder and matching `rollback` or `artifact_superseded` events |
| Advisor does not route council prompts | Run the targeted skill advisor scorer test for `deep-ai-council` |
| A caller wants code changes from the council | Return the plan and hand implementation to the caller or implementation agent |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->

## 8. FAQ

**Q: Can this skill implement the winning plan?**

A: No. It produces planning artifacts and hands implementation to another actor.

---

**Q: Does the graph replace the council artifacts?**

A: No. The graph is a derived projection exposed through the `council_graph_*` MCP tools. Packet-local `ai-council/**` artifacts and the append-only state stay authoritative, and the graph rebuilds from them.

---

**Q: What counts as convergence?**

A: Two of three seats agree on the material plan and cross-seat critique finds no new high-severity blocker.

---

**Q: Can external CLIs participate?**

A: Yes, when the caller actually runs them. Otherwise the vantage must be labeled simulated. All seats in one round use the same CLI; a different CLI is a new round.

---

**Q: How do I roll back a round?**

A: Preserve the failed artifacts under `failed/round-NNN-<timestamp>/` and append rollback or audit events. Never rewrite prior state rows.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Agent-facing router and operating contract |
| [`feature_catalog/FEATURE_CATALOG.md`](./feature_catalog/FEATURE_CATALOG.md) | Full feature inventory across 9 categories |
| [`manual_testing_playbook/manual_testing_playbook.md`](./manual_testing_playbook/manual_testing_playbook.md) | Operator validation package (32 scenarios) |
| [`references/output_schema.md`](./references/output_schema.md) | Required report sections (parser contract) |
| [`references/scoring_rubric.md`](./references/scoring_rubric.md) | Five-dimension scoring and critique roles |
| [`references/convergence_signals.md`](./references/convergence_signals.md) | Convergence rules and escape hatches |
| [`references/graph_support.md`](./references/graph_support.md) | Derived council graph and MCP tool boundary |
| [`changelog/`](./changelog/) | Per-release notes (v1.0.0.0 through v2.1.0.0) |

Related skills: [`deep-research`](../deep-research/SKILL.md) for evidence-first investigation vantages and [`system-spec-kit`](../system-spec-kit/SKILL.md) for packet documentation, validation, resume and continuity.

<!-- /ANCHOR:related-documents -->
