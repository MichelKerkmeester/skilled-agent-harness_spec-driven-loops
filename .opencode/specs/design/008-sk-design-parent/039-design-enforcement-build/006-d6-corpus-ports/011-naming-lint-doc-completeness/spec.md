---
title: "D6-R11 — Naming lint + doc completeness contract"
description: "Add a conditional design-system artifact contract (token tiers, per-tier naming regexes, required doc headings) plus a deterministic naming_doc_check.py lint for token/component/library outputs only. An applicability gate runs the lint solely on a marked design-system artifact and exempts every non-system doc, including the 22-file OVERVIEW backlog."
trigger_phrases:
  - "d6-r11 naming lint doc completeness"
  - "naming lint design build"
  - "design-system artifact contract"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/011-naming-lint-doc-completeness"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade the spec to the Level 2 contract and mark the naming/doc lint complete"
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
# Feature Specification: D6-R11 — Naming lint + doc completeness contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Enforcement class** | enforceable |
| **Dimension** | D6 — Corpus Ports |
| **Completed** | 2026-06-29 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-design has a token-category vocabulary (`shared/design_token_vocabulary.md`) and a fill-in token scaffold (`assets/token_starter.md`), but no enforceable contract for how design-system outputs must be named or which documentation sections they must carry. A token or component artifact can therefore ship with inconsistent names or a missing handoff section and nothing bites. The motivating corpus prescribes documented naming rules on a single reference page plus automated name linting.

### Purpose
Add a conditional naming + doc-completeness contract that applies only to design-system artifacts, backed by a deterministic lint that passes the clean surface, bites a malformed name or a missing required heading, and exempts every non-system output.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A contract reference page under `design-foundations/references/` defining token tiers, one naming regex per tier, and the required doc headings per artifact kind (token/component/library).
- A deterministic lint (`naming_doc_check.py`) with an applicability gate: it lints only a marked design-system artifact and exits `NOT_APPLICABLE` on everything else.
- A committed fixture pair (`compliant.md` / `violating.md`) that makes the pass and the bite permanently provable.

### Out of Scope
- The 22-file `## OVERVIEW` template-conformance backlog - a separate skill-doc concern; the applicability gate exempts non-artifacts so the backlog is never reached.
- Editing `token_starter.md` or `design_token_vocabulary.md` - read-only inputs; the regexes are derived to pass `token_starter.md` as-shipped.
- Routing artifacts (`hub-router.json` / `mode-registry.json`) - not read or written; `hubRoute` is unaffected by construction.
- Any auto-fix or mutation path - the lint reports only and never rewrites the artifact it lints.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-foundations/references/design_system_artifact_contract.md` | Create | Token tiers, per-tier naming regexes, required doc headings, compliant + anti examples |
| `.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py` | Create | The lint: applicability gate, name extraction + regex check, required-heading presence check, text/`--json`, exit 0/1/2 |
| `.opencode/skills/sk-design/design-foundations/scripts/fixtures/naming_doc/compliant.md` | Create | A marked token artifact that passes |
| `.opencode/skills/sk-design/design-foundations/scripts/fixtures/naming_doc/violating.md` | Create | A marked token artifact with malformed names + a missing heading (the permanent bite) |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A contract page defines token tiers, per-tier naming regexes, and required doc headings | `design_system_artifact_contract.md` present, evergreen, with a compliant and an anti example |
| REQ-002 | A deterministic lint takes a markdown path + `--json` and exits 0/1/2 | `naming_doc_check.py` matches the sibling Python checker convention; `py_compile` passes |
| REQ-003 | Pass-on-clean on the real surface | `naming_doc_check.py assets/token_starter.md` exits 0 (all 25 names conform, all 4 required headings present) |
| REQ-004 | Bite on a violation | The violating fixture exits 1 with the malformed names AND the missing heading reported |
| REQ-005 | Non-system exemption (incl. the OVERVIEW backlog) | A non-artifact markdown exits 0 `NOT_APPLICABLE`; the 22-file backlog is never flagged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Purely additive, no existing file edited | Only the contract page, the lint, and the fixture pair are added; `token_starter.md` and both `SKILL.md` byte-unchanged |
| REQ-007 | Evergreen body | The contract, the lint, and the fixtures carry no spec id, path, or phase number |
| REQ-008 | Report-only, no mutation | The lint has no write path; the artifact it lints stays byte-unchanged after a run |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `naming_doc_check.py assets/token_starter.md` returns `artifact kind: token`, 25 token names, all four required headings, PASS at exit 0.
- **SC-002**: `naming_doc_check.py scripts/fixtures/naming_doc/violating.md` exits 1 reporting `--PrimaryColor`, `--color_primary`, `--clr-primary`, and a missing SPACING SCALE heading.
- **SC-003**: `naming_doc_check.py shared/design_token_vocabulary.md` returns `NOT_APPLICABLE` at exit 0; a sk-design `SKILL.md` (OVERVIEW-backlog representative) is likewise NOT_APPLICABLE at exit 0.
- **SC-004**: No-arg and bad-path runs both exit 2; `python3 -m py_compile scripts/naming_doc_check.py` exits 0.
- **SC-005**: The change is 3 NEW files with zero edits to any existing file; `token_starter.md`, `design_token_vocabulary.md`, and both `SKILL.md` are byte-unchanged.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Conditional applicability could under- or over-reach | A too-broad gate flags the 22-file OVERVIEW backlog; a too-narrow gate misses real artifacts | The gate keys on an explicit `artifactKind` marker OR a token table plus the full token-heading set; non-artifacts return NOT_APPLICABLE, so the backlog is exempt by construction |
| Risk | Heading presence is mistaken for documentation substance | A reviewer reads a green lint as "the doc is complete" | The contract states presence checks are not substance checks; doc substance stays advisory |
| Risk | A well-formed name is mistaken for the right concept | Shape-valid but semantically wrong names pass | Naming taste (is `--color-primary` the tasteful role) is advisory and not machine-decidable; only name shape is enforced |
| Dependency | `assets/token_starter.md` | The one artifact on the surface; its names + headings are the must-pass set | Read-only, green; the regexes are derived to pass it as-shipped |
| Dependency | `shared/design_token_vocabulary.md` | The token-category SSOT the tiers derive from | Read-only, green; it is a vocabulary page, not an artifact, so the lint must NOT lint it |
| Dependency | Python standard library | Required to run the lint | Green; stdlib only, no new packages, mirrors the sibling `.py` checkers |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: For a non-artifact input the lint returns a fixed benign pass (`NOT_APPLICABLE`, exit 0); the result depends only on the file content, not on run order or environment.

### Backward Compatibility
- **NFR-B01**: The change is two new authored files plus a fixture pair; `token_starter.md`, `design_token_vocabulary.md`, `design-foundations/SKILL.md`, and `sk-design/SKILL.md` keep their bytes, so every existing consumer is unaffected.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Applicability Boundaries
- **No marker**: a markdown without `artifactKind` frontmatter and without a token-table-plus-headings shape → `NOT_APPLICABLE`, exit 0.
- **Vocabulary page**: `design_token_vocabulary.md` lists categories but is not an artifact → `NOT_APPLICABLE`, exit 0.
- **OVERVIEW backlog**: a skill/reference doc lacking an artifact marker → never linted, never flagged.

### Defect Boundaries
- **Malformed name**: camelCase (`--PrimaryColor`), underscore (`--color_primary`), or off-allowlist category (`--clr-primary`) on an applicable artifact → exit 1 with a per-name reason.
- **Missing required heading**: a token artifact missing COLOR RAMP, TYPE SCALE, SPACING SCALE, or HAND OFF → exit 1 with the missing heading named.
- **Usage/read error**: no argument or an unreadable path → exit 2.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One new reference page, one new lint script, and one fixture pair; nothing existing is edited.
- **Risk concentration**: Regression risk is eliminated by construction - the lint is a standalone read-only module that is a no-op for any non-artifact, and the three target files are new and additive. The controlling guards are the applicability gate and the additive-only diff.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the lint also close the 22-file `## OVERVIEW` template-conformance backlog? **RESOLVED: No. Those docs are not design-system artifacts; the applicability gate exempts them by construction (no `artifactKind` marker, no token-table-plus-headings shape). OVERVIEW conformance is a separate effort and MUST NOT be flagged here. Confirmed: a sk-design `SKILL.md` returns NOT_APPLICABLE at exit 0.**
- How much does the lint actually enforce versus advise? **RESOLVED: Code-enforced is name SHAPE plus heading PRESENCE on an applicable artifact - a malformed name or a missing required heading fails closed. Advisory is whether a well-formed name is the right concept (naming taste) and whether a present heading documents complete, correct content (heading presence is not substance). The split is stated in the contract page and §6 risks.**
- Is the executable lint in scope given spec §3 named only the references directory? **RESOLVED: Yes. spec §3 named `design-foundations/references/` as the contract-page location, but spec §4 ("provide a deterministic lint over names + required headings") and §5 ("fails the lint" / "a compliant artifact passes") mandate the executable lint, so the lint script and the fixtures are in-scope enforcement targets - exactly as the sibling foundations checkers pair a reference page with an executable check. This target-derivation reasoning is recorded so the broader scope is honest.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Conditional design-system artifact contract + naming_doc_check.py + a committed fixture pair
- token_starter.md passes (exit 0), the violating fixture bites (exit 1), non-system docs incl. the 22-file OVERVIEW backlog stay exempt
- Name + heading SHAPE code-enforced; naming taste + doc substance advisory; target-derivation honesty recorded
-->
