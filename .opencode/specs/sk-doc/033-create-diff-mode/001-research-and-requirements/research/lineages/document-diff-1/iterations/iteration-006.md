# Iteration 6: Runtime and Language Selection

## Focus
Evaluate TypeScript/Node.js as the runtime for the portable core; assess dependency weight, portability, and packaging.

## Findings

### 1. Node.js/TypeScript is the clear choice
All identified v1 dependencies are npm packages:
- **jsdiff** (diff engine): npm, 95M/week, BSD-3-Clause
- **diff2html** (HTML renderer): npm, TypeScript, MIT
- **mammoth** (DOCX parser): npm, 5.2M/week, BSD-2-Clause
- **remark/unified** (Markdown parser): npm ecosystem, MIT
- **rehype** (HTML parser): npm ecosystem, MIT
- **chokidar** (optional file watching): npm, 188M/week, MIT

### 2. Alternative runtime evaluation
| Runtime | Pros | Cons | Verdict |
|---------|------|------|---------|
| **Node.js/TypeScript** | All dependencies native; largest ecosystem; ESM + CJS support; excellent tooling (tsc, esbuild, vitest) | Larger runtime (~50MB) | **RECOMMENDED** |
| **Deno** | Built-in TypeScript; secure-by-default; single binary | Smaller ecosystem; some npm compat issues; fewer users | Consider for v2 |
| **Python** | Excellent for NLP/text processing; docx/PDF libraries | No diff2html equivalent; HTML rendering much harder; cross-platform packaging complex | NOT recommended |
| **Rust (compiled WASM)** | Performance; small binary | No direct diff2html/jsdiff equivalents; JS interop overhead; ecosystem mismatch | NOT recommended |
| **Bun** | Fast; npm-compatible; single binary | Younger ecosystem; some compatibility edge cases | Monitor for v2 |

### 3. Dependency weight assessment
v1 minimal dependency tree (estimated):
- `diff` ~50KB (zero dependencies)
- `diff2html` ~200KB (+ highlight.js optional ~100KB)
- `mammoth` ~500KB (10 dependencies, but only needed for DOCX)
- `unified` + `remark-parse` + `mdast-util-to-markdown` ~300KB
- `rehype-parse` + `hast-util-to-html` ~200KB
- Total core: ~1.25MB. Add DOCX support: ~1.75MB.

Install size is acceptable for a local CLI tool. Consider making DOCX support an optional dependency (`npm install document-diff --include=docx` or similar).

### 4. Packaging and distribution
- **npm package**: Primary distribution channel. `npx document-diff compare file-v1.md` for instant use.
- **CLI binary**: Optionally bundle with `pkg` or `bun build --compile` for standalone binary distribution (no Node.js required).
- **OpenCode skill**: Consumed as `@document-diff` skill within OpenCode; the skill descriptor references the npm package or local clone.
- **Configuration**: `.document-diffrc.json` for user preferences (snapshot TTL, default output format, format tier overrides).

### 5. Build and test tooling
- **TypeScript**: Strict mode, target ES2022 (Node 18+ LTS)
- **Build**: `tsup` or `esbuild` for fast compilation
- **Test**: `vitest` for unit + integration tests
- **Lint**: ESLint + Prettier (consistent with OpenCode conventions)
- **CI**: GitHub Actions for test + publish

## Sources Consulted
- npm package documentation (jsdiff, diff2html, mammoth, chokidar)
- Prior iteration findings (dependency analysis)
- `.opencode/specs/.../001-research-and-requirements/spec.md` (portable core requirement)

## Assessment
- **newInfoRatio**: 0.6 (Runtime comparison and dependency weight analysis are new; packaging strategy refined; alternative runtimes evaluated and ruled out)
- **Novelty Justification**: Systematically evaluated 5 runtimes; quantified dependency weight; proposed optional DOCX dependency to keep core lean; established packaging strategy with npx-first approach.

## Reflection
- **What Worked**: npm ecosystem dominance makes Node.js the obvious and correct choice.
- **What Failed**: Rust/WASM would be overengineered for v1.
- **Ruled Out**: Python (HTML rendering gap), Rust (ecosystem mismatch), Deno (ecosystem immaturity for v1).

## Recommended Next Focus
Security considerations: local file access safety, path traversal prevention, HTML sanitization, snapshot storage security.
