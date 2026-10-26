---
title: Workflow Reference - Implementation
description: Shared sk-code doctrine for the mutating build phase, from research before a change to the handoff into quality and verification.
trigger_phrases:
  - "sk-code implementation workflow"
  - "implement workflow doctrine"
  - "mutating build workflow"
  - "surface implementation standards"
importance_tier: important
contextType: general
version: 2.1.4.0
---

# Workflow Reference - Implementation

Shared `sk-code` doctrine for the mutating build phase, from research before a change to the handoff into quality and verification.

---

## 1. OVERVIEW

### Purpose

Implementation is the one lifecycle phase that builds new behavior. It reads before it writes, lands the smallest correct edit and hands the result on with the facts later phases need. It takes the active surface from the shared router and loads only that surface's resources.

### Core Principle

Read first, change the least and write the baseline down before the first edit. Debugging and verification can only measure a change against the starting state this phase recorded.

### When to Use

- Writing, modifying, refactoring or building code in the active surface.
- Implementing a feature, script, component, module, fallback, parameter, authoring packet or runtime behavior.
- Researching unfamiliar, risky, config-sensitive, security-sensitive or multi-file code before changing it.
- Applying surface authoring patterns once the shared router has resolved the surface.
- Using a library or framework overlay as peer reference after surface detection, never as a replacement for surface standards.

### When Not to Use

- A concrete failing symptom dominates the task. Use [debugging](./workflow-debug.md).
- The code is written and needs author-side P0/P1/P2 checks, comment hygiene or surface checklists. Use the `sk-code-quality` mode, which runs `quality-gate.cjs` first.
- The task is final non-mutating evidence. Use [verification](./workflow-verify.md).
- The user wants findings-first review output instead of workspace edits. Use the `sk-code-review` mode.
- The change is documentation-only prose with no executable behavior or routing change.

---

## 2. WORKFLOW

### Research

Research comes before any change to unfamiliar or high-blast code. For a small local edit it can be brief, but it always includes reading the target file.

1. Read every target file in this session before editing it.
2. List every place the change must reach (callers, tests, fixtures, config and exports). Read them, with nearby conventions and existing examples, before introducing a new shape.
3. Use the surface the shared router resolved ([stack-detection.md](../../shared/references/stack-detection.md)). Never re-detect or override it inside this phase.
4. Load the smallest active-surface resource set that covers the intent and the changed file types.
5. For broad or risky work, run a bounded read-only research sweep before editing.
6. When design or other upstream guidance handed off locked values, constraints or risks, keep them as given instead of redesigning the task.

### Pre-Write Restraint

Before the first edit of non-trivial work, record two facts:

| Field | Content |
| --- | --- |
| Baseline | The starting state, in the shape of the Baseline row in the verification [Baseline And Delta](./workflow-verify.md#baseline-and-delta) table. Write `UNKNOWN` when no safe baseline exists, because verification then has to settle for a narrower claim. |
| Blast Radius | One phrase, such as `low-blast, reversible`, `medium-blast: multi-file behavior` or `high-blast: touches auth/data/filesystem/config`. |

Then walk the [Design Restraint Ladder](../../shared/references/universal/code-quality-standards.md#design-restraint-ladder-pre-write) and stop at the first rung that holds. The ladder never cuts a P0 item or anything the user asked for. When requested scope looks unnecessary or risky, implement the requirement and raise a scope-amendment recommendation in the same response. Never cut scope silently. The restraint floor belongs to `.skilled/repo-rules/prevent-overengineering.md` sections 1 and 2 and the Restraint Signals table in `AGENTS.md` section 3.

### Write

1. Write the smallest correct change that meets the request and the active-surface standards.
2. Keep the project's existing conventions unless the request changes them.
3. Stay inside the user's scope and the established documentation scope.
4. Keep comments durable and explanatory. Never add artifact labels or temporary process markers, because they go stale the moment the work that named them closes.
5. Keep routing metadata, config shapes, generated-metadata ownership and packet boundaries intact when authoring system assets.
6. Prepare the handoff: changed scope, baseline, likely checks and accepted residual risks.

### OpenCode Implementation Guardrails

For system code under `.skilled/` (the `sk-code-skilled` surface), also apply the [implementation guardrails](../../sk-code-skilled/references/shared/workflow-guardrails.md#2-implementation-guardrails).

---

## 3. DISCIPLINE

### Always

- Always read a target file before editing it, including skeletons and existing README or contract files.
- Always use the surface identity the shared router resolved before loading implementation resources.
- Always pick the active-surface language or file-type guidance before applying standards.
- Always load authoring checklists at write time when the active surface requires them.
- Always record a baseline and a one-phrase blast-radius read for non-trivial work.
- Always build the simplest correct implementation of the stated requirement.
- Always hand off to quality and verification explicitly once the code is written.

### Never

- Never claim completion from implementation alone. The [Iron Law](./workflow-verify.md#iron-law) gates every completion claim.
- Never treat an unsupported or ambiguous surface as supported.
- Never apply one surface's standards to another surface's runtime behavior.
- Never narrow requested scope silently because part of it looks unnecessary.
- Never add packet-local advisor metadata when the parent owns the identity.
- Never paste whole reference documents into the workflow. Link or load the focused reference instead.

### Escalate If

- Surface identity stays ambiguous after the shared-router inputs are read.
- Implementation evidence conflicts with the approved spec or a user instruction.
- The verification command set is unknown and the user expects a completion claim.
- Security-sensitive, filesystem, credential, destructive or production-data behavior is unclear.

---

## 4. HANDOFF BOUNDARIES

- Quality (`sk-code-quality`) receives the change for author-side checks, comment hygiene and active-surface checklists. The mode runs `quality-gate.cjs` first and loads every checklist its verdict lists.
- [Debugging](./workflow-debug.md) receives failing checks or runtime symptoms and traces one root cause at a time.
- [Verification](./workflow-verify.md) receives the final changed state, the baseline, the commands to run and the exact claim to prove.
- Review (`sk-code-review`) owns findings-first critique when the user asks for severity-ranked risks instead of edits.

The handoff is ready when the surface is known, the target files were read, the loaded resources match the active surface, non-trivial work carries a baseline and a blast-radius note and the change is the smallest correct implementation of the stated requirement.

---

## 5. RELATED RESOURCES

- [workflow-debug.md](./workflow-debug.md) - the repair phase that takes over when a symptom appears.
- [workflow-verify.md](./workflow-verify.md) - the evidence phase, the Iron Law and the baseline shape this phase records.
- [phase-detection.md](../../shared/references/phase-detection.md) - how a request maps to this phase and what each phase hands on.
- [code-quality-standards.md](../../shared/references/universal/code-quality-standards.md) - the Design Restraint Ladder and the P0 items it never cuts.
