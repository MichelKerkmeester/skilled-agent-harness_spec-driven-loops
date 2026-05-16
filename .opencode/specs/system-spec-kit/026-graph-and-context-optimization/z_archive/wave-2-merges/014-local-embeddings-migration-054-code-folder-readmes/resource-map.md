---
title: "Resource Map: Phase C target folders + assets"
description: "Per-folder current state inventory and asset references for Phase C README work in system-spec-kit."
trigger_phrases:
  - "054 resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/054-code-folder-readmes"
    last_updated_at: "2026-05-15T12:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Inventoried 8 target folders"
    next_safe_action: "Begin Phase 2"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:b3bf25d65ba82144590ac41cba4febd4466cb3f1939cbbfcba4687a466339649"
      session_id: "054-resource-map"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
# Resource Map: Phase C target folders + assets

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This resource map lists the 8 git-tracked folders in `system-spec-kit/mcp_server/` that need new sk-doc READMEs and the assets used to author them. The original Phase C plan estimated 56 folders; discovery showed 96 of 116 already pass sk-doc validate and 12 are gitignored noise.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:target-folders -->
## 2. TARGET FOLDERS (8 total)

| Folder | Type | Notes |
|--------|------|-------|
| `.github/hooks/` | Git hooks | Pre-commit, prepare-commit-msg, and similar scripts |
| `data/` | MCP server data | Static config data for the MCP server |
| `matrix_runners/templates/` | Test matrix templates | Templates for matrix-based test runners |
| `tests/advisor-fixtures/` | Advisor fixtures | Test data for skill-advisor tests |
| `tests/description/fixtures/` | Description fixtures | Test data for the description module |
| `tests/fixtures/council-value/` | Council-value fixtures | Parent fixture folder |
| `tests/fixtures/council-value/data/` | Council-value data | Data files for council-value scenarios |
| `tests/validation/fixtures/` | Validation fixtures | Test data for spec-folder validator |
<!-- /ANCHOR:target-folders -->

---

<!-- ANCHOR:assets -->
## 3. ASSETS REFERENCED

| Asset | Path | Used For |
|-------|------|----------|
| sk-doc CODE template | `.opencode/skills/sk-doc/assets/readme/readme_code_template.md` | Pass 2 authoring shape |
| HVR rules | `.opencode/skills/sk-doc/references/global/hvr_rules.md` | Voice gate in Pass 2 |
| Validator | `.opencode/skills/sk-doc/scripts/validate_document.py` | Per-file validation |
| Bulk auditor | `.opencode/skills/sk-doc/scripts/audit_readmes.py` | System-spec-kit sweep |
| Phase A compact exemplar | `.opencode/skills/system-code-graph/mcp_server/core/README.md` | Reference for small folders |
| Phase B fixture exemplar | `.opencode/skills/system-skill-advisor/mcp_server/tests/fixtures/lifecycle/README.md` | Reference for fixture folders |
| Phase B fixture exemplar | `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/README.md` | Reference for multi-file fixture folders |
| Phase A packet | `../../007-code-graph/017-code-folder-readmes/` | Precedent 1 |
| Phase B packet | `../../008-skill-advisor/002-code-folder-readmes/` | Precedent 2 |
| Strict validator | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Packet validation |
<!-- /ANCHOR:assets -->

---

<!-- ANCHOR:execution-paths -->
## 4. EXECUTION PATHS

### Pipeline dispatch shapes

```text
cli-devin -p --prompt-file /tmp/devin-054-pass1.md --model swe-1.6 --permission-mode dangerous </dev/null > /tmp/devin-054-pass1.log 2>&1 &
[3-check gate: imports grep + exports grep + commands smoke-run; transcript in research/]
opencode run --model deepseek/deepseek-v4-pro --variant high --agent general --dangerously-skip-permissions "$(cat /tmp/opencode-054-pass2.md)" </dev/null > /tmp/opencode-054-pass2.log 2>&1 &
```

### Validation commands

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py <path> --type readme
python3 .opencode/skills/sk-doc/scripts/audit_readmes.py
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/054-code-folder-readmes --strict
```

### Sonnet double-check (parallel)

- `Agent({ subagent_type: 'markdown', prompt: 'Structural review of 8 READMEs' })`
- `Agent({ subagent_type: 'review', prompt: 'Factual review of 8 READMEs against bundles + source' })`
<!-- /ANCHOR:execution-paths -->
