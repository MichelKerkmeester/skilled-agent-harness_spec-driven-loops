---
title: "Implementation Plan: Phase 63: v4-0-0-13-final-changelog"
description: "Apply seven exact replacements to the v4.0.0.13 changelog so it names the new DeepSeek default, describes dispatch as preferring the first `opencode2` anywhere on PATH, adds an upgrade note for the older model and one for both versions being installed, and shows the suite counts from this tree. One DeepSeek v4.1 flash 1017 writer at high thinking applies the brief, both content validators check the result and one separate read-only session at max thinking reviews it."
trigger_phrases:
  - "v4 0 0 13 final changelog plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 63: v4-0-0-13-final-changelog

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown release note |
| **Framework** | `sk-create-changelog` section grammar and voice rules |
| **Storage** | None |
| **Testing** | `validate_document.py`, `hvr_scan.py`, read-only DeepSeek review |

### Overview
The work brings the trimmed v4.0.0.13 changelog up to the final tree. One DeepSeek v4.1 flash 1017 writer at high thinking receives a brief with seven exact replacements: the default model item, the dispatch glance bullet and the llmgateway upgrade note all move to `llmgateway/deepseek-v4.1-flash-1017`; dispatch reads as first `opencode2` anywhere on PATH with `opencode` only as the fallback and the fan-out runtime choosing the same way; a new older-model pin note joins them; a new `Expect OpenCode 2 when both are installed` note follows `Move to OpenCode 2`; and the suite table is refreshed from reruns on this tree. Both content validators then pass, and one separate read-only DeepSeek v4.1 flash 1017 session at max thinking returns VERDICT: PASS with two P2s, recorded and not fixed. The commit, push and CI run stay open.
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
- [x] Read-only review findings fixed or recorded (one PASS with no P0 or P1 and two P2s recorded)
- [x] Commit pushed to main with CI green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file documentation edit through one briefed writer pass, followed by independent validation and review.

### Key Components
- **Writer brief**: One DeepSeek v4.1 flash 1017 session at high thinking through `cli-pi` receives seven exact replacements and applies all of them.
- **Content validators**: `validate_document.py` checks document structure and `hvr_scan.py` checks the human-voice rules.
- **Read-only review**: One separate DeepSeek v4.1 flash 1017 session at max thinking reads the finished file and returns a verdict with findings.
- **Fact sources**: Phase 058, commit `5b5f56720f`, for the default model; phase 062, commit `4505c338b1`, for dispatch; the reruns on this tree for the suite counts.

### Data Flow
The trimmed changelog is the base. The writer applies the seven replacements in one pass, each drawn from a landed commit or a rerun on this tree. The validators read the assembled file for structure and voice, and the review reads it for accuracy and consistency. Findings go back to the orchestrator, which fixes what warrants a fix and records the rest.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->

---
