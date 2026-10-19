# Deep Review Report — Typo-proof parsers (lineage dsflash-llmgw)

- Target: `specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/001-typo-proof-parsers`
- Code under review: build commit `0c5dbe87c1` on top of scaffold `0039903bde`, scoped by `steer.md` to the argument parsers and exit paths of the ledger scripts, their typo-flag tests, the shared helpers `cli-guards.cjs` / `reject-unknown-options.mjs`, the version bumps and the changelog entries.
- Lineage: `review/lineages/dsflash-llmgw` (fan-out, session `fanout-dsflash-llmgw-1791754059549-b7vcvs`, generation 1, mode `new`)
- Executor: cli-pi, model deepseek-v4.1-flash
- Iterations: 5 of 5 (`stopPolicy=max-iterations`; convergence before the cap treated as telemetry only)
- Stop reason: `maxIterationsReached`

## 1. Executive Summary

- **Overall verdict: PASS**
- **hasAdvisories: true** (five active P2 findings, no P0/P1)
- **Active counts:** P0 = 0, P1 = 0, P2 = 5
- **Review scope:** the build commit's parser/exit-path changes, the two shared helpers, the ten typo-flag test files, the seven version bumps with changelogs, and the derived carriers (mirrors, activation manifests, compiled contracts, trigger index).
- The change set does what the phase designed it to do: every sampled parser refuses a misspelled option before any read or write, the ten detected-problem paths exit non-zero, and the tests pin the refusals with exit codes plus the refused flag name. Six write-capable scripts were reproduced exiting 2 on a misspelled gate flag with no output path touched. All 68 ledger rows are present in the required format; all seven skills carry one version bump and one changelog entry; mirrors and derived carriers agree.
- The five advisories are: one surviving defect instance of the phase's own class (`advise-council-completion.cjs <packet> --jso` still exits 0), one stale documented catalog command that now exits 2, one packet-disclosure sentence that misnames the rejected flag, and two error-message quality issues. None of them blocks the release of the parser hardening; all are actionable follow-ups.

## 2. Planning Trigger

`/speckit:plan` is **not required** for release: the verdict is PASS with advisories only. The advisories can be scheduled as a small follow-up workstream, or fixed inline, per operator preference.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": ["I1-P2-001", "I1-P2-002", "I3-P2-003", "I4-P2-004", "I4-P2-005"],
  "remediationWorkstreams": [
    { "id": "WS-1", "severity": "P2", "title": "Close the council advisory flag position", "findings": ["I1-P2-001"] },
    { "id": "WS-2", "severity": "P2", "title": "Repair the stale documented catalog command and its disclosure", "findings": ["I1-P2-002", "I3-P2-003"] },
    { "id": "WS-3", "severity": "P2", "title": "Polish the two error messages", "findings": ["I4-P2-004", "I4-P2-005"] }
  ],
  "specSeed": [
    "Record the F37 flag-position variant in the ledger so future sweeps scope unknown-option rejection to the whole argv, not one slot.",
    "Name the mcp-tooling feature catalog as a consumer surface when a parser's accepted set narrows."
  ],
  "planSeed": [
    "T1: advise-council-completion.cjs — reject unknown flags in flag position with exit 2 and add the test case.",
    "T2: ci-skill-root-metadata.cjs/mcp-tooling feature-catalog.md — drop the stale --check from the documented command.",
    "T3: implementation-summary.md Known Limitations — name --check as the rejected option.",
    "T4: verify-router-sync.cjs — plain usage line in the unknown-option branch.",
    "T5: ci-leaf-manifest-freshness.cjs and ci-skill-root-metadata.cjs — distinguish a missing --format value."
  ],
  "findingClasses": ["instance-only", "cross-consumer", "class-of-bug"],
  "affectedSurfacesSeed": [
    "advise-council-completion.cjs flag loop",
    "mcp-tooling feature-catalog.md:69",
    "implementation-summary.md Known Limitations",
    "verify-router-sync.cjs usage output",
    "ci-leaf-manifest-freshness.cjs / ci-skill-root-metadata.cjs --format parsing"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Evidence | Impact | Fix | Class |
|----|----------|-------|-----------|-----------|----------|--------|-----|-------|
| I1-P2-001 | P2 | Misspelled flag after the packet path still exits 0 | correctness | `.skilled/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs:46` | `node …advise-council-completion.cjs . --jso` → `unknown argument: --jso`, exit 0 | A `--json`/`--quiet` typo is not refused, and a caller reading the exit code sees a pass | Route `args.unknown` through the exit-2 branch; extend the typo-flag test to the flag position | instance-only |
| I1-P2-002 | P2 | Documented catalog command now exits 2 | correctness/traceability | `.skilled/skills/mcp-tooling/feature-catalog/feature-catalog.md:69` | `…ci-skill-root-metadata.cjs --skills-dir .skilled/skills --check` → exit 2 | A documented invocation fails; the script has no `--check` mode | Drop `--check` from the catalog line (follow-up outside the phase's bump scope) | cross-consumer |
| I3-P2-003 | P2 | Known Limitations misnames the rejected option | traceability | `…/001-typo-proof-parsers/implementation-summary.md:224` | `--skills-dir` alone runs (`checked=14 passed=14`, exit 0); `--check` is rejected | An operator sent to fix the catalog may change the wrong flag; contradicts the same document's "every caller… passes only known options" | Correct the sentence to name `--check`; align the delivery sentence | instance-only |
| I4-P2-004 | P2 | Unknown-option error contradicts itself in verify-router-sync | maintainability | `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:325` | `--bogus-xyz` → `unknown option: --bogus-xyz` then `usage: … (unknown: none given)` | Misleading error text on a checker gate | Print a plain usage line in the unknown-option branch | instance-only |
| I4-P2-005 | P2 | Missing `--format` value reported as `undefined` | maintainability | `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:56` (same in `ci-skill-root-metadata.cjs:83`) | `--format` (no value) → `unknown --format value: undefined`, exit 2 | Wrong diagnosis and JS-internal leakage in a gate message | Distinguish missing vs unknown value; say `--format needs one of: text, json` | class-of-bug |

All five findings are active; none was resolved or superseded during the loop. Every finding carries a reproducing command (see the Evidence column and the iteration files).

## 4. Remediation Workstreams

1. **WS-1 (P2): Council advisory flag position.** Edit `advise-council-completion.cjs` so `args.unknown` exits 2 with the same one-line message, then add the `<packet> --jso` case to the deep-loop typo-flag test.
2. **WS-2 (P2): Stale catalog command + disclosure.** In `.skilled/skills/mcp-tooling/feature-catalog/feature-catalog.md:69`, drop `--check` (the default run is read-only and already checked); correct `implementation-summary.md` Known Limitations to name `--check`.
3. **WS-3 (P2): Message polish.** In `verify-router-sync.cjs`, print `usage: verify-router-sync [--checks <id,id,...>]` without the `(unknown: …)` suffix in the unknown-option branch. In `ci-leaf-manifest-freshness.cjs` and `ci-skill-root-metadata.cjs`, branch on a missing `--format` value before validating it.

Optional sequencing: WS-3 can ride with any next change to those files; WS-1 and WS-2 are independent.

## 5. Spec Seed

- Extend the source review's F37-style rows to state the argument position they cover, so a future sweep can tell a fully closed parser from a partially closed one.
- When a parser's accepted set narrows, list documentation surfaces (feature catalogs, playbooks, command docs) as consumer surfaces to fix or explicitly disclose, not only hooks/workflows/scripts.
- Keep the exit-code operator decision recorded in one place (already done in this packet's Key Decisions); new rows inherit it.

## 6. Plan Seed

1. `advise-council-completion.cjs`: reject unknown flags in flag position (exit 2) + test.
2. `mcp-tooling/feature-catalog/feature-catalog.md:69`: drop `--check`; optional mcp-tooling changelog note.
3. `implementation-summary.md`: correct Known Limitations 1.
4. `verify-router-sync.cjs`: usage-line fix.
5. `ci-leaf-manifest-freshness.cjs`, `ci-skill-root-metadata.cjs`: `--format` missing-value message.

## 7. Traceability Status

Core protocols:

- **`spec_code` — pass (with recorded deviations).** REQ-001 verified across the sampled class-1 parsers (one surviving variant recorded as I1-P2-001); REQ-002 verified for the ten class-2 paths; REQ-003 format verified (68/68 rows); REQ-004 test shape and fix-dependent assertions verified (T1 executed live, 10/10 pass); REQ-005 verified (one bump + one changelog per touched skill, mirrors/carriers consistent); REQ-006 verified as ledger-line attestation (throwaway paths named, printed output named; artifacts not retained); REQ-007 verified (helper callers counted: 6 + 3 + 1 inline copy + 2 inline copies, matching the recorded decision).
- **`checklist_evidence` — notApplicable** (Level 1 packet has no `checklist.md`; the acceptance-criteria scaffolding is exempt).

Overlay protocols:

- **`skill_agent` — pass.** Seven skill definitions bumped; each changelog's `version:` matches its `SKILL.md`.
- **`agent_cross_runtime` — pass.** `.skilled` and `.hermes` SKILL.md versions match 1:1 for all seven skills.
- **`feature_catalog_code` — partial.** One stale catalog command remains (I1-P2-002) and its disclosure misnames the flag (I3-P2-003).
- **`playbook_capability` — notApplicable.** No playbook claims changed by this build.

**AC_COVERAGE:** exempt (Level 1 packet; no checklist).

**Resource Map Coverage Gate:** skipped — `resource-map.md` is absent at init (`resource_map_present: false`), so the gate and its report section are omitted without failing the loop.

## 8. Deferred Items

- Retention of throwaway reproduction evidence for U1-U4 (paths and printed output are recorded in the ledger; the scratch trees themselves were not kept).
- Cleaning up `check-markdown-links.cjs` module-scope argv guard style (no triggering case exists; observation only).
- The `compiled-route.cjs` hub-derivation quirk when `--hub` is absent (pre-existing; out of this commit's scope).
- `check-corpus.cjs --help` prints no usage line (observation; README documents invocation).

## 9. Dimension Expansion Map

- Saturated directions: none — each dimension had one full pass plus a final cross-cutting pass; no direction was retired for exhaustion.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Selected review directions: D1 correctness (iteration 1), D2 security (iteration 2), D3 traceability (iteration 3), D4 maintainability (iteration 4), adversarial cross-cutting (iteration 5).
- Remaining frontier: none — 5/5 planned iterations executed; convergence before the cap was telemetry only, per `stopPolicy=max-iterations`.

## 10. Search Ledger

- Search coverage: `requiredBugClasses` = [unknown-option acceptance, write-path fallthrough, caller compatibility, ledger/test/version drift, message quality]; covered = the same five; ruledOut = [] ; deferred = [] ; blocked = []. `graphCoverageMode`: `graphless_fallback` (no coverage graph was seeded in this lineage).
- Search actions: direct reads of every changed parser diff (96 files touched by the build, 90+ read hunk-by-hunk); `rg` caller scans per script family; live fail-fast reproductions of 12 refusal paths; base-commit exit-code greps; goal-criteria grep commands; one live test suite run (T1) with `TMPDIR` contained.
- Ruled-out candidates: `--flag=value` caller regression (none found); help-surface regression (none); exit-code drift (none); third shared-helper caller (none); module-scope guard import breakage (no importers).
- Search debt: `hasSearchDebt: false`.

## 11. Audit Appendix

- Convergence: 5 iterations executed to the cap; new-findings ratios 1.0, 0.0, 0.33, 1.0, 0.0 (P2-weighted); no STOP was synthesized before the cap.
- Coverage: correctness, security, traceability, maintainability each had one full dimension pass; traceability protocols `spec_code` (pass, deviations recorded) and `checklist_evidence` (n/a).
- Ruled-out claims: see Search Ledger; each carries the method that cleared it in the iteration files.
- Sources reviewed: build commit `0c5dbe87c1` diff (`git show`), the packet's `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md` / `goal.md`, `steer.md`, the shared helpers, all ten typo-flag tests, the seven version/changelog carriers, `.hermes` mirrors, activation manifests, compiled contracts, and the regenerated trigger index.
- Verification runs: 12 fail-fast reproductions (all exit 2 unless noted), T1 suite (10/10), goal grep criteria (all pass), version/changelog/carrier comparisons. `validate.sh --strict` was not run in this lineage (containment rule); it remains with the runner.
- Findings lifecycle: 5 opened, 0 resolved, 0 repeated; all P2, all active.
- Final derived verdict: **PASS** with `hasAdvisories: true` (P2-only mapping; no P0/P1 active).
