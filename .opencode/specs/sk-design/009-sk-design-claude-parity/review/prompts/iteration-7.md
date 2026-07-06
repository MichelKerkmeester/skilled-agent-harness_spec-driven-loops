DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `opencode run`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated, review mode):
Iteration: 7 of 10 | Mode: review
Target: .opencode/specs/sk-design/009-sk-design-claude-parity (spec-folder)
Dimensions: 4/4 complete + 1 deep-revisit pass done | Next: deep revisit - non-output extraction modules
Findings: P0:0 P1:5 P2:2 active
Traceability: core=covered overlay=covered
Last 2 ratios: low -> moderate (0 new P1/2 new P2, then 1 new P1) | Stuck count: 0
Provisional verdict: CONDITIONAL (5 open P1, all in design-md-generator/backend: build-write-prompt.ts component-facts gap; output-path guard scope gap; live-site values enter WRITE prompt without data isolation; report/preview overwrite-protection claim mismatch; guided-run.ts cwd/path model inconsistency breaking the documented relative-output workflow) hasAdvisories=true (2 P2s). IMPORTANT: iteration 6 investigated whether P1-002+P1-003 compound into a P0 (malicious website -> injected prompt instructions -> arbitrary file write) and RULED IT OUT with real evidence - output paths are operator CLI arguments set before extraction, not attacker-influenced. Do not re-litigate this unless you find genuinely new evidence.
Next focus: Iteration 7 (deep revisit - non-output extraction modules): focused pass on md-generator's non-output-path extraction modules and their tests (a11y-extract.ts, css-analyzer.ts, design-boundary-detect.ts, dark-mode-detect.ts, icon-detect.ts, motion-extract.ts), which iteration 6 explicitly deferred since they don't own the active prompt/output P1 remediation seams. Also check any source-derived strings from these modules that feed report/preview HTML generation for the same untrusted-data-isolation concern as P1-003.

Review Iteration: 7 of 10
Mode: review
Dimension: correctness
Review Target: .opencode/specs/sk-design/009-sk-design-claude-parity
Review Scope Files: .opencode/skills/sk-design/design-md-generator/backend/scripts/{a11y-extract.ts,css-analyzer.ts,design-boundary-detect.ts,dark-mode-detect.ts,icon-detect.ts,motion-extract.ts} and their tests (deep revisit focus), .opencode/specs/sk-design/009-sk-design-claude-parity/** (parent + 13 phase folders), .opencode/skills/sk-design/** (hub + 5 mode packets, feature_catalog/**, manual_testing_playbook/**, benchmark/**), .opencode/commands/design/*.md
Prior Findings: P0=0 P1=5 P2=2

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
- Write iteration narrative to: .opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-007.md
- Write per-iteration delta file to: .opencode/specs/sk-design/009-sk-design-claude-parity/review/deltas/iter-007.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-007.md`, this iteration's narrative markdown
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-state.jsonl`, append-only JSONL state log
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deltas/iter-007.jsonl`, this iteration's delta JSONL
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md`, strategy.md (in-place updates only)
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-findings-registry.json`, findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (this file's directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced. Each event MUST use one of these two EXACT shapes. The reducer discriminates node vs edge by `type`, then validates each node's `kind` against the node vocabulary and each edge's `relation` against the relation vocabulary — any event outside these vocabularies is silently dropped, and if every event is dropped the convergence graph stays empty (nodeCount 0, empty signals):
  - Node: `{"type":"node","id":"<stable-id>","kind":"<SLICE|DIMENSION|FILE|FINDING|EVIDENCE|REMEDIATION|BUG_CLASS|INVARIANT|PRODUCER|CONSUMER|TEST>","label":"<short human name>"}` — the semantic kind goes in the dedicated `kind` field (uppercase, one of those listed); `label` is a free-text display name ONLY, never the kind.
  - Edge: `{"type":"edge","id":"<stable-id>","source":"<nodeId>","target":"<nodeId>","relation":"<COVERS|EVIDENCE_FOR|CONTRADICTS|RESOLVES|CONFIRMS|ESCALATES|IN_DIMENSION|IN_FILE>"}` — use `source`/`target`/`relation` (NOT `from`/`to`/`label`); `source` and `target` must reference node `id`s.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-007.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY, NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

```json
{"type":"iteration","iteration":4,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-003","status":"complete","focus":"<dimension-or-focus>","dimensions":["security"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":{"P0":<n>,"P1":<n>,"P2":<n>},"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-06T11:48:06.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

### v2 Search Depth Output (when scopeClass is standard or complex)

For standard or complex review scope, set `"reviewDepthSchemaVersion":2` on the same iteration JSONL record and include these v2 fields in addition to the v1 fields above:

- `reviewDepthApplicability`: `{scopeClass,enforcement,reason,evidenceRefs}` where `scopeClass` is `trivial`, `standard`, or `complex`; `enforcement` is `strict`, `warn`, or `skip`.
- `targetSelection`: `{selectedTargets,selectionReason,discoveryMethods,omittedHighRiskTargets,graphStatus,semanticSearchStatus,evidenceRefs}`. Name how targets were chosen, what high-risk targets were omitted, and whether graph/semantic search was available, unavailable, or partial.
- `searchCoverage`: `{requiredBugClasses,covered,ruledOut,deferred,blocked,graphCoverageMode}` where `graphCoverageMode` is `graph`, `graphless_fallback`, or `unavailable_blocked`.
- `searchLedger[]`: ledger rows with required `id`, `dimension`, `targetRefs`, `bugClass`, `disposition`, and `rationale`; include `hypothesis` or `invariant` (at least one); include `searchActions[]` with `{method,queryOrPath,result,evidenceRefs}`.
- Each ledger row needs exactly one disposition link: `linkedFindingId` for `finding` (must match an id in `findingDetails[]`), `ruledOutReason` for `ruled_out`, `deferredReason` for `deferred`, `blockedReason` for `blocked`, or `notApplicableReason` for `not_applicable`.

Append via single-line JSON with newline terminator, e.g. `echo '<single-line-json>' >> .opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deltas/iter-007.jsonl`. This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

All three artifacts are REQUIRED. Read `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md` in full first (especially section 13 Known Context and the now-updated section 7 Running Findings), and ALL SIX prior iteration files (`iteration-001.md` through `iteration-006.md`) for full context on the 5 P1 + 2 P2 findings already confirmed - do not re-report any of them as new findings, and do not re-litigate iteration 6's honest P0-ruled-out conclusion on the P1-002/P1-003 compound-risk question unless you find genuinely new evidence. Focus THIS iteration on the md-generator extraction modules NOT yet directly read in any prior iteration: `a11y-extract.ts`, `css-analyzer.ts`, `design-boundary-detect.ts`, `dark-mode-detect.ts`, `icon-detect.ts`, `motion-extract.ts`, and their corresponding test files. For each: (1) check for correctness bugs (wrong DOM property reads, off-by-one in color/contrast calculations, incorrect boundary detection logic); (2) check whether any source-derived string these modules extract (aria-labels, computed styles, detected boundary coordinates, icon names, animation/transition values) later flows into `build-write-prompt.ts`'s FACTS block or `report-gen.ts`/`preview-gen.ts` HTML output without the same data-isolation treatment needed for P1-003 - if so, this is a genuinely new, separately-evidenced finding (not a duplicate of P1-003, since P1-003 was specifically about typography/font-family values); (3) verify each module's test file actually exercises real extraction logic, not just snapshot/mock assertions.
