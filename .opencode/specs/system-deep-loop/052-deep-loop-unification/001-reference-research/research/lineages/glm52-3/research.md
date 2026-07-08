# Deep Research Synthesis — Deep-Loop Unification Merge Design

**Lineage:** glm52-3 (GLM-5.2, cli-opencode, reasoningEffort: max)
**Spec packet:** system-deep-loop/052-deep-loop-unification/001-reference-research
**Iterations:** 4 of 5 (converged: all 5 key questions answered)
**Status:** Complete
**Date:** 2026-07-08

> Independent GLM-5.2 read-only stress-test of the merge design (fold `deep-loop-runtime` into `deep-loop-workflows` as `system-deep-loop`). This synthesis consolidates iterations 001–004. It CONFIRMS the staged execution plans of children 002/003 in the large, and surfaces concrete, evidence-backed REVISIONS to two scoped assumptions (REQ-003 edit count, node_modules-borrow status) plus one decisive scoping answer (fallback-router). Every finding cites `file:line`.

---

## 1. Executive Summary

The merge is **mechanically safe and the design is sound in the large.** The fold relocates `deep-loop-runtime` as a self-contained `runtime/` subtree with its own tooling; no orphaned entry points exist. The highest-value contribution of this lineage is a **three-mechanism path-repair taxonomy** that the plan's "bidirectional coupling" framing conflates, plus two concrete plan revisions (the `test:council` edit surface is ~9 sites/5 files, not 4; the node_modules tooling-borrow already shipped). The fallback-router question resolves to a clean DEFER. Children 002/003 can proceed once the revisions below are folded into their checklists; child 004 remains optional/operator-gated.

---

## 2. Background & Context

- `deep-loop-workflows` (hub, advisor-routable, 4 active workflow families) consumes `deep-loop-runtime` (frozen, MCP-free backend). [SOURCE: deep-loop-workflows/SKILL.md:12]
- Predecessor `051` deliberately kept them separate; `052` reverses that. [SOURCE: spec.md:51,62]
- Three parallel Sonnet-5 Plan agents produced the mechanical design; this research validates/extends it. [SOURCE: 001/spec.md:56-57]
- Runtime structure: `lib/{council,coverage-graph,deep-loop}/` + `scripts/` + own `package.json`/`tsconfig.json`/`vitest.config.ts`/`tests/`/`database/`. [SOURCE: ls deep-loop-runtime]

---

## 3. Methodology

Read-only, code-grounded investigation. Each iteration targeted one key question, wrote `iterations/iteration-NNN.md` with file:line citations, and appended a JSONL delta. Convergence: novelty-based (newInfoRatio) + all-questions-answered hard stop. minIterations floor (3) honored. Tools: rg (mechanism enumeration + counts), Read (contract/config/scorer internals). No web sources — the subject is this repo's own architecture.

---

## 4. Q1 — Structural Layout Safety

**Finding (CONFIRM):** Mechanically safe. Runtime relocates as a self-contained `runtime/` subtree; it carries its own build tooling (`package.json`, `tsconfig.json`, `vitest.config.ts`) and a self-contained test suite. Every script is invoked via absolute repo-root path from commands or via relative require from a peer — no orphaned entry points. [SOURCE: iter-001 F1.1; deep-loop-runtime/package.json:4]

---

## 5. Q2 — Path Coupling: Mechanism Taxonomy (PRIMARY CONTRIBUTION)

The plan/spec frames coupling as "bidirectional." The real code exhibits **THREE (plus one) mechanically-distinct repair strategies** that a single mechanical pass would conflate and corrupt:

| Class | Direction | Mechanism | Count | Post-merge repair |
|---|---|---|---|---|
| (A) | runtime→workflows | ABSOLUTE repo-root string (`'.opencode/skills/deep-loop-workflows/...'`) | ~40+ sites | textual skill-name+path segment rewrite; ZERO hop change |
| (A′) | workflows→runtime | ABSOLUTE shell-out (`replay-graph-from-artifacts.cjs:26`) | 1 site | same as A |
| (B) | runtime→workflows/shared | RELATIVE `require('../../deep-loop-workflows/shared/...')` | 1 site | SAME hop-count (2), segment `deep-loop-workflows` DELETED (self-ref) |
| (C) | runtime→system-spec-kit | RELATIVE `path.join(__dirname,'../../../system-spec-kit/...')` | 1 site | +1 hop (3→4) |
| (D) | workflows→runtime | RELATIVE `require('../../../deep-loop-runtime/lib/...')` | ~12 sites | ONE FEWER hop (3→2) + rename `deep-loop-runtime`→`runtime` |

[SOURCE: iter-001 F1.2; iter-002 F2.1]

**Confirms spec.md:132 asymmetry risk** with exact hop arithmetic: forward = same-hops+delete; reverse = fewer-hops+rename. A naive "add `..` everywhere since nested deeper" corrupts BOTH directions AND class-A absolute strings. Child 002's before/after table per site is the correct mitigation; exit-gate must be real `npm test`, not grep.

**Plus ~28 test-fixture/comment strings** in the reverse grep (e.g. `persist-artifacts.vitest.ts:60,93,117` `.toContain('Extend deep-loop-runtime')`) — these assert council RECOMMENDATION TEXT, not path coupling. They need SEMANTIC review, NOT mechanical path rewrite. [SOURCE: iter-002 F2.1]

---

## 6. Q3 — system-spec-kit Tooling-Borrow

**Finding (REVISES stale assumption + verdict):** The "8+ node_modules reach-ins into system-spec-kit" noted in sibling context is STALE — `deep-loop-runtime/package.json` self-describes as "Self-contained dependency root so lib and scripts resolve zod, better-sqlite3, and the tsx loader from this skill rather than reaching into a sibling skill's node_modules," and runtime HAS its own `node_modules` + `package.json` (zod, tsx, vitest). [SOURCE: deep-loop-runtime/package.json:4,16] That decoupling already shipped.

The ONLY surviving borrow is `artifact-root.cjs`'s LOGIC seam: `resolveArtifactRoot`'s single implementation lives in `system-spec-kit/shared/review-research-paths.cjs`, re-exported via the runtime seam. Post-merge: `deep-loop-runtime/lib/deep-loop/` (`../../../` = `.opencode/skills/`) → `system-deep-loop/runtime/lib/deep-loop/` needs `../../../../system-spec-kit/` (+1 hop). [SOURCE: artifact-root.cjs:18]

**Verdict:** Net NEUTRAL. The merge neither simplifies nor adds risk — same 1 logic seam at +1 hop. Keep the borrow, fix the hop, and document the seam in `runtime/lib/deep-loop/README.md` for the future decoupling task (spec.md:84 stance is correct). [SOURCE: iter-002 F2.3]

---

## 7. Q4 — Reference-Migration Surface & Advisor-Corpus Risk

### 7.1 Surface (measured, excluding specs/worktrees/node_modules)

| Surface | Line-hits | Notes |
|---|---|---|
| `.opencode/commands/` | 452 | absolute script paths + generated `.contract.md` |
| `.opencode/skills/system-skill-advisor/` | 264 | labels + scorer constants + generated skill-graph.json |
| `.opencode/agents/` + `.claude/agents/` | 18 + 18 | REAL duplicate (spec.md:76 confirmed) |
| `.opencode/plugins/` | 3 | mk-deep-loop-guard |
| `.github/workflows/` | 1 | CI |
| prose READMEs | 28 | root + skill-level |

Non-history migration surface ≈ **780+ code/contract/doc lines** — consistent with spec.md:88's "~948" once `.opencode/specs/**` history (3622+) is excluded. [SOURCE: iter-003 F3.1]

### 7.2 CRITICAL REFRAME — the advisor already has a merge-identity layer

`aliases.ts:92-109` ("MODULE: Merged Deep-Loop Identity + Mode Layer") ALREADY folds the 4 legacy mode ids into one canonical skill via `MERGED_DEEP_SKILL_ID = 'deep-loop-workflows'` (line 109). **The system-deep-loop merge is the SECOND fold — a canonical-id RENAME**, not a new merge layer. Edit surface shrinks to: 1 load-bearing constant + comment path refs + keep mode-level maps unchanged. [SOURCE: iter-003 F3.2; aliases.ts:92-120]

### 7.3 Divergence-ledger reason strings are HISTORICAL NARRATION

`local-native-approved-divergences.json` has 6+ entries whose `reason` strings narrate "legacy deep-* skills folded into deep-loop-workflows" — historically TRUE. Two edit classes in ONE file: (1) label FIELDS (`nativeTop`/`gold`) → field-scoped replace to `system-deep-loop`; (2) `reason` STRINGS → MANUAL re-approve (REQ-007), add a rename note, don't erase the original fold. Mechanical replace produces false narration and fails the `local-native-divergence-ratchet.vitest.ts`. [SOURCE: iter-003 F3.3; local-native-approved-divergences.json:30-31,158-161,228-231]

### 7.4 skill-graph.json is GENERATED — hand-editing is a trap

It carries two separate deep-loop nodes but is `generated_at`-stamped. Child 003 must update graph-metadata.json SOURCES + delete the now-internal runtime node + re-run `skill-graph scan` — NOT hand-edit. A hand-edit is silently overwritten on the next advisor rebuild. [SOURCE: iter-003 F3.5; skill-graph.json:1]

### 7.5 Incomplete-migration risk ranking

1. **HIGHEST** — `MERGED_DEEP_SKILL_ID` (aliases.ts:109): single point of silent routing failure.
2. **HIGH** — divergence-ledger reason strings (REQ-007).
3. **HIGH** — orchestrate.md `mode-registry.json` path (×2 agent trees = 6 critical edits).
4. **MEDIUM** — skill-graph.json (trap; edit sources + re-scan).
5. **MEDIUM** — labeled-prompts.jsonl (field-scoped; REQ-004 baseline gate).
6. **LOWER** — generated `.contract.md` (fix the generator, not the artifacts).

---

## 8. Q5 — fallback-router.ts Wiring

**Finding (DECISIVE — DEFER):** Zero production callers repo-wide (only 2 test files import it). Today's failure path is SAME-MODEL retry-and-salvage: `fanout-pool.cjs:433,628,651` retries the same model to maxRetries, then `fanout-salvage.cjs` recovers partial output from saved stdout — never a model swap. [SOURCE: iter-004 F4.1-F4.2]

**Answer: Do NOT wire fallback-router.ts as part of the merge.** Rationale: (1) zero merge-blocking dependency — it relocates as-is with zero callers and zero correctness change; (2) wiring is orthogonal hardening with its own validation surface (ModelRegistry + re-dispatch state machine + new event types); (3) the manual escape hatch (operator re-dispatch as mimo; `fanout-merge.cjs` enumerates `lineages/`) covers the fan-out use case; (4) the router's additive approval-set guard means deferral incurs no contract debt. Keep optional child 004. [SOURCE: iter-004 F4.3-F4.4]

**Nuance for child 004:** if deferred past the merge, its spec must reference the post-merge path (`system-deep-loop/runtime/lib/deep-loop/fallback-router.ts`), not the current one.

---

## 9. Key Recommendations

1. **Adopt the three-mechanism path-repair taxonomy** in child 002's before/after table — never run a single mechanical find/replace across classes A/B/C/D. Exit-gate = real `npm test`, not grep.
2. **Revise REQ-003's edit count from 4 to ~9 sites across 5 files** (system-spec-kit: vitest.config.ts, package.json test:council ×2, council-playbook-anchor-integrity ×4, memory-runtime-retention ×1, deep-review-auto-restart-contract ×1). REQ-003 acceptance should assert `test:council` run COUNT matches pre-merge, not just "passes green," to catch silent glob-coverage loss.
3. **Keep the artifact-root.cjs logic borrow**; fix +1 hop; document the seam. Decoupling is correctly out of scope.
4. **Child 003 advisor edits:** rename `MERGED_DEEP_SKILL_ID` first (load-bearing); field-scoped replace on label fields only (labeled-prompts.jsonl, divergence ledger label fields); MANUAL review of divergence-ledger reason strings; edit graph-metadata.json sources + re-scan (never hand-edit skill-graph.json).
5. **Defer child 004** (fallback-router wiring) — orthogonal; update its spec path reference if deferred.

---

## 10. Genuinely New Risks (beyond the 3 Plan agents)

These were NOT in the prior design surface and merit explicit tracking:

- **NEW-R1: Three-mechanism conflation.** A single mechanical pass corrupts class-A absolute-string sites (would inject hop changes into repo-root strings). The plan framed only "bidirectional." [iter-001 F1.2]
- **NEW-R2: REQ-003 undercount.** The "4 system-spec-kit edits" scope undercounts by ~2x; a silent test:council coverage hole (council-graph-* + council-playbook-anchor-integrity) would pass the green gate while losing coverage. [iter-002 F2.2]
- **NEW-R3: Stale node_modules-borrow assumption.** Treating the borrow as open work risks double-fixing already-shipped decoupling; only the logic seam (+1 hop) remains. [iter-002 F2.3]
- **NEW-R4: Reverse-direction absolute shell-out.** `replay-graph-from-artifacts.cjs:26` is a class-A site in the reverse direction, missed by the "uniform relative-require" model. [iter-002 F2.1]
- **NEW-R5: Generated-skill-graph trap.** Hand-editing skill-graph.json is silently lost on advisor rebuild. [iter-003 F3.5]

---

## 11. Confidence & Verification Path

All five questions carry `file:line` evidence and were cross-checked across 8+ distinct source locations (deep-loop-runtime scripts/lib, deep-loop-workflows scripts, system-spec-kit mcp_server/tests/scripts, system-skill-advisor scorer/corpus/parity, commands, agents). Confidence ≥ 80% throughout. The verification path for children 002/003: per-site before/after table (002), real `npm test` + `test:council` run-count assertion (003), `score-routing-corpus.py` baseline comparison (003/REQ-004).

---

## Eliminated Alternatives (negative knowledge — primary output)

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Single mechanical find/replace across all coupling | Breaks class-A absolute-string sites (injects hop changes into repo-root strings) | compile-command-contracts.cjs:15-75; check-contract-drift.cjs:40-42 | 1, 2 |
| Treat reverse direction as larger per-site risk | Uniform mechanism (~12 sites); forward single site (B) riskier per-site | render-command-contract.cjs:11 | 1 |
| Mechanism A is forward-only | Refuted: replay-graph-from-artifacts.cjs:26 is a reverse-direction absolute shell-out | replay-graph-from-artifacts.cjs:26 | 2 |
| "4 system-spec-kit edits suffice for REQ-003" | Real surface ~9 sites/5 files | vitest.config.ts:20; package.json:31; council-playbook-anchor-integrity:12,28,30,64; memory-runtime-retention:9; deep-review-auto-restart-contract:19 | 2 |
| tooling-borrow is net risk transfer | Net neutral; node_modules borrow already shipped | deep-loop-runtime/package.json:4,16 | 2 |
| Advisor needs a from-scratch merge-identity layer | Already has one (aliases.ts:92-109); system-deep-loop is id-rename | aliases.ts:109 | 3 |
| Hand-edit skill-graph.json | It's generated; silently overwritten on advisor rebuild | skill-graph.json:1 | 3 |
| Mechanical full-file replace on divergence ledger | Corrupts historical narration; fails REQ-007 ratchet | local-native-approved-divergences.json:30-31,158-161 | 3 |
| Wire fallback-router as part of the merge | Orthogonal; zero merge-blocking dependency; manual escape hatch exists | fanout-pool.cjs:433,651; fallback-router.ts:320 | 4 |
| The merge forces fallback-router changes | None — it relocates as-is; no cross-skill require touches it | rg fallback-router repo-wide = empty | 4 |

---

## 12. Open Questions Remaining

None blocking. Two minor follow-ups for child 004 / whoever runs the post-merge advisor rebuild:
- Child 004's spec path reference should point to the post-merge location if deferred (iter-004).
- Whether a singleton deep-loop family still warrants a `family` tag in skill-graph.json once runtime stops being a separate skill_id (deferred per spec.md:145; whoever runs the post-merge advisor rebuild decides).

---

## 13. Sources

- `.opencode/skills/deep-loop-runtime/scripts/{compile-command-contracts,check-contract-drift,render-command-contract,fanout-pool,fanout-salvage}.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/{artifact-root.cjs,fallback-router.ts}`
- `.opencode/skills/deep-loop-runtime/{package.json,vitest.config.ts}`
- `.opencode/skills/deep-loop-workflows/deep-{review,research}/scripts/{reduce-state,runtime-capabilities}.cjs`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/{orchestrate-session,orchestrate-topic,replay-graph-from-artifacts}.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/{reduce-state,improvement-journal}.cjs`
- `.opencode/skills/system-spec-kit/mcp_server/{vitest.config.ts,package.json,tests/council-playbook-anchor-integrity.vitest.ts,tests/memory-runtime-retention.vitest.ts}`
- `.opencode/skills/system-spec-kit/scripts/tests/deep-review-auto-restart-contract.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/{skill-graph.json,routing-accuracy/labeled-prompts.jsonl}`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json`
- `.opencode/agents/orchestrate.md` (+ `.claude/agents` mirror)
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/{spec.md,001-reference-research/spec.md}`

---

## 14. Lineage Attribution

All findings in this synthesis were surfaced by the **glm52-3** lineage (GLM-5.2, cli-opencode, reasoningEffort: max). Cross-lineage attribution and deduplication against sibling lineages (glm52-1/2, gpt55-fast-*, sonnet5-*) is performed by `fanout-merge.cjs` into the parent packet's `research/fanout-attribution.md` — out of scope for an individual lineage synthesis.

## 15. Convergence Report

- **Stop reason:** converged (all 5 key questions answered; legal-stop gates pass)
- **Total iterations completed:** 4 (of maxIterations 5)
- **Questions answered ratio:** 5/5 (100%)
- **newInfoRatio trend:** 0.85 → 0.70 → 0.62 → 0.45 (descending, all above 0.05 threshold)
- **minIterations floor:** met (3)

## 16. Non-Goals (preserved)

Executing the merge (children 002–005); changing workflow behavior; renaming `/deep:*` commands or agent names; full historical `.opencode/specs/**` rename.

## 17. Status

**Complete.** Ready to feed into child 002/003 execution. Synthesis confirms the staged design in the large; folds in the three-mechanism taxonomy, the REQ-003 revision, the stale-borrow correction, and the fallback-router deferral.
