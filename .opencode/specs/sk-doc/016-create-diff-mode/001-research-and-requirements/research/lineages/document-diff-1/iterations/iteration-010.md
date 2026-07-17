# Iteration 10: Architecture Consolidation and Risk Validation

## Focus
Consolidate all findings; validate v1 architecture against the five key questions; identify remaining risks, validation corpus, and later-phase decomposition.

## Findings

### 1. All five key questions answered

**Q1: Which canonical representation and adapters should v1 use?**
Using the adapter pattern with format-specific parsers (MDAST for Markdown, HAST for HTML, mammoth for DOCX) normalizing to a canonical text representation before diffing. Format tiers: Full (Text/Markdown/HTML), Limited (DOCX), Unsupported (PDF).
[SOURCE: iteration-001.md, iteration-003.md]

**Q2: Which diff algorithms best suppress conversion noise?**
jsdiff (Myers O(ND)) with format-specific normalizers. Key tactics: token-level granularity (`diffLines` for structure, `diffWords` for semantics), whitespace normalization, list/link canonicalization, metadata exclusion. diff2html for rendering with word-level highlighting.
[SOURCE: iteration-002.md, iteration-009.md]

**Q3: Which snapshot lifecycle is safe and predictable?**
Four-phase model: Detect -> Capture -> Compare -> Cleanup. Filesystem-based storage under `~/.document-snapshots/`, SHA-256 hash change detection, explicit API primary + optional chokidar watcher. TTL-based expiration (default 7 days), pair-based retention (last 10 per file).
[SOURCE: iteration-004.md]

**Q4: How should the HTML report expose fidelity and risk?**
Self-contained single HTML file via diff2html + inline CSS/JS. Fidelity header with format match status, conversion fidelity, change severity, and risk level. Change classification: content, structural, formatting, metadata. No external dependencies or network requests.
[SOURCE: iteration-005.md]

**Q5: Which portable core and skill interface should v1 implement?**
TypeScript/Node.js core library (`document-diff-core`) with 5 CLI commands (capture, compare, list, cleanup, config). OpenCode skill wraps core with workspace-aware path resolution. Programmatic API for AI agent integration. npm packaging with optional DOCX dependency.
[SOURCE: iteration-006.md, iteration-008.md]

### 2. Recommended v1 architecture (consolidated)

```
┌─────────────────────────────────────────────────────┐
│                document-diff CLI                     │
│  capture | compare | list | cleanup | config        │
├─────────────────────────────────────────────────────┤
│              OpenCode Skill Wrapper                   │
│  @document-diff capture/compare                      │
├─────────────────────────────────────────────────────┤
│              document-diff-core                       │
│  ┌───────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ Adapters   │  │ Snapshot │  │ Diff Engine      │ │
│  │ ┌───────┐ │  │ Manager  │  │ ┌──────┐┌───────┐│ │
│  │ │Text   │ │  │ ┌──────┐ │  │ │jsdiff││diff2  ││ │
│  │ │MD AST │ │  │ │Store │ │  │ │      ││html   ││ │
│  │ │HAST   │ │  │ │Hash  │ │  │ └──────┘└───────┘│ │
│  │ │Mammoth│ │  │ │TTL   │ │  │                  │ │
│  │ └───────┘ │  │ └──────┘ │  └──────────────────┘ │
│  └───────────┘  └──────────┘                        │
├─────────────────────────────────────────────────────┤
│  Dependencies                                       │
│  diff, diff2html, mammoth?, unified, chokidar?     │
└─────────────────────────────────────────────────────┘
```

### 3. Remaining risks and unknowns
| Risk | Severity | Mitigation |
|------|----------|------------|
| Mammoth security (XSS from DOCX) | High | Sanitize mammoth output through HAST pipeline; document clearly |
| jsdiff performance on very large files | Medium | Set `maxEditLength` and `timeout`; refuse >10MB files |
| diff2html bundle size for self-contained HTML | Low | Accept ~300KB inline bundle as cost of self-containment |
| MD/HST ecosystem churn (unified v13+) | Low | Pin major versions; unified ecosystem is mature and stable |
| Cross-format fidelity gaps | Medium | Explicit fidelity labels; warn users about dual-conversion scenarios |
| Node.js version dependence | Low | Target Node 18 LTS+ (supported until 2025-04) |

### 4. Recommended validation corpus
A test corpus should include:
- `corpus/pair-same-markdown/`: Same-format Markdown before/after pairs (heading changes, list edits, paragraph reflow)
- `corpus/pair-same-html/`: Same-format HTML pairs
- `corpus/pair-docx-to-markdown/`: DOCX before -> Markdown after (conversion fidelity test)
- `corpus/pair-empty/`: Empty file before/after (edge case)
- `corpus/pair-large/`: ~1MB text files (performance test)
- `corpus/pair-identical/`: No-change pairs (should produce empty diff)
- `corpus/pair-encoding/`: UTF-8 vs Latin-1 pairs (encoding test)

### 5. Recommended later-phase decomposition
| Phase | Focus | Dependency |
|-------|-------|------------|
| **Phase 2**: Core implementation | Adapters, snapshot manager, diff engine | Phase 1 (this research) |
| **Phase 3**: CLI + HTML report | 5 commands, self-contained HTML output | Phase 2 |
| **Phase 4**: OpenCode skill wrapper | Skill descriptor, workspace integration | Phase 3 |
| **Phase 5**: DOCX + advanced formats | Mammoth integration, encoding handling | Phase 2+ |
| **Phase 6**: Testing + hardening | Validation corpus, security audit, performance | Phase 3+ |

## Sources Consulted
- All prior iteration findings (iteration-001 through iteration-009)
- `.opencode/specs/.../001-research-and-requirements/spec.md` (five key questions)
- `.opencode/specs/.../001-research-and-requirements/resource-map.md` (known context)

## Assessment
- **newInfoRatio**: 0.25 (Consolidation iteration; most findings are synthesis of prior work; architecture diagram and phase decomposition are new structural outputs; risk catalog is new analysis)
- **Novelty Justification**: This is the final consolidation iteration. Architecture diagram, risk catalog, validation corpus, and phase decomposition are new deliverables not present in prior iterations. The answeredQuestions field confirms all five key questions resolved.

## Reflection
- **What Worked**: All five key questions answered with evidence-backed recommendations. Architecture is coherent and implementable.
- **What Failed**: PDF support remains unsolvable in v1 — correctly deferred.
- **Ruled Out**: See consolidated Eliminated Alternatives below.

## Eliminated Alternatives (Consolidated)
| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|------------------|----------|-------------|
| diff-match-patch library | Repository archived Aug 2024; no maintenance | GitHub repo status | 002 |
| Python runtime | No diff2html equivalent; HTML rendering much harder | npm ecosystem analysis | 006 |
| Rust/WASM runtime | Ecosystem mismatch; no direct jsdiff/diff2html equivalents | npm ecosystem analysis | 006 |
| Deno runtime | Smaller ecosystem; compatibility gaps for v1 | Runtime comparison | 006 |
| SQLite snapshot storage | Unnecessary dependency for v1 | Storage strategy analysis | 004 |
| In-memory-only snapshots | Not persistent across sessions | Storage strategy analysis | 004 |
| PDF diff support in v1 | No parser preserves layout for structural diff | Library ecosystem assessment | 003, 009 |
| Server-side rendering | Violates local-first constraint | spec.md requirements | 005 |
| External CDN dependencies | Violates self-contained requirement | spec.md requirements | 005 |
| Custom diff algorithm | jsdiff is extensible enough; custom implementation is unnecessary complexity | jsdiff API analysis | 002 |
| GUI-only interface | Violates AI agent integration requirement | spec.md requirements | 008 |
| REST API | Violates local-only constraint | spec.md requirements | 008 |

## Recommended Next Focus
No further iterations — all five key questions answered. Proceed to synthesis phase.
