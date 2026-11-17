# Review Report — fixes-11

**Lineage:** `fixes-11` (detached fan-out, review pass eleven)
**Review target:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
**Session:** `fanout-fixes-11-1794851543294-mlt3r6`
**Stop reason:** `maxIterationsReached` (8 iterations)
**Artifact dir:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/fixes-11`

## 1. Executive Summary

- **Overall verdict:** FAIL
- **hasAdvisories:** false
- **P0/P1/P2 counts the verdict used:** P0=0, P1=2, P2=5
- **Why FAIL rather than CONDITIONAL:** no P0 is active, but the terminal stop left a required quality gate failing: both core traceability protocols are `partial`, so `review-verdict.cjs` returns FAIL with `failed_required_gate_ids: ["coverage"]` once the terminal gates row is present. The iteration final lines say CONDITIONAL because they map findings only; the synthesis verdict is the one a release decision reads.
- **Iterations:** 8 (six productive/verification passes, one recovery pass, one final consolidation)
- **Review scope:** the five `fixes` paths of `review-scope-11.txt` — `command-attach.ts`, its guards test, the doctor install presentation, the doctor install workflow and the doctor install contract test — reviewed under all four dimensions.
- **Operator review focus:** review pass eleven, area `fixes`, per `review/review-brief-11.txt`: the single quote `commandOnlyMentioned` now drops only where it opens a command name, and the doctor install presentation, workflow and contract test that now name the runtimes the link manifest offers.

### Self-check outcomes

| Finding | Call |
|---------|------|
| `FIX11-P1-001` | Confirmed (reproduced in iterations 1, 3, 5, 6 with the compiled module and the two production call sites) |
| `FIX11-P1-002` | Confirmed (reproduced in iterations 3, 5, 6; a canonical-name control shows the guard itself works) |
| `FIX11-P2-001` … `FIX11-P2-005` | Confirmed as P2; the recovery pass tested each for upgrade and none qualified |

### Headline

The pass-ten quote fix does what its tests say for **one** quoted command, but a quoted command inside an or-list still loses its refusal for every command after it, and the advisor delivers or offers the refused command (`FIX11-P1-001`). Separately, the retired-name map makes the same guard read a name the reader never typed, so refusing `/create:skill` still delivers `/create:sk-skill` (`FIX11-P1-002`). The doctor runtime naming is correct on membership — all eight manifest runtimes appear in the presentation, the workflow, the manifest and the engine — but the contract test no longer checks the workflow half its title claims, the acceptance criterion covers a narrower input than the requirement, and three low-severity clarity defects remain.

## 2. Planning Trigger

`/speckit:plan` is required: two active P1 findings need remediation.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    "FIX11-P1-001",
    "FIX11-P1-002",
    "FIX11-P2-001",
    "FIX11-P2-002",
    "FIX11-P2-003",
    "FIX11-P2-004",
    "FIX11-P2-005"
  ],
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "priority": "P1",
      "findings": ["FIX11-P1-001"],
      "action": "Teach the refusal/question match to bridge a closing single quote around a command name in an or-list, or strip the closing quote where it follows a command name, and add the quoted or-list cases to the guards test."
    },
    {
      "id": "WS-2",
      "priority": "P1",
      "findings": ["FIX11-P1-002"],
      "action": "Run the refusal guard against the typed (retired) name before the RETIRED_COMMANDS mapping, or pass the typed name through to commandOnlyMentioned, and add a retired-name refusal case to the guards test."
    },
    {
      "id": "WS-3",
      "priority": "P2",
      "findings": ["FIX11-P2-001", "FIX11-P2-002"],
      "action": "Restore a workflow runtime assertion in the doctor contract test, and widen AC-006 (or narrow REQ-006) so the acceptance evidence covers the quoted or-list shape."
    },
    {
      "id": "WS-4",
      "priority": "P2",
      "findings": ["FIX11-P2-003", "FIX11-P2-004", "FIX11-P2-005"],
      "action": "Correct the fold comment, rewrite the accepted-answer sentence, and drop the subsumed assertion."
    }
  ],
  "specSeed": [
    "REQ-006 should state whether a quoted command inside an or-list reads like the plain form; the current wording implies it does and the code does not.",
    "Record the retired-name guard as a requirement: a refusal of a retired command name must withhold its successor.",
    "REQ-006's doctor clause should name which surfaces the contract test must assert (presentation, workflow, manifest)."
  ],
  "planSeed": [
    "Add quoted or-list cases to command-attach-guards.vitest.ts (refusal and question forms) before changing the fold.",
    "Add a retired-name refusal case (typedCommandForTop and attachCommand) before changing the mapping order.",
    "Restore the workflow runtime assertion in doctor-install-contract.test.cjs and add a presentation-prompt list assertion.",
    "Broaden AC-006's given to include the or-list and retired-name inputs, with observed evidence."
  ],
  "findingClasses": [
    "correctness: quote normalization does not bridge a closing quote in an or-list",
    "security: refusal guard reads the mapped command name instead of the typed retired name",
    "traceability: contract test and acceptance criterion cover fewer surfaces than the requirement names",
    "maintainability: comment accuracy, accepted-answer wording, dead assertion"
  ],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:385,427,438-442,504,259,217-219,243",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:156,172-190",
    ".skilled/commands/doctor/assets/doctor-install-presentation.txt:78",
    ".skilled/commands/doctor/assets/doctor-install.yaml:46,58",
    ".skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:238-244"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Evidence | Impact | Fix recommendation | Disposition | Finding class | Scope proof | Affected surface hints |
|----|----------|-------|-----------|-----------|----------|--------|--------------------|-------------|--------------|-------------|------------------------|
| `FIX11-P1-001` | P1 | A quoted command in an or-list hides the refusal for every later command | correctness | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:427` | `:385` or-list grammar, `:438-442` lead match, `:504` offer, compiled-module probe | `do not run '/create:agent' or '/create:readme'` returns `false` for `/create:readme`; the command is offered and the typed path delivers it | Bridge or strip the closing quote; add or-list cases | Open | Correctness: incomplete quote normalization | Prompt is chat text; tracked command; both call sites in the reviewed file | `MODE_COMMANDS[sk-doc][sk-create-readme]`, offer and typed paths, every or-list |
| `FIX11-P1-002` | P1 | Refusing the retired `/create:skill` name still delivers `/create:sk-skill` | security | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:259` | `:217-219`, `:243`, `:504`, compiled-module probes | `typedCommandForTop` returns the successor on a refusal of the old name; `attachCommand` does too | Guard the typed name before mapping | Open | Security: refusal guard reads the mapped name | Retired mapping is deliberate; both production paths in scope | `RETIRED_COMMANDS`, `typedCommandForTop`, `attachCommand`, sk-create-skill row |
| `FIX11-P2-001` | P2 | The doctor contract test no longer checks the workflow its title claims | traceability | `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:238` | `:241-243`, `doctor-install.yaml:46,58`, reviewed diff | Dropping `dsh` from the workflow keeps the test green | Restore a workflow runtime assertion | Open | Traceability: title overclaims coverage | Test file in scope; `WORKFLOW` loaded at `:31` | Contract test, workflow input and Ask step |
| `FIX11-P2-002` | P2 | AC-006's verification instance is narrower than REQ-006 | traceability | `039-main-sk-doc-routing-repair/acceptance-criteria.md:59` | `spec.md:134`, `tasks.md:60`, guards table | The acceptance row is `Met` while the or-list input fails | Widen the AC or narrow the REQ | Open | Traceability: evidence narrower than requirement | Packet docs owned by the target | REQ-006, AC-006, T010 evidence |
| `FIX11-P2-003` | P2 | The fold comment claims quote marks around a name are dropped, but only the opening single quote is | maintainability | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:413` | Comment block `:409-421`, fold `:423-429` | A maintainer expects symmetry that does not exist; the paragraph splits mid-sentence at `:417` | Correct the claim and rejoin the sentence | Open | Maintainability: comment accuracy/readability | Comment and fold are the changed lines | `commandOnlyMentioned` fold and its readers |
| `FIX11-P2-004` | P2 | The accepted-answer sentence fuses the accepted list with "the ones already there" | maintainability | `.skilled/commands/doctor/assets/doctor-install-presentation.txt:78` | `:78`, manifest, `symlink-engine.cjs:435-438` | First-read ambiguity about which answers are accepted | Rewrite the sentence | Open | Maintainability: user-facing wording | Changed line in the reviewed diff | `/doctor:install` accepted answers and re-ask rule |
| `FIX11-P2-005` | P2 | A contract assertion is fully subsumed by the next line | maintainability | `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:239` | `:239-240` | Carries no independent signal | Delete or merge | Open | Maintainability: dead assertion | Both lines in the test file | Runtime-count guard |

No finding was resolved or downgraded during the run. The compiled advisor build under `runtime/dist` carries the same code as the source; both stay as reviewed.

## 4. Remediation Workstreams

**P0:** none.

**P1 — must clear before the next release gate:**

1. **WS-1 — quoted or-list refusals** (`FIX11-P1-001`). Touch `commandOnlyMentioned`'s fold and the `COMMAND_OR_LIST` bridge; add the quoted or-list refusal and question cases to the guards table. Reproduce with `do not run '/create:agent' or '/create:readme'` before and after.
2. **WS-2 — retired-name refusals** (`FIX11-P1-002`). Make `typedCommandForTop` guard the typed name, and make `attachCommand` fall back to the typed retired name when the prompt contains one; add a retired-name case and a canonical-name control.

**P2 — advisories, separate from the P1 work:**

3. **WS-3 — evidence coverage** (`FIX11-P2-001`, `FIX11-P2-002`): restore the workflow runtime assertion; widen AC-006 or narrow REQ-006.
4. **WS-4 — clarity** (`FIX11-P2-003` … `FIX11-P2-005`): correct the fold comment, rewrite the accepted-answer sentence, drop the subsumed assertion.

## 5. Spec Seed

- REQ-006 should state the or-list case explicitly and whether a quoted command name must read like the plain form inside a list.
- Add a requirement for retired command names: a refusal of the retired name must withhold the successor from both the offer path and the typed path.
- REQ-006's doctor clause should name the surfaces the contract test must assert: presentation sentence, presentation prompt list, workflow Ask step and the manifest-derived list.
- AC-006's given should include the or-list and retired-name inputs, with observed evidence, so the `Met` row cannot close the requirement while those inputs fail.
- The fold comment should be treated as part of the contract: the closing-quote asymmetry is a behavior future maintainers must know.

## 6. Plan Seed

1. Add failing guards cases: `do not run '/create:agent' or '/create:readme'` (refusal, second command), `what does '/create:agent' or '/create:readme' do?` (question), `do not run /create:skill yet` (retired name) and a canonical control.
2. Fix the or-list bridge and the retired-name guard; rerun the compiled-module probes from iteration 6.
3. Restore the doctor workflow assertion; add a presentation prompt-list assertion if the prompt list is meant to be complete.
4. Widen AC-006 and record observed evidence; keep T010/T011 accurate.
5. Close the three P2 clarity items in the same change or a follow-up, but do not let them delay the P1 work.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | `039-main-sk-doc-routing-repair/spec.md:134`; `command-attach.ts:427`; guards tests `:178-181`; doctor surfaces `presentation:78`, `yaml:58`, manifest, `symlink-engine.cjs:435-438` | Quote half met for the single-command shape only; retired-name guard not covered by the requirement; doctor half holds. |
| `checklist_evidence` | partial | `acceptance-criteria.md:59` (`Met`); `tasks.md:60-61` (T010/T011) | AC-006 is narrower than REQ-006; the contract test no longer checks the workflow. |

`AC_COVERAGE`: pass on the packet's own rows (all `Met`), with the caveat that AC-006's instance does not cover the failing or-list input.

### Overlay Protocols

| Protocol | Status | Note |
|----------|--------|------|
| `skill_agent` | notApplicable | No agent definition changed in this scope. |
| `agent_cross_runtime` | notApplicable | No runtime mirror or agent mirror changed. |
| `feature_catalog_code` | notApplicable | No feature catalog entry is touched by these paths. |
| `playbook_capability` | notApplicable | No playbook capability changed. |

## 8. Deferred Items

- The doctor presentation's two runtime-list orders (prompt at `:58`, accepted-answer at `:78`) are not a defect; only one is asserted. Folding it into WS-3 is optional.
- The line-break refusal case (`do not run\n'/create:readme'`) is documented sentence-boundary behavior, not a defect. If bulleted refusals matter later, that is a new requirement, not a fix for this pass.
- The doctor printed-command defensive-depth question (operator-supplied runtime string) is closed by the engine's unknown-runtime refusal and the presentation's re-ask rule; no action needed.
- Review pass ten's open P2 in `review/report.md` and the `038-alignment-p1-remediation/scratch/alignment-final-dispositions.md` open P2 list are recorded elsewhere and were not re-reported here.

## 9. Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: correctness, traceability, security and maintainability were each covered; iterations 5-8 produced no new finding.
- Selected review directions: quote fold (correctness), packet evidence (traceability), guard bypass (security), clarity/test cost (maintainability).
- Remaining frontier: none inside the declared scope; remediation is the next step.

## 10. Search Ledger

*No search-depth state captured (legacy v1 record).*

`searchDebt` is empty. The ruled-out directions were: curly/double quote regressions, longer-command matching, manifest membership drift, a stale shipped build, ReDoS, doctor printed-command injection, canonical-name guard failure, a second quoted-shape evasion beyond `FIX11-P1-001`, P2-to-P1 upgrades and line-level defects.

## 11. Audit Appendix

### Convergence summary

- Stop reason: `maxIterationsReached` (iteration cap 8).
- Stop decision at iteration 8: STOP with `blockedBy: ["dimensionCoverageGate"]`; the convergence signal was `rollingAverage 0`, `madNoiseFloor 0.148`, `dimensionCoverage 1.0`.
- The iterations before the cap had already reached zero novelty; the loop reported `stuckRecovery` at iterations 6 and 7 and the recovery directives were applied (P2 upgrade review, core protocol replay, final consolidation).
- Iteration ratios: 1.0, 0.29, 0.42, 0.2, 0.0, 0.0, 0.0, 0.0.

### Coverage summary

- Dimensions: correctness, security, traceability, maintainability — 4/4 covered.
- Scope files: 5/5, each under all four dimensions.
- Registry: 7 active findings (0 P0, 2 P1, 5 P2), 0 resolved.
- Iterations 1-8: narrative and delta present for each; the state log carries one canonical iteration record per pass.

### Ruled-out claims

Listed in section 10; each was tested with a concrete input or source read, not assumed.

### Sources reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts`
- `.skilled/commands/doctor/assets/doctor-install-presentation.txt`
- `.skilled/commands/doctor/assets/doctor-install.yaml`
- `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs`
- Context evidence: `039-main-sk-doc-routing-repair/spec.md`, `acceptance-criteria.md`, `tasks.md`, `implementation-summary.md`, `.skilled/commands/doctor/assets/symlink-manifest.json`, `.skilled/commands/doctor/scripts/symlink-engine.cjs`, `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js`.

### Cross-reference appendix — Core Protocols

`spec_code` and `checklist_evidence`, both partial, with the evidence in section 7.

### Cross-reference appendix — Overlay Protocols

All four overlay protocols are `notApplicable` for this scope, with the reasons in section 7.

### Caveat for the release decision

`review-verdict.cjs` returns FAIL with `failed_required_gate_ids: ["coverage"]`: 0 P0 and 2 P1 are active, and the coverage gate is failing because both core protocols are `partial`. The finding counts alone would map to CONDITIONAL, so every iteration's final line says CONDITIONAL; the synthesis verdict is recomputed with the terminal gates and is the release-facing one. WS-1 and WS-3 are the work that clears the finding side; a protocol pass is the work that clears the gate.

### Holdout hygiene

No holdout prompt text was read or printed at any point; no command-prompt corpus was opened, and the holdout gate was read by count only.
