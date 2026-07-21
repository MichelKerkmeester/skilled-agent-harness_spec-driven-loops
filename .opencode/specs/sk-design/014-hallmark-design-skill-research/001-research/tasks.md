---
title: "Tasks: Hallmark reuse research"
description: "Research task record for the Hallmark reuse/learning study."
_memory:
  continuity:
    packet_pointer: "sk-design/014-hallmark-design-skill-research/001-research"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Record the completed research tasks"
    next_safe_action: "Commit"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-opencode/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Hallmark reuse research

<!-- ANCHOR:notation -->
## Task Notation

`[x]` done · each task cites its REQ + evidence.

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Place the Hallmark repo (MIT, minus `.git`) + author the research charter. (REQ-002) [SOURCE: spec.md:44]
- [x] T002 [P0] Launch the two-executor fanout (cli-codex + cli-opencode, 10 iters each, concurrency 2, max-iterations). (REQ-001) [TESTED: `orchestration-summary.json` — 2/2 lineages ran]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P0] Run 10 forced-depth iterations per lineage across licensing/audit/schema/motion/foundations/themes/roadmap. (REQ-004, REQ-005) [TESTED: `sol-codex/deltas` iter-001..010]
- [x] T004 [P0] Synthesize each lineage's reuse/learning matrix with COPY/ADAPT/LEARN/INSPIRE-NEW/SKIP verdicts. (REQ-001) [SOURCE: research/lineages/sol-codex/research.md:26]

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 [P0] Confirm the licensing verdict is stated up front (MIT, notice for substantial copies, external assets SKIP). (REQ-002) [SOURCE: research/lineages/sol-codex/research.md:7]
- [x] T006 [P1] Confirm ranked adoptions + phased plan + eliminated alternatives exist. (REQ-006) [SOURCE: research/lineages/sol-codex/research.md:104]

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Both lineages completed 10/10; each `research.md` delivers a per-asset matrix + licensing verdict + ranked adoptions. DONE.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Charter: `spec.md`. Findings: `research/lineages/{sol-codex,sol-opencode}/research.md`. Adoption plan: `sk-design/016-hallmark-adoption`.

<!-- /ANCHOR:cross-refs -->
