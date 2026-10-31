# Deep Review Report — 054-weak-model-spec-authoring (lineage deepseek)

- Run: `fanout-deepseek-1793081281038-z2aj1o` · lineage `deepseek` · generation 1 · lineageMode `new`
- Target: `specs/system-speckit/054-weak-model-spec-authoring` at `main` `558570a83e`
- Iterations: 3 of 3 · Stop reason: `maxIterationsReached` · Converged: no (the ceiling bound)

## Executive Summary

- **Overall verdict: CONDITIONAL**
- hasAdvisories: false (advisories apply only to a PASS)
- Active findings: **P0 = 0, P1 = 1, P2 = 6**
- Review scope: the 22 phase records of packet 054 and the shipped files they name — the versioned placeholder gate and its shell rule, the authoring card and its sync guard, the example drift guard, the draft metadata auto-repair and its write path, the measured-behavior rule, the `local-*` provisioning link step, the advisor's mode-suffix strip and slash-command bound, the changed-packet CI gate, and the generated command-bridge and skill-graph artifacts.
- Operator review focus: All work packet 054 shipped in phases 001-022, now on main at 558570a83e: the spec-kit templates, validator, authoring card, CLI scripts and their tests, the advisor scorer and its phrases, the sk-git provisioning step, the docs and the phase records. Check the shipped code and docs against what each phase spec claims.

The packet holds up. Fourteen of the fifteen phase claims re-checked reproduce exactly, including the three checks the packet says it ran and that were run again here: `check-card-sync.sh` prints `CARD SYNC OK`, `check-example-drift.sh` prints `EXAMPLE_DRIFT_OK`, `derive-command-bridges.cjs --check` prints `"changed": []`, `route-validate.sh` prints `18 routes validated, 2 warnings`, and `skill-graph-freshness.cjs` prints `SIGNAL DRIFT compiled vs disk: none`. The one P1 is a scope gap rather than a broken feature: the draft metadata auto-repair is reachable from a recursive validation run, so a command operators treat as a check can rewrite derived metadata in several Draft children at once. The six P2s are two internal contradictions in the placeholder rule's own documentation, one changelog-tense sentence repeated in three command docs, one unbounded snapshot read on the repair path, and two stale or unverifiable phase records.

## Planning Trigger

`/speckit:plan` is required for the P1 and remains optional for the P2 advisories.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["F1-P1-001", "F1-P2-002", "F1-P2-003", "F1-P2-004", "F2-P2-001", "F3-P2-001", "F3-P2-002"],
  "remediationWorkstreams": [
    "W1 close the recursive repair path",
    "W2 correct the placeholder rule's two internal contradictions",
    "W3 restate the warn-rule sentence in the three speckit command docs",
    "W4 bound the repair snapshot",
    "W5 refresh the two stale phase records and give the audit artifact a disposition field"
  ],
  "specSeed": "Add a recursion refusal to the draft auto-repair contract and state the recursive behavior in validation-rules.md; restate the warn-rule sentence without a time reference; record an audit disposition field.",
  "planSeed": "T001 refuse the repair under --recursive and prove it with a two-child fixture; T002 remove the unreachable branch and fix the header; T003 rewrite the three command-doc sentences; T004 cap the repair snapshot to REWRITE_TARGETS; T005 add a disposition field to the phase 020 audit findings and refresh phase 021's commit row.",
  "findingClasses": ["missing-case", "instance-only"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh",
    ".skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts",
    ".skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh",
    ".skilled/commands/speckit/{plan,implement,complete}.md",
    "specs/system-speckit/054-weak-model-spec-authoring/021-ci-gate-regressions/implementation-summary.md",
    "specs/system-speckit/054-weak-model-spec-authoring/020-alignment-audit-fixes/scratch/audit/findings.json"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

| ID | Severity | Dimension | Location | Title | Disposition |
|---|---|---|---|---|---|
| `F1-P1-001` | P1 | correctness | `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:414` | Recursive validation auto-repairs every Draft child, so a read-only audit mutates packets it was not asked to touch | open — fix in the next plan |
| `F1-P2-002` | P2 | correctness | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:6` | The placeholder rule's header describes a call path that no longer exists | open — advisory |
| `F1-P2-003` | P2 | correctness | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:191` | The legacy scan keeps a Draft-token branch that its own `continue` makes unreachable | open — advisory |
| `F1-P2-004` | P2 | correctness | `.skilled/commands/speckit/plan.md:107` (also `implement.md:93`, `complete.md:102`) | Three durable command docs describe the rule set in changelog tense | open — advisory |
| `F2-P2-001` | P2 | security | `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1595` | The repair's before/after snapshot reads every top-level packet file whole, twice, with no size guard | open — advisory |
| `F3-P2-001` | P2 | traceability | `specs/system-speckit/054-weak-model-spec-authoring/021-ci-gate-regressions/implementation-summary.md:41` | Phase 021's record says its work is uncommitted, and the repository says otherwise | open — advisory |
| `F3-P2-002` | P2 | traceability | `specs/system-speckit/054-weak-model-spec-authoring/020-alignment-audit-fixes/scratch/audit/findings.json:1` | The phase 020 audit cannot be closed from its own artifact | open — advisory |

Evidence, impact and fix recommendation for each finding are in the iteration narrative that raised it (`iterations/iteration-001.md`, `iteration-002.md`, `iteration-003.md`), which is the canonical artifact; `contentHash` is `UNKNOWN` for every entry because the deltas name the finding rather than hash it, and the reducer records the null faithfully.

## Remediation Workstreams

**W1 — Close the recursive repair path (P1, `F1-P1-001`).**
1. Add a recursion signal to the auto-repair decision: the orchestrator already knows the folder it validates; the caller that loops over phase children (`validate.sh:414`) can pass `SPECKIT_DRAFT_AUTO_REPAIR=0` to its children the same way the five sibling tools do, or answer a `--no-auto-repair` flag. The first keeps the change inside `validate.sh`; the second makes the refusal visible in `--help`.
2. Add the two-child fixture: one Draft child with a stale `graph-metadata.json`, one Complete child; assert the parent run leaves the Draft child's bytes unchanged under the new rule.
3. State the behavior in `references/validation/validation-rules.md` §auto-repair beside the existing refusal list, and in the card's section 9.

**W2 — Correct the placeholder rule's two internal contradictions (P2, `F1-P2-002`, `F1-P2-003`).**
1. Replace "Sourced by validate.sh and compatible with strict mode" with the mechanism that exists: "Spawned by the validation orchestrator through `runtime/cli/lib/validator-registry.json`; skipped when the orchestrator answers the same rule natively."
2. Delete the unreachable `token_gated && draft_packet` branch at `check-placeholders.sh:191` and its comment, so the legacy path reads as what it is.

**W3 — Restate the warn-rule sentence (P2, `F1-P2-004`).** Replace "now include three warn-only rules" in `plan.md`, `implement.md`, `complete.md` and their three YAML assets with a statement that does not depend on when the rules were added, and either name all eight warn rules or say "three authored-template rules among the eight that warn".

**W4 — Bound the repair snapshot (P2, `F2-P2-001`).** Snapshot only `REWRITE_TARGETS` instead of every top-level file. The repair can only write those, so the diff stays exact and the read stops being proportional to whatever else the packet holds.

**W5 — Refresh the two records (P2, `F3-P2-001`, `F3-P2-002`).** Update the phase 021 Completed row to name its commit, extend the parent spec's push correction past `10e8df7d25`, and add a `disposition` field (`fixed`, `deferred`, `instance-only`) to the 46 entries in the phase 020 audit.

## Spec Seed

- A recursive validation run is a check. Say so, and make the auto-repair refuse under it — the packet's own closeout tools already do this, so recursion is the last gap in a rule the docs already state.
- When a rule is implemented twice (orchestrator plus shell), the header must name the one that runs, and the one that does not must say it is a parity copy.
- Durable command docs describe the current contract, not the moment the contract changed.
- An audit artifact is a record only when it carries a disposition per finding; a count in prose is not a closure.
- A repair that rewrites derived metadata must state its refusal set, and recursion belongs in that set.

## Plan Seed

- T001 Refuse the draft auto-repair for a recursive child (`validate.sh:396-417`). Verify: two-child fixture, Draft child bytes unchanged, Complete child still validated, `Tests N passed`.
- T002 Add the regression test for T001 that fails on the current code. Verify: red then green in one run.
- T003 Remove the unreachable branch and rewrite the header (`check-placeholders.sh:6`, `:185-196`). Verify: `placeholder-token-gate.vitest.ts` passes and `validate.sh --strict` on a v2.4 Draft fixture still warns.
- T004 Rewrite the warn-rule sentence in three command docs and three YAML assets. Verify: `rg -c 'now include three warn-only rules'` prints 0 across the six files.
- T005 Cap `snapshotPacketFiles` to `REWRITE_TARGETS`. Verify: the existing `draft-auto-repair.vitest.ts` suite passes and a packet with an unrelated large root file no longer reads it.
- T006 Add `disposition` to the phase 020 audit entries and a closure line to its summary. Verify: every entry carries one of the three values.
- T007 Refresh the phase 021 commit row and the parent spec's push correction. Verify: `git log --oneline -1 -- <phase folder>` names the SHA the record carries.

## Traceability Status

- **`spec_code` (core): partial.** Fourteen of fifteen phase claims reproduce. Two record claims are stale (`F3-P2-001`, `F3-P2-002`); the shipped behavior behind them holds.
- **`checklist_evidence` (core): partial.** Phase 020's artifact carries no disposition field, so its checklist cannot be replayed. Every other phase read carries a verification table naming a `scratch/` artifact or a command and its output.
- **`skill_agent` (overlay): pass.** `speckit-plan.yaml:310`, `speckit-implement.yaml:285` and `speckit-complete.yaml:347` each set `guard_scripts_command` for both guards, and the three command docs name them in prose.
- **`agent_cross_runtime` (overlay): pass, habitability not fully re-verified.** Phase 022's `sk-git` changelog `v1.9.7.0.md` exists and rule 8 names the link step; the runtime mirrors were not diffed in this run.
- **`feature_catalog_code` (overlay): pass.** `feature-catalog/tooling-and-scripts/draft-auto-repair.md` and `spec-validation-rule-engine.md` exist; both manual-testing-playbook scenarios named by `B-05` exist.
- **`playbook_capability` (overlay): partial.** The two scenarios cover the single-packet repair and the measured-behavior rule; no scenario covers the recursive path (see `F1-P1-001`).
- **`AC_COVERAGE`: exempt.** The target is a phase parent with no `acceptance-criteria.md` at its root; its children carry their own, and this lineage validated none of them.

## Deferred Items

- **Maintainability as its own pass.** The dimension queue held four dimensions and the ceiling was three iterations. Maintainability was touched by three documentation findings and is not covered as a dedicated pass; a later run should start there.
- **Phase scratch evidence for 001-009 and 011-019.** Read through their verification tables only; the `scratch/` bodies were not opened.
- **Runtime mirrors.** `.claude`, `.codex`, `.pi` and `.hermes` copies of the touched skills were not diffed against their canonical sources.
- **`check-placeholders.sh` fail-open on an unreadable document.** `placeholder_marker_lines` runs with `2>/dev/null || true`, so an awk failure reads as a clean scan. The orchestrator's native rule shadows this script, so nothing in production depends on it; recorded as an observation, not a finding.

## Dimension Expansion Map

- Completed pivots: none. This lineage is a single run at the iteration ceiling, with no pivot branch.
- Failed pivots: none.
- Audited overrides: none.
- Council artifact references: none.
- Selected review directions: correctness (iteration 1), security (iteration 2), traceability (iteration 3).
- Saturated directions: none — three iterations against 22 phases leaves breadth, not saturation.
- Remaining frontier: maintainability as a dedicated pass; phase `scratch/` evidence for 001-009 and 011-019; runtime mirror parity.

## Search Ledger

- `searchCoverage.requiredBugClasses`: `state_transition`, `boundary_condition`, `dead_code`, `stale_documentation`, `gate_bypass` (correctness); `path_traversal`, `symlink_escape`, `command_injection`, `fail_open`, `resource_exhaustion` (security); `stale_claim`, `unverifiable_evidence`, `missing_artifact`, `generated_artifact_drift` (traceability).
- Covered: `dead_code`, `stale_documentation`, `resource_exhaustion`, `stale_claim`, `unverifiable_evidence`.
- Ruled out: `state_transition` (the token-gate stamp covers every later version), `boundary_condition` (template example sweep clean), `gate_bypass` (the CI scratch skip matches a whole segment only), `path_traversal` (citation candidates filtered), `symlink_escape` (three refusals), `command_injection` (argv spawns, PR text is an enum and hex SHAs), `fail_open` (guards exit 2 without `rg`), `missing_artifact` (every artifact a claim names exists), `generated_artifact_drift` (bridges fresh, graph and routes match).
- Deferred: phase `scratch/` evidence for 001-009 and 011-019.
- Blocked: none.
- Search debt: none recorded by the reducer (`searchDebtCount: 0`).
- Clean search proof: `corruptionCount: 0`, `strategyWarning: null` from the reducer after the final iteration.

## Audit Appendix

**Convergence summary.** Three iterations, stop reason `maxIterationsReached`, final convergence score 0.82. Convergence was never claimed: the stop policy was `max-iterations` from init, so the score is telemetry, and the remaining iterations were spent broadening to a new angle rather than re-reading the same surfaces.

**Coverage summary.** 3 of 4 dimensions covered (correctness, security, traceability); maintainability partial. Each iteration also carried the operator's review focus and named how it did so.

**Ruled-out claims (consolidated).**
Placeholder gate reachable only for v2.3 docs; `implementation-summary.md` scanned by the shell rule but not the orchestrator; `check-example-drift.sh` aborting on a clean example; template fill notes naming the benchmark task; `recommend-level --quiet` surviving under `templates/`; a symlink diverting a repair write; command injection through a packet folder name; workflow command injection through a packet name; the measured-behavior rule accepting an empty block; a burned-in version trigger phrase in the advisor's graph; stale root changelog and README warn-rule counts; generated command-bridge, route and graph drift.

**Sources reviewed.** 22 phase `spec.md` and `implementation-summary.md` files; the parent `spec.md`; `changelog/changelog-054-root.md`; `020-alignment-audit-fixes/scratch/audit/findings.json`; `018-benchmark-redesign-and-remeasure/scratch/`; the shipped files listed in each iteration's Files Reviewed section; five claim checks executed read-only (`check-card-sync.sh`, `check-example-drift.sh`, `derive-command-bridges.cjs --check`, `route-validate.sh`, `skill-graph-freshness.cjs`).

**Core protocols.** `spec_code` partial, `checklist_evidence` partial (above).

**Overlay protocols.** `skill_agent` pass, `agent_cross_runtime` pass, `feature_catalog_code` pass, `playbook_capability` partial (above).

**Lineage note.** This report is the `deepseek` lineage's own synthesis. The cross-lineage merge, not this file, is the authoritative verdict rollup, and it applies strongest restriction across lineages.
