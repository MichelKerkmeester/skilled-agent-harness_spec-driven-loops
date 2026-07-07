---
title: "Implementation Plan: Phase 001 Discovery Impact Map"
description: "Run reproducible text, filename, metadata, snapshot, and database-edge audits for the sk-deep-* rename. Synthesize the measured results into human-readable and machine-readable inventory artifacts."
trigger_phrases:
  - "070 phase 001 plan"
  - "sk-deep discovery plan"
  - "impact map plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/031-sk-deep-rename/001-discovery-impact-map"
    last_updated_at: "2026-05-05T18:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed grep/find discovery and inventory synthesis"
    next_safe_action: "Hand off Phase 001 outputs to Phase 002"
    blockers: []
    key_files:
      - "inventory.md"
      - "inventory.tsv"
      - "edge-cases.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 001 Discovery Impact Map

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, TOML, TypeScript, JavaScript, Python, shell, YAML, text, templates |
| **Framework** | Spec Kit phase documentation |
| **Storage** | Text inventory files in the phase folder |
| **Testing** | Reproducible grep/find audits plus strict spec validation |

### Overview
Phase 001 runs exact identifier searches for `sk-deep-review` and `sk-deep-research`, then classifies every active matching file into area and downstream phase ownership. It separately audits filename embeds and non-text or generated surfaces so later phases do not miss references that a normal text grep would not cover.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent `spec.md` read for rename context.
- [x] Parent `resource-map.md` read for pre-discovery shape.
- [x] Phase folder scope is pre-approved and write-limited to `001-discovery-impact-map/`.

### Definition of Done
- [x] `inventory.md` reports total counts, category breakdown, per-area top files, edge cases, and recommended phase ordering.
- [x] `inventory.tsv` contains one row per active file with required columns and requested area labels.
- [x] `edge-cases.md` annotates all non-trivial patterns with expected handling.
- [x] Child and parent strict validation exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only discovery pipeline with a write-only reporting sink in the Phase 001 spec folder.

### Key Components
- **Primary text grep**: Exact identifier search over active roots and requested extensions.
- **Filename audit**: `find` audit for files and folders embedding `sk-deep-*`.
- **Edge-case probes**: Targeted grep/find commands for MCP constants, databases, snapshots, and graph metadata.
- **Classifier**: Area and downstream phase assignment based on path prefixes and parent resource-map taxonomy.
- **Inventory artifacts**: `inventory.md`, `inventory.tsv`, and `edge-cases.md`.

### Data Flow
Search commands produce file paths and match counts. A classifier groups each path into a requested area label and downstream phase. The synthesis step writes aggregate counts and top-file summaries for human review, plus TSV rows for later automation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-deep-review/` | Old skill folder root | Inventory only in Phase 001; rename in Phase 002 | Filename and text grep evidence |
| `.opencode/skills/sk-deep-research/` | Old skill folder root | Inventory only in Phase 001; rename in Phase 002 | Filename and text grep evidence |
| `.opencode/skills/system-spec-kit/mcp_server/` | Advisor and memory implementation | Inventory constants and references; update later in Phase 003 | TS/JS string literal grep |
| `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/` | Runtime agent definitions | Inventory runtime references by area; update later in Phases 003-004 | Path-classified TSV rows |
| `.opencode/commands/` | Command definitions and assets | Inventory command references; update later in Phase 003 | Path-classified TSV rows |
| Active spec folders | Current planning and graph metadata | Inventory active references; exclude `z_archive/` | Graph metadata grep and spec path classification |
| Root docs/configs | User-facing and runtime config references | Inventory only; update later in Phase 005 | Root glob grep and TSV rows |

Required inventories:
- Text producers and consumers: exact grep for `sk-deep-review` and `sk-deep-research` across requested extensions.
- Filename consumers: `find` for files and directories matching `*sk-deep-*`.
- Edge-case consumers: MCP string literal grep, database grep, snapshot find+grep, active graph metadata grep.
- Algorithm invariant: a path is counted only if it is active, text-readable, and outside excluded historical/generated/binary surfaces.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Planning Artifact Setup
- [x] Read parent `spec.md`.
- [x] Read parent `resource-map.md`.
- [x] Author Level 2 spec, plan, tasks, checklist, and in-progress graph metadata.

### Phase 2: Primary Discovery
- [x] Run primary exact grep over requested roots and extensions.
- [x] Count references to each old skill name separately per file.
- [x] Compute unique union, review-only, research-only, and both-name buckets.

### Phase 3: Edge-Case Discovery
- [x] Run filename and folder embed audit.
- [x] Run MCP TS/JS string literal audit.
- [x] Run database reference audit without editing binary database files.
- [x] Run snapshot fixture audit.
- [x] Run active graph metadata audit.

### Phase 4: Synthesis and Validation
- [x] Classify files into requested `area` labels and downstream phases.
- [x] Write `inventory.md`, `inventory.tsv`, and `edge-cases.md`.
- [x] Mark checklist and tasks with evidence.
- [x] Update `graph-metadata.json` status to `complete`.
- [x] Run strict validation for child and parent.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Exact text search | Old-name references in active source/doc/config surfaces | `grep` |
| Filename audit | Files and folders embedding old names | `find` |
| Edge probes | MCP constants, SQLite mentions, snapshots, graph metadata | `grep`, `find` |
| Artifact validation | Spec-kit document contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` |

Primary text grep:

```bash
grep -rl --include='*.md' --include='*.json' --include='*.toml' --include='*.ts' --include='*.js' --include='*.py' --include='*.sh' --include='*.yaml' --include='*.yml' --include='*.txt' --include='*.tmpl' \
  -e "sk-deep-review" -e "sk-deep-research" \
  .opencode .claude .codex .gemini *.md *.json 2>/dev/null
```

Filename embeds:

```bash
find .opencode .claude .codex .gemini -name "*sk-deep-*" -type f 2>/dev/null
find .opencode .claude .codex .gemini -name "sk-deep-*" -type d 2>/dev/null
find . -name "*sk-deep-*" -not -path "./.git/*"
```

Edge-case probes:

```bash
grep -rln "['\"]sk-deep-" .opencode/skills/system-spec-kit/mcp_server
grep -rln "sk-deep" .opencode/skills/system-spec-kit/mcp_server/database
find .opencode \( -name "*.snap" -o -name "*-snapshots" \)
grep -rln "sk-deep" .opencode/specs --include='graph-metadata.json'
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Parent `spec.md` | Internal doc | Green | Rename context unclear |
| Parent `resource-map.md` | Internal doc | Green | Initial area taxonomy unavailable |
| Shell `grep` and `find` | Local tooling | Green | Discovery commands need fallback to `rg`/manual classification |
| Spec validator | Local tooling | Green | Completion claim blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Inventory artifacts are incomplete, validation fails, or the classifier assigns paths outside requested labels.
- **Procedure**: Patch only files in `001-discovery-impact-map/`, rerun discovery commands, regenerate affected inventory rows, and re-run child plus parent strict validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 Setup -> Phase 2 Primary Discovery -> Phase 3 Edge-Case Discovery -> Phase 4 Synthesis and Validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Parent docs and pre-approved phase folder | Primary Discovery |
| Primary Discovery | Setup | Edge-Case Discovery, Synthesis |
| Edge-Case Discovery | Primary Discovery | Synthesis |
| Synthesis and Validation | Primary Discovery, Edge-Case Discovery | Phase 002 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Primary Discovery | Medium | 30 minutes |
| Edge-Case Discovery | Medium | 20 minutes |
| Synthesis and Validation | Medium | 45 minutes |
| **Total** | | **About 2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No rename target file edits.
- [x] All generated artifacts are confined to `001-discovery-impact-map/`.
- [x] Binary databases are listed as rebuild targets, not patched content.

### Rollback Procedure
1. Delete or patch only the Phase 001 generated artifacts.
2. Re-run the discovery generator with the same include and exclude rules.
3. Re-run child and parent strict validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable. Phase 001 writes documentation and inventory artifacts only.
<!-- /ANCHOR:enhanced-rollback -->
