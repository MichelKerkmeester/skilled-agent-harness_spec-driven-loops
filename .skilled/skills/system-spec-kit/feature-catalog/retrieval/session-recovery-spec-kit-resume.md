---
title: "Session recovery via /speckit:resume"
description: "Reconstructs interrupted session state through the spec-folder resume workflow and routes the operator to one next step."
trigger_phrases:
  - "session recovery"
  - "speckit:resume"
  - "interrupted session reconstruction"
  - "resume workflow"
  - "session continuity recovery"
version: 2.0.6.0
---

# Session recovery via /speckit:resume

## 1. OVERVIEW

When a session is interrupted by a crash, context compaction, timeout, or an ordinary handoff between sessions, `/speckit:resume` reconstructs the most likely previous state and routes the user to the best next step. Session recovery is owned by the spec-folder resume workflow, where the canonical continuity ladder is `handover.md -> _memory.continuity -> spec docs` and the wrapper exposes helper access only when the packet is still thin.

---

## 2. HOW IT WORKS

**SHIPPED.** `/speckit:resume` owns both standard continuation and interrupted-session recovery. Since the memory server was removed, the ladder itself is entirely file-backed: it reads documents that exist on disk and never infers session state from an index.

- **`handover.md`** -- Read at any age when the packet has one. When `_memory.continuity` also exists, continuity wins over an unbound handover, and between a bound handover and continuity the more recently updated one wins.
- **`_memory.continuity`** (in `implementation-summary.md`) -- Supporting continuity state when `handover.md` is absent or needs enrichment from the canonical packet.
- **Packet-first spec docs and bounded anchors** -- `spec.md`, `plan.md`, `tasks.md` and the `<!-- ANCHOR:... -->` blocks inside them, read directly rather than retrieved.
- **The ripgrep recipes** in `references/retrieval/retrieval-conventions.md` §2 -- Free-text evidence when the packet is thin and the operator needs to locate a phrase across `specs/` and `.skilled/`. Ripgrep produces matches; the caller ranks them per §5.
- **The trigger index** -- `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs "<prompt>"` matches a prompt against author-declared `trigger_phrases`. The operator runs it to find a packet when the command asks for a spec folder path. The resume workflow never calls it.

There is no session inference, no semantic paraphrase and no candidate ranking behind the ladder. When the ladder produces nothing, the command asks rather than guessing. `references/retrieval/retrieval-conventions.md` §1 records that boundary as a deliberate loss.

One store-backed path sits outside the ladder. When a handoff note is claimed, the claim may add one bounded `## History Lookup` section with a read-only lookup command for the sending session's earlier turns. It never feeds the ladder, and its locator is fresh for 30 minutes from the claim. A compaction no longer offers it. [Handoff history lookup](../context-preservation/compaction-history-lookup.md) owns that contract.

### Resume Modes

Both modes run one workflow, `speckit-resume.yaml`, and detect the packet in the same order: the spec folder given as the CLI argument, then the handoff note of the calling session, then the packet whose `session_ref` names the calling session. A packet is opened only when the operator named it or the calling session's own records name it, never by modification time.

- **Auto** (`:auto`) -- Loads the default recovery packet without prompting. When no source names a packet, it prints the No Session result, asks for a spec folder path and opens nothing.
- **Confirm** (`:confirm` or default interactive mode) -- Asks at three checkpoints: session detection, context depth and continuation. When no source names a packet, it lists at most three packets by modification time, labels each as not matched to this session and waits for the operator's choice.

### Recovery Chain (Priority Order)

| Priority | Source | Use |
|----------|--------|-----|
| 1 | `handover.md`, at any age | Continuation context when the packet has a handover, weighed against `_memory.continuity` as described above |
| 2 | `_memory.continuity` in `implementation-summary.md` | Supporting continuity state when the handover packet needs enrichment |
| 3 | Packet-first spec docs and bounded anchors | Direct read when the packet is still thin |
| 4 | Ripgrep recipes (`retrieval-conventions.md` §2) | Free-text evidence, ranked caller-side |
| 5 | User confirmation | Final fallback |

### Post-Recovery Routing

- Quick "what was I doing?" answer: stop after the recovery summary
- Structured spec work: continue directly inside `/speckit:resume`
- Broader historical analysis: run the ripgrep recipes over the packet tree and read the packet's `implementation-summary.md` directly, plus its `changelog/` when an older packet still has one

---

## 3. SOURCE FILES

### Command Definition

| File | Role |
|------|------|
| `.skilled/commands/speckit/resume.md` | `/speckit:resume` command: standard continuation plus interrupted-session recovery |
| `.skilled/commands/speckit/assets/speckit-resume.yaml` | Resume and recovery workflow for both execution modes |

### Related Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Reference | The ripgrep invocation contract and the caller-side ranking tuple |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Script | Trigger-index lookup, the keyed prompt-to-packet lane |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Script | Generates the index the lookup reads |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` | Script | Continuity writer: produces the `_memory.continuity` block the ladder reads |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `runtime/cli/retrieval/measure-cold-lookup.mjs` | Automated test | Cold-lookup cost of the trigger-index lane |

---

## 4. SOURCE METADATA
- Group: Retrieval
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `retrieval/session-recovery-spec-kit-resume.md`

Related references:
- [Handoff history lookup](../context-preservation/compaction-history-lookup.md) - the optional store-backed lookup a claim may offer for the sending session's earlier turns.
