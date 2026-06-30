---
title: "Resource Map: Phase B target folders + assets"
description: "Per-folder current state inventory and asset references for Phase B README work in system-skill-advisor."
trigger_phrases:
  - "024 resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/002-code-folder-readme-coverage"
    last_updated_at: "2026-05-15T11:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Inventoried 9 candidate folders + classified gap type"
    next_safe_action: "Begin Phase 2"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:712a74b60700d8db1050d224fd83de60dde52c88dd69db77cbeeff7ce09bdf04"
      session_id: "024-resource-map"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
# Resource Map: Phase B target folders + assets

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This resource map enumerates the 9 candidate folders from the original Phase B plan, classifies each by current sk-doc compliance state, and points to the assets needed for execution.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:target-folders -->
## 2. TARGET FOLDERS (9 candidates, 7 actual work)

### Track 1: Pipeline authoring (2 fixture folders, no existing README)

| Folder | File count | Source files | Notes |
|--------|-----------:|--------------|-------|
| `tests/fixtures/lifecycle/` | 1 | `index.ts` (1734 B) | Lifecycle fixture for test scenarios |
| `tests/scorer/fixtures/` | 4 | `harder-intent-prompt-corpus.ts` (7570 B), `intent-prompt-corpus.ts` (4814 B), `seed-skill-embeddings.ts` (5040 B), `.gitignore`, `.embeddings-cache/` | Scorer-test fixture corpora |

### Track 2: TOC anchor insert (5 already-aligned READMEs, missing only TOC)

| Folder | README bytes | sk-doc state | Origin |
|--------|-------------:|--------------|--------|
| `lib/context/` | 3898 | All sections + frontmatter; missing the table-of-contents anchor block | Earlier 022 packet audit |
| `lib/scorer/lanes/` | 4154 | Same | Earlier 022 packet audit |
| `lib/scorer/lanes/__tests__/` | 4040 | Same | Earlier 022 packet audit |
| `scripts/routing-accuracy/` | 4072 | Same | Earlier 022 packet audit |
| `stress_test/search-quality/` | 4027 | Same | Earlier 022 packet audit |

### No-op (already passes sk-doc validate)

| Folder | README bytes | sk-doc state | Origin |
|--------|-------------:|--------------|--------|
| `lib/skill-graph/` | 2153 | PASS validate, has TOC, has 4 anchors | Earlier 022 packet upgrade |
| `stress_test/skill-advisor/` | 6162 | PASS validate, has TOC, has 4 anchors | Earlier 022 packet upgrade |
<!-- /ANCHOR:target-folders -->

---

<!-- ANCHOR:assets -->
## 3. ASSETS REFERENCED

| Asset | Path | Used For |
|-------|------|----------|
| sk-doc CODE template | `.opencode/skills/sk-doc/assets/readme/readme_code_template.md` | Pass 2 authoring shape |
| HVR rules | `.opencode/skills/sk-doc/references/global/hvr_rules.md` | Voice-gate in Pass 2 |
| Validator | `.opencode/skills/sk-doc/scripts/validate_document.py` | Per-file validation |
| Bulk auditor | `.opencode/skills/sk-doc/scripts/audit_readmes.py` | System-skill-advisor sweep |
| Full-scaffold exemplar | `.opencode/skills/system-code-graph/mcp_server/README.md` | Phase A precedent, full 9-section shape |
| Compact exemplar | `.opencode/skills/system-code-graph/mcp_server/core/README.md` | Phase A precedent, compact shape |
| Phase A packet | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/017-code-folder-readmes/` | Predecessor pipeline proof |
| Strict validator | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Packet-level validation |
<!-- /ANCHOR:assets -->

---

<!-- ANCHOR:execution-paths -->
## 4. EXECUTION PATHS

### Track 1 (pipeline)

```text
cli-devin -p --prompt-file /tmp/devin-024-pass1.md --model swe-1.6 --permission-mode dangerous </dev/null > /tmp/devin-024-pass1.log 2>&1 &
[verification gate: grep + transcript]
opencode run --model deepseek/deepseek-v4-pro --variant high --agent general --dangerously-skip-permissions "$(cat /tmp/opencode-024-pass2.md)" </dev/null > /tmp/opencode-024-pass2.log 2>&1 &
```

### Track 2 (mechanical)

For each of 5 target READMEs:
1. Read existing section headers
2. Generate TOC anchor block
3. Edit between H1 line and first numbered H2

### Validation (convergence)

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py <path> --type readme
python3 .opencode/skills/sk-doc/scripts/audit_readmes.py
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/002-code-folder-readme-coverage --strict
```

### Sonnet double-check

Task tool dispatches in parallel:
- `Agent({ subagent_type: 'markdown', prompt: 'Read 7 READMEs, flag sk-doc structural issues' })`
- `Agent({ subagent_type: 'review', prompt: 'Read 7 READMEs + 2 bundles, flag factual hallucinations' })`
<!-- /ANCHOR:execution-paths -->
