---
title: "Goal: Phase 39: hub-cleanup"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "cli classifier hub cleanup goal"
  - "cli usage to cli jev rename goal"
  - "pre-release versions goal"
  - "cli deem playbook goal"
  - "hub cleanup criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/039-hub-cleanup"
    last_updated_at: "2026-09-30T17:42:32Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Ticked all five criteria from the build's evidence and recorded the closure"
    next_safe_action: "None. The orchestrator commits the build and the phase docs path-scoped"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/039-hub-cleanup/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/039-hub-cleanup/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-039-hub-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 39: hub-cleanup

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the cli-classifier hub say what it is: a `cli-jev` folder for the Jev mode, pre-release versions everywhere, and a testing playbook for each transport.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Rename `cli-usage` to `cli-jev` with `git mv`. `cli-usage` stays a routing alias so old prompts still route |
| D2 | No cli-classifier skill, mode or README reaches `1.0.0.0`. Each line continues under `0.x` by the mapping in context.md, and changelog history is kept |
| D3 | Live references move to the new path after each is read. Closed spec folders keep their history |
| D4 | cli-deem's playbook needs no served model: every scenario runs on stubs or a refused call |
| D5 | Routing, leaf manifest and Hermes copies are regenerated, never hand-edited |
| D6 | Executors follow parent D5: DeepSeek writes, MiMo reviews, no Claude workers. Fix P0 and P1, record P2 |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `.skilled/skills/cli-classifier/cli-jev/SKILL.md` exists, `cli-usage/` does not, and a `cli-usage` prompt still routes to mode `cli-jev`
- [x] A grep for `cli-classifier/cli-usage` outside `specs/` and benchmark reports finds nothing
- [x] A grep over every cli-classifier version field finds no value at or above `1.0.0.0`
- [x] `validate-playbook-package.cjs` prints PASS on `cli-deem/manual-testing-playbook`
- [x] `compiled-route-guard.cjs`, `ci-leaf-manifest-freshness.cjs`, `parent-skill-check.cjs` and `sync-skills-hermes.cjs --check` pass, and `validate.sh --strict` passes for this phase
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
| Spec authored | Done | 2026-09-30, docs only, from `scratch/context/context.md` and `scratch/context/refs.txt`, the operator's ask and the choices "Rename to cli-jev (Recommended)" and "Continue each line (Recommended)". Status Planned, Level 2, priority P1. No build exists |
| Build | Done | Five batches in the working tree at start HEAD `b3964f2a3f`: B1 rename plus routing and hook references, B4 the `cli-deem` playbook in parallel, B2 doc and prose references, B3 versions and changelog renames plus a fact fix (the alias count went from eight to nine), B5 the 038 doc repoint; the session ran the generators (step 19) |
| Review | Done | MiMo v2.6 Pro at high, `scratch/verify/review-mimo-r1.txt`: `VERDICT: PASS`, all five criteria met, DEE-002, DEE-009 and DEE-010 re-run as written and each matching its exit code and output. Three P2s recorded; the alias-prompt P2 fixed in the session |
| Gates | Done | `scratch/verify/`: build `status built`, 62 promoted closure files, guard all 7 hubs fresh, leaf `checked=15 fresh=15 failed=0`, parent `0 warnings`, Hermes `PASS: 72`, route replay `cli-jev`/`cli-jev`, version grep empty, playbook `PASS ... scenarios=10 ... violations=0 warnings=0`, move-simulation `all 7 hubs resolve`, dispatch-audit 75 of 75, dispatch-rule-checks 20 of 20, README manifest reproducible, README parity PASS, pi-transport 41 of 41 |
| Closure | Done | This pass: all five criteria ticked, `repair-derived.cjs --apply`, `validate.sh --strict` `RESULT: PASSED`, `check-goal.cjs` `RESULT: PASSED (5/5 checks)` |

### Deviations and findings

| Item | Note |
|------|------|
| Planned state (2026-09-30) | At authoring, nothing was built and the five completion criteria were open. This phase ran before 038's build because both touch the same packet, and the repoint covers 038's Planned docs so its build reads `cli-jev` |
| Five-batch grouping (2026-09-30) | The design listed 21 single steps. The session ran them as five batches to save wall time, each still one scoped change set with its own checks: B1 rename plus routing and hook references (steps 1 to 6), B4 the cli-deem playbook (step 18, in parallel with B1 because the files are disjoint), B2 doc and prose references (steps 7 to 13), B3 versions and changelog renames (steps 14 to 17) plus a fact fix (the mode registry alias count went from eight to nine when `cli-usage` was inserted), and B5 the 038 doc repoint (step 20). The session ran the generators itself (step 19). No step was dropped |
| Trigger index rebuilds after commit (2026-09-30) | The trigger index and its three fixture sidecars still list `cli-classifier/cli-usage` paths. The generator indexes a git archive of HEAD, so it cannot see the rename before the commit; the rebuild runs after, on the orchestrator's call (review P2 1) |
| Deep-loop fixture left to its owner (2026-09-30) | `system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts:1470,1472` keeps two recorded finding strings that name the old packet path. They are recorded fixtures in another session's runtime tree, so this phase leaves them to that owner (review criterion 2) |
| Alias scenario prompt restored (2026-09-30) | The rename pass had swapped the CJ-002 prompt to `cli-jev`, so no hub scenario exercised the `cli-usage` alias while its prose claimed it did. DeepSeek restored `cli-usage noul for this question.` with expected packet `cli-jev` and synced the root summary; the session checked the route (`cli-jev`/`cli-jev`) and the hub playbook `PASS warnings=0` (review P2 2) |
| Mirror checker cannot load (2026-09-30) | `check-agent-mirror-sync.cjs` fails with MODULE_NOT_FOUND (`@spec-kit/shared` missing, pre-existing) in this worktree. MiMo confirmed mirror parity by a full body diff instead: frontmatter-only divergence, identical at HEAD, and all five runtime mirrors carry the same edit (review P2 3) |
| Version scope | The authoring grep found 71 version fields at or above `1.0.0.0` under `.skilled/skills/cli-classifier/`, more than the lines context.md enumerates. The design pass fixed the full table before the first edit: 65 in-scope fields, with the five recorded benchmark reports excluded (D2) |
| Proposed README mapping | The README version lines follow the same continuation but are marked proposed in context.md. The design pass fixed all four (hub README to `0.4.0.0`, cli-jev README to `0.1.0.3`, the two benchmark READMEs to `0.1.0.0`) |
| Phase 040 | The `hard_rules` sidecar move is out of scope and belongs to 040. This phase only repointed the dispatch registry path that reads the rules |
<!-- /ANCHOR:log -->
