---
title: "Goal: Phase 5: router-sync-guard"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/005-router-sync-guard"
    last_updated_at: "2026-10-10T05:41:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers:
      - "Operator choice for leg 1b (option A or B) before umbrella wiring (parent 007 decision D3)"
    key_files:
      - "assets/scripts/verify_router_sync.cjs"
      - "assets/scripts/router_replay_lib.cjs"
      - "scripts/run-all-drift-guards.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-007-005-router-sync-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Leg 1b handling: option A (fix or retire the nine docs later, then wire) or option B (warn)"
    answered_questions: []
---
# Goal: Phase 5: router-sync-guard

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Restore the four checks of the retired sk-code router-sync suite as a standalone CommonJS guard, wire the legs that pass today into the drift-guard umbrella, and name the restored guard in the retirement notes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The guard is a standalone CommonJS script with a sibling replay library and no test-runner dependency. It resolves every path from its own location. |
| D2 | Check 1 runs as two legs: 1a (paths and prose maps) and 1b (orphan docs). Leg 1b fails on nine docs on the current tree, so it stays out of the umbrella until the operator chooses how to handle it. |
| D3 | The umbrella runs legs 1a, 2, 3 and 4 only, and its wiring waits for the operator's go, as parent 007 decision D3 requires. |
| D4 | A leg whose input is missing fails. The route-gold file is read from its `z_archive` path, and no leg passes by skipping an input. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From the repository root, `node --check .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs && node --check .skilled/skills/sk-code/sk-code-opencode/assets/scripts/router_replay_lib.cjs && grep -n vitest .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs .skilled/skills/sk-code/sk-code-opencode/assets/scripts/router_replay_lib.cjs; echo "exit=$?"` prints nothing except `exit=1`. (REQ-001)
- [ ] From the repository root, `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs --checks 1a,2,3,4; echo "exit=$?"` prints `PASS check 1a`, `PASS check 2`, `PASS check 3`, `PASS check 4`, `router-sync: 4/4 checks passed` and `exit=0`. (REQ-002)
- [ ] From the repository root, `bash specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/005-router-sync-guard/scratch/prototype/negative-controls.sh; echo "exit=$?"` prints `negative controls: 6/6 behaved as expected` and `exit=0`. (REQ-003)
- [ ] From the repository root, `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh; echo "exit=$?"` prints `PASS: router-sync`, `Errors: 0`, `run-all-drift-guards: all 3 guards PASSED` and `exit=0`. (REQ-004)
- [ ] From the repository root, `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code && node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check; echo "exit=$?"` prints `leaf-manifest.json OK`, then `PASS: 70 Hermes skill copies in sync`, and `exit=0`. (REQ-005)
- [ ] From the repository root, `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/005-router-sync-guard --strict` prints `RESULT: PASSED`.
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
| Criterion 1: CommonJS, no vitest, both files parse | Passed | `node --check` on both files exit 0; `grep -n vitest` prints nothing, `exit=1`; exports `loadSurfaceRouter,parseRouter,registryPacketRoots,routeSkillResources` |
| Criterion 2: four legs pass with exit 0 on the live tree | Passed | `node <guard> --checks 1a,2,3,4; echo exit=$?` prints four PASS lines, `router-sync: 4/4 checks passed`, `exit=0` |
| Criterion 3: six seeded-defect controls behave as expected | Passed | `bash scratch/prototype/negative-controls.sh` prints `ok` for C0 to C5, `negative controls: 6/6 behaved as expected`, `exit=0` |
| Criterion 4: umbrella runs the router-sync leg with zero errors | Passed | `run-all-drift-guards.sh` prints `Errors: 0`, `Warnings: 247`, `PASS: router-sync`, `run-all-drift-guards: all 3 guards PASSED`, `exit=0` |
| Criterion 5: generated manifest and Hermes copy are fresh | Passed | `generate-leaf-manifest.cjs --check` prints `leaf-manifest.json OK (fab6eb86...)`, `exit=0`; `sync-skills-hermes.cjs --check` prints `PASS: 70 Hermes skill copies in sync`, `exit=0` |
| Criterion 6: validate.sh --strict prints RESULT: PASSED | Passed | `validate.sh <folder> --strict` after `repair-derived.cjs --apply` prints `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Operator decision: option A, recorded 2026-10-10 | Checks 1a, 2, 3 and 4 are wired into the drift-guard umbrella now. Check 1b stays out of the umbrella and runs only when asked for explicitly (`--checks 1b`). Its nine orphan docs are routed in a later follow-up, owner sk-code. Every [B] task in tasks.md is unblocked under this decision. |
| A verbatim port passes three legs without checking anything | Found in planning. The orphan walk reads sk-code-root `references/` and `assets/`, which do not exist. The route-gold path is stale, since the gold sits under `z_archive`. The surface list names `sk-code-mobile-cli`, which is gone and makes that check throw. The restored guard fixes all three; plan.md section 3 has the evidence. |
| Leg 1b fails on the current tree | Nine docs have no router naming them. `node <guard>` exits 1 with those nine problems, as the spec requires. The umbrella does not run the leg. |
| Module doc block line range | T010 said to replace lines 1 to 22 of the recovered source. Its module doc block closes at line 25, so the header replaced lines 1 to 25 (banner and full block). Keeping lines 23 to 25 would leave a stray comment close. `node --check` passes on the result. |
| Before-image name collision | T001's flat copy gave the three READMEs one basename, so only one survived. The other two were re-saved as `scripts-README.md` and `assets-scripts-README.md`, and the third as `benchmark-README.md`. T001 also says nine files; its list names eight, and eight are now saved. |
| Guard shebang and SCRIPTS_DIR | The guard keeps its shebang on line 1 and replaces the header on lines 2 and 3. The T011 constants block declares `SCRIPTS_DIR`, which nothing reads. It is kept because T011 names it. |
| Manifest has no digest or count fields | `leaf-manifest.json` stores only modes and leaves, so the regenerated file differs by the two new leaves (sk-code-opencode 69 to 71) and nothing else. REQ-009's digest and count clause has no lines to change. |
| No compiled-routing refresh needed | `compiled-route-guard.cjs` reports `sk-code fresh` after the SKILL.md edits, so T027's refresh was not run and no compiled manifest changed. |
| Umbrella warnings unchanged | The baseline warning count of 247 holds after wiring. |
| New guard files are untracked | The alignment-drift scan reads git-tracked files only, so it does not see the new guard files until they are staged. |
| spec.md status is the orchestrator's | spec.md still reads Status Planned, and the brief keeps spec.md out of this build. The implementation summary reads "Built, awaiting orchestrator status update". The validator does not classify that wording, so its status cross-doc check does not apply. When the orchestrator sets spec.md Status to Complete, rerun `validate.sh --strict` to confirm the two documents agree. A Complete status here fails the cross-doc check until spec.md changes. |
<!-- /ANCHOR:log -->
