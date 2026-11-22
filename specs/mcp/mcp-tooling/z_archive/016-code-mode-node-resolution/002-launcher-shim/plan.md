---
title: "Implementation Plan: code_mode launcher shim"
description: "A thin executable that resolves an interpreter for the server manifest and replaces itself with the server, preserving the process identity the cleanup matchers depend on."
trigger_phrases:
  - "code mode launcher plan"
  - "launcher exec handoff design"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: code_mode launcher shim

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS executable under `.opencode/bin/`, alongside the two existing MCP launchers |
| **Framework** | None; standard library only |
| **Storage** | None |
| **Testing** | `node --test`, plus a live protocol handshake against the launched server |

### Overview

The launcher resolves an interpreter from the server manifest, then starts the server with that interpreter and the entrypoint path as its arguments, so the command line of the running process keeps the shape the cleanup matchers expect. When resolution fails it writes what was required and exits non-zero without starting anything.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The resolver from the previous phase is available and tested
- [ ] The cleanup matcher pattern is recorded so the identity test asserts against the real one
- [ ] The current direct-launch handshake response is captured as the comparison baseline

### Definition of Done
- [ ] A launcher-started server returns the same initialize response as a directly started one
- [ ] The cleanup matcher classifies a launcher-started process
- [ ] A forced-unsatisfiable run exits non-zero, names the range, and starts no server
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Handoff rather than supervision. The launcher makes one decision and then gets out of the way, unlike the memory and advisor launchers which stay resident to manage daemons and leases.

### Key Components

- **Entry**: locates the server manifest and entrypoint relative to the repository root.
- **Decision**: calls the resolver; on absence, writes the diagnosis and exits.
- **Handoff**: starts the interpreter with the entrypoint path, wiring standard streams straight through so the protocol is untouched.

### Data Flow

The host starts the launcher. The launcher reads the manifest, asks the resolver for an interpreter, and replaces its own role with the server process. From the host's perspective the stream contract is unchanged; from the sweeper's perspective the command line still contains the entrypoint path.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the per-task state. The work divides into three stages:

### Phase 1: Capture the baseline
Record the direct-launch initialize response and the shipped cleanup matcher pattern, so both later comparisons are against observed values rather than remembered ones.

### Phase 2: Build the launcher
Locate the manifest, ask the resolver, then hand off. The refusal path is written alongside the success path rather than after it, because the refusal is the behavior this phase exists to add.

### Phase 3: Prove equivalence and identity
Three assertions: the protocol response matches the baseline, the cleanup matcher still classifies the process, and an unsatisfiable range starts nothing.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Three checks carry this phase. A handshake test compares the launcher's initialize response against the direct launch, which proves the protocol survived the extra layer. An identity test runs the real cleanup matcher against a launcher-started command line, which proves the sweeper still sees the server. A refusal test forces an unsatisfiable range and asserts that nothing started, which is the check that distinguishes a loud failure from the uncatchable one this whole packet exists to avoid.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The resolver from 001-resolution-contract. The cleanup and sweeper matcher patterns, which are read rather than modified.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

No host configuration references the launcher during this phase, so deleting the two new files is a complete rollback. The live launch path is untouched until the next phase.
<!-- /ANCHOR:rollback -->

---
