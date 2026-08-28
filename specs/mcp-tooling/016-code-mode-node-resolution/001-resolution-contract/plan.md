---
title: "Implementation Plan: Node engine resolution contract"
description: "Build a dependency-free resolver that reads a declared engine range from a manifest, enumerates host interpreters, and selects a satisfying one or reports absence."
trigger_phrases:
  - "node engine resolver plan"
  - "interpreter selection design"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Node engine resolution contract

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS on Node, matching the other files under `.opencode/bin/lib/` |
| **Framework** | None; standard library only |
| **Storage** | None; reads manifests and directory listings |
| **Testing** | `node --test`, the runner the workspace gate already drives |

### Overview

A single module exposes one function: given the path of a package manifest and a host lookup, return an interpreter that satisfies the manifest's `engines.node`, or null. Range parsing is deliberately narrow, candidate enumeration is directory reads rather than process spawns, and selection is a sort over parsed versions.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The declared range in the server manifest is confirmed as the single source of truth
- [ ] The three outcomes are named: satisfied, unsatisfiable, unparseable
- [ ] Candidate locations are enumerated from what exists on a contributor machine

### Definition of Done
- [ ] `node --test` passes for the resolver test file
- [ ] The resolver's answer on this machine equals the interpreter the host configs name today
- [ ] An unsatisfiable fixture returns null, asserted as absence rather than as a fallback
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A pure function with injected host access. Directory listing and file reading arrive as parameters so the tests drive fixture hosts without touching the real filesystem.

### Key Components

- **Range reader**: extracts `engines.node` from a manifest and parses it into a lower bound and an exclusive upper bound.
- **Candidate enumerator**: collects interpreter paths from the running process, the search path, and the version-manager directories that exist.
- **Selector**: parses each candidate's version, discards those outside the range, and returns the remaining extreme.

### Data Flow

A manifest path yields a range. The host yields candidate interpreter paths. Each candidate yields a version. The selector intersects the two and returns one path or null; nothing is executed to decide.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the per-task state. The work divides into three stages:

### Phase 1: Establish the target
Record the declared range and the interpreter the host configs name today. These are the two values the finished resolver must reproduce, so they are captured before any code exists to bias them.

### Phase 2: Build the resolver
Range reading, candidate enumeration and selection, in that order, so each piece is exercised against fixtures before the next depends on it.

### Phase 3: Prove it against reality
Fixture hosts cover the unsatisfiable and range-change cases. One test asserts against the real machine, because a resolver that only satisfies fixtures has not been shown to model anything.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Fixture hosts are plain objects describing candidate paths and their versions, so the unsatisfiable case is testable without uninstalling anything. One test asserts against the real host: the resolver's answer must equal the interpreter the host configs currently hardcode, which is the only check that proves the resolver models reality rather than a fixture.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The code_mode server manifest must keep declaring `engines.node`. If that declaration disappears, the resolver treats the range as unsatisfiable, which stops a launch rather than guessing an interpreter.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Nothing consumes the resolver in this phase, so deleting the two new files restores the previous state exactly. No configuration, launch path, or installed artifact changes here.
<!-- /ANCHOR:rollback -->

---
