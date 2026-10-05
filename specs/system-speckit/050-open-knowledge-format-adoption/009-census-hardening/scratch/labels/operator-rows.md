# Guessed citations for operator labels

For each row, replace `?` after **Answer:** with `intended`, `not_intended` or `cant_tell`: is a candidate the file the author meant? For an ambiguous row answered `intended`, add the path after the label.

## 1. row 47 (basename_only, c9)

**Answer:** ?

- Doc: `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/research/evilcharts-2026-09-03/lineages/deepseek-flash-max/iterations/iteration-003.md:15`
- Citation: `../../../../../../.opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json:1`
- Luna: intended .skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/palettes.json
- DeepSeek: not_intended 
- Candidates: `.skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/palettes.json`

```text
**F3-3. The corpus's own system-definition rule says several neutral rows should be categorical.** `color-system.md` defines `categorical` as "category membership" for "unordered categories" and `neutral` as the fallback "whenever hue would carry no stable meaning". A multi-series comparison chart's series identity *is* a category: `grouped-bars` (2 series) is assigned `neutral` while `stacked-bars` (segments) is assigned `categorical` — the same kind of series membership, two different systems. `stacked-area` (2-5 series) is `categorical`, `parallel-axes` is `categorical`, but `grouped-bars` …

…The spec's edge-case list explicitly names "a choice that only reads well in a dark theme" and asks whether the corpus should gain one. [SOURCE: context/evilcharts/src/app/globals.css:102-126] [SOURCE: ../../../../../../.opencode/skills/sk-doc/sk-create-chart/references/color-system.md:75] [SOURCE: ../../../../../../.opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json:1]…

**F3-5. Numeric text is set in a mono face with tabular figures in evilcharts; the corpus uses the system face.** Tooltip values are `font-mono font-medium tabular-nums` (JetBrains Mono on the site, `font-mono` token). The corpus applies `font-variant-numeric: tabular-nums` to tick labels only (daily-line `.tick`); value labels inside the figure, notes and the source line do not. The exact fonts are not adoptable (the contract bans web fonts), but the *treatment* is: a system mono stack (`ui-monospace
```

## 2. row 80 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-speckit/027-xce-research-based-refinement/research/002-implementation-risk-cross-validation/iterations/iteration-019.md:14`
- Citation: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/sub-packet-proposals.md:144`
- Luna: not_intended 
- DeepSeek: intended specs/system-speckit/027-xce-research-based-refinement/research/001-xce-adoption-matrix/sub-packet-proposals.md
- Candidates: `specs/system-speckit/027-xce-research-based-refinement/research/001-xce-adoption-matrix/sub-packet-proposals.md`, `specs/system-speckit/027-xce-research-based-refinement/research/007-gem-team-adoption-matrix/sub-packet-proposals.md`, `specs/system-speckit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings/sub-packet-proposals.md`, `specs/system-speckit/027-xce-research-based-refinement/research/010-openltm-memory-architecture-teachings/sub-packet-proposals.md`

```text

- Read parent phase order and declarations: parent `spec.md` recommends `004 first`, then `001 -> 002 -> 003 in parallel`, then `005 last` (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:45-56`).
- Read proposal dependency graph: original proposals say structural packets `028/029/030` are Phase 1, `031` is standalone but tested with those tools, and `032` depends on `031` plus `028/029/030` (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/sub-packet-proposals.md:144-162`).
- Read ground-truth child dependency metadata: Phase 001 declares no deps, Phase 002 declares `001-code-graph-hld-lld`, Phase 003 declares none, Phase 004 declares none, and Phase 005 declares `001/002/003/004` (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/description.json:19-21`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-code-graph-trace/description.json:19-21`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-code-graph-impact-analysis/description.json:20-22`, `.opencode/specs/system-spec-kit/027-…
- Synthesized Iterations 001-009: Phase 001 needs deterministic ordering and edge policies (`iteration-001.md:17-45`); Phase 002 cannot rely on `CONTAINS` for file/module rungs (`iteration-002.md:19-29`); Phase 003 needs graph-only formula amendments but keeps `layer` optional (`iteration-003.md:30-70`); Phase 004 needs threshold/hint/string-test guardrails (`i
```

## 3. row 92 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/iterations/iteration-014.md:56`
- Citation: `.opencode/skills/system-spec-kit/mcp_server/package.json:3`
- Luna: intended .skilled/skills/system-spec-kit/package.json
- DeepSeek: not_intended 
- Candidates: `.opencode/package.json`, `.pi/extensions/pi-cache-optimizer/package.json`, `.pi/extensions/pi-fast-mode-w-subagent-support/package.json`, `.skilled/package.json`, `.skilled/skills/mcp-code-mode/mcp-server/package.json`, `.skilled/skills/mcp-tooling/mcp-obsidian/mcp-servers/obsidian-mcp/package.json`, `.skilled/skills/sk-design/sk-design-md-generator/backend/package.json`, `.skilled/skills/sk-doc/package.json` and 10 more

```text
| `R10-P1-001` | Confirmed | README still labels the proxy replay boundary as read-only while source replays `memory_save`. | README wording at `.opencode/skills/system-spec-kit/mcp_server/README.md:254`; replayable set includes `memory_save` at `.opencode/bin/lib/launcher-session-proxy.cjs:28`; classifier permits it at `.opencode/bin/lib/launcher-session-proxy.cjs:125`. | Checked adjacent README error-code row and source replay classifier. | The README may use “read-only” as shorthand for safe-to-replay, but source implements a broader read plus idempotent-write boundary. | P1 | High | Downgr…
| `R13-P1-001` | Confirmed | 013 continuity surfaces still disagree on resume target and shipped/deployed state. | Parent spec says active child is `002` at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/spec.md:119`; graph metadata points to `003` at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/graph-metadata.json:97`; graph metadata status is complete at line 41 while derived entities still include `In Progress` at l…
…m-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/implementation-summary.md:72`; source has `version: '1.8.0'` at `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1014`; package version is `1.8.0`
```

## 4. row 102 (basename_only, t10)

**Answer:** ?

- Doc: `specs/sk-doc/062-doc-validation-off-switches/review/lineages/luna/iterations/iteration-001.md:17`
- Citation: `.skilled/skills/sk-doc/scripts/tests/validate-skip-switch.vitest.ts:67`
- Luna: not_intended 
- DeepSeek: intended .skilled/skills/system-spec-kit/runtime/cli/tests/validate-skip-switch.vitest.ts
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/tests/validate-skip-switch.vitest.ts`

```text
The shell resolver uses `__HF_UNSET__` as an in-band marker for an absent environment variable. If a caller explicitly sets a switch to that literal and the config file sets the switch to `1`, the shell reader treats the environment as unset and enables the switch from the file. That contradicts the packet's rule that any set environment value wins, including falsy values. [SOURCE: specs/sk-doc/062-doc-validation-off-switches/spec.md:129-130] [SOURCE: .skilled/hooks/shared/hook-flags.sh:37-44]

The Node and Python readers distinguish key presence from value, so this is isolated to the shell resolver's sentinel check. The existing falsy cases exercise empty, `0`, and `skip`, but not the sentinel literal. [SOURCE: .skilled/hooks/shared/hook-flags.cjs:181-193] [SOURCE: .skilled/skills/sk-doc/scripts/tests/validate-skip-switch.vitest.ts:67-75]

**Recommendation:** Check variable presence independently of its contents and add a focused regression row for this literal.
```

## 5. row 109 (basename_only, t10)

**Answer:** ?

- Doc: `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/research/lineages/luna/research.md:64`
- Citation: `.opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:58`
- Luna: intended .skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/palettes.json
- DeepSeek: not_intended 
- Candidates: `.skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/palettes.json`

```text
| Standalone categorical dark | 96.5° | 3.38 / 1.72 | 0.161 / 0.153 / 0.221 |

The standalone neutral system is intentionally non-hued, and the ordered system is intentionally one hue: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:126-166]`. Their small hue gaps are not categorical failures. The standalone palette also has explicit light/dark grounds and numeric gates for text, marks, ramp steps, and emphasis: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:5-23]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:58-96]`.

The result is to adopt shadcn-style source-token indirection, not the raw five-token ramp. The standalone role split is more useful for this corpus, and the current checker enforces palette source/literal consistency and existing contrast gates but not CVD or hue thresholds: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:229-247]`.
```

## 6. row 51 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/research/lineages/swe/iterations/iteration-004.md:65`
- Citation: `spec.md:91`
- Luna: cant_tell 
- DeepSeek: intended specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/spec.md
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/005-unfilled-placeholders/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/008-invalid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/spec.md` and 4650 more

```text
| Function | Signature | Notes |
|---|---|---|
| `probeBackend(flag)` | `('--deem'|'--jev'|'--both'|'none') → {backend, model, endpoint} | null` | Deem: `GET /health` 200 + `status=="ok"` + `backend` in allowlist `{torch}` or `ensemble:*` sans `stub` + `model=="deem-0.8-v1"` (deepseek-04 F10's gate, quoted). Jev: D5 (`command -v jev`, `jev 0.6.2`, `jev auth status --provider <p>` exit 0). Default order: **Deem first** — this payload is the operator's own transcripts, the packet's highest privacy class (`spec.md:91`); Jev egresses the fitted state |
| `questionsFor(call)` | vendored port | verbatim intent: `call_<id>` keep-call, `result_<id>` keep-verbatim (`compact.ts:58-67`) |
| `batchCalls(calls, stateTokens)` | vendored port (`compact.ts:73-101`) | |
```

## 7. row 52 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-speckit/033-system-speckit-v4/038-goal-unification/001-goal-unification-research/research/lineages/glm/iterations/iteration-013.md:28`
- Citation: `resume.md:4`
- Luna: cant_tell 
- DeepSeek: intended .skilled/commands/speckit/resume.md
- Candidates: `.claude/commands/speckit/resume.md`, `.skilled/commands/speckit/resume.md`

```text
### F3. The whitelist ladder: verified exactly, and it already encodes the read/write authority split

`plan.md:4`, `implement.md:4`, `complete.md:4` = `Read, Write, Edit, Bash, Grep, Glob, Task, opencode_goal, opencode_goal_status`; `resume.md:4` = the same list **without** `opencode_goal` (`[SOURCE: .opencode/commands/speckit/plan.md:4]`, `[SOURCE: .opencode/commands/speckit/implement.md:4]`, `[SOURCE: .opencode/commands/speckit/complete.md:4]`, `[SOURCE: .opencode/commands/speckit/resume.md:4]`). it-007 F4's citations resolve exactly. Resume is already a read-only goal surface; the mutation ladder (which commands may set) precedes this design.

### F4. The template: run 1's it-007 citations were precise; its it-002 citations were not — and two uncited lines are the design
```

## 8. row 54 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/iterations/iteration-008.md:38`
- Citation: `sk-communication/SKILL.md:180`
- Luna: cant_tell 
- DeepSeek: intended .skilled/skills/sk-communication/SKILL.md
- Candidates: `.hermes/skills/agent-ai-council/SKILL.md`, `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-context/SKILL.md`, `.hermes/skills/agent-debug/SKILL.md`, `.hermes/skills/agent-deep-improvement/SKILL.md`, `.hermes/skills/agent-deep-research/SKILL.md`, `.hermes/skills/agent-deep-review/SKILL.md`, `.hermes/skills/agent-design/SKILL.md` and 131 more

```text
2. **The `VOICE PERSONALITY` exclusion cannot be removed by file geometry; a split only moves it.**
The exclusion's stated reason is message ownership, not documentness:
`sk-communication/SKILL.md:180` — "A projection carries someone else's message, so a reaction the
original never held is a fidelity failure rather than a voice improvement." Because
`communication.md:121-122` puts the voice directives in the reply half, any document/reply split
```

## 9. row 55 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-speckit/028-memory-search-intelligence/003-spec-data-quality/020-archive-renumber-010-044-to-001-023/review/iterations/iteration-005.md:54`
- Citation: `implementation-summary.md:131`
- Luna: cant_tell 
- DeepSeek: intended specs/system-speckit/028-memory-search-intelligence/003-spec-data-quality/020-archive-renumber-010-044-to-001-023/implementation-summary.md
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/011-anchors-duplicate-ids/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/012-anchors-empty-memory/implementation-summary.md` and 3798 more

```text
| P1-001 remediation safety | Pass, low-risk/narrow | The affected set is exactly 7 files from iteration 002, and the packet already identifies the safe mechanism: re-run `generate-description.js` + `backfill-graph-metadata.js`, which derive fields fresh from disk path (`spec.md:72`, `spec.md:139`, `implementation-summary.md:99`, `implementation-summary.md:117`). A minimal fix can target only those 7 `description.json.parentChain` arrays or run the same regeneration path over the affected subtree, followed by the existing exact old-number+slug scan. |
| Documentation-scope clarity | Pass with caveat | `implementation-summary.md` is sufficiently scoped for the post-audit claims because it names the exact fields checked before the `zero remaining mismatches` phrase (`implementation-summary.md:99`) and later limits the audit to identity-field/`children_ids` integrity (`implementation-summary.md:151`). Caveat: `checklist.md:78` remains overbroad for `self-references`, which is already covered by P1-001. |
…ification, no new finding | The packet documents the important reusable lessons: single-pass substitution instead of chained `sed` (`spec.md:74`, `implementation-summary.md:111`), the `TOP_MAP` overlap bug class (`implementation-summary.md:97`), and corrected number+slug sweeps (`checklist.md:70`, `implementation-summary.md:131`, `implementation-summary.md:139`). A repo-wide grep for these terms surfaced this packet and its review artifacts, not a generic reusable checklist, so
```

## 10. row 56 (ambiguous, c9)

**Answer:** ?

- Doc: `.skilled/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-002.md:11`
- Citation: `src/registry.ts:88`
- Luna: cant_tell 
- DeepSeek: not_intended 
- Candidates: `.skilled/skills/system-skill-advisor/runtime/lib/embedders/registry.ts`, `.skilled/skills/system-spec-kit/shared/embeddings/registry.ts`

```text

### P1 - Required
- **F003**: Missing null guard in registry merge - `src/registry.ts:88` - Correctness path dereferences prior state before checking the record exists.

### P2 - Suggestion
```

## 11. row 58 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/002-deep-loop-effectiveness-and-fanout/research/iterations-modes/iteration-033.md:636`
- Citation: `n.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md:117`
- Luna: cant_tell 
- DeepSeek: intended specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/decision-record.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/030-missing-decision-sections/decision-record.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/045-valid-sections/decision-record.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/063-template-compliant-level3/decision-record.md`, `.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/phase-creation/expected-3phase-named/decision-record.md`, `.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/post-save-render/test-packet/decision-record.md`, `.skilled/skills/system-spec-kit/templates/examples/level-3+/decision-record.md`, `.skilled/skills/system-spec-kit/templates/examples/level-3/decision-record.md` and 679 more

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/z_archive/resource-map.md:897:| .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/056-spec-kit-references-reorganization/description.json | Cited | OK | phase child; archived |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/z_archive/resource-map.md:898:| .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/056-spec-kit-references-reorganization/graph-metadata.json | Cited | OK | phase child; archived |
…os error 2)\\\\n.opencode/skills/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:4:// Tests for the coverage graph database projection contract.\\\\n.opencode/skills/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:196:    it('namespace matches sessionId format', () => {\\\\n.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md:117:**How to roll back**: Stop using the optimizer outputs, refuse all promotion output, keep canonical configs unchanged, and preserve advisory reports for audit/debu…
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/z_archive/001-fix-command-dispatch/z_archive/resource-map.md:358:| .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/056-spec-kit-references-reorganization/checklist.md
```

## 12. row 59 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/agents/010-repo-rule-system-integration/research/lineages/rules-round2/iterations/iteration-007.md:12`
- Citation: `prevent-overengineering.md:62`
- Luna: cant_tell 
- DeepSeek: intended .skilled/repo-rules/prevent-overengineering.md
- Candidates: `.skilled/repo-rules/prevent-overengineering.md`, `repo-rules/prevent-overengineering.md`

```text
**Evidence new this pass:**
- I re-derived the refusal first-hand from the source of truth rather than the register: the four-part table routes a single-row idea to "a section, not a file" (`decision-tests.md:88-93`, `:134`) and test 4 sends an unnamed failure "nowhere… record the refusal with its reason" (`:113-115`, `:135-139`). "Testing" is one of the ten candidates that table must still refuse (`:95-97`).
- The operator's three sub-asks each already have a text: "improve existing infrastructure" ≈ the reversal-cost order's "Extend an existing function or module in place" (`prevent-overengineering.md:62`); "consolidate overlapping tests" ≈ the pattern rule at `:119-121`; "reduce count" is bracketed by the floor's non-waiver (`AGENTS.md:207`, "this rule never waives it") and deletion routing (`REPO RULES.md:44` → `blast-radius.md`).
- A section inside `prevent-overengineering.md` §4 Tests would still fail creation-standards' section test — "say aloud what breaks without it" (`creation-standards.md:34`, `:50-51`) — because no such failure exists on the record.

```

## 13. row 60 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-speckit/027-xce-research-based-refinement/research/005-live-rescope-coco-purge/iterations/iteration-074.md:20`
- Citation: `005-env-tests-integration/spec.md:38`
- Luna: cant_tell 
- DeepSeek: intended specs/system-speckit/027-xce-research-based-refinement/005-env-tests-integration/spec.md
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/005-unfilled-placeholders/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/008-invalid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/spec.md` and 4650 more

```text
[F-074-04] `005-env-tests-integration/description.json` has a real manual dependency edge to deleted `002`; `005` graph metadata has no manual dependency/child edge, but its derived metadata is stale and should regenerate after docs edits. `005-env-tests-integration/description.json:17-23`, `005-env-tests-integration/graph-metadata.json:6-13`, `005-env-tests-integration/graph-metadata.json:141-144`, `005-env-tests-integration/graph-metadata.json:171`

[F-074-05] `005/spec.md` also has structural dependency/handoff refs to deleted `002`: metadata `Depends On`, coco flag scope, consumer count, children `002-004`, open question, and related-doc link. `005-env-tests-integration/spec.md:38`, `005-env-tests-integration/spec.md:48`, `005-env-tests-integration/spec.md:57-64`, `005-env-tests-integration/spec.md:76-79`, `005-env-tests-integration/spec.md:100`, `005-env-tests-integration/spec.md:131`, `005-env-tests-integration/spec.md:147-150`

[F-074-06] No nested `002-coco` edit is required in the 027 parent or `001-aggregator/graph-metadata.json`: 027 lists only `008` as the child phase, and `001` has no downstream/manual edge. `027-xce-research-based-refinement/graph-metadata.json:6-16`, `027-xce-research-based-refinement/description.json:27-36`, `027-xce-research-based-refinement/context-index.md:35-40`, `001-aggregator/graph-metadata.json:6-13`
```

## 14. row 61 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/research/research.md:1039`
- Citation: `sk-prompt/SKILL.md:3`
- Luna: cant_tell 
- DeepSeek: intended .skilled/skills/sk-prompt/SKILL.md
- Candidates: `.hermes/skills/agent-ai-council/SKILL.md`, `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-context/SKILL.md`, `.hermes/skills/agent-debug/SKILL.md`, `.hermes/skills/agent-deep-improvement/SKILL.md`, `.hermes/skills/agent-deep-research/SKILL.md`, `.hermes/skills/agent-deep-review/SKILL.md`, `.hermes/skills/agent-design/SKILL.md` and 131 more

```text
| 87 | A retention cap on stored hook output | The 546.2 MB of stored `hook_success` is host-owned storage rather than carried context. No owner is named | Q8 | Section 5 (glm-03, lineage-reported) | mimo-04 (N-mimo-04-3, rated later), glm-03 (N-glm-03-2b, rated later) |
| 88 | Reranking the trigger-index lookup's candidates | No counted misrank, and the lookup is a cold synchronous CLI with a fixed exit contract | Q1, Q8 | deepseek-04 F3 and deepseek-05 (lineage-reported) | deepseek-04, deepseek-05, glm-03, glm-05 (its row 81) |
| 89 | A `choice` picker over the sk-prompt frameworks, or a standing usage census | No labeled picks exist, the prose promises 7 frameworks while the registry holds 5 and the matrix inputs are judged. Use is about 3.5 runs a week, and the docs fix needs no model and no finer count | Q1, Q3, Q4 | `sk-prompt/SKILL.md:3`, `:12`, `:38`, `:307-315`. 5 ids in `assets/framework-registry.json` (counted) | grok-05 (N-grok-05-1, rated later), mimo-05 (N-mimo-05-1, rated next), glm-04, glm-05 (its row 82) |
| 90 | A CLEAR-score classifier, or any classifier inside `/prompt:improve` | CLEAR is the skill's own 50-point sum with a 40-point threshold, and no labeled scores exist | Q1, Q3 | `sk-prompt/SKILL.md:321`, BASE2 row 63 | grok-05 (N-grok-05-2), glm-04, glm-05 (its row 83) |
| 91 | Deem or Jev on the sk-design checklist, the diagnosis table or the md-generator gate, including jev-review's five `noul` axes | The gate is a hard-failure count in code, and the 
```

## 15. row 65 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/sk-doc/055-governance-doc-alignment/research/router-alignment/lineages/1789357372647-ynq4so-alignment/iterations/iteration-003.md:151`
- Citation: `delegation-and-orchestration.md:73`
- Luna: cant_tell 
- DeepSeek: intended .skilled/repo-rules/delegation-and-orchestration.md
- Candidates: `.skilled/repo-rules/delegation-and-orchestration.md`, `repo-rules/delegation-and-orchestration.md`

```text
  runtime (handoff-and-questions.md:122-123: resolve it at the runtime you are in rather
  than assuming one; the :127-131 table lists, it does not select); delegation POINTS at
  the selector (delegation-and-orchestration.md:73: Read the executor's own contract,
  per AGENTS.md Dispatch Rules, the selection living where :85-89 of the router wants
  it); skill-hub names a repository-local checker (skill-hub-routing.md:85-86). The
```

## 16. row 68 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/cli-orca/002-consolidate-official-orca-skills/scratch/research-official-skills.md:101`
- Citation: `skills/orca-linear/SKILL.md:13`
- Luna: cant_tell 
- DeepSeek: not_intended 
- Candidates: `.hermes/skills/agent-ai-council/SKILL.md`, `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-context/SKILL.md`, `.hermes/skills/agent-debug/SKILL.md`, `.hermes/skills/agent-deep-improvement/SKILL.md`, `.hermes/skills/agent-deep-research/SKILL.md`, `.hermes/skills/agent-deep-review/SKILL.md`, `.hermes/skills/agent-design/SKILL.md` and 131 more

```text
- **Named CLI entry points / commands / flags:** `ORCA skills get orca-linear` [SOURCE: skills/orca-linear/SKILL.md:37]; full command list identical to §1.2 [SOURCE: skill-guides/orca-linear.md:27-136]; docs add `orca skills get orca-linear --json` as the canonical example for that flag [SOURCE: docs/site/content/docs/cli/skills.mdx:45].
- **Obtain / install:** in-file: only `ORCA skills get orca-linear` → install command **UNKNOWN in-file**. Docs (outside brief list): `npx skills add https://github.com/stablyai/orca --skill orca-linear --global`; "Existing `linear-tickets` installs still resolve" [SOURCE: docs/site/content/docs/cli/skills.mdx:26, 133, 136].
- **Hybrid-stub note:** yes [SOURCE: skills/orca-linear/SKILL.md:13].

### 1.7 `orca-per-workspace-env`
```

## 17. row 71 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/research/iterations/iteration-005.md:28`
- Citation: `spec.md:58`
- Luna: cant_tell 
- DeepSeek: not_intended 
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/005-unfilled-placeholders/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/008-invalid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/spec.md` and 4650 more

```text
| f-iter005-005 | BUGGED | Reranker model docs are partially stale after the Qwen promotion. Current source sets `DEFAULT_RERANKER_NAME = "Qwen/Qwen3-Reranker-0.6B"` at `registered_embedders.py:255-256` and `_DEFAULT_RERANK_MODEL = DEFAULT_RERANKER_NAME` at `config/config.py:30`. The top-level README agrees in the pipeline table at `README.md:78`, but still says `Cross-encoder rerank ... Local Jina v3 reranker` at `README.md:104`. Git history confirms the later flip in `63fcbb57d7 feat(reranker): flip default jina-v3 -> Qwen3-Reranker-0.6B`. | Replace the stale Jina sentence in the README with…
| f-iter005-006 | DEAD | Public docs point to files/folders that do not exist. `INSTALL_GUIDE.md:350` links `feature_catalog/hybrid-search.md` and `INSTALL_GUIDE.md:367` links `feature_catalog/reranker.md`; actual files are `feature_catalog/05--search-and-ranking/07-hybrid-search-bm25-rrf.md` and `feature_catalog/05--search-and-ranking/08-reranker-cross-encoder.md`. `INSTALL_GUIDE.md:365` and `INSTALL_GUIDE.md:1088` cite `benchmark-2026-05-20-cocoindex-via-sidecar`, but `rg --files .opencode/skills/mcp-coco-index/mcp_server/benchmarks` only found the sidecar artifacts under `benchmark-2026-05-…
| f-iter005-007 | MISSED | Nested `023-deep-research-arc-blind-spots/spec.md:2-3` says this is an 8-packet follow-on arc and `spec.md:58-67` maps only `001` through `008`. But `023-deep-research-arc-blind-spots/graph-metadata.json:6-16` includes an additional `010-public-repo-docs-alignment` chi
```

## 18. row 73 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/sk-code/001-sk-code-parent/023-sk-code-workflow-subskill-research/research/iterations/iteration-003.md:16`
- Citation: `.opencode/skills/sk-code/code-verify/SKILL.md:124`
- Luna: cant_tell 
- DeepSeek: not_intended 
- Candidates: `.hermes/skills/agent-ai-council/SKILL.md`, `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-context/SKILL.md`, `.hermes/skills/agent-debug/SKILL.md`, `.hermes/skills/agent-deep-improvement/SKILL.md`, `.hermes/skills/agent-deep-research/SKILL.md`, `.hermes/skills/agent-deep-review/SKILL.md`, `.hermes/skills/agent-design/SKILL.md` and 131 more

```text
2. `code-debug` has a strong local universal checklist, but its checklist still contains older path vocabulary (`references/webflow/...`, `references/opencode/shared/...`, `assets/universal/checklists/...`) that conflicts with the current surface-axis layout. [SOURCE: .opencode/skills/sk-code/code-debug/assets/universal-debugging_checklist.md:69] [SOURCE: .opencode/skills/sk-code/code-debug/assets/universal-debugging_checklist.md:70] [SOURCE: .opencode/skills/sk-code/code-debug/assets/universal-debugging_checklist.md:90] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:227]
3. `code-debug`'s `SKILL.md` has local-vs-delegated resource drift: Resource Domains list local-looking `assets/webflow-debugging_checklist.md` and `references/webflow-debugging/*`, while References and README point to delegated `../code-webflow/...` paths. [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:89] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:91] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:227] [SOURCE: .opencode/skills/sk-code/code-debug/README.md:48]
4. `code-verify` is useful as the non-mutating Phase 3 evidence gate: the registry marks it read/Bash/Grep/Glob only, its contract forbids edits and subagents, and it requires fresh command evidence plus baseline/current/delta/claim-scope reporting before completion claims. [SOURCE: .opencode/skills/sk-code/mode-registry.json:80] [SOURCE: .opencode/skills/sk-code/mode-registry.json:83] [SOURCE: .opencode/skills/sk-code
```

## 19. row 75 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/011-deep-research-swe-2/research/lineages/swe-2-research/iterations/iteration-003.md:33`
- Citation: `acceptance-criteria.md:63`
- Luna: cant_tell 
- DeepSeek: not_intended 
- Candidates: `.skilled/skills/system-spec-kit/templates/examples/level-2/acceptance-criteria.md`, `.skilled/skills/system-spec-kit/templates/examples/level-3+/acceptance-criteria.md`, `.skilled/skills/system-spec-kit/templates/examples/level-3/acceptance-criteria.md`, `specs/agents/006-restraint-and-routing-gates/acceptance-criteria.md`, `specs/agents/007-orchestrator-inline-authority/acceptance-criteria.md`, `specs/agents/008-orchestrate-external-cli-delegation/acceptance-criteria.md`, `specs/agents/009-turn-closeout-next-steps/001-deep-research/acceptance-criteria.md`, `specs/agents/009-turn-closeout-next-steps/002-decision-and-design/acceptance-criteria.md` and 471 more

```text
**C7. Generated-artifact residue.** The committed trigger index carried stale paths into the renamed directories until regenerated (`f5c55c7eb8` "regenerate the trigger index after the advisor rename") — a generated artifact has to be regenerated, not edited; hand-editing corrupts it. Verified: the current index's 56 `mcp-server` hits are all other skills'/specs' (mcp-server-dir-and-manifest-closure, mcp-servers feature docs); zero for `system-skill-advisor/mcp-server`. Same class: `dist/` outputs — the launcher resolves `runtime/dist/runtime/advisor-server.js`, so a rename invalidates every r…

…24 historical files keep the old name by design" on the non-specs tree. [SOURCE: command:`git show afd10f291f`] [SOURCE: file:manual-testing-playbook/auto-indexing/sanitizer-boundaries.md:73-110] [SOURCE: command:`git grep -l system-skill-advisor/mcp-server` bucketed by directory] [SOURCE: file:008 acceptance-criteria.md:63]…

**C9. Negative-guard residue — references that must keep the name.** `skill-advisor-route-contract.test.cjs:142` asserts `!read(docPath).includes('mcp__system_skill_advisor__')` — the retired id kept in the test precisely to guard its absence; the three inverted contract tests do the same. Phase 007's own sweep rules list this class as exempt. [SOURCE: file:.opencode/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs:142] [SOURCE: file:007-docs-and-residue-sweep/spec.md:174-176]
```

## 20. row 76 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/sk-code/001-sk-code-parent/023-sk-code-workflow-subskill-research/research/iterations/iteration-004.md:51`
- Citation: `.opencode/skills/sk-code/code-quality/SKILL.md:144`
- Luna: cant_tell 
- DeepSeek: not_intended 
- Candidates: `.hermes/skills/agent-ai-council/SKILL.md`, `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-context/SKILL.md`, `.hermes/skills/agent-debug/SKILL.md`, `.hermes/skills/agent-deep-improvement/SKILL.md`, `.hermes/skills/agent-deep-research/SKILL.md`, `.hermes/skills/agent-deep-review/SKILL.md`, `.hermes/skills/agent-design/SKILL.md` and 131 more

```text
- .opencode/skills/sk-code/shared/references/phase_detection.md:95
- .opencode/skills/sk-code/code-implement/SKILL.md:157
- .opencode/skills/sk-code/code-quality/SKILL.md:144
- .opencode/skills/sk-code/code-debug/SKILL.md:130
- .opencode/skills/sk-code/code-verify/SKILL.md:144
```

## 21. row 77 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-003.md:97`
- Citation: `implementation-summary.md:73`
- Luna: cant_tell 
- DeepSeek: not_intended 
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/011-anchors-duplicate-ids/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/012-anchors-empty-memory/implementation-summary.md` and 3798 more

```text
- **Evidence refs:** Direct read of `:2568-2581`. The captured `sourceCode` is read at the top of the file (the surrounding `describe` block reads the production source as a string); the test bodies contain only `expect(...).toMatch(...)` calls. There is no `await processFile(...)` invocation in the test bodies.
- **Counterevidence sought:** any runtime assertion, any DB write check, or any `vi.mock` of `indexSingleFile` inside T47c or T47c-2. None present — the tests are pure source-pattern.
…st accidental regression, which is the same convention T47d (`:2583-2586`) uses for the file-watcher `reindexFn`. The deeper runtime correctness (does `fromScan: true` actually gate `persistQualityLoopContent`?) is covered by the two real-DB tests in `handler-memory-index.vitest.ts` (referenced at `implementation-summary.md:73, 119`). The gap is therefore between the GATE (covered at runtime) and the CALLER (covered by source-pattern) — not a real correctness hole, but a structural asymmetry.…
- **Final severity:** no finding — convention-consistent; documented for awareness.
- **Confidence:** 0.93.
```

## 22. row 79 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/002-release-readiness-deep-review-audits/005-mcp-tool-schema-governance-audit/review-report.md:44`
- Citation: `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:109`
- Luna: cant_tell 
- DeepSeek: not_intended 
- Candidates: `.pi/extensions/pi-cache-optimizer/index.ts`, `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts`, `.skilled/skills/mcp-code-mode/mcp-server/index.ts`, `.skilled/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/index.ts`, `.skilled/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/index.ts`, `.skilled/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/index.ts`, `.skilled/skills/system-deep-loop/runtime/lib/authority-root/index.ts`, `.skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/index.ts` and 61 more

```text
**Severity:** P1, schema drift / public tool fails closed.

…d dispatches to `handleCodeGraphVerify(parseArgs(args))` `.opencode/skills/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:77`. Central dispatch validates all code graph tools before calling their module dispatcher `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:79` and `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:109`. `TOOL_SCHEMAS` does not include `code_graph_verify` in the code graph block `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:632`, and `ALLOWED_PARAMETERS` jumps from `code_graph_context` to `detect_changes` w…

**Impact:** The tool does not silently accept unvalidated input; it fails closed before the handler. That still blocks release readiness because the canonical public registry advertises a tool that the strict validation layer cannot dispatch. It also violates the "every `TOOL_DEFINITIONS` entry has a matching Zod schema" requirement.
```

## 23. row 81 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/002-deep-loop-effectiveness-and-fanout/research/iterations-modes/iteration-033.md:636`
- Citation: `n.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-008.md:4535`
- Luna: cant_tell 
- DeepSeek: not_intended 
- Candidates: `specs/agents/010-repo-rule-system-integration/research/lineages/deepseek/iterations/iteration-008.md`, `specs/agents/010-repo-rule-system-integration/research/lineages/rules-round2/iterations/iteration-008.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research/lineages/deepseek/iterations/iteration-008.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/011-dispatch-preflight-parity-research/research/lineages/deepseek/iterations/iteration-008.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/012-runtime-surface-parity-research/research/lineages/deepseek/iterations/iteration-008.md`, `specs/cli-external-orchestration/z_archive/019-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/iterations/iteration-008.md`, `specs/cli-external-orchestration/z_archive/026-cli-external-parent/review/iterations/iteration-008.md`, `specs/cli-external-orchestration/z_archive/029-cli-devin-revival/research-devin-hooks-portability/iterations/iteration-008.md` and 420 more

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/z_archive/resource-map.md:897:| .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/056-spec-kit-references-reorganization/description.json | Cited | OK | phase child; archived |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/z_archive/resource-map.md:898:| .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/056-spec-kit-references-reorganization/graph-metadata.json | Cited | OK | phase child; archived |
…ction matchesSession(graph, record, sessionId, recordType) {\\\\n.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-008.md:4534:.opencode/skills/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:49:  if (!sessionId) return true;\\\\n.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-008.md:4535:.opencode/skills/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:53:  return actualSessionId === sessionId;\\\\n.opencode/specs/skilled-agent-orchestration/042-sk-dee…
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/z_archive/001-fix-command-dispatch/z_archive/resource-map.md:358:| .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/056-spec-kit-references-reorganization/checklist.md
```

## 24. row 83 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/agents/010-repo-rule-system-integration/research/lineages/deprecation-audit/iterations/iteration-002.md:34`
- Citation: `sk-code/sk-code-mobile-cli/SKILL.md:89`
- Luna: cant_tell 
- DeepSeek: intended .skilled/skills/sk-code/sk-code-mobile-cli/SKILL.md
- Candidates: `.hermes/skills/agent-ai-council/SKILL.md`, `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-context/SKILL.md`, `.hermes/skills/agent-debug/SKILL.md`, `.hermes/skills/agent-deep-improvement/SKILL.md`, `.hermes/skills/agent-deep-research/SKILL.md`, `.hermes/skills/agent-deep-review/SKILL.md`, `.hermes/skills/agent-design/SKILL.md` and 131 more

```text
- **`node the retired scenario-persistence wrapper` placeholder** (a redacted command that no longer runs) survives in ~10 live files: `sk-create-manual-testing-playbook/SKILL.md:299`, its `manual-testing-playbook/manual-testing-playbook.md:237,276` and `operator-contract/persist-scenario-result.md:41,56,61,100`; `system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md:105,157` + `system-spec-kit/feature-catalog/ux-hooks/directive-lifecycle-dedup.md:80`; `sk-communication/manual-testing-playbook/manual-testing-playbook.md:95`; `sk-code/sk-code-mobile-cli/manual-testing-pl…
- **sk-create-benchmark teaches Lane C end-to-end**: `SKILL.md:111-112` (FAMILIES), `:120` (`SKILL_BENCHMARK` intent signal), `:146-148` (RESOURCE_MAP), `§10` heading at `:484`, `:646-650` ("`/deep:skill-benchmark` … run their lanes"), `:668` links the deleted `deep-improvement/references/skill-benchmark/scoring-contract.md` **and** the deleted `build-report.cjs`. Same dead links inside its own reference assets: `references/skill-benchmark/serving-snapshot-schema.md:211-213`, `assets/skill-benchmark/skill-benchmark-readme-template.md:179-182,189` (incl. `{{PATH_TO_SKILL_BENCHMARK_COMMAND}} -> …
…), hub `ROUTER.md:57,61` (heading "MACHINE-READABLE ROUTER (replay / benchmark source)" — "the deterministic router-replay parses"), `sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:30` (lists "`/deep:skill-benchmark` router-replay" as consumer #1 of `projectHubRouter
```

## 25. row 86 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/007-foundational-runtime/research/iterations/iteration-035.md:25`
- Citation: `session-stop.ts:313`
- Luna: intended .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts
- DeepSeek: cant_tell 
- Candidates: `.skilled/hooks/session-lifecycle/claude/session-stop.ts`, `.skilled/hooks/session-lifecycle/codex/session-stop.ts`, `.skilled/hooks/session-lifecycle/devin/session-stop.ts`, `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts`, `.skilled/skills/system-spec-kit/runtime/hooks/codex/session-stop.ts`, `.skilled/skills/system-spec-kit/runtime/hooks/devin/session-stop.ts`

```text
- **Severity:** P2
- **Description:** `touchedPaths` is another success-shaped durability signal that outruns the actual write contract. `recordStateUpdate()` appends the state path to `touchedPaths` unconditionally, even though `updateState()` can fail to persist or lose the unlocked `.tmp` race and only emit a warning.
…returns `false` on write or rename failure (`hook-state.ts:170-180`), and `updateState()` only logs `State update was not persisted` before returning the in-memory merged object anyway (`hook-state.ts:237-240`). `processStopHook()` then returns `touchedPaths` as part of `SessionStopProcessResult` (`session-stop.ts:313-317`). The replay harness locks in the happy-path interpretation by asserting one touched path inside the sandbox (`tests/hook-session-stop-replay.vitest.ts:17-24`), but it never forces `saveState()` failure or an overlapping writer before trusting that result.…
- **Downstream Impact:** Tooling or operators can treat `touchedPaths` as proof that the stop hook durably updated hook-state when the file on disk may still hold stale content. That masks local state-write races and makes later autosave/resume failures look like downstream bugs instead of an earlier failed write.

```

## 26. row 87 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/sk-git/028-crawlable-commit-history/001-research/research/lineages/deepseek/research.md:21`
- Citation: `SKILL.md:400`
- Luna: cant_tell 
- DeepSeek: intended .skilled/skills/sk-git/SKILL.md
- Candidates: `.hermes/skills/agent-ai-council/SKILL.md`, `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-context/SKILL.md`, `.hermes/skills/agent-debug/SKILL.md`, `.hermes/skills/agent-deep-improvement/SKILL.md`, `.hermes/skills/agent-deep-research/SKILL.md`, `.hermes/skills/agent-deep-review/SKILL.md`, `.hermes/skills/agent-design/SKILL.md` and 131 more

```text
The enforced contract is `type(scope)[!]: imperative summary`: `SUBJECT_RE` at `.opencode/scripts/git-hooks/commit-msg:72` allows 13 types, a lowercase kebab scope, optional `!`, and any non-empty summary. The hook hard-blocks a numeric-only scope (79-81), a non-lowercase summary start (83-85), repeated spaces (87-89), trailing punctuation (91-94), vague summaries (96-100), subjects over 100 characters (110-113), a missing blank line before the body (52-61), a missing `BREAKING CHANGE:` footer after `!` (139-141), and a body-less commit when 4+ paths are staged (153-155). It only warns on proc…

Collision verdict for a numbered identifier: scope placement is dead on arrival (regex + explicit doc prohibition at SKILL.md:400-401); subject placement spends the 80/100-character budget and trips the process-language warning class; the body/trailer zone collides with nothing blocking, but a new key should be added to `TRAILER_RE` (117), the template (`assets/commit-message-template.md:67`), and SKILL.md §6 (463-495). The doc contract already pushes packet/phase/task metadata into the body or `Refs:` (SKILL.md:410-412), and the only current packet link is the optional, unvalidated `Refs: <is…

Full findings, the placement-cost table, and five ranked recommendations: `iterations/iteration-001.md`.
```

## 27. row 89 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-speckit/033-system-speckit-v4/066-pre-v4-spec-upgrade/research/lineages/luna/iterations/iteration-005.md:60`
- Citation: `specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:75`
- Luna: cant_tell 
- DeepSeek: intended specs/system-speckit/033-system-speckit-v4/066-pre-v4-spec-upgrade/spec.md
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/005-unfilled-placeholders/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/008-invalid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/spec.md` and 4650 more

```text
## Sources Consulted

- [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:75-84]
- [SOURCE: .skilled/skills/system-speckit/runtime/cli/continuity/bf-pipeline.sh:1-25]
- [SOURCE: .skilled/skills/system-speckit/runtime/cli/spec/fullrun.sh:1-23]
```

## 28. row 90 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/sk-communication/001-sk-communication-creation/001-research-strategy/research/lineages/gpt-sol-fast/research.md:213`
- Citation: `iteration-002.md:35`
- Luna: cant_tell 
- DeepSeek: intended specs/sk-communication/001-sk-communication-creation/001-research-strategy/research/lineages/gpt-sol-fast/iterations/iteration-002.md
- Candidates: `.skilled/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-002.md`, `specs/agents/004-agents-md-bloat-audit/research/lineages/pi/iterations/iteration-002.md`, `specs/agents/009-turn-closeout-next-steps/001-deep-research/research/lineages/pi-deepseek/iterations/iteration-002.md`, `specs/agents/009-turn-closeout-next-steps/006-synthesis-presentation/research/lineages/pi-deepseek/iterations/iteration-002.md`, `specs/agents/010-repo-rule-system-integration/research/lineages/deepseek/iterations/iteration-002.md`, `specs/agents/010-repo-rule-system-integration/research/lineages/deprecation-audit/iterations/iteration-002.md`, `specs/agents/010-repo-rule-system-integration/research/lineages/glm/iterations/iteration-002.md`, `specs/agents/010-repo-rule-system-integration/research/lineages/luna/iterations/iteration-002.md` and 1031 more

```text
| Reconstruct original from parsed text | Parsing/decoding can erase byte distinctions | `iteration-002.md:33` | 2 |
| LLM judge as fidelity proof | Probabilistic validation cannot authorize semantic safety | `iteration-002.md:34` | 2 |
| Suppress original before validation | Missing-final, timeout, or cancellation can swallow output | `iteration-002.md:35` | 1-2 |
| Provider/protocol name as privacy class | Compatibility does not establish deployment, retention, residency, or consent | `iteration-003.md:34` | 3 |
| Automatic local-to-hosted fallback | Crosses an egress boundary without explicit consent | `iteration-003.md:35` | 3 |
```

## 29. row 91 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/review/lineages/p018-opus-3/iterations/iteration-001.md:53`
- Citation: `spec.md:157`
- Luna: cant_tell 
- DeepSeek: intended specs/system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/spec.md
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/005-unfilled-placeholders/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/008-invalid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/spec.md` and 4650 more

```text
- `processBatches` signature is `(items, processor, batchSize, delayMs, retryOptions)` (`batch-processor.ts:123-128`); the call site `memory-index.ts:1034` passes `scanBatchSize, undefined, { shouldAbort }`, so `delayMs` correctly falls back to `BATCH_DELAY_MS` via the JS default-param rule and the early-abort skips the inter-batch delay at `batch-processor.ts:172`. Correct.
- `shouldAbort` fires only when `ctx.isCancelled?.()` is true, so early-abort never triggers on a non-cancelled run. The break at `batch-processor.ts:150` returns partial in-order `results`, and the result-tally loop indexes `filesToIndex[i]` by position, so no index drift. On cancel, the partial result is superseded by `cancelledScanEnvelope(scanKey)` returned from the metadata-edge loop (`memory-index.ts:1178`), the post-loop check (`:1206`), or the causal-chain loop (`:1313`).
- Tail-loop yields land at iteration boundaries before the per-row `promoteMetadataEdges` transaction (`memory-index.ts:1176-1186`) and before the per-folder DB work (`:1311-1317`), preserving atomicity on the single shared better-sqlite3 connection — matching the spec's stated safety invariant (spec.md:157).
- `isCancelRequestedFast` is allocation/IO-free (`job-store.ts:335-338`, `Set.has`); the background dispatch routes `isCancelled` through it (`memory-index.ts:1444`); the durable `cancel_requested` column still backs status/recovery via `isCancelRequested` (`job-store.ts:329-333`). The bare `isCancelRequested` import was cor
```

## 30. row 93 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/003-shared-package-utilization/research/lineages/glm-5-3-flash-shared-package/iterations/iteration-006.md:16`
- Citation: `config.ts:10`
- Luna: cant_tell 
- DeepSeek: intended .skilled/skills/system-spec-kit/shared/config.ts
- Candidates: `.pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts`, `.skilled/skills/system-spec-kit/runtime/cli/core/config.ts`, `.skilled/skills/system-spec-kit/runtime/core/config.ts`, `.skilled/skills/system-spec-kit/shared/config.ts`

```text
| F6.4 | `shared/chunking.ts` (143) | Claimed: the section-aware semantic chunker. Actual: live via **one import** — the hf-local *provider* (`embeddings/providers/hf-local.ts:13` imports `semanticChunk` + `MAX_TEXT_LENGTH`); its other three exports (`RESERVED_OVERVIEW:23`, `RESERVED_OUTCOME:25`, `MIN_SECTION_LENGTH:27`) are consumed only by the production-dead monolith (`embeddings.ts:20`, F2.1) and a test that imports it by **relative source path** (`runtime/tests/chunking-semantic.vitest.ts:10` `'../../shared/chunking'` — a third convention, neither the specifier nor the vitest alias). The …
…_TTL_MS` (hf-local.ts:672), `SPECKIT_CASCADE_PROBE_TIMEOUT_MS` (auto-select.ts:117), `SPECKIT_ROLLOUT_PERCENT` (adaptive-fusion.ts:104), `MEMORY_DB_PATH` (paths.ts:164 + factory + hf-local.ts:346 — three readers, and the launcher *sets* it: launcher.cjs:286-303), `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` (config.ts:10, profile.ts:274, factory ×2), `VITEST`/`NODE_ENV`/`SPECKIT_TEST` (paths.ts:68-70), `SPECKIT_IPC_SOCKET_DIR` (socket-server.ts:217 + hf-local), `SPECKIT_MAX_SECONDARY_CLIENTS` (socket-server.ts:142). Reads by liveness tier: the adapter/ollama/auto-select/factory/paths/socket cluster = **…
| F6.6 | the 2-spelling bug-family (4 instances) | Claimed: n/a (a structural finding). Actual: the package resolves the *same* thing under two names in four places: (a) `SPEC_KIT_DB_DIR \|\| SPECKIT_DB_DIR` — config.ts:10, factory (fingerprint + candidates), profile.ts:274; (b) the Voyage base
```

## 31. row 95 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/luna-fanout/lineages/luna/deep-research-strategy.md:50`
- Citation: `evals/README.md:1`
- Luna: cant_tell 
- DeepSeek: intended .skilled/skills/i-have-adhd/evals/README.md
- Candidates: `.claude/hooks/README.md`, `.codex/hooks/README.md`, `.cursor/hooks/README.md`, `.devin/hooks/README.md`, `.github/workflows/README.md`, `.opencode/README.md`, `.opencode/plugins/README.md`, `.opencode/plugins/tests/README.md` and 1001 more

```text
- The absolute colon ban and universal binding or installation scope contradict the existing punctuation and routing boundaries. [SOURCE: `STYLE.md:3, 25-29`; `README.md:20-30`; `prose-mechanics.md:90-107`; `REPO RULES.md:36-50`]
- Most ADHD output rules duplicate the actionability, numbering, tangent, list-cap, handoff and evidence boundaries. Every-turn state restatement conflicts with event-driven handoff, while the reader profile, two-minute default, combined pre-send check and explicit runtime mechanisms are new or mixed. [SOURCE: `i-have-adhd/SKILL.md:13-142`; `communication.md:49-221`; `handoff-and-questions.md:55-136`]
- The ADHD mechanism has an opt-in session-start hook, runtime persistence and reinjection, cross-runtime manifests, a case-based eval harness and fail-closed load and release gates. [SOURCE: `always-on.mjs:1-44`; `i-have-adhd.mjs:1-99`; `i-have-adhd.ts:1-240`; `evals/README.md:1-84`; `plugin-load-check.yml:1-47`]
- The final map is complete. Remaining source distinctions are recorded in `research.md`, including the contradiction list, candidate owners and sibling disagreements. [SOURCE: `research.md:1-999`]
<!-- /ANCHOR:answered-questions -->
```

## 32. row 97 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/review/iterations/iteration-003.md:48`
- Citation: `implementation-summary.md:117`
- Luna: cant_tell 
- DeepSeek: intended specs/system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability/implementation-summary.md
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/011-anchors-duplicate-ids/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/012-anchors-empty-memory/implementation-summary.md` and 3798 more

```text

- File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard/tasks.md:75`
…ntation-summary.md:97-101`. This is not isolated: packet 009 still has all verification tasks/checklist rows unchecked or pending (`tasks.md:70-84`, `checklist.md:67-71`, `implementation-summary.md:92-93`), packet 010 leaves strict validation unchecked/pending (`tasks.md:80-91`, `checklist.md:76`, `implementation-summary.md:117`), and packet 012 leaves strict validation/completion unchecked while its summary says the target is pending (`tasks.md:78-88`, `implementation-summary.md:103`).…
- Claim: The shipped daemon child packets do not have a single trustworthy completion ledger for verification and strict validation.
- Evidence refs: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard/tasks.md:75`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard/implementation-summary.md:97`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/009-shutdown-durability/checklist.md:67`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability/checklist…
```

## 33. row 98 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/002-deep-loop-effectiveness-and-fanout/research/iterations-modes/iteration-033.md:636`
- Citation: `n.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/archive-rvw-2026-04-11/iterations/iteration-003.md:40`
- Luna: cant_tell 
- DeepSeek: intended specs/system-deep-loop/042-sk-deep-research-review-improvement-2/review/archive-rvw-2026-04-11/iterations/iteration-003.md
- Candidates: `.skilled/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-003.md`, `specs/agents/004-agents-md-bloat-audit/research/lineages/pi/iterations/iteration-003.md`, `specs/agents/009-turn-closeout-next-steps/001-deep-research/research/lineages/pi-deepseek/iterations/iteration-003.md`, `specs/agents/009-turn-closeout-next-steps/006-synthesis-presentation/research/lineages/pi-deepseek/iterations/iteration-003.md`, `specs/agents/010-repo-rule-system-integration/research/lineages/deepseek/iterations/iteration-003.md`, `specs/agents/010-repo-rule-system-integration/research/lineages/deprecation-audit/iterations/iteration-003.md`, `specs/agents/010-repo-rule-system-integration/research/lineages/glm/iterations/iteration-003.md`, `specs/agents/010-repo-rule-system-integration/research/lineages/luna/iterations/iteration-003.md` and 1001 more

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/z_archive/resource-map.md:897:| .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/056-spec-kit-references-reorganization/description.json | Cited | OK | phase child; archived |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/z_archive/resource-map.md:898:| .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/056-spec-kit-references-reorganization/graph-metadata.json | Cited | OK | phase child; archived |
…8:| confirm_runtime | partial | soft | `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:597` | The confirm mirrors preserve raw graph-event IDs and pass sessionId separately, so the namespace rule exists operationally but not in the payload contract authors are told to emit. |\\\\n.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/archive-rvw-2026-04-11/iterations/iteration-003.md:40:- Looking for a second handler-side auth or validation bypass in `mcp_server/handlers/coverage-graph/upsert.ts`: the handler validates `specFolder`, `lo…
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/z_archive/001-fix-command-dispatch/z_archive/resource-map.md:358:| .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/056-spec-kit-references-reorganization/checklist.md
```

## 34. row 99 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-speckit/028-memory-search-intelligence/review/deep-review-strategy.md:273`
- Citation: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/README.md:19`
- Luna: cant_tell 
- DeepSeek: intended .skilled/skills/system-spec-kit/mcp_server/lib/storage/README.md
- Candidates: `.claude/hooks/README.md`, `.codex/hooks/README.md`, `.cursor/hooks/README.md`, `.devin/hooks/README.md`, `.github/workflows/README.md`, `.opencode/README.md`, `.opencode/plugins/README.md`, `.opencode/plugins/tests/README.md` and 1001 more

```text

### `skill_agent`: PASS. The reviewed folder guides preserve the handler-to-library boundary and do not claim MCP-tool ownership. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:20-31`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/README.md:19-29,56-59`] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `skill_agent`: PASS. The reviewed folder guides preserve the handler-to-library boundary and do not claim MCP-tool ownership. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:20-31`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/README.md:19-29,56-59`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. The reviewed folder guides preserve the handler-to-library boundary and do not claim MCP-tool ownership. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:20-31`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/README.md:19-29,56-59`]
```

## 35. row 100 (ambiguous, c9)

**Answer:** ?

- Doc: `specs/system-speckit/027-xce-research-based-refinement/research/001-xce-adoption-matrix/iterations/iteration-002.md:38`
- Citation: `external/README.md:211`
- Luna: cant_tell 
- DeepSeek: intended specs/system-speckit/027-xce-research-based-refinement/research/001-xce-adoption-matrix/external/README.md
- Candidates: `.claude/hooks/README.md`, `.codex/hooks/README.md`, `.cursor/hooks/README.md`, `.devin/hooks/README.md`, `.github/workflows/README.md`, `.opencode/README.md`, `.opencode/plugins/README.md`, `.opencode/plugins/tests/README.md` and 1001 more

```text

Evidence lines:
- external/README.md:211-213: "Trace a symbol from code-level up to module-level architecture. Understand how a function connects to the broader system."
- external/README.md:214-218: "Source: 'validate_token' / Target: 'hld' → Returns: function → class → module → architectural role"

```

## 36. row 101 (ambiguous, t10)

**Answer:** ?

- Doc: `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/011-deep-research-swe-2/research/lineages/swe-2-research/iterations/iteration-004.md:47`
- Citation: `goal.md:116`
- Luna: cant_tell 
- DeepSeek: intended specs/system-skill-advisor/025-mcp-decommission-cli-front-door/goal.md
- Candidates: `.claude/commands/create/goal.md`, `.skilled/commands/create/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/002-hermes-contract-pin/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/003-deep-loop-executor-support/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/004-cli-hermes-skill-packet/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/005-hermes-runtime-folder/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/006-hermes-hook-and-plugin-layer/goal.md` and 456 more

```text
**11. When the deletion surface turns out to be load-bearing, halt — do not work around it.** Phase 005 found the MCP `Server` object was the socket's request handler, not a stdio transport, and stopped rather than deleting the socket the CLI depends on; the phase reopened and the wire migration shipped in `3def6d6c9b`. [SOURCE: command:`git show 3def6d6c9b`]

**12. Rename after the removal, and carry everything that names the path — including generated artifacts, which are regenerated, not edited.** `git mv` plus 407 path updates: launcher, CLI shim, plugin, doctor scripts, tsconfig outputs, freshness key, the cross-package shim, and the committed trigger index (`f5c55c7eb8`). Renaming first would hide deletions inside a move diff. [SOURCE: command:`git show 3feab865ea`] [SOURCE: file:goal.md:116] [SOURCE: file:spec.md:158]

### D. Sweep residue by claims, over the whole repo, with explicit keep-classes
```

## 37. row 103 (ambiguous, t10)

**Answer:** ?

- Doc: `specs/sk-prompt/007-sk-prompt-parent/review/deep-review-strategy.md:336`
- Citation: `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-final--router/skill-benchmark-report.json:108`
- Luna: cant_tell 
- DeepSeek: intended .skilled/skills/sk-prompt/benchmark/reports/2026-07-10--router-final--router/skill-benchmark-report.json
- Candidates: `.pi/extensions/pi-cache-optimizer/benchmark/reports/2026-08-17--manual-testing-playbook--cache-behavior/skill-benchmark-report.json`, `.pi/extensions/pi-fast-mode-w-subagent-support/benchmark/reports/2026-08-17--manual-testing-playbook--fast-mode-usage/skill-benchmark-report.json`, `.skilled/skills/cli-external-orchestration/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json`, `.skilled/skills/cli-external-orchestration/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json`, `.skilled/skills/cli-external-orchestration/cli-claude-code/benchmark/reports/2026-07-29--manual-testing-playbook--goal-hook/skill-benchmark-report.json`, `.skilled/skills/cli-external-orchestration/cli-claude-code/benchmark/reports/2026-08-08--manual-testing-playbook--claude/skill-benchmark-report.json`, `.skilled/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--agent-routing-2/skill-benchmark-report.json`, `.skilled/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--agent-routing-3/skill-benchmark-report.json` and 279 more

```text
- What was tried: Overlay `playbook_capability`: DEFERRED for ordered-bundle scenario coverage. `hub-router.json` advertises `orderedBundle`, but the current playbook/benchmark evidence exercises four single-mode routing scenarios only; no gold row proves bundle behavior is a required correctness contract. [SOURCE: `.opencode/skills/sk-prompt/hub-router.json:8-14`; `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-final--router/skill-benchmark-report.md:38-58`; `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-final--router/skill-benchmark-report.json:108-117`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `playbook_capability`: DEFERRED for ordered-bundle scenario coverage. `hub-router.json` advertises `orderedBundle`, but the current playbook/benchmark evidence exercises four single-mode routing scenarios only; no gold row proves bundle behavior is a required correctness contract. [SOURCE: `.opencode/skills/sk-prompt/hub-router.json:8-14`; `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-final--router/skill-benchmark-report.md:38-58`; `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-final--router/skill-benchmark-report.json:108-117`]

### Overlay `playbook_capability`: DEFERRED to maintainability/traceability dimensions; this iteration only checked README and agent command-path correctness. -- BLOCKED (iteration 1, 1 attempts)
```

## 38. row 105 (ambiguous, t10)

**Answer:** ?

- Doc: `specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-011.md:21`
- Citation: `specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:127`
- Luna: cant_tell 
- DeepSeek: not_intended 
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/005-unfilled-placeholders/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/008-invalid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/spec.md` and 4650 more

```text
4. **Verifier ownership follows evidence production order and is rechecked at the last mutable boundary — CONFIRM Decision 2 and EXTEND iteration 10's earliest-owner rule.** Admission verifies proposal and dependency closure; the seal verifier owns executable content; the organization-policy compiler owns source-rule provenance; the gate service owns authenticated human decision and dependency freshness; budget authority owns reservations, debits, settlements, leases, and budget heads; the graph evidence resolver verifies their immutable references and current heads; the 036 gateway alone owns…

…get receipt are invalid effect capabilities. This preserves reference closure without collapsing ledgers or creating one omnibus graph receipt. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:54-56] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:127-129] [INFERENCE: separation is the runtime composition of iterations 6 and 9]…

6. **Compatibility is additive, versioned, and authority-neutral until the 036 cutover plane selects it — REFINE iterations 4, 8, and 10.** Existing V1 authorization requests, decision events, frame bytes, registry digests, and replay remain unchanged. Add graph payload definitions at version 1, a graph evidence verifier/adapter, and a refusal evidence reader; introduce an adjac
```

## 39. row 106 (ambiguous, t10)

**Answer:** ?

- Doc: `specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-008.md:15`
- Citation: `specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/plan.md:62`
- Luna: cant_tell 
- DeepSeek: not_intended 
- Candidates: `.claude/commands/speckit/plan.md`, `.skilled/commands/speckit/plan.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/plan.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/plan.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/plan.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/005-unfilled-placeholders/plan.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/006-missing-required-files/plan.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/plan.md` and 4099 more

```text
1. **GraphARC has several locally useful records but no single reference-closed source of truth — CONFIRM Decision 4 and CONTRADICT the trace module's audit-trail claim.** Trace JSONL captures observed node/sub-step activity and drives replay, cost, metrics, and OTel, but truncates values, omits reducer identity, infers parentage, and is disconnected from policy JSONL and session SQLite. Policy audit can be absent on compiled paths; session rows and checkpoints separately describe inputs, status, and state. The system contract therefore makes verified 036 domain, authorization-audit, refusal-e…

… the existing event envelope and append receipt. Durations, token chunks, host/PID, span IDs, and rendered state are observations or projections and do not decide replay order or authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:99-145] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/plan.md:62-85] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:215-235]…

3. **Deterministic replay requires reference-closed multi-ledger cuts and exact reducer identity — CONFIRM Graphene P2 and REFINE GraphARC replay.** Domain and authorization ledgers have independent sequences; a valid cut includes every authorization reference required by its domain range and classif
```

## 40. row 107 (ambiguous, t10)

**Answer:** ?

- Doc: `specs/sk-code/001-sk-code-parent/025-code-quality-and-shared-research/research/research.md:84`
- Citation: `.opencode/skills/sk-code/code-quality/SKILL.md:187`
- Luna: cant_tell 
- DeepSeek: intended .skilled/skills/sk-code/code-quality/SKILL.md
- Candidates: `.hermes/skills/agent-ai-council/SKILL.md`, `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-context/SKILL.md`, `.hermes/skills/agent-debug/SKILL.md`, `.hermes/skills/agent-deep-improvement/SKILL.md`, `.hermes/skills/agent-deep-research/SKILL.md`, `.hermes/skills/agent-deep-review/SKILL.md`, `.hermes/skills/agent-design/SKILL.md` and 131 more

```text
4. **P2 / fourth:** tune parent router/advisor vocabulary and scorer cases without creating a separate `code-quality` identity; the parent already routes the single `sk-code` identity and has quality aliases. [SOURCE: .opencode/skills/sk-code/mode-registry.json:10] [SOURCE: .opencode/skills/sk-code/mode-registry.json:35] [SOURCE: .opencode/skills/sk-code/hub-router.json:42]
5. **P2 / fifth:** add sk-code-owned hook coverage and a deep-review consumption note after the docs/schema are explicit. Current manual coverage includes dist staleness but lacks comment-hygiene branch coverage. [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:298] [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:322] [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:324]
…nt authority, completion claims, copied shared references, or packet-local graph metadata to `code-quality`; defer delta-file ownership to deep-loop, and involve system-spec-kit only if deltas become canonical governed artifacts. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:185] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:187] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:192] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:159] [SOURCE: .opencode/agents/deep-research.md:71] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:410]…

## Convergence Recommendation (Iteration 9)
```

