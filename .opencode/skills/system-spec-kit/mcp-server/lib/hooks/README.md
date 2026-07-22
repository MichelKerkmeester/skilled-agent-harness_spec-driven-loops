---
title: "Completion-Evidence Sentinel Core"
description: "Runtime-neutral completion-evidence policy shared by the Claude Stop hook and the Codex Stop adapter."
---

# Completion-Evidence Sentinel Core

---

## 1. OVERVIEW

`lib/hooks/` holds the runtime-agnostic policy core behind the completion-evidence sentinel. When a turn ends with a completion claim (matching words like "completed", "fixed", "shipped"), the core checks recorded artifacts only. It reads a spec folder's `checklist.md` via `check-completion.sh --json` (or a Level 1 folder's `implementation-summary.md` via a file stat) and returns a transport-free decision. It never runs a test, a build or `validate.sh`, and it never writes stdout or stderr itself. Each runtime adapter (the Claude Stop hook, the Codex Stop adapter, the OpenCode `session.idle` plugin) surfaces the decision in its own protocol.

Current state:

- The decision is always advisory. The core has no block/continue verdict, so a bug or a false-positive claim can never force continuation.
- Dedup state (so a repeated claim for the same spec folder does not re-advise) is persisted here and shared across adapters.
- The bounded advisory log append is an explicit, adapter-invoked step, mirroring the deep-loop dispatch-guard split between policy and logging.
- Fails open on any missing payload, timeout or internal error.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `completion-evidence-sentinel.cjs` | Runtime-neutral core: completion-claim detection, spec-folder resolution, checklist/implementation-summary evaluation, dedup state, advisory logging and a throttled stale-state sweep. Exports `detectCompletionClaim`, `evaluateCompletionEvidence`, `resolveSentinelPaths`, `appendAdvisoryLog`, `sweepStaleSentinelState` and related constants. |

## 3. CONSUMERS

- `hooks/claude/completion-evidence-stop.cjs` (Claude Stop hook).
- `hooks/codex/completion-evidence-stop.cjs` (Codex Stop adapter).

## 4. TESTS

- `tests/completion-evidence-sentinel.vitest.ts`
- `tests/hook-completion-evidence-stop.vitest.ts`

## 5. RELATED

- [`../README.md`](../README.md)
- [`../../hooks/codex/README.md`](../../hooks/codex/README.md)
