# Iteration 7: PreCompact → PostCompaction substitution

## Focus

Determine whether Claude's `compact-inject.js` can serve Devin's `PostCompaction` event, what context must be emitted after compaction, and how the repository's OpenCode compaction/system transforms affect the port verdict.

## Actions Taken

- Re-read the iteration state and strategy before investigating this focus.
- Read `.claude/settings.json`, the Claude `compact-inject.ts` source, its state/cache path, the `SessionStart(source=compact)` consumer, the compact-merger, and the precompact tests.
- Read the OpenCode plugin catalog plus the actual registrations in `mk-code-graph.js`, `mk-dist-freshness-guard.js`, and `mk-skill-advisor.js`.
- Cross-checked Devin's current lifecycle-hook documentation for `PostCompaction`, its `summary` stdin field, hook output, and Claude-settings import.
- No production hook, plugin, adapter, or configuration file was changed.

## Findings

### 1. `compact-inject.js` is not drop-in compatible with Devin `PostCompaction`

The Claude registration invokes `compact-inject.js` on `PreCompact` (`.claude/settings.json:79-89`). The handler currently:

1. reads `session_id`, `transcript_path`, and `trigger` from Claude stdin (`compact-inject.ts:561-578`);
2. tails the transcript and builds a baseline plus enriched compact brief (`compact-inject.ts:580-607`);
3. writes the result to `pendingCompactPrime` in per-session hook state (`compact-inject.ts:480-502`); and
4. deliberately emits no stdout, leaving `SessionStart(source=compact)` to inject the cached payload later (`session-prime.ts:47-109, 394-439`).

Devin `PostCompaction` supplies `session_id` and a `summary` field, which may be null; it does not supply Claude's `transcript_path`, `trigger`, or a `source=compact` SessionStart signal. The current handler would therefore accept the JSON syntactically but ignore the summary, see no transcript tail, cache an empty or nearly empty brief, and wait for a Claude-specific follow-up event. That is a transport and lifecycle failure, not parity.

**Verdict:** the compact-inject policy and merger are reusable, but the Claude `PreCompact` registration is **needs adaptation** for Devin. Exact `PreCompact` timing cannot be preserved: Devin can only recover context after compaction has completed.

### 2. Required Devin post-compaction context

The Devin adapter should treat `summary` as an explicit post-compaction source, not masquerade it as a transcript tail. The minimum useful payload is:

- the compactor-produced summary, retained as the first recovery section;
- authoritative continuity rehydrated from the active session/spec state, including active spec folder, current files or structural status, constraints, and next safe action;
- a bounded `memory_context(mode=resume)` or equivalent fallback when `summary` is null, stale, or incomplete;
- provenance and semantic-safety filtering equivalent to the existing pending-compact validation before model-visible injection; and
- a direct Devin `hookSpecificOutput.additionalContext` response tagged `PostCompaction`, subject to live output smoke testing because the lifecycle page promises re-injection but the general output table only enumerates `additionalContext` examples for other events.

The current `buildMergedCompactResult(transcriptLines)` path can be generalized to accept a summary-plus-state input. Passing `[summary]` as if it were transcript JSONL is technically possible but loses the source distinction and only lets the existing extractors discover incidental paths/topics. The adapter should not depend on that accidental behavior.

The authored continuity snapshot may still be useful after compaction, but its current `precompact-hook` actor label and transcript-derived spec-folder discovery are pre-event assumptions (`compact-inject.ts:504-515, 518-559`). A Devin adapter should derive the folder from the post-compaction summary or persisted session state and record the post-compaction provenance separately.

### 3. OpenCode comparison and repository correction

The prompt's phrase “`experimental.chat.compacting` transform used by `mk-code-graph.js`, `mk-dist-freshness-guard.js`, and `mk-skill-advisor.js`” does not match this checkout:

| OpenCode surface | Actual registration | Relationship to Devin `PostCompaction` | Verdict |
|---|---|---|---|
| `mk-code-graph.js` | `experimental.session.compacting`, `.opencode/plugins/mk-code-graph.js:486-512` | Runs during OpenCode compaction and mutates `output.context[]` with the shared transport plan's compaction block. This is the closest analogue to Claude's before-compaction preservation, but it is an OpenCode plugin callback, not a Devin command hook. The shared compaction payload is reusable behind a Devin adapter; the plugin factory and output container are not. | **Needs adaptation** |
| `mk-dist-freshness-guard.js` | `experimental.chat.system.transform`, `.opencode/plugins/mk-dist-freshness-guard.js:223-232` | Not compaction-specific. It injects a bounded stale-dist warning into every OpenCode system transform. Devin should preserve this as prompt/session context, not reinterpret it as a one-time post-compaction callback. | **Needs adaptation**, but not as a PostCompaction port |
| `mk-skill-advisor.js` | `experimental.chat.system.transform`, `.opencode/plugins/mk-skill-advisor.js:780-862, 901` | Not compaction-specific. It needs the current user prompt or recent session messages to query the advisor. Devin's PostCompaction `summary` is not an equivalent prompt input. Keep it on a prompt-driven Devin adapter, not on PostCompaction. | **Needs adaptation**, but not as a PostCompaction port |

The OpenCode transport explicitly labels its compaction block as a continuity note to inject “across compaction” (`.opencode/skills/system-spec-kit/mcp-server/lib/context/opencode-transport.ts:258-270`). That supports reusing the underlying continuity payload, but it does not erase the lifecycle difference: OpenCode receives a mutable pre/post-compaction output container during the compaction callback; Devin exposes a command stdin payload after compaction.

### 4. Native Claude import cannot substitute for this adapter

`read_config_from.claude:true` can discover the existing `.claude/settings.json`, but it does not:

- rename `PreCompact` to Devin `PostCompaction`;
- map Devin's `summary` into the handler's `transcript_path`/session-state model;
- change the handler from cache-only stdout behavior to Devin's context envelope;
- synthesize Claude's later `SessionStart(source=compact)` event; or
- import OpenCode plugin factories and transforms.

Native import is therefore a compatibility probe, not a solution. The implementation should make an explicit `.devin/hooks.v1.json` `PostCompaction` adapter authoritative, while retaining the Claude registration only for Claude sessions. Whether Devin ignores, warns on, or rejects the unsupported imported `PreCompact` entry remains a live `/hooks` question.

## Questions Answered

- **Q1:** Refined. `compact-inject.js` requires Claude's transcript path and pre-compaction timing, caches instead of emitting, and relies on `SessionStart(source=compact)` for delivery.
- **Q2:** Refined. This checkout has one compaction-specific OpenCode registration (`experimental.session.compacting` in `mk-code-graph.js`); the dist-freshness and skill-advisor plugins use per-turn system transforms, not a `chat.compacting` hook.
- **Q3:** Refined. Devin `PostCompaction` fires after successful compaction and supplies `summary`, which may be null; its documented purpose includes re-injecting lost context.
- **Q4:** Answered for this focus. The Claude handler and OpenCode compaction payloads are **needs adaptation**; exact before-compaction timing is unavailable, but the recovery behavior remains implementable after compaction. The two system-transform plugins need their own prompt/session adapters rather than a PostCompaction mapping.
- **Q5:** Answered for this focus. Native Claude import cannot supply the event rename, summary mapping, direct context output, or OpenCode plugin behavior.
- **Q6:** Added the lifecycle-specific rationale and the corrected OpenCode registration table for ADR-001.

## Questions Remaining

- Run authenticated Devin `/hooks` in this repository and record whether imported `PreCompact` is ignored, warned on, or rejected.
- Smoke-test whether a Devin `PostCompaction` command's `hookSpecificOutput.additionalContext` is injected when tagged with `PostCompaction`, including the null-summary case.
- Confirm whether Devin fires a `SessionStart` or `UserPromptSubmit` immediately after compaction; the adapter must not rely on a Claude-only follow-up event without evidence.
- Confirm the exact Devin process cwd and representative stdout/exit handling for the new adapter before implementation freezes the wrapper contract.

## Sources Consulted

- `.claude/settings.json:79-89`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/compact-inject.ts:317-451, 480-629`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:47-109, 394-439`
- `.opencode/skills/system-spec-kit/shared/compact-merger.ts:139-225`
- `.opencode/plugins/mk-code-graph.js:486-512`
- `.opencode/plugins/mk-dist-freshness-guard.js:188-233`
- `.opencode/plugins/mk-skill-advisor.js:780-901`
- `.opencode/skills/system-spec-kit/mcp-server/lib/context/opencode-transport.ts:258-270`
- [Devin lifecycle hooks](https://docs.devin.ai/cli/extensibility/hooks/lifecycle-hooks)
- [Devin hooks overview and import behavior](https://docs.devin.ai/cli/extensibility/hooks/overview)

## Assessment

`newInfoRatio`: **0.90**. This iteration converts the earlier generic “PreCompact has no equivalent” observation into a handler-level verdict: direct reuse ignores Devin's `summary` and never injects context, while a bounded post-compaction adapter can preserve the intent with reduced timing fidelity. It also corrects the OpenCode registration premise against the live tree and the current Devin lifecycle page.

Confidence is high for the source/payload mismatch and the OpenCode registration inventory. Confidence is medium for the exact Devin `PostCompaction` stdout injection envelope until `/hooks` is run in an authenticated session; the official lifecycle text promises re-injection but does not show a PostCompaction output example.

## Reflection

The most productive evidence was tracing the complete Claude cache-to-SessionStart path rather than comparing event names alone. The ruled-out direction is a pure import or unchanged command: it preserves neither Devin's post-event timing nor its context-delivery path.

## Recommended Next Focus

Iteration 8 — live `/hooks` inspection and representative `PostCompaction` stdout/exit smoke tests, including imported Claude settings and the null-summary case.

## SCOPE VIOLATIONS

None. Only this iteration narrative, the append-only state-log record, and this iteration's delta file are written.
