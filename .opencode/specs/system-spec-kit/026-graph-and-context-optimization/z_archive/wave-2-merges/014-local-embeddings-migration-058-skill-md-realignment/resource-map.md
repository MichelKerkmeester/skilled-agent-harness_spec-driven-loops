---
title: "Resource Map: 058 realignment"
description: "Inputs (the 6 target files + sk-doc authority) and outputs (modified files + new references docs)."
trigger_phrases:
  - "058 resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/058-skill-md-realignment"
    last_updated_at: "2026-05-15T15:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Inventoried inputs + outputs"
    next_safe_action: "Begin Phase 2"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:d37b461e2c5dd0742d4bdb6e8a35e84c569237179ab83f5ae663d5e502063b1b"
      session_id: "058-resource-map"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
# Resource Map: 058 realignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This resource map lists the 6 target files, the sk-doc authority, the 2 references/ folders to expand, and the 7+ new docs Phase 4 Batch C creates.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:input-files -->
## 2. INPUT FILES

| File | Role | Current state |
|------|------|---------------|
| `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` | SKILL.md AUTHORITY | 1174 lines (creation guide) |
| `.opencode/skills/system-spec-kit/SKILL.md` | Target 1 (SKILL.md realign) | 466 lines, NO anchors |
| `.opencode/skills/system-code-graph/SKILL.md` | Target 2 (SKILL.md realign) | 146 lines, 8 anchors |
| `.opencode/skills/system-skill-advisor/SKILL.md` | Target 3 (SKILL.md realign) | 215 lines, 8 anchors |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Target 4 (mcp_server README; also THE MODEL) | 323 lines, 9 anchors |
| `.opencode/skills/system-code-graph/mcp_server/README.md` | Target 5 (mcp_server README) | 263 lines, 9 anchors (aligned) |
| `.opencode/skills/system-skill-advisor/mcp_server/README.md` | Target 6 (mcp_server README; MAJOR expansion) | 66 lines, 4 anchors |
| `.opencode/skills/system-skill-advisor/references/` | Audit + 4 new docs | 3 existing files |
| `.opencode/skills/system-code-graph/references/` | Create from scratch (3-4 docs) | Empty (.gitkeep only) |
<!-- /ANCHOR:input-files -->

---

<!-- ANCHOR:output-artifacts -->
## 3. OUTPUT ARTIFACTS

| Artifact | Producer | Purpose |
|----------|----------|---------|
| `research/iterations/iteration-001.md` ... `iteration-020.md` | Phase 2 cli-devin | 20 deep-review iter outputs |
| `research/deep-research-state.jsonl` | Phase 2 orchestrator | Per-iter status rows |
| `research/research.md` | Phase 3 synthesis | Consolidated findings |
| `research/delta-verified.md` | Phase 3 synthesis | Surgical EDITs + NEW-FILE specs |
| `research/edit-evidence-A.md` | Phase 4 Batch A | SKILL.md before/after |
| `research/edit-evidence-B.md` | Phase 4 Batch B | mcp_server READMEs before/after |
| `research/edit-evidence-C.md` | Phase 4 Batch C | New references creation log |
<!-- /ANCHOR:output-artifacts -->

---

<!-- ANCHOR:planned-new-files -->
## 4. PLANNED NEW FILES (Phase 4 Batch C)

| Path | Topic |
|------|-------|
| `.opencode/skills/system-skill-advisor/references/advisor-scorer.md` | Scorer logic + lane attribution + safety boundaries |
| `.opencode/skills/system-skill-advisor/references/propagate-enhances.md` | Internal propagate-enhances tool role + invariants |
| `.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md` | Roadmap for `lib/skill-graph/` extraction |
| `.opencode/skills/system-skill-advisor/references/tool-ids-reference.md` | Table of 9 public tool IDs with schemas |
| `.opencode/skills/system-code-graph/references/code-graph-readiness-check.md` | What `ensureCodeGraphReady()` validates |
| `.opencode/skills/system-code-graph/references/ownership-boundary.md` | Why deep loops stay in system-spec-kit |
| `.opencode/skills/system-code-graph/references/database-path-policy.md` | `code-graph.sqlite` path policy |
| (optional) `.opencode/skills/system-code-graph/references/graph-quality-and-feedback.md` | If Track 8 finds the gap |
<!-- /ANCHOR:planned-new-files -->

---

<!-- ANCHOR:execution-paths -->
## 5. EXECUTION PATHS

### Phase 2 per-iter

```bash
devin -p --prompt-file /tmp/devin-058-iter-NNN.md \
  --model swe-1.6 \
  --permission-mode auto \
  </dev/null \
  > /tmp/devin-058-iter-NNN.log 2>&1
```

### Phase 4 batch dispatch

```text
Agent({
  subagent_type: 'markdown',
  prompt: '...verified delta + sk-doc template + HVR rules + scope contract...'
})
```

### Verification (Phase 5)

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py <each modified or created file> --type readme
python3 .opencode/skills/sk-doc/scripts/audit_readmes.py
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <058-packet> --strict
```
<!-- /ANCHOR:execution-paths -->
