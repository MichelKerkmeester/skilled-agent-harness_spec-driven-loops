---
title: "Implementation Plan: Parent-skill native invocability"
description: "Decision-complete plan record for parent-skill native invocability. ADR-001 is Accepted: Option E invokable-hub routing is the chosen mechanism. This packet has no source build; downstream alignment carries NFR-S01 and runtime validation."
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
    packet_pointer: "skilled-agent-orchestration/119-parent-skill-native-invocability/002-invocability-mechanism"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled plan to ADR-001 Accepted: Option E chosen; no 002 source build"
    next_safe_action: "Use 003 to document hub union-grant semantics and finish deep-loop validation gates"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md"
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-155-parent-skill-native-invocability"
      parent_session_id: null
    completion_pct: 70
    open_questions:
      - "NFR-S01 remains unresolved in 002 and is carried to 002."
    answered_questions:
      - "Option E invokable-hub routing is accepted."
      - "Options A/B remain fallback complementary surfaces; no runtime enhancement is required."
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
This plan is now a decision-complete record. ADR-001 accepts Option E, invokable-hub routing: `Skill(<parent>)` loads the top-level parent hub, and the hub routes to the nested mode packet through its registry. No source build occurs in 002. The remaining downstream work is carried by phase 003, especially the NFR-S01 union-grant documentation and validation gates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met, except NFR-S01 carried to 002
- [ ] Tests passing where applicable; no source tests exist in 002
- [x] Docs updated (spec/plan/tasks/decision-record/checklist/implementation-summary)
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
An operator request can reach a parent mode through a `/deep:*` command, an agent type, or the accepted Option E path: invoke the top-level parent hub with `Skill(<parent>)` and let the hub route to the nested mode packet. The `Skill` tool still resolves only top-level skill directories, so direct `Skill(mode)` remains out of scope.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This packet is decision-only, so no source surface changes here. The table records how the accepted Option E mechanism relates to the surfaces a downstream implementation or alignment packet touches.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Runtime skill discovery (OpenCode / Claude-Code binary) | Registers top-level skill dirs by SKILL.md name | Not changed; Option E avoids a runtime enhancement | Parent hub remains top-level and invocable |
| `mode-registry.json` per parent skill | Declarative discriminator and routing source of truth | Downstream consumers use it for hub routing | `rg -n "packetSkillName|workflowMode" .opencode/skills/deep-loop-workflows/mode-registry.json` |
| Per-mode `/deep:*` command assets | Existing command-bridge invocation path | Retained as complementary fallback surface (Option A) | Commands continue to reach the same packets |
| Per-mode agent types | Existing agent invocation path | Retained as complementary fallback surface (Option B) | Agent definitions continue to reach the same packets |
| Advisor projection maps (Python and TypeScript) | Drift-guarded maps for advisor routing strength | Not required for Option E invocation; evaluated in 003 for deep-loop routing strength | Routing fixtures and advisor validation in 003 |

Required carry-forward checks:
- Preserve exactly one `graph-metadata.json` per parent skill, `skill_id == folder`, zero below it.
- Treat hub `allowed-tools` as the union the modes need unless runtime evidence proves narrower per-mode grants.
- Keep commands and agents as fallback surfaces, not competing implementations.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research and design (decision complete)
- [x] Frame options A through E against the one-`graph-metadata.json` invariant.
- [x] Accept Option E, invokable-hub routing, in `decision-record.md`.
- [x] Record commands and agents (A/B) as the fallback complementary surfaces.
- [ ] Carry NFR-S01 to phase 003 because phase 002 does not prove per-mode permission narrowing.

### Phase 2: Downstream alignment (owned by child packets)
- [ ] Apply Option E in downstream parent families as needed.
- [ ] Keep exactly one advisor identity per parent skill.
- [ ] Document or test any hub union-grant permission semantics before claiming NFR-S01 closure.

### Phase 3: Verification (downstream)
- [ ] Confirm a parent skill's modes are reachable through `Skill(<parent>)`.
- [ ] Confirm the single-identity invariant is intact.
- [ ] Confirm commands and agents continue to work as fallback surfaces.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Hub registry maps to the nested packets it loads | registry/drift fixtures in downstream packets |
| Integration | Single parent skill identity routes internally to the correct mode | routing-parity fixtures |
| Manual | Operator-side `Skill(<parent>)` reachability of a mode | Runtime probe in downstream packet |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Runtime skill-discovery surface | External | Amber | Option D remains out-of-repo; Option E avoids depending on it |
| Parent-skill pattern reference | Internal | Green | Defines the invariant the mechanism must respect |
| Spec 150 pattern and invariant | Internal | Green | This packet extends it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: ADR-001 must be revised.
- **Procedure**: Revert the authored phase 002 markdown docs to the prior decision state. No source, runtime, or configuration changed in 002, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Decision) ──► Phase 2 (Downstream alignment) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Decision | Phase 002 packet docs | Downstream alignment |
| Downstream alignment | Accepted Option E | Verify |
| Verify | Downstream alignment | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Decision | Med | Completed in ADR-001; no source build in 002 |
| Downstream alignment | Med | Depends on each parent family |
| Verification | Low | Fixture re-run plus a manual reachability probe |
| **Total** | | **Phase 002 is decision-complete; remaining effort lives downstream** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) - not applicable; no data changes in 002
- [ ] Feature flag configured - not applicable; no source changes in 002
- [ ] Monitoring alerts set - not applicable; no rollout in 002

### Rollback Procedure
1. Revert the authored phase 002 markdown docs.
2. No code or configuration was changed in 002, so no redeploy or revert is needed.
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
│   Phase 1            │────►│   Phase 2         │────►│   Phase 3        │
│   Decide Option E    │     │   Align downstream│     │   Verify         │
└──────────────────────┘     └──────────────────┘     └──────────────────┘
        ▲
   accepted ADR-001
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Decision record | Existing parent-hub evidence | Chosen mechanism | Downstream alignment |
| Commands/agents fallback | Existing A/B surfaces | Fallback path if hub invocation is insufficient | Downstream verification |
| NFR-S01 carry-forward | Hub union-grant reality | 002 documentation decision | Completion claim |
| Downstream implementation | ADR-001 | Native invocation path | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Decision record selecting A through E** - complete - CRITICAL
2. **NFR-S01 carry-forward to 002** - open - CRITICAL
3. **Downstream verification of hub routing** - downstream - CRITICAL

**Total Critical Path**: Phase 002 is decision-complete; completion now depends on phase 003 documenting the union-grant contract and closing validation gates.

**Parallel Opportunities**:
- Downstream parent families can adopt Option E while NFR-S01 evidence is gathered, as long as docs do not claim per-mode permission narrowing prematurely.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Mechanism decided | ADR-001 selects Option E with fallback surfaces | Phase 1 |
| M2 | NFR-S01 documented | 002 records the hub union-grant pattern | Phase 2 |
| M3 | Modes reachable through hub | A parent skill mode reachable with the invariant intact | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Mechanism for native parent-skill mode invocation

**Status**: Accepted

**Context**: Nested mode packets are not directly reachable via the `Skill` tool, and the one-`graph-metadata.json` invariant keeps them advisor-invisible by construction. The accepted path reaches them through the invocable parent hub.

**Decision**: Option E, invokable-hub routing, is accepted. `Skill(<parent>)` invokes the hub; the hub routes to the nested mode packet. Options A/B remain fallback complementary surfaces. No runtime enhancement or 002 source build is required.

**Consequences**:
- The parent hub stays the single advisor identity.
- The packet avoids runtime changes and shim identities.
- NFR-S01 remains carried to 002 because the hub `allowed-tools` are the union the modes need.

**Alternatives Rejected**:
- Thin shim skills: rejected because they re-introduce N skill identities.
- Runtime enhancement: not required for the accepted path and out of repo control.
