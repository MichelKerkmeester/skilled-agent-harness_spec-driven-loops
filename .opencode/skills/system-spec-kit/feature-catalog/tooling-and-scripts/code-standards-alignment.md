---
title: "Code standards alignment"
description: "Code standards alignment brought comments, MODULE/COMPONENT headers, import ordering, and constant naming into line with sk-code OPENCODE route standards."
trigger_phrases:
  - code standards alignment
  - MODULE COMPONENT headers
  - import ordering
  - constant naming convention
  - sk-code standards compliance
version: 3.6.0.24
---

# Code standards alignment

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Code standards alignment brought comments, MODULE/COMPONENT headers, import ordering, and constant naming into line with sk-code OPENCODE route standards.

This was a cleanup pass that made the code follow a consistent style across the project. It fixed 45 places where comments, file headers, naming patterns or import ordering did not match the agreed-upon rules. Think of it like an editor going through a document to make sure every chapter uses the same formatting and citation style.

## 2. HOW IT WORKS

All modified files were reviewed against sk-code OPENCODE route standards. At HEAD, the live codebase uses MODULE/COMPONENT headers plus purposeful inline comments where explanation adds value. Legacy AI-intent prefixes (`AI-WHY`, `AI-TRACE`, `AI-GUARD`) are no longer part of the active convention, and `rg "AI-(WHY|TRACE|GUARD):" .opencode/skills/system-spec-kit/mcp-server` returns no matches.

## 3. SOURCE FILES

### SOURCE EVIDENCE

### 1) Purposeful comments and retired AI-intent prefixes

- **Rule mapping**
  - `sk-code/references/opencode/shared/universal_patterns.md` documents the purposeful-comment rule used at HEAD.
  - `sk-code/assets/opencode/checklists/typescript-checklist.md` keeps file headers as a compliance check.
- **HEAD evidence**
  - `rg "AI-(WHY|TRACE|GUARD):" .opencode/skills/system-spec-kit/mcp-server` returns no matches at HEAD.
  - The live alignment posture uses standardized `// MODULE:` / `// COMPONENT:` headers and targeted explanatory comments rather than AI-intent marker prefixes.

### 2) MODULE/COMPONENT headers

- **Rule mapping**
  - `sk-code/assets/opencode/checklists/typescript-checklist.md` (required file header format by language)
  - `sk-code/references/opencode/typescript/quality-standards.md` (file header and module boundary standards)
- **File-level evidence (10 files, 1 header each at HEAD)**
  - `mcp-server/handlers/memory-save.ts` → `1`
  - `mcp-server/lib/search/hybrid-search.ts` → `1`
  - `mcp-server/lib/search/folder-discovery.ts` → `1`
  - `mcp-server/lib/search/rsf-fusion.ts` (deleted) → was `1`
  - `mcp-server/lib/search/graph-search-fn.ts` → `1`
  - `mcp-server/lib/scoring/composite-scoring.ts` → `1`
  - `mcp-server/lib/parsing/trigger-matcher.ts` → `1`
  - `mcp-server/lib/cognitive/co-activation.ts` → `1`
  - `mcp-server/lib/search/query-classifier.ts` → `1`
  - `mcp-server/lib/search/channel-representation.ts` → `1`
- **Verification method**
  - `rg "^//\\s*(MODULE|COMPONENT):" <file>` returns one marker per file in the list above.

### 3) Import ordering and grouping

- **Rule mapping**
  - `sk-code/references/opencode/typescript/style-guide.md` (import order)
- **File-level evidence**
  - `mcp-server/handlers/memory-save.ts:6-21` has grouped import blocks:
    - `Node built-ins` → `Shared packages` → `Internal modules`
  - `mcp-server/lib/search/hybrid-search.ts:8-53` separates runtime imports and `type` imports.
  - `mcp-server/lib/search/graph-search-fn.ts:6-10` keeps runtime imports before `import type`.

### 4) Constant naming (`specFolderLocks` → `SPEC_FOLDER_LOCKS`)

- **Rule mapping**
  - `sk-code/references/opencode/typescript/style-guide.md` (TypeScript constants use UPPER_SNAKE)
- **File-level evidence**
  - `mcp-server/handlers/save/spec-folder-mutex.ts:10` defines `const SPEC_FOLDER_LOCKS = ...`.
  - `rg "\\bspecFolderLocks\\b" mcp-server/handlers/save mcp-server/handlers/memory-save.ts` returns no matches.
  - `rg "SPEC_FOLDER_LOCKS" mcp-server/handlers/save/spec-folder-mutex.ts` returns active uses at lines `10, 14, 19, 23, 24, 29`.

---

### VERIFICATION TRACEABILITY

### Lint/check commands

- Lint (MCP server scope):
  - `cd .opencode/skills/system-spec-kit/mcp-server && npm run lint`
- Lint + type-check bundle:
  - `cd .opencode/skills/system-spec-kit/mcp-server && npm run check`
- Workspace type-check:
  - `cd .opencode/skills/system-spec-kit && npm run typecheck`

### Expected compliant output

- `npm run lint` exits `0` and reports `0` warnings / `0` errors.
- `npm run check` exits `0` (lint clean + `npx tsc --noEmit` clean).
- `npm run typecheck` exits `0` across `shared`, `mcp_server` and `scripts`.

### Configuration links (rules and enforcement points)

- ESLint rules:
  - `mcp-server/eslint.config.mjs`
  - Includes `@typescript-eslint/no-unused-vars` (error severity).
- TypeScript configs:
  - `tsconfig.json` (workspace references)
  - `mcp-server/tsconfig.json`
  - `scripts/tsconfig.json`
- Script entry points:
  - `mcp-server/package.json` (`lint`, `check`)
  - `package.json` at `system-spec-kit` root (`typecheck`)

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/code-standards-alignment.md`

### SOURCE FILES

### Representative implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/handlers/save/spec-folder-mutex.ts` | Handler/save | Owns the extracted `SPEC_FOLDER_LOCKS` constant and per-spec-folder save mutex used by the standards-alignment evidence above |

Related references:
- [dead-code-removal.md](../../feature-catalog/tooling-and-scripts/dead-code-removal.md) — Dead code removal
- [real-time-filesystem-watching-with-chokidar.md](../../feature-catalog/tooling-and-scripts/real-time-filesystem-watching-with-chokidar.md) — Real-time filesystem watching with chokidar

---

### SOURCE METADATA
