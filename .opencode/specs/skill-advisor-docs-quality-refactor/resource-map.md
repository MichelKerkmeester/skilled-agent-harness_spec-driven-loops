---
title: "Resource Map: skill-advisor-docs-quality-refactor (parent-aggregate)"
description: "Aggregated path catalog across children 001-005 of skill-advisor-docs-quality-refactor: all paths analyzed during the audit phase and slated for modification in subsequent phases."
trigger_phrases:
  - "resource map skill-advisor docs quality"
  - "skill-advisor path catalog"
  - "skill-advisor files touched"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "top-level/skill-advisor-docs-quality-refactor"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded resource-map"
    next_safe_action: "Expand post-001 synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "parent-resource-map"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

This map operates in **parent-aggregate mode**: one map at the phase parent aggregating every path children 001-005 touch. Per-child resource-maps are not authored (per template Author Instructions §Scope shape: pick one mode, not both). Phase children may produce their own implementation-summary.md but reference back to this aggregate for the path ledger.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 38 (initial; expanded as 001 deep-research surfaces additional paths)
- **By category**: READMEs=11, Documents=14, Skills=4, Specs=12, Config=1, Meta=0
- **Missing on disk**: 0 (initial); 5 PLANNED (new reference docs in child 005)
- **Scope**: All files analyzed or touched across children 001-005 of skill-advisor-docs-quality-refactor (aggregated). Initial set seeded from Phase 1 audit findings; will be expanded post-001 synthesis.
- **Generated**: 2026-05-16T00:00:00Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-skill-advisor/README.md` | Analyzed, Updated | OK | Marketing-style rewrite in child 003 |
| `.opencode/skills/system-skill-advisor/mcp_server/README.md` | Cited | OK | Reference only |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/README.md` | Cited | OK | Reference only |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/README.md` | Cited | OK | Reference only |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/README.md` | Cited | OK | Reference only |
| `.opencode/skills/system-skill-advisor/feature_catalog/README.md` | Cited | OK | Reference only (if present) |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/README.md` | Cited | OK | Reference only (if present) |
| `.opencode/skills/system-skill-advisor/hooks/claude/README.md` | Cited, Updated | OK | ADR-path fix in child 002 |
| `.opencode/skills/system-skill-advisor/hooks/gemini/README.md` | Cited, Updated | OK | ADR-path fix in child 002 |
| `.opencode/skills/system-skill-advisor/hooks/codex/README.md` | Cited, Updated | OK | ADR-path fix in child 002 |
| `.opencode/skills/system-code-graph/README.md` | Analyzed | OK | Peer reference for README voice ceiling |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-skill-advisor/SKILL.md` | Analyzed, Updated | OK | ADR-path fix (002) + 1:1 alignment (004) |
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | Analyzed, Updated | OK | ADR-path + build-command fixes (002) + freshness contract subsection (005) |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Analyzed, Updated | OK | Hook-reference link fix (002) + hook brief contract subsection (005) |
| `.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md` | Analyzed, Updated | OK | Gap-05 note + count recount (004) |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md` | Analyzed, Updated | OK | Paths + SAD-NNN expansion + gap-09 note + count reconciliation (002, 004) |
| `.opencode/skills/system-skill-advisor/references/tool-ids-reference.md` | Analyzed | OK | Source-of-truth for tool count framing |
| `.opencode/skills/system-skill-advisor/references/db-path-policy.md` | Analyzed | OK | Verified clean |
| `.opencode/skills/system-skill-advisor/references/standalone-mcp-shape.md` | Analyzed | OK | Verified clean |
| `.opencode/skills/system-skill-advisor/references/legacy-tool-bridge.md` | Analyzed | OK | Verified clean |
| `.opencode/skills/system-skill-advisor/references/advisor-scorer.md` | Analyzed | OK | Lane weights table source |
| `.opencode/skills/system-skill-advisor/references/propagate-enhances.md` | Analyzed | OK | Audit-flagged unknown; verify in 001 iter 07 |
| `.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md` | Analyzed | OK | Audit-flagged unknown; verify in 001 iter 07 |
| `.opencode/skills/system-skill-advisor/changelog/v0.1.0.md` | Cited | OK | USP source |
| `.opencode/skills/system-skill-advisor/changelog/v0.2.0.md` | Cited | OK | USP source (production isolation) |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-skill-advisor/feature_catalog/0[1-8]--*/` | Analyzed, Updated | OK | Per-group sk-doc alignment (004); gap at 05 |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/0[1-8]--*/` | Analyzed, Updated | OK | Per-category alignment (004); gap at 09 |
| `.opencode/skills/system-skill-advisor/hooks/{claude,codex,devin,gemini}/` | Analyzed, Updated | OK | Per-runtime hook docs |
| `.opencode/skills/system-skill-advisor/mcp_server/` | Cited | OK | Source-of-truth for tool registration (read-only this packet) |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/skill-advisor-docs-quality-refactor/spec.md` | Created | OK | Phase-parent spec (this file) |
| `.opencode/specs/skill-advisor-docs-quality-refactor/description.json` | Created | OK | Parent metadata |
| `.opencode/specs/skill-advisor-docs-quality-refactor/graph-metadata.json` | Created | OK | Parent graph metadata |
| `.opencode/specs/skill-advisor-docs-quality-refactor/resource-map.md` | Created | OK | This file |
| `.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/` | Created | OK | Deep-research child |
| `.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/` | Created | PLANNED | Deep-research artifact root (created by /spec_kit:deep-research init) |
| `.opencode/specs/skill-advisor-docs-quality-refactor/002-bug-fixes/` | Created | OK | Bug-fixes child |
| `.opencode/specs/skill-advisor-docs-quality-refactor/003-readme-marketing-rewrite/` | Created | OK | README rewrite child |
| `.opencode/specs/skill-advisor-docs-quality-refactor/004-sk-doc-1to1-alignment/` | Created | OK | Per-file alignment child |
| `.opencode/specs/skill-advisor-docs-quality-refactor/005-content-additions-and-hvr/` | Created | OK | Content additions child |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/003-doc-and-config-drift-fixes/` | Cited | OK | Predecessor packet |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-skill-graph/006-system-skill-advisor-extraction/001-design-and-decision-record/decision-record.md` | Cited | OK | ADR-001 (canonical path; fix needed in skill docs) |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-skill-advisor/graph-metadata.json` | Cited | OK | Skill-package metadata; not modified |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:planned-content-additions -->
## PLANNED: Content additions (child 005)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-skill-advisor/references/lane-weight-tuning.md` | Created | PLANNED | New reference: when/how to tune scorer lane weights |
| `.opencode/skills/system-skill-advisor/references/skill-graph-query-cookbook.md` | Created | PLANNED | New reference: worked examples for all 10 query types |
| `.opencode/skills/system-skill-advisor/references/validation-baselines.md` | Created | PLANNED | New reference: baseline metrics + troubleshooting |
| `.opencode/skills/system-skill-advisor/references/daemon-lease-contract.md` | Created | PLANNED | New reference: lease semantics + contention recovery |
| `.opencode/skills/system-skill-advisor/references/skill-graph-drift.md` | Created | PLANNED | New reference: SQL-vs-graph-metadata.json reconciliation |
| `.opencode/skills/system-skill-advisor/references/hooks/skill-advisor-hook.md` | Created | PLANNED | Canonical copy of the hook contract (currently lives under system-spec-kit) |
<!-- /ANCHOR:planned-content-additions -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

Mode: **parent-aggregate** (per template Author Instructions §Scope shape — single map listing children's touched paths, NOT per-child resource-maps).

This map is seeded from the Phase 1 audit. After 001-audit-and-research synthesis ships, expand the tables with any additional paths surfaced during the 20 deep-research iterations. Re-run the summary count when adding rows.

**Size budget:** ≤ 250 lines. Currently at ~110.

**Category numbering:** preserved per template — categories 3 (Commands), 4 (Agents), 7 (Scripts), 8 (Tests), 10 (Meta) are omitted because this packet has no entries there. Numbers stay aligned with the canonical template anchor IDs.
<!-- /ANCHOR:author-instructions -->
