---
title: "Implementation Summary: D2-R7 — Preconditions & named failure modes for /design:*"
description: "Every /design:* command now declares its required input and named failure routes in the metadata SSOT, projected into a PRECONDITIONS wrapper section, with a named Return-Status grammar (ASK MISSING / FAIL ERROR=<cause> / DEFER ROUTE) replacing the bare status-only placeholder and gated by the surface checker."
trigger_phrases:
  - "d2-r7 preconditions failure modes implementation summary"
  - "design command preconditions delivered"
  - "named failure grammar design surface summary"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/007-preconditions-and-failure-modes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author Level 2 impl doc for the preconditions and named failure-mode gate"
    next_safe_action: "Run D2-R8 register-pinning phase for the /design surface"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r7-preconditions-and-failure-modes"
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
| **Spec Folder** | 007-preconditions-and-failure-modes |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every `/design:*` command now declares the input it requires and what it does when that input is missing or it cannot run. Before this phase a missing URL, target, or component collapsed to a byte-generic `STATUS=FAIL ERROR="<message>"` tail, so the command layer named no required input, no readiness condition, and no failure route (evidence: `commands/design/md-generator.md:26` named no preconditions). The required input and the failure behavior are now a first-class `preconditions` contract in the `command-metadata.json` SSOT, projected into each wrapper as a PRECONDITIONS section, and enforced by `design-command-surface-check.mjs` so a missing input asks, an unmet precondition fails closed with a named cause, and a wrong-command case routes.

### The preconditions contract per command

Each of the five `command-metadata.json` records gained a `preconditions{requiredInputKind, missingInputQuestion, cannotRunWhen, escalateIf, routeInstead}` object, every sub-field a non-empty string. The block layers on top of the prior D2 fields: the existing `outputContract`, `examples`, `discriminator`, and every other record field are preserved verbatim. Each precondition string reconciles with the same record's existing `accepts` (the required input kind), `argumentHint` (the input tokens the `missingInputQuestion` asks for), and `deferToHubWhen` (the `routeInstead` condition), so the new contract cannot silently diverge from what the command already declares it takes.

### The PRECONDITIONS wrapper sections

Each of the five wrappers gained a `## 3. PRECONDITIONS` body section projected from its `preconditions` block (`commands/design/audit.md:28`). The section carries five markers: **Requires**, **Ask-first**, **Cannot-run**, **Escalate**, and **Route instead**. Wrapper frontmatter (`description`, `argument-hint`, `allowed-tools`) and the prior D2 `EMIT DELIVERABLE`, `EXAMPLE`, and `WHEN TO USE` sections were left untouched, so the earlier D2 parity holds and the frontmatter drift channel stays at zero.

### The named Return-Status grammar

The Return-Status step in each wrapper was upgraded from the bare `ERROR="<message>"` placeholder to a named-token grammar: `STATUS=OK` for success, `STATUS=ASK MISSING=<input>` when a required input is absent, `STATUS=FAIL ERROR=<named-cause>` when an unmet precondition fails the command closed, and `STATUS=DEFER ROUTE=<target>` when a wrong-command case should route back to the hub or a sibling. The status-only failure form is gone from all five wrappers; every failure path now names a cause and a route.

### The surface-check extension

`design-command-surface-check.mjs` was extended additively. Stage 1 added `preconditions` to `REQUIRED_FIELDS` with sub-field validation: each of the five sub-fields must be a non-empty string, and a record missing the block or carrying an empty sub-field fails with `STATUS=INVALID`. Stage 2 added a wrapper-body channel that requires the four PRECONDITIONS markers, forbids the bare `ERROR="<message>"` status-only form, and requires the named-route tokens; any missing marker or surviving placeholder folds into the single `drift` total. The prior Stage-1 and Stage-2 rules (frontmatter drift, `ownerMode ∈ workflowMode`, alias-uniqueness, outputContract, examples, discriminator) are unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/command-metadata.json` | Modified | Added `preconditions` block to all five records, preserving outputContract + examples + discriminator + every prior field |
| `.opencode/commands/design/audit.md` | Modified | Added `## 3. PRECONDITIONS` section + named Return-Status grammar |
| `.opencode/commands/design/foundations.md` | Modified | Same projected section + named grammar for `foundations` |
| `.opencode/commands/design/interface.md` | Modified | Same projected section + named grammar for `interface` |
| `.opencode/commands/design/md-generator.md` | Modified | Same projected section + named grammar for `md-generator` |
| `.opencode/commands/design/motion.md` | Modified | Same projected section + named grammar for `motion` |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modified | Additive Stage 1 `preconditions` shape + non-empty sub-field validation; Stage 2 body markers, status-only-failure ban, named-route token requirement |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) edited the seven scope-locked files; `mode-registry.json` was read-only and verified byte-unchanged. The orchestrator then verified acceptance independently. `node design-command-surface-check.mjs` returns `STATUS=PASS`, `invalid=0`, `drift=0`: the new `preconditions` shape, the five PRECONDITIONS wrapper sections, the named-route grammar, and the prior D2 surfaces (discriminator, outputContract, examples, frontmatter) all pass. The named tokens (`FAIL ERROR=`, `ASK MISSING=`, `DEFER ROUTE=`) are present 5/5 and the bare `ERROR="<message>"` placeholder is gone (0/5). A synthetic break (a record with an empty `preconditions.cannotRunWhen`) flips the checker to `STATUS=INVALID` with `preconditions.cannotRunWhen must be a non-empty string` and `invalid=1`; restoring returns `invalid=0 drift=0`, proving the gate bites. `command-metadata.json` is valid JSON with five records, `node --check` on the checker exits 0, all prior D2 surfaces are preserved, and the evergreen grep is clean.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Authored the contract once in the metadata SSOT and projected it to the wrappers | Closes the gap at the source so a missing precondition fails one gate, not five hand-edited wrappers |
| Required all five `preconditions` sub-fields to be non-empty strings | A dropped or blank sub-field (required input, missing-input question, cannot-run, escalate, route) fails Stage 1, so the contract cannot ship half-declared |
| Banned the bare `ERROR="<message>"` form and required named-route tokens | Replaces a silent status-only failure with a named cause and a named route the checker can verify, not just prose advice |
| Mapped each failure mode to a distinct named status (ASK / FAIL / DEFER) | A missing input asks, an unmet precondition fails closed with a cause, and a wrong-command case routes, so the three outcomes stay legible to the caller |
| Reconciled each `preconditions` string with `accepts` / `argumentHint` / `deferToHubWhen` | Keeps the new contract consistent with what the command already declares it takes, so the required input cannot drift from the argument grammar |
| Matched the body check on the four markers + token presence only | Avoids enforcing prose, so the check stays robust to editorial wording while proving the section and the named grammar are present |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node design-command-surface-check.mjs` | PASS (STATUS=PASS, invalid=0, drift=0) |
| `node --check design-command-surface-check.mjs` | PASS (NODE_CHECK=OK, exit 0) |
| `command-metadata.json` valid JSON, five `preconditions` blocks | PASS (records=5; `"preconditions"` count = 5) |
| `## 3. PRECONDITIONS` section in five wrappers (Requires/Ask-first/Cannot-run/Escalate/Route instead) | PASS (5/5; e.g. audit.md:28) |
| Named grammar present (`FAIL ERROR=`, `ASK MISSING=`, `DEFER ROUTE=`) | PASS (5/5 each) |
| Bare `ERROR="<message>"` status-only placeholder removed | PASS (0/5) |
| Synthetic break: empty `preconditions.cannotRunWhen` | PASS (STATUS=INVALID, "preconditions.cannotRunWhen must be a non-empty string", invalid=1); reverted to invalid=0 drift=0 |
| No-regression: prior D2 parity preserved (discriminator, outputContract, examples, frontmatter drift=0) | PASS |
| `mode-registry.json` byte-unchanged | PASS (`git diff` empty) |
| Evergreen (no spec/packet/phase IDs in the seven files) | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Precondition wording is advisory.** The checker proves the five sub-fields exist and are non-empty and that the wrapper carries the markers and named tokens, never that the prose reads well; the `requiredInputKind` / `missingInputQuestion` phrasing can be tuned later without changing the gate.
2. **Runtime enforcement is the caller's job.** The gate verifies that each command *declares* its preconditions and named failure routes; it does not execute the commands, so honoring `STATUS=ASK` / `STATUS=FAIL` / `STATUS=DEFER` at invocation time is the runtime's responsibility.
3. **Generated metadata is regenerated downstream.** `description.json` and `graph-metadata.json` are owned by the generation step; `validate.sh --strict` reports the expected `GENERATED_METADATA` residual after this doc edit, and the orchestrator regenerates them rather than hand-editing.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification addendum
- Per-command preconditions{requiredInputKind,missingInputQuestion,cannotRunWhen,escalateIf,routeInstead} + PRECONDITIONS wrapper section + named Return-Status grammar + additive surface-check gate
- Surface-check PASS (invalid=0 drift=0); empty-cannotRunWhen synthetic break proves the gate bites; bare ERROR placeholder removed; prior D2 parity preserved; mode-registry untouched
-->
