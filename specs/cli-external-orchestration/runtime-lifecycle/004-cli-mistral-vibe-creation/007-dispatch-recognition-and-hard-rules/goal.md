---
title: "Goal: Phase 7: dispatch-recognition-and-hard-rules"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dispatch recognition and hard rules goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/007-dispatch-recognition-and-hard-rules"
    last_updated_at: "2026-11-14T14:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built Vibe dispatch recognition and five new checks plus the stdin extension; suites green"
    next_safe_action: "Phase 008 builds the Vibe repo guards and settles the hook wire format"
    blockers: []
    key_files:
      - ".skilled/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-vibe-plans-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does vibe 3.1.2 load a .env from its working directory?"
    answered_questions:
      - "Process name, stdin and --prompt-file: answered by phase 004"
      - "Phase 005 names its roster check vibe-closed-roster and adds stdin-redirect-required"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: dispatch-recognition-and-hard-rules

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Refuse any Vibe print-mode dispatch that breaks a cli-mistral-vibe hard rule before it launches.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Recognition covers a `vibe`, `vibe-rs` or `vibe-acp` word in command position, except the session-free forms `-v`, `--version`, `-h`, `--help`, `config`, `mcp` and `help`. A dispatcher types `vibe`, so command-text recognition keeps it; phase 004 showed the running process is `vibe-rs` |
| D2 | This phase implements the checks phase 005's `hard-rules.json` names. A rule that needs new wording is an amendment to 005, not an edit here |
| D3 | A rule counts as done only when its violating command is refused in a test |
| D4 | No default model changes. DevPass stays the default |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `resolveDispatchPackets` names `cli-mistral-vibe` for `vibe -p` and `vibe-rs -p` commands
- [x] Each cli-mistral-vibe rule has a refusing test that returns its rule id
- [x] `node --test lib/dispatch-rule-checks.test.mjs tests/dsh-dispatch.test.mjs` prints `fail 0` with more than 53 passes
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
| Recognition | Done | `resolveDispatchPackets` names `cli-mistral-vibe` for `vibe -p`, `--prompt-file`, bare `vibe`, `vibe-rs -p`, `vibe-acp`, an env-prefixed `cd ... &&` form and a pipe; session-free forms and prose return `[]`. Before the change `vibe -p hi </dev/null` returned `[]` |
| Six checks | Done | `print-mode-only`, `isolated-vibe-home`, `output-dir-required`, `vibe-closed-roster`, `no-repo-root-cwd`, and `stdin-redirect-required` extended to Vibe |
| Rule suites | Done | `node --test lib/dispatch-rule-checks.test.mjs tests/dsh-dispatch.test.mjs`: pass 64, fail 0 (baseline 53 pass; 51 pass and 2 guard failures once phase 005 declared the rules) |
| Recognition suite | Done | vitest `dispatch-audit.test.mjs`: 130 passed (baseline 128) |
| Documented dispatch | Done | The SKILL.md dispatch line through `evaluateDispatch` returns `[]`, and a keyed run of it with the repository config copied into the home finished `0` |
| Hooks suite | Done | `vitest run --config .skilled/hooks/vitest.config.ts`: 9 files, 496 tests passed. No pre-change baseline was captured for this whole suite |

### Deviations and findings

| Item | Note |
|------|------|
| Guard red between phases | Phase 005's `hard-rules.json` declared six checks before this phase built them, so the two guard tests failed from 005's close until T010. The guard worked as designed |
| T019 removed lines | Two existing lines changed, neither a test case: the executor inventory in `dispatch-audit.test.mjs` gained `'cli-mistral-vibe'`, and the import in `dispatch-rule-checks.test.mjs` was reformatted to add `VIBE_ROSTER_ALIASES` |
| Roster source | `vibe-closed-roster` reads a constant alias set rather than parsing markdown at hook time; a sync test asserts it equals the alias rows in the providers reference |
| Comments corrected | Two comments the dispatch wrote said a bare `vibe` reads stdin; phase 004 showed it exits 1 without `-p`, and both were rewritten |
| Dispatch shape gap | A fresh `VIBE_HOME` outside the checkout has no model rows, so the documented line needs the repository config copied into the home first. `SKILL.md` now names the `cp` step |
| Delegation | Every code change came from an `opencode run` dispatch on `mistral/deepseek-v4-1-flash-1017#max`, one check per brief; no fallback route was used |
<!-- /ANCHOR:log -->
