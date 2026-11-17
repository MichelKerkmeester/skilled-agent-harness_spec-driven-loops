---
title: "Implementation Plan: Phase 15: barter-overlay-upstream-intake"
description: "Check each claim in the vendoring project's message against the code and git history it names, fix the ones that hold with small file edits and a routing re-mint, and record the rest as operator questions."
trigger_phrases:
  - "barter overlay upstream intake plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 15: barter-overlay-upstream-intake

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js scripts, JSON routing files, Bash, Markdown |
| **Framework** | Skilled compiled routing and the doctor overlay engine |
| **Storage** | None |
| **Testing** | `node --test`, `compiled-route-admission.cjs`, `parent-skill-check.cjs`, `validate_document.py` |

### Overview
Four upstream files get one-line corrections, and mcp-tooling's router drops the bare `health` keyword and alias and gains two phrases, with its activation manifest re-minted. The re-pin report is answered from git history, with no engine change. Each check runs against the hub or file that changed.
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
- [x] `node .skilled/bin/compiled-route-admission.cjs --hub mcp-tooling` prints `16 pass, 0 drift` and `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-stage hub routing

### Key Components
- **`mcp-tooling/hub-router.json` and `mode-registry.json`**: the inputs the compiled router builds its policy from.
- **The activation manifest**: pins the policy hash the hub serves, so it must move with the inputs.

### Data Flow
The registry compiler reads the two routing files and computes a policy hash. The resolver serves compiled routing only while the manifest's hash equals that hash, and falls back to legacy routing otherwise.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup captures the doctor suite baseline and traces the five links through both repositories' history. Implementation corrects the four files and the mcp-tooling routing files, then re-mints the manifest. Verification replays the prompts and reruns the hub, document and doctor checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A prompt set replayed through `compiled-route.cjs --hub mcp-tooling` before and after the change must differ only on the bare health prompts and the two new phrases. `compiled-route-admission.cjs --hub mcp-tooling` must print 16 pass and 0 drift.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond Node.js, Python 3 and git. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: an mcp-tooling request that routed correctly before now defers or misroutes. Revert the routing commit, which restores both routing files and both manifests together.
<!-- /ANCHOR:rollback -->

---
