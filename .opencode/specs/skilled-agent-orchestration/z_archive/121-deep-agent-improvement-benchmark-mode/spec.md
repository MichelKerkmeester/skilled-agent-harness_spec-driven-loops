---
title: "Feature Specification: deep-agent-improvement model-benchmark mode"
description: "Phase parent (19 phases, complete): a two-arc program — Arc 1 (001-007) designs, deep-researches, builds, and hardens a model-benchmark mode for the deep-agent-improvement skill; Arc 2 (008-018) elevates it to a co-equal lane alongside agent-improvement across command/SKILL/references/assets/agent/scripts, with two independent deep-review -> remediation cycles — plus a doc + changelog closeout (019)."
trigger_phrases:
  - "121-deep-agent-improvement-benchmark-mode"
  - "deep-agent-improvement benchmark mode"
  - "model-benchmark mode phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Closeout 019: one comprehensive v1.9 changelog for 121 + README aligned to two lanes"
    next_safe_action: "None — packet complete (19/19 phases)"
    blockers: []
    key_files:
      - "context-index.md"
      - "timeline.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: deep-agent-improvement model-benchmark mode

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | None (top-level packet in `skilled-agent-orchestration`) |
| **Parent Packet** | `skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode` |
| **Predecessor** | `skilled-agent-orchestration/120-cli-opencode-minimax-optimization` (the rig + model this generalizes) |
| **Successor** | None |
| **Handoff Criteria** | All 19 phases shipped: mode designed (001), researched (002), built (003), hardened by independent review (007) + remediated (004); elevated to a co-equal lane (008-013) and twice reviewed -> remediated (014->015, 017->018), then a doc + changelog closeout (019). No successor. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 120/003 benchmark rig (run a model against fixtures under prompt-framework variants, score, hill-climb) is packet-local and one-off. The deep-agent-improvement skill runs the same loop shape for agent definitions but cannot benchmark models/prompts. We want model/prompt benchmarking to be a first-class, repeatable capability of deep-agent-improvement.

### Purpose
Make model/prompt benchmarking a first-class, repeatable capability of deep-agent-improvement — a `model-benchmark` mode co-equal with the existing `agent-improvement` mode. This packet carried that goal end to end: design and deep-research (001-002), build (003), independent hardening review and remediation (007, 004), then the full two-lane elevation across every surface (008-013) with two review -> remediation cycles (014->015, 017->018).

> **Phase-parent note:** Per the lean-trio policy, the authored control documents at the parent level are this `spec.md` plus two navigation aids — `timeline.md` (phases newest->oldest) and `context-index.md` (arc map, rename history, fold-in provenance). All detailed planning, tasks, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
**Arc 1 — Build the model-benchmark mode (phases 001-007):**
- Design the mode-selector architecture + three pluggable seams (001); MiniMax M2.7 deep-research of the build (002); build the mode from the verified build-delta (003)
- Independent tri-model hardening review (007) and remediation of its findings (004); opt-in 5-dim scorer + SKILL docs (005); deep-loop empty-archive maintenance fix (006)

**Arc 2 — Two co-equal lanes (phases 008-018):**
- Command lane question + dedicated benchmark loop (008); SKILL.md two-lane restructure (009); physical references/assets reorg (010); agent lane note (011); catalog/playbook/advisor lane labels (012); scripts physical reorg (013)
- Two independent deep-review -> remediation cycles — gpt-5.5 (014->015) and Opus 4.8 (017->018) — plus per-subfolder code READMEs (016)

### Out of Scope
- Moving or changing the 120/003 benchmark rig (referenced as the port source)
- New benchmark fixtures/profiles beyond what the mode wiring needs

### Files to Change
Aggregate scope by arc; per-phase detail (plan/tasks/checklist) lives in each child folder.

| Surface | Arc | Phases | Description |
|---------|-----|--------|-------------|
| `001`–`007/**` child docs | Build | 001-007 | Design, research, build, hardening review + remediation, scorer/docs, maintenance |
| `.opencode/skills/deep-agent-improvement/scripts/**` | Build | 003-006 | The model-benchmark mode implementation (loop-host, dispatch-model, scorer port, mode-aware records) + fixes |
| `.opencode/skills/deep-agent-improvement/{SKILL.md,references,assets,scripts}` | Two-lane | 009-013 | Lane restructure + physical references/assets/scripts reorg |
| `.opencode/commands/deep/**` + agent mirrors | Two-lane | 008,011 | `/deep:start-model-benchmark-loop` command + Lane awareness note (4 runtime mirrors) |
| `008`–`018/**` child docs | Two-lane | 008-018 | Command/SKILL/reorg phases + two review -> remediation cycles + READMEs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-design-model-benchmark-mode-selector/ | Design the model-benchmark mode selector, pluggable seams, architecture decisions, and build plan. | Complete |
| 2 | 002-research-model-benchmark-implementation/ | Deep-research the build-ready implementation delta for model-benchmark mode. | Complete |
| 3 | 003-build-model-benchmark-mode-runtime/ | Build the model-benchmark runtime: loop host, model dispatch, scorer port, mode-aware records, and identity gate. | Complete |
| 4 | 004-fix-hardening-findings-for-model-benchmark/ | Fix the hardening-review findings for model-benchmark mode with regression coverage. | Complete |
| 5 | 005-add-opt-in-5dim-scorer-and-skill-docs/ | Add the opt-in 5dim scorer path and model-benchmark skill documentation. | Complete |
| 6 | 006-deep-loop-empty-archive-dir/ | Fix empty archive directory handling for deep-loop restart branches. | Complete |
| 7 | 007-review-model-benchmark-mode-hardening/ | Review model-benchmark mode hardening with tri-model evidence and remediation findings. | Complete |
| 8 | 008-add-model-benchmark-lane-selection-prompts/ | Add lane-selection prompts and the dedicated model-benchmark command workflow. | Complete |
| 9 | 009-restructure-skill-md-two-lane/ | Restructure SKILL.md around co-equal two-lane workflow and routing. | Complete |
| 10 | 010-reorganize-two-lane-references-assets/ | Reorganize references and assets into two-lane workflow folders. | Complete |
| 11 | 011-add-agent-lane-awareness-note/ | Add lane-awareness guidance across all agent mirrors. | Complete |
| 12 | 012-label-catalog-playbook-and-advisor-lanes/ | Label catalog, playbook, and advisor surfaces with two-lane terminology. | Complete |
| 13 | 013-reorganize-script-lane-folders/ | Reorganize scripts into physical lane folders and update runtime references. | Complete |
| 14 | 014-review-two-lane-workflow-implementation/ | Review the two-lane workflow implementation and produce actionable findings. | Complete |
| 15 | 015-fix-deep-review-findings-for-two-lane-code/ | Fix the 014 deep-review findings for two-lane code. | Complete |
| 16 | 016-add-readmes-for-script-subfolders/ | Add code-folder READMEs to every source script subfolder. | Complete |
| 17 | 017-review-two-lane-workflow-with-opus/ | Review the post-fix two-lane workflow implementation with Opus. | Complete |
| 18 | 018-fix-opus-findings-for-two-lane-code/ | Fix the 017 Opus review findings for two-lane code. | Complete |
| 19 | 019-align-skill-docs-and-consolidate-changelog/ | Align skill docs to the two-lane workflow and consolidate the packet changelog. | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-design-model-benchmark-mode-selector | 002-research-model-benchmark-implementation | Design ADRs + build plan authored | strict validate on 001 |
| 002-research-model-benchmark-implementation | 003-build-model-benchmark-mode-runtime | Research converged with a verified, build-ready delta | strict validate on 002 + ground-truth verification |
| 003-build-model-benchmark-mode-runtime | 004-fix-hardening-findings-for-model-benchmark | Build shipped + tri-model review (phase 007) surfaced findings | review-report.md CONDITIONAL verdict |
| 004-fix-hardening-findings-for-model-benchmark | 005-add-opt-in-5dim-scorer-and-skill-docs | Remediation closed; the substantive deferral (5-dim scorer not wired) warranted a follow-on | review-report §11 + 004 dispositions |
| 007-review-model-benchmark-mode-hardening | 008-add-model-benchmark-lane-selection-prompts | Two-lane UX gap identified: no command asks the use-case lane and the mode is a bolt-on | strict validate on 008 + CMD-1 behavioral identity |
| 008-add-model-benchmark-lane-selection-prompts | 009-restructure-skill-md-two-lane | Command layer shipped; SKILL.md must catch up to two co-equal lanes | DQI excellent + validate strict on 009 |
| 010-reorganize-two-lane-references-assets | 011-add-agent-lane-awareness-note | references/assets lane split shipped; agent note must catch up to Lane awareness | strict validate on 011 + 4-mirror parity check |
| 011-add-agent-lane-awareness-note | 012-label-catalog-playbook-and-advisor-lanes | Agent Lane note shipped across 4 mirrors; remaining catalog/playbook/advisor surfaces follow | strict validate on 012 + advisor recompile + F-P2-5 test |
| 010-reorganize-two-lane-references-assets | 013-reorganize-script-lane-folders | references and assets lane split shipped, so the scripts physical reorg can follow on the same lane layout | strict validate on 010 + SKILL literal sweep returns zero stale paths |
| 012-label-catalog-playbook-and-advisor-lanes | 013-reorganize-script-lane-folders | Doc/catalog/advisor lane surfaces shipped; the scripts tree is the last on-disk surface still flat | strict validate on 012 + script lane subdirs hold all 16 movers + test suite green |
| 013-reorganize-script-lane-folders | 014-review-two-lane-workflow-implementation | Scripts lane reorg shipped; the full two-lane program (008-013) is reviewable as one unit | strict validate on 013 + vitest 133/133 + both-lane smokes |
| 014-review-two-lane-workflow-implementation | 015-fix-deep-review-findings-for-two-lane-code | Deep review returned CONDITIONAL with a confirmed P0 plus a P1/P2 cluster; remediation must close them before Lane B ships | review-report.md CONDITIONAL verdict + all-findings.jsonl |
| 015-fix-deep-review-findings-for-two-lane-code | 016-add-readmes-for-script-subfolders | Lane reorg shipped and stable; lane subfolders still lack local code-folder READMEs | strict validate on 016 + README in every source script subfolder |
| 016-add-readmes-for-script-subfolders | 017-review-two-lane-workflow-with-opus | 014 (gpt-5.5) review + 015 remediation shipped; an independent Opus 4.8 second opinion must confirm the fixes hold and hunt new issues | review-report.md verdict + all-findings.jsonl |
| 017-review-two-lane-workflow-with-opus | 018-fix-opus-findings-for-two-lane-code | Opus deep review returned CONDITIONAL with 4 active P1 plus 13 P2; remediation must close them with one disposition each | review-report.md CONDITIONAL verdict + strict validate on 018 |
| 018-fix-opus-findings-for-two-lane-code | 019-align-skill-docs-and-consolidate-changelog | Two-lane program shipped + reviewed/remediated; the skill README and changelog still lagged the post-121 reality | strict validate on 019 + rg "Mode 4" = 0 outside changelog |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

_All resolved — packet complete._

- **Can MiniMax M2.7 reliably drive a deep-research loop?** Yes — phase 002 converged with a build-ready delta (5/7 dispatch hits; misses caught, state uncorrupted).
- **Was the 002 design build-ready, or did it need another pass?** Build-ready — phase 003 built the mode directly from the 002 build-delta and passed the TST-1 byte-identity gate.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
