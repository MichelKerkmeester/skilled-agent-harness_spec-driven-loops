# Task 7B Historical Documentation Evidence

## Scope and Dependency

- Date: `2026-07-11`
- Writable scope: `timeline.md`, `before-vs-after.md`, `feature-flags.md` and this evidence log.
- Dependency verdict: `topology_state=applied_verified`. The manifest reports `status: applied`; the migration log records all eight post-apply checks as `pass` and says the topology remains applied because transaction verification passed.
- Migration evidence: `scratch/topology-migration-manifest.json` and `scratch/topology-migration-log.md` were read before mutation.
- Historical policy: dated phase labels, benchmark labels, commands, findings and execution evidence remain unchanged in meaning. Old IDs remain historical aliases. Only current-navigation targets and current-state summaries changed.

## Changed References

- `timeline.md`: repointed five current links through exact manifest mappings and appended the dated topology-consolidation event.
- `before-vs-after.md`: added the current root map, repointed three dated-evidence links, corrected three current-state paths and replaced the stale packet-wide clean-validation claim with the migration log's current result.
- `feature-flags.md`: added the phase-alias policy and repointed five current links while preserving old IDs in benchmark prose and table evidence.
- No global numeric replacement was used. Every replacement was an exact, asserted string edit.

## Preserved Historical Aliases

- Root aliases preserved in dated prose: `000-release-cleanup`, `001-speckit-memory`, `002-spec-data-quality`, `003-review-remediation`, `004-dark-flag-graduation` and `005-speckit-surface-alignment`.
- Date-bound child IDs, commit hashes, command names, benchmark metrics, review counts and execution verdicts were not renumbered.
- Numbered changelog support directories retain their historical names under the migration contract.

## Uncertainties Preserved

- Retry correction: the historical label `changelog/002-spec-data-quality/` now targets the existing current directory `./changelog/003-spec-data-quality/`. The label remains historical evidence; the navigation target resolves.
- Retry correction: the two missing cross-packet changelog targets were replaced with the existing phase `implementation-summary.md` targets under `system-code-graph/001-code-graph-core/009-daemon-reclaim-hardening` and `010-edge-confidence-and-ppr-revisit`.
- No uncertain reference was rewritten.

## Per-Write Strict Validation

| authored write | exact command | exit | concise result |
| --- | --- | ---: | --- |
| timeline.md write | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence --strict` | `2` | strict validation exited 2; packet-wide validation findings remained |
| before-vs-after.md write | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence --strict` | `2` | strict validation exited 2; packet-wide validation findings remained |
| feature-flags.md write | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence --strict` | `2` | strict validation exited 2; 0 marked error/warning lines |
| `scratch/task-7b-history-docs.md` | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence --strict` | external transcript | Run immediately after this final log write; the exact exit and result are printed by the invoking command and reported in the Markdown STATUS contract. |

The first two validation result summaries use the exact observed exit status and the external transcript from the write checkpoints. The validator's last printed success subcheck was not treated as an overall pass.

## Document Quality

| document | DQI | band |
| --- | ---: | --- |
| `timeline.md` | 77 | good |
| `before-vs-after.md` | 81 | good |
| `feature-flags.md` | 90 | excellent |

- Minimum DQI: `77`. Threshold `>=75` passed.
- Extractor: `.opencode/skills/sk-doc/shared/scripts/extract_structure.py`.
- Existing-document checks: one H1, valid heading hierarchy, fenced code, no new placeholders and no table of contents introduced.
- HVR review: new prose uses direct factual language, qualifies uncertainty and avoids retroactive claim rewriting.

## Execution Notes

- The evidence log did not exist before this task, so its read-before-write check returned `File not found`; this write creates the explicitly scoped required log.
- An initial inline automation attempt stopped before mutation with `SyntaxError: f-string expression part cannot include a backslash`. The corrected run precomputed escaped table cells before formatting.
- A later exact-edit assertion stopped after the first two file checkpoints because the same dark-flag link occurred twice. `feature-flags.md` had not been written by that failed attempt. The corrected write asserted two occurrences and changed both link targets together.

## Final Validation Handling

This file is the last authored write. The final strict validation runs immediately after this write. Its shell transcript is the non-recursive evidence record allowed by the workflow, so no post-validation append invalidates the final check.

---

## Retry Validation: 2026-07-11

### Corrective Changes

- `timeline.md`: changed the stale data-quality changelog target from `./changelog/002-spec-data-quality/` to the existing `./changelog/003-spec-data-quality/` directory while preserving the historical link label. Replaced the nonexistent code-graph changelog target with the current phase `010-edge-confidence-and-ppr-revisit/implementation-summary.md`.
- `before-vs-after.md`: replaced the nonexistent code-graph changelog target with the current phase `009-daemon-reclaim-hardening/implementation-summary.md`.
- `feature-flags.md`: no corrective write was needed. Strict diagnostics and the explicit current-link scan attribute no issue to this file.
- No global numeric replacement was used.

### Per-Write Exact Strict Validation

| corrective write | exact command | exit | result |
| --- | --- | ---: | --- |
| timeline.md retry correction | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence --strict` | `2` | exit 2; root Errors=3, Warnings=1; recursive validation remains blocked |
| before-vs-after.md retry correction | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence --strict` | `2` | exit 2; root Errors=3, Warnings=1; recursive validation remains blocked |

Both runs exit `2` because recursive packet findings remain outside the four-file writable scope. The exact JSON diagnostic after the second correction found zero non-pass detail mentioning any writable filename.

### Remaining Strict Findings: Out-of-Scope Attribution

| packet folder | status | rule | exact validator message | attributed files |
| --- | --- | --- | --- | --- |
| `.` | error | `GENERATED_METADATA_INTEGRITY` | Generated metadata integrity found 1 violation(s) (enforced) | `graph-metadata.json` |
| `.` | error | `GENERATED_METADATA_DRIFT` | Generated metadata drift found 2 drifted field(s) (enforced) | `description.json / graph-metadata.json` |
| `.` | warn | `PHASE_LINKS` | 13 phase link issue(s) found | `../spec.md, 001-release-cleanup/spec.md, 002-speckit-memory/spec.md, 003-spec-data-quality/spec.md, 004-review-remediation/spec.md, 005-dark-flag-graduation/spec.md, 006-speckit-surface-alignment/spec.md` |
| `.` | error | `SPEC_DOC_INTEGRITY` | 1 spec documentation integrity issue(s) found | `./002-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark/benchmark-results.md, benchmark-status.md` |
| `001-release-cleanup` | error | `GENERATED_METADATA_INTEGRITY` | Generated metadata integrity found 1 violation(s) (enforced) | `graph-metadata.json` |
| `001-release-cleanup` | warn | `PHASE_LINKS` | 17 phase link issue(s) found | `../spec.md, 009-changelogs-constitutional-and-templates/spec.md, 010-catalog-playbook-coverage-audit/spec.md, 011-daemon-skills-playbook-validation/spec.md, 012-playbook-findings-remediation/spec.md, 013-drift-remediation/spec.md, 014-spec-regrouping-renumber-reindex/spec.md, 015-manual-playbook-execution-sweep/spec.md` |
| `002-speckit-memory` | error | `GENERATED_METADATA_INTEGRITY` | Generated metadata integrity found 1 violation(s) (enforced) | `graph-metadata.json` |
| `002-speckit-memory` | warn | `PHASE_LINKS` | 115 phase link issue(s) found | `../spec.md, 001-corpus-reindex-gate-zero/spec.md, 002-determinism-content-id-foundation/spec.md, 003-retrieval-class-routing/spec.md, 004-graceful-degradation/spec.md, 005-recall-render-escaper/spec.md, 006-redteam-probe-gate/spec.md, 007-bitemporal-window/spec.md (+35 more)` |
| `002-speckit-memory` | warn | `PHASE_PARENT_CONTENT` | Phase parent spec.md contains migration-history token(s) | `spec.md` |
| `003-spec-data-quality` | error | `GENERATED_METADATA_INTEGRITY` | Generated metadata integrity found 1 violation(s) (enforced) | `graph-metadata.json` |
| `003-spec-data-quality` | error | `SCAFFOLD_NEVER_TOUCHED` | Found 4 scaffold-signature marker(s) in Complete spec folder | `checklist.md, implementation-summary.md, plan.md, tasks.md` |
| `003-spec-data-quality` | warn | `EVIDENCE_CITED` | Found 43 completed item(s) without evidence | `checklist.md, plan.md, research/research.md, spec.md, tasks.md` |
| `003-spec-data-quality` | warn | `PHASE_LINKS` | 53 phase link issue(s) found | `../spec.md, 001-on-write-quality/spec.md, 002-retroactive-automation/spec.md, 003-retrieval-gated-tuning/spec.md, 004-novel-research/spec.md, 005-shared-engine-and-research/spec.md, 006-generated-metadata-build/spec.md, 007-metadata-rename-reconciliation/spec.md (+14 more)` |
| `003-spec-data-quality` | warn | `PHASE_PARENT_CONTENT` | Phase parent spec.md contains migration-history token(s) | `spec.md` |
| `003-spec-data-quality` | warn | `AI_PROTOCOL` | AI protocol incomplete (0/4 components) | `plan.md / tasks.md` |
| `003-spec-data-quality` | warn | `GRAPH_METADATA_CHILD_DRIFT` | children_ids is missing on-disk phase children: 029-vague-query-model-benchmark | `graph-metadata.json` |
| `003-spec-data-quality` | error | `SPEC_DOC_INTEGRITY` | 1 spec documentation integrity issue(s) found | `implementation-summary.md` |
| `003-spec-data-quality` | warn | `CONTINUITY_FRESHNESS` | Completion freshness is stale: stored continuity fingerprint does not match current content | `checklist.md, decision-record.md, implementation-summary.md, plan.md, spec.md, tasks.md` |
| `004-review-remediation` | error | `GENERATED_METADATA_INTEGRITY` | Generated metadata integrity found 1 violation(s) (enforced) | `graph-metadata.json` |
| `004-review-remediation` | warn | `PHASE_LINKS` | 6 phase link issue(s) found | `../spec.md, 004-p2-triage/spec.md, 005-env-documentation-audit/spec.md, 006-review-record-packet-type/spec.md` |
| `005-dark-flag-graduation` | error | `FRONTMATTER_MEMORY_BLOCK` | 1 frontmatter_memory_block issue(s) found | `spec.md` |
| `005-dark-flag-graduation` | error | `GENERATED_METADATA_INTEGRITY` | Generated metadata integrity found 1 violation(s) (enforced) | `graph-metadata.json` |
| `005-dark-flag-graduation` | warn | `PHASE_LINKS` | 29 phase link issue(s) found | `../spec.md, 001-multihop-tail-appends/spec.md, 002-retrieval-class-weights/spec.md, 003-true-citation-ledger/spec.md, 004-save-reconsolidation/spec.md, 005-flag-name-cleanup/spec.md, 006-dark-flag-validation/spec.md, 007-graduation-follow-ups/spec.md (+5 more)` |
| `005-dark-flag-graduation` | warn | `PHASE_PARENT_CONTENT` | Phase parent spec.md contains migration-history token(s) | `spec.md` |
| `006-speckit-surface-alignment` | error | `GENERATED_METADATA_INTEGRITY` | Generated metadata integrity found 1 violation(s) (enforced) | `graph-metadata.json` |
| `006-speckit-surface-alignment` | warn | `PHASE_LINKS` | 6 phase link issue(s) found | `001-false-now-doc-corrections/spec.md, 002-fix-stress-docs/spec.md, 003-stress-and-skillmd-audit/spec.md, 004-recorded-failure-closure/spec.md, 005-manual-test-verification-and-fixes/spec.md, 006-presentation-layer-fixes/spec.md` |

- Root `SPEC_DOC_INTEGRITY` now has exactly one detail: `benchmark-status.md references missing markdown file: ./002-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark/benchmark-results.md`. `benchmark-status.md` is outside writable scope.
- Writable-file attribution audit: `0` non-pass validator details mention `timeline.md`, `before-vs-after.md`, `feature-flags.md` or `task-7b-history-docs.md`.
- Generated metadata findings name `description.json` or `graph-metadata.json`; both are explicitly outside writable scope.
- Recursive phase-link, continuity, scaffold, evidence and protocol findings name phase-local `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `handover.md` or generated JSON surfaces, all outside writable scope.

### Current-Link Checks

| document | relative links checked | broken |
| --- | ---: | ---: |
| `timeline.md` | 25 | 0 |
| `before-vs-after.md` | 8 | 0 |
| `feature-flags.md` | 9 | 0 |

All current-navigation link targets exist on disk after the retry corrections. External HTTP links and same-document anchors were excluded from the filesystem check.

### Historical Alias Checks

| alias | occurrences preserved | classification |
| --- | ---: | --- |
| `000-release-cleanup` | 6 | historical alias; globally qualified in each authored doc |
| `001-speckit-memory` | 12 | historical alias; globally qualified in each authored doc |
| `002-spec-data-quality` | 22 | historical alias; globally qualified in each authored doc |
| `003-review-remediation` | 4 | historical alias; globally qualified in each authored doc |
| `004-dark-flag-graduation` | 11 | historical alias; globally qualified in each authored doc |
| `005-speckit-surface-alignment` | 2 | historical alias; globally qualified in each authored doc |

The dated/as-of phase labels, commands, benchmark labels, findings, commit hashes and execution evidence retain their original meaning. Current-navigation notes in all three authored docs explicitly classify prior root IDs as historical aliases.

### Placeholder and ToC Checks

- `timeline.md`: placeholders `0`; ToC headings `0`.
- `before-vs-after.md`: placeholders `0`; ToC headings `0`.
- `feature-flags.md`: placeholders `0`; ToC headings `0`.
- `scratch/task-7b-history-docs.md`: placeholders `0`; ToC headings `0` before this retry append.

### DQI Evidence

| document | DQI | band |
| --- | ---: | --- |
| `timeline.md` | 77 | good |
| `before-vs-after.md` | 81 | good |
| `feature-flags.md` | 90 | excellent |

Minimum DQI is `77`, above the required threshold of `75`. The source is `.opencode/skills/sk-doc/shared/scripts/extract_structure.py`.

### Retry Execution Note

- The first retry automation attempt stopped before mutation with `SyntaxError: f-string expression part cannot include a backslash`. The corrected run formats escaped table cells outside f-string expressions.

### Final Validation Contract

The evidence log is the last corrective write. The exact strict command runs immediately after this append. Its shell transcript is the final non-recursive evidence record allowed by the workflow. The immediately preceding exact run and JSON attribution prove that any remaining exit `2` findings are outside writable scope.
