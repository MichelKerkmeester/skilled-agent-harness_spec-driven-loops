---
title: "Goal: Phase 5: dsh-mirror-generators"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dsh mirror generators goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/005-dsh-mirror-generators"
    last_updated_at: "2026-11-06T14:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Ticked every completion criterion with evidence"
    next_safe_action: "None, phase closed"
    blockers: []
    key_files:
      - "acceptance-criteria.md"
      - "implementation-summary.md"
      - "evidence/closeout-checks.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-005-dsh-mirror-generators"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: dsh-mirror-generators

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every repo skill, command and agent reaches a dsh session through a generated `.dsh/` mirror that CI checks for drift.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The three generators live in `.skilled/skills/system-spec-kit/runtime/cli/dsh/` beside the `hermes/` and `pi/` generators, and their tests in `.skilled/skills/system-spec-kit/runtime/cli/tests/` |
| D2 | The skill farm counts `SKILL.md` files at run time, prints every exclusion with its reason and exits non-zero on a duplicate frontmatter `name` |
| D3 | A description over 500 characters prints a warning and does not fail the run |
| D4 | The CI check is a `dsh-mirror` job in `command-tree-parity.yml`, beside `hermes-mirror` |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs --check` exits 0, and `ls -d .dsh/skills/*/ | wc -l` equals the `SKILL.md` count minus the exclusions it prints
- [x] `sync-prompts-dsh.cjs --check` and `sync-agents-dsh.cjs --check` both exit 0
- [x] `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-*-dsh.test.mjs` passes, with a duplicate-name case and an over-500-character description case
- [x] `ls .dsh/skills/*/SKILL.md | wc -l` equals `ls -d .dsh/skills/*/ | wc -l`
- [x] `rg -n 'dsh-mirror' .github/workflows/command-tree-parity.yml` matches and the runtime-mirrors doctor contract test passes
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
| Baseline | Done | `find .skilled/skills -name SKILL.md -not -path '*/node_modules/*' \| wc -l` printed 54 when the spec was written and 55 at closeout (`evidence/closeout-checks.txt:127-129`) |
| Generators and tests | Done | Written by `cli-codex` dispatch 1. `node --test` on the three tests: `ℹ pass 8`, `ℹ fail 0`, `exit=0` (`evidence/closeout-checks.txt:93-105`) |
| Mirrors in sync | Done | `--check` reports 55 links, 44 stubs, 11 patches in sync, each `exit=0` (`evidence/closeout-checks.txt:79-86`) |
| Farm resolution | Done | Farm 55, resolving `SKILL.md` 55, canonical 55, 0 link targets outside `../../.skilled/` (`evidence/closeout-checks.txt:121-132`) |
| Persona composition | Done | All 11 `.dsh/agents/*.patch.yml` composed through `dsh --dump-config` from a disposable `DSH_HOME`, each exit 0 with empty stderr, on the orchestrator's record (`evidence/checks.txt:24`) |
| CI and doctor wiring | Done | `130:  dsh-mirror:` and the contract test `ℹ pass 7`, `ℹ fail 0`, `exit=0` (`evidence/closeout-checks.txt:106-120`) |
| Strict validation | Done | `validate.sh --strict` on the phase folder printed `RESULT: PASSED` on 2026-11-06 |

### Deviations and findings

| Item | Note |
|------|------|
| Codex dispatch 1 killed | The process was killed from outside at about 20 minutes, exit 144 (signal 16), after writing every file and before running anything. The orchestrating session ran the tests, the write runs and the `--check` runs itself. Exit code and signal are on the orchestrator's record |
| `_routes.yaml` edited outside the file list | Codex dispatch 2 stopped because its contract test needs three dsh lines in `.skilled/commands/doctor/_routes.yaml`. The orchestrator added them, because the runtime-mirrors route lists every mirror check |
| Combined doctor run | The orchestrator saw the 10 `_routes.yaml` tests exit 1 with no failing test named in one `node --test` process, while each passed alone. The closeout combined run passed 196 of 196 (`evidence/closeout-checks.txt:166-170`). Recorded as observed, cause unknown |
| Prompt stubs, not inlined templates | Each stub points to its canonical command file and ends at `User request:`, the Pi pattern the dispatch brief named |
| Skill loading in a session | UNKNOWN until phase `013-dsh-live-contract-pin` with a provider key |
<!-- /ANCHOR:log -->
