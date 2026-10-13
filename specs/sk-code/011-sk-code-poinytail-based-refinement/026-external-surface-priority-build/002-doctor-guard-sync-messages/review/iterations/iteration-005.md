# Iteration 005 — Deep Review: correctness

## Dimension
correctness (iteration 5 of 5; dimension coverage complete: correctness, security, traceability, maintainability — 4/4)

## Files Reviewed
- `.skilled/bin/compiled-route-sync.cjs` — diff plus as-stand lines 27-55 (require chain, `SPECS_DIR`/`SPECS_ROOT` fallback, `IMPL_ROOT`), 1058-1065 (`requireAuthoredRoot`), 1083-1086 (`--check` wiring), 1106-1111 (build wiring), 1114-1116 (`SYNC FAILED` wrapper) [SOURCE: .skilled/bin/compiled-route-sync.cjs:1061]
- `.skilled/bin/compiled-route-guard.cjs` — whole file: `authoredDrift` 63-83, `inspect` 109-129, failure rendering 166-191, exit 191 [SOURCE: .skilled/bin/compiled-route-guard.cjs:76]
- `.skilled/bin/tests/compiled-route-manifest.test.cjs` — new T3 at 558-584, T2 at 586-602, T4 at 604-616 [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:558]
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs` — 3c message at 495-499 [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:496]
- `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` — T1 at 656-662 [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:656]
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml` — `compiled_routes` repair at 157-160 [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:160]

Cross-reads for this iteration: `.skilled/bin/lib/compiled-route-layout.cjs` (AUTHORED_PROGRAM_DIR at 53-55), `README.md:1445` (heading anchor for the 3c pointer), `spec.md` / `goal.md` (REQ/D mapping), and the `4b9bf840b0..HEAD` diff over all six scope files (+114/-13, three commits: 36cef9db0a, ed10d1f294, f9eb84c4fe).

## Findings by Severity

### P0
None.

### P1
None.

### P2

#### R5-P2-001 [P2] Doctor `compiled_routes` repair binds its new copy-back to hubs the guard reports stale, not to the authored-drift and authored-missing hubs it clears
- Case: A hub is made `authored-drift` by the phase's own P9-3 path — reorder `tieBreak`, run `compiled-route-manifest.cjs refresh`. After the refresh the guard reports that hub under "Runtime differs from its authored source", not under "Re-mint". An operator or agent applying the repair string verbatim reads "for each hub the guard reports stale, run … refresh …, then copy … over …" and finds no stale hub to attach the copy-back to; skipping it leaves the guard red and REQ-003's verbatim-application promise unmet. The same referent gap applies to `authored-missing`, whose fix the copy-back also provides.
- File: `.skilled/commands/doctor/assets/doctor-update-apply.yaml:160`
- Evidence: The repair binds both the refresh and the added copy-back to the phrase "for each hub the guard reports stale" [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:160]. The guard renders `stale-manifest` under the "Re-mint:" line at 170-173, but renders `authored-drift` at 174-178 and `authored-missing` at 179-183 under their own headings [SOURCE: .skilled/bin/compiled-route-guard.cjs:174] [SOURCE: .skilled/bin/compiled-route-guard.cjs:179].
- User impact: On the P9-3 path a literal application stops after the refresh and the guard stays red; recovery then depends on the operator also reading the guard's own per-hub `copy … over …` line (added by this same change) or on the installed hooks copying at commit time.
- Finding class: instance-only
- Scope proof: Exact search over the six in-scope files found exactly one restatement of the repair: this YAML entry. The catalog restatement is the separate open R3-P2-001; no generator or test renders the repair string.
- Confidence: medium
- Counterevidence sought: The guard's per-hub fix lines at :177/:182 independently name the copy, and the repair's hook branch would copy runtime→authored on commit for any drift, so the end-to-end removal path still names the action even under a strict reading of "stale". "Stale" may also be read loosely as "flagged".
- Alternative explanation: The sentence may mean "for each hub the guard reports", with "stale" as color rather than class. No test or generator pins the repair wording, so nothing forces the stronger reading.
- Downgrade trigger: A repair string whose copy-back is bound to every guard failure class, or a test/generator that reconciles the repair text with the guard's class list, withdraws this finding.
- Recommendation: Enumerate the classes the repair clears ("stale, drifted or missing"), or bind the copy-back to the guard's per-hub fix line rather than to the stale class.
- riskScore: 2 (advisory)

The seven prior P2 findings (R1-P2-001, R1-P2-002, R2-P2-001, R3-P2-001, R3-P2-002, R4-P2-001, R4-P2-002) remain open and were not re-reported.

## Traceability Checks
- Core `spec_code`: pass. REQ-001 → `parent-skill-check.cjs:496` with the `README.md:1445` heading present; REQ-002/D3 → `compiled-route-guard.cjs:70-82` and 174-183; REQ-004/D4 → `compiled-route-sync.cjs:1061-1065` wired at :1085/:1110 with the one-line wrapper at :1115; REQ-003 is the subject of R5-P2-001. Carried from SL-301/SL-403 and spot-verified this iteration.
- Core `checklist_evidence`: partial — unchanged deferral to T012; not re-entered (exhausted).
- Overlay `skill_agent`: notApplicable (no skill doc restates the changed behavior).
- Overlay `agent_cross_runtime`: notApplicable (no runtime agent definition references it).
- Overlay `feature_catalog_code`: partial — `bin/README.md` catalog drift stays open as R3-P2-001.
- Overlay `playbook_capability`: notApplicable.

## Verdict
PASS — one new P2 (R5-P2-001), no P0/P1 this iteration; P2-only maps to PASS; hasAdvisories=true (8 open P2s across the run).

## Next Dimension
None — iteration 5 of 5; all four dimensions covered (4/4).

Review verdict: PASS
