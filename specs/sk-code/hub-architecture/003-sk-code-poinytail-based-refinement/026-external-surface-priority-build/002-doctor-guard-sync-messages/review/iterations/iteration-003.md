# Review Iteration 3 — Traceability

**Review target:** the three build commits `4b9bf840b0..HEAD` (HEAD `f9eb84c4fe`) on `worktrees/127-surface-messages`.
**Dimension:** traceability (iteration 3 of 5).
**Prior state:** P0=0 P1=0 P2=3 (R1-P2-001 and R1-P2-002 correctness, R2-P2-001 security), all open.
**Read-only:** the reviewed files were not modified; writes were limited to the review run directory.

## Dimension

Traceability lens over the changed surfaces: do REQ-001 to REQ-006 and frozen decisions D1 to D6 map to as-stand lines, do the claimed tests T1 to T4 exist with before/after evidence, and do the repo artifacts that describe this behavior (CLI catalog, skill docs, agent definitions, playbooks) still match the code. Core protocols: `spec_code`, `checklist_evidence`. Overlay protocols: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`. The question is not whether the messages are correct (iteration 1 and 2 own that) but whether every claimed behavior has a verifiable path from requirement to code to test to a recorded artifact.

## Files Reviewed

- `.skilled/bin/compiled-route-guard.cjs:63-83` — `authoredDrift` derivation, the `authored-missing` and `authored-drift` records [SOURCE: .skilled/bin/compiled-route-guard.cjs:76] [SOURCE: .skilled/bin/compiled-route-guard.cjs:81]
- `.skilled/bin/compiled-route-guard.cjs:174-183` — `main` per-hub rendering of the drift and missing failures [SOURCE: .skilled/bin/compiled-route-guard.cjs:174] [SOURCE: .skilled/bin/compiled-route-guard.cjs:181]
- `.skilled/bin/compiled-route-sync.cjs:42` — `SPECS_ROOT` resolve-only-when-present; `:1061-1066` — `requireAuthoredRoot` [SOURCE: .skilled/bin/compiled-route-sync.cjs:42] [SOURCE: .skilled/bin/compiled-route-sync.cjs:1061]; `:1085` and `:1110` — the two guarded entry points; `:1115` — the one-line catch [SOURCE: .skilled/bin/compiled-route-sync.cjs:1085] [SOURCE: .skilled/bin/compiled-route-sync.cjs:1110] [SOURCE: .skilled/bin/compiled-route-sync.cjs:1115]
- `.skilled/bin/tests/compiled-route-manifest.test.cjs:28,558-579,585-600,603-615` — the guard require for the helper [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:28], T3 sync spawn [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:572], T2 and T4 helper assertions [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:587] [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:605]
- `.skilled/bin/tests/typo-flags.test.cjs:106` — the only guard CLI spawn in any suite (unknown-option rejection) [SOURCE: .skilled/bin/tests/typo-flags.test.cjs:106]
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:496`; `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:660`; `.skilled/commands/doctor/assets/doctor-update-apply.yaml:160`
- `.skilled/bin/README.md:25,164,165` — the compiled-routing CLI catalog entries for the guard and sync
- `README.md:1445` — the block the 3c line names; `spec.md`, `goal.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, and the three commit bodies

## Findings by Severity

### P0 — none

### P1 — none

### P2

#### R3-P2-001 [P2] The CLI catalog still describes two guard failure classes and no sync authored-root precondition

- **Case:** An operator or agent reads `.skilled/bin/README.md` to learn what the compiled-routing gates report. After this change the guard has a third failure class — an authored manifest that is gone (`authored-missing`, [SOURCE: .skilled/bin/compiled-route-guard.cjs:76]) — and the sync build and `--check` modes stop before `lstat` when the authored program directory is missing ([SOURCE: .skilled/bin/compiled-route-sync.cjs:1061], [SOURCE: .skilled/bin/compiled-route-sync.cjs:1110]). Both catalog entries still describe only the freshness mismatch and the runtime/authored disagreement, and the sync row names no precondition.
- **Evidence:** line 25 says the guard "fails when a hub's activation manifest no longer matches what its routing inputs compile to, or when the promoted runtime and its authored source disagree"; the CLI table row at `:164` repeats that; the sync row at `:165` says "Trace the authored closure, publish it atomically, and finalize or revert the retained rollback" and never names the restore failure. A missing authored source is neither a staleness mismatch nor a disagreement, so the catalog under-enumerates the red states a reader will meet.
- **Evidence refs:** [SOURCE: .skilled/bin/README.md:25] [SOURCE: .skilled/bin/README.md:164] [SOURCE: .skilled/bin/README.md:165] [SOURCE: .skilled/bin/compiled-route-guard.cjs:76] [SOURCE: .skilled/bin/compiled-route-sync.cjs:1061]
- **Counterevidence sought:** `rg -ln` over `.skilled/skills` and `.skilled/commands` found no other catalog or skill doc restating the guard contract; the README rows are not generated and no test reads them, so nothing corrects the text automatically. The in-scope YAML repair was updated, so the drift is specific to the bin catalog.
- **Alternative explanation:** the six-file scope deliberately excludes docs and the packet's CHK-042 ("README updated (if applicable)") is P2-optional, so the catalog update may be later-phase work; nothing in the packet records that deferral, which is the same gap one severity lower.
- **Final severity:** P2. **Confidence:** high (text read directly at HEAD).
- **Downgrade trigger:** an update to those rows, or a recorded deferral naming the owner.
- **Finding class:** instance-only.
- **Scope proof:** the behavior-change identifiers appear in only two non-spec docs — this README and the in-scope YAML; the README is the only file that enumerates the guard's failure classes.
- **Recommendation:** add the missing-authored-source class to the guard prose and table row and the restore precondition to the sync row, or record the deferral.

#### R3-P2-002 [P2] T2/T4 pin the helper record, not the guard failure line that REQ-002/REQ-004 and the ledger name

- **Case:** REQ-002 asks that the guard's authored-drift line names the runtime manifest and its authored twin; REQ-004 asks that the guard exits 1 naming the missing authored manifest; the ledger calls T2 "Guard authored-drift line names both paths" and T4 "Guard missing authored manifest". The tests call `guard.authoredDrift(...)` and assert on the returned `{reason, fix}` record ([SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:587], [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:605]). The user-visible line is produced only in `main`'s failure rendering ([SOURCE: .skilled/bin/compiled-route-guard.cjs:174], [SOURCE: .skilled/bin/compiled-route-guard.cjs:181]), and no test asserts that rendering.
- **Evidence:** the manifest suite requires the guard only for the helper ([SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:28]); the only spawn of the guard CLI anywhere is the unknown-option rejection in `typo-flags.test.cjs:106` ([SOURCE: .skilled/bin/tests/typo-flags.test.cjs:106]). Removing either `forEach` render line (`guard.cjs:177`, `:182`) leaves every test green while the printed line the requirements claim stops naming the path; only the exit code stays covered.
- **Counterevidence sought:** `rg` over the repository for `compiled-route-guard.cjs` lists the git hooks, the routing-registry-drift workflow and a benchmark script as consumers — all read exit codes only — plus the two test files above. No other suite spawns the guard or parses its output. Distinct from R1-P2-001, which covers the sync build-path entry guard in a sandbox; this is the guard's own rendering path.
- **Alternative explanation:** D5 asks for one test per behavior change and the substantive change is the fix-string derivation; the render loop is thin formatting, and a sandboxed guard spawn needs the freshness inputs too, so helper-level coverage may be a deliberate trade.
- **Final severity:** P2. **Confidence:** high on the gap (direct read plus `rg`), medium on impact.
- **Downgrade trigger:** a test that renders the guard failures (a sandboxed spawn following T3's copy pattern, or an extracted render function), or a decision record that helper-level evidence satisfies T2/T4.
- **Finding class:** matrix/evidence.
- **Scope proof:** the two test files above are the only test surfaces referencing the guard; within them only the helper and the unknown-option path are exercised.
- **Recommendation:** extract the failure rendering into a small function and test it, or add a sandboxed guard spawn following T3's copy pattern, asserting the `copy <runtime> over <authored>` and `restore <path>` lines.

## Traceability Checks

- **spec_code (core): pass.** Every requirement maps to an as-stand line and a test.

| REQ | Decision | As-stand site | Evidence |
|------|----------|---------------|----------|
| REQ-001 | D1 | `parent-skill-check.cjs:496` carries the literal `What Adapting` and the block heading | T1 at `parent-skill-check-invariants.test.cjs:660`; target block exists at `README.md:1445` |
| REQ-002 | D3 | `compiled-route-guard.cjs:79-82` (fix), rendered at `:174-177` | T2 at `compiled-route-manifest.test.cjs:585` |
| REQ-003 | D2 | `doctor-update-apply.yaml:160` names the runtime→authored copy-back verbatim | copy-run ledger row P9-3 (still to run and record; see checklist row) |
| REQ-004 | D3/D4 | `compiled-route-sync.cjs:1061,1085,1110,1115` (one line, exit 1); `compiled-route-guard.cjs:75-77,179-182` | T3 at `compiled-route-manifest.test.cjs:558`; T4 at `:603` |
| REQ-005 | D4/D3 | `requireAuthoredRoot` checks only the program directory, so the 019-only copy passes; `authored-missing` is per hub | live-tree and 019-only runs are ledger rows P9-6 (goal criterion 3) |
| REQ-006 | D5 | T1–T4 exist and each fails before its change | before: exit 1 / after: exit 0 recorded in the three commit bodies; ledger transcription pending |

- **checklist_evidence (core): partial — deferred to T012, not a finding.** The three commit bodies carry Context/Changes/Verification and the `Spec:` trailer, including each new test's "fails against the old code (exit 1) and passes after (exit 0)" and the suite counts (98 of 98, 46 of 46, 44 of 44). The packet ledger is still scaffold state: `tasks.md` has no T-task checked, `implementation-summary.md` says "Nothing yet. The phase is planned", `acceptance-criteria.md` rows are all `Unmet`, and `goal.md` says "Build: Pending". `tasks.md` T012 explicitly schedules the ledger fill after the review (T011), so this is the planned order, not a defect yet. The copy-run rows P9-1 to P9-5 have no committed evidence anywhere I can read — T012 must re-run the copies and record them, not transcribe them from memory.
- **skill_agent (overlay): notApplicable.** `spec.md` D6 records that no skill changelog owns these files; `rg` over `.skilled/skills` for the guard, sync, the new failure strings and the README block found no skill doc restating the changed behavior.
- **agent_cross_runtime (overlay): notApplicable.** `rg` over every runtime's `agents/` directory (`.opencode`, `.claude`, `.codex`, `.pi`, `.cursor`, `.devin`, `.hermes`) for the guard, sync, `authored-missing` and `What Adapting` returned nothing; no agent definition or mirror was changed by these commits.
- **feature_catalog_code (overlay): partial.** The `bin/README.md` CLI catalog drift is R3-P2-001; `lib/README.md` describes the layout and the generated root correctly and needs no change.
- **playbook_capability (overlay): notApplicable.** No playbook references the changed behavior; the only skill-tree hit is a cli-classifier benchmark report that records observed CLI output rather than documenting the capability.

## Ruled Out

- **The 3c pointer target's content.** The block headed "What Adapting `sk-code` Looks Like" at `README.md:1445` describes replacing surface packets and re-registering them, which is the removal path the 3c line promises. The spec deliberately moved the full checklist to phase 005 and accepted the rename risk; the pointer is accurate today. No finding.
- **The unrecorded ledger as a finding.** The evidence exists in commit bodies and the fill is a scheduled closure task (T012), so the checklist_evidence result is recorded as `partial` above instead of a new P2.
- **T1's heading binding.** T1 pins the message substring but not the README heading itself (`grep -q 'What Adapting' parent-skill-check.cjs` in goal criterion 2 has the same shape). The spec's risk table already accepts the rename risk with a phase-005 mitigation, so this is not re-litigated here.

## SCOPE VIOLATIONS

None. No file outside the allowed state paths was created or modified; every read was read-only.

## Verdict

Two new P2 findings, no P0 or P1 this iteration. Both are evidence/catalog gaps; every REQ-001 to REQ-006 maps to an as-stand line, every claimed test exists, and the before/after evidence is preserved in the commit bodies.

## Next Dimension

maintainability.

Review verdict: PASS
