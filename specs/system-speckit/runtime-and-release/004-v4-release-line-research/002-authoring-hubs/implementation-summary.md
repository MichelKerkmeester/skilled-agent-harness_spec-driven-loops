---
title: "Implementation Summary"
description: "Forced-depth deep research of the authoring-hubs cluster across the v4 release line: iteration count, executor, coverage of release against finding type, and the strongest verified findings."
trigger_phrases:
  - "authoring hubs implementation summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/002-authoring-hubs"
    last_updated_at: "2026-11-08T22:34:13Z"
    last_updated_by: "orchestrator-a"
    recent_action: "Run closed after checkpoint 1 cleared; research.md synthesized"
    next_safe_action: "Parent synthesis reads research/research.md"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-state.jsonl"
    session_dedup:
      fingerprint: "sha256:7242319faaecc45a633753f1df93ce6d6ebf71b509f3cf7db82db6ecbc69533a"
      session_id: "002-authoring-hubs-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-authoring-hubs |
| **Completed** | 2026-11-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase ran a forced-depth research loop over the four authoring hubs: 11 state rows, 10 productive iterations after one Devin quota failure, 48 surviving findings. The strongest is that the skill validator stops at the first frontmatter error, so link and routing checks never run on a broken skill.

### Phase 2: authoring-hubs

The loop read each v4 release that touched this cluster against the code and docs it shipped, and logged findings in seven types. You get a ranked list in `research/research.md` that a remediation packet can pick up without re-reading the releases.

### Coverage: release against finding type

Counts come from the `findingType` and `release` fields of the finding rows in `research/deltas/`. A dot means no finding of that type was logged for that release. 3 of 49 finding rows carried no parsable type or release and are not counted.

| Release | Drift | Misalign | Bug | Improve | UX | Over-eng | Extension |
|---------|-------|----------|-----|---------|----|----------|-----------|
| pre-v4.0.0.0 | 7 | . | 6 | 2 | . | . | . |
| v4.0.0.0 | 2 | 1 | 1 | 1 | 1 | 2 | . |
| v4.0.0.1 | . | . | . | . | 1 | . | . |
| v4.0.0.2 | 2 | . | . | . | . | . | . |
| v4.0.0.3 | . | 1 | . | 1 | . | . | . |
| v4.0.0.4-.10 | . | . | 1 | . | 1 | . | . |
| v4.0.0.11 | 1 | 2 | 1 | . | . | . | . |
| v4.0.0.12 | . | . | . | . | . | 1 | . |
| v4.0.0.13 | 1 | . | . | . | . | . | . |
| v4.0.0.14 | . | . | . | . | 1 | . | . |
| v4.0.0.15 | . | . | . | . | . | . | 1 |
| v4.0.0.16 | . | . | . | . | 1 | . | . |
| v4.0.1.0 | 4 | . | . | . | 1 | . | . |
| v4.0.2.0 | . | . | . | . | . | . | 2 |

### Strongest Findings

| # | Finding | Type | Severity | Release | Source | Orchestrator check |
|---|---------|------|----------|---------|--------|--------------------|
| 1 | validate_skill_package.py prints only the first frontmatter error and never reaches reference checks, so a dangling link in a skill is never reported | bug | P1 | pre-v4.0.0.0 | `.skilled/skills/sk-doc/scripts/validate_skill_package.py:202` | Orchestrator probe on a /tmp skill with a missing allowed-tools field and a link to references/missing-file.md: one error printed, the link never mentioned |
| 2 | sk-doc leaf-manifest.json lists sk-create-quality-control leaves that do not exist under that packet; they live in sk-doc/shared/ | bug | P1 | v4.0.0.0 | `.skilled/skills/sk-doc/leaf-manifest.json:125` | test -e: missing under the packet, present under shared/references |
| 3 | The v4.0.0.16 note tells operators to run /doctor:sk-code quality then --apply, but the quality route accepts only --dry-run | drift | P2 | v4.0.0.16 | `.skilled/changelog/skilled/v4.0.0.16.md:338` | grep of the note and _routes.yaml allowed_flags for the quality target |
| 4 | The /create command index advertises 21 chart forms while the chart catalog and /design:chart ship 29, and lists chart.md and diagram.md under create/ | drift | P2 | pre-v4.0.0.0 | `.skilled/commands/create/README.txt:50` | Read README.txt:50 and sk-design-chart/SKILL.md:114 |
| 5 | The sk-prompt playbook's File table links ../../manual-testing-playbook.md, which resolves to a file that does not exist | bug | P2 | pre-v4.0.0.0 | `.skilled/skills/sk-prompt/manual-testing-playbook/clear-scoring/forty-of-fifty-threshold.md:82` | ls: sk-prompt/manual-testing-playbook.md missing; the page is manual-testing-playbook/manual-testing-playbook.md |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/` | Created | Run config, ledger-backed state log, strategy, registry, iterations, deltas, prompts and `research.md` |
| `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md` | Modified | Research charter, plan, task state, run decisions and this summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator ran the auto workflow's own commands step by step: lock, render, dispatch through `if_cli_devin`, `verify-iteration.cjs`, the reducer and the graph upsert. Executors used: cli-devin deepseek-v4-1-flash-max (iterations before the switch), cli-pi opencode-go/deepseek-v4.1-flash thinking max (after). After every iteration it read the iteration file and its state record, opened two cited lines, and set the next focus. Recorded iterations, counted from the state log: 11.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Convergence runs as telemetry only, with ten iterations as the floor | The brief asks for forced depth, so a quiet iteration must not end the run early. |
| Steering goes through `research/inbox.jsonl` and the rendered focus, never a hand edit of reducer-owned sections | The reducer rewrites Next Focus every pass, so a hand edit would vanish and break the ownership contract. |
| The artifact directory is not staged with `git add` | The brief forbids changing the index; the operator stages the run when committing it. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iterations recorded in the state log | 11 rows of type `iteration` |
| Depth-bar score at close | 3 of 3 clean at the 10-iteration floor, so no +5 extension: the deltas for iterations 9, 10 and 11 carry no P0 or P1 (P2 5, 6 and 0), with newInfoRatio 0.42, 0.58 and 0.35 |
| Citation checks | Two per iteration, verdicts in `decision-record.md` ADR-005 |
| Strict validation | Summary: Errors: 0  Warnings: 2 / RESULT: PASSED (after save; warnings SOURCE_TAGS from containment quarantine copies and LEVEL_MATCH for decision-record at Level 1) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One model family.** Every iteration ran DeepSeek V4.1 Flash, so judgment findings such as over-engineering carry one lens. Treat them as hypotheses until a second family or a grounding check agrees.
2. **Release attribution is by path-limited diff.** v4.0.0.4 to v4.0.0.10 share one tag commit, so attribution inside that block leans on each note and the commit dates.
<!-- /ANCHOR:limitations -->

---
