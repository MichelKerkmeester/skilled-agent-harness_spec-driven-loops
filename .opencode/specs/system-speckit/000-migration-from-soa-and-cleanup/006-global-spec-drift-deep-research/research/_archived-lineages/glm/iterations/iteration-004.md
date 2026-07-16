# Iteration 4: Prior context-optimization efforts across packets (Q4)

## Focus
De-duplicate the 9,834 raw keyword hits into the real documented context-optimization efforts and extract their patterns/outcomes as evidence the phase-007 memory-DB teardown can lean on. Q4 is the research question most directly load-bearing for phase 007.

## Findings

### F4.1 — The canonical context-optimization program is `system-speckit/027-graph-and-context-optimization` (Complete)
A phase-parent with 8 themed tracks delivering graph indexing, memory/context continuity, embedding architecture, and operator tooling. Track 003 (`003-memory-and-causal-runtime`) is the **memory-continuity substrate**: causal-graph channel routing + embedding architecture. Status reported as **Complete as of 2026-06-05** (track 005 deferred in place).
- [SOURCE: file:.opencode/specs/system-speckit/027-graph-and-context-optimization/spec.md]
- [SOURCE: file:.opencode/specs/system-speckit/028-xce-research-based-refinement/spec.md] ("builds on the now-completed 026 graph-and-context-optimization program").

### F4.2 — Numbering drift INSIDE the context-optimization program's own docs (026 vs 027)
The program is filed as `027-graph-and-context-optimization`, but the 028 packet and 027's own title frontmatter reference it as **"026-graph-and-context-optimization"**. This is status/numbering drift within the optimization program's own cross-references — the very packet that should model context hygiene carries a stale number.
- [SOURCE: 027 spec.md title frontmatter: `system-spec-kit/026-graph-and-context-optimization/spec`]
- [SOURCE: 028 spec.md: "now-completed 026 graph-and-context-optimization program"]

### F4.3 — Six recurring context-optimization patterns are documented (precedent for phase 007)
De-duplicating the noisy hits yields six distinct optimization mechanisms with documented outcomes:

| Pattern | Representative packet | Outcome / mechanism |
|---|---|---|
| **Compaction** (precompact hooks, stop-hook tracking) | `system-speckit/z_archive/024-compact-code-graph` (001-precompact-hook, 003-stop-hook-tracking, 014-hook-durability) | Hook-driven context compaction; now archived/superseded but establishes the compaction-hook precedent. |
| **Memory-continuity substrate** | `027/003-memory-and-causal-runtime` | Continuity fields + causal-graph routing as the durable context channel. |
| **Lean-root retrieval optimization** | `system-speckit/028-xce-research-based-refinement` | "Optimized 027 root for retrieval, lean root + clean metadata + phase maps"; `context-index.md` as a sanctioned migration-bridge rollup. |
| **Deprecation-driven context pruning** | `cli-external-orchestration/022-cli-devin-deprecation/context/` (deep-context-strategy, context-report) + `021-cli-gemini-deprecation/*` | Pruning agent rosters, cross-skill refs, graph edges when a CLI is retired. Direct precedent for teardown-style pruning. |
| **Continuity dedup** | `_memory.continuity.session_dedup.fingerprint` across packets | Per-session content fingerprint to dedup continuity saves; standard context-shrinking mechanism. |
| **Context-budgeting** | `cli-opencode references/context-budget.md` (referenced from devin deprecation) | Explicit context-budget affordances per CLI. |

- [SOURCE: each packet above; `rg continuity.shrink|compaction|...` over implementation-summary.md + handover.md]

### F4.4 — The optimization lifecycle is cyclical: build → compact → archive → refine
Prior optimization efforts show a consistent lifecycle: an optimization program ships (024 compact-code-graph), is later superseded and archived under `z_archive/`, then refined by a successor (027 → 028-xce "research-based refinement"). The `z_archive` folders are therefore not dead weight — they are the **historical record of prior context-optimization attempts**, which is exactly the evidence category phase 007 needs. This reframes the F1.4 `z_archive = planned` anomaly: archives may carry `planned` because they were never given a terminal optimization status.
- [SOURCE: `system-speckit/z_archive/024-compact-code-graph/`, `system-deep-loop/z_archive/010-deep-context-gathering/`]

## Sources Consulted
- system-speckit/027 + 028 spec.md (context-optimization program + refinement).
- `rg` over implementation-summary.md / handover.md for compaction/prune/continuity patterns (de-duplicated from 9,834 raw hits).
- cli-external-orchestration/022/context/ deep-context-strategy.md.

## Assessment
- **newInfoRatio: 0.75** — the six-pattern taxonomy and the cyclical-lifecycle reframing are genuinely new; the existence of a context-optimization program was partly seeded, but the de-duplication into mechanisms + precedent-for-007 is new analysis.
- **Confidence:** high on the pattern taxonomy (multiple corroborating packets); medium on the "z_archive=planned because no terminal optimization status" hypothesis (plausible but inferred).
- **Q4 status:** answered — six documented optimization patterns with outcomes; clear precedent (deprecation-driven pruning) for phase 007's teardown; numbering drift noted inside the program itself.

## Reflection
- **Worked:** de-duplicating keyword hits by mechanism-type (not by packet) collapsed 9,834 noisy hits into 6 meaningful patterns; reading the actual program specs grounded the taxonomy.
- **Failed:** none.
- **Ruled out:** "9,834 hits = 9,834 efforts" — most are research-iteration `summarize` noise; real efforts are ~6 mechanisms across ~10 packets.

## Recommended Next Focus
Iteration 5: close **Q5 (structural)** + finish **Q1 (status)** — verify the stray root `descriptions.json`, the `changelog`-as-packet anomaly, and the sk-design "actually shipped?" question (check for shipped artifacts / implementation-summary evidence) to unblock the legal-stop coverage gate.
