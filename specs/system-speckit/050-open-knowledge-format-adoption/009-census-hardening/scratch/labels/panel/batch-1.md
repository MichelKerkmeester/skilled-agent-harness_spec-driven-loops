## Row 47 (basename_only)
- Doc: `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/research/evilcharts-2026-09-03/lineages/deepseek-flash-max/iterations/iteration-003.md:15`
- Citation: `../../../../../../.opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json:1`
- Candidates: `.skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/palettes.json`

```text
**F3-3. The corpus's own system-definition rule says several neutral rows should be categorical.** `color-system.md` defines `categorical` as "category membership" for "unordered categories" and `neutral` as the fallback "whenever hue would carry no stable meaning". A multi-series comparison chart's series identity *is* a category: `grouped-bars` (2 series) is assigned `neutral` while `stacked-bars` (segments) is assigned `categorical` — the same kind of series membership, two different systems. `stacked-area` (2-5 series) is `categorical`, `parallel-axes` is `categorical`, but `grouped-bars` …

…The spec's edge-case list explicitly names "a choice that only reads well in a dark theme" and asks whether the corpus should gain one. [SOURCE: context/evilcharts/src/app/globals.css:102-126] [SOURCE: ../../../../../../.opencode/skills/sk-doc/sk-create-chart/references/color-system.md:75] [SOURCE: ../../../../../../.opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json:1]…

**F3-5. Numeric text is set in a mono face with tabular figures in evilcharts; the corpus uses the system face.** Tooltip values are `font-mono font-medium tabular-nums` (JetBrains Mono on the site, `font-mono` token). The corpus applies `font-variant-numeric: tabular-nums` to tick labels only (daily-line `.tick`); value labels inside the figure, notes and the source line do not. The exact fonts are not adoptable (the contract bans web fonts), but the *treatment* is: a system mono stack (`ui-monospace
```

## Row 80 (ambiguous)
- Doc: `specs/system-speckit/027-xce-research-based-refinement/research/002-implementation-risk-cross-validation/iterations/iteration-019.md:14`
- Citation: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/sub-packet-proposals.md:144`
- Candidates: `specs/system-speckit/027-xce-research-based-refinement/research/001-xce-adoption-matrix/sub-packet-proposals.md`, `specs/system-speckit/027-xce-research-based-refinement/research/007-gem-team-adoption-matrix/sub-packet-proposals.md`, `specs/system-speckit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings/sub-packet-proposals.md`, `specs/system-speckit/027-xce-research-based-refinement/research/010-openltm-memory-architecture-teachings/sub-packet-proposals.md`

```text

- Read parent phase order and declarations: parent `spec.md` recommends `004 first`, then `001 -> 002 -> 003 in parallel`, then `005 last` (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:45-56`).
- Read proposal dependency graph: original proposals say structural packets `028/029/030` are Phase 1, `031` is standalone but tested with those tools, and `032` depends on `031` plus `028/029/030` (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/sub-packet-proposals.md:144-162`).
- Read ground-truth child dependency metadata: Phase 001 declares no deps, Phase 002 declares `001-code-graph-hld-lld`, Phase 003 declares none, Phase 004 declares none, and Phase 005 declares `001/002/003/004` (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/description.json:19-21`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-code-graph-trace/description.json:19-21`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-code-graph-impact-analysis/description.json:20-22`, `.opencode/specs/system-spec-kit/027-…
- Synthesized Iterations 001-009: Phase 001 needs deterministic ordering and edge policies (`iteration-001.md:17-45`); Phase 002 cannot rely on `CONTAINS` for file/module rungs (`iteration-002.md:19-29`); Phase 003 needs graph-only formula amendments but keeps `layer` optional (`iteration-003.md:30-70`); Phase 004 needs threshold/hint/string-test guardrails (`i
```

## Row 92 (ambiguous)
- Doc: `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/iterations/iteration-014.md:56`
- Citation: `.opencode/skills/system-spec-kit/mcp_server/package.json:3`
- Candidates: `.opencode/package.json`, `.pi/extensions/pi-cache-optimizer/package.json`, `.pi/extensions/pi-fast-mode-w-subagent-support/package.json`, `.skilled/package.json`, `.skilled/skills/mcp-code-mode/mcp-server/package.json`, `.skilled/skills/mcp-tooling/mcp-obsidian/mcp-servers/obsidian-mcp/package.json`, `.skilled/skills/sk-design/sk-design-md-generator/backend/package.json`, `.skilled/skills/sk-doc/package.json` and 10 more

```text
| `R10-P1-001` | Confirmed | README still labels the proxy replay boundary as read-only while source replays `memory_save`. | README wording at `.opencode/skills/system-spec-kit/mcp_server/README.md:254`; replayable set includes `memory_save` at `.opencode/bin/lib/launcher-session-proxy.cjs:28`; classifier permits it at `.opencode/bin/lib/launcher-session-proxy.cjs:125`. | Checked adjacent README error-code row and source replay classifier. | The README may use “read-only” as shorthand for safe-to-replay, but source implements a broader read plus idempotent-write boundary. | P1 | High | Downgr…
| `R13-P1-001` | Confirmed | 013 continuity surfaces still disagree on resume target and shipped/deployed state. | Parent spec says active child is `002` at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/spec.md:119`; graph metadata points to `003` at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/graph-metadata.json:97`; graph metadata status is complete at line 41 while derived entities still include `In Progress` at l…
…m-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/implementation-summary.md:72`; source has `version: '1.8.0'` at `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1014`; package version is `1.8.0`
```

## Row 102 (basename_only)
- Doc: `specs/sk-doc/062-doc-validation-off-switches/review/lineages/luna/iterations/iteration-001.md:17`
- Citation: `.skilled/skills/sk-doc/scripts/tests/validate-skip-switch.vitest.ts:67`
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/tests/validate-skip-switch.vitest.ts`

```text
The shell resolver uses `__HF_UNSET__` as an in-band marker for an absent environment variable. If a caller explicitly sets a switch to that literal and the config file sets the switch to `1`, the shell reader treats the environment as unset and enables the switch from the file. That contradicts the packet's rule that any set environment value wins, including falsy values. [SOURCE: specs/sk-doc/062-doc-validation-off-switches/spec.md:129-130] [SOURCE: .skilled/hooks/shared/hook-flags.sh:37-44]

The Node and Python readers distinguish key presence from value, so this is isolated to the shell resolver's sentinel check. The existing falsy cases exercise empty, `0`, and `skip`, but not the sentinel literal. [SOURCE: .skilled/hooks/shared/hook-flags.cjs:181-193] [SOURCE: .skilled/skills/sk-doc/scripts/tests/validate-skip-switch.vitest.ts:67-75]

**Recommendation:** Check variable presence independently of its contents and add a focused regression row for this literal.
```

## Row 109 (basename_only)
- Doc: `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/research/lineages/luna/research.md:64`
- Citation: `.opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:58`
- Candidates: `.skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/palettes.json`

```text
| Standalone categorical dark | 96.5° | 3.38 / 1.72 | 0.161 / 0.153 / 0.221 |

The standalone neutral system is intentionally non-hued, and the ordered system is intentionally one hue: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:126-166]`. Their small hue gaps are not categorical failures. The standalone palette also has explicit light/dark grounds and numeric gates for text, marks, ramp steps, and emphasis: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:5-23]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:58-96]`.

The result is to adopt shadcn-style source-token indirection, not the raw five-token ramp. The standalone role split is more useful for this corpus, and the current checker enforces palette source/literal consistency and existing contrast gates but not CVD or hue thresholds: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:229-247]`.
```

## Row 51 (ambiguous)
- Doc: `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/research/lineages/swe/iterations/iteration-004.md:65`
- Citation: `spec.md:91`
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/005-unfilled-placeholders/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/008-invalid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/spec.md` and 4650 more

```text
| Function | Signature | Notes |
|---|---|---|
| `probeBackend(flag)` | `('--deem'|'--jev'|'--both'|'none') → {backend, model, endpoint} | null` | Deem: `GET /health` 200 + `status=="ok"` + `backend` in allowlist `{torch}` or `ensemble:*` sans `stub` + `model=="deem-0.8-v1"` (deepseek-04 F10's gate, quoted). Jev: D5 (`command -v jev`, `jev 0.6.2`, `jev auth status --provider <p>` exit 0). Default order: **Deem first** — this payload is the operator's own transcripts, the packet's highest privacy class (`spec.md:91`); Jev egresses the fitted state |
| `questionsFor(call)` | vendored port | verbatim intent: `call_<id>` keep-call, `result_<id>` keep-verbatim (`compact.ts:58-67`) |
| `batchCalls(calls, stateTokens)` | vendored port (`compact.ts:73-101`) | |
```

## Row 52 (ambiguous)
- Doc: `specs/system-speckit/033-system-speckit-v4/038-goal-unification/001-goal-unification-research/research/lineages/glm/iterations/iteration-013.md:28`
- Citation: `resume.md:4`
- Candidates: `.claude/commands/speckit/resume.md`, `.skilled/commands/speckit/resume.md`

```text
### F3. The whitelist ladder: verified exactly, and it already encodes the read/write authority split

`plan.md:4`, `implement.md:4`, `complete.md:4` = `Read, Write, Edit, Bash, Grep, Glob, Task, opencode_goal, opencode_goal_status`; `resume.md:4` = the same list **without** `opencode_goal` (`[SOURCE: .opencode/commands/speckit/plan.md:4]`, `[SOURCE: .opencode/commands/speckit/implement.md:4]`, `[SOURCE: .opencode/commands/speckit/complete.md:4]`, `[SOURCE: .opencode/commands/speckit/resume.md:4]`). it-007 F4's citations resolve exactly. Resume is already a read-only goal surface; the mutation ladder (which commands may set) precedes this design.

### F4. The template: run 1's it-007 citations were precise; its it-002 citations were not — and two uncited lines are the design
```

## Row 54 (ambiguous)
- Doc: `specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/iterations/iteration-008.md:38`
- Citation: `sk-communication/SKILL.md:180`
- Candidates: `.hermes/skills/agent-ai-council/SKILL.md`, `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-context/SKILL.md`, `.hermes/skills/agent-debug/SKILL.md`, `.hermes/skills/agent-deep-improvement/SKILL.md`, `.hermes/skills/agent-deep-research/SKILL.md`, `.hermes/skills/agent-deep-review/SKILL.md`, `.hermes/skills/agent-design/SKILL.md` and 131 more

```text
2. **The `VOICE PERSONALITY` exclusion cannot be removed by file geometry; a split only moves it.**
The exclusion's stated reason is message ownership, not documentness:
`sk-communication/SKILL.md:180` — "A projection carries someone else's message, so a reaction the
original never held is a fidelity failure rather than a voice improvement." Because
`communication.md:121-122` puts the voice directives in the reply half, any document/reply split
```

## Row 55 (ambiguous)
- Doc: `specs/system-speckit/028-memory-search-intelligence/003-spec-data-quality/020-archive-renumber-010-044-to-001-023/review/iterations/iteration-005.md:54`
- Citation: `implementation-summary.md:131`
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/011-anchors-duplicate-ids/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/012-anchors-empty-memory/implementation-summary.md` and 3798 more

```text
| P1-001 remediation safety | Pass, low-risk/narrow | The affected set is exactly 7 files from iteration 002, and the packet already identifies the safe mechanism: re-run `generate-description.js` + `backfill-graph-metadata.js`, which derive fields fresh from disk path (`spec.md:72`, `spec.md:139`, `implementation-summary.md:99`, `implementation-summary.md:117`). A minimal fix can target only those 7 `description.json.parentChain` arrays or run the same regeneration path over the affected subtree, followed by the existing exact old-number+slug scan. |
| Documentation-scope clarity | Pass with caveat | `implementation-summary.md` is sufficiently scoped for the post-audit claims because it names the exact fields checked before the `zero remaining mismatches` phrase (`implementation-summary.md:99`) and later limits the audit to identity-field/`children_ids` integrity (`implementation-summary.md:151`). Caveat: `checklist.md:78` remains overbroad for `self-references`, which is already covered by P1-001. |
…ification, no new finding | The packet documents the important reusable lessons: single-pass substitution instead of chained `sed` (`spec.md:74`, `implementation-summary.md:111`), the `TOP_MAP` overlap bug class (`implementation-summary.md:97`), and corrected number+slug sweeps (`checklist.md:70`, `implementation-summary.md:131`, `implementation-summary.md:139`). A repo-wide grep for these terms surfaced this packet and its review artifacts, not a generic reusable checklist, so
```

## Row 56 (ambiguous)
- Doc: `.skilled/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-002.md:11`
- Citation: `src/registry.ts:88`
- Candidates: `.skilled/skills/system-skill-advisor/runtime/lib/embedders/registry.ts`, `.skilled/skills/system-spec-kit/shared/embeddings/registry.ts`

```text

### P1 - Required
- **F003**: Missing null guard in registry merge - `src/registry.ts:88` - Correctness path dereferences prior state before checking the record exists.

### P2 - Suggestion
```
