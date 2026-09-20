---
title: "Implementation Plan: Host configuration cutover"
description: "Edit six configuration files so code_mode fronts the launcher and the two unconstrained servers converge on the declaration the other five configurations already use."
trigger_phrases:
  - "mcp cutover plan"
  - "host config parity design"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Host configuration cutover

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Five JSON configurations and one TOML configuration |
| **Framework** | None; host-owned registration formats |
| **Storage** | None |
| **Testing** | Parse each file, then exercise each registered server through its configured command |

### Overview

Two mechanical edits repeated across files. Every code_mode registration stops naming an interpreter and starts naming the launcher. The two Codex registrations that name absolute interpreters for the memory and advisor servers adopt the declaration those same servers already carry in the other five configurations.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The launcher is delivered and proven equivalent to the direct launch
- [ ] The current attach behavior of all nineteen registrations is recorded as the baseline
- [ ] Each file's registration shape is known, since the JSON and TOML forms differ

### Definition of Done
- [ ] Every file parses
- [ ] Every registered server responds to an initialize request through its configured command
- [ ] A scan of the six files finds no absolute interpreter path
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Convergence on an existing majority. Fifteen of nineteen registrations already express the target shape, so this is bringing four in line rather than inventing a convention.

### Key Components

- **The five JSON configurations**: one registration each to repoint at the launcher.
- **The Codex TOML configuration**: one registration to repoint, and two to normalize.

### Data Flow

A host reads its configuration and starts the named command. For code_mode that command becomes the launcher, which resolves an interpreter and hands off. For the other two it becomes the search-path interpreter, which is what five configurations already do.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the per-task state. The work divides into three stages:

### Phase 1: Baseline and rollback
Record how all nineteen registrations behave now, and write down the revert for each of the six files. This is the first phase with live effect, so the undo is recorded before the first edit rather than reconstructed after a failure.

### Phase 2: Edit the six configurations
Five JSON files take one change each; the Codex file takes three. Grouping the Codex edits together keeps its three registrations consistent with each other at every point.

### Phase 3: Exercise every registration
Parse each file, then start every server through its configured command, then restart the hosts so the result comes from a cold start rather than an attached session.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Every registration is exercised rather than inspected. A parse proves the file is still valid to its host; an initialize handshake through the configured command proves the server still attaches. The scan for absolute interpreter paths is the objective check that the phase achieved its purpose, and it runs against the final state of all six files rather than the diff.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The launcher from 002-launcher-shim must exist and be executable, since five of the six edits point at it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each file changes by one or three lines, so reverting the six files restores the previous launch behavior without touching the launcher or resolver. Because this is the first phase whose effect is live, the revert is recorded before the edits rather than after.
<!-- /ANCHOR:rollback -->

---
