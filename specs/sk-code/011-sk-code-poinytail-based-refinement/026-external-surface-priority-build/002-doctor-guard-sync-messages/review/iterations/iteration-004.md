# Review Iteration 4 — Maintainability

**Review target:** the three build commits `4b9bf840b0..HEAD` (HEAD `f9eb84c4fe`) on `worktrees/127-surface-messages`.
**Dimension:** maintainability (iteration 4 of 5; final uncovered dimension).
**Prior state:** P0=0 P1=0 P2=5 (R1-P2-001, R1-P2-002, R2-P2-001 correctness; R3-P2-001, R3-P2-002 carried from traceability), all open.
**Read-only:** the reviewed files were not modified; writes were limited to the review run directory.

## Dimension

Maintainability lens over the changed surfaces and the files as they stand: comment and contract accuracy, duplication and single-source-of-truth, precondition placement, error-path upkeep, and whether the new tests can actually detect a wrong derivation. This dimension does not re-adjudicate the behavior the earlier dimensions own (message correctness, security of the failure paths, requirement traceability) — it asks whether the code and its tests will keep telling the truth after the next edit. Diff under review: 6 files, +114/-13 (`git diff 4b9bf840b0..HEAD -- <scope files>`).

## Files Reviewed

- `.skilled/bin/compiled-route-guard.cjs:13` — header contract "Two divergences are reported"; `:63-83` — `authoredDrift` with the twin derivation at `:70` and the new failure records at `:76` and `:80` [SOURCE: .skilled/bin/compiled-route-guard.cjs:63] [SOURCE: .skilled/bin/compiled-route-guard.cjs:70] [SOURCE: .skilled/bin/compiled-route-guard.cjs:76]
- `.skilled/bin/compiled-route-guard.cjs:174-183` — per-hub rendering of the drift and missing classes [SOURCE: .skilled/bin/compiled-route-guard.cjs:179] [SOURCE: .skilled/bin/compiled-route-guard.cjs:182]
- `.skilled/bin/compiled-route-sync.cjs:41-43` — `SPECS_DIR`/`SPECS_ROOT` resolve-only-when-present; `:1061-1066` — `requireAuthoredRoot`; `:1085` and `:1110` — the two guarded entry points [SOURCE: .skilled/bin/compiled-route-sync.cjs:42] [SOURCE: .skilled/bin/compiled-route-sync.cjs:1061] [SOURCE: .skilled/bin/compiled-route-sync.cjs:1085] [SOURCE: .skilled/bin/compiled-route-sync.cjs:1110]
- `.skilled/bin/tests/compiled-route-manifest.test.cjs:558-578` — sync sandbox test; `:586-600` — drift helper test; `:604-614` — missing helper test [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:558] [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:591] [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:609]
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:496`; `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:656` [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:496]
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml:160` [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:160]
- `.skilled/bin/lib/compiled-route-layout.cjs` (layout selector and `AUTHORED_PROGRAM_DIR` owner) read as the ground-truth contract for both derivations.

## Findings by Severity

### P0 — none

### P1 — none

### P2

#### R4-P2-001 [P2] Guard header comment still declares "Two divergences" after a third failure class was added

- **Case:** A maintainer (or an agent reading the file before editing it) treats the header as the guard's contract. It enumerates two failure divergences, so the new `authored-missing` class is invisible to anyone who reads the file before running it, and the file's own description of what it reports is stale.
- **File:** `.skilled/bin/compiled-route-guard.cjs:13`
- **Evidence:** Line 13 says "Two divergences are reported, because they fail differently" and lists `stale manifest` and `authored drift`. The code now returns a third record, `authored-missing`, at line 76 [SOURCE: .skilled/bin/compiled-route-guard.cjs:76], and `main` prints the third class with its per-hub `restore <path>` fix at lines 179-182 [SOURCE: .skilled/bin/compiled-route-guard.cjs:179]. The `--json` `results` array carries it too, so the emitted taxonomy is three classes while the doc-contract stays at two.
- **User impact:** The comment is the cheapest source of truth for the failure taxonomy; leaving it at two classes misdirects diagnosis of the exact class this change introduced.
- **Finding class:** instance-only
- **Scope proof:** `rg` over `.skilled/bin` finds `authored-missing` only in the guard and its tests; the README enumeration of guard classes is a separate site already open as R3-P2-001; no other in-file comment enumerates the classes.
- **Recommendation:** Enumerate all three classes in the header (or drop the count and let the printed output define the taxonomy).

#### R4-P2-002 [P2] Guard drift/missing tests reuse the implementation's twin formula, so the path assertions cannot catch a wrong authored twin

- **Case:** The authored tree diverges from the runtime generation (e.g. the authored closure still serves `010-live-activation` while the runtime serves `013-live-activation`). The guard derives the authored twin at the runtime-relative path (`.skilled/bin/compiled-route-guard.cjs:70`), which does not exist beside the divergent authored layout, and reports `authored-missing` with a nonexistent path. The new tests cannot detect this: they create their fixture `twin` with the identical expression (`path.join(authoredRoot, path.relative(promotedRuntimeRoot, runtimeManifest))`) and then assert the fix string contains the path of that fixture, so fixture location and assertion share one formula.
- **File:** `.skilled/bin/tests/compiled-route-manifest.test.cjs:591` (same construction at `:609`)
- **Evidence:** `guard.cjs:70` derives `authoredManifest = path.join(authoredRoot, path.relative(runtimeRoot, runtimeManifest))` [SOURCE: .skilled/bin/compiled-route-guard.cjs:70]; test line 591 repeats it verbatim [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:591]; the assertion then checks `path.relative(REPO_ROOT, twin)` — the same computation the implementation used [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:598]. Any derivation error that both share stays green. This is the same divergence class carried as R1-P2-002 (correctness); this finding is the test-side inability to detect it, not a re-report of the production risk.
- **User impact:** The only tests for the new drift/missing messages cannot fail when the named authored path diverges from the real authored layout; a later refactor of the derivation silently changes the named path without a red test.
- **Finding class:** matrix/evidence
- **Scope proof:** The manifest suite requires the guard only for the helper (`compiled-route-manifest.test.cjs:28`); the only guard CLI spawn in the repository is the unknown-option rejection in `typo-flags.test.cjs:106`; no test constructs a divergent-generation authored fixture or asserts against a layout-resolved authored path.
- **Recommendation:** Place the fixture at an independently determined location (create a coherent authored layout and resolve it with `layout.activationRootFor(authoredRoot)`, or use a literal authored path), then add one divergent-generation case; asserting the rendered CLI line (see R3-P2-002) would cover the same gap end to end.

### Prior findings (open, not re-adjudicated)

R1-P2-001, R1-P2-002, R2-P2-001, R3-P2-001 and R3-P2-002 remain open and unchanged by this iteration; none was re-adjudicated here.

## Traceability Checks

| Protocol | Level | Status | Notes |
| --- | --- | --- | --- |
| `spec_code` | core | pass | Carried from iteration 3 (SL-301). Spot-verified at HEAD: REQ-002/REQ-004 map to `guard.cjs:76`/`:179` and `sync.cjs:1061`; the two new findings touch no behavior line, so the mapping stands. |
| `checklist_evidence` | core | partial | Carried from iteration 3 — packet ledger fill is scheduled as T012; not re-entered (exhausted, deferred). |
| `skill_agent` | overlay | notApplicable | Carried (iteration 3): no skill doc restates the changed behavior. |
| `agent_cross_runtime` | overlay | notApplicable | Carried (iteration 3): no runtime agent definition references the changed behavior. |
| `feature_catalog_code` | overlay | partial | Carried (iteration 3): `bin/README.md` catalog drift is R3-P2-001 (open). |
| `playbook_capability` | overlay | notApplicable | Carried (iteration 3): no playbook covers the changed capability. |

All `[SOURCE:]` tags above resolve at HEAD (`compiled-route-guard.cjs` 197 lines, `compiled-route-sync.cjs` 1115+ lines, test file > 600 lines).

## Next Dimension

None — maintainability completes the fourth of four dimensions (`correctness`, `security`, `traceability`, `maintainability`). Iteration 5 remains per the max-iterations stop policy and is available for a closure pass over the seven open P2 findings.

## Verdict

PASS with advisories: no P0 or P1 this iteration; two new P2 maintainability findings.

Review verdict: PASS
