---
title: "Goal: Phase 1: router-orphan-docs"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/001-router-orphan-docs"
    last_updated_at: "2026-10-10T09:07:55Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-009-001-router-orphan-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: router-orphan-docs

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make router check 1b a default leg that passes, by routing the six unrouted Obsidian references under existing intents, allowlisting the three shared workflow docs by exact path, and covering the check with a test.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The three shared workflow docs are allowlisted by exact path in `NON_ROUTED_ALLOWLIST`, not matched by realpath, because no router names the canonical path or the surface symlinks, so resolving a routed path to its real file finds nothing. Any other unrouted doc under `shared/` stays reported. |
| D2 | The six Obsidian references are wired into existing intents only: `accessibility.md` and `theme-variables.md` into `STACK_STANDARDS`, `setup/setup.md`, `operations/operations.md` and `skill-reference-integrity.md` into `VERIFICATION`, and `quality/doc-quality-gate.md` into `CODE_QUALITY`. Seven keywords taken from the titles of those docs are added and no intent key is created. |
| D3 | `OB-H06` stays keyword-blind. No word from its prompt becomes a keyword, and its `expected_intent` changes from `UNMAPPED` to `STACK_STANDARDS`. |
| D4 | The test is a new `node:test` file at `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs` that runs a copy of the guard against a throwaway hub, because no test for the check exists and the style guide puts tests under a `tests/` tree. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From the repository root, `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs; echo "exit=$?"` prints five `PASS check` lines including `PASS check 1b: every routable reference or asset doc is routed`, then `router-sync: 5/5 checks passed` and `exit=0`.
- [ ] From the repository root, `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh > specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/001-router-orphan-docs/scratch/umbrella-final.txt 2>&1; echo "exit=$?"; grep -n 'PASS check 1b\|PASS: router-sync\|Errors:\|guards PASSED' specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/001-router-orphan-docs/scratch/umbrella-final.txt` prints `exit=0`, a `PASS check 1b` line, a `PASS: router-sync` line that names `--checks 1a,1b,2,3,4`, `Errors: 0` and `run-all-drift-guards: all 3 guards PASSED`.
- [ ] From the repository root, `node --test .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs; echo "exit=$?"` prints `ℹ tests 3`, `ℹ pass 3`, `ℹ fail 0` and `exit=0`, including a passing case where a stray `shared/references/stray.md` is still reported.
- [ ] From the repository root, `sed -n '/^RESOURCE_MAP = {/,/^}/p' .skilled/skills/sk-code/sk-code-obsidian/SKILL.md | grep -cF -e 'references/accessibility.md' -e 'references/theme-variables.md' -e 'references/setup/setup.md' -e 'references/operations/operations.md' -e 'references/quality/doc-quality-gate.md' -e 'references/skill-reference-integrity.md'; sed -n '/^const NON_ROUTED_ALLOWLIST/,/^]);/p' .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs | grep -c 'shared/references/workflow-'` prints `6` and then `3`.
- [ ] From the repository root, `node .skilled/bin/compiled-route-guard.cjs && node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs && node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js; echo "exit=$?"` prints a `sk-code` line ending in `fresh`, `failed=0`, `OK: all rule invariants present` and `exit=0`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/001-router-orphan-docs --strict` prints `RESULT: PASSED`.
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
| Bare guard run includes leg 1b and passes | Done | `verify_router_sync.cjs` printed five `PASS check` lines including `PASS check 1b`, `router-sync: 5/5 checks passed`, `exit=0` |
| Umbrella runs leg 1b and passes | Done | `run-all-drift-guards.sh` exit 0, `PASS check 1b`, `PASS: router-sync (... --checks 1a,1b,2,3,4)`, `Errors: 0`, `all 3 guards PASSED` |
| Test passes 3 of 3 and the stray shared doc is still reported | Done | `ℹ tests 3`, `ℹ pass 3`, `ℹ fail 0`, exit 0. The red run against the unedited guard printed `ℹ fail 3` |
| Six Obsidian references routed and three shared docs allowlisted by exact path | Done | The `RESOURCE_MAP` grep printed `6` and the allowlist grep printed `3`. The replay of 27 scenarios shows `NONE_LOST` and an identical intents column |
| Compiled routing fresh, leaf manifest failed=0, rule copies exit 0 | Done | `sk-code` fresh, `checked=14 fresh=14 failed=0`, `OK: all rule invariants present`, exit 0. Neither manifest was re-minted |
| This folder validates strict | Done | `validate.sh --strict` printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` |
| Orchestrator rerun | Done | All six criteria rerun by the orchestrator on 2026-10-10 from the final tree after one Hermes generator run, each passing |

### Deviations and findings

| Item | Note |
|------|------|
| Realpath matching for the three shared workflow docs | The brief proposed it. No router names the canonical path or the symlinks, so it finds nothing, and the allowlist the brief allowed as fallback is used with the reason beside the list |
<!-- /ANCHOR:log -->
