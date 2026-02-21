# Tasks: Skill Graph Improvement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## [W:ENG] Workstream A: SGQS Engine Fixes

*Addresses Gap 1–4: engine defects causing wrong-skill routing and failed traversals.*

- [x] T001 [P] Fix case-insensitive string comparison for all node property string operations (`.opencode/skill/system-spec-kit/scripts/sgqs/executor.ts`)
- [x] T002 [P] Fix property-to-property comparison bug — comparison was checking value against property name instead of value against value (`.opencode/skill/system-spec-kit/scripts/sgqs/executor.ts`)
- [x] T003 [P] Add keyword-as-alias: include node `keywords` field as traversal aliases (`.opencode/skill/system-spec-kit/scripts/sgqs/parser.ts`)
- [x] T004 [P] Add unknown property warnings — emit console.warn when query references non-existent node property (`.opencode/skill/system-spec-kit/scripts/sgqs/types.ts`)
- [x] T005 [P] Add LINKS_TO edge generation: parse markdown hyperlinks in node descriptions to create graph edges (`.opencode/skill/system-spec-kit/scripts/sgqs/graph-builder.ts`)
- [x] T006 Compile TypeScript after all engine changes; verify zero errors (`tsc`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## [W:CONTENT] Workstream B: Graph Content Enrichment

*Addresses Gap 5: node descriptions lacking domain vocabulary used in developer queries.*

### system-spec-kit skill (8 nodes)

- [x] T007 [P] Enrich spec-core node: add vocabulary — spec folder, documentation level, progressive enhancement, template scaffold (`.opencode/skill/system-spec-kit/graphs/system-spec-kit/nodes/`)
- [x] T008 [P] Enrich checklist-verification node: add vocabulary — quality gate, P0 blocker, P1 required, evidence, deferral (`.opencode/skill/system-spec-kit/graphs/system-spec-kit/nodes/`)
- [x] T009 [P] Enrich context-preservation node: add vocabulary — memory save, generate-context, session handover, anchor tags (`.opencode/skill/system-spec-kit/graphs/system-spec-kit/nodes/`)
- [x] T010 [P] Enrich validation-workflow node: add vocabulary — validate.sh, exit code, warnings, errors, spec completeness (`.opencode/skill/system-spec-kit/graphs/system-spec-kit/nodes/`)
- [x] T011 [P] Enrich phase-system node: add vocabulary — phase decomposition, child spec folder, parallel workstream (`.opencode/skill/system-spec-kit/graphs/system-spec-kit/nodes/`)
- [x] T012 [P] Enrich memory-system node: add vocabulary — vector search, BM25, semantic retrieval, hybrid RAG (`.opencode/skill/system-spec-kit/graphs/system-spec-kit/nodes/`)
- [x] T013 [P] Enrich progressive-enhancement node: add vocabulary — Level 1, Level 2, Level 3, addendum, CORE template (`.opencode/skill/system-spec-kit/graphs/system-spec-kit/nodes/`)
- [x] T014 [P] Enrich gate-3-integration node: add vocabulary — spec folder question, file modification trigger, hard block (`.opencode/skill/system-spec-kit/graphs/system-spec-kit/nodes/`)

### workflows-git skill (2 nodes)

- [x] T015 [P] Enrich commit-workflow node: add vocabulary — conventional commits, staging, artifact filter, amend (`.opencode/skill/workflows-git/graphs/workflows-git/nodes/`)
- [x] T016 [P] Enrich workspace-setup node: add vocabulary — worktree isolation, branch strategy, detached HEAD, sparse checkout (`.opencode/skill/workflows-git/graphs/workflows-git/nodes/`)

### workflows-documentation skill (3 nodes)

- [x] T017 [P] Enrich mode-document-quality node: add vocabulary — DQI score, extract_structure.py, markdown validation (`.opencode/skill/workflows-documentation/graphs/workflows-documentation/nodes/`)
- [x] T018 [P] Enrich mode-component-creation node: add vocabulary — skill scaffold, agent template, command template, SKILL.md (`.opencode/skill/workflows-documentation/graphs/workflows-documentation/nodes/`)
- [x] T019 [P] Enrich mode-flowchart-creation node: add vocabulary — ASCII flowchart, decision tree, swimlane, sequence diagram (`.opencode/skill/workflows-documentation/graphs/workflows-documentation/nodes/`)

### workflows-code--opencode skill (2 nodes)

- [x] T020 [P] Enrich typescript node: add vocabulary — tsconfig, strict mode, type guard, interface, generics (`.opencode/skill/workflows-code--opencode/graphs/workflows-code--opencode/nodes/`)
- [x] T021 [P] Enrich python node: add vocabulary — docstring, type hints, argparse, shebang, snake_case (`.opencode/skill/workflows-code--opencode/graphs/workflows-code--opencode/nodes/`)

### Post-enrichment

- [x] T022 Trigger graph rebuild to activate new vocabulary and LINKS_TO edges
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## [W:ADVISOR] Workstream C: skill_advisor.py Updates

*Addresses Gap 6–7: missing intent boosters and incorrect CSS routing.*

- [x] T023 [P] Add INTENT_BOOSTERS for: `css`, `typescript`, `javascript`, `webflow`, `component`, `style`, `animation`, `responsive` → routes to `workflows-code--web-dev` (`.opencode/skill/scripts/skill_advisor.py`)
- [x] T024 [P] Add SYNONYM_MAP entries for: `css`, `typescript`, `javascript`, `style`, `component`, `animate`, `responsive`, `layout`, `selector`, `cascade` (`.opencode/skill/scripts/skill_advisor.py`)
- [x] T025 [P] Add MULTI_SKILL_BOOSTERS for full-stack patterns: queries matching both frontend and opencode terms boost both skills (`.opencode/skill/scripts/skill_advisor.py`)
- [x] T026 Fix CSS routing: correct existing `css` entry that was routing to wrong skill; verify `python3 skill_advisor.py "css styles" --threshold 0.8` returns `workflows-code--web-dev` (`.opencode/skill/scripts/skill_advisor.py`)

---

## Validation

- [x] T027 Run SGQS CLI smoke test on 5 previously-failing scenarios from spec 006; verify all score ≥3.0
- [x] T028 Run `python3 skill_advisor.py "css animation" --threshold 0.8` — confirm `workflows-code--web-dev` at ≥0.8
- [x] T029 Run `python3 skill_advisor.py "typescript strict mode" --threshold 0.8` — confirm `workflows-code--opencode` at ≥0.8
- [x] T030 Update checklist.md with evidence for all verified items
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] TypeScript compilation passes with zero errors
- [x] skill_advisor.py CSS routing confirmed at ≥0.8 threshold
- [x] Manual verification of SGQS score improvement passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Prior testing**: See `.opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/006-skill-graph-utilization/`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
