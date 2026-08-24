---
title: "Implementation Summary: sk-code Split-Doc Template Alignment"
description: "Conformed all 163 mechanically-split reference/asset files under sk-code/{code-opencode,code-webflow,code-quality} to the create-skill asset/reference templates: snake_case renames, 5-field frontmatter + 4-part version, OVERVIEW wrapper, content preserved, every in-hub reference updated. Executed by GPT-5.6-sol-fast in an isolated worktree, orchestrator-verified per batch; 0 hyphenated names, 0 broken links to renamed files; committed + pushed to v4. Post-ship 10-iteration deep review (GPT-5.6-sol-fast HIGH) drove two P1 remediations: 21 code-webflow Purpose paragraphs de-duplicated from their H1 intro, and the broken-link completion claim narrowed to its true renamed-file scope."
trigger_phrases:
  - "019 summary sk-code split doc alignment"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/019-split-doc-template-alignment"
    last_updated_at: "2026-08-19T08:29:06Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Conformed sk-code-mobile-cli surface to templates (10 ref/asset files)"
    next_safe_action: "Commit + push (main + v4)"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Packet** | 019 — sk-code Split-Doc Template Alignment |
| **Status** | Complete |
| **Track** | sk-code |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
All 163 mechanically-split reference/asset `.md` files across the three sk-code surfaces conformed to the create-skill templates.

| Surface | Files | Result |
|---|---|---|
| code-quality (assets) | 3 | conformed |
| code-opencode (refs+assets) | 65 | conformed |
| code-webflow (refs+assets) | 95 | conformed |
| **Total** | **163** | **163/163 at 0 issues** |

Each file: hyphen→underscore rename (snake_case), 5-field frontmatter + 4-part version, H1 + intro + `## 1. OVERVIEW` (Purpose/When-to-Use for refs, Purpose/Usage for assets), content sections renumbered (content preserved verbatim), and every in-hub reference to renamed files updated.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
Serial GPT-5.6-sol-fast batches (opencode, --variant medium) in an isolated worktree, one subtree per batch (batches serialize on each surface's shared SKILL.md RESOURCE_MAP). The orchestrator verified each batch (validate_document 0 + full-hub broken-link scan) and committed the whole hub before dispatching the next. Every batch committed + pushed to v4.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
- **Recurse into nested split dirs.** Verification caught GPT initially skipping nested `<lang>/quality_standards/` split dirs; every subsequent batch prompt made recursion explicit.
- **Whole-hub staging.** Early per-surface `git add <surface>` commits dropped cross-surface reference-link fixes, leaving 2 broken links on v4; switched to staging the whole sk-code hub per commit and repaired them.
- **snake_case per operator + 027.** Renames use underscore, aligning with the concurrent 027 naming migration (which had not covered these reference/asset split files).
- **Post-ship deep review → two P1 remediations.** A 10-iteration GPT-5.6-sol-fast HIGH review (verdict FAIL, convergence 1.0) surfaced two confirmed P1s that the structural validators could not catch. F001: 21 code-webflow references had `### Purpose` copied verbatim from the H1 intro, violating the create-skill template's explicit non-duplication rule — each Purpose was rewritten to a section-derived, intro-distinct statement (0 duplicates across all 163). F002: the completion claim overstated "0 broken links hub-wide"; a fenced-code-aware scan found two pre-existing non-navigational artifacts (an illustrative `005-example.com` example path and a filename quoted in changelog prose, both authored by prior commits) — the claim was narrowed to its true renamed-file scope rather than editing correct documentation.
- **xHigh triplicate verification → four more structural fixes the HIGH pass missed.** Three parallel GPT-5.6-sol-fast xHigh lineages (concurrency 3) re-reviewed the remediated tree and agreed on four in-scope defects, each bounded to one file/row by re-scan: the rust `interop_errors_and_parity.md` had its `## 1. OVERVIEW` scaffold appended at the file's end after 11 orphaned `###` content sections — restructured so OVERVIEW leads and content sits under numbered `## 2.`–`## 12.` sections; one containment duplicate (`overview_hls_and_lenis.md`) the first de-dup scan missed — Purpose rewritten; the whole-hub link claim survived in this summary's own verification table (checklist was fixed, summary table was not) — narrowed; and an asset README trigger phrase ("code README") was not lowercase — corrected.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
| Check | Result |
|---|---|
| validate_document.py on all sk-code ref+asset files | 163/163 at 0 issues |
| Hyphenated split filenames remaining | 0 |
| Broken relative .md links to/among renamed files | 0 (2 pre-existing non-navigational artifacts hub-wide out of scope) |
| Edits under system-deep-loop/deep-alignment | None |

Commands: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` (Errors: 0) and `validate_document.py --type reference` per file (all `VALID`); structural scans (`dup`, `OVERVIEW-order`, `hyphen`) all `0`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
- The surface SKILL.md files (code-opencode/code-webflow) still FAIL `package_skill.py --check` for a pre-existing reason (deliberate surface-packet headers, not the create-skill required-section names) — out of scope; per-file resource-doc conformance verified via validate_document.py instead.
- `validate.sh --strict` returns exit 1 (warnings), not exit 0. `EVIDENCE_CITED` and `SPEC_DOC_SUFFICIENCY` are now cleared; the residual `COMPLEXITY_MATCH` and `SECTION_COUNTS` warnings are inherent to the standard Level-2 spec template (which renders 7 spec H2s and no user-story/Given-When scenarios) — clearing them would require padding the spec docs with template-foreign content, which is declined as anti-quality. `PRIORITY_TAGS` (CHK-* format) is likewise left as-is. Errors: 0 is the project's completion bar and is met.
<!-- /ANCHOR:limitations -->

---

## Post-Completion Follow-Up
- Sibling `sk-doc/017-smart-routing-mechanism-notes` completes Request 2.
- **Content follow-ups surfaced by the xHigh verification review — ADDRESSED by sibling `sk-code/020-content-quality-remediation`.** The security-cookie contradiction, the unvalidated `script.src` loader, and the ~19 generic When-to-Use sections were content defects outside this packet's structural scope; they are now fixed in packet 020. A later xHigh confirmation round additionally cleaned 8 files with content before `## 1. OVERVIEW` and 6 over-long intros (structural, folded back into this packet).

---

## Increment: sk-code-mobile-cli Surface Alignment (2026-08-19)

The `sk-code-mobile-cli` surface was created after this packet's original run, so its hand-authored reference/asset docs were never conformed to the create-skill templates: they opened at an inherited content section with no `## 1. OVERVIEW`, and the seven design-system references carried only `title/description/version` frontmatter (missing the routing triad). This increment conforms them, extending 019's template-alignment mandate to the new surface.

**Scope (10 files, no renames):** 7 references (`component-tokens`, `ds-grammar`, `editability-guardrails`, `retint-recipes`, `theme-remap`, `token-library`, `verification`) and 3 asset checklists (`ds-verification-checklist`, `guardrail-audit-checklist`, `token-retint-checklist`) under `sk-code/sk-code-mobile-cli/{references,assets}/`. The three `workflow-*.md` references are symlinks to `shared/` and were already compliant — excluded. Filenames stayed kebab-case (the canonical convention for hand-authored files, unlike the mechanically-sliced snake_case files 019 originally renamed), so there is no in-hub reference or leaf-manifest churn.

**Each file:** added `## 1. OVERVIEW` as the first numbered section (Core Principle / When to Use / Key Sources for references; Purpose / Usage for assets), completed the 5-field frontmatter (added `trigger_phrases` 3–8, `importance_tier: normal`, `contextType: implementation` to the seven references), compressed the intro to a 1–2 sentence hook with no subsections, and renumbered every content section +1 with the body preserved verbatim.

**Pipeline:** ten Sonnet-5 (high) markdown agents, one per file, in parallel. The orchestrator then repaired a coordination gap the single-file agents could not see: because every file gained an OVERVIEW at §1, all cross-file `X.md §N` references were off-by-one — bumped deterministically (+1), leaving `SKILL.md §N` (not realigned) and the already-correct intra-file refs untouched.

| Check | Result |
|---|---|
| First numbered section == `## 1. OVERVIEW` (structural sweep) | 10/10 |
| 5-field frontmatter + 4-part version | 10/10 |
| `validate_document.py` | 10/10 VALID |
| Non-heading body content lines deleted (content preservation) | 0 |
| Cross-file `§N` refs resolving to the intended target section | 22/22 |
| leaf-manifest freshness | OK (no drift) |
| trigger_phrases per file within 3–8 | 10/10 |

---

## Increment 2: sk-code-mobile-cli App-Doc Restructure + Parent Hub Freshness (2026-08-19)

The `sk-code-mobile-cli` surface carried its relocated Pi Remote app documentation in one flat `references/app-guide/` bucket, and the parent `sk-code` advisor artifacts predated the surface's addition. This increment reorganizes the app docs for first-glance legibility and brings the parent hub's advisor metadata current. Documentation/metadata only — no app code, no routing-behavior change.

**App-doc restructure (surface):** `references/app-guide/` was dissolved into six purpose-named folders — `operations/` (operations, incident-playbooks, rollback), `release/` (ai-deploy-playbook, release-verification), `setup/` (setup, install-and-onboarding), `standards/` (code-standards, security, platform-support), `design-reference/` (the `mobile-chat-apps/` teardown, UI map, research, screens), and `quality/` (DQI + full-access-runtime baselines). File contents moved verbatim; only paths changed. The two single-source pointer files (`feature-catalog.md`, `manual-testing-playbook.md`) were removed — the catalog and playbook remain canonical at the app repository root, and the surface no longer mirrors them even as pointers, so they cannot drift.

**Reference integrity:** the four sibling cross-links broken by the relocation (`security.md`, `setup.md`, `platform-support.md`, `release-verification.md`, which had assumed a flat directory) were repaired to their new subfolder-relative paths across `operations/operations.md`, `setup/setup.md`, and `setup/install-and-onboarding.md`. SKILL.md §2 was rewritten to describe the six folders and drop the pointer links; its `version` bumped 1.0.0.0→1.1.0.0 with a new `changelog/v1.1.0.0.md`. The README gained a "Mobile CLI App Repository" subsection locating the app repo as a distinct source-of-truth repository. `---` dividers were inserted between the numbered sections of every relocated app doc and the three asset checklists.

**Parent hub freshness:** `leaf-manifest.json` was regenerated (`generate-leaf-manifest.cjs --write`) to re-type the relocated leaves and drop the two removed pointers. The advisor artifacts that had never received the mobile-cli surface were de-staled: `description.json` (description text + keywords) and `graph-metadata.json` (`intent_signals`, `derived.trigger_phrases`, `key_topics`, `derived.intent_signals`) gained mobile-cli/Pi Remote signals, and the `causal_summary` was corrected from "two surface evidence packets" to three. This additive edit also cleared the fleet gate's `INTENT_SIGNALS_TRIGGER_RECONCILIATION` NOTE on sk-code (Jaccard 0.037 → resolved).

**Validator-gap root cause (the "why weren't dividers there" question):** `validate_document.py` gates `---` dividers behind the per-doc-type `h2DividerRequired` flag, set only for `readme`/`general` doc types — **not** for the skill `reference`/`asset` types. The create-skill templates prescribe dividers, but the validator never enforced them for ref/asset docs, so the surface's original authoring passed without them. Left as a flagged follow-up (a one-line sk-doc rule change), out of this increment's scope.

| Check | Result |
|---|---|
| Broken relative .md links in the references tree | 10/10 resolve; 1 pre-existing `../ARCHITECTURE.md` dangling (was dangling before the move — out of scope) |
| `general_h2_separator` issues across all authored refs+assets | 0 |
| `app-guide` references outside the changelogs | 0 |
| Parent `leaf-manifest.json --check` | OK (0 app-guide paths; 6 subfolders typed; −2 pointers) |
| Parent JSON validity + `regenerate-skill-derived` structural check | all valid; unchanged |
| `ci-skill-root-metadata` on sk-code | OK [H]; trigger-reconciliation NOTE cleared |
| validate_document issues introduced by this increment | 0 (3 pre-existing `missing overview` on relocated app docs unchanged) |
