---
title: "Resume: Continuity Ladder"
description: "Builds the resume ladder that recovers packet continuity from handover.md, then _memory.continuity, then the canonical spec docs."
trigger_phrases:
  - "resume ladder"
  - "session resume"
  - "buildResumeLadder"
---

# Resume: Continuity Ladder

---

## 1. OVERVIEW

`lib/resume/` owns the packet-recovery ladder used by session-resume flows. It resolves the active spec folder, follows a phase parent's last-active-child pointer to a valid child when present, and rebuilds packet continuity in one fixed precedence: `handover.md`, then `_memory.continuity`, then the canonical spec docs.

Current state:

- `resume-ladder.ts` is the only implementation file in this folder.
- A resume for a phase-parent folder first resolves the phase parent's current active child (via the index-layer access-telemetry store, gated by `SPECKIT_GENERATOR_HARDENING`) before building the ladder.
- The result includes a size-budgeted restore panel: recovered continuity facets (goal, decision, progress, gotcha) trimmed to an item and character budget, with omissions reported by reason.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                       lib/resume/                                │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────────┐      ┌─────────────────────┐      ┌──────────────────┐
│ requested/fallback │ ───▶ │ resolve spec folder │ ───▶ │ phase-parent      │
│ spec folder         │      │ (explicit/cached)   │      │ active-child redirect │
└────────────────────┘      └─────────┬───────────┘      └────────┬─────────┘
                                       │                            │
                                       ▼                            ▼
                             ┌─────────────────────────────────────────────┐
                             │ read handover.md, _memory.continuity,       │
                             │ and canonical spec docs, in that precedence │
                             └─────────────────────┬───────────────────────┘
                                                    ▼
                                       ┌─────────────────────────┐
                                       │ build continuity facets │
                                       │ and the restore panel   │
                                       └─────────────────────────┘

Dependency direction:
resume-ladder.ts → lib/discovery/, lib/continuity/thin-continuity-record.ts,
                    lib/config/capability-flags.ts, lib/graph/access-telemetry.ts,
                    lib/spec/is-phase-parent.ts
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `resume-ladder.ts` | Resolves the target spec folder, redirects a phase parent to its active child, reads the handover/continuity/spec-doc precedence, and builds the size-budgeted restore panel. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Ladder ownership | This folder owns precedence and redirect logic. It does not own the `_memory.continuity` record shape (`lib/continuity/thin-continuity-record.ts` does) or spec-document discovery (`lib/discovery/` does). |
| Writes | This folder only reads. `lib/continuity/authored-continuity-snapshot.ts` is the caller that writes the resulting snapshot back into markdown. |
| Phase-parent redirect | Only applied when `SPECKIT_GENERATOR_HARDENING` is on; otherwise the ladder resolves the requested folder directly. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ buildResumeLadder(options)               │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ resolve spec folder (explicit / fallback)│
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ redirect to active phase-parent child    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ read handover.md → _memory.continuity →  │
│ canonical spec docs, first match wins    │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ ResumeLadderResult with restore panel    │
╰──────────────────────────────────────────╯
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `buildResumeLadder(options)` | Function | Builds the resume ladder for a spec folder: source, resolution, continuity facets and the restore panel. |
| `ResumeLadderResult` | Type | The full ladder result: source, resolution, recovered fields, documents read, and the restore panel. |
| `ResumeLadderOptions` | Type | Inputs: requested and fallback spec folder, and the workspace path. |
| `ResumeRestorePanel` | Type | The size-budgeted panel of restored and omitted continuity facets, plus its rendered markdown. |

---

## 6. VALIDATION

Run from `.opencode/skills/system-spec-kit/runtime`.

```bash
npx vitest run tests/resume-ladder.vitest.ts
```

Expected result: the resume-ladder suite passes.

---

## 7. RELATED

- [`../continuity/README.md`](../continuity/README.md)
- [`../discovery/README.md`](../discovery/README.md)
- [`../graph/README.md`](../graph/README.md)
- [`../../handlers/README.md`](../../handlers/README.md)
