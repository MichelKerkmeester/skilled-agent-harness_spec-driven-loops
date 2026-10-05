---
title: "Goal: Repo rule surfacing, concision and loading"
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
    packet_pointer: "agents/016-repo-rule-advisor-surfacing"
    last_updated_at: "2026-10-05T10:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Revised the goal for stage 2: live adoption, 009 and 010"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-goal-retrofit-2026-10-04"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Repo rule surfacing, concision and loading

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Put the decided repo-rule changes live one measured window at a time, make every executor load the rules AGENTS.md mandates without prompt instructions, and make each rule findable by the words agents search with.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each phase passes validate.sh --strict before its successor starts. Isolated test-environment runs may overlap any phase. |
| D2 | Live rule and loader changes land one at a time in the order 007 wording, 008 cards, 009 winner. Each lands only after the previous live change, starting with 006, has a measured window of at least seven days. |
| D3 | No once-per-compaction rule hook is built until a measured miss rate justifies one. |
| D4 | Rule trigger_phrases stay in rule frontmatter, with no sidecar. |
| D5 | No fix for a skipped rule load adds rule-reading instructions to user prompts. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-advisor-surfacing | `001-advisor-surfacing/goal.md` |
| 002-rule-concision-and-loading | `002-rule-concision-and-loading/goal.md` |
| 003-agents-md-delivery-prefix | `003-agents-md-delivery-prefix/goal.md` |
| 004-rule-delivery-instrumentation | `004-rule-delivery-instrumentation/goal.md` |
| 005-trigger-coverage-check | `005-trigger-coverage-check/goal.md` |
| 006-rule-concision-rewrites | `006-rule-concision-rewrites/goal.md` |
| 007-table-wording-experiment | `007-table-wording-experiment/goal.md` |
| 008-gate5-card-pilot | `008-gate5-card-pilot/goal.md` |
| 009-rule-delivery-debugging | `009-rule-delivery-debugging/goal.md` |
| 010-rule-phrase-find-surface | `010-rule-phrase-find-surface/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh --recursive --strict` on this packet prints RESULT: PASSED for this packet and all ten phase folders
- [ ] `006-rule-concision-rewrites/results/` holds a `measure-rule-compliance.py` report covering at least seven days after 2026-10-04 22:20, compared with the 004 baseline
- [ ] `.skilled/repo-rules/communication.md` contains "No tables in a reply, except the in-flight block", committed with a ledger entry after the 006 window report
- [ ] `.skilled/repo-rules/cards/` holds 13 cards, all 13 trigger-table links in `REPO RULES.md` point into `cards/`, and `check-repo-rules.cjs` prints RESULT: PASSED with no failed check
- [ ] `009-rule-delivery-debugging/results/` records a decision made by its `preregistration.md` decision rule, with Gate 5 and reply-rule miss rates per executor and Wilson intervals
- [ ] `rg -i 'flaky test' .skilled/repo-rules` finds `root-cause-and-debugging.md`, and `repo-rule-template.md` and `rule-anatomy.md` give one phrase-count rule, with no conflicting number
- [ ] A decision record in each of `007-table-wording-experiment/` and `008-gate5-card-pilot/` waives its `preregistration.md` sample size
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
| Goal retrofit | Done | Parent and eight phase goals authored on 2026-10-04 from each folder's own spec.md, acceptance-criteria.md where present and tasks.md |
| Phases 001 and 002 | Complete per the phase map | spec.md Phase Documentation Map. Criteria left unticked until an evaluator confirms them |
| D2 amendment | Done | operator chose to fold a simple-terms clause for communication.md into 006; D2 and 006 D1 amended, 006 REQ-007 and AC-006 added |
| Byte criterion amendment | Done | operator waived the 91,028 B target; criterion names 006 ADR-002 |
| CI rule canary | Done | pushed c83421238f; Rule Canary Sync and Repo Rules Corpus passed, last delivery-prefix anchor ends at byte 16345 |
| D6 amendment | Done | Operator ran 007 and 008 now in isolated test environments built from edba53daeb. Windows never overlap on the live repository, a winner goes live only after the 006 window, and 007 decides before an 008 winner is adopted. D2 prose shortened to fit the 4,000-char budget, clause detail stays in 006 D1 |
| Phases 009 and 010 added | Done | Phase-add: map rows, binding rows and child goals for 009-rule-delivery-debugging and 010-rule-phrase-find-surface. Criterion 1 now names ten phase folders and criterion 6 says first scored run instead of block 1 |
| 007 and 008 status | In Progress | 007 preregistration committed in edba53daeb and the 600-run experiment is running. 008 arm C dropped under REQ-005 (26,778 B + 7,677 B = 34,455 B), generator and check 11 committed, preregistration pending |
| D1 amendment | Done | operator asked to run 007 and 008 now; D1 lets both run together in isolated environments, live adoption order unchanged under D6 |
| 007 decision | Decided, adoption pending | 6ffe5e5514: pre-registered rule 2 adopts the short no-table wording, short minus current +0.0 points (-3.4 to +3.4) over 625 runs, 0 of 108 tables per arm once communication.md was read. Preregistration edba53daeb predates the first scored run. Deviations 1 to 4 in results/deviations.md. Live wording waits on the 006 window (D6) |
| Stage 1 criteria met | Done | Verified 2026-10-05: recursive validate 11/11 PASSED, both research verdicts exist, rule canary in rule-canary-sync.yml with the last anchor before byte 16,384 and AGENTS.md 26,778 B, check-repo-rules 11/11 at 94,609 B (ADR-002), analyzer pytest 9/9 with baseline 70f36c299b an ancestor of 023e4915c1, preregistrations edba53daeb and 3990bc9fa5 before first scored runs with results/decision.md in both, no rejected-arm artifact |
| Goal revised for stage 2 | Done | Operator asked for a new goal after stage 1 on 2026-10-05. Objective, decisions and criteria now cover live adoption, 009 and 010. Old D2 and D5 are fulfilled and old D6 is carried by the new D2 |
| 008 decision | Decided, adoption pending | 6ffe5e5514: pre-registered rule 1 adopts cards at Gate 5 over 318 runs. Primary -4.0 points (-15.5 to +7.6), Gate 5 miss +2.2 (-3.3 to +7.9), 42,064 against 59,620 rule bytes per run. Preregistration 3990bc9fa5 predates the first scored run. Deviations 1 to 4 in results/deviations.md. Adoption waits on the 006 window and checks 2 and 10 accepting card links |
| Sample-size waivers | Done | 007 decision-record.md ADR-001 and 008 decision-record.md ADR-002 waive the pre-registered sample sizes the shortened schedules missed; 008 AC-003 Waived |
| 009 decision | Bullet kept, replication preregistered | rule 2 of preregistration.md: Gate 6 cut reply-rule misses -22.6 points (-29.8 to -15.6) over 360 runs, but the Gate 5 guard was unresolved at 0 of 32 vs 0 of 30 (upper +11.4 > +10). preregistration-2.md replicates on write tasks sized for the guard |

### Deviations and findings

| Item | Note |
|------|------|
| Level 1 phases 001, 002, 005 and 007 have no acceptance-criteria.md | Their goals take criteria from spec.md requirements and success criteria plus tasks.md, as the retrofit brief directed |
<!-- /ANCHOR:log -->
