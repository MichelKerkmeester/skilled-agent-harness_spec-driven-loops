# Iteration 3: Diff Algorithm Comparison

## Focus

Compare tree-aware, word-level, line-based, and semantic diff algorithms for the normalized AST pipeline, focusing on noise suppression and structural awareness.

## Findings

### Finding 1: Tree Diff is the Right v1 Foundation

Structural/tree-aware diffing (as demonstrated by difftastic) is the correct approach for document comparison because:
- It understands that whitespace changes, reflowing, and indentation are not semantic changes
- It distinguishes between "paragraph reflowed" and "paragraph content changed"
- It can identify moved blocks (sections reordered) vs. modified blocks
- The algorithm treats AST node comparison as a graph shortest-path problem using Dijkstra's

difftastic's architecture validates this: parse to AST (via tree-sitter), then compute structural diff on the tree using minimum edit operations.

[SOURCE: https://github.com/Wilfred/difftastic, https://difftastic.wilfred.me.uk/diffing.html]

### Finding 2: Algorithm Comparison Matrix

| Algorithm | Input | Strengths | Weaknesses | Doc Diff Suitability |
|-----------|-------|-----------|------------|---------------------|
| Myer's diff (line) | Lines | Fast, standard, well-understood | Misses structural changes, reflow false positives | Poor — only for plain text |
| Myer's diff (word) | Words/tokens | Better granularity than line diff | Still flat, no structure awareness | Fair — fallback for unsupported formats |
| Patience diff | Lines | Better for moved blocks | Line-oriented, no AST awareness | Poor |
| Histogram diff | Lines | Better than Myer's for some cases | Line-oriented | Poor |
| Tree edit distance (Zhang-Shasha) | AST nodes | Structure-aware, correct by construction | O(n^4) worst case | Good but too slow for large docs |
| Structural diff (Dijkstra-based) | AST nodes | Structure-aware, practical performance | Complex implementation | Excellent — difftastic's proven approach |
| Semantic diff (embedding-based) | Vectors | Captures meaning, not just text | Black box, unpredictable | Experimental only |

### Finding 3: Hybrid Diff Strategy for v1

Recommended v1 strategy: **AST-aware structural diff with word-level text fallback**
1. Parse both documents to normalized AST (mdast/hast)
2. Compute tree-level diff (structural changes: added/removed/moved sections)
3. For leaf nodes (text content), compute word-level diff within the structural context
4. Present results hierarchically: structural changes frame the report, text changes fill the details

This combines the best of both worlds: structural awareness from the AST and fine-grained text comparison for content changes.

### Finding 4: Noise Suppression Rules

Critical normalization steps to suppress conversion noise:
- Unicode normalization (NFC form)
- Whitespace normalization (collapse runs, trim)
- Newline normalization (\r\n → \n)
- Metadata stripping (generator timestamps, revision IDs)
- Style-to-semantic mapping (ignore font changes, keep heading levels)
- List marker normalization (• vs * vs - → canonical marker)
- Table structure normalization (colspan/rowspan → canonical grid)

### Finding 5: Move Detection is v1.5+

Move-aware diffing (identifying reordered sections vs. modified sections) adds significant complexity. For v1, recommend:
- Mark structural additions and removals clearly
- Flag potential moves heuristically (large removal + similar large addition)
- Defer true move detection (LCS on paragraph hashes) to v1.5
- Document this as a known limitation

## Assessment

**newInfoRatio**: 0.7 — Algorithm comparison is an extension of known difftastic patterns, but the hybrid strategy, noise suppression rules, and move detection deferral are novel contributions.

## Recommended Next Focus

Snapshot lifecycle — how to capture, store, identify, and clean up document baselines safely and atomically.
