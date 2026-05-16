---
title: "Implementation Plan: 078/004 system-spec-kit Validator + MCP Tool Registry Cleanup"
description: "Add 2 new shape-check validator rules. Fix ROLLOUT_FLAGS dir-resource. Document MCP coverage in mcp-coco-index. Bump 1.1.0 → 1.1.1. Final phase of 078."
trigger_phrases: ["078/004 plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/078-opencode-authoring-recipe/004-validator-cleanup"
    last_updated_at: "2026-05-05T19:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 4 complete; spec docs filled from placeholders"
    next_safe_action: "Commit + push placeholder fix"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "078-004-final"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 078/004 system-spec-kit Validator + MCP Tool Registry Cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

077 surfaced 6 P1 + 3 P2 findings clustered around validator coverage + MCP tool registry drift. Phase 4 (final phase of 078) ships 2 new validator shape-check rules (`check-graph-metadata-shape.sh`, `check-description-shape.sh`), fixes the `ROLLOUT_FLAGS` directory-resource issue (F-001-001), documents the mcp-coco-index MCP coverage gap explicitly (F-003-001, F-004-001), and audits the search telemetry doc against runtime `_ranked_result` emissions (F-004-002). mcp-coco-index bumps 1.1.0 → 1.1.1 (patch) with v1.3.1.0.md changelog. cli-codex dispatch completed the work (log stalled mid-thinking but artifacts shipped); validate.sh --strict on 078/004 + on prior packets PASS.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criterion |
|---|---|
| G1 | check-graph-metadata-shape.sh exists, executable, bash -n PASS |
| G2 | check-description-shape.sh exists, executable, bash -n PASS |
| G3 | Both rules registered in validator-registry.json with proper schema |
| G4 | ROLLOUT_FLAGS no longer contains a bare directory entry |
| G5 | mcp-coco-index/SKILL.md MCP Tool Coverage section present |
| G6 | mcp-coco-index/SKILL.md frontmatter version 1.1.0 → 1.1.1 |
| G7 | tool_reference.md telemetry section mentions canonical_resource_boost |
| G8 | mcp-coco-index/changelog/v1.3.1.0.md created (compact format) |
| G9 | validate.sh --strict on 078/004 exits 0 |
| G10 | validate.sh --strict on 077 still PASS (no regression) |
| G11 | One commit on main + push origin/main success |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### 2 new validator rules

Both follow the canonical bash structure (RULE_NAME, RULE_STATUS, RULE_DETAILS array, run_check function) used by existing rules. Both skip cleanly when their target file is absent (presence-checking is owned by FILE_EXISTS rule).

**check-graph-metadata-shape.sh** — validates graph-metadata.json shape: required keys (schema_version, packet_id, spec_folder, parent_id, children_ids, manual, derived) + manual.{depends_on, supersedes, related_to} arrays + derived.{trigger_phrases, key_files, source_docs} arrays + optional last_active_child_id type. Severity: warn.

**check-description-shape.sh** — validates description.json shape: required keys (name string, description string, level string-or-number). Severity: warn.

Note: a separate existing rule `check-graph-metadata.sh` already does shape validation; the new `check-graph-metadata-shape.sh` is additive and may overlap. The intent of the 077 finding F-002-001 was that shape coverage was perceived as insufficient; both rules running together close the gap defensively.

### ROLLOUT_FLAGS fix (F-001-001)

system-spec-kit/SKILL.md line 208-210 had a directory entry `feature_catalog/19--feature-flag-reference/` in the RESOURCE_MAP `ROLLOUT_FLAGS` list. The `_guard_in_skill` loader rejects non-`.md` resources, so the directory entry was structurally broken. Fix: remove the directory entry entirely. The remaining `references/config/environment_variables.md` entry covers the intent at a higher level; specific feature-flag detail files remain accessible via direct path.

### MCP Tool Coverage doc (mcp-coco-index/SKILL.md)

A new section explicitly listing which operations are MCP-exposed (`search`) vs CLI-only (init, index, status, reset, daemon) closes the documentation gap surfaced by F-003-001 + F-004-001. Tool reference at `references/tool_reference.md` already had a one-line note (line 22); the SKILL.md section makes it discoverable from the primary entry point.

### Telemetry alignment (tool_reference.md)

Audited rankingSignals coverage against actual `_ranked_result` emissions in `query.py`. Existing doc covered `implementation_boost` / `spec_research_penalty` / `docs_penalty`. Added `canonical_resource_boost` (newly emitted in 1.1.0 from Phase 3).

### Cli-codex dispatch

Single codex exec with stdin redirection. The codex log stalled before printing a clean closing summary (token-budget exhaustion mid-investigation), but the actual file edits were committed to disk. Verified by direct inspection: 2 new rule files (chmod +x), validator-registry.json updated, mcp-coco-index/SKILL.md version bumped, changelog created, ROLLOUT_FLAGS dir entry removed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Spec authoring (Claude orchestrator)
- 078/004 spec.md authored with 13 REQs

### Phase 2: Implementation (cli-codex dispatch)
- Single dispatch via stdin
- 2 new rule files + validator-registry.json + ROLLOUT_FLAGS fix + mcp-coco-index/SKILL.md + tool_reference.md + changelog
- Codex log stalled mid-thinking but all artifacts shipped

### Phase 3: Verification (Claude orchestrator)
- bash -n PASS on both new rule scripts
- validate.sh --strict on 078/004 → PASS
- validate.sh --strict regression check on 077 → PASS

### Phase 4: Commit + push
- git add 078/004 + 2 new rule scripts + validator-registry.json + system-spec-kit/SKILL.md + mcp-coco-index/SKILL.md + tool_reference.md + new changelog
- Commit + push origin main
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Method | Result |
|---|---|---|
| Bash syntax (new rules) | `bash -n` per file | PASS |
| Rule registration | jq query on validator-registry.json for 2 new rule_ids | PASS |
| ROLLOUT_FLAGS no dir entry | grep `feature_catalog/19--feature-flag-reference/$` | 0 hits (PASS) |
| MCP Tool Coverage section | grep "MCP Tool Coverage\|MCP-exposed" in mcp-coco-index/SKILL.md | PASS |
| Version bump | grep `^version: 1.1.1` mcp-coco-index/SKILL.md | PASS |
| canonical_resource_boost in telemetry | grep in tool_reference.md | PASS |
| validate.sh --strict on 078/004 | exit 0 check | PASS |
| validate.sh --strict on 077 (regression) | exit 0 check | PASS |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dep | Status | Note |
|---|---|---|
| Existing validator framework | Green | check-files.sh + check-graph-metadata.sh patterns reused |
| jq + python3 | Green | For registry edits |
| node | Green | New rules use node for JSON shape checks (matches existing patterns) |
| 078/001-003 shipped | Green | Phase 4 closes the validator-side findings |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Phase 4 is purely additive (2 new rules) + a one-line dir-entry removal in ROLLOUT_FLAGS + doc/version updates in mcp-coco-index. Rollback paths:

- Revert single commit: `git revert <sha>` removes all Phase 4 changes
- Surgical: `rm` both new rule scripts; remove their entries from validator-registry.json; restore ROLLOUT_FLAGS dir entry; revert mcp-coco-index SKILL.md/tool_reference.md changes; delete changelog/v1.3.1.0.md

Both rules default to severity=warn so they don't fail strict validation on legacy packets — the new shape rules can be safely added without breaking existing repos.

Stay on main; no feature branches per memory rule.
<!-- /ANCHOR:rollback -->
