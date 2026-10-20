---
title: "Implementation Plan: Phase 25: cli-opencode-docs-and-listings"
description: "Probe both OpenCode versions with private homes, correct each cli-opencode doc fact against the captures, add a command-listed leg to the version battery and a test that keeps the default model id aligned."
trigger_phrases:
  - "cli opencode docs and listings plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 25: cli-opencode-docs-and-listings

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (node:test), Markdown, JSON, GitHub Actions YAML |
| **Framework** | None |
| **Storage** | None |
| **Testing** | node:test, run against injected fixtures and temporary directory trees |

### Overview
Each fact is probed first and the docs follow the capture. Probes run against OpenCode 1.19.3 and 2.0.32 with a private data home, and every v2 read starts its own `serve` on a free loopback port with a private database, so the shared service is never contacted. The listing comparison becomes a battery leg because the battery already collects both listings' inputs: the v1 `debug config` and a private v2 server.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other - a diagnostic leg and documentation corrections.

### Key Components
- **`command-listed` leg**: compares a family's listed command names with the `.md` files under the project's `.opencode/command(s)` folder. Names from the global config folders are allowed on both families, and on v2 so are every ancestor `.opencode` folder's names and the built-ins `init` and `review`.
- **`default-model-id.test.cjs`**: reads the roster's one opencode-go default and fails when a current doc names the retired id.

### Data Flow
The battery's v1 leg reads the `command` keys of the `debug config` it already runs. The v2 leg reads `GET /api/command` from its private server until two reads agree on a non-zero count. Each listing is judged against the folders that family reads.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each new test is run against main's code or docs and against mutants, and each run is kept under `scratch/mutation/`. The battery also runs live on both families in this worktree, which is nested inside the main checkout, so the v2 walk-up is exercised for real.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The installed `opencode` 1.19.3 and `opencode2` 2.0.32. Nothing is installed or upgraded.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. The leg only adds a check and the doc edits change no runtime behaviour.
<!-- /ANCHOR:rollback -->

---
