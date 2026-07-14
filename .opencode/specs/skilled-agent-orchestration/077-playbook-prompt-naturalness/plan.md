---
title: "Implementation Plan: 094 - naturalize playbook prompt voice"
description: "Two-phase implementation: sk-doc template updates first (orchestrator), then 16 sequential cli-codex dispatches to refactor every playbook's canonical Prompt field per the heuristic."
trigger_phrases:
  - "094 plan"
  - "playbook naturalization plan"
importance_tier: "high"
contextType: "doc-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/077-playbook-prompt-naturalness"
    last_updated_at: "2026-05-07T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md"
    next_safe_action: "Phase A edits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 094 - naturalize playbook prompt voice

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter |
| **Framework** | sk-doc testing-playbook contract |
| **Storage** | `.opencode/skills/sk-doc/` + 16 `.opencode/skills/*/manual_testing_playbook/` |
| **Testing** | `validate_document.py` + structural sweep + prompt-sync audit + @review DQI |

### Overview
Two-phase work: Phase A updates sk-doc templates and creation reference (4 files, orchestrator does directly via Edit). Phase B dispatches cli-codex (gpt-5.5 medium fast) per playbook to refactor the canonical Prompt field per the heuristic. Sequential dispatches per memory rule about CLI parallelism.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Heuristic documented in decision-record.md
- [x] sk-doc audit complete (4 prescriptive surfaces identified)
- [x] Per-playbook inventory complete (16 dirs, ~498 files)
- [x] cli-codex dispatch shape decided (gpt-5.5 medium fast)

### Definition of Done
- [ ] All 4 sk-doc files updated and validate clean
- [ ] All 16 playbook root files validate clean
- [ ] Prompt-sync audit returns 0 mismatches across ~498 per-feature files
- [ ] RCAF retention rate falls in 15-40% band (target ~28%)
- [ ] @review DQI clean on sk-code-review + sk-git playbooks
- [ ] `validate.sh --strict` returns exit 0 for the 094 packet
- [ ] implementation-summary.md filled with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doc-as-code refactor with template-driven generation. cli-codex applies the heuristic per scenario, updates two locations (SCENARIO CONTRACT + 9-col table cell) to maintain prompt-equality, and reports per-playbook conversion counts.

### Key Components
- **Heuristic rubric** (`decision-record.md` ADR-001): the per-scenario classification logic.
- **sk-doc templates** (`manual_testing_playbook_template.md`, `manual_testing_playbook_snippet_template.md`): updated to make RCAF optional in placeholder examples.
- **sk-doc creation reference** (`manual_testing_playbook_creation.md` §5): adds "When to use RCAF vs natural-human" subsection.
- **cli-codex dispatch prompt skeleton** (in tasks.md): self-contained per-playbook prompt that pins the heuristic and instructs dual-location update.
- **Validation harness**: `validate_document.py` per root + orchestrator structural sweep + prompt-sync audit.

### Data Flow
1. Phase A: orchestrator Edits 4 sk-doc files; validates each with `validate_document.py`.
2. Phase B: per-playbook loop:
   - Orchestrator dispatches cli-codex with self-contained prompt (heuristic + target playbook + dual-location rule).
   - cli-codex reads every per-feature file, classifies scenario, rewrites Prompt field if natural-human is more accurate, updates both locations.
   - cli-codex self-validates (validate_document.py + structural sweep + prompt-sync) and returns report.
   - Orchestrator post-validates with same gates + 5-scenario naturalness spot-check + RCAF retention rate check for that playbook.
3. After all 16 dispatches: global validation gates + @review DQI on sk-code-review + sk-git.
4. Continuity save + parent metadata update.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet refactors the prompt voice across the entire playbook ecosystem. Affected producer/consumer surfaces:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| sk-doc snippet template (placeholder for new playbook authoring) | producer of playbook scaffolds | update placeholder examples; preserve scaffold structure | `validate_document.py` clean post-edit |
| sk-doc root template | producer of root-playbook scaffolds | update 4 placeholder lines | `validate_document.py` clean post-edit |
| sk-doc creation reference §5 | policy doc for playbook authoring | add heuristic subsection | `validate_document.py` clean post-edit |
| `/create:testing-playbook` command line 317 | dispatch policy | clarify prompt voice | command file validates |
| 16 existing playbooks | consumers of the old RCAF-default convention | refactor canonical Prompt field per heuristic | `validate_document.py` per root + structural sweep + prompt-sync audit |
| `validate_document.py` script | validator | unchanged (already format-agnostic) | re-runs clean |
| DQI scoring | quality metric | unchanged (no prompt-format rule) | no validator change |

Required inventories:
- Same-class producers: `find .opencode/skill -name "manual_testing_playbook" -type d` returns 16 dirs (verified).
- Consumers of changed prompt patterns: every per-feature `.md` file inside those 16 dirs (~498 files; verified via Phase 1 explore agent).
- Matrix axes: per-scenario classification (orchestrator-as-actor vs human-direct) × per-file dual-location update.
- Algorithm invariant: `SCENARIO CONTRACT prompt == 9-col table prompt cell` byte-for-byte (preserved across all changes).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Heuristic ADR authored (decision-record.md ADR-001)
- [x] cli-codex dispatch shape decided (ADR-002)
- [ ] Spec packet docs (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md placeholder, description.json, graph-metadata.json) authored and validate clean
- [ ] Read current state of 4 sk-doc files (lines 67, 79, 313, 333, 395 — placeholder locations)

### Phase 2: Core Implementation

**Phase A — sk-doc foundation (orchestrator):**
- [ ] Edit `manual_testing_playbook_snippet_template.md` line 67 (SCENARIO CONTRACT placeholder)
- [ ] Edit `manual_testing_playbook_snippet_template.md` line 79 (TEST EXECUTION placeholder)
- [ ] Edit `manual_testing_playbook_template.md` line 313 (root scaffold first-category placeholder)
- [ ] Edit `manual_testing_playbook_template.md` line 333 (root scaffold second-category placeholder)
- [ ] Edit `manual_testing_playbook_template.md` line 395 (per-feature scaffold inside root template)
- [ ] Add "When to use RCAF vs natural-human" subsection to `manual_testing_playbook_creation.md` §5
- [ ] Update `/create:testing-playbook` line 317 to clarify both prompt voices
- [ ] Validate sk-doc package: `validate_document.py` clean on each modified file

**Phase B — Per-playbook cli-codex dispatch (sequential):**
- [ ] B.1 Easy wins: sk-code, sk-doc, sk-prompt, mcp-coco-index, mcp-code-mode, mcp-chrome-devtools (6 dispatches)
- [ ] B.2 sk-/deep-: sk-code-review, sk-git, deep-research, deep-review, deep-agent-improvement (5 dispatches)
- [ ] B.3 cli-*: cli-claude-code, cli-codex, cli-gemini, cli-opencode (4 dispatches; mostly retain RCAF)
- [ ] B.4 system-spec-kit: 23 per-category dispatches (321 files)

### Phase 3: Verification
- [ ] Per-playbook post-dispatch gates: validate_document.py + structural sweep + prompt-sync + naturalness spot-check + RCAF retention rate
- [ ] Global gates: `validate.sh --strict` on packet 094, all 16 root validations, global prompt-sync sweep, global retention-rate sanity check
- [ ] @review DQI on sk-code-review + sk-git playbooks
- [ ] Author implementation-summary.md with evidence
- [ ] Update graph-metadata.json (094 status complete + track parent children_ids append)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Per-file prompt-equality | bash awk + grep extraction; byte-equality compare |
| Integration | Per-playbook structural sweep | bash glob + grep + structural regex per file |
| Manual | Naturalness sample | orchestrator reads 5 random per playbook, judges human-voice |
| Quality | Global retention rate sanity | grep across all playbooks for `^- (RCAF )?Prompt: \`As ` |
| DQI | sk-code-review + sk-git deep-review | @review agent dispatch with sk-code-review baseline |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex (gpt-5.5 medium fast) | External executor | Green | Halt Phase B; Phase A completable manually |
| sk-doc validator | Internal | Green | Cannot certify quality |
| All 16 playbooks (clean baseline) | Internal | Green | Verified |
| Memory rule "stay on main" | Convention | Followed | Worktree NOT used |
| Memory rule "fast mode must be explicit" | Convention | Followed | `-c service_tier="fast"` passed explicitly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Multiple per-playbook validations fail post-dispatch and cli-codex re-dispatch doesn't recover OR @review DQI surfaces P0 regressions across multiple playbooks.
- **Procedure**: `git checkout HEAD -- .opencode/skills/<playbook>/manual_testing_playbook/` per affected playbook. sk-doc template edits roll back via `git checkout HEAD -- .opencode/skills/sk-doc/`. Spec packet stays as planning artifact even on rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase A (sk-doc) ──► Phase B (per-playbook ×16) ──► Phase 3 (Verify)
                                              │ sequential                     │
                                              └─→ system-spec-kit ×23 ─────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Setup) | None | Phase A |
| Phase A (sk-doc) | Phase 1 | Phase B |
| Phase B.1-B.4 | Phase A (templates updated provide reference) | Phase 3 |
| Phase 3 (Verify) | Phase B complete | Final completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (Setup + scaffold) | Low | 10-15 min |
| Phase A (sk-doc edits) | Low | 15-25 min |
| Phase B.1 (easy wins, 6 playbooks) | Med | 45-75 min wall-clock (cli-codex) |
| Phase B.2 (sk-/deep-, 5 playbooks) | Med | 60-90 min wall-clock |
| Phase B.3 (cli-*, 4 playbooks) | Med | 30-50 min wall-clock |
| Phase B.4 (system-spec-kit, 23 sub-dispatches) | High | 60-90 min wall-clock |
| Phase 3 (Verify + DQI + save) | Low | 20-35 min |
| **Total** | | **3.5-5.5 hours wall-clock** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] On `main` branch (no worktree)
- [ ] No uncommitted changes in target playbook directories before each dispatch
- [ ] Spec packet pre-approved marker in cli-codex prompt
- [ ] cli-codex shape: `--model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast"`

### Rollback Procedure
1. Per-playbook failure: `git checkout HEAD -- .opencode/skills/<playbook>/manual_testing_playbook/`
2. sk-doc template failure: `git checkout HEAD -- .opencode/skills/sk-doc/`
3. Multi-playbook drift: `git restore --staged .opencode/skills/*/manual_testing_playbook/` then `git checkout HEAD -- .opencode/skills/*/manual_testing_playbook/`

### Data Reversal
- **Has data migrations?** No - text-only changes.
- **Reversal procedure**: `git checkout HEAD -- <paths>` and `git commit` to restore prior state.
<!-- /ANCHOR:enhanced-rollback -->
