---
title: "Resource Map: Phase D root README realignment"
description: "Asset and source-file inventory for the root README drift audit and rewrite."
trigger_phrases:
  - "055 resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/055-root-readme-realignment"
    last_updated_at: "2026-05-15T12:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Inventoried input files + assets"
    next_safe_action: "Begin Phase 2"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:bb240be20c96e768bdc48b36df68489d46fc3c1e149e9a9de9ce5b9f4b8de887"
      session_id: "055-resource-map"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
# Resource Map: Phase D root README realignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This resource map lists the input files that Phase D consumes and the assets used to verify drift in the root README.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:input-files -->
## 2. INPUT FILES (read by Pass 1 + Pass 2)

| File | Role |
|------|------|
| `./README.md` | The file being audited |
| `.opencode/skills/system-spec-kit/SKILL.md` | system-spec-kit current shape |
| `.opencode/skills/system-skill-advisor/SKILL.md` | system-skill-advisor current shape (post-extraction) |
| `.opencode/skills/system-code-graph/SKILL.md` | system-code-graph current shape (post-extraction) |
| `git log --since="30 days ago" --oneline` | Recent commit history for drift signals |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Authoritative tool count + names |
<!-- /ANCHOR:input-files -->

---

<!-- ANCHOR:output-artifacts -->
## 3. OUTPUT ARTIFACTS (research/)

| Artifact | Producer | Purpose |
|----------|----------|---------|
| `research/root-readme-context-bundle.json` | Pass 1 cli-devin | Drift inventory per claim |
| `research/root-readme-delta-verified.md` | Pass 2 cli-opencode deepseek-v4-pro | Cross-check verified delta |
| `research/root-readme-edit-evidence.md` | Pass 3 Task tool @markdown | Before/after per drifted section |
<!-- /ANCHOR:output-artifacts -->

---

<!-- ANCHOR:execution-paths -->
## 4. EXECUTION PATHS

### Pass 1

```text
devin -p --prompt-file /tmp/devin-055-pass1.md --model swe-1.6 --permission-mode dangerous </dev/null > /tmp/devin-055-pass1.log 2>&1 &
```

### Pass 2

```text
opencode run --model deepseek/deepseek-v4-pro --variant high --agent general --dangerously-skip-permissions "$(cat /tmp/opencode-055-pass2.md)" </dev/null > /tmp/opencode-055-pass2.log 2>&1 &
```

### Pass 3

Task tool dispatch:
```text
Agent({ subagent_type: 'markdown', prompt: '...verified delta + scope directive + voice preservation rules...' })
```

### Validation

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/055-root-readme-realignment --strict
git diff README.md  # inspect surgical-edit discipline
```
<!-- /ANCHOR:execution-paths -->
