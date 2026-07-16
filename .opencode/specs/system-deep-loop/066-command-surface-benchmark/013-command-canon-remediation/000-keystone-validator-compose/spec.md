---
title: "Feature Specification: keystone — compose frontmatter validation into --type command"
description: "Composes the frontmatter and behavioral checks that today live only in quick_validate.py into the canonical validate_document.py --type command path, keyed by template_rules.json, so every canon frontmatter rule fires on the one path command authors validate against while section-presence behavior and every currently-conformant command are preserved."
status: in_progress
trigger_phrases:
  - "keystone validator compose"
  - "frontmatter validation type command"
  - "quick_validate compose"
importance_tier: "critical"
contextType: "implementation"
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
    open_questions:
      - "Compose via a shared module or call quick_validate's checks directly?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: keystone — compose frontmatter validation into `--type command`

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-07-16 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`validate_document.py --type command` — the checker command authors run — verifies section *presence* but runs zero frontmatter checks. The frontmatter and behavioral logic lives in a separate entrypoint, `quick_validate.py`, that is not composed into the `--type command` path. Consequently every canon frontmatter rule — description length, tool-name format, argument-hint budget, and the invariants added by later phases — is a dead letter on the only path authors validate against. Per-rule fixes elsewhere cannot help until this composition exists, which is why both research lineages named this composition the keystone: it is the enabler the rest of the remediation tier depends on.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Compose the existing frontmatter checks into the canonical `--type command` validation path, driven by `template_rules.json`.
- Ensure a failing frontmatter invariant fails the run with a clear message rather than passing silently.
- Preserve the current section-presence behavior on the `--type command` path.

**Out of scope:**
- Adding new semantic invariants, which are the subject of later phases.
- Touching command files or any authored command content.
- Changing the benchmark adapter or the conformance/behavior engines.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** The `--type command` path executes the frontmatter checks currently in `quick_validate.py` — either directly or through a shared module both entrypoints call — keyed by `template_rules.json`.
- **REQ-002 (P0):** No regression to the existing section-presence checks or to any other `--type` document class.
- **REQ-003 (P1):** Composition is behavior-preserving for already-conformant commands, which continue to exit 0.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A command with a 2000-char `description` fails `validate_document.py --type command`, where today it passes.
- A command with a bare, non-fully-qualified MCP tool token fails on the canonical path.
- Every currently-conformant command still exits 0 on `--type command`.
- `quick_validate.py` and `--type command` no longer disagree on frontmatter for the same file.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Blast radius is low: the phase composes two existing validators rather than authoring new logic, and it does not touch command files.
- Regression risk on other `--type` classes is contained by keying the composed checks on `template_rules.json` and by the acceptance criterion that conformant commands still exit 0.
- No dependency on the sibling research phase; this phase unblocks the entire semantic-validation tier that follows it.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether to compose via a shared module that both entrypoints import, or to call `quick_validate.py`'s checks directly from the `--type command` path.
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: none (first phase). Successor: 001-versioned-command-contract.
