---
title: "Data Extractors"
description: "Extractor inventory for session, conversation, decision, file, and implementation data capture."
trigger_phrases:
  - "data extractors"
  - "collect session data"
  - "decision extraction"
---

# Data Extractors

## 1. OVERVIEW

`scripts/extractors/` converts normalized session input into structured conversation, decision, file, implementation, git, and spec-folder data used by template rendering and indexing workflows. `collect-session-data.ts` orchestrates the other extractors into one `SessionData` payload; the focused extractors each own a single signal type.

## 2. SCRIPT IO

| Flow | Input | Output |
| --- | --- | --- |
| Session collection | Normalized loader data plus optional runtime context | Aggregated `SessionData` for rendering |
| Content extraction | Conversation, file, decision, diagram, and implementation inputs | Typed facts and summaries |
| Enrichment | Git and spec-folder context | Additional context for generated artifacts |
| Quality scoring | Extracted data | Quality score and validation signals |

## 3. ENTRYPOINTS

- `collectSessionData()` coordinates loader output, extraction modules, enrichment, and scoring into a single `SessionData` record.
- `extractDecisions()` distills manual, observation-derived and lexical decision candidates into `DecisionRecord`s with options, rationale, confidence and anchor ids.
- Focused extraction surfaces from the sibling modules (conversation, file, diagram, implementation-guide, session) supply each signal type.
- `extractGitContext()` and `extractSpecFolderContext()` enrich captured-session data.
- `scoreExtractionQuality()` evaluates extracted data before downstream rendering.
- `index.ts` re-exports the extractor surface used by compiled scripts.

## 4. VALIDATION FROM REPO ROOT

Run extractor validation from the repository root:

```bash
npm --prefix .opencode/skills/system-spec-kit/scripts run build
```

The sibling Vitest suite lives in `../tests/`. Targeted runs from `scripts/`:

```bash
npm test
npx vitest run tests/collect-session-data.vitest.ts
npx vitest run tests/decision-confidence.vitest.ts
npx vitest run tests/contamination-filter.vitest.ts
```

The legacy module check (`npm run test:legacy`) additionally runs `tests/test-extractors-loaders.js`. Expected result: the extractor suites pass and the build emits `scripts/dist/extractors/`.

## 5. KEY FILES

| File | Purpose |
| --- | --- |
| `collect-session-data.ts` | Orchestrates extraction across observations, files, decisions, preflight/postflight metrics and context into one `SessionData` payload. |
| `contamination-filter.ts` | Removes contamination from extraction outputs before use. |
| `conversation-extractor.ts` | Extracts conversation-level facts and summaries. |
| `decision-extractor.ts` | Extracts decisions with options, rationale, confidence and decision trees from manual, observation and lexical sources. |
| `diagram-extractor.ts` | Extracts diagram-ready content. |
| `file-extractor.ts` | Extracts changed-file context and observation anchors. |
| `git-context-extractor.ts` | Enriches captured sessions with git context. |
| `implementation-guide-extractor.ts` | Extracts implementation guidance from source data. |
| `quality-scorer.ts` | Scores extraction quality and validation signals. |
| `session-activity-signal.ts` | Detects session-activity signals for capture gating. |
| `session-extractor.ts` | Extracts session-level facts, ids, channel and duration metadata. |
| `spec-folder-extractor.ts` | Reads spec-folder context for capture enrichment. |
| `index.ts` | Barrel export for extractor modules. |

## 6. BOUNDARIES

- Extractors consume normalized data; source selection and path validation belong to loaders.
- Extractors do not render markdown, write files, or persist index rows.
- Runtime imports should use compiled modules under `scripts/dist/extractors/`.

## 7. RELATED

- `../loaders/README.md`
- `../renderers/README.md`
- `../utils/README.md`
