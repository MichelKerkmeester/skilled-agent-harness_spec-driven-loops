# Iteration 5: Gate-3 injection end-to-end across six runtimes

## Focus

Audited Gate 3 from the shared lexical classifier through session-state handling, six runtime adapters, question construction, repetition behavior, and positive/negative payload cost. The selected interpretation is the model-visible question path plus its state/enforcement dependencies; this iteration does not rank a final redesign.

Route proof: `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, resolved route `Resolved route: mode=research target_agent=deep-research`. Executor provenance: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`. Write authority was restricted to `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`.

## Findings

1. **The classifier is a deterministic lexical guard, not an operation-aware planner.** Its canonical vocabulary contains 19 file-write tokens, three memory-save phrases, a broad resume/deep-loop list, and five read-only disqualifiers. Pure execution against the compiled classifier observed: `fix the login bug`, `save memory`, and `continue iteration` trigger; `review the auth module`, `explain the deep research results`, `create a stronger system prompt inline`, and `do not edit files` do not; `review then fix src/app.js` triggers through the mixed-write-tail recovery. This gives the guard real low-cost coverage while retaining lexical false-positive/negative risk: a mutation request without a listed verb is invisible, while broad resume terms need special read-only recovery. [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:150-246] [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:770-843] [SOURCE: local Node execution of shared/dist/gate-3-classifier.js on eight named cases, 2026-08-06]

2. **Read-only suppression is more nuanced than the prose contract and is source-observed, not inferred.** Memory-save always wins; resume triggers can be suppressed when a read-only term appears without a workflow invocation marker or recoverable write tail; ordinary file-write terms are suppressed by read-only terms unless the classifier finds a later/direct write tail. Negated writes and prompt-only generation are separately suppressed. The current source comments at lines 762-767 overstate that resume is always required, while the executable branch at lines 815-819 permits suppression—an internal staleness defect that can mislead future audits even though runtime behavior is deterministic. [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:757-768] [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:805-835]

3. **Session state already provides strong terminal deduplication and same-turn binding.** Before classification, the core parses an open-gate answer, persists `skipped` or a validated `satisfied` binding, and returns no question. Existing terminal state short-circuits every later turn. A triggering prompt that names a valid spec folder self-binds on the same turn; trusted interactive prior answers and bounded autonomous command contracts can also satisfy without prompting. These paths eliminate the entire 521-byte question after establishment, and mirrored Claude/Codex tests explicitly assert byte-stable terminal state across repeated classification. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:909-969] [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:652-683] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/spec-gate-codex.test.mjs:206-224] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/spec-gate-claude.test.mjs:206-224]

4. **The remaining repetition is open-epoch repetition, and OpenCode has an extra same-message risk.** Once state is `open`, every later positive-classified prompt returns the full question again; a non-triggering/read-only turn stays silent, while a malformed answer-shaped turn deliberately re-asks. This is partial dedup, not no dedup. Claude, Codex, Devin, and Pi classify once per registered prompt/input event. OpenCode's system transform has no prompt field, fetches the last user message from session history, and classifies it each time the transform runs; if the same positive last-user message is observed on multiple transforms before an answer, it can append the same question repeatedly. That OpenCode repetition is inferred from the recurring transform and fetch path; no live multi-transform receipt was present. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:966-979] [SOURCE: .opencode/plugins/mk-spec-gate.js:186-215] [INFERENCE: repeated OpenCode receipt follows when multiple system transforms fetch the unchanged positive last-user message before terminal state]

5. **Five runtimes share policy but not transport; Cursor is materially different.** Claude, Codex, and Devin pass native prompt/session fields to thin adapters that call the same core and emit `additionalContext`; Pi sanitizes chained sibling/history text, derives a stable session key from session ID/file, and appends the question to transformed user text. OpenCode fetches the last user message and pushes the question into `output.system`. Cursor configures `beforeSubmitPrompt`, but repository evidence says that event does not deliver in the tested CLI; its confirmed path is `sessionStart` prebinding, which either satisfies from `MK_SPEC_FOLDER` or opens only when explicit enforcement is enabled. Therefore Cursor's configured positive cost is 521 bytes but observed prompt-injection cost remains zero, and it cannot use interactive question delivery as its primary guard. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/spec-gate-classify.mjs:40-65] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/spec-gate-classify.mjs:40-64] [SOURCE: .devin/hooks.v1.json:34-47] [SOURCE: .pi/extensions/spec-gate-classify.ts:9-47] [SOURCE: .opencode/plugins/mk-spec-gate.js:195-215] [SOURCE: .cursor/hooks.json:4-18] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-prebind.mjs:7-18] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-prebind.mjs:70-96]

6. **The autonomous-child exemption is centralized and stronger than a text-only bypass.** `AI_SESSION_CHILD=1` returns closed before any classify state read/write and returns allow before mutation telemetry or enforcement. All adapters pass their environment into the shared core; Pi and Cursor also explicitly preserve the child behavior. This is high-value redundancy avoidance because a leaf has no interactive user turn to answer the menu. However, the local framework prose also names `MK_SPEC_GATE_ENFORCE=0` as a child-dispatch exemption, while executable core checks only `MK_SPEC_GATE_DISABLED=1` and `AI_SESSION_CHILD=1`; `MK_SPEC_GATE_ENFORCE=0` merely leaves denial off and does not suppress classification/question injection. That contract/code mismatch is observed and should not be papered over as equivalent behavior. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:62-76] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:895-907] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:1022-1029] [SOURCE: .pi/extensions/spec-gate-classify.ts:28-36] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-prebind.mjs:52-55] [SOURCE: AGENTS.md Gate 3 autonomous child-dispatch exemption]

7. **Positive cost is exactly 521 bytes/characters, six lines, repository-estimated 131 tokens; every suppressed or satisfied case is exactly zero.** The question is an ASCII fixed constant, so UTF-8 bytes, Unicode characters, and UTF-16 units are all 521. Local execution measured the exported constant and the compiled classifier: positive unresolved cases pay 521/131 each emission; read-only, negated-write, prompt-only, disabled, child, satisfied, skipped, and valid self/prebound cases emit no question. At ten unresolved positive turns the repeated question alone is 5,210 bytes and about 1,310 repository-estimated tokens; this multiplication is arithmetic, not a live billing claim. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:103-112] [SOURCE: local Node measurement using Buffer.byteLength and ceil(UTF-16/4), 2026-08-06] [INFERENCE: ten-turn cost is 10 times the measured fixed payload]

8. **The menu preserves a meaningful safety boundary but is stale against the current richer Gate-3 policy.** The runtime constant offers A existing, B new, C related, D phase, E skip; it does not carry the current policy's recommendation order, phase-qualification thresholds, or distinction between “extend phased packet” and generic “use a phase folder.” Its boundedness is valuable—no matched prompt content is echoed—and enforcement has a separate model-facing denial string. Yet injecting an underspecified menu on every unresolved positive turn does not add new information. A safe conditional/dedup opportunity is to preserve the first positive emission and invalid-answer re-ask, suppress identical subsequent positive emissions while the same open epoch remains unchanged, and rely on the pre-tool deny/advisory as a terminal reminder. OpenCode additionally needs a per-session last-classified-message ID/hash so repeated transforms of the same user message do not re-emit. These are proposals requiring runtime receipt tests, not final recommendations. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:103-119] [SOURCE: AGENTS.md Gate 3 options and recommendation order] [INFERENCE: epoch/message dedup preserves first ask and enforcement while removing unchanged repeated payload]

## Structured Guardrail Assessment

| Surface | Guardrail value | Redundancy/staleness | Safe conditional/dedup candidate |
|---|---|---|---|
| First unresolved positive prompt | High: forces documentation-scope choice before mutation | Menu omits current routing nuance | Preserve |
| Repeated positive while state remains `open` | Low incremental value | Identical 521-byte question | Suppress until state/message changes; retain invalid-answer re-ask |
| Read-only/non-trigger turn | None | Already suppressed | Preserve zero-cost path |
| Satisfied/skipped/self-bound/prebound | None | Already terminal-deduped | Preserve zero-cost path |
| Autonomous child | Harmful if emitted: cannot answer | Code correctly suppresses on `AI_SESSION_CHILD=1`; prose mismatch for enforce=0 | Align executable and documented exemption semantics |
| OpenCode repeated transform of same message | No incremental value | Same fetched prompt may classify repeatedly | Dedup by session + last user message identity/hash |
| Cursor prompt question | Configured but unavailable in observed CLI | Prebind/enforce is actual path | Do not budget configured question as observed cost |

## Ruled Out

- Treating Gate 3 as unconditionally repeated on every turn: read-only turns are silent and terminal states deduplicate.
- Treating `MK_SPEC_GATE_ENFORCE=0` as equivalent to the executable child exemption: it disables denial but does not close classification.
- Charging Cursor 521 bytes as observed cost: its configured prompt event remains non-delivering in the tested CLI.
- Recommending deletion of the first question: it is the only user-facing scope-choice boundary before enforcement.
- Treating OpenCode repeated-transform duplication as observed fact: source makes it possible, but no live multi-transform receipt was available.

## Dead Ends

- Broad greps across all hook tests produced generated/history noise. Narrow core, adapter, registry, and named process-test anchors were sufficient.
- Running stateful process tests was unnecessary and would create temporary workspaces outside the authorized packet; existing process-test assertions plus pure compiled-classifier execution supplied the needed evidence.

## Edge Cases

- Ambiguous input: “dedup” could mean terminal-state suppression or suppression within an unresolved open epoch; both are separated.
- Contradictory evidence: framework prose exempts `MK_SPEC_GATE_ENFORCE=0`, but executable code exempts only disabled/child; unresolved until the intended contract is chosen.
- Missing dependencies: no live combined receipt for Claude, Codex, Pi, or OpenCode, and no OpenCode multi-transform trace.
- Partial success: classifier outputs and fixed costs are executed/observed locally; live runtime delivery remains inferred except previously probed Cursor/Devin evidence.

## Negative Knowledge

- No evidence supports suppressing the first unresolved positive question.
- No evidence shows a per-open-epoch question-emitted flag or per-message hash in core state.
- No evidence shows OpenCode deduplicating Gate 3 within `output.system` or across transforms.
- No evidence supports counting registered Cursor `beforeSubmitPrompt` bytes as paid model context.
- No exact model-token count is available; 131 is the repository-native `ceil(UTF-16/4)` estimate.

## Sources Consulted

- `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:150-246`, `:652-683`, `:757-843`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:62-76`, `:103-119`, `:882-1058`
- Claude/Codex/Devin classify adapters and runtime registries
- `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-prebind.mjs:7-96`; `.cursor/hooks.json:4-18`, `:79-89`
- `.pi/extensions/spec-gate-classify.ts:9-47`
- `.opencode/plugins/mk-spec-gate.js:186-258`
- Claude/Codex/Cursor/Devin process-test anchors for child, read-only, open, and terminal-repeat cases
- Local compiled-classifier and fixed-string measurement output, 2026-08-06

## Assessment

- New information ratio: 0.94 (`(7 fully new + 0.5 × 1 partially new) / 8 = 0.9375`, rounded to 0.94; no simplicity bonus)
- Novelty justification: Seven findings add Gate-3 state-machine, exemption, staleness, runtime-difference, and open-epoch dedup evidence; one partially refines prior payload and delivery measurements.
- Questions addressed: end-to-end Gate-3 ownership and transport; positive/negative cost; value, redundancy, staleness, and conditionalization.
- Questions answered: source-level behavior and fixed cost are established across all six runtimes; universal live receipt and intended enforce=0 exemption semantics remain open.

## Reflection

- What worked and why: combining pure classifier execution with narrow state-machine and adapter reads separated actual outputs from transport inference without mutating runtime state.
- What did not work and why: broad test enumeration was noisy and live receipts were absent for four runtimes.
- What I would do differently: instrument message IDs and emitted system entries in a controlled OpenCode run, then capture first/repeat/answer/read-only envelopes for each live runtime.

## Recommended Next Focus

Run a controlled receipt matrix for Gate 3: first positive, repeated positive while open, intervening read-only, invalid answer, valid binding, child session, and post-compaction. Prioritize OpenCode same-message multi-transform behavior and resolve whether `MK_SPEC_GATE_ENFORCE=0` is intended to suppress classification or only denial before ranking any dedup change.
