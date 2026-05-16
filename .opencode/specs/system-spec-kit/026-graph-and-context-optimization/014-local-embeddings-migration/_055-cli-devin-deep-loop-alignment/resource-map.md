---
title: "Resource Map: 059"
description: "Inputs (the 7 surfaces touched) + outputs (5 new files + 4-5 edits)."
trigger_phrases:
  - "059 resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/_055-cli-devin-deep-loop-alignment"
    last_updated_at: "2026-05-15T19:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Inventoried inputs + outputs"
    next_safe_action: "Phase 2"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:c089acabbb0ba13f10184023c571ba6eaac4663c85a27965219d335cd8e5a336"
      session_id: "059-resource-map"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
# Resource Map: 059

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This resource map lists the 6 surfaces that 059 touches (2 commands + 2 agents + cli-devin SKILL + cli-devin references/assets) and the new files it creates (5).
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:input-files -->
## 2. INPUT FILES

| File | Role |
|------|------|
| `.opencode/commands/spec_kit/deep-research.md` | Edit: executor enum + YAML dispatch |
| `.opencode/commands/spec_kit/deep-review.md` | Edit: executor enum + YAML dispatch |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Edit: cli-devin dispatch shape |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Edit if exists |
| `.opencode/agents/deep-research.md` | Edit: SWE-1.6 iter contract subsection |
| `.opencode/agents/deep-review.md` | Edit: SWE-1.6 iter contract subsection |
| `.opencode/skills/cli-devin/SKILL.md` | Edit: new "Deep-Loop Iter Contract" section |
| `.opencode/skills/cli-devin/references/cli_reference.md` | Read: existing patterns to follow |
| `.opencode/skills/cli-devin/references/devin_tools.md` | Read: known capabilities |
| (in conversation) 056+058 retrospective | Read: source of all 7 lessons |
<!-- /ANCHOR:input-files -->

---

<!-- ANCHOR:output-artifacts -->
## 3. OUTPUT ARTIFACTS

| Artifact | Producer | Purpose |
|----------|----------|---------|
| `research/retrospective.md` | Phase 1 main agent | Consolidated 7-lesson retrospective from 056+058 (input for sonnet @markdown later phases) |
| `research/gpt-5.5-review.md` | Phase 1 cli-codex | Pre-execution review output |
| `research/edit-evidence.md` | Phases 2-4 sonnet | Per-file before/after with iter citation |
| `cli-devin/references/deep-loop-iter-contract.md` | Phase 4 sonnet | Canonical 7-lesson reference |
| `cli-devin/references/agent-config-recipes.md` | Phase 4 sonnet | Catalog of 2 JSON recipes + usage |
| `cli-devin/assets/deep-loop-iter-template.md` | Phase 4 sonnet | Per-iter prompt template |
| `cli-devin/assets/agent-config-deep-research-iter.json` | Phase 4 sonnet | SWE-1.6-locked research config |
| `cli-devin/assets/agent-config-deep-review-iter.json` | Phase 4 sonnet | SWE-1.6-locked review config |
<!-- /ANCHOR:output-artifacts -->

---

<!-- ANCHOR:execution-paths -->
## 4. EXECUTION PATHS

### Phase 1 cli-codex review dispatch

```bash
codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort="xhigh" \
  -c service_tier="fast" \
  -c approval_policy="never" \
  --sandbox workspace-write \
  "$(cat /tmp/codex-059-review.md)" \
  > /tmp/codex-059-review.log 2>&1 </dev/null
```

### Phase 2-4 sonnet @markdown dispatches

```text
Agent({ subagent_type: 'markdown', prompt: '...' })
```

### Phase 5 verification

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py <file> --type <skill|reference|asset|readme>
python3 -c "import json; json.load(open('<agent-config-*.json>'))"
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <059-packet> --strict
```
<!-- /ANCHOR:execution-paths -->
