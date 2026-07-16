You are a senior memory-systems research synthesist performing READ-ONLY analysis. Do NOT write, create, or edit any files — your final answer text IS the deliverable.

# INPUTS — read all ten iteration analyses
A 10-iteration deep-research sweep mined OpenLTM (an open-source long-term-memory plugin for AI coding agents; Bun/TS/SQLite/FTS5; MIT) for teachings transferable to **system-spec-kit Memory** (a LOCAL single-user continuity store: SQLite index + separate ollama-nomic-768d vector store; semantic+lexical trigger matching; importance tiers; causal edges; FSRS decay + co-activation; self-maintaining incremental index; shadow-first learning-feedback reducers; spec-folder continuity ladder; 37-tool MCP surface). Read these (paths relative to repo root):
- `specs/system-spec-kit/027-xce-research-based-refinement/research/010-openltm-memory-architecture-teachings/iterations/iteration-001.md` (hybrid recall + scoring + explainability)
- `.../iteration-002.md` (importance-weighted decay)
- `.../iteration-003.md` (janitor maintenance pipeline)
- `.../iteration-004.md` (lifecycle hooks + injection envelope)
- `.../iteration-005.md` (typed knowledge graph + conflict detection)
- `.../iteration-006.md` (secret redaction before write)
- `.../iteration-007.md` (provenance + audit chain)
- `.../iteration-008.md` (embedding provider abstraction + degradation)
- `.../iteration-009.md` (schema/DB design + migration discipline)
- `.../iteration-010.md` (learn() idempotency + cross-plugin contract)
(All ten live in the `iterations/` folder of that 010 phase. Read each fully — they contain Mechanism, per-teaching verdicts with `path:line` evidence, negative knowledge, and open questions.)

# TASK
Synthesize across all ten subsystems. Produce:

## 1. Per-subsystem comparison table
One row per subsystem (10 rows). Columns: `Subsystem | What OpenLTM does (distinctive) | system-spec-kit equivalent today | The delta / gap | Net verdict`. Keep cells tight.

## 2. Ranked transferable teachings (the answer to "what should we copy/learn")
Cluster the ~54 per-iteration teachings into a deduplicated, ranked list of the strongest ADOPT/ADAPT items (target 8–14). Rank by (value × confidence ÷ risk). For each: a one-line title, the consolidated evidence `path:line` pointers, the target system-spec-kit surface, the verdict (ADOPT|ADAPT), risk, confidence, and a one-sentence rationale for why it is a genuine delta over our FSRS / causal-edge / self-maintaining / trigger design. Merge teachings that recur across iterations into a single ranked item.

## 3. Cross-cutting themes
2–4 themes that span multiple subsystems (e.g. "propose-don't-mutate staging", "explainability/observability of recall", "write-path safety").

## 4. Consolidated negative knowledge
The things we should NOT copy (with one-line reasons) — fold together the per-iteration negative-knowledge and REJECT/DEFER items.

# CONSTRAINTS
Evidence-cited (`path:line` into OpenLtm-main, carried from the iteration files). Be decisive and concrete; do not pad. Output only the markdown.
