---
title: "Implementation Summary: D2-R8 — Register (Brand/Product) pinnable at command entry"
description: "Every /design:* command now pins a Brand-vs-Product register at entry: a registerPolicy SSOT on five records, a projected REGISTER wrapper section with a --register flag and a fail-closed STATUS=ASK MISSING_REGISTER token, and an additive surface-check channel — the per-command dials are now an explicit, gated part of the command surface."
trigger_phrases:
  - "d2-r8 register pinning implementation summary"
  - "design command register policy delivered"
  - "brand product register command entry summary"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/008-register-pinning"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author Level 2 impl doc for the register-pinning command-surface gate"
    next_safe_action: "Run D2-R9 pipeline-handoff-visibility phase for the /design surface"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r8-register-pinning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-register-pinning |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every `/design:*` command now lets a caller pin the Brand-vs-Product **register** at command entry, and fails closed with a question when the register is unresolved. Before this phase the wrappers exposed no register flag (evidence: `commands/design/interface.md:3`), so the posture that sets the downstream dials — density, motion budget, color strategy, token density, audit severity — was decided implicitly and never proven. The register/dials stance is now a first-class `registerPolicy` contract in the `command-metadata.json` SSOT, projected into each wrapper as a `## REGISTER` section, and gated by `design-command-surface-check.mjs` so an unresolved register asks rather than silently defaulting.

### The registerPolicy contract per command

Each of the five `command-metadata.json` records gained a `registerPolicy{accepted, default, resolutionOrder, askWhen, proofFields}` object. `accepted` is `["brand", "product"]`, `default` is `"auto"`, and the `resolutionOrder` is shared across all five: `["explicitFlag", "declaredRegister", "taskCue", "surfaceInFocus", "safeDefault"]` — an explicit caller pin wins first, then a declared register field, then the task cue, then the surface in focus, then the safe default; a genuinely mixed surface does not default but triggers `askWhen`. The `proofFields` list is per-command and pins the specific dials that command's register governs: interface `["register","density","motionBudget","colorStrategy"]`, foundations `["register","colorStrategy","tokenDensity"]`, interface and motion and audit each different — `motion ["register","motionBudget"]`, `audit ["register","auditSeverity"]`, and `md-generator ["register"]` records the captured posture with no dials set. Every prior D2 field on the record — `toolPolicy`, `argumentHint`, `examples`, `outputContract`, `discriminator`, `preconditions` — is preserved verbatim; `registerPolicy` layers on top.

### The REGISTER wrapper sections

Each of the five wrappers gained an anchor-delimited `## REGISTER` body section (the `register` anchor-comment pair is the deterministic extraction handle), inserted after `## 3. PRECONDITIONS` and before `## 4. INSTRUCTIONS` because the register is an entry precondition. The section carries four lines: **Pin with** (the `--register <brand|product>` flag and how `auto` resolves), **Postures** (what Brand vs Product weights for this command), **This command's dials** (the `proofFields` for this record), and **Ask-first** (the fail-closed route). Wrapper frontmatter (`description`, `argument-hint`, `aliases`, `allowed-tools`) and the prior D2 sections were left untouched, so the earlier parity holds and the frontmatter drift channel stays at zero.

### The fail-closed register token

Every wrapper carries `STATUS=ASK MISSING_REGISTER` in its Ask-first line: when the register is unresolved or the surface is genuinely mixed, the command asks "Is this a Brand surface (design IS the product) or a Product surface (design SERVES the product)?" rather than guessing the posture. This token is deliberately distinct from the generic `STATUS=ASK MISSING=<input>` token the D2-R7 preconditions channel requires; both coexist in every wrapper, so an unresolved register fails closed with its own named question.

### The surface-check extension

`design-command-surface-check.mjs` was extended additively. Stage 1 added `registerPolicy` to `REQUIRED_FIELDS` and a `validateRegisterPolicy(record, command)` sub-validator: `registerPolicy` must be an object; `accepted` a non-empty string array containing both `brand` and `product`; `default` a non-empty string equal to `auto`; `resolutionOrder` and `askWhen` non-empty; `proofFields` a non-empty string array containing `register`. Stage 2 added an `expectedRegisterDrift(record, markdown)` body channel that extracts the `register` anchor block and asserts the `--register` flag, both postures, the `STATUS=ASK MISSING_REGISTER` token, and every dial named in this record's `proofFields`; any miss folds into the single `drift` total on a `kind=register` line. The new `registerPolicy.proofFields` is validated only here — it is never compared to `outputContract.requiredFields`, so the prior record-level `proofFields ⇔ requiredFields` invariant (checker line 471) is untouched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/command-metadata.json` | Modified | Added `registerPolicy` block to all five records, preserving every prior D2 field |
| `.opencode/commands/design/audit.md` | Modified | Added `## REGISTER` section (dials `register`, `auditSeverity`) + `STATUS=ASK MISSING_REGISTER` |
| `.opencode/commands/design/foundations.md` | Modified | Same projected section (dials `register`, `colorStrategy`, `tokenDensity`) |
| `.opencode/commands/design/interface.md` | Modified | Same projected section (dials `register`, `density`, `motionBudget`, `colorStrategy`) |
| `.opencode/commands/design/md-generator.md` | Modified | Same projected section (dial `register`) |
| `.opencode/commands/design/motion.md` | Modified | Same projected section (dials `register`, `motionBudget`) |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modified | Additive `registerPolicy` in `REQUIRED_FIELDS` + `validateRegisterPolicy` Stage 1 + `expectedRegisterDrift` Stage-2 register channel |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) edited the seven scope-locked files; `register.md`, `register_card.md`, and `mode-registry.json` were read-only and verified byte-unchanged. The orchestrator then verified acceptance independently. `node design-command-surface-check.mjs` returns `STATUS=PASS`, `invalid=0`, `drift=0`: the new `registerPolicy` shape, the five `## REGISTER` wrapper sections, the per-command dial coverage, and the prior D2 surfaces (preconditions, discriminator, outputContract, examples, frontmatter) all pass. The `## REGISTER` section is present 5/5 and `STATUS=ASK MISSING_REGISTER` is present 5/5, coexisting with the generic `STATUS=ASK MISSING=<input>` precondition token. A synthetic break (dropping a record's `registerPolicy`) flips the checker to `STATUS=INVALID` with `missing required field registerPolicy` and `invalid=1`; restoring returns `invalid=0 drift=0`, proving the gate bites. `command-metadata.json` is valid JSON with five records, `node --check` on the checker exits 0, the `outputContract.requiredFields ⇔ proofFields` isolation invariant is intact, and the evergreen grep is clean.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Authored the policy once in the metadata SSOT and projected it to the wrappers | Closes the gap at the source so an unresolved register fails one gate, not five hand-edited wrappers |
| Placed `declaredRegister` ahead of `taskCue` in `resolutionOrder` | `register.md` is internally ambiguous; honoring the "a declared register is authoritative" clause keeps an explicit declaration from being overridden by a task heuristic |
| Defaulted to `auto` and routed an unresolved surface to ASK, never a silent posture | `auto` resolves through the order; a genuinely mixed surface asks `STATUS=ASK MISSING_REGISTER` so the dials are never set on a guess |
| Made `proofFields` per-command and mode-specific | interface ≠ foundations ≠ motion ≠ audit ≠ md-generator, so the register's dial reach is a static, per-command guarantee the checker can assert on the wrapper |
| Isolated `registerPolicy.proofFields` from `outputContract.requiredFields` | The nested field reuses the `proofFields` name but is validated only by `validateRegisterPolicy`, so the prior output-contract invariant cannot be silently broken |
| Kept `--register` body-only, not in the argument-hint | Preserves the wrapper frontmatter byte-for-byte (matching the D2-R6/R7 convention), so the frontmatter drift channel stays at zero |
| Matched the body check on the flag, postures, ASK token, and dials only | Avoids enforcing prose, so the check stays robust to editorial wording while proving the section and the named tokens are present |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node design-command-surface-check.mjs` | PASS (STATUS=PASS, invalid=0, drift=0) |
| `node --check design-command-surface-check.mjs` | PASS (NODE_CHECK=OK, exit 0) |
| `command-metadata.json` valid JSON, five `registerPolicy` blocks | PASS (records=5; `accepted ⊇ {brand,product}`, `default=auto`, `proofFields ∋ register`) |
| `## REGISTER` section in five wrappers (Pin-with / Postures / dials / Ask-first) | PASS (5/5; sits after `## 3. PRECONDITIONS`, e.g. interface.md:37) |
| `STATUS=ASK MISSING_REGISTER` present and distinct from `STATUS=ASK MISSING=<input>` | PASS (5/5; both tokens coexist) |
| Per-command dial coverage (interface 4 / foundations 3 / motion 2 / audit 2 / md-generator 1) | PASS (each wrapper names its `proofFields` dials) |
| Synthetic break: drop a record's `registerPolicy` | PASS (STATUS=INVALID, "missing required field registerPolicy", invalid=1); reverted to invalid=0 drift=0 |
| No-regression: prior D2 parity (preconditions, discriminator, outputContract, examples, frontmatter drift=0) | PASS |
| `proofFields ⇔ outputContract.requiredFields` isolation invariant intact | PASS (registerPolicy.proofFields never compared; record-level invariant unchanged) |
| `register.md`, `register_card.md`, `mode-registry.json` byte-unchanged | PASS (`git diff` empty) |
| Evergreen (no spec/packet/phase IDs in the seven files) | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Register wording is advisory.** The checker proves the policy shape exists and that the wrapper carries the flag, both postures, the ASK token, and the dials; it never proves the posture call is correct on a genuinely mixed surface. The phrasing can be tuned later without changing the gate.
2. **Runtime honoring is the caller's job.** The gate verifies that each command declares its register policy and the `STATUS=ASK MISSING_REGISTER` route; it does not execute the commands, so actually asking on an unresolved register at invocation time is the runtime's responsibility.
3. **The Brand≠Product assertion is static, not a runtime fixture.** Per-command dial coverage is enforced deterministically on the named targets; a literal router-replay / gold-corpus fixture asserting Brand vs Product produce different dial values is a D3 dimension follow-on, not a target here.
4. **Generated metadata is regenerated downstream.** `description.json` and `graph-metadata.json` are owned by the generation step; `validate.sh --strict` reports the expected `GENERATED_METADATA` residual after this doc edit, and the orchestrator regenerates them rather than hand-editing.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification addendum
- Per-command registerPolicy{accepted,default:auto,resolutionOrder,askWhen,proofFields} + REGISTER wrapper section (--register flag + dials + STATUS=ASK MISSING_REGISTER) + additive surface-check gate
- Surface-check PASS (invalid=0 drift=0); dropped-registerPolicy synthetic break proves the gate bites; proofFields isolated from outputContract.requiredFields; prior D2 parity preserved; read-only sources untouched
-->
