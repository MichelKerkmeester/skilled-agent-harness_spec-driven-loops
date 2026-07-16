---
title: "Implementation Summary: keystone frontmatter-validation composition"
description: "Composed the quick_validate.py frontmatter checks onto the canonical validate_document.py --type command path via a shared-leaf import, adding a fully-qualified MCP-token check; both negative fixtures fail, the conformant corpus is unchanged, and the two validators agree."
status: complete
trigger_phrases:
  - "keystone composition implementation"
  - "frontmatter validation compose status"
  - "type command frontmatter checks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/000-keystone-validator-compose"
    last_updated_at: "2026-07-16T11:30:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped --type command frontmatter validation; four gates green, zero regression"
    next_safe_action: "Open 001-versioned-command-contract"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/shared/scripts/quick_validate.py"
      - ".opencode/skills/sk-doc/shared/assets/template_rules.json"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Compose via a shared module both entrypoints import (quick_validate is the leaf; validate_document imports its primitives)"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 000-keystone-validator-compose |
| **Status** | Complete |
| **Completed** | 6 of 6 tasks; all four acceptance gates verified, zero conformant regression |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The command frontmatter checks now fire on the canonical `--type command` path that authors and the deep-alignment adapter run. Before this phase the `command` block in `template_rules.json` declared `frontmatterRequired: true` and `frontmatterFields.required`, but `validate_document()` had no `command` dispatch branch — so the config was dead and `--type command` validated section structure only.

The composition uses a shared-leaf pattern: `quick_validate.py` (the leaf) gained the reusable primitives, and `validate_document.py` imports them into a new command validator so the two entrypoints share one implementation and cannot drift.

The new command validator is **presence-conditional**: files that resolve to the command type but carry no frontmatter (compiled contract artifacts, legacy bodies, folder READMEs) are left to their own structural rules, so no artifact newly blocks. It enforces the required fields, the description budget (soft 110 / hard 1536), YAML-multiline rejection, and — the one new invariant carried forward from the asset-layer research — that any `mcp_`-namespaced allowed-tools token is a fully-qualified `mcp__<server>__<tool>` reference. The command surface's comma-separated allowed-tools list and `<arg>` placeholder notation in descriptions are accepted by design.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/shared/scripts/quick_validate.py` | Modified | Added `is_non_fq_mcp_token` / `iter_allowed_tools` helpers; made the allowed-tools array-form, angle-bracket, and name requirements command-aware so the two validators agree on command frontmatter |
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Modified | Imported the shared primitives; added `validate_command_frontmatter()` and dispatched it under `if doc_type == 'command'` |
| `tasks.md` | Updated | Six tasks marked complete with evidence |
| `implementation-summary.md` | Updated | This shipped-state summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Recon grounded every design choice in the real corpus before any edit: the whole command corpus uses comma-form allowed-tools (not the skill `[array]` form), no command carries `name:`, two doctor commands carry `<arg>` brackets in their description, and a first-cut MCP regex false-flagged every valid token because segment names contain single underscores. Those findings set the command-lenient rules (comma form, optional name, angle-bracket warning) and the corrected `__`-split fully-qualified matcher. The checks were then composed onto `--type command` and exercised against negative fixtures and the full corpus.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat this composition as the keystone | Every canon frontmatter rule is a dead letter on the `--type command` path until the checks are composed there; both research lineages named it first |
| Shared-leaf import over a direct call or a copy | `quick_validate.py` owns the primitives and `validate_document.py` imports them, so the two paths share one implementation and cannot drift |
| Presence-conditional command validation | Compiled/legacy artifacts under commands/ legitimately have no frontmatter and currently pass; blocking them on a missing block would regress the conformant set |
| Command-lenient allowed-tools + angle brackets | The command surface canonically uses comma-form tool lists and `<arg>` placeholder notation; the skill `[array]` and hard angle-bracket rules stay skill-only |
| Fold the fully-qualified MCP check in now | A bare or server-only `mcp_` token is an under-specified permission; the corpus is already clean, so the check adds a guardrail with zero conformant regression |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Composition implemented | DONE — `validate_command_frontmatter()` dispatched on `--type command` |
| Over-length description fails `--type command` | PASS — 2000-char description returns exit 1 (`command_description_over_hard_cap`) |
| Bare MCP tool token fails on canonical path | PASS — `mcp__mk_goal` returns exit 1 (`command_allowed_tools_non_fq_mcp`); `mk_goal` plugin token and fully-qualified tokens pass |
| Conformant commands still exit 0 | PASS — corpus 42/9 unchanged with the identical pre-existing failing set |
| `quick_validate.py` and `--type command` agree | PASS — both VALID on a clean command, both INVALID citing the same non-FQ-MCP reason on a bad one (sections held constant) |
| Skill behavior preserved | PASS — skills still hard-fail angle brackets and still require name/version; `test_quick_validate_086.py` passes |
| Strict packet validation | Run `validate.sh --strict` on this folder — Errors: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Canonical entrypoint only.** The composed checks run correctly through `.opencode/skills/sk-doc/shared/scripts/validate_document.py`. The sibling `scripts/validate_document.py` symlink still mis-resolves `template_rules.json` (exit 2) via its unresolved `__file__` — a pre-existing entrypoint bug that predates this phase and reproduces identically on HEAD. It is out of this phase's scope; all callers should invoke the `shared/scripts/` path, which the deep-alignment adapter already does.
2. **MCP fully-qualification is namespace-scoped.** The check flags only `mcp_`-namespaced tokens that fail the `mcp__<server>__<tool>` form. A non-namespaced plugin tool referenced by a bare name (for example `mk_goal`) is intentionally left alone, since it is a legitimate OpenCode plugin token rather than an MCP tool.
<!-- /ANCHOR:limitations -->
