---
title: "Goal: Phase 1: restraint-routing"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "restraint routing goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/001-restraint-routing"
    last_updated_at: "2026-10-10T07:15:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-008-001-restraint-routing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: restraint-routing

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Route requests that ask for restraint (yagni, simplest solution, over-engineering, bloat) to the sk-code quality mode, and make a new doctor check fail on sk-code when its registry aliases, description keywords or canary routes drift from the router vocabulary.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The restraint vocabulary lives in one new class, `quality-restraint`, that only the `sk-code-quality` signal references. No other mode's classes change, and no alias moves to another mode. |
| D2 | Check 5k fails on drift on every hub except the hub and leg pairs in `VOCABULARY_PARITY_WARN_ONLY`, which warn. That table holds the drift the parent goal's D4 allows, and plan.md section 3 names each item. |
| D3 | Leg (c) finds a hub's canary fixture by folder name under `009-parent-hub-rollout`, so it is built for every hub that has one. No per-hub mapping is added. |
| D4 | This child edits no SKILL.md, bumps no version and writes no changelog. The sk-code manifest is rebuilt by the refresh command and never edited by hand. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From the repository root, `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "this module is over-engineered, apply yagni and find the simplest solution" | jq -e '.action == "route" and .selectionKind == "single" and ([.targets[].workflowMode] == ["sk-code-quality"]) and (has("servingAuthority") | not)'` prints `true` and exits 0.
- [ ] From the repository root, `node specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/001-restraint-routing/scratch/canary-assert.cjs` prints `cases 11 failures 0` and exits 0.
- [ ] From the repository root, `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs && node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` prints `ℹ fail 0`, then a `PASS: 5k-alias` line, a `PASS: 5k-packet` line and a `PASS: 5k-canary` line, then `OK: parent-skill-check`, and exits 0.
- [ ] From the repository root, `for h in cli-classifier cli-external-orchestration mcp-tooling sk-code sk-design sk-doc system-deep-loop; do node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/$h >/dev/null 2>&1; echo "$h exit=$?"; done` prints seven lines, each reading `exit=0`.
- [ ] From the repository root, `node .skilled/bin/compiled-route-guard.cjs && bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` prints a sk-code line reading `fresh`, then `run-all-drift-guards: all 3 guards PASSED`, and exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/001-restraint-routing --strict` prints `RESULT: PASSED`.
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
| C1 route | Done | `compiled-route.cjs --hub sk-code` on the canary prompt, through the `jq -e` filter, prints `true`, exit 0 |
| C2 canary | Done | `scratch/canary-assert.cjs` prints `cases 11 failures 0`, exit 0 |
| C3 parity check and invariants suite | Done | Invariants suite `ℹ fail 0`; `parent-skill-check.cjs .skilled/skills/sk-code` prints the three `PASS: 5k-` lines and `OK: parent-skill-check`, exit 0 |
| C4 seven hubs exit 0 | Done | All seven hubs exit 0. Warnings: mcp-tooling 4, sk-design 16, sk-doc 19, system-deep-loop 4, the other three 0 |
| C5 compiled guard and drift guards | Done | Guard lists sk-code `fresh`; `run-all-drift-guards: all 3 guards PASSED`, exit 0 |
| C6 validate.sh --strict | Done | `validate.sh <folder> --strict` after the repair-derived step prints `Errors: 0  Warnings: 0` and `RESULT: PASSED`, exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| THE FIX keyword list lacks `over-engineering check`, which leg (a) requires | Added to `quality-restraint` (tasks.md T013). The alias itself is as the fix names it. |
| Warn-only drift already present at planning time | mcp-tooling alias 4, sk-design alias 12 and packet 2, sk-doc alias 3, system-deep-loop alias 4. Named in plan.md section 3. |
| Stage one may not read description.json | The recorded source list of the sk-code graph does not name it. Measured by tasks T009 and T041, not repaired here. |
| The problem statement holds at stage two only | The advisor already sends `Simplify this code, it is bloated and over-engineered` to sk-code at 0.82, and the yagni phrase reaches no hub at 0.8. |
| No version bump and no changelog | SKILL.md is out of scope, and check 13a needs SKILL.md to carry the hub version. The orchestrator decides. |
| The objective does not repeat the criteria | The child goal template asks for one sentence, and the 004 precedent follows it. The sk-doc authoring standards ask for verbatim criteria, so the orchestrator should settle which one binds. |
| Clean fixture of the invariants test used an array for the `demo` class | The real hub-router schema is `{ keywords: [...] }`, so the fixture uses that shape. The surface and transport helpers also register their alias and packet, or the clean transport test fails on 5k. Found by tasks T027 and T035. |
| Three sibling suites need fixture vocabulary for 5k | command-column, leaf-manifest and root-router demo hubs now carry the alias and packet vocabulary. Approved by the coordinator. Assertion counts match HEAD. |
| Out-of-domain replay finds three routes | `simplest solution`, `over-engineering check` and `yagni` each route a non-code phrase to sk-code-quality (T041). Reported, not narrowed, because narrowing needs a yes. |
| Stage one advisor output is unchanged | The yagni prompt returns the same advisor output before and after (T041). This change does not regenerate the sk-code graph. |
| Orchestrator verification, 2026-10-10 | All six criteria rerun: route check `true`, canary `cases 11 failures 0`, invariants 95 pass 0 fail plus three sibling suites 0 fail, 5k-alias, 5k-packet and 5k-canary PASS, seven hubs exit 0, sk-code fresh, drift guards all 3 PASSED, strict validation 0 errors |
| Out-of-domain replay kept the aliases | The hub router routes "find the simplest solution for my tax return" to the quality mode, as it routes "run a quality check on my holiday packing list" with an older alias. The advisor recommends no skill for all three out-of-domain prompts and sends "Simplify this code, it is bloated and over-engineered" to sk-code at 0.82, so the aliases capture no outside traffic |
<!-- /ANCHOR:log -->
