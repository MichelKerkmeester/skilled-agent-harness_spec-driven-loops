# Iteration 2 - Opus 4.8 (high) cross-check - mk-skill-advisor

> **Executor:** Claude Opus 4.8 (`claude-opus-4-8 --effort high`, plan mode) via cli-claude-code through account2, read-only, 2026-07-10.
> **Purpose:** independently verify iteration-1 (GPT-5.6-Sol-Fast) findings and surface issues the first pass missed.

## Net assessment

All 12 prior findings reproduce against the real code, but the audit was over-rated: I downgraded six P1s (F1-F6) to P2 because every one fails OPEN and is bounded by a timeout or 5-min TTL — none are P0/P1. F7 is confirmed but currently latent (the Claude caller passes no thresholdConfig). F8 is the most substantive parity gap (the bridge's forked renderer genuinely omits GOVERNOR_DIRECTIVE, corroborated by this session's live 'Fable-5 governor' line). I add 5 new findings: OpenCode's appendAdvisorBrief lacks the outer fail-open guard its two siblings have (O1), the OpenCode payload mislabels runtime as 'codex' (O2), the spec-kit shim's readFileSync(0) can hard-crash before fail-open (O3), a pre-await timestamp shortens cache TTL (O4), and a session-id resolution mismatch can skip cache purge on session.deleted (O5).

**Prior findings adjudicated:** 12 - 6 adjusted, 6 confirmed. **New findings this pass:** 5.

**Parity (Opus view):** OpenCode<->Claude parity is weak but the divergences are quality/robustness rather than correctness: OpenCode omits the governor capsule (F8), always injects a hygiene-only fallback where Claude injects nothing (F6), blocks ~11s vs 3s (F11), drops caller thresholds only on the Claude CLI leg (F7, latent), and — newly — is the one surface without an outer fail-open try/catch (O1) while mislabeling its own runtime (O2). Defaults (0.8 confidence / 0.35 uncertainty) and the single-default-export plugin shape are correctly aligned. The shared render.ts is the right home to converge the renderer forks; the bridge should import it rather than maintain a drifting copy.

## 1. Verification of iteration-1 findings

| Prior ID | GPT sev | Opus verdict | Opus sev | Adjudication note |
|----------|---------|--------------|----------|-------------------|
| F1 | P1 | **adjusted** | P2 | CONFIRMED mechanically: advisorSourceSignature() hashes only ADVISOR_SOURCE_PATHS (mk-skill-advisor.js:48-53 = bridge .mjs, launcher.cjs, advisor-server.ts, advisor-server.js). The skill-graph DB / SKILL.md metadata are NOT in that set, and getAdvisorContext returns a host-cache hit at :550-555 before spawning the bridge, so a mid-session graph rebuild is not reflected until the entry expires. But the staleness window is bounded by cacheTTLMs (default 5min, :30) and only 'ok'+brief responses are cached (:570-578), so the blast radius is one stale recommendation for ≤5min after a rebuild. Real, but not P1 — downgrade to P2. |
| F2 | P1 | **adjusted** | P2 | CONFIRMED: skill-advisor-cli-fallback.ts runCliRecommend builds payload with the full prompt (:263-270) and passes JSON.stringify(payload) as a --json argv value (:275-285); the Claude entry normalizePrompt (:76-81) applies no byte cap, unlike the OpenCode stdin path which clamps to 64KiB (mk-skill-advisor.js:358-372). However an oversize argv yields E2BIG on spawn → child.once('error') → spawnError → failOpenResult (:327-328,:541-552), i.e. it FAILS OPEN, not crashes. Impact is 'no advisor brief for very large prompts' + parity drift, not corruption. P2, not P1. |
| F3 | P1 | **adjusted** | P2 | PARTIALLY CONFIRMED. stdout is appended unbounded (:479-481) and child.stderr is a pipe (:458) that is never drained — so if the bridge writes >~64KiB to its own process.stderr (withStdoutSilenced redirects console.* to stderr, bridge.mjs:128-156) the OS pipe fills and the child blocks on write, stalling until the plugin's SIGTERM. But: (a) the bridge emits a single small JSON on stdout so unbounded growth is theoretical; (b) the 10s timeout + 1s SIGKILL (:465-476) guarantees termination, so it is a wasted-budget fail-open, not a permanent deadlock. Downgrade P1→P2. The undrained-stderr half is the more real risk. |
| F4 | P1 | **adjusted** | P2 | CONFIRMED: spec-kit shim TARGET is a repo-relative path (user-prompt-submit.ts:11) resolved against cwd:process.cwd() in spawnSync (:13-18), with no import.meta.url anchoring. If the hook runs with cwd≠repo-root the child path fails ENOENT → result.error → output '{}' (:23-31), silently disabling advisor context. Claude Code normally sets cwd to the workspace root so this usually works; it is a latent robustness bug, not the common case. P2. |
| F5 | P1 | **adjusted** | P2 | CONFIRMED: spawnSync (user-prompt-submit.ts:13-18) has no timeout, and result.error is never surfaced — only result.stderr is forwarded (:20); every error/nonzero/empty/invalid case collapses to '{}' (:22-30). But the inner hook self-bounds via claudeHookTimeoutMs (3000ms) + process.exit(0) in finally, so a runaway child is unlikely, and Claude Code applies its own hook timeout. Defense-in-depth gap → P2/refinement, not P1. |
| F6 | P1 | **adjusted** | P2 | CONFIRMED parity divergence: OpenCode appendAdvisorBrief pushes HYGIENE_DIRECTIVE on EVERY empty-brief response including skipped/degraded/timeout/parse-fail (mk-skill-advisor.js:672-676), whereas the Claude hook returns {} when renderBrief is null (skill-advisor/hooks/claude/user-prompt-submit.ts:222-224), injecting nothing. Genuine behavioral drift, but functionally minor (a comment-hygiene reminder present vs absent when the advisor abstains). P2. |
| F7 | P2 | **confirmed** | P2 | CONFIRMED and instructive: the Claude cli-fallback runCliRecommend payload omits confidenceThreshold/uncertaintyThreshold (skill-advisor-cli-fallback.ts:263-270), while the bridge's own runCliRecommend WAS fixed to thread them (bridge.mjs:661-675 with an explicit comment). thresholdsFrom then reads the CLI's self-reported effectiveThresholds (:351-360). NOTE the divergence is currently LATENT: the Claude hook calls buildSkillAdvisorBriefFromCli with only {runtime,workspaceRoot,timeoutMs} (user-prompt-submit.ts:194-200) — no thresholdConfig — and the CLI defaults happen to be 0.8/0.35, so scoring matches by coincidence. Real dropped-plumbing bug, P2. |
| F8 | P2 | **confirmed** | P2 | CONFIRMED — strongest parity finding. Canonical render.ts appends GOVERNOR_DIRECTIVE (the fable-5 governor capsule) after the capped brief at :194 and :200; the bridge's FORKED renderAdvisorBrief (bridge.mjs:324-360) appends only HYGIENE_DIRECTIVE (:354,:359) and no governor. loadNativeAdvisorModules returns that local renderer (:430,:442). Corroborated by live session context: this Claude hook emitted the 'Fable-5 governor:' line, which OpenCode briefs would omit. Secondary drift: bridge caps the advisor sentence WITHOUT counting the appended hygiene text (:357-358) while canonical caps them together (:197-199). P2. |
| F9 | P2 | **confirmed** | P2 | CONFIRMED: resetRuntimeState clears advisorCache but not state.inFlight (:582-595). A bridge promise already past its await (:569) will run insertWithEviction (:571-575) after disposal, repopulating the just-cleared cache; and no child-process handles are tracked so disposal cannot terminate in-flight bridges. Low impact (leaked entry expires via TTL; only matters if the instance keeps serving post-disposal). P2. |
| F10 | P2 | **confirmed** | refinement | CONFIRMED but minor: the CLI-entry catch path writes process.stdout.write('{}\n') without awaiting its callback and finally calls process.exit(0) immediately (user-prompt-submit.ts:271-285), and emitDiagnostic fires persistDiagnostic(...).catch() unawaited (:121). Classic process.exit truncation footgun, but the write is 3 bytes to a pipe (near-always flushed) and only triggers on an unhandled main() exception. The normal path correctly awaits writeHookOutput (:254-260). Refinement. |
| F11 | P2 | **confirmed** | P2 | CONFIRMED: OpenCode DEFAULT_BRIDGE_TIMEOUT_MS=10000 + 1000ms SIGKILL grace (mk-skill-advisor.js:33,:465-476) → ~11s worst-case blocking in the awaited experimental.chat.system.transform; Claude DEFAULT_CLAUDE_HOOK_TIMEOUT_MS=3000 (user-prompt-submit.ts:70,:189). 3.3x divergence, undocumented and untested as an intentional per-runtime budget. Cache + in-flight dedup limit the cost to cold/miss prompts. P2. |
| F12 | P2 | **confirmed** | refinement | CONFIRMED: loadConfig catch collapses ENOENT, EACCES, and JSON.parse errors alike to {} (mk-skill-advisor.js:55-62); the status tool exposes no config-error field (:713-743). A typo'd config runs silently on defaults. Correct fail-open for an optional file, but a malformed config deserves a distinguishable status code. Refinement. |

## 2. New findings (missed by iteration 1)

| ID | Sev | Category | Location | Title | Conf |
|----|-----|----------|----------|-------|------|
| O1 | P2 | parity | `.opencode/plugins/mk-skill-advisor.js:666-677` | OpenCode appendAdvisorBrief has no outer try/catch → fail-CLOSED on unexpected throw | med |
| O2 | refinement | bug | `.opencode/plugins/mk-skill-advisor.js:361` | OpenCode bridge payload mislabels runtime as 'codex' | high |
| O3 | P2 | error | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:15` | Legacy spec-kit shim uses readFileSync(0) with no try/catch → hard crash on EAGAIN, defeating fail-open | med |
| O4 | refinement | bug | `.opencode/plugins/mk-skill-advisor.js:546` | Advisor cache expiresAt computed from pre-await timestamp shortens effective TTL by bridge duration | high |
| O5 | refinement | bug | `.opencode/plugins/mk-skill-advisor.js:693-701` | session.deleted purge resolves session id via a different path than the cache-write key, so entries may not be evicted | med |

### Detail

#### O1 - OpenCode appendAdvisorBrief has no outer try/catch → fail-CLOSED on unexpected throw
- **Severity / Category / Confidence:** P2 / parity / med
- **Location:** `.opencode/plugins/mk-skill-advisor.js:666-677`
- **Evidence:** The getAdvisorContext call at :666-671 and the output.system.push at :672-676 are NOT wrapped in try/catch (only the session-messages fetch at :624-658 is). runBridge always resolves, but any synchronous throw in the resolve/cache path (e.g. spawn throwing on a malformed nodeBinaryOverride, or an unexpected error in advisorSourceSignature/cacheKeyForPrompt) would reject the awaited system.transform hook. The Claude hook wraps its entire body in try/catch returning {} (user-prompt-submit.ts:144-243), and the bridge main() catches to failOpen (bridge.mjs:911-914) — OpenCode alone lacks the equivalent fail-open guard.
- **Impact:** A fail-open-by-design hook can instead reject the OpenCode chat-system transform, whose failure handling is host-dependent and could disrupt prompt assembly rather than degrade gracefully. Parity/robustness gap vs both sibling surfaces.
- **Proposed fix:** Wrap the getAdvisorContext + push block (or the whole appendAdvisorBrief body after output.system init) in try/catch that, on any throw, pushes HYGIENE_DIRECTIVE (or nothing) and records lastErrorCode — mirroring the Claude hook's outer guard.

#### O2 - OpenCode bridge payload mislabels runtime as 'codex'
- **Severity / Category / Confidence:** refinement / bug / high
- **Location:** `.opencode/plugins/mk-skill-advisor.js:361`
- **Evidence:** bridgePayloadJson hardcodes runtime:'codex' in the basePayload sent to the bridge from the OpenCode plugin. parseInput (bridge.mjs:164-176) and buildBrief never read input.runtime, so it is currently inert, but the value is simply wrong for this surface (should be 'opencode').
- **Impact:** Inert today, but any future bridge/metrics logic that keys off the payload runtime would attribute OpenCode traffic to Codex, and it also skews the byte-overhead estimate used for prompt clamping vs the real 'opencode' label.
- **Proposed fix:** Set runtime:'opencode' (or thread the actual runtime through) in bridgePayloadJson; add a test asserting the emitted payload runtime.

#### O3 - Legacy spec-kit shim uses readFileSync(0) with no try/catch → hard crash on EAGAIN, defeating fail-open
- **Severity / Category / Confidence:** P2 / error / med
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:15`
- **Evidence:** The shim reads stdin via readFileSync(0) inline in the spawnSync options (:13-18) with zero error handling anywhere in the file. On platforms/conditions where fd 0 is a non-blocking pipe with data not yet ready, readFileSync(0) throws EAGAIN; spawnSync can also throw synchronously on some option errors. Either throw is uncaught → the shim exits non-zero with a stack trace instead of emitting '{}'. The inner hook deliberately uses async `for await (const chunk of process.stdin)` (skill-advisor/.../user-prompt-submit.ts:246-252) which tolerates EAGAIN — the shim regresses that.
- **Impact:** The 'thin fail-open shim' can hard-fail before it ever produces output, surfacing an error to Claude Code's UserPromptSubmit path rather than degrading silently. Distinct from F4/F5 (cwd + hidden result.error) — this crashes before spawn returns.
- **Proposed fix:** Wrap the read+spawn in try/catch that writes '{}\n' and exits 0 on any error; prefer a retry loop or async stdin read for EAGAIN resilience.

#### O4 - Advisor cache expiresAt computed from pre-await timestamp shortens effective TTL by bridge duration
- **Severity / Category / Confidence:** refinement / bug / high
- **Location:** `.opencode/plugins/mk-skill-advisor.js:546`
- **Evidence:** `now` is captured once at :546 before the runBridge await at :569, then reused for both expiresAt:now+cacheTTLMs and updatedAt:new Date(now) at :572-574. Because the entry is inserted at now+bridgeDuration but expires at now+TTL, the realized TTL is reduced by the bridge round-trip (up to ~11s). Never negative since bridgeTimeout(11s) << default TTL(5min).
- **Impact:** Marginally reduced cache effectiveness (more bridge spawns than intended); no correctness violation. Would become material if TTL were configured close to the bridge timeout.
- **Proposed fix:** Re-read Date.now() after the await when computing expiresAt/updatedAt, or set expiresAt = completionTime + cacheTTLMs.

#### O5 - session.deleted purge resolves session id via a different path than the cache-write key, so entries may not be evicted
- **Severity / Category / Confidence:** refinement / bug / med
- **Location:** `.opencode/plugins/mk-skill-advisor.js:693-701`
- **Evidence:** Cache keys are written as `${normalizeSessionID(sessionID)}::${promptKey}` where sessionID comes from sessionIdFrom(input) reading input.sessionID||sessionId||session.id||properties.sessionID (:155-164). The session.deleted handler instead resolves properties.sessionID||properties.info.sessionID||properties.info.id||sessionIdFrom(eventPayload) (:693-696) and prefix-matches `${sessionID}::` (:697-700). If the deletion event's id shape differs from the prompt event's, no keys match and the session's entries survive until TTL.
- **Impact:** Cache entries can outlive their session (bounded leak, TTL-reclaimed); combined with F9 the disposal/eviction story is unreliable. Low impact but a real id-resolution mismatch.
- **Proposed fix:** Route both write and delete through one shared session-id resolver, and add a test feeding a delete event whose id lives under properties.info to assert purge.

