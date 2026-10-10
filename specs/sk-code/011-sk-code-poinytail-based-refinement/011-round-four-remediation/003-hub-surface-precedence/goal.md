---
title: "Goal: Phase 3: hub-surface-precedence"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence"
    last_updated_at: "2026-10-10T17:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-011-003-hub-surface-precedence"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: hub-surface-precedence

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every sk-code bundle that holds two or more surface packets list them in the documented detection precedence OPENCODE > OBSIDIAN > WEBFLOW, starting with the implementation-phrased prompt `obsidian plugin webflow implementation`, and pin it with a canary case.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The fix is the hub data line `routerPolicy.tieBreak` in `.skilled/skills/sk-code/hub-router.json`, reordered to quality, review, opencode, obsidian, webflow. No file under `.skilled/bin/lib/` changes. |
| D2 | The canary case `surface-collision-obsidian-over-webflow-implementation` (prompt `obsidian plugin webflow implementation`, expected `orderedBundle` `sk-code-obsidian,sk-code-webflow`) sits after the review-phrased collision case, and the archive fixture is a byte copy of the live one. |
| D3 | The ordering rule is stated in one sentence of the hub `SKILL.md`, not in a new `hub-router.json` key. |
| D4 | The hub ships one release, 2.2.6.0, across its six hub-root carriers with `changelog/v2.2.6.0.md`, and any hub-file handoff from a sibling child lands in that same release. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/probe-route.cjs "obsidian plugin webflow implementation"` prints `"obsidian plugin webflow implementation" route orderedBundle sk-code-obsidian,sk-code-webflow` and exits 0.
- [ ] `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/canary-assert.cjs` prints `OK surface-collision-obsidian-over-webflow-implementation route orderedBundle sk-code-obsidian,sk-code-webflow` and `cases 13 failures 0` and exits 0, and `cmp .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` prints nothing and exits 0.
- [ ] `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/all-canaries.cjs | grep FAIL | grep -v 'FAIL 004-cli-external-orchestration jev-transport-single'` prints nothing and exits 1, and the same script's output contains `001-sk-code cases 13 failures 0`.
- [ ] `grep -l -e '^version: 2.2.6.0' -e '"version": "2.2.6.0"' .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/ROUTER.md .skilled/skills/sk-code/README.md .skilled/skills/sk-code/description.json .skilled/skills/sk-code/hub-router.json .skilled/skills/sk-code/mode-registry.json | wc -l` prints `6`, and `python3 -I .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/changelog/v2.2.6.0.md` prints `VALID` and `Total issues: 0`.
- [ ] After the orchestrator re-mint, `node .skilled/bin/compiled-route-guard.cjs` prints `sk-code                     fresh` and exits 0, and `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "obsidian plugin webflow implementation" | grep -o '"workflowMode":"[^"]*"' | head -1` prints `"workflowMode":"sk-code-obsidian"`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence --strict` prints `RESULT: PASSED`.
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
| Implementation-phrased probe routes Obsidian before Webflow | Pass | `probe-route.cjs "obsidian plugin webflow implementation"` -> exit 0, `route orderedBundle sk-code-obsidian,sk-code-webflow` |
| Canary case passes in both fixture copies | Pass | `canary-assert.cjs` -> exit 0, `OK surface-collision-obsidian-over-webflow-implementation ...`, `cases 13 failures 0`, `cmp` of the two copies prints nothing |
| Every hub canary keeps its baseline | Pass | `all-canaries.cjs` -> `001-sk-code cases 13 failures 0`, `all hubs failures 1`, filtered FAIL grep prints nothing (exit 1) |
| Six carriers at 2.2.6.0 and a valid changelog | Pass | carrier grep prints `6`, changelog `VALID` and `Total issues: 0` |
| Compiled routing fresh and serving Obsidian first | Pass | After the orchestrator's re-mint and archive copy: guard prints `sk-code                     fresh`, exit 0, and the front door prints `"workflowMode":"sk-code-obsidian"` |
| Strict validation of this folder passes | Pass | `validate.sh --strict` -> `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Doctor rule 13d | `parent-skill-check` prints `FAIL: 13d-packet-version` for `sk-code-quality/SKILL.md` (claims 1.2.0.0, newest changelog v1.1.1.0). It is a sibling quality-mode build in progress, not this phase. Rules 5e, 5i and 13c pass |
| Verifier review | No defects in the full diff of the nine owned paths. `scratch/fix-units.json` is `[]` |
| Reviewer finding and operator decision | The reviewer showed the reorder also puts OpenCode before Webflow on keyword ties, so WF-005 and WF-013 lead with OpenCode because of generic words. Measured against a variant that kept Webflow first, the operator kept this order as the fallback on 2026-10-10 and added child 008, where the surface of the session's current work leads a keyword tie. The reviewer's changelog bullet (T040) records the OpenCode-over-Webflow effect |
| Orchestrator steps | Done on 2026-10-10. Hermes `--check` prints `PASS: 70 Hermes skill copies in sync`, `compiled-route-guard.cjs` prints `sk-code fresh` after the re-mint and archive copy, and the trigger index `--check` exits 0 |
<!-- /ANCHOR:log -->
