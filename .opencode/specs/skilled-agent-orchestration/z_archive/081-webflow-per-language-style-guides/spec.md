---
title: "Feature Specification: Refactor sk-code Webflow style guides to per-language structure mirroring opencode"
description: "sk-code's Webflow reference tree mixes JS, CSS, and HTML rules in monolithic standards/ files; opencode side has per-language directories. Refactor Webflow to mirror that pattern so models can load language-specific rules without cross-language noise and findings can cite per-language files."
trigger_phrases:
  - "099"
  - "webflow per-language style guides"
  - "sk-code webflow refactor"
  - "css_style_guide"
  - "js_style_guide"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/081-webflow-per-language-style-guides"
    last_updated_at: "2026-05-09T15:10:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored Level 3 spec scope and migration map"
    next_safe_action: "Author plan.md with execution sequence"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/references/webflow/standards/code_style_guide.md"
      - ".opencode/skills/sk-code/references/webflow/standards/code_style_enforcement.md"
      - ".opencode/skills/sk-code/references/webflow/standards/code_quality_standards.md"
      - ".opencode/skills/sk-code/references/webflow/standards/quick_reference.md"
      - ".opencode/skills/sk-code/references/webflow/standards/shared_patterns.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "099-author-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Spec folder location → new 099 packet under skilled-agent-orchestration"
      - "Layout choice → full opencode mirror (per-language flat dirs)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Refactor sk-code Webflow style guides to per-language structure mirroring opencode

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The sk-code skill currently bundles JavaScript, CSS, and HTML style rules into five monolithic files under `references/webflow/standards/` (3,831 lines total), while the equivalent opencode-side reference tree is split per-language (`references/opencode/{javascript,typescript,python,shell,config,shared}/`). This asymmetry forces models to load mixed-language rule docs and increases the risk of mis-attributing rules across languages — a hypothesized cause of GPT 5.5's observed failure to apply correct CSS/JS comment style on Webflow tasks. This packet refactors the Webflow reference tree to mirror opencode's per-language layout and updates all cross-references and routing logic to match.

**Key Decisions**: (1) Mirror opencode's flat per-language directory structure exactly (`webflow/{javascript,css,html,shared}/`) rather than nesting language dirs inside the existing `standards/` category. (2) DELETE the original five `standards/*.md` files after content is migrated — no archive, no `.old`, no commented-out backups (per constitutional `feedback_delete_not_archive_or_comment.md`).

**Critical Dependencies**: sk-code's smart router (`SKILL.md` §2 + `references/router/resource_loading.md`) must be updated atomically with the file moves so existing dispatches don't break between commits.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-09 |
| **Branch** | `main` (per memory `feedback_stay_on_main_no_feature_branches.md`) |
> **Status note:** This archived packet retains its differing historical status fields as a record of the states captured at separate points in the original work.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-code's `references/webflow/standards/` directory contains five monolithic markdown files mixing JS, CSS, and HTML rules (3,831 lines). The equivalent opencode-side tree (`references/opencode/{javascript,typescript,python,shell,config,shared}/`) is split per-language. This asymmetry (a) forces a model that needs only CSS rules to load JS noise, (b) increases mis-attribution risk where JS rules get applied to CSS or vice versa, (c) makes findings citations less precise (`code_style_guide.md §6.2 CSS subsection` vs the cleaner `css/style_guide.md §3`), and (d) breaks the symmetry that downstream tooling (smart router, manual playbook, sk-code-review) expects.

### Purpose
Restructure `references/webflow/` to mirror `references/opencode/`'s per-language layout, so language-specific rules load independently, cross-language rules live in one shared location, and the routing/citation surface is symmetric across both stacks.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `references/webflow/javascript/` with `style_guide.md`, `quality_standards.md`, `quick_reference.md` (extracted from JS sections of the five source files)
- Create `references/webflow/css/` with `style_guide.md`, `quality_standards.md`, `quick_reference.md` (extracted from CSS sections)
- Create `references/webflow/html/` with `style_guide.md` (extracted HTML/markup conventions; smaller because Webflow Designer manages most HTML)
- Create `references/webflow/shared/` with `cross_language_rules.md` (file naming, comment WHY-not-WHAT, no commented-out code, file-header banner principles), `enforcement.md` (refactored from `code_style_enforcement.md`), `dev_workflow.md` (from `shared_patterns.md` — DevTools, Logging, Testing, Automation, Browser Compat)
- Update `.opencode/skills/sk-code/SKILL.md` and `references/router/resource_loading.md` to route to the new per-language paths
- Update three known external cross-references: `references/universal/code_style_guide.md`, `manual_testing_playbook/07--cross-stack-routing/005-snippet-reuse-cross-stack.md`, `assets/webflow/checklists/code_quality_checklist.md`
- DELETE the five original files: `code_style_guide.md`, `code_style_enforcement.md`, `code_quality_standards.md`, `quick_reference.md`, `shared_patterns.md` and the empty `standards/` directory

### Out of Scope
- Restructuring `references/webflow/{implementation,debugging,deployment,performance,verification}/` — these categorical workflow dirs stay as-is (only the per-language style/standards/quick-reference docs move)
- Changes to opencode-side reference tree — already in target shape
- Changes to actual style rules content — this is a structural split, NOT a rule rewrite. Every rule that exists today must continue to exist (in its new home), with semantic equivalence
- Probing whether GPT 5.5 actually utilizes the new structure better — that's a follow-on packet (left as recommendation in implementation-summary)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `references/webflow/standards/code_style_guide.md` | DELETE | After content split into javascript/, css/, html/ style_guides |
| `references/webflow/standards/code_style_enforcement.md` | DELETE | After refactored into shared/enforcement.md |
| `references/webflow/standards/code_quality_standards.md` | DELETE | After content split into javascript/, css/ quality_standards |
| `references/webflow/standards/quick_reference.md` | DELETE | After content split into javascript/, css/ quick_reference |
| `references/webflow/standards/shared_patterns.md` | DELETE | After content moved to shared/dev_workflow.md |
| `references/webflow/standards/` (empty dir) | DELETE | Once all five files removed |
| `references/webflow/javascript/style_guide.md` | CREATE | JS naming, file header, formatting, JSDoc, debug logging |
| `references/webflow/javascript/quality_standards.md` | CREATE | Initialization, DOM safety, async, observers, validation, performance, animation, state management, cleanup, document listener, WeakMap caching |
| `references/webflow/javascript/quick_reference.md` | CREATE | JS workflows, code snippets, one-liners, debugging |
| `references/webflow/css/style_guide.md` | CREATE | BEM naming, custom properties, attribute selectors, animation CSS, file organization |
| `references/webflow/css/quality_standards.md` | CREATE | will-change, GPU acceleration, easing, fluid typography + the four CSS enforcement subsections (7.1-7.4 from current enforcement doc) |
| `references/webflow/css/quick_reference.md` | CREATE | Webflow tokens, form validation classes, reduced motion, focus detection, decision matrix |
| `references/webflow/html/style_guide.md` | CREATE | Data-attribute conventions, semantic HTML patterns, ARIA basics relevant to Webflow Designer output |
| `references/webflow/shared/cross_language_rules.md` | CREATE | File naming, comment WHY-not-WHAT principle, no commented-out code rule, file-header banner consistency, related-resources index |
| `references/webflow/shared/enforcement.md` | CREATE | Refactored from code_style_enforcement.md — general workflow + per-language gate selection |
| `references/webflow/shared/dev_workflow.md` | CREATE | DevTools, logging standards, testing requirements, automation patterns, error patterns, browser compatibility |
| `.opencode/skills/sk-code/SKILL.md` | MODIFY | Update §2 routing references for WEBFLOW surface to point at per-language paths |
| `.opencode/skills/sk-code/references/router/resource_loading.md` | MODIFY | Update WEBFLOW resource map to per-language structure |
| `.opencode/skills/sk-code/references/universal/code_style_guide.md` | MODIFY | Update cross-ref to webflow paths |
| `.opencode/skills/sk-code/manual_testing_playbook/07--cross-stack-routing/005-snippet-reuse-cross-stack.md` | MODIFY | Update cross-ref |
| `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | MODIFY | Update cross-ref |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every rule in the five source files exists semantically in exactly one new file | Manual diff: for each section heading in each source file, locate its content (verbatim or restructured) in the new tree. No content lost, no content duplicated across new files. |
| REQ-002 | Cross-language rules live ONLY in `shared/` | grep for the five canonical cross-language rules (file-header banner, comment WHY-not-WHAT, no commented-out code, file naming, related-resources index) — each appears in `shared/` and NOT in any per-language style_guide.md |
| REQ-003 | sk-code routing logic resolves new paths | `bash .opencode/skills/sk-code/scripts/check-smart-router.sh` (or equivalent) returns success; a probe dispatch on a Webflow CSS task loads the new `webflow/css/` files |
| REQ-004 | The five original files are physically DELETED, not archived or stubbed | `ls .opencode/skills/sk-code/references/webflow/standards/` returns "No such file or directory"; no `.old`, `.bak`, `_deprecated`, `z_archive` artifacts exist anywhere |
| REQ-005 | All three known external cross-references are updated | grep `webflow/standards/code_style` across the repo returns ZERO hits |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | New file headers use sk-code's MANDATORY banner format | Each new file's first 10 lines contain `// ───` JS-banner-style or markdown frontmatter consistent with surrounding sk-code reference files |
| REQ-007 | sk-code SKILL.md `references/webflow/` resource list reflects new tree | SKILL.md inline file list and any inline routing pseudocode reference per-language paths |
| REQ-008 | Manual testing playbook scenario `04--skill-advisor-integration/` updated to test WEBFLOW per-language loading | New scenario asserts that a CSS-only task loads `webflow/css/*` and NOT `webflow/javascript/*` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A sk-code dispatch on a Webflow CSS-only task loads ONLY `webflow/css/style_guide.md` + `webflow/css/quality_standards.md` + `webflow/shared/cross_language_rules.md` (not the JS files), measurable via opencode JSON event-stream tool_use traces
- **SC-002**: A sk-code dispatch on a Webflow JS-only task loads ONLY `webflow/javascript/*` + `webflow/shared/*` (not the CSS files)
- **SC-003**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/081-webflow-per-language-style-guides --strict` exits 0
- **SC-004**: After implementation, a fresh probe dispatch (e.g. "create a Webflow card hover effect with CSS+JS") produces output that uses the mandated `// ───`/`/* ─` banner styles per the per-language style_guides
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Content lost during split (a JS rule accidentally migrated to css/ and dropped) | High | REQ-001 acceptance check is per-section; do diffs section-by-section, not file-by-file. Use `wc -l` + content-hash spot checks. |
| Risk | Smart router still references old paths after delete; dispatches fail | High | Update SKILL.md + resource_loading.md atomically with deletion. Run a probe dispatch post-deletion as part of REQ-003 acceptance. |
| Risk | Cross-language rule duplicated across javascript/ AND css/ AND shared/ | Medium | REQ-002 acceptance check explicitly greps for duplicates. |
| Risk | External tools (sk-code-review, manual playbook) break on stale path refs | Medium | REQ-005 — repo-wide grep for `webflow/standards/code_style` returns zero hits before completion claim. |
| Dependency | Memory advisor + plugin still recommend sk-code post-refactor | Low | Refactor is purely under sk-code; doesn't change advisor scoring. Probe dispatch confirms. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: New per-language files load no slower than current monolithic files (each new file ≤ corresponding old file's size; no per-file overhead added)

### Maintainability
- **NFR-M01**: Cross-language rule changes need to update only one file (`shared/cross_language_rules.md`), not three

### Symmetry
- **NFR-S01**: Webflow reference tree depth and naming match opencode reference tree depth and naming after refactor (`{javascript,css,html,shared}/{style_guide,quality_standards,quick_reference}.md`)

---

## 8. EDGE CASES

### Content boundaries
- **HTML style guide may be very thin** — Webflow Designer owns most HTML output. Document this explicitly in `html/style_guide.md` and point to Webflow Designer best-practices instead of duplicating Webflow's docs.
- **§5 Commenting Rules in `code_style_guide.md`** mixes JS-specific (JSDoc) with cross-language (file headers, WHY-not-WHAT). Split: JSDoc → `javascript/style_guide.md`, the rest → `shared/cross_language_rules.md`.
- **§7 CSS Style Enforcement (4 subsections)** in `code_style_enforcement.md` is purely CSS — moves to `css/quality_standards.md`'s enforcement section, NOT to `shared/enforcement.md`.

### Routing edge cases
- A task that touches BOTH a `.css` and a `.js` file must load BOTH `css/*` and `javascript/*` reference sets — not pick just one. SKILL.md routing must support multi-language fan-out.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: ~17 (5 delete + 10 create + 5 modify), LOC: ~3,831 source content + ~200 routing/cross-ref updates |
| Risk | 12/25 | No auth/API changes, but breaking sk-code dispatch path is real (Mitigated by REQ-003 probe) |
| Research | 6/20 | Section-by-section content categorization required; no novel investigation |
| Multi-Agent | 4/15 | Single-agent execution; can parallelize file authoring once split map is fixed |
| Coordination | 8/15 | SKILL.md + resource_loading.md + 5 deletes + 10 creates must land atomically |
| **Total** | **48/100** | **Level 3 (correct)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Content lost in split (rule deleted instead of moved) | H | M | Per-section diff; checklist line per source-file section |
| R-002 | Routing breaks between delete and SKILL.md update | H | L | Atomic single-commit of all changes (or reverse order: SKILL.md update first, then files) |
| R-003 | Cross-language rule duplicated across multiple new files | M | M | Explicit REQ-002 grep check |
| R-004 | External cross-refs break (universal/code_style_guide.md, playbook, checklist) | M | M | REQ-005 repo-wide grep gate |
| R-005 | HTML style_guide.md is too thin to justify existence | L | H | Acknowledged in EDGE CASES; if truly thin, scope down to a stub-with-pointer or fold into shared/ |

---

## 11. USER STORIES

### US-001: As a sk-code-routed agent doing CSS-only Webflow work, I want to load only CSS rules (Priority: P0)

**As a** sk-code-routed agent on a Webflow CSS task, **I want** to load only the CSS-specific style/quality/quick-reference docs plus shared cross-language rules, **so that** my context stays focused and I don't waste attention on JS rules that don't apply.

**Acceptance Criteria**:
1. Given a task targeting only `.css` files in a Webflow project, When sk-code's smart router resolves resources, Then `webflow/css/style_guide.md`, `webflow/css/quality_standards.md`, `webflow/css/quick_reference.md`, and `webflow/shared/cross_language_rules.md` load — and `webflow/javascript/*` does not.

---

### US-002: As a sk-code maintainer, I want shared cross-language rules to live in exactly one place (Priority: P0)

**As a** sk-code maintainer updating the comment WHY-not-WHAT rule, **I want** to edit one file in `shared/`, **so that** the change can't drift between JS and CSS docs.

**Acceptance Criteria**:
1. Given a rule that applies to both JS and CSS (e.g. file-header banner, comment WHY-not-WHAT), When I grep the new tree for that rule, Then it appears in `shared/cross_language_rules.md` and in zero per-language files.

---

### US-003: As a sk-code-review finding author, I want precise per-language citations (Priority: P1)

**As a** finding author, **I want** to cite `webflow/css/style_guide.md §3.2` instead of `webflow/standards/code_style_guide.md §6.2 CSS subsection`, **so that** the finding is actionable and the cited file's scope matches the finding's scope.

**Acceptance Criteria**:
1. Given a CSS rule violation, When I write a finding citation, Then the cited path is a `webflow/css/*` file and the section number is unique within that file.

---

### US-004: As an opencode runtime model, I want symmetry across opencode and webflow reference layouts (Priority: P1)

**As a** GPT 5.5 model loading sk-code references, **I want** WEBFLOW and OPENCODE surfaces to use identical per-language directory layouts, **so that** I can apply the same loading logic to both surfaces without surface-specific special cases.

**Acceptance Criteria**:
1. Given the post-refactor tree, When `tree references/webflow` and `tree references/opencode` are compared, Then both have a per-language structure with a `shared/` sibling.

---

## 12. OPEN QUESTIONS

(None — Gate 3 answered both during planning: spec folder = new 099 packet; layout = full opencode mirror.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
