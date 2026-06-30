---
title: "Tasks: Doc, prompt & routing fixes (remove the fabrication mandates) [template:level_2/tasks.md]"
description: "Remove the structural instructions in the format spec, style guide, prompt template, and SKILL.md that REQUIRE the AI to write content with no backing data. Adds the ABSENT-stamp path, the AP-29 anti-pattern, the per-section anti-fabrication ruleset, and loads the cardinal-rules card as a pre-write gate."
trigger_phrases:
  - "fabrication mandate removal"
  - "absent stamp"
  - "named principle evidence gate"
  - "comparative framing removal"
  - "per-section anti-fabrication ruleset"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/006-sk-design-md-generator/003-doc-prompt-routing-fixes"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 003 from research Phase 2"
    next_safe_action: "Implement T-section requirements data-driven first"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Doc, prompt & routing fixes (remove the fabrication mandates)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

No completion claim without the `validate.ts`/`vitest` regression evidence named in the task.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture baseline (tool tests + anobel/gold-standard extraction snapshots) BEFORE any change

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 (Remove the mandates) Make section requirements data-driven; demote §0/§7/§11/§12 (+§6.5/§9) to conditional
- [ ] T003 (Remove the mandates) [P] Named principle conditional-on-evidence (≥3 tokens/≥2 pages) in §9/§1/§3
- [ ] T004 (Remove the mandates) [P] Remove comparative-framing mandate; replace with intra-system comparison
- [ ] T005 (Remove the mandates) Motion fallback → OBSERVED/RECOMMENDED labeled blocks
- [ ] T006 (Add the legal exit + rules) Add ABSENT-stamp output + ESCALATE-IF for zero-data sections (SKILL.md, format §22, prompt)
- [ ] T007 (Add the legal exit + rules) [P] Add AP-29 Interpretive Fabrication + NEVER-qualitative rule (anti_patterns.md, SKILL.md)
- [ ] T008 (Add the legal exit + rules) Load cardinal_rules_card.md as a pre-write gate; remove inline duplicates
- [ ] T009 (Add the legal exit + rules) Resolve style-guide §10 vs format-spec philosophy contradiction
- [ ] T010 (Per-section ruleset) Document the per-section FORBID/CITE-TOKEN/GATE/LABEL ruleset (iter-037) in the format spec
- [ ] T011 (Per-section ruleset) Record the deterministic-vs-prose section split (iter-040) for phase 005

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Re-author the anobel DESIGN.md by the new rules; confirm §6 ABSENT + no fabricated claims
- [ ] T013 sk-doc template + validate.sh --strict on the skill docs

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All P0 tasks `[x]` with regression evidence; anobel + gold-standard re-extraction deltas reviewed; `validate.sh --strict` + `package_skill.py --check` green; the two known hallucinations no longer have fabricated backing data.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` | Plan: `plan.md` | Checklist: `checklist.md`
- Research: `../research/research.md` §6 (Phase 2) + §2.2
- Parent: `../spec.md` (Phase Documentation Map)
<!-- /ANCHOR:cross-refs -->

---

