DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `opencode run`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated, review mode):
Iteration: 8 of 10 | Mode: review
Target: .opencode/specs/sk-design/009-sk-design-claude-parity (spec-folder)
Dimensions: 4/4 complete + 2 deep-revisit passes done | Next: deep revisit - HTML/CSS sinks + generalization check
Findings: P0:0 P1:7 P2:3 active
Traceability: core=covered overlay=covered
Last 2 ratios: moderate -> high (1 new P1, then 2 new P1/1 new P2) | Stuck count: 0
Provisional verdict: CONDITIONAL (7 open P1, all in design-md-generator/backend - see strategy.md section 7 for full list) hasAdvisories=true (3 P2s). IMPORTANT: iteration 6 already ruled out the P1-002+P1-003 P0-compound-risk question with real evidence - do not re-litigate unless genuinely new evidence emerges.
Next focus: Iteration 8 (deep revisit - HTML/CSS sinks): check generated HTML/CSS sinks and report/preview/proof rendering tests more broadly - especially whether P1-006's CSS-context-escaping gap (dark-mode variables) generalizes to OTHER CSS-derived values rendered into style attributes across report-gen.ts/preview-gen.ts/proof.ts (not just dark-mode swatches), and whether there is a shared/reusable fix point (a single CSS-value sanitizer) versus needing per-call-site fixes.

Review Iteration: 8 of 10
Mode: review
Dimension: security
Review Target: .opencode/specs/sk-design/009-sk-design-claude-parity
Review Scope Files: .opencode/skills/sk-design/design-md-generator/backend/scripts/{report-gen.ts,preview-gen.ts,proof.ts} and every CSS-derived value they render into HTML/style attributes (deep revisit focus), .opencode/specs/sk-design/009-sk-design-claude-parity/** (parent + 13 phase folders), .opencode/skills/sk-design/** (hub + 5 mode packets, feature_catalog/**, manual_testing_playbook/**, benchmark/**), .opencode/commands/design/*.md
Prior Findings: P0=0 P1=7 P2=3

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
- Write iteration narrative to: .opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-008.md
- Write per-iteration delta file to: .opencode/specs/sk-design/009-sk-design-claude-parity/review/deltas/iter-008.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-008.md`, this iteration's narrative markdown
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-state.jsonl`, append-only JSONL state log
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deltas/iter-008.jsonl`, this iteration's delta JSONL
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

1. **Iteration narrative markdown** at `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-008.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

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

3. **Per-iteration delta file** at `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deltas/iter-008.jsonl`. This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

All three artifacts are REQUIRED. Read `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md` in full first (especially section 13 Known Context and the now-updated section 7 Running Findings), and ALL SEVEN prior iteration files (`iteration-001.md` through `iteration-007.md`) for full context on the 7 P1 + 3 P2 findings already confirmed - do not re-report any of them as new findings, and do not re-litigate iteration 6's honest P0-ruled-out conclusion on the P1-002/P1-003 compound-risk question unless you find genuinely new evidence. Focus THIS iteration on generalizing P1-006 (dark-mode CSS variables entering `style` attributes without CSS-context escaping): (1) grep every place in `report-gen.ts`, `preview-gen.ts`, and `proof.ts` where a source-derived value (not just dark-mode swatches - also check color tokens, spacing/radius values, font values, icon/asset paths, any other extracted CSS/DOM data) is interpolated into an HTML `style` attribute, inline `<style>` block, or `href`/`src` attribute; (2) for each site found, determine whether it has the same missing-CSS-context-escaping gap as P1-006, or whether it's already safely handled (e.g. via `esc()` or a numeric-only render path) - report genuinely new sites as a new finding (or as an expansion of P1-006's affected-surface list if you judge it's the same root defect, your call, justify it either way); (3) determine whether a single shared CSS-value sanitizer function would fix all these sites at once, and name where it should live if you recommend adding one.
