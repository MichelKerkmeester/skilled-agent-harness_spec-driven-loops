# Iteration 5: HTML Report Design — Fidelity, Risk, and Structure

## Focus
Design the self-contained HTML report: fidelity indicators, change severity classification, risk scoring, and embeddable structure.

## Findings

### 1. diff2html as the rendering foundation
diff2html provides a production-grade HTML diff renderer with:
- Side-by-side and line-by-line views
- Word-level and char-level change highlighting
- Syntax highlighting via highlight.js
- Collapsible file lists and sections
- Color scheme support (light/dark/auto)
- Configurable diff size limits (`diffMaxChanges`, `diffMaxLineLength`)
- Self-contained CSS + JS bundle — no server needed

### 2. Fidelity and risk model for v1
The HTML report should include a **fidelity header** above the diff, indicating:
| Indicator | Description | Values |
|-----------|-------------|--------|
| **Format Match** | Same format on both sides? | `same` / `converted` (e.g., DOCX->HTML vs Markdown) |
| **Conversion Fidelity** | Confidence in the format conversion | `native` (no conversion) / `high` (well-structured) / `medium` (some loss expected) / `low` (significant format mismatch) |
| **Change Severity** | Magnitude of the diff | `minor` (<10% changed) / `moderate` (10-50%) / `major` (>50%) / `rewrite` (>90%) |
| **Risk Level** | Likelihood the AI edit introduced errors | `low` (formatting-only changes) / `medium` (structural changes) / `high` (semantic/significant content changes) |

### 3. Report structure (conceptual HTML layout)
```
┌─────────────────────────────────────────┐
│ Document Diff Report                     │
│ Source: report.md → report-v2.md        │
│ Generated: 2026-07-13T14:30:00Z         │
├─────────────────────────────────────────┤
│ FIDELITY: same-format | HIGH fidelity   │
│ SEVERITY: moderate (23% changed)        │
│ RISK: medium (structural changes)       │
├─────────────────────────────────────────┤
│ [diff2html side-by-side diff]           │
│                                         │
├─────────────────────────────────────────┤
│ Change Summary:                          │
│ + 15 lines added                        │
│ - 8 lines removed                       │
│ ~ 5 lines modified                      │
│ 2 sections restructured                 │
├─────────────────────────────────────────┤
│ Notes: This report is self-contained.   │
│ No data is sent to external servers.    │
└─────────────────────────────────────────┘
```

### 4. Embeddability and self-containment
To ensure the HTML report is truly self-contained:
- Inline all CSS (diff2html CSS + custom fidelity header CSS)
- Inline all JS (diff2html UI JS + highlight.js for syntax highlighting)
- Base64-encode any images/icons
- The output is a single `.html` file that renders correctly when opened directly in a browser (file:// protocol)
- No CDN references, no network requests

### 5. Change classification categories
Beyond line-level add/remove, the report should classify changes:
- **Content changes**: Text additions, deletions, modifications
- **Structural changes**: Heading level changes, list reordering, paragraph reflow
- **Formatting changes**: Bold/italic/underline toggles (when detectable from normalized representation)
- **Metadata changes**: YAML frontmatter, title, author, date (for Markdown docs)

## Sources Consulted
- https://github.com/rtfpessoa/diff2html (diff2html capabilities)
- Prior iteration findings
- `.opencode/specs/.../001-research-and-requirements/spec.md` (self-contained HTML requirement)

## Assessment
- **newInfoRatio**: 0.65 (Fidelity/risk model is a new conceptual design; report structure is new; change classification is new synthesis)
- **Novelty Justification**: Designed a concrete fidelity header model with quantifiable indicators; defined change severity + risk scoring; confirmed self-contained single-HTML-file output approach.

## Reflection
- **What Worked**: diff2html provides strong baseline; fidelity header is a lightweight addition.
- **What Failed**: N/A
- **Ruled Out**: Server-side rendering (violates local-first constraint). External CDN dependencies (violates self-contained requirement).

## Recommended Next Focus
Evaluate runtime and language selection: TypeScript/Node.js vs alternatives for the portable core; assess dependency weight and portability.
