# Iteration 008 — KQ-R2d: playbook + feature-catalog per-entry verification (round one's n=1 sample was misattributed)

Session: fanout-deepseek-v4-flash-overengineering-1788762836148-1dgwlq | run 8 | focus: the system-spec-kit playbook/feature-catalog corpus round one counted but sampled on the wrong tree — per-entry verification of catalog→runtime references and playbook provenance.
Evidence reads: `feature-catalog/` (47 files; tooling-and-scripts 33), `manual-testing-playbook/` (85 md), catalog→runtime path extraction (144 refs, existence check each), `runtime/lib/{search,scoring,cognitive,parsing}` and `runtime/{cli/core,cli/extractors,cli/validation,handlers}` listings, whole-tree find for 9 module names, playbook vitest-reference counts (17/85), `manual-testing-playbook/plugins-and-hooks/completion-evidence-sentinel.md` (12 test refs). Reads cost: 6 bash calls. No node/validate/git.

## Catalog runtime-path drift — measured

144 distinct `runtime/...` paths referenced across the 33 tooling-and-scripts entries; **12 do not exist on disk**; of those, 2 are compiled artifacts (validator-registry.js, tsconfig.js — dist/ untracked, legitimately absent), leaving **10 stale source references**:
- 8 GONE from the whole checkout (find over the repo excluding node_modules/dist): `runtime/lib/search/channel-representation.ts`, `runtime/lib/search/graph-search-fn.ts`, `runtime/lib/scoring/composite-scoring.ts`, `runtime/lib/cognitive/co-activation.ts`, `runtime/lib/parsing/trigger-matcher.ts`, `runtime/cli/core/file-writer.ts`, `runtime/cli/core/memory-indexer.ts`, `runtime/cli/validation/evidence-marker-lint.ts`.
- 1 MOVED: `runtime/cli/extractors/session-activity-signal.ts` → the file now lives at `runtime/cli/lib/session-activity-signal.ts`.
- 1 RENAMED-or-replaced: `evidence-marker-lint.ts` → the live file is `runtime/cli/validation/evidence-marker-audit.ts` (the catalog says lint; the code says audit — a name-difference the reader cannot reconcile).

Carrier entries: `code-standards-alignment.md` (6 dead refs: search×2, scoring, cognitive, parsing, handlers/memory-save), `session-capturing-pipeline-quality.md` (file-writer), `core-workflow-infrastructure.md` (memory-indexer), `session-extraction-and-enrichment.md` (session-activity-signal, moved), `strict-validation-addons-continuity-freshness-and-evidence-markers.md` + `spec-validation-rule-engine.md` (evidence-marker-lint).

**The catalog contradicts its own index file**: `feature-catalog/feature-catalog.md:26,36` declares the memory MCP server and the vector/BM25/retrieval machinery gone ("their catalog entries are gone"), yet `tooling-and-scripts/code-standards-alignment.md` still lists the removed `runtime/lib/search`/`scoring`/`cognitive`/`parsing` modules in its standards table — an entry inside the same catalog.

## Corpus/number misattribution in round one's F31 (corrected)

Round one's F31 sampled `exhausted-approach-respect.md` (138 L, 0 test refs) — that file is in the **deep-loop** playbook (`.opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/…`), while the "85 scenarios / 11,839 lines" count it cited is the **system-spec-kit** playbook's file count (85, verified). Both corpora contain 85 files, so the count and the sample came from different trees. The census re-measure ("23 of 85 cite a suite") is therefore attached to an ambiguous corpus. **The system-spec-kit playbook's own provenance was never sampled. In-boundary re-measure (this tree): 17 of 85 system-spec-kit playbook entries reference a vitest suite** (e.g. `plugins-and-hooks/completion-evidence-sentinel.md` = 12 refs; `tooling-and-scripts/spec-folder-literal-naming-cli-driven-slug.md` = 0 refs) → **68 of 85 (80%) lack provenance lines.** The F31 decision (don't add lines that would fabricate provenance) still stands as the right call for the right corpus; the corrected number belongs in its record.

Also noted: `manual-testing-playbook/plugins-and-hooks/completion-evidence-sentinel.md` documents the sentinel's **checklist-gate** behavior as the tested contract (12 test refs) — independent confirmation that the sentinel's checklist path (F2-01) is the documented+tested live behavior, not residue: the retirement never touched this playbook entry either.

## Findings

**F2-12 [P2 — catalog drift: entries advertise removed/moved runtime files] 10 of 144 catalog runtime references point at source that no longer exists (8 removed, 1 moved, 1 renamed), concentrated in 7 entries; `code-standards-alignment.md` alone carries 6.**
- Where: `feature-catalog/tooling-and-scripts/code-standards-alignment.md` (channel-representation, graph-search-fn, composite-scoring, co-activation, trigger-matcher, memory-save), `session-capturing-pipeline-quality.md`, `core-workflow-infrastructure.md`, `session-extraction-and-enrichment.md`, `strict-validation-addons-continuity-freshness-and-evidence-markers.md`, `spec-validation-rule-engine.md`; contrasted with `feature-catalog/feature-catalog.md:26,36` (declares the machinery gone).
- Cost: any reader greps the catalog to find a module → dead path → decode loop; the catalog is the entry index for the whole skill and its tooling table is now 7% stale (10/144); every future code audit counts ghosts.
- Protects: nothing (references removed code).
- Severity: P2 (docs-only; but the largest single doc-drift cluster found in this round).
- Recommendation: **merge** — update the 7 entries (drop removed paths or mark "removed in 006-009") and point session-activity-signal at `cli/lib/`, evidence-marker-lint at `evidence-marker-audit.ts`; wire a cheap drift guard if one exists (the markdown-link-integrity guard covers links, not code paths).

**F2-13 [P2 — measured-with-correction] system-spec-kit's own playbook: 68 of 85 entries carry no suite provenance; round one's F31/census figures were measured on the deep-loop tree while attributing the system-spec-kit corpus count.**
- Where: `manual-testing-playbook/` (85 md; 17 with vitest refs — counted), round-one F31 + census F31 ("23 of 85") sample file `exhausted-approach-respect.md` (deep-loop tree).
- Cost: the provenance question now has its correct corpus numbers; 80% of manual scenarios remain untraceable to the automated suites they shadow — the same cost round one quantified for the deep-loop playbook (68/85 vs round-one's deep-loop 62/85-ish share).
- Protects: nothing new; the corrected number keeps the recorded decision honest.
- Severity: P2.
- Recommendation: **keep** (F31's recorded decision stands — a provenance line that claims a suite where none exists fabricates provenance; the corrected per-tree measurement is the deliverable), and note the two 85-file playbooks separately in any future census to prevent another cross-tree count.

## Provisional counts

- Catalog: 47 files (33 tooling-and-scripts); 144 unique runtime refs; 12 missing (10 stale source, 2 compiled artifacts); 7 entries affected.
- Playbook: 85 md; 17 with vitest refs (20%); 68 without (80%).
