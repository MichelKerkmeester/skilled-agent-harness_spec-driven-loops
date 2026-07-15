# Iteration 4: HTML Report Design

## Focus
Q4: How should the HTML report expose fidelity and risk?

## Findings

### F1: Report View Modes
The v1 HTML report must support two primary views:
- **Side-by-side**: old left, new right, with synchronized scrolling. Changes aligned vertically via diff hunk anchoring.
- **Inline unified**: single document with inserted (+green) and deleted (-red) text inline, using unified diff format semantics.

### F2: Change Classification for Visual Encoding
| Change Type | Visual Encoding | Detection Method |
|-------------|-----------------|------------------|
| Addition | Green background, `+` prefix | jsdiff `added: true` |
| Deletion | Red background, `-` prefix, strikethrough | jsdiff `removed: true` |
| Modification | Yellow/orange background | Paired insertion+deletion at same position |
| Unchanged | White/default background | jsdiff `added: false, removed: false` |
| Move detected | Purple background + arrow indicator | Structure-level token position shift |
| Extraction warning | Amber border + tooltip | Adapter fidelity below threshold |

### F3: Security Hardening (XSS Prevention)
- **All document content MUST be HTML-escaped** before rendering — use `textContent` or equivalent
- **Content Security Policy** embedded in report: `default-src 'self'; script-src 'none'; style-src 'unsafe-inline'`  
- **No external assets** — all CSS/JS inline within the single HTML file
- **No user-generated URLs** rendered as links without validation (strip `javascript:` and `data:` URIs)
- **DOMPurify** or equivalent sanitization on any HTML-derived content
- **Sandboxed iframe** as defense-in-depth (optional v1.1 improvement)

### F4: Fidelity Warning System
The report must include a **Fidelity Dashboard** section:
- **Format badge**: e.g., "Markdown → Full Fidelity (95%)"
- **Extraction warnings table**: list of constructs NOT extracted (images, tracked changes, comments, layout info)
- **Per-change fidelity**: if a detected "change" could be extraction noise, flag it with an amber marker
- **Summary score**: percentage of document constructs that survived extraction intact

### F5: Navigation and Accessibility
- **Table of Contents**: auto-generated from document headings, with links to diff sections
- **Change summary**: "12 additions, 5 deletions, 3 modifications across 8 sections"
- **Change navigation**: Previous/Next change jump buttons (keyboard: J/K)
- **Collapse unchanged sections**: fold lengthy identical sections
- **Keyboard accessible**: all navigation via Tab/Enter/arrow keys
- **Screen reader**: ARIA labels on change indicators, skip navigation link

### F6: Self-Contained Single-File Design
- All CSS inline in `<style>` (no external stylesheets)
- All JS inline in `<script>` (no external scripts)  
- Images embedded as base64 data URIs (if any visualization needed)
- Target file size: <2MB for typical documents
- MIME type: `text/html` with UTF-8 charset

## Sources Consulted
- Spec.md §4 REQ-005 (HTML review contract and security boundary)
- CSP specification (content-security-policy.com)
- jsdiff change objects (added/removed/value/count)

## Assessment
- **newInfoRatio**: 0.82 — detailed report specification with security, accessibility, and fidelity dimensions
- **Novelty Justification**: Concrete visual encoding, CSP specification, fidelity dashboard design, keyboard navigation model

## Reflection
### What Worked
- Side-by-side + unified dual mode covers both review preferences
- CSP `script-src 'none'` + HTML escaping provides strong XSS defense
- Fidelity dashboard makes extraction limitations transparent

### Ruled Out
- Server-rendered report (violates local-only constraint)
- External CSS framework dependency (must be self-contained)

## Recommended Next Focus
Q5: Portable core and skill interface — CLI contract, Node.js API, OpenCode skill trigger design
