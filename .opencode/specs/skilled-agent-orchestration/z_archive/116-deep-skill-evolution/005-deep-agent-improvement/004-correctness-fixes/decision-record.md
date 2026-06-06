---
title: "Decision Record: Packet 124 deep-agent-improvement correctness fixes"
description: "ADR-001 for typed profile errors, null scoring, and runtime mirror sync flagging."
trigger_phrases:
  - "packet 124 ADR"
  - "DAI ADR-001"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/004-correctness-fixes"
    recent_action: "Accepted ADR-001 for packet 124 correctness policies."
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    next_safe_action: "Run strict validation after metadata refresh."
---
# Decision Record: Packet 124 deep-agent-improvement correctness fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Correctness Taxonomy, Null Scoring, and Mirror Sync Flagging

### Metadata

| Field | Value |
| --- | --- |
| Status | Accepted |
| Date | 2026-05-23 |
| Decider | Codex |
| Scope | Packet 124 |

<!-- ANCHOR:adr-001-context -->
### Context

Packet 123 identified three correctness decisions that needed explicit policy before implementation:

- DAI-009: profile generation did not distinguish missing files, parse failures, and script crashes.
- DAI-010: dimensions with zero checks returned a perfect score and `maxPossible: 0`.
- DAI-021: promotion can affect agent definitions while runtime mirrors across `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/` may drift.

The fixes must preserve existing public function signatures and avoid touching sibling skills.

<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Use a local typed error taxonomy in `deep-agent-improvement`:

| Error Type | Meaning | Exit Code |
| --- | --- | ---: |
| `FILE_NOT_FOUND` | Required profile-generation input is absent. | 3 |
| `PARSE_ERROR` | Profile output or profile-building data cannot be parsed into the expected structure. | 4 |
| `SCRIPT_CRASH` | Child script fails for any other unexpected reason. | 1 |

Use explicit null scoring for dimensions that have no checks. A dimension with zero checks emits `score: null`, `maxPossible: 0`, and is listed in `unscoredDimensions`. A candidate with any unscored dimension receives `recommendation: "needs-improvement"` rather than being treated as promotable.

Add an opt-in promotion-path mirror sync flag for packet 124:

- CLI: `--require-runtime-mirrors=true`
- Env: `DEEP_AGENT_IMPROVEMENT_REQUIRE_RUNTIME_MIRRORS=1`
- Config: `promotion.requireRuntimeMirrors: true`

When enabled, promotion aborts if any of the four runtime agent paths are missing. Full mirror write/sync implementation remains packet 127.

<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives

| Alternative | Rejected Because |
| --- | --- |
| Keep returning null from child scripts | Repeats DAI-009 and hides root cause from operators. |
| Reuse `deep-loop-runtime` helper directly | Violates packet scope by coupling to a sibling skill implementation. |
| Throw on zero-check dimensions | Produces no score artifact, making dashboards and operators lose partial evidence. |
| Treat zero-check dimensions as 0 | Over-penalizes dynamic profiles where one extraction family is legitimately absent. |
| Make runtime mirror sync mandatory in packet 124 | Full implementation belongs to packet 127 and would exceed current scope. |

<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

Positive:

- Operators get machine-readable failure classes.
- Scoring no longer fabricates perfect scores.
- Promotion has an early opt-in drift abort without pretending packet 127 is complete.
- The helper stays local to the target skill.

Negative:

- Downstream consumers must tolerate `score: null` for unscored dimensions.
- The mirror sync mechanism is a flag, not a full runtime parity solution.
- `PARSE_ERROR` is currently most visible from scorer child-output parsing; future profile parser hardening can add more parse sites.

<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five-Checks

| Check | Result | Evidence |
| --- | --- | --- |
| Simplicity | PASS | One small helper plus localized callers. |
| Correctness | PASS | Distinguishes failure types and prevents false-perfect scores. |
| Scope | PASS | Does not modify sibling skills or downstream packet folders. |
| Maintainability | PASS | Error taxonomy and mirror TODO are explicit. |
| Verifiability | PASS | Syntax checks, smoke tests, alignment, and strict validation cover the change. |

<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Impl

Implementation files:

- `.opencode/skills/deep-agent-improvement/scripts/lib/typed-errors.cjs`
- `.opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs`
- `.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs`
- `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs`

Verification:

- Missing profile input exits 3 and reports `FILE_NOT_FOUND`.
- Real target scoring still returns a numeric score when all dimensions are populated.
- Promotion mirror checking is inert unless the flag/env/config is enabled.

<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->
