DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `opencode run`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated, review mode):
Iteration: 1 of 10 | Mode: review
Target: .opencode/specs/sk-design/009-sk-design-claude-parity (spec-folder)
Dimensions: 0/4 complete | Next: correctness (inventory pass this iteration)
Findings: P0:0 P1:0 P2:0 active
Traceability: core=pending overlay=pending
Last 2 ratios: n/a -> n/a | Stuck count: 0
Provisional verdict: PENDING | hasAdvisories=false
Next focus: Iteration 1 (inventory pass): build artifact map of `.opencode/specs/sk-design/009-sk-design-claude-parity/**` (parent + 13 phase folders) and `.opencode/skills/sk-design/**` (hub + 5 mode packets: interface, foundations, motion, audit, md-generator), identify file types, estimate complexity, then begin risk-ordered dimension review starting with correctness.

Review Iteration: 1 of 10
Mode: review
Dimension: inventory-pass (broad artifact mapping; light correctness/traceability spot-checks only -- deep dimension review begins iteration 2+)
Review Target: .opencode/specs/sk-design/009-sk-design-claude-parity
Review Scope Files: See "REVIEW SCOPE" section below for the full breakdown.
Prior Findings: P0=0 P1=0 P2=0

## REVIEW SCOPE

**Spec packet** (`.opencode/specs/sk-design/009-sk-design-claude-parity/`):
- Parent (phase-parent, lean trio): `spec.md`, `description.json`, `graph-metadata.json` (no plan.md/tasks.md/checklist.md at parent by design).
- 13 phase folders `001-baseline-ownership-gate` through `013-design-commands-asset-refactor`, each ~7-9 files: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`, some with `decision-record.md`. Phase `008-smart-routing-optimization` additionally has a `benchmark-after-008/` subdir.
- Out of this review's scope (per strategy.md Non-Goals): `external/` (33 files, cross-runtime lineage snapshots), `research/` (17 files, prior research loop), `review/` (this review session's own artifacts).

**Implementation** (`.opencode/skills/sk-design/**`, ~438 authored files excluding vendored deps):
- Hub root: `SKILL.md`, `README.md`, `hub-router.json`, `mode-registry.json`, `command-metadata.json`, `description.json`, `graph-metadata.json`, `references/design_proof_token.md`.
- `shared/`: `anti_slop_principles.md`, `cognitive_laws.md`, `context_loading_contract.md`, `design_dispatch_boundary.md`, `design_token_vocabulary.md`, `numeric_design_laws.md`, `procedure_card_schema.md`, `register.md`, `sk_code_handoff.md`, `assets/*.md` (4), `procedures/polish_gate_orchestration.md`, `scripts/*` (7: 3 .mjs check scripts, 3 .py check scripts, 1 md_table.py).
- `changelog/` (6 version files v1.0.0.0-v1.2.0.0), `benchmark/` (4 report pairs: baseline, after-009, after-012-routing-rigor[+live], after-d3-proxy -- report.json + report.md each).
- Hub-level `feature_catalog/` (2 packages: `manager-shell/` 3 files, `procedure-card-system/` 2 files, plus top-level `feature_catalog.md`) and `manual_testing_playbook/` (8 categories, 24 scenario files + top-level `manual_testing_playbook.md`).
- 5 mode packets, each with parallel structure: `design-{interface,foundations,motion,audit,md-generator}/SKILL.md`, `README.md`, `changelog/v1.0.0.0.md`, `feature_catalog/feature_catalog.md`, `manual_testing_playbook/manual_testing_playbook.md`, `procedures/*.md` (3-6 cards each), `references/*.md` (4-9 files each), `assets/*.md` (2-4 files each); `design-audit` and `design-foundations` also have `scripts/*.py` (2-3 evidence-check scripts each); `design-interface` has a stray `LICENSE.txt`.
- `design-md-generator/backend/`: TypeScript CLI tool -- authored source `scripts/*.ts` (20 files) + `tests/*.test.ts` (8 files) + `dist/` (compiled build output, 34 files incl. `.d.ts`/`.js`/`.js.map`) + `package.json`/`package-lock.json`/`tsconfig*.json`/`vitest.config.ts`. **`backend/node_modules/` (2674 vendored third-party files) is explicitly OUT OF SCOPE for this review** -- do not spend tool calls reading vendored dependency internals; note only if something in `dist/` or `package.json` looks structurally wrong (e.g. missing dependency, version drift).

**Commands** (`.opencode/commands/design/*.md`): `audit.md`, `foundations.md`, `interface.md`, `md-generator.md`, `motion.md` -- 5 flat files, confirmed untouched/planning-only per Phase 013's decision-record.

**Inventory-pass instructions for this iteration**: Do not attempt line-by-line review of all 438+110+5 files in one pass. Build the artifact map (confirm the structure above against real `ls`/`find` output, note any file that looks like a stub/placeholder/orphan/duplicate), record it in the iteration narrative and update `## 15. FILES UNDER REVIEW` in strategy.md. While mapping, flag anything that jumps out as an obvious correctness or traceability defect (e.g. a phase's `checklist.md` claiming complete with unchecked boxes, a mode packet missing a file every sibling has, a script that references a path that doesn't exist) as a real P0/P1/P2 finding -- do not manufacture busywork findings just to fill the report, but do not suppress a real defect you noticed just because "deep dimension review is for later iterations."

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS`, PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-config.json
- State Log: .opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/sk-design/009-sk-design-claude-parity/review/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-001.md`, this iteration's narrative markdown
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-state.jsonl`, append-only JSONL state log
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deltas/iter-001.jsonl`, this iteration's delta JSONL
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md`, strategy.md (in-place updates only)
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-findings-registry.json`, findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (`.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced. Each event MUST use one of these two EXACT shapes. The reducer discriminates node vs edge by `type`, then validates each node's `kind` against the node vocabulary and each edge's `relation` against the relation vocabulary -- any event outside these vocabularies is silently dropped, and if every event is dropped the convergence graph stays empty (nodeCount 0, empty signals):
  - Node: `{"type":"node","id":"<stable-id>","kind":"<SLICE|DIMENSION|FILE|FINDING|EVIDENCE|REMEDIATION|BUG_CLASS|INVARIANT|PRODUCER|CONSUMER|TEST>","label":"<short human name>"}` -- the semantic kind goes in the dedicated `kind` field (uppercase, one of those listed); `label` is a free-text display name ONLY, never the kind.
  - Edge: `{"type":"edge","id":"<stable-id>","source":"<nodeId>","target":"<nodeId>","relation":"<COVERS|EVIDENCE_FOR|CONTRADICTS|RESOLVES|CONFIRMS|ESCALATES|IN_DIMENSION|IN_FILE>"}` -- use `source`/`target`/`relation` (NOT `from`/`to`/`label`); `source` and `target` must reference node `id`s.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-001.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY, NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

```json
{"type":"iteration","iteration":<n>,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"<run-id>","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"<session-id>","generation":<n>,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

### v2 Search Depth Output (when scopeClass is standard or complex)

For standard or complex review scope, set `"reviewDepthSchemaVersion":2` on the same iteration JSONL record and include these v2 fields in addition to the v1 fields above:

- `reviewDepthApplicability`: `{scopeClass,enforcement,reason,evidenceRefs}` where `scopeClass` is `trivial`, `standard`, or `complex`; `enforcement` is `strict`, `warn`, or `skip`.
- `targetSelection`: `{selectedTargets,selectionReason,discoveryMethods,omittedHighRiskTargets,graphStatus,semanticSearchStatus,evidenceRefs}`. Name how targets were chosen, what high-risk targets were omitted, and whether graph/semantic search was available, unavailable, or partial.
- `searchCoverage`: `{requiredBugClasses,covered,ruledOut,deferred,blocked,graphCoverageMode}` where `graphCoverageMode` is `graph`, `graphless_fallback`, or `unavailable_blocked`.
- `searchLedger[]`: ledger rows with required `id`, `dimension`, `targetRefs`, `bugClass`, `disposition`, and `rationale`; include `hypothesis` or `invariant` (at least one); include `searchActions[]` with `{method,queryOrPath,result,evidenceRefs}`.
- Each ledger row needs exactly one disposition link: `linkedFindingId` for `finding` (must match an id in `findingDetails[]`), `ruledOutReason` for `ruled_out`, `deferredReason` for `deferred`, `blockedReason` for `blocked`, or `notApplicableReason` for `not_applicable`.

Given this iteration's scope class is `complex` (multi-package skill hub, 13 spec phases, ~550+ files), use `enforcement: strict` and populate the v2 fields honestly based on what you actually searched this iteration -- it is fine for `searchCoverage.covered` to be small and `deferred` to be large on iteration 1 (inventory pass); do not fabricate coverage you did not perform.

Trivial-scope exemption: when `scopeClass` is `trivial` and `enforcement` is `skip`, `searchLedger` may be `[]`, but `reviewDepthApplicability.evidenceRefs` MUST cite proof that the target is trivial. (Not applicable here -- this review target is `complex`.)

Compact v2 example:

```json
{"reviewDepthSchemaVersion":2,"reviewDepthApplicability":{"scopeClass":"standard","enforcement":"strict","reason":"non-trivial target","evidenceRefs":["path/to/file.ts:42"]},"targetSelection":{"selectedTargets":["path/to/file.ts"],"selectionReason":"state transition producer","discoveryMethods":["direct_read","exact_search"],"omittedHighRiskTargets":[],"graphStatus":"unavailable","semanticSearchStatus":"partial","evidenceRefs":["path/to/file.ts:42"]},"searchCoverage":{"requiredBugClasses":["state_transition"],"covered":[],"ruledOut":["state_transition"],"deferred":[],"blocked":[],"graphCoverageMode":"graphless_fallback"},"searchLedger":[{"id":"SL-001","dimension":"correctness","targetRefs":["path/to/file.ts"],"bugClass":"state_transition","hypothesis":"state transition can skip validation","searchActions":[{"method":"direct_read","queryOrPath":"path/to/file.ts","result":"guard present on all branches","evidenceRefs":["path/to/file.ts:42"]}],"disposition":"ruled_out","rationale":"all branches call the guard","ruledOutReason":"verified by direct read"}]}
```

Legacy unversioned records remain valid during rollout. Phase D validator behavior should warn on legacy shallow records and strictly enforce this shape only for explicit v2 records.

Append via single-line JSON with newline terminator, e.g. `echo '<single-line-json>' >> .opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deltas/iter-001.jsonl` (path pre-substituted, e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

Example delta file contents (one review iteration):
```json
{"type":"iteration","iteration":3,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path/to/file.ts:42"],"findingsCount":7,"findingsSummary":{"P0":0,"P1":2,"P2":5},"findingsNew":[],"newFindingsRatio":0.41,"sessionId":"session-001","generation":1,"lineageMode":"new","timestamp":"2026-04-30T00:00:00Z","durationMs":120000,"graphEvents":[]}
{"type":"finding","id":"R3-P1-001","severity":"P1","cluster":"...","file":"path:line","title":"...","iteration":3}
{"type":"classification","detail":"...","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).
