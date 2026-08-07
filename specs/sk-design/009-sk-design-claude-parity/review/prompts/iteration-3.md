DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `opencode run`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated, review mode):
Iteration: 3 of 10 | Mode: review
Target: .opencode/specs/sk-design/009-sk-design-claude-parity (spec-folder)
Dimensions: 1/4 complete (correctness pass 1 of a planned 2-3) | Next: security
Findings: P0:0 P1:1 P2:0 active
Traceability: core=partial overlay=partial
Last 2 ratios: n/a -> moderate (1 new P1) | Stuck count: 0
Provisional verdict: CONDITIONAL (1 open P1: build-write-prompt.ts component-facts gap) | hasAdvisories=false
Next focus: Iteration 3 (security): review md-generator output-path guards, shell/Bash boundaries, prompt/template injection risks, generated artifact write locations, and trust-boundary differences between read-only modes (interface/foundations/motion/audit) and the mutating md-generator mode.

Review Iteration: 3 of 10
Mode: review
Dimension: security
Review Target: .opencode/specs/sk-design/009-sk-design-claude-parity
Review Scope Files: .opencode/specs/sk-design/009-sk-design-claude-parity/** (parent + 13 phase folders), .opencode/skills/sk-design/** (hub + 5 mode packets, feature_catalog/**, manual_testing_playbook/**, benchmark/**), .opencode/commands/design/*.md
Prior Findings: P0=0 P1=1 P2=0

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
- Write iteration narrative to: .opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-003.md
- Write per-iteration delta file to: .opencode/specs/sk-design/009-sk-design-claude-parity/review/deltas/iter-003.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-003.md`, this iteration's narrative markdown
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-state.jsonl`, append-only JSONL state log
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deltas/iter-003.jsonl`, this iteration's delta JSONL
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

1. **Iteration narrative markdown** at `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-003.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY, NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

```json
{"type":"iteration","iteration":3,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-003","status":"complete","focus":"<dimension-or-focus>","dimensions":["security"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":{"P0":<n>,"P1":<n>,"P2":<n>},"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-06T11:48:06.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

### v2 Search Depth Output (when scopeClass is standard or complex)

For standard or complex review scope, set `"reviewDepthSchemaVersion":2` on the same iteration JSONL record and include these v2 fields in addition to the v1 fields above:

- `reviewDepthApplicability`: `{scopeClass,enforcement,reason,evidenceRefs}` where `scopeClass` is `trivial`, `standard`, or `complex`; `enforcement` is `strict`, `warn`, or `skip`.
- `targetSelection`: `{selectedTargets,selectionReason,discoveryMethods,omittedHighRiskTargets,graphStatus,semanticSearchStatus,evidenceRefs}`. Name how targets were chosen, what high-risk targets were omitted, and whether graph/semantic search was available, unavailable, or partial.
- `searchCoverage`: `{requiredBugClasses,covered,ruledOut,deferred,blocked,graphCoverageMode}` where `graphCoverageMode` is `graph`, `graphless_fallback`, or `unavailable_blocked`.
- `searchLedger[]`: ledger rows with required `id`, `dimension`, `targetRefs`, `bugClass`, `disposition`, and `rationale`; include `hypothesis` or `invariant` (at least one); include `searchActions[]` with `{method,queryOrPath,result,evidenceRefs}`.
- Each ledger row needs exactly one disposition link: `linkedFindingId` for `finding` (must match an id in `findingDetails[]`), `ruledOutReason` for `ruled_out`, `deferredReason` for `deferred`, `blockedReason` for `blocked`, or `notApplicableReason` for `not_applicable`.

Append via single-line JSON with newline terminator, e.g. `echo '<single-line-json>' >> .opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deltas/iter-003.jsonl`. This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

All three artifacts are REQUIRED. Read `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md` in full first (especially section 13 Known Context and the now-updated section 7 Running Findings), and `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-002.md` for the P1-001 finding already confirmed (build-write-prompt.ts component-facts gap) - do not re-report it, but DO check whether it has any security implications (e.g. does the missing component-facts gap create any prompt-injection surface via unescaped data reaching the WRITE prompt). Focus THIS iteration on SECURITY: md-generator's Bash/shell invocations (any shell-out with unsanitized input?), output-path construction (can generated artifact paths be manipulated to write outside the intended directory - path traversal?), prompt/template injection (does extracted design-token or component data get interpolated into prompts/scripts without escaping?), and the trust-boundary contract between the four read-only modes (interface/foundations/motion/audit - Read/Glob/Grep only, must never imply write/execute capability) versus md-generator's full Read/Write/Edit/Bash surface (verify no read-only mode's SKILL.md or procedure card accidentally grants/implies write capability). Also check the Playwright-based crawler/capture pipeline (if any) for unsafe URL/selector handling.
