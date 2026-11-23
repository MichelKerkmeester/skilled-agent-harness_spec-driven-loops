---
title: "Implementation Plan: Phase 12: browser-hub-doc-topic"
description: "Adds one mcp-browser-use entry to the private topics.json of /local-doc-alignment, with the hub folder as its code root and four checks, then runs the command once with Devin lanes."
trigger_phrases:
  - "browser hub doc topic plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: browser-hub-doc-topic

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config read by Node.js |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The command's own scope step and one full run |

### Overview
A topic in `topics.json` is a title, search terms, code roots and optional checks. The new entry names the browser hub's folder as its code root, so every doc inside the hub is in scope, and its terms pull in docs elsewhere that name the hub, a mode or bdg.
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
- [ ] `doc-alignment.cjs scope --topic mcp-browser-use` prints `STATUS=OK`, and the Devin run writes `report.md`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One data entry in an existing config file. No code changes.

### Key Components
- **`topics.json`**: holds the topic.
- **`doc-alignment.cjs scope`**: reads the topic, lists the docs and splits them into lanes.

### Data Flow
The scope step matches the terms against tracked docs and adds every doc under the code root. The shared runner then sends each lane to Devin, and the aggregator writes `report.md`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup backs up `topics.json`. Implementation adds the topic. Verification runs the scope step, then one `--lanes=devin` run, as `tasks.md` orders them.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The scope step proves the topic parses and finds docs. The full run proves the checks and lanes work with it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `devin` lane preset from `specs/commands/007-alignment-lane-runner/002-devin-lane`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`topics.json` is git-ignored. Its pre-change copy is in `~/.local/state/local-alignment-backups/20261123-devin-lane/`, at the same relative path, and copying it back removes the topic.
<!-- /ANCHOR:rollback -->

---
