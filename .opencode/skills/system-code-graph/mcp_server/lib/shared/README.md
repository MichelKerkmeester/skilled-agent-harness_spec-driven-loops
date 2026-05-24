---
title: "Code Graph Shared: Local Contracts And Runtime Helpers"
description: "Local code-graph contracts for payload shaping, path safety, hook state, metrics stubs and MCP helper types."
trigger_phrases:
  - "code graph shared"
  - "shared payload contract"
  - "code graph metrics stub"
  - "index scope policy"
---

# Code Graph Shared: Local Contracts And Runtime Helpers

> Local helper modules used by the `mk-code-index` runtime without importing sibling skills.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PACKAGE TOPOLOGY](#2--package-topology)
- [3. DIRECTORY TREE](#3--directory-tree)
- [4. KEY FILES](#4--key-files)
- [5. BOUNDARIES AND FLOW](#5--boundaries-and-flow)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/shared/` contains the small contracts and runtime helpers that must be reused across code-graph handlers, library modules and tools. The folder keeps code-graph ownership local, including payload trust fields, MCP response helpers, path canonicalization, hook-state reads and scan-scope filtering.

Current state:

- Shared payload and code-graph contract types are local copies owned by this package.
- `metrics-stub.ts` provides no-op `spec_kit.*` instrumentation hooks so production code does not import `system-skill-advisor`.
- Path helpers guard operator-controlled locations such as CocoIndex binary paths and canonical file paths.
- Hook policy and state helpers expose read-only runtime state to startup and detection modules.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:package-topology -->
## 2. PACKAGE TOPOLOGY

```text
shared/
+-- assert-never.ts             # Exhaustiveness guard
+-- canonical-path.ts           # File path canonicalization helper
+-- cocoindex-path.ts           # CocoIndex binary path resolution
+-- code-graph-contracts.ts     # Local readiness and ops contracts
+-- codex-hook-policy.ts        # Codex hook policy detection
+-- hook-state.ts               # Hook state reads
+-- index-scope.ts              # Scan include and exclude policy
+-- logger.ts                   # Small logging helper
+-- mcp-types.ts                # MCP response and arg parsing helpers
+-- metrics-stub.ts             # No-op spec_kit metric surface
+-- shared-payload.ts           # Trust, provenance and envelope helpers
`-- README.md
```

Allowed dependency direction:

```text
handlers -> lib/shared
lib modules -> lib/shared
tools -> lib/shared
lib/shared -> Node standard modules or sibling files in lib/shared
```

Disallowed dependency direction:

```text
lib/shared -> handlers
lib/shared -> database adapters unless the contract explicitly owns storage
lib/shared -> system-spec-kit or system-skill-advisor source files
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 3. DIRECTORY TREE

```text
shared/
+-- assert-never.ts
+-- canonical-path.ts
+-- cocoindex-path.ts
+-- code-graph-contracts.ts
+-- codex-hook-policy.ts
+-- hook-state.ts
+-- index-scope.ts
+-- logger.ts
+-- mcp-types.ts
+-- metrics-stub.ts
+-- shared-payload.ts
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| File | Responsibility |
|---|---|
| `shared-payload.ts` | Builds trust, provenance and envelope fields for graph-aware payloads. |
| `code-graph-contracts.ts` | Defines local readiness and metadata preview contracts shared with ops-hardening exports. |
| `index-scope.ts` | Applies default excludes and `.opencode/*` opt-in policy for scans. |
| `mcp-types.ts` | Provides typed MCP response and argument parsing helpers. |
| `metrics-stub.ts` | Exposes no-op metric helpers used by code-graph call sites. |
| `cocoindex-path.ts` | Resolves the `ccc` binary path while keeping overrides inside the workspace. |
| `canonical-path.ts` | Resolves canonical filesystem paths for graph records and safety checks. |
| `codex-hook-policy.ts` | Detects whether Codex hook behavior should be enabled. |
| `hook-state.ts` | Reads persisted hook state for startup and readiness surfaces. |
| `assert-never.ts` | Throws on impossible discriminated-union branches. |
| `logger.ts` | Centralizes small logger behavior used by library modules. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Ownership | Contracts here are owned by `system-code-graph`. Do not import sibling skill source to satisfy local type needs. |
| Runtime state | Helpers may read filesystem state when their filename owns that edge, such as hook state or binary path lookup. |
| Metrics | `metrics-stub.ts` intentionally keeps metric emission inert until code-graph owns a real collector. |
| Scan policy | `index-scope.ts` is the source for default code-graph exclusions and `.opencode/*` opt-in behavior. |

Main flow:

```text
handler or library module
  -> shared helper
  -> typed value, safety decision or no-op metric call
  -> caller shapes the final MCP payload
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `createSharedPayloadEnvelope` | Function | Builds compact payload envelopes with provenance and optional metadata. |
| `attachStructuralTrustFields` | Function | Adds parser, evidence and freshness trust fields to payload objects. |
| `attachGraphEdgeEnrichment` | Function | Adds edge evidence class and numeric confidence fields. |
| `shouldIndexForCodeGraph` | Function | Applies scan include and exclude policy for candidate paths. |
| `getCocoIndexBinaryPath` | Function | Resolves the CocoIndex CLI binary path under workspace containment. |
| `parseArgs` | Function | Parses MCP tool args into object payloads. |
| `isSpeckitMetricsEnabled` | Function | Returns whether local code-graph metrics should emit. Currently always `false`. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from the repository root.

```bash
.opencode/skills/system-code-graph/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-code-graph/tsconfig.json
python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme .opencode/skills/system-code-graph/mcp_server/lib/shared/README.md
```

Expected result: TypeScript exits `0`, and the README validator reports no blocking errors.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

| Document | Purpose |
|---|---|
| [../README.md](../README.md) | Parent code-graph library overview. |
| [../utils/README.md](../utils/README.md) | Workspace path safety helpers used beside shared contracts. |
| [../../handlers/README.md](../../handlers/README.md) | Handler modules that consume shared payload helpers. |
| [../../../README.md](../../../README.md) | MCP server package overview. |

<!-- /ANCHOR:related -->
