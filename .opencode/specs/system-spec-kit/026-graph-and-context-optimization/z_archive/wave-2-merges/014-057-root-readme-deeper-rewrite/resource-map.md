---
title: "Resource Map: 057 deeper second-pass rewrite"
description: "Asset + source-file inventory for the sonnet @markdown second-pass."
trigger_phrases:
  - "057 resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/057-root-readme-deeper-rewrite"
    last_updated_at: "2026-05-15T14:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Inventoried input files + assets"
    next_safe_action: "Begin Phase 2"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:a952dbd18574dde2d9e43b5264df8bff1b5893a445923417a771fff04e3b5eb2"
      session_id: "057-resource-map"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
# Resource Map: 057 deeper second-pass rewrite

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This resource map lists the input files the sonnet @markdown second-pass consumes and the output artifacts it produces.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:input-files -->
## 2. INPUT FILES (read-only by sonnet)

| File | Role |
|------|------|
| `./README.md` | The audit target, post-Phase-4 state (1499 lines) |
| `../054-root-readme-deep-research/research/research.md` | 263 findings ledger from 056 |
| `../054-root-readme-deep-research/research/delta-verified.md` | 056's 30 collapsed EDITs (reference) |
| `../054-root-readme-deep-research/research/edit-evidence.md` | 056 Phase 4 record (avoid duplicate edits) |
| `../054-root-readme-deep-research/research/iterations/iteration-001.md` ... `iteration-020.md` | 20 raw iter findings |
| `.opencode/skills/sk-doc/references/global/hvr_rules.md` | HVR voice contract |
| `.opencode/skills/sk-doc/assets/readme/readme_code_template.md` | Reference shape (for context only) |
<!-- /ANCHOR:input-files -->

---

<!-- ANCHOR:output-artifacts -->
## 3. OUTPUT ARTIFACTS

| Artifact | Producer | Purpose |
|----------|----------|---------|
| `./README.md` (modified) | Sonnet @markdown | Surgical second-pass edits |
| `research/edit-evidence-v2.md` | Sonnet @markdown | Before/after per applied edit |
| `research/uncovered-findings.md` (optional) | Sonnet @markdown | Iter findings sonnet judged un-applyable + reason |
<!-- /ANCHOR:output-artifacts -->

---

<!-- ANCHOR:execution-paths -->
## 4. EXECUTION PATHS

### Phase 2 dispatch

```text
Agent({
  subagent_type: 'markdown',
  prompt: '...inputs listed above + scope contract + target HVR >= 98...'
})
```

### Phase 3 verification

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py ./README.md --type readme --json | jq .hvr_score
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <057-packet> --strict
git diff README.md  # inspect surgical-edit discipline
```

### Phase 3 sonnet double-check

```text
Agent({ subagent_type: 'markdown', prompt: 'voice double-check' })
Agent({ subagent_type: 'review',   prompt: 'factual double-check' })
```
<!-- /ANCHOR:execution-paths -->
