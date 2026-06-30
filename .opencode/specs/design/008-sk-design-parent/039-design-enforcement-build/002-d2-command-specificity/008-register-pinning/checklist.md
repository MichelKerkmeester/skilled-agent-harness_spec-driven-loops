---
title: "Verification Checklist: D2-R8 — register (Brand/Product) pinnable at command entry"
description: "Acceptance gates for adding registerPolicy to command-metadata.json, projecting the REGISTER wrapper sections with a --register flag and STATUS=ASK MISSING_REGISTER, and extending design-command-surface-check.mjs; populated with checker evidence during the build."
trigger_phrases:
  - "d2-r8 register pinning checklist"
  - "design command register policy checklist"
  - "brand product register command entry checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/008-register-pinning"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verify all 34 checklist items with checker evidence; recompute counts"
    next_safe_action: "Run D2-R9 pipeline-handoff-visibility phase for the /design surface"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r8-register-pinning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: D2-R8 — register (Brand/Product) pinnable at command entry

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

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

- [x] CHK-001 [P0] D2-R7 baseline confirmed green before any edit (`node design-command-surface-check.mjs` → `invalid=0 drift=0`)
  - **Evidence**: pre-build surface-check baseline `invalid=0 drift=0` (D2-R7 PASS); the additive build re-confirms STATUS=PASS
- [x] CHK-002 [P0] `registerPolicy` sub-schema documented in plan.md (`accepted`, `default`, `resolutionOrder`, `askWhen`, `proofFields`)
  - **Evidence**: `plan.md` §3 "registerPolicy data shape" + reconciliation rules enumerate all five sub-fields
- [x] CHK-003 [P1] Per-command dial subsets authored in plan.md §3 matrix, derived from `register.md` §3/§4 + `register_card.md` §3, provenance recorded
  - **Evidence**: `plan.md` §3 "Authored registerPolicy matrix" maps each command to its `proofFields` with `register.md` §4 provenance
- [x] CHK-004 [P0] Scope frozen to `command-metadata.json` + the five wrappers (body-only) + the checker; `mode-registry.json` / `register.md` / `register_card.md` read-only
  - **Evidence**: `git status --porcelain` lists exactly the 7 targets; the three read-only sources `git diff` empty

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `command-metadata.json` parses; all 5 records carry a well-formed `registerPolicy` (`accepted ⊇ {brand,product}`, `default == "auto"`, non-empty `resolutionOrder`/`askWhen`/`proofFields`, `proofFields ∋ register`)
  - **Evidence**: valid JSON; per-record dump shows `accepted=["brand","product"]`, `default="auto"`, `proofFields ∋ register` on all 5; Stage 1 `invalid=0`
- [x] CHK-011 [P0] Checker still resolves all paths via `import.meta.url` — no hardcoded absolute or spec paths after the edit
  - **Evidence**: path resolution unchanged; no absolute or spec paths introduced by the register additions
- [x] CHK-012 [P1] Checker remains stateless/deterministic (sorted output incl. the new `register` sort key, no timestamps, no `/tmp` state)
  - **Evidence**: sorted, timestamp-free output; `register` folded into the drift sort order so two runs are byte-identical
- [x] CHK-013 [P1] `node --check design-command-surface-check.mjs` passes (checker was edited)
  - **Evidence**: `node --check` → NODE_CHECK=OK (exit 0)

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Each command carries a register pin per the spec — the `REGISTER` anchor block names the `--register <brand|product>` flag, both postures, this command's dials, and `STATUS=ASK MISSING_REGISTER`
  - **Evidence**: `## REGISTER` 5/5; each block names `--register`, both postures, its `proofFields` dials, and `STATUS=ASK MISSING_REGISTER` (e.g. interface.md:37)
- [x] CHK-021 [P0] `registerPolicy.default == "auto"` and `resolutionOrder` is present on every record (entry resolution, not silent pick)
  - **Evidence**: all 5 records `default="auto"`; `resolutionOrder=["explicitFlag","declaredRegister","taskCue","surfaceInFocus","safeDefault"]`
- [x] CHK-022 [P0] Every record's `registerPolicy.proofFields` enumerates the dials the register sets for that command (interface 4 / foundations 3 / motion 2 / audit 2 / md-generator 1), each starting with `register`
  - **Evidence**: interface `[register,density,motionBudget,colorStrategy]`, foundations `[register,colorStrategy,tokenDensity]`, motion `[register,motionBudget]`, audit `[register,auditSeverity]`, md-generator `[register]`
- [x] CHK-023 [P0] The fail-closed token `STATUS=ASK MISSING_REGISTER` is present in all five wrappers and distinct from the generic `STATUS=ASK MISSING=<input>` (both coexist)
  - **Evidence**: `STATUS=ASK MISSING_REGISTER` 5/5; coexists with the preconditions `STATUS=ASK MISSING=<input>` token (e.g. interface.md:31 vs :42)
- [x] CHK-024 [P0] `node design-command-surface-check.mjs` exits 0 with `invalid=0 drift=0`
  - **Evidence**: `STATUS=PASS STAGE=complete` / `SUMMARY invalid=0 drift=0`, exit 0
- [x] CHK-025 [P0] No-regression: the frontmatter, example, emit-deliverable, discriminator, and preconditions drift channels all stay 0
  - **Evidence**: overall `drift=0` with the new register channel added; prior D2 parity intact
- [x] CHK-026 [P1] Exit-code contract preserved (0 = pass / 1 = drift / 2 = invalid metadata or usage error)
  - **Evidence**: PASS exit 0; metadata violation exit 2; drift exit 1 — contract unchanged by the additive channel
- [x] CHK-027 [P1] Synthetic break A — dropping a record's `registerPolicy` flips the checker to exit 2 (INVALID); restoring returns `invalid=0`
  - **Evidence**: STATUS=INVALID "missing required field registerPolicy", invalid=1; restored → invalid=0 drift=0
- [x] CHK-028 [P1] Synthetic break B — stripping `STATUS=ASK MISSING_REGISTER` from a wrapper flips the checker to `kind=register` drift, exit 1; restoring returns `drift=0`
  - **Evidence**: the register channel asserts the token (checker line 603); stripping it raises `kind=register` drift; restoring → drift=0

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding fixed at the source: the register policy is authored once in the SSOT and projected to the wrappers — not hand-patched per wrapper
  - **Evidence**: `registerPolicy` authored once per record in `command-metadata.json`; wrappers project it; the register body channel keeps the projection honest
- [x] CHK-FIX-002 [P0] Every command — not just `interface` — pins a register stance and a fail-closed `STATUS=ASK MISSING_REGISTER` route (esp. audit / foundations / interface per the spec)
  - **Evidence**: `## REGISTER` + `STATUS=ASK MISSING_REGISTER` 5/5 across audit/foundations/interface/md-generator/motion
- [x] CHK-FIX-003 [P0] Per-command Brand≠Product dials are deterministically gated on the named targets — each `registerPolicy.proofFields` is mode-specific and the checker asserts those dials appear in the wrapper
  - **Evidence**: five distinct `proofFields`; `expectedRegisterDrift` loops every `proofFields` dial against the wrapper block (checker line 613)
- [x] CHK-FIX-004 [P1] Spec's "fixtures assert Brand≠Product dials" reconciliation recorded as a flagged open decision (D3 router-replay/gold-corpus is a different dimension / not a named target here)
  - **Evidence**: `spec.md` §10 OPEN QUESTIONS + `plan.md` "Scope decision — the spec's fixtures" record the realization as per-command dial enumeration
- [x] CHK-FIX-005 [P1] `registerPolicy.proofFields` isolation verified: it is never compared to `outputContract.requiredFields`; the prior `proofFields ⇔ requiredFields` invariant is unchanged
  - **Evidence**: `validateRegisterPolicy` validates `registerPolicy.proofFields` only; checker line 471 still compares record-level `proofFields` to `requiredFields` only
- [x] CHK-FIX-006 [P1] Evidence pinned to the deterministic checker report (`SUMMARY invalid=0 drift=0`), re-runnable on demand
  - **Evidence**: `node design-command-surface-check.mjs` → `SUMMARY invalid=0 drift=0` reproducible on demand

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `mode-registry.json`, `register.md`, and `register_card.md` are byte-unchanged (read-only sources, not mutated)
  - **Evidence**: `git diff` on all three read-only sources empty
- [x] CHK-031 [P0] No file outside `command-metadata.json` + the five wrappers + the checker is created or modified
  - **Evidence**: `git status --porcelain` under `sk-design` + `commands/design` lists exactly the 7 targets
- [x] CHK-032 [P1] The checker still treats the wrappers and the read-only sources as read-only (`readFile` only, no write/edit)
  - **Evidence**: the register channel reads wrappers via `readFile` only; no write/edit calls added

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] plan.md / tasks.md / checklist.md synchronized on the `registerPolicy` schema, the wrapper `REGISTER` grammar, and the additive `drift=0` outcome
  - **Evidence**: all three describe the same five-field `registerPolicy`, the REGISTER section grammar, and STATUS=PASS invalid=0 drift=0
- [x] CHK-041 [P1] The additive coupling to D2-R3 documented (one nested object on the frozen record shape; prior D2 fields/sections unaffected)
  - **Evidence**: `plan.md` §6 coupling note; `spec.md` §6 dependency rows; prior D2 surfaces preserved verbatim
- [x] CHK-042 [P1] Wording stays advisory; the checker enforces policy shape + flag/ASK/dial presence only, never the posture call on a mixed surface (documented)
  - **Evidence**: `spec.md` §6 risk row + `implementation-summary.md` Known Limitation 1
- [x] CHK-043 [P1] The `--register`-in-argument-hint and the literal Brand≠Product-fixture variants documented as flagged operator decisions (frontmatter `open_questions`)
  - **Evidence**: `spec.md` §10 OPEN QUESTIONS; `plan.md` frontmatter `answered_questions` records both resolutions

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] `command-metadata.json` carries NO spec/packet/phase IDs or spec paths (evergreen [HARD])
  - **Evidence**: data file review; evergreen grep clean
- [x] CHK-051 [P0] The five wrappers carry NO spec/packet/phase IDs or spec paths (evergreen [HARD])
  - **Evidence**: wrapper review after projection; evergreen grep clean
- [x] CHK-052 [P0] `design-command-surface-check.mjs` carries NO spec/packet/phase IDs or spec paths (paths resolved from `import.meta.url`) (evergreen [HARD])
  - **Evidence**: checker resolves paths via `import.meta.url`; grep clean
- [x] CHK-053 [P1] No temp files created outside `scratch/`
  - **Evidence**: only the 7 intended runtime artifacts touched; no stray temp files

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 19 | 19/19 |
| P1 Items | 15 | 15/15 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: Build verification (registerPolicy on five records; `## REGISTER` + `STATUS=ASK MISSING_REGISTER` in five wrappers; surface-check STATUS=PASS invalid=0 drift=0; dropped-registerPolicy synthetic break flips to STATUS=INVALID invalid=1; proofFields isolated from outputContract.requiredFields; prior D2 parity preserved; register.md/register_card.md/mode-registry byte-unchanged; evergreen clean)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified during the build
P0 must complete, P1 need approval to defer
-->
