---
title: "D2-R13 — Descriptions treated as auto-trigger, but NL collapses to the hub"
description: "Add descriptionRole + autoTriggerEligible:false + hubKeywordProjection to every command-metadata.json record, formalize and enforce the description grammar (<role/output clause>. sk-design <ownerMode> mode.), keep the frontmatter↔metadata description in lockstep at drift 0, and realize the spec's 4-lane replay deterministically on the named command-surface targets via design-command-surface-check.mjs."
trigger_phrases:
  - "d2-r13 description role"
  - "description role design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/013-description-role-projection"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Upgraded spec to Level 2; recorded grammar + autoTriggerEligible-false + lockstep rationale"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r13-description-role-projection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Descriptions are a hub-keyword projection (autoTriggerEligible:false), not a per-command auto-trigger"
      - "The grammar suffix sk-design <ownerMode> mode. binds every description back to the parent skill + mode"
      - "The spec's 4-lane replay is realized deterministically on the named targets; a live NL replay corpus is D3"
---
# Feature Specification: D2-R13 — Description role projection (hub-keyword, not auto-trigger)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Completed** | 2026-06-29 |
| **Branch** | `013-description-role-projection` |
| **Dimension** | D2 — Command Specificity (final phase) |
| **Enforcement class** | hybrid (metadata SSOT + deterministic surface gate) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A command `description` is treated as if it were auto-trigger text for that one command, yet natural-language prompts collapse to the `sk-design` hub rather than auto-selecting a single `/design:*` command. Nothing in the metadata declares what a description is *for*: there is no field saying a description is a hub-routing keyword surface, not a per-command auto-trigger. The evidence is `mode-registry.json:4` — descriptions treated as the auto-trigger source that natural language collapses to the hub.

### Purpose
Give every description a declared role and make that role machine-enforced. Add three metadata fields per record — `descriptionRole` (a fixed-vocabulary role token), `autoTriggerEligible` (boolean, always `false`), and `hubKeywordProjection` (the grounded description keywords the hub routes on) — and formalize one **description grammar** that the surface-check enforces: a succinct role/output clause followed by the `sk-design <ownerMode> mode.` suffix that binds the description back to the parent skill and its mode. This completes the D2 dimension: the design command surface now declares and machine-enforces the full reconciled field set per command.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `descriptionRole`, `autoTriggerEligible: false`, and a non-empty `hubKeywordProjection` array to each of the five records in `command-metadata.json`. The three fields are metadata-only and add no new frontmatter drift channel.
- Formalize and enforce the description grammar `<role/output clause>. sk-design <ownerMode> mode.` per record; tighten any off-grammar description on **both** the wrapper frontmatter and the metadata in lockstep so the existing `description` drift channel stays `0`.
- Extend `design-command-surface-check.mjs` additively: Stage-1 rules for the role-field shape, the fixed role vocabulary, `autoTriggerEligible === false`, `hubKeywordProjection` grounding (every token a case-insensitive substring of the record's `description`), and the grammar suffix — preserving the existing `description` frontmatter drift check unchanged.

### Out of Scope
- `mode-registry.json` — read-only `workflowMode` source for the `ownerMode` allow-set the grammar suffix binds to; not mutated.
- Projecting any of the three new fields into the wrapper frontmatter — that would add a new drift channel and is explicitly out of scope; the fields stay metadata-only.
- A live natural-language router-replay / gold-corpus harness — the spec's literal "4-lane replay" is realized deterministically on the named targets here; a live NL replay corpus belongs to the D3 routing build.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Add `descriptionRole` + `autoTriggerEligible: false` + grounded `hubKeywordProjection` to all five records; tighten each `description` to the grammar; preserve every prior field |
| `.opencode/commands/design/audit.md` | Modify | Update frontmatter `description` in lockstep with metadata (drift stays 0); preserve everything else |
| `.opencode/commands/design/foundations.md` | Modify | Update frontmatter `description` in lockstep with metadata; preserve everything else |
| `.opencode/commands/design/interface.md` | Modify | Update frontmatter `description` in lockstep with metadata; preserve everything else |
| `.opencode/commands/design/md-generator.md` | Modify | Update frontmatter `description` in lockstep with metadata; preserve everything else |
| `.opencode/commands/design/motion.md` | Modify | Update frontmatter `description` in lockstep with metadata; preserve everything else |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Add the five Stage-1 rules (role token, strict-false, grounded projection, grammar suffix); preserve the existing description frontmatter↔metadata drift check |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every record carries the three role fields | Each of the five records has `descriptionRole` (∈ the role allow-set), `autoTriggerEligible` strictly the boolean `false`, and a non-empty `hubKeywordProjection` string array; checker `invalid=0` |
| REQ-002 | `hubKeywordProjection` is grounded | Every token is a case-insensitive substring of that record's `description`; an ungrounded token flips the checker to INVALID |
| REQ-003 | Description grammar enforced | Each `description` ends with `sk-design <ownerMode> mode.` (record's own `ownerMode`); a broken suffix flips the checker to INVALID |
| REQ-004 | Description parity preserved | The frontmatter↔metadata `description` drift channel stays `0`; any description tightening was applied to both surfaces in lockstep |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `autoTriggerEligible:false` gated, not just documented | The checker rejects any record whose `autoTriggerEligible` is not strictly `false` (exit 2) |
| REQ-006 | No regression on the prior D2 surface | All prior D2 channels (`argument-hint`, `allowed-tools`, discriminator, preconditions, example, emit-deliverable, taskProjections) stay `drift=0`; overall `invalid=0 drift=0`, exit 0 |
| REQ-007 | Strictly additive non-mutation | `mode-registry.json` byte-unchanged; exactly the seven intended targets changed; `node --check` clean on the checker |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node design-command-surface-check.mjs` reports `STATUS=PASS ... invalid=0 drift=0`, exit 0, with the three new fields and the description parity all green; descriptions end with `sk-design <mode> mode.` 5/5.
- **SC-002**: A synthetic break — flip one record's `autoTriggerEligible` to `true` — flips the checker to `STATUS=INVALID` "autoTriggerEligible must be the boolean false" (`invalid=1`); restoring returns it to `invalid=0 drift=0`.
- **SC-003**: The spec's 4-lane replay is realized deterministically on the named targets — advisor→hub (`autoTriggerEligible:false`), hub→mode (`hubKeywordProjection`), direct-command→packet (the existing `ownerMode→workflowMode` invariant), generated-pin→parent (the `sk-design <ownerMode> mode.` grammar suffix) — and `mode-registry.json` is byte-unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `command-metadata.json` D2-R3 SSOT | The three new fields attach to its five records; they must exist with prior fields | D2-R3..R12 landed; every prior field preserved; verified by checker `invalid=0` |
| Dependency | `design-command-surface-check.mjs` D2-R3 checker | The gate being extended; its `description` frontmatter channel must stay intact | Stage-1 rules added additively; the existing drift check left unchanged; `node --check` clean |
| Dependency | `mode-registry.json` | The `ownerMode` allow-set the grammar suffix binds to | Read-only; the checker reads `workflowMode` and never mutates the file |
| Decision/Risk | A description could be treated as a per-command auto-trigger | NL would be expected to auto-select one command, but it collapses to the hub | `autoTriggerEligible` is pinned strictly `false` and checker-enforced, encoding "NL collapses to the hub, the command is not auto-triggered" |
| Decision/Risk | Tightening a description could break the existing parity | A one-surface edit would trip the prior D2 frontmatter-drift gate | Any description change is applied to the frontmatter and the metadata in **lockstep**, so the `description` drift channel stays `0` |
| Decision/Risk | The spec lists a literal "4-lane replay" | Reading it as a live NL routing corpus would mis-scope this phase | The four lanes are realized deterministically on the named targets (autoTriggerEligible / hubKeywordProjection / ownerMode→workflowMode / grammar suffix); a live NL replay corpus is flagged as D3 follow-on |
| Risk | An ungrounded `hubKeywordProjection` token | A keyword the hub routes on that is absent from the description would be invented routing | Checker grounding rule rejects any token that is not a case-insensitive substring of the record's `description` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: The surface gate is deterministic and re-runnable on demand; output is sorted and stable with no timestamps.

### Evergreen
- **NFR-E01**: No spec/packet/phase ID or spec-folder path appears in `command-metadata.json`, the wrappers, or the checker; the checker resolves all paths from `import.meta.url`.

### Additivity
- **NFR-A01**: All changes are additive over the D2-R3..R12 spine; the three new fields are metadata-only (no new frontmatter drift channel) and the prior baseline (`invalid=0 drift=0`) is preserved.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Metadata Boundaries
- Missing any of the three fields on a record: Stage 1 INVALID (exit 2) — they are in the required-field set.
- `descriptionRole` not in the role allow-set (`hub-keyword-projection`): Stage 1 INVALID (exit 2).
- `autoTriggerEligible` not strictly the boolean `false` (e.g. `true`, `"false"`, `0`, missing): Stage 1 INVALID (exit 2).
- `hubKeywordProjection` not a non-empty string array: Stage 1 INVALID (exit 2).
- A `hubKeywordProjection` token not a case-insensitive substring of the record's `description`: Stage 1 INVALID (exit 2) — ungrounded projection.
- A `description` not ending with `sk-design <ownerMode> mode.`: Stage 1 INVALID (exit 2) — grammar suffix violation.

### Surface Boundaries
- Frontmatter `description` not equal to metadata `description`: the existing drift channel fires (exit 1) — parity break.
- The three metadata-only fields are never projected into frontmatter, so they add no new drift surface.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 7 files: 1 JSON SSOT (three fields per record + grammar), 5 wrappers (lockstep frontmatter description), 1 checker (five Stage-1 rules) |
| Risk | 13/25 | Additive role fields + grammar enforcement; description parity must stay 0; no live mutation outside scope; registry read-only |
| Research | 8/20 | Grammar + grounded hubKeywordProjection matrix pre-authored in plan §3 from research §5 (D2-R13) |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None remaining. Three decisions are resolved and recorded in RISKS above: (1) **description-grammar** — every `description` is `<role/output clause>. sk-design <ownerMode> mode.`, formalized and checker-enforced rather than rewritten as prose; (2) **autoTriggerEligible-false** — the field is pinned strictly `false` and gated, encoding "natural language collapses to the hub, the command is not auto-triggered"; (3) **lockstep-parity** — the three new fields are metadata-only and any description tightening is applied to both the frontmatter and the metadata in lockstep, so the existing `description` drift channel stays `0`.
- **Flagged open decision (operator):** if the spec intends a literal live 4-lane natural-language routing-replay corpus, that is a follow-on coupled to the D3 routing build, not this phase's named targets. The four lanes are realized here deterministically on the named command-surface targets.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 addendum (NFR, edge cases, complexity)
- D2-R13: descriptionRole + autoTriggerEligible:false + hubKeywordProjection (metadata-only) + description grammar (<role/output clause>. sk-design <ownerMode> mode.) + Stage-1 gate
- Strictly additive: mode-registry untouched, frontmatter description parity stays 0, all prior D2 additions preserved, final surface-check invalid=0 drift=0
- Final D2 phase: the design command surface declares + machine-enforces the full reconciled per-command field set
-->
