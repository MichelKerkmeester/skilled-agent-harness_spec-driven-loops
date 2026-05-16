---
title: "Resource Map: 056 deep-research realignment"
description: "Asset and source-file inventory for the 20-iter cli-devin sweep and sonnet @markdown rewrite."
trigger_phrases:
  - "056 resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/054-root-readme-deep-research"
    last_updated_at: "2026-05-15T13:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Inventoried input files + assets"
    next_safe_action: "Begin Phase 2"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:48c5be315d5b7e3ebe33257e05189cd878bf8ba9ef9ec22d63f1d770cfe1988b"
      session_id: "056-resource-map"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
# Resource Map: 056 deep-research realignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This resource map lists the input files the 20-iter sweep consumes, the assets each iter reuses, and the output artifacts produced per phase.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:input-files -->
## 2. INPUT FILES (read by iter dispatches)

| File | Role |
|------|------|
| `./README.md` | The audit target (1497 lines post-Phase-D + tagline expansion) |
| `.opencode/skills/system-spec-kit/SKILL.md` | Current shape of system-spec-kit |
| `.opencode/skills/system-skill-advisor/SKILL.md` | Current shape of system-skill-advisor |
| `.opencode/skills/system-code-graph/SKILL.md` | Current shape of system-code-graph |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Authoritative tool count + names |
| `.opencode/skills/sk-doc/references/global/hvr_rules.md` | HVR rule reference (Track 3) |
| `opencode.json` | Native MCP server names |
| `.codex/config.toml` | Codex runtime MCP config |
| `.claude/mcp.json` | Claude Code runtime MCP config |
| `.gemini/settings.json` | Gemini runtime MCP config |
| `.opencode/agents/` (directory listing) | Agent count for Track 1 |
| `.opencode/skills/` (directory listing) | Skill count for Track 1 |
| `.opencode/commands/` (directory listing) | Command count for Track 1 |
| `git log --since="60 days ago" --oneline` | Recent commits for drift signals |
<!-- /ANCHOR:input-files -->

---

<!-- ANCHOR:assets -->
## 3. ASSETS REUSED PER ITER

| Asset | Path | Used For |
|-------|------|----------|
| Iter template | `assets/iter-template.md` | Per-iter dispatch prompt scaffold |
| Track seeds | `research/track-seeds.md` | RQ + reading-list source per iter |
| cli-devin SKILL | `.opencode/skills/cli-devin/SKILL.md` | Dispatch contract reference |
| Prompt-quality card | `.opencode/skills/cli-devin/assets/prompt_quality_card.md` | STAR/RCAF/BUILD framework |
| HVR rules | `.opencode/skills/sk-doc/references/global/hvr_rules.md` | Voice contract |
<!-- /ANCHOR:assets -->

---

<!-- ANCHOR:output-artifacts -->
## 4. OUTPUT ARTIFACTS

| Artifact | Producer | Purpose |
|----------|----------|---------|
| `research/iterations/iteration-NNN.md` (x 20) | Each cli-devin iter | Findings + evidence + recommended edits |
| `research/deep-research-state.jsonl` | Main agent per iter | Per-iter status + newInfoRatio + focus |
| `research/research.md` | Phase 3 synthesis | Consolidated findings ledger |
| `research/delta-verified.md` | Phase 3 synthesis | Surgical edit list with FROM/TO/REASON |
| `research/edit-evidence.md` | Phase 4 sonnet | Before/after per applied edit |
<!-- /ANCHOR:output-artifacts -->

---

<!-- ANCHOR:execution-paths -->
## 5. EXECUTION PATHS

### Per-iter (Phase 2)

```text
# Generate prompt
sed 's/{ITER_NUM}/NNN/g; s/{TRACK}/T/g; s/{RQ}/Research question text/g' \
  assets/iter-template.md > /tmp/devin-056-iter-NNN.md

# Dispatch (read-only research, no writes)
devin -p --prompt-file /tmp/devin-056-iter-NNN.md \
  --model swe-1.6 \
  --permission-mode auto \
  </dev/null \
  > /tmp/devin-056-iter-NNN.log 2>&1

# Main agent: parse log, write iteration-NNN.md + append state.jsonl row, commit
```

### Synthesis (Phase 3)

```text
devin -p --prompt-file /tmp/devin-056-synth.md \
  --model swe-1.6 \
  --permission-mode auto \
  </dev/null \
  > /tmp/devin-056-synth.log 2>&1
```

### Rewrite (Phase 4)

```text
Agent({
  subagent_type: 'markdown',
  prompt: '...verified delta + voice directive + HVR rules path...'
})
```

### Verification (Phase 5)

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py ./README.md --type readme --json | jq .hvr_score
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <056-packet> --strict
git diff README.md  # inspect surgical-edit discipline
```
<!-- /ANCHOR:execution-paths -->
