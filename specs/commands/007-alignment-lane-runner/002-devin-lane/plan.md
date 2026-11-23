---
title: "Implementation Plan: Phase 2: devin-lane"
description: "Adds a cli-devin kind to the alignment lane runner. The kind checks its model against the deep-loop runtime's Devin allowlist when the config loads and gets each lane's argv from the runtime's shared builder, so the runner holds no Devin command of its own."
trigger_phrases:
  - "devin lane plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: devin-lane

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` |

### Overview
`run-lanes.cjs` gains a fifth kind, `cli-devin`. When a Devin config loads, the runner requires the deep-loop runtime and refuses a model outside `DEVIN_ALLOWED_MODELS`. When a Devin lane starts, it asks `buildLineageCommand` for a read-only Devin command and spawns the preset's binary with those arguments.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/commands/assets/local-skilled-alignment/tests/` reports 0 failures
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One more branch in the runner's existing per-kind dispatch, which already holds one branch for each of four kinds.

### Key Components
- **`loadLaneConfig`**: validates a preset. For `cli-devin` it requires `binary` and `model` and checks the model against the runtime's allowlist.
- **`laneArgs`**: builds a lane's argv. For `cli-devin` it returns the runtime builder's arguments plus the preset's `flags`.

### Data Flow
The workflow calls `run-lanes.cjs --preset devin`. The runner loads the preset, reads each lane prompt, gets the argv from `buildLineageCommand({ kind: 'cli-devin', model }, prompt, 'read-only', ...)`, spawns `devin` and reads the findings object from its output exactly as it does for the other kinds.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup backs up the ignored files and records the 92-test baseline. Implementation adds the kind, the preset and the doc lines, as `tasks.md` orders them. Verification runs the runner's tests and one `--lanes=devin` run of each alignment command.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The tests use the existing stub binary, named `devin` on a PATH the test controls, because the runtime's builder checks `command -v devin`. One test asserts the argv and an `ok` lane, and one asserts exit 2 for a model outside the allowlist.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The deep-loop runtime at `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, loaded only when a preset is `cli-devin`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The changed files are git-ignored, so git holds no copy. Their pre-change copies are in `~/.local/state/local-alignment-backups/20261123-devin-lane/`, at the same relative paths. Copying them back undoes the change.
<!-- /ANCHOR:rollback -->

---
