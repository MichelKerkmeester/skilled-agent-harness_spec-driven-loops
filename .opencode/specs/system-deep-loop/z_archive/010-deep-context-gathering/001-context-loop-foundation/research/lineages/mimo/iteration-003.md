===FINDINGS START===

## ContextReportSchema

Ordered by value to downstream consumers. Each section: `name | purpose | format | consumed-by`

| # | Section | Purpose | Format | Consumed By |
|---|---------|---------|--------|-------------|
| 1 | **Reuse Catalog** | Existing functions/utilities/patterns to extend (highest value — avoids reimplementation) | **JSON array** — see ReuseCatalogDesign below | plan Step 2 (scope), plan Step 5 (approach), implement Step 1 (verify refs), implement Step 6 (extend not create) |
| 2 | **Architecture Map** | File tree, entry points, component boundaries, layering | **JSON** `{layers:[{name,files:[{path,purpose,lines}]}], entryPoints:[], boundaries:[]}` | plan Step 2 (scope), plan Step 5 (architecture_explorer replacement) |
| 3 | **Dependency Graph** | Import/call relationships, blast radius, coupling hotspots | **JSON** `{nodes:[{id,path,kind}], edges:[{from,to,kind,weight}], hotspots:[{path,inDegree,outDegree}]}` | plan Step 5 (dependency_explorer replacement), implement Step 3 (consistency) |
| 4 | **Existing Decisions** | Prior spec-doc records, architectural decisions, constraints | **Hybrid** — JSON array `{id,title,source,snippet}` + prose summary paragraph | plan Step 5 (feature_explorer replacement), implement Step 1 (context) |
| 5 | **Test Infrastructure** | Test patterns, frameworks, co-location conventions, coverage shape | **JSON** `{framework, patterns:[{name,example,file}], conventions:[], coverageGaps:[]}` | plan Step 5 (test_explorer replacement), implement Step 6 (test writing) |
| 6 | **Pattern Atlas** | Naming conventions, architecture patterns, middleware/error/logging patterns | **Markdown** — bulleted list with `file:line` citations per pattern | plan Step 3 (spec), plan Step 5 (feature_explorer), implement Step 6 (conform) |
| 7 | **Integration Surface** | External APIs, config files, env vars, DB schemas, CLI entry points | **JSON** `{apis:[], config:[], envVars:[], schemas:[], entryPoints:[]}` | plan Step 5 (scope), implement Step 6 (integration) |
| 8 | **Context Coverage Dashboard** | Saturation metrics: files scanned, patterns found, questions answered, convergence score | **JSON** `{filesScanned, patternsFound, questionsAnswered, convergenceScore, iterationN}` | Loop convergence gate (internal), plan Step 5 (confidence) |
| 9 | **Gaps & Risks** | Uncovered areas, contradictions, uncertainties, tech debt | **Markdown** — bulleted with severity (P0/P1/P2) and `file:line` evidence | plan Step 4 (clarification), plan Step 5 (risk), implement Step 3 (consistency) |

### Section injection into plan.md / implement.md

**`/speckit:plan` Step 2 (Request Analysis):** Reads §1 Reuse Catalog to identify existing code to leverage; §2 Architecture Map for scope boundaries.

**`/speckit:plan` Step 5 (Planning — 4-agent exploration replacement):** The entire 4-agent parallel dispatch (`architecture_explorer`, `feature_explorer`, `dependency_explorer`, `test_explorer`) is **replaced** by reading pre-computed Context Report sections §2, §4, §3, §5 respectively. This eliminates 4 Task tool dispatches and their token cost.

**`/speckit:implement` Step 1 (Review Plan & Spec):** Reads §1 Reuse Catalog to verify plan.md references to existing code still exist; §4 Existing Decisions for constraints.

**`/speckit:implement` Step 3 (Analysis):** Reads §3 Dependency Graph for consistency check; §9 Gaps & Risks for known issues.

**`/speckit:implement` Step 6 (Development):** Reads §1 Reuse Catalog for functions to extend; §6 Pattern Atlas for conventions to follow; §5 Test Infrastructure for test patterns.

---

## ReuseCatalogDesign

Highest-value section. Fields per entry:

```json
{
  "id": "reuse-001",
  "symbol": "functionName",
  "kind": "function | class | util | pattern | hook | config",
  "file": "src/auth/validate.ts",
  "line": 42,
  "signature": "validateToken(token: string): Promise<AuthResult>",
  "purpose": "JWT validation with expiry check",
  "reuseStrategy": "extend | compose | wrap | import-direct",
  "confidence": 0.92,
  "relevance": 0.85,
  "evidence": "grep 'validateToken' found 3 call sites",
  "relatedEntries": ["reuse-003"],
  "limitations": "Does not handle refresh tokens"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Stable identifier for cross-referencing |
| `symbol` | string | Function/class/variable name |
| `kind` | enum | What kind of reusable artifact |
| `file` | string | Relative path from repo root |
| `line` | number | Line number |
| `signature` | string | Full type signature or config shape |
| `purpose` | string | One-line what-it-does |
| `reuseStrategy` | enum | How to reuse: `extend` (add params/overloads), `compose` (use as building block), `wrap` (decorate), `import-direct` (use as-is) |
| `confidence` | 0-1 | How certain we are this is reusable (verified by Read) |
| `relevance` | 0-1 | How relevant to the feature being planned (Bayesian from coverage-graph) |
| `evidence` | string | How discovered (code_graph_query, Grep, Read) |
| `relatedEntries` | string[] | IDs of entries that compose together |
| `limitations` | string | Known constraints or gaps |

**Sorting:** Primary: `relevance` desc. Secondary: `confidence` desc. Tertiary: `kind` (functions > utils > patterns > configs).

**Confidence computation:** 1.0 = Read-verified, signature parsed, call sites confirmed. 0.8 = Read-verified but no call-site analysis. 0.6 = Grep-discovered, not Read-verified. <0.6 = excluded.

---

## ConsumerFit

### /speckit:plan consumption

| Plan Step | Context Report Section | How Consumed |
|-----------|----------------------|--------------|
| Step 2 (Request Analysis) | §1 Reuse Catalog, §2 Architecture Map | Agent reads JSON arrays, extracts scope boundaries and existing code to leverage. Replaces manual Grep/Glob discovery. |
| Step 3 (Pre-Work Review) | §6 Pattern Atlas | Agent reads naming/architecture patterns to embed in spec.md conventions section. |
| Step 5 (Planning) | §1-§5, §7 | **Replaces 4-agent parallel dispatch entirely.** Agent reads pre-computed sections instead of spawning 4 @context Task tool calls. Saves ~4K tokens per agent × 4 = ~16K tokens + dispatch overhead. |
| Step 5 (Clarification) | §9 Gaps & Risks | Feeds [NEEDS CLARIFICATION] markers and risk items into spec.md. |

### /speckit:implement consumption

| Implement Step | Context Report Section | How Consumed |
|---------------|----------------------|--------------|
| Step 1 (Review Plan) | §1 Reuse Catalog | Cross-checks plan.md references against Reuse Catalog entries. If plan says "extend validateToken()" but reuse-001 says limitation "Does not handle refresh tokens", flags inconsistency. |
| Step 3 (Analysis) | §3 Dependency Graph, §9 Gaps & Risks | Verifies plan's dependency assumptions match actual import graph. Surfaces known risks before coding. |
| Step 6 (Development) | §1, §5, §6 | Primary development reference: §1 for functions to extend, §5 for test patterns, §6 for conventions. |

### Machine-readable vs prose split

| Section | Machine-readable | Prose |
|---------|-----------------|-------|
| §1 Reuse Catalog | JSON array (100%) | — |
| §2 Architecture Map | JSON (100%) | — |
| §3 Dependency Graph | JSON (100%) | — |
| §4 Existing Decisions | JSON array + summary paragraph | 1 paragraph |
| §5 Test Infrastructure | JSON (80%) | Conventions list (20%) |
| §6 Pattern Atlas | — | Markdown bullets with citations (100%) |
| §7 Integration Surface | JSON (100%) | — |
| §8 Coverage Dashboard | JSON (100%) | — |
| §9 Gaps & Risks | — | Markdown bullets with severity (100%) |

---

## Coverage-Graph Schema Extension (loop_type='context')

New node kinds required:

| Kind | Meaning |
|------|---------|
| `MODULE` | Scanned file or directory unit |
| `PATTERN` | Discovered convention or architecture pattern |
| `REUSE_CANDIDATE` | Existing function/utility eligible for reuse |
| `DEPENDENCY` | Import/call relationship endpoint |
| `QUESTION` | Unresolved context question (reused from research) |
| `FINDING` | Resolved context finding (reused from research) |

New relation types:

| Relation | Default Weight | Meaning |
|----------|---------------|---------|
| `EXTENDS` | 1.3 | Candidate extends existing code |
| `DEPENDS_ON` | 1.1 | Module imports/calls target |
| `IMPLEMENTS` | 1.2 | Module implements pattern |
| `ANSWERS` | 1.3 | Finding answers question (reused) |
| `CONTRADICTS` | 0.8 | Finding contradicts prior decision (reused) |
| `COVERS` | 1.1 | Module covers scope area (reused) |

Schema change: `LoopType = 'research' | 'review' | 'context'` in `coverage-graph-db.ts:10`. CHECK constraint on `coverage_nodes.loop_type` and `coverage_edges.loop_type` must include `'context'`. `VALID_KINDS` and `VALID_RELATIONS` records gain `context` entries. This is a **schema version bump to 3**.

---

## OpenQuestions

1. **Convergence metric:** What scalar signals context-coverage saturation? Proposal: `contextCoverageRatio = coveredModules / totalModulesInScope`, with STOP threshold at 0.85 and `newContextRatio` (novel findings per iteration) < 0.05. Needs validation against real runs.

2. **Scope resolution:** How does deep-context determine "total modules in scope" before the first iteration? Proposal: initial fast Glob scan + code_graph_query for import closure, stored as `scope-manifest.json`.

3. **Context Report persistence:** Where does the final report live? Proposal: `{spec_folder}/context/context-report.md` + `{spec_folder}/context/context-report.json` (machine-readable sections). The `context/` directory mirrors `research/` convention.

4. **Fan-out slice granularity:** Per-file? Per-directory? Per-domain (auth, db, ui)? Proposal: per-directory (one agent per `src/subdir/`), with domain-aware prompt injection from §6 Pattern Atlas.

5. **Reuse Catalog freshness:** How to handle code that changes between deep-context run and /speckit:implement? Proposal: implement Step 1 re-verifies top-10 Reuse Catalog entries via Read, flagging drift.

6. **Integration with @context agent:** Should deep-context replace @context or coexist? Proposal: coexist — @context remains the one-shot exploration agent; deep-context is the heavyweight iterative alternative invoked explicitly (e.g., `/deep:start-context-loop`).

===FINDINGS END===
