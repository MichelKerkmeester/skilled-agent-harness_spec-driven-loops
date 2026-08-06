# Iteration 11: Spec Gate 3 per-turn behavior, suppression, and safe deduplication

## Focus
Deep-audit Gate 3 across Claude Code, Codex, Cursor, Devin, OpenCode, and Pi: owners, trigger classes, exact payloads, silence/repeat behavior, root redundancy, risks, and measurable safe deduplication. The explicit dispatch focus overrides the reducer's generic next focus.

## Findings
1. **Policy has one classifier and one stateful core; six adapters only transport it.** The typed classifier owns normalization, 19 file-write tokens, three memory-save phrases, resume/deep-loop phrases, five read-only disqualifiers, binding validation, and `requiresGate3Prompt`. The core owns session state, answer parsing, fixed question/deny strings, suppression, and mutation evaluation. Claude/Codex/Devin emit `additionalContext`, Cursor `agent_message`, OpenCode `output.system`, and Pi rewrites visible input. [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:26-121,150-293] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:1-19,98-119,865-991] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/spec-gate-classify.mjs:51-67] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-classify.mjs:55-69] [SOURCE: .opencode/plugins/mk-spec-gate.js:186-217] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-classify.ts:7-49]
2. **Classification is lexical and asymmetric by design.** Write tokens produce `file_write_match`; save phrases produce `memory_save_match`; deep/resume phrases produce `resume_match`. Read-only words suppress only without a positive match: `review` is silent, but `review and fix` triggers on `fix`. Executed fixtures confirmed write, read-only, mixed, memory, resume, deep-research, no-match, and analysis outcomes. [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:150-293] [SOURCE: command `node --input-type=module` classifier fixture run]
3. **Exact payloads are distinct.** The A-E user question is 521 ASCII characters, 75 words, six lines. The enforce-mode Write/Edit deny is 149 characters, 27 words, one line. Advise-mode mutation can surface the full menu, so prompt-time and tool-time costs require separate measurement. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:98-119,1048-1057] [SOURCE: command `node --input-type=module` literal measurement]
4. **Repeat suppression is session-state, not prompt-hash, based.** First positive intent writes `open` and asks. While open, ordinary read-only/no-match turns are silent, but every later positive turn and incomplete/invalid/contradictory answer attempt re-asks. Valid binding stores `satisfied`; E/skip stores `skipped`; both suppress later questions. Disabled, exact `AI_SESSION_CHILD=1`, and internal-error paths emit nothing. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:882-989] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs:48-280,1633-1706]
5. **No-output shapes differ by runtime.** Claude/Codex/Devin exit silently on invalid/no-question results, with Devin additionally requiring a nonblank session id. Cursor always emits allow JSON even without a question and its configured prompt event remains unproven live. OpenCode emits nothing without transform output or a recoverable prompt; Pi returns `continue`. OpenCode may classify the fetched last user message on every model transform; Pi sanitizes chained advisor/history text first. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/spec-gate-classify.mjs:28-67] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/spec-gate-classify.mjs:25-64] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/spec-gate-classify.mjs:24-70] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-classify.mjs:32-69] [SOURCE: .opencode/plugins/mk-spec-gate.js:186-217] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-classify.ts:9-48]
6. **Root instructions overlap semantically but are not a functional substitute.** Root policy contains the authoritative classifier pointer, richer A-E routing, recommendation order, phase qualification, session carry-over, and child exemption. The short hook menu is a relay plus persisted interruption/enforcement state. Deleting it loses machine timing; repeating root prose would be larger and conflict with the core's bounded answer grammar. [SOURCE: AGENTS.md:144-165] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:103-119,457-585] [INFERENCE: prose supplies semantics while the hook supplies event timing and state]
7. **Safe reduction is edge-triggering, not deletion or timer suppression.** Preserve first-positive ask, invalid/incomplete answer re-ask, explicit new/different task or folder, lifecycle recovery, and mutation-time advise/deny. Suppress unchanged positive prompts while the same gate remains open, leaving enforcement intact. Key dedup by session, gate status, normalized trigger class, and task/scope generation; invalidate on answer, task/scope change, compaction/recovery, or eviction. Never share dedup under unknown-session fallback. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:125-145,179-220,966-979,1035-1057] [SOURCE: AGENTS.md:164-165] [INFERENCE: edge-triggering retains ask-before-write because open state and enforcement remain]
8. **An exact fixture matrix makes the change measurable.** Cross `{file-write,memory-save,resume,mixed,pure-read-only,no-match}` with `{closed,open,satisfied,skipped}`; answers `{valid,bare A-D,invalid,E/skip,contradictory,ordinary letter-led}`; lifecycle `{first,unchanged positive,read-only open,new task,recovery,child,disabled,corrupt}`; mutations `{Write,Edit,Patch,apply_patch,Bash} x {advise,enforce}`. Per adapter assert exact envelope/zero-output shape, 521-byte question, and 149-byte deny. Acceptance is zero loss in first ask, answer re-ask, cross-session isolation, and Write/Edit advise/deny. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs:48-280] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/gate-3-classifier.vitest.ts:197-356] [SOURCE: .opencode/plugins/tests/mk-spec-gate.test.cjs:86-175,356-403] [INFERENCE: matrix covers every observed state and transport boundary]

## Ruled Out
- SessionStart-only Gate 3: classification depends on the current turn.
- Deletion because AGENTS.md overlaps: loses machine-timed relay and open state.
- Time-only or prompt-only deduplication: can suppress a legitimate scope change.
- Treating Cursor registration as observed delivery.

## Dead Ends
Static source cannot establish Cursor editor delivery or Pi cross-extension order; retain configured-versus-live fixtures.

## Edge Cases
- Ambiguous input: suppression applies only to repeated question delivery; enforcement stays intact.
- Contradictory evidence: the injection contract says “once per session until answered,” but the core re-asks on later positive triggers while open; core and tests define current behavior. [SOURCE: .opencode/hooks/injection-contract.md:69-83] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:932-979]
- Missing dependencies: no six-host transcript capture; Cursor delivery remains unverified.
- Partial success: static behavior, payloads, risks, strategy, and fixtures are complete; host delivery/token totals remain.

## Sources Consulted
- [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:26-293]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:1-220,457-585,865-1057]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs:48-280,1633-1706]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/spec-gate-classify.mjs:28-67]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/spec-gate-classify.mjs:25-64]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-classify.mjs:32-69]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/spec-gate-classify.mjs:24-70]
- [SOURCE: .opencode/plugins/mk-spec-gate.js:34-113,186-258]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-classify.ts:7-49]
- [SOURCE: .opencode/hooks/injection-contract.md:44-83]
- [SOURCE: AGENTS.md:144-165]
- [SOURCE: command `node --input-type=module` classifier and payload fixtures]

## Assessment
- New information ratio: 1.00
- Questions addressed: ownership, classifications, payloads, silence, repeats, redundancy, risks, safe dedup, exact fixtures.
- Questions answered: all static Gate 3 questions; live host capture and token totals remain.

## Reflection
- What worked and why: classifier → state core → adapters separated policy, cadence, and transport; executable fixtures anchored trigger/payload claims.
- What did not work and why: source/config cannot prove host delivery, especially Cursor.
- What I would do differently: capture first, repeated-positive, answer, and mutation transcripts on every installed host before changing cadence.

## Recommended Next Focus
Run the Gate 3 baseline matrix on all six hosts and model edge-triggered savings, requiring zero regression in first ask, invalid-answer re-ask, cross-session isolation, and Write/Edit advise/deny.

