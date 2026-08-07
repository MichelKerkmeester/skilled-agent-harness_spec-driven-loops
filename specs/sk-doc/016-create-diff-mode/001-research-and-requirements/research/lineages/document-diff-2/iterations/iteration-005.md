# Iteration 5: HTML Report Architecture and Security Boundary

## Focus

Design the self-contained, accessible, secure HTML report contract for displaying document diffs.

## Findings

### Finding 1: Self-Contained HTML Architecture

The report must be a single `.html` file with zero external dependencies:
- All CSS inlined in `<style>` tags
- All JS inlined in `<script>` tags (or zero JS for baseline)
- All images as base64 data URIs
- No CDN references, no external fonts, no network requests
- File must render correctly when opened via `file://` protocol

This guarantees portability: email it, archive it, open it offline.

### Finding 2: Dual View Mode Contract

The report must support two review modes:

**Inline (unified) view:**
- Single column showing old and new interleaved
- Green background for additions, red for removals, yellow for modifications
- Line/paragraph numbers from source documents
- Structural context (section headings) always visible

**Side-by-side view:**
- Two columns, old on left, new on right
- Synchronized scrolling between columns
- Aligned paragraphs with gap markers for added/removed sections
- Line wrapping for long content

Default: inline view. User toggles via button (if JS enabled) or both views rendered with CSS-only switching.

### Finding 3: Security Contract (Mandatory)

The report must be XSS-safe by construction:

| Requirement | Implementation |
|-------------|---------------|
| **All content escaped** | HTML-entity encode all extracted text before insertion |
| **No inline scripts from source** | Strip `<script>`, `on*` attributes, `javascript:` URLs from source |
| **Content Security Policy** | `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:;">` |
| **Sandboxed iframes** | Only if absolutely needed for rich previews; use `sandbox=""` |
| **Active content stripped** | Remove `<object>`, `<embed>`, `<applet>`, `<form>` from extracted HTML |
| **No eval() or innerHTML from source** | Build DOM via createElement/createTextNode only |

### Finding 4: Fidelity Warning System

The report must communicate extraction confidence:

| Warning Level | Icon | Condition | User Impact |
|---------------|------|-----------|-------------|
| **Info** | ℹ️ | Format converted with full fidelity | No action needed |
| **Caution** | ⚠️ | Some constructs not preserved (e.g., embedded objects) | Manual check recommended |
| **Warning** | 🔴 | Significant fidelity loss (e.g., PDF without text layer) | Visual/manual review required |
| **Error** | ❌ | Extraction failed entirely | Cannot produce meaningful diff |

### Finding 5: Accessibility Requirements

| Requirement | Implementation |
|-------------|---------------|
| **Keyboard navigation** | All interactive elements focusable, Tab order logical |
| **Screen reader support** | Semantic HTML, ARIA labels for diff regions, alt text for fidelity icons |
| **Color independence** | Patterns/letters in addition to color (e.g., `[+]` prefix for additions) |
| **Zoom support** | Relative units (em/rem), no fixed pixel layouts that break at 200% |
| **Reduced motion** | `prefers-reduced-motion` respected for animations |

### Finding 6: Report Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:;">
  <title>Document Diff: filename.docx</title>
  <style>/* Inlined CSS */</style>
</head>
<body>
  <header>  <!-- Summary, fidelity badges, navigation, export info --> </header>
  <nav>     <!-- Section jump links --> </nav>
  <main>
    <section class="diff-view inline">  <!-- Inline diff --> </section>
    <section class="diff-view side-by-side hidden"> <!-- Side-by-side --> </section>
  </main>
  <footer>  <!-- Generation timestamp, tool version --> </footer>
  <script>  /* Optional progressive enhancement (view toggle, scroll sync) */ </script>
</body>
</html>
```

## Assessment

**newInfoRatio**: 0.8 — Fresh contributions: the security contract, fidelity warning system, and self-contained architecture requirements are all novel synthesized designs.

## Recommended Next Focus

Runtime selection and dependency analysis — which runtime (Node.js, Python, Rust) and which dependency set minimize the blast radius while supporting the canonical pipeline?
