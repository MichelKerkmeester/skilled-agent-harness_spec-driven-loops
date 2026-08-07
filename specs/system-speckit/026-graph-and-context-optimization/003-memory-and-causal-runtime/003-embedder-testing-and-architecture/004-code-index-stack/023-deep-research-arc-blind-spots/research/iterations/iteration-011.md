# Iteration 011 - 768d schema-lock quantitative falsification [PASS-2]

## Pass 1 claim under attack
- HIGH-LATENT-RISK #1 / FINDING-002-A, FINDING-004-A, FINDING-010-A: non-768 model pressure collides with a fixed 768d vector schema and global daemon state.

## Hypotheses going in
- H1: The claim is overstated if most registered embedders are already 768d and only a small opt-in tail is blocked.
- H2: The claim survives if fixed-dimension vector types, current schema, and external/upstream model drift make dimension changes a recurring migration path.

## Evidence gathered
- Command output: `registered_count 8`; `dim_distribution {768: 6, 2048: 1, 1024: 1}`; `non_768 2`.
- Command output: registered non-768 entries are `sbert/Salesforce/SFR-Embedding-Code-2B_R` at 2048d and `sbert/dunzhang/stella_en_400M_v5` at 1024d.
- Schema command: `sqlite3 .cocoindex_code/target_sqlite.db '.schema code_chunks_vec'` returned `embedding float[768]`.
- Code evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:22-27` documents destructive reset/reindex guidance; `:37-38` says dimension must match schema; `:62-144` shows 8 manifests and 2 non-768 manifests.
- Code evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:317-348` stores one `_embedder` in `ProjectRegistry` and uses it for newly loaded projects.
- External evidence: CocoIndex data-types docs say vectors can have fixed dimensions and recommend dimension annotations when exporting to targets because most targets need fixed dimensions for vector indexes: `https://cocoindex.io/docs/core/data_types/`.

## Pass-1 attack outcome
- [FALSIFIED]: The broadest reading of Pass 1 was too strong for the current registry. Only `2/8` registered embedders are non-768, and only one of those is code-tuned. The local blast radius is not "most adapters are blocked."
- [STRENGTHENED]: The architectural risk survives in narrower form. The active schema is still `float[768]`, non-768 adapters are already present, and the daemon has one embedder instance across loaded projects.

## Findings (severity-tagged)
- **FINDING-011-A** [severity: MEDIUM-OPPORTUNITY] [Pass-1 relation: FALSIFIES-#1]:
  - **What**: Pass 1 overstated immediate registry pressure. Current local adapter breadth is 75% 768d (`6/8`), with only `2/8` requiring non-768 schema work.
  - **Why Pass 1 / deep-review missed this**: Pass 1 mixed current registry facts with external model-landscape pressure. It cited non-768 entries but did not count them.
  - **Evidence**: Command output above; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:62-144`.
  - **What to do**: Reword 023A from "unblocks most registered embedders" to "prevents future reset/reindex traps and enables selected non-768 opt-ins."

- **FINDING-011-B** [severity: HIGH-LATENT-RISK] [Pass-1 relation: STRENGTHENS-#1]:
  - **What**: The system still has no dimension-safe migration surface. A non-768 opt-in goes through `ccc reset && ccc index`, not a versioned table or side-by-side index.
  - **Why Pass 1 / deep-review missed this**: Deep-review validated the current 768d default lane. It did not quantify migration blast radius or design a rollback path for non-768 trials.
  - **Evidence**: Schema command output above; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:22-27`; `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:168-175` reports 10-25 minute reindex rows.
  - **What to do**: Keep 023A, but scope it as versioned index metadata plus rollback, not just vector-table renaming.

- **FINDING-011-C** [severity: LOW-CURIOSITY] [Pass-1 relation: ORTHOGONAL]:
  - **What**: Upstream CocoIndex's own type-system documentation treats vector dimensions as schema-relevant. That means the local fixed-dim issue is not unusual; the gap is migration ergonomics.
  - **Why Pass 1 / deep-review missed this**: Pass 1 looked mostly at local code and model cards, not upstream CocoIndex schema guidance.
  - **Evidence**: `https://cocoindex.io/docs/core/data_types/`; local schema command output above.
  - **What to do**: Import upstream's explicit-dimension mental model into 023A docs and tests.

## Hypotheses that FAILED falsification (valuable!)
- "Most local registry entries are blocked by 768d" failed: `6/8` entries are 768d.
- "The 768d risk is imaginary" failed: the active table and docs still hard-bind stored vectors to one dimension.

## Updates to research-pass-2.md
- Added a quantified schema-lock section: `2/8` non-768 local adapters, active `float[768]`, and migration framing narrowed from adapter breadth to future-proofing plus rollback.

## NO-EARLY-STOP confirmation
- Iteration <= 20: continuing to next iter.

