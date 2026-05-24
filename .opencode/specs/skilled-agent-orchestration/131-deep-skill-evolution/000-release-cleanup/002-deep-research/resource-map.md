---
title: "Resource Map: deep-research skill release cleanup"
description: "Full path catalog of every deep-research skill artifact in audit scope plus this spec folder's own outputs. Per-row Note column reserves the audit_status field populated in phase 2; Phase-5 Augmentation section reserved for novel logic gaps surfaced in phase 5."
trigger_phrases:
  - "deep-research release cleanup resource map"
  - "artifact inventory"
  - "audit scope"
  - "files touched"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/002-deep-research"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-resource-map-authored"
    next_safe_action: "run-strict-validate"
    blockers: []
    key_files:
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002008"
      session_id: "131-000-002-spec-author"
      parent_session_id: "131-000-002-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

# Resource Map

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Use this map alongside `spec.md` and `plan.md` when:
- Phase 2 audit dispatch needs an enumerable target list (every row drives a dispatch).
- Phase 4 alignment validation gate needs a complete artifact inventory to score.
- Phase 5 deep-research iterations need a baseline of "already in scope" so novel gaps are recognizable.
- A future reviewer or downstream packet needs a single-glance blast radius without reading `implementation-summary.md` end-to-end.

Pairs with `implementation-summary.md` — the summary narrates *what and why*; this map lists *which files*. Do not duplicate narrative, decisions, or test evidence here — those belong in `implementation-summary.md`, `decision-record.md`, or `checklist.md`.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: ~100 (90 deep-research artifacts + 11 spec-folder artifacts + a handful of external anchors)
- **By category**: READMEs=2, Documents=15, Skills=83, Specs=11, Scripts=4, Config=2, Meta=1
- **Missing on disk**: 0 at phase 1; updated each phase
- **Scope**: All deep-research skill files under audit in phases 2-4, plus this spec folder's own deliverables, plus a small set of cross-system anchors cited in phase 3 README rewrite
- **Generated**: 2026-05-23T00:00:00Z (phase 1 baseline)

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
> **Note column convention**: `audit_status:{PENDING|PASS|PASS_WITH_DEVIATIONS|FAIL}` populated by phase 2. Phase-4 validation match% appended after audit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-research/README.md` | Updated (phase 3 full rewrite) | OK | audit_status:PASS_WITH_DEVIATIONS; 248 LOC; tone anchor Public/README.md @ ~70%; structural anchor system-spec-kit/README.md |
| `.opencode/skills/deep-research/scripts/README.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 134 LOC; scripts/ subdir README; bug-scan only |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

> External markdown cited as anchors in phase 3 README rewrite or as standards references across phases 2-4. NOT modified.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `Public/README.md` | Cited | OK | Tone anchor (~70% intensity) |
| `.opencode/skills/system-spec-kit/README.md` | Cited | OK | Structural anchor (10-section pattern) |
| `.opencode/skills/sk-doc/references/global/hvr_rules.md` | Cited | OK | HVR rules; pass threshold 85+ |
| `.opencode/skills/sk-doc/references/skill_creation.md` | Cited | OK | Skill creation standards |
| `.opencode/skills/sk-doc/references/readme_creation.md` | Cited | OK | README creation standards |
| `.opencode/skills/sk-doc/references/feature_catalog_creation.md` | Cited | OK | Feature catalog standards |
| `.opencode/skills/sk-doc/references/manual_testing_playbook_creation.md` | Cited | OK | Playbook standards |
| `.opencode/skills/cli-devin/SKILL.md` | Cited | OK | Phase 5 RCAF + medium-density rule (line 192) |
| `.opencode/skills/cli-opencode/SKILL.md` | Cited | OK | Phase 5 deepseek provider routing (line 240) |
| `.opencode/skills/sk-prompt-small-model/SKILL.md` | Cited | OK | Small-model dispatch sentinel |
| `.opencode/skills/sk-prompt/SKILL.md` | Cited | OK | Prompt-composition skill (RCAF/CLEAR) |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

> Every artifact under `.opencode/skills/deep-research/` in audit scope. Per-row `audit_status` populated in phase 2.

### 5.1 SKILL.md (1 file)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-research/SKILL.md` | Updated (version bump only, surgical audit) | OK | audit_status:PASS_WITH_DEVIATIONS; 412 LOC; v1.12.0.0→v1.13.0.0; Smart Router §2 PRESERVED by ADR-004 |

### 5.2 References (6 files, 3526 LOC total)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-research/references/capability_matrix.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 82 LOC; template=skill_reference_template.md |
| `.opencode/skills/deep-research/references/convergence.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 1241 LOC; largest reference |
| `.opencode/skills/deep-research/references/loop_protocol.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 783 LOC |
| `.opencode/skills/deep-research/references/quick_reference.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 221 LOC |
| `.opencode/skills/deep-research/references/spec_check_protocol.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 225 LOC |
| `.opencode/skills/deep-research/references/state_format.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 974 LOC; second-largest |

### 5.3 Assets (5 files, 447 LOC total)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-research/assets/deep_research_strategy.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 109 LOC; template=skill_asset_template.md |
| `.opencode/skills/deep-research/assets/deep_research_dashboard.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 118 LOC |
| `.opencode/skills/deep-research/assets/deep_research_config.json` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 77 LOC; JSON config |
| `.opencode/skills/deep-research/assets/runtime_capabilities.json` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 78 LOC; JSON config |
| `.opencode/skills/deep-research/assets/prompt_pack_iteration.md.tmpl` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 65 LOC; template file |

### 5.4 Feature Catalog (16 files)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-research/feature_catalog/feature_catalog.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 271 LOC; root inventory; template=feature_catalog_template.md |
| `.opencode/skills/deep-research/feature_catalog/01--loop-lifecycle/01-initialization.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 52 LOC |
| `.opencode/skills/deep-research/feature_catalog/01--loop-lifecycle/02-iteration-dispatch.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 51 LOC |
| `.opencode/skills/deep-research/feature_catalog/01--loop-lifecycle/03-convergence-check.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 49 LOC |
| `.opencode/skills/deep-research/feature_catalog/01--loop-lifecycle/04-synthesis.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 49 LOC |
| `.opencode/skills/deep-research/feature_catalog/01--loop-lifecycle/05-memory-save.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 48 LOC |
| `.opencode/skills/deep-research/feature_catalog/01--loop-lifecycle/06-resource-map-emission.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 50 LOC |
| `.opencode/skills/deep-research/feature_catalog/02--state-management/01-jsonl-state-log.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 50 LOC |
| `.opencode/skills/deep-research/feature_catalog/02--state-management/02-strategy-tracking.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 50 LOC |
| `.opencode/skills/deep-research/feature_catalog/02--state-management/03-config-management.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 49 LOC |
| `.opencode/skills/deep-research/feature_catalog/03--convergence/01-three-signal-model.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 48 LOC |
| `.opencode/skills/deep-research/feature_catalog/03--convergence/02-stuck-detection.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 48 LOC |
| `.opencode/skills/deep-research/feature_catalog/03--convergence/03-quality-guards.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 51 LOC |
| `.opencode/skills/deep-research/feature_catalog/03--convergence/04-graph-convergence.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 50 LOC |
| `.opencode/skills/deep-research/feature_catalog/04--research-output/01-progressive-synthesis.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 49 LOC |
| `.opencode/skills/deep-research/feature_catalog/04--research-output/02-negative-knowledge.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 48 LOC |

### 5.5 Manual Testing Playbook (43 files, including 1 shell script)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-research/manual_testing_playbook/manual_testing_playbook.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 593 LOC; root orchestrator; template=manual_testing_playbook_template.md |
| `.opencode/skills/deep-research/manual_testing_playbook/01--entry-points-and-modes/*.md` | Analyzed (3 files) | OK | audit_status:PASS_WITH_DEVIATIONS; 001/002/003; 85-86 LOC each |
| `.opencode/skills/deep-research/manual_testing_playbook/02--initialization-and-state-setup/*.md` | Analyzed (4 files) | OK | audit_status:PASS_WITH_DEVIATIONS; 004/005/006/027; 84-87 LOC each |
| `.opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/*.md` | Analyzed (8 files) | OK | audit_status:PASS_WITH_DEVIATIONS; 007/008/009/010/024/025/028/029; 85-91 LOC each |
| `.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/*.md` | Analyzed (12 files) | OK | audit_status:PASS_WITH_DEVIATIONS; 011/012/013/014/020/021/022/023/029/030/031/032/033; 87-99 LOC each |
| `.opencode/skills/deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/*.md` | Analyzed (4 files) | OK | audit_status:PASS_WITH_DEVIATIONS; 015/016/017/018; 85-87 LOC each |
| `.opencode/skills/deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/*.md` | Analyzed (3 files) | OK | audit_status:PASS_WITH_DEVIATIONS; 019/026/027; 87-101 LOC each |
| `.opencode/skills/deep-research/manual_testing_playbook/07--command-flow-stress-tests/*.md` | Analyzed (6 files) | OK | audit_status:PASS_WITH_DEVIATIONS; 046-051; 111-129 LOC each |
| `.opencode/skills/deep-research/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 87 LOC; shell script; bug-scan only |

### 5.6 Changelog (16 files, +1 added in phase 3)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-research/changelog/v1.1.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 48 LOC; format-only check |
| `.opencode/skills/deep-research/changelog/v1.2.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 52 LOC |
| `.opencode/skills/deep-research/changelog/v1.2.1.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 28 LOC |
| `.opencode/skills/deep-research/changelog/v1.2.2.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 29 LOC |
| `.opencode/skills/deep-research/changelog/v1.3.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 63 LOC |
| `.opencode/skills/deep-research/changelog/v1.4.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 62 LOC |
| `.opencode/skills/deep-research/changelog/v1.5.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 86 LOC |
| `.opencode/skills/deep-research/changelog/v1.6.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 88 LOC |
| `.opencode/skills/deep-research/changelog/v1.6.1.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 97 LOC |
| `.opencode/skills/deep-research/changelog/v1.6.2.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 69 LOC |
| `.opencode/skills/deep-research/changelog/v1.6.3.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 46 LOC |
| `.opencode/skills/deep-research/changelog/v1.7.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 43 LOC |
| `.opencode/skills/deep-research/changelog/v1.8.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 113 LOC |
| `.opencode/skills/deep-research/changelog/v1.9.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 134 LOC |
| `.opencode/skills/deep-research/changelog/v1.10.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 157 LOC |
| `.opencode/skills/deep-research/changelog/v1.11.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 54 LOC |
| `.opencode/skills/deep-research/changelog/v1.12.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 67 LOC; current head |
| `.opencode/skills/deep-research/changelog/v1.13.0.0.md` | Created (phase 3) | PLANNED | audit_status:PASS_WITH_DEVIATIONS; authored at end of phase 3 per changelog-entry.schema.json |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> This spec folder's own deliverables. Includes phase-2 / phase-4 / phase-5 outputs as PLANNED at phase-1 baseline.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/002-deep-research/spec.md` | Created | OK | Level 3 |
| `.../002-deep-research/plan.md` | Created | OK | Level 3 with dependency graph |
| `.../002-deep-research/tasks.md` | Created | OK | T001-T119 across 5 phases |
| `.../002-deep-research/checklist.md` | Created | OK | Level 3 verification + sign-off |
| `.../002-deep-research/decision-record.md` | Created | OK | ADR-001 through ADR-004 + reserved ADR-005/006 |
| `.../002-deep-research/implementation-summary.md` | Created (skeleton) | OK | Filled post-phase-5 |
| `.../002-deep-research/resource-map.md` | Created | OK | This file |
| `.../002-deep-research/description.json` | Created | PLANNED | Auto-generated by generate-context.js |
| `.../002-deep-research/graph-metadata.json` | Created | PLANNED | Auto-generated by generate-context.js |
| `.../002-deep-research/audit-findings.jsonl` | Created (phase 2) | PLANNED | One JSON per line, schema-validated |
| `.../002-deep-research/validation-report.jsonl` | Created (phase 4) | PLANNED | One JSON per line, schema-validated |
| `.../002-deep-research/validation-report.md` | Created (phase 4) | PLANNED | Human-readable summary |
| `.../002-deep-research/research/iterations/iter-*-{executor}.json` | Created (phase 5) | PLANNED | 10 iteration outputs |
| `.../002-deep-research/research/convergence-summary.md` | Created (phase 5) | PLANNED | Stop reason + signals |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

> Per template precedence: shell + node + cjs scripts under `scripts/` belong here. README inside scripts/ stays under §READMEs.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-research/scripts/reduce-state.cjs` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 1072 LOC; largest script; bug-scan only |
| `.opencode/skills/deep-research/scripts/runtime-capabilities.cjs` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 114 LOC |
| `.opencode/skills/deep-research/scripts/verify-yaml-script-paths.sh` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 44 LOC |
| `.opencode/skills/deep-research/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh` | (Listed under §5.5 Skills per category precedence — manual_testing_playbook content belongs to the Skill bucket) | OK | Cross-ref only |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:config -->
## 9. Config

> Spec-folder JSON metadata (description.json, graph-metadata.json) lives under §Specs per template precedence. This category covers SKILL-level config not under §5.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-research/graph-metadata.json` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS; 161 LOC; skill advisor input; not edited unless cascade forces it (then skill-graph compile required) |
| `.opencode/skills/deep-research/assets/*.json` | (Listed under §5.3 Skills per category precedence) | OK | Cross-ref only |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:meta -->
## 10. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `CLAUDE.md` | Cited | OK | Governance — §1 CLI dispatch rule + small-model dispatch rule (load-bearing for phase 5) |
<!-- /ANCHOR:meta -->

---

## Phase-5 Augmentation

> **Reserved section**. Populated after step 5b merge. Each row = one novel logic gap surfaced by deep-research iterations that is NOT already in `spec.md` or `audit-findings.jsonl`. If 10 iterations converge with no novel gaps, this section explicitly records the empty result with a single row noting the convergence reason and iteration count.

| Gap ID | Source Iter | Severity | Description | Recommended Action |
|--------|-------------|----------|-------------|--------------------|
| [phase 5 fills] | iter-NN-executor | P0/P1/P2 | [novel gap not in spec or audit-findings] | [follow-on task or deferral rationale] |

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

**Path conventions:**
- Paths are **relative to the repo root** (e.g., `.opencode/skills/deep-research/SKILL.md`), not absolute.
- One path per row. Glob suffixes (`/**`, `/*`) used in §5.5 where every file under the glob received the same Action (Analyzed).

**Action column:** what this packet did to the file. `Analyzed` = read for audit context (phase 2 default); `Updated` = surgical edit applied; `Created` = new file; `Cited` = external doc referenced as anchor; `Validated` = phase-4 validation pass.

**Status column:** state at the moment this map was written/updated. `OK` = exists on disk now. `PLANNED` = will be created in a downstream phase. `MISSING` = referenced but absent (no such case at phase-1 baseline).

**Category precedence applied here:**
1. `Specs > Config` — spec-folder JSON belongs to §Specs (lines 191-204).
2. `Meta > READMEs` — root-level CLAUDE.md sits under §Meta.
3. `Skills > Documents` — every markdown inside `.opencode/skills/deep-research/**` lives in §5.
4. `Tests > Scripts` — n/a here (no vitest/pytest/spec test files in scope).

**Category deletion:**
- §3 Commands, §4 Agents, §8 Tests all empty for this packet and intentionally omitted.
- Original numbering preserved (§5 Skills, §6 Specs, §7 Scripts, §9 Config, §10 Meta) per template author rule (no renumbering after deletion).

**Phase progression:**
- Phase 1 (baseline): every PENDING row populated; PLANNED rows reserved for downstream creation.
- Phase 2: Note column `audit_status:PASS_WITH_DEVIATIONS` updated to `PASS` / `PASS_WITH_DEVIATIONS` / `FAIL` per artifact.
- Phase 3: README.md row's `audit_status` updated post-rewrite; v1.13.0.0.md row flipped PLANNED → OK.
- Phase 4: per-row validation match% appended to Note column from `validation-report.jsonl`.
- Phase 5: Phase-5 Augmentation section populated from `research/iterations/*.json` merge.

**Size budget:**
- This file is intentionally larger than the 250-LOC suggested cap because the audit scope (~90 deep-research artifacts) needs row-level visibility for phase 2 dispatch. Glob-grouping is applied where it does not erode that visibility (§5.5 manual testing playbook sub-categories collapsed by directory; §5.6 changelog enumerated since each file gets format-checked separately).

**Reference reading:**
- `.opencode/skills/system-spec-kit/templates/README.md` (template architecture)
- `.opencode/skills/system-spec-kit/references/templates/level_specifications.md` (level-by-level usage)
- `.opencode/skills/system-spec-kit/SKILL.md` §3 Canonical Spec Docs
- `.opencode/skills/sk-doc/references/skill_creation.md` (skill-folder standards)
<!-- /ANCHOR:author-instructions -->
