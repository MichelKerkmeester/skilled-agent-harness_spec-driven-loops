# Deep Review Report — deepseek lineage

- **Target**: `17a9ddbcb68..555487146e2 -- .skilled/skills/system-deep-loop .skilled/commands/deep` (commit range, 88 files)
- **Session**: `fanout-deepseek-1795201537192-sq1ivw`, generation 1, lineageMode `new`
- **Loop**: 16 iterations, stop reason `all_dimensions_clean`, frontier drained (4 of 4 nodes answered)
- **Depth mode**: expansive (4 frontier nodes: F-1-002, F-1-004, F-1-006, F-2-007)

## 1. Executive Summary

- **Overall verdict: PASS**
- **hasAdvisories: true** — nine active P2 findings, no P0 and no P1.
- **P0/P1/P2 counts: 0 / 0 / 9.** These are the counts the verdict used, read from `deep-review-findings-registry.json` after the terminal-gate pass.
- **Self-check outcomes**: no P0 or P1 was raised, so the adversarial self-check had no finding to confirm, downgrade or call a false positive. The terminal gates recorded `evidence`, `scope` and `coverage` all `pass` with no failed required gate.
- **Review scope summary**: the three commits in the range (`47ba2a08a85` withhold the blocked-stop record from a dry run, `8170db46079` mint review row identity and refuse a reused key, `5554871462e` keep the dry-run convergence call read-only) plus the surrounding executor-adapter, gateway, fan-out and documentation surfaces they touch. All 88 changed files were in scope; the review concentrated on the executor adapter contract, the append gateway, the fan-out containment call site, and the command/reference/feature-catalog docs.
- **Operator review focus**: none supplied (`reviewFocus` is null).

## 2. Planning Trigger

`/speckit:plan` is **not required** for a PASS verdict. The findings are advisory; a follow-up plan is optional and, if taken, should fold the five doc/contract corrections into one documentation pass rather than nine separate changes.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "R1-P2-001", "severity": "P2", "title": "dsh danger-full-access is narrowed to workspace-write while provenance records the requested mode and none enforcement", "file": ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3605"},
    {"id": "R1-P2-002", "severity": "P2", "title": "The auto-approve-flag sandbox surface describes a flag that is no longer mode-discriminating", "file": ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:165-170"},
    {"id": "R2-P2-001", "severity": "P2", "title": "The gateway strips a model row's identity fields from the envelope but the projected state-log row still carries them", "file": ".skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:483-489"},
    {"id": "R3-P2-001", "severity": "P2", "title": "The executor catalog claims the conformance test fails on any builder drift, but its permission-mode assertion cannot see a same-mode collapse", "file": ".skilled/skills/system-deep-loop/runtime/feature-catalog/executor/executor-config.md:29"},
    {"id": "R4-P2-001", "severity": "P2", "title": "Both presentations and both compiled contracts still say cli-pi has no sandbox flag while the config now accepts sandboxMode for it", "file": ".skilled/commands/deep/assets/deep-review-presentation.txt:226"},
    {"id": "R8-P2-001", "severity": "P2", "title": "The state-format reference omits frontierNodeId from the iteration record's optional fields, though the stop decision reads it first", "file": ".skilled/skills/system-deep-loop/deep-review/references/state/state-jsonl.md:101"},
    {"id": "R11-P2-001", "severity": "P2", "title": "The identity strip is a denylist that misses four fields buildPreparedInput reads from the same metadata", "file": ".skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:108-115"},
    {"id": "R12-P2-001", "severity": "P2", "title": "The executor help text is hand-maintained in four files and the only test that reads them checks a single rejected flag", "file": ".skilled/commands/deep/assets/deep-review-presentation.txt:142"},
    {"id": "R13-P2-001", "severity": "P2", "title": "sandboxEnforcementFor cannot see the fan-out containment guard, so a devin workspace-write lineage records none although the capability record names that guard as its compensating control", "file": ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3337"}
  ],
  "remediationWorkstreams": [
    {"id": "WS-1", "title": "Align sandbox provenance with the emitted command", "findings": ["R1-P2-001", "R13-P2-001"], "findingClasses": ["class-of-bug"]},
    {"id": "WS-2", "title": "Complete the gateway identity strip and its projection", "findings": ["R2-P2-001", "R11-P2-001"], "findingClasses": ["class-of-bug", "instance-only"]},
    {"id": "WS-3", "title": "Correct the executor contract docs and their drift guards", "findings": ["R1-P2-002", "R3-P2-001", "R4-P2-001", "R12-P2-001"], "findingClasses": ["cross-consumer", "matrix/evidence", "instance-only"]},
    {"id": "WS-4", "title": "Complete the iteration record schema reference", "findings": ["R8-P2-001"], "findingClasses": ["instance-only"]}
  ],
  "specSeed": [
    "Sandbox provenance: define whether sandboxEnforcement describes the command or the run, then make the dsh and devin entries agree with that definition.",
    "Gateway identity: state the complete set of envelope fields a model row may not set, and whether the projected row keeps them.",
    "Executor help: name one source for the per-kind sandbox text and the parity assertion that keeps the four copies aligned."
  ],
  "planSeed": [
    "Add a per-kind, per-mode sandboxEnforcement matrix test to executor-adapter-capabilities.vitest.ts.",
    "Extend GATEWAY_IDENTITY_FIELDS to streamId, streamSequence, correlationId and causationId, or document why they stay.",
    "Add a normalized parity assertion for the four hand-maintained executor help copies.",
    "Add frontierNodeId to the state-jsonl optional-field list.",
    "Correct the pi line in both presentations and regenerate both compiled contracts."
  ],
  "findingClasses": ["class-of-bug", "cross-consumer", "matrix/evidence", "instance-only"],
  "affectedSurfacesSeed": [
    "dsh command builder",
    "devin command builder",
    "sandboxEnforcementFor",
    "append-mode-event CLI",
    "deep-review-state-contract projection",
    "executor adapter conformance test",
    "deep-review-presentation.txt",
    "deep-research-presentation.txt",
    "state-jsonl.md"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | File | Disposition |
|----|----------|-----------|-------|------|-------------|
| R1-P2-001 | P2 | correctness | dsh `danger-full-access` narrowed to `workspace-write` while provenance records the requested mode and `none` enforcement | `fanout-run.cjs:3605`, `:2821-2824` | active |
| R1-P2-002 | P2 | correctness | `auto-approve-flag` surface describes a flag that is no longer mode-discriminating | `executor-config.ts:165-170`, `:246-252` | active |
| R2-P2-001 | P2 | correctness | Gateway strips identity fields from the envelope but the projected row keeps them | `append-mode-event.cjs:483-489`, `deep-review-state-contract.ts:291-296` | active |
| R3-P2-001 | P2 | correctness | Catalog claims the conformance test catches any builder drift; its `permission-mode` assertion cannot see a same-mode collapse | `executor-config.md:29`, `executor-adapter-capabilities.vitest.ts:308-312` | active |
| R4-P2-001 | P2 | security | Both presentations and both compiled contracts say `cli-pi` has no sandbox flag while the config accepts `sandboxMode` | `deep-review-presentation.txt:226`, `deep-research-presentation.txt:199` | active |
| R8-P2-001 | P2 | traceability | State-format reference omits `frontierNodeId` from the optional fields | `state-jsonl.md:101`, `convergence.cjs:1415` | active |
| R11-P2-001 | P2 | maintainability | Identity strip is a denylist missing `streamId`, `streamSequence`, `correlationId`, `causationId` | `append-mode-event.cjs:108-115`, `:334-343` | active |
| R12-P2-001 | P2 | maintainability | Executor help text is hand-maintained in four files; the only test reading them checks one rejected flag | `deep-review-presentation.txt:142`, `executor-branch-contract.vitest.ts:145-149` | active |
| R13-P2-001 | P2 | correctness | `sandboxEnforcementFor` cannot see the fan-out containment guard, so devin `workspace-write` records `none` | `fanout-run.cjs:3337`, `executor-config.ts:303` | active (refined by R15-P2-001) |

Each row's full evidence, scope proof and affected-surface hints are in its iteration file and in the delta `finding` rows.

## 4. Remediation Workstreams

**P0**: none.

**P1**: none.

**P2 advisories, ordered by blast radius:**

1. **WS-1 — Sandbox provenance (R1-P2-001, R13-P2-001).** Decide what `sandboxEnforcement` describes. If it describes the command, correct the devin record comment; if it describes the run, set `compensatingControl` for devin `workspace-write` and make the dsh builder report the mode it actually emits. Add a per-kind, per-mode label matrix test.
2. **WS-2 — Gateway identity (R2-P2-001, R11-P2-001).** Either strip the four missing fields and the projected row's copy, or document that the projection keeps them. The catalog sentence and the code comment must say the same thing as the code.
3. **WS-3 — Executor docs and drift guards (R1-P2-002, R3-P2-001, R4-P2-001, R12-P2-001).** Correct the pi line in both presentations, regenerate both compiled contracts, fix the `auto-approve-flag` doc, strengthen the `permission-mode` assertion to compare all three modes, and add a normalized parity assertion across the four hand-maintained help copies.
4. **WS-4 — Record schema (R8-P2-001).** Add `frontierNodeId` to the optional-field list and say it is the first-choice node attribution field.

## 5. Spec Seed

- The executor adapter contract should state, once, whether `sandboxEnforcement` is a property of the command or of the run, because the dsh and devin findings are both consequences of that ambiguity.
- The gateway contract should enumerate every envelope field a model-written row may not set, not only the four it currently strips.
- The command help should name one source of truth for per-kind sandbox text and the test that keeps the copies aligned.

## 6. Plan Seed

- Add `sandboxEnforcement` assertions to `executor-adapter-capabilities.vitest.ts` for every kind and all three modes.
- Extend or justify `GATEWAY_IDENTITY_FIELDS`.
- Add a normalized parity assertion for `review.md`, `research.md` and both presentations.
- Add `frontierNodeId` to `state-jsonl.md`.
- Fix the pi line and regenerate the compiled contracts.

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Drift |
|----------|--------|----------|-------|
| `spec_code` | pass | commit messages vs diffs; `fanout-run.cjs:4162-4170`; `append-mode-event.cjs:429-495`; `convergence.cjs` `--read-only` refusal | none found |
| `checklist_evidence` | notApplicable | - | commit-range target, no spec checklist |

**Overlay protocols**

| Protocol | Status | Evidence | Drift |
|----------|--------|----------|-------|
| `feature_catalog_code` | partial | `executor-config.md:29`, `append-mode-event-script.md:29`, `fanout-run.md:193,197` | two catalog claims overstate what the code guarantees (R3-P2-001, R2-P2-001) |
| `playbook_capability` | pass | `manual-testing-playbook.md:14,47,104`; `review-quality-guards-block-premature-stop.md` | none |
| `skill_agent` | notApplicable | - | no agent definition in the range |
| `agent_cross_runtime` | notApplicable | - | no runtime mirror in the range |

**AC_COVERAGE**: exempt — the review target is a commit range, not a spec folder.

**Resource Map Coverage Gate**: `resource-map.md` is not present in the spec folder, so the gate is skipped. The lineage emitted its own `resource-map.md` from the converged deltas.

## 8. Deferred Items

- **`write-containment.ts` internals.** The guard's path construction is outside the commit range, so its quarantine path was not reviewed. A future review of that file should check the quarantine copy's own write path.
- **The canonical-envelope identity path.** A caller that hands a full envelope keeps its identity by design; the review confirmed the authorization epoch is still server-side, so the exception is provenance-only. No action.
- **Claude's `preventive` label under `acceptEdits`.** Judged consistent with the capability record's stated definition; revisit only if the record's definition changes.

## Dimension Expansion Map

- **Completed pivots**: 0
- **Failed pivots**: 0
- **Audited overrides**: 0
- **Swept**: none
- **Pivot lineage**: none
- **Frontier**: 4 nodes, all `answered` — F-1-002 (adapter contract and sandbox), F-1-004 (gateway identity), F-1-006 (docs and contracts), F-2-007 (sandbox enforcement label matrix, admitted from F-1-002 during iteration 1).
- **Remaining frontier**: none.

## 9. Search Ledger

- **searchCoverage**: not emitted as a v2 record; this lineage ran the legacy unversioned record shape, which the rollout still accepts. The reducer's `searchDebt` is empty at stop (`search_debt: 0`), because every frontier node is answered.
- **candidateCoverage**: the v2 candidate-coverage gate passes trivially when the review-depth-v2 search path is inactive, which it is here.
- **ruledOutCandidates**: the per-iteration `ruled_out` rows are in `deltas/iter-NNN.jsonl`; the reducer consolidated them into the strategy's exhausted-approaches section.
- **cleanSearchProof**: the terminal gates recorded `evidence`, `scope` and `coverage` all `pass` with digests `063c8560…`, `a40a6326…` and `f81df440…`.

## 10. Audit Appendix

- **Convergence summary**: 16 iterations, stop reason `all_dimensions_clean`, stuck count 1, consecutive failures 0, weighted stop score computed by `convergence.cjs` with no failed legal-stop gate.
- **Coverage summary**: correctness, security, traceability and maintainability each covered on all four frontier nodes; dimension coverage 4 of 4.
- **Ruled-out claims**: 26 `ruled_out` rows across the 16 deltas, consolidated by the reducer.
- **Sources reviewed**: the 88 files in `reviewScopeFiles`, with the deepest reads in `executor-config.ts`, `executor-audit.ts`, `fanout-run.cjs`, `append-mode-event.ts`, `append-mode-event.cjs`, `deep-review-state-contract.ts`, `convergence.cjs`, both command docs, both presentations, both compiled contracts, the feature catalogs, the playbooks and the conformance tests.

### Core Protocols

- `spec_code`: pass — each commit message names a behavior its diff implements.
- `checklist_evidence`: notApplicable — no spec checklist for a commit-range target.

### Overlay Protocols

- `feature_catalog_code`: partial — two catalog claims overstate the code (R3-P2-001, R2-P2-001).
- `playbook_capability`: pass — no playbook asserts a confinement property the runtime lacks.
- `skill_agent`: notApplicable.
- `agent_cross_runtime`: notApplicable.

Review verdict: PASS
