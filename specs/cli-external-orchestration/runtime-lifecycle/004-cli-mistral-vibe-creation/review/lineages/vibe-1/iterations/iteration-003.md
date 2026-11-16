# Review Iteration 003

## Dispatcher

- Mode: review (fan-out lineage `vibe-1`)
- Session: `fanout-vibe-1-1794808672532-65xu0h`, generation 1, lineageMode `new`
- Executor: cli-mistral-vibe, model `deepseek-flash`
- Iteration: 3 of 5
- Dimension: traceability
- Operator review focus: every Vibe hook and plugin binding, its fail-open behaviour, wire-format and payload edge cases, ordering and kill-switch gaps, and parity against the OpenCode plugins. Only new or still-open issues; the 29 findings dispositioned in `023-vibe-review-remediation/implementation-summary.md` are excluded.

### How this iteration addressed the operator focus

The focus asks for parity against the OpenCode plugins and for the wire format to be checked rather than assumed. This iteration read `guards-and-hooks.md` as a claim set and tested each claim against the file it describes: the binding census at `:37`, the seven-type table at `:60-70`, the 21-row plugin classification at `:118-140`, and the reply table at `:203-212`. Two of those claims fail against `hooks.toml` and against the bundle's own replies, and one fixture statement fails against the shared tool-name seam. The parity half of the focus was checked row by row: every one of the 21 classification rows names a Vibe event that the bindings actually carry, and the two parity defects this lineage already holds (`R1-P2-004` for the OpenCode import, `R1-P2-005` for the `overlay-guard` match) remain the only ones. This iteration also corrects a citation error it made in iteration 2.

## Files Reviewed

- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:22-70,114-170,199-245` — the status paragraph, the seven-type table, the 21-row classification, the reply table and the run-pinned facts
- `.vibe/hooks.toml:1-150` — every binding re-read against the classification table's Vibe event column
- `.vibe/plugins/repo-guards/lib/hook-io.mjs:25-50` — `sessionDirFor`, `CORE_TOOL_NAMES`
- `.vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md:1-14` — the captured tool-name table and its closing note
- `.vibe/plugins/repo-guards/deep-loop-guard.mjs:28-40,95-110` — `SPAWN_TOOLS` and the `config_name` read
- `.vibe/plugins/repo-guards/mcp-route-guard.mjs:1-64` — `coreToolNameFor` and `main`
- `.vibe/plugins/repo-guards/post-edit-quality.mjs:30-40` — the `hook_specific_output` reply
- `.vibe/plugins/repo-guards/dist-freshness.mjs:105-118` — the `hook_specific_output` reply
- `.vibe/plugins/repo-guards/classifier-injection-screen.mjs:25-40` — the `hook_specific_output` reply
- `.vibe/plugins/repo-guards/spec-gate-classify.mjs:40-55` — the `hook_specific_output` reply
- `.vibe/plugins/repo-guards/session-cleanup.mjs:20-35` — the `hook_specific_output` reply
- `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:85-145` — the reply and the nested-context read
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:160-172` — the reply
- `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:75-86` — the reply
- `.skilled/hooks/goal/vibe/goal-vibe.test.mjs:100-130` — the asserted reply shape

Context evidence (read-only, not review targets): `.skilled/hooks/injection-contract.md:30,238`, `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/023-vibe-review-remediation/implementation-summary.md`, `.opencode/plugins/overlay-guard.js:80-125`, `.opencode/plugins/session-cleanup.js:112-375`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The reference calls all six `post_tool` bindings non-strict while one of them is declared strict, and the same document says a strict `post_tool` failure clears the tool result** -- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:37` -- The status paragraph reads "seven strict guards on `pre_tool`, six non-strict checks on `post_tool`". `hooks.toml:91` declares `post-edit-quality` `strict = true`. The document contradicts itself twice over: its own type table at `:65` says `post_tool` accepts `strict` and that a strict failure blanks the tool result, and its own classification row at `:127` gives `sk-code-post-edit-quality.js` the verdict `post_tool` (strict). The consequence is not cosmetic: `:214` states that a `post_tool` failure "clears `tool_output_text`", so an operator who reads `:37` and concludes no `post_tool` binding can blank a result will misdiagnose the one that can. The binding is right and the sentence is wrong.
   Finding class: stale-document-claim
   Scope proof: `:37` is the only sentence in the document that states the strictness of the `post_tool` set, and `hooks.toml:91` is the only `strict` line among the six `post_tool` entries.
   Affected surface hints: `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`, `.vibe/hooks.toml`, `.vibe/plugins/repo-guards/post-edit-quality.mjs`
   Case: a write or edit makes `post-edit-quality` fail. The strict binding clears `tool_output_text`, the model loses the write result, and the operator reading `:37` looks for a non-strict cause because the document says no `post_tool` binding is strict.

2. **The reply table names only `decision`/`reason` as a conforming object and calls every other shape a schema mismatch, while eight of the bundle's own hooks reply with `hook_specific_output.additional_context`** -- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:203-212` -- The table's second row gives `{"decision": "deny", "reason": "..."}` as the conforming object, and its third row classifies "anything else" as "Failure path: free-form text, broken JSON, a scalar, an array or a schema mismatch". Eight production hooks reply with a shape the table never lists: `post-edit-quality.mjs:36`, `dist-freshness.mjs:112`, `classifier-injection-screen.mjs:32`, `compaction-post-tool.mjs:79`, `session-cleanup.mjs:29`, `spec-gate-classify.mjs:47`, `session-start.mjs:142` and `turn-start.mjs:165`. The same document uses the field in prose at `:130`, `:131`, `:135`, `:155` and `:238`, so the table and the prose disagree. The live evidence is on the bundle's side: VIB-HK-016 passed with `post-edit-quality` returning `hook_specific_output.additional_context` and the tool output intact, and `goal-vibe.test.mjs:105,125` asserts the shape. The defect is the table's completeness, and its cost is that an operator debugging any of the eight hooks reads their reply as a failure path.
   Finding class: incomplete-reply-contract
   Scope proof: `:203-212` is the only reply table in the document, and the eight call sites above are the complete set of `hook_specific_output` emitters in the bundle.
   Affected surface hints: `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`, `.vibe/plugins/repo-guards/post-edit-quality.mjs`, `.vibe/plugins/repo-guards/dist-freshness.mjs`, `.vibe/plugins/repo-guards/classifier-injection-screen.mjs`, `.vibe/plugins/repo-guards/spec-gate-classify.mjs`, `.vibe/plugins/repo-guards/session-cleanup.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs`, `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`
   Case: a `post_tool` hook returns its advisory and the model does not see it. The operator reads the reply table, finds the hook's output classified as a schema mismatch, and looks for a malformed reply instead of the real cause.

3. **The shared tool-name seam keys `process_start` on the bare spelling only, while the fixture states every `tool_name` is qualified and one guard already hedges both spellings** -- `.vibe/plugins/repo-guards/lib/hook-io.mjs:33-39` -- `CORE_TOOL_NAMES` holds four qualified keys (`file_system.read_file`, `file_system.write_file`, `file_system.edit`, `file_system.bash`) and one bare key (`process_start`). `fixtures/wire-format/tool-names.md:5` states "`tool_name` is always the qualified name", and the same file's closing note at `:13` names `process_start` and `agents_spawn` without a namespace. `deep-loop-guard.mjs:32` already handles that ambiguity for the spawn tool by listing both spellings in `SPAWN_TOOLS` (`agents.spawn`, `agents_spawn`, `subagent.spawn`, `agent_spawn`), so the bundle knows the spelling is not settled and only the shared seam does not hedge. This is a different field from `R1-P1-001`: that finding is about which key `tool_input` carries, this one is about the `tool_name` the map is keyed on. If `process_start` arrives qualified, the map misses and `toCoreCall` falls through to the unmapped branch, which is the same fail-open outcome by a second route.
   Finding class: unhedged-name-mapping
   Scope proof: `hook-io.mjs:33-39` is the only tool-name map in the bundle, and `deep-loop-guard.mjs:32` is the only other place a Vibe tool name is matched against a set.
   Affected surface hints: `.vibe/plugins/repo-guards/lib/hook-io.mjs`, `.vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md`, `.vibe/plugins/repo-guards/deep-loop-guard.mjs`
   Case: a background command arrives with a qualified `tool_name` such as `process.process_start`. `CORE_TOOL_NAMES.get` returns `undefined`, the core call is built from an unmapped name, and the shell guards take their allow branch exactly as they would if `tool_input.command` were missing.

## Traceability Checks

- **`spec_code` — pass, with the census mismatch now raised.** The 18-binding census at `guards-and-hooks.md:37` matches `hooks.toml` on every count: 2 `pre_agent` (`:7`, `:15`), 7 strict `pre_tool` (`:33`, `:41`, `:49`, `:57`, `:65`, `:72`, `:80`), 6 `post_tool` (`:88`, `:98`, `:107`, `:115`, `:124`, `:132`), 1 `post_agent` (`:25`), 1 `session_start` (`:141`), 1 `session_end` (`:147`). The strictness adjective on the `post_tool` set is wrong and is raised as finding 1.
- **`spec_code` — the 21-row classification checked against the bindings.** Every row's Vibe event column names a binding that exists: `system-spec-gate.js` → `pre_agent` + strict `pre_tool`; `cli-dispatch-audit.js`, `env-secret-guard.js`, `overlay-guard.js`, `mcp-route-guard.js`, `sk-git-message-gate.js`, `system-deep-loop-guard.js` → strict `pre_tool`; `sk-code-post-edit-quality.js` → `post_tool` (strict); `opencode-goal.js` → `session_start`; `session-cleanup.js` → `session_start` + `session_end`; `system-dist-freshness-guard.js` → `session_start` + `post_tool`; `system-skill-advisor.js` → `pre_agent`; `ask-surface-guard.js` → `post_agent`; `system-completion-sentinel.js` → `post_agent` + `pre_agent`; `session-handover.js` → `pre_agent` + `post_tool` + `post_agent`; `classifier-injection-screen.js` → `post_tool`; `decision-capture.js` → `post_tool` + `pre_agent`. The three `not needed` rows name no binding, which is correct.
- **`spec_code` — the fixture's tool-name table against `CORE_TOOL_NAMES`.** Four of the five captured names map exactly (`tool-names.md:9-12` against `hook-io.mjs:34-37`). The fifth, `process_start`, is bare in both the fixture note and the map, and the fixture's own opening sentence says names are always qualified. Raised as finding 3.
- **`checklist_evidence` — notApplicable.** The declared target is a file set, not a spec folder with a checklist; the disposition table in `023-vibe-review-remediation/implementation-summary.md` is an exclusion list, not a checklist to verify.
- **`skill_agent` (overlay) — pass.** The document's own claim that the turn-start composer routes the advisor under the `vibe` label (`:131`) is carried by `turn-start.mjs` and `prompt-advisor.mjs`, and the `session_start` goal bridge claim (`:155`) is carried by `session-start.mjs`. No mismatch.
- **`agent_cross_runtime` (overlay) — pass, with the two known parity defects unchanged.** Checked each Vibe adapter against its OpenCode counterpart for a dropped behaviour. `overlay-guard` and `session-cleanup` remain the only two, already recorded as `R1-P2-005` and `R1-P2-004`. The remaining differences are the documented intentional ones: `mcp-route-guard` refuses where the plugin logged, `classifier-injection-screen` appends where the plugin buffered, and `ask-surface-guard` reads the journal where the plugin read the turn object.
- **`feature_catalog_code` (overlay) — notApplicable.** No feature catalogue covers this file set.
- **`playbook_capability` (overlay) — notApplicable for this iteration.** The playbook's hook-scenario verdict table is the live-verdict surface, and this iteration read no scenario file. It is carried to the residual sweep.
- **Self-correction.** Iteration 2's `spec_code` check cited `hooks.toml:93` for the `post-edit-quality` strictness. The correct line is `hooks.toml:91`; `:93` is the `command` line. The iteration 2 artifact is left as written and the correction is recorded here rather than by rewriting a durable artifact.

## Integration Evidence

- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` — the reference under test, read as a claim set against the files it describes.
- `.vibe/hooks.toml` — the binding table every census and classification claim resolves to.
- `.vibe/plugins/repo-guards/lib/hook-io.mjs` — the shared seam `CORE_TOOL_NAMES` lives in, and the only tool-name map in the bundle.
- `.vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md` — the captured-name fixture that contradicts the map's bare key.
- `.vibe/plugins/repo-guards/deep-loop-guard.mjs` — the one guard that hedges both spellings, and the counterexample for finding 3.
- `.skilled/hooks/goal/vibe/goal-vibe.test.mjs` — the test that asserts the `hook_specific_output.additional_context` shape, and the bundle's own evidence for finding 2.

## Edge Cases

- **Finding 1 is a document defect, not a binding defect.** The binding is correct and the sentence is stale. Severity stays P2 because the runtime behaviour is right and only the operator's reading is wrong, but the consequence named in the case is a real misdiagnosis path.
- **Finding 2 could be read as a runtime defect instead.** It is not: VIB-HK-016's live pass and `goal-vibe.test.mjs:105,125` both show the field working. The finding is scoped to the table's completeness, and the `downgradeTrigger` records what would close it.
- **Finding 3 overlaps `R1-P1-001` in outcome but not in cause.** Both end in a shell guard's allow branch; one is about the `tool_input` key, the other about the `tool_name` the map is keyed on. They are recorded separately so a fix to one does not read as a fix to both.
- **`mcp-route-guard`'s missing `match` is correct, not a gap.** `hooks.toml:65-69` declares no `match`, so the hook fires on every tool call. `mcp-route-guard.mjs:53-54` returns allow for any name that is not `mcp_<server>.<tool>`, and Vibe's MCP tool names are dynamic, so a static selector could not enumerate them. Recorded as confirmed-clean rather than as a finding.
- **The `post_tool` payload shape remains documented rather than observed.** `guards-and-hooks.md:196` states that only the `pre_tool` and `post_agent` payloads were captured. Every claim in this iteration about a `post_tool` field cites the document, not a capture, and finding 2 is about the document's own inconsistency rather than about the runtime.

## Confirmed-Clean Surfaces

- `.vibe/plugins/repo-guards/mcp-route-guard.mjs:53-54` — allows any non-MCP tool name before the core runs, so the missing `match` costs a process spawn and nothing else.
- `.vibe/plugins/repo-guards/deep-loop-guard.mjs:32` — `SPAWN_TOOLS` lists four spellings, so the spawn guard is immune to the naming ambiguity that finding 3 raises for the shared seam.
- `.vibe/plugins/repo-guards/deep-loop-guard.mjs:99-105` — reads `payload.tool_input` defensively and takes `config_name` through `firstNonBlankString`, matching the classification row's claim at `:124`.
- `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:90` — reads a nested part's `hook_specific_output.additional_context` through optional chaining, so a part that returns nothing cannot break the composer.
- `.vibe/plugins/repo-guards/render-home-hooks.cjs:93` — substitutes the top-level expression with the resolved root, so every rendered `command` is anchored by absolute path as `guards-and-hooks.md:37` claims.
- `.vibe/hooks.toml:7-150` — the census, the strict set and the per-type counts all match the reference except for the one adjective raised as finding 1.

## Ruled Out

- **`mcp-route-guard`'s missing `match` as a dead or over-broad binding.** Ruled out: `mcp-route-guard.mjs:53-54` filters to `mcp_<server>.<tool>` names before the core runs, and Vibe's MCP tool names are dynamic so no static selector could express them.
- **`deep-loop-guard` reading a `tool_input` key the payload does not carry.** Ruled out: `deep-loop-guard.mjs:99-105` reads `config_name` from `tool_input`, which is the key the classification row at `:124` names, and the guard reads it defensively.
- **The classification table's `not needed` rows as missing ports.** Ruled out: `codex-hooks-watchdog.js`, `sk-git-preflight-advisory.js` and `system-speckit-completion.js` each name a reason that holds for Vibe, and none of them names a binding that should exist.
- **`env-secret-guard.js`'s "registers three value-free dotenv inspection tools" as a Vibe claim.** Ruled out: the "What it does" column describes the OpenCode plugin, and the verdict column lands it on `pre_tool` alone. The tool registration is not claimed for Vibe.
- **`session_start`'s `system_message` as an undocumented field.** Ruled out: `:238` documents it for `session_start` explicitly. The undocumented use is `spec-gate.mjs:76` on a strict `pre_tool` hook, already recorded as `R1-P2-001`.
- **A parity gap in `classifier-injection-screen` or `ask-surface-guard`.** Ruled out: both differences are documented as intentional at `:135` and `:133`, and neither drops a behaviour the OpenCode plugin has.

## Next Focus

- Dimension: maintainability
- Focus area: the shape of the bundle as a codebase — the duplicated reply-writing and payload-reading boilerplate across the 13 repo-guards scripts, the `runGuard`/`allow`/`deny` seam's consistency, the comment-to-code ratio in the adapters, and the test coverage each adapter carries.
- Reason: iterations 1 to 3 covered the payload seam, the trust boundaries and the documents. The remaining dimension is whether the bundle is safe to change, and the eight near-identical `hook_specific_output` writes found this iteration are the first concrete instance.
- Rotation status: correctness complete, security complete, traceability complete, maintainability next.
- Blocked/productive carry-forward: productive — reading the reference as a claim set rather than as background produced three findings and one self-correction in one pass.
- Required evidence: the exact duplicated block with both file:line pairs, and the test file that covers or fails to cover each adapter.

Review verdict: CONDITIONAL
