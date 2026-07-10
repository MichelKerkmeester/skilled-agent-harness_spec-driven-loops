---
title: Workflow Reference - Implementation
description: Shared implementation workflow doctrine for sk-code — research and mutating build work run after the shared router resolves the active surface, consumed by every surface packet.
trigger_phrases:
  - "sk-code implementation workflow"
  - "implement workflow doctrine"
  - "mutating build workflow"
  - "surface implementation standards"
importance_tier: important
contextType: general
version: 4.1.0.2
---

# Workflow Reference - Implementation

Shared implementation workflow doctrine for `sk-code`. This reference covers research and mutating build work after the shared router has resolved the active surface. It is consumed by surface packets and defines no skill identity or surface-specific standards.

---

## 1. OVERVIEW

### Purpose

Implementation is the mutating build phase. It owns research before change, the smallest correct workspace edit, and the handoff into quality, debugging, and verification. It consumes surface identity from the shared router and then loads only the active surface resources needed for the task.

### When to Use

- Writing, modifying, refactoring, or building code in the active surface.
- Implementing a feature, script, component, module, fallback, parameter, authoring packet, or runtime behavior.
- Researching unfamiliar, risky, config-sensitive, security-sensitive, or multi-file code before changing it.
- Applying surface-specific authoring patterns after the active surface has already been resolved.
- Consuming an animation or motion overlay as peer reference material after surface detection, not as a replacement for surface standards.

### When Not to Use

- A concrete failing symptom is the dominant task; switch to debugging.
- The implementation is already written and needs author-side P0/P1/P2 checks, comment hygiene, or surface checklists; proceed to quality.
- The task is final non-mutating evidence; proceed to verification.
- The user wants findings-first review output rather than workspace mutation.
- The change is documentation-only prose with no executable behavior or routing change.

---

## 2. WORKFLOW

### Research

Run research before changing unfamiliar or high-blast code. For simple localized edits, research can be brief, but it still includes reading the actual target file before writing.

1. Read the target files first; do not edit a file you have not read in this session.
2. Read nearby conventions, callers, and existing examples before introducing new shapes.
3. Resolve surface identity through the shared router; do not re-detect or override it inside the implementation phase.
4. Load the minimum active-surface resource set for the intent and changed file types.
5. For broad or risky work, run a bounded read-only research sweep before editing.
6. If design or other upstream guidance handed off locked values, constraints, or risks, preserve them instead of redesigning the task.

### Pre-Write Restraint

Before writing, record the cheap facts later phases need:

| Field | Purpose |
| --- | --- |
| Baseline | Starting command status, known failing checks, warning count, runtime issue, or `UNKNOWN` when no safe baseline is available. |
| Blast Radius | One phrase such as `low-blast, reversible`, `medium-blast: multi-file behavior`, or `high-blast: touches auth/data/filesystem/config`. |

Apply the restraint ladder before adding code: verify the code needs to exist, prefer platform/runtime features and existing helpers, reuse installed dependencies only when already appropriate, then write the minimum code that satisfies the stated requirement. If requested scope looks unnecessary or risky, implement the requirement and raise a scope-amendment recommendation; do not silently cut scope.

### Write

1. Make the smallest correct change that satisfies the request and active-surface standards.
2. Preserve existing project conventions unless the request explicitly changes them.
3. Keep changes inside the user's scope and the established documentation scope.
4. Reuse existing helpers, templates, and patterns before adding abstractions.
5. Keep comments durable and explanatory; do not add artifact labels or temporary process markers.
6. Preserve routing metadata, config shapes, generated metadata ownership, and packet boundaries when authoring system assets.
7. Prepare the handoff with changed scope, baseline, likely checks, and accepted residual risks.

### OpenCode Surface Only: Implementation Guardrails

This subsection applies only to the OpenCode surface. It is present in the shared workflow file because this file is symlinked into multiple surfaces; Webflow readers should ignore this OpenCode-specific implementation guidance.

- Treat the mk-spec-memory daemon as the single writer for the indexed-continuity store while it is live. Use MCP tool paths for memory saves and index mutations when the daemon is running; do not hand-edit `description.json` plus SQLite/vector shard state or run standalone save/index writers against the same active database while the daemon owns the write lock.
- For git worktree isolation, defer to `sk-git`. This workflow may note that isolation is needed, but it must not duplicate `sk-git`'s worktree setup, branch, commit, or finish-work contract.
- Preserve the verification handoff. Implementation should name the package boundary, rebuild requirement, baseline, likely test command, and any env knobs the verifier must pin; final evidence belongs to [Workflow Reference - Verification](./workflow_verify.md), not implementation.

---

## 3. DISCIPLINE

### Always

- Always read target files before editing, including skeletons and existing README or contract files.
- Always consume surface identity from the shared router before loading implementation resources.
- Always select active-surface language or file-type guidance before applying standards.
- Always load authoring checklists at write-time when the active surface requires them.
- Always capture a baseline and one-phrase blast-radius read for non-trivial work.
- Always build the simplest correct implementation of the stated requirement.
- Always hand off quality and verification explicitly when the implementation is written.

### Never

- Never claim completion from implementation alone.
- Never treat unsupported or ambiguous surfaces as supported.
- Never apply standards from one surface to another surface's runtime behavior.
- Never silently narrow requested scope because part of it looks unnecessary.
- Never add packet-local advisor metadata when the parent owns the identity.
- Never paste whole reference documents into the workflow; link or load focused references when relevant.

### Escalate If

- Surface identity remains ambiguous after shared-router inputs are read.
- Implementation evidence conflicts with the approved spec or user instruction.
- The verification command set is unknown and the user expects a completion claim.
- Security-sensitive, filesystem, credential, destructive, or production-data behavior is unclear.

---

## 4. HANDOFF BOUNDARIES

- Quality receives the implemented change for author-side checks, comment hygiene, and active-surface checklists.
- Debugging receives failing checks or runtime symptoms and traces one root cause at a time.
- Verification receives the final changed state, baseline, commands to run, and the exact claim to prove.
- Review owns findings-first critique when the user asks for severity-ranked risks instead of mutation.

Implementation handoff is ready when the surface is known, target files were read, resources matched the active surface, the baseline and blast radius are available for non-trivial work, and the change is the smallest correct implementation of the stated requirement.
