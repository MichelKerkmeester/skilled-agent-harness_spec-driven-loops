---
title: "Goal: Align the research prompt pack with the agent definition"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "prompt pack contract alignment goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment"
    last_updated_at: "2026-11-17T17:15:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-17-expansive-depth-goals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Align the research prompt pack with the agent definition

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** A research leaf reads one write rule and one next-focus heading, and a test fails if the agent definition and the research prompt pack disagree again.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The prompt pack conforms to the agent definition; `.skilled/agents/deep-research.md` and its runtime mirrors do not change. |
| D2 | The `research.md` entry is static pack text that names `progressiveSynthesis` and points at the `research.md` beside the run's `iterations/` directory, with no new render variable, so both workflow YAMLs stay unchanged. |
| D3 | The review prompt pack, review agent and review reducer do not change. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `rg -n "research\.md.*progressiveSynthesis" .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` prints one line inside the ALLOWED WRITE PATHS list with no `research/research.md` literal, and a `prompt-pack.vitest.ts` case rendering a lineage iteration path shows the entry pointing at that lineage directory's `research.md`.
- [x] `rg -n "Questions Remaining, Recommended Next Focus"` on that template prints one line, and `rg -n ", Next Focus\."` on it prints nothing.
- [x] A `prompt-pack.vitest.ts` case asserts that `.skilled/agents/deep-research.md` and the template both have a line naming `research.md` with `progressiveSynthesis` and both name `Recommended Next Focus`, and it fails when either line is deleted from a scratch copy of the pack.
- [x] A case feeds the research reducer a narrative with the headings the pack names and gets a non-empty parsed `nextFocus`.
- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/prompt-pack.vitest.ts tests/unit/deep-research-reduce-state.vitest.ts tests/unit/deep-research-deltas-contract.vitest.ts tests/unit/deep-review-deltas-contract.vitest.ts tests/unit/check-documentation-drift.vitest.ts tests/unit/check-contract-drift.vitest.ts tests/unit/compile-command-contracts.vitest.ts` exits 0.
- [x] `git diff --stat` for this phase lists no file under `deep-review/`, neither agent definition and no compiled contract other than a regenerated `deep-research.contract.markdown`.
- [ ] `rg -l "progressiveSynthesis" .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering` lists a scenario written by `/create:manual-testing-playbook`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase spec authored | Done | `spec.md`, `plan.md`, `tasks.md` written 2026-11-17 |
| Implementation | Done (code and tests) | 2026-11-17 in worktree `458-ed-005-prompt-pack-contract`. Pack entry at `prompt-pack-iteration.md.tmpl:45`, heading renamed at `:62`, four new `prompt-pack.vitest.ts` cases, research contract regenerated. Seven suites: 89 passed, exit 0 (baseline 85) |
| Negative control | Done | A scratch pack without the entry failed the lockstep case, and one with the old heading failed it too. Both copies deleted |
| Playbook scenario | Blocked | `/create:manual-testing-playbook` hard-blocks at Phase 0 unless run as `@markdown`; the phase worker cannot start that agent |

### Deviations and findings

| Item | Note |
|------|------|
| Goal source | This phase has no `acceptance-criteria.md`; the criteria come from the REQ table in `spec.md` §4, as the authoring brief directed. |
| Open questions | `spec.md` §7 records the reverse fix direction (remove the leaf permission from the agent) and the render-variable alternative; this goal follows the spec's chosen direction. |
| Changelog | Added T011 from the cross-phase handoff §3 (default-path change). Blocked by the same `@markdown` gate as the playbook. |
| Typecheck command | `npx tsc` resolves no TypeScript in the runtime package. The real check is `npm run -s typecheck` there. |
| Plan review | The 2026-11-17 plan review findings were applied: the allowed path is worded relative to the run's artifact directory with a lineage render case, the contract is regenerated after each merge, this phase lands before 004, the test command runs from the runtime folder, and this phase writes its own playbook scenario. |
<!-- /ANCHOR:log -->
