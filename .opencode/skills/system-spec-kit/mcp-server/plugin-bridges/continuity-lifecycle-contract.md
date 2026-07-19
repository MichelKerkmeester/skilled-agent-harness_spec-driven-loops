---
title: "Continuity Lifecycle Contract: Claude Hooks vs OpenCode Plugin"
description: "Names, per runtime, where Spec Kit continuity is recovered and persisted, and the shared guarantee vs runtime-specific capabilities."
trigger_phrases:
  - "continuity lifecycle"
  - "continuity parity"
  - "recover persist continuity"
  - "runtime continuity capability"
---

# Continuity Lifecycle Contract: Claude Hooks vs OpenCode Plugin

> Spec Kit injects session continuity into two runtimes with different lifecycle surfaces. This contract names, for each runtime, exactly WHERE continuity is (a) RECOVERED and (b) PERSISTED, states the guarantee both runtimes share, and records where their capabilities intentionally diverge. It is the single reference a reviewer can check when either surface changes.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. WHY THIS EXISTS](#1-why-this-exists)
- [2. SHARED GUARANTEE (THE INTERSECTION)](#2-shared-guarantee-the-intersection)
- [3. RUNTIME MAP](#3-runtime-map)
- [4. CLAUDE RUNTIME](#4-claude-runtime)
- [5. OPENCODE RUNTIME](#5-opencode-runtime)
- [6. INTENTIONAL DIVERGENCE](#6-intentional-divergence)
- [7. CAPABILITY VOCABULARY](#7-capability-vocabulary)
- [8. VERIFICATION](#8-verification)

<!-- /ANCHOR:table-of-contents -->

---

## 1. WHY THIS EXISTS

The two runtimes recover and persist continuity at materially different lifecycle
points because their host APIs expose different events. Claude Code fires
dedicated `SessionStart`, `PreCompact`, and `Stop` process hooks. The OpenCode
plugin API exposes a per-prompt system-prompt transform plus coarse lifecycle
events (session created/deleted, server disposed), but **no** trustworthy
compaction or idle/stop persistence event.

Without a written contract, a change to one surface can silently drift from the
other, and a runtime can appear to promise a persistence guarantee it cannot
deliver. This document converges the two surfaces on the capability set they can
**both** honor, and states the Claude-only extensions explicitly rather than
pretending OpenCode has the same machinery.

---

## 2. SHARED GUARANTEE (THE INTERSECTION)

Both runtimes guarantee the same thing about **recovery**:

- Before the first (or resumed) model turn, each runtime fetches a warm
  continuity brief through the **same read-only `session_resume` path** served by
  the warm Spec Kit daemon.
- Each runtime **deduplicates** repeated injection so the same brief is not
  appended twice within a turn/session.

Neither runtime guarantees anything about **persistence** as a shared capability.
Persistence is a Claude-only extension (Section 4) because it depends on
lifecycle events the OpenCode plugin API does not provide (Section 6). The honest
intersection is therefore **recovery + dedupe**, not persistence.

---

## 3. RUNTIME MAP

| Runtime | Recovered where | Persisted where |
|---|---|---|
| **Claude** | `SessionStart` hook (`session-prime.ts`): `handleStartup` / `handleResume` restore prior context and `maybeAppendCliWarmFallback` appends a warm `session_resume` brief; `handleCompact` replays the PreCompact cache. | `PreCompact` hook (`compact-inject.ts`) caches a payload for the next start; `Stop` hook (`session-stop.ts`) autosaves canonical docs. |
| **OpenCode** | `experimental.chat.system.transform` (`mk-spec-memory.js` → `appendContinuityBrief`): a warm `session_resume` brief on every prompt. | **Not persisted by the plugin.** Lifecycle events only invalidate/reset in-memory cache. |

---

## 4. CLAUDE RUNTIME

Source: `mcp-server/hooks/claude/`.

**Recovery** happens in `session-prime.ts` on the `SessionStart` event:

- `handleStartup` and `handleResume` rebuild context from prior hook state; the
  `Session Continuity` section is reserved for genuinely recovered payload.
- `maybeAppendCliWarmFallback` calls `buildWarmSessionResumeSection` (from
  `spec-memory-cli-fallback`) to append a live warm `session_resume` brief on
  startup/resume. `hasRecoveredContinuitySection` is the dedupe guard — the warm
  fallback is suppressed only when recovered continuity is already present.
- `handleCompact` replays the cache left by the PreCompact hook via
  `readCompactPrime`, so continuity survives a compaction boundary.

**Persistence** happens in two additional hooks that OpenCode has no equivalent
for:

- `compact-inject.ts` runs on `PreCompact`. `persistCompactResult` writes a
  `pendingCompactPrime` envelope into hook state via `updateState`. This is a
  cache for the next `SessionStart` (`handleCompact`), not a canonical-doc write.
- `session-stop.ts` runs on `Stop`. `runContextAutosave` executes the
  `generate-context.js` script to durably autosave canonical continuity docs. Its
  outcome is one of `ran` / `skipped` / `failed` — it never reports a save it did
  not perform.

The `UserPromptSubmit` hook (`user-prompt-submit.ts`) is a skill-advisor shim, not
a continuity surface; it is out of scope for this contract.

---

## 5. OPENCODE RUNTIME

Source: `.opencode/plugins/mk-spec-memory.js`.

**Recovery** happens in the `experimental.chat.system.transform` hook,
implemented by `appendContinuityBrief`:

- Every prompt, `getContinuity` calls `runBridge({ request: 'brief' })`, which
  spawns `mk-spec-memory-bridge.mjs`. The bridge routes the prompt-safe `brief`
  request to the read-only `session_resume` tool over the warm daemon CLI — the
  same recovery path Claude uses on startup.
- Results are cached with a short TTL and deduped: `markedBrief` stamps each brief
  with a content marker, and `appendContinuityBrief` skips injection when that
  marker is already present in the system prompt.

**Persistence** is not performed by the plugin. The `event` hook reacts to
lifecycle events only to keep the in-memory cache coherent:

- `session.created` marks the runtime ready.
- `session.deleted` calls `invalidateSession` (bumps the session generation and
  drops that session's cache/in-flight entries).
- `server.instance.disposed` / `global.disposed` call `resetRuntimeState`.

There is no PreCompact-cache and no Stop-autosave counterpart, because the
OpenCode plugin API surfaces no compaction or idle/stop event carrying a
trustworthy transcript to persist from. The plugin instead relies on the
always-warm daemon plus the per-transform brief for continuity.

---

## 6. INTENTIONAL DIVERGENCE

The divergence is a property of the host APIs, not an oversight:

- Claude exposes discrete `PreCompact` and `Stop` process hooks with a durable
  transcript, so it can cache before compaction and autosave on stop.
- OpenCode exposes a per-prompt transform and coarse lifecycle events, but no
  compaction/idle/stop event with an equivalent trusted input.

Therefore the plugin **must not** fabricate a compaction cache or an autosave from
message/lifecycle events — doing so would claim a guarantee the runtime cannot
back. The correct posture is: recover on every transform (already the shared
guarantee) and declare compaction and autosave explicitly unsupported until the
OpenCode API exposes equivalent trusted inputs. If such an event is added later,
a single bounded warm-persist call may be wired there; nothing else in this
contract changes.

---

## 7. CAPABILITY VOCABULARY

The OpenCode plugin's status tool (`mk_spec_memory_status`) reports these
continuity capability fields. They are the machine-readable projection of this
contract — the shared recovery guarantee plus the two explicitly-unsupported
persistence capabilities:

```
continuity_recovery=per_transform_warm
continuity_compaction=unsupported_runtime_event
continuity_autosave=unsupported_runtime_event
```

Meaning of each documented value:

| Field | Documented value | Meaning |
|---|---|---|
| `continuity_recovery` | `per_transform_warm` | Continuity is recovered on every system-prompt transform via the warm `session_resume` brief. Satisfies the shared recovery guarantee. |
| `continuity_compaction` | `unsupported_runtime_event` | The runtime exposes no trustworthy compaction event, so the plugin caches nothing at compaction (unlike Claude's PreCompact hook). |
| `continuity_autosave` | `unsupported_runtime_event` | The runtime exposes no trustworthy idle/stop event, so the plugin autosaves nothing (unlike Claude's Stop hook). |

The values above are load-bearing: the parity test in Section 8 reads them from
this document and asserts the plugin emits exactly the same values, so the two
cannot drift apart unnoticed.

---

## 8. VERIFICATION

`mcp-server/tests/continuity-lifecycle-parity.vitest.ts` instantiates the plugin
hermetically (no live daemon), captures the `mk_spec_memory_status` output, and
asserts each `continuity_*` field equals the value documented in Section 7. A
change to either the plugin's emitted capability or this document — without the
matching change to the other — fails that test.
