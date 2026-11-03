---
title: "Feature Specification: Phase 1: scenario-contract"
description: "Defines the conversation scenario kind for sk-create-manual-testing-playbook: a fenced json conversation block that scripts the human side of a session, the validator rules that check it and the template and reference that teach it."
trigger_phrases:
  - "scenario contract"
  - "phase 1 scenario contract"
  - "json conversation block"
  - "conversation scenario validator rules"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/065-conversation-playbook-scenarios/001-scenario-contract"
    last_updated_at: "2026-11-01T21:11:38Z"
    last_updated_by: "planning-session"
    recent_action: "Planned the conversation block and its validator rules"
    next_safe_action: "Run T001 to record the fleet baseline"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: scenario-contract

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-conversation-runner |
| **Handoff Criteria** | The validator accepts a valid block, rejects each malformed shape with the field path and exports `parseConversationScript` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the conversation playbook scenarios packet.

**Scope Boundary**: The format, its checks and its documentation. Nothing here starts a session or drives a terminal.

**Dependencies**:
- None. The validator, its tests and the clean fixture already exist.

**Deliverables**:
- The `json conversation` block contract in `references/conversation-scenarios.md`
- Validator rules and tests for the block, with the parser exported
- The snippet template, `SKILL.md`, `ROUTER.md` and `references/README.md` updated, and the hub leaf manifest regenerated
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A playbook scenario has no way to script a conversation. The validator reads only the Turn 1 cell of a `Turn | Exact user input` table and no shipped scenario uses that table, so nothing defines a pause before a turn, the question the subject should ask, the answer the human gives or the state that must hold after the turn. A table cell also cannot carry a list of option labels, a regular expression with `|` or a shell command, because the validator splits rows at every unescaped `|`.

### Purpose
A scenario author can write the human side of a conversation as one checked block, and the fleet validator rejects a malformed script before anyone runs it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run from the repository root on 2026-11-01. The first command shows there is no runner, the second shows the only multi-turn code is a Turn 1 reader and the third shows no shipped scenario uses the chain table. The last two record the fleet baseline this phase must not move. Its one violation is a missing prompt in `.skilled/manual-testing-playbook/doctor-commands/doctor-routing-helper-handoff.md`, which predates this packet.
```text
$ ls .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts
tests
validate-playbook-package.cjs
$ grep -n "chainTurnOnePrompt" .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs
549:function chainTurnOnePrompt(text) {
619:    ["the conversation chain's Turn 1 input", chainTurnOnePrompt(text), relPath],
$ grep -rlI "Exact User Input" .skilled/skills --include="*.md" | wc -l
       0
$ node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --format json > fleet-baseline.json; echo "fleet exit=$?"
fleet exit=1
$ node -e 'const r=require(process.argv[1]); const p=r.packages||[]; let v=0,w=0; for(const x of p){v+=(x.violations||[]).length; w+=(x.warnings||[]).length;} console.log("packages",p.length,"violations",v,"warnings",w, Object.keys(r).join(","))' "$PWD/fleet-baseline.json"
packages 56 violations 1 warnings 93 contract,routingGoldContract,manifest,strict,warnPackages,packages,exitCode,warnedViolationCount
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define the orchestrator and subject roles and every field of the `json conversation` block in a new reference, with one complete example.
- Add validator checks that parse the block, report each malformed shape as `CONVERSATION_SCRIPT_INVALID` with its field path and add the first `send` to the prompt-sync copies.
- Export `parseConversationScript` and the runtime id list from the validator so the runner reads the same parse.
- Add a Conversation Script subsection to the snippet template and a conversation-scenario rule to `SKILL.md`.
- Name the new reference in `ROUTER.md` and `references/README.md`, and regenerate the `sk-doc` hub leaf manifest.

### Out of Scope
- The runner and the runtime adapters. Phase 002 builds them on this contract.
- The `Turn | Exact user input` table rule. It stays as it is for hand-run chains.
- Migrating existing scenarios. None scripts a conversation today.
- A keystroke verb and a per-turn `runtimes` filter. No planned scenario needs them, and the closed key set grows only for a named scenario that fails without a key.

### Files to Change
Paths are relative to `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/` unless they start with `.skilled/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `references/conversation-scenarios.md` | Create | Roles, the block, every field, the evidence a turn leaves, one example and authoring rules |
| `assets/manual-testing-playbook-snippet-template.md` | Modify | A Conversation Script subsection with a filled example and authoring notes |
| `SKILL.md` | Modify | Conversation scenario rule in section 6, the new check in section 7, the reference in section 10, version 1.0.9.0 |
| `ROUTER.md` | Modify | Name the new reference in the overview's resource list |
| `references/README.md` | Modify | Route-map row for the new reference |
| `scripts/validate-playbook-package.cjs` | Modify | Parse and check the block, sync its first send, export the parser and the runtime ids |
| `scripts/tests/validate-playbook-package.test.cjs` | Modify | One clean conversation case, one failing case per malformed shape, the masking cases and a helper that asserts the field path |
| `scripts/tests/fixtures/conversation-package/` | Create | A separate fixture package for conversation cases, so `fixtures/clean-package` stays byte-identical |
| `.skilled/skills/sk-doc/leaf-manifest.json` | Modify | Regenerated so the hub lists the new reference leaf |
| `changelog/v1.0.9.0.md` | Create | Release note for the conversation scenario kind |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `references/conversation-scenarios.md` defines the orchestrator and subject roles and every block field: top-level `runtimes`, `setup`, `env` and `turns`, per turn `id`, `send`, `action`, `delay_ms`, `timeout_ms`, `retry`, `questions` and `check`, and per question `match`, `answer` (`select`, `other` or `reply`, plus `multi`), `delay_ms` and `optional`. It also lists the evidence each turn leaves, including the run's `checkpoints.tsv`, and the turn outcomes: a `check` exit 0 passes, exit 77 skips that turn with the first output line as its named blocker, any other exit fails, and the last non-empty output line is the observed value. |
| REQ-002 | A scenario is a conversation scenario when it holds a fenced block whose info string is `json conversation`. A file without that block produces exactly the findings it produced before the change. |
| REQ-003 | The validator reports `CONVERSATION_SCRIPT_INVALID` as an error, naming the field path, for each of these: invalid JSON, a second block, missing or empty `turns`, an unknown key at any level, a turn with both `send` and `action`, an `action` other than `restart` or `compact`, a `send` that holds a newline, a first turn holding `send` or `action` that is not a `send`, a `delay_ms` that is neither a non-negative integer nor a `[min, max]` pair of non-negative integers with min not above max, a `timeout_ms` that is not an integer of 1 or more, a `retry` other than 0 or 1, a duplicate turn `id`, a question without `match`, a `match` that does not compile as a regular expression, an `answer` that does not hold exactly one of `select`, `other` and `reply`, an empty `select`, a `select` of two or more labels without `multi: true`, a `multi` outside a `select` answer, a turn without `check`, and a `runtimes` entry outside `claude-code`, `opencode`, `codex`, `pi` and `devin`. A turn with neither `send` nor `action` is a check-only turn and is valid. |
| REQ-010 | `verdictChecks` and `evergreenChecks` read the scenario text with the body of the `json conversation` block masked, so a `check` that greps for `BLOCKED`, holds a bare `SKIP`, an absolute path or a date raises none of `FORBIDDEN_VERDICT`, `SKIP_BLOCKER_MISSING`, `DEVELOPER_ABSOLUTE_PATH` or `BAKED_RUN_TRANSCRIPT`, and the same text outside the block still does. |
| REQ-004 | The first turn's `send` joins the prompt-sync copies, so a first send that differs from the scenario contract prompt raises `PROMPT_UNSYNCED` as a warning, like the other copies. |
| REQ-005 | The validator exports `parseConversationScript(text)` and `CONVERSATION_RUNTIMES`. The parser returns the parsed script and its findings, so the runner and the validator read one parse. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The snippet template carries a Conversation Script subsection with a filled example, and a scenario copied from it with its placeholders filled validates with no conversation finding. |
| REQ-007 | `SKILL.md` section 6 says when to write a conversation scenario and when one prompt is enough, section 7 lists the new check, section 10 lists the reference and the version reads 1.0.9.0 with a matching changelog. |
| REQ-008 | A fleet run after the change reports the same package, violation and warning counts as a run taken just before it. |
| REQ-009 | `ROUTER.md` and `references/README.md` name the new reference, and `generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` prints OK. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node scripts/tests/validate-playbook-package.test.cjs` exits 0 with the clean conversation case and every malformed-shape case passing.
- **SC-002**: A fleet run of `validate-playbook-package.cjs --format json` reports the same package, violation and warning counts before and after the change.
- **SC-003**: `generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` prints `leaf-manifest.json OK`.
- **SC-004**: Each malformed-shape test asserts the field path in the message, such as `turns[1].questions[0].answer`, not only the code.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `validate-playbook-package.cjs` is the fail-closed CI gate for the whole playbook fleet | A regression turns every playbook pull request red | Capture the fleet counts before the change and compare after it, and keep every new finding inside files that hold the block |
| Risk | The key set grows a field for each new request | Med | Unknown keys fail, and a new key needs a named scenario that fails without it |
| Risk | JSON inside markdown is hard to read | Low | The template example and the field path in every finding |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. The new checks run only on files that hold the block, and none does today, so the fleet run does no new work.
- **NFR-P02**: N/A. The validator serves no traffic.

### Security
- **NFR-S01**: The validator compiles each `match` pattern with `new RegExp` inside a `try` and never evaluates a `setup` or `check` command.
- **NFR-S02**: N/A. No credential or network call is involved.

### Reliability
- **NFR-R01**: No new dependency. `JSON.parse` and `RegExp` are the only parsing tools.
- **NFR-R02**: A file without the block keeps its previous findings, byte for byte in the JSON report.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty block, `{}`, reports `CONVERSATION_SCRIPT_INVALID` at `turns`.
- Maximum input: two `json conversation` blocks in one file report the second one, because one scenario has one script.
- Failure path: a plain `json` fence without `conversation` is an ordinary code sample and is never parsed, and a routing-gold file is skipped before any operator check runs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Nine files, about 500 lines, one script and its tests |
| Risk | 10/25 | The validator gates CI for 56 playbook packages |
| Research | 3/20 | The parser, prompt-sync code and fixture already exist |
| **Total** | **22/70** | **Level 2** |

`recommend-level.sh --loc 505 --files 9` scores 39/100, which is Level 1. This phase is kept at Level 2 because it changes a fail-closed CI gate, and the acceptance criteria are the record that the fleet did not move.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The format choice is ADR-001 in the parent `decision-record.md`. The key-set additions that the decision-capture live test needs (check-only turns, `retry`, `multi`, ranged `delay_ms`, exit 77 for a skipped turn and the `checkpoints.tsv` evidence) are ADR-002 there.
<!-- /ANCHOR:questions -->

---
