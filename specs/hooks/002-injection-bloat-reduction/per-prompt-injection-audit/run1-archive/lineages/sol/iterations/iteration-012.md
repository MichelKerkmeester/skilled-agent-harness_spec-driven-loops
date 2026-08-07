# Iteration 12: Empirical Baseline Token-Cost Matrix

## Focus
Reconstruct the exact source-owned injection fixtures for advisor, the three directives, Gate 3, Pi dispatch, and deterministic SessionStart variants; measure byte/character boundaries; attempt an OpenAI-style tokenizer; and compute per-runtime steady-state and lifecycle totals without counting dormant or variable paths as observed facts. The explicit dispatch focus overrides the reducer's Gate-3 follow-up.

## Method and Boundaries
The fixture boundary is model-visible content, excluding the user's prompt and JSON/transport envelopes. Strings were reconstructed byte-for-byte from the owning constants/formatters. UTF-8 bytes and Unicode code-point characters were measured with Python 3.9. `tiktoken==0.11.0` was attempted with `o200k_base` first and `cl100k_base` second; neither vocabulary was locally cached, and the sandbox could not resolve `openaipublic.blob.core.windows.net`. Token columns therefore use the repository owner's documented estimator `ceil(chars/4)` and are labeled **estimated**, not tokenizer-observed. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,196-215] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/shared.ts:111-118] [SOURCE: command `python3` exact-fixture measurement and failed tiktoken vocabulary load]

## Findings
1. **The exact invariant directive capsule is 759 characters/763 UTF-8 bytes/~190 estimated tokens, correcting the earlier 760-character boundary by one.** Its source-owned components, including their leading newlines, are hygiene 204/206/~51, governor 289/291/~73, and proof 255/255/~64; `Directives:` adds 11 ASCII characters. The 4-byte excess comes from two em dashes. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:51-69,213-215] [SOURCE: command `python3` exact-fixture measurement]
2. **Advisor variants add little over the directive capsule.** The exact representative fixtures are live single 802 chars/806 bytes/~201 tokens, stale single 803/807/~201, and live ambiguous 830/834/~208. The boundary is the rendered advisor line plus the exact directive capsule; no-match/below-threshold/error on a valid transport is the 759-char fallback. OpenCode byte-mirrors that fallback, although it can append a separate variable compiled-route line. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:163-215] [SOURCE: .opencode/plugins/mk-skill-advisor.js:45-52,836-855] [SOURCE: command `python3` exact-fixture measurement]
3. **Gate 3 is a conditional 521-char/521-byte/~131-token relay, not a steady-state block.** Its mutation-time deny detail is separately 149/149/~38 and belongs to tool enforcement, so it must not be added to per-turn prompt totals. Silence is exactly zero after satisfaction/skip, on read-only/no-match turns, and on disabled/child/error paths. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:98-119,882-991] [SOURCE: command `python3` exact-fixture measurement]
4. **Pi has a large unconditional nonblank surcharge.** The Pi-only directive is 552 chars/554 bytes/~138 tokens; with two separator newlines and directives-only advisor context, the added transform is 1,313 chars/1,319 bytes/~329 tokens, or 1,356/1,362/~339 with the representative live advisor. A Gate-3-positive Pi turn reaches ~460 estimated injected tokens before any active-goal block. Blank input remains zero. [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:49-56,75-106] [SOURCE: command `python3` exact-fixture measurement]
5. **Configured steady-state baseline, excluding Gate 3 and variable goals/continuity, is ~190 estimated tokens per ordinary directives-only turn for Claude, intended Codex, Devin, and OpenCode; ~329 for Pi; and zero observed for Cursor CLI.** A representative live advisor changes shared runtimes to ~201 and Pi to ~339. A first positive Gate-3 turn is ~321 shared/~460 Pi. Cursor's configured-but-unobserved path would equal the shared values, but three CLI probes found no `beforeSubmitPrompt` delivery; it is not added to observed totals. Codex installed drift can replace the intended Gate result with the fixed 78-byte/~20-token resolver warning, but that warning is an observed-live drift variant, not part of the intended matrix. [SOURCE: .claude/settings.json:77-92] [SOURCE: .codex/hooks.json:29-52] [SOURCE: .cursor/hooks.json:79-90] [SOURCE: .devin/hooks.v1.json:29-50] [SOURCE: .opencode/plugins/mk-skill-advisor.js:777-865] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-004.md:7-13]

| Runtime/status | Ordinary steady turn | Live single | First Gate-positive turn | Cadence/status |
|---|---:|---:|---:|---|
| Claude configured | ~190 | ~201 | ~321 | per submitted prompt; configured, static owner confirmed |
| Codex intended | ~190 | ~201 | ~321 | per prompt; configured repository contract |
| Codex installed drift | ~190 + conditional ~20 warning | ~201 + warning | Gate path unresolved | observed installed registration drift; frequency host-dependent |
| Cursor CLI observed | 0 | 0 | 0 | three probes found no delivery |
| Cursor configured/editor-unverified | ~190 | ~201 | ~321 | reachable source, live editor delivery unknown |
| Devin | ~190 | ~201 | ~321 | startup and Gate delivery observed on 3000.2.17; current 3000.3.27 unprobed |
| OpenCode | ~190 + variable compiled line | ~201 + variable compiled line | ~321 + variable compiled line | every system transform; configured source, live ordering uncaptured |
| Pi | ~329 | ~339 | ~460 | every nonblank input; live cross-extension order uncaptured |

6. **Deterministic SessionStart fixtures are much smaller than the recurring capsule, while recovered content is inherently variable.** Exact canonical outputs are startup-without-continuity 361 chars/367 bytes/~91 tokens, resume-without-spec 135/135/~34, clear 134/134/~34, missing/stale compact recovery 129/129/~33, and quarantined compact recovery 198/198/~50. Accepted continuity, warm CLI fallback, active goal, and recovered compact payload must be measured as `fixed envelope + observed payload`; assigning one exact total would fabricate variable content. Normal SessionStart caps are 2,000 estimated tokens and compact caps 4,000 before pressure adjustment. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:40-102,124-160,175-254,303-355] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/shared.ts:74-79,111-145] [SOURCE: command `python3` exact-fixture measurement]

| Runtime | Cold/start fixed total | Resume/clear/compact fixed variants | Do not double-count |
|---|---:|---|---|
| Claude | ~91 | resume ~34; clear ~34; missing compact ~33; quarantine ~50 | continuity/warm/recovered payload only when present |
| Codex | same canonical payload when adapter resolves | same source variants when host forwards source | resolver warning is fallback, not additive success output |
| Cursor | ~91 | none through translator; it hard-codes startup | optional goal is separate and variable |
| Devin | same canonical payload | all forwarded source variants plus native post-compact path | maintenance stdout excluded without capture |
| OpenCode | 0 one-time SessionStart context | n/a | continuity/goal recur on transforms and belong in per-call variable totals |
| Pi | startup ~91; resume ~34 | native compact is a separate variable message | session goal restore and compact payload are separate messages |

7. **Session totals require an explicit turn count and event mix.** For `T` ordinary no-Gate turns plus one cold start, fixed baseline is Claude/Codex/Devin `91 + 190T`, Cursor CLI `91`, OpenCode `190T`, and Pi `91 + 329T`, all estimated and before variable continuity/goal/compiled-route blocks. Replace one ordinary turn with a first Gate-positive turn by adding ~131; replace directives-only with live-single by adding ~11 shared/~10 Pi. This arithmetic counts lifecycle content once and excludes dormant Cursor per-turn hooks, Gate deny text, maintenance output, and OpenCode's nonexistent one-time context. [INFERENCE: arithmetic over findings 3-6 and cited cadence owners]

## Ruled Out
- Reporting `tiktoken` counts: the package was installed but both OpenAI vocabularies required an unavailable network fetch; estimator results are not relabeled as tokenizer output. [SOURCE: command `python3` tiktoken probe]
- Adding Gate deny text to user-turn cost: it is emitted only at a blocked mutation boundary. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:114-119]
- Counting Cursor configured prompt hooks as observed CLI traffic, or adding SessionStart maintenance commands without captured model-visible output. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-004.md:7-13]
- Assigning exact totals to continuity, goal, compact recovery, or OpenCode compiled-route lines without a captured payload.

## Dead Ends
No source path is exhausted. Exact OpenAI-token counts remain blocked until `o200k_base` is cached or network access is available; live aggregate counts remain blocked on runtime transcript capture.

## Edge Cases
- Ambiguous input: “empirical token” could imply model-tokenizer output; exact bytes/chars are empirical, while tokens are explicitly the repository's estimator because the tokenizer vocabulary was unavailable.
- Contradictory evidence: prior research said 760 characters for the fallback; byte-for-byte reconstruction gives 759. The owning literals and arithmetic resolve this in favor of 759.
- Missing dependencies: `tiktoken` vocabularies and live six-runtime captures.
- Partial success: the complete fixed-fixture and cadence matrix is measured; variable payload and current live-host totals remain bounded rather than invented.

## Sources Consulted
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,163-215`
- `.opencode/plugins/mk-skill-advisor.js:45-52,777-865`
- `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:49-56,75-106`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:98-119,882-991`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:40-102,124-160,175-254,303-355`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/shared.ts:74-79,111-145`
- `.claude/settings.json:77-135`; `.codex/hooks.json:3-52`; `.cursor/hooks.json:4-90`; `.devin/hooks.v1.json:2-50`
- `command: python3 exact-fixture measurement and tiktoken availability probe`

## Assessment
- New information ratio: 0.93
- Questions addressed: measured per-block cost; aggregate per-runtime steady-state; deterministic SessionStart totals; configured versus observed-live status; uncertainty.
- Questions answered: exact fixed bytes/chars and estimator-token baseline, cadence-safe runtime totals, and no-double-count session formulas. Exact tokenizer and variable live totals remain open.

## Reflection
- What worked and why: reconstructing at each content owner before runtime aggregation exposed the one-character prior error and separated fixed from variable cost.
- What did not work and why: `tiktoken` could not load an uncached vocabulary without network access.
- What I would do differently: pre-stage the `o200k_base` vocabulary, then tokenize the same fixture manifest unchanged and capture two consecutive turns per host.

## Recommended Next Focus
Cache an OpenAI tokenizer vocabulary and capture raw model-visible payloads for two consecutive turns in each runtime. Re-run this exact manifest, then add observed continuity/goal/compiled-route payloads and compare baseline versus changed-route/lifecycle-only policy without changing fixture boundaries.
