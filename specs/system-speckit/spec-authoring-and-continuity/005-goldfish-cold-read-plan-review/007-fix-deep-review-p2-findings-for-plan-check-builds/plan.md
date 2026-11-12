---
title: "Implementation Plan: Phase 7: fix-deep-review-p2-findings-for-plan-check-builds"
description: "Apply a fixed sequence of exact edit packets across the existing runner, command carriers and status records. Reuse the existing configDir validator, regenerate compiled contracts from maintained sources, and run the prescribed suites and strict packet validator last."
trigger_phrases:
  - "fix deep review p2 findings for plan check builds plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: fix-deep-review-p2-findings-for-plan-check-builds

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, CommonJS, YAML, Markdown and Bash |
| **Framework** | Node.js command workflows and Vitest |
| **Storage** | None |
| **Testing** | Focused Vitest files, contract drift checks, scaffold gate, card sync and strict spec validation |

### Overview
Start with both deferred path checks and the current status documents, then apply one exact packet edit at a time. Reuse `validateClaudeConfigDir`, regenerate the research and review contracts from their source files, and run the specified verification commands in task order; the authoring dispatch does not run the suites.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The source disposition for SL-203 and SL-204 is supported by the cited source lines.
- [ ] The exact OLD text and stated count in each edit packet match the sequential source state. The closeout audit found mismatches in five packets, so this readiness item remains open.
- [x] Command, test, status and generated-contract scope is frozen in `spec.md`.

### Definition of Done
- [ ] Every required acceptance criterion has command evidence; AC-004 remains Unmet while the edit-packet replay discrepancies are unresolved.
- [x] Both contract compiler commands and every listed suite have passing evidence recorded in `tasks.md` and `../scratch/build-evidence.md`.
- [x] Strict validation prints `RESULT: PASSED`; this closeout changed only files inside the named packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential source-of-truth edits with generated contract refresh.

### Key Components
- **`fanout-run.cjs` and its unit file**: own one-lineage refusal, supported flag values and the reusable configDir validator.
- **Maintained command carriers and generator**: own visible policy wording and compiled contracts.
- **Packet status documents and `create.sh`**: own phase/checklist reconciliation and the single printed instruction value.

### Data Flow
The CLI parser stores a bare flag as Boolean `true` and a following value as a string. The guard admits only `true`, `'true'`, or `'1'`. Review `:auto` validates its optional configDir before assigning the process environment. Maintained command documents feed the contract compiler; status packets record only results observed by their verification tasks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup re-reads the review findings and current status sources and records the SL-203/SL-204 dispositions. Implementation applies `edit-T002.txt` through `edit-T029.txt` in task order; `edit-T029.txt` is a T005 follow-up that changes test paths to the home and repository `.claude` roots. Verification runs both contract generators, the named unit and stress suites, card sync, and strict validation through the tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run exactly the commands in Phase 3 of `tasks.md`, in order. The focused runner unit file covers accepted opt-in value forms, refusal of unsupported values and configDir root boundaries. Then run the stress adapter, contract drift/render tests, scaffold self-gate, card sync and strict validator. No new test suite or task-local test harness is added.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Existing `ACTIVE_FANOUT_LOOP_TYPES` constant and `validateClaudeConfigDir` helper in `fanout-run.cjs`.
- Existing deep research/review command contract compiler and maintained presentation sources.
- Existing Vitest and system-spec-kit card sync/strict validation commands.
- No new package or runtime dependency.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If an edit packet fails its stated OLD count, stop before applying that edit and re-read its target; do not broaden or hand-edit the match. If a later check fails, keep the packet Draft and repair the scoped edit or report the failing command and output. Revert only the scoped source edits from the implementation change if the owner decides to roll back; regenerate contracts from reverted maintained sources.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `fanout-run.cjs` active loop set and refusal predicate | Defines active types and direct one-lineage behavior | Update predicate and exact accepted values | Unit cases cover active research/review, accepted values and refused unsupported value. |
| Claude config root validator and review auto branch | Validator enforces home/repo `.claude*`; review auto currently forwards optional input | Export and call existing validator before assignment | Unit test accepts both approved roots and rejects outside path. |
| Research/review command docs and presentation assets | Maintained policy carriers compile into command contracts | Clarify one-lineage route, flag opt-in, field binding and executor row | Search maintained carriers and compare generated outputs after compile tasks. |
| Deep research fan-out catalog | Summarizes runner policy | State refusal and opt-in limitation | Exact policy search after T006. |
| Child 002, child 006 and parent phase docs | Record scope, checklist evidence and phase state | Apply only the named status edits | Each packet task verifies its exact replacement; strict validation closes this packet. |
| `create.sh` | Prints an authoring-card instruction in two branches | Use one readonly string at both echo sites | `bash -n`, exact grep count and byte comparison of printed text. |

Required inventories:
- Same-class producers: `rg -n -e 'ACTIVE_FANOUT_LOOP_TYPES|allowSingleLineage|configDir|config.maxIterations|fanout_executors|authoring-card.md' .skilled/commands/deep .skilled/skills/system-deep-loop .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`.
- Consumers of changed symbols: `rg -n -e 'validateClaudeConfigDir|allowSingleLineage|SPEC_AUTHORING_CARD_NEXT_STEP' .skilled/commands .skilled/skills/system-deep-loop .skilled/skills/system-spec-kit/runtime/cli/spec`.
- Matrix axes: opt-in absent, bare flag, separate `true`, separate `1`, `false`, and unsupported value; loop types research and review; configDir root home `.claude*`, repository `.claude*`, and outside both; labels satisfying and violating the existing label schema.
- Algorithm invariant: lineage labels accepted by the schema cannot introduce a path separator or traversal segment before `path.join(lineagesDir, lineage.label)`; configDir resolves only below the approved home/repo `.claude*` roots; refusal remains before side effects for unsupported opt-in values.
<!-- /ANCHOR:affected-surfaces -->


<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Review report and current cited source/status docs | Implementation edit packets |
| Implementation | Setup dispositions and sequential OLD-count checks | Contract regeneration and suites |
| Verification | All implementation edits and regenerated contracts | Acceptance and strict closure |
<!-- /ANCHOR:phase-deps -->

---
