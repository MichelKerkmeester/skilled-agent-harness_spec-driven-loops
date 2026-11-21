---
title: "Feature Specification: Design authority for mcp-magicpath"
description: "Bind the mode to sk-design unconditionally under the design agent persona, reconcile a write-capable persona against a read-only transport, and land the changelog aggregation symlink the mode was missing."
trigger_phrases:
  - "magicpath design authority"
  - "magicpath sk-design pairing"
  - "magicpath design persona"
  - "changelog aggregation symlink"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Design authority for mcp-magicpath

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-playbook-and-verification |
| **Successor** | None |
| **Handoff Criteria** | Every MagicPath invocation loads the design authority before its first tool call, the persona's write capability is documented as withheld, and the mode appears in the changelog aggregation directory alongside its siblings |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the MagicPath tool bridge specification.

**Scope Boundary**: The mode's entry contract and the hub statements that contract makes untrue. The registered tool surface is not touched: no tool is added, removed, or renamed.

**Dependencies**:
- The packet authored by 003-skill-packet
- The hub registry and prose established by 004-hub-integration

**Deliverables**:
- An unconditional `sk-design` binding in the mode's entry contract, with a reference document carrying the full contract
- The design agent persona adopted, with its write capability explicitly withheld
- The hub prose corrected where one pairing was assumed for four transports, and `crossHubPairing` investigated then deliberately left empty (ADR-001)
- The `.opencode/changelog/mcp-tooling/mcp-magicpath` aggregation symlink, plus `mcp-notion` and `mcp-obsidian` under the ADR-004 scope amendment
- A decision record carrying the reversal and the amendment

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The packet declined to issue design judgment and said so plainly: "this packet is a read-only transport and issues no such verdict." That sentence is correct about ownership and wrong about what happens next.

Every surface `mcp-magicpath` can reach is a design surface. `get_theme` returns CSS variables and fonts. `inspect_component` returns a component's source. `search_components` ranks results. A caller who receives those facts and no judgment does not stop; they decide anyway, without the value scales, the interaction guidelines, the motion principles, or the WCAG review pass. The packet's refusal did not prevent a verdict. It only made the verdict unowned.

The gap is not hypothetical. A component built against this transport's evidence in this repository compiled, matched the supplied hex tokens exactly, and still failed on the thing that mattered: it visualised nothing about the concept it was built for. Token fidelity was verified; design judgment was never applied, because no skill was on the hook for it.

A second, smaller problem sits beside it. The mode is absent from `.opencode/changelog/mcp-tooling/`, where six sibling modes are symlinked to their packet-local changelog directories. Nothing breaks, but the one place a reader goes to see a hub member's release history does not list this member.

### Purpose

Give the judgment an owner that is always present, and make the mode findable where its siblings are found.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- An unconditional `sk-design` load in the mode's entry contract, ahead of intent scoring and the first tool call
- The design agent persona, resolved from the active runtime's agent directory rather than a hardcoded path
- The reconciliation between a write-capable persona and a transport that forbids Write, Edit, and Task
- The `crossHubPairing` registry field, investigated and deliberately left empty (ADR-001)
- The hub statements that assume one design pairing for all four transports, which this change makes untrue
- The changelog aggregation symlink for this mode

### Out of Scope

- The registered tool surface. No tool is added, removed, renamed, or re-argumented; the fourteen callables are unchanged.
- Backfilling `crossHubPairing` for `mcp-figma`, `mcp-refero`, and `mcp-mobbin`. It cannot be populated for any transport: the compiler reads its values as skill ids and fails closed on one it cannot resolve, and the field was deliberately emptied after the MT-008 over-routing incident (ADR-001).
- Changing the routing compiler so an inert descriptive pairing could be declared. That reopens the path the MT-008 incident closed and needs its own packet (ADR-001).
- Enforcing the pairing mechanically. No gate, hook, or validator is built here.
- The advisor-level routing gap recorded by 004, which lives in the advisor's scoring internals.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-magicpath/SKILL.md` | Modify | The unconditional load, the persona, the reconciled boundary, and the rules that carry them |
| `.opencode/skills/mcp-tooling/mcp-magicpath/references/design-authority.md` | Create | The full pairing contract: what each side owns, why it is not gated, what the persona withholds |
| `.opencode/skills/mcp-tooling/mcp-magicpath/README.md` | Modify | The related-skills table and the now-incorrect skip guidance |
| `.opencode/skills/mcp-tooling/mcp-magicpath/changelog/v1.1.0.0.md` | Create | The packet's release entry |
| `.opencode/skills/mcp-tooling/mode-registry.json` | Modify | Correct the axis description; `crossHubPairing` left `{}` per ADR-001 |
| `.opencode/skills/mcp-tooling/README.md` | Modify | The hub statements that assume one pairing for four transports |
| `.opencode/skills/mcp-tooling/SKILL.md` | Modify | The same assumption, plus a transport enumeration that omitted this mode |
| `.opencode/skills/mcp-tooling/description.json` | Modify | Hub version |
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Modify | Regenerated by its own tool, never hand-edited |
| `.opencode/skills/mcp-tooling/changelog/v1.6.1.0.md` | Create | The hub's release entry |
| `.opencode/changelog/mcp-tooling/mcp-magicpath` | Create | Symlink to the packet's changelog directory, matching the six siblings |
| `.opencode/changelog/mcp-tooling/mcp-notion` | Create | Symlink; scope amendment per ADR-004 |
| `.opencode/changelog/mcp-tooling/mcp-obsidian` | Create | Symlink; scope amendment per ADR-004 |
| `specs/.../006-design-authority/decision-record.md` | Create | ADR-001 through ADR-004 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The design authority loads on every invocation | The entry contract places the `sk-design` load ahead of intent scoring and the first tool call, with no keyword, score, or design-shaped test gating it |
| REQ-002 | The persona does not widen the packet's authority | The write capability is documented as withheld, `mutatesWorkspace:false` still holds, and `allowed-tools` still excludes Write, Edit, and Task |
| REQ-003 | The tool surface is unchanged | The fourteen registered callables before the change equal the fourteen after it |
| REQ-004 | No hub statement is left untrue | No surviving hub sentence claims a single design pairing covers all four transports |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The pairing is machine-readable, not prose-only | SUPERSEDED by ADR-001: `crossHubPairing` cannot carry any entry. Any value fails the compiler closed and re-opens the MT-008 over-routing class; the field is deliberately inert |
| REQ-006 | The divergence from the siblings is recorded as deliberate | The reason `sk-design` is used instead of `sk-design-md-generator` is stated where a reader meets the difference |
| REQ-007 | The mode is findable where its siblings are | `.opencode/changelog/mcp-tooling/mcp-magicpath` resolves to the packet's changelog directory and every sibling link still resolves |
| REQ-009 | The aggregation directory is complete | Scope amendment per ADR-004: `mcp-notion` and `mcp-obsidian` are linked too, and all ten entries resolve |
| REQ-008 | Generated metadata is regenerated, not authored | The leaf manifest is produced by its own tool and the fleet audit reports the hub clean |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A MagicPath request cannot be answered without the design authority having been loaded, because the contract places it before the first tool call rather than behind a condition.
- **SC-002**: The transport is no wider than it was. Adopting a write-capable persona changed no tool, no posture, and no permission.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The persona is adopted wholesale and silently grants write authority | High | The conflict is named in the contract and resolved toward the narrower surface; `allowed-tools` is re-read after the change rather than assumed unchanged |
| Risk | The pairing is cited in prose but never loaded at runtime | High | The rule states that loading means reading and that naming a route does not satisfy it; the residual exposure is recorded as a limitation rather than claimed solved |
| Risk | Correcting one hub sentence leaves sibling sentences making the same false claim | Medium | Every occurrence of the assumption is swept for, not just the one that prompted the change |
| Risk | The symlink is created with a path that resolves from the wrong directory | Medium | Its target is read back and its contents listed, and every sibling link is re-checked for validity afterwards |
| Risk | Hand-editing the leaf manifest | High | It is regenerated by its own tool; the audit is watched failing on staleness first, then passing |
| Dependency | The packet from 003 and the hub metadata from 004 | Low | Both closed before this phase opened |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None open. Two were opened and both are answered.

- **Whether `crossHubPairing` was an unfinished field**: no, and this phase got it wrong first. It is deliberately inert, retained for provenance hashing only, and emptied after a recorded over-routing incident. The compiler resolves its values as skill ids against a registry set that a flat standalone skill like `sk-design` can never join. Full reasoning and the bisect that forced the reversal: ADR-001.
- **Whether adopting a write-capable persona makes this a mutating packet**: no. A persona is a judgment contract, not a grant of tools. The transport's `allowed-tools` list is the narrower surface and it wins. Had it been otherwise, any transport adopting a write-capable persona would quietly leave the transport axis, and the axis would stop meaning anything.
<!-- /ANCHOR:questions -->

---
