---
title: "Goal: Phase 6: cli-opencode-dual-dispatch"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "cli opencode dual dispatch goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/006-cli-opencode-dual-dispatch"
    last_updated_at: "2026-10-18T12:45:06Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-cli-opencode-dual-dispatch"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: cli-opencode-dual-dispatch

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make cli-opencode and the deep-loop runtime choose the dispatch argv from the installed OpenCode major, read from `--version` output, so that a v1 or v2 dispatch runs and a v2 child runs standalone with its environment.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| L1 | The v2 renderer omits `--dir` and sets the spawn working directory. A live probe confirms this before the v2 branch is built. |
| L2 | The resolver cache key is the realpath, size and mtime of the binary. |
| L3 | A parse failure refuses the dispatch. The resolver does not fall back to a guess. |
| L4 | The v2 native branch fails closed until a live probe decides how a registered command reaches v2. |
| L5 | `resolveExecutableVersion` keeps its sha256 digest. The semver resolver is a separate function. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/opencode-dual-dispatch.vitest.ts` exits 0, and the same cases failed before the change.
- [x] A smoke dispatch on 1.19.3 through the builder exits 0, prints the expected token and writes the lineage file.
- [x] A smoke dispatch on 2.0.32 through the builder with `--standalone` exits 0, prints the expected token and writes the lineage file.
- [x] A v2 child dispatched through `run --standalone` logs `AI_SESSION_CHILD=1` from a fixture plugin.
- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage` reports zero failures and a pass count at or above the baseline recorded in the log below.
- [x] `rg -n "grep -q '\^1" .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` prints nothing.
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
| Planning documents filled | Done | `validate.sh --strict` output in the orchestrator report |
| Deep-loop baseline recorded (T001) | Done | `scratch/deep-loop-suite-before.txt`: 166 files, 2718 passed, 8 skipped |
| Live probes recorded (T004) | Done | `scratch/probes/`, decisions 2 to 6 in `scratch/decisions.txt`; 0.000919 USD |
| Red run recorded (T007) | Done | `scratch/red-first-failures.txt`: 21 of 23 failed first; D1 and D3 pin today's argv |
| Smoke dispatch on 1.19.3 (T015) | Done | `scratch/smoke/v1`: exit 0, token, lineage file; 0.002699 USD |
| Smoke dispatch on 2.0.32 (T016) | Done | `scratch/smoke/v2`: exit 0, token, lineage file; 0.001162 USD |
| Child environment check (T017) | Done | `scratch/smoke/v2/smoke-v2-plugin.jsonl`: AI_SESSION_CHILD=1 in setup() and session.prompt |
| Full deep-loop suite (T014) | Done | `scratch/deep-loop-suite-after.txt`: 167 files, 2741 passed, 0 failed, 8 skipped |

### Deviations and findings

| Item | Note |
|------|------|
| Name fallback rejected | Iteration-013 F8 proposes a v2 fallback when the name ends in `2` and the output does not parse. D3 and research section 6 reject it. Settled: refuse (decision 9), and a test covers it. |
| Pi guard | The repo's Pi guard denies a nested `opencode run` (research section 2, iteration-017 F4). The orchestrator runs the smoke dispatches. |
| Line numbers | Research section 9 cites lines 2258, 2324, 2923 and 2961. Research section 6 cites 2093 for `resolveExecutableVersion`. A planning-time check found each at those lines. T003 repeats the check. |
| Unplaced by the brief | The brief names no file for the resolver, and it names no test file. Both are proposed in spec.md section 3 (open question Q1). |
| Working directory | The brief says the v2 branch omits `--dir`, but it does not say how the child gets its directory. Decision L1 sets the spawn cwd. The T004 probe confirms it. |
| Binary order amended | Read literally, the order would make the existing tests skip their `opencode` stub and spawn this machine's real `opencode2`. Amended: PATH order first, `opencode2` before `opencode` only inside one directory (decision 10, plan.md section 3). |
| v2 permission flag | v2 `run` lists `--auto` and no `--dangerously-skip-permissions`, so the v2 renderer maps danger-full-access to `--auto` (decision 5). |
| Native v2 stays closed | A bare slash message was not expanded on v2 (decision 3). With both binaries installed side by side, native lineages refuse until `OPENCODE_BIN=opencode`. |
| Test stubs answer `--version` | L3 makes a silent stub refuse, so five test files outside spec.md section 3 changed (decision 11). |
| v2 default model | v2 lists no opencode-go model on this machine; carried to 007 (decision 12). |
| probes/ kept | T020 deletes it, but decisions cite it and the scratch folder is committed (decision 20). |
<!-- /ANCHOR:log -->
