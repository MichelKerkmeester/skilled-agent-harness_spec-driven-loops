# Review Report - kill-switch-cli confirming round 5b

- Lineage: `kill-switch-cli-confirm-5b` (`specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/kill-switch-cli-confirm-5b`)
- Run: `fanout-kill-switch-cli-confirm-5b-1794780590351-ezt1v0`
- Area: pass-five confirming round `5b`, `kill-switch-cli`
- Fix range: `2a1a42263cc..d21dbc1cafe`; the last commit touching any scope path is `d0f605b42f8`
- Iterations: 3 of 3; stop reason `maxIterationsReached` (no graph-backed convergence decision exists)

## 1. Executive Summary

**Verdict: PASS. hasAdvisories: true.**

- Active findings: P0 = 0, P1 = 0, P2 = 2.
- Five of the six confirmed pass-five P2 findings for this area are fixed at the file and line the verifier named; the sixth is fixed in the section it named and left one folder short in the same file.
- One confirmed finding was fixed at only one of the two sites the pass-five iteration had named: `ENV-REFERENCE.md:74-75` now lists every alias, while `.skilled/hooks/README.md`, the table both docs call the canonical index, still omits four names the resolver honors.
- Review scope: the five `kill-switch-cli` paths in `review-scope-5b.txt` (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md`, `.skilled/skills/system-skill-advisor/runtime/lib/README.md`, `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts`), plus the shared docs that describe them.
- Operator review focus: Confirming round 5b of code review pass five of command surfacing. Read review/review-brief-5b.txt in the packet first and follow it. Review the files in review/review-scope-5b.txt whose area equals your lineage label without its -confirm-5b suffix, plus docs that describe them. Each finding is P0, P1 or P2 with file:line and a concrete input. Check that the shell write reader misses no in-place edit, the COMMAND reader reads only a line the model printed as its own, the arena builder refuses a dirty source, a stale build, an escaping or absolute link and answers a failed check with a JSON line, a live turn checks for a remote every turn and has no network push, the kill-switch names agree in code and docs, and docs agree with code. Never open command-prompts.jsonl, holdout-prompts.jsonl or behaviour-fresh-prompts.jsonl except through jq del(.prompt). Change no code and write only inside your lineage folder.

What the round confirms, in one line each:

| Confirmed pass-five finding | State at `d0f605b42f8` |
|---|---|
| `iter2-P2-env-alias-column` | Fixed at `ENV-REFERENCE.md:74-75`; the canonical index it points to still omits four names (P2 below) |
| `iter2-P2-env-source-column` | Fixed: the CLI and the handler are named in the Source cell |
| `iter2-P2-cp003-control-aliases` | Fixed: the control command unsets all ten names, which is the complete set |
| `iter3-P2-launcher-switch-fixture` | Fixed: the fixture is derived from `ADVISOR_DISABLED_FLAGS` and asserts ten entries |
| `iter3-P2-cli-mk-alias-filter` | Fixed: all ten names run and the `MK_` reason is deliberately loose with a comment |
| `iter3-P2-lib-readme-tree` | Fixed for section 4 (22 modules, 14 folders); section 3 still omits `skill-graph/` (P2 below) |

## 2. Planning Trigger

`/speckit:plan` is **not** required to close this confirming round: the verdict is PASS with two documentation advisories, no P0 and no P1.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": ["c5b-iter1-P2-hooks-index-aliases", "c5b-iter1-P2-topology-skill-graph"],
  "remediationWorkstreams": [
    {
      "order": 1,
      "severity": "P2",
      "finding": "c5b-iter1-P2-hooks-index-aliases",
      "action": "Add MK_HOOKS_DISABLED and the three MK_SKILL_ADVISOR_* names to the hook kill-switch index, or generate that table and ENV-REFERENCE from the resolver constants."
    },
    {
      "order": 2,
      "severity": "P2",
      "finding": "c5b-iter1-P2-topology-skill-graph",
      "action": "Add skill-graph/ to the lib package topology between shared/ and utils/, or state that the section is a curated overview."
    }
  ],
  "specSeed": [
    "The kill-switch alias inventory is a generated artifact, not four hand-edited copies.",
    "A module map section states whether it is exhaustive before a missing entry becomes a defect."
  ],
  "planSeed": [
    "Generate the ENV-REFERENCE switch rows and the hooks README kill-switch index from MASTER_ALIASES and LEGACY_ALIASES, with a test that fails when a doc is short a name.",
    "Add skill-graph/ to lib/README.md section 3 and a check that every folder in section 4 appears in section 3."
  ],
  "findingClasses": ["class-of-bug", "instance-only"],
  "affectedSurfacesSeed": ["hook kill-switch index", "ENV-REFERENCE switch table", "CP-003 control command", "lib package topology", "lib directory tree"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### c5b-iter1-P2-hooks-index-aliases

- Severity: P2. Dimension: traceability.
- File: `.skilled/hooks/README.md:44` (the claim at `:36` and `:40`; the master alias is absent from the whole file).
- Evidence: the row lists four aliases and no `MK_` name; `rg -n "MK_HOOKS_DISABLED|MK_SKILL_ADVISOR" .skilled/hooks/README.md` returns no hit. The resolver honors `MK_HOOKS_DISABLED` as a master alias and the three `MK_SKILL_ADVISOR_*` names as legacy aliases `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:38-41,64-78]`. A read-only probe returned `reason: "master"` for `MK_HOOKS_DISABLED` and `reason: "kill"` for each of the other three. This commit added those names to `ENV-REFERENCE.md:74-75`, and `hook-flags.env.example:12-15` points at `hooks/README.md` as the canonical index. Pass-five iteration 2 named this table as the second site of the same drift `[SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/kill-switch-cli-5/iterations/iteration-002.md:38]`.
- Impact: the file advertised as the single source of truth under-reports the switch set by four names, including the master alias that disables every repo-authored hook. An operator reading it cannot tell that `MK_HOOKS_DISABLED=1` or `MK_SKILL_ADVISOR_PLUGIN_DISABLED=1` works.
- Fix: add the four names, or generate both index tables from the resolver constants.
- Disposition: active. Finding class: class-of-bug. Scope proof: four doc copies compared against `ADVISOR_DISABLED_FLAGS` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:74-81]`; `ENV-REFERENCE.md` and CP-003 carry all ten, `hooks/README.md` carries six of ten. Affected surface hints: ["hook kill-switch index", "ENV-REFERENCE switch table", "CP-003 control command", "resolver alias constants"].

### c5b-iter1-P2-topology-skill-graph

- Severity: P2. Dimension: maintainability.
- File: `.skilled/skills/system-skill-advisor/runtime/lib/README.md:69`.
- Evidence: section 3 `PACKAGE TOPOLOGY` goes from `shared/` to `utils/` and never names `skill-graph/`; section 4 lists it at `:135` and the folder is in the tree at `d21dbc1cafe`. The fix added nine folders to section 4 and left section 3 one short.
- Impact: the only section that carries a purpose line per folder drops the folder that owns the skill graph, which `tests/launcher-bootstrap.vitest.ts` imports and `lib/daemon/lease.js` uses.
- Fix: add `skill-graph/` with a one-line purpose, or state that section 3 is curated.
- Disposition: active. Finding class: instance-only. Scope proof: `git ls-tree` shows 14 folders and 22 modules; section 4 matches all, section 3 matches 13 of 14 folders. Affected surface hints: ["lib package topology", "lib directory tree"].

## 4. Remediation Workstreams

**P0:** none.

**P1:** none.

**P2 advisories, in order:**

1. `c5b-iter1-P2-hooks-index-aliases` — complete the hook kill-switch index, preferably by generating it. This is the one that matters beyond polish: it is the documented inventory of a safety control.
2. `c5b-iter1-P2-topology-skill-graph` — add one folder to the package topology, or mark the section curated.

## 5. Spec Seed

- A kill-switch inventory that claims completeness is generated from the resolver's alias constants; a second hand-maintained copy is a defect waiting for the next alias.
- A topology section states whether it is exhaustive; otherwise a gap cannot be told from curation.

## 6. Plan Seed

- Replace the alias column in `hooks/README.md` and the two rows in `ENV-REFERENCE.md` with generated content from `MASTER_ALIASES` and `LEGACY_ALIASES`, plus a test that a doc listing fewer names than `ADVISOR_DISABLED_FLAGS` fails.
- Add `skill-graph/` to `lib/README.md` section 3 and a consistency check between sections 3 and 4.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | pass | The ten-name set matches `ADVISOR_DISABLED_FLAGS` and the resolver; the two docs now carry all ten; the two tests read the constant `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:74-81]` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:38-78]` |
| `checklist_evidence` | partial | No packet checklist row names this area; the confirming brief is the checklist and both of its kill-switch items are covered, with the two advisories recorded rather than passed silently |

### Overlay Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` | notApplicable | No agent definition changed in this area |
| `agent_cross_runtime` | notApplicable | No runtime mirror changed in this area |
| `feature_catalog_code` | pass | CP-003's control command and the launcher/CLI fixtures checked against the resolver |
| `playbook_capability` | pass | CP-003 unsets the complete env switch set; `DEFAULT_OFF` carries only `session-handover` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:104-106]` |

`AC_COVERAGE`: exempt. This lineage's artifact directory is a fan-out child, not a Level 2+ spec folder with a checklist and an in-progress implementation summary.

## 8. Deferred Items

- The `MK_` bridge and the Vibe adapter: `buildAdvisorPart` reads the same switch through an injected `isEnabled` default `[SOURCE: .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:212-222]`. That file is the `vibe-hooks-doctor` area of this round; whether `ENV-REFERENCE.md:75` should name it as a sixth Source belongs to that lineage, not this one.
- `manual-testing-playbook.md:209` shows the display label `003-global-disable-flag.md` while its href resolves to the real file. The label is cosmetic, the line is unchanged by the fix range, and the file is the `docs-metadata` area. Deferred to that lineage.
- `CHILD_ENV_ALLOWLIST`'s comment about the absent disable switch sits directly above an unrelated key `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:159-161]`. Read as a statement about the allowlist it is accurate; recorded as a reading hazard only.
- Confirming round `5c` is not triggered by this lineage: no P1 was confirmed and no fix commit follows from these two advisories.

## Dimension Expansion Map

- Review directions selected: doc-versus-code name parity (D1/D3), the launcher env trust boundary and test isolation (D2), the duplication cost of four hand-maintained alias copies and two module-map sections (D4).
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Remaining frontier: none recorded; the area's surfaces are all read.

## 9. Search Ledger

| Bug class | Disposition | Rationale |
|---|---|---|
| `alias_set_drift` | confirmed (P2) | The canonical index omits four names the resolver honors |
| `module_map_drift` | confirmed (P2) | Section 3 omits one folder section 4 and the tree have |
| `switch_bypass` | ruled out | `DEFAULT_OFF` has one entry and it is not the advisor; the master and legacy loops cover all ten names |
| `fixture_narrowing` | ruled out | The fixture derives from the constant and asserts ten entries before the env assertion |
| `switch_leak` | ruled out | Exact-set child env allowlist with no switch name; the fixture asserts all ten are dropped |
| `test_isolation` | ruled out | Per-case `mkdtemp` root and a `HOOK_FLAGS_CONFIG` that does not exist |
| `prompt_leak` | ruled out | The three prompt files were counted only (224 / 63 / 36 rows); no reviewed file reads them |
| `fix_provenance` | ruled out | Every scope path's last touching commit is `d0f605b42f8`, inside the range; the diff to `d21dbc1cafe` is empty |

searchDebt: none. ruledOutCandidates: all seven listed above. cleanSearchProof: every dimension's candidate bug classes were either confirmed or ruled out with cited evidence; no class was left unexamined.

## 10. Audit Appendix

### Convergence Summary

- Iterations: 3. New findings per iteration: 2, 0, 0. Weighted new-finding ratios: 1.0, 0.0, 0.0.
- Dimensions covered: correctness, security, traceability, maintainability (4/4).
- Stop reason: `maxIterationsReached`. The coverage graph was unavailable in all three iterations (`graphStatus: unavailable`, `graphConvergenceScore: 0`), so no graph-backed convergence decision existed and the run does not claim `converged`.
- Advisory self-check for P0/P1: not applicable, no P0 or P1 was raised. Both P2s were replayed unchanged in iteration 3 before counting them.

### Ruled-Out Claims

- The `MK_` names are only documentation: disproved by the resolver probe.
- The fix was complete when `ENV-REFERENCE.md` changed: disproved by the canonical index it defers to.
- The lib README fix was complete: disproved by section 3.
- The three added `MK_` test cases share state: disproved by the per-case temp root.
- The reviewed content is stale: disproved by the last-touching-commit check.

### Sources Reviewed

`review-brief-5b.txt`, `review-scope-5b.txt`, `review-focus-5b.txt`, `verify-5/report.md`, `032-review-pass-five-remediation/plan.md`, `review-core.md` (review doctrine), `ENV-REFERENCE.md`, `global-disable-flag.md`, `lib/README.md`, `launcher-bootstrap.vitest.ts`, `skill-advisor-cli-stale-daemon-retry.vitest.ts`, `skill-advisor-cli-test-utils.ts`, `hook-flags.cjs`, `env-aliases.cjs`, `advisor-disabled.ts`, `system-skill-advisor-launcher.cjs`, `hooks/README.md`, `hook-flags.env.example`, `hooks/vibe/prompt-advisor.mjs` (context only), and the pass-five `kill-switch-cli-5` iterations.

### Fix Provenance

The fix for this area landed at `d0f605b42f8` (`fix(system-skill-advisor): close the review pass five findings in the behaviour tooling`), which is an ancestor of `d21dbc1cafe` and of `HEAD` `9c031900e44`. `git diff --stat d0f605b42f8 d21dbc1cafe` over the five scope paths is empty, so the content reviewed here is the fix state and no later commit in the range moved it.

Review verdict: PASS
