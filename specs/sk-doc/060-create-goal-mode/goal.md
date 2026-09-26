---
title: "Goal: Create the sk-create-goal sk-doc mode"
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
    packet_pointer: "sk-doc/060-create-goal-mode"
    last_updated_at: "2026-09-26T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed all nine phases against the completion criteria"
    next_safe_action: "None; packet complete. Commit is the operator's call"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Create the sk-create-goal sk-doc mode

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> The durable slice runs from here to the log, and it is what the operator sets.
> A phase parent's limit is 4000 characters; `goal.cjs packet` measures it.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Ship `sk-create-goal`, an sk-doc mode behind `/create:goal` that authors a packet's parent and nested `goal.md` to the spec-kit goal contract.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `sk-create-goal` under sk-doc, `routingClass: metadata`, command `/create:goal` |
| D2 | Render through system-spec-kit's goal template; never ship a fork of it |
| D3 | Files only; binding and session objectives stay with the goal hooks |
| D4 | Gaps in system-spec-kit go to that skill as amendments |
| D5 | Each phase child is Level 2 with its own bound `goal.md` |
| D6 | Routed means a real request reaches the mode through both stages |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001 | `001-goal-inventory-and-mode-contract/goal.md` |
| 002 | `002-mode-scaffold/goal.md` |
| 003 | `003-authoring-standards-and-exemplars/goal.md` |
| 004 | `004-parent-and-nested-goal-authoring/goal.md` |
| 005 | `005-budget-and-chat-slice-handoff/goal.md` |
| 006 | `006-goal-conformance-check/goal.md` |
| 007 | `007-hub-routing-integration/goal.md` |
| 008 | `008-command-and-playbook/goal.md` |
| 009 | `009-verification-and-closeout/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `validate.sh --recursive --strict` on this packet prints `RESULT: PASSED`
- [ ] `mode-registry.json` binds `sk-create-goal` to `/create:goal`; the parent-skill check on sk-doc reports OK
- [ ] A goal-authoring request routes advisor to sk-doc to `sk-create-goal`; "set the goal" does not
- [ ] The conformance check fails each negative fixture for its named reason and passes the positive one
- [ ] A real goal authored via `/create:goal` is within budget per `goal.cjs packet`, every phase bound
- [ ] `sk-create-goal/changelog/v1.0.0.0.md` exists and the hub changelog link resolves
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
| Goal-system audit (Luna, cli-codex, read-only) | Done | `001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md`; four load-bearing claims re-checked by the orchestrator |
| Mode-anatomy and 040 audit (Luna, cli-pi via LLM Gateway, read-only) | Done | `001-goal-inventory-and-mode-contract/scratch/wave1-mode-anatomy-audit.md`; seven citations re-opened, all resolved |
| Nine-phase scaffold | Done | `create.sh --phase --level 2 --with-goal --track sk-doc --number 060` |
| Phase planning docs | Done | GPT-6 Luna authored each phase: 001, 003-006 through cli-codex at `xhigh` on the fast tier, 002 and 007-009 through cli-pi via the LLM Gateway at `xhigh`. `validate.sh --recursive --strict` printed `RESULT: PASSED` for all 10 folders, 0 errors, 0 warnings |
| Phase 001 executed | Done | 296 goals measured, all 296 `goal.cjs packet` runs exit 0; four audit defects reproduced; checker verdict: a mode-local checker plus a recorded system-spec-kit amendment request. Two Luna workers on the pi gateway lane after the Codex usage limit; two wrong citations fixed on re-read. Strict validation `RESULT: PASSED` |
| Phase 002 executed | Done | `sk-create-goal/` scaffold built unregistered: package check `Result: PASS`, parent-skill check fails only on `6a`, as the handoff expects. Strict validation `RESULT: PASSED` |
| Phase 003 executed | Done | Five authoring standards and a cited exemplar set (3/3 known-bad FAIL, 1/1 known-good PASS), loaded by the workflow; HVR 0 hard blockers. Strict validation `RESULT: PASSED` |
| Phase 004 executed | Done | Parent and nested goal workflows; fixture binds 3 of 3 phases with 0 `SPECDOC_SUFFICIENCY_006`; phase-add proved 3 to 4 rows. Operator approved judging the scratch fixture without the three generated-metadata rules, which the writer cannot run under scratch. Strict validation `RESULT: PASSED` |
| Phase 005 executed | Done | Budget and chat-slice handoff reference, wired into the mode; an over-budget fixture cut from 5,897 to 3,256 with 5 criteria kept. Operator approved wiring rows for 005 and 006 and the canary and compiled-routing scope for 007. Strict validation `RESULT: PASSED` |
| Phase 006 executed | Done | Read-only `check-goal.cjs` with four named checks; 8 of 8 tests pass, each negative failing only its named check. The orchestrator fixed a criteria-count false positive found in the corpus run. Corpus baseline: 300 goals, counts 203, 83, 35 and 4. Validator amendment request recorded, system-spec-kit unchanged. Operator approved Hermes mirrors in 008. Strict validation `RESULT: PASSED` |
| Phase 007 executed | Done | sk-create-goal registered in the sk-doc hub. Newcomer prompts 0 of 10 before, 10 of 10 after at the hub and 9 of 10 at the advisor; 0 of 6 session-goal probes. Parent-skill check OK. Compiled routing republished: canary 22 of 22, all hubs `compiled-serving`. Operator approved mirroring the canary case into its authored source. Strict validation `RESULT: PASSED` |
| Phase 008 executed | Done | `/create:goal` command package, one metadata entry with six operations, both indexes (create count 13), generated runtime copies including Hermes, and an eight-scenario playbook (validator PASS). SCG-007 and SCG-008 ran and passed. Operator approved the Hermes and repo-wide index rows. Strict validation `RESULT: PASSED` |
| Phase 009 executed | Done | Playbook 8 of 8 PASS. Real goal on 017 via `phase-add`: 3,728 durable characters, `packet_budget=ok`, seven of seven phases bound, check 4/4. Routing: hub 10 of 10, advisor 9 of 10, 0 of 6 probes. README, `v1.0.0.0.md` and hub link shipped. Parent-skill check OK, five mirror checks pass |
| Completion criteria | Met | 1: recursive strict `RESULT: PASSED`. 2: `mode-registry.json` binds `/create:goal`, parent-skill check OK. 3: goal requests route advisor to sk-doc to the mode 9 of 10 times, "Set the goal for this session" defers. 4: 8 of 8 checker tests. 5: 017 at 3,728 characters with every phase bound. 6: changelog exists and the link resolves |

### Deviations and findings

| Item | Note |
|------|------|
| Parent over budget on first draft | 4,820 durable characters. The template's fixed text takes about 1,900 of the 4,000 and nine binding rows about 900 more. Cut in the playbook order: binding phase column, decision prose, criterion wording, then the authoring blockquote. No criterion dropped. Input for phase 005 |
| No parent goal from the phase scaffold | `create.sh --phase --with-goal` wrote `goal.md` into all nine children and none into the parent. This file was rendered with the inline renderer at `--level phase` |
| Phased at Level 2 | The phased-packet rule asks for Level 3. The operator asked for a multi-phased packet shaped like `040-create-repo-rules`, itself a Level 2 phase parent |
| 002 handoff corrected | The first draft required the parent-skill check to stay OK after the scaffold. Phase 002's author halted on it: an unregistered child directory fails invariant `6a` until phase 007 registers it, as `049-sk-create-frontmatter` phase 002 recorded. The 002 and 007 handoff rows in `spec.md` now expect the `6a` failure and close it at 007 |
| Changelog route named | Phase 009's author halted twice because `sk-create-changelog` documents no skill-local or nested-component target. `040-create-repo-rules` phase 007 wrote its mode changelog directly and then linked it through `.skilled/changelog/sk-doc/create-<x>`. Phase 009 now plans that route and leaves the `sk-create-changelog` question open for execution |
| Authors halted on failed edits | Phases 003 and 008 stopped when a patch did not match, per the halt rule. Both had written all six files; the orchestrator repaired a doubled anchor and a frontmatter indent in 003 and added the verification command in both |
| Executor switched for 007-009 | On 2026-09-26 cli-codex hit its usage limit (resets Oct 1) and LLM Gateway `gpt-6-luna` failed every second tool turn with "encrypted content could not be verified". The operator chose `llmgateway/mimo-v2.6-pro` at high thinking through cli-pi; a multi-turn smoke test passed first |
| 017 accept path and its stop rule | 017's phase map names phase 7 `007-deep-review-remediation/`, the folder is `007-decommission-review-p1-p2-fixes/`. The mode would stop on that mismatch; the brief named the disk folder, so the worker went ahead. The rename is for 017's owner, and 017's changed chat slice should be resent by any session holding it |
<!-- /ANCHOR:log -->
