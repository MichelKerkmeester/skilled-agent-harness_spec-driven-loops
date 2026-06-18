---
title: "Hooks"
description: "Runtime startup hooks, prompt-time skill-advisor hooks, and in-process helper modules for memory surfacing and UX feedback."
trigger_phrases:
  - "hooks"
  - "memory surfacing"
  - "context injection"
  - "startup hook"
  - "skill advisor hook"
---

# Hooks

---

## 1. OVERVIEW

`hooks/` contains runtime hook scripts and in-process helper modules for startup context, prompt-time skill advice, compaction support, memory surfacing, mutation feedback, and response hints.

Current state:

- Runtime startup hooks transport compact startup context for Claude and Codex.
- Prompt-time hooks call the native advisor and inject a brief through each runtime surface.
- `index.ts` exports helper modules used inside MCP responses and mutation flows.
- OpenCode prompt-time advice is delivered by the OpenCode plugin and bridge, not by a subfolder in this directory.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                              HOOKS                               │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────────┐      ┌────────────────────┐
│ Claude         │ ───▶ │ runtime hook files │ ───▶ │ startup or prompt   │
│ Codex          │      │ per runtime        │      │ context transport  │
└────────────────┘      └─────────┬──────────┘      └─────────┬──────────┘
                                  │                           │
                                  ▼                           ▼
                         ┌────────────────────┐      ┌────────────────────┐
                         │ native advisor     │      │ managed context    │
                         │ and startup brief  │      │ stdout, file, hook  │
                         └─────────┬──────────┘      └─────────┬──────────┘
                                   │                           │
                                   ▼                           ▼
                         ┌────────────────────┐      ┌────────────────────┐
                         │ index.ts exports   │ ───▶ │ MCP envelope hints │
                         │ helper modules     │      │ and cache feedback │
                         └────────────────────┘      └────────────────────┘

Dependency direction: runtime folders ───▶ shared helpers ───▶ MCP response metadata.
```

---

## 3. DIRECTORY TREE

```text
mcp_server/hooks/
├── claude/                        # Claude session, prompt, compaction, and transcript hooks
├── codex/                         # Codex session, prompt, pre-tool, and wrapper hooks
├── code-index-cli-fallback.ts      # Warm-only code-index CLI fallback helper
├── index.ts                       # Public helper exports
├── memory-surface.ts              # Context extraction and constitutional cache helpers
├── mutation-feedback.ts           # Post-mutation feedback payloads
├── response-hints.ts              # Auto-surface hints and token count sync
├── shared-provenance.ts           # Provenance-wrapped transport helpers
├── spec-memory-cli-fallback.ts     # Warm-only spec-memory CLI fallback helper
├── warm-cli-fallback-envelope.ts   # Bounded warm CLI fallback envelope helpers
└── README.md
```

---

## 4. KEY FILES

| File or directory | Responsibility |
|---|---|
| `claude/` | Claude runtime hook scripts and README. |
| `codex/` | Codex native hook scripts plus prompt-wrapper fallback. |
| `code-index-cli-fallback.ts` | Bounded warm-only CLI recovery for code-index hook contexts. |
| `index.ts` | Public export barrel for in-process helper modules. |
| `memory-surface.ts` | Extracts context hints and surfaces constitutional or triggered memory. |
| `mutation-feedback.ts` | Maps `MutationHookResult` values into public `postMutationHooks` response payloads. |
| `response-hints.ts` | Adds auto-surface hints and token counts to MCP JSON envelopes. |
| `shared-provenance.ts` | Wraps hook transport with provenance metadata. |
| `spec-memory-cli-fallback.ts` | Bounded warm-only CLI recovery for spec-memory hook contexts. |
| `warm-cli-fallback-envelope.ts` | Shared response envelope for warm CLI fallback attempts. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Runtime scripts | Keep runtime registration details in each runtime subfolder and README. |
| In-process helpers | Export shared helper modules through `index.ts`. |
| Startup transport | Use startup hooks for compact context priming, not prompt-time advisor delivery. |
| Prompt advice | Use prompt-time hooks or the OpenCode plugin bridge for advisor briefs. |
| Mutation feedback | Read mutation results from `../handlers/mutation-hooks.ts` before building public payloads. |
| Response contract | Expose post-mutation UX state through the `postMutationHooks` field, preserving the `MutationHookResult` cache-clearing and error fields. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ Runtime event starts or prompt submits   │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Runtime-specific hook script runs         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Startup brief or advisor brief is built  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Runtime transport injects compact output │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Agent receives context or advisor brief  │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `claude/session-prime.ts` | Hook script | Claude startup context injection. |
| `codex/session-start.ts` | Hook script | Codex native session-start injection. |
| `*/user-prompt-submit.ts` | Hook script | Prompt-time skill advisor delivery for supported runtimes. |
| `index.ts` | Module | Public exports for in-process helper functions. |

Main helper exports include `extractContextHint`, `getConstitutionalMemories`, `clearConstitutionalCache`, `autoSurfaceMemories`, `autoSurfaceAtToolDispatch`, `autoSurfaceAtCompaction`, `MEMORY_AWARE_TOOLS`, `buildMutationHookFeedback`, `appendAutoSurfaceHints`, `syncEnvelopeTokenCount`, and `serializeEnvelopeWithTokenCount`.

---

## 7. VALIDATION

Run from `.opencode/skills/system-spec-kit/mcp_server` unless noted.

```bash
npx vitest run hooks
```

Expected result: hook helper and runtime hook tests exit with Vitest success.

---

## 8. RELATED

- [`../handlers/README.md`](../handlers/README.md)
- [`../core/README.md`](../core/README.md)
- [`../../references/hooks/skill_advisor_hook.md`](../../references/hooks/skill_advisor_hook.md)
- [`../../references/config/hook_system.md`](../../references/config/hook_system.md)
