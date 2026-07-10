# Iteration 2 - Opus 4.8 (high) cross-check - mk-code-graph

> **Executor:** Claude Opus 4.8 (`claude-opus-4-8 --effort high`, plan mode) via cli-claude-code through account2, read-only, 2026-07-10.
> **Purpose:** independently verify iteration-1 (GPT-5.6-Sol-Fast) findings and surface issues the first pass missed.

## Net assessment

Of 8 prior findings, 3 hold as-stated (F5, F6, F8 confirmed; F4 confirmed but downgraded P1→P2), and 5 were over-rated: F1 and F7 are guarded in-code (drop to refinement), F2 is backstopped by the plugin's own execFile timeout (P1→P2), and F3 is an operational build-freshness concern rather than a source defect. The strongest prior findings are F6 (already-expired cache inserts) and F4/F5. New issues: an unguarded output in messages.transform (O1), no in-flight bridge dedup causing duplicate node spawns (O2), and the bridge shipping the full raw status payload against a 1MB execFile buffer (O3).

**Prior findings adjudicated:** 8 - 4 adjusted, 4 confirmed. **New findings this pass:** 5.

**Parity (Opus view):** The core status-brief rendering is equivalent, but refresh cadence is the real divergence and both sides are wrong in opposite directions: OpenCode re-runs the bridge on nearly every message/session event (F6+O2+O5 => redundant node spawns) while Claude injects the code-graph digest only at SessionStart and never on UserPromptSubmit/PreCompact (F4, confirmed by grep — buildWarmCodeGraphStatusSection is used only in session-prime.ts). Process-control parity also lags: the bridge lacks the detached/process-group kill of the Claude fallback (F2), though the plugin's execFile timeout backstops the hang.

## 1. Verification of iteration-1 findings

| Prior ID | GPT sev | Opus verdict | Opus sev | Adjudication note |
|----------|---------|--------------|----------|-------------------|
| F1 | P0→P2 | **adjusted** | refinement | Named export parseTransportPlan does exist @ mk-code-graph.js:176, but the P0 'drops the whole file' failure is already neutralized in-code: if the legacy loader invokes it as a plugin it is called with (ctx, rawOptions) where the first arg is an object → typeof !== 'string' branch @177-181 returns {} (a harmless empty-hook plugin), which does NOT throw. So the live risk is only forward-compat (a future loader calling it with no args or a string first arg, or validating factory shape). Legitimate code smell / refinement to move the parser to a non-plugin helper module, not a live P0. |
| F2 | P1 | **adjusted** | P2 | Bridge timeout @403-409 kills only the direct child (SIGTERM then SIGKILL after 100ms) and settles on 'close'/'error' only @419-420 — a descendant retaining the stdout/stderr pipe could delay 'close'. BUT: (a) the CLI is spawned with '--warm-only' @337 so it talks to an existing daemon and should not fork a stdio-holding descendant, and (b) the plugin's own execFile has timeout:bridgeTimeoutMs and maxBuffer @277-278 that SIGTERM-kills the bridge process itself as a hard backstop, so the plugin promise cannot hang forever. Real robustness gap but backstopped and low-probability → P2, not P1. detached+process-group kill would still be the correct hardening. |
| F3 | P1 | **adjusted** | refinement | Confirmed .claude/settings.json:56 invokes dist/hooks/claude/session-prime.js (Node cannot execute the .ts directly, so dispatching the compiled artifact is correct-by-design, not a bug). Whether that dist is stale vs the reviewed source is an operational/CI build-state question I cannot confirm from the source files; the audited TS itself is fine. Reclassify from P1 code-error to a build-freshness/process refinement. |
| F4 | P1 | **confirmed** | P2 | Confirmed via grep: buildWarmCodeGraphStatusSection is imported/used ONLY in session-prime.ts (@26,@364), and maybeAppendCodeIndexCliWarmFallback is gated to source==='startup'\|\|'resume' and skipped when a 'Structural Context' section exists @361. UserPromptSubmit (user-prompt-submit.js) and PreCompact (compact-inject.js) never refresh code-graph status. OpenCode by contrast re-fetches the digest on every system.transform/messages.transform/compacting via loadTransportPlan @448,484,526. Real parity gap (Claude gets a startup-only code-graph digest, OpenCode gets a per-turn one). Severity is P2 not P1: the digest is staleness/enrichment info, not a correctness surface. |
| F5 | P2 | **confirmed** | P2 | Confirmed: loadConfig @49-57 does `catch { return {}; }`, so ENOENT (expected), permission errors, and malformed JSON are indistinguishable and invisible; no diagnostic state is retained and last_runtime_error is never populated for config failures. A user with a typo'd mk-code-graph.json silently runs on defaults. P2 is fair; distinguishing ENOENT from parse/permission errors is the fix. |
| F6 | P2 | **confirmed** | P2 | Confirmed: `now` is captured @290 before the subprocess runs, and expiresAt = now + cacheTtlMs @318. Default cacheTtlMs=5000 (@40) but bridge timeout=15000 (@41), so any bridge call taking ≥5s inserts an already-expired entry; the very next loadTransportPlan @293 (`cached.expiresAt > now` with a fresh now) misses and re-spawns the bridge. Slow responses are effectively uncached. Also surfaces as a past-timestamp in mk_code_graph_status @420. Genuine efficiency bug; compute expiresAt from a post-success Date.now(). |
| F7 | P2 | **adjusted** | refinement | parseTransportPlan @193 validates only transportOnly===true and Array.isArray(messagesTransform), not element shape. The 'crash the transform' claim is mostly overstated: undefined title/content/dedupeKey render as the string 'undefined' in the template literals @462,506 and do not throw. The ONE real crash path is a null/non-object array element (e.g. messagesTransform:[null]) → `block.dedupeKey` @498 throws TypeError. However the only producer is the trusted in-repo bridge (buildTransportPlan @214-220) which always emits well-formed blocks, so this requires a malformed trusted source. Downgrade to refinement (add per-block shape validation for defense-in-depth). |
| F8 | refinement | **confirmed** | refinement | Confirmed: parseArgs stores options.minimal @253 and options.specFolder @259 but runCli @300-421 never reads either; the plugin always passes '--minimal' and optional '--spec-folder' @269-272. Dead flags. Slightly more than cosmetic for --spec-folder: the plugin/env specFolder scoping the user configures has zero effect on the code-graph-status query, so any expectation of spec-scoped status is silently unmet. Refinement; either wire specFolder into the CLI args or drop the option. |

## 2. New findings (missed by iteration 1)

| ID | Sev | Category | Location | Title | Conf |
|----|-----|----------|----------|-------|------|
| O1 | P2 | bug | `.opencode/plugins/mk-code-graph.js:470` | messages.transform hook lacks the output guard its sibling hooks have | med |
| O2 | P2 | efficiency | `.opencode/plugins/mk-code-graph.js:288` | No in-flight dedup — concurrent hooks spawn duplicate node bridge subprocesses on cold cache | med |
| O3 | P2 | bug | `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:369` | Bridge embeds the full raw code-graph status payload, risking the plugin's 1MB execFile maxBuffer | med |
| O4 | refinement | bug | `.opencode/plugins/mk-code-graph.js:463` | Dedup scan assumes string entries in output.system / output.context | low |
| O5 | refinement | parity | `.opencode/plugins/mk-code-graph.js:371` | Cache invalidation frequency asymmetry compounds the F6 slow-cache bug | med |

### Detail

#### O1 - messages.transform hook lacks the output guard its sibling hooks have
- **Severity / Category / Confidence:** P2 / bug / med
- **Location:** `.opencode/plugins/mk-code-graph.js:470`
- **Evidence:** experimental.chat.system.transform @442-446 and experimental.session.compacting @520-524 both guard `if (!output || typeof output !== 'object') return;` and coerce the target array, but experimental.chat.messages.transform @470 immediately does `output.messages.at(-1)` @475 with no guard on output or output.messages.
- **Impact:** If OpenCode ever invokes messages.transform with undefined/malformed output (as the defensive coding in the sibling hooks anticipates for their surfaces), this handler throws a TypeError, rejecting the hook mid message-transform instead of no-oping. Asymmetric hardening is a latent crash/parity gap.
- **Proposed fix:** Mirror the sibling guards: bail early if output is not an object or output.messages is not an array before calling .at(-1).

#### O2 - No in-flight dedup — concurrent hooks spawn duplicate node bridge subprocesses on cold cache
- **Severity / Category / Confidence:** P2 / efficiency / med
- **Location:** `.opencode/plugins/mk-code-graph.js:288`
- **Evidence:** loadTransportPlan @288-328 only checks a completed cache entry @293; there is no in-flight promise map. On a cold or event-invalidated cache (session.*/message.* events clear it @371-387), system.transform @448, messages.transform @484, and compacting @526 can each call loadTransportPlan before any completes, each spawning a full `node` bridge process via execFile @274.
- **Impact:** Thundering-herd: up to 3x redundant node subprocess spawns (each loading the MCP bundle) per turn whenever the cache is cold, which is exactly after every session/message event because those events proactively invalidate the entry. Wasted CPU/latency with no correctness benefit.
- **Proposed fix:** Store the pending Promise keyed by cacheKeyForSession and return it to concurrent callers until it settles, then cache the result.

#### O3 - Bridge embeds the full raw code-graph status payload, risking the plugin's 1MB execFile maxBuffer
- **Severity / Category / Confidence:** P2 / bug / med
- **Location:** `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:369`
- **Evidence:** On success the bridge returns `data.codeGraphStatus: payload` — the entire raw CLI JSON @369 — alongside the derived opencodeTransport @372. The plugin only ever consumes data.opencodeTransport (parseTransportPlan @189 reads `data.opencodeTransport`) yet must buffer the whole response under execFile maxBuffer: 1024*1024 @278.
- **Impact:** For a large repo the raw code_graph_status JSON (node/edge/readiness detail) can be sizable; if the total bridge stdout exceeds 1MB, execFile errors with ENOBUFS → loadTransportPlan catch @322 returns null → the digest the plugin could have injected is silently lost (fail-open), and it degrades precisely on the largest graphs where structural context matters most. The bridge's own capOutput cap is also 1MB @15,85-88, so truncation there yields unparsable JSON → null.
- **Proposed fix:** Have the bridge omit the raw codeGraphStatus payload from the plugin-facing response (or gate it behind a flag); the plugin only needs opencodeTransport + brief. Optionally raise the plugin maxBuffer.

#### O4 - Dedup scan assumes string entries in output.system / output.context
- **Severity / Category / Confidence:** refinement / bug / low
- **Location:** `.opencode/plugins/mk-code-graph.js:463`
- **Evidence:** `output.system.some((entry) => entry.includes(rendered))` @463 and `output.context.some((entry) => entry.includes(rendered))` @541 call String.prototype.includes on each entry without a typeof check.
- **Impact:** If OpenCode ever populates these arrays with non-string entries (structured system parts/objects), `entry.includes` is undefined → TypeError crashes the hook instead of no-oping. Low likelihood since both surfaces are conventionally string arrays, but the messages.transform path already uses structured parts, so mixed shapes are not inconceivable.
- **Proposed fix:** Guard with `typeof entry === 'string' && entry.includes(rendered)`.

#### O5 - Cache invalidation frequency asymmetry compounds the F6 slow-cache bug
- **Severity / Category / Confidence:** refinement / parity / med
- **Location:** `.opencode/plugins/mk-code-graph.js:371`
- **Evidence:** shouldInvalidateEvent @371-374 clears the transport cache on every `session.*` and `message.*` event, and the TTL is only 5s @40 while bridge calls can take up to 15s @41. OpenCode therefore re-runs the bridge extremely often, whereas the Claude side fetches the digest once at SessionStart.
- **Impact:** Combined with F6 (already-expired inserts) and O2 (no dedup), the OpenCode surface can spawn a bridge subprocess on nearly every message event, while Claude never refreshes (F4) — the two runtimes sit at opposite, both-suboptimal extremes of refresh cadence.
- **Proposed fix:** Decouple TTL from invalidation: only invalidate on session lifecycle boundaries (not every message.*), and raise TTL above typical bridge latency so warm entries actually serve.

