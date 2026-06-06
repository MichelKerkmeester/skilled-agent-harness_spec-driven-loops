---
title: "Implementation Plan: cli-devin skill — Devin CLI peer executor"
description: "Mirror the cli-* family contract for the Devin for Terminal CLI. New skill at .opencode/skills/cli-devin/ with 12 new files + 4 sibling graph-metadata.json updates. Additive-only; no behavior change to existing siblings."
trigger_phrases:
  - "cli-devin"
  - "devin cli implementation"
  - "devin skill plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/104-cli-devin-creation"
    last_updated_at: "2026-05-15T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author plan"
    next_safe_action: "Author tasks and checklist"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-codex/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "104-cli-devin-init"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Implementation Plan: cli-devin skill — Devin CLI peer executor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2 | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (skill body) + JSON (graph-metadata) |
| **Framework** | OpenCode skill contract (cli-* family pattern v1.x) |
| **Storage** | Filesystem (`.opencode/skills/cli-devin/` directory) |
| **Testing** | strict-validate.sh, manual review, optional skill-advisor confidence check |

### Overview
Author a fifth `cli-*` family skill (`cli-devin`) that wraps Cognition's "Devin for Terminal" Rust CLI as a peer executor for cross-AI delegation. The implementation is template-mirroring work — content authoring informed by the existing four siblings, with Devin-unique additions for cloud handoff, permission modes, and the four-model preset (SWE-1.6 default + DeepSeek v4 Pro primary for complex + GLM 5.1 and Kimi k2.6 as complex-task fallbacks).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec.md drafted with REQs and SCs
- [x] Family contract reverse-engineered from the four siblings' SKILL.md / README.md / references/* shapes
- [x] Devin CLI surface enumerated (12 top-level commands, 12 slash commands, 3 permission modes, 4 model presets, install + auth pattern)
- [x] Operator policy noted: stay on `main`, no feature branch (memory `feedback_stay_on_main_no_feature_branches.md`)

### Definition of Done
- [ ] All 12 new files created at `.opencode/skills/cli-devin/`
- [ ] 4 sibling `graph-metadata.json` files updated symmetrically
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/104-cli-devin-creation --strict` exits 0
- [ ] All P0 checklist items marked `[x]` with evidence
- [ ] `implementation-summary.md` populated post-implementation
- [ ] `generate-context.js` run to refresh graph-metadata + indexed canonical doc
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
**Family-mirror with capability extension.** The cli-devin skill IS-A cli-* family member (inherits the 8-section SKILL.md contract, 9-section README contract, 4 universal reference files, 2 universal asset files) and ADDS-A Devin-unique surface (`cloud_handoff.md` reference, three permission modes, the four-model preset, cloud-handoff narrative).

### Key Components

- **SKILL.md** (entry point): smart router with INTENT_SIGNALS dictionary, self-invocation guard, Default Invocation block, 8 family sections.
- **README.md** (documentation): TOC + Overview / Quick Start / Features / Structure / Configuration / Usage Examples / Troubleshooting / FAQ / Related Documents.
- **references/cli_reference.md**: command/flag/slash-command reference — the durable surface map for Devin CLI v0.x (the version mounted at `cli.devin.ai/install.sh` as of 2026-05-15).
- **references/integration_patterns.md**: 3+ use cases mirroring cli-opencode's pattern catalog — external dispatch (cli-X → cli-devin), cross-AI handback, cloud-handoff initiation.
- **references/agent_delegation.md**: Devin doesn't expose `--agent <slug>` like OpenCode; the analog is `devin rules` + `devin skills` + the model-preset choice. Document the orchestration model as: calling AI selects (model, permission-mode, prompt-file) instead of (agent-slug).
- **references/devin_tools.md**: capability comparison table mirroring `codex_tools.md` / `opencode_tools.md` shape — "How Devin Compares" + per-feature deep-dive.
- **references/cloud_handoff.md** (Devin-only): the load-bearing differentiator — when, why, how, who confirms, integration of returned PR.
- **assets/prompt_quality_card.md**: CLEAR card; can stub-with-pointer to a shared template if one exists, otherwise mirror the cli-codex card 1:1.
- **assets/prompt_templates.md**: 5+ copy-paste templates per REQ-012.
- **graph-metadata.json**: skill-id, family (cli), siblings → all 4 existing cli-* peers, intent-signals.

### Data Flow

```
Calling AI (in cli-claude-code / cli-codex / cli-gemini / cli-opencode session)
  |
  |-- Detects task suited to Devin (intent signals from cli-devin SKILL.md §2)
  |-- Loads cli-devin/SKILL.md
  |-- Runs Self-Invocation Guard (refuses if calling AI IS already a `devin` session)
  |-- Runs Provider Auth Pre-Flight: `devin auth status`
  |-- Composes prompt + flags from SKILL.md §3 Default Invocation
  |
  v
Bash: devin --prompt-file <path> --model <id> --permission-mode normal "<seed>"
  |
  |-- devin runs locally OR initiates cloud handoff (operator-confirmed)
  |-- Returns output / exit code / (cloud case: PR URL)
  |
  v
Calling AI parses output, validates, integrates per Integration Patterns
  |
  |-- If memory_handback signaled: run shared 7-step protocol (system-spec-kit/references/cli/memory_handback.md)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Skill Body (SKILL.md + README.md)
- [ ] Author `.opencode/skills/cli-devin/SKILL.md` with all 8 family sections populated for Devin (~400 LOC)
- [ ] Author `.opencode/skills/cli-devin/README.md` with the 9-section TOC + content (~400 LOC)
- [ ] Author `.opencode/skills/cli-devin/graph-metadata.json` with siblings + intent signals

### Phase 2: References (5 files)
- [ ] `references/cli_reference.md` — Devin command/flag/slash-command surface, mirror shape of `cli-codex/references/cli_reference.md`
- [ ] `references/integration_patterns.md` — 3 use cases, mirror shape of `cli-opencode/references/integration_patterns.md`
- [ ] `references/agent_delegation.md` — Devin's (model, permission-mode, prompt-file) routing analog
- [ ] `references/devin_tools.md` — capability comparison table
- [ ] `references/cloud_handoff.md` — Devin-unique handoff narrative (≥100 LOC per REQ-006)

### Phase 3: Assets + Changelog + Playbook
- [ ] `assets/prompt_quality_card.md` — CLEAR card (mirror cli-codex)
- [ ] `assets/prompt_templates.md` — 5+ templates per REQ-012
- [ ] `changelog/v1.0.0.0.md` — per-version release notes (cli-codex prose style)
- [ ] `manual_testing_playbook/manual_testing_playbook.md` — root playbook with 17 sections, 25 scenarios across 9 categories (matches family canonical shape)
- [ ] `manual_testing_playbook/NN--<category>/*.md` — 25 per-feature scenario files using the canonical 5-section structure

### Phase 4: Sibling Symmetry
- [ ] Update `.opencode/skills/cli-claude-code/graph-metadata.json` — add cli-devin to `edges.siblings`
- [ ] Update `.opencode/skills/cli-codex/graph-metadata.json` — same
- [ ] Update `.opencode/skills/cli-gemini/graph-metadata.json` — same
- [ ] Update `.opencode/skills/cli-opencode/graph-metadata.json` — same

### Phase 5: Verification
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/104-cli-devin-creation --strict`
- [ ] Verify `grep -c '^## ' .opencode/skills/cli-devin/SKILL.md` returns 8
- [ ] Verify sibling edges with `jq '.edges.siblings[].target' .opencode/skills/cli-*/graph-metadata.json | grep -c cli-devin` returns 4
- [ ] Fill `implementation-summary.md`
- [ ] Run `generate-context.js` to refresh graph-metadata + indexed doc
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static validation | Spec docs (level/anchors/placeholders) | `validate.sh --strict` |
| Structural parity | SKILL.md sections, dir contract | `grep`, `ls`, `wc -l` |
| Edge symmetry | siblings[] in graph-metadata.json | `jq` |
| Skill-advisor lookup (P2) | `delegate to devin` → cli-devin | `skill_advisor.py "delegate to devin" --threshold 0.8` |
| Manual review | Content accuracy vs. Devin docs | Eyeball + cite-back to cli.devin.ai/docs |

No unit/integration tests — this is documentation work. The validate.sh strict pass is the closest analog to a test suite.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing 4 cli-* skills (read-only) | Internal | Green | Family contract source; if structure drifts during work, re-extract — no expected drift |
| system-spec-kit templates | Internal | Green | Level 2 spec template source |
| system-spec-kit validate.sh | Internal | Green | Verification gate; if validator misbehaves on the new spec folder, debug via `--verbose --quiet` cross-run |
| Devin CLI documentation (cli.devin.ai/docs) | External | Green | Reference content source; URLs verified 2026-05-15 |
| generate-context.js | Internal | Green | Step 13 of /speckit:complete; refreshes graph-metadata and indexed doc |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Strict validation fails AND fix attempt would exceed scope; OR sibling graph-metadata.json updates corrupt skill-advisor lookups.
- **Procedure**: `git status` → identify files added under `.opencode/skills/cli-devin/` and modifications to sibling `graph-metadata.json` files → `git restore .opencode/skills/cli-*/graph-metadata.json` for siblings; `rm -rf .opencode/skills/cli-devin/` for the new bundle (per memory: physical rm, no archive). Spec folder docs stay (recorded work product).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Skill body) ──────┐
                           ├──► Phase 2 (References) ──► Phase 3 (Assets) ──┐
Phase 4 (Sibling symmetry) ─┘                                                ├──► Phase 5 (Verify)
                                                                             │
(Phase 4 can run in parallel with Phases 2-3 — independent files)            │
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 5 |
| Phase 2 | Phase 1 (SKILL.md must define which references exist) | Phase 5 |
| Phase 3 | Phase 1 | Phase 5 |
| Phase 4 | None (independent) | Phase 5 |
| Phase 5 | Phases 1–4 | (terminal) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 — Skill body | Med | 30–45 min (concurrent write) |
| Phase 2 — References (5 files) | Med | 45–60 min |
| Phase 3 — Assets + changelog + playbook | Low | 15–25 min |
| Phase 4 — Sibling symmetry (4 jq edits) | Low | 5–10 min |
| Phase 5 — Verification + summary + save | Low | 10–15 min |
| **Total** | | **~2 hours wall-clock** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Author on main (no feature branch) per operator policy
- [x] Spec folder created and Level 2 docs in place
- [ ] All P0 checklist items verified before claiming completion
- [ ] Sibling graph-metadata edits applied via `jq` not freehand JSON (avoid format drift)

### Rollback Procedure
1. `rm -rf .opencode/skills/cli-devin/` — physical delete per operator policy (no archive)
2. `git restore .opencode/skills/cli-claude-code/graph-metadata.json .opencode/skills/cli-codex/graph-metadata.json .opencode/skills/cli-gemini/graph-metadata.json .opencode/skills/cli-opencode/graph-metadata.json` — revert sibling edge additions
3. Verify revert with `git status` and `jq '.edges.siblings[]' .opencode/skills/cli-*/graph-metadata.json | grep -c cli-devin` returning 0
4. Update spec-folder `implementation-summary.md` with rollback record; mark spec status `Rolled Back`

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — pure file-based skill authoring
<!-- /ANCHOR:enhanced-rollback -->
