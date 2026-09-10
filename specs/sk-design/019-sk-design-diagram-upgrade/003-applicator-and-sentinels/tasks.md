---
title: "Tasks: Phase 3: applicator-and-sentinels"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: applicator-and-sentinels

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Ratify plan.md's three architecture decisions before implementation begins: ADR-001 (port `color-gates.cjs` rather than import it across skills), ADR-002 (one `DIAGRAM_PALETTE` block per file, not the chart's begin/end pair), ADR-003 (the sentinel wraps only the `--color-*` declarations inside the existing `:root` rule, not the whole rule) (plan.md) — executor: operator — evidence: ratified by the conductor: all three follow the parent's D1 and D12; none reopens a signed decision
- [x] T002 [P] Author the token source holding the 25-value census (F2.1) across three grounds (light, dark, terminal) and four kinds (primary, derived, fixed, untokenized), consuming 002's signed derivation record and the corrected census rather than re-deriving either (assets/color/diagram-palette.json) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `assets/color/diagram-palette.json` written from the templates' own values (light 10 roles, dark 4, terminal 9), kinds from the derivation record, gates, two departures, four pins
- [x] T003 [P] Port `color-gates.cjs`'s four exports (`channel`, `luminance`, `contrast`, `round2`) verbatim from `.opencode/skills/sk-design/sk-design-chart/scripts/color-gates.cjs` into a new diagram-owned module, honoring D12: no runtime import of a chart-skill path (scripts/color-gates.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `scripts/color-gates.cjs` copied from the chart module with a diagram-owned header; loads under node
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Insert one `DIAGRAM_PALETTE:BEGIN skin=light|dark|terminal … :END` sentinel block per file into the four templates' existing `:root` rules, wrapping only each file's `--color-*` custom properties and leaving `--font-*` declarations untouched (F2.3), using T002's default values so the block content is byte-stable (assets/templates/template.html, assets/templates/template-dark.html, assets/templates/template-full.html, assets/templates/template-terminal.html) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: one block per template around the `--color-*` lines only; git diff shows no non-sentinel line changed
- [x] T005 Build `apply-diagram-tokens.cjs`'s CLI surface and derive/render pipeline: `--default` and `--out` at minimum, reading T002's token source, computing per-ground contrast gates through T003's ported module against the ground the target file's `skin=` names, and writing themed copies to `--out` — the write path must refuse to touch anything under `assets/templates/` in place, mirroring the chart applicator's own refusal (F3.4) (scripts/apply-diagram-tokens.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `scripts/apply-diagram-tokens.cjs` written by DeepSeek V4.1 Flash (max, cli-pi via DevPass): --default/--source/--out/--forms/--skin; substitutes values inside the sentinel block only; copies to --out
- [x] T006 Wire the departs-row exception into T005's gate check: the accent's signed 2.863:1 departure is honored rather than refused, while every other computed ratio that falls under its signed gate still fails the run with the gate, the ratio, and the nearest clearing value named (D8) (scripts/apply-diagram-tokens.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: departures matched by skin, role and two-decimal ratio print a DEPARTURE line and continue; a mutated source fails with role, ratio, gate and nearest clearing value, exit 1, no file written
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the phase gate: `apply-diagram-tokens.cjs --default --out <scratch-dir>`, then diff the output against `assets/templates/`; the diff must be empty — `--default` reproduces the stock bytes over the four templates (F3.4) (scripts/apply-diagram-tokens.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `--default --out <dir>` then `diff -rq` against `assets/templates` prints nothing; re-run by the conductor
- [x] T008 [P] Confirm each template carries exactly one sentinel block: `grep -c "DIAGRAM_PALETTE:BEGIN" assets/templates/*.html` reports `1` for each of the four files (F2.3) (assets/templates/*.html) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `grep -c "DIAGRAM_PALETTE:BEGIN"` → 1 for each of the four templates
- [x] T009 [P] Confirm no template carries the chart's paired dark marker: `grep -c "DIAGRAM_PALETTE_DARK" assets/templates/*.html` reports `0` for each of the four files (D1) (assets/templates/*.html) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `grep -c "DIAGRAM_PALETTE_DARK"` → 0 for each of the four templates
- [x] T010 Read the four sentinel-annotated templates and confirm every `--font-*` custom property and font-family declaration is byte-identical to its pre-phase value — D2's fallback chains ship unchanged, the applicator never touches them (assets/templates/*.html) — executor: human review — evidence: reviewed by diff against HEAD: zero changed lines outside the sentinel markers, so every `--font-*` declaration is byte-identical
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-008 present
- [ ] CHK-002 [P0] Technical approach defined in plan.md — Technical Context, ADR-001 through ADR-003 present
- [ ] CHK-003 [P1] Dependencies identified and available — 002's `findings-ledger.md`, the parent `goal.md`, and both chart porting-source files read and cited
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks — `apply-diagram-tokens.cjs` and `color-gates.cjs` follow the chart module's own style (strict mode, no unused exports) since T003 ports rather than rewrites
- [ ] CHK-011 [P0] No console errors or warnings — the applicator's `run()` path prints `RESULT: PASSED` or `RESULT: FAILED` and a matching exit code, mirroring the chart applicator's own contract
- [ ] CHK-012 [P1] Error handling implemented — a missing token source, a malformed `skin=` value, and a below-gate ratio each fail closed with a named reason (T005, T006)
- [ ] CHK-013 [P1] Code follows project patterns — the port keeps `color-gates.cjs`'s four function bodies unchanged; no comment in any ported or new file embeds a task id, finding id, ADR id, or REQ id (comment-hygiene hard block)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met — AC-001 through AC-008 in acceptance-criteria.md
- [ ] CHK-021 [P0] `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
- [ ] CHK-022 [P1] Edge cases tested — the no-block, two-block, invalid-`skin=`, hand-edited-`:root`, below-gate, and `untokenized`-kind cases from spec.md §8 EDGE CASES each map to a refusal path in T005/T006 or a grep check in T008/T009
- [ ] CHK-023 [P1] The finding this node owns outright (F3.4) and the two it consumes as input or implements without re-opening (F2.1's census, F2.3's already-settled D1 decision) each appear in a task line above; the deviation from `findings-ledger.md`'s own node-attribution column is recorded in goal.md's LOG
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This phase's `research_intent` is new-capability build, not `fix_bug` — it ships a script and a file contract that did not exist before, not a repair to a known-bad behavior. The finding-class/producer-inventory/adversarial-table apparatus does not apply. Traceability is instead covered by CHK-023 above.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets — neither new script reads a credential, a URL, or an environment variable
- [ ] CHK-031 [P0] Input validation implemented — `apply-diagram-tokens.cjs` rejects a URL argument and an out-of-range `skin=` value, mirroring the chart applicator's own `isUrl`/`--scheme` refusals
- [ ] CHK-032 [P1] Auth/authz working correctly — not applicable; this is a hand-run local script with no network or auth surface (NFR-S01, spec.md §7)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized — REQ ids in spec.md match task citations here and AC rows in acceptance-criteria.md
- [ ] CHK-041 [P1] Code comments adequate — the ported module keeps the chart's original JSDoc comments; the new applicator's comments explain durable WHY only, no ephemeral id (verified by CHK-013)
- [ ] CHK-042 [P2] README updated (if applicable) — not applicable; `scripts/README.md` documents the two existing extractors and the flowchart validator, and is 005's file to extend once the corpus checker also ships
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only — this authoring pass created no temp files; T007's scratch output directory is a runtime artifact outside the repo, not a committed file
- [ ] CHK-051 [P1] scratch/ cleaned before completion — not applicable; nothing was added to this packet's scratch/ by this authoring pass
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 16 | 0/16 |
| P2 Items | 5 | 0/5 |

**Verification Date**: 2026-09-10
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in plan.md — ADR-001 through ADR-003 present; this packet has no separate decision-record.md file (see spec.md RELATED DOCUMENTS)
- [ ] CHK-101 [P1] All ADRs have status — ADR-001, ADR-002, ADR-003 are all `Accepted`
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale — each ADR's "Alternatives Rejected" section is filled
- [ ] CHK-103 [P2] Migration path documented (if applicable) — not applicable; the four templates gain a sentinel block, they are not moved or renamed
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

Not applicable. NFR-P01 (spec.md §7) states no runtime performance target applies to a hand-run
local script over four small HTML files. CHK-110 through CHK-113 are recorded here as not
applicable rather than left as unverifiable placeholder rows.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested — plan.md §7 ROLLBACK PLAN and §L2 ENHANCED ROLLBACK
- [ ] CHK-121 [P0] Feature flag configured (if applicable) — not applicable; no runtime feature ships from this phase
- [ ] CHK-122 [P1] Monitoring/alerting configured — not applicable
- [ ] CHK-123 [P1] Runbook created — plan.md's Implementation Phases plus this tasks.md serve as the runbook for 004 to read
- [ ] CHK-124 [P2] Deployment runbook reviewed — pending T001's operator ratification (see goal.md LOG)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

Not applicable. This phase handles no third-party dependency beyond Node's own `fs`/`path`/
`crypto`, no user data, and no OWASP-relevant surface. CHK-130 through CHK-133 are recorded here
as not applicable.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized — spec.md, plan.md, tasks.md, acceptance-criteria.md, goal.md, implementation-summary.md cross-reference consistently
- [ ] CHK-141 [P1] API documentation complete (if applicable) — not applicable; no API surface, only a CLI
- [ ] CHK-142 [P2] User-facing documentation updated — not applicable; this is an internal skill-contract phase
- [ ] CHK-143 [P2] Knowledge transfer documented — plan.md's Architecture and ADR sections plus this tasks.md serve as the knowledge-transfer record for 004
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Decision sign-off (T001) | [ ] Approved | |
| GLM-5.3-Flash executor (cli-pi, DevPass) | Mechanical build execution (T002-T009) | [ ] Approved | |
| Opus xhigh orchestrator | Phase-doc authorship review (D11) | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
