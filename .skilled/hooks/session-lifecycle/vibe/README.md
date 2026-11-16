---
title: "Session Lifecycle: Vibe Adapters"
description: "The Vibe session_start, pre_agent and post_agent adapters. One entry composes the goal slice, the session-prime context, the startup guards and the stale-dist warning. One composes the pending advisory, the compaction context, the advisor brief, the save reminder and the hand-over context. One runs the turn-end completion, ask-surface and hand-over parts."
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

`vibe/` holds the Vibe session-start, turn-start and turn-end adapters. `session-start.mjs` is the only `session_start` entry in `.vibe/hooks.toml`. `turn-start.mjs` is the only `pre_agent` composer, and `turn-end.mjs` the only `post_agent` entry. The context hooks answer with `{"hook_specific_output":{"additional_context": "..."}}`. `turn-end.mjs` prints nothing, or one `{"decision":"deny","reason":"..."}` when a part denies.

The session-start context is composed in a fixed order. It starts with the bound packet's goal `chat_slice`, then the session-prime context. The startup-guard warnings from `.vibe/plugins/repo-guards/session-cleanup.mjs` come next, then the `check-dist-staleness.sh --all` warning. Each part is skipped when it is empty or when it fails. The hook never blocks and always exits 0.

The turn-start context is composed the same way, over a shared part list. A new concern adds a part here instead of registering its own `pre_agent` entry. A failing part contributes nothing and the rest still land.

A step that adds no text runs before every part. It withdraws an armed hand-over when the operator typed a prompt, so a slow part cannot hold the withdraw past the moment the killer ends the session. A blank prompt withdraws nothing.

The pending completion advisory from the previous turn is the first text part. It deletes its file, so the advisory reaches the model exactly once. The compaction detector runs second and re-injects the goal slice and the open handoff pointer. Then comes the skill advisor brief, then the save reminder. The hand-over context runs last, so its claim seed, withdrawal notice or nudge text ends the context.

The advisor brief is built by `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` under the `vibe` runtime label. A blank prompt, a dispatched child (`AI_SESSION_CHILD=1`) and a subagent (`parent_session_id` set) get no brief. The shared handler's file-backed directive store sends the constant `Directives:` block once. A per-session head receipt sends the routing head only when it changed.

At a turn start the hand-over part expands a claim seed, or withdraws an armed hand-over when the operator types. Otherwise it nudges once the fill passes the threshold. The entry stays separate from `spec-gate-classify`, so a composer failure cannot open the spec gate.

Vibe has no compaction event, so `compaction-context.mjs` reads the compaction from the session journal. `compactionsSince` lists the entries after a per-session watermark under the session folder's `.skilled/skills/.state/vibe-compaction/`. The checkout's folder is used when the payload names no absolute folder that exists.

A compaction id already injected is skipped, even when a later snapshot generation re-reads it under a higher sequence. Every id in one catch-up joins that seen list, and the newest 64 are kept.

On a new one the detector writes the watermark first, even when it will have nothing to inject. Otherwise a session with no goal and no open note would detect the same compaction and re-arm the advisor on every turn.

It then advances the advisor directive receipt, so the next brief carries the `Directives:` block again. It also resets the session's hand-over nudge level, because the freed context fills from the start again.

It returns the goal slice and the open handoff note pointer. A session with no open note gets no handoff line, and neither does a session whose prepared hop owns the note. A note written before the operator withdrew the hand-over is pointed at as stale. A missing journal or a malformed entry yields no text. An unreadable watermark counts as none, so the latest compaction is injected again. A watermark that cannot be written withholds the text.

`compaction-post-tool.mjs` is the non-strict `post_tool` binding. It sums the journal files' sizes, an empty journal folder counting as 0, and returns nothing when the size is unchanged. Otherwise it runs the same detector, so a compaction inside one long headless turn is caught at the next tool call. The binding also runs the hand-over context on every call. A failing part contributes nothing and the hook exits 0. A long headless turn hears the nudge without a turn boundary.

The turn-end composer is the only `post_agent` entry, because Vibe skips every later `post_agent` hook once one denies. It runs the completion part first, so its advisory is recorded even when the ask-surface part denies. The ask-surface part runs second and the hand-over part last.

The hand-over part arms a pending record and starts the killer, and it never denies. The ask-surface part reads the finished turn through the shared journal reader. It passes a child session, a subagent and a session whose catalog lacks `ask_user_question`. It denies at most once per turn id with `repromptFor('vibe')`.

Vibe injects the deny reason as a retry user message. Malformed input, a missing journal and a throwing part all exit 0 with no output.

Seven switches turn parts off. `SYSTEM_SESSION_LIFECYCLE_DISABLED` turns off the session-prime part and `SYSTEM_DIST_FRESHNESS_DISABLED` the dist part. `SYSTEM_SESSION_CLEANUP_DISABLED` turns off the startup guards. `SYSTEM_SKILL_ADVISOR_DISABLED` turns off the advisor part and `SYSTEM_COMPLETION_DISABLED` the pending completion advisory. `SYSTEM_ASK_SURFACE_DISABLED` turns off the turn-end reprompt. `SYSTEM_DECISION_CAPTURE_DISABLED` turns off the save reminder. The compaction parts have no switch of their own.

The hand-over parts stay off for Vibe unless `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1` or the master switch `SYSTEM_SESSION_HANDOVER_ENABLED=1` is set.

The three lifecycle hooks plus the `post_tool` compaction binding are the whole surface. The `session_end` entry `session-cleanup-end` runs `session-cleanup.mjs`.

---

## 2. DIRECTORY TREE

```text
vibe/
+-- README.md
+-- compaction-context.mjs
+-- compaction-context.test.mjs
+-- compaction-post-tool.mjs
+-- compaction-post-tool.test.mjs
+-- session-start.mjs
+-- turn-end.mjs
+-- turn-end.test.mjs
+-- turn-start.mjs
+-- turn-start.test.mjs
`-- fixtures/   # compaction-journal/
```

| File | Responsibility |
|---|---|
| `compaction-context.mjs` | The compaction detector. It reads the journal after a per-session watermark and returns the restored context. |
| `compaction-context.test.mjs` | The `node --test` suite for the detector and the `post_tool` part. |
| `compaction-post-tool.mjs` | The non-strict `post_tool` binding. It runs the detector when the journal grew and adds the hand-over text. |
| `compaction-post-tool.test.mjs` | The `node --test` suite for the binding. |
| `fixtures/` | The recorded forced compaction the detector tests replay. |
| `session-start.mjs` | The `session_start` hook. It composes the session-start parts in a fixed order. |
| `turn-end.mjs` | The `post_agent` composer. It runs the completion, ask-surface and hand-over parts. |
| `turn-end.test.mjs` | The `node --test` suite for the turn-end composer and the pending advisory. |
| `turn-start.mjs` | The `pre_agent` composer. It runs the turn-start parts in a fixed order. |
| `turn-start.test.mjs` | The `node --test` suite for the turn-start composer and the save reminder. |

Each context hook returns its text as `hook_specific_output.additional_context`. The compaction, binding and turn-end suites keep their state in temporary folders. The turn-start skip cases run against the checkout. The fixtures folder holds a recorded forced compaction, so the detector matches the shape Vibe wrote.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs .skilled/hooks/session-lifecycle/vibe/compaction-post-tool.test.mjs .skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs .skilled/hooks/session-lifecycle/vibe/turn-end.test.mjs
```

Expected result: every case passes. The suites cover the watermark, the journal-size check, the advisor skip cases and the one deny.

---

## 4. RELATED

- [`../README.md`](../README.md): the session-lifecycle concern README, with the per-runtime matrix.
- [`./session-start.mjs`](./session-start.mjs): the session-start hook.
- [`./turn-start.mjs`](./turn-start.mjs): the turn-start composer.
- [`./turn-end.mjs`](./turn-end.mjs): the turn-end composer.
- [`./compaction-context.mjs`](./compaction-context.mjs): the compaction detector and its watermark.
- [`./compaction-post-tool.mjs`](./compaction-post-tool.mjs): the `post_tool` binding with the journal-size check.
- [`./fixtures/compaction-journal/`](./fixtures/compaction-journal/): the recorded forced compaction the detector tests run on.
- [`../../../hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs`](../../../hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs): the ask-surface part the turn-end composer calls.
- [`../../../skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`](../../../skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs): the completion part and the pending advisory it writes.
- [`../../../skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`](../../../skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs): the advisor part the composer calls.
- [`../../../hooks/goal/vibe/goal-inject.mjs`](../../../hooks/goal/vibe/goal-inject.mjs): the slice renderer the session-start hook imports.
- [`../../../../.vibe/hooks.toml`](../../../../.vibe/hooks.toml): the registration, with `session-start`, `turn-start`, `turn-end`, `compaction-post-tool` and `session-cleanup-end`.
- [`../../../../.vibe/plugins/repo-guards/session-cleanup.mjs`](../../../../.vibe/plugins/repo-guards/session-cleanup.mjs): the startup guards and the session-end cleanup.
