---
title: "Verification Checklist: NAMING LINT + DOC COMPLETENESS design-system artifact contract"
description: "P0/P1/P2 verification gate for the additive naming/doc-completeness lint: passes token_starter.md, bites a malformed name and a missing heading, exempts non-system outputs, does not flag the separate OVERVIEW backlog, holds hubRoute 23/5/0, stays evergreen."
trigger_phrases:
  - "d6-r11 naming lint doc completeness"
  - "naming lint design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/011-naming-lint-doc-completeness"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every naming/doc lint checklist item and record evidence"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-foundations/references/design_system_artifact_contract.md"
      - ".opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py"
      - ".opencode/skills/sk-design/design-foundations/scripts/fixtures/naming_doc/violating.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: NAMING LINT + DOC COMPLETENESS design-system artifact contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Spec deliverable read: conditional contract (naming regexes, token tiers, required doc headings) for token/component/library outputs only + a deterministic lint over names + headings
  - **Evidence**: spec §3/§4 + §5 acceptance restated in plan §1
- [x] CHK-002 [P0] Baseline captured: no existing contract page / lint script; `token_starter.md` token names + headings enumerated as the must-pass set
  - **Evidence**: plan §1 "Verified baseline"; 25 names + COLOR RAMP/TYPE SCALE/SPACING SCALE/HAND OFF enumerated; `token_starter.md`/`design_token_vocabulary.md` byte-unchanged in `git status`
- [x] CHK-003 [P1] Three design decisions resolved: applicability marker, regex shape, fixture-pair vs scratch probe
  - **Evidence**: decisions noted in plan §6 + spec §7 — artifactKind-or-table marker, per-tier regexes, committed fixture pair
- [x] CHK-004 [P1] Tiers/regexes derived to pass `token_starter.md` as-shipped; required headings are a subset of its content headings
  - **Evidence**: `token_starter.md` exits 0 (25 names tiered, 4 headings present); required headings ⊆ ramp/type/spacing/handoff

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] New contract page exists under `design-foundations/references/` with token tiers, per-tier naming regexes, required doc headings, and compliant + anti examples
  - **Evidence**: `design_system_artifact_contract.md` present — 8 tiers, per-kind headings, §3 Compliant Shape + §4 Anti-Examples
- [x] CHK-011 [P0] New lint exists under `design-foundations/scripts/`: file arg + `--json`; exit 0 pass/exempt, 1 violation, 2 usage/read (sibling Python convention)
  - **Evidence**: `naming_doc_check.py` reuses `_clean_cell`/`_split_table_row`; `--json` branch present; exit 0/1/2 verified; `py_compile` OK
- [x] CHK-012 [P1] Applicability gate present: a non-marker file exits 0 NOT_APPLICABLE; only design-system artifacts are linted
  - **Evidence**: `_detect_artifact`; `design_token_vocabulary.md` → NOT_APPLICABLE, exit 0 (CHK-023)
- [x] CHK-013 [P1] Lint follows existing patterns (row/heading parse helpers, numeric-prefix-tolerant heading match); standard library only, no new packages
  - **Evidence**: helpers mirror sibling `.py` checkers; imports are stdlib only (`json`, `pathlib`, `re`, `sys`, `typing`)

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Pass-on-clean: lint run against `assets/token_starter.md` exits 0 (every declared name conforms; every required heading present)
  - **Evidence**: `naming_doc_check.py assets/token_starter.md` → `artifact kind: token`, 25 names, 4 headings, PASS, exit 0
- [x] CHK-021 [P0] Naming bite: a token artifact with a malformed name (e.g., `--PrimaryColor` / `--color_primary` / off-allowlist category) exits 1 with the offender reported
  - **Evidence**: `violating.md` → exit 1; reports `--PrimaryColor` (camelCase), `--color_primary` (underscore), `--clr-primary` (off-allowlist)
- [x] CHK-022 [P0] Doc-completeness bite: a token artifact missing a required heading exits 1 with the missing heading reported
  - **Evidence**: `violating.md` → exit 1; reports `missing heading SPACING SCALE`
- [x] CHK-023 [P0] Non-system exemption: a non-design-system markdown exits 0 NOT_APPLICABLE (no name/heading violations)
  - **Evidence**: `naming_doc_check.py shared/design_token_vocabulary.md` → `NOT_APPLICABLE`, exit 0
- [x] CHK-024 [P1] Usage/read errors exit 2 (missing arg / unreadable path)
  - **Evidence**: no-arg run → exit 2; bad-path run → exit 2

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: instance-only; this phase is an additive port (3 NEW files) and produces no code-defect findings to classify
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; the change set is exactly the 3 new files, and an evergreen grep over them found no spec/packet/phase IDs
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: no existing consumer is touched — the lint is a standalone stdlib-only script; the only inputs it reads (`token_starter.md`, `design_token_vocabulary.md`, `SKILL.md`) are byte-unchanged
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: adversarial cases executed — malformed names (camelCase/underscore/off-allowlist) → exit 1, missing heading → exit 1, non-artifact no-op → NOT_APPLICABLE exit 0, no-arg/bad-path → exit 2; the lint reads only the single passed path and never writes
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: matrix is 6 rows — `token_starter.md` PASS (exit 0), `compliant.md` PASS (exit 0), `violating.md` naming+heading bite (exit 1), `design_token_vocabulary.md` NOT_APPLICABLE (exit 0), sk-design `SKILL.md` NOT_APPLICABLE (exit 0), no-arg/bad-path usage error (exit 2)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; the lint reads only the single markdown path passed as `argv` and no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: evidence pinned to the 3 new files (`design_system_artifact_contract.md`, `naming_doc_check.py`, `fixtures/naming_doc/{compliant,violating}.md`) shown as untracked (`??`) in `git status`

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No secrets, tokens, or external network calls introduced; the lint reads only local markdown
  - **Evidence**: imports are stdlib only (`json`/`pathlib`/`re`/`sys`/`typing`); the only I/O is `path.read_text` on the passed file
- [x] CHK-031 [P1] No auto-fix/mutation path: the lint reports only; it never rewrites the artifact it lints
  - **Evidence**: no write call in the script; `token_starter.md` byte-unchanged after every run (`git status` clean)

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist synchronized; exact targets (references contract page + scripts lint) and the read-only/out-of-scope set reflected
  - **Evidence**: spec §3 Files to Change, plan §3 targets, tasks T005-T015, and this checklist all name the same 3 files; read-only/out-of-scope set consistent
- [x] CHK-041 [P0] Evergreen [HARD]: no spec path, phase number, or artifact id in the contract page, the lint, or fixtures (no SKILL.md line was added)
  - **Evidence**: grep of the 3 new files for `specs/` and phase ids → none
- [x] CHK-042 [P2] Contract page reads cleanly alongside the existing foundations references; rules described durably, not as a build narration
  - **Evidence**: manual read — the page states tiers/headings/examples as durable rules, no build narration

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Scope-lock: the lint does NOT flag the ~22 skill/reference docs lacking `## OVERVIEW` (separate template-conformance backlog); only design-system artifacts evaluated
  - **Evidence**: sk-design `SKILL.md` (backlog representative) → `NOT_APPLICABLE`, exit 0; the applicability gate exempts non-artifacts
- [x] CHK-051 [P0] No-regression: `hub-router.json` / `mode-registry.json` byte-unchanged; `token_starter.md` byte-unchanged; `hubRoute` 23 pass / 5 known-gap / 0 regression held
  - **Evidence**: `git status` shows only 3 new untracked files; routing files not read/written so `hubRoute` is unaffected by construction
- [x] CHK-052 [P1] Only in-scope additive files added (contract page, lint, fixtures); no scratch artifacts left
  - **Evidence**: `git status` shows exactly the contract page, the lint, and `fixtures/naming_doc/`; no scratch directory present

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent (post-build verification of the delivered contract page, the `naming_doc_check.py` lint, and the fixture pair)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Fix-completeness: pass-on-clean + naming bite + doc-completeness bite + non-system exemption all covered;
the separate OVERVIEW backlog is NOT flagged; no-regression (hubRoute 23/5/0, registry + token_starter identity) and evergreen gated
-->
