# Fix Design - mk-skill-advisor (reconciled)

> Two independent, code-verified fix designs per finding: **GPT-5.6-Sol (high)** and **Opus 4.8 (high)**, each re-read the real code. **AGREE** = both designed a fix (high confidence). **DISPUTED** = one model judges the finding a non-issue - your call before implementing.

## Summary

17 findings - 16 both-agree, 1 disputed.

## Cross-model notes

- **GPT-5.6-Sol:** Ordering dependencies: establish F11's shared deadline and termination helper first; use it in F3, F5, F9, F10, and O3. Implement F8 before F6 so successful OpenCode briefs retain canonical hygiene and governor context when hygiene-only failure injection is removed. Implement F1 before final cache-race work, then apply F9 and O4 around the revised cache path. F4, F5, O3, and F10 should be one cohesive Claude shim/entrypoint hardening pass. F2 and F7 share the CLI request-envelope change and should land together. O5 is the only finding judged a non-issue on current evidence; its deletion resolver already covers all cache-write shapes plus the standard OpenCode event shape.
- **Opus 4.8:** Shared root causes / clusters: (1) Legacy spec-kit shim — F4 (CWD-relative target), F5 (no timeout/no error surfacing), O3 (readFileSync(0) EAGAIN crash), plus F10's flush-before-exit parity — are ONE rewrite of user-prompt-submit.ts (system-spec-kit shim): absolute repo-root-resolved target, bounded spawnSync timeout+SIGKILL, EAGAIN-resilient stdin read, whole-body try/catch → '{}' fail-open, and write-callback-before-exit(0). (2) OpenCode plugin session/cache region — F9 (epoch guard + clear inFlight), O4 (completedAt expiry), O5 (unified session-id resolver) all touch getAdvisorContext's insert block and the session.deleted handler; apply together to avoid churn. (3) Fallback-policy divergence — F6 (both surfaces emit hygiene+governor on no-brief) and O1 (OpenCode catch pushes that same fallback) share a single exported renderAdvisorFallbackDirective(); F6 is a genuine policy decision (always-on directives vs. both-silent) worth explicit user confirmation. (4) Fork/parity drift — F8 (bridge local renderer omits GOVERNOR vs canonical render.ts) and F7 (Claude cli-fallback drops thresholds while the OpenCode bridge already forwards them) are the same class: the bridge was fixed, the twin was not; fix the twins to converge. (5) Fail-open completeness — F3 (stderr deadlock + unbounded stdout), O1, O3, F5, F10 are all 'the safety net has a hole'. No findings judged non-issues; all 17 confirmed against source. F11 is the softest — a UX/consistency judgment (budget divergence) rather than a hard defect; its concrete win is folding the SIGKILL grace inside the budget, while converging the default value needs user confirmation (3s risks bridge cold-start fail-opens; 5s recommended). Cross-runtime constant duplication of HYGIENE/GOVERNOR text now lives in render.ts, bridge.mjs:308, and plugin:42 — F6/F8 reduce but do not eliminate this; a follow-up to single-source the directive text would prevent future drift.

## Per-finding fix designs

### F1 [P1 (GPT P1 / Opus P2)] OpenCode can serve obsolete recommendations after skill-graph changes
`.opencode/plugins/mk-skill-advisor.js:48` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. mk-skill-advisor.js:48-53 ADVISOR_SOURCE_PATHS covers only advisor CODE (bridge, launcher, server .ts/.js). advisorSourceSignature() (105-122) hashes mtime/size of those, and the signature is folded into the cache key (cacheKeyForPrompt:218). The recommendation DATA — the graph DB skill-graph.sqlite in mcp_server/database/ — is NOT in the signature, so a rebuild/skill_graph_scan that regenerates the DB leaves the host advisorCache serving stale briefs on the hit path (550-554) for up to cacheTTLMs (5 min) without re-invoking the bridge.
- Fix approach: Add the advisor graph DB file to the freshness signature so any graph regeneration changes the cache key. Do NOT remove the host cache (it saves a per-prompt node subprocess spawn) and do NOT try to fold the bridge-returned generation into the key (the key must be computable before the bridge runs).
- Exact change: Resolve the DB dir with the advisor's own env precedence (MK_SKILL_ADVISOR_DB_DIR ?? SYSTEM_SKILL_ADVISOR_DB_DIR ?? default '<plugin>/../skills/system-skill-advisor/mcp_server/database') and append join(dbDir,'skill-graph.sqlite') to ADVISOR_SOURCE_PATHS. advisorSourceSignature already stat-tolerates missing files. Use the main .sqlite (regenerated on rebuild → mtime+size change); avoid the -wal file (constant churn would over-invalidate the cache).
- Acceptance: Warm a cache entry; rewrite/regenerate skill-graph.sqlite; next getAdvisorContext for the same prompt recomputes the key (signature changed) → cache miss → bridge re-invoked. Editing an unrelated file does not miss.
- Side effects / parity: OpenCode-only. Claude hook calls buildSkillAdvisorBrief fresh per prompt (no host cache) so it already reflects graph changes — no parity change. Keep env-precedence identical to cli-fallback findCliFallbackPaths (176-182).
- Test: Unit: stub advisorSourceSignature inputs (or use sourceSignatureOverride harness) to assert the cache key differs when the DB file's stat changes but source files don't.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. `.opencode/plugins/mk-skill-advisor.js:48-53` fingerprints only implementation files, and `advisorSourceSignature()` at :105-121 never includes skill metadata or graph artifacts. The completed-response cache is returned before bridge execution at :547-555. By contrast, the canonical freshness signature covers every top-level `SKILL.md`, `graph-metadata.json`, SQLite graph, and JSON artifact at `mcp_server/lib/freshness.ts:148-206`.
- Fix approach: Keep in-flight deduplication, but key completed host-cache entries with a composite of the existing implementation signature and the canonical advisor source signature. If the canonical fingerprint cannot be loaded or computed, bypass completed-cache reads and writes rather than risk serving stale guidance.
- Exact change: In `mk-skill-advisor.js`, resolve and lazily import the compiled canonical freshness module, call `computeAdvisorSourceSignature(workspaceRoot)` before cache lookup, and combine its result with `advisorSourceSignature()`. Add the compiled freshness module to the implementation watch paths. Replace the current source-signature override test seam with a callable fingerprint dependency so a single plugin instance can observe signature changes. Do not duplicate the canonical recursive fingerprint algorithm in the plugin.
- Acceptance: Changing a skill `SKILL.md`, its `graph-metadata.json`, `skill-graph.sqlite`, or the graph generation source signature causes the next identical prompt in the same session and plugin instance to invoke the bridge instead of returning the old host-cache value. An unavailable fingerprint also causes a bridge invocation.
- Side effects / parity: Update the OpenCode plugin only; Claude already reaches `getAdvisorFreshness()` and the source-signature-aware prompt cache at `skill-advisor-brief.ts:429-478`. The source and compiled advisor distributions must continue exporting `computeAdvisorSourceSignature`.
- Test: Extend `mcp_server/tests/mk-skill-advisor-plugin.vitest.ts` with a mutable canonical-signature mock: return `sig-a`, populate and hit the cache, switch to `sig-b` within the same plugin instance, and assert a second spawn. Add cases for fingerprint failure and metadata/database signature changes.

---

### F2 [P1 (GPT P1 / Opus P2)] Claude CLI fallback passes an unbounded prompt through argv
`.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:263` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: CONFIRMED. cli-fallback.ts runCliRecommend (263-290) embeds the full prompt in payload JSON passed as the --json argv value; Claude entry normalizePrompt (76-81) applies no byte cap and user-prompt-submit.ts:169-190 forwards the raw prompt. OpenCode clamps to DEFAULT_MAX_PROMPT_BYTES=64KB via clampPrompt before stdin (bridgePayloadJson:358-372). A multi-hundred-KB prompt risks E2BIG on the CLI spawn.
- Fix approach: Apply one shared UTF-8 byte clamp at the Claude hook boundary (matching OpenCode's 64KB), so BOTH the primary buildSkillAdvisorBrief subprocess and the argv CLI fallback see a bounded prompt. Do NOT re-architect the CLI to stdin — skill-advisor.cjs consumes --json from argv and the child stdin is 'ignore'; switching transport is a larger, riskier change and the clamp already removes the E2BIG risk.
- Exact change: Add a byte-safe truncation helper in mcp_server/lib (binary-search prefix like the plugin's clampPrompt) plus a shared MAX_PROMPT_BYTES constant (64*1024). In user-prompt-submit.ts, clamp `prompt` immediately after normalizePrompt (line ~169) before passing to buildBrief and the CLI fallback. Optionally clamp defensively inside cli-fallback runCliRecommend too.
- Acceptance: Feed a 500KB prompt to the Claude hook; the spawned CLI arg stays ≤64KB and the hook returns without ENAMETOOLONG/E2BIG; recommendation still produced for normal prompts.
- Side effects / parity: Parity: mirrors OpenCode's existing clamp. The OpenCode bridge's own runCliRecommend argv (bridge.mjs:685) is already bounded because the plugin clamps upstream — add a defensive clamp there only if desired. Semantic: truncating >64KB prompts is acceptable (advisor keys on keywords; OpenCode already does this).
- Test: Unit: buildSkillAdvisorBriefFromCli with an oversized prompt asserts the spawned argv byte length is capped (spy on spawn args).

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. `hooks/lib/skill-advisor-cli-fallback.ts:263-290` serializes the complete prompt into the `--json` argv value. The Claude entrypoint accepts and forwards any prompt string at `hooks/claude/user-prompt-submit.ts:169-200`, while the OpenCode plugin bounds its bridge input at `mk-skill-advisor.js:309-324,358-371`.
- Fix approach: Transport the CLI request over stdin and enforce one UTF-8 byte-clamping policy before either runtime analyzes, hashes, or forwards the prompt. Bound the serialized stdin request as defense in depth.
- Exact change: Add a stdin-JSON mode to `mcp_server/skill-advisor-cli.ts`, mutually exclusive with `--json`, and let `.opencode/bin/skill-advisor.cjs` continue inheriting stdin. In `runCliRecommend`, remove the JSON argv value, open child stdin, pass the new stdin flag, and end stdin with the bounded payload. Add a shared prompt-size policy with the same default and environment override used by OpenCode; clamp once in the Claude handler before both `buildBrief` and `buildCliBrief`, and use the clamped prompt for OpenCode cache keys and bridge input as well.
- Acceptance: A multi-megabyte Unicode prompt never appears in child argv, both runtimes pass a valid UTF-8 prefix within the configured byte limit, serialized CLI input is bounded, and the hook still returns fail-open output if stdin writing fails.
- Side effects / parity: Update `skill-advisor-cli.ts`, its compiled dist, `.opencode/bin/skill-advisor.cjs` transport tests, the Claude fallback helper, and the OpenCode plugin size-policy tests. Preserve `--json` for existing external CLI callers.
- Test: Add CLI parser tests for stdin JSON, mutual exclusion, malformed or oversized stdin, and unchanged `--json` compatibility. Add Claude fallback tests with ASCII, multibyte Unicode, and control-character-heavy prompts, asserting no prompt-bearing argv and byte parity with the OpenCode policy.

---

### F3 [P1 (GPT P1 / Opus P2)] Bridge output handling permits memory growth and stderr pipe deadlock
`.opencode/plugins/mk-skill-advisor.js:455` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. runBridge (mk-skill-advisor.js:450-529) spawns with stdio ['pipe','pipe','pipe'] (458) but installs NO child.stderr consumer, so if the bridge writes >~64KB to stderr (withStdoutSilenced forwards console.* to stderr in the .mjs; error stacks) the OS pipe fills and the bridge blocks until SIGTERM. stdout is accumulated into an unbounded string (479-481); maxBriefChars is applied only post-parse.
- Fix approach: Remove the stderr pipe the plugin never reads, and bound stdout accumulation. This matches the capping pattern already used in the bridge (MAX_CLI_STDERR_BYTES) and cli-fallback (capStdout).
- Exact change: (1) Change spawn stdio to ['pipe','pipe','ignore'] so the bridge's stderr goes to /dev/null and can never deadlock. (2) Add MAX_BRIDGE_STDOUT_BYTES (e.g. 256KB) and in the stdout 'data' handler stop appending past the cap; on overflow, kill the child (SIGKILL), clear timers, and resolve fail_open with error 'STDOUT_OVERFLOW'.
- Acceptance: Simulate a bridge that emits >64KB stderr → hook returns within bridgeTimeoutMs, no hang. Simulate >256KB stdout → fail_open with STDOUT_OVERFLOW, child terminated.
- Side effects / parity: Plugin never surfaces bridge stderr, so 'ignore' loses nothing. OpenCode-only. The Claude primary subprocess path lives in buildSkillAdvisorBrief (out of scope here) — worth a follow-up check for the same drain discipline.
- Test: Unit with a fake node script that floods stderr then stdout; assert no deadlock and the overflow error code.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. `mk-skill-advisor.js:455-481` creates piped stdout and stderr, accumulates stdout without a raw limit, and never subscribes to stderr. The later brief clamp at :672-675 cannot constrain subprocess output already retained in memory.
- Fix approach: Bound raw stdout by UTF-8 bytes, continuously drain stderr into a small capped diagnostic buffer or discard it, and terminate plus fail open immediately when the stdout envelope exceeds its limit.
- Exact change: Add fixed prompt-safe raw stdout and stderr byte caps near the plugin constants. Accumulate stdout as bounded buffers or byte-counted chunks. Subscribe to `child.stderr` and retain at most the diagnostic cap without exposing its content. On stdout overflow, set `BRIDGE_OUTPUT_LIMIT`, stop retaining chunks, terminate the child using the shared bounded termination path, and resolve a fail-open response exactly once. Record only the error code and byte counts in status, never captured output.
- Acceptance: A child emitting unlimited stdout cannot grow plugin memory beyond the configured cap and is terminated with `last_error_code=BRIDGE_OUTPUT_LIMIT`. A child filling stderr cannot block. Normal JSON below the limit still parses, and no stdout or stderr content reaches the TUI or status tool.
- Side effects / parity: OpenCode plugin only. Coordinate child tracking and termination with F9 and include termination grace within F11's total budget.
- Test: Extend `mk-skill-advisor-plugin.vitest.ts` with chunked oversized stdout, stderr larger than the pipe capacity, simultaneous stdout/stderr, and late close events. Assert one settlement, bounded retention, child termination, fail-open behavior, and prompt-safe status.

---

### F4 [P1 (GPT P1 / Opus P2)] Legacy Claude shim resolves its target from mutable process CWD
`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:11` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: CONFIRMED. spec-kit shim user-prompt-submit.ts:11 TARGET is a repo-relative path; spawnSync runs it with the script arg resolved against cwd: process.cwd() (13-14). If Claude invokes the hook from any directory other than repo root, the target .js is not found → result.error → silent '{}'. OpenCode's bridge uses an import.meta.url-absolute BRIDGE_PATH; the shim does not.
- Fix approach: Resolve the target to an absolute path independent of CWD. Because the shim is a compiled .js whose dist depth differs from source and the target lives in a SIBLING skill tree, prefer a deterministic repo-root walk (find the ancestor containing .opencode) over a fragile relative import.meta.url computation.
- Exact change: From fileURLToPath(import.meta.url), walk parents until a dir containing '.opencode' is found (bounded ~14 levels, like cli-fallback findCliFallbackPaths); set TARGET = join(repoRoot, '.opencode/skills/system-skill-advisor/mcp_server/dist/hooks/claude/user-prompt-submit.js'). Child cwd may remain process.cwd() (the inner hook derives workspaceRoot from input.cwd, not process.cwd).
- Acceptance: Invoke the shim with process.cwd() set to a nested subdir; the advisor target still resolves and runs (non-empty JSON when advisor live), instead of silent '{}'.
- Side effects / parity: Combine with F5 and O3 into one shim rewrite. Brings the shim into parity with the OpenCode plugin's absolute-path resolution. If a repo-root marker is absent, fall back to '{}' fail-open (O3's guard).
- Test: Unit/integration: run shim from a subdirectory and assert the resolved TARGET is absolute and exists.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. The legacy shim declares a workspace-relative target at `system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:11` and executes it with `cwd: process.cwd()` at :13-18. Invoking the hook outside the repository root therefore resolves the wrong target.
- Fix approach: Resolve the installed target from the shim module's own URL while preserving the caller workspace as the child's working directory.
- Exact change: Import `fileURLToPath` and replace `TARGET` with an absolute `fileURLToPath(new URL('../../../../system-skill-advisor/mcp_server/dist/hooks/claude/user-prompt-submit.js', import.meta.url))`. Keep `cwd` as the caller's workspace because advisor workspace discovery depends on it.
- Acceptance: The shim launches the same compiled advisor hook when invoked from the repository root, a nested directory, and an unrelated current directory.
- Side effects / parity: Update the TypeScript source and rebuilt spec-kit hook dist. No OpenCode plugin change is needed because `BRIDGE_PATH` already uses `import.meta.url` at `mk-skill-advisor.js:43`.
- Test: Add a shim integration test that invokes the compiled shim from a temporary non-root cwd and verifies the target is reached and valid JSON is returned.

---

### F5 [P1 (GPT P1 / Opus P2)] Legacy Claude shim has no child timeout and hides launch failures
`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. spec-kit shim spawnSync (13-18) passes no `timeout`, so a hung target blocks Claude's UserPromptSubmit indefinitely. result.error/nonzero/empty/invalid-JSON all collapse to '{}' (21-30) and result.error is never surfaced anywhere, hiding launch failures.
- Fix approach: Bound the child with a timeout that comfortably exceeds the inner hook's own budget, and emit a prompt-safe diagnostic on launch failure while preserving '{}' fail-open.
- Exact change: Add to spawnSync opts: `timeout: <innerBudget + margin>` and `killSignal: 'SIGKILL'`. Derive the budget from SPECKIT_CLAUDE_HOOK_TIMEOUT_MS (inner default 3000) plus a spawn margin (e.g. +2000 → 5000ms), configurable. On result.error or result.signal (timeout kill), write a single bounded line to STDERR (never stdout). Keep output '{}' and exit 0.
- Acceptance: Point TARGET at a sleeping script → shim returns '{}' within ~5s (not hang). Point at a nonexistent target → stderr diagnostic emitted, stdout still '{}'.
- Side effects / parity: Same shim rewrite as F4/O3/F10. Budget must be ≥ inner buildBrief(3s)+CLI-fallback(within 3s)+node startup, else it kills a still-working inner hook — relates to F11's budget-consistency theme; keep the shim's timeout strictly larger than the inner total.
- Test: Unit: fake target that sleeps > timeout asserts result.signal handling and '{}' output; fake missing target asserts stderr diagnostic.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. `spawnSync` has no timeout at `system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13-18`. At :21-30, launch errors, timeout-like failures, nonzero status, empty stdout, and invalid JSON all collapse to `{}` without a shim-generated diagnostic.
- Fix approach: Apply the shared end-to-end hook deadline to the child process and emit fixed, prompt-safe diagnostic codes while retaining `{}` as the fail-open stdout contract.
- Exact change: Refactor the shim around one guarded main function. Pass a bounded `timeout`, `maxBuffer`, absolute target, and a child producer budget smaller than the outer deadline. Classify `result.error`, timeout, signal, nonzero status, empty output, and invalid JSON into fixed codes such as `SHIM_TIMEOUT`, `SHIM_SPAWN_ERROR`, `SHIM_NONZERO_EXIT`, `SHIM_EMPTY_OUTPUT`, and `SHIM_INVALID_OUTPUT`. Emit only a compact code record to stderr; do not include raw error messages, argv, prompt, or unbounded child output. Always write one valid JSON object to stdout.
- Acceptance: A hung child returns `{}` within the configured total budget. Every failure class has a distinct prompt-safe stderr code, valid child output is preserved, and the shim exits successfully without leaking prompt content.
- Side effects / parity: Implement together with F4, O3, and F11 in the legacy Claude shim. Rebuild the spec-kit hook dist and verify `.claude/settings.json` still targets the compatibility path.
- Test: Add shim subprocess tests for missing target, timeout, signal/nonzero exit, empty stdout, malformed JSON, oversized output, and valid output. Assert bounded duration, exactly one JSON stdout line, and fixed diagnostic codes.

---

### F6 [P1 (GPT P1 / Opus P2)] OpenCode injects context on skip or failure while Claude fails open silently
`.opencode/plugins/mk-skill-advisor.js:672` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: med
- Root cause: CONFIRMED policy divergence. OpenCode appendAdvisorBrief (672-676) pushes HYGIENE_DIRECTIVE on every no-brief case (skipped/degraded/timeout/parse-fail). Claude (user-prompt-submit.ts:222-224) returns {} (nothing) when renderBrief is null. render.ts comments state HYGIENE (53) and GOVERNOR (59) are intended to reach every runtime every turn — so the correct unified policy is always-on directives, but the two surfaces currently disagree AND OpenCode's fallback omits GOVERNOR (only in-brief).
- Fix approach: Define the fallback directive once and emit it from BOTH surfaces whenever the advisor is active but produced no brief: HYGIENE + GOVERNOR. This honors the documented every-turn intent and makes the surfaces identical.
- Exact change: In render.ts export a `renderAdvisorFallbackDirective()` = (HYGIENE_DIRECTIVE + GOVERNOR_DIRECTIVE). Claude: replace `if (!brief) return {}` with additionalContext = brief ?? renderAdvisorFallbackDirective() (keep the disabled-hook early {} at 145-154 unchanged). OpenCode: at :675 push a combined HYGIENE+GOVERNOR constant (add a GOVERNOR constant to the plugin mirroring render.ts, since the plugin can't import the TS module) instead of HYGIENE-only.
- Acceptance: On a no-recommendation prompt, both Claude and OpenCode inject the identical hygiene+governor text; when the hook is disabled, both inject nothing.
- Side effects / parity: This is a policy decision — surface it to the user (always-on directives vs. both-silent). Cross-surface: three copies of the directive text (render.ts, bridge.mjs:308, plugin:42) must stay in sync; note the drift risk. The bridge already embeds HYGIENE+GOVERNOR inside live briefs via canonical render (see F8).
- Test: Update Claude hook test to assert non-empty additionalContext on null brief; add OpenCode test asserting the combined directive is pushed on skipped status.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `mk-skill-advisor.js:666-676` appends `HYGIENE_DIRECTIVE` whenever the bridge has no brief, regardless of status. Claude uses the canonical renderer and returns `{}` when it returns null at `hooks/claude/user-prompt-submit.ts:210-224`. The canonical renderer intentionally returns null for every non-ok or unavailable result at `mcp_server/lib/render.ts:153-162`.
- Fix approach: Adopt the canonical silent fail-open policy: inject context only when the shared renderer produced a nonempty brief. Successful briefs already contain hygiene and governor directives.
- Exact change: Remove the plugin's `else` branch that pushes standalone hygiene context and remove the now-unused local `HYGIENE_DIRECTIVE` constant. For skipped, degraded, timeout, parse failure, disabled, and unexpected exceptions, update prompt-safe status only and append nothing.
- Acceptance: Equivalent ok, skipped, degraded, fail-open, timeout, parse-failure, and disabled fixtures produce the same presence or absence of model context in OpenCode and Claude. Only ok renderable recommendations inject context.
- Side effects / parity: Update OpenCode tests currently expecting hygiene-only output at `mk-skill-advisor-plugin.vitest.ts:158-167,313-395`. Claude behavior remains unchanged. F8 must ensure successful OpenCode briefs still receive both canonical directives.
- Test: Add or extend runtime-parity table tests covering all statuses and assert byte-identical successful context plus no context for every non-ok status.

---

### F7 [P2] Claude CLI fallback discards caller-supplied thresholds
`.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:263` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. cli-fallback.ts runCliRecommend payload (263-270) sends only topK/includeAttribution/includeAbstainReasons — no confidence/uncertainty thresholds. thresholdsFrom (351-359) then reads the CLI's echoed effectiveThresholds (which reflect the CLI scorer's OWN defaults) before falling back to options.thresholdConfig, so caller thresholds never reach the scorer. The OpenCode bridge's runCliRecommend (bridge.mjs:666-674) already threads both thresholds — the Claude fallback is the un-fixed twin.
- Fix approach: Mirror the bridge: forward confidenceThreshold and uncertaintyThreshold into the CLI payload options, derived from options.thresholdConfig with the same defaults thresholdsFrom uses (0.8 / 0.35).
- Exact change: In runCliRecommend, add to payload.options: confidenceThreshold: args.options.thresholdConfig?.confidenceThreshold ?? 0.8, uncertaintyThreshold: args.options.thresholdConfig?.uncertaintyThreshold ?? 0.35. runCliRecommend already receives args.options (SkillAdvisorCliFallbackOptions with thresholdConfig).
- Acceptance: Call buildSkillAdvisorBriefFromCli with a non-default thresholdConfig; assert the spawned --json payload carries those thresholds and the scorer applies them (recommendation filtered accordingly).
- Side effects / parity: Parity with bridge.mjs (already correct). Note: the Claude entrypoint (user-prompt-submit.ts:194-200) does not currently pass thresholdConfig, so the effect is latent until a caller supplies one — threading thresholds from the entry is a separate optional follow-up, not required for this fix.
- Test: Unit asserting non-default thresholds appear in the CLI argv payload (currently they do not).

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed for the Claude fallback helper. `SkillAdvisorCliFallbackOptions` accepts `thresholdConfig` at `hooks/lib/skill-advisor-cli-fallback.ts:68-74`, but the request at :263-270 omits thresholds. `thresholdsFrom()` at :351-359 then trusts CLI effective defaults over the caller values. The separate OpenCode bridge CLI path already sends confidence and uncertainty thresholds at `plugin_bridges/mk-skill-advisor-bridge.mjs:661-675`.
- Fix approach: Normalize the caller's confidence and uncertainty thresholds once, send them to the CLI scorer, and reuse those normalized values when reconstructing and filtering the result.
- Exact change: Add a local canonical threshold-normalization helper using the same defaults and 0..1 clamp as the advisor contract. Include `confidenceThreshold` and `uncertaintyThreshold` in the CLI request options. If `confidenceOnly` is supported by the caller contract but not the CLI schema, translate it explicitly to an uncertainty ceiling of 1 rather than silently dropping it. Validate returned `effectiveThresholds`; do not let malformed values override the requested normalized values.
- Acceptance: A recommendation that passes CLI defaults but fails caller thresholds is absent, and one that passes caller thresholds is retained. Request payload, returned effective thresholds, and local filtering agree.
- Side effects / parity: Claude fallback helper and CLI fallback tests require changes. Keep the already-correct OpenCode bridge payload behavior aligned and add a parity assertion to prevent either path from drifting.
- Test: Add `mcp_server/tests/hooks/skill-advisor-cli-fallback.vitest.ts` cases using non-default 0.93 confidence and 0.12 uncertainty thresholds, boundary values, malformed values, and confidence-only behavior. Assert the stdin payload and filtered recommendation set.

---

### F8 [P2] OpenCode uses a forked renderer that omits shared governor context
`.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:324` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. The bridge defines a local renderAdvisorBrief (bridge.mjs:324-360) that appends only HYGIENE_DIRECTIVE (354,359). loadNativeAdvisorModules returns that LOCAL renderer (430) even on the compat-loaded path, and buildCliBrief calls the local one directly (786). The canonical render.ts:renderAdvisorBrief (197-200) appends HYGIENE + GOVERNOR, and compat/index.js re-exports it. So OpenCode live briefs omit the fable-5 governor that Claude briefs (which import render.ts:17) include — a fork drift.
- Fix approach: Route both bridge render call sites through the canonical compiled renderer, keeping the local implementation only as a fail-open fallback when the compiled module can't be imported.
- Exact change: Add a cached loader (dynamic import of '../dist/mcp_server/compat/index.js' or '../dist/mcp_server/lib/render.js', memoized, fallback to the local renderAdvisorBrief). Line 430: return `renderAdvisorBrief: compat.renderAdvisorBrief ?? renderAdvisorBrief`. buildCliBrief (786): resolve the renderer via the shared loader (await it) instead of the module-local function so the CLI path also emits GOVERNOR. Shapes already match (result.metrics.tokenCap, thresholdConfig, sharedPayload.metadata.skillLabel).
- Acceptance: OpenCode-produced live brief now ends with the '\nFable-5 governor: ...' line, matching Claude; disabled/no-rec paths unchanged; if dist compat missing, falls back to local renderer without throwing.
- Side effects / parity: Behavior converges to canonical (uses resolvedConfidenceThreshold/isAmbiguousTopTwo defaults) — desired, and thresholdConfig is passed explicitly so default divergence is moot. Brings OpenCode into parity with Claude, which already uses render.ts. Consider deleting the now-fallback-only local renderer later.
- Test: Unit asserting bridge buildNativeBrief and buildCliBrief output ends with GOVERNOR_DIRECTIVE (Claude parity assertion).

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. The bridge implements a private renderer at `plugin_bridges/mk-skill-advisor-bridge.mjs:324-360` and returns it from both module-loading branches at :404-443. The canonical renderer appends `GOVERNOR_DIRECTIVE` at `mcp_server/lib/render.ts:186-200`, which the private renderer omits.
- Fix approach: Remove the bridge renderer fork and require the canonical compiled renderer for native and CLI bridge responses. If the canonical renderer cannot load, return a coded fail-open envelope rather than rendering a reduced variant.
- Exact change: Delete the local `renderAdvisorBrief`, its renderer-only ambiguity and formatting helpers, and its local hygiene constant. In `loadNativeAdvisorModules`, use `compat.renderAdvisorBrief`, which is exported by `mcp_server/compat/index.ts`, and validate that it is a function. Provide a dedicated canonical-renderer loader for the CLI fallback path. Make `buildNativeBrief` and `buildCliBrief` return `RENDERER_UNAVAILABLE` if loading fails instead of invoking a local fallback.
- Acceptance: For identical renderable data and options, the bridge output equals `mcp_server/lib/render.ts` output byte for byte, including both hygiene and governor directives. Missing or stale renderer dist fails open without context.
- Side effects / parity: Update the bridge source, compiled advisor dist, `mcp_server/tests/compat/plugin-bridge.vitest.ts`, bridge smoke tests, and OpenCode runtime parity fixtures. Claude already imports the canonical renderer at `hooks/claude/user-prompt-submit.ts:17`.
- Test: Replace source-string tests that merely detect a renderer name with behavioral equality tests against the canonical renderer for normal, ambiguous, Unicode, skipped, unavailable, and instruction-shaped-label fixtures. Add a renderer-load-failure case.

---

### F9 [P2] Session disposal races with in-flight requests and can repopulate cleared state
`.opencode/plugins/mk-skill-advisor.js:582` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. resetRuntimeState (582-595) clears advisorCache but not state.inFlight; session.deleted (692-701) purges only completed cache entries. A bridge promise already awaiting at getAdvisorContext:569 will, on resolve, insertWithEviction into advisorCache (571-575) after disposal/purge, repopulating cleared state.
- Fix approach: Add an epoch/generation guard: capture it before the await and refuse the post-await cache write if it changed. Also clear inFlight on reset.
- Exact change: Add state.epoch=0. resetRuntimeState: `state.epoch+=1; state.inFlight.clear();`. session.deleted handler: `state.epoch+=1;` after purge. In getAdvisorContext capture `const epochAtStart = state.epoch` before running the bridge; gate the insert at 570-578 on `response.status==='ok' && response.brief && state.epoch===epochAtStart` (else still return response, just don't cache).
- Acceptance: Start a request, fire server.instance.disposed (or session.deleted) mid-flight, let the bridge resolve → advisorCache stays empty for that key; normal (no disposal) caching still works.
- Side effects / parity: OpenCode-only (Claude hook is stateless per invocation). Optional extra: track child processes to SIGKILL them on dispose — larger, not required for the repopulation correctness bug. Coordinate with O5 (same session.deleted handler) and O4 (same insert block).
- Test: Unit: inject a slow bridge, bump epoch during the await, assert no cache entry written.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. In-flight promises are installed and later write completed entries at `mk-skill-advisor.js:557-575`. `resetRuntimeState()` clears only completed cache and metrics at :582-595. Session deletion at :692-701 also removes only completed entries, so old promises can mutate status and repopulate cache after deletion or disposal.
- Fix approach: Use lifecycle generations to reject stale completions and track active child processes so disposal and session deletion can cancel relevant work.
- Exact change: Add a runtime generation counter, per-session generation map, and active-child registry to plugin state. Capture runtime and session generations when starting a lookup. Before deleting an in-flight key, updating metrics/status, or caching a response, verify generations still match and that the map still contains that exact promise. On session deletion, increment that session generation, remove its completed and in-flight keys, and terminate children tagged with that session. On global/server disposal, increment runtime generation, clear both maps, terminate all children, and reset metrics. Child close/error events from older generations must settle callers without mutating current state.
- Acceptance: Deleting a session or disposing the instance during a delayed bridge call leaves cache and reset metrics empty, prevents stale context injection, and cannot delete or overwrite a newer promise for the same key. Tracked children receive bounded termination.
- Side effects / parity: OpenCode plugin only. Reuse F3/F11's single child-termination helper and O5's session resolver. Claude hook processes are per invocation and have no equivalent persistent state.
- Test: Add fake-timer race tests for session deletion during an in-flight request, global disposal during a request, a new same-key request after reset, late close/error events, and disposal with multiple sessions. Assert no stale cache/status writes and no leaked active children.

---

### F10 [P2 (GPT P2 / Opus refinement)] Forced process exit can truncate Claude fail-open output and diagnostics
`.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:271` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. CLI catch path (271-285) calls process.stdout.write('{}\n') without awaiting the write callback, then .finally(() => process.exit(0)); process.exit can terminate before the pipe flushes → truncated/lost fail-open envelope. emitDiagnostic also fires persistDiagnostic asynchronously without awaiting (121), which exit(0) can cut off.
- Fix approach: Guarantee the stdout envelope flushes before exit; keep an explicit exit(0) for deterministic hook termination but only after the write callback resolves. Treat diagnostics as best-effort.
- Exact change: Make the CLI catch handler async and `await writeHookOutput({})` (the existing callback-backed helper) before the finally exits, replacing the bare process.stdout.write. Keep .finally(()=>process.exit(0)) — finally now waits for the awaited write. Do NOT block the hot path on persistDiagnostic (best-effort by design); only the envelope is load-bearing.
- Acceptance: Force main() to throw; assert stdout receives full '{}\n' before exit (no truncation under a piped stdout).
- Side effects / parity: The normal main() path already awaits writeHookOutput before finally — only the catch path is buggy. Parity: the spec-kit shim (F4/F5/O3) does the same write-then-exit pattern — flush via write-callback there too before process.exit(0).
- Test: Unit: stub writeHookOutput to record completion ordering; assert exit occurs after write resolves.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. The CLI catch starts an asynchronous stdout write at `hooks/claude/user-prompt-submit.ts:271-282`, then `finally` forces `process.exit(0)` at :283-285. Diagnostic persistence is also launched without awaiting completion at :109-124.
- Fix approach: Await fail-open output and a bounded diagnostic flush, then set `process.exitCode` rather than forcing process termination.
- Exact change: Make the top-level catch async and call `await writeHookOutput({})`. Remove `process.exit(0)` and assign `process.exitCode = 0` after settlement. Track diagnostic persistence promises in a small pending set or make `emitDiagnostic` return a caught promise; expose a bounded flush used by `main` after stdout has been written. Keep all diagnostic failures non-fatal.
- Acceptance: Injected stdout backpressure cannot truncate `{}` or a normal hook envelope, diagnostic persistence completes or reaches its bounded flush deadline, and every error path exits with code 0 without an explicit `process.exit()`.
- Side effects / parity: Claude hook and its tests only. The legacy shim should use the same write-and-exit discipline under F5/O3. OpenCode plugins must continue writing neither stdout nor stderr.
- Test: Add a spawned-process test with delayed stdout callbacks and delayed diagnostic persistence, then assert complete parseable stdout, persisted diagnostics, exit code 0, and no duplicate output. Add a persistence-rejection case.

---

### F11 [P2] Default prompt-blocking timeout differs by more than threefold
`.opencode/plugins/mk-skill-advisor.js:33` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: med
- Root cause: CONFIRMED divergence (judgment item, not a hard defect). OpenCode bridgeTimeoutMs default 10000 (constant:33) then +1000ms SIGKILL grace AFTER the budget (465-475) → worst-case ~11s block on experimental.chat.system.transform. Claude DEFAULT_CLAUDE_HOOK_TIMEOUT_MS=3000 (line 70), CLI fallback consuming the remainder within 3000 → ~3s block. >3x difference in prompt-blocking time.
- Fix approach: Two changes: (a) fold the SIGKILL grace INSIDE the budget so worst-case block equals the configured budget (clear correctness win); (b) converge the OpenCode default toward Claude's, but not blindly to 3s (bridge cold-start = node spawn + dist import can exceed it) — propose a shared documented ~5000ms, or explicitly document why OpenCode gets more headroom.
- Exact change: (a) In runBridge, schedule SIGTERM at bridgeTimeoutMs - grace and SIGKILL at bridgeTimeoutMs (grace inside), so the total hard cap = bridgeTimeoutMs. (b) Lower DEFAULT_BRIDGE_TIMEOUT_MS from 10000 to a justified shared value (recommend 5000) OR add a code comment documenting the per-runtime rationale and keep it env-overridable.
- Acceptance: Bridge that never exits is fully terminated by bridgeTimeoutMs (not budget+grace); default block time documented and within the agreed ceiling.
- Side effects / parity: Lowering to 3s risks more cold-start fail-opens; 5s is the safer convergence. This is partly a confirm-the-intended-budget decision — surface the tradeoff to the user before hard-matching 3s. Relates to F5 (shim timeout must exceed inner budget).
- Test: Unit: fake never-resolving bridge asserts termination at bridgeTimeoutMs; assert grace no longer extends beyond the budget.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. OpenCode defaults to 10000 ms at `mk-skill-advisor.js:33`, then adds a 1000 ms SIGKILL grace at :465-475. Claude defines a 3000 ms producer budget at `hooks/claude/user-prompt-submit.ts:70,105-107` and passes only the remaining budget to fallback at :186-200.
- Fix approach: Define one end-to-end prompt-hook budget, defaulting to 3000 ms, with one canonical environment override. Treat termination grace, fallback, output serialization, and bounded diagnostic flushing as portions of that budget rather than additive delays.
- Exact change: Introduce a shared contract value and canonical environment name for the total skill-advisor hook budget, retaining current runtime-specific environment names as lower-precedence compatibility aliases. Change OpenCode's default to 3000 ms. Schedule SIGTERM at `deadline - grace`, SIGKILL and fail-open settlement at the deadline, and never wait an extra second. Send the absolute deadline or remaining milliseconds in the bridge payload so nested MCP/CLI calls clamp their own timeouts. In Claude and the legacy shim, compute one deadline and pass remaining time to the primary producer, CLI fallback, outer child timeout, output write, and bounded diagnostic flush.
- Acceptance: Both runtimes return or fail open within the same configured total budget plus only scheduler tolerance. A child ignoring SIGTERM is killed by, not after, the deadline. Primary work consumes fallback time instead of extending the deadline.
- Side effects / parity: Update the OpenCode plugin, bridge timeout helpers, Claude hook, legacy shim, compatibility configuration, status output, docs, and timing tests. Preserve old env names as aliases because they are external configuration surfaces.
- Test: Use fake clocks and real subprocess smoke tests at default and overridden budgets. Cover fast success, slow primary plus fallback, SIGTERM-resistant child, output backpressure, and diagnostics flush; assert elapsed time stays within budget tolerance on both runtimes.

---

### F12 [P2 (GPT P2 / Opus refinement)] Malformed OpenCode configuration is silently treated as absent
`.opencode/plugins/mk-skill-advisor.js:55` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. loadConfig (55-62) wraps readFile+JSON.parse in one catch → {} for ENOENT (normal/optional), malformed JSON, and EACCES alike. Status tool exposes no field distinguishing missing from broken config, so a config typo silently disables all overrides.
- Fix approach: Distinguish ENOENT (absent optional file → silent {}) from read/parse errors (→ {} but record a prompt-safe error code surfaced in status).
- Exact change: Change loadConfig to return {config, error}: on success {config:parsed, error:null}; catch err → if err.code==='ENOENT' return {config:{}, error:null}; else {config:{}, error: err instanceof SyntaxError ? 'CONFIG_PARSE_ERROR' : 'CONFIG_READ_ERROR'}. In the factory, destructure configPromise, seed state.configErrorCode (sanitized via promptSafeErrorCode), and add a `config_error=${state.configErrorCode ?? 'none'}` line to the status tool.
- Acceptance: Missing config → status config_error=none. Malformed JSON → status config_error=CONFIG_PARSE_ERROR while plugin still fails open with defaults.
- Side effects / parity: OpenCode-only (Claude hook doesn't read this file). No behavior change to enable/disable; purely observability.
- Test: Unit: three loadConfig cases (absent, malformed, unreadable) assert the returned error code.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `loadConfig()` catches every read and parse failure and returns `{}` at `mk-skill-advisor.js:55-62`. The status tool at :717-742 has no configuration health fields, so absent, malformed, and unreadable files are indistinguishable.
- Fix approach: Treat `ENOENT` as an optional absent configuration, but retain a prompt-safe load status and fixed error code for parse and other read failures while continuing with defaults.
- Exact change: Return a structured config result containing `values`, `status: loaded|absent|error`, and `errorCode`. Classify only `ENOENT` as absent, `SyntaxError` as `CONFIG_PARSE_ERROR`, and other failures as `CONFIG_READ_ERROR`. Merge only `values` with runtime options. Store the status and code in instance state and expose `config_status` and `config_error_code` through the status tool without exposing the path, file contents, or raw exception.
- Acceptance: Missing config reports `absent`, valid config reports `loaded`, malformed JSON reports `error/CONFIG_PARSE_ERROR`, and permission/read failure reports `error/CONFIG_READ_ERROR`; all cases preserve fail-open plugin startup and prompt-safe status.
- Side effects / parity: OpenCode plugin only. Claude does not consume this user config, so no runtime behavior change is required there. Avoid overwriting a config error with later bridge status.
- Test: Add isolated-module tests mocking `readFile` for ENOENT, valid JSON, malformed JSON, EACCES, and non-object JSON. Assert option precedence and prompt-safe status fields.

---

### O1 [P2 · Opus-new] OpenCode appendAdvisorBrief has no outer try/catch → fail-CLOSED on unexpected throw
`.opencode/plugins/mk-skill-advisor.js:666-677` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. appendAdvisorBrief wraps only the session-messages fetch (624-658) in try/catch; getAdvisorContext (666-671) and output.system.push (672-676) are unguarded. A synchronous throw (e.g., spawn throwing on an invalid nodeBinary/args, or a hash/path error) rejects appendAdvisorBrief → the experimental.chat.system.transform hook throws → OpenCode context assembly fails CLOSED, potentially blocking the prompt.
- Fix approach: Guarantee the hook never throws by wrapping the advisor call + push in try/catch that fails open with the same fallback directive as the no-brief path.
- Exact change: Wrap from the getAdvisorContext call through the push (ideally the whole body after `output.system = ...` init at 614) in try/catch. On catch: set state.lastBridgeStatus='fail_open', state.lastErrorCode=sanitized code (e.g. 'APPEND_THROW'), and push the F6 FALLBACK_DIRECTIVE (hygiene+governor) so behavior matches no-brief fail-open.
- Acceptance: Force getAdvisorContext to throw synchronously → appendAdvisorBrief resolves, output.system gains the fallback directive, no exception escapes the hook.
- Side effects / parity: Composes with F6 (uses the same shared fallback directive). OpenCode-only. Keep the existing inner try/catch for the messages fetch or subsume it.
- Test: Unit: stub getAdvisorContext to throw; assert appendAdvisorBrief resolves and pushes the fallback, lastErrorCode set.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `appendAdvisorBrief()` catches only the session-message lookup at `mk-skill-advisor.js:624-658`. The advisor lookup and mutation at :666-676 are outside a catch, so a rejected bridge promise, cache/fingerprint exception, or throwing output object can reject the OpenCode transform hook.
- Fix approach: Put the complete enabled transform path behind a final fail-open boundary and inject nothing on unexpected failure, consistent with F6.
- Exact change: Wrap prompt extraction, fallback message retrieval, advisor lookup, clamping, and `output.system.push` in an outer try/catch after validating the output argument. In the catch, set `lastBridgeStatus=fail_open` and `lastErrorCode=UNEXPECTED_HOOK_ERROR` without retrying output mutation or appending fallback context. Ensure initialization of `output.system` is also inside the boundary because frozen or proxy outputs can throw.
- Acceptance: Synchronous spawn failure, fingerprint failure, rejected lookup, malformed output object, and throwing `push` never reject the hook. Status records a fixed code and no context is injected.
- Side effects / parity: OpenCode plugin only. Aligns its outer error behavior with Claude's catch at `hooks/claude/user-prompt-submit.ts:232-243`.
- Test: Extend the plugin suite with a spawn mock that throws, a rejected fingerprint dependency, a frozen output, and an array whose `push` throws. Assert the transform resolves and status is prompt-safe.

---

### O3 [P2 · Opus-new] Legacy spec-kit shim uses readFileSync(0) with no try/catch → hard crash on EAGAIN, defeating fail-open
`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:15` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: CONFIRMED. spec-kit shim reads stdin via readFileSync(0) inline in the spawnSync options (15) with zero error handling in the file. If fd 0 is a non-blocking pipe with data not yet ready, readFileSync(0) throws EAGAIN and the shim crashes with a nonzero exit and no '{}' — a hard failure, not fail-open. spawnSync could also throw.
- Fix approach: Wrap read+spawn+output in try/catch that writes '{}\n' and exits 0 on any error; add bounded EAGAIN resilience for the stdin read.
- Exact change: Extract a readStdinSync() that tries readFileSync(0) and, on err.code==='EAGAIN', retries a bounded number of times (small loop) before returning '' (empty → inner hook fails open with PARSE_FAIL). Wrap the whole shim body in try/catch → on any throw process.stdout.write('{}\n', ()=>process.exit(0)).
- Acceptance: Simulate EAGAIN on fd 0 → shim retries then proceeds (or emits '{}'), never crashes; any unexpected throw yields '{}' exit 0.
- Side effects / parity: Fold into the single F4/F5/O3/F10 shim rewrite. Prefer reading '/dev/stdin' fallback if repeated EAGAIN, or accept empty input as fail-open.
- Test: Unit: mock readFileSync(0) to throw EAGAIN once then succeed → shim recovers; throw persistently → '{}'.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. The shim calls `readFileSync(0)` inline in spawn options at `system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13-18`, with no surrounding error boundary. Any stdin read exception occurs before fail-open output is established.
- Fix approach: Use asynchronous stream consumption under the shim's top-level fail-open boundary; do not implement a synchronous EAGAIN retry loop.
- Exact change: Replace `readFileSync(0)` with an async `for await` stdin reader that collects only up to the bounded hook-input limit. Move stdin reading, target resolution, child execution, validation, diagnostics, and stdout writing into guarded `main()`. On stream error, oversized input, or child exception, emit a fixed diagnostic and await one `{}` output line. Set `process.exitCode=0` instead of forcing exit.
- Acceptance: Stdin stream errors, including simulated EAGAIN, and oversized input produce `{}` without uncaught exceptions. Valid fragmented stdin is reconstructed and forwarded exactly once.
- Side effects / parity: Implement in the same legacy-shim refactor as F4/F5 and rebuild its dist. No OpenCode plugin change is required.
- Test: Unit-test the extracted async reader with fragmented buffers, empty input, size overflow, and a stream that raises EAGAIN. Add a subprocess assertion for complete fail-open stdout and exit code 0.

---

### O2 [refinement · Opus-new] OpenCode bridge payload mislabels runtime as 'codex'
`.opencode/plugins/mk-skill-advisor.js:361` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED (cosmetic/latent). bridgePayloadJson (mk-skill-advisor.js:358-365) hardcodes runtime:'codex' in the payload sent to the bridge. bridge.mjs parseInput (164-176) and buildBrief ignore input.runtime, so it is inert today — but the value is simply wrong for the OpenCode surface and would misattribute if any future metrics/diagnostics consumer reads it.
- Fix approach: Set the correct runtime label for this surface.
- Exact change: Change runtime:'codex' to runtime:'opencode' in basePayload (line 361-362). Confirm 'opencode' is a valid AdvisorRuntime value (Claude passes 'claude', cli-fallback types AdvisorRuntime).
- Acceptance: Emitted bridge payload carries runtime:'opencode'.
- Side effects / parity: None functional (inert field). Add a regression test so it doesn't silently regress if the bridge later starts honoring runtime.
- Test: Unit asserting bridgePayloadJson output.runtime === 'opencode'.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed as a currently inert contract defect. `bridgePayloadJson()` hardcodes `runtime: 'codex'` at `mk-skill-advisor.js:358-365`. `parseInput()` at `plugin_bridges/mk-skill-advisor-bridge.mjs:164-176` validates only prompt and workspace root, and current bridge execution never branches on `input.runtime`, so present behavior is unaffected.
- Fix approach: Correct the producer value now and validate the runtime at the bridge boundary so future telemetry or routing cannot silently inherit the wrong label.
- Exact change: Set the OpenCode payload runtime to `opencode`. Extend bridge input validation to accept only known runtime identifiers and return a prompt-safe invalid-runtime code for unknown values, while retaining a documented default only for legacy payloads that omit the field.
- Acceptance: Every OpenCode bridge invocation carries `runtime: opencode`; omitted legacy runtime remains compatible; unsupported runtime values fail open with a fixed code.
- Side effects / parity: OpenCode plugin and bridge contract tests. Claude continues passing `runtime: claude` through its producer and fallback paths.
- Test: Add a plugin payload assertion for `opencode` and bridge parse tests for `opencode`, `claude`, omitted legacy runtime, and an invalid value.

---

### O4 [refinement · Opus-new] Advisor cache expiresAt computed from pre-await timestamp shortens effective TTL by bridge duration
`.opencode/plugins/mk-skill-advisor.js:546` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED (minor). getAdvisorContext captures `now = Date.now()` at :546 before the bridge await at :569, then reuses it for expiresAt: now+cacheTTLMs and updatedAt (572-574). The entry is inserted at now+bridgeDuration real time but expires at now+TTL, so realized TTL is shortened by the bridge duration (up to ~10s).
- Fix approach: Compute expiry from the completion timestamp, not the pre-await one.
- Exact change: After `const response = await promise;` add `const completedAt = Date.now();` and use it in the insert: expiresAt: completedAt + options.cacheTTLMs, updatedAt: new Date(completedAt).toISOString(). Leave the cache-hit comparison at :550 using the lookup-time `now` (correct).
- Acceptance: With a bridge that takes T ms, the cached entry's expiresAt ≈ insertTime + cacheTTLMs (TTL not reduced by T).
- Side effects / parity: OpenCode-only, negligible. Coordinate with F9 (same insert block gains the epoch guard) and O4's completedAt.
- Test: Unit: slow bridge, assert expiresAt - insertTime ≈ cacheTTLMs.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `now` is captured before cache lookup and bridge execution at `mk-skill-advisor.js:546`. After awaiting the bridge at :569, the cache entry still uses that old timestamp for `expiresAt` and `updatedAt` at :571-575, shortening effective TTL by the bridge duration.
- Fix approach: Anchor cache age to successful completion time.
- Exact change: Read `completedAt = Date.now()` immediately before inserting a successful response and use it for both `expiresAt = completedAt + cacheTTLMs` and `updatedAt`. Keep the pre-await timestamp only for evaluating an existing entry.
- Acceptance: A bridge taking most of the configured TTL still receives the full TTL after completion, while entries expire exactly once after that interval.
- Side effects / parity: OpenCode plugin only. Apply after F9's stale-completion guard so disposed requests cannot insert entries at any timestamp.
- Test: Use fake timers with a delayed bridge: complete after 900 ms under a 1000 ms TTL, verify a hit 999 ms after completion and a miss after 1001 ms.

---

### O5 [refinement · Opus-new] session.deleted purge resolves session id via a different path than the cache-write key, so entries may not be evicted
`.opencode/plugins/mk-skill-advisor.js:693-701` — **Status: DISPUTED (GPT calls non-issue)**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. Cache keys are written using sessionIdFrom(input) = normalizeSessionID(input.sessionID||sessionId||session.id||properties.sessionID) (155-164). The session.deleted handler (693-696) resolves the id with a DIFFERENT, higher-priority chain (properties.sessionID || properties.info.sessionID || properties.info.id || sessionIdFrom(eventPayload)). If the delete event carries the id under properties.info.* (which sessionIdFrom does not consider), the resolved id can differ from the write key → prefix purge misses → entries linger until TTL/eviction.
- Fix approach: Route write and delete through ONE shared resolver so both compute the identical id.
- Exact change: Extend sessionIdFrom's candidate chain to append input.properties?.info?.sessionID and input.properties?.info?.id before the '__global__' default (append AFTER existing candidates so current write-key resolution is unchanged). Replace the bespoke inline resolution in the session.deleted handler with `sessionIdFrom(eventPayload)`.
- Acceptance: Feed a delete event whose id lives only under properties.info.id; the purge removes the matching cache entries written for that session.
- Side effects / parity: OpenCode-only. Coordinate with F9 (same handler adds epoch bump). Ensure the appended candidates don't alter existing keys for inputs that already carry properties.info.* alongside sessionID (existing higher-priority fields still win).
- Test: Unit: write a cache entry for a session, dispatch session.deleted with the id under properties.info.id, assert the entry is purged.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Non-issue as a demonstrated correctness defect. Cache writes use `sessionIdFrom()` at `mk-skill-advisor.js:155-164`. The deletion path at :692-701 explicitly handles `properties.sessionID`, `properties.info.sessionID`, and `properties.info.id`, then falls back to the same `sessionIdFrom(eventPayload)`. It is therefore a superset of the write resolver for supported write shapes. The existing test at `mk-skill-advisor-plugin.vitest.ts:410-439` proves eviction for the standard `properties.info.id` deletion event.
- Fix approach: Make no behavior change for this finding. A shared resolver refactor is optional maintainability work, not required to correct current eviction.
- Exact change: No production change. If F9 introduces per-session cancellation, factor the existing superset logic into a named `deletedSessionIdFromEvent()` helper and use its normalized result consistently for completed-cache, in-flight, and child cancellation; do not broaden accepted shapes without an OpenCode event-contract fixture.
- Acceptance: All session ID shapes accepted for cache writes remain evictable, and the standard `session.deleted` shape under `properties.info.id` continues to purge only the targeted session.
- Side effects / parity: None unless combined with F9's lifecycle refactor. No Claude counterpart exists because Claude hooks do not maintain persistent per-session host caches.
- Test: Retain the existing `properties.info.id` test and parameterize it over every currently supported write resolver shape. Add unsupported shapes only when backed by an actual OpenCode event fixture.

---

