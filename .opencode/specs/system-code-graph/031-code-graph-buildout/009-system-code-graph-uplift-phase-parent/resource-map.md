---
title: "Resource Map: 029 system-code-graph uplift"
description: "Preflight catalog of every file path the 20-iter deep-research and three downstream children will analyze, create, update, or cite during the system-code-graph uplift."
trigger_phrases:
  - "029 resource map"
  - "system-code-graph uplift paths"
  - "deep-research preflight"
  - "paths analyzed"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/009-system-code-graph-uplift-phase-parent"
    last_updated_at: "2026-05-16T09:37:48Z"
    last_updated_by: "main_agent"
    recent_action: "Authored preflight resource map"
    next_safe_action: "Dispatch 20-iter deep-research"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000029"
      session_id: "029-resource-map"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

This resource map is the preflight contract for the 20-iter deep-research run at this packet's root. The deep-research workflow reads it to scope which paths are in-bounds, which are excluded, and what categories of artifacts to focus on. After convergence, the workflow emits a second `research/resource-map.md` with discovered paths; the two together form the audit trail.

Authored at scaffold time so the deep-research dispatch has a clean ledger. Pairs with `spec.md` (problem + scope), not with any implementation-summary (children own those).
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 38
- **By category**: READMEs=4, Documents=11, Commands=1, Skills=12, Specs=4, Scripts=4, Tests=0, Config=2, Meta=0
- **Missing on disk**: 0
- **Scope**: Preflight catalog for the 029 phase-parent + 20-iter deep-research informing children 001/002/003. Parent-aggregate mode (single map at parent; no per-child maps until children scaffold).
- **Generated**: 2026-05-16T09:37:48Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-code-graph/README.md` | Analyzed | OK | Target of marketing-voice rewrite in child 002; opening currently implementation-first |
| `.opencode/skills/system-code-graph/mcp_server/README.md` | Analyzed | OK | Per-folder code README; usefulness audit in child 001 |
| `.opencode/skills/system-code-graph/mcp_server/handlers/README.md` | Analyzed | OK | Recent (packet 035); 1:1 sk-doc validation in child 003 |
| `.opencode/skills/system-code-graph/mcp_server/lib/README.md` | Analyzed | OK | Recent (packet 035); 1:1 sk-doc validation in child 003 |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-code-graph/SKILL.md` | Analyzed | OK | Add problem-hook framing in child 001 |
| `.opencode/skills/system-code-graph/ARCHITECTURE.md` | Analyzed | OK | 1:1 sk-doc validation in child 003 |
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | Analyzed | OK | Drift lines 49/56/195 fixed in child 001 |
| `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | Analyzed | OK | Index; validates as `--type playbook` in child 003 |
| `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md` | Analyzed | OK | Index; validates as `--type playbook` in child 003 |
| `.opencode/skills/system-code-graph/references/code-graph-readiness-check.md` | Analyzed | OK | HVR pass in child 001 |
| `.opencode/skills/system-code-graph/references/database-path-policy.md` | Analyzed | OK | HVR pass in child 001 |
| `.opencode/skills/system-code-graph/references/ownership-boundary.md` | Analyzed | OK | Exemplary; HVR pass-check only in child 001 |
| `.opencode/skills/sk-doc/references/global/hvr_rules.md` | Cited | OK | HVR pass-bar contract (≥85, banned words, em-dash policy) |
| `.opencode/skills/sk-doc/assets/readme/readme_template.md` | Cited | OK | Canonical README template; informs child 002 marketing rewrite |
| `README.md` | Cited | OK | Public root README; structural exemplar for child 002 voice (note: belongs to §Meta per precedence, but root README is repo's primary marketing surface and is the structural exemplar) |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:commands -->
## 3. Commands

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Cited | OK | Workflow YAML that owns the 20-iter loop autonomously |
<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-code-graph/` | Analyzed | OK | Whole skill is the uplift target |
| `.opencode/skills/system-code-graph/changelog/v1.0.0.0.md` | Cited | OK | Initial release notes |
| `.opencode/skills/system-code-graph/changelog/v1.0.2.0.md` | Cited | OK | Intermediate release |
| `.opencode/skills/system-code-graph/changelog/v1.0.3.0.md` | Cited | OK | Three-way isolation finalize |
| `.opencode/skills/system-spec-kit/README.md` | Cited | OK | Structural exemplar for child 002 (sibling marketing voice) |
| `.opencode/skills/sk-doc/SKILL.md` | Cited | OK | sk-doc routing contract |
| `.opencode/skills/sk-doc/references/global/template_rules.json` | Cited | OK | Per-type pass-bar thresholds |
| `.opencode/skills/cli-devin/SKILL.md` | Cited | OK | cli-devin dispatch contract for SWE 1.6 |
| `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json` | Cited | OK | Devin recipe pinning Read/Grep/Glob/Bash-readonly + sequential_thinking MCP |
| `.opencode/skills/cli-devin/assets/deep-loop-iter-template.md` | Cited | OK | Per-iter prompt template |
| `.opencode/skills/deep-research/SKILL.md` | Cited | OK | Loop protocol + forbidden patterns |
| `.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl` | Cited | OK | Phase-parent spec scaffold (this packet uses) |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/028-system-code-graph-doc-alignment/` | Cited | STALE | Predecessor packet; closed tool-count + topology drift. Path moved during the 2026-07-07 system-code-graph consolidation; exact destination not re-derived |
| `.opencode/specs/system-code-graph/031-code-graph-buildout/006-extraction-and-isolation/001-system-code-graph-extraction/` | Cited | OK | Original extraction packet; path corrected 2026-07-07 (was `system-spec-kit/026-graph-and-context-optimization/005-code-graph/014-system-code-graph-extraction/`) |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/025-skill-docs-sk-doc-alignment/` | Cited | STALE | Prior sk-doc alignment work. Path moved during the 2026-07-07 system-code-graph consolidation; exact destination not re-derived |
| `.opencode/specs/system-code-graph/031-code-graph-buildout/006-extraction-and-isolation/004-three-way-isolation-finalize/` | Cited | OK | v1.0.3.0 isolation packet; path corrected 2026-07-07 (was `system-spec-kit/026-graph-and-context-optimization/005-code-graph/040-three-way-isolation-finalize/`) |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/sk-doc/scripts/validate_document.py` | Cited | OK | Per-type validator (child 003 runs across every authored doc) |
| `.opencode/skills/sk-doc/scripts/audit_readmes.py` | Cited | OK | README audit harness if applicable in child 003 |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Cited | OK | Strict-validate at parent + each child packet boundary |
| `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` | Cited | OK | Continuity save after research synthesis |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-code-graph/package.json` | Cited | OK | Runtime package metadata (`@spec-kit/system-code-graph`) |
| `.opencode/skills/system-code-graph/tsconfig.json` | Cited | OK | TypeScript build config |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:excluded -->
## EXCLUDED FROM RESEARCH SCOPE

These paths are present in the skill folder but the deep-research run must NOT analyze them. They are third-party, build output, or runtime data — out-of-scope for doc improvement work.

| Path | Reason |
|------|--------|
| `.opencode/skills/system-code-graph/node_modules/` | Third-party packages; HVR/sk-doc rules do not apply |
| `.opencode/skills/system-code-graph/dist/` | Build output; not authored docs |
| `.opencode/skills/system-code-graph/mcp_server/dist/` | Build output |
| `.opencode/skills/system-code-graph/mcp_server/database/*.sqlite*` | Runtime database files; not docs |
| `.opencode/skills/system-code-graph/.opencode/` | Runtime cache; not docs |
| `.opencode/skills/system-code-graph/package-lock.json` | Lockfile |
<!-- /ANCHOR:excluded -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

**Scope mode**: Parent-aggregate. This single map covers preflight scope for parent + all three planned children. No per-child resource-maps will be authored until each child folder is scaffolded post-research.

**Convergence emission**: The deep-research workflow emits a second `research/resource-map.md` at convergence with discovered resources. That map is separate from this preflight map and may add paths this map didn't anticipate (e.g. sk-doc references the research surfaces, additional changelog entries).

**Updates**: Treat this map as immutable for the duration of the deep-research run. Post-convergence, children may extend with their own resource-maps at the child level.
<!-- /ANCHOR:author-instructions -->
