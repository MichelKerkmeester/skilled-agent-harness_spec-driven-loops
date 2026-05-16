# Iter Plan — 40 Pre-Made Prompts for 026 Restructure Research

> Single source of truth for all 40 iter RQs. Each row maps to one self-contained prompt file under `research/prompts/iteration-NNN.md`. Dispatch any subset in any order. No bash loop — the user triggers each prompt individually.

## Track distribution

| Track | Iter | Executor | Focus | Output |
|------:|-----:|----------|-------|--------|
| 1 | 001-006 | cli-devin SWE-1.6 | Direct-child packet inventory (6 iter, ~3-4 children each) | Each-child classification: load-bearing / merge / delete |
| 2 | 007-010 | cli-devin SWE-1.6 | Phase-parent 014-local-embeddings-migration deep-read (4 iter — 056-059 arc) | Per-phase summary + restructure recommendation |
| 3 | 011-014 | cli-devin SWE-1.6 | Phase-parent 013-doctor-update-orchestrator deep-read (4 iter) | Per-phase summary + restructure recommendation |
| 4 | 015-018 | cli-devin SWE-1.6 | Phase-parent 007-code-graph deep-read (4 iter) | Per-phase summary + restructure recommendation |
| 5 | 019-022 | cli-devin SWE-1.6 | Phase-parent 009-hook-parity deep-read (4 iter) | Per-phase summary + restructure recommendation |
| 6 | 023-026 | cli-devin SWE-1.6 | Cross-packet duplicate detection (4 iter) | Overlap groups (same problem, different packet) |
| 7 | 027-030 | cli-devin SWE-1.6 | Stale-context detection (4 iter) | Completed-unreferenced packet list |
| 8 | 031-034 | cli-devin SWE-1.6 | Naming-quality audit (4 iter) | Names that don't match actual work |
| 9 | 035-038 | cli-devin SWE-1.6 | Target-state proposal (4 iter) | Consolidated phase list with names + rationale |
| 10 | 039-040 | cli-devin SWE-1.6 | Resource-map structure proposal (2 iter) | Parent doc layout recommendation |
| **11** | **041-050** | **cli-codex gpt-5.5 medium fast** | **Adversarial / cross-track / first-principles / governance overlay (10 iter)** | **Validation + integration findings to refine the SWE-1.6 corpus** |

## Per-iter RQ table

| Iter | Track | RQ (one-line) | Primary input |
|-----:|------:|---------------|---------------|
| 001 | 1 | Classify 026/000-release-cleanup + 001-research-and-baseline + 002-resource-map-template + 003-continuity-memory-runtime | 4 packet dirs |
| 002 | 1 | Classify 026/004-runtime-executor-hardening + 005-memory-indexer-invariants + 006-graph-impact-and-affordance-uplift | 3 packet dirs |
| 003 | 1 | Classify 026/007-code-graph (phase parent only) + 008-skill-advisor | 2 packet dirs |
| 004 | 1 | Classify 026/009-hook-parity (parent only) + 010-template-levels (parent only) + 011-cocoindex-daemon-resilience | 3 packet dirs |
| 005 | 1 | Classify 026/012-causal-graph-channel-routing + 013-doctor-update-orchestrator (parent only) | 2 packet dirs |
| 006 | 1 | Classify 026/014-local-embeddings-migration (parent only) + 015-global-security-sweep-and-supply-chain-audit | 2 packet dirs |
| 007 | 2 | Map all children of 014-local-embeddings-migration and identify the natural grouping (research arc, deep-loop arc, SKILL realignment arc) | 014/* |
| 008 | 2 | For each 014 child packet (056, 057, 058, 059, plus any 0NN children), classify load-bearing / merge / delete | 014/* |
| 009 | 2 | Identify duplicate / overlapping packets within 014 (e.g. 057 vs 056) and propose merges | 014/* |
| 010 | 2 | Propose the consolidated 014 phase-list (post-restructure) with names + which current children map into each | 014/* |
| 011 | 3 | Map all children of 013-doctor-update-orchestrator and identify the natural grouping | 013/* |
| 012 | 3 | For each 013 child packet, classify load-bearing / merge / delete | 013/* |
| 013 | 3 | Identify duplicate / overlapping packets within 013 and propose merges | 013/* |
| 014 | 3 | Propose the consolidated 013 phase-list (post-restructure) with names + which current children map into each | 013/* |
| 015 | 4 | Map all children of 007-code-graph and identify the natural grouping | 007/* |
| 016 | 4 | For each 007 child packet, classify load-bearing / merge / delete | 007/* |
| 017 | 4 | Identify duplicate / overlapping packets within 007 and propose merges | 007/* |
| 018 | 4 | Propose the consolidated 007 phase-list (post-restructure) with names + which current children map into each | 007/* |
| 019 | 5 | Map all children of 009-hook-parity and identify the natural grouping | 009/* |
| 020 | 5 | For each 009 child packet, classify load-bearing / merge / delete | 009/* |
| 021 | 5 | Identify duplicate / overlapping packets within 009 and propose merges | 009/* |
| 022 | 5 | Propose the consolidated 009 phase-list (post-restructure) with names + which current children map into each | 009/* |
| 023 | 6 | Cross-026 duplicate detection: which TOP-LEVEL 026 children solve overlapping problems and should merge | All 026 children |
| 024 | 6 | Cross-026 duplicate detection (continued): cross-phase-parent overlaps (e.g. 007 code-graph vs 008 skill-advisor work overlap) | All 026 children |
| 025 | 6 | Cross-026 duplicate detection: hidden duplicates (similar work under different names) | All 026 children |
| 026 | 6 | Cross-026 duplicate detection: identify merge GROUPS (3+ packets that should consolidate) | All 026 children |
| 027 | 7 | Stale-context detection: which 026 children are completed AND unreferenced by any other packet | All 026 children + git log |
| 028 | 7 | Stale-context detection: which 026 children are completed AND superseded by later work | All 026 children + git log |
| 029 | 7 | Stale-context detection: orphan packets (created but never populated, or scratch / experiment status) | All 026 children |
| 030 | 7 | Stale-context detection: consolidate delete-candidate list with reason per delete | All 026 children |
| 031 | 8 | Naming audit: which top-level 026 children have names that no longer match the actual work that landed | All 026 children |
| 032 | 8 | Naming audit: which phase-parent children (under 007/009/013/014) have names that don't match the actual work | Nested children |
| 033 | 8 | Naming audit: propose better names for the top-N highest-priority renames | Misnamed candidates |
| 034 | 8 | Naming audit: identify naming conventions to lock in for the restructure (number-prefix patterns, verb-first vs noun-first) | All 026 children |
| 035 | 9 | Target-state proposal: based on iter 001-034 findings, propose the consolidated 026 phase list (target count: significantly fewer than 22) | Synthesis of prior iter |
| 036 | 9 | Target-state proposal: per-proposed-phase scope statement + constituent current children | Iter 035 output + prior iter |
| 037 | 9 | Target-state proposal: per-proposed-phase rationale (why this grouping vs alternatives) | Iter 035-036 output |
| 038 | 9 | Target-state proposal: identify the highest-risk consolidations (where merging loses load-bearing context) and propose mitigation | Iter 035-037 output |
| 039 | 10 | Resource-map structure: how should the phase-parent's spec.md + resource-map.md + graph-metadata.json be organized so resume + search + graph traversal land on the right phase first | 026/spec.md + resource-map.md |
| 040 | 10 | Resource-map structure: sample-query proof points showing the proposed layout finds packets faster than current layout (3-5 sample queries) | Iter 039 output + prior iter |
| 041 | 11 | Adversarial review of SWE-1.6 top-level classifications (iter 001-006) — false positives / false negatives | iter 001-006 + targeted grep |
| 042 | 11 | Adversarial review of SWE-1.6 per-phase-parent classifications (iter 007-022) — catalog completeness, classification accuracy, overlap detection, phase-list quality | iter 007-022 + `ls` checks |
| 043 | 11 | Cross-track integration check — find contradictions between tracks 1-5 and tracks 6-8; resolve with policy | iter 001-034 |
| 044 | 11 | First-principles re-evaluation — design 026 from scratch; compare with SWE-1.6 track 9; identify convergent (high-confidence) vs divergent | iter 035 + 026 parent docs |
| 045 | 11 | Cost-benefit per proposed merge — verdict PROCEED / PROCEED_AS_LOW_PRIORITY / ABORT / REDESIGN | iter 009/013/017/021/024/026/038 |
| 046 | 11 | Strategic naming for scale — pressure-test SWE-1.6 convention under growth / split / cross-parent scenarios | iter 031/032/033/034 |
| 047 | 11 | Phase lifecycle governance — define active / stable / stale / superseded / orphan stages + transition policy | iter 027/028/029/030/035 |
| 048 | 11 | Blast-radius for proposed deletes — CONTAINED / SHALLOW / MEDIUM / DEEP classification per delete candidate | iter 027/028/029/030 + repo grep |
| 049 | 11 | Restructure ordering for partial-state safety — renames → merges → deletes → parent-doc → indexes; per-wave recovery procedure | iter 035/036/045/048 |
| 050 | 11 | Post-restructure validation proof points — query-based + graph-based + index-based assertions; pre/post measurement plan | iter 040/035/044 |

## Dispatch order recommendation

- **Strict sequential** (001 → 050): iter 035-038 (target-state proposal) reference findings from 001-034, so those tracks benefit from running first. Tracks 1-8 can themselves run in any order among themselves.
- **Parallel-safe batches** (if dispatching multiple sessions concurrently):
  - Batch A: iter 001-022 (tracks 1-5; each iter is independent — different packets)
  - Batch B: iter 023-034 (tracks 6-8; depend on batch A's findings but only via inference)
  - Batch C: iter 035-040 (tracks 9-10; SHOULD run after batches A+B)
- **Track 11 (codex)** runs IN PARALLEL with tracks 1-10 (devin loop). Codex iter 041-042 read tracks 1-5 outputs; codex iter 043+ read tracks 6-10. The codex loop is rate-limit independent from the devin loop, so true concurrency.
- Dispatcher scripts: `scripts/run-loop.sh` for tracks 1-10 (cli-devin); `scripts/run-codex-loop.sh` for track 11 (cli-codex).

## Per-iter expected output

Each iter writes to `research/iterations/iteration-NNN.md` with:

1. `# Iter NNN — <topic>` heading
2. `## Question` — the scoped RQ
3. `## Evidence` — file:line citations
4. `## Findings` — numbered findings with rationale
5. `## Gaps for next iter` — what this iter could not answer
6. `## JSONL delta row` — the row that gets appended to `deep-research-state.jsonl`

Plus the iter appends one row to `research/deep-research-state.jsonl` with fields: `iter_id`, `timestamp_utc`, `executor=cli-devin`, `model=swe-1.6`, `track`, `status`, `findings_count`, `gaps_count`, `primary_evidence_files`.
