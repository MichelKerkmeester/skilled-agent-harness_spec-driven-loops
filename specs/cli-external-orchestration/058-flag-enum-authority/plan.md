---
title: "Implementation Plan: Flag Enum Authority"
description: "Correct the flag glossary against a probed enum, publish the probe, and surface the rule at dispatch time and hub-wide so the wrong inference is not reachable."
trigger_phrases:
  - "flag enum authority plan"
  - "permission mode probe"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Flag Enum Authority

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill documentation |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Direct probe against the installed `devin 3000.6.7` binary |

### Overview
Four documentation edits. The substantive one corrects a table that was wrong; the other three make the correct answer reachable before an agent reasons its way to the wrong one.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- The full accepted enum is established by probe, not by reading help

### Definition of Done
- Every accepted value appears in the glossary with its alias grouping
- The probe recipe is present with exit-code semantics
- Dispatch-time and hub-level rules are in place
- `validate.sh --strict` reports Errors: 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix the fact, then shorten the path to it. A correct table that nobody reads at dispatch time does not prevent the failure; the gotcha and the hub rule sit where the reasoning actually happens.

### Key Components
- `cli-reference.md` — the glossary that was wrong, and now carries the probe
- `cli-devin/SKILL.md` — routing-time gotchas, read before composing a dispatch
- `cli-external-orchestration/SKILL.md` — hub rules that bind all six CLIs
- `DV-004` — recorded evidence whose finding inverted

### Data Flow
An agent asks "is this flag value real?". Before this packet the nearest answer was an incomplete table. After it, the nearest answer is the full enum plus a one-command check, with a hub rule that fires even for a CLI whose skill lacks its own note.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Establish the true enum by probing every candidate value, including aliases named in historical evidence and two Claude-only controls.

### Phase 2: Implementation
Correct the glossary row, append the probe, add the dispatch-time gotcha, add the hub rule, and banner the stale scenario.

### Phase 3: Verification
Confirm each edit landed, and validate the packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The probe is the test. Point a file-taking flag at a nonexistent path so argument parsing validates the enum before the file is read: a rejected value exits 2 naming the invalid value, an accepted one exits 1 on the file error. `plan` and `manual` — Claude's modes, not Devin's — serve as negative controls proving the probe discriminates rather than accepting everything.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The installed `devin` binary, for the probe only. No runtime or build dependency.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Four markdown edits in three skills, no code and no generated artifacts. Revert the commit to restore prior text. The pre-change state is strictly worse — it is the state that produced the wrong audit — so rollback is a last resort rather than a safety net.
<!-- /ANCHOR:rollback -->

---
