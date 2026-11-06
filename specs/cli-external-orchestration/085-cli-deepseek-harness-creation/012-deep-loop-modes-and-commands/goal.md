---
title: "Goal: Phase 12: deep-loop-modes-and-commands"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "deep loop modes and commands goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/012-deep-loop-modes-and-commands"
    last_updated_at: "2026-11-06T08:57:12Z"
    last_updated_by: "codex-gpt-6"
    recent_action: "Logged the test disposition and open checks"
    next_safe_action: "Resolve T002, CHK-041 and CHK-050"
    blockers:
      - "T002 baseline transcript not saved"
      - "CHK-041 wording remains out of scope"
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "evidence/rerun-checks.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-012-deep-loop-modes-and-commands"
      parent_session_id: null
    completion_pct: 82
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 12: deep-loop-modes-and-commands

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** `/deep:research` and `/deep:review` can select the `cli-deepseek-harness` executor kind, and the AI Council seat question has a recorded answer.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only maintained sources are edited, and `compiled/deep-research.contract.markdown` and `compiled/deep-review.contract.markdown` are produced by `compile-command-contracts.cjs` |
| D2 | The kind is offered as an explicit executor choice, never as a default, until a route is proven live |
| D3 | Council files change only if the seat decision record admits a seat |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -l cli-deepseek-harness` matches both `loop-protocol.md` files, `deep-review/SKILL.md`, both auto YAMLs, both presentation lists and both compiled contracts
- [ ] A second run of `compile-command-contracts.cjs` leaves `git diff --exit-code .skilled/commands/deep/assets/compiled/` at exit 0
- [ ] The council seat decision record exists in this phase folder, and if it admits a seat `orchestrate-session-cli.vitest.ts` passes
- [ ] The `executor-config`, `fanout-run`, `combo-matrix` and `executor-audit` vitest suites show no new failure against the pre-edit baseline
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
| Strict spec validation | Passed with 0 warnings | `evidence/closeout-validation.txt:51`, `:53` | 
| Deep-loop executor lists (protocols, deep-review SKILL, auto YAMLs, presentation lists) | Built. CHK-041 is open for the protocol and deep-review wording | `evidence/rg-l-nine-files.txt`, `evidence/rg-deepseek-lines.txt` |
| Compiled contracts | Regenerated. A second compile is byte-identical to the on-disk contracts | `evidence/compile-dry-run-compare.txt` |
| AI Council seat decision | Recorded as ADR-001: no seat, no council file changed | `decision-record.md`, `evidence/rerun-checks.txt` |
| Phase 006 unit suites | Saved evidence records 356/356; nested sandbox result is 354/356 due two environment-dependent assertions, and those two files pass 242/242 outside the sandbox. Not rerun in this closeout | `evidence/checks.txt:21`, `evidence/sandbox-test-disposition.txt:1`, `evidence/sandbox-test-disposition.txt:4` |

### Deviations and findings

| Item | Note |
|------|------|
| `deep-research/SKILL.md` not edited | The T003 check printed nothing, but the file has a prose executor list and the stale phrase "seven executor kinds". Owner fix, outside this write scope |
| Protocol and deep-review SKILL wording | Both protocols say "(experimental)" only. The deep-review SKILL names the kind only in its NEVER list. Open under CHK-041 |
| ADR-001 context corrected | The ADR cites the resolver and records no seat (`decision-record.md:79`) |
| T002 baseline not saved | No pre-edit suite transcript exists. This closeout did not rerun the suites per dispatch; see `evidence/checks.txt:21` and `evidence/sandbox-test-disposition.txt:1` and `:4` |
| CHK-050 evidence location | Check outputs are in `evidence/`, as the dispatch requested, rather than `scratch/` |
| Byte comparison in place of `git diff` | `git diff` against HEAD cannot exit 0 before the phase is committed |
<!-- /ANCHOR:log -->
