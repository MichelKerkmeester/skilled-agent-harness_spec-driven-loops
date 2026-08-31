---
title: "Implementation Plan: Correct the deep-loop command contracts to state the real per-command CLI executor sets"
description: "Read each deep command's own executor resolver, then rewrite that command's contract to match it, citing the enforcing constant; regenerate the derived contract artifacts and prove the drift gate green."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Correct the deep-loop command contracts to state the real per-command CLI executor sets

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown / plain-text command contracts and YAML workflow assets; evidence read from TypeScript and CommonJS runtime sources |
| **Framework** | system-deep-loop command surface (`.opencode/commands/deep/`) |
| **Storage** | None |
| **Testing** | `check-contract-drift.cjs`, `check-projection-coverage.cjs`, spec-kit `validate.sh --strict` |

### Overview
The contracts were wrong in two directions at once, so the fix could not be a single find-and-replace. Each of the four dispatch paths owns its own resolver and its own accepted set; the correct text for each contract was read from that path's resolver rather than generalized from the fan-out set. Where a set is genuinely narrow, the contract now says so and gives the mechanism, so a later reader does not "fix" it back.
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
- [x] Gates passing: `check-contract-drift.cjs` exit 0 with `OK commands=3`; `check-projection-coverage.cjs` exit 0 with `violations: []`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation mirrors a single source of truth per dispatch path; the doc names the constant and does not restate its contents.

### Key Components
- **`runtime/lib/deep-loop/executor-config.ts`**: `EXECUTOR_KINDS` (seven kinds), `EXECUTOR_KIND_FLAG_SUPPORT` (per-kind flag surface), and the three model allowlists. Authoritative for the fan-out loops.
- **`runtime/scripts/fanout-run.cjs`**: `LINEAGE_COMMAND_ADAPTERS` maps each kind to a command builder; the per-kind binary preflights and allowlist guards live in the builders.
- **`deep-ai-council/scripts/orchestrate-session.cjs`**: `resolveExecutorKind` - the council's own, narrower resolver, with an explicit rejection message for `cli-codex`.
- **`deep-improvement/scripts/model-benchmark/dispatch-model.cjs`**: `KNOWN_EXECUTORS` - the llm-grader set, which has no native and no codex entry.
- **`deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs`**: `dispatchScenario` - live transports, deliberately limited to the two executors that emit a structured tool-use stream.
- **`runtime/scripts/compile-command-contracts.cjs`**: compiles presentation sources into `assets/compiled/*.contract.md` with recorded source digests.

### Data Flow
Operator reads a presentation contract to choose an executor, answers the setup question, and the command writes an executor config that the path's resolver validates. A contract that names a kind the resolver rejects fails at that boundary, which is why the council correction mattered as much as the four missing kinds.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No unit tests: nothing executable changed. Proof is the pair of runtime gates plus a re-read of every edited region.

The negative control is load-bearing here. `check-contract-drift.cjs` was run **after** the source edits and **before** regeneration, and failed with exit 2 naming the three commands - so the same command passing at exit 0 afterwards proves the regeneration, rather than proving the gate is merely permissive.

One caveat that check surfaced: the gate was **already** red at HEAD. Five files the drift report named (`system-deep-loop/SKILL.md`, three `agents/*.md`, `deep-research-auto.yaml`) are unmodified in the working tree yet carried stale recorded digests. Regeneration absorbs that pre-existing metadata drift. The compiled diff was scanned to confirm it contains no body content beyond this change plus digest refreshes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the runtime scripts named in §3, all already present in the repository.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git checkout -- .opencode/commands/deep/ .opencode/skills/system-deep-loop/` restores all sixteen files. The change is documentation-only and touches no executable path, so reverting cannot break a running loop; the sole behavioral consequence of reverting is that the contracts resume understating the executor set.
<!-- /ANCHOR:rollback -->

---

