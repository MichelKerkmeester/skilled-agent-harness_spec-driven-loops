---
title: "Implementation Plan: Phase 8: routing-and-release-alignment"
description: "Add three intent signals and one read-only lift, apply the review trims, and put the retrieval work in the v4.0.2.0 notes."
trigger_phrases:
  - "routing and release alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: routing-and-release-alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (advisor scorer), JavaScript modules (retrieval), JSON metadata, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Vitest (advisor and system-spec-kit suites), the alignment battery, the changelog shape check |

### Overview
Rerun the seven stored probes to find which still miss. Fix vocabulary misses with intent signals, and the two read-only misses with one branch in `readOnlyRouteAllowed`. Have a review agent read the retrieval code against the overengineering rule, verify each finding in the source, and apply the ones that hold. Then write the changelog entries and move the release tag.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `run-battery.cjs` over this change prints `fail=0`, and both suites exit 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scorer gate over skill metadata

### Key Components
- **`readOnlyRouteAllowed`**: decides which skill may pass on a read-only question. Every other skill stays at 0.25.
- **`graph-metadata.json`**: carries the phrases the advisor matches prompts against.

### Data Flow
A read-only prompt that names the trigger index now passes the gate for `system-spec-kit`, which scores at or above 0.82. With a skill passing, the doctor hand-off needs a strong cue of its own and no longer claims the prompt.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`route-gates.vitest.ts` covers the lift, the other-skill gate, the drift exception and a prompt with no index noun. The advisor suite guards the routing corpus, and the `system-spec-kit` suite guards the trims.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`rg` and `node`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the one commit, run `npm run build` in `system-skill-advisor/runtime`, then `skill_graph_scan --trusted` and `advisor_rebuild --trusted --force true`. To restore the release tag, push the old tag object `5aae50857d` back to `v4.0.2.0`.
<!-- /ANCHOR:rollback -->

---

