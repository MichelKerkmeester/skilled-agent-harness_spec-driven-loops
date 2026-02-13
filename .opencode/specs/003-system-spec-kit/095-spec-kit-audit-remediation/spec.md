# Spec: System Spec-Kit Code Audit & Remediation

## Status: COMPLETED

## Overview

Comprehensive code audit and remediation of the entire `system-spec-kit` skill codebase (`.opencode/skill/system-spec-kit/`) against the `workflows-code--opencode` coding standards. Conducted across 4+ Claude Code sessions using up to 10 parallel Opus 4.6 audit agents.

## Scope

### In Scope

- All TypeScript source files in `mcp_server/`, `scripts/src/`, `shared/`
- All shell scripts in `scripts/`
- Python test files in `scripts/tests/`
- JSON/JSONC configuration files
- Header standardization, naming conventions, logging safety, type consolidation
- Bug detection and fixing (critical runtime bugs)

### Out of Scope

- 139 pre-existing TypeScript errors at baseline (interface version drift between MCP SDK types and handlers); 3 resolved by MemoryRow consolidation, 136 remaining
- Runtime testing (no test suite execution beyond syntax validation)
- New feature development

## Requirements

### Functional

- REQ-001: All file headers must follow `// MODULE: Title Case Name` format with standard `---` dividers
- REQ-002: All `console.log` calls in MCP server code must be replaced with `console.error` (MCP stdio protocol safety)
- REQ-003: All class methods must use camelCase naming (snake_case deprecated with backward-compat aliases)
- REQ-004: No duplicate `export default` alongside named exports
- REQ-005: Import ordering: stdlib -> external -> internal with blank line separators
- REQ-006: Shell scripts must use `set -euo pipefail`, `[[ ]]` test syntax, TTY detection
- REQ-007: Python test methods must have `-> None` return type annotations
- REQ-008: No unused dependencies in package.json
- REQ-009: Duplicate type definitions consolidated to single canonical location
- REQ-010: All critical runtime bugs detected by audit agents must be fixed

### Non-Functional

- NFR-001: Zero new TypeScript compilation errors introduced
- NFR-002: All changes backward-compatible (deprecated aliases where needed)
- NFR-003: dist/ successfully rebuilt after each fix phase

## Technical Context

- **Codebase**: `.opencode/skill/system-spec-kit/` (symlinked from Public repo)
- **Public repo**: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/`
- **Build system**: TypeScript composite builds (root tsconfig references shared -> mcp_server -> scripts)
- **Module system**: CommonJS (`"module": "commonjs"`)
- **Standards reference**: `.opencode/skill/workflows-code--opencode/`

## Acceptance Criteria

- [x] All P0 violations fixed across all file types
- [x] All critical/high severity bugs fixed
- [x] P1 violations fixed where safe to do so
- [x] Build produces 0 new errors (136 pre-existing remain)
- [x] dist/ rebuilt with all changes
