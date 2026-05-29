---
title: "Feature Specification: deep-agent-improvement model-benchmark mode"
description: "Phase parent: design + research toward adding a model/prompt-framework benchmark mode to the deep-agent-improvement skill."
trigger_phrases:
  - "121-deep-agent-improvement-benchmark-mode"
  - "deep-agent-improvement benchmark mode"
  - "model-benchmark mode phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode"
    last_updated_at: "2026-05-29T12:50:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Remediated all 017 opus findings in phase 018 (17 fixed, 2 accept)"
    next_safe_action: "Remediate the 014 findings in 015 child"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 95
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
| **Handoff Criteria** | 001 design reviewed; 002 deep-research converges with build-ready guidance; a later packet builds the mode |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 120/003 benchmark rig (run a model against fixtures under prompt-framework variants, score, hill-climb) is packet-local and one-off. The deep-agent-improvement skill runs the same loop shape for agent definitions but cannot benchmark models/prompts. We want model/prompt benchmarking to be a first-class, repeatable capability of deep-agent-improvement.

### Purpose
Decide and detail how to add a `model-benchmark` mode to deep-agent-improvement (alongside the existing `agent-improvement` mode), then hand a build-ready design to a follow-on build packet.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Design the mode-selector architecture + the three pluggable seams (phase 001)
- Deep-research the implementation detail with MiniMax M2.7 as the executor (phase 002)
- Build the mode in deep-agent-improvement from the verified 002 build-delta (phase 003)

### Out of Scope
- Moving or changing the 120/003 rig (referenced as the port source)
- New benchmark fixtures/profiles beyond what the mode wiring needs

### Files to Change
Summary of aggregate scope. Per-phase detail lives in child docs.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-mode-selector-design/**` | Authored | 001 | Design spec + ADRs + build plan |
| `002-implementation-deep-research/research/**` | Create | 002 | MiniMax M2.7 deep-research state + `research.md` |
| `003-build-benchmark-mode/**` + `.opencode/skills/deep-agent-improvement/scripts/**` | Create/Modify | 003 | Build plan + the mode implementation (new + modified scripts) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-mode-selector-design/ | Design: mode selector + 3 pluggable seams + ADRs + build plan (Level 3) | Complete |
| 2 | 002-implementation-deep-research/ | Deep-research (MiniMax M2.7) deepening the implementation design — converged, 5 evidence iters | Complete |
| 3 | 003-build-benchmark-mode/ | Build the mode from the 002 research build-delta (loop-host.cjs + dispatch-model.cjs + scorer port + mode-aware records), TST-1 identity gate | Complete |
| 4 | 004-benchmark-mode-remediation/ | Remediate the tri-model review (phase 007) findings: 3 unique P1 fixes (cwd propagation, path-guard boundary, criteria-exec gate + grader clamp) + actionable P2s, with regression tests | Complete |

| 5 | 005-optin-5dim-scorer-and-skill-docs/ | Wire the ported 5-dim scorer as an opt-in run-benchmark scorer (closes review deferral F-P2-1/2) + document the model-benchmark mode in SKILL.md (sk-doc DQI 97) | Complete |

| 6 | 006-deep-loop-empty-archive-dir-fix/ | Maintenance: deep-research init eagerly created `{mode}_archive` (empty dirs); make all 4 deep-loop restart branches archive lazily+guarded + regression tests; sweep existing empties | Complete |

| 7 | 007-benchmark-mode-hardening-review/ | Tri-model deep review (gpt-5.5 + MiniMax M2.7 + Opus 4.8 arbiter) of the 120 MiniMax integration + the 121 benchmark-mode build (correctness/security/traceability/maintainability); CONDITIONAL verdict, findings fed phase 004 | Complete |

| 8 | 008-command-lane-asking/ | Extend `/deep:start-agent-improvement-loop` to ask the use-case lane (improve an agent file vs benchmark a model/prompt) and branch; add model-benchmark workflow YAMLs + a dedicated `/deep:start-model-benchmark-loop` command + gemini mirror + README/advisor registration | Complete |
| 9 | 009-skill-md-two-lane/ | SKILL.md restructure into two co-equal lanes + smart-router MODEL_BENCHMARK intent | Complete |
| 10 | 010-references-assets-lane-reorg/ | Physically separate references/ + assets/ into agent-improvement / model-benchmark / shared lanes + update SKILL literals + graph-metadata | Complete |
| 11 | 011-agent-lane-note/ | Upgrade the agent "Mode awareness" note to "Lane awareness" across all 4 runtime mirrors | Complete |
| 12 | 012-catalog-playbook-advisor-fp25/ | feature_catalog lane legend + playbook note + advisor recompile + F-P2-5 reduce-state mode display + test | Complete |
| 13 | 013-scripts-physical-reorg/ | Move 16 scripts into agent-improvement / model-benchmark / shared subdirs + rewrite all refs + fix __dirname (high-risk, last) | Complete |

| 14 | 014-two-lane-deep-review/ | 10-iteration deep review (cli-codex gpt-5.5 + Opus 4.8 adjudication) of the two-lane program; CONDITIONAL verdict; active registry 1 P0 + 16 P1 + 16 P2 | Complete |

| 15 | 015-two-lane-review-remediation/ | Remediate the 014 deep-review findings (1 P0 + 16 P1 + 16 P2) | Complete |

| 16 | 016-script-subfolder-readmes/ | Add code-folder READMEs to every source script subfolder (sk-doc code template) + audit existing | Complete |
| 17 | 017-two-lane-opus-deep-review/ | Second deep review with Opus 4.8 agents (workflow format) cross-checking the post-015 two-lane code | Complete |
| 18 | 018-opus-review-remediation/ | Remediate the 017 Opus deep-review findings (4 P1 + 13 P2): materializer fixture-id guard, bundle-gate criteria-exec gate, dead Mode-4 anchors, executable Lane B benchmark-mode promotion + doc truth, with regression tests and per-finding dispositions (Level 3) | Complete |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-mode-selector-design | 002-implementation-deep-research | Design ADRs + build plan authored | strict validate on 001 |
| 002-implementation-deep-research | 003-build-benchmark-mode | Research converged with a verified, build-ready delta | strict validate on 002 + ground-truth verification |
| 003-build-benchmark-mode | 004-benchmark-mode-remediation | Build shipped + tri-model review (phase 007) surfaced findings | review-report.md CONDITIONAL verdict |
| 004-benchmark-mode-remediation | 005-optin-5dim-scorer-and-skill-docs | Remediation closed; the substantive deferral (5-dim scorer not wired) warranted a follow-on | review-report §11 + 004 dispositions |
| 007-benchmark-mode-hardening-review | 008-command-lane-asking | Two-lane UX gap identified: no command asks the use-case lane and the mode is a bolt-on | strict validate on 008 + CMD-1 behavioral identity |
| 008-command-lane-asking | 009-skill-md-two-lane | Command layer shipped; SKILL.md must catch up to two co-equal lanes | DQI excellent + validate strict on 009 |
| 010-references-assets-lane-reorg | 011-agent-lane-note | references/assets lane split shipped; agent note must catch up to Lane awareness | strict validate on 011 + 4-mirror parity check |
| 011-agent-lane-note | 012-catalog-playbook-advisor-fp25 | Agent Lane note shipped across 4 mirrors; remaining catalog/playbook/advisor surfaces follow | strict validate on 012 + advisor recompile + F-P2-5 test |
| 010-references-assets-lane-reorg | 013-scripts-physical-reorg | references and assets lane split shipped, so the scripts physical reorg can follow on the same lane layout | strict validate on 010 + SKILL literal sweep returns zero stale paths |
| 012-catalog-playbook-advisor-fp25 | 013-scripts-physical-reorg | Doc/catalog/advisor lane surfaces shipped; the scripts tree is the last on-disk surface still flat | strict validate on 012 + script lane subdirs hold all 16 movers + test suite green |
| 013-scripts-physical-reorg | 014-two-lane-deep-review | Scripts lane reorg shipped; the full two-lane program (008-013) is reviewable as one unit | strict validate on 013 + vitest 133/133 + both-lane smokes |
| 014-two-lane-deep-review | 015-two-lane-review-remediation | Deep review returned CONDITIONAL with a confirmed P0 plus a P1/P2 cluster; remediation must close them before Lane B ships | review-report.md CONDITIONAL verdict + all-findings.jsonl |
| 015-two-lane-review-remediation | 016-script-subfolder-readmes | Lane reorg shipped and stable; lane subfolders still lack local code-folder READMEs | strict validate on 016 + README in every source script subfolder |
| 016-script-subfolder-readmes | 017-two-lane-opus-deep-review | 014 (gpt-5.5) review + 015 remediation shipped; an independent Opus 4.8 second opinion must confirm the fixes hold and hunt new issues | review-report.md verdict + all-findings.jsonl |
| 017-two-lane-opus-deep-review | 018-opus-review-remediation | Opus deep review returned CONDITIONAL with 4 active P1 plus 13 P2; remediation must close them with one disposition each | review-report.md CONDITIONAL verdict + strict validate on 018 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Can MiniMax M2.7 reliably drive a deep-research loop (dogfood signal from phase 002)?
- After 002, is the design build-ready, or does it need another research pass before the build packet opens?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
