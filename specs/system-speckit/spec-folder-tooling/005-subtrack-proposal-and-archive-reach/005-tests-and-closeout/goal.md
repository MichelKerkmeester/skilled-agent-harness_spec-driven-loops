---
title: "Goal: Phase 5: tests-and-closeout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "tests and closeout goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/005-tests-and-closeout"
    last_updated_at: "2026-11-13T10:07:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-tests-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: tests-and-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove the relocation engine, the subtrack proposal, archive numbering and the archive mode with vitest suites and real-tree checks, and close the packet with evidence.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every suite runs the real script in its own temp repository. No suite moves or writes a file in the real repository. |
| D2 | This phase changes no production behavior. A defect a test exposes is fixed in the phase that owns the code. |
| D3 | The regression claim compares the final `npm test` run with the baseline captured before the first edit of the packet. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `npx vitest run tests/relocate.vitest.ts tests/suggest-subtracks.vitest.ts tests/archive-numbering.vitest.ts tests/rg-include-archive.vitest.ts tests/validate-archive-recursive.vitest.ts` in `.skilled/skills/system-spec-kit/runtime/cli` exits 0
- [ ] `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` exits 0 and its fail count is not above the baseline
- [ ] `relocate.mjs --map <sample> --apply` in a throwaway copy exits 0 and a second run exits 0 with nothing to do
- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach --strict --recursive` prints `RESULT: PASSED` for the parent and all five children
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents authored | Done | `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` in this folder |
| Implementation | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| Suite file names | The approved plan lists the suites by subject. These docs name the five files. |
| Archive numbering coverage | Phase 003 adds one case to `create-root-numbering.vitest.ts`. The suite here covers the specs root and subtrack depths. |
<!-- /ANCHOR:log -->
