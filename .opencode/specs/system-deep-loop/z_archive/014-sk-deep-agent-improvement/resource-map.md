---
title: "Resource Map: sk-improve-agent → deep-agent-improvement Rename"
description: "Exhaustive file-by-file inventory of every reference site requiring update for the sk-improve-agent → deep-agent-improvement rename. Captures skill internals, system-spec-kit advisor (CRITICAL), cross-skill metadata, command surfaces in 4 runtimes, agent definitions in 4 runtimes, root docs, install guides, and symlinks. Compiled from two parallel exploration sweeps + 070-sk-deep-rename precedent."
trigger_phrases:
  - "resource map"
  - "rename inventory"
  - "files touched"
  - "sk-improve-agent references"
  - "deep-agent-improvement migration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/079-sk-deep-agent-improvement"
    last_updated_at: "2026-05-06T08:40:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "resource-map authored"
    next_safe_action: "validate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000083"
      session_id: "079-resource-map-author"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

# Resource Map: `sk-improve-agent` → `deep-agent-improvement` Rename

---

<!-- ANCHOR:summary -->
## Summary

- **Total references** (active code, ex-historical record): ~735 across ~96 files
- **Total references** (including historical record + specs/ research artifacts): ~24,793 across ~602 files
- **By category**: Skills=60 files / ~393 refs · Commands=14 files / ~150 refs · Agents=4 files / 4 refs · Documents/Meta=8 files / 11 refs · Scripts=2 files / 2 refs (in renamed skill) · Tests=4 files / ~6 refs (advisor + remediation tests) · Config=8 files / ~150 refs (YAML asset templates + JSON metadata) · Specs=571 files / ~24,127 refs (HISTORICAL — out of scope)
- **Missing on disk**: 0 (all enumerated paths exist; T-026 verifies `.codex/commands/deep/` shape)
- **Scope**: Active-code reference sites for the rename. Historical record (`specs/` research artifacts, past changelog narrative entries) excluded per `spec.md` §3 Out of Scope.
- **Generated**: 2026-05-06T08:40:00Z (compiled from two parallel exploration agent reports + 070-sk-deep-rename precedent)

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
> **Category precedence**: Specs > Config (spec-folder JSON metadata under §Specs); Meta > READMEs (root-level README.md under §Meta); Skills > Documents (markdown inside `.opencode/skills/**` under §Skills); Tests > Scripts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/sk-improve-agent/README.md` | Renamed (folder move) + Updated | OK | New path: `.opencode/skills/deep-agent-improvement/README.md`. 11 refs: frontmatter title (line 2), category tag (line 5), main heading (line 13), description (line 36), comparison table header (line 50), script path examples (lines 101, 104, 107), path refs (lines 209, 306, 314). T-004 |
| `.opencode/skills/README.md` | Updated | OK | 3 refs: line 60 (skill list), line 173 (full skill entry with version), line 210 (directory tree). T-018 |
| `.opencode/install_guides/README.md` | Updated | OK | 2 refs: codebase-agnostic skill list paragraph + 17-skill roster table. T-033 |
| `.opencode/commands/README.txt` | Updated | OK | 2 refs: lines 1, 3 (skill matrix + link). T-021 |
| `.claude/commands/README.txt` | Updated | OK | Mirror of `.opencode/`. T-024 |
| `.gemini/commands/deep/start-agent-improvement-loop.toml` | Updated | OK | Mirror; verify presence. T-025 |
| `.codex/commands/README.txt` | Updated/Verified | OK | Verify presence first; mirror if exists. T-026 |
| `.opencode/skills/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/README.md` | Renamed (folder move) + Analyzed | OK | Inside renamed skill; check for path refs in T-009 |
| `.opencode/skills/sk-improve-agent/test-fixtures/060-stress-test/README.md` | Renamed (folder move) + Updated | OK | Inside renamed skill; CP test fixture; path refs cleaned in T-009 |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

> Long-form markdown artifacts that are not READMEs: install guides, references, manual testing playbooks, feature catalogs, changelogs.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/install_guides/SET-UP - AGENTS.md` | Updated | OK | 1 ref: table row in skills inventory. T-033 |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:commands -->
## 3. Commands

> `.opencode/commands/**` and runtime mirrors. YAML asset templates carry the bulk of references — they invoke skill scripts via inline `node .opencode/skills/sk-improve-agent/scripts/*.cjs` templates.

### `.opencode/` runtime (canonical)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/commands/deep/start-agent-improvement-loop.md` | Updated | OK | 10+ refs: line 238 (Skill matrix), line 246, line 293 (inline node template), plus 7+ body refs. T-020 |
| `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml` | Updated | OK | **CRITICAL — 32 refs**: `skill: sk-improve-agent` field (line 4 area); all asset paths under `.opencode/skills/sk-improve-agent/scripts/` and `.opencode/skills/sk-improve-agent/assets/`; benchmark profile paths; ~20 inline `node` command templates calling skill scripts (improvement-journal, reducer, lineage, mutation-coverage, trade-off-detector). T-022 |
| `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml` | Updated | OK | **CRITICAL — 33 refs**: same shape as auto.yaml plus approval-gate-specific addition. T-023 |

### `.claude/` runtime mirror

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.claude/commands/deep/start-agent-improvement-loop.md` | Updated | OK | 6 refs (mirror with possibly fewer template invocations). T-024 |
| `.claude/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml` | Updated | OK | **CRITICAL — 32 refs**. T-024 |
| `.claude/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml` | Updated | OK | **CRITICAL — 33 refs**. T-024 |

### `.gemini/` runtime mirror

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.gemini/commands/deep/start-agent-improvement-loop.toml` | Updated | OK | 1 ref: line 3 `Primary skill: .opencode/skills/sk-improve-agent/SKILL.md`. T-025 |
| `.gemini/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml` | Updated/Verified | OK | Verify presence; update if exists. T-025 |
| `.gemini/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml` | Updated/Verified | OK | Same. T-025 |

### `.codex/` runtime mirror

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.codex/commands/deep/*` | Updated/Verified | OK | Verify file shape (Codex uses .toml); update found refs. T-026 |
<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:agents -->
## 4. Agents

> 4-runtime mirror set. **Agent name `improve-agent` is NOT renamed** — only the skill-matrix line referencing the skill folder is updated.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/agents/improve-agent.md` | Updated | OK | 1 ref on line 5 (Skill matrix table cell). Agent name unchanged. T-027 |
| `.claude/agents/improve-agent.md` | Updated | OK | 1 ref on line 5. T-028 |
| `.gemini/agents/improve-agent.md` | Updated | OK | 1 ref on line 5. T-029 |
| `.codex/agents/improve-agent.toml` | Updated | OK | 1 ref on line 2 (TOML table cell). T-030 |
<!-- /ANCHOR:agents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

> All `.opencode/skills/**` content. The renamed skill itself + sibling skills with cross-refs + `system-spec-kit` advisor (CRITICAL).

### Renamed skill folder (`sk-improve-agent` → `deep-agent-improvement`)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/sk-improve-agent/` | Renamed | OK | `git mv` → `.opencode/skills/deep-agent-improvement/`. T-001 |
| `.opencode/skills/sk-improve-agent/SKILL.md` | Renamed + Updated | OK | **CRITICAL — 7 refs**: frontmatter `name` (line 2), `triggers[0]` (line 7), HTML keyword comment (line 15), body path refs (lines 221, 298, 312, 351). T-003 |
| `.opencode/skills/sk-improve-agent/graph-metadata.json` | Renamed + Updated | OK | **CRITICAL — 21 refs**: `skill_id` (line 3), `siblings[0].target` (line 11), `derived.trigger_phrases[]` (lines 30-50 area), `derived.key_files[]` (lines 59-69), `derived.entities[].path` (lines 73-136 area). T-005 |
| `.opencode/skills/sk-improve-agent/scripts/run-benchmark.cjs` | Renamed + Updated | OK | **CRITICAL — 1 ref**: line 258 hardcoded `profilesDir`. T-006 |
| `.opencode/skills/sk-improve-agent/scripts/scan-integration.cjs` | Renamed + Updated | OK | 1 ref: line 2 file header comment. T-006 |
| `.opencode/skills/sk-improve-agent/scripts/{benchmark-stability,candidate-lineage,check-mirror-drift,generate-profile,improvement-journal,materialize-benchmark-fixtures,mutation-coverage,promote-candidate,reduce-state,rollback-candidate,score-candidate,trade-off-detector}.cjs` | Renamed | OK | 12 scripts; no internal refs to skill name; folder move only |
| `.opencode/skills/sk-improve-agent/scripts/tests/{benchmark-stability,candidate-lineage,improvement-journal,mutation-coverage,trade-off-detector}.vitest.ts` | Renamed | OK | 5 vitest files; no direct skill-name refs (use relative paths) |
| `.opencode/skills/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/{agent-improvement-state.jsonl,benchmark-results.json,candidate-lineage.json,improvement-journal.jsonl,improvement_config.json,mutation-coverage.json,trade-off-trajectory.json}` | Renamed + Analyzed | OK | Spot-check for skill-name path refs in T-009 |
| `.opencode/skills/sk-improve-agent/assets/target_manifest.jsonc` | Renamed + Updated | OK | 6 refs: lines 2, 16, 21, 25 (path refs + comments). T-007 |
| `.opencode/skills/sk-improve-agent/assets/improvement_config.json` | Renamed + Updated | OK | 2 refs: lines 33-34. T-007 |
| `.opencode/skills/sk-improve-agent/assets/improvement_config_reference.md` | Renamed + Updated | OK | Documentation refs; check via T-009 |
| `.opencode/skills/sk-improve-agent/assets/improvement_charter.md` | Renamed + Analyzed | OK | No hardcoded paths per agent report |
| `.opencode/skills/sk-improve-agent/assets/improvement_strategy.md` | Renamed + Updated | OK | Possible documentation refs; T-009 |
| `.opencode/skills/sk-improve-agent/assets/benchmark-fixtures/{fixture-baseline,fixture-edge,fixture-improved}.json` | Renamed | OK | Folder move only |
| `.opencode/skills/sk-improve-agent/assets/benchmark-profiles/default.json` | Renamed + Updated | OK | 3 path refs in profile config. T-007 |
| `.opencode/skills/sk-improve-agent/changelog/v1.0.0.0.md` | Renamed + Updated (paths only) | OK | 10 refs (historical narrative untouched; only path strings updated). T-008 |
| `.opencode/skills/sk-improve-agent/changelog/v1.0.1.0.md` | Renamed + Updated (paths only) | OK | T-008 |
| `.opencode/skills/sk-improve-agent/changelog/v1.1.0.0.md` | Renamed + Updated (paths only) | OK | 25 refs. T-008 |
| `.opencode/skills/sk-improve-agent/changelog/v1.2.0.0.md` | Renamed + Updated (paths only) | OK | 12 refs. T-008 |
| `.opencode/skills/sk-improve-agent/changelog/v1.2.1.0.md` | Renamed + Updated (paths only) | OK | T-008 |
| `.opencode/skills/sk-improve-agent/changelog/v1.2.2.0.md` | Renamed + Updated (paths only) | OK | T-008 |
| `.opencode/skills/sk-improve-agent/changelog/v1.3.0.0.md` | Created | PLANNED | New entry documenting the rename, citing 070 precedent + migration notes. T-008 |
| `.opencode/skills/sk-improve-agent/feature_catalog/feature_catalog.md` | Renamed + Updated | OK | Path refs. T-009 |
| `.opencode/skills/sk-improve-agent/feature_catalog/01--evaluation-loop/{01-initialization,02-candidate-generation,03-scoring-dispatch,04-promotion-gates,05-rollback,06-plateau-detection}.md` | Renamed + Updated | OK | 6 files; ~15 path refs. T-009 |
| `.opencode/skills/sk-improve-agent/feature_catalog/02--integration-scanning/{01-surface-discovery,02-runtime-mirrors,03-command-dispatch}.md` | Renamed + Updated | OK | 3 files. T-009 |
| `.opencode/skills/sk-improve-agent/feature_catalog/03--scoring-system/{01-five-dimension-rubric,02-dynamic-profiling,03-deterministic-scoring,04-dimensional-progress}.md` | Renamed + Updated | OK | 4 files. T-009 |
| `.opencode/skills/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md` | Renamed + Updated | OK | 49 refs (main central reference doc). T-009 |
| `.opencode/skills/sk-improve-agent/manual_testing_playbook/01--integration-scanner/{001..004}*.md` | Renamed + Updated | OK | 4 scenario files; ~12 path refs. T-009 |
| `.opencode/skills/sk-improve-agent/manual_testing_playbook/02--profile-generator/{005..008}*.md` | Renamed + Updated | OK | 4 scenarios. T-009 |
| `.opencode/skills/sk-improve-agent/manual_testing_playbook/03--5d-scorer/{010,012,013}*.md` | Renamed + Updated | OK | 3 scenarios. T-009 |
| `.opencode/skills/sk-improve-agent/manual_testing_playbook/04--benchmark-integration/{014,015}*.md` | Renamed + Updated | OK | 2 scenarios. T-009 |
| `.opencode/skills/sk-improve-agent/manual_testing_playbook/05--reducer-dimensions/{017,018,019}*.md` | Renamed + Updated | OK | 3 scenarios. T-009 |
| `.opencode/skills/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/{020..024}*.md` | Renamed + Updated | OK | 5 scenarios. T-009 |
| `.opencode/skills/sk-improve-agent/manual_testing_playbook/07--runtime-truth/{025..034}*.md` | Renamed + Updated | OK | 10 scenarios. T-009 |
| `.opencode/skills/sk-improve-agent/manual_testing_playbook/08--agent-discipline-stress-tests/{013..018}*.md + setup-cp-sandbox.sh` | Renamed + Updated | OK | 6 scenarios + 1 shell setup. T-009 |
| `.opencode/skills/sk-improve-agent/references/{benchmark_operator_guide,evaluator_contract,integration_scanning,loop_protocol,mirror_drift_policy,no_go_conditions,promotion_rules,quick_reference,rollback_runbook,target_onboarding}.md` | Renamed + Updated | OK | 10 reference docs; 28 refs total. T-009 |
| `.opencode/skills/sk-improve-agent/test-fixtures/060-stress-test/.opencode/agents/cp-improve-target.md` | Renamed + Updated | OK | CP test fixture agent. T-009 |
| `.opencode/skills/sk-improve-agent/test-fixtures/060-stress-test/.claude/agents/cp-improve-target.md` | Renamed + Updated | OK | T-009 |
| `.opencode/skills/sk-improve-agent/test-fixtures/060-stress-test/.codex/agents/cp-improve-target.toml` | Renamed + Updated | OK | T-009 |
| `.opencode/skills/sk-improve-agent/test-fixtures/060-stress-test/.gemini/agents/cp-improve-target.md` | Renamed + Updated | OK | T-009 |
| `.opencode/skills/sk-improve-agent/test-fixtures/060-stress-test/benchmark/sentinel.js` | Renamed + Analyzed | OK | T-009 |
| `.opencode/skills/sk-improve-agent/node_modules/.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/results.json` | Renamed | OK | Vitest cache; no edits required |

### Sister/related skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/sk-improve-prompt/graph-metadata.json` | Updated | OK | 1 ref: line 32 `siblings[].target`. T-017 |
| `.opencode/skills/cli-copilot/manual_testing_playbook/manual_testing_playbook.md` | Updated | OK | 1 ref (historical mention of CP-040..045 stress battery). T-019 |

### system-spec-kit (CRITICAL — load-bearing scoring infrastructure)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Updated | OK | **CRITICAL — 156 refs**: TOKEN_BOOSTS / PHRASE_BOOSTS scoring tables (lines ~1548-1703). T-010 |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | Updated | OK | **CRITICAL — 5 refs**: skill list (line 29), registry key (line 148), dependency weights (lines 161, 182), trigger phrases (line 349). T-011 |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json` | Updated | OK | 1 ref: line 24 sibling target. T-011 |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts` | Updated | OK | **CRITICAL — 1 ref**: line 270 penalty list. T-012 |
| `.opencode/skills/system-spec-kit/changelog/v3.3.0.0.md` | Updated (paths only) | OK | 7 path refs (lines 99, 147-151, 163). Narrative untouched. T-019 |
| `.opencode/skills/system-spec-kit/changelog/v3.4.0.0.md` | Updated (paths only) | OK | 1 path ref: line 171. Narrative untouched. T-019 |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> Spec folder content. The 079 packet itself is created; historical research artifacts in other packets are explicitly out of scope (per `spec.md` §3 Out of Scope).

| Path | Action | Status | Note |
|------|--------|--------|------|
| `specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md` | Created | OK | Level 2 spec authored 2026-05-06 |
| `specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/plan.md` | Created | OK | Architecture + phase deps + rollback. 2026-05-06 |
| `specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/tasks.md` | Created | OK | T-001..T-041. 2026-05-06 |
| `specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/checklist.md` | Created | OK | P0/P1/P2 verification items. 2026-05-06 |
| `specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md` | Created | OK | This file. 2026-05-06 |
| `specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/description.json` | Created | PLANNED | Auto-generated by `generate-context.js` (T-000f) |
| `specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/graph-metadata.json` | Created | PLANNED | Auto-generated by `generate-context.js` (T-000f) |
| `specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md` | Created | PLANNED | Authored post-implementation (T-040) with verification evidence |
| `specs/**` (research artifacts in 059, 060, 070, etc.) | Analyzed (out of scope) | OK | ~571 files, ~24,127 refs to `sk-improve-agent`. **Historical record — not updated** per `spec.md` §3 Out of Scope |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

> Executable scripts outside the renamed skill folder. (In-skill scripts listed under §Skills.)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Cited (validator entrypoint) | OK | Used in T-000g, T-035, T-039 — no edits |
| `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` | Cited (continuity entry) | OK | Used in T-000f, T-041 — no edits |

(Note: `.opencode/skills/sk-improve-agent/scripts/*.cjs` listed under §Skills per category-precedence rule.)
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

> Test files. Includes vitest specs in advisor + remediation suites. (In-skill `*.vitest.ts` files listed under §Skills.)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Updated | OK | 2 refs: lines 315, 343 (test fixture skill IDs + assertion). T-013 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/remediation-008-docs.vitest.ts` | Updated | OK | 1 ref: line 22 (path assertion `sk-improve-agent/feature_catalog/`). T-014 |
| `.opencode/skills/system-spec-kit/mcp_server/dist/skill_advisor/tests/scorer/native-scorer.vitest.js` | Regenerated (build artifact) | OK | Compiled mirror; auto-regenerated by T-015 `npm run build` |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:config -->
## 9. Config

> Machine-readable config. Spec-folder JSON metadata (description.json/graph-metadata.json) belongs under §Specs per precedence rule.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/dist/skill_advisor/lib/scorer/fusion.js` | Regenerated (build artifact) | OK | Compiled mirror of fusion.ts; auto-regenerated by T-015 `npm run build`. Manual edit forbidden — must be rebuilt |
| `.opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite` | Rebuilt | OK | Binary advisor cache; rebuilt by `advisor_rebuild` MCP call (T-016) |

(Note: YAML asset templates in `.opencode/commands/deep/assets/` listed under §Commands per category-precedence — they are command surfaces, not freestanding config.)
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:meta -->
## 10. Meta

> Repository-wide governance artifacts. **Takes precedence over §READMEs** for the root-level `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `README.md` | Updated | OK | 2 refs: line 848 (section header `**sk-improve-agent**`), line 1220 (feature matrix `sk-improve-prompt / sk-improve-agent`). T-031 |
| `AGENTS.md` | Updated | OK | 1 ref: line 324 `@improve-agent` description text mentions `sk-improve-agent`. T-032 |
| `CLAUDE.md` | Updated | OK | 1 ref: line 324 (mirror of AGENTS.md text). T-032 |
| `AGENTS_Barter.md` | Verified (likely Skip) | OK | Symlink to separate Barter repo. Per memory: only canonical + Barter sibling exist. If readlink shows external target, Barter manages its own propagation — skip and document. T-034 |

### Symlinks

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/changelog/sk-improve-agent` | Removed + Renamed | OK | Old: `→ ../skill/sk-improve-agent/changelog`. Action: `rm` then create new symlink `.opencode/changelog/deep-agent-improvement → ../skill/deep-agent-improvement/changelog`. T-002 |
<!-- /ANCHOR:meta -->

---

## Out-of-Scope (historical record)

These are documented for transparency but explicitly NOT updated per `spec.md` §3:

| Category | Approx Count | Reason |
|----------|--------------|--------|
| `specs/skilled-agent-orchestration/z_archive/047-agent-implement-code/research/**` | many | Historical research artifacts |
| `specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/**` | dedicated spec family | Historical record of the 060 packet's improve-agent work |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/**` | precedent packet | Historical precedent — may mention sk-improve-agent in side notes |
| `specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/**` | many | Advisor research artifacts |
| Past skill changelog narrative entries (`v1.0.0.0..v1.2.2.0`) | 93 narrative refs | Factually accurate as written ("v1.0.0.0 created sk-improve-agent…"). Path strings inside those docs are updated; narrative prose is not |
| system-spec-kit changelog narrative `v3.3.0.0.md` (lines 99-103, 163), `v3.4.0.0.md` (line 171 narrative context) | 8 narrative refs | Documents past releases; narrative untouched, path strings updated only |

---

## Critical-File Risk Ranking

For monitoring during cli-copilot dispatch:

1. **`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`** — 156 phrase entries (T-010). Highest blast radius: any miss silently degrades skill routing.
2. **`.opencode/commands/deep/assets/deep_start-agent-improvement-loop_{auto,confirm}.yaml` × 4 runtimes** — 32-33 path templates each × 8 files = ~520 substitutions (T-022/T-023/T-024/T-025/T-026). YAML breakage at runtime is high-impact.
3. **`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json`** — registry key rename + dependency edges (T-011). Affects every advisor query.
4. **`.opencode/skills/sk-improve-agent/graph-metadata.json`** — `skill_id` + 21 path refs (T-005). Advisor consumes this.
5. **`.opencode/skills/sk-improve-agent/scripts/run-benchmark.cjs:258`** — hardcoded `profilesDir` (T-006). Silent failure at runtime if missed.
6. **`.opencode/changelog/sk-improve-agent` symlink** (T-002) — easy to forget; `find -type l -name '*improve-agent*'` catches it.
7. **`fusion.ts:270` + compiled `fusion.js:242`** (T-012/T-015) — penalty list; dist must be rebuilt.

---

## Reference Coverage Verification

Used by Claude post-dispatch (T-036) to confirm completeness:

```bash
# Active-code coverage (must return 0):
grep -rn 'sk-improve-agent' \
  --include='*.md' --include='*.json' --include='*.toml' \
  --include='*.ts' --include='*.js' --include='*.py' \
  --include='*.yaml' --include='*.yml' --include='*.sh' \
  .opencode/ .claude/ .gemini/ .codex/ \
  README.md AGENTS.md CLAUDE.md \
  | grep -v 'specs/' \
  | grep -v 'changelog/v1\.[0-2]\.' \
  | grep -v 'system-spec-kit/changelog/v3\.[34]\.' \
  | wc -l
```

Expected: `0`. Any non-zero output represents an active-code reference site that was missed during cli-copilot dispatch and must be remediated.

---

## Cross-References

- **Specification**: `spec.md` (REQ-001..REQ-017)
- **Plan**: `plan.md` (architecture + phase deps + rollback)
- **Tasks**: `tasks.md` (T-001..T-041)
- **Checklist**: `checklist.md` (P0/P1/P2 with verification commands)
- **Precedent**: `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/resource-map.md`
- **Approved orchestration plan**: `~/.claude/plans/run-spec-kit-complet-auto-on-logical-flame.md`
