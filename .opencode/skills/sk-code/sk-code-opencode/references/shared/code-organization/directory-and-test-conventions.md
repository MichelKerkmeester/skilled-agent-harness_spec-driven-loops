---
title: Directory & Test File Conventions
description: File structure principles, module organization concepts, and import ordering standards for OpenCode system code. — Directory & Test File Conventions.
trigger_phrases:
  - "directory conventions opencode"
  - "test file conventions"
  - "mcp server structure"
  - "script directory structure"
importance_tier: normal
contextType: implementation
version: 1.0.0.17
---

# Directory & Test File Conventions

Directory and test-file conventions for OpenCode skills, servers, scripts, and supported implementation languages.

---

## 1. OVERVIEW

### Purpose

Define predictable directory layouts and test-file conventions for OpenCode system-code packages.

### When to Use

- Creating or reorganizing a skill, MCP server, or scripts package
- Choosing unit and integration test locations
- Naming test files for a supported language
- Reviewing a package layout for consistency

---

## 2. DIRECTORY CONVENTIONS

### OpenCode Skill Structure

```
.opencode/skills/{skill-name}/
├── SKILL.md                    # Main skill definition
├── references/                 # Deep documentation
│   ├── shared/                 # Cross-language patterns
│   │   ├── universal_patterns.md
│   │   └── code_organization.md
│   ├── javascript/             # JS-specific
│   │   ├── style-guide.md
│   │   ├── quality-standards.md
│   │   └── quick-reference.md
│   ├── typescript/             # TS-specific
│   │   ├── style-guide.md
│   │   ├── quality-standards.md
│   │   └── quick-reference.md
│   ├── python/                 # Python-specific
│   ├── shell/                  # Shell-specific
│   └── rust/                   # Rust-specific (napi-rs/WASM/sidecar parity)
├── assets/                     # Templates, checklists
│   └── checklists/
│       ├── universal-checklist.md
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
mcp-server/
├── tsconfig.json               # TypeScript config
├── package.json
├── eslint.config.mjs           # Lint config
├── api/                        # Public entry surface
│   ├── index.ts                # Barrel exports
│   └── graph-refresh.ts        # Graph refresh entry point
├── core/                       # Core state and config
│   └── config.ts               # Server configuration
├── handlers/                   # Request handlers
│   ├── memory-index-discovery.ts
│   └── save/                   # Save-path handlers
│       └── spec-folder-mutex.ts
├── hooks/                      # Per-runtime lifecycle hook adapters
│   ├── shared-provenance.ts
│   ├── claude/                 # Claude Code adapters
│   ├── codex/                  # Codex CLI adapters
│   ├── cursor/
│   ├── devin/
│   ├── opencode/
│   └── pi/
├── lib/                        # Libraries and utilities
│   ├── MODULE-MAP.md           # Module ownership map
│   ├── cognitive/              # Cognitive science models
│   ├── config/                 # Path and flag resolution
│   │   ├── capability-flags.ts
│   │   └── spec-doc-paths.ts
│   ├── context/                # Shared payload shaping
│   ├── continuity/             # Continuity record writers
│   ├── description/            # Packet description merge
│   ├── discovery/              # Spec document discovery
│   ├── extraction/             # Entity extraction
│   ├── graph/                  # Generated-metadata graph
│   ├── parsing/                # Content normalization
│   ├── resume/                 # Resume ladder
│   ├── search/                 # Folder discovery for search
│   ├── spec/                   # Packet shape predicates
│   ├── storage/                # Persistence layer
│   │   └── transaction-manager.ts
│   ├── templates/
│   ├── test-helpers/
│   ├── utils/                  # General utilities
│   └── validation/             # Document and metadata validation
├── scripts/                    # Server-specific scripts
│   ├── run-tests.mjs           # Test runner
│   └── finalize-dist.mjs       # Build finalization
├── tests/                      # Test files (*.vitest.ts)
│   ├── _support/               # Shared test support
│   └── __helpers__/            # Test helpers
└── dist/                       # Compiled output (gitignored)
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
│   ├── validate-memory-quality.ts
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

## 3. TEST FILE CONVENTIONS

### Test File Naming

| Language   | Pattern       | Discovery contract | Live count at HEAD |
|------------|---------------|--------------------|--------------------|
| TypeScript | `*.vitest.ts` | Vitest configs include `**/*.{vitest,test}.ts` under each package root. | 1,229 |
| TypeScript | `*.test.ts`   | Same Vitest include contract as `*.vitest.ts`. | 43 |
| Node.js    | `*.test.cjs`  | `.opencode/scripts/run-node-tests.mjs` discovers files under its live roots and runs them with `node --test`. | 50 |
| Node.js    | `*.test.mjs`  | `.opencode/scripts/run-node-tests.mjs` discovers files under its live roots and runs them with `node --test`, unless they import Vitest. | 39 |
| Shell      | `*.test.sh`   | Run the executable shell test directly with `bash path/to/test.test.sh`. | 6 |
| Python     | `test_*.py`   | Run the owning package's Python test command; the filename follows pytest discovery vocabulary. | 29 |

`*.test.js` is not a live convention at HEAD and is intentionally not listed.

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

## 4. RELATED RESOURCES

### Universal Patterns

- `universal_patterns.md` - Naming, commenting, reference patterns

### Language-Specific Organization

- `../../javascript/style-guide.md` - JS module patterns, exports
- `../../typescript/style-guide/overview-strict-and-naming.md` - TS imports, types, ES module syntax
- `../../python/style-guide.md` - Python imports, `__all__`
- `../../shell/style-guide/overview-structure-and-naming.md` - Shell sourcing, functions
- `../../config/style-guide.md` - JSON/JSONC structure
