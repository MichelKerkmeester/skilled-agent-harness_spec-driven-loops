# Iteration 7: SessionStart context and Pi-only subagent dispatch policy

## Focus

Traced ownership, exact text/size, lifecycle frequency, state, resume/restart/compaction behavior, overlap, and cross-runtime equivalents. Explicit dispatch focus overrides stale strategy prose. Route proof: `mode=research target_agent=deep-research`; definition loaded. Executor: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`. Write root: `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`.

## Findings

1. **SessionStart is canonically owned by `session-prime.ts`.** It builds Session Context, Recovery Tools, and optional Session Continuity; main selects startup/resume/clear/compact, adds optional warm fallback, pressure-adjusts, formats, truncates, and emits. Claude calls it; Codex/Cursor/Devin proxy it; Pi's canonical adapter (the `.pi` path is a symlink) maps resume/fork to resume and other reasons to startup, then sends hidden context. OpenCode has no one-shot equivalent; continuity is a recurring transform. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:176-223,303-364] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/{codex,cursor,devin,pi}/session-start.ts] [SOURCE: iterations/iteration-001.md]

2. **Recovery is state-sensitive, not startup replay.** Startup accepts cached `startupHint` only after summary validation; resume emits last spec folder when known. Compact accepts a pending prime only within a 30-minute TTL and semantic validation, sanitizes/wraps it, then clears its identity after stdout handoff. Pi uses separate `session_compact` rehydration because its reason mapper cannot emit compact; fork uses resume. Restart/new session recomputes startup, resume/fork uses state pointers, compaction uses dedicated recovery. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:32-102,124-243,303-364] [SOURCE: .pi/extensions/README.md:65-70,106-137]

3. **One-time startup placement is quantitatively correct.** Canonical execution measured representative no-continuity startup at 389 UTF-8 bytes, 383 UTF-16 units, 12 lines, ~96 repository-estimated tokens. Startup/resume ceiling is 2,000 estimates (8,000 units); compact is 4,000. Ten-turn repetition would add 3,890 bytes/~960 estimates without fresher state. [SOURCE: iterations/iteration-003.md] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/shared.ts:13-16,74-79,111-118] [INFERENCE: ten-turn total is measured size ×10]

4. **Startup overlaps recurring blocks only in broad workflow recovery.** It lists memory tools but contains no advisor, three-directive capsule, Gate-3 menu, or Pi rule. Advisor and Gate 3 depend on current prompt/state. Startup can become contextually stale after packet changes; replay does not refresh it, so resume/compaction/retrieval should. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:150-223] [SOURCE: iterations/iteration-005.md] [SOURCE: iterations/iteration-006.md]

5. **The Pi rule belongs to the skill-advisor Pi hook and appends on every non-empty input, including advisor failure.** It defaults delegation to `pi-subagents` tools, permits `cli-*` only when this turn's user text names it, requires CLI skill preload, says advisor/model names are not requests, and forbids child-prompt copying. Exact size: 554 UTF-8 bytes, 552 UTF-16 units, one line, ~138 estimates; separators make 556 bytes/~139 per turn, or 5,560/~1,390 over ten turns. [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:7-29,40-56,64-106] [SOURCE: iterations/iteration-003.md] [INFERENCE: separator/ten-turn arithmetic]

6. **Pi needs extra arbitration because subagents are a project-installed community surface while the shared advisor independently recommends external CLI executors.** Without precedence, an advisor label such as `cli-devin` can be mistaken for user authorization. Global policy mandates CLI preload but does not default Pi to native plugin tools, distinguish signal from request, or prevent recursive copying. [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/references/agent-delegation.md:19-34,57-77] [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/references/mcp-and-third-party-packages.md:20-26,51-69] [SOURCE: AGENTS.md:62-67]

7. **Other runtimes receive pieces, not the exact capsule.** CLI preload is global; agent definitions and dispatch guards provide single-hop/nesting rules; Claude, Devin, Cursor, Codex, and OpenCode have their own delegation surfaces. Exact-clause search found the tuple only in the Pi owner, its test, injection-contract docs, and Pi lint test. No other runtime gets “Pi tools default + current-turn CLI override + advisor not authorization + no child copy” per turn. [SOURCE: .opencode/hooks/injection-contract.md:66] [SOURCE: .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts:124] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/prompt-advisor.vitest.ts:7] [INFERENCE: exact-clause search across six runtime roots]

8. **Split placement preserves safety with less repetition.** Put stable native-default/preload/no-copy clauses in durable Pi/root context; retain a short turn-sensitive line or enforce at dispatch: “Use external cli-* only when current user text explicitly requests it; advisor/model labels are not requests.” A 130-byte/~33-estimate form cuts recurring size 76.5%/76.1%. One full delivery amortizes to 55.4 bytes/13.8 estimates per turn over ten turns. Do not use startup-only until compaction/child tests pass: no emitted-session marker exists, and the child-copy clause is model guidance, not a child-session predicate. [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:15-29,49-56,103-106] [SOURCE: .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts:124] [INFERENCE: calculations use exact fixed size and stated candidate length]

## Structured Placement Assessment

| Surface | Frequency | State/dedup | Placement | Risk |
|---|---|---|---|---|
| Startup/recovery | lifecycle | recomputed | one-time | compaction loss |
| Compact recovery | compact event | TTL+validation+clear | lifecycle | runtime gaps |
| Pi stable default | every input | none | durable + dispatch check | child reload |
| Pi override/auth test | every input | raw input captured | short turn/tool check | false negative |

## Ruled Out

SessionStart as per-turn; startup replay as fresh retrieval; child-copy text as executable suppression; generic CLI preload as equivalent Pi arbitration; absence of exact capsule as absence of safety elsewhere.

## Dead Ends

Broad search entered benchmark/history payloads. Exact clauses and canonical roots replaced it. No live post-compaction receipt was available.

## Edge Cases

- Ambiguous input: canonical session-prime is SessionStart; OpenCode continuity is separate.
- Contradictory evidence: Pi SessionStart comment mentions compact, but actual compact uses a separate adapter.
- Missing dependencies: live receipts and authoritative tokenizers.
- Partial success: source behavior/cost established; post-compaction preservation untested.

## Negative Knowledge

No SessionStart block contains advisor/Gate/Pi policy. No ordinary-turn replay exists in five lifecycle runtimes. No Pi emitted-hash or child-session suppression exists. No other runtime gets the exact capsule. Startup-only survival across all compactions is unproven. Token figures are estimates.

## Sources Consulted

Canonical session-prime/shared files; six runtime adapters/registrations; Pi prompt-advisor and README; injection contract; Pi lint/tests; AGENTS; Pi delegation references; iterations 001-006.

## Assessment

- New information ratio: 0.88 (`(6 + .5×2)/8=.875`, rounded).
- Novelty: six new lifecycle/equivalence/placement findings; two partial refinements.
- Questions answered: ownership, cost, frequency, state, overlap, and equivalent semantics.
- Remaining: live post-compaction preservation.

## Reflection

Symlink-to-owner tracing and lifecycle-versus-turn separation worked. Broad equivalence search was noisy. Next time capture visible pre/post-compaction envelopes.

## Recommended Next Focus

Run six-runtime startup/resume/restart/compaction/child receipts. For Pi compare full every-turn, one-time full plus 130-byte recurring override, and tool-call enforcement; verify raw-user authorization and advisor-label non-authorization.

