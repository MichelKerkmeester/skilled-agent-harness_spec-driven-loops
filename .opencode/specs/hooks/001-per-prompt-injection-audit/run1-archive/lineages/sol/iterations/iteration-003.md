# Iteration 3: Codex Hook Adapter End-to-End Audit

## Focus
Audit Codex SessionStart and per-user-turn injections end to end: configured and installed order, owning adapters and shared content producers, fallback/resolution behavior, conditional variants, live drift, and the fixture set required for exact token measurement.

## Findings
1. **The repository configuration defines one deliberate SessionStart context producer plus three maintenance hooks, in fixed group order.** `.codex/hooks.json` runs compiled `session-start.js`, worktree guard, git-hook check, then dist-staleness. The adapter requires `session_id`, delegates to Claude's `session-prime.js` with a 2.8-second child timeout, and wraps its raw text as Codex `additionalContext`; invalid/oversized input, event mismatch, missing ID, child error/nonzero/timeout, or empty output produces silence. [SOURCE: .codex/hooks.json:3-31] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/session-start.ts:15-23] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/shared.ts:51-88,94-119,125-135]
2. **SessionStart content is inherited, not Codex-authored, and needs a branch matrix for measurement.** `session-prime` owns `startup`, `resume`, `clear`, `compact`, and unknown-source→startup variants. Startup emits Session Context + Recovery Tools + optional accepted Session Continuity; resume has known/unknown last-spec variants; clear is one Fresh Context section; compact has valid-cache, missing/stale-cache, quarantined-cache, optional Active Spec Folder, and Recovery Instructions variants. Startup/resume without continuity may append variable `Spec Memory CLI Fallback`; pressure-adjusted budgets and cached payloads make those branches data-dependent. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:40-102,150-223,225-254,277-296,303-364]
3. **Repository-configured per-user-turn order is advisor/directives first, conditional Gate 3 second.** The first group executes compiled Codex `user-prompt-submit.js`; it validates `prompt`, spawns Claude's advisor owner, parses that JSON envelope, and re-emits only its nonblank `additionalContext`. The second group runs the Codex Gate-3 source adapter and emits the shared question only when `classifyIntent()` returns one. Host composition is therefore two independent blocks in configuration order, not one combined template. [SOURCE: .codex/hooks.json:33-52] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/user-prompt-submit.ts:15-23] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/shared.ts:137-149] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/spec-gate-classify.mjs:40-64]
4. **The advisor path has the same exact visible variants as Claude because Codex delegates to that owner.** Normal output is a live/stale single recommendation or ambiguous two-recommendation line, followed by `Directives:` and the exact hygiene, governor, and proof directives. Non-renderable results become directives-only. Disabled advisor, invalid payload, missing prompt, uncaught owner exception, invalid child JSON/envelope, child failure, or timeout yields no Codex output. The owner currently passes `runtime: 'claude'`, so token fixtures should treat Codex as transport parity rather than a separately scored advisor runtime. [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:154-257] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,156-215] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/shared.ts:94-119,137-149]
5. **Gate 3 is conditional and session-scoped, with fixed exact bytes when present.** The Codex classifier extracts prompt/session/project directory, then the shared core either parses an answer to an open gate or opens a gate on mutation intent. Disabled/child/no-question paths and malformed input fail open silently. The model-visible measurement variant is the five-line `GATE_3_QUESTION`; it must be measured separately from the advisor block and from the distinct PreToolUse denial/advisory text. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/spec-gate-classify.mjs:40-64] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:59-76,79-87,103-119]
6. **Configured and installed-live Codex hooks currently diverge materially.** Codex reads user-global `~/.codex/hooks.json`, populated outbound by the installer, rather than the repository file. The observed `--check` reports `missing=8, orphaned=7`; the installed per-turn advisor is current, but installed Gate 3 still points to removed `system-spec-kit/runtime/...` and therefore resolves through the command's fixed warning fallback. Installed SessionStart likewise has current `session-start`, worktree, and git checks, but stale dist-staleness plus two third-party groups ahead of repository-owned hooks. Consequently current live per-turn behavior is advisor/directives followed by the resolver-warning string on every turn, not conditional Gate 3. [SOURCE: .codex/SYNC.md:14-18,49-69,106-117] [SOURCE: /Users/michelkerkmeester/.codex/hooks.json:67-113,151-177] [SOURCE: command `node .opencode/bin/install-codex-hooks.mjs --check`: exit 1, missing=8, orphaned=7]
7. **The resolver warning is a command-level fallback shared by every configured hook, not an adapter template.** Each command uses `cd` to the installed absolute repository anchor and `primary || printf` the exact envelope text `mk codex hook could not resolve; re-run the codex hooks installer with --check`. It appears on missing paths and any nonzero command, but not on adapter-internal fail-open paths that exit zero silently. Exact measurement therefore needs separate repository-configured and installed-live matrices: SessionStart source/cache/pressure branches; advisor single-live, single-stale, ambiguous, directives-only, silence; Gate-3 question/silence; resolver warning; and possible maintenance/third-party outputs captured independently. [SOURCE: .codex/hooks.json:3-48] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/shared.ts:114-118,156-163] [SOURCE: .codex/SYNC.md:94-95]

## Ruled Out
- Treating repository `.codex/hooks.json` as proof of currently installed behavior; the outbound global file is authoritative and is drifted.
- Counting adapter-internal failures as resolver warnings; most adapter failures exit zero silently, so shell `||` is not reached.
- Treating the SessionStart maintenance commands or third-party installed hooks as deliberate Spec Kit context without captured output.

## Dead Ends
None. Static source plus the read-only outbound drift check answered the focus; host transcript delivery/order still needs a dedicated capture.

## Edge Cases
- Ambiguous input: “observed resolver warning” was interpreted as the fixed `mk codex hook could not resolve...` envelope; the live drift check confirms why it currently appears for the stale Gate-3 path.
- Contradictory evidence: source comments claim hooks fire live, while the installed global file shows only some current paths. Resolution: distinguish adapter capability from installed entrypoint state.
- Missing dependencies: no captured Codex transcript was available; configured and installed order are proven, but host rendering of multiple outputs remains unobserved.
- Partial success: none; the static and installed inventories are complete for SessionStart and UserPromptSubmit.

## Sources Consulted
- `.codex/hooks.json:3-52`
- `/Users/michelkerkmeester/.codex/hooks.json:67-113,151-177`
- `.codex/SYNC.md:14-18,49-69,94-117`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/codex/{session-start.ts,user-prompt-submit.ts,shared.ts,spec-gate-classify.mjs}`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:154-257`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,156-215`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:40-102,150-223,225-364`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:59-119`
- `node .opencode/bin/install-codex-hooks.mjs --check` (exit 1)

## Assessment
- New information ratio: 1.00
- Questions addressed: exact Codex SessionStart/per-turn inventory; ownership; ordering; fallbacks; configured-versus-live state; token-fixture variants
- Questions answered: Codex static and installed-live behavior is mapped; exact byte/token counts and observed host transcript delivery remain.

## Reflection
- What worked and why: tracing repo registration → outbound installed registration → Codex transport → shared owner exposed the drift that source-only inspection misses.
- What did not work and why: broad test grep was noisy and did not supply a live transcript; narrow source anchors and installer diagnostics were stronger evidence.
- What I would do differently: capture raw stdout and a real Codex transcript for one controlled fixture per variant, then tokenize the extracted `additionalContext` bytes.

## Recommended Next Focus
Build a deterministic token-measurement harness and fixture corpus for the exact Codex variants above, recording configured-source counts separately from currently installed-live counts; include the resolver warning as the present Gate-3 live fallback until the outbound install is repaired.
