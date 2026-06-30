---
title: "Decision Record: Phase 8: nested-parent-conversion"
description: "Two ADRs: (1) the 002 Model-B to Model-A reversal converting the flat sk-design family into one nested-packet parent skill, and (2) the invocation mechanism (invokable-hub routing) that lets the conversion avoid the deep-loop-specific advisor merged-identity layer."
trigger_phrases:
  - "sk-design model A reversal decision"
  - "sk-design invokable hub decision"
  - "advisor merged identity avoided"
  - "sk-design nested parent ADR"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/008-nested-parent-conversion"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded ADR-001 reversal and ADR-002 invocation mechanism"
    next_safe_action: "Operator approval of both ADRs before any build"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "../002-architecture-decision/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design/008-sk-design-parent/008-nested-parent-conversion"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 8: nested-parent-conversion

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- These ADRs bind the direction and mechanism for a FUTURE, operator-approved conversion.
No conversion is executed in this plan-only packet. -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reverse 002 Model-B to Model-A (one nested-packet parent skill)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-26 |
| **Deciders** | Operator, Claude (planning) |
| **Reverses** | `../002-architecture-decision/` (Model B: umbrella + flat siblings) |

---

<!-- ANCHOR:adr-001-context -->
### Context

Phase 002 locked the family structure as Model B: `sk-design` is a thin umbrella/router and the design sub-skills (`sk-design-interface`, `sk-design-foundations`, `sk-design-motion`, `sk-design-audit`, `sk-design-md-generator`) stay independent top-level skills the advisor routes to directly. Model B was chosen at 002 specifically to avoid the conversion blast radius of nesting and to accommodate heterogeneous runtimes (the `md-generator` Playwright backend vs pure-judgment interface) with zero reference rewrites. Phases 003-007 built and deep-reviewed all six skills under that model. The operator now wants the family to present as a true single identity, one advisor-routable `sk-design` that internally dispatches to focused modes, the same shape as `deep-loop-workflows`. Under Model B each flat sibling carries its own `graph-metadata.json`, so the advisor discovers six design identities, not one.

### Constraints

- The five-member taxonomy is frozen since 002; this decision changes the structural model and invocation, not the member set.
- The one hard invariant from `parent_skills_nested_packets.md` must hold: exactly one `graph-metadata.json` per parent (the hub's, `skill_id == folder`), zero in any packet or `shared/`.
- The conversion blast radius 002 avoided is now accepted as the cost of the single-identity goal, and must be staged and rolled back safely.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Reverse Model B and adopt Model A - convert the flat family into one nested-packet parent skill.

**How it works**: `sk-design/` becomes the hub `SKILL.md` (routing-only) + `mode-registry.json` + exactly one `graph-metadata.json` + five nested mode packets (`interface`, `foundations`, `motion`, `audit`, `md-generator`) + `shared/`. The five current flat skills become the packets (content moved verbatim, internal paths repointed); their five per-skill `graph-metadata.json` files are deleted, leaving one hub `graph-metadata.json`. Any folder-vs-packet-name mismatch is recorded via `packetSkillName` in the registry; `md-generator`'s Playwright backend is a packet whose `backendKind` differs, recorded rather than flattened.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Model A - one nested-packet parent (Chosen)** | Single advisor identity (the goal); matches `deep-loop-workflows`; one graph-metadata; self-contained modes | Irreversible structural move; ~72 rewires; reverses a binding decision | 9/10 |
| Keep Model B (umbrella + flat siblings) | Already built + deep-reviewed; zero rewrites; runtimes isolated | Six advisor identities - fails the single-identity goal | 4/10 |
| Partial nest (fold only some skills) | Smaller blast radius | Mixed model; still multiple identities; no clean invariant | 3/10 |

**Why this one**: Only Model A delivers the single advisor identity the operator wants; Model B's defining property (independent siblings) is exactly what blocks it, and a partial nest keeps multiple identities plus a mixed mental model.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The advisor discovers exactly one design identity; discovery and routing match the `deep-loop-workflows` model.
- The one-graph-metadata invariant gives a single, machine-checkable identity keystone.
- Each mode keeps its own contract in its packet; the hub stays logic-free.

**What it costs**:
- The structural move (nesting content + deleting five child graph-metadata) is irreversible mid-flight. Mitigation: isolate Stage 2 in a worktree or behind a committed recovery baseline.
- ~72 `.opencode/skills/` cross-refs must be rewired to `sk-design` (+ mode/packet path). Mitigation: rewire from an enumerated list and re-grep for residuals in Stage 5.
- A binding decision (002) is reversed. Mitigation: this ADR records it; 002 stays `complete` and 008 is a distinct row.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Second `graph-metadata.json` left in a packet | H | Stage 2 deletes all five; Stage 5 asserts exactly one remains |
| Missed flat-name reference | M | Enumerated rewire list + residual re-grep before validation |
| Mid-flight corruption of the family | H | Worktree / committed baseline; additive-first ordering |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator's single-identity goal cannot be met by Model B's six identities |
| 2 | **Beyond Local Maxima?** | PASS | Model B, partial nest, and Model A were each scored before choosing |
| 3 | **Sufficient?** | PASS | Model A is the simplest structure that yields one advisor identity with self-contained modes |
| 4 | **Fits Goal?** | PASS | Single-identity nested parent like `deep-loop-workflows` is exactly the stated goal |
| 5 | **Open Horizons?** | PASS | The hub + registry pattern extends to new modes without re-litigating the structure |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes** (all FUTURE, not in this packet):
- `.opencode/skills/sk-design/` becomes the hub + registry + one graph-metadata + nested packets + shared/.
- `.opencode/skills/sk-design-*/` (five flat skills) become nested packets; their graph-metadata deleted.
- ~72 `.opencode/skills/**` files + `CLAUDE.md`/`AGENTS.md` (2) rewired to `sk-design`.
- Skill Advisor + skill-graph rebuilt and validated (no new maps, no new drift-guard).

**Blast-radius evidence**: `.opencode/specs/` mentions 434 (historical, left as-is); `.opencode/skills/` real cross-refs ~72 (rewire); commands/agents 0; root config 2; `mcp-open-design` 0 flat-name matches (minimal/no pairing rewire).

**How to roll back**: Additive-first. Stage 1 (scaffold) is fully revertible. The irreversible part is Stage 2 (the structural move); run it only behind a recovery baseline (worktree or a committed pre-move tag) so the flat family can be restored wholesale if a gate fails.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Invokable-hub routing - advisor merged-identity deliberately avoided

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-26 |
| **Deciders** | Operator, Claude (planning) |
| **Relates to** | 155 (native invocability - research satisfied by this mechanism) |

---

<!-- ANCHOR:adr-002-context -->
### Context

Once the modes become nested packets (ADR-001), they carry no `graph-metadata.json` and are therefore advisor-invisible by construction (discovery keys only on `graph-metadata.json`). The open question 155 raised was: how are the modes reached if they are not independently discoverable? The `deep-loop-workflows` precedent reaches some modes through a deep-loop-specific advisor merged-identity projection (`MERGED_DEEP_SKILL_ID` + `DEEP_MODE_BY_CANONICAL`, plus a Python `nl_ID`/`nl` map and a scoped drift-guard test). `parent_skills_nested_packets.md` warns that this merged-identity layer is not generic - a second parent skill would need its own analog and its own drift-guard.

### Constraints

- The modes must be reachable after they stop being independently discoverable.
- Adding a second merged-identity layer means new Python + TS projection maps and a new CI drift-guard scoped to `sk-design`'s registry - a real maintenance and coupling cost.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Modes are reached through the invokable parent hub, not via `Skill(<mode>)`. `Skill(sk-design)` is invocable because the hub is a top-level skill carrying the one `graph-metadata.json`. When invoked (optionally with args such as `"motion: <request>"`), the hub's smart router classifies the request and loads the matching nested packet (Reads `sk-design/<mode>/SKILL.md`). No advisor merged-identity layer is added.

**How it works**: The advisor routes only to `sk-design` (one identity, hub `trigger_phrases` aggregating all mode keywords); the hub picks the mode internally. Because routing terminates at the single identity and the mode selection happens inside the hub, the deep-loop-specific merged-identity extension is unnecessary: no new Python `nl_ID`/`nl` map, no new TS analog, no new drift-guard. Optional `/design:*` commands + design-mode agents MAY be added later, but the primary invocation is `Skill(sk-design[, args])` + hub routing. This settles 155: its research question is answered by the hub-routing approach.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Invokable hub routes to modes; no merged-identity (Chosen)** | One advisor identity; hub picks the mode; avoids new Python/TS maps + drift-guard | Hub must carry a competent smart router and aggregate all mode trigger phrases | 9/10 |
| `Skill(<mode>)` direct invocation | Direct per-mode entry | Impossible - nested packets carry no graph-metadata, so they are not discoverable/invocable; would re-add identities and break the invariant | 2/10 |
| Build a second advisor merged-identity layer (deep-loop style) | Proven precedent; per-mode advisor routing | New Python + TS maps + a new scoped drift-guard; cross-skill coupling the pattern doc warns against; unnecessary given hub routing | 4/10 |

**Why this one**: Hub routing reaches every mode while keeping a single advisor identity and the one-graph-metadata invariant intact, and it sidesteps the non-generic merged-identity machinery entirely. `Skill(<mode>)` is simply unavailable once modes are nested; a second merged-identity layer buys per-mode routing the operator did not ask for at real cost.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Zero advisor code changes for routing identity: no new `nl_ID`/`nl` (Python), no TS analog, no new drift-guard to maintain.
- The invariant and the single-identity goal reinforce each other: one graph-metadata, one advisor identity, hub-internal mode selection.
- 155 is unblocked: the invocation mechanism is decided.

**What it costs**:
- The hub `SKILL.md` must hold a competent smart router and aggregate all mode keywords so design queries still score highly. Mitigation: model the hub on `deep-loop-workflows/SKILL.md` section 2 and aggregate keywords in hub frontmatter + `graph-metadata.json` `derived.trigger_phrases`.
- No per-mode advisor entry points. Mitigation: acceptable and intended; per-mode entry is available via optional `/design:*` commands if later desired.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hub trigger phrases too thin → design query scores < 0.8 | M | Aggregate all mode keywords; Stage 5 routing fixture asserts ≥0.8 |
| A future executor builds the merged-identity layer anyway | M | This ADR records the avoidance; Stage 5 verifies routing, not a merged-identity map |
| Hub router misclassifies a request to the wrong mode | M | Stage 5 routing fixtures assert hub-to-mode selection for representative requests |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Nested modes are not independently discoverable, so a reach mechanism is required |
| 2 | **Beyond Local Maxima?** | PASS | Hub routing, `Skill(<mode>)`, and a second merged-identity layer were each scored |
| 3 | **Sufficient?** | PASS | Hub routing reaches every mode with no new advisor code |
| 4 | **Fits Goal?** | PASS | Keeps the single advisor identity that ADR-001 establishes |
| 5 | **Open Horizons?** | PASS | Optional commands/agents remain available without changing the primary mechanism |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes** (all FUTURE, not in this packet):
- `sk-design/SKILL.md` (the invokable hub + smart router + aggregated trigger phrases).
- `sk-design/mode-registry.json` (the routing contract; `advisorRouting.routingClass = metadata` for the modes since there is no per-mode advisor map).
- `sk-design/graph-metadata.json` (the single identity; `derived.trigger_phrases` aggregate all modes).
- Skill Advisor + skill-graph: rebuild + validate only (no new projection maps, no new drift-guard).

**How to roll back**: The advisor change is a rebuild only; reverting the structure (ADR-001 rollback) restores the prior advisor state. No merged-identity code is added, so there is none to remove.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!--
Level 3 Decision Record: One ADR per major decision.
Write in human voice: active, direct, specific.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
