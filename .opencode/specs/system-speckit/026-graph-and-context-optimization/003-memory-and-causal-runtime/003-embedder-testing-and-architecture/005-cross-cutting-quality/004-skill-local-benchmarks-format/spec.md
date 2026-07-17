---
title: "016/005/004: Skill-local benchmarks/ folder format + report promotion"
description: "Cross-cutting introduction of a new `mcp_server/benchmarks/` convention for any MCP server in this repo (our own + forks). Promotes spec-packet bake-off evidence + curated headline docs from `specs/` into skill-local discoverable locations. First two adopters: mk-spec-memory (May 17, 2026 text-embedder bake-off) and mcp-coco-index (May 18, 2026 code-embedder bake-off). Includes historical FORMAT.md convention doc + per-skill READMEs + per-bench dated subfolders with structured benchmark_report.md per sk-doc standards."
trigger_phrases:
  - "016/005/004 skill-local benchmarks"
  - "benchmarks folder format"
  - "skill-local benchmark promotion"
  - "benchmark_report.md format"
  - "mcp benchmarks discoverability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/004-skill-local-benchmarks-format"
    last_updated_at: "2026-05-18T19:05:00Z"
    last_updated_by: "main_agent"
    recent_action: "Retroactively scaffolded sub-phase to document the in-flight benchmarks/ promotion work"
    next_safe_action: "Dispatch sk-doc-routed @markdown agents to write benchmark_report.md + READMEs for both skills"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000005004"
      session_id: "016-005-004-skill-local-benchmarks"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# 016/005/004: Skill-local `benchmarks/` folder format + report promotion

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Level | 2 |
| Priority | P1 |
| Status | IN PROGRESS — folder scaffolding + historical FORMAT.md shipped; benchmark_report.md + READMEs pending sk-doc agent dispatch |
| Branch | main |
| Owner | Main agent (+ @markdown agents for the per-skill report writes) |
| Parent | `../spec.md` (005-cross-cutting-quality) |
| Created retroactively | Yes — scaffolded after the work began, per user request to formalize the cross-cutting nature |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 016 bake-offs (text + code) produced authoritative benchmark records in spec packets (`016/002/004-spec-memory-embedder-bake-off/` and `016/004/004-extended-bake-off/`). Both packets have detailed `benchmark-results.md` headline docs plus full `evidence/` directories with CSVs, JSONLs, runlogs, and ADR trails.

**The discoverability gap:** when working in an MCP's `mcp_server/` source code, finding "what does this MCP currently use for retrieval and why?" requires hunting through `specs/` — a non-obvious path for someone reading the skill in isolation. The bench evidence lives far from the code it informs.

**The solution:** promote a curated subset of benchmark artifacts into each MCP's skill folder under `mcp_server/benchmarks/`. This gives an "at-a-glance" answer to operational questions like:
- Which embedder is the production default? Why?
- When was this last benchmarked? With what fixture?
- What were the runner-ups? What might unseat the current default?

Without duplicating the full audit trail (ADRs stay in the spec packet) or rotting (`SOURCE.md` cross-link makes drift visible).

This sub-phase formalizes the format, populates the first two adopters, and documents how to apply the same pattern to any future MCP (ours or a fork).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In scope

**Convention layer:**
- Define `mcp_server/benchmarks/` folder structure (historical FORMAT.md)
- Date-based subfolder convention: `benchmark-<YYYY-MM-DD>/` (ISO sort order)
- Required files per benchmark folder: `benchmark_report.md`, `results.csv`, optional `per-probe.jsonl` / `runtime-measurements.md` / extras, `SOURCE.md` pointer
- Required top-level files per skill: `README.md` (index) + `historical FORMAT.md` (single source via symlink across skills)
- sk-doc compliance for all `README.md` and `benchmark_report.md` files (anchors, frontmatter, validation)

**First adopters (this sub-phase ships these):**
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/` — mk-spec-memory text-embedder bake-off from May 17, 2026 (jina-embeddings-v3 + rescue layer winner per ADR-012)
- `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/` — code-embedder bake-off from May 18, 2026 (bge-code-v1 winner, single-run)

**File set per adopter:**
- `historical FORMAT.md` (single source in `system-spec-kit/...`; symlinked from `mcp-coco-index/...`)
- `README.md` (top-level index)
- `benchmark-<date>/benchmark_report.md` (10-section sk-doc-compliant structured report)
- `benchmark-<date>/results.csv` (aggregate CSV copied from spec packet)
- `benchmark-<date>/per-probe.jsonl` (per-probe rows, when applicable)
- `benchmark-<date>/runtime-measurements.md` (optional, when meaningful)
- `benchmark-<date>/SOURCE.md` (pointer back to authoritative spec packet)

### Out of scope

- Re-running any benchmark (uses already-shipped evidence from the two spec packets)
- Touching the source spec packets (`016/002/004-spec-memory-embedder-bake-off/`, `016/004/004-extended-bake-off/`) — they remain authoritative
- Rolling out this format to skills that don't yet have benchmarks (e.g., mk-skill-advisor, mk-code-index) — those can adopt later when they have data
- Updating decisions/defaults in the underlying MCPs (separate concern, tracked under `016/007-ollama-and-bge-promotion/`)
- Code-Graph (mk-code-index) doesn't use embeddings, so no benchmarks folder needed there
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0

| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-001 | `historical FORMAT.md` exists at `.opencode/skills/system-spec-kit/mcp_server/benchmarks/historical FORMAT.md` documenting the convention | file exists, lists 10-section `benchmark_report.md` structure + file purposes + date convention |
| REQ-002 | historical FORMAT.md is symlinked into `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/historical FORMAT.md` | `readlink` confirms relative symlink to system-spec-kit copy |
| REQ-003 | `benchmark-2026-05-17/` exists in mk-spec-memory's benchmarks/ with results.csv, per-probe-with-rescue.jsonl, runtime-measurements.md, SOURCE.md | all 4 files present + valid |
| REQ-004 | `benchmark-2026-05-18/` exists in mcp-coco-index's benchmarks/ with results.csv, per-probe.jsonl, SOURCE.md | all 3 files present + valid |
| REQ-005 | `benchmark_report.md` exists in both date folders, 10-section sk-doc-compliant | sk-doc validator output PASSED on both |
| REQ-006 | `README.md` exists at top of each skill's benchmarks/ folder, sk-doc-compliant index | sk-doc validator PASSED on both |

### P1

| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-007 | All four primary docs (historical FORMAT.md, 2× README.md, 2× benchmark_report.md) include in-doc date prose as "May 17, 2026" / "May 18, 2026" (not ISO inline) | grep confirms long-form dates in prose |
| REQ-008 | Cross-links between the two skills' benchmarks are present + working | manual link check |
| REQ-009 | Each `SOURCE.md` cites the exact spec packet path + key evidence files | grep confirms full paths present |
| REQ-010 | strict-validate on this sub-phase | exit 0 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001:** Anyone reading `mcp_server/` code in either skill can find the current production embedder + win conditions + caveats without leaving the skill folder.
- **SC-002:** Format is reusable — future MCPs (or forks) can adopt by copying the historical FORMAT.md and replicating the layout. No system-spec-kit-specific assumptions baked in.
- **SC-003:** Authority hierarchy is unambiguous: spec packet ADRs > skill-local report. No drift risk because skill-local report cross-links rather than restates.
- **SC-004:** strict-validate PASSED on this packet.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Risks

- **Drift risk** — if the spec packet's `decision-record.md` adds new ADRs and the skill-local report doesn't get refreshed, readers in the skill folder see stale data. Mitigation: `SOURCE.md` cites the spec packet's `decision-record.md` directly + the authority hierarchy in historical FORMAT.md states explicitly that ADRs win.
- **Duplication maintenance** — if the spec packet's CSV gets corrected, the skill-local copy needs updating too. Mitigation: CSVs are small and rarely change post-bench; rerun-driven updates land in a new dated subfolder (preserving history).
- **Symlink rot** — the historical FORMAT.md symlink from `mcp-coco-index/.../historical FORMAT.md` to `system-spec-kit/.../historical FORMAT.md` breaks if either path moves. Mitigation: relative symlink (works from any worktree); if breakage occurs the validate.sh will surface it.

### Dependencies

- `016/002/004-spec-memory-embedder-bake-off/benchmark-results.md` (source for text-embedder report content)
- `016/004/004-extended-bake-off/benchmark-results.md` (source for code-embedder report content)
- `sk-doc` skill conventions (anchor format, frontmatter, validation script)
- `@markdown` agent (loads sk-doc on dispatch; writes the sk-doc-compliant docs)
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — scope is bounded by the two source spec packets and the historical FORMAT.md convention.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:relocation-note -->
## 8. HISTORICAL NOTE

historical FORMAT.md relocated to sk-doc in packet 006. The canonical mechanics document is now `.opencode/skills/sk-doc/references/benchmark_creation.md` (consolidated from historical FORMAT.md + benchmarks_format.md into a single `*_creation.md`-pattern reference). The legacy `references/benchmarks/historical FORMAT.md` and `references/benchmarks_format.md` paths were deleted as part of packet `005-cross-cutting-quality/006-benchmark-format-to-sk-doc`. Requirements REQ-001 and REQ-002 in this spec were true at time-of-ship and are preserved as historical record.
<!-- /ANCHOR:relocation-note -->

---

> NOTE (2026-05-19): historical FORMAT.md was relocated to .opencode/skills/sk-doc/references/benchmarks/ in packet 006-benchmark-format-to-sk-doc. The original system-spec-kit and mcp-coco-index paths now hold relative symlinks to the new sk-doc canonical.


Dispatch A correction: older `FORMAT.md` language is historical/superseded. Benchmark-format mechanics now belong under sk-doc benchmark creation guidance.
