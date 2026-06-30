---
title: "Feature Specification: research sk-design routing/utilization guarantees, command specificity, and cross-surface enforcement"
description: "Level-3 research packet: 50 non-converging GPT-5.5-xhigh deep-research iterations over six dimensions of the sk-design family — residual craft (D1), /design:* command specificity (D2), parent->sub-skill routing+utilization guarantees (D3), mcp-open-design pairing guarantees (D4), cross-CLI survival (D5), and designer-skills-main corpus expansion (D6). Output: a frozen per-dimension buildable backlog, a shared four-layer enforcement spine, an honest enforceable-vs-advisory ledger, and a verification plan. Research only — no live sk-design edits."
trigger_phrases:
  - "sk-design routing utilization research packet"
  - "design command specificity research"
  - "mcp-open-design pairing enforcement research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/044-design-routing-and-integration-research"
    last_updated_at: "2026-06-28T11:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Froze the six-dimension routing/integration research backlog"
    next_safe_action: "Scope a build phase for the D3/D4 enforcement spine"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-044-design-routing-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Routing/loading/firing/survival are deterministically enforceable on a fixture corpus; application quality and taste stay advisory"
      - "No live edits — the deliverable is a buildable backlog, not a build"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: research sk-design routing/utilization guarantees, command specificity, and cross-surface enforcement

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

A completed deep-research study — the "implementation" was the research itself, not code. Fifty GPT-5.5-xhigh iterations ran without converging over six dimensions of the `sk-design` family: residual craft (D1), `/design:*` command specificity (D2), parent->sub-skill routing+utilization guarantees (D3), `mcp-open-design` pairing guarantees (D4), cross-CLI survival (D5), and a `designer-skills-main` corpus expansion (D6). This is the first arc to move past corpus-adoption craft into enforcement architecture: how to *guarantee* design judgment is routed to, loaded, fired, and carried across every surface that can produce a UI.

The central result is an honest reframing of the "1000%" guarantee: selection, loading, firing, and survival can be made deterministically blocking on a fixture corpus and at the tool boundary, while application quality and taste stay intrinsically advisory. The deliverable is a per-dimension buildable backlog (~70 items, D1-R*…D6-R*), a shared four-layer enforcement spine, an enforceable-vs-advisory ledger, and a verification plan.

**Key Decisions**: 50 non-converging iterations driven by a 57-angle bank plus a parallel monitor; every load-bearing claim verified against the real on-disk file; research only, nothing committed.

**Critical Dependencies**: the live `sk-design` / commands / `mcp-open-design` / `cli-*` files (read-only) and the deep-loop-runtime externalized state machine.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../028-impeccable-design-research/spec.md |
| **Successor** | optional future build packet if the backlog is approved |
| **Handoff Criteria** | six dimensions covered, non-convergence achieved, every claim verified against the real on-disk file, enforceable-vs-advisory ledger recorded, packet passes strict validation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-design has absorbed several external corpora into craft, but it cannot today *prove* that the right mode was selected, the right context was loaded, the pairing fired, or that the contract survived a CLI dispatch. A deterministic router replay fails on the parent hub, live utilization is invisible, the `mcp-open-design` HARD GATE is never-executed pseudocode, and the `cli-*` skills carry no design-standards twin to their code-standards rule.

### Purpose
Run a non-converging, verify-against-real deep-research study that separates the part of the routing/utilization/pairing problem that can be made *deterministically blocking* from the part that is *intrinsically advisory*, and emit a frozen, implementation-ready per-dimension backlog mapped to existing files.

> **Note:** Research only. Named improvements route to a future build packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reading the live `sk-design` family, `/design:*` commands, `mcp-open-design`, and `cli-*` skills (read-only) plus the impeccable-main and designer-skills-main corpora.
- A per-dimension buildable backlog, a shared four-layer enforcement spine, an enforceable-vs-advisory ledger, and a verification plan.

### Out of Scope
- Editing any live `sk-design` / commands / `mcp-open-design` / `cli-*` file; the generated provider duplicate trees; build/site/test infrastructure; the existing `research/` directory (research.md is final).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | The synthesized six-dimension backlog + spine + ledger + verification plan |
| `research/iterations` and `research/deltas` | Create | 50 per-iteration evidence files and deltas |
| `research/deep-research-state.jsonl` | Create | The append-only state machine (50 records) |
| `research/angle-bank.json` | Create | The 57-angle bank the driver advanced |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Six dimensions covered | 50 iterations span D1-D6; every load-bearing claim cites a real on-disk file |
| REQ-002 | Non-convergence achieved | newInfoRatio never near the 0.05 floor; one fresh angle per iteration |
| REQ-003 | Honest enforceable-vs-advisory ledger | selection/loading/firing/survival enforceable on fixtures; application/taste advisory |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Per-dimension buildable backlog | each item carries class (enforceable/advisory/hybrid) + target file + citation |
| REQ-005 | Packet validates | `validate.sh --strict` clean |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A frozen per-dimension buildable backlog, a shared four-layer enforcement spine, and an enforceable-vs-advisory ledger, every item traced to a real on-disk file.
- **SC-002**: Non-convergence reached honestly across all 50 iterations; the packet passes strict validation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A finding asserted, not verified | False backlog item | Finding-is-a-hypothesis: open the cited line before claiming |
| Risk | Premature convergence flattens yield | Padded iterations | 57-angle bank + parallel monitor + corpus expansion |
| Dependency | The live sk-design family + corpora | No input | Read-only, preserved |
| Dependency | cli-codex gpt-5.5 xhigh fast | No executor | Validated in prior arcs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Research artifacts only; no runtime impact on sk-design or any transport.

### Security
- **NFR-S01**: Read-only over the live family + corpora; no write permission used against source files.

### Reliability
- **NFR-R01**: Externalized state machine is append-only and reducer-verified (corruption count 0).

---

## 8. EDGE CASES

### Data Boundaries
- **A claim already covered on-disk**: classified as already-present with the location; not added to the backlog.
- **An intrinsically advisory item**: labeled advisory; the deliverable makes its absence loud but never claims to certify it.

### Error Scenarios
- **A dispatch hangs**: the driver restarts the iteration from externalized state (one transient codex hang at iter 9 recovered this way).

### State Transitions
- **Research to build**: this packet freezes the backlog; a future build packet applies the D3/D4 enforcement spine.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | Six dimensions across the whole sk-design family + transports |
| Risk | 14/25 | Enforcement architecture; false-positive + over-claim risk |
| Research | 19/20 | 50 non-converging iterations + parallel monitor |
| Multi-Agent | 12/15 | cli-codex loop + monitor + 6 parallel synthesis agents |
| Coordination | 10/15 | Fourth corpus arc; cross-surface dimensions |
| **Total** | **74/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Over-claiming a "1000%" guarantee | M | M | Honest enforceable-vs-advisory split; advisory items flagged |
| R-002 | Asserted-not-verified findings | M | M | Verify-against-real; finding-is-a-hypothesis |
| R-003 | Monitor angle re-use lowers yield | L | M | Deepened not repeated; flagged honestly in the convergence report |

---

## 11. USER STORIES

### US-001: Know what can actually be enforced (Priority: P0)
**As a** sk-design maintainer, **I want** the routing/utilization problem split into deterministically-blocking and intrinsically-advisory parts, **so that** a future build targets the part it can actually prove.
**Acceptance Criteria**:
1. Given the research, When I read the ledger, Then every layer is labeled enforceable / hybrid / advisory with evidence.

### US-002: A buildable backlog, not prose (Priority: P0)
**As a** maintainer, **I want** each recommendation to carry a class, a target file, and a citation, **so that** a future build is surgical.
**Acceptance Criteria**:
1. Given §4 and research.md, When I plan a build, Then each item names its target file and a load-bearing citation.

### US-003: Honest non-convergence (Priority: P1)
**As a** maintainer, **I want** the 50 iterations to draw genuinely fresh angles, **so that** the coverage is real and not padded synthesis.
**Acceptance Criteria**:
1. Given the convergence report, When I read newInfoRatio, Then it never approaches the 0.05 floor and re-used angles are flagged.

---

## 12. OPEN QUESTIONS

- Where the hub-router policy should live: `mode-registry.json.router` vs a generated sibling `hub-router.json` (resolved as an open design decision in research.md §6).
- Whether the open-design proof token is minted by a sk-design card parser or a guarded `mcp-open-design` proxy (resolved as an open design decision in research.md §7).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Deliverable**: `research/research.md`
- **Prior phases**: `../028-impeccable-design-research/`
