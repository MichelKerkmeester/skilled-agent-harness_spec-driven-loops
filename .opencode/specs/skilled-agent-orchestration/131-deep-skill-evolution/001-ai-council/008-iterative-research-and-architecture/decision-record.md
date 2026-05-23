---
title: "Decision Record: Deep AI Council Research + Architecture Design"
description: "ADR-001..ADR-005 for deep-ai-council iterative multi-topic architecture."
trigger_phrases:
  - "deep ai council 001 adrs"
  - "deep-ai-council architecture decisions"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/001-ai-council/008-iterative-research-and-architecture"
    last_updated_at: "2026-05-23T09:30:00Z"
    last_updated_by: "codex"
    recent_action: "129/001 architecture research complete, 5 ADRs authored, 002-006 scaffolded"
    next_safe_action: "dispatch F1 -- 129/002 runtime primitive extraction"
    blockers: []
    key_files:
      - ".opencode/skills/deep-ai-council/SKILL.md"
      - ".opencode/skills/deep-loop-runtime/SKILL.md"
      - ".opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js"
    session_dedup:
      fingerprint: "sha256:1290010000000000000000000000000000000000000000000000000000000001"
      session_id: "wave-5-e1-2026-05-23"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Extend deep-loop-runtime rather than create a peer council-runtime."
      - "Use session -> topic -> round state hierarchy."
      - "Use adjudicator-verdict stability deltas with saturation threshold 0.2."
---

# Decision Record: Deep AI Council Research + Architecture Design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Runtime Boundary Decision

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-23 |
| **Deciders** | Wave 5 E1 research agent |

<!-- ANCHOR:adr-001-context -->
### Context

`deep-ai-council` is now the skill name and it already owns council-specific routing, references, persistence scripts, and artifact semantics. Its current `SKILL.md` says council artifacts are packet-local and planning-only, while `deep-loop-runtime` is a shared infrastructure skill consumed by deep-review and deep-research through scripts and TypeScript imports, not a user-facing workflow.

The boundary choice is between adding council primitives under `.opencode/skills/deep-loop-runtime/lib/` or creating a new peer `.opencode/skills/council-runtime/`. A peer runtime would duplicate loop-lock, JSONL repair, atomic-state, executor-audit, fallback routing, and test conventions that already exist in `deep-loop-runtime`. But putting council domain logic directly into generic deep-loop modules would blur the distinct convergence semantics that packet 130 says must remain separate.

<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Extend `deep-loop-runtime/lib/` with narrowly scoped council-compatible infrastructure adapters, and keep domain semantics in `deep-ai-council`.

Phase 002 should add reusable primitives only where they are truly infrastructure-shaped:

- state append/repair helpers compatible with council session/topic/round logs
- loop lock and permissions-gate usage wrappers
- executor audit payload shape for council rounds
- prompt-pack rendering support for command-owned council rounds
- convergence utility entrypoints that call a council-specific scoring module owned by `deep-ai-council` or a `deep-loop-runtime/lib/council/` subfolder with explicit ownership comments

Do not create `.opencode/skills/council-runtime/` in packet 129.

<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

Positive:

- Avoids a third runtime package before duplication exists.
- Reuses the tested single-writer, JSONL, audit, and fallback contracts already shipped in `deep-loop-runtime`.
- Keeps operator-facing council behavior in `deep-ai-council`, where the skill router and references already live.

Negative:

- `deep-loop-runtime` must broaden from "deep-review + deep-research" to "deep-* loop consumers" in docs and tests.
- Council-specific convergence math must be isolated so review/research thresholds cannot accidentally inherit council defaults.

<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Outcome | Rejection Reason |
|--------|---------|------------------|
| Create peer `council-runtime` | Rejected | Duplicates low-level runtime code before there is enough council-only runtime surface to justify a package. |
| Put all council logic in `deep-loop-runtime` | Rejected | Blurs domain boundaries and risks threshold/default leakage across siblings. |
| Keep current `deep-ai-council` helper only | Rejected | Cannot support multi-topic, multi-round state without inventing loop primitives locally. |

<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

| Check | Result |
|-------|--------|
| Simplicity | Pass - no new peer runtime package. |
| Scope | Pass - only shared primitives move to runtime. |
| Maintainability | Pass - domain semantics remain in council skill. |
| Testability | Pass - phase 002 can unit-test primitives. |
| Reversibility | Pass - no state migration in ADR-001 alone. |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

Phase 002 implements the shared primitive surface. Phases 003-004 consume it for council-specific orchestration and registry behavior.
<!-- /ANCHOR:adr-001-impl -->

### Evidence

- `.opencode/skills/deep-ai-council/SKILL.md:12` defines council as packet-local planning with `ai-council/**` persistence.
- `.opencode/skills/deep-ai-council/SKILL.md:122` says references cover council state, folder layout, seat diversity, output schema, and convergence signals.
- `.opencode/skills/deep-loop-runtime/SKILL.md:20` lists executor config, prompt-pack rendering, post-dispatch validation, atomic state, JSONL repair, locking, scoring, and fallback routing as shared runtime support.
- `.opencode/skills/deep-loop-runtime/SKILL.md:111` documents script invocation and TypeScript imports as the runtime exposure paths.
- `.opencode/skills/deep-loop-runtime/SKILL.md:191` says a new consumer beyond deep-review/deep-research needs a new ownership ADR.
- `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/research.md:195` recommends the hybrid strategy: extract shared primitives while keeping distinct entrypoints.

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: 3-Level State Hierarchy Contract

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-23 |
| **Deciders** | Wave 5 E1 research agent |

### Context

Current council artifacts are packet-level and round-level: `ai-council-config.json`, `ai-council-state.jsonl`, `seats/round-NNN`, `deliberations/round-NNN.md`, `critiques/round-NNN-critique.md`, and `council-report.md`. Packet 129 needs multi-topic sessions where later topics can read earlier topic findings as priors. A flat round counter is not enough because round 2 could mean "same topic refinement" or "new topic on another question".

### Decision

Use a three-level hierarchy: session -> topic -> round.

Target artifact layout:

```text
ai-council/
|-- council-session.json
|-- council-session-state.jsonl
|-- council-findings-registry.json
|-- topics/
|   |-- topic-001-<slug>/
|   |   |-- topic-config.json
|   |   |-- topic-state.jsonl
|   |   |-- topic-report.md
|   |   |-- rounds/
|   |   |   |-- round-001/
|   |   |   |   |-- round-state.jsonl
|   |   |   |   |-- seats/
|   |   |   |   |-- deliberation.md
|   |   |   |   |-- critique.md
|-- session-report.md
```

Minimum JSON shape:

```json
{
  "session": {
    "session_id": "council-session-<timestamp>",
    "spec_folder": "<packet>",
    "max_topics_per_session": 5,
    "current_topic": 1,
    "status": "in_progress"
  },
  "topic": {
    "topic_id": "topic-001-runtime-boundary",
    "topic_slug": "runtime-boundary",
    "max_rounds_per_topic": 3,
    "current_round": 1,
    "prior_fingerprints": [],
    "status": "in_progress"
  },
  "round": {
    "round_id": "round-001",
    "cli_boundary": "in-cli",
    "seats": ["seat-001", "seat-002", "seat-003"],
    "adjudicator_verdict": null,
    "verdict_delta_from_previous": null
  }
}
```

### Consequences

Positive:

- Makes "topic loop" and "round loop" distinct and auditable.
- Allows each topic to converge independently while sharing a session registry.
- Preserves the existing one-CLI-per-round invariant by making CLI changes round boundaries.

Negative:

- Existing `persist-artifacts.cjs` cannot directly write the new hierarchy.
- Resume logic must inspect session, topic, and round state rather than one flat `current_round`.

### Alternatives Considered

| Option | Outcome | Rejection Reason |
|--------|---------|------------------|
| Flat `ai-council/seats/round-NNN` only | Rejected | Ambiguous across topics; cannot express cross-topic priors cleanly. |
| Session -> round only | Rejected | Treats topics as labels, not resumable state machines. |
| Separate `ai-council/` folder per topic | Rejected | Loses session-wide registry and priors. |

### Evidence

- `.opencode/skills/deep-ai-council/references/folder_layout.md:25` shows the current flat packet-level artifact tree.
- `.opencode/skills/deep-ai-council/references/folder_layout.md:47` says current config tracks `current_round`, `max_rounds`, `seats_per_round`, and status.
- `.opencode/skills/deep-ai-council/references/state_format.md:15` defines `ai-council-state.jsonl` as append-only JSONL for resume, audit, and convergence.
- `.opencode/skills/deep-ai-council/SKILL.md:34` requires one CLI per round and says a different CLI is a new dedicated round.
- `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/research.md:51` identifies session -> topic -> round as the proposed council state ownership model.

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Adjudicator-Verdict Stability Convergence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-23 |
| **Deciders** | Wave 5 E1 research agent |

### Context

The current council convergence rule is v1 two-of-three agreement. That is good for one completed round, but packet 129 needs multi-round convergence within a topic. Deep-review and deep-research both use iteration deltas; council needs the analogous signal for opinion-shaped outputs.

### Decision

Use adjudicator-verdict stability across consecutive rounds.

Each round emits a structured adjudicator verdict:

```json
{
  "recommended_option": "extend-deep-loop-runtime",
  "confidence": 0.82,
  "blocking_disagreements": [],
  "material_risks": ["threshold leakage"],
  "decision_axes": {
    "correctness": "extend",
    "integration": "extend",
    "operational_cost": "extend",
    "maintainability": "extend",
    "migration_risk": "extend"
  }
}
```

Round delta formula:

```text
option_changed = previous.recommended_option != current.recommended_option ? 1 : 0
confidence_delta = abs(previous.confidence - current.confidence)
risk_jaccard_delta = 1 - (intersection(previous.material_risks, current.material_risks) / union(...))
axis_flip_rate = changed(decision_axes) / count(decision_axes)
blocking_delta = abs(count(previous.blocking_disagreements) - count(current.blocking_disagreements)) / max(1, max_count)

verdict_delta =
  0.35 * option_changed +
  0.20 * confidence_delta +
  0.20 * risk_jaccard_delta +
  0.15 * axis_flip_rate +
  0.10 * blocking_delta

stable = verdict_delta <= saturation_threshold
```

Terminate a topic when any condition is true:

- two consecutive rounds are stable (`verdict_delta <= 0.2`)
- `max_rounds_per_topic` is reached
- all seats fail and no adjudicator verdict can be scored
- unresolved critical disagreement remains after max rounds, producing `convergence:false`

### Consequences

Positive:

- Makes the 0.2 threshold concrete and council-specific.
- Detects whether the recommendation changed materially, not whether wording changed.
- Keeps current two-of-three agreement as the round-level first-pass signal.

Negative:

- Requires structured verdict data, not only markdown narrative.
- The formula is heuristic and needs parity tests before it should drive unattended expensive runs.

### Alternatives Considered

| Option | Outcome | Rejection Reason |
|--------|---------|------------------|
| Keep only two-of-three agreement | Rejected | Cannot compare round N with round N+1. |
| Use deep-review severity ratio | Rejected | Council outputs are option judgments, not P0/P1/P2 defects. |
| Use deep-research newInfoRatio | Rejected | Council convergence is decision stability, not discovery novelty. |
| Structural markdown diff | Rejected | Overweights prose churn and underweights decision changes. |

### Evidence

- `.opencode/skills/deep-ai-council/SKILL.md:16` proposes default 0.20 on adjudicator-verdict stability.
- `.opencode/skills/deep-ai-council/SKILL.md:18` defines the semantic as per-topic Round-N -> Round-N+1 verdict deltas.
- `.opencode/skills/deep-ai-council/references/convergence_signals.md:21` defines current v1 convergence as two-of-three seats endorsing materially the same plan with no new high-severity critique.
- `.opencode/skills/deep-ai-council/references/convergence_signals.md:29` says max rounds without convergence should emit `convergence:false`, not fabricate success.
- `.opencode/skills/deep-review/SKILL.md:24` shows deep-review uses a different threshold semantic: weighted severity ratio.
- `.opencode/skills/deep-research/SKILL.md:29` shows deep-research uses newInfoRatio.

<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Cost Guard Defaults

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-23 |
| **Deciders** | Wave 5 E1 research agent |

### Context

Deep council multiplies cost by topics, rounds, and seats. The current council guidance caps seats at three and stages extra CLIs as additional rounds. Without defaults, `:auto` could accidentally run a broad multi-topic, multi-round deliberation.

### Decision

Set default cost guards:

- `max_rounds_per_topic = 3`
- `max_topics_per_session = 5`
- `saturation_threshold = 0.2`
- `seats_per_round = 3` by default, with `2` allowed for narrow topics

All are tunable via `/deep:ask-ai-council` setup answers, but `:auto` must surface the computed upper bound before dispatch:

```text
max_rounds = max_topics_per_session * max_rounds_per_topic
max_seat_outputs = max_topics_per_session * max_rounds_per_topic * seats_per_round
default upper bound = 5 * 3 * 3 = 45 seat outputs
```

The default run should stop earlier on stable verdict deltas and should not eagerly consume the full upper bound.

### Consequences

Positive:

- Bounds unattended `:auto` behavior.
- Aligns with existing max-three seat guidance.
- Gives packet authors predictable downstream phase tests.

Negative:

- A complex architecture session may need explicit override.
- The upper bound is still expensive if all topics use all rounds.

### Alternatives Considered

| Option | Outcome | Rejection Reason |
|--------|---------|------------------|
| `max_rounds_per_topic = 5` | Rejected | Too costly for default and weakens LEAF budget discipline. |
| `max_topics_per_session = 10` | Rejected | Turns council into project management rather than scoped deliberation. |
| `saturation_threshold = 0.1` | Rejected | Imports deep-review intuition and likely over-runs opinion synthesis. |
| No defaults | Rejected | Unsafe for `:auto` and impossible to test consistently. |

### Evidence

- `.opencode/skills/deep-ai-council/references/seat_diversity_patterns.md:18` says each round uses at most three seats.
- `.opencode/skills/deep-ai-council/references/seat_diversity_patterns.md:166` sets the strategy count guidance, with three as default and maximum.
- `.opencode/skills/deep-ai-council/SKILL.md:34` states additional CLIs are multiple rounds, which multiplies cost.
- `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js:30` already defaults max rounds to 3 in current persistence config.
- `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/research.md:83` flags threshold-default divergence as dangerous for operators.
- `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/research.md:223` says cost drivers are executor-specific and threshold-driven.

<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Findings-Registry Parity Contract

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-23 |
| **Deciders** | Wave 5 E1 research agent |

### Context

Deep-review and deep-research both reduce raw iteration output into a registry artifact. Deep-review also has a canonical `content_hash` dedup scheme. Deep-council needs a session-wide findings registry so later topics can consume earlier findings as priors without rereading every seat artifact.

### Decision

Create `ai-council/council-findings-registry.json` as reducer-owned session state. It must use a canonical fingerprint field compatible with sibling parity tests:

```json
{
  "schema_version": "1.0",
  "session_id": "council-session-2026-05-23",
  "findings": [
    {
      "fingerprint": "council:runtime-boundary:extend-deep-loop-runtime",
      "content_hash": "sha256:<hash>",
      "topic_id": "topic-001-runtime-boundary",
      "round_id": "round-002",
      "finding_type": "decision-prior",
      "claim": "Extend deep-loop-runtime with council primitives; do not create a peer runtime.",
      "stance": "support",
      "confidence": 0.82,
      "source_artifacts": [
        "ai-council/topics/topic-001-runtime-boundary/rounds/round-002/deliberation.md"
      ],
      "introduced_at": "2026-05-23T09:30:00Z",
      "last_seen_at": "2026-05-23T09:30:00Z",
      "superseded_by": null
    }
  ],
  "priors_by_topic": {
    "topic-002-convergence": [
      "council:runtime-boundary:extend-deep-loop-runtime"
    ]
  }
}
```

Canonical fingerprint format:

```text
council:{topic_slug}:{claim_slug}
```

Canonical content hash:

```text
sha256(topic_id + "\u001f" + finding_type + "\u001f" + normalized_claim_120chars)
```

Cross-topic priors use registry fingerprints, not copied prose. A new topic receives a compact "Prior Findings" block containing fingerprint, claim, stance, confidence, and source artifact path.

### Consequences

Positive:

- Preserves sibling parity: reducer-owned registry, canonical hash, source artifacts, and dedup.
- Supports cross-topic priors without bloating prompts.
- Avoids confusing deep-research's `findings-registry.json` by using a council-prefixed filename.

Negative:

- Requires a reducer or persistence update beyond the current markdown parser.
- Requires parity tests to prove registry/drift behavior across deep-review, deep-research, and deep-ai-council.

### Alternatives Considered

| Option | Outcome | Rejection Reason |
|--------|---------|------------------|
| Reuse `findings-registry.json` name | Rejected | Packet 130 flags unprefixed naming overlap as confusing. |
| Store priors only in `session-report.md` | Rejected | Harder to dedup and machine-read. |
| Reuse deep-review's exact hash fields | Rejected | Council findings are topic/claim-based, not file/line defect-based. |

### Evidence

- `.opencode/skills/deep-review/SKILL.md:512` defines deep-review's primary `content_hash` formula.
- `.opencode/skills/deep-review/SKILL.md:524` says cross-iteration duplicate hashes collapse to one entry with dimensions merged.
- `.opencode/skills/deep-review/SKILL.md:530` requires every JSONL finding detail to include `content_hash`.
- `.opencode/skills/deep-research/SKILL.md:265` lists `deep-research-findings-registry.json` as a canonical state file.
- `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/research.md:78` flags findings-registry naming overlap as confusing.
- `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/research.md:251` defines five parity invariants that downstream tests must preserve.

<!-- /ANCHOR:adr-005 -->
