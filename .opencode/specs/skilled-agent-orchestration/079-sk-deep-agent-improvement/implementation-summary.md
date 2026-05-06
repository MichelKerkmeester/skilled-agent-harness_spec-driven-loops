---
title: "Implementation Summary: Rename sk-improve-agent → deep-agent-improvement"
description: "Post-implementation summary capturing rollup of REQ-001..REQ-016 satisfaction, changed-files count, residual-grep proof, advisor smoke output, vitest summary, dispatch smoke output, and link to new v1.3.0.0.md changelog entry."
trigger_phrases:
  - "rename complete"
  - "implementation summary"
  - "deep-agent-improvement done"
  - "079 complete"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/079-sk-deep-agent-improvement"
    last_updated_at: "2026-05-06T08:45:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "stub authored"
    next_safe_action: "dispatch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000084"
      session_id: "079-impl-summary-stub"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

# Implementation Summary: Rename `sk-improve-agent` → `deep-agent-improvement`

**Status**: PLACEHOLDER. Will be populated at completion of T-040 by Claude after cli-copilot dispatch finishes.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `specs/skilled-agent-orchestration/079-sk-deep-agent-improvement` |
| **Completed** | [POPULATE-T-040: YYYY-MM-DD] |
| **Level** | 2 |
| **Implementation executor** | cli-copilot gpt-5.5 high (max 3 concurrent dispatches) |
| **Precedent** | `specs/skilled-agent-orchestration/070-sk-deep-rename/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

[POPULATE-T-040: Open with a hook — what changed and why it matters. One paragraph, impact first. Then sub-sections per feature.]

### Skill folder rename

[POPULATE-T-040: 1-2 paragraphs on the folder rename and its propagation. What developers gain.]

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/sk-improve-agent/` → `.opencode/skill/deep-agent-improvement/` | Renamed | Skill folder renamed via `git mv` (T-001). |
| `.opencode/changelog/sk-improve-agent` symlink | Renamed + Retargeted | Convenience pointer updated (T-002). |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Modified | 156 phrase entries migrated (T-010). |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | Modified | Registry key + edges + trigger phrases (T-011). |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:270` | Modified | Penalty list (T-012). |
| `.opencode/command/improve/assets/improve_improve-agent_*.yaml` × 4 runtimes | Modified | YAML asset path templates (T-022..T-026). |
| `.opencode/agent/improve-agent.md` × 4 runtimes | Modified | Skill matrix line (T-027..T-030). |
| `README.md`, `AGENTS.md`, `CLAUDE.md` | Modified | Root docs (T-031..T-032). |
| `.opencode/skill/deep-agent-improvement/changelog/v1.3.0.0.md` | Created | New changelog entry documenting rename (T-008). |

[POPULATE-T-040 with additional categorical breakdown from resource-map.md]
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

[POPULATE-T-040: Tell the delivery story. What gave us confidence this works?]

The rename was delivered as a sequenced 9-phase migration via cli-copilot gpt-5.5 high (max 3 concurrent dispatches per Copilot API throttle). Folder rename ran first (T-001) so old paths broke deterministically, surfacing missed reference sites during smoke verification. Skill advisor migration (T-010..T-016) was sequential because skill_advisor.py + skill-graph.json + fusion.ts + tests share a logical boundary; compiled `dist/` mirrors regenerated via `npm run build` (T-015) and SQLite cache rebuilt via `advisor_rebuild` MCP call (T-016). Command surfaces in 4 runtimes (T-020..T-026), agent surfaces in 4 runtimes (T-027..T-030), root docs (T-031..T-032), and install guides (T-033) ran as parallel waves where possible. Verification battery (T-035..T-039) confirmed completeness via strict spec validation, residual grep, advisor recommendation smoke, /improve:agent dispatch smoke, and vitest pass.

[POPULATE-T-040: Replace with actual delivery narrative + total dispatch wall-clock time]
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Skill folder renamed; agent name `@improve-agent` and command `/improve:agent` kept stable | Per 070-sk-deep-rename precedent — agent and command names already use modern convention without `sk-` prefix and are independent of skill folder name. Renaming them would have been gratuitous churn. |
| Historical changelog narrative kept verbatim (skill v1.0.0..v1.2.2 + system-spec-kit v3.3/v3.4) | Past entries document past releases factually. Updating their prose would falsify history. Only path strings inside those docs are updated since paths must resolve. |
| `specs/` research artifacts (~24,127 historical refs) out of scope | Research record stays factually accurate. Only active-code references are migrated. |
| Sequenced rename: folder move before path-string updates | Old path breaks immediately, surfacing missed reference sites during smoke verification rather than letting them lurk silently. |
| Implementation executor: cli-copilot gpt-5.5 high (not cli-codex) | User's explicit instruction. Per memory: stick with the executor the user named. |

[POPULATE-T-040 with any additional decisions made during dispatch]
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Strict spec validation (`validate.sh ... --strict`) | [POPULATE-T-040: PASS / exit code] |
| Residual grep (active code, ex-historical) | [POPULATE-T-040: 0 lines / hit count] |
| Advisor recommendation smoke (`advisor_recommend({prompt: "improve agent loop"})`) | [POPULATE-T-040: top hit + confidence] |
| /improve:agent dispatch smoke on sandbox agent | [POPULATE-T-040: PASS / FAIL with details] |
| Vitest (`npm test` in mcp_server) | [POPULATE-T-040: PASS / FAIL with summary line] |
| Branch hygiene (`git status` on main) | [POPULATE-T-040: clean main / details] |

### Requirements rollup

| REQ ID | Status | Evidence |
|--------|--------|----------|
| REQ-001 (folder rename) | [POPULATE] | [POPULATE: ls output] |
| REQ-002 (skill_id + name) | [POPULATE] | [POPULATE: jq + grep] |
| REQ-003 (advisor migrated) | [POPULATE] | [POPULATE: grep + advisor_recommend] |
| REQ-004 (SQLite rebuilt) | [POPULATE] | [POPULATE: advisor_status] |
| REQ-005 (dist regenerated) | [POPULATE] | [POPULATE: npm run build + grep] |
| REQ-006 (4 runtime command surfaces) | [POPULATE] | [POPULATE: per-runtime grep] |
| REQ-007 (/improve:agent dispatch) | [POPULATE] | [POPULATE: smoke output] |
| REQ-008 (symlink) | [POPULATE] | [POPULATE: readlink] |
| REQ-009 (validate.sh strict) | [POPULATE] | [POPULATE: exit 0] |
| REQ-010 (vitest pass) | [POPULATE] | [POPULATE: npm test summary] |
| REQ-011 (new changelog) | [POPULATE] | [POPULATE: v1.3.0.0.md exists] |
| REQ-012 (root docs) | [POPULATE] | [POPULATE: grep] |
| REQ-013 (install guides) | [POPULATE] | [POPULATE: grep] |
| REQ-014 (this file) | [POPULATE] | this file populated |
| REQ-015 (/memory:save) | [POPULATE] | [POPULATE] |
| REQ-016 (branch hygiene) | [POPULATE] | [POPULATE: git status] |

### Commit evidence

| Commit SHA | Phase | Description |
|------------|-------|-------------|
| [POPULATE] | T-001 | git mv folder rename |
| [POPULATE] | T-010..T-016 | Skill advisor migration |
| [POPULATE] | T-020..T-026 | Command surfaces (4 runtimes) |
| [POPULATE] | T-031..T-034 | Root docs + install guides |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Historical changelog narrative untouched.** Skill `changelog/v1.0.0.0.md..v1.2.2.0.md` and system-spec-kit `changelog/v3.3.0.0.md`/`v3.4.0.0.md` keep their narrative prose ("v1.0.0.0 created sk-improve-agent…") verbatim because those entries are factual records of past releases. Only path strings inside those docs were updated for resolution.
2. **`specs/` research artifacts unchanged.** Approximately 24,127 historical references to `sk-improve-agent` remain in `specs/059-*`, `specs/060-*`, `specs/070-*`, etc. These are research artifacts and stay verbatim per `spec.md` §3 Out of Scope.
3. **Agent name not modernized.** The agent is still `@improve-agent` rather than `@deep-agent-improvement`. Per 070 precedent (where `@deep-research`/`@deep-review` agents kept their names through the skill rename), agent naming is independent of skill folder naming. If full naming-family alignment is desired, a follow-on packet can rename the agent.
4. **YAML asset filenames preserved.** Files `improve_improve-agent_auto.yaml` and `improve_improve-agent_confirm.yaml` keep their filenames because they are command-scoped (named after `/improve:agent` command target, not the skill).

[POPULATE-T-040 with any additional limitations discovered during dispatch]
<!-- /ANCHOR:limitations -->

---

## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md` (T-001..T-041)
- **Checklist**: `checklist.md`
- **Resource Map**: `resource-map.md`
- **Precedent**: `specs/skilled-agent-orchestration/070-sk-deep-rename/`
- **New changelog entry** (post-rename): `.opencode/skill/deep-agent-improvement/changelog/v1.3.0.0.md` [POPULATE-T-040 with link once authored]
