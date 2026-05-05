# Iteration 002: code-correctness

**Dimension**: code-correctness  
**Status**: complete  
**Date**: 2026-05-04T00:00:00Z  

## Scope
Logic errors, edge case handling, and error handling in `inline-gate-renderer.ts`, `level-contract-resolver.ts`, `template-utils.sh`, and `spec-kit-docs.json`.

## Findings

### P1-003: inline-gate-renderer produces unparseable token when gate marker shares line with content
- **Severity**: P1
- **Dimension**: code-correctness
- **Evidence**: `scripts/templates/inline-gate-renderer.ts:109` — When `<!-- IF level:1 -->L1 only<!-- /IF -->` appears on one line, the GATE_OPEN regex captures too much (`-->L1 only`) and `parseAtom()` throws "Unexpected inline gate token: -->L1"
- **Impact**: Template authors who place gate markers and content on the same line get a cryptic crash instead of a helpful error. While EBNF specs gates on their own line, the error messages are opaque.
- **Fix**: Add explicit validation in `renderInlineGates()` that detects gate-open lines with trailing content after `-->` and emits a clear error like "Inline gate marker must appear on its own line — found content after `-->`: 'L1 only'".

### P2-002: level-contract-resolver error messages fully ADR-005 compliant (PASS)
- **Severity**: PASS (verification)
- **Evidence**: `level-contract-resolver.ts:66,71` — All error messages use only "Level {N}" vocabulary. Zero instances of "preset", "capability", or "kind" in error paths. Error wrapper translates internal failures to "Internal template contract could not be resolved for Level {N}".
- **Impact**: Compliant with ADR-005's public/private vocabulary boundary.

### P2-003: template-utils.sh resolve_level_contract() has fragile Node.js dependency chain
- **Severity**: P2
- **Dimension**: code-correctness
- **Evidence**: `template-utils.sh:238-257` — The function uses `node --import "$loader" --input-type=module` with an inline heredoc that `import()`s the resolver at runtime. This creates:
  1. Dependency on `tsx/dist/loader.mjs` being at a specific relative path
  2. Heredoc-based inline JS that can't be syntax-checked at rest
  3. `process.exit(3)` on failure with no shell-level error handling contract
- **Impact**: If `tsx` loader path changes, all shell-based manifest resolution breaks silently. The heredoc approach also makes the JS invisible to IDE tooling.
- **Fix**: Extract inline JS to a standalone `resolve-level-contract.mjs` script with proper error handling; invoke it directly.

### PASS-005: inline-gate-renderer.sh is minimal (14 lines), delegates cleanly to TS renderer
- **Severity**: PASS
- **Evidence**: `scripts/templates/inline-gate-renderer.sh:1-14` — Pure wrapper: `exec node --import "$LOADER" "$RENDERER" "$@"`. No logic duplication. Correct pass-through of all arguments.
- **Impact**: Shell/TS parity maintained via delegation, not duplication.

### PASS-006: Manifest schema passes consistency validation (0 issues)
- **Severity**: PASS
- **Evidence**: Node.js validation across 5 levels × 12 docs × 3 doc-list fields × section gates:
  - 0 doc references to non-existent documents
  - 0 version entries with no corresponding document
  - lazy command/agent/workflow-owned docs correctly marked (handover.md=command, debug-delegation.md=agent, research/research.md=workflow)
  - handover.md absenceBehavior correctly = "silent-skip"
  - presets correctly map 1→simple, 2→qa-verification, 3→arch, 3+→governed, phase→phase-parent
- **Impact**: Schema integrity is solid. Single source of truth structurally sound.

### PASS-007: Renderer edge cases correctly handled
- **Severity**: PASS
- **Evidence**: Tested via direct invocation:
  - Empty template → returns "" (no crash)
  - Unmatched `<!-- /IF -->` → throws "Unmatched inline gate close marker"
  - Unclosed `<!-- IF ... -->` → throws "Unclosed inline gate marker"
  - Code fence protection: gate markers inside ``` blocks are preserved literally (correct)
  - Level:2 rendering Level:1 gate: content correctly stripped (second test passed)

## Dimension Coverage After This Iteration
- implementation-spec-alignment: CONVERGING (2 P1, 1 P2 from iter 1)
- code-correctness: REVIEWED (1 P1, 1 P2 new)
- template-rendering-correctness: PENDING
- validator-coverage: PENDING
- cross-runtime-mirror-consistency: PENDING

## Adjudication Claim Packets

### Claim: P1-003 is correctly classified
- **claim**: inline-gate-renderer produces unparseable token error when gate shares line with content
- **evidenceRefs**: ["inline-gate-renderer.ts:109"]
- **counterevidenceSought**: Whether existing templates all respect one-line-per-gate convention (they do — per EBNF grammar iter 6)
- **alternativeExplanation**: This is by-design — EBNF grammar requires gates on their own line. But error quality is P1-worthy.
- **finalSeverity**: P1
- **confidence**: 0.90
- **downgradeTrigger**: If all production templates already follow the one-gate-per-line convention and no user-facing tool produces multi-gate-line templates

## Graph Events
```json
[
  {"type": "DIMENSION", "id": "dim-002", "name": "code-correctness", "iteration": 2},
  {"type": "FILE", "id": "file-inline-gate-renderer", "name": "scripts/templates/inline-gate-renderer.ts", "iteration": 2},
  {"type": "FILE", "id": "file-level-contract-resolver", "name": "mcp_server/lib/templates/level-contract-resolver.ts", "iteration": 2},
  {"type": "FILE", "id": "file-template-utils", "name": "scripts/lib/template-utils.sh", "iteration": 2},
  {"type": "FINDING", "id": "find-p1-003", "name": "Renderer cryptic error on malformed gate", "iteration": 2, "severity": "P1"},
  {"type": "FINDING", "id": "find-p2-003", "name": "Shell resolver fragile dependency chain", "iteration": 2, "severity": "P2"},
  {"relation": "COVERS", "sourceId": "find-p1-003", "targetId": "file-inline-gate-renderer"},
  {"relation": "COVERS", "sourceId": "find-p2-003", "targetId": "file-template-utils"}
]
```
