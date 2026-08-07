# Iteration 9: Fixture Corpus, Acceptance Criteria, and Performance Benchmarks

## Focus

Define a representative fixture corpus, measurable acceptance criteria, and performance benchmarks for v1 validation.

## Findings

### Finding 1: Fixture Corpus Structure

```
test/fixtures/
├── text/
│   ├── empty.txt                          # Edge: empty file
│   ├── identical.txt                      # Edge: no changes
│   ├── completely-different.txt           # Edge: entirely different
│   ├── single-word-change.txt             # Unit: minimal change
│   ├── single-line-change.txt             # Unit: one line added/removed
│   ├── encoding-utf8.txt                  # Edge: UTF-8 with BOM
│   └── encoding-latin1.txt               # Edge: Latin-1 encoding
├── markdown/
│   ├── heading-change.md                  # Structural: heading level changed
│   ├── list-reorder.md                    # Structural: list items reordered
│   ├── table-modified.md                  # Structural: table cell changed
│   ├── code-block-changed.md              # Content: code block modified
│   ├── link-updated.md                    # Content: URL changed
│   ├── metadata-changed.md                # Noise: frontmatter only changed
│   └── whitespace-reflowed.md             # Noise: line wrapping changed
├── html/
│   ├── semantic-change.html               # Content: tag structure changed
│   ├── styling-only.html                  # Noise: CSS classes changed
│   ├── script-changed.html               # Security: script modified (must be stripped)
│   └── nested-tables.html                 # Edge: deeply nested content
├── docx/
│   ├── paragraph-edited.docx              # Content: text change in paragraph
│   ├── heading-style-changed.docx        # Visual: same text, different style
│   ├── table-added.docx                   # Structural: table inserted
│   ├── image-replaced.docx               # Content: image changed
│   ├── tracked-changes.docx              # Edge: document with tracked changes
│   └── password-protected.docx           # Security: encrypted, must fail gracefully
├── pdf/
│   ├── text-only.pdf                      # Basic: generated from text
│   ├── formatted-text.pdf                 # Content: styled text extraction
│   ├── image-only.pdf                     # Edge: scanned, no text layer
│   └── mixed-text-image.pdf              # Edge: partial extraction
├── combined/
│   ├── format-conversion.md → .docx      # Cross-format: Markdown to DOCX
│   ├── large-document.md (10K words)     # Performance: large document
│   └── malicious/                         # Security: adversarial inputs
│       ├── xss-injection.html
│       ├── xml-bomb.docx
│       └── billion-laughs.xml
```

Total: ~30 fixture pairs covering normal, edge, security, and performance cases.

### Finding 2: Acceptance Criteria Matrix

| ID | Criterion | Measurement | Target | Priority |
|----|-----------|------------|--------|----------|
| AC-01 | All supported formats produce valid HTML report | Automated test | 100% | P0 |
| AC-02 | Identical documents produce empty diff | Automated test | No false changes reported | P0 |
| AC-03 | Known text changes detected correctly | Automated comparison against expected diff | 100% recall on fixture set | P0 |
| AC-04 | XSS payloads neutralized in report | Automated security scan of output HTML | 0 active content in output | P0 |
| AC-05 | Snapshot capture is atomic | Test interrupted write recovery | No corrupted snapshots on disk | P0 |
| AC-06 | Report renders without external network requests | Network monitor during report open | 0 external requests | P0 |
| AC-07 | Report passes WCAG 2.1 AA automated checks | axe-core or pa11y scan | 0 critical/serious violations | P1 |
| AC-08 | False positive rate on noise-only changes | Test against whitespace/styling-only fixtures | < 5% false changes reported | P1 |
| AC-09 | Password-protected documents fail gracefully | Test with encrypted fixtures | Clear error, no crash | P1 |
| AC-10 | Large document (10K words) completes within timeout | Timed execution | < 30 seconds | P1 |
| AC-11 | Unsupported format reports clearly | Test with binary/image fixture | Clear "unsupported" message | P1 |

### Finding 3: Performance Benchmarks

| Benchmark | Document Size | Target | Measurement |
|-----------|--------------|--------|-------------|
| Startup time | N/A | < 1s | Time to `diff compare` command ready |
| Small doc extraction | < 10KB | < 100ms | Time to parse and normalize |
| Medium doc extraction | 100KB - 1MB | < 2s | Time to parse and normalize |
| Large doc extraction | 1MB - 10MB | < 15s | Time to parse and normalize |
| Extra-large doc | 10MB - 50MB | < 60s | Time to parse and normalize (with warning) |
| Diff computation | Small AST (100 nodes) | < 50ms | Time to compute structural diff |
| Diff computation | Medium AST (1000 nodes) | < 500ms | Time to compute structural diff |
| Diff computation | Large AST (10000 nodes) | < 5s | Time to compute structural diff |
| Report generation | Medium diff result | < 500ms | Time to produce HTML output |
| Peak memory | 10MB document | < 256MB | RSS during processing |
| Peak memory | 50MB document | < 1GB | RSS during processing |

### Finding 4: Manual Review Cases

Automated testing cannot cover all fidelity questions. Manual review required for:
1. DOCX heading style-to-semantic mapping accuracy (does Heading 1 → h1 look right?)
2. Table rendering fidelity (are merged cells handled correctly?)
3. PDF text extraction quality on real-world documents
4. Diff readability on non-trivial structural changes
5. Side-by-side view alignment accuracy

### Finding 5: Quality Gate Pipeline

```
Build → Lint → Unit Tests → Integration Tests → Security Scan → Accessibility Audit → Manual Review
  │        │         │              │                │                 │                │
  ▼        ▼         ▼              ▼                ▼                 ▼                ▼
tsc    eslint    vitest/jest    fixture tests    DOMPurify + CSP   axe-core/pa11y   human checklist
```

All gates must pass before v1 release.

## Assessment

**newInfoRatio**: 0.6 — Fixture corpus and acceptance criteria are novel syntheses. Performance targets are estimated (need real measurement to confirm). This is primarily a planning iteration.

## Recommended Next Focus

Integration synthesis — consolidate all findings into the v1 architecture recommendation, risks, open questions, and later-phase decomposition.
