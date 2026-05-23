---
title: "Implementation Plan: 131/007 — Deep-* Commands Relocation"
description: "Level 3 plan for 6-wave deep-* command asset relocation and cross-reference updates."
trigger_phrases:
  - "131/007 plan"
  - "deep commands relocation plan"
  - "wave 1 asset move"
  - "wave 2 reference update"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/007-deep-commands-relocation"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "deepseek-v4-pro"
    recent_action: "Authored Level 3 plan with 6-wave breakdown."
    next_safe_action: "Proceed to WAVE 1: asset relocation."
---
# Implementation Plan: 131/007 — Deep-* Commands Relocation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML (workflows), TOML (Gemini commands), Markdown (command definitions), Python (skill_advisor), TypeScript (vitest suites) |
| **Commands Moved** | 3 slash-command MD files already at `.opencode/commands/deep/{review,research,ai-council}.md` |
| **Assets to Move** | 6 YAMLs from `spec_kit/assets/` → `deep/assets/`; 2 Gemini TOMLs from `spec_kit/` → `deep/` |
| **References to Update** | ~25 live files + ~5,267 historical spec-docs |
| **Executor** | cli-opencode + `deepseek/deepseek-v4-pro --variant high --pure --format json` (primary), cli-devin SWE-1.6 (fallback) |
| **Wall-Clock Target** | ~75-90 minutes total across 6 waves |

### Overview

Six sequential waves complete the relocation: scaffold the 131/007 packet (WAVE 0), move assets and rename files (WAVE 1), update live operator-facing references (WAVE 2), recompile skill-graph + advisor smoke + vitest sweep (WAVE 3), mass-sed historical spec-docs (WAVE 4), and close with validation (WAVE 5). Each wave has explicit verification gates. The main agent commits per wave to avoid `.git/index.lock` conflicts with the cli-opencode sandbox.

Canonical wave plan: `~/.claude/plans/fix-minor-drift-afterwards-twinkly-melody.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:effort -->
## 1.1 EFFORT ESTIMATE

| Wave | Label | Estimated Effort | Executor |
|------|-------|-----------------|----------|
| WAVE 0 | Scaffold 131/007 packet | 5 min | Native (main agent) |
| WAVE 1 | Asset relocation + command MD updates | 15 min | cli-opencode |
| WAVE 2 | Live operator-facing reference updates | 20 min | cli-opencode |
| WAVE 3 | Skill-graph recompile + advisor smoke + vitest | 10 min | cli-opencode |
| WAVE 4 | Historical spec-doc bulk-sed | 20 min | cli-opencode |
| WAVE 5 | Closure + validate + commit | 5 min | Native (main agent) |
| **Total** | | **~75 min** | |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready (per-wave pre-dispatch)
- [x] Problem statement clear and scope documented (this packet)
- [x] Success criteria measurable (SC-001 through SC-005)
- [x] Dependencies identified (WAVE 3 depends on WAVE 1+2)
- [x] NFRs defined with targets (wall-clock ≤ 90 min, vitest 100% PASS)
- [x] ADR-001 accepted (asset co-location + naming convention)

### Definition of Done (per-wave verification gates)
- [ ] WAVE 0: `validate.sh --strict` PASS on 131/007
- [ ] WAVE 1: `ls .opencode/commands/deep/assets/` shows 6 `deep_*.yaml`; old path returns 0 hits
- [ ] WAVE 2: `rg "/spec_kit:deep-*"` on agent/docs surfaces returns 0 hits
- [ ] WAVE 3: skill-graph compiles clean; advisor smoke resolves correctly; vitest 100% PASS
- [ ] WAVE 4: residual old-path hits ≤ 10
- [ ] WAVE 5: `validate.sh --strict` re-PASS; `git diff --stat` shows only expected scope
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Asset Layout — Before vs After

```text
BEFORE:
  .opencode/commands/deep/           ← 3 MD files already moved
    review.md
    research.md
    ai-council.md
  .opencode/commands/spec_kit/assets/ ← 6 YAMLs still here
    spec_kit_deep-review_auto.yaml
    spec_kit_deep-review_confirm.yaml
    spec_kit_deep-research_auto.yaml
    spec_kit_deep-research_confirm.yaml
    spec_kit_deep-council_auto.yaml
    spec_kit_deep-council_confirm.yaml
  .gemini/commands/spec_kit/          ← 2 TOMLs still here
    deep-review.toml
    deep-research.toml

AFTER:
  .opencode/commands/deep/
    review.md
    research.md
    ai-council.md
    assets/                           ← co-located
      deep_review_auto.yaml
      deep_review_confirm.yaml
      deep_research_auto.yaml
      deep_research_confirm.yaml
      deep_ai-council_auto.yaml
      deep_ai-council_confirm.yaml
  .gemini/commands/deep/
    review.toml                       ← migrated
    research.toml                     ← migrated
    ai-council.toml                   ← authored
```

### Reference Update Map

```text
skill_advisor.py (routing + triggers) ──┐
3 SKILL.md (asset paths) ────────────────┤
12 agent definitions (4 runtimes × 3) ───┼── All use /deep:<skill> slash syntax
3 root docs (CLAUDE/AGENTS/README) ─────┤    and deep/assets/* paths
2 install guides ───────────────────────┤
9 graph-metadata.json ──────────────────┘
```

### Runtime Mirror Relationships

```text
.opencode/commands/deep/          ← canonical source
  ↑ symlink: .codex/commands/     (auto-resolves)
  ↑ mirror:  .claude/commands/deep/ (symlinks or copies)
  
.gemini/commands/deep/            ← independent TOML wrappers
  Uses TOML format, not MD
  Points to .opencode/commands/deep/ MD files
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: WAVE 0 — Scaffold 131/007 Packet
- [ ] Create Level 3 spec folder at `007-deep-commands-relocation/`
- [ ] Author `spec.md` (executive-summary, metadata, problem, scope, requirements, success-criteria, risks, nfr, edge-cases, complexity, risk-matrix, user-stories, questions, related-docs)
- [ ] Author `plan.md` (this file)
- [ ] Author `tasks.md` (per-wave deliverables)
- [ ] Author `checklist.md` (CHK-001..CHK-N with P0/P1/P2)
- [ ] Author `decision-record.md` (ADR-001: asset strategy + naming convention)
- [ ] Author `implementation-summary.md` (placeholder; filled at WAVE 5)
- [ ] Author `description.json` + `graph-metadata.json`
- [ ] Update `131/spec.md` phase-map anchor (add 007 row)
- [ ] Update `131/graph-metadata.json` children_ids (append 007)
- [ ] Run `validate.sh --strict` — must PASS with 0 errors + 0 warnings

### Phase 2: WAVE 1 — Asset Relocation + Command MD Updates
- [ ] Create `commands/deep/assets/` directory
- [ ] Move 6 YAMLs: `commands/spec_kit/assets/spec_kit_deep-{review,research,council}_{auto,confirm}.yaml` → `commands/deep/assets/deep_{review,research,ai-council}_{auto,confirm}.yaml`
- [ ] Rename: `spec_kit_deep-council_*` → `deep_ai-council_*`
- [ ] Update 3 command MD internal asset-path references (replace `spec_kit/assets/spec_kit_deep-*` with `deep/assets/deep_*`)
- [ ] Move 2 Gemini TOMLs: `.gemini/commands/spec_kit/deep-{review,research}.toml` → `.gemini/commands/deep/{review,research}.toml`
- [ ] Author `.gemini/commands/deep/ai-council.toml` using `deep-review.toml` as template
- [ ] Verify symlinks: `.claude/commands/deep/` + `.codex/commands/` resolve correctly
- [ ] Gate: `ls commands/deep/assets/` shows 6 YAMLs; `ls commands/spec_kit/assets/spec_kit_deep-*` returns 0 hits

### Phase 3: WAVE 2 — Live Operator-Facing Reference Updates
- [ ] Update 3 SKILL.md: `deep-review/SKILL.md`, `deep-research/SKILL.md`, `deep-ai-council/SKILL.md` — asset path + slash syntax refs
- [ ] Update `skill_advisor.py` lines 250-265 (routing tables) + 1313-1657 (trigger-phrase scoring) — semantic-review via Edit tool
- [ ] Update 12 agent definitions: `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/` × 3 skills each
- [ ] Update 3 root docs: `CLAUDE.md`, `AGENTS.md`, `README.md`
- [ ] Update 2 install guides: `.opencode/install_guides/`
- [ ] Update 9 `graph-metadata.json` files (skill edges + asset_path arrays)
- [ ] Gate: `rg "/spec_kit:deep-(review|research|council|ai-council)"` on agent/docs surfaces returns 0 hits

### Phase 4: WAVE 3 — Skill-Graph Recompile + Advisor Smoke + Vitest
- [ ] Recompile skill-graph: `skill_graph_compiler.py --export-json --pretty`
- [ ] Advisor smoke: 3 prompts ("deep review packet", "deep research investigation", "deep ai council multi-topic") — each surfaces correct skill
- [ ] Vitest sweep: `vitest run --no-coverage` on 4 suites (deep-loop-runtime tests, deep-ai-council tests, routing-parity-deep-skills, routing-parity-deep-council)
- [ ] Gate: 100% vitest PASS; advisor surface verified

### Phase 5: WAVE 4 — Historical Spec-Doc Bulk-Sed
- [ ] Apply sed patterns in order: `spec_kit_deep-council_` → `deep_ai-council_` → `spec_kit_deep-review_` → `deep_review_` → `spec_kit_deep-research_` → `deep_research_` → path prefixes → slash syntax
- [ ] Scope: `.opencode/specs/**/*.md`, `.opencode/specs/**/*.json`, `.opencode/skills/**/*.md`
- [ ] Exclude: `.git/**`, `z_archive/**`, `changelog/v1.0.0.0.md` and earlier
- [ ] Gate: `rg "/spec_kit:deep-(review|research|council)|spec_kit_deep-"` on docs excluding exclusions returns ≤ 10

### Phase 6: WAVE 5 — Closure
- [ ] Fill `implementation-summary.md` with shipped assets, gate evidence, deviations
- [ ] Run `validate.sh --strict` on 131/007 — must re-PASS
- [ ] Update parent `131/graph-metadata.json` `derived.last_active_child_id`
- [ ] Commit: `feat(131/007): relocate deep-* command assets + cross-repo references`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command |
|-----------|-------|---------|
| File-System | WAVE 1 verification | `ls commands/deep/assets/` + `ls commands/spec_kit/assets/spec_kit_deep-*` |
| Reference Cleanliness | WAVE 2 verification | `rg "/spec_kit:deep-*"` on agent/docs surfaces |
| Skill-Graph | WAVE 3 compilation | `skill_graph_compiler.py --export-json --pretty` |
| Advisor Smoke | WAVE 3 routing | `skill_advisor.py` with 3 prompts |
| Vitest | WAVE 3 regression | `vitest run --no-coverage` on 4 suites |
| Historical Cleanliness | WAVE 4 verification | `rg` with exclusions returning ≤ 10 |
| Spec Validation | WAVE 0 + WAVE 5 | `validate.sh --strict` on 131/007 |
| Scope Drift | WAVE 5 | `git diff --stat` per-wave review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| WAVE 1 file-system state | Sequential | Pending WAVE 1 | WAVE 2-4 cannot verify |
| WAVE 2 reference cleanliness | Sequential | Pending WAVE 2 | WAVE 3 advisor/vitest may fail on old paths |
| `skill_graph_compiler.py` | Tool | Available | Cannot recompile in WAVE 3 |
| `skill_advisor.py` | Tool | Available | Cannot smoke-test routing in WAVE 3 |
| `vitest` in `system-spec-kit/mcp_server/` | Tool | Available | Cannot verify test suites in WAVE 3 |
| cli-opencode availability | Executor | Available | All waves blocked |
| `.claude/commands/deep/` symlinks | Infrastructure | Unknown | May need manual re-creation in WAVE 1 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Per-wave rollback is lightweight because WAVE 1-4 are plain `mv` + `sed` operations:

- **WAVE 1**: `mv` assets back to `spec_kit/assets/`; `mv` Gemini TOMLs back; revert command MD edits
- **WAVE 2**: `git checkout` the ~25 modified files
- **WAVE 3**: No file mutations — only compilation + test runs. No rollback needed.
- **WAVE 4**: `git checkout .opencode/specs/` to revert bulk-sed

Each wave commit is a single, self-contained `git commit`. Reverting the wave = `git revert <wave-commit>`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK PLAN

### Pre-Wave Checklist
- [x] WAVE 0 committed cleanly (scaffold only, no asset changes)
- [ ] WAVE 1 committed; tagged `pre-wave-1` before dispatch
- [ ] WAVE 2 committed; tagged `pre-wave-2` before dispatch
- [ ] WAVE 4 committed; tagged `pre-wave-4` before dispatch

### Per-Wave Rollback
1. Identify wave commit by message (`feat(131/007): WAVE N ...`)
2. `git revert <commit-hash> --no-edit`
3. Verify with wave-specific verification gate
4. If revert conflicts (unlikely; waves are file-disjoint), resolve manually

### Data Reversal
- No database mutations — all changes are file-system only.
- No external state (databases, APIs, caches) affected.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
WAVE 0 (scaffold)
  └── WAVE 1 (asset relocation)
        └── WAVE 2 (reference updates)
              └── WAVE 3 (recompile + smoke)
                    └── WAVE 4 (historical sed, optional but user-confirmed)
                          └── WAVE 5 (closure)

WAVE 3 depends on WAVE 1+2 completing cleanly.
WAVE 4 depends on WAVE 3 passing (ensures live surfaces are clean before historical sweep).
WAVE 5 depends on all 4 preceding waves.
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
131/006 (differentiation) → 131/007 (relocation)
                              ├── WAVE 0: scaffold (this packet)
                              ├── WAVE 1: move 6 YAMLs, 2 TOMLs, author 1 TOML
                              ├── WAVE 2: update 25 live refs
                              ├── WAVE 3: recompile graph, advisor smoke, vitest
                              ├── WAVE 4: sed ~6,067 historical refs
                              └── WAVE 5: validate + close
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The critical path is WAVE 1 → WAVE 2 → WAVE 3 (must run sequentially and all pass before WAVE 4-5).

- **WAVE 1** (15 min) — CRITICAL: asset moves enable all subsequent reference updates
- **WAVE 2** (20 min) — CRITICAL: 25 live ref updates; largest surface area, highest risk of missed edge cases
- **WAVE 3** (10 min) — CRITICAL: verification gate proving waves 1-2 didn't break skill routing or tests

**Total Critical Path**: ~45 min

**Parallel Opportunities**: WAVE 4 (historical sed) is independent of live-surface correctness — could theoretically run in parallel with WAVE 3. However, the cli-* memory rule (one dispatch at a time) precludes this.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Criteria | Target |
|-----------|---------------|--------|
| M1 | WAVE 0 complete: strict-validate PASS on 131/007 | Session start + 5 min |
| M2 | WAVE 1 complete: assets at new paths, old paths empty | M1 + 15 min |
| M3 | WAVE 2 complete: 0 live old-path refs on operator surfaces | M2 + 20 min |
| M4 | WAVE 3 complete: graph compiles, advisor correct, vitest 100% PASS | M3 + 10 min |
| M5 | WAVE 4 complete: ≤ 10 residual historical refs | M4 + 20 min |
| M6 | WAVE 5 complete: validate re-PASS, closure commit | M5 + 5 min |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:adr -->
## L3: ARCHITECTURE DECISION SUMMARY

See `decision-record.md` for full ADR:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Co-locate assets in `commands/deep/assets/` with `deep_{skill-slug}_*` naming | Single tree for command + assets; naming consistent with skill registry; preserve historical refs as audit trail; ~5,267 historical refs updated for grep cleanliness |
<!-- /ANCHOR:adr -->
