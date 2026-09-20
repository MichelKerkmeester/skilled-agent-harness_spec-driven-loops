---
title: "Feature Specification: Phase 6: Always-Loaded Routing Compression"
description: "Four routing sections of AGENTS.md - the Gate 2 artifact trigger, the code-search tree, MCP tool routing, and the Quick Reference table - were reviewed independently by a fresh model. Three were compressed and one was kept untouched on a decisive argument. The review also found a command dead for six weeks, a search table naming tools that do not exist in this runtime, and a decommissioned MCP server still documented as live in the skill that owns it."
trigger_phrases:
  - "always-loaded routing compression"
  - "quick reference table"
  - "code search decision tree"
  - "mcp tool routing"
  - "sequential thinking removal"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: Always-Loaded Routing Compression

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-communication-rule-and-cross-references |
| **Successor** | None |
| **Handoff Criteria** | Four candidates dispositioned on independent evidence; no dead command or decommissioned server named outside `specs/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the repo-rules router packet, and the first in it to use a second
independent lens rather than a single reader.

**Scope Boundary**: four named `AGENTS.md` sections, the `mcp-code-mode` skill documents
that still described a decommissioned server, and one addition to
`naming-convention.md`. No change to any `repo-rules/` file.

**Dependencies**:
- Operator approval for the `AGENTS.md` edits, which phase 4 made a precondition.
- A fresh-model review, because every candidate here is a judgment call and
  `delegation-and-orchestration.md` §4 says one lens is not a finding for those.

**Deliverables**:
- Three compressed `AGENTS.md` sections and one deliberately left alone.
- `mcp-code-mode` SKILL and README with the decommissioned server removed.
- The `cli`-versus-`mcp` naming rule relocated to the reference that owns it.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four sections of the always-loaded document were suspected of being routing content that had outgrown its value: the Gate 2 artifact trigger, the code-search decision tree, MCP tool routing, and the Quick Reference workflow table. Together 9,350 bytes, 17.3% of `AGENTS.md`. Suspicion is not evidence, and the packet had just shipped a rule saying so. An independent review found the situation was worse than "bloat" in three specific ways. The Quick Reference table named `/deep:ai-system-improvement`, a command deleted on 2026-07-15 - `AGENTS.md` had been its only live reference for six weeks. The code-search tree instructed agents to use `Grep` and `Glob`, which do not exist as tools in this runtime. And `mcp-code-mode` still documented Sequential Thinking as a live native server in twelve places, while `AGENTS.md` correctly recorded it as decommissioned - so the skill and the always-loaded document disagreed, and the skill was wrong.

### Purpose
Cut what has stopped being true, keep what has no other home, and leave alone the one section whose value is that it fires rather than that it informs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **A - Gate 2 artifact trigger**: keep unchanged, on the review's argument.
- **B - Code search decision tree**: rewrite rows to name capabilities with tool names as parenthetical examples; drop the scaffolding line and the row already owned by `root-cause.md`.
- **C - MCP tool routing**: delete the registration inventory, relocate the naming rule, keep the two statements with no other home, and say "enumerate at runtime" once instead of three times.
- **D - Quick Reference table**: drop the dead command and the Flow cells that restate a command's own argument list; keep the rows that carry a real order.
- Removing Sequential Thinking from `mcp-code-mode/SKILL.md` and `README.md`.
- Adding the `cli`-manual exception to `mcp-code-mode/references/naming-convention.md`.

### Out of Scope
- **The doctor tooling's Sequential Thinking references** - 31 references across `mcp-doctor.sh` and three command assets, including live `npx -y @modelcontextprotocol/server-sequential-thinking` install and probe steps. This is a behavioral surface with its own tests; changing it here would be scope drift onto code this phase has not exercised. Raised, not absorbed.
- **Changelogs, benchmark reports, and decision records** naming the server - those are historical records, and editing them would falsify the past.
- **`repo-rules/` files** - unchanged; this phase is about the always-loaded document.
- **The `mcp-n` broken link** in `mcp-tooling/README.md` - a real defect the review found, in a different skill, not named in the operator's instruction.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | B, C and D compressed; A untouched |
| `.opencode/skills/mcp-code-mode/SKILL.md` | Modify | Decommissioned server removed from 11 places; the "why it went" note kept |
| `.opencode/skills/mcp-code-mode/README.md` | Modify | Three roster mentions corrected |
| `.opencode/skills/mcp-code-mode/references/naming-convention.md` | Modify | The `cli`-manual exception added as Mistake 0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every claim the review made that this phase acts on is independently verified before the edit. |
| REQ-002 | No dead command and no decommissioned server is named anywhere outside `specs/` when the phase closes. |
| REQ-003 | Content with no other home in the repository survives: "Registration is not availability" and "widen the pattern rather than trusting a single hit". |
| REQ-004 | No `AGENTS.md` edit lands without recorded operator approval. |
| REQ-005 | Every reference the cuts could dangle - tool names, command paths, rule links, cross-section pointers - resolves after the change. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The section kept unchanged has a stated reason, not merely an absence of action. |
| REQ-007 | Relocated content lands in a document that an agent actually reaches when it needs it. |
| REQ-008 | The compression preserves the lookup affordance for weaker readers rather than trading it for abstraction. |
| REQ-009 | Adjacent defects found during the review are recorded and left, not silently fixed. |
| REQ-010 | The byte delta is measured against the prior commit and reported in whichever direction it went. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -l 'ai-system-improvement'` outside `specs/` returns nothing.
- **SC-002**: `mcp-code-mode` no longer describes the decommissioned server as live, and the one surviving mention explains why it is gone.
- **SC-003**: Every command, tool-capability route, and link named in `AGENTS.md` resolves.
- **SC-004**: The two unique sentences are still present, and their absence elsewhere in the repository is still true.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Compression removes a lookup affordance a weaker model relies on | Med - the always-loaded document is read by six runtime profiles at different model tiers | The review raised this itself; B keeps the table shape and names tools as examples rather than replacing them with abstractions |
| Risk | Deleting the MCP registration inventory loses the repo's only correct statement, because the skill was stale | High if done in the wrong order | The skill was fixed first, in the same phase, and verified before the inventory was cut |
| Risk | The doctor tooling still installs a decommissioned server | High, and unresolved here | Recorded as out of scope with the exact commands named, so the next session does not have to rediscover it |
| Risk | Adopting a review wholesale because it is well-evidenced | Med - it was better-evidenced than the first read, which is exactly when the check gets skipped | Four load-bearing claims re-verified independently before any edit; the review's own line-count figure was corrected |
| Dependency | Operator approval for `AGENTS.md` | Phase 4 blocks the edits without it | Granted explicitly in the instruction that opened this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Context Cost
- **NFR-C01**: The byte delta is measured against the prior commit, not estimated from line counts.
- **NFR-C02**: No compression trades a correct statement for a shorter one.

### Correctness
- **NFR-K01**: Nothing in the always-loaded document names a command, tool, or server that does not exist.
- **NFR-K02**: Where a skill and the always-loaded document disagree, the disagreement is resolved rather than left for a reader to arbitrate.

### Reversibility
- **NFR-R01**: Each candidate's change is a separate hunk, so one can be reverted without the others.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Reference Boundaries
- **A historical record naming the retired server**: left alone; a changelog that no longer describes what happened is worse than a stale name.
- **A concept document using the phrase for something else**: checked before editing, and excluded when the meaning differed.
- **A cleanup script matching the process name**: left alone; it reaps an orphan if one ever appears and costs nothing when none does.

### Compression Boundaries
- **A row whose Flow restates the command's own help text**: dropped, because the command is the authority.
- **A row whose Flow carries an order stated nowhere else**: kept verbatim.
- **A section whose value is that it fires rather than that it informs**: left untouched, and the reason recorded.

### Verification Boundaries
- **A review claim that does not survive checking**: the review's line count was wrong and was corrected before use.
- **A cut that would strand a reference**: swept for afterwards, in both directions.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | 4 files, three compressed sections, one relocation |
| Risk | 13/25 | Touches the always-loaded document and a live skill under approval |
| Research | 12/20 | An independent fresh-model review plus four re-verifications |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the doctor tooling stop installing the decommissioned server? **Yes, and it is the most consequential thing this review found - `/doctor:mcp install` would put it back. Deliberately not done here: it is 31 references across executable tooling with its own tests, and this phase has not exercised that surface. Raised for the operator.**
- Should the Quick Reference table be deleted rather than compressed? **UNKNOWN, and the deciding evidence is missing: it depends on whether all six runtime profiles inject their own command listing at prompt time, which is confirmed only for Claude Code. Compression is the answer that does not require the unknown.**
<!-- /ANCHOR:questions -->

---
