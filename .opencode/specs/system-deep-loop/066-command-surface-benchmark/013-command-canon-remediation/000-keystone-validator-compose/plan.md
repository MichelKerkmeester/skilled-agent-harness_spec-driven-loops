---
title: "Implementation Plan: keystone frontmatter-validation composition"
description: "Plan to compose the frontmatter checks in quick_validate.py into the canonical validate_document.py --type command path, keyed by template_rules.json, preserving section-presence behavior and every currently-conformant command."
status: in_progress
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/000-keystone-validator-compose"
    last_updated_at: "2026-07-16T08:00:35Z"
    last_updated_by: "claude"
    recent_action: "Authored keystone phase spec, plan, tasks, and scaffold docs"
    next_safe_action: "Read validate_document.py and quick_validate.py to plan composition"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/shared/scripts/quick_validate.py"
      - ".opencode/skills/sk-doc/shared/assets/template_rules.json"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: keystone frontmatter-validation composition

<!-- ANCHOR:summary -->
## 1. SUMMARY

Compose the frontmatter and behavioral checks that today run only inside `quick_validate.py` into the canonical `validate_document.py --type command` path, keyed by `template_rules.json`. A failing frontmatter invariant must fail the `--type command` run; section-presence behavior and every currently-conformant command must be preserved. This phase writes no new invariants — it wires existing checks onto the one path authors validate against.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- A command with a 2000-char `description` fails `validate_document.py --type command`, where today it passes.
- A command with a bare, non-fully-qualified MCP tool token fails on the canonical path.
- Every currently-conformant command still exits 0 on `--type command`.
- `quick_validate.py` and `--type command` agree on frontmatter for the same file.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two entrypoints validate command docs today: `quick_validate.py` owns the frontmatter and behavioral checks, and `validate_document.py --type command` owns section-presence but skips frontmatter entirely. The keystone is a single composition seam: the frontmatter checks are keyed by `template_rules.json` and must fire on the `--type command` path. The preferred shape is a shared module that both entrypoints import, so the two paths cannot drift again; a direct call from `--type command` into the existing checks is the fallback. Either way the section-presence logic is left intact and the composed checks run in addition to it, not in place of it.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Locate and characterize the two paths
Read `validate_document.py` and `quick_validate.py` in full, map exactly which frontmatter checks quick-validate runs, and confirm how `template_rules.json` keys them. Establish the current behavior baseline: which commands pass each path today.

### Phase 2: Compose the checks onto the canonical path
Extract or reference the frontmatter checks so `--type command` executes them keyed by `template_rules.json`, with a failing invariant failing the run and a clear message. Prefer a shared module both entrypoints call; keep section-presence behavior unchanged.

### Phase 3: Verify no regression and no disagreement
Prove the two success cases fail (2000-char description; bare MCP tool token), prove every conformant command still exits 0, and prove `quick_validate.py` and `--type command` agree on frontmatter for the same file.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run `validate_document.py --type command` across the current command corpus to capture a pass/fail baseline before and after the change. Add two negative fixtures — an over-length `description` and a bare MCP tool token — that must fail on the canonical path. Re-run `quick_validate.py` on the same files and diff the frontmatter verdicts to prove the two paths agree.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Depends only on the existing `validate_document.py`, `quick_validate.py`, and `template_rules.json`; there is no dependency on the sibling research phase. This phase feeds the semantic-validation tier, whose per-rule invariants are dead letters until this composition exists.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert by removing the composition seam — the shared module or the direct call — from the `--type command` path, restoring `validate_document.py` to section-presence-only behavior and leaving `quick_validate.py` and `template_rules.json` untouched.
<!-- /ANCHOR:rollback -->
