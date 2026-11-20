# Review Iteration 006

## Dispatcher

- Mode: review, single iteration, LEAF executor (no nested dispatch)
- Run: `fanout-deepseek-flash-max-1795182837437-sws2tv`, generation 1, lineageMode `new`
- Frontier node: `F-1-003` at depth 1 of 3
- Dimension: traceability
- Operator review focus: the whole overlay framework/root layout change end to end. This iteration addressed the focus through its docs-against-code clause at the requirement level: whether the phase 002 requirement rows and their cited engine lines still describe the engine that shipped.

## Files Reviewed

- `specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout/spec.md:63,66,89,109,112,142-147,153,154`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout/plan.md:32,43,62,72`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout/implementation-summary.md:16,64,72`
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:2778-2785` (`isUnderRootSkilled`, `rootSkilledProblem`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:3406-3420` (`layoutMoves`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5484-5496` (`adoptSource`, `legacyAdoptSource`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5558,5562,5639,5651,5654,5660,5667` (the `adoptSource` call sites)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5465-5470,5544-5546` (what the spec's pointers name today)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The phase 002 spec's `adoptSource` evidence pointers no longer resolve, and its caller count is stale** -- `specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout/spec.md:109` -- REQ-002's whole claim is that every `adoptSource` caller follows the new rule, and its verification method is to grep the call sites at named lines. Those lines are wrong today. `spec.md:63` and `:109` place `adoptSource` at `overlay-engine.cjs:5399-5401`; it is at `:5484-5488`. `spec.md:109` places `layoutMoves` at `:3371` with the `.base` name at `:3381-3384`; `layoutMoves` is at `:3406` and its `adoptSource` call is at `:3415`. `spec.md:109` places the two strict-write hints at `:5465` and `:5469`; those lines now hold `isVendoredKey`, and the hints are at `:5558` and `:5562`. `spec.md:89` and `:112` place `hasOverlayCopy` at `:5544` and the `repin.exclude` refusal at `:5556`; `:5544` now sits inside `strictWriteRefusal`, and the excluded-path fallback is at `:5639-5667`. `plan.md:43` and `:62` repeat the same six numbers. The count is stale too: `spec.md:109` and `implementation-summary.md:64` say six callers, while `rg -n 'adoptSource\('` returns eight call sites (`:3415`, `:5558`, `:5562`, `:5639`, `:5651`, `:5654`, `:5660`, `:5667`), the extra three being the `root/skilled` refusal that REQ-003 requires.
   Finding class: `stale-evidence-pointer`
   Scope proof: inside the declared review target's phase 002 packet; names the exact spec and plan lines and the exact engine lines each should point at.
   Affected surface hints: `002-engine-framework-root-source-layout/spec.md:63,89,109,112`; `002-engine-framework-root-source-layout/plan.md:43,62`; `002-engine-framework-root-source-layout/implementation-summary.md:64`; `overlay-engine.cjs:5484-5488`.
   Case: a reviewer verifying REQ-002 runs `rg -n 'adoptSource\(' .skilled/commands/doctor/scripts/overlay-engine.cjs` and gets the definition at `:5484` plus eight callers, none at the six lines the spec names. Following `spec.md:109` to `:5465` lands on `isVendoredKey`, so the requirement cannot be checked as written and the reviewer has to rediscover the call sites.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `002-engine-framework-root-source-layout/spec.md:142-147,153`; `overlay-engine.cjs:2778-2785,3406-3420,5484-5488` | Every requirement's substance holds in the code, but REQ-002's evidence pointers do not resolve, so one row cannot be verified as written. |
| `checklist_evidence` | partial | `002-engine-framework-root-source-layout/plan.md:43`; `002-engine-framework-root-source-layout/implementation-summary.md:64` | The plan's verification checkbox and the summary's caller count both state six callers at six lines; the engine has eight call sites at different lines. |

## Integration Evidence

- `adoptSource` (`overlay-engine.cjs:5484-5488`) implements REQ-001 exactly: `.skilled` maps to `framework`, `.skilled/X` to `framework/X`, and any other `X` to `root/` plus `X` with its leading dots dropped.
- `isUnderRootSkilled` (`:2778-2782`) matches `root/skilled` and `root/skilled/` only, and `rootSkilledProblem` (`:2783-2785`) supplies the REQ-003 remedy text.
- `layoutMoves` (`:3406-3420`) is the single place the relayout plan derives a target from a destination, and it calls `adoptSource(entry.destination)` at `:3415`, so the relayout and the adopt rule cannot diverge.
- `legacyAdoptSource` (`:5492-5494`) is the old dot-dropped rule, used only by the excluded-path fallback at `:5639`, which is what REQ-007 requires.

## Edge Cases

- **The drift is a pointer problem, not a behaviour problem.** Every requirement's substance holds; only the line references and the caller count are stale. Recorded so the finding is not read as a claim that the rule is wrong.
- **The stale numbers were accurate when phase 002 was written.** The engine grew by roughly 85 lines above `adoptSource` before the reviewed range closed, so the pointers drifted rather than being wrong on arrival. Recorded because it changes the fix: re-derive the pointers, do not re-plan the phase.
- **Phase 001's spec was not swept for the same drift.** Recorded as a follow-up rather than a finding: this iteration verified phase 002's pointers because REQ-002 is the one requirement whose verification method is the pointers themselves.
- **Tests were not re-run** for the containment reason recorded in iteration 1. The traceability judgement rests on the spec text and on direct greps of the engine.

## Confirmed-Clean Surfaces

- REQ-001's three-branch rule is implemented in one function with no manifest field able to override it, which is what "for every tree" requires.
- REQ-003's `root/skilled` refusal is implemented in three places that agree: `isUnderRootSkilled` for the manifest check, the adopt refusal at `:5651-5660`, and the relayout refusal in `planRelayout`.
- REQ-007's excluded-path fallback is implemented as a two-candidate lookup (`:5639`) that prefers the new-rule path, which is the order the requirement states.
- `implementation-summary.md:72` names the modified file and the six behaviours it gained, and each of those behaviours is present in the engine.

## Ruled Out

- **REQ-001's rule is not what the code does.** Checked and ruled out: `adoptSource` at `:5484-5488` matches the requirement branch for branch.
- **The relayout derives its targets from a different rule than adopt.** Checked and ruled out: `layoutMoves` calls the same `adoptSource` at `:3415`.
- **The `root/skilled` refusal is missing from one of the three paths.** Checked and ruled out: the manifest check, the adopt refusal and the relayout refusal all route through `isUnderRootSkilled`.
- **The stale pointers mean the phase was never implemented.** Checked and ruled out: every cited behaviour exists, at a different line.

## Next Focus

- Dimension: traceability
- Focus area: frontier node `F-1-007` -- whether the Barter re-pin's own records trace to the Skilled commit they claim, including the `v4.1.0.0` changelog's claims against the vendored tree
- Reason: F-1-003 traceability is complete; F-1-007 is the node whose question is itself a traceability question, so the pass is cheap and the evidence is already partly gathered
- Rotation status: second pass on F-1-007; F-1-003 keeps maintainability open, F-1-005 keeps traceability and maintainability open
- Blocked/productive carry-forward: productive -- the parity comparison from iteration 3 already establishes the byte-level facts this pass needs to trace
- Required evidence: `overlays/framework/changelog/skilled-coder/v4.1.0.0.md` claims, `overlays/overlay-manifest.json` `pin`, `overlays/sync-state.json`, and the phase 004 and 005 spec requirement rows

Review verdict: CONDITIONAL
