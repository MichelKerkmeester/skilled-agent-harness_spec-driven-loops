---
title: "Skill Advisor Library: Runtime, Scoring And Metadata Helpers"
description: "TypeScript library modules for skill-advisor routing, scoring, daemon freshness, lifecycle metadata, compatibility and prompt-safe rendering."
trigger_phrases:
  - "skill advisor library"
  - "advisor runtime modules"
  - "skill advisor scoring"
---

# Skill Advisor Library: Runtime, Scoring And Metadata Helpers

---

## 1. OVERVIEW

`runtime/lib/` owns the TypeScript helper layer behind advisor recommendation, prompt-safe rendering, daemon freshness checks, lifecycle metadata, compatibility probes and scorer behavior. Handlers import `../lib/...` modules, and scripts call these modules instead of duplicating advisor logic.

Current state:

- Centralizes prompt policy, normalization, scoring and render helpers.
- Groups compatibility, daemon, derived metadata, freshness, lifecycle, scorer, shadow and utility modules in focused subfolders.
- Keeps subprocess and source-cache behavior close to the advisor runtime path.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                      SKILL ADVISOR LIBRARY                       │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌────────────────┐      ┌──────────────────┐
│ Handlers     │ ───▶ │ Runtime values │ ───▶ │ Scorer / policy  │
│ scripts      │      │ render helpers │      │ normalization    │
└──────┬───────┘      └───────┬────────┘      └────────┬─────────┘
       │                      │                        │
       │                      ▼                        ▼
       │              ┌───────────────┐        ┌────────────────┐
       └───────────▶  │ Freshness     │ ───▶   │ Compatibility  │
                      │ daemon        │        │ lifecycle      │
                      └───────┬───────┘        └────────────────┘
                              │
                              ▼
                      ┌───────────────┐
                      │ Shadow data   │
                      └───────────────┘

Dependency direction: handlers/scripts -> lib -> schemas and shared helpers
```

---

## 3. PACKAGE TOPOLOGY

```text
lib/
+-- auth/                       # Trusted caller checks
+-- compat/                     # Compatibility and daemon probes
+-- cross-skill-edges/          # Inbound enhances edge detection/apply helpers
+-- daemon/                     # Advisor daemon helpers
+-- derived/                    # Derived metadata helpers
+-- freshness/                  # Freshness and cache state helpers
+-- ipc/                        # Launcher IPC bridge and idle-timeout helpers
+-- lifecycle/                  # Skill lifecycle metadata helpers
+-- scorer/                     # Advisor scorer implementation
+-- shadow/                     # Shadow-mode telemetry helpers
+-- shared/                     # Small advisor-local shared helpers
+-- utils/                      # Small utility functions
+-- advisor-runtime-values.ts   # Runtime defaults and constants
+-- policy-plan.ts              # Advisor policy delivery-state machine + observed-receipt confirmation (epoch>=1 floor)
+-- prompt-policy.ts            # Prompt handling policy
+-- render.ts                   # Prompt-safe output rendering
+-- subprocess.ts               # Child-process wrapper helpers
`-- README.md
```

Allowed direction:

```text
handlers -> lib modules
scripts -> lib modules
lib modules -> schemas and shared utilities
```

Disallowed direction:

```text
lib modules -> tool registration
lib modules -> test fixtures
subfolders -> handlers for runtime behavior
```

---

## 4. DIRECTORY TREE

```text
lib/
+-- advisor-disabled.ts
+-- advisor-runtime-values.ts
+-- affordance-normalizer.ts
+-- caller-context.ts
+-- command-attach.ts
+-- compiled-routing-flag.ts
+-- df-idf.ts
+-- error-diagnostics.ts
+-- freshness.ts
+-- generation.ts
+-- metrics.ts
+-- normalize-adapter-output.ts
+-- policy-plan.ts
+-- private-skill-target.cjs
+-- private-skill-target.ts
+-- prompt-cache.ts
+-- prompt-policy.ts
+-- render.ts
+-- route-exclusions.ts
+-- skill-advisor-brief.ts
+-- source-cache.ts
+-- subprocess.ts
+-- auth/
+-- compat/
+-- cross-skill-edges/
+-- daemon/
+-- derived/
+-- freshness/
+-- ipc/
+-- lifecycle/
+-- scorer/
+-- shadow/
+-- shared/
+-- skill-graph/
+-- utils/
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `advisor-runtime-values.ts` | Runtime constants and defaults used by advisor paths. |
| `affordance-normalizer.ts` | Normalizes prompt affordance signals before scoring. |
| `command-attach.ts` | `attachCommand()` names the slash command for a hub recommendation whose compiled route picks one `workflowMode`. It reads the `MODE_COMMANDS` table that `derive-command-bridges.cjs` generates from each hub's `mode-registry.json`. A `system-deep-loop` command needs the same command typed in the prompt or an ask for the loop itself, which `LOOP_REQUEST` reads: a `LOOP_WORDING` phrase such as `iterations`, `multi-pass` or `deep review`, an iteration count, or a `LOOP_NAMES` name such as `research loop` behind a use verb. Depth wording such as `thorough` or `in depth` asks for care inside one pass and opens no deep-loop command. `asksForLoopRun()` also turns loop wording away when the prompt names a loop without asking to start it: a request to read or summarize a past run's output (`isPastRunRead()`), a piece written about a loop method (`isWritingAboutTopic()`) or a question about how the loop works. A complaint about a stuck, non-converging or stale run (`isStuckRunComplaint()`) gets `/doctor:deep-loop` instead of a new run. When the hub's route defers or asks to clarify, `deferredLoopCommand()` still names the mode's command if the prompt asks for the loop and carries exactly one `MODE_CUES` cue, research or review. A prompt that matches `NO_EDIT_REQUEST` gets no command. `commandOnlyMentioned()` reads how the prompt names a command, and a command the prompt refuses or asks about is not offered unless a later clause asks for it. A correction inside an existing document carries no `/create:readme`, `/create:feature-catalog` or `/create:manual-testing-playbook`. The module has no imports. |
| `prompt-policy.ts` | Applies prompt-safe routing and rendering policy. |
| `render.ts` | Renders advisor results into prompt-safe output. |
| `skill-advisor-brief.ts` | Builds concise advisor recommendation briefs. |
| `normalize-adapter-output.ts` | Normalizes adapter result shapes. |
| `subprocess.ts` | Wraps external process execution for advisor scripts or probes. |
| `df-idf.ts` | Computes DF/IDF statistics over the active corpus, excluding archived and future skills through `lifecycle/archive-handling`, with a cached variant and a debounced updater. Only tests and the stress suite import it today. |
| `route-exclusions.ts` | Loads the operator denylist of skill ids the advisor never routes: `config/route-exclusions.json`, fully replaced by a gitignored `route-exclusions.local.json` when present, or the directory in `SPECKIT_ADVISOR_ROUTE_EXCLUSIONS_DIR`. A missing or malformed file yields an empty set and never throws. |
| `caller-context.ts` | Holds the per-request caller context (session id, transport, caller pid, `trusted` flag) in `AsyncLocalStorage`, read by the trusted-caller gate. |
| `cross-skill-edges/` | Detects and optionally applies inbound `enhances` graph edges. |
| `ipc/` | Owns launcher socket bridge and idle-timeout helpers. |
| `shared/` | Keeps advisor-local shared helpers and compatibility shims. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | May import advisor schemas, shared helpers and focused local submodules. |
| Exports | Export reusable advisor runtime helpers, not tool registration. |
| Ownership | Keep advisor computation and metadata helpers here. Put tool handlers in `../handlers/` and CLI wrappers in `../scripts/`. |

Main flow:

```text
prompt or status request
  -> handler or script entrypoint
  -> lib policy, scorer, freshness or compatibility helper
  -> prompt-safe advisor result or diagnostic payload
```

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `render.ts` | Module | Formats advisor output for callers. |
| `prompt-policy.ts` | Module | Applies prompt-safety and routing policy. |
| `scorer/` | Folder | Native scoring implementation. |
| `compat/` | Folder | Compatibility and daemon probe helpers. |
| `cross-skill-edges/` | Folder | Inbound enhances edge propagation helpers. |
| `freshness/` | Folder | Freshness state helpers. |
| `ipc/` | Folder | Launcher IPC helpers. |
| `shared/` | Folder | Shared local helper modules. |

---

## 8. VALIDATION

Run from the repository root.

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/system-skill-advisor/runtime/lib/README.md
```

Expected result: exit code `0`.

---

## 9. RELATED

- [`../README.md`](../README.md)
- [`../handlers/README.md`](../handlers/README.md)
- [`../scripts/README.md`](../scripts/README.md)
- [`cross-skill-edges/README.md`](cross-skill-edges/README.md)
- [`ipc/README.md`](ipc/README.md)
- [`shared/README.md`](shared/README.md)
