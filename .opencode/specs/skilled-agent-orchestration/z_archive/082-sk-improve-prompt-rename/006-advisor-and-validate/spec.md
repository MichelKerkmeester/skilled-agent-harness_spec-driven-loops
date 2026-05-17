---
title: "Feature Specification: Phase 006 Advisor and Validate"
description: "Final verification phase for the sk-prompt rename with no source modifications. Rebuilds advisor state, scans the skill graph, runs routing probes, strict recursive validation, and the final active-scope grep."
trigger_phrases:
  - "082 phase 006"
  - "sk-improve-prompt advisor validate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/082-sk-improve-prompt-rename/006-advisor-and-validate"
    last_updated_at: "2026-05-06T13:35:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase complete via direct sed (CLI dispatch unreliability rule applied)"
    next_safe_action: "Packet 082 complete — proceed to memory save and code-graph refresh"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-082-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->
# Feature Specification: Phase 006 Advisor and Validate

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Pending |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `082-sk-improve-prompt-rename` |
| **Phase** | 006 of 006 |
| **Handoff Criteria** | Advisor rebuild and scan pass; five probes return top-1 `sk-prompt`; recursive strict validation exits 0; final grep returns 0 hits |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The rename is complete only if advisor state, skill graph indexes, prompt-routing probes, strict spec validation, and active-scope grep all agree on `sk-prompt`. This phase verifies that agreement without making source changes.

### Purpose
Phase 006 performs final validation only: rebuild advisor state, scan skill graph, run the five required probes, validate the whole packet recursively, and run the final grep audit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `mcp__spec_kit_memory__advisor_rebuild` and `mcp__spec_kit_memory__skill_graph_scan`.
- Run five `skill_advisor.py` probes with threshold `0.0` and confirm top-1 `sk-prompt`.
- Run recursive strict validation for `skilled-agent-orchestration/082-sk-improve-prompt-rename`.
- Run final active-scope grep excluding packet docs and frozen historical scopes.

### Out of Scope
- Modifying source files to fix remaining old-name hits.
- Editing child or parent spec docs during verification unless validator errors require spec-doc fixes.
- Renaming skill folders, agents, commands, runtime mirrors, or root docs.
- Rewriting frozen historical scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `006-advisor-and-validate/spec.md` | Replace | Phase 006 verification contract |
| Source files | None | Verification-only phase; source modifications are out of scope |
<!-- /ANCHOR:scope -->

---


<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Phase scope is mechanical reference rotation. Acceptance criteria covered in HANDOFF CRITERIA.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All in-scope files have zero `sk-improve-prompt` literal references
- Phase folder strict validation passes
- Advisor / runtime continues to dispatch correctly to `sk-prompt`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Race against parallel orchestration sessions touching overlapping files (mitigated: direct sed under heavy parallelism, per memory rule)
- Generated index files (`descriptions.json`) cannot be hand-rotated; refresh via `generate-context.js` during final memory save
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at completion.
<!-- /ANCHOR:questions -->

---


<!-- ANCHOR:implementation -->
## 4. IMPLEMENTATION APPROACH

Dispatch cli-codex gpt-5.5 medium fast for this phase. The executor should run the required rebuilds and probes, capture top-1 evidence for each prompt, and stop on any validation or grep failure instead of editing unrelated source files.
<!-- /ANCHOR:implementation -->

<!-- ANCHOR:handoff -->
## 5. HANDOFF CRITERIA

- Advisor rebuild and skill graph scan complete.
- Probes `"improve my prompt"`, `"enhance this prompt"`, `"rewrite this prompt"`, `"make this prompt better"`, and `"DEPTH framework prompt"` return top-1 `sk-prompt`.
- Recursive strict validation exits 0 and final grep returns 0 hits.

```bash
python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "improve my prompt" --threshold 0.0
python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "enhance this prompt" --threshold 0.0
python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "rewrite this prompt" --threshold 0.0
python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "make this prompt better" --threshold 0.0
python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "DEPTH framework prompt" --threshold 0.0
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/082-sk-improve-prompt-rename --strict --recursive
rg -l 'sk-improve-prompt' .opencode .claude .codex .gemini *.md *.json --glob '!**/z_archive/**' --glob '!**/z_future/**' --glob '!**/{054,055,061,063,067,070,079}/**' --glob '!**/system-spec-kit/026-graph-and-context-optimization/**' --glob '!**/082-sk-improve-prompt-rename/**'
```
<!-- /ANCHOR:handoff -->

<!-- ANCHOR:related -->
## 6. RELATED DOCUMENTS

- **Parent Spec**: [../spec.md](../spec.md)
- **Resource Map**: [../resource-map.md](../resource-map.md)
- **Predecessor Phase**: [../005-root-and-config/spec.md](../005-root-and-config/spec.md)
- **Successor Phase**: None
<!-- /ANCHOR:related -->
