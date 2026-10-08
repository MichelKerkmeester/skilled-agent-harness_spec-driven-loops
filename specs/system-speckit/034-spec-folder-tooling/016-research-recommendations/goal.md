---
title: "Goal: Research recommendations"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Research recommendations

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build, verify and ship all 16 research recommendations to main through parallel CLI lanes, each phase meeting its own goal.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Builders: DeepSeek V4.1 Flash max through cli-pi on two routes, `opencode-go` and `llmgateway`, and GPT-6 Luna max fast through cli-codex. Each child goal names its route, command and reviewer |
| D2 | Waves, run in order. No two phases in a wave write the same file. W1: 001 002 004 005 008 014. W2: 006 007 010 016. W3: 011. W4: 003 012 013. W5: 015. W6: 009 |
| D3 | A DeepSeek brief carries one task. Every brief opens with the child-dispatch preamble and an inline persona, and ends with its allowed write set |
| D4 | The other model family reviews each phase read-only. A finding is applied only after it is confirmed in the code, for at most two rounds |
| D5 | This session orchestrates and runs every gate itself. A child's exit code or report is never evidence |
| D6 | Each phase commits only its own files. Each wave pushes to main as a fast-forward, and CI must pass before the next wave starts |
| D7 | A failing DeepSeek route switches to the other route, then to Luna. Three failed fixes on one symptom park that phase with its blocker logged. Phases that do not depend on it continue |
| D8 | Nesting in the anchor check ships as a warning after 001 and becomes an error only after 011 has un-nested the corpus |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| SH-01 | `001-spec-template-anchor-nesting/goal.md` |
| SH-02 | `002-phase-scaffold-graph-metadata/goal.md` |
| SH-03 | `003-archive-path-follow-ups/goal.md` |
| SH-04 | `004-trigger-index-rebuild-hardening/goal.md` |
| SH-05 | `005-healer-phrase-seeding/goal.md` |
| SH-06 | `006-evidence-gated-provenance/goal.md` |
| SH-07 | `007-ci-rule-set-comparison/goal.md` |
| SH-09 | `008-legacy-era-report/goal.md` |
| SH-08 | `009-doctor-update-compatibility/goal.md` |
| SH-10 | `010-upgrade-reversibility/goal.md` |
| SH-11 | `011-anchor-repair-mode/goal.md` |
| SH-12 | `012-fold-one-off-repairs/goal.md` |
| SH-13 | `013-anchor-contract-alignment/goal.md` |
| SH-14 | `014-gate-3-menu-parity/goal.md` |
| SH-15 | `015-lane-rules-as-heal-modes/goal.md` |
| SH-16 | `016-phrase-cleanup-hardening/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] All 16 child spec.md files read Status Complete, and every acceptance row is Met or waived by a decision record
- [ ] `validate.sh` on this packet with `--recursive --strict` prints `RESULT: PASSED`
- [ ] `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` shows no failure beyond the baseline taken before wave 1
- [ ] `check-goal.cjs` exits 0 for this packet and for each of the 16 children
- [ ] CI on the final main commit reports every check as success
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
| Parent and 16 children scaffolded | Done | `validate.sh` on the parent printed `RESULT: PASSED` with one warning |
| Child planning docs and goals | Done | Written by Haiku 4.5 agents, reviewed by DeepSeek v4.1 Flash, fixes verified against the code |
| Operator decisions | Done | Ten choices decided on 2026-10-08 after a fresh Opus recommendation, D2 and D4 amended |
| Lane routes smoke-tested | Done | `llmgateway/deepseek-v4.1-flash`, `opencode-go/deepseek-v4.1-flash` and `gpt-6-luna` max fast each replied PONG on 2026-10-08 |
| Wave 1 | Pending | Capture the CLI test and check baseline first |

### Deviations and findings

| Item | Note |
|------|------|
| Scope widened to the build | On 2026-10-08 the operator asked for all 16 phases to be built autonomously, so the objective, decisions and criteria now cover the build. The planning record stays in the progress rows |
<!-- /ANCHOR:log -->
