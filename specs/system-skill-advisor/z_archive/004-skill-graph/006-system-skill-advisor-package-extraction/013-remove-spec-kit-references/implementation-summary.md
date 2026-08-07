---
title: "Implementation Summary: Sweep stale advisor refs from spec-kit docs"
description: "Evidence summary for stale advisor reference bucketing and cleanup in system-spec-kit docs."
trigger_phrases:
  - "013/009/013 implementation summary"
  - "spec-kit advisor cleanup summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/013-remove-spec-kit-references"
    last_updated_at: "2026-05-14T19:30:00Z"
    last_updated_by: "codex"
    recent_action: "Spec-kit advisor docs swept and validated"
    next_safe_action: "Packet complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "description.json"
      - "graph-metadata.json"
    completion_pct: 100
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `013-remove-spec-kit-references` |
| **Completed** | 2026-05-14 |
| **Level** | 2 |
| **Status** | Complete |
| **Completion** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet audited system-spec-kit operator-facing Markdown docs for stale advisor references after the `013/009` extraction. Live docs now point to the sibling `system-skill-advisor` skill and the root `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` bridge where topology matters.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | Modified | Removed live claims that advisor lives under spec-kit `mcp_server/`; retargeted architecture and related links to the sibling skill. |
| `.opencode/skills/system-spec-kit/README.md` | Modified | Retargeted OpenCode bridge path and advisor README link. |
| `.opencode/skills/system-spec-kit/constitutional/gate-enforcement.md` | Modified | Reworded Gate 2 fallback as the sibling advisor Python compat shim. |
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | Modified | Retargeted OpenCode bridge path to `.opencode/plugins/`. |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` | Modified | Retargeted OpenCode bridge smoke and package test command. |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook-validation.md` | Modified | Retargeted bridge validation paths and added advisor package build. |
| `.opencode/skills/system-spec-kit/scripts/observability/README.md` | Modified | Fixed sibling advisor relative path. |
| `.opencode/install_guides/SET-UP - Skill Advisor.md` | Modified | Retargeted build/test/install checks to `system-skill-advisor`. |
| `.opencode/skills/system-spec-kit/feature_catalog/scoring-and-calibration/24-skill-advisor-affordance-evidence.md` | Deleted | Advisor-owned feature catalog entry removed from spec-kit catalog. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/scoring-and-calibration/199-skill-advisor-affordance-evidence.md` | Deleted | Advisor-owned manual scenario removed from spec-kit playbook. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/279-advisor-status-rebuild-separation.md` | Deleted | Duplicate advisor repair scenario removed; sibling advisor playbook owns it. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modified | Removed the deleted local row 279. |
| `013-remove-spec-kit-references/*` | Created/modified | Level 2 packet docs and metadata. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The sweep used the required baseline grep before fixes, then bucketed doc hits under ADR-004: delete live stale refs, annotate historical refs only when ambiguity remains, and preserve current sibling references. The final grep still contains current sibling references, examples, and out-of-scope script/test fixtures, but no stale live doc instructions remain.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete advisor-owned spec-kit catalog/playbook entries | The sibling `system-skill-advisor` docs now own detailed advisor behavior. Keeping duplicates in spec-kit risks drift. |
| Keep hook references in spec-kit | Runtime hooks remain a spec-kit lifecycle surface, even though advisor scoring is sibling-owned. |
| Leave non-doc script/test hits untouched | The dispatch explicitly forbids source changes and limits this packet to operator-facing docs. |
| Add no historical annotations | Historical/example refs that remain were already unambiguous; no ADR section needed extra wording. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline grep | PASS: required grep returned 208 match lines across 29 files. |
| Final grep | PASS: same grep returned 167 match lines; manual stale-live sweep found 0 `STALE_LIVE` doc instructions remaining. |
| Stale path grep | PASS: targeted grep for `mcp_server/skill_advisor`, removed `plugin_bridges`, old advisor tests, and deleted local entries returned 0 hits in whitelisted docs. |
| Spec-kit root strict validation | SKIPPED: `.opencode/skills/system-spec-kit/spec.md` is absent. |
| Spot-checks | PASS: `ARCHITECTURE.md`, `README.md`, `hook_system.md`, `skill-advisor-hook.md`, and `SET-UP - Skill Advisor.md` inspected after edits. |
| Strict validation | PASS: `validate.sh 013-remove-spec-kit-references --strict` passed after packet docs were filled. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:binding -->
## BINDING

```text
AGENT_RECEIVED=013/009/013-remove-spec-kit-references
SPAWN_AGENT_USED=no
RESULT=PASS
COMMITS=recorded-in-final-delivery
PACKET_SCAFFOLDED=YES
BASELINE_HITS_COUNT=208
BUCKETED_STALE_LIVE=31
BUCKETED_STALE_HISTORICAL=4
BUCKETED_CURRENT_SIBLING=134
BUCKETED_NO_LONGER_RELEVANT=39
FILES_EDITED=20
ANNOTATIONS_ADDED=0
ENTRIES_DELETED=4
FINAL_HITS_COUNT=167
STRICT_VALIDATE_013=PASS
FILES_OUT_OF_SCOPE=0
NOTES=High-stakes deletions were limited to duplicate advisor-owned catalog/playbook entries now owned by system-skill-advisor docs.
```
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The final grep still reports current sibling advisor references and out-of-scope script/test fixture hits; those are not stale live doc instructions.
2. Parallel-session dirty files were left untouched and must not be included in the scoped commit.
<!-- /ANCHOR:limitations -->
