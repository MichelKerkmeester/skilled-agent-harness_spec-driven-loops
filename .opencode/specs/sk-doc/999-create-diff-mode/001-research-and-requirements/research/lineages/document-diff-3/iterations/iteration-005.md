# Iteration 5: Portable Core and Skill Interface

## Focus
Q5: Which portable core and skill interface should be implemented?

## Findings

### F1: Two-Layer Architecture
```
┌─────────────────────────────────┐
│  OpenCode Skill (orchestration)  │  ← AI-aware: trigger, config, user interaction
│  - Snapshot capture trigger      │
│  - Invoke core after AI edit     │
│  - Open HTML report              │
└──────────────┬──────────────────┘
               │ calls
┌──────────────▼──────────────────┐
│  Portable Core (deterministic)   │  ← Pure function: format → canonical → diff → report
│  - parseFormat(path, format)     │
│  - extractCanonical(doc)         │
│  - computeDiff(before, after)    │
│  - renderReport(diff, options)   │
└─────────────────────────────────┘
```

This separation ensures:
1. The core can be used outside OpenCode (CLI, other AI runtimes, CI/CD)
2. The skill handles AI-specific orchestration (auto-snapshot timing, UI integration)
3. The core has no AI runtime dependency

### F2: Portable Core API Contract (v1)
```typescript
// Core library interface
interface DocumentDiffCore {
  // Parse and extract canonical representation
  extractCanonical(filePath: string, format: Format): Promise<CanonicalDocument>;
  
  // Compute structured diff between two canonical documents
  computeDiff(before: CanonicalDocument, after: CanonicalDocument, options?: DiffOptions): Promise<DocumentDiff>;
  
  // Render diff as self-contained HTML string
  renderHtmlReport(diff: DocumentDiff, options?: ReportOptions): Promise<string>;
  
  // Convenience: full pipeline for two file paths
  compareDocuments(beforePath: string, afterPath: string, options?: CompareOptions): Promise<CompareResult>;
}

interface CanonicalDocument {
  format: Format;
  fidelityScore: number;       // 0.0 - 1.0
  extractionWarnings: Warning[];
  title: string;
  sections: Section[];         // headings, paragraphs, lists, tables
  metadata: DocumentMetadata;  // hash, encoding, mtime, word count
  rawText: string;             // plain text fallback
}

interface DocumentDiff {
  format: Format;
  changes: Change[];           // classified changes with fidelity context
  summary: DiffSummary;        // counts by change type
  fidelityWarnings: Warning[]; // extraction-related caveats
}

interface CompareResult {
  htmlReport: string;
  summary: DiffSummary;
  outputPath?: string;
}
```

### F3: CLI Contract (v1)
```bash
# Automatic mode (captures snapshot on first call, diffs on second)
doc-diff watch <file>           # Capture baseline snapshot
doc-diff compare <file>         # Compare current vs last snapshot, generate report
doc-diff compare <path> <path>  # Compare two explicit files

# Report output
doc-diff report <file>          # Open last generated report
doc-diff report <file> --output report.html  # Write report to specific path

# Snapshot management  
doc-diff snapshots list         # List captured snapshots
doc-diff snapshots clean        # Remove expired snapshots
doc-diff snapshots prune --older-than 7d  # Remove snapshots older than N days

# Options (applied to compare)
--format <txt|md|html|docx|pdf|auto>  # Force format (default: auto-detect by extension)
--mode <side-by-side|unified>          # Report view mode
--no-color                             # Disable syntax highlighting in code blocks
```

### F4: OpenCode Skill Contract
```yaml
# Skill trigger pattern
trigger: "document diff", "doc diff", "diff document", "compare document"
  
# Skill workflow:
# 1. Identify target document from user context
# 2. If no snapshot exists: capture baseline ("Snapshot saved for {file}")
# 3. AI edits the document
# 4. After edit: invoke doc-diff compare, open report
# 5. Present summary to user, offer to open HTML report

# Skill metadata:
# - Name: document-diff
# - Runtime: Node.js (portable core)
# - Dependencies: diff, mammoth, cheerio, remark
# - Category: review
```

### F5: Dependency Policy
- **Mandatory core**: `diff` (BSD-3-Clause) — the diff engine
- **Optional adapters** (only loaded when format detected):
  - `remark` + `remark-parse` (MIT) — Markdown
  - `cheerio` (MIT) — HTML
  - `mammoth` (BSD-2-Clause) — DOCX
- **All BSD/MIT licensed** — no GPL copyleft concerns
- **No native binaries required** — pure JavaScript, cross-platform

## Assessment
- **newInfoRatio**: 0.80 — defined concrete API, CLI, and skill contracts
- **Novelty Justification**: TypeScript interface design for the two-layer architecture, complete CLI contract, specific dependency choices

## Reflection
### Ruled Out
- Monolithic skill-only architecture (loses portability)
- WASM-based diff engine (unnecessary performance optimization for v1)

## Recommended Next Focus
Q6 continued: PDF format specifics and adapter architecture consolidation
