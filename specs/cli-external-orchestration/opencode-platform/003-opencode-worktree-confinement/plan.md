---
title: "Implementation Plan: Keep cli-opencode workers inside the git worktree they are started in"
description: "Reproduce the worktree leak with a read-only probe, find where OpenCode 2 gets the main checkout path, then fix the dispatch shape and correct the containment claim in cli-opencode."
trigger_phrases:
  - "opencode worktree confinement plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Keep cli-opencode workers inside the git worktree they are started in

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS probe script, Markdown skill docs |
| **Framework** | OpenCode 2 CLI (`v2.2.5` when measured) |
| **Storage** | None |
| **Testing** | The probe's exit status and its list of outside paths |

### Overview
A probe starts one read-only OpenCode worker in a throwaway linked worktree and lists every tool path that falls outside it. Its output decides the fix, either an OpenCode flag that pins the project root or an absolute-root line in the shared child-dispatch preamble. The cli-opencode docs then describe the containment the probe proved.
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
- [x] The probe exits 1 with the old shape and exits 0 on three runs with the fixed shape
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Probe, then fix

### Key Components
- **Probe script**: creates a linked worktree, runs one read-only worker in it, parses the JSON event stream and prints each tool path outside the worktree
- **Dispatch shape**: the cli-opencode command line and the shared preamble every worker prompt starts with

### Data Flow
The probe writes a worker's JSON events to a file, pulls out every `path`, `filePath` and `workdir` field, and compares each one with the worktree root.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup builds the probe and reproduces the leak, Implementation applies the fix, and Verification reruns the probe and checks the docs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The probe is the test. With the old shape it must report at least one path outside the worktree. With the fixed shape it must report none on three runs.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

OpenCode 2 on `PATH`, `git` and an OpenCode provider with credit. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The change only touches docs and a probe script. Revert the commit. The probe removes its throwaway worktree with `git worktree remove` when it exits.
<!-- /ANCHOR:rollback -->

---
