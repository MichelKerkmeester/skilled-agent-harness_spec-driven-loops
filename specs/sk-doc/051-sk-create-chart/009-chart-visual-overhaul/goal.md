---
title: "Goal: Chart Visual Overhaul"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart/009-chart-visual-overhaul"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive and bound all seven phases"
    next_safe_action: "None open. All seven phases are complete"
    blockers:
      - "The line weight and glow fork is unanswered and phase 001 stops on it"
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-chart-visual-overhaul"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Line weight and glow, answered by rendered comparison in phase 001"
      - "Dark theme, which amends the one-palette-block rule"
      - "Whether one series may carry a colour range"
      - "Whether the catalog gains a composed bar and line form"
    answered_questions:
      - "Every adoption is a re-implementation, never a copy"
      - "Decorative plot-background patterns are rejected"
---
# Goal: Chart Visual Overhaul

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Rebuild the chart corpus to the look the evilcharts research established, in dependency order, without breaking the one-file contract or the honesty rules that make the corpus what it is.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every adoption is a re-implementation in the corpus idiom, never a copy. `SKILL.md:134` bans copying a template, a fragment or a snippet from an outside chart library and carves out nothing for licence, and the research found no reason to amend it |
| D2 | The twenty templates stay one self-contained file each. No build step, no charting library, no web font, no remote resource and no runtime fetch |
| D3 | Determinism survives. Two renders of one file agree, which binds the motion phase to a settled final state and bans any handler that reads the clock or a random source |
| D4 | The four operator decisions in section 6 of the synthesis are decisions, not assumptions. Line weight and glow, the dark theme, a multi-hue series and the composed form each get a recorded disposition before the work that depends on them ships |
| D5 | The operator answered on 2026-09-03 that phase 001 is the only pause. Its render comparison is shown and answered, then phases 002 through 007 run without further prompts, each committed and pushed as it validates |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-visual-proof-and-forks | `001-visual-proof-and-forks/goal.md` |
| 002-chrome-rollout | `002-chrome-rollout/goal.md` |
| 003-motion-layer | `003-motion-layer/goal.md` |
| 004-interaction-layer | `004-interaction-layer/goal.md` |
| 005-dark-theme | `005-dark-theme/goal.md` |
| 006-catalog-and-contract | `006-catalog-and-contract/goal.md` |
| 007-composed-form-and-closeout | `007-composed-form-and-closeout/goal.md` |

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

- [ ] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` with `Summary: errors: 0`
- [ ] `validate.sh specs/sk-doc/051-sk-create-chart/009-chart-visual-overhaul --strict --recursive` prints `RESULT: PASSED` for all eight folders
- [ ] All seven phase folders carry an `acceptance-criteria.md` whose closure statement reads `Closeable: Yes`
- [ ] Line weight, glow, the dark theme, a multi-hue series and the composed form each carry an Accepted or Rejected ADR, and none is left Proposed
- [ ] Every animating template renders twice to the same settled DOM, and the comparison is recorded per file
- [ ] `grep -rn 'toLocaleString' .opencode/skills/sk-doc/sk-create-chart/assets/` returns no match
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
| 001 visual proof and forks | Done | `001-visual-proof-and-forks/goal.md` |
| 002 chrome rollout | Done | `002-chrome-rollout/goal.md` |
| 003 motion layer | Done | `003-motion-layer/goal.md` |
| 004 interaction layer | Done | Phase map row in `spec.md` |
| 005 dark theme | Done | Phase map row in `spec.md` |
| 006 catalog and contract | Done | Phase map row in `spec.md` |
| 007 composed form and closeout | Done | Phase map row in `spec.md` |

### Deviations and findings

| Item | Note |
|------|------|
| The parent was authored before phases 004 through 007 existed on disk | The phase map and this binding table name all seven so the parent is complete. Parent metadata needs one reconciliation pass once every child folder exists |
| Phase 001 stops rather than choosing | The weight and glow fork is a question of taste that neither lineage could settle from reading source, so the phase renders both sides and waits |
<!-- /ANCHOR:log -->
