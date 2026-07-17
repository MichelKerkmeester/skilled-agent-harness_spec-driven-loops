---
title: "Implementation Summary: INSTALL-GUIDE canonical filename normalization (sk-doc 021)"
description: "Completed migration: 14 skill install-guide files renamed to INSTALL-GUIDE.md, an additive classifier hyphen-stem recognition so they still type as install_guide, and .md-suffixed filename reference updates, preserving the install_guide doc-type contract and prose."
trigger_phrases:
  - "install-guide normalization summary"
  - "INSTALL-GUIDE migration complete"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/021-install-guide-canonical-naming"
_memory:
  continuity:
    packet_pointer: "sk-doc/021-install-guide-canonical-naming"
    last_updated_at: "2026-07-17T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed the INSTALL-GUIDE migration; classifier test PASS, suite pre-existing-red baselined"
    next_safe_action: "Commit path-scoped and push"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: INSTALL-GUIDE canonical filename normalization

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

<!-- ANCHOR:outcome -->
## 1. OUTCOME

All skill install-guide documents now use the single canonical filename `INSTALL-GUIDE.md` (uppercase like `README.md`/`CHANGELOG.md`,
hyphenated per the naming program), resolving three prior casings. The change is a documentation rename plus a one-line additive
classifier update; no behavioral logic changed.
<!-- /ANCHOR:outcome -->

<!-- ANCHOR:changes -->
## 2. WHAT CHANGED

- **Classifier** (`validate_document.py`, `detect_document_type`): the `install_guide` branch now matches an `install-guide`
  (hyphen) stem in addition to `install_guide` (underscore), so renamed files still type as `install_guide` rather than
  downgrading to `readme`.
- **Renames (14)**: `INSTALL_GUIDE.md` (9), `install-guide.md` (3, case-only two-step), `install_guide.md` (2) → `INSTALL-GUIDE.md`,
  under `mcp-code-mode`, `mcp-tooling/{mcp-aside-devtools,mcp-mobbin,mcp-refero,mcp-chrome-devtools,mcp-click-up,mcp-click-up/references,mcp-figma}`,
  `sk-design/{design-mcp-open-design,design-md-generator}`, `system-code-graph`, `system-skill-advisor`,
  `system-spec-kit/mcp_server`, `sk-doc/manual_testing_playbook/intent_detection`.
- **References**: `.md`-suffixed filename references updated to `INSTALL-GUIDE.md` across `.opencode` (excl. `specs/`) and root `README.md`.
- **Preserved (out of scope)**: the `install_guide` doc-type identifier (classifier return, `--type` choices, deep-alignment adapter
  list, `template_rules.json` key, validator tests), the JSON `install_guide` data key, and prose mentions of the install-guide concept.
<!-- /ANCHOR:changes -->

<!-- ANCHOR:verification -->
## 3. VERIFICATION

- **Classifier (CONFIRMED)**: `detect_document_type` returns `install_guide` for `INSTALL-GUIDE.md` paths across three skills (direct test PASS).
- **No old references (CONFIRMED)**: zero `INSTALL_GUIDE.md`/`install-guide.md`/`install_guide.md` `.md`-suffixed references remain outside `specs/` (repo-wide grep = 0).
- **Over-reach (CONFIRMED reverted)**: the reference replacement matched `install_guide.md` inside the test fixture name `valid_install_guide.md`; the single over-reached reference in `test_validator.py` was reverted.
- **No link breakage (CONFIRMED)**: the markdown link-check reports no broken link whose target is a renamed install-guide file (its failures point to unrelated moved `specs/system-speckit/026-*` paths — pre-existing).
- **No test regression (CONFIRMED via baseline)**: `test_validator.py` is 0/11 both WITH and WITHOUT the classifier change (fixtures fail on unrelated rule drift, e.g. missing "overview"); the migration introduces no regression.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:followups -->
## 4. FOLLOW-UPS

- The pre-existing red `test_validator.py` suite (fixture/rule drift) is out of scope here and worth a separate fix.
- The `.worktrees/*` copies keep their old casings (separate branches); they normalize when rebased/merged.
- The uppercase-hyphen `INSTALL-GUIDE` convention could be recorded in the hyphen-naming program's decision record.
<!-- /ANCHOR:followups -->
