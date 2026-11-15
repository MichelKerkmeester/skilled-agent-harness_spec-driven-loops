---
title: "Session Lifecycle: Vibe Adapters"
description: "The Vibe session_start, pre_agent and post_agent adapters: one entry composes the packet goal slice, the session-prime context, the startup-guard warnings and the stale-dist warning, one composes the pending completion advisory, the compaction context, the turn-start advisor brief and the hand-over context, and one runs the turn-end completion, ask-surface and hand-over parts. A post_tool binding re-injects the compaction context mid-turn and carries the hand-over context."
trigger_phrases:
  - "vibe session lifecycle"
  - "vibe session start context"
  - "vibe session_start hook"
  - "vibe turn start composer"
  - "vibe turn end composer"
version: 1.3.0.0
---

# Session Lifecycle: Vibe Adapters

---

## 1. OVERVIEW

`vibe/` holds the Vibe session-start, turn-start and turn-end adapters. `session-start.mjs` is the only `session_start` entry in `.vibe/hooks.toml`, `turn-start.mjs` the only `pre_agent` composer, and `turn-end.mjs` the only `post_agent` entry. All three answer with `{"hook_specific_output":{"additional_context": "..."}}`, and `turn-end.mjs` may answer with one `{"decision":"deny","reason":"..."}` instead.

The session-start context is composed in a fixed order: the bound packet's goal `chat_slice`, the session-prime context, the startup-guard warnings from `.vibe/plugins/repo-guards/session-cleanup.mjs`, and the `check-dist-staleness.sh --all` warning. Each part is skipped when it is empty or when it fails. The hook never blocks and always exits 0.

The turn-start context is composed the same way, over a part list that later turn-start concerns join instead of registering their own `pre_agent` entry. Its first part delivers a pending completion advisory from the previous turn and deletes its file, so the advisory reaches the model exactly once. Its second part is the compaction detector, which re-injects the goal slice, the history lookup offer and the open handoff pointer when the journal holds a compaction the session has not seen. Its third part is the skill advisor brief, built by `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` under the `vibe` runtime label. A blank prompt, a dispatched child (`AI_SESSION_CHILD=1`) and a subagent (`parent_session_id` set) get no advisor brief. The shared handler's file-backed directive store sends the constant `Directives:` block once, and a per-session head receipt sends the routing head only when it changed. The hand-over context runs last, so its claim seed, withdrawal notice or nudge text ends the context. At a turn start it expands a claim seed, or withdraws an armed hand-over when the operator types, and otherwise it nudges once the fill passes the threshold. The entry stays separate from `spec-gate-classify`, so a composer failure cannot open the spec gate.

Vibe has no compaction event, so `compaction-context.mjs` reads the compaction from the session journal. `compactionsSince` lists the entries after a per-session watermark under the session folder's `.skilled/skills/.state/vibe-compaction/`, the checkout's only when the payload names no folder; a compaction id already injected is skipped even when a later snapshot generation re-reads it under a higher sequence; on a new one the detector writes the watermark first, advances the advisor directive receipt so the next brief carries the `Directives:` block again, and returns the goal slice, the `## History Lookup` offer and the open handoff note pointer. A session whose folder cannot run the printed lookup command gets no offer, and a session with no open note gets no handoff line. Every path fails open. `compaction-post-tool.mjs` is the non-strict `post_tool` binding: it sums the journal files' sizes, returns nothing when the size is unchanged, and otherwise runs the same detector, so a compaction inside one long headless turn is caught at the next tool call. The binding also runs the hand-over context on every call, so a long headless turn hears the nudge without waiting for a turn boundary.

The turn-end composer is the only `post_agent` entry, because Vibe skips every later `post_agent` hook once one denies. It runs the completion part first, so its advisory is recorded even when the ask-surface part denies, then the ask-surface part, then the hand-over part last. The hand-over part arms a pending record and starts the killer, and it never denies. The ask-surface part reads the finished turn through the phase 014 journal reader, passes a child session, a subagent and a session whose catalog lacks `ask_user_question`, and denies at most once per turn id with `repromptFor('vibe')`. Vibe injects the deny reason as a retry user message. Malformed input, a missing journal and a throwing part all exit 0 with no output.

Six switches turn parts off. `SYSTEM_SESSION_LIFECYCLE_DISABLED` turns off the session-prime part, `SYSTEM_DIST_FRESHNESS_DISABLED` the dist part, and `SYSTEM_SESSION_CLEANUP_DISABLED` the startup guards. `SYSTEM_SKILL_ADVISOR_DISABLED` turns off the advisor part, `SYSTEM_COMPLETION_DISABLED` the pending completion advisory, and `SYSTEM_ASK_SURFACE_DISABLED` the turn-end reprompt.

Vibe has no compaction event and no idle event, so the three lifecycle hooks plus the `post_tool` compaction binding are the whole surface. The `session_end` entry `session-cleanup-end` still runs `session-cleanup.mjs`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `session-start.mjs` | `session_start` | Composes the goal slice, the session-prime context, the startup-guard warnings and the stale-dist warning, then returns them as `hook_specific_output.additional_context`. | Skips the failing part and keeps the rest. Always exits 0. |
| `turn-start.mjs` | `pre_agent` (main session) | Composes the turn-start parts in a fixed order and returns them as `hook_specific_output.additional_context`. The pending completion advisory runs first, then the compaction context, then the advisor brief, then the hand-over context. | Skips the failing part and keeps the rest. Always exits 0. |
| `compaction-context.mjs` | part and detector | Reads the journal's compaction entries after a per-session watermark, writes the watermark, advances the advisor directive receipt, and returns the goal slice, the `## History Lookup` offer and the open handoff pointer. | Returns nothing on any error. Never throws. |
| `compaction-post-tool.mjs` | `post_tool` (non-strict) | Runs the detector only when the journal's summed size changed and runs the hand-over context on every call, then returns both as `hook_specific_output.additional_context`. | Returns nothing on any error. Always exits 0. |
| `turn-end.mjs` | `post_agent` (main session) | Runs the completion part, then the ask-surface part, then the hand-over part that arms the relaunch, and returns at most one `{"decision":"deny","reason":"..."}` for a prose option menu. | Skips the failing part and keeps the rest. Always exits 0 with no output. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the per-runtime matrix.
- [`./session-start.mjs`](./session-start.mjs): the session-start hook itself.
- [`./turn-start.mjs`](./turn-start.mjs): the turn-start composer.
- [`./turn-end.mjs`](./turn-end.mjs): the turn-end composer and its two parts.
- [`./compaction-context.mjs`](./compaction-context.mjs): the compaction detector, watermark and re-injected text.
- [`./compaction-post-tool.mjs`](./compaction-post-tool.mjs): the `post_tool` binding with the journal-size check.
- [`./fixtures/compaction-journal/`](./fixtures/compaction-journal/): the recorded forced compaction the detector tests run on.
- [`../../../hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs`](../../../hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs): the ask-surface part the turn-end composer calls.
- [`../../../skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`](../../../skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs): the completion part and the pending advisory it writes.
- [`../../../skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`](../../../skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs): the advisor part the composer calls.
- [`../../../hooks/goal/vibe/goal-inject.mjs`](../../../hooks/goal/vibe/goal-inject.mjs): the slice renderer the session-start hook imports.
- [`../../../../.vibe/hooks.toml`](../../../../.vibe/hooks.toml): the registration, with `session-start`, `turn-start`, `turn-end`, `compaction-post-tool` and `session-cleanup-end`.
- [`../../../../.vibe/plugins/repo-guards/session-cleanup.mjs`](../../../../.vibe/plugins/repo-guards/session-cleanup.mjs): the startup guards and the session-end cleanup.
