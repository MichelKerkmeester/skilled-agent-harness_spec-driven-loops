# Iteration 7: Security Constraints for Untrusted Document Input

## Focus

Research security threat vectors for untrusted DOCX, HTML, PDF, and Markdown input and define the v1 security perimeter.

## Findings

### Finding 1: Threat Model Per Format

| Format | Primary Threats | Severity | Mitigation Strategy |
|--------|----------------|----------|---------------------|
| **DOCX** | XML bombs (billion laughs), external entity injection (XXE), embedded active content (macros, OLE objects), ZIP bombs, path traversal in embedded files | High | Parse with entity expansion disabled; strip macros/OLE; limit decompressed size; mammoth already disables external file access by default |
| **HTML** | XSS via script tags/event handlers/javascript: URLs, CSS injection, iframe embedding, SVG with script, meta refresh redirects | High | Strip all active elements before AST parsing; use DOMPurify or equivalent; CSP meta tag in output; never render source HTML directly |
| **PDF** | JavaScript in PDF, embedded files, form submission, launch actions, URI actions, oversized streams causing memory exhaustion | High | pdf.js already strips JS by default; limit page count and file size; disable form/URI action handling |
| **Markdown** | Raw HTML passthrough, image/src with javascript:, link href with javascript:, data: URI with script content | Medium | Disable raw HTML in parser (or strip before rendering); validate all URLs; sanitize data URIs |
| **Plain Text** | Encoding bombs (e.g., 100MB of null bytes), homograph attacks, control characters, bidirectional text attacks | Low | Size limits; reject or strip control characters; normalize Unicode |

### Finding 2: Defense-in-Depth Strategy

Layered security model:

```
Layer 1: Input Validation
  └─ File size limits (configurable, default 50MB)
  └─ Format detection by magic bytes, not extension
  └─ Reject password-protected documents early
  └─ MIME type verification

Layer 2: Parser Hardening
  └─ XML: disable DTD, external entities, limit entity expansion
  └─ HTML: sanitize before parsing (DOMPurify/rehype-sanitize)
  └─ PDF: limit pages (default 500), disable JS, disable forms
  └─ Subprocess isolation for native parsers

Layer 3: Output Sanitization
  └─ All content HTML-escaped before report insertion
  └─ CSP meta tag: default-src 'none'; style-src 'unsafe-inline'; img-src data:
  └─ No raw HTML from source in report (only escaped text or explicitly allowed safe tags)
  └─ Data URIs validated for expected MIME types only

Layer 4: Resource Limits
  └─ CPU timeout per document (default 30s)
  └─ Memory limit per parse (default 512MB)
  └─ Max AST node count (prevents deeply nested attacks)
  └─ Max output HTML size (default 50MB)
```

### Finding 3: DOMPurify Integration for HTML Input

For HTML input documents, the recommended sanitization pipeline:
1. Parse raw HTML with DOMPurify (default whitelist of safe tags/attributes)
2. Strip: `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`, `<meta>`, `<link>`, `<style>`, `on*` attributes, `javascript:` URLs, `<svg>` with scripts
3. Allow: semantic tags (`<h1>`-`<h6>`, `<p>`, `<ul>`, `<ol>`, `<li>`, `<table>`, `<a>` with `href` validated), structural tags (`<div>`, `<span>`, `<section>`, `<article>`)
4. Convert sanitized HTML to hast AST for diffing

DOMPurify is the industry standard (12k+ stars, actively maintained, used by Google, Microsoft, GitHub) for client-side HTML sanitization.

[SOURCE: https://github.com/cure53/DOMPurify]

### Finding 4: XML Bomb Protection for DOCX

DOCX files are ZIP archives containing XML. Key protections:
- Limit decompressed size ratio (e.g., max 100:1 of compressed:decompressed)
- Disable DTD processing entirely (no external entities, no internal entity expansion beyond default limit)
- Stream parse rather than loading full DOM
- Mammoth.js already protects against many of these by design (it uses a streaming SAX-like parser)

### Finding 5: Password-Protected and Encrypted Documents

Detection and handling:
- DOCX: detect encryption flag in ZIP structure; report "encrypted, cannot diff"
- PDF: detect encryption dictionary; report "encrypted, cannot diff"
- Do NOT attempt password cracking or decryption
- Do NOT prompt for password (security risk in automated workflows)
- Provide clear error message: "Document is password-protected. Remove protection and try again."

### Finding 6: Known Limitations and Residual Risks

| Risk | Residual Level | Justification |
|------|---------------|---------------|
| Zero-day parser vulnerabilities | Low-Medium | Defense-in-depth limits blast radius; subprocess isolation optional for high-security environments |
| Polymorphic file attacks | Low | Magic-byte detection + format-specific parsers limit attack surface |
| Resource exhaustion (very large docs) | Low-Medium | Configurable limits, but large documents are a legitimate use case |
| Side-channel attacks | Very Low | Local-only, no network; timing attacks on local filesystem are impractical |

## Assessment

**newInfoRatio**: 0.8 — The layered defense model, format-specific threat analysis, and DOMPurify integration are novel security synthesis for this packet's context.

## Recommended Next Focus

Architecture shape comparison — evaluate three architecture shapes for the complete system and eliminate approaches with evidence.
