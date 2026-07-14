# Iteration 8: Architecture Shape Comparison and Eliminated Alternatives

## Focus

Compare three architecture shapes for the document diff system, document eliminated alternatives with evidence, and converge on the v1 recommendation.

## Findings

### Finding 1: Architecture Shape A — "Browser-First SPA"

**Description**: A single-page application running entirely in the browser. User drags/drops files, all processing happens in Web Workers or WASM. No CLI, no server, no installation.

**Evaluation**:
- ✅ Zero installation; works on any device with a browser
- ✅ Built-in HTML rendering; XSS isolation via browser sandbox
- ❌ No snapshot lifecycle (browser storage is ephemeral and limited)
- ❌ No CLI integration; cannot be called from AI workflows programmatically
- ❌ File system access limited (File System Access API not universal)
- ❌ Large WASM payloads (pdf.js, mammoth.js) must be loaded per session
- ❌ No integration with OpenCode skill system

**Verdict**: **ELIMINATED** — Cannot support the automatic snapshot lifecycle (REQ-003) or CLI/skill integration (REQ-006). Browser storage is not suitable for persistent, managed baselines.

### Finding 2: Architecture Shape B — "Native Desktop Application"

**Description**: A compiled desktop application (Electron or Tauri) with a GUI for document management, diff viewing, and settings. Includes a CLI for scripted use.

**Evaluation**:
- ✅ Rich UI possible; great diff viewing experience
- ✅ Filesystem access is natural (it's a desktop app)
- ✅ Both CLI and GUI consumers served
- ❌ Heavy dependency footprint (Electron ~200MB; Tauri smaller but still substantial)
- ❌ Complex build and distribution (platform-specific binaries)
- ❌ Overkill for a tool whose primary consumers are AI workflows
- ❌ Installation friction reduces adoption
- ❌ Maintenance burden of GUI framework

**Verdict**: **ELIMINATED** — The primary user is an AI agent (not a human clicking through a GUI). A CLI-first library with HTML report output is the right interface. Desktop GUI adds significant complexity without proportional value.

### Finding 3: Architecture Shape C — "CLI Library with HTML Output" (RECOMMENDED)

**Description**: A Node.js/TypeScript package with a public API, a CLI for direct use, and an HTML report artifact. The OpenCode skill wraps it as a slash-command interface. All processing local; output is a self-contained HTML file.

**Evaluation**:
- ✅ Lightweight dependency footprint (~15-20MB npm install)
- ✅ CLI + programmable API (TypeScript/JavaScript)
- ✅ HTML report output plays to Node.js's strength (rehype/remark)
- ✅ Direct integration with OpenCode skill system
- ✅ Snapshot lifecycle: Node.js has full filesystem access
- ✅ Cross-platform (macOS, Linux, Windows via Node.js)
- ✅ Well-understood distribution model (npm package)
- ✅ Pipeline libraries all native to Node.js ecosystem
- ✅ Portable core is usable by non-OpenCode consumers

**Verdict**: **SELECTED for v1** — Best matches all 6 P0 requirements. The lib-CLI-HTML shape minimizes blast radius while maximizing integration flexibility.

### Finding 4: Architecture Comparison Summary

| Criterion | Shape A (Browser SPA) | Shape B (Desktop App) | Shape C (CLI Library) |
|-----------|----------------------|----------------------|----------------------|
| REQ-001 (Multiple architectures evaluated) | Pass | Pass | Pass |
| REQ-002 (Format capability tiers) | Pass (limited tiers) | Pass | Pass |
| REQ-003 (Snapshot lifecycle) | **FAIL** | Pass | **Pass** |
| REQ-004 (Semantic diff) | Pass (WASM) | Pass | **Pass** |
| REQ-005 (HTML report security) | Pass (browser sandbox) | Pass | **Pass** |
| REQ-006 (Portable core + skill) | **FAIL** | Pass | **Pass** |
| REQ-007 (Library evidence) | — | — | **Pass** (unified.js, mammoth, DOMPurify) |
| REQ-008 (Validation corpus) | — | — | **Pass** |
| REQ-009 (Implementation handoff) | — | — | **Pass** |
| Dependency weight | Medium | **Heavy** | **Light** |
| AI workflow integration | **Poor** | Fair | **Excellent** |
| Distribution complexity | Low | **High** | **Low** |
| Offline capability | Partial | Full | **Full** |

### Finding 5: Eliminated Alternatives Record

1. **Browser-only SPA**: Fails snapshot lifecycle (REQ-003) and CLI/programmatic integration (REQ-006)
2. **Electron/Tauri desktop app**: Excessive dependency weight for CLI-first use case; distribution complexity
3. **Python-only implementation**: Lacks unified.js AST ecosystem; two-language complexity for HTML report
4. **Rust-native binary**: Minimal document processing ecosystem; mammoth not available; must bridge JS/Python
5. **Git-dependent workflow**: Violates core requirement of working without Git (REQ-003)
6. **Cloud-hosted service**: Violates local-only, offline, and privacy requirements
7. **Visual/image diff (pixel comparison)**: Cannot distinguish semantic from layout changes; PDF-to-image pipeline is heavy and slow

## Assessment

**newInfoRatio**: 0.6 — Architecture comparison consolidates prior findings. Eliminated alternatives record is the primary novel contribution this iteration.

## Recommended Next Focus

Fixture corpus, acceptance criteria, and performance benchmarks — define the verification strategy.
