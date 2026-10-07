---
title: "Tasks: Skill-Benchmark Optimize Automation (patch-gen)"
description: "Task breakdown for the skill-benchmark optimize automation phase, reconstructed from spec.md. The original tasks.md was never written."
trigger_phrases:
  - "skill-benchmark optimize automation tasks"
  - "router patch gold patch automation tasks"
importance_tier: "important"
contextType: "implementation"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Skill-Benchmark Optimize Automation (patch-gen)

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] T001 Capture the benchmark signals and the omitted wasted resource paths (`score-skill-benchmark.cjs`) as the re-derive-from-source motivation
- [ ] T002 Build the anti-gaming guard first (RED/GREEN) (`optimize-skill-benchmark.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Classifier and patch emission

- [ ] T003 Classify orphan signals — wire into a meaningful existing intent, or route an index/catalog file to `routing-allowlist.json`, never a fake intent
- [ ] T004 Classify always-loaded signals to `RESOURCE_MAP` or gold, and gold-align to the declared designed load
- [ ] T005 Classify intent-gate genuine over-routing via `wasteExDefault`
- [ ] T006 Emit `proposals/router.patch`, `proposals/gold.patch`, `proposals/optimize-report.json` and `proposals/optimize-report.md` via `git diff --no-index`
- [ ] T007 Add `--apply-router` and `--apply-gold` applying via `git apply --check` then re-benchmark
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Guard, hub awareness and wiring

- [ ] T008 Implement the mandatory anti-gaming guard (never invent gold, never add misrouting keywords, no placeholder intents, no blanket ALWAYS promotion, re-benchmark gate before emission)
- [ ] T009 Make hub fixes edit the child `SKILL.md` and verify `parent == union(children) + tier` as a hard precondition
- [ ] T010 Wire the loop-host mode and flip the command-doc "Planned automation" caveat
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [ ] T011 RED/GREEN vitest on synthetic skills: orphan to intent, orphan to allowlist, D3-ex-default to gold, D3-ex-default to router
- [ ] T012 RED/GREEN vitest: anti-gaming rejections, hub drift-guard, propose-by-default, apply modes
- [ ] T013 Dry-run reproduces the packet-002 code-review fix class (orphan-wire + gold-align)
- [ ] T014 Confirm `planInvocation('skill-benchmark-optimize', ...)` returns a single step and missing args fail
<!-- /ANCHOR:phase-4 -->

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
