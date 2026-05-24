---
title: "Implementation Plan: deep-research skill release cleanup"
description: "Five sequential phases: spec creation, surgical skill audit, README rewrite, blocking alignment validation gate with human approval, deep-research iterations and resource-map merge. Phase 4 blocks phase 5 until explicit approval."
trigger_phrases:
  - "deep-research release cleanup plan"
  - "phase 1 spec creation"
  - "phase 2 skill audit"
  - "phase 3 readme rewrite"
  - "phase 4 alignment validation gate"
  - "phase 5 deep research and merge"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/002-deep-research"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-plan-authored"
    next_safe_action: "author-tasks-checklist-decision-record"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002003"
      session_id: "131-000-002-spec-author"
      parent_session_id: "131-000-002-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2 + level3 | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Plan: deep-research skill release cleanup

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (spec docs), JSON Schema (machine contracts), JSONL (state files) |
| **Framework** | sk-doc templates, system-spec-kit validator, cli-devin + cli-opencode dispatchers |
| **Storage** | Spec folder under `.opencode/specs/.../002-deep-research/`; iteration archive under `research/iterations/` |
| **Testing** | Strict validator (`scripts/spec/validate.sh --strict`), `ajv` for schema validation, `rg` for path sweeps, `skill_advisor.py` for advisor parity |

### Overview

Sequential five-phase workflow. Phase 1 stands up the spec folder, schemas, and resource-map. Phase 2 audits the deep-research skill surgically against sk-doc templates. Phase 3 rewrites the README. Phase 4 runs an alignment validation gate and waits for explicit human approval. Phase 5 runs 10 deep-research iterations (5 cli-devin SWE-1.6 + 5 cli-opencode deepseek/deepseek-v4-pro direct API) and merges converged logic gaps into the resource-map.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable (SC-001 through SC-006)
- [x] Dependencies identified (DEEPSEEK_API_KEY, opencode-ai version pin, validator presence)
- [x] Toolchain locked (cli-devin SWE-1.6 + cli-opencode deepseek-v4-pro)
- [x] Phase boundaries and exit criteria defined

### Definition of Done

- [ ] All P0/P1 acceptance criteria met
- [ ] Strict validate exits 0 after every phase
- [ ] `checklist.md` fully populated with evidence
- [ ] `implementation-summary.md` filled (no template placeholders)
- [ ] `/memory:save` writes valid continuity update
- [ ] Skill-graph compiler re-run after any `graph-metadata.json` edit
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sequential phase pipeline with one blocking human-approval gate (phase 4 → 5). State machine externalized to JSONL files validated by JSON Schemas authored in phase 1.

### Key Components

- **Spec folder**: Source-of-truth for scope, risks, decisions, schemas, resource-map, validation reports, iteration archive.
- **Target skill**: `.opencode/skills/deep-research/` — read in phase 2 audit, surgically edited where deviations found, README rewritten in phase 3, version bumped at end of phase 3.
- **Schemas**: 4 JSON Schemas (audit-finding, changelog-entry, validation-report, iteration-output) that gate every state-file write across phases 2-5.
- **Validator**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` — exit 0 at every phase boundary.
- **Dispatchers (phase 5)**: `cli-devin --model swe-1.6` per `.opencode/skills/cli-devin/SKILL.md:192` (RCAF + CLEAR + medium-density pre-planning); `cli-opencode --provider deepseek/deepseek-v4-pro` (direct API key, not opencode-go) per `.opencode/skills/cli-opencode/SKILL.md:240`.

### Data Flow

```
spec.md + schemas/ ─► resource-map.md (phase 1)
                          │
                          ▼
            audit-findings.jsonl (phase 2) ─► surgical edits to deep-research/
                          │
                          ▼
            README.md rewrite + changelog v1.13.0.0 (phase 3)
                          │
                          ▼
            validation-report.{md,jsonl} (phase 4) ─► HUMAN APPROVAL GATE (ADR-006)
                          │
                          ▼
            research/iterations/iter-{NN}-{executor}.json × 10 (phase 5a)
                          │
                          ▼
            convergence-summary.md + resource-map.md Phase-5 Augmentation (phase 5b)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-research/SKILL.md` | Skill loader + smart router | Audit + version bump | `rg -F` path refs + advisor probe |
| `.opencode/skills/deep-research/README.md` | Human-facing intro | Full rewrite (phase 3) | HVR score ≥85 + section diff vs system-spec-kit/README.md |
| `.opencode/skills/deep-research/references/*` | Per-feature deep dives | Surgical audit | Template diff vs `skill_reference_template.md` |
| `.opencode/skills/deep-research/assets/*` | Workflow + config payloads | Surgical audit | Template diff vs `skill_asset_template.md` |
| `.opencode/skills/deep-research/feature_catalog/**` | Inventory + per-feature snippets | Surgical audit | Template diff vs `feature_catalog_template.md` |
| `.opencode/skills/deep-research/manual_testing_playbook/**` | Orchestrator-led test prompts | Surgical audit | Template diff vs `manual_testing_playbook_template.md` |
| `.opencode/skills/deep-research/changelog/v*.md` | Version history | Format audit + add v1.13.0.0 | `changelog-entry.schema.json` validation |
| `.opencode/skills/deep-research/scripts/*` | Runtime helpers | Bug-scan only | `node -c` / `bash -n` syntax checks |
| `.opencode/skills/deep-research/graph-metadata.json` | Skill advisor input | Untouched unless edits cascade | `skill_graph_compiler.py --export-json --pretty` rerun if touched |

Required inventories:
- Path references: `rg -F` every file path mentioned in any artifact under `.opencode/skills/deep-research/` to confirm targets exist.
- MCP tool names: `rg "mcp__" .opencode/skills/deep-research/` — every name must resolve to a registered tool in `opencode.json`.
- HVR rule applicability: scan every prose paragraph against banned-words / banned-phrase lists from `hvr_rules.md`.
- Cross-system targets named in README rewrite: `deep-loop-runtime`, `deep-review`, `system-spec-kit`, `system-code-graph`, all 5 cli-* skills, `mcp-coco-index`, `sk-prompt`, `sk-prompt-small-model`, `/deep:start-research-loop`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Initial Spec Creation

- [x] Author `spec.md` (Level 3) with scope, requirements, risks, user stories, complexity.
- [ ] Author `plan.md` (this file).
- [ ] Author `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` skeleton.
- [ ] Author `resource-map.md` with full artifact inventory (~95 rows).
- [ ] Author 4 JSON schemas in `schemas/`.
- [ ] Run `generate-context.js` to emit `description.json` + `graph-metadata.json`; reapply manual fields.
- [ ] Run strict validate (exit 0 expected).
- [ ] Run `skill_graph_compiler.py` if graph-metadata edited.

### Phase 2: Skill Audit (driven by `resource-map.md`)

- [ ] For each row in resource-map: read artifact, diff against sk-doc template, HVR scan, bug scan.
- [ ] Emit findings to `audit-findings.jsonl` (one JSON per line, schema-validated).
- [ ] Apply surgical fix for P0/P1 findings; defer P2 with rationale.
- [ ] Smart Router guard: do NOT edit SKILL.md §2 unless other changes cascade (then ADR-005).
- [ ] README audit defers fixes to phase 3.
- [ ] Changelog audit: format-only; do NOT add new entry yet.
- [ ] Update `resource-map.md` with per-artifact `audit_status` column.
- [ ] Strict validate exits 0.

### Phase 3: README Rewrite

- [ ] Re-read `Public/README.md` (tone anchor) + `system-spec-kit/README.md` (structural anchor).
- [ ] Re-read `hvr_rules.md` + `readme_creation.md`.
- [ ] Extract feature inventory from `feature_catalog/feature_catalog.md` and 4 sub-categories.
- [ ] Rewrite `.opencode/skills/deep-research/README.md` in place per `skill_readme_template.md`.
- [ ] Self-score HVR ≥85.
- [ ] Author `changelog/v1.13.0.0.md` per `changelog_template.md` + `changelog-entry.schema.json`.
- [ ] Bump `version:` in SKILL.md frontmatter (`1.12.0.0` → `1.13.0.0`).
- [ ] Strict validate exits 0.

### Phase 4: Alignment Validation Gate (BLOCKING)

- [ ] For each artifact in scope: reload sk-doc template, diff structure, score template-match %.
- [ ] Emit `validation-report.jsonl` (schema-validated).
- [ ] Author `validation-report.md` (human-readable summary + per-artifact table).
- [ ] **STOP. Surface report. Wait for explicit human approval.**
- [ ] Record approval in `decision-record.md` ADR-006 before any phase-5 dispatch.

### Phase 5: Deep Research and Resource-Map Merge

#### Step 5a: 10 iterations (one at a time, SIGKILL between)

- [ ] Verify `opencode-ai@1.14.51` pinned; verify `DEEPSEEK_API_KEY` env (for iters 6-10).
- [ ] Read `.opencode/skills/cli-devin/SKILL.md` + `.opencode/skills/cli-opencode/SKILL.md` (CLI dispatch rule).
- [ ] Iters 1-5: `cli-devin --model swe-1.6` (RCAF + CLEAR + medium-density pre-planning).
- [ ] Iters 6-10: `cli-opencode --provider deepseek/deepseek-v4-pro` (direct API).
- [ ] Between each iter: `pkill -9 -f "devin|codex|opencode"` + sweep `/tmp/codex-*`, `/tmp/devin-*`, `/tmp/deep-research-*`.
- [ ] Convergence: 2 consecutive iters with `delta_vs_prev_iter == "no new gaps"` AND zero new P0/P1 logic_gaps, OR iter 10.

#### Step 5b: Merge

- [ ] Collect `logic_gaps` from all 10 iteration outputs.
- [ ] Dedupe by `gap_id` + semantic similarity.
- [ ] Drop gaps already in `spec.md` or `audit-findings.jsonl`.
- [ ] Append remaining novel gaps to `resource-map.md` Phase-5 Augmentation section.
- [ ] Escalate any new P0/P1 gap as sub-task in `tasks.md`; re-run validate.
- [ ] Fill `implementation-summary.md` (no template placeholders).
- [ ] Final strict validate exits 0.
- [ ] `/memory:save` writes continuity update.
- [ ] `skill_graph_compiler.py` re-run.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | Every `*.jsonl` emitted in phases 2/4/5 | `ajv validate -s <schema> -d <jsonl>` |
| Spec-folder strict validate | After every phase boundary | `bash .../scripts/spec/validate.sh <folder> --strict` |
| Path-reference sweep | After phase 2 + phase 3 + phase 5 | `rg -F <path>` on every cited file |
| MCP tool-name sweep | After phase 2 + phase 3 | `rg "mcp__" .opencode/skills/deep-research/` |
| HVR scoring | After phase-3 README rewrite | Manual rubric per `hvr_rules.md` |
| Advisor parity | After phase 5 | `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "run a deep research loop" --threshold 0.8` |
| Manual playbook spot-check | After phase 5 | Dry-run one entry from `manual_testing_playbook/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash .../validate.sh` | Internal | Green | All phase exits blocked |
| `node .../generate-context.js` | Internal | Green | Description + graph metadata generation blocked |
| `python3 .../skill_graph_compiler.py` | Internal | Green | Skill advisor stays stale |
| `ajv` CLI | External | Yellow (may need install) | Schema validation falls back to manual check |
| `cli-devin` (`devin` binary) | External | Green | Phase 5 iters 1-5 blocked |
| `cli-opencode` (`opencode-ai@1.14.51`) | External | Green if pinned | Phase 5 iters 6-10 blocked |
| `DEEPSEEK_API_KEY` env | External | Verify before phase 5 | Phase 5 iters 6-10 blocked |
| `sk-doc` templates | Internal | Green | Phase 1/2/3/4 all blocked |
| `hvr_rules.md` | Internal | Green | Phase 3 HVR scoring blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase-4 gate denied by human; Smart Router accidentally broken; phase-5 iter discovers ship-blocking P0 in already-edited artifact.
- **Procedure**: Spec folder writes are append-only state files plus a small set of created docs; revert via `git checkout HEAD -- .opencode/skills/deep-research/<file>` for skill edits. Spec folder itself can be deleted wholesale if the packet is abandoned (no other packet depends on its outputs).

### Pre-deployment Checklist

- [ ] Backup not required (all changes tracked in git; spec folder additive)
- [ ] Feature flag not applicable (documentation/process work, no runtime gate)
- [ ] Monitoring not applicable

### Rollback Procedure

1. For skill regressions: `git diff --stat .opencode/skills/deep-research/` → `git checkout HEAD~N -- <files>` where N = commits since baseline.
2. For spec-folder abandonment: `rm -rf .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/002-deep-research/` + remove `children_ids` entry from parent `graph-metadata.json` + re-run `skill_graph_compiler.py`.
3. Verify advisor still surfaces deep-research at threshold 0.8 after any rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Spec Creation) ──► Phase 2 (Skill Audit) ──► Phase 3 (README Rewrite) ──► Phase 4 (Validation Gate) ━━HUMAN━━► Phase 5 (Deep Research + Merge)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2, 3, 4, 5 |
| Phase 2 | Phase 1 (resource-map) | Phase 3, 4, 5 |
| Phase 3 | Phase 2 (audit findings inform README context) | Phase 4, 5 |
| Phase 4 | Phase 3 (full surface ready for validation) | Phase 5 |
| Phase 5 | Phase 4 (gate passed + human approval) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (Spec Creation) | Med | 2-3 hours |
| Phase 2 (Skill Audit) | High | 4-6 hours (~95 artifacts) |
| Phase 3 (README Rewrite) | Med | 2-3 hours |
| Phase 4 (Validation Gate) | Low | 1-2 hours (mechanical) |
| Phase 5 (10 iterations + merge) | High | 4-6 hours (≤15 min × 5 + ≤25 min × 5 + merge) |
| **Total** | | **13-20 hours wall-clock** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] All commits up to phase-3 end on `main` (no feature branch — per user preference `feedback_stay_on_main_no_feature_branches`).
- [ ] Snapshot via `git rev-parse HEAD` recorded at phase-1, phase-3, phase-4 exits in `implementation-summary.md` for reference.

### Rollback Procedure

1. **Skill-edit regression**: `git revert <commit-sha>` for the offending phase commit; re-run strict validate; re-run `skill_graph_compiler.py` if graph-metadata changed.
2. **Spec-folder abandonment**: see §7 above.
3. **Phase-5 partial-iteration archive**: leave under `research/iterations/` for forensics; do not delete.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Phase 1        │───►│   Phase 2        │───►│   Phase 3        │───►│   Phase 4        │═══►│   Phase 5        │
│   Spec Creation  │    │   Skill Audit    │    │   README Rewrite │    │   Validation     │    │   Deep Research  │
└──────────────────┘    └──────────────────┘    └──────────────────┘    └────────┬─────────┘    └──────────────────┘
                                                                                  │
                                                                          HUMAN APPROVAL
                                                                          (ADR-006 gate)
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| spec.md + schemas + resource-map | None | Artifact inventory + state contracts | Phase 2, 3, 4, 5 |
| audit-findings.jsonl | resource-map.md | Findings ledger | Phase 3 context, Phase 4 inputs |
| README rewrite + changelog v1.13.0.0 | audit-findings.jsonl | Final user-facing surface | Phase 4 validation scope |
| validation-report.{md,jsonl} | All phase-3 outputs | Per-artifact pass/fail + human approval | Phase 5 |
| research/iterations/*.json | validation-report + ADR-006 | Logic-gap candidates | Phase 5b merge |
| resource-map.md Phase-5 Augmentation | research/iterations | Final state | Packet completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 (Spec Creation)** — 2-3 hours — CRITICAL (everything depends on schemas + resource-map)
2. **Phase 2 (Skill Audit)** — 4-6 hours — CRITICAL (drives phase 3 + 4 scope)
3. **Phase 3 (README Rewrite)** — 2-3 hours — CRITICAL (phase 4 validates final surface)
4. **Phase 4 (Validation Gate)** — 1-2 hours — CRITICAL (gates phase 5)
5. **Phase 5 (10 iters + merge)** — 4-6 hours — CRITICAL (final deliverable)

**Total Critical Path**: 13-20 hours wall-clock

**Parallel Opportunities**:
- Inside Phase 1: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md skeleton may be authored in any order. Schemas + resource-map depend on spec.md scope being final.
- Inside Phase 2: audit of references/, assets/, feature_catalog/, manual_testing_playbook/ may proceed in parallel by file class (one author per class).
- Inside Phase 5: NOT parallelizable — iterations strictly one at a time on this Mac.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Phase 1 spec folder ready | Strict validate exits 0; all 4 schemas validate samples | End of phase 1 |
| M2 | Phase 2 audit complete | `audit-findings.jsonl` populated, P0/P1 resolved or deferred | End of phase 2 |
| M3 | Phase 3 README + changelog shipped | HVR score ≥85; SKILL.md version bumped | End of phase 3 |
| M4 | Phase 4 gate passed | `validation-report.md` posted; ADR-006 recorded human approval | End of phase 4 |
| M5 | Phase 5 complete | 10 iters archived; resource-map Phase-5 Augmentation updated; `/memory:save` written | End of phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

The 4 plan-time ADRs live in `decision-record.md`:
- **ADR-001**: Split-toolchain phase 5 (5 cli-devin SWE-1.6 + 5 cli-opencode deepseek-v4-pro direct API)
- **ADR-002**: Surgical-edit policy across phases 2-3
- **ADR-003**: Single canonical `resource-map.md` (no YAML mirror)
- **ADR-004**: Smart Router preservation default (SKILL.md §2 untouched unless cascade required)

ADR-005 may be added at phase 2 if Smart Router needs editing. ADR-006 is added at phase 4 → 5 transition recording explicit human approval.
