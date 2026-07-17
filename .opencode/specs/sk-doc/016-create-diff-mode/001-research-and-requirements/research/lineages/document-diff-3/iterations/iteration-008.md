# Iteration 8: Validation Corpus and Acceptance Metrics

## Focus
REQ-008: Define a validation corpus and measurable quality gates.

## Findings

### F1: Fixture Categories
| Category | Count | Description |
|----------|-------|-------------|
| **Basic text** | 5 | Single word change, multi-word change, no change, full replacement, empty→content |
| **Markdown structure** | 8 | Heading add/remove/rename, list item add/remove/reorder, link change, code block modification, table cell change, nested list change |
| **HTML structure** | 5 | Element add/remove, attribute change, text content change, nested div reorganization, style-only change (should be noise) |
| **DOCX conversion noise** | 3 | Same content different fonts, same content different styles, real paragraph edit |
| **Normalization** | 4 | CRLF vs LF, mixed encoding, Unicode normalization (é vs e+´), trailing whitespace |
| **Edge cases** | 5 | Empty document, identical documents, fully replaced document, very long line (10K chars), binary content in text file |
| **Negative cases** | 3 | Password-protected DOCX, corrupted ZIP, missing file |

**Total**: ~33 fixture pairs in v1 validation corpus.

### F2: Acceptance Metrics
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Change detection rate** | ≥ 95% of intentional changes detected | Manual annotation of fixtures |
| **False positive rate** | ≤ 5% of reported changes are noise | Comparison with ground-truth diff |
| **Format noise floor** | ≤ 10% for Markdown, ≤ 20% for HTML, ≤ 35% for DOCX | Diff two identical source documents converted through adapter |
| **Report size** | ≤ 2MB for documents up to 100KB source | File size check |
| **Report generation time** | ≤ 5 seconds for 100KB documents | Performance benchmark |
| **XSS safety** | Zero script execution from document content | Automated CSP violation check + manual review |
| **Cross-platform** | Pass on macOS, Linux, Windows | CI matrix |

### F3: Manual Review Test Cases
For subjective quality assessment:
- Markdown document with moved paragraphs (should show as "moved", not "deleted+added")
- HTML table with cell reordering
- DOCX with tracked changes (should warn, not confuse with real diff)
- Nested lists reorganized (3 levels deep)
- Mixed formatting text (bold+italic+link in same paragraph)

### F4: Performance Benchmarks
| Document Size | Max Startup | Max Extraction | Max Diff | Max Report Gen | Total |
|---------------|-------------|---------------|----------|----------------|-------|
| Small (1KB) | 100ms | 200ms | 50ms | 100ms | 500ms |
| Medium (100KB) | 200ms | 500ms | 500ms | 500ms | 2s |
| Large (1MB) | 500ms | 2s | 3s | 2s | 8s |

## Assessment
- **newInfoRatio**: 0.78 — concrete fixture corpus, measurable metrics, performance targets
- **Novelty Justification**: First quantification of acceptance criteria with specific numerical targets

## Recommended Next Focus
Architecture synthesis — recommending the complete v1 architecture from research evidence
