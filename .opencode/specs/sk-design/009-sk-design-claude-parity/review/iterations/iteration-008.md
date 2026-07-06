---
title: Deep Review Iteration 008 - HTML/CSS Sink Generalization
description: Security deep revisit for report/preview/proof HTML, CSS, href, and src sinks.
---

# Deep Review Iteration 008 - HTML/CSS Sink Generalization

## Dimension

Security deep revisit. This pass checked generated HTML/CSS sinks in `report-gen.ts`, `preview-gen.ts`, and `proof.ts`, focusing on whether P1-006's dark-mode CSS-context escaping gap generalizes to other source-derived token values rendered into `style` attributes, inline `<style>` blocks, or `href`/`src` attributes.

## Files Reviewed

| Area | Evidence | Result |
|------|----------|--------|
| Prior state and severity doctrine | `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md:66`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-001.md:24`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-007.md:30`, `.opencode/skills/sk-code/code-review/references/review_core.md:28` | Loaded all prior iteration narratives and the shared severity contract before final severity calls. Existing P1-001 through P1-007 and P2-001 through P2-003 were treated as active prior findings and not re-reported. |
| Code graph readiness | `code_graph_status: readiness.freshness=stale`, reason `git HEAD changed: ba890674 -> dc2f7965; 18 file(s) have newer mtime than indexed_at; 29 tracked file(s) no longer exist on disk` | Structural graph assertions were not trusted. This pass used graphless fallback with direct reads and exact sink greps. |
| Shared token value types | `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:431`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:446`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:454` | Typography, shadow, and radius token values are stored as strings, so renderers need CSS-context validation before inserting them into style declarations. |
| Report renderer CSS sinks | `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:106`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:109`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:114`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:152`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:159`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:485`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:489`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:490`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:533`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:632` | Found new generalized P1: report preview/components, typography rows, shadow demos, and radius demos all reuse source-derived CSS strings in style declarations without a shared CSS-value sanitizer. P1-006's dark-mode row is one instance of this broader renderer defect. |
| Preview renderer CSS sinks | `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:19`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:64`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:74`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:85`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:200`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:209`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:226`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:233`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:250` | Found the same missing CSS-context validation in a separate generated artifact: preview HTML uses typography, radius, and shadow token strings in inline `<style>` and `style` attributes. `escapeHtml()` only escapes HTML metacharacters, not CSS grammar. |
| href/src sinks | `.opencode/skills/sk-design/design-md-generator/backend/scripts/dom-collector.ts:423`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/dom-collector.ts:428`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:247`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:576`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:580`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:265`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:269` | No additional P1 was confirmed for attribute breakout: href values are HTML-attribute escaped before rendering, and screenshot `src` values are base64 produced by the proof path. A stricter URL allowlist for Google Fonts would be sensible hardening but is not the same CSS-context escaping finding. |
| Proof renderer sinks | `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:151`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:236`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:278`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:282` | Ruled out the same generalized CSS-derived value gap for `proof.ts`: score colors are hardcoded mappings, unmatched swatches are generated from quantized numeric RGB values, and screenshot sources come from base64 buffers. |
| Rendering tests | glob of `.opencode/skills/sk-design/design-md-generator/backend/tests/*.test.ts`; grep for `report-gen|preview-gen|proof|generateReport|generatePreview|runProof|box-shadow|border-radius|font-family|style attribute|css value` under backend tests returned no matches | No focused report/preview/proof rendering tests currently exercise malicious or malformed CSS token values in style contexts. This reinforces P1-008 and overlaps the existing P2-003 testing advisory. |

## Findings by Severity

### P0

None.

### P1

#### P1-008 [P1] Report and preview renderers inject source-derived CSS token strings into style contexts without validation

- File: `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:200`
- Claim: P1-006 generalizes beyond dark-mode swatches: both `report-gen.ts` and `preview-gen.ts` interpolate source-derived typography, radius, and shadow token strings into inline CSS contexts without a CSS-value sanitizer or property-specific allowlist.
- Evidence: Token types store typography values (`fontFamily`, `fontSize`, `fontWeight`, `lineHeight`), shadows, and radii as strings. `report-gen.ts` reads tokens from JSON, lifts radius, shadow, and font values into preview tokens, then places them into `border-radius`, `box-shadow`, `font-family`, `font-size`, `font-weight`, and `line-height` declarations in style attributes. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:431`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:446`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:454`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:106`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:109`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:114`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:152`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:159`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:485`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:489`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:490`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:632`.
- Preview evidence: `preview-gen.ts` repeats the same pattern in the standalone preview artifact: it selects typography, shadows, and radii from `DesignTokens`, then renders `font-family`, `font-size`, `font-weight`, `line-height`, `border-radius`, and `box-shadow` with raw or HTML-escaped token strings. `escapeHtml()` escapes `&`, `<`, `>`, and double quotes only; it does not validate CSS values, escape single-quoted CSS strings, or reject declaration separators/functions for a style context. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:19`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:64`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:74`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:85`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:200`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:209`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:226`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:233`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:250`.
- Relationship to P1-006: This is the same root defect class as P1-006 but a broader affected surface. P1-006 confirmed dark-mode `background:${v.lightValue}` / `background:${v.darkValue}` in `report-gen.ts`; this pass proves the renderer lacks a reusable CSS-value sanitizer across other CSS-derived values and across `preview-gen.ts` as well. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:533`.
- Counterevidence sought: I swept style, href, and src sinks in all three target renderers. Color-token and proof score colors are mostly normalized or generated from numbers (`ColorToken.hex`, `proofColor()`, `valScoreColor()`, quantized proof RGB); text copies use HTML escaping; screenshot `src` values are base64 from the proof path. None of that provides CSS-context protection for typography/radius/shadow token values. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:412`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:181`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:151`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:278`.
- Alternative explanation: Browser CSSOM usually normalizes computed styles, which reduces exploitability for ordinary sites. That is not a sufficient boundary: the code stores these fields as arbitrary strings and places them into generated HTML/CSS without property-specific validation, while the existing helper is named and implemented as HTML escaping rather than CSS sanitization.
- Final severity: P1. This is a generated-artifact security/data-isolation defect in the mutating md-generator workflow. It is not P0 because no automatic command execution or file write is controlled by the CSS value, and the report/preview must be opened by an operator.
- Confidence: 0.83.
- Downgrade trigger: Downgrade to P2 if report/preview rendering validates CSS-derived values through property-specific allowlists or typed renderers, unsafe values render as escaped text-only, and focused tests cover malicious font, radius, shadow, and dark-mode values.
- Finding class: cross-consumer.
- Affected surface hints: `report-gen.ts`, `preview-gen.ts`, `dark-mode report rows`, `typography/radius/shadow preview renderers`, `generated report.html`, `generated preview.html`.
- Recommendation: Add one shared renderer safety module at `.opencode/skills/sk-design/design-md-generator/backend/scripts/render-safety.ts` for CSS-context output. It should expose property-specific helpers for color, length/radius, font-family, font weight/size/line-height, shadow, URL attributes, and complete style attribute construction, then make `report-gen.ts`, `preview-gen.ts`, and any future `proof.ts` CSS sinks use it instead of raw interpolation or HTML escaping.

### P2

None.

## Traceability Checks

| Check | Status | Evidence |
|-------|--------|----------|
| `spec_code` | Covered with one new P1 | The generated report/preview/proof renderers were checked against live code. P1-008 generalizes the existing P1-006 CSS-context defect to additional renderer surfaces. |
| `checklist_evidence` | Not applicable this iteration | This pass focused on backend rendering sinks, not phase checklist reconciliation. Prior checklist coverage remains covered from iterations 4-5. |
| `skill_agent` | Not applicable this iteration | No public mode routing, command projection, or agent surface was under review. |
| `agent_cross_runtime` | Not applicable | Strategy marks this N/A for sk-design. |
| `feature_catalog_code` | Covered, no new catalog-only defect | No new feature-catalog mismatch was found beyond existing P1-004; the new issue is implementation-level renderer safety. |
| `playbook_capability` | Not executed | Live report/preview/proof rendering tests remain outside this iteration. |
| `html_output_isolation` | Covered with one new P1 | CSS-derived token strings beyond dark-mode values enter generated HTML style contexts without property-specific validation. |
| `href_src_attribute_isolation` | Covered, no new P1 | HTML attribute escaping and base64 generation ruled out attribute breakout in reviewed href/src sinks, though Google Fonts host allowlisting remains a reasonable hardening follow-up. |

## Search Depth

Scope class is complex. Code graph readiness remained stale, so this iteration used graphless fallback. Target selection followed the prompt exactly: full reads of `report-gen.ts`, `preview-gen.ts`, and `proof.ts`; exact grep for `style=`, `<style>`, `href=`, and `src=`; producer checks for token value types and Google Fonts link collection; and backend test inventory for report/preview/proof rendering coverage. High-risk work deferred: live browser execution of generated malicious-token fixtures and implementation of the shared sanitizer.

## SCOPE VIOLATIONS

None. No reviewed target source/spec files were modified.

## Verdict

CONDITIONAL for iteration 8: one new P1 finding was recorded. No P0 findings were discovered.

## Next Dimension

Iteration 9 should continue deep revisit coverage around remediation completeness: verify whether a proposed shared output policy plus `render-safety.ts` CSS-context sanitizer would cover all active md-generator P1s without creating a broad abstraction that misses property-specific validation.

Review verdict: CONDITIONAL
