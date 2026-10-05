---
title: "Goal: Open Knowledge Format adoption for system-spec-kit: research, design, implementation"
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
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption"
    last_updated_at: "2026-10-04T08:13:09Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Removed phase 006 and added the three hardening phases"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-04-speckit-050"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Goal: Open Knowledge Format adoption for system-spec-kit: research, design, implementation

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Adopt and harden R5 (one contextType list), R1 (a [SOURCE:] tag check) and R9 (citation drift detection) across system-spec-kit and sk-doc without breaking any existing packet. Done when: validate.sh --strict --recursive on the packet prints RESULT: PASSED; the phase 002 decision record holds D1 to D4, each approved by the operator; the spec-kit and sk-doc validators both warn, never error, on a contextType outside the shared list; a warn-only rule flags a fixture with an invented [SOURCE:] line, and no existing packet changes result; cite-drift-scan.mjs splits broken citations into moved, gone and past-end for spec and skill docs; the contextType warnings, census and SOURCE_TAGS rule each report Wilson 95% accuracy intervals from samples drawn after a dated protocol; REPO RULES.md:88 resolves in the census and SOURCE_TAGS, which gives identical warnings in the worktree and main checkout.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | New checks are warn-only. No existing packet or skill doc changes its validation result. |
| D2 | No product file changes before the operator approves the phase 002 decisions. |
| D3 | R2 to R4 stay deferred, R6 to R8 rejected, and the anchor citation form removed. |
| D4 | Nothing is committed or pushed without an operator instruction. |
| D5 | Each measurement fixes sizes, seed and thresholds in a dated protocol before data. |
| D6 | SWE 2 max writes code, Luna 6 max fast and DeepSeek V4.1 Flash max label, and every result is rerun before it is recorded. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-okf-deep-research | `001-okf-deep-research/goal.md` |
| 002-baseline-and-decisions | `002-baseline-and-decisions/goal.md` |
| 003-context-type-unification | `003-context-type-unification/goal.md` |
| 004-citation-drift-detection | `004-citation-drift-detection/goal.md` |
| 005-source-resolver | `005-source-resolver/goal.md` |
| 007-docs-and-closeout | `007-docs-and-closeout/goal.md` |
| 008-context-type-hardening | `008-context-type-hardening/goal.md` |
| 009-census-hardening | `009-census-hardening/goal.md` |
| 010-source-tag-hardening | `010-source-tag-hardening/goal.md` |
| 011-frontmatter-values-to-sk-doc | `011-frontmatter-values-to-sk-doc/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] validate.sh --strict --recursive on the packet prints RESULT: PASSED
- [x] the phase 002 decision record holds D1 to D4, each approved by the operator
- [x] the spec-kit and sk-doc validators both warn, never error, on a contextType outside the shared list
- [x] a warn-only rule flags a fixture with an invented [SOURCE:] line, and no existing packet changes result
- [x] cite-drift-scan.mjs splits broken citations into moved, gone and past-end for spec and skill docs
- [x] the contextType warnings, census and SOURCE_TAGS rule each report Wilson 95% accuracy intervals from samples drawn after a dated protocol
- [x] REPO RULES.md:88 resolves in the census and SOURCE_TAGS, which gives identical warnings in the worktree and main checkout
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
| 001-okf-deep-research | Done | research/research.md, AC-001 to AC-006 Met |
| 002 to 007 | Pending (superseded by the rows below) |  |
| 002-baseline-and-decisions | In Progress | everything but operator approval of D1-D4 done; validate --strict PASSED |
| 002-baseline-and-decisions | Done | decision-record.md D1-D4 approved, condition carried into 003-007 |
| phase 003 | implementation done, open on commit (superseded 2026-10-05 below) | strict PASSED, 6 of 7 AC met |
| phase 004 | implementation done, AC-006 open | strict PASSED, 6 of 7 AC met |
| phase 005 | Done | SOURCE_TAGS warn rule built; 7 of 7 AC met; strict PASSED; CLI 1660 passed |
| phase 006 | Done, not built | ADR-001 no-go: 3 of 13 targets carry markers; rule B recorded as the way back |
| phase 007 | Docs done, open on commit (superseded 2026-10-05 below) | six changelogs and skill versions, catalogs and playbooks, command docs; AC-004 waits for the commit |
| root criterion 1 | Done | validate.sh --strict --recursive exit 0, parent and seven phases PASSED, 0 errors 0 warnings |
| phase 008 contextType | Complete | matrix 180/180 both warnings, corpus 0 of 22,754, generators 0/90, cold writers contextType 8/30 (14.2-44.4%) |
| phase 009 census | 7/8 AC (superseded 2026-10-05 below) | REPO RULES.md:88 resolves (439 rows); moved 98/100 (93.0-99.4%), past end 100/100, gone 100/100; 214.9 s vs 735.6 s; rebuild sha identical; kappa 0.31, 40 rows wait for operator |
| phase 010 SOURCE_TAGS | 6/7 AC | 754 false warnings removed; moved 49/50 (89.5-99.6%), past end 44/44, gone 50/50; planted recall 100%; checkouts 38 commits apart, 27 diffs all from files deleted on main; 2/20 packets over 20% run time |
| criterion 1 | Met 2026-10-04 | validate --strict --recursive: 10x RESULT: PASSED, 0 errors, 0 warnings |
| criterion 7 | Open | census and rule resolve REPO RULES.md:88; identical warnings need both checkouts at one commit |
| criterion 7 | Met 2026-10-04 | REPO RULES.md:88 resolves in census (4 rows) and rule (vitest e2e, 5 planted controls); at 93a83a466b0b a temp detached worktree and the main checkout give identical output, baseline differs by 366; temp worktree removed |
| phase 011 value list move | Complete, 8/8 AC | list moved to sk-create-frontmatter/assets; every check identical to its baseline; validate --strict --recursive 11x RESULT: PASSED |
| phases 003 and 007 | Complete 2026-10-05 | the commits each criterion waited on are on main: 003 AC-006 by `cca919c5a4` (33 to 12), 007 AC-004 by the docs commits |
| phase 009 census | Complete 2026-10-05 | ADR-001: SWE 2, GLM 5.3 Flash and Gemini 3.8 Flash settled 33 of 40 disputed rows; guessed class 80.6% intended (71.5-87.4%) over 93 settled rows, a panel verdict; AC-004 superseded |

### Deviations and findings

| Item | Note |
|------|------|
| Phase 006 removed by the operator | Deleted with its threshold proposal; backup kept as phase006-backup.tgz in the session scratchpad; phases 008 to 010 added to harden R5, R9 and R1 with measurement |
| Slice over 4,000 after the 011 binding row | Cut per sk-create-goal budget-and-handoff section 3, steps 5 and 6: D3 and three criteria shortened in both copies, none dropped; 4,082 to 3,985 characters; prior text in 011/scratch/baseline/parent-goal-before-trim.md |
| Two docs said strict fails on warnings | Fixed in phase 007; a warning never fails `--strict`, which is what keeps the two new rules warn-only in practice |
| Phase 003 rule had no automated test | Added in phase 007, three cases |
| Re-verification 2026-10-05 by Sonnet 5.5 | All eight checks on the panel data, gate and main confirmed. Doc fixes: phase 003's count is 31 to 12 outside scratch folders, 33 to 15 with them, and commit `cca919c5a4` pairs 33 with 12; the phase table and parent status now read Complete; 009 citation line numbers, decision-record metadata and one run description corrected |
<!-- /ANCHOR:log -->
