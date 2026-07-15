DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `opencode run`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 2 of 10
Dimension: reality-alignment
Prior Findings: P0=7 P1=1 P2=1
Dimension Coverage: sk-doc-conformance (1/2)
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: n/a
Last 2 ratios: n/a -> n/a
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 2 of 10
Mode: review
Dimension: reality-alignment
Review Target: Doc-conformance + reality-alignment audit of cli-external + mcp-tooling hub docs (feature catalogs, testing playbooks, references, assets, READMEs, SKILLs) against sk-doc create-skill templates and creation standards
Review Scope Files: .opencode/skills/cli-external/cli-opencode/references/permissions-matrix.md, .opencode/skills/mcp-tooling/mcp-chrome-devtools/references/cdp_patterns.md, .opencode/skills/mcp-tooling/mcp-chrome-devtools/references/session_management.md, .opencode/skills/mcp-tooling/mcp-chrome-devtools/references/troubleshooting.md, .opencode/skills/mcp-tooling/mcp-click-up/references/cupt_commands.md, .opencode/skills/mcp-tooling/mcp-click-up/references/mcp_tools.md, .opencode/skills/mcp-tooling/mcp-click-up/references/troubleshooting.md, .opencode/skills/mcp-tooling/mcp-figma/references/figma_cli_reference.md, .opencode/skills/mcp-tooling/mcp-figma/references/mcp_wiring.md, .opencode/skills/mcp-tooling/mcp-figma/references/tool_surface.md, .opencode/skills/mcp-tooling/mcp-figma/references/troubleshooting.md, .opencode/skills/cli-external/cli-claude-code/assets/prompt_quality_card.md, .opencode/skills/cli-external/cli-claude-code/assets/prompt_templates.md, .opencode/skills/cli-external/cli-opencode/assets/prompt_quality_card.md, .opencode/skills/cli-external/cli-opencode/assets/prompt_templates.md, .opencode/skills/mcp-tooling/mcp-figma/assets/env_template.md, .opencode/skills/mcp-tooling/mcp-figma/assets/utcp_figma_manual.md, .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cli-invocation/base-non-interactive-invocation.md, .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cli-invocation/default-model-selection-sonnet.md, .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cli-invocation/output-format-text-vs-json.md, .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cli-invocation/stream-json-incremental-output.md, .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/permission-modes/accept-edits-auto-approve-writes-sandboxed.md, .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/permission-modes/bypass-permissions-guard-rail-sandboxed.md, .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/permission-modes/plan-mode-read-only-enforcement.md, .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/reasoning-and-models/haiku-fast-classification.md, .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/reasoning-and-models/opus-extended-thinking.md, .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/reasoning-and-models/sonnet-balanced-default.md, .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/context-agent-codebase-exploration.md, .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/debug-agent-fresh-perspective-root-cause.md, .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/handover-agent-context-transfer.md
Prior Findings: P0=7 P1=1 P2=1

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

- Config: .opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-config.json
- State Log: .opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-002.md`, this iteration's narrative markdown
  - `.opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-state.jsonl`, append-only JSONL state log
  - `.opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deltas/iter-002.jsonl`, this iteration's delta JSONL
  - `.opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-strategy.md`, strategy.md (in-place updates only)
  - `.opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-findings-registry.json`, findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (`.opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-002.md` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced. Each event MUST use one of these two EXACT shapes. The reducer discriminates node vs edge by `type`, then validates each node's `kind` against the node vocabulary and each edge's `relation` against the relation vocabulary — any event outside these vocabularies is silently dropped, and if every event is dropped the convergence graph stays empty (nodeCount 0, empty signals):
  - Node: `{"type":"node","id":"<stable-id>","kind":"<SLICE|DIMENSION|FILE|FINDING|EVIDENCE|REMEDIATION|BUG_CLASS|INVARIANT|PRODUCER|CONSUMER|TEST>","label":"<short human name>"}` — the semantic kind goes in the dedicated `kind` field (uppercase, one of those listed); `label` is a free-text display name ONLY, never the kind.
  - Edge: `{"type":"edge","id":"<stable-id>","source":"<nodeId>","target":"<nodeId>","relation":"<COVERS|EVIDENCE_FOR|CONTRADICTS|RESOLVES|CONFIRMS|ESCALATES|IN_DIMENSION|IN_FILE>"}` — use `source`/`target`/`relation` (NOT `from`/`to`/`label`); `source` and `target` must reference node `id`s.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-002.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY, NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

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

Trivial-scope exemption: when `scopeClass` is `trivial` and `enforcement` is `skip`, `searchLedger` may be `[]`, but `reviewDepthApplicability.evidenceRefs` MUST cite proof that the target is trivial.

Compact v2 example:

```json
{"reviewDepthSchemaVersion":2,"reviewDepthApplicability":{"scopeClass":"standard","enforcement":"strict","reason":"non-trivial target","evidenceRefs":["path/to/file.ts:42"]},"targetSelection":{"selectedTargets":["path/to/file.ts"],"selectionReason":"state transition producer","discoveryMethods":["direct_read","exact_search"],"omittedHighRiskTargets":[],"graphStatus":"unavailable","semanticSearchStatus":"partial","evidenceRefs":["path/to/file.ts:42"]},"searchCoverage":{"requiredBugClasses":["state_transition"],"covered":[],"ruledOut":["state_transition"],"deferred":[],"blocked":[],"graphCoverageMode":"graphless_fallback"},"searchLedger":[{"id":"SL-001","dimension":"correctness","targetRefs":["path/to/file.ts"],"bugClass":"state_transition","hypothesis":"state transition can skip validation","searchActions":[{"method":"direct_read","queryOrPath":"path/to/file.ts","result":"guard present on all branches","evidenceRefs":["path/to/file.ts:42"]}],"disposition":"ruled_out","rationale":"all branches call the guard","ruledOutReason":"verified by direct read"}]}
```

Legacy unversioned records remain valid during rollout. Phase D validator behavior should warn on legacy shallow records and strictly enforce this shape only for explicit v2 records.

Append via single-line JSON with newline terminator, e.g. `echo '<single-line-json>' >> .opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `.opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deltas/iter-002.jsonl` (path pre-substituted, e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

Example delta file contents (one review iteration):
```json
{"type":"iteration","iteration":3,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path/to/file.ts:42"],"findingsCount":7,"findingsSummary":{"P0":0,"P1":2,"P2":5},"findingsNew":[],"newFindingsRatio":0.41,"sessionId":"session-001","generation":1,"lineageMode":"new","timestamp":"2026-04-30T00:00:00Z","durationMs":120000,"graphEvents":[]}
{"type":"finding","id":"R3-P1-001","severity":"P1","cluster":"...","file":"path:line","title":"...","iteration":3}
{"type":"classification","detail":"...","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).


---

## THIS ITERATION IS A DOC-CONFORMANCE + REALITY AUDIT (this overrides the generic spec-review framing above)

You audit a SLICE of a 294-doc corpus (cli-external + mcp-tooling hub docs). Ignore "spec folder / correctness / security" framing — your job is DOC QUALITY. YOUR SLICE THIS ITERATION (30 docs — audit EVERY one, do not sample):
- .opencode/skills/cli-external/cli-opencode/references/permissions-matrix.md
- .opencode/skills/mcp-tooling/mcp-chrome-devtools/references/cdp_patterns.md
- .opencode/skills/mcp-tooling/mcp-chrome-devtools/references/session_management.md
- .opencode/skills/mcp-tooling/mcp-chrome-devtools/references/troubleshooting.md
- .opencode/skills/mcp-tooling/mcp-click-up/references/cupt_commands.md
- .opencode/skills/mcp-tooling/mcp-click-up/references/mcp_tools.md
- .opencode/skills/mcp-tooling/mcp-click-up/references/troubleshooting.md
- .opencode/skills/mcp-tooling/mcp-figma/references/figma_cli_reference.md
- .opencode/skills/mcp-tooling/mcp-figma/references/mcp_wiring.md
- .opencode/skills/mcp-tooling/mcp-figma/references/tool_surface.md
- .opencode/skills/mcp-tooling/mcp-figma/references/troubleshooting.md
- .opencode/skills/cli-external/cli-claude-code/assets/prompt_quality_card.md
- .opencode/skills/cli-external/cli-claude-code/assets/prompt_templates.md
- .opencode/skills/cli-external/cli-opencode/assets/prompt_quality_card.md
- .opencode/skills/cli-external/cli-opencode/assets/prompt_templates.md
- .opencode/skills/mcp-tooling/mcp-figma/assets/env_template.md
- .opencode/skills/mcp-tooling/mcp-figma/assets/utcp_figma_manual.md
- .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cli-invocation/base-non-interactive-invocation.md
- .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cli-invocation/default-model-selection-sonnet.md
- .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cli-invocation/output-format-text-vs-json.md
- .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cli-invocation/stream-json-incremental-output.md
- .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/permission-modes/accept-edits-auto-approve-writes-sandboxed.md
- .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/permission-modes/bypass-permissions-guard-rail-sandboxed.md
- .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/permission-modes/plan-mode-read-only-enforcement.md
- .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/reasoning-and-models/haiku-fast-classification.md
- .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/reasoning-and-models/opus-extended-thinking.md
- .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/reasoning-and-models/sonnet-balanced-default.md
- .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/context-agent-codebase-exploration.md
- .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/debug-agent-fresh-perspective-root-cause.md
- .opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/handover-agent-context-transfer.md

Authority: templates in `.opencode/skills/sk-doc/create-skill/assets/skill/{skill_md_template,skill_readme_template,skill_reference_template,skill_asset_template}.md` + `.../parent_skill/parent_skill_hub_template.md` (for HUB SKILL.md), and `.opencode/skills/sk-doc/shared/references/core_standards.md`. Validators (run the REAL scripts, NOT the sk-doc/scripts/ symlink facade): `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <file> --type <skill|readme|reference|asset>` and `extract_structure.py <file>` (DQI).

For EACH doc in your slice, check BOTH:
(a) sk-doc TEMPLATE CONFORMANCE — correct type, structure, sequential heading numbering, frontmatter shape, DQI >= 75, validate_document.py exit 0.
(b) REALITY-ALIGNMENT — describes CURRENT state: nested hub paths post-merge (cli-external/cli-*, mcp-tooling/mcp-*), every relative link resolves on disk, feature_catalog entries match real features/tools, playbook scenarios match real capabilities, no stale flat cli-opencode/cli-claude-code/mcp-chrome-devtools/mcp-click-up/mcp-figma/mcp-open-design top-level refs, model/version/command accuracy.

CRITICAL judgment: distinguish a REAL defect from an ESTABLISHED validator-schema gap the whole repo shares (repo-wide TOC ban -> has_toc always fails; changelog plain-H2 policy; the compact "sk-doc-shape" hub-routing playbooks the Lane-C loader parses; kebab-case reference filenames used across 6+ skills; the cli-family `hard_rules` frontmatter; pointer-card assets with no code). Do NOT emit findings for established gaps — note them as expected.

Emit findings: P0 = broken/dead link, wrong-reality, validate FAIL; P1 = template non-conformance or DQI<75; P2 = polish. Each finding needs file:line, the issue, and the exact fix. Focus label this iteration: reality-alignment (still audit BOTH aspects for every doc).

---

## CRITICAL — STATE-LOG APPEND MECHANICS (read before writing artifacts)

The review orchestrator appends its OWN event records (graph_convergence, claim_adjudication) to `deep-review-state.jsonl` between your tool calls. Therefore:
- Append your `{"type":"iteration",...}` record with a PURE SHELL APPEND: `printf '%s\n' '<single-line-json>' >> .opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-state.jsonl` (or `echo '<json>' >> <path>`). NEVER use an Edit/patch that must match the file's current last line — it WILL fail with a false "concurrent modification"/"expected final line no longer matches" error.
- If a state-log write ever appears to conflict, DO NOT HALT and DO NOT ask for confirmation. Just append with `>>` and continue.
- You MUST still produce all three artifacts this iteration: the iteration narrative markdown, the appended state-log iteration record, and the delta JSONL file. Write them regardless of any perceived state contention.
