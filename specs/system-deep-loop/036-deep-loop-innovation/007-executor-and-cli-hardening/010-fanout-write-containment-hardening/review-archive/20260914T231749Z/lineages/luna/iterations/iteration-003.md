# Deep Review Iteration 003

## Focus

Traceability across command callers, phase-007 removal decisions, executable defaults, and canonical packet records.

## Files Reviewed

- `.opencode/commands/deep/assets/deep-review-auto.yaml:1293-1369`
- `.opencode/commands/deep/assets/deep-review-confirm.yaml:1164-1213`
- `.opencode/commands/deep/assets/deep-research-auto.yaml:1475-1521`
- `.opencode/commands/deep/assets/deep-research-confirm.yaml:1092-1126,1523-1525`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:695-709`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/007-worktree-removal/spec.md:38-90`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/007-worktree-removal/acceptance-criteria.md:57-59`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/goal.md:57-64`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:528-548`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:139,192`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:48-50,79,102-108`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:55-61,83-112`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/handover.md:23-37`

## Findings

### P0

- **LUNA-F003**: Quarantine destinations are not canonicalized before trusted writes — `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:943` — carried from iteration 2; the trusted writer still has no destination boundary check.

### P1

- **LUNA-F001**: Pre-existing untracked deletions disappear from the baseline diff — `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:823` — carried from iteration 1.
- **LUNA-F002**: Failed or incomplete lanes skip containment entirely — `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3381` — carried from iteration 1.
- **LUNA-F004**: Command caller migration still contains removed worktree assumptions and raw state writes — `.opencode/commands/deep/assets/deep-review-auto.yaml:1307` — the auto review branch rejects a shared checkout and appends a recovery record directly, while the four command surfaces retain divergent inline containment/gateway paths after phase 007 removed worktree isolation.
- **LUNA-F005**: Canonical packet records disagree about whether isolation exists and is default — `specs/system-deep-loop/045-fanout-write-containment-hardening/goal.md:62` — the goal and ADR-006/ADR-007 say off-by-default and removed, while the parent requirements, acceptance metadata, summary, and handover still require or report worktree default-on behavior.
- **LUNA-F006**: Churn threshold rationale contradicts the executable defaults — `specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:192` — the rationale says twelve per heartbeat and forty cumulative, while REQ-004 and the schema ship three and twelve, leaving operators without one authoritative safety threshold contract.

### P2

None.

## Claim Adjudication Packets

```json
{"findingId":"LUNA-F004","claim":"The command-level migration is incomplete: deep-review-auto still requires an isolated linked worktree and directly appends a recovery record, while the review and research command surfaces retain separate inline containment paths after phase 007 removed worktree isolation.","evidenceRefs":[".opencode/commands/deep/assets/deep-review-auto.yaml:1304-1308",".opencode/commands/deep/assets/deep-review-auto.yaml:1365-1369",".opencode/commands/deep/assets/deep-review-confirm.yaml:1164-1198",".opencode/commands/deep/assets/deep-research-auto.yaml:1475-1521",".opencode/commands/deep/assets/deep-research-confirm.yaml:1092-1126,1523-1525","specs/system-deep-loop/045-fanout-write-containment-hardening/007-worktree-removal/spec.md:50-71","specs/system-deep-loop/045-fanout-write-containment-hardening/007-worktree-removal/acceptance-criteria.md:57-59"],"counterevidenceSought":["A shared-checkout-compatible, gateway-only caller path in every one of the four command YAMLs, with no removed worktree preflight or direct state-log append."],"alternativeExplanation":"Some executor branches already use shared checkout inputs, but that does not remove the explicit isolated-worktree rejection or the raw append in the auto review branch.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"A repository-wide caller sweep showing all four YAMLs use the current shared-checkout/gateway contract would invalidate this finding."}
```

```json
{"findingId":"LUNA-F005","claim":"The packet's current-state records are mutually inconsistent: goal and accepted ADRs remove worktrees and make isolation opt-in, while parent requirements and closure records still describe worktree default-on behavior.","evidenceRefs":["specs/system-deep-loop/045-fanout-write-containment-hardening/goal.md:62-63","specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:528-548","specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:133,141","specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:48-50,79,102-108","specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:83-112","specs/system-deep-loop/045-fanout-write-containment-hardening/handover.md:35-37"],"counterevidenceSought":["A supersession marker or reconciled current-state section that removes the obsolete requirement and acceptance claims from the packet closure surface."],"alternativeExplanation":"The documents may be historical records, but the parent requirement and acceptance closure still present the obsolete behavior as current and met.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Marking the obsolete rows superseded and publishing one authoritative current-state contract would invalidate the inconsistency finding."}
```

```json
{"findingId":"LUNA-F006","claim":"The safety rationale states different churn defaults from the requirement and schema, so an operator cannot tell whether the shipped thresholds are 3/12 or 12/40.","evidenceRefs":["specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:139","specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:192",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:701-706"],"counterevidenceSought":["A current threshold table or amendment that explicitly supersedes the rationale's 12/40 values."],"alternativeExplanation":"The executable schema is unambiguous at 3/12, but the rationale is part of the operator-facing safety contract and is not marked obsolete.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"A documented supersession tying the rationale to 3/12, or changing the rationale and acceptance evidence to the shipped values, would invalidate this finding."}
```

## Ruled Out

- The feature-catalog surface itself describes shared-checkout churn and does not add a new worktree requirement at `.opencode/skills/system-deep-loop/feature-catalog/fanout-write-containment/fanout-write-containment.md:8-28`.
- The manual testing playbook points to shared-checkout preservation at `.opencode/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:176`; the caller YAML and parent packet contradictions remain separate.

## Traceability Checks

- `spec_code`: fail. Accepted goal/ADR decisions, parent requirements, executable caller branches, and closure records do not describe one current contract.
- `checklist_evidence`: partial. Acceptance rows assert both removed worktrees and default-on worktrees as met, so the evidence is internally non-authoritative.
- `feature_catalog_code`: pass for the reviewed fan-out feature entry; it describes shared-checkout behavior.
- `playbook_capability`: pass for the reviewed shared-checkout preservation entry; no removed worktree capability was found there.
- `skill_agent`: notApplicable; the target is a spec folder.
- `agent_cross_runtime`: notApplicable; this lineage is inline cli-codex.

## Next Focus

Maintainability: retention, test gaps, duplicate contract seams, and whether the remediation remains operable over repeated passes.

## Assessment

Dimensions addressed: traceability. Three new P1 contract findings are independently supported; the P0 and two earlier P1s remain active. Convergence remains telemetry only until iteration 5.

Review verdict: FAIL
