---
title: Directory & Test File Conventions
description: File structure principles, module organization concepts, and import ordering standards for OpenCode system code. — Directory & Test File Conventions.
importance_tier: normal
contextType: implementation
version: 1.0.0.17
---

# Directory & Test File Conventions

## 6. DIRECTORY CONVENTIONS

### OpenCode Skill Structure

```
.opencode/skills/{skill-name}/
├── SKILL.md                    # Main skill definition
├── references/                 # Deep documentation
│   ├── shared/                 # Cross-language patterns
│   │   ├── universal_patterns.md
│   │   └── code_organization.md
│   ├── javascript/             # JS-specific
│   │   ├── style_guide.md
│   │   ├── quality_standards.md
│   │   └── quick_reference.md
│   ├── typescript/             # TS-specific
│   │   ├── style_guide.md
│   │   ├── quality_standards.md
│   │   └── quick_reference.md
│   ├── python/                 # Python-specific
│   ├── shell/                  # Shell-specific
│   └── rust/                   # Rust-specific (napi-rs/WASM/sidecar parity)
├── assets/                     # Templates, checklists
│   └── checklists/
│       ├── universal_checklist.md
│       └── {lang}_checklist.md
└── scripts/                    # Executable tools
    └── *.py
```

### Rust Module and Test Layout

Rust code under `code-opencode` follows Cargo conventions; only the general
placement is shared here — Cargo, napi-rs, and wasm-bindgen mechanics live in
`../rust/`.

```
crate/
├── Cargo.toml                  # Manifest (pinned edition, MSRV, features)
├── src/
│   ├── lib.rs                  # Pure core: deterministic, panic-free public API
│   ├── boundary/               # Thin napi-rs / wasm-bindgen adapters over core
│   └── *.rs                    # #[cfg(test)] mod tests { … }  (inline unit tests)
├── tests/                      # Integration + byte-for-byte parity fixtures vs the TS oracle
│   └── *.rs
└── benches/                    # Optional criterion benchmarks
```

- **Unit tests** live inline as `#[cfg(test)] mod tests` beside the code they cover.
- **Integration/parity tests** live in `tests/`, asserting the Rust path emits bytes identical to the TypeScript oracle for shared fixtures.

### MCP Server Structure

```
mcp_server/
├── context-server.ts           # Entry point
├── tsconfig.json               # TypeScript config
├── package.json
├── run-tests.js                # Test runner
├── configs/                    # Runtime configuration
│   └── search-weights.json
├── core/                       # Core state and config
│   ├── index.ts                # Barrel exports
│   ├── config.ts               # Server configuration
│   └── db-state.ts             # Database state management
├── handlers/                   # Request handlers
│   ├── index.ts                # Barrel exports
│   ├── memory-search.ts        # Search operations
│   ├── memory-save.ts          # Save operations
│   ├── memory-crud.ts          # CRUD operations
│   ├── memory-context.ts       # Context retrieval
│   ├── memory-index.ts         # Index management
│   ├── memory-triggers.ts      # Trigger matching
│   ├── causal-graph.ts         # Causal graph operations
│   ├── checkpoints.ts          # Checkpoint management
│   └── session-learning.ts     # Session learning
├── formatters/                 # Output formatting
│   ├── index.ts                # Barrel exports
│   ├── search-results.ts       # Search result formatting
│   └── token-metrics.ts        # Token usage metrics
├── hooks/                      # Lifecycle hooks
│   ├── index.ts                # Barrel exports
│   └── memory-surface.ts       # Memory surfacing hook
├── lib/                        # Libraries and utilities
│   ├── errors.ts               # Error re-exports
│   ├── architecture/           # Architecture definitions
│   │   └── layer-definitions.ts
│   ├── cache/                  # Caching layer
│   │   └── tool-cache.ts
│   ├── cognitive/              # Cognitive science models
│   │   ├── archival-manager.ts
│   │   ├── attention-decay.ts
│   │   ├── co-activation.ts
│   │   ├── fsrs-scheduler.ts
│   │   ├── prediction-error-gate.ts
│   │   ├── tier-classifier.ts
│   │   └── working-memory.ts
│   ├── config/                 # Type and memory config
│   │   ├── memory-types.ts
│   │   └── type-inference.ts
│   ├── embeddings/             # (placeholder)
│   ├── errors/                 # Error definitions
│   │   ├── index.ts            # Barrel exports
│   │   ├── core.ts             # Core error classes
│   │   └── recovery-hints.ts   # Recovery suggestions
│   ├── interfaces/             # (placeholder)
│   ├── learning/               # (placeholder)
│   ├── parsing/                # Input parsing
│   │   ├── memory-parser.ts
│   │   └── trigger-matcher.ts
│   ├── providers/              # External service providers
│   │   ├── embeddings.ts       # Embedding generation
│   │   └── retry-manager.ts    # Retry logic
│   ├── response/               # Response formatting
│   │   └── envelope.ts         # Response envelope
│   ├── scoring/                # Relevance scoring
│   │   ├── composite-scoring.ts
│   │   ├── confidence-tracker.ts
│   │   ├── folder-scoring.ts
│   │   └── importance-tiers.ts
│   ├── search/                 # Search engines
│   │   ├── bm25-index.ts       # BM25 text search
│   │   ├── hybrid-search.ts    # Hybrid search pipeline
│   │   ├── intent-classifier.ts
│   │   ├── vector-index.ts     # Vector similarity search
│   │   └── vector-index-impl.js # Native implementation
│   ├── session/                # Session management
│   │   └── session-manager.ts
│   ├── storage/                # Persistence layer
│   │   ├── access-tracker.ts
│   │   ├── causal-edges.ts
│   │   ├── checkpoints.ts
│   │   ├── incremental-index.ts
│   │   └── transaction-manager.ts
│   ├── utils/                  # General utilities
│   │   ├── format-helpers.ts
│   │   └── path-security.ts
│   └── validation/             # Input validation
│       └── preflight.ts
├── scripts/                    # Server-specific scripts
│   └── reindex-embeddings.ts
├── utils/                      # Top-level utilities
│   ├── index.ts                # Barrel exports
│   ├── batch-processor.ts
│   ├── json-helpers.ts
│   └── validators.ts
├── tests/                      # Test files (*.test.ts, *.test.js)
│   ├── fixtures/               # Test fixture data
│   └── *.test.ts / *.test.js
└── database/                   # SQLite files (gitignored)
```

### Script Directory Structure

```
scripts/
├── common.sh                   # Shared shell utilities
├── registry-loader.sh          # Script registry loader
├── scripts-registry.json       # Script metadata registry
├── package.json
├── tsconfig.json
├── core/                       # Core script logic
│   ├── index.ts                # Barrel exports
│   ├── config.ts               # Script configuration
│   ├── subfolder-utils.ts      # Spec folder pattern matching and child resolution
│   └── workflow.ts             # Workflow orchestration
├── extractors/                 # Data extractors
│   ├── index.ts                # Barrel exports
│   ├── collect-session-data.ts
│   ├── conversation-extractor.ts
│   ├── decision-extractor.ts
│   ├── diagram-extractor.ts
│   ├── file-extractor.ts
│   ├── implementation-guide-extractor.ts
│   ├── opencode-capture.ts
│   └── session-extractor.ts
├── lib/                        # Shared libraries
│   ├── anchor-generator.ts
│   ├── ascii-boxes.ts
│   ├── content-filter.ts
│   ├── decision-tree-generator.ts
│   ├── embeddings.ts
│   ├── flowchart-generator.ts
│   ├── retry-manager.ts
│   ├── semantic-summarizer.ts
│   ├── simulation-factory.ts
│   └── trigger-extractor.ts
├── loaders/                    # Data loaders
│   ├── index.ts
│   └── data-loader.ts
├── memory/                     # Memory management
│   ├── generate-context.ts
│   ├── cleanup-orphaned-vectors.ts
│   └── rank-memories.ts
├── renderers/                  # Template renderers
│   ├── index.ts
│   └── template-renderer.ts
├── rules/                      # Validation rules (shell)
│   ├── check-ai-protocols.sh
│   ├── check-anchors.sh
│   ├── check-complexity.sh
│   ├── check-evidence.sh
│   ├── check-files.sh
│   ├── check-folder-naming.sh
│   ├── check-frontmatter.sh
│   ├── check-level.sh
│   ├── check-level-match.sh
│   ├── check-placeholders.sh
│   ├── check-priority-tags.sh
│   ├── check-section-counts.sh
│   └── check-sections.sh
├── setup/                      # Setup and installation
│   ├── check-native-modules.sh
│   ├── check-prerequisites.sh
│   ├── rebuild-native-modules.sh
│   └── record-node-version.js
├── spec/                       # Spec folder operations
│   ├── archive.sh
│   ├── calculate-completeness.sh
│   ├── check-completion.sh
│   ├── create.sh
│   ├── recommend-level.sh
│   └── validate.sh
├── spec-folder/                # Spec folder utilities (TS)
│   ├── index.ts
│   ├── alignment-validator.ts
│   ├── directory-setup.ts
│   └── folder-detector.ts
├── templates/                  # Template composition
│   └── manifest renderer
├── utils/                      # Utility modules
│   ├── index.ts
│   ├── data-validator.ts
│   ├── file-helpers.ts
│   ├── input-normalizer.ts
│   ├── logger.ts
│   ├── message-utils.ts
│   ├── path-utils.ts
│   ├── prompt-utils.ts
│   ├── tool-detection.ts
│   └── validation-utils.ts
├── tests/                      # Test suites
│   ├── test_dual_threshold.py
│   ├── test-*.js / test-*.sh
│   └── ...
└── test-fixtures/              # Validation test fixtures
    └── 001-* through 051-*
```

---

## 7. TEST FILE CONVENTIONS

### Test File Naming

| Language   | Pattern                   | Example                    |
|------------|---------------------------|----------------------------|
| JavaScript | `*.test.js`               | `memory-search.test.js`    |
| TypeScript | `*.test.ts`               | `memory-search.test.ts`    |
| Python     | `test_*.py`               | `test_dual_threshold.py`   |
| Shell      | `test_*.sh` or `*.test.sh`| `test_validation.sh`       |

### Test File Location

Keep tests close to source:

```
Option A: Adjacent tests/
lib/
├── search/
│   ├── vector-index.ts
│   └── tests/
│       └── vector-index.test.ts

Option B: Top-level tests/
lib/
├── search/
│   └── vector-index.ts
tests/
└── search/
    └── vector-index.test.ts
```

OpenCode uses **Option B** (top-level tests/) for most projects.

### Test File Structure

```javascript
// *.test.js structure
const assert = require('assert');
const { functionToTest } = require('../path/to/module');

describe('functionToTest', () => {
  describe('when given valid input', () => {
    it('should return expected result', () => {
      const result = functionToTest('valid');
      assert.strictEqual(result, expected);
    });
  });

  describe('when given invalid input', () => {
    it('should throw appropriate error', () => {
      assert.throws(() => functionToTest(null), /expected error/);
    });
  });
});
```

---

## 8. RELATED RESOURCES

### Universal Patterns

- `universal_patterns.md` - Naming, commenting, reference patterns

### Language-Specific Organization

- `../../javascript/style_guide.md` - JS module patterns, exports
- `../../typescript/style_guide/overview-strict-and-naming.md` - TS imports, types, ES module syntax
- `../../python/style_guide.md` - Python imports, `__all__`
- `../../shell/style_guide/overview-structure-and-naming.md` - Shell sourcing, functions
- `../../config/style_guide.md` - JSON/JSONC structure
