---
title: "Decision Record: Conversation playbook scenarios"
description: "The operator's answers that placed and shaped this packet, and the cross-phase decision to write a conversation script as one fenced JSON block inside the scenario file."
trigger_phrases:
  - "conversation scenario decision record"
  - "conversation script format decision"
  - "shared conversation runner decision"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/065-conversation-playbook-scenarios"
    last_updated_at: "2026-11-01T21:11:38Z"
    last_updated_by: "planning-session"
    recent_action: "Recorded the operator answers and the script-format decision"
    next_safe_action: "Start 001-scenario-contract at T001"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The script is one fenced json conversation block inside the scenario file"
---
# Decision Record: Conversation playbook scenarios

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: A conversation script is one fenced JSON block inside the scenario file

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-01 |
| **Deciders** | Planning session, on the operator's request for scripted orchestrator-versus-subject scenarios |

---

<!-- ANCHOR:adr-001-context -->
### Context

Both phases depend on one format. The validator in phase 001 checks it, and the runner in phase 002 executes it. A turn needs data a markdown table cell cannot hold cleanly: a list of option labels for a multi-select answer, a regular expression that uses `|` and a shell command for the state check. The validator's `splitTableRow` breaks a table row at every unescaped `|`. An escaped `\|` survives, so a pattern can be written with escapes, but a cell still cannot hold a list of labels or a per-turn shell check without its own mini-syntax.

### Constraints

- The skill forbids duplicated scenario truth in sidecar files, so the script must live in the scenario file itself.
- The skill's scripts use only the Node standard library plus `@spec-kit/shared`, and no install is planned.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: one fenced block with the info string `json conversation` in section 3 of the scenario file, holding the whole script.

**How it works**: The validator finds the block, parses it with `JSON.parse` and checks a closed set of keys, so a misspelled key fails instead of falling back to a default. It exports the same parser as `parseConversationScript`, and the runner reads the script through that export, so the runner never runs a script the validator would reject.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fenced `json conversation` block** | One source of truth, standard-library parsing, any value fits | JSON is harder to read than a table | 8/10 |
| Widen the `Turn \| Exact user input` table | Readable, already parsed for Turn 1 | Pipes in patterns and commands break cells, and lists of labels do not fit a cell | 3/10 |
| A `.json` sidecar beside the scenario | Plain JSON tooling | The skill forbids sidecar scenario truth, and the root index counts markdown files only | 2/10 |
| A YAML block | Reads well | Node has no YAML parser in the standard library, so it needs a dependency | 4/10 |

**Why this one**: It is the only option that carries every field without escaping and adds no file and no dependency.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A script is checked by the fleet validator before anyone runs it, and the runner reads the same parse.
- A typo in a key name fails validation instead of silently running with a default.

**What it costs**:
- Authors read JSON inside markdown. Mitigation: the snippet template carries a filled example, and every finding names the field path, such as `turns[2].questions[0].match`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The key set grows a field per consumer request | M | The key set is closed, and a new key needs a named scenario that fails without it |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The 043/006 live test needs multi-select answers, patterns and state commands per turn |
| 2 | **Beyond Local Maxima?** | PASS | Four formats compared above |
| 3 | **Sufficient?** | PASS | No new file type, no dependency |
| 4 | **Fits Goal?** | PASS | Both phases read this one format |
| 5 | **Open Horizons?** | PASS | A scenario without the block validates exactly as before |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `scripts/validate-playbook-package.cjs` parses and checks the block and exports the parser.
- The snippet template and `references/conversation-scenarios.md` document the block.

**How to roll back**: Revert the phase 001 commit. Scenario files without the block are untouched by it, so nothing else needs repair.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The key set carries what the decision-capture live test needs, settled before it freezes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-01 |
| **Deciders** | Overnight orchestrator, on the research run's first recommendation and the open-questions recommendations of both tracks. Reversible by the operator |

---

<!-- ANCHOR:adr-002-context -->
### Context

The research run (`research/research.md` sections 9 and 11) found five 043/006 stages the planned key set cannot express: a stage with no human turn, compaction followed by a send, a second scratch project, a retry after a subject deviation, and seeded think time. It also found that the runner writes only PASS, FAIL or SKIP while 043/006 marks stages PASS, FAIL, DEVIATION or N/A, and that `checkpoints.tsv` had no producer. The key set is closed, so each answer has to land before phase 001 freezes it.

### Constraints

- A new key needs a named scenario that fails without it (ADR-001's risk row).
- The runner's SKIP is a runtime-level verdict, so carrying a passing stage's N/A on it would make a passing runtime read as skipped.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**, per need:

| Need | Answer | Key-set change |
|------|--------|----------------|
| A stage with no human turn (043/006 S0) | A turn with neither `send` nor `action` is a check-only turn. The first turn holding `send` or `action` must be a `send` | Relaxed rule, no new key |
| Compaction, then a send (S8) | Two turns, `S8-compact` with `action: compact` and its check, then `S8-ask` with the send. 043/006 derives one stage row from both | None |
| A second scratch project (S12) | Its own scenario file and its own runner invocation | None |
| Retry once on a subject deviation | `retry`, 0 or 1, default 0. A failed turn with a retry left runs once more, and both attempts are recorded | `turns[].retry` |
| DEVIATION and N/A | 043/006 maps them: DEVIATION is a turn FAIL whose check prints the deviation, N/A is a turn whose check exits 77 and prints its blocker. Exit 77 skips that turn only, records `SKIP` in `checkpoints.tsv` and lets the run continue. The runtime verdict stays PASS, FAIL or SKIP | Check exit-code convention, no new key |
| `checkpoints.tsv` | The runner writes it per runtime run: turn id, status, attempts, evidence folder, observed value. The observed value is the check's last non-empty output line. Turns after a run-ending FAIL are written as `NOT_RUN` | Evidence, no key |
| Seeded think time | `delay_ms` (turn) and `questions[].delay_ms` (before answering) take an integer or a `[min, max]` pair. The runner draws from a generator seeded by `--seed` and records the seed in `result.json` | Ranged value, one new question key |
| A multi-select picking one label | `answer.multi: true` marks a multi-select. Two or more labels require it | `answer.multi` |

**Set aside**: a keystroke verb (start-up screens belong to the adapter, not the script), a per-turn `runtimes` filter and a must-not-be-asked assertion (an unmatched question already fails the turn). Each can be added later for a named scenario.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Map the four marks onto turn outcomes, add `retry`, `multi` and ranged delays** | Three small keys, the runner verdict stays three-valued | 043/006 owns a derivation step | 8/10 |
| Give the runner DEVIATION and N/A verdicts | No derivation in 043/006 | Every other scenario inherits two marks it never uses | 4/10 |
| Restage 043/006 to fit the planned keys | No key change | S0 becomes hand-produced, retry and jitter are lost | 3/10 |
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**: 043/006 can be written against the frozen contract with every stage on the runner, and its scenario can be authored as soon as phase 001 lands.

**What it costs**: three keys and one exit-code convention for the validator, the reference and the runner to carry.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Exit 77 collides with a check that exits 77 by accident | L | The reference names 77 as reserved, and the turn records the blocker line it printed |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Each row names the 043/006 stage that fails without it |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | Every need in research section 9 has an answer |
| 4 | **Fits Goal?** | PASS | The block stays one closed-key JSON script |
| 5 | **Open Horizons?** | PASS | A scenario that uses none of the new keys validates exactly as before |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**: phase 001's schema table, rules and tests carry the keys. Phase 002's turn loop carries `retry`, exit 77, the seeded delays and `checkpoints.tsv`.

**How to roll back**: drop the three keys from the schema and the runner, and restage 043/006.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Runtime start-up and answer choices made during the live probes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-02 |
| **Deciders** | Orchestrator, on its own recommendation. Reversible by the operator; listed in open-questions.md |

---

<!-- ANCHOR:adr-003-context -->
### Context

The OpenCode, Codex, Pi and Devin probes showed start-up screens and dialogs the plan did not know about. Each needed a fixed answer before the adapter could run unattended.

### Constraints

- Nothing may install software or change the operator's config beyond what the subject itself records.
- Codex is tested, not skipped, on tool questions (operator decision Q005).
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**:

| Point | Choice |
|-------|--------|
| Codex update offer | Always "Skip", never "Update now" |
| Codex hook review | "Continue without trusting", because trusting writes to the operator's Codex config |
| Codex and Devin folder trust | Accept, as Claude Code already does |
| Codex multi-select | Type the choices as a note on `None of the above`; an optional chat reply covers a subject that asks in chat |
| OpenCode model | Setup copies the root `opencode.json`, which pins the repository's model |
| Free-text-only question | Accepted by the OpenCode parser, where it was seen |
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fixed per-adapter answers above** | Runs unattended, changes nothing outside the subject's own records | Codex hooks do not run in scratch | 8/10 |
| Trust all Codex hooks | Hooks run | Writes to the operator's global config on every run | 4/10 |
| Skip Codex multi-select | No workaround | Contradicts Q005 | 2/10 |
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**: MTP-007 passes alone on all five runtimes.

**What it costs**: Codex runs without its hooks, which 043/006 must take into account.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A CLI update changes a start-up screen | M | Each screen is a recorded fixture with a test, and a failed launch keeps its screen |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without an answer each screen blocks the launch (Codex attempts 1 and 2) |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | MTP-007 passed alone on every runtime |
| 4 | **Fits Goal?** | PASS | The answers live in the adapters, not the script |
| 5 | **Open Horizons?** | PASS | Each choice is one adapter entry |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**: the adapters' `startupScreens`, `codexAnswerKeys`, MTP-007 `setup` and its optional chat reply.

**How to roll back**: change the matching adapter entry or scenario line.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Prove decision capture with a series of timed prompts that an orchestrator runs against a test subject, the way a human conversation goes, and extend `sk-create-manual-testing-playbook` to support such orchestrator-versus-subject, multi-prompt scenarios. | A single-prompt scenario never showed whether decisions are captured during a real conversation. | None | spec.md problem and purpose, both phases |
| Q002 | Put the work in a new `sk-doc` packet. | Not stated. It was the recommended option. | None | This packet's location, `specs/sk-doc/065-conversation-playbook-scenarios` |
| Q003 | Make the runner shared and keep it in the playbook skill. | Not stated. It was the recommended option. | None | 002-conversation-runner, `scripts/run-conversation-scenario.cjs` |
| Q004 | Implementation workers run GPT-6 Luna (`gpt-6-luna`, reasoning `xhigh`, service tier `fast`) through cli-codex. When Luna's quota is used up, they fall back to DeepSeek (`llmgateway/deepseek-v4.1-flash-1017`, thinking `max`) through cli-pi, which the operator prefers for DeepSeek over cli-opencode. | Not stated. | None | The Execution section of each child `plan.md`, decision D4 in `goal.md` |
| Q005 | Enable Codex's `default_mode_request_user_input` in this repository and on the operator's machine, not only in scratch projects. | Not stated. It lets Codex tool-question turns run instead of being skipped. | The open-questions recommendation to enable it in scratch only | 002 REQ-015, `~/.codex/config.toml`, `.codex/config.toml` |
| Q006 | Trust Codex hooks in a scratch project only for the decision-capture live runs. The runner trusts them only when a scenario asks, records every trust entry it adds and removes those entries after the run. | "Trust all" writes trust entries to the operator's `~/.codex/config.toml`, and the decision-capture Codex run may need its hooks to fire. | ADR-003's "Codex hook review" row, for scenarios that ask for trust | The runner's `trust_hooks` scenario key |
| Q007 | Codex multi-select stays typed as a note on the `None of the above` row. | Codex's question tool offers one choice per question. | None | ADR-003's "Codex multi-select" row, `references/conversation-scenarios.md` |
| Q008 | Open the upstream Cursor hook-wrapper issue as a separate small Skilled packet after this track and decision capture close. | Not this packet's scope. | None | open-questions.md item 3 |
| Q009 | Commit and push only after both builds are checked, and only after the operator has seen the file list. | Every commit and push needs the operator's yes. | open-questions.md item 4's earlier "after both builds" answer, now with the file-list step | The close-out of this packet |
| Q010 | "Perfect" means every acceptance row Met, then `/deep:review` with a fix pass, then `/local-skilled-alignment`, then a second full live pass, then a commit list for the operator's yes. | The operator's definition of done for this track. | None | handover.md section 3.2 |
| Q011 | Run the live MTP-007 passes and the Codex hook-trust proof against a detached numbered git worktree of main, not the main checkout, and make one live trust proof run from this packet. | Other sessions writing to the main checkout's `specs/` and `.skilled/skills/.state/decision-capture/` failed three runtimes `REPO_CHANGED` in the first matrix run. | Q006's "only in decision-capture runs", for one proof run | The runner's `--repo-root` pointing at the worktree; the evidence is copied back to this packet |
| Q012 | Put back the pre-run hash of the global `session_end` hook that the trust proof's "Trust all" re-trusted, and have the runner refuse "Trust all" whenever Codex's review screen counts more hooks than the scratch project's own `hooks.json` holds, failing that run with a named blocker. | "Trust all" trusts every hook on Codex's review screen, and the screen also lists the user's changed global hooks. | None | The restored `~/.codex/config.toml` entry; the runner's `HOOK_TRUST_OUTSIDE_PROJECT` blocker |
| Q013 | Codex launches and resumes with `--sandbox workspace-write` and `--ask-for-approval never` instead of `--dangerously-bypass-approvals-and-sandbox`, so its writes stay inside the scratch project. The other four runtimes keep their flags, because their adapters have no filesystem sandbox flag. | The deep review found that a bypassed Codex run could write anywhere on the operator's machine, while the repository snapshot only detects writes to `specs/` and the watched `.state` folders after the run. | None | The runner's Codex adapter `launch` and `resume` argv; one live Codex re-proof in the second five-runtime pass |
| Q014 | Delete the 101 repository-snapshot files (repo-before.txt and repo-after.txt) from the phase 002 run evidence and keep the rest of the evidence. | The snapshots are full hash listings of specs/ at about 21 MB each, 3.7 GB in total, while each run's result.json already records whether the repository changed. | None | 002-conversation-runner/implementation-summary.md Known Limitations item 1, 002-conversation-runner/scratch/runs/ |
| Q015 | The operator reset Codex's usage quota, so Codex reran MTP-007 on the final runner and scenario instead of relying on its earlier matrix5 pass. | Codex had hit its weekly usage limit during the last five-runtime pass. | None | 002-conversation-runner/scratch/runs/codex-final/, acceptance-criteria.md AC-009 |
| Q016 | Amend goal.md criterion 5 to cover the runs of the final passes (matrix5, matrix6, claude-code-final, codex-final), and criterion 6 to require a line that begins with OK: parent-skill-check. | Earlier runs correctly failed REPO_CHANGED from other sessions' writes and cannot be rerun, and the hub check's fixed success line continues past the quoted text. | None | goal.md COMPLETION CRITERIA items 5 and 6 |
| Q017 | Same decision as Q011: run the live passes in a git worktree instead of pausing other sessions. | Other sessions writing to the main checkout failed runs REPO_CHANGED. | None | Q011, the runner's --repo-root |
| Q018 | Same decision as Q011: make one live Codex hook-trust proof run from this packet. | Not stated. | None | Q011, 002-conversation-runner hook-trust.json evidence |
| Q019 | Same decision as Q012: restore the pre-run hash of the global session_end hook. | Not stated. | None | Q012, ~/.codex/config.toml |
| Q020 | Same decision as Q012: the runner refuses Trust all when Codex lists hooks outside the scratch project. | Not stated. | None | Q012, the HOOK_TRUST_OUTSIDE_PROJECT blocker |
| Q021 | Same decision as Q013: Codex runs with --sandbox workspace-write instead of the bypass flag. | Not stated. | None | Q013, the runner's Codex adapter argv |
| Q022 | Hold the four approved commits until the decision-capture session lands the Devin mirror, instead of bypassing the mirror-parity gate. | Not stated. | None | handover.md section 3.2 item 1 |
| Q023 | Synthesize the eight completed Luna iterations instead of waiting for quota or switching executor. | Not stated. | None | 003-conversation-adoption-research/research/research.md |
| Q024 | Split the per-scenario playbook template into a single-prompt template and a dedicated conversation template. | With one template, a sample conversation block left in a single-prompt scenario passed validation silently. | None | 002-conversation-runner implementation-summary step 9, assets/manual-testing-playbook-conversation-snippet-template.md |
| Q025 | Run up to four authoring workers at once for the phase 004 build. | Not stated. | None | 004-conversation-adoption-build, the one-go build plan |
| Q026 | Use gpt-6-luna at xhigh reasoning and normal service tier for every phase 004 authoring worker; on Luna quota exhaustion stop and ask. | Not stated. | None | 004-conversation-adoption-build child plan.md Dependencies |
| Q027 | Leave phase 004/003 system-spec-kit out of the one-go build for now; the operator first said include it, then withdrew that in chat. | Its playbook files belong to the decision-capture session. | None | 004-conversation-adoption-build spec.md Open Questions, 003-system-spec-kit |
| Q028 | A setup command that exits 77 skips that runtime's whole run as SKIP with its first output line as the blocker; any other nonzero setup exit stays SETUP_FAILED. | A missing fixture or sign-in should read as a skip in the live matrix, not a failure. | None | 002 spec.md REQ-001, acceptance-criteria.md AC-001, the runner's prepareScratch |
| Q029 | Run the remaining phase 004 fix jobs on DeepSeek v4.1 flash max through cli-devin after Luna's usage limit ran out. | Not stated. | None | 004-conversation-adoption-build fix wave |
| Q030 | Finish the second fix wave on Pi with DeepSeek v4.1 flash 1017 at max thinking after Devin's daily quota ran out. | Not stated. | None | 004-conversation-adoption-build fix wave 2b |
| Q031 | Defer all 15 Claude Code live runs until the Claude weekly limit resets; run only the OpenCode, Pi, Codex and Devin scenarios now. | Not stated. | None | 004-conversation-adoption-build spec.md phase map (children 004-012 and 015) |
| Q032 | The orchestrator diagnoses every OpenCode and Pi failure itself instead of sending more worker fix rounds, then runs one targeted fix round. | Not stated. | None | 002-conversation-runner runner fixes, 004 scenario files |
| Q033 | Add OpenCode to the 13 Claude-only scenarios that need no Claude-specific behaviour, and Pi to those whose prompts use no colon command. | The Claude weekly limit was at 82%, and OpenCode and Pi run on DeepSeek. | None | 004 children 004-012 scenario runtimes |
| Q034 | Make the small scenario fixes for SCG-010, RRD-005 on Pi, and DIA-003 and SD-004 on Pi, rerun only those runs, and drop any runtime that still fails; DOC-408 and DOC-367 drop back to Claude Code only. | Not stated. | None | 004 spec.md phase map, children 004, 005, 007, 010 and 011 scenario files, 018-runner-gaps open questions |
| Q035 | Revert the SP-008 conversion and delete the SD-007 companion; phases 006 and 008 are dropped. | Not stated. | None | 006-sk-prompt/spec.md, 008-sk-design-hub/spec.md, 004 spec.md phase map |
| Q036 | When Luna hits its usage limit, wait for the reset and rerun the same Luna briefs rather than editing by hand or switching to DeepSeek. | Not stated. | None | 004 children 004 scenario prose (DOC-367, DOC-408) |

<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001

Question: None. The operator raised this in two messages of their own.
Options: None offered.
Answer: "Was 043 actually proper tested though the new decision capture feature, like were decisions mocked in a test playbook session? Shouldnt have been a single prompt test scenario but a series of timed prompts run by an orchestrator with a test subject to see if it works mimicing human conversation" and then "That should be the case and we should also maybe update sk create manual testing playbook to support those elaborate human like orchestrator vs test subject multi prompt conversation like playbook scenarios".

### Q002

Question: Where should the work go ...?
Options: B) New sk-doc packet (Recommended); C) Child of sk-doc/050; D) Skip docs
Answer: B) New sk-doc packet (Recommended)

### Q003

Question: Where should the runner that drives the conversation live?
Options: Shared, in the playbook skill (Recommended); Only in the decision-capture test
Answer: Shared, in the playbook skill (Recommended)

### Q004

Question: None. The operator set this requirement in two messages of their own, the second correcting the fallback's CLI.
Options: None offered.
Answer: "Make sure they use luna xhigh fast implementation workers cli codex and deepseek v4.1 flash max 1017 llmgateway as fallback" and then "Prefer cli pi for deepseek"

### Q005

Question: Not relayed verbatim. It concerned open-questions.md item 1, where to enable Codex's `default_mode_request_user_input`.
Options: Not relayed. The main session passed on the chosen answer only.
Answer: "Enable it in repo and macbook" (relayed by the main session, 2026-11-02)

### Q006 to Q010

Question: open-questions.md items 3 and 4 and ADR-003's rulings 1 and 2, asked by the main session on 2026-11-02.
Options: Not relayed.
Answer: Not relayed verbatim. The main session recorded the answers in its own words in `handover.md` section 2.1 on 2026-11-02, and the rows above follow that wording. The only verbatim answer it relayed is Q005's.
### Q011

Question: How should the five-runtime rerun get a window with no other session writing to `specs/` or `.skilled/skills/.state/decision-capture/`? And should this packet make one live Codex hook-trust proof run?
Options: pause the sessions; run later; narrow the watch (amends D3). For the proof: yes, one run here; no, leave it to 043/006.
Answer: "Git worktree works as well?", then "Yes, use a worktree (Recommended)" after the costs were laid out, and "Yes, one proof run here (Recommended)" (2026-11-02).

### Q012

Question: What should happen to the global `session_end` hook entry that the trust run re-trusted? And should the runner refuse "Trust all" when the review screen counts more hooks than the project holds?
Options: restore the old hash, or keep it trusted. Add the guard, or record the behavior only.
Answer: "Restore old hash (Recommended)" and "Yes, add the guard (Recommended)" (2026-11-02).

### Q013

Question: Deep review P0 finding 004: Codex launches with --dangerously-bypass-approvals-and-sandbox, so during a test run the model can write anywhere on your machine, not just in the scratch project; the repository snapshot only detects writes to specs/ and .state afterwards. The other four runtimes also skip permission prompts and have no filesystem sandbox flag in their adapters. How should Codex run?
Options: Codex sandbox on (Recommended); Accept the bypass, record it
Answer: "Codex sandbox on (Recommended)" (2026-11-02).

### Q014
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_01TTahkzJQGDiGDXJii6smUz:1 -->

Question:
```text
The packet's run evidence holds 101 repository-snapshot files (repo-before.txt / repo-after.txt, ~21 MB each, 3.6 GB total). Without them the packet is 67 MB. What should happen to them?
```

Options:
```text
Delete them, keep the rest (Recommended)
Keep on disk, don't commit
Commit everything
```

Answer:
```text
Delete them, keep the rest (Recommended)
```

### Q015
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_01TTahkzJQGDiGDXJii6smUz:3 -->

Question:
```text
Codex hit its weekly usage limit in the last five-runtime pass (resets 2026-11-05). It passed 6/6 on the final runner one pass earlier; only the scenario's letter-case handling changed since. Rerun Codex on the final scenario after the reset?
```

Options:
```text
No, matrix5 covers it (Recommended)
Yes, after Nov 5
```

Answer:
```text
i reset it for you
```

### Q016
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_01XgTFNL8ApYwaUw6gB7x6xN:0 -->

Question:
```text
The goal check on packet sk-doc/065 flags two criteria as literal misses. Criterion 5 says no REPO_CHANGED after every MTP-007 run, but early runs (matrix2, Codex attempt 5) correctly failed REPO_CHANGED from other sessions' writes, and history can't change; every run since the worktree move is clean. Criterion 6 says the hub check 'ends with OK: parent-skill-check', but its fixed success line continues '— all hard invariants passed, 0 warnings'. Amend those two criteria in goal.md to: (5) every run in the final passes (matrix5, matrix6, claude-code-final, codex-final) has no surviving socket and repo.changed false; (6) the check prints a line beginning with 'OK: parent-skill-check'?
```

Options:
```text
Amend both (Recommended)
Leave the goal as is
```

Answer:
```text
Amend both (Recommended)
```

### Q017
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_011tVyPuwv816RgKw6PYWRjM:0 -->

Question:
```text
The five-runtime MTP-007 rerun needs about 16 minutes in which no other session writes to specs/ or .skilled/skills/.state/decision-capture/. The decision-capture session and the old fe0c9990 session were still writing at 09:01, and they caused the REPO_CHANGED failures. How do you want to get that window?
```

Options:
```text
I'll pause them now (Recommended)
Run later, after review
Narrow the watch instead
```

Answer:
```text
Git worktree works as well?
```

### Q018
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_011tVyPuwv816RgKw6PYWRjM:1 -->

Question:
```text
Opt-in Codex hook trust (`trust_hooks`) is built and passes its fake-subject test. Proving it live means one Codex run that writes its trust entries into your ~/.codex/config.toml and then removes them. Decision Q006 says to trust hooks only in the decision-capture 006 runs. Should I make one live proof run from this packet?
```

Options:
```text
Yes, one proof run here (Recommended)
No, leave it to 043/006
```

Answer:
```text
Yes, one proof run here (Recommended)
```

### Q019
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_019JJrWgMfVcwmfzYboszXiH:0 -->

Question:
```text
The Codex trust run's "Trust all" also re-trusted your global ~/.codex/hooks.json session_end hook (it changed at 08:16 today and was untrusted before the run). The runner left it in place because it can't tell its own change from another session's. What should happen to that entry?
```

Options:
```text
Restore old hash (Recommended)
Keep it trusted
```

Answer:
```text
Restore old hash (Recommended)
```

### Q020
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_019JJrWgMfVcwmfzYboszXiH:1 -->

Question:
```text
To stop this happening again: should the runner refuse "Trust all" when Codex's review screen counts more hooks than the scratch project's own hooks.json holds, picking "Continue without trusting" and failing the run with a named blocker instead?
```

Options:
```text
Yes, add the guard (Recommended)
No, record it only
```

Answer:
```text
Yes, add the guard (Recommended)
```

### Q021
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_01TfV7P8gHEXrHu6JoYCv69v:0 -->

Question:
```text
Deep review P0 finding 004: Codex launches with --dangerously-bypass-approvals-and-sandbox, so during a test run the model can write anywhere on your machine, not just in the scratch project; the repository snapshot only detects writes to specs/ and .state afterwards. The other four runtimes also skip permission prompts and have no filesystem sandbox flag in their adapters. How should Codex run?
```

Options:
```text
Codex sandbox on (Recommended)
Accept the bypass, record it
```

Answer:
```text
Codex sandbox on (Recommended)
```

### Q022
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_01LfFpA7i46HL7rnXG1Qf4A6:0 -->

Question:
```text
The first of the four approved commits was blocked by the pre-commit mirror-parity gate. Its repository-wide check fails on a missing Devin mirror, .devin/hooks/ask-capture-posttooluse.mjs, which comes from the decision-capture session's uncommitted .devin/hooks.v1.json change. None of the four commits touches a Devin file. How should I proceed?
```

Options:
```text
Bypass for these commits (Recommended)
Wait for decision-capture
Generate the Devin mirror
```

Answer:
```text
Wait for decision-capture
```

### Q023
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_01GVtaT8uoCX7VuqZQzvbKvL:0 -->

Question:
```text
Luna's quota ran out after 8 of 10 research iterations. Codex says try again at 7:25 PM, about 20 minutes away. The 8 iterations are saved, and findings were still coming in (63% new information in iteration 8). How should the research finish?
```

Options:
```text
Wait, resume on Luna (Recommended)
Finish on DeepSeek now
Synthesize the 8 now
```

Answer:
```text
Synthesize the 8 now
```

### Q024
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_01MvANvgubRWtVewoGGLMDDF:0 -->

Question:
```text
You sent the playbook mode's assets folder. It holds manual-testing-playbook-template.md (root playbook) and manual-testing-playbook-snippet-template.md (one per-scenario template covering both styles; the json conversation block must be deleted for a single-prompt scenario). What should happen there?
```

Options:
```text
Keep one template, add guard (Recommended)
Split into two templates
Just reviewing, no change
```

Answer:
```text
Split into two templates
```

### Q025
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_01L3trELRMkaVpVJixWcRbBf:0 -->

Question:
```text
For the one-go build of phase 004 (about 30 conversation scenarios across 16 skill packages): how many authoring workers may run at once? The cli skills default to one dispatch at a time unless you approve more.
```

Options:
```text
4 at once (Recommended)
2 at once
1 at a time
```

Answer:
```text
4 at once (Recommended)
```

### Q026
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_01L3trELRMkaVpVJixWcRbBf:1 -->

Question:
```text
Which models should write the scenarios?
```

Options:
```text
Luna hard, DeepSeek easy (Recommended)
All Luna xhigh fast
All DeepSeek flash max
```

Answer:
```text
luna xhigh normal speed all
```

### Q027
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_01L3trELRMkaVpVJixWcRbBf:2 -->

Question:
```text
Phase 003 edits system-spec-kit playbook files the decision-capture session owns. How should it be handled in this run?
```

Options:
```text
Leave it out for now (Recommended)
Include it now
```

Answer:
```text
Include it now
```

### Q028
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_019WQCvV6ZxuM6wtRuJGFEHr:0 -->

Question:
```text
Several new conversation scenarios have preconditions the run can't create (the DOC-409 test fixture, a native ClickUp tool, Pi or gh sign-in). The rule I gave the workers says a setup command exiting 77 skips the whole run, but the runner treats any nonzero setup exit as SETUP_FAILED and a check exit 77 skips only one turn. Which should win?
```

Options:
```text
Change the runner (Recommended)
Keep the runner as is
```

Answer:
```text
Change the runner (Recommended)
```

### Q029
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_017rpn2HA2LhhDSMxuW9y8un:0 -->

Question:
```text
Luna's usage limit ran out at the start of the last fix wave (no files changed). It resets at 00:27 tonight, about 2.5 hours from now. 13 small fix jobs remain before the second review and the live runs: the OpenCode reply checks and moving precondition guards into setup. How should the build continue?
```

Options:
```text
DeepSeek for the rest (Recommended)
Wait for Luna at 00:27
I fix them directly
```

Answer:
```text
DeepSeek for the rest (Recommended)
```

### Q030
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_015z7wFiRek8rzT3BSpFWh3g:0 -->

Question:
```text
Devin's daily quota ran out partway through the second fix wave: 4 of 15 packages got their fixes, 11 still need them (all small, specified edits). Luna resets at 00:27 (about an hour). Devin's daily quota also blocks the two Devin live runs, and Codex's quota blocks the one Codex live run until 00:27. How should the build continue?
```

Options:
```text
Pi DeepSeek now (Recommended)
Wait for Luna at 00:27
Go live now, fix after
```

Answer:
```text
Pi DeepSeek now (Recommended)
```

### Q031
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_013mHYMmTiiSXqKL9NQejBxg:0 -->

Question:
```text
The Claude Code live runs share your account's weekly limit, which the subject's status line shows at 82% used. There are 15 Claude Code scenarios, some with 10–11 turns, and they could use up the rest and stop this session too. How should I run them?
```

Options:
```text
Short ones only (Recommended)
Run all 15 now
Defer all Claude runs
```

Answer:
```text
Defer all Claude runs
```

### Q032
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_01TYVtSAT11a5XAPZfDrn9dR:0 -->

Question:
```text
The 13 scenarios extended to OpenCode and Pi still fail after two fix rounds. Only DOC-407 (OpenCode) and CHG-014 (Pi) pass. The rest fail on unexpected question forms, a command OpenCode never submits, and possibly real skill bugs (SD-008 never asks chart or flowchart). How should I continue?
```

Options:
```text
Diagnose deeply myself (Recommended)
Keep passes, revert rest
Record and pause
```

Answer:
```text
Diagnose deeply myself (Recommended)
```

### Q033
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:chat:b337f711-feb9-4a13-bb9d-0a43a302bf09:b70c5a7d-e6be-49d4-9c6d-95093680fbb8 -->

Question:
```text
Your decision: should I add OpenCode as a second runtime to those 13 and run them now? Or wait for the Claude reset and keep them Claude-only?
```

Options: none

Answer:
```text
Yes opencode (and, in a follow-up message: And pi)
```

### Q034
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_01Vng9U1t3r1i7Acry3eDM2N:0 -->

Question:
```text
Round 3 on OpenCode and Pi: CHG-014 passes on both and RRD-005 on OpenCode. Four failures are small scenario fixes: SCG-010's documentation pattern is too broad, RRD-005 on Pi has a new question wording, and DIA-003 and SD-004 on Pi get one extra follow-up question each. DOC-408's 10-turn flow assumes Claude Code's step order. How far should I go?
```

Options:
```text
Small fixes + rerun (Recommended)
Small fixes + DOC-408
Stop here
```

Answer:
```text
Small fixes + rerun (Recommended)
```

### Q035
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_01Vng9U1t3r1i7Acry3eDM2N:1 -->

Question:
```text
SD-008 (sk-design ambiguous visual) and SP-008 (sk-prompt zero-keyword fallback) test behaviour that finishes in one turn, so as conversations they add nothing. SP-008 is a committed file that was converted in place; SD-008 is a new file. What should happen to them?
```

Options:
```text
Revert and drop (Recommended)
Keep, Claude only
```

Answer:
```text
Revert and drop (Recommended)
```

### Q036
<!-- source: claude:beb6e7b1-5f31-42db-8cd9-f58f27216e79:toolu_011HpBZHG7vNe7frNPJWFhxL:0 -->

Question:
```text
Luna (gpt-6-luna) hit its usage limit until 12:26 PM, so the two prose rewrites for DOC-408 and DOC-367 did not run. Their files only carry my runtime change to claude-code; the prose still names OpenCode and Pi. How should those two rewrites happen?
```

Options:
```text
Wait, rerun Luna (Recommended)
I edit them myself
DeepSeek via pi
```

Answer:
```text
Wait, rerun Luna (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->

---
