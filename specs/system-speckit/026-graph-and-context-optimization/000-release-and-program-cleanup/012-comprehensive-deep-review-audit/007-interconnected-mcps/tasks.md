---
title: "Tasks: Interconnected MCPs Review Slice"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "interconnected mcps review tasks"
  - "code graph skill advisor review tasks"
importance_tier: "normal"
contextType: "general"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Interconnected MCPs Review Slice

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the slice scope and review focus from `spec.md` against the parent campaign plan (`../plan.md`)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Audit `.opencode/skills/system-code-graph/SKILL.md` plus its mcp_server handlers and core modules for integration-contract drift against what system-spec-kit and the commands expect (`.opencode/skills/system-code-graph/`)
- [ ] T003 Audit `.opencode/skills/system-skill-advisor/SKILL.md` plus its advisor and skill-graph scripts for correctness (`.opencode/skills/system-skill-advisor/`)
- [ ] T004 Assess the fan-out concurrency mismatch: `fanout-pool.cjs` exposes a `concurrency` cap while `fanout-run.cjs`'s worker uses synchronous `spawnSync`, serializing lineages regardless of the cap; record severity and scope (`.opencode/skills/deep-loop-runtime/scripts/`)
- [ ] T005 Assess `executor-config.ts` validation correctness and safety of its defaults: per-lineage `iterations` only sizes the timeout and the sandbox defaults to `workspace-write` (`lib/deep-loop/executor-config.ts`)
- [ ] T006 Assess graceful degradation when an interconnected MCP is unavailable (`.opencode/skills/deep-loop-runtime/SKILL.md`)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Confirm every recorded finding carries evidence and that the audit requirements' acceptance criteria are satisfied (packet `review/` artifacts)
- [ ] T008 Record the verdict, including the concurrency-mismatch assessment required by the success criteria (packet `review/` artifacts)

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->

---
