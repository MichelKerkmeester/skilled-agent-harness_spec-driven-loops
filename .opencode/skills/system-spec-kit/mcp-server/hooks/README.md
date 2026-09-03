---
title: "Hooks"
description: "Per-runtime lifecycle and spec-gate hook adapters, plus the runtime-neutral policy core they share."
trigger_phrases:
  - "hooks"
  - "spec gate"
  - "context injection"
  - "startup hook"
  - "runtime hook adapter"
---

# Hooks

---

## 1. OVERVIEW

`hooks/` contains the per-runtime hook adapters for Claude Code, Codex, Cursor, Devin and Pi, together with the runtime-neutral policy core they all call.

Current state:

- Each runtime folder owns payload translation for that runtime's own envelope shape and nothing else.
- Policy lives in `lib/`. An adapter reads a payload, calls the core, and formats the answer; it never decides a verdict.
- Lifecycle adapters are TypeScript compiled to `dist/hooks/<runtime>/`. Spec-gate adapters are direct-run `.mjs` or `.cjs` with no build step.
- Every entrypoint fails open: a missing or malformed payload resolves to approve, so a bug here cannot block an unrelated turn.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                              HOOKS                               │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────────┐      ┌────────────────────┐
│ Claude, Codex  │ ───▶ │ hooks/<runtime>/   │ ───▶ │ per-runtime        │
│ Cursor, Devin  │      │ payload adapters   │      │ response envelope  │
│ Pi             │      └─────────┬──────────┘      └────────────────────┘
└────────────────┘                │
                                  ▼
                         ┌────────────────────┐      ┌────────────────────┐
                         │ hooks/lib/         │ ───▶ │ Gate-3 verdict     │
                         │ spec-gate core     │      │ allow/advise/deny  │
                         └─────────┬──────────┘      └────────────────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │ ../lib/hooks/      │
                         │ evidence sentinel  │
                         └────────────────────┘

Dependency direction: runtime folders ───▶ hooks/lib ───▶ filesystem and shared session state.
```

---

## 3. DIRECTORY TREE

```text
mcp-server/hooks/
├── claude/                  # Claude Code lifecycle, transcript and spec-gate hooks
├── codex/                   # Codex CLI adapters onto the Claude implementations
├── cursor/                  # Cursor CLI adapters and the sessionStart prebind
├── devin/                   # Devin CLI adapters, permission policy and post-compaction
├── pi/                      # Pi extension factories (symlinked from .pi/extensions/)
├── opencode/                # Browsability symlink -> .opencode/plugins/system-spec-gate.js
├── lib/                     # Runtime-neutral spec-gate core, adapter and workspace helpers
├── shared-provenance.ts     # Provenance-wrapped transport helpers
└── README.md
```

---

## 4. KEY FILES

| File or directory | Responsibility |
|---|---|
| `claude/` | Claude Code lifecycle hooks (session prime, compact inject, session stop, transcript parsing) plus the Gate-3 pair. The other runtimes delegate their lifecycle semantics here. |
| `codex/`, `cursor/`, `devin/` | Per-runtime adapters that normalize each CLI's payload onto the Claude implementations, plus that runtime's spec-gate pair. Envelope shapes differ: Codex and Devin use `hookSpecificOutput`; Cursor uses `{permission, user_message, agent_message}`. |
| `pi/` | Pi extension factories, discovered through relative symlinks at `.pi/extensions/`. Pi resolves their imports against the symlink path, so every import in those files is written for the `.pi/extensions/` base. |
| `opencode/` | Browsability-only symlink to `.opencode/plugins/system-spec-gate.js`. OpenCode discovers plugins solely from `.opencode/plugins/`, so the real file stays there and nothing loads through this symlink. |
| `lib/spec-gate/spec-gate-core.mjs` | The Gate-3 policy core. Owns `classifyIntent()` and `evaluateMutation()` so the core never changes for a new runtime. |
| `lib/hook-adapter-shared.mjs` | Shared helper for the four `spec-gate-enforce` adapters. |
| `lib/workspace/repo-root.mjs` | Repository-root resolution used by the spec-gate core. |
| `shared-provenance.ts` | Sanitizes recovered compact payloads, stripping adversarial system/developer/assistant/user prefixes, and wraps them with explicit provenance markers so downstream hooks can tell cached context from a first-class turn. Consumed by `claude/shared.ts` and `claude/hook-state.ts`. |

The completion-evidence policy each runtime's Stop-equivalent adapter calls lives one level up, at `../lib/hooks/completion-evidence-sentinel.cjs`.

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Runtime scripts | Keep registration details and envelope translation in each runtime subfolder and its README. |
| Policy | Gate-3 decisions belong to `lib/spec-gate/spec-gate-core.mjs`. An adapter that decides policy has drifted. |
| Lifecycle semantics | State and transcript semantics stay owned by the Claude adapters so the transports cannot drift apart. |
| Fail-open | Every entrypoint resolves to approve on a missing or invalid payload. |
| Evidence sentinel | Completion-evidence checks read recorded artifacts only. They never run a test, a build or `validate.sh`. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ Runtime event fires                      │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Runtime adapter reads and validates the  │
│ payload                                   │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Shared core returns a transport-free      │
│ decision                                  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Adapter formats that runtime's envelope   │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Agent receives context, advice or a deny  │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `claude/session-prime.ts` | Hook script | Claude startup context injection. |
| `claude/compact-inject.ts` | Hook script | Precomputes context before compaction and caches it to hook state. |
| `*/user-prompt-submit.ts` | Hook scripts | Prompt-time advisor delivery for the supported runtimes. |
| `*/spec-gate-classify.mjs` | Hook scripts | Advisory Gate-3 classification on a user turn. |
| `*/spec-gate-enforce.mjs` | Hook scripts | Pre-tool Gate-3 evaluation; deny-capable for write and edit paths. |
| `*/completion-evidence-stop.cjs` | Hook scripts | Advisory completion-evidence check at turn end. |
| `lib/spec-gate/spec-gate-core.mjs` | Module | `classifyIntent()` and `evaluateMutation()` for every runtime. |

---

## 7. VALIDATION

Run from `.opencode/skills/system-spec-kit/mcp-server` unless noted.

```bash
npx vitest run hooks
node --test hooks/lib/spec-gate/spec-gate-core.test.mjs
```

Expected result: hook helper and runtime hook tests exit with Vitest success, and the co-located spec-gate core tests pass under `node --test`.

---

## 8. RELATED

- [`lib/spec-gate/README.md`](./lib/spec-gate/README.md)
- [`../handlers/README.md`](../handlers/README.md)
- [`../core/README.md`](../core/README.md)
- [`skill-advisor-hook.md`](../../../system-skill-advisor/hooks/skill-advisor-hook.md)
- [`../../references/config/hook-system.md`](../../references/config/hook-system.md)
