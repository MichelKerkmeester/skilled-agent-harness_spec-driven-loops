---
title: "Implementation Plan: restore the pi skill advisor brief: probe either root name for the warm-CLI assets and key the directive dedup receipt on the full contribution"
description: "Two hook-source fixes: make the warm-CLI asset probe accept either root name with all paths taken from one found root, and key the pi delivery-dedup receipt on the full delivered contribution; then rebuild the advisor package so the compiled hook the extension imports carries both."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: restore the pi skill advisor brief: probe either root name for the warm-CLI assets and key the directive dedup receipt on the full contribution

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (NodeNext), compiled with tsc; the pi extension loads it in-process |
| **Framework** | pi extension event hook (`input` event, fail-open, transform-append delivery) |
| **Storage** | SQLite skill graph + advisor database (per-checkout, scanned on trust) |
| **Testing** | Package vitest battery + stdin smoke of the compiled hook |

### Overview
Two small fixes in the hook sources. First, the warm-CLI fallback probe walks upward looking for the advisor shim and its IPC-bridge companion; it now accepts either root name (`.skilled` first, `.opencode` as the older-checkout fallback) and takes shim, bridge and default database dir from the same found root, so a half-migrated checkout can never spawn a mismatched pair. Second, the pi delivery-dedup receipt keys on the full delivered contribution instead of the directives alone, so a changed recommendation re-delivers its route line; the always-full escape hatch and the session-start/compact resets are untouched. Then the advisor package is rebuilt so the compiled hook the extension imports carries both fixes.
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
In-process event-hook extension (fail-open): a brief is advisory and never blocks the prompt.

### Key Components
- **`findCliFallbackPaths`** (hooks/lib/skill-advisor-cli-fallback.ts): probes, walking upward, for the advisor shim and IPC-bridge companion; yields the paths the one-shot CLI recommendation needs.
- **`decidePiDirectiveDelivery`** (hooks/pi/prompt-advisor.ts): decides whether this pi turn may suppress its visible contribution as a proven repeat; records the receipt on every full delivery.

### Data Flow
pi `input` event → the extension (kill-switches, dedup decision) → the compiled hook → the brief (probe → shim → CLI → resident daemon, or the local scorer marked stale) → rendered `Advisor: …` head + directives → transform-appended after the user's own text.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Beyond the verification tasks in `tasks.md`: the package's vitest battery ran both WITH the edits (880 passed / 11 failed / 898) and, via a stash-baseline of the same 8 failing files WITHOUT the edits (11 failed / 19 passed — the identical failure set), proving the 11 failures pre-exist at the worktree's HEAD and none come from the touched behavior.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the implementation commit and rebuild the advisor package; the prior fail-open, no-brief behavior returns. The shim, CLI, daemon and skill graph are untouched by this change.
<!-- /ANCHOR:rollback -->
