# Iteration 5: The brief is one renderer, but health is one runtime

## Focus

The per-runtime half of the cost question: does the brief cost the same bytes on the plugin-shaped runtimes, and can OpenCode, Pi or DSH produce a health record at all? This bounds change 1's real coverage.

## Focus Selection Check

Strategy next focus named the per-runtime half after the implementation map. No exhausted approach applied. The pass reads three adapters and one constant table; it does not re-measure the Claude brief.

## Actions Taken

1. Read the OpenCode plugin's render path, its size caps and its directive-dedup mirror.
2. Read the Pi entry point to see whether it renders the brief or delegates.
3. Checked the plugin's returned metadata for the fields a health record would need, and for any timer.
4. Grepped the DSH plugin for a renderer or an `Advisor:` emitter.

## Findings

1. **Every runtime renders the same string from the same function.** The OpenCode plugin resolves the canonical renderer (`loadShadowRenderer`) and calls `renderAdvisorBrief` with the same options the hook passes, including the token cap and the threshold config; Pi re-exports the shared extension from the same skill; so for the same recommendation and freshness the emitted brief is byte-identical across runtimes. The per-runtime byte difference is zero, not a small number. [SOURCE: .opencode/plugins/system-skill-advisor.js:638-668] [SOURCE: .pi/extensions/prompt-advisor.ts:1]

2. **No runtime truncates a live brief.** The plugin's caps are 80 requested tokens (120 when ambiguous) and 2,048 brief characters, against a measured 296-byte median and an 80-token cap in the renderer, so a clamping path cannot fire on today's briefs. [SOURCE: .opencode/plugins/system-skill-advisor.js:47-56] [SOURCE: .opencode/plugins/system-skill-advisor.js:388-395]

3. **The steady-state cost is runtime-wide, not Claude-only.** The plugin carries its own copy of the directive-lifecycle rule: full brief on the first message of a session and after a lifecycle boundary, the dynamic `Advisor:` route line only on a same-content repeat. So OpenCode also pays 218 bytes once and the 78-byte head afterwards. [SOURCE: .opencode/plugins/system-skill-advisor.js:73-80]

4. **The plugin already has most of what health needs, and not the two fields that matter.** Its brief envelope carries `freshness`, `cacheHit`, `skillLabel` and `recommendationCount`, but no `durationMs`, and it has no writer at all. A health record there needs a timer around the CLI spawn plus a writer call — a new subsystem rather than a pass-through. [SOURCE: .opencode/plugins/system-skill-advisor.js:668-685]

5. **The Claude hook is the only adapter whose result already carries the timing.** `emitDiagnostic` receives `result.metrics.durationMs` and `result.metrics.cacheHit` directly, which is why change 1 is two lines there and a new subsystem on the plugin runtimes. [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:415-427]

6. **Change 1's coverage is four of six runtimes, and the limitation belongs in its own description.** Claude, Codex, Cursor and Devin share the hook adapter that emits diagnostics; OpenCode, Pi and DSH do not. An OpenCode-only user would still see no hook health after change 1, so the change removes the silent-empty case for the hook-shaped majority and not for everyone. [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:292-296]

## Questions Answered

- The per-runtime half of the cost question: zero byte difference for the same brief, and health is hook-adapter-only.

## Questions Remaining

- None in this lane. The cold-embedder sample stays a recorded gap.

## Ruled Out

- **A per-runtime head to save bytes on hosts that resolve commands themselves.** Rejected again on the measurement: every host already gets the same 78-byte head, and segment one's rank 7 (a document path in the head) is the opposite direction, an addition rather than a cut.
- **Extending change 1 to the plugin runtimes in the same change.** Rejected as scope: it needs a timer, a writer and a new test surface on three adapters, and it would turn a two-line default flip into a multi-adapter build.

## Dead Ends

- Looking for a DSH renderer or an `Advisor:` emitter in `.dsh/plugins/repo-guards/index.mjs` printed nothing, so DSH's brief arrives through the shared CLI path rather than a local renderer. That is consistent with the plugin finding and adds no separate cost.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none. Phase 013's claim that an OpenCode brief now names the command and policy is consistent with finding 1; this iteration adds that it also costs the same bytes.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.opencode/plugins/system-skill-advisor.js:47-56, 73-80, 388-395, 638-685`
- `.pi/extensions/prompt-advisor.ts:1`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:292-296, 415-427`
- `.dsh/plugins/repo-guards/index.mjs` (no renderer match)

## Assessment

- New information ratio: 0.58
- Questions addressed: per-runtime brief cost and health reachability
- Questions answered: the per-runtime half of KQ2

## Reflection

- What worked and why: following the renderer once answered the byte question for all six runtimes, because every adapter delegates. The same read showed the opposite for health: the fields are per-adapter, so coverage cannot be assumed from the brief.
- What did not work and why: grepping the DSH plugin for a renderer found nothing, which first looked like a gap. It is the expected shape — DSH consumes the shared CLI path — and the absence is the evidence.
- What I would do differently: check the adapter's returned metadata before proposing a default, because the pass-through argument only holds where the timing already exists.

## Recommended Next Focus

None: the lane's three questions are answered and the remaining work is synthesis.
