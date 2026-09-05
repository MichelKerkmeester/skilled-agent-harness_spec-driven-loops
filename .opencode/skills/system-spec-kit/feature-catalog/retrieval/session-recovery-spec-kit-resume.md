---
title: "Session recovery via /speckit:resume"
description: "Reconstructs interrupted session state through the unified spec-folder resume workflow."
trigger_phrases:
  - "session recovery"
  - "speckit:resume"
  - "interrupted session reconstruction"
  - "resume workflow"
  - "session continuity recovery"
version: 4.0.0.0
---

# Session recovery via /speckit:resume

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

When a session is interrupted by a crash, context compaction, timeout, or an ordinary handoff between sessions, `/speckit:resume` reconstructs the most likely previous state and routes the user to the best next step. Session recovery is owned by the spec-folder resume workflow, where the canonical continuity ladder is `handover.md -> _memory.continuity -> spec docs` and the wrapper exposes helper access only when the packet is still thin.

---

## 2. HOW IT WORKS

**SHIPPED.** `/speckit:resume` owns both standard continuation and interrupted-session recovery. Since the memory server was removed, the chain is entirely file-backed: it reads documents that exist on disk and never infers session state from an index.

- **`handover.md`** -- The preferred continuation context when a fresh structured handoff exists in the packet.
- **`_memory.continuity`** (in `implementation-summary.md`) -- Supporting continuity state when `handover.md` is absent or needs enrichment from the canonical packet.
- **Packet-first spec docs and bounded anchors** -- `spec.md`, `plan.md`, `tasks.md` and the `<!-- ANCHOR:... -->` blocks inside them, read directly rather than retrieved.
- **The ripgrep recipes** in `references/retrieval/retrieval-conventions.md` §2 -- Free-text evidence when the packet is thin and the operator needs to locate a phrase across `specs/` and `.opencode/`. Ripgrep produces matches; the caller ranks them per §5.
- **The trigger index** -- `node .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs "<prompt>"` matches a prompt against author-declared `trigger_phrases` when the operator does not yet know which packet to open.

There is no session inference, no semantic paraphrase and no candidate ranking behind this workflow. When the ladder produces nothing, the command asks rather than guessing; `references/retrieval/retrieval-conventions.md` §1 records that boundary as a deliberate loss.

### Resume Modes

- **Auto** (`:auto`) -- Resolves the strongest session candidate with minimal prompting. Prefers a candidate when folder discovery matches a single spec folder, top results cluster around one `specFolder`, or returned content contains state/next-steps/summary/blockers anchors.
- **Confirm** (`:confirm` or default interactive mode) -- Presents the detected session, optional supplemental context choices, and continuation options when confidence is lower or the operator wants checkpoints.

### Recovery Chain (Priority Order)

| Priority | Source | Use |
|----------|--------|-----|
| 1 | `handover.md` (<24h) | Preferred continuation context when a fresh structured handoff exists |
| 2 | `_memory.continuity` in `implementation-summary.md` | Supporting continuity state when the handover packet needs enrichment |
| 3 | Packet-first spec docs and bounded anchors | Direct read when the packet is still thin |
| 4 | Ripgrep recipes (`retrieval-conventions.md` §2) | Free-text evidence, ranked caller-side |
| 5 | Trigger index lookup | Prompt-to-packet routing when no candidate is known |
| 6 | User confirmation | Final fallback |

### Post-Recovery Routing

- Quick "what was I doing?" answer: stop after the recovery summary
- Structured spec work: continue directly inside `/speckit:resume`
- Broader historical analysis: run the ripgrep recipes over the packet tree and read the packet's `changelog/` and `implementation-summary.md` directly

---

## 3. SOURCE FILES

### Command Definition

| File | Role |
|------|------|
| `.opencode/commands/speckit/resume.md` | `/speckit:resume` command: standard continuation plus interrupted-session recovery |
| `.opencode/commands/speckit/assets/speckit-resume-auto.yaml` | Autonomous resume and recovery workflow |
| `.opencode/commands/speckit/assets/speckit-resume-confirm.yaml` | Interactive resume and recovery workflow |

### Related Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Reference | The ripgrep invocation contract and the caller-side ranking tuple |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Script | Trigger-index lookup, the keyed prompt-to-packet lane |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Script | Generates the index the lookup reads |
| `.opencode/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` | Script | Continuity writer: produces the `_memory.continuity` block the ladder reads |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `runtime/cli/retrieval/measure-cold-lookup.mjs` | Automated check | Cold-lookup cost of the trigger-index lane |
| `runtime/cli/tests/manual-playbook-runner.vitest.ts` | Automated test | Scenario runner contract for the resume playbook entry |

---

## 4. SOURCE METADATA
- Group: Retrieval
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `retrieval/session-recovery-spec-kit-resume.md`
