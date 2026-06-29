---
title: "Feature Specification: D2-R8 — Register (Brand/Product) pinnable at command entry"
description: "The /design:* command layer exposed no register pin at entry, so Brand-vs-Product dials were set implicitly and unproven; this phase adds a registerPolicy SSOT, projects a REGISTER wrapper section with a --register flag and STATUS=ASK MISSING_REGISTER, and gates both deterministically."
trigger_phrases:
  - "d2-r8 register pinning"
  - "register pinning design build"
  - "brand product register command entry spec"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/008-register-pinning"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Upgrade spec to Level 2; record resolutionOrder, proofFields isolation, body-only flag"
    next_safe_action: "Run D2-R9 pipeline-handoff-visibility phase for the /design surface"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r8-register-pinning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: D2-R8 — Register (Brand/Product) pinnable at command entry

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
A caller could not pin the Brand-vs-Product **register** at command entry. The `/design:*` wrappers exposed no register flag (evidence: `commands/design/interface.md:3`), so the posture that sets the six downstream dials — density, motion budget, color strategy, token density, audit severity — was decided implicitly and never proven. A genuinely mixed or unlabeled surface fell to an implicit default with no entry-point control and no recorded posture.

### Purpose
Let a caller pin **Brand** or **Product** at command entry and fail closed (ask, not silent default) when the register is unresolved or genuinely mixed. The authoritative content lives in the `command-metadata.json` SSOT as a new `registerPolicy{accepted, default, resolutionOrder, askWhen, proofFields}` object (one per record), derived from `shared/register.md` (resolution order, the six dials, per-mode usage) and `shared/assets/register_card.md` (per-mode dial hand-off). A generator projects an anchor-delimited `## REGISTER` section into the five wrappers carrying the `--register <brand|product>` flag, both postures, this command's dials, and the fail-closed `STATUS=ASK MISSING_REGISTER` token. `design-command-surface-check.mjs` is extended to validate the policy shape and to confirm the wrapper section and tokens are present.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `registerPolicy{accepted, default, resolutionOrder, askWhen, proofFields}` to all five `command-metadata.json` records; `accepted ⊇ {brand, product}`, `default == "auto"`, the shared `resolutionOrder` and `askWhen`, and a per-command `proofFields` that begins with `register`
- Project an anchor-delimited `## REGISTER` body section (Pin-with / Postures / This command's dials / Ask-first) into each of the five wrappers, carrying the `--register` flag and the `STATUS=ASK MISSING_REGISTER` token
- Extend `design-command-surface-check.mjs` additively: `registerPolicy` in `REQUIRED_FIELDS`, a Stage-1 `validateRegisterPolicy` sub-validator, and a Stage-2 `register` body-presence channel

### Out of Scope
- Wrapper frontmatter (`description`, `argument-hint`, `aliases`, `allowed-tools`) — owned by prior D2 work and held byte-stable; `--register` stays body-only
- The prior D2 surfaces (`toolPolicy`, `argumentHint`, `examples`, `outputContract`, `discriminator`, `preconditions`) — preserved verbatim, layered under
- `mode-registry.json`, `shared/register.md`, `shared/assets/register_card.md` — read-only derivation/identity sources, never mutated
- Runtime honoring of `STATUS=ASK MISSING_REGISTER` at invocation time — the gate verifies declaration, not execution
- A literal router-replay / gold-corpus fixture asserting Brand vs Product yield different dial values — a D3 dimension concern, not a named target here
- Any taste or posture-correctness judgment — this is a deterministic command-surface gate only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Add `registerPolicy` block to all five records, preserving every prior field |
| `.opencode/commands/design/audit.md` | Modify | Add `## REGISTER` section (dials `register`, `auditSeverity`) + `STATUS=ASK MISSING_REGISTER` |
| `.opencode/commands/design/foundations.md` | Modify | Add `## REGISTER` section (dials `register`, `colorStrategy`, `tokenDensity`) |
| `.opencode/commands/design/interface.md` | Modify | Add `## REGISTER` section (dials `register`, `density`, `motionBudget`, `colorStrategy`) |
| `.opencode/commands/design/md-generator.md` | Modify | Add `## REGISTER` section (dial `register`) |
| `.opencode/commands/design/motion.md` | Modify | Add `## REGISTER` section (dials `register`, `motionBudget`) |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Additive `registerPolicy` shape validation + Stage-2 register body channel |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | registerPolicy present per command | All five records carry a well-formed `registerPolicy`; `accepted ⊇ {brand,product}`, `default == "auto"`, non-empty `resolutionOrder`/`askWhen`/`proofFields`, `proofFields ∋ register`; checker requires it |
| REQ-002 | REGISTER wrapper section per command | Each wrapper carries the anchor-delimited `## REGISTER` section naming the `--register <brand|product>` flag, both postures, and this command's dials |
| REQ-003 | Fail-closed register token | Every wrapper carries `STATUS=ASK MISSING_REGISTER`, distinct from the generic `STATUS=ASK MISSING=<input>`; both coexist |
| REQ-004 | Surface check passes | `design-command-surface-check.mjs` returns STATUS=PASS, invalid=0, drift=0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Per-command dials are mode-specific | Each `registerPolicy.proofFields` enumerates the dials its register governs (interface 4 / foundations 3 / motion 2 / audit 2 / md-generator 1); the checker asserts those dials appear in the wrapper |
| REQ-006 | No frontmatter regression | Prior D2 frontmatter parity (`description`, `argument-hint`, `aliases`, `allowed-tools`) preserved; frontmatter drift channel stays 0 |
| REQ-007 | proofFields isolation | `registerPolicy.proofFields` is never compared to `outputContract.requiredFields`; the prior record-level `proofFields ⇔ requiredFields` invariant is unchanged |
| REQ-008 | Gate bites on a broken policy | Dropping a record's `registerPolicy` flips the checker to STATUS=INVALID; stripping a wrapper's ASK token flips it to `register` drift |
| REQ-009 | Evergreen artifacts | No spec/packet/phase ID or spec path introduced into any of the seven output files; `mode-registry.json` / `register.md` / `register_card.md` byte-unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every `/design:*` command pins a register stance at entry — a `--register <brand|product>` flag, both postures, this command's dials, and a fail-closed `STATUS=ASK MISSING_REGISTER` route — so an unresolved or mixed register asks rather than silently defaulting, and the register/dials position is an explicit, gated part of the command surface
- **SC-002**: `design-command-surface-check.mjs` reports STATUS=PASS, invalid=0, drift=0 with the prior D2 parity (preconditions, discriminator, outputContract, examples, frontmatter) intact; dropping a `registerPolicy` flips it to STATUS=INVALID (`missing required field registerPolicy`); `node --check` exits 0; `mode-registry.json` / `register.md` / `register_card.md` are byte-unchanged
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | D2-R3 (command-metadata SSOT + checker) | Landed | `command-metadata.json` and the checker are the surfaces this phase extends |
| Dependency | D2-R5/R6/R7 (outputContract, examples, discriminator, preconditions) | Landed | Preserved verbatim; `registerPolicy` layers on without touching them |
| Dependency | `shared/register.md` + `shared/assets/register_card.md` | Read-only | Derivation source for `resolutionOrder`, the six dials, and per-command usage; verified byte-stable |
| Dependency | `mode-registry.json` (workflowModes) | Read-only | Command allow-set; verified byte-stable after the build |
| Risk | `registerPolicy.proofFields` conflated with `outputContract.requiredFields` | Low | Isolation rule (REQ-007): the new nested field is validated only by `validateRegisterPolicy`; the record-level invariant at checker line 471 is never touched |
| Risk | Body-presence check too brittle | Low | The check matches the flag, both postures, the ASK token, and the dials only, not prose; wording stays advisory |
| Risk | Register token mistaken for runtime enforcement | Low | The gate verifies declaration at the command surface; runtime honoring of `STATUS=ASK MISSING_REGISTER` is flagged as the caller's job |

### resolutionOrder decision (declaredRegister ahead of taskCue)
`registerPolicy.resolutionOrder` is `["explicitFlag", "declaredRegister", "taskCue", "surfaceInFocus", "safeDefault"]`. `register.md` lists the resolution under "first match wins" as task-cue then surface then declared, yet also calls a declared register "authoritative if present." This phase places `declaredRegister` ahead of `taskCue` to honor the "authoritative" clause: an explicit caller pin wins first, a declared `register` field in PRODUCT.md / DESIGN.md next, then the task cue, then the surface in focus, then the safe default. A genuinely mixed or unresolved surface does not default — it triggers `askWhen` and emits `STATUS=ASK MISSING_REGISTER`.

### proofFields isolation decision
`registerPolicy.proofFields` deliberately mirrors the record-level `proofFields` name but is a separate nested field. The checker validates `registerPolicy.proofFields` only inside `validateRegisterPolicy` (non-empty string array containing `register`); it is never compared to `outputContract.requiredFields`. The prior record-level `proofFields ⇔ outputContract.requiredFields` invariant stays exactly as is, so the new field cannot silently break the output contract gate.

### body-only --register decision
`--register` is declared body-only (in the `## REGISTER` section and `registerPolicy.accepted`), matching the D2-R6/R7 convention that wrapper frontmatter stays byte-unchanged. It is not promoted into each command's `argument-hint`, which would require moving the metadata `argumentHint` and the frontmatter `argument-hint` in lockstep. Promoting `--register` into the argument grammar is flagged as an operator decision, not done here, to preserve the frontmatter byte-for-byte and keep the frontmatter drift channel at 0.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: `mode-registry.json`, `register.md`, and `register_card.md` are read-only to the checker (`readFile` only) and verified byte-unchanged, keeping the derivation and identity sources authoritative and un-mutated

### Maintainability
- **NFR-M01**: The wrapper `## REGISTER` section is a projection of the SSOT `registerPolicy`; the body-presence channel keeps the projection honest without authoring posture prose in the wrapper

### Reliability
- **NFR-R01**: The change is additive — every prior frontmatter parity, preconditions, discriminator, outputContract, and example channel still reports drift=0, so the register contract layers on without regressing the existing gate
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A record missing `registerPolicy`: checker reports STATUS=INVALID (`missing required field registerPolicy`) at the metadata stage
- A `registerPolicy.default` other than `auto`: rejected with `registerPolicy.default must be auto`
- A `registerPolicy.proofFields` that omits `register`: rejected with `registerPolicy.proofFields must include register`

### Error Scenarios
- A wrapper missing the `STATUS=ASK MISSING_REGISTER` token: reported as `kind=register` drift
- A wrapper whose `## REGISTER` block omits a dial named in its `registerPolicy.proofFields`: `kind=register` drift (per-command dial coverage)

### State Transitions
- `registerPolicy` added to metadata but the wrapper section absent: the register body channel reports drift until the wrapper mirrors the SSOT (the correct mid-build state, identical to the D2-R3 pattern)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Seven files: metadata SSOT, five wrappers, one checker; no mode logic touched |
| Risk | 6/25 | Additive validation; reversible per file; frontmatter + prior D2 fields held stable |
| Research | 5/20 | Register dials derived from the read-only `register.md` / `register_card.md` already in the skill |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **resolutionOrder priority (resolved here, operator may override).** `register.md` is internally ambiguous: its "first match wins" list puts task-cue first while a separate clause calls a declared register "authoritative." This phase resolves it by placing `declaredRegister` ahead of `taskCue`; the literal numeric order (task-cue first) is the alternative if the operator prefers it. No blocker for this phase.
- **Literal Brand≠Product dial-value fixture (out of this phase).** The spec's "fixtures assert Brand≠Product dials" is realized here deterministically as per-command dial enumeration on the named targets (each `proofFields` is mode-specific and the checker asserts those dials appear in the wrapper). A runtime fixture asserting Brand vs Product produce different dial values is a D3 router-replay / gold-corpus concern, coupled to a different dimension's build, not this phase's named targets. No blocker for this phase.
- **`--register` in the argument-hint (out of this phase).** The flag is declared body-only to keep the wrapper frontmatter byte-unchanged. Promoting it into each command's `argument-hint` (frontmatter + metadata in lockstep) is an operator decision; this phase does not do it. No blocker for this phase.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification addendum (NFR, edge cases, complexity)
- Per-command registerPolicy{accepted,default:auto,resolutionOrder,askWhen,proofFields} + REGISTER wrapper section (--register flag + dials + STATUS=ASK MISSING_REGISTER) + additive surface-check gate
- proofFields isolated from outputContract.requiredFields; --register body-only; surface-check PASS invalid=0 drift=0
-->
