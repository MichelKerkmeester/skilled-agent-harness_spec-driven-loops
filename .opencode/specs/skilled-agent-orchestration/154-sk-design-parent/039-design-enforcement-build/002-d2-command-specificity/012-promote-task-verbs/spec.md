---
title: "D2-R12 — High-value task verbs buried in references/aliases"
description: "Add a taskProjections array to every command-metadata.json record promoting eight transform verbs (typeset, colorize, bolder, quieter, distill, delight, harden, polish) as advisory task projections of existing modes; project them as a TASK PROJECTIONS wrapper section; and enforce schema + ownerMode parity + advisory strictness + global verb uniqueness + command-creep rejection + a mode-registry alias cross-check in design-command-surface-check.mjs."
trigger_phrases:
  - "d2-r12 task verbs"
  - "task verbs design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/012-promote-task-verbs"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Upgraded spec to Level 2; recorded advisory-strictness + no-command-creep + 8-verb scope"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r12-promote-task-verbs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Strictness is enforced to advisory by the checker, so a non-advisory projection is rejected"
      - "Each verb is globally unique and owned by one mode; the command-creep guard bans minting any /design:<verb>"
      - "The eight spec verbs are sub-mode transform verbs; the brief's audit/design/animate/extract are mode-level and out of scope"
---
# Feature Specification: D2-R12 — Promote high-value task verbs as command-visible projections

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
| **Branch** | `012-promote-task-verbs` |
| **Dimension** | D2 — Command Specificity |
| **Enforcement class** | advisory (metadata SSOT + deterministic surface gate) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Eight high-value transform verbs — `typeset`, `colorize`, `bolder`, `quieter`, `distill`, `delight`, `harden`, `polish` — are the action words a user actually types, yet they live buried in the design modes' `references/` and alias surfaces, invisible at the `/design:*` command surface. A caller cannot see which mode owns a verb, and nothing stops a verb from being mistakenly minted into a new `/design:<verb>` top-level command. The evidence is `design-audit/references/transform_remediation.md:22`, which names the buried transform verbs.

### Purpose
Make the eight verbs visible at the command surface as advisory task projections of existing modes — not new modes and not new commands — and bind that promotion to a deterministic gate so each verb is globally unique, owned by exactly one mode, and provably barred from becoming a standalone command.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `taskProjections` array to each of the five records in `command-metadata.json`. Each entry is `{ verb, ownerMode, strictness, referenceSources, requires, fixtures }`; modes with no transform verb carry an empty array so the field is uniform across all five records.
- Project each mode's owned verbs as a `## TASK PROJECTIONS` body section in the five `commands/design/*.md` wrappers, including a fixed negative-corpus guard line.
- Extend `design-command-surface-check.mjs` additively: `taskProjections` in `REQUIRED_FIELDS`, a `validateTaskProjections` Stage-1 validator (schema + ownerMode parity + advisory strictness + global verb uniqueness + command-creep rejection), a `mode-registry.json` alias cross-mode collision check, and a Stage-2 wrapper-body rule.

### Out of Scope
- `mode-registry.json` — read-only `workflowMode` + alias source for reconciliation; not mutated.
- The owning modes' `references/` — read-only source of the `referenceSources` anchors; not mutated.
- The brief's mode-level verbs (`audit`, `design`, `animate`, `extract`) — already covered by existing aliases and the five commands themselves; NOT promoted here.
- Wrapper frontmatter (`description`, `argument-hint`, `allowed-tools`) and all prior D2 fields — preserved, body-only edits, never reshaped.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Add a `taskProjections` array to each of the five records (eight advisory projections across `audit`/`foundations`/`interface`, empty for `motion`/`md-generator`); preserve every prior field |
| `.opencode/commands/design/audit.md` | Modify | Append a `## TASK PROJECTIONS` section (harden, polish) + negative-corpus guard; preserve all prior sections + frontmatter |
| `.opencode/commands/design/foundations.md` | Modify | Append a `## TASK PROJECTIONS` section (typeset, colorize) + guard; preserve all prior sections + frontmatter |
| `.opencode/commands/design/interface.md` | Modify | Append a `## TASK PROJECTIONS` section (bolder, quieter, distill, delight) + guard; preserve all prior sections + frontmatter |
| `.opencode/commands/design/md-generator.md` | Modify | Append the empty-projection notice + guard; preserve all prior sections + frontmatter |
| `.opencode/commands/design/motion.md` | Modify | Append the empty-projection notice + guard; preserve all prior sections + frontmatter |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Add `taskProjections` to `REQUIRED_FIELDS` + `validateTaskProjections` (schema + ownerMode parity + advisory + global verb uniqueness + command-creep) + a mode-registry alias cross-check + a Stage-2 body rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every record carries a valid `taskProjections` array | Each of the five records has the field; each of the eight entries has a non-empty `verb`, an `ownerMode` equal to the record's `ownerMode`, `strictness: "advisory"`, non-empty `referenceSources`, a non-empty `requires`, and non-empty `fixtures`; checker `invalid=0` |
| REQ-002 | Each verb is globally unique and owned by exactly one mode | The eight verbs appear once across all `taskProjections`; a duplicate verb across two records flips the checker to INVALID |
| REQ-003 | No verb is minted as a command (negative corpus) | The command-creep guard rejects any `/design:<verb>`; the verb routes into its owning mode instead |
| REQ-004 | Each wrapper projects its owned verbs | Each of the five wrappers carries a `## TASK PROJECTIONS` section (owned verbs or empty notice) with the negative-corpus guard line; checker `drift=0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Alias reconciliation against the live registry | No projected verb collides with another mode's `mode-registry.json` aliases (cross-mode whole-word check) |
| REQ-006 | No regression on the prior D2 surface | All prior D2 fields (`argumentHint`, `examples`, `outputContract`, `discriminator`, `preconditions`, `toolPolicy`) and frontmatter drift stay green; overall `invalid=0 drift=0`, exit 0 |
| REQ-007 | Strictly additive non-mutation | `mode-registry.json` byte-unchanged; exactly the seven intended targets changed; `node --check` clean on the checker |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node design-command-surface-check.mjs` reports `STATUS=PASS ... invalid=0 drift=0`, exit 0, with `taskProjections` and all prior D2 fields green.
- **SC-002**: A synthetic break — a duplicate verb across two records — flips the checker to `STATUS=INVALID` "taskProjections[0].verb typeset is already owned by /design:audit" (`invalid=1`); restoring returns it to `invalid=0 drift=0`.
- **SC-003**: All five wrappers carry the `## TASK PROJECTIONS` section + negative-corpus guard line; `mode-registry.json` is byte-unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `command-metadata.json` D2-R3 SSOT | The `taskProjections` array attaches to its five records; they must exist with prior fields | D2-R3..R7 landed; every prior field preserved; verified by checker `invalid=0` |
| Dependency | `mode-registry.json` alias surface | The reconciliation source for the cross-mode alias check | Read-only; the checker reads aliases to reconcile and never mutates the file |
| Decision/Risk | Strictness could drift to enforceable | A verb promoted as enforceable would over-claim authority over user intent | `strictness` is a closed enum `{"advisory"}` enforced by the checker; a non-advisory projection is rejected (exit 2) — the call stays an advisory routing aid, not a taste claim |
| Decision/Risk | A verb could be minted into a `/design:<verb>` command (command creep) | New top-level commands would fracture the surface and duplicate mode work | The command-creep guard bans any `/design:<verb>` in the expected command set; minting one flips the checker to INVALID, so the verbs stay projections, not commands |
| Decision/Risk | The brief lists mode-level verbs (`audit`/`design`/`animate`/`extract`) | Promoting those would duplicate existing commands and aliases | Scope is the spec's eight sub-mode transform verbs only; the mode-level verbs are already covered by the five commands and registry aliases and are explicitly out of scope |
| Risk | Wrapper frontmatter drift | Touching frontmatter would trip the prior D2 gate | Body-only append keeps frontmatter byte-frozen so existing drift stays 0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: The surface gate is deterministic and re-runnable on demand; output is sorted and stable.

### Evergreen
- **NFR-E01**: No spec/packet/phase ID or spec-folder path appears in the metadata, the wrappers, or the checker; `referenceSources` are durable skill source anchors only.

### Additivity
- **NFR-A01**: All changes are additive over the D2-R3..R7 spine; the prior baseline (`invalid=0 drift=0`) is preserved and `taskProjections` is namespaced so no existing field changes shape.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Metadata Boundaries
- Missing `taskProjections` on a record: Stage 1 INVALID (exit 2) — it is in `REQUIRED_FIELDS`.
- An entry with an empty `verb`/`ownerMode`/`requires` or empty `referenceSources`/`fixtures` array: shape violation → Stage 1 INVALID (exit 2).
- An `ownerMode` not equal to the record's `ownerMode` (or outside the `workflowMode` set): Stage 1 INVALID (exit 2).
- A `strictness` outside `{"advisory"}`: Stage 1 INVALID (exit 2).
- A verb listed under two records (duplicate): Stage 1 INVALID (exit 2), message names the prior owner.
- A `/design:<verb>` minted into the command set: Stage 1 INVALID (exit 2) — command-creep / negative corpus.
- A verb colliding with another mode's `mode-registry.json` alias: Stage 1 INVALID (exit 2) — alias reconciliation.

### Surface Boundaries
- Wrapper missing the `## TASK PROJECTIONS` section: Stage 2 drift `field: "taskProjections"` (exit 1).
- A missing owned-verb token in a wrapper section: Stage 2 drift (exit 1).
- A missing negative-corpus guard line: Stage 2 drift (exit 1).
- Frontmatter touched: the existing frontmatter-drift gate fires (exit 1).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 7 files: 1 JSON SSOT (one nested array per record), 5 wrappers (one body section each), 1 checker |
| Risk | 13/25 | Adds a global verb-uniqueness + command-creep guard + a registry alias cross-read; additive, frontmatter frozen, no live mutation outside scope |
| Research | 8/20 | Verb→ownerMode mapping + referenceSources pre-authored in plan §3 from research §5 (D2-R12) |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None remaining. Three decisions are resolved and recorded in RISKS above: (1) **advisory-strictness** — `strictness` is a closed enum `{"advisory"}` enforced by the checker, so the verbs are advisory routing aids, not taste or authority claims; (2) **no-command-creep** — the command-creep guard bans any `/design:<verb>`, so each verb stays a projection and never a new command; (3) **8-verbs-vs-mode-level-verbs scope** — only the spec's eight sub-mode transform verbs are promoted; the brief's mode-level `audit`/`design`/`animate`/`extract` are already covered by the five commands and registry aliases and are out of scope.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 addendum (NFR, edge cases, complexity)
- D2-R12: taskProjections[] (eight advisory transform verbs by ownerMode) + TASK PROJECTIONS wrapper sections + Stage-1/Stage-2 gate with global verb uniqueness + command-creep rejection + mode-registry alias cross-check
- Strictly additive: mode-registry untouched, frontmatter frozen, all prior D2 additions preserved, final surface-check invalid=0 drift=0
-->
