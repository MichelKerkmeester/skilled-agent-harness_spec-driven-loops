---
title: "Implementation Plan: Parent-skill native invocability"
description: "A phased, research-first plan to make parent-skill nested mode packets natively reachable by the operator without regressing the one-graph-metadata single-identity invariant. Phase 1 probes runtime extensibility, prototypes the least-bad mechanism, and produces a decision record; Phase 2+ implements the chosen mechanism and is gated."
trigger_phrases:
  - "parent skill invocability plan"
  - "skill discovery extensibility probe"
  - "parent mode mechanism research"
  - "native invocation phased plan"
  - "runtime skill resolution research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Drafted phased research-first plan; mechanism choice deferred to Phase 1"
    next_safe_action: "Await user gate; then probe OpenCode and Claude-Code skill discovery"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md"
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-155-parent-skill-native-invocability"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which mechanism (A/B/C/D) best fits after the runtime probe?"
    answered_questions: []
---
# Implementation Plan: Parent-skill native invocability

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Documentation now; later surfaces are TypeScript (advisor), Python (advisor), and YAML command assets |
| **Framework** | OpenCode / Claude-Code runtime skill discovery; Skill Advisor |
| **Storage** | None |
| **Testing** | Routing-parity and drift-guard vitest fixtures; manual `Skill()` probes |

### Overview
This plan is research-first. Phase 1 confirms whether the runtime skill-discovery surface is extensible at all, prototypes the least-bad mechanism, and produces a decision record choosing among the four mechanism options. Phase 2 and beyond implement the chosen mechanism generically for parent skills and are gated on Phase 1. No mechanism is pre-decided.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parent skill with nested mode packets: one advisor-routable hub `SKILL.md`, one declarative `mode-registry.json`, exactly one hub `graph-metadata.json`, N self-contained mode packets with zero `graph-metadata.json`, and a non-discoverable `shared/` helper layer.

### Key Components
- **Runtime skill discovery**: registers top-level `.opencode/skills/*/` directories by their `SKILL.md` name frontmatter. Nested packet `SKILL.md` files are invisible to the `Skill` tool even though they carry a name.
- **Skill Advisor discovery**: recursively finds every `graph-metadata.json` and keys identity on its presence. The build throws when a discovered file's `skill_id` does not equal its folder.
- **Mode registry**: the declarative source of truth that routers, commands, and tests read. It carries the discriminator and an `advisorRouting` projection with a `routingClass`.

### Data Flow
An operator request currently reaches a parent mode through a `/deep:*` command or an agent type, not through `Skill()`. The `Skill` tool resolves only top-level skill directories, so a nested mode name is unknown to it. This plan studies how to add a native operator path to a mode while keeping one advisor identity per parent skill.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This packet is plan-only, so no surface changes here. The table records the surfaces a Phase 2+ mechanism would touch so the research can scope them. Actions are stated as not-a-consumer for now because nothing is being changed yet.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Runtime skill discovery (OpenCode / Claude-Code binary) | Registers top-level skill dirs by SKILL.md name | not a consumer (plan-only); option D would require runtime change | Phase 1 probe of the binary's skill resolution |
| `mode-registry.json` per parent skill | Declarative discriminator and `advisorRouting` source of truth | not a consumer (plan-only); a mechanism may add a routing field | `rg -n "advisorRouting|routingClass" .opencode/skills/deep-loop-workflows/mode-registry.json` |
| Per-mode `/deep:*` command assets | Current command-bridge invocation path | not a consumer (plan-only); option A would add per-mode commands | Inspect command YAML assets under the command surface |
| Per-mode agent types | Current agent invocation path | not a consumer (plan-only); option B would add per-mode agents | Inspect the runtime agent directory for the active profile |
| Advisor projection maps (Python and TypeScript) | Hardcoded maps guarded by a drift-guard test | not a consumer (plan-only); a mechanism must keep maps and registry in sync | `rg -n "DEEP_ROUTING_MODE_BY_KEY|DEEP_MODE_BY_CANONICAL" .opencode/skills/system-skill-advisor` |

Required inventories (for Phase 1 research, not run here):
- Same-class producers: `rg -n "graph-metadata.json" .opencode/skills` to enumerate skill identities.
- Consumers of the registry projection: `rg -n "advisorRouting|routingClass|packetSkillName" .opencode/skills`.
- Matrix axes: list each mechanism option against each invariant before any implementation.
- Algorithm invariant: exactly one `graph-metadata.json` per parent skill, `skill_id == folder`, zero below it.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research and design (gated entry; produces the decision)
- [ ] Probe whether the runtime skill-discovery is extensible at all in OpenCode and in Claude-Code (any hook, config entry, or manifest the binary honors).
- [ ] Confirm the no-in-repo-extension-point finding: `opencode.json` has no skills config and `.opencode/plugin/` is empty.
- [ ] Prototype the least-bad mechanism against the one-`graph-metadata.json` invariant.
- [ ] Produce `decision-record.md` selecting among options A through D with cited evidence and an explicit fallback.

### Phase 2: Implement the chosen mechanism (gated on Phase 1)
- [ ] Implement the chosen mechanism generically for parent skills.
- [ ] Keep exactly one advisor identity per parent skill.
- [ ] Keep routing-parity and drift-guard fixtures green or migrate them deliberately.

### Phase 3: Verification (gated on Phase 2)
- [ ] Confirm a parent skill's modes are natively reachable by the operator.
- [ ] Confirm the single-identity invariant is intact.
- [ ] Confirm the `sk-design` Model-A conversion can adopt the mechanism without regression.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Advisor projection maps equal registry projection | vitest drift-guard fixture |
| Integration | Routing-parity for the single skill-to-mode mapping | routing-parity vitest fixtures |
| Manual | Operator-side `Skill()` or chosen-mechanism reachability of a mode | Runtime probe |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Runtime skill-discovery surface | External | Red | Option D (true native resolution) may be impossible in-repo; fall back to A/B or C |
| Parent-skill pattern reference | Internal | Green | Defines the invariant the mechanism must respect |
| Spec 150 pattern and invariant | Internal | Green | This packet extends it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: This packet is plan-only, so the only rollback need is to discard the authored documents.
- **Procedure**: Delete the `155-parent-skill-native-invocability/` folder. No source, runtime, or configuration changed, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Research + decision) ──► Phase 2 (Implement) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Research + decision | User gate | Implement |
| Implement | Research + decision | Verify |
| Verify | Implement | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Research + decision | High | Bounded research sweep plus a prototype and a decision record |
| Implement | Med | Depends entirely on the chosen mechanism |
| Verification | Low | Fixture re-run plus a manual reachability probe |
| **Total** | | **Dominated by the research phase; implement effort is mechanism-dependent** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — not applicable; plan-only
- [ ] Feature flag configured — not applicable; plan-only
- [ ] Monitoring alerts set — not applicable; plan-only

### Rollback Procedure
1. Discard the authored documents in the packet folder.
2. No code or configuration was changed, so no redeploy or revert is needed.
3. Confirm no other packet referenced the deleted folder.
4. No stakeholders to notify; nothing user-facing changed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Phase 1            │────►│   Phase 2        │────►│   Phase 3        │
│   Research + decide  │     │   Implement      │     │   Verify         │
└──────────────────────┘     └──────────────────┘     └──────────────────┘
        ▲
   user gate
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Runtime probe | User gate | Extensibility verdict | Mechanism prototype |
| Mechanism prototype | Runtime probe | Least-bad candidate | Decision record |
| Decision record | Mechanism prototype | Chosen mechanism | Phase 2 |
| Phase 2 implementation | Decision record | Native invocation path | Phase 3 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Runtime extensibility probe** - research-bounded - CRITICAL
2. **Mechanism prototype against the invariant** - research-bounded - CRITICAL
3. **Decision record selecting A through D** - research-bounded - CRITICAL

**Total Critical Path**: The research phase gates everything; implementation effort is mechanism-dependent.

**Parallel Opportunities**:
- The OpenCode probe and the Claude-Code probe can run side by side.
- The tradeoff write-up for options A through D can be drafted while the prototype runs.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Runtime extensibility verdict | A clear yes or no on in-repo extensibility for option D | Phase 1 |
| M2 | Mechanism decided | Decision record selects one option with cited evidence | Phase 1 |
| M3 | Modes natively reachable | A parent skill mode reachable with the invariant intact | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Mechanism for native parent-skill mode invocation

**Status**: Proposed

**Context**: Nested mode packets are not reachable via the `Skill` tool, and the one-`graph-metadata.json` invariant keeps them advisor-invisible by construction. The mechanism choice is deferred to Phase 1 research.

**Decision**: Deferred. The full options and tradeoffs live in `decision-record.md` and are pending the Phase 1 runtime probe and prototype.

**Consequences**:
- Keeping the choice open avoids pre-deciding a mechanism that the runtime may not support.
- The cost is one research phase before any implementation.

**Alternatives Rejected**:
- Pre-deciding the shim path now: rejected because it would re-introduce N skill identities without first checking whether a lower-cost mechanism exists.
