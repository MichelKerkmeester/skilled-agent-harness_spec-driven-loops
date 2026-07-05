---
title: "Decision Record: Multi-AI Council Persistence"
description: "ADRs for packet 089: helper language choice, schema format, §17 placement, validator policy."
trigger_phrases:
  - "multi-ai-council persistence adr"
  - "packet 089 decision record"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/089-multi-ai-council-persistence"
    last_updated_at: "2026-05-06T16:00:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored 4 ADRs reflecting deep-research §13 verdicts"
    next_safe_action: "Land Phase 2A implementation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:442140abdcad7e4013f6cbc9d2609c64a7e1f03353397abf77ccc45cfd8b95bc"
      session_id: "decision-089-author"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Decision Record: Multi-AI Council Persistence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/089-multi-ai-council-persistence` |
| **Date** | 2026-05-06 |
| **Status** | Accepted (research-grounded) |
| **Scope** | Implementation choices for packet 081 P0 scope |
| **Source** | Packet 080 deep-research (research.md §5, §13) |

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Helper Language — Node CJS

<!-- ANCHOR:adr-001-context -->
### Context

The persistence helper needs to parse markdown council reports and write artifacts. Three viable language choices: bash (matches `validate.sh`), Node CJS (matches `reduce-state.cjs`), Node TS (matches some newer scripts).
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**Node CJS** at `.opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs`.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives

- **Bash** rejected: markdown parsing in bash is fragile; existing reducers (deep-research, deep-review) standardized on CJS for parser-heavy work.
- **Node TS** rejected: requires `--experimental-strip-types` or tsx loader; CJS is already proven pattern for sibling reducers; consistency wins over modernity here.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- Pattern symmetry with `deep-research/scripts/reduce-state.cjs` and `deep-review/scripts/reduce-state.cjs`.
- Parser exports are testable from vitest without TypeScript build step.
- No new build dependency.
- Future TS migration possible if other scripts move; not a blocker.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

- **Reversibility**: High — language change is `mv .cjs .ts` + import adjustments.
- **Blast radius**: Low — single helper file; no dependents in v1.
- **Migration cost**: None.
- **Operational risk**: Low — Node CJS is already the de facto convention.
- **Documentation cost**: Low — referenced in §17 and output-schema.md.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Pointer

See `plan.md` Phase 2A T202.
<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

---

## ADR-002: §8 OUTPUT FORMAT shared schema — Markdown not JSON Schema

### Context

§8 OUTPUT FORMAT must be a single source of truth referenced by both the agent body and the helper parser. Three formats considered: JSON Schema, vitest fixture, plain markdown contract.

### Decision

**Plain markdown contract** at `.opencode/skills/system-spec-kit/references/multi-ai-council/output-schema.md`.

### Alternatives

- **JSON Schema** rejected: too rigid for evolving §8 prose; council reports are markdown narratives, not structured data; schema mismatch between report format (prose) and validation format (JSON) creates friction.
- **Vitest fixture as authority** rejected: fixtures are executable examples, not contracts; promoting them to authority makes test edits invariant changes.
- **JSON-schema-on-yaml-frontmatter** rejected: §8 is body content, not frontmatter.

### Consequences

- output-schema.md is human-readable + maintenance-light.
- Helper parser cites it; agent body §8 cites it.
- Schema changes require lockstep update of both citations (called out in the doc itself).
- Fixtures under `scripts/tests/fixtures/multi-ai-council/` serve as executable examples, NOT as authority.

### Implementation Pointer

See `plan.md` Phase 2A T203 + spec.md §3 file-table row for output-schema.md.

---

## ADR-003: §17 Placement — Agent Body, Not Reference-Only

### Context

The Caller Persistence Protocol must be discoverable by every dispatcher (Top-level Task, @orchestrate, /speckit:* YAMLs, CLI-skill playbooks). Two placement options: (a) agent body §17 (normative); (b) reference-only doc.

### Decision

**Agent body §17** in `.opencode/agents/multi-ai-council.md` (and 3 mirrors). Reference-only placement REJECTED.

### Alternatives

- **Reference-only** (a side doc under references/) rejected: lacks normative weight; dispatchers reading the agent body would not see it; would require every caller to read references/ to know about the helper.
- **Hybrid** (short §17 in body + long examples in reference) accepted as IMPLEMENTATION DETAIL: §17 stays short (<50 LOC); long examples can move to reference if body crosses ADR-001 spill threshold.

### Consequences

- Agent body grows by ~30-50 LOC × 4 runtimes (within 750-LOC budget).
- 4-runtime mirror sync is mandatory (parity test catches drift).
- §17 is the FIRST place a dispatcher looks — high discoverability.
- Cross-link from §13 Invocation Contract to §17 keeps the protocol coherent.

### Implementation Pointer

See `plan.md` Phase 2B T211-T215.

---

## ADR-004: Validator Policy — Hardened Regression Test, NOT Strict Enforcement

### Context

Packet 080 ADR-004 said: keep `validate.sh --strict` free-form for `ai-council/`. Packet 080 added a basic regression test (2 cases) confirming the validator does not flag `ai-council/` as unknown. Question for packet 089: should the validator now enforce required `ai-council/` files (e.g., `council-report.md` must exist after a complete run)?

### Decision

**No strict enforcement.** Continue treating `ai-council/` as free-form. Replace the existing regression test's partial-layout assertions with a synthetic spec folder + full `validate.sh --strict` invocation. Optionally add an opt-in advisory check (NOT strict) in a follow-on packet.

### Alternatives

- **Strict enforcement of council-report.md presence** rejected: would fail in-flight council runs (where round 1 has not yet converged); strict mode turns warnings into errors and would break iteration semantics.
- **No regression test at all** rejected: packet 080 already shipped a basic test; regressing test coverage makes future drift more likely.
- **Opt-in advisory check now** deferred: scope creep into packet 082+; helper validation logic is sufficient for v1.

### Consequences

- Validator behavior unchanged for unaffected packets.
- Regression test now exercises full `validate.sh --strict` with a synthetic packet (vs partial-layout flag-checking only).
- Opt-in advisory check stays in packet 082+ scope.

### Implementation Pointer

See `plan.md` Phase 2C T221-T222.

---

## Cross-References

- packet 080 deep-research: `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/research/research.md` §5, §13
- packet 080 ADR-001 (lightweight bound): preserved per Q10 verdict
- packet 080 ADR-004 (validator policy): preserved here
- spec.md §3 Scope and §6 Risks
- plan.md §3 Architecture and §4 Phases
