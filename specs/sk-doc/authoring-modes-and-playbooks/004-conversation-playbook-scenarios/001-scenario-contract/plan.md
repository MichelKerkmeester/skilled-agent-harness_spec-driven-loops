---
title: "Implementation Plan: Phase 1: scenario-contract"
description: "Adds the json conversation block to the playbook contract: a closed-schema JSON script in section 3 of a scenario file, checked by the fleet validator, exported for the runner and taught by the snippet template and a new reference."
trigger_phrases:
  - "scenario contract plan"
  - "conversation block schema"
  - "parse conversation script export"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/001-scenario-contract"
    last_updated_at: "2026-11-01T21:11:38Z"
    last_updated_by: "planning-session"
    recent_action: "Planned the block schema and validator checks"
    next_safe_action: "Run T001 to record the fleet baseline"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: scenario-contract

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js 20 or newer, CommonJS, plus markdown |
| **Framework** | None. The validator uses the standard library and `@spec-kit/shared` |
| **Storage** | None. The script lives in the scenario markdown file |
| **Testing** | `node scripts/tests/validate-playbook-package.test.cjs`, which runs the validator CLI against temp copies of the clean fixture |

### Overview
This phase adds one format and the checks for it. A scenario file gains a fenced `json conversation` block that scripts the human side of a session, and `validate-playbook-package.cjs` parses that block, checks it against a closed schema and exports the parser for the runner. The proof is the validator test suite plus a fleet run whose counts match the run taken before the change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The fleet baseline is recorded: `validate-playbook-package.cjs --format json` counts and exit code, saved to `scratch/fleet-before.json`
- [ ] The validator test suite passes before any edit: `node scripts/tests/validate-playbook-package.test.cjs` exits 0
- [ ] `generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` prints OK before any edit

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node scripts/tests/validate-playbook-package.test.cjs` exits 0 and prints a PASS line for the conversation cases
- [ ] A fleet run reports the same package, violation and warning counts as `scratch/fleet-before.json`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A fenced JSON script, read by one shared parser.

### Key Components
- **The `json conversation` block**: the scenario's script. It lives in section 3 of the scenario file under a `### Conversation Script` heading, one block per file.
- **`parseConversationScript(text)`**: finds the block, parses it and returns `{ script, findings }`. Each finding carries a field path and a line number.
- **`conversationChecks(text, relPath)`**: turns parser findings into `CONVERSATION_SCRIPT_INVALID` errors inside `validateScenario`.
- **Block masking**: `validateScenario` hands `verdictChecks` and `evergreenChecks` the text with the block's body blanked line for line, so a `check` holding `BLOCKED`, `SKIP`, an absolute path or a date raises no verdict or evergreen finding. Line numbers stay stable because masked lines keep their count.
- **The prompt-sync copy**: `promptSyncChecks` gains the first turn's `send` as one more copy compared with the contract prompt.

### Roles
- **Orchestrator**: the runner, or an operator who runs the script by hand. It plays the human: it pauses, types each turn, answers each expected question and runs the state check.
- **Subject**: the runtime's interactive session under test, started in a scratch project. It never sees the script, only what the orchestrator types.

### The Block Schema
Every key is listed here. Any other key is an error, so a misspelled key cannot fall back silently to a default.

| Key | Type | Required | Meaning |
|-----|------|----------|---------|
| `runtimes` | array of strings | Yes | The runtimes this script is written for, from `claude-code`, `opencode`, `codex`, `pi` and `devin` |
| `setup` | array of strings | No | Shell commands run in the scratch project before the subject starts. A failing command stops the run |
| `env` | object of strings | No | Variables added to the subject's environment, such as a kill switch |
| `turns` | array of turn objects | Yes | The conversation, in order. The first turn is a `send` |
| `turns[].id` | string | No | Name used for the turn's evidence folder. Defaults to the 1-based position. Unique |
| `turns[].send` | string | At most one of `send` or `action` | What the human types, on one line. A turn with neither is a check-only turn, such as a baseline before the first send |
| `turns[].action` | `restart` or `compact` | At most one of `send` or `action` | Restart the subject into the same session, or compact its context. Compaction followed by a send is two turns |
| `turns[].delay_ms` | integer 0 or more, or `[min, max]` | No | The human's pause before the turn starts. A pair draws from a generator seeded by the runner's `--seed`. Defaults to 2000 |
| `turns[].timeout_ms` | integer, 1 or more | No | The longest the turn may run before it fails. Defaults to 300000 |
| `turns[].retry` | 0 or 1 | No | Run a failed turn once more before the failure ends the run. Defaults to 0 |
| `turns[].questions` | array | No | The questions the subject should ask during this turn, each with its scripted answer |
| `turns[].questions[].match` | string | Yes | A regular expression tested against the question text |
| `turns[].questions[].answer` | object | Yes | Exactly one of `select`, `other` or `reply` |
| `answer.select` | array of strings, not empty | | Option labels to choose in a question-tool dialog. Two or more labels need `multi: true` |
| `answer.multi` | boolean | No | Marks a multi-select. Only valid beside `select`. Defaults to false |
| `answer.other` | string | | Text typed into the dialog's free-text row |
| `answer.reply` | string | | A plain chat message, for a question the subject asked in chat |
| `turns[].questions[].delay_ms` | integer 0 or more, or `[min, max]` | No | The human's pause after the question renders and before answering. Defaults to 1000 |
| `turns[].questions[].optional` | boolean | No | When true, the turn still passes if the subject never asks. Defaults to false |
| `turns[].check` | string | Yes | A shell command run in the scratch project after the turn settles. Exit 0 passes, exit 77 skips this turn with the first output line as its blocker, any other exit fails. The last non-empty output line is the observed value |

A question the subject asks that matches no entry fails the turn, and so does a required entry the subject never asks. A failed turn with `retry: 1` runs once more; after that a failure ends the runtime's run and later turns are recorded `NOT_RUN`. A skipped turn (exit 77) does not end the run. The check runs with `CONVERSATION_REPO_ROOT`, `CONVERSATION_RUN_DIR` and `CONVERSATION_TURN_DIR` set, so it can copy state files into the turn's evidence folder.

### Evidence Each Turn Leaves
The contract names the evidence, and the runner in phase 002 writes it: the screen after the turn settles, the screen at each question, the check's output and exit code, one line per keystroke group in the run's action log, the turn's start and end times and one `checkpoints.tsv` row per turn (turn id, status, attempts, evidence folder, observed value).

### Example

```json conversation
{
  "runtimes": ["claude-code", "opencode", "pi", "devin"],
  "turns": [
    {
      "id": "pick-color",
      "send": "Ask me which color to use with your question tool, offering red, green and blue, then write my answer to answers.txt.",
      "delay_ms": 3000,
      "questions": [{ "match": "colou?r", "answer": { "select": ["green"] } }],
      "check": "grep -qx green answers.txt"
    },
    { "id": "resume", "action": "restart", "check": "test -s answers.txt" }
  ]
}
```

### Data Flow
An author writes the block. `validateScenario` calls `conversationChecks`, which calls `parseConversationScript` and reports each finding with its path. The runner in phase 002 imports `parseConversationScript` and `CONVERSATION_RUNTIMES` from the validator, so a script it runs is the script the validator checked.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `validateScenario` in `validate-playbook-package.cjs` | Runs every per-file check | update: one more check call | The test suite and the fleet comparison |
| `promptSyncChecks` | Compares prompt copies | update: one more copy | The prompt-sync agree and differ cases |
| `.github/workflows/playbook-operator-contract.yml` | Runs the fleet validator in CI | unchanged, not a consumer of the new export | Fleet counts equal the baseline |
| `sk-create-skill/scripts/validate-playbook-topology.cjs` | Checks routing-gold files | unchanged, not a consumer | Routing-gold files are excluded before operator checks |

Required inventories:
- Same-class producers: `rg -n "chainTurnOnePrompt|tablePrompt|contractPrompt" scripts/validate-playbook-package.cjs` lists the prompt readers the new copy joins.
- Consumers of changed symbols: `rg -n "validate-playbook-package" .skilled .github --glob '*.cjs' --glob '*.js' --glob '*.yml'` lists every importer before the export list changes.
- Matrix axes: block present or absent, block valid or each malformed shape, first send synced or not.
- Algorithm invariant: a file without a `json conversation` block yields the same findings as before.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the fleet, test and manifest baselines. Implementation writes the reference, the validator change and its tests, then the template and `SKILL.md`. Verification reruns the suite, the fleet and the manifest check and compares them with the baselines.

### Execution

The operator set the executors for this packet's implementation work.

- **Implementation workers** run GPT-6 Luna through cli-codex at reasoning `xhigh` on the `fast` service tier: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 codex exec --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write "<prompt>" </dev/null`.
- **When Luna's quota is used up**, the fallback is DeepSeek V4.1 Flash 1017 on DevPass through cli-pi at thinking `max`, using the child envelope from `cli-pi/references/providers-and-models.md` section 5: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<prompt>" --model llmgateway/deepseek-v4.1-flash-1017 --thinking max --mode text --offline </dev/null > stdout.log 2> stderr.log`. `pi --list-models` lists that model. cli-pi is preferred for DeepSeek over cli-opencode.
- Luna never runs through `llmgateway` or any other gateway, even as a fallback. The fallback changes the model, never Luna's route.
- Before each dispatch, read `cli-external-orchestration/cli-codex/SKILL.md` or `cli-pi/SKILL.md`, put the shared child-dispatch preamble at the top of the prompt and keep the brief to one change in short literal text. A Pi child reads the exit code as no signal, so the orchestrator checks its output text.
- The orchestrator runs the baselines, the fleet comparison, the hub gate and `validate.sh`, and confirms each result a worker reports by running it.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | One clean conversation scenario, one case per malformed shape in REQ-003 asserting the field path, the first-send agree and differ cases, and the REQ-010 masking cases | `node scripts/tests/validate-playbook-package.test.cjs`, table-driven over copies of a separate `fixtures/conversation-package`, so `fixtures/clean-package` stays byte-identical |
| Integration | The whole playbook fleet, before and after | `validate-playbook-package.cjs --format json`, counts compared with `scratch/fleet-before.json` |
| Manual | A scenario copied from the new template section, with its placeholders filled, validates clean | `validate-playbook-package.cjs --package <temp copy>` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js standard library (`JSON.parse`, `RegExp`) | Internal | Green | None. No package is added |
| `generate-leaf-manifest.cjs` in `sk-create-skill` | Internal | Green, `--check` prints OK today | The hub freshness check would fail on the new reference |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fleet run after the change reports any count that differs from `scratch/fleet-before.json`, or a playbook pull request turns red on a file without a `json conversation` block.
- **Procedure**: Revert the phase commit with `git revert <sha>` and rerun `generate-leaf-manifest.cjs --write .skilled/skills/sk-doc`. Files without the block need no repair.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing | Implementation, because the baselines must exist first |
| Implementation | Setup | Verification |
| Verification | Implementation | The handoff to 002-conversation-runner |
<!-- /ANCHOR:phase-deps -->

---
