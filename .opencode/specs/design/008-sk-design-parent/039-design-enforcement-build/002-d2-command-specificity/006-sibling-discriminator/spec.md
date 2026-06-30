---
title: "Feature Specification: D2-R6 — Sibling discriminator + deferToHubWhen for /design:*"
description: "The /design:* command layer carries no discriminator, so a caller cannot tell when a sibling command or the sk-design hub is the better entry; this phase adds a reconciled, body-enforced per-pair discriminator."
trigger_phrases:
  - "d2-r6 sibling discriminator"
  - "design command discriminator spec"
  - "deferToHubWhen command layer spec"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/006-sibling-discriminator"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Upgrade spec to Level 2; record D3 router-replay defer and sibling-set invariant"
    next_safe_action: "Run D2-R7 preconditions-and-failure-modes phase for the /design surface"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r6-sibling-discriminator"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: D2-R6 — Sibling discriminator + deferToHubWhen for /design:*

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each `/design:*` wrapper carried no sibling discriminator (evidence: `commands/design/interface.md:13`). A caller reading any one command could not tell when a *sibling* command or the `sk-design` hub was the better entry. The wrapper named its own mode but never stated, per pair, "use this command, not that sibling, when …" — so the choice between the five design commands and the deferral to the hub were both undocumented and unenforced at the command layer.

### Purpose
Make every `/design:*` command state, in one line per sibling, when to use **this** command and when to prefer a sibling or defer to the `sk-design` hub. The authoritative content lives in the `command-metadata.json` SSOT as a new `discriminator{whenToUse, preferSiblingWhen, pairWithHubWhen, sequence}` block, mirrored into each wrapper body as a "WHEN TO USE THIS, NOT A SIBLING" section, and reconciled against the existing `deferToHubWhen` / `next` fields and the registry `workflowModes` by `design-command-surface-check.mjs`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `discriminator{whenToUse, preferSiblingWhen[]{sibling, when}, pairWithHubWhen, sequence{typicallyBefore, typicallyAfter}}` to all five `command-metadata.json` records
- Append a sibling-discriminator body section to each of the five wrappers, naming the four sibling tokens plus a hub-defer line
- Extend `design-command-surface-check.mjs` additively: Stage 1 discriminator shape + reconciliation, Stage 2 body-presence check

### Out of Scope
- Wrapper frontmatter (`description`, `argument-hint`, `aliases`, `allowed-tools`) — owned by prior D2 work and held byte-stable
- Transport routing (`mcp-figma`, `mcp-open-design`, `mcp-chrome-devtools`) — transports, not `/design:*` siblings; they stay in the child packet When-NOT and are not encoded as siblings here
- Literal router-replay / gold-corpus fixtures — that machinery belongs to dimension D3 (see Open Questions)
- Any taste or design-quality judgment — this is a deterministic command-surface gate only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Add `discriminator` block to all five records |
| `.opencode/commands/design/audit.md` | Modify | Append "WHEN TO USE THIS, NOT A SIBLING" naming four siblings + hub line |
| `.opencode/commands/design/foundations.md` | Modify | Same projected section for `foundations` |
| `.opencode/commands/design/interface.md` | Modify | Same projected section for `interface` |
| `.opencode/commands/design/md-generator.md` | Modify | Same projected section for `md-generator` |
| `.opencode/commands/design/motion.md` | Modify | Same projected section for `motion` |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Additive Stage 1 shape + reconciliation, Stage 2 body-presence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Discriminator present per command | All five records carry a well-formed `discriminator` with `whenToUse`, `preferSiblingWhen[]`, `pairWithHubWhen`, `sequence`; checker requires it |
| REQ-002 | Sibling set equals exactly the other four | Each record's `preferSiblingWhen` covers exactly the other four `/design:*` commands; never self; each sibling is a registry `workflowMode` |
| REQ-003 | Hub choice reconciled | `discriminator.pairWithHubWhen === deferToHubWhen` on every record |
| REQ-004 | Surface check passes | `design-command-surface-check.mjs` returns STATUS=PASS, invalid=0, drift=0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Sequence reconciliation | `sequence.typicallyBefore ⊆ next`; every sequence entry is a real `/design:*` command and never self |
| REQ-006 | Wrapper body mirrors metadata | Each wrapper's sibling-discriminator section names all four sibling tokens + a hub line; body-presence drift = 0 |
| REQ-007 | No frontmatter regression | Prior D2 frontmatter parity (`description`, `argument-hint`, `aliases`, `allowed-tools`) preserved; frontmatter drift channel stays 0 |
| REQ-008 | Evergreen artifacts | No spec/packet/phase ID or spec path introduced into any of the seven output files; `mode-registry.json` byte-unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every `/design:*` command says, per pair, when to use it instead of each sibling and when to defer to the `sk-design` hub; the checker bites when the discriminator is missing, names the wrong sibling set, or unbinds from `deferToHubWhen`
- **SC-002**: `design-command-surface-check.mjs` reports STATUS=PASS, invalid=0, drift=0 with the prior D2 frontmatter parity intact; `node --check` exits 0; `mode-registry.json` is byte-unchanged
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | D2-R3 (command-metadata SSOT + checker) | Landed | `command-metadata.json` and the checker are the surfaces this phase extends |
| Dependency | D2-R5 (outputContract + examples) | Landed | Preserved verbatim; the new field layers on without touching them |
| Dependency | `mode-registry.json` (workflowModes) | Read-only | Sibling allow-set; verified byte-stable after the build |
| Risk | Sibling set drifts from the command roster | Low | The checker enforces the sibling-set-equals-other-four invariant (REQ-002); a self-sibling or short set fails Stage 1 |
| Risk | Body-presence check too brittle | Low | The check matches sibling tokens + a hub line only, not prose; wording stays advisory |
| Risk | Per-pair assertion mistaken for router-replay | Low | Realized deterministically on the named targets; literal D3 fixtures flagged as a separate dimension (see Open Questions) |

### Sibling-set-equals-other-four invariant

Per-pair "right sibling / right hub" coverage is gated on the named targets rather than a cross-dimension fixture corpus. Stage 1 rule 4 requires each command's `preferSiblingWhen` to be exactly the set of the other four `/design:*` commands (full per-pair matrix, self excluded, each sibling a registry `workflowMode`), and the hub binding `pairWithHubWhen === deferToHubWhen` fixes the deferral target. A `preferSiblingWhen` entry set to the record's own command, or a set that drops or duplicates a command, is rejected with `discriminator.preferSiblingWhen must cover exactly [the other four]`.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: `mode-registry.json` and the wrappers are read-only to the checker (`readFile` only); the registry is verified byte-unchanged, keeping the sibling allow-set authoritative and un-mutated

### Maintainability
- **NFR-M01**: The wrapper sibling-discriminator section is a projection of the SSOT `discriminator`; the body-presence check keeps the projection honest without authoring prose in the wrapper

### Reliability
- **NFR-R01**: The change is additive — every prior frontmatter parity, outputContract, and example check still passes (drift=0), so the discriminator layers on without regressing the existing gate
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A record missing `discriminator`: checker reports STATUS=INVALID at the metadata stage
- A `preferSiblingWhen` sibling set to the record's own command: rejected with `sibling must be one of [the registry modes]` + `must cover exactly [the other four]`
- A `pairWithHubWhen` that diverges from `deferToHubWhen`: rejected by the reconciliation rule

### Error Scenarios
- A `sequence.typicallyBefore` entry not present in `next`: STATUS=INVALID (subset rule)
- A wrapper missing its sibling-discriminator section or a sibling token: `drift>0` on the `discriminator` field

### State Transitions
- Discriminator added to metadata but wrapper section absent: the body-presence channel reports `kind=discriminator` drift until the wrapper mirrors the SSOT
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Seven files: metadata SSOT, five wrappers, one checker; no mode logic touched |
| Risk | 6/25 | Additive validation; reversible per file; frontmatter + prior D2 fields held stable |
| Research | 5/20 | Discriminator lines derived from the child Use-when / When-NOT blocks already in the packets |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Router-replay reconciliation (deferred to D3).** `spec.md` §4/§5 originally named "per-pair replay fixtures asserting the right sibling/hub choice." The named targets for this phase are the five wrappers, `command-metadata.json`, `mode-registry.json`, and `design-command-surface-check.mjs` — none is a router-replay / gold-corpus harness, which belongs to dimension D3 and its own phases. This phase therefore realizes the per-pair assertion **deterministically on the named targets** (the sibling-set-equals-other-four invariant + the hub binding). If the program later wants literal router-replay fixtures over named-intent inputs, that is a follow-on coupled to the D3 routing build, not this phase's scope. No blocker for this phase.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification addendum (NFR, edge cases, complexity)
- Per-command discriminator{whenToUse,preferSiblingWhen,pairWithHubWhen,sequence} + wrapper section + additive surface-check gate
- Sibling set equals exactly the other four; pairWithHubWhen == deferToHubWhen; router-replay deferred to D3
-->
