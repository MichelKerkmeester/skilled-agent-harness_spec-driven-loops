# Deep Review — Iteration 005 of 5

## Dimension
correctness — final confirmation pass. Dimension coverage was already 4/4; this iteration re-reads the correctness-critical changed code only and does not re-enter any swept direction.

## Files Reviewed
- README.md:1448-1475 — adapting block: provision item, `skilled.trustRepoHooks` item, removal steps 6-7, add step 3
- .skilled/bin/compiled-route-guard.cjs:54-104, 130-151, 176-219 — `manifestPathIn`, `manifestPair`, `staleFix`, the `inspect` stale branch, the per-hub print and the export list
- .skilled/bin/lib/compiled-route-layout.cjs:82-141 — layout selection and `activationRootFor` (new evidence this iteration)
- .skilled/bin/tests/compiled-route-manifest.test.cjs:620-652 — stale-fix tests (via diff)
- .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:62-90 — `SHARED_NOT_BUILT` loader
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:55-66 — stack-free gate
- .skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:715-801 — relabel tests (via diff)
- spec.md / goal.md — carried requirement map (verified iterations 1/3; not re-entered)

## Findings by Severity

### P0
None.

### P1
None.

### P2
None new this iteration. Carried advisory remains active: **R1-P2-001** — only the CI gate catches the relabeled load failure; the spec's doctor edge case has no coverage ([SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:83]). Downgrade trigger unchanged; not re-entered.

## Correctness Checks This Iteration
- **`staleFix` null-closure — ruled out.** `inspect` embeds `fix: staleFix(hubId)` ([SOURCE: .skilled/bin/compiled-route-guard.cjs:145]) and `main` prints `${f.fix}` unconditionally ([SOURCE: .skilled/bin/compiled-route-guard.cjs:195]). `staleFix` returns null only when `manifestPair` does, i.e. when `layout.activationRootFor` throws ([SOURCE: .skilled/bin/compiled-route-guard.cjs:54]). `activationRootFor` joins the root with `resolveLayoutOrLegacy(...).activation` ([SOURCE: .skilled/bin/lib/compiled-route-layout.cjs:139]), and `resolveLayoutOrLegacy` falls back to `LEGACY_LAYOUT` instead of throwing, so the guard's `if (!pair) return null` branch is unreachable in the stale-manifest path and the printed line can never render `null`. Recorded as SL-023, ruled out.
- **Relabel precision — carried.** The loader fires only when the `MODULE_NOT_FOUND` message quotes the exact shared module id ([SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:76]); a missing dependency inside a present package keeps its own error (T4). Carried from iterations 1/4 (SL-020); not re-litigated.
- **Gate exit path — carried.** The gate prints the one-line message and exits 1 with no stack ([SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:63]).

## Traceability Checks
- **spec_code (core) — pass (carried).** R1 → README.md:1451-1452; R2 → .skilled/bin/compiled-route-guard.cjs:99-104, printed at :195; R4 → README.md:1463-1464 and :1472; R5 → .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:76-84 with the gate at ci-skill-root-metadata.cjs:63-66. D1-D5 hold; not re-entered.
- **checklist_evidence (core) — blocked (carried).** Ledger rows L-1..L-6 and T1..T4 live in implementation-summary.md, outside the review scope files.
- **skill_agent — notApplicable.** No skill or agent document in the changed set (D5 holds).
- **agent_cross_runtime — notApplicable.** No runtime-specific file in the changed set.
- **feature_catalog_code — pass (carried).** README.md:1463 names the hub feature catalog and its two-axis file (confirmed iteration 2).
- **playbook_capability — observed.** Removal step 6 keeps the manual-testing-playbook rows; no capability claim invalidated.

## SCOPE VIOLATIONS
None. All target reads were read-only; writes were confined to this iteration's narrative, its delta file, and the append gateway.

## Next Dimension
None — final iteration (5 of 5); stop policy is max-iterations.

## Verdict
No P0 and no P1 findings this iteration; one carried P2 advisory stays active (hasAdvisories=true).

Review verdict: PASS