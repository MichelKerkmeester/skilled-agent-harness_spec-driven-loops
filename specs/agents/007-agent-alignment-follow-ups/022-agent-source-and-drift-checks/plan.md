---
title: "Implementation Plan: Phase 22: agent-source-and-drift-checks"
description: "Rebuild the roster check on the source tree with eight surfaces, link .opencode into both playbook sandboxes, and carry two agent source changes through every generator. DeepSeek V4.1 Flash max builds each task through cli-pi."
trigger_phrases:
  - "agent source and drift checks plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 22: agent-source-and-drift-checks

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS on Node, Bash, Markdown frontmatter |
| **Framework** | The `/doctor` diagnostics and the per-runtime agent generators |
| **Storage** | None |
| **Testing** | `node --test` for the roster check; generator `--check` runs |

### Overview
The roster check takes `.skilled/agents` as the roster, checks presence in six trees and links in two, and reads each tree's file shape. The sandboxes gain one symlink each. The two source edits flow out through the codex, pi, dsh and vibe generators.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] The four generators, the mirror check and the roster check exit 0 at the start

### Definition of Done
- [x] `node --test` on the roster test file passes with the new drift cases
- [x] The four generator checks and the mirror check exit 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A surface table in one diagnostic script.

### Key Components
- **`agent-roster-mirror-check.cjs`**: the roster comes from `.skilled/agents`; each surface names its directory, file shape and check kind.
- **The agent generators**: unchanged; they carry the two source edits.

### Data Flow
The roster check lists `.skilled/agents/*.md`, then for each surface checks every roster name and lists orphans. The generators read the source frontmatter and write each tree.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: baseline, three build tasks, then the checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The roster test builds throwaway roots with all eight trees and removes one agent from one tree per drift case. The real tree runs through the roster check, the mirror check and the four generator checks.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node's built-in test runner. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit, then rerun the four generators in write mode so the generated trees match the reverted sources.
<!-- /ANCHOR:rollback -->

---

