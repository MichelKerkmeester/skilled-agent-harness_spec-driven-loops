---
title: "Decision Record: Catalog/playbook alignment audit for local embeddings default set"
description: "Architecture decisions for separating embedding-provider surfaces and preserving the audit write boundary."
trigger_phrases:
  - "catalog playbook audit decisions"
  - "provider surface separation"
  - "write boundary adr"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/020-catalog-playbook-alignment-audit"
    last_updated_at: "2026-05-13T15:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Applied code graph scan remediation follow-up"
    next_safe_action: "Restart MCP server if needed, then rerun code_graph_scan"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000020"
      session_id: "020-catalog-playbook-alignment-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which catalog and playbook entries need update/delete/edit/create actions after local embedding defaults changed?"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Catalog/playbook alignment audit for local embeddings default set

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Separate memory, CocoIndex, reranker, Code Graph, and Skill Advisor defaults

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-13 |
| **Deciders** | markdown-agent using dispatch source of truth |

---

<!-- ANCHOR:adr-001-context -->
### Context

The audit needed to classify docs that mention embeddings, local/native behavior, model IDs, and docs/spec classification. These surfaces are easy to conflate because several use EmbeddingGemma or `llama-cpp` language, but only memory and CocoIndex define the embedding defaults named in this packet.

### Constraints

- Memory provider cascade must be recorded as explicit env -> Voyage -> OpenAI -> `llama-cpp` -> `hf-local`.
- Memory local default must be recorded as `llama-cpp` with `unsloth/embeddinggemma-300m-GGUF`.
- Memory fallback must be recorded as `hf-local` with `onnx-community/embeddinggemma-300m-ONNX`, q8.
- CocoIndex default must be recorded as `sbert/google/embeddinggemma-300m` with query prompt `InstructionRetrieval`.
- CocoIndex default include behavior is code-only with specs/docs excluded.
- Code Graph does not define embedding defaults.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Treat memory, CocoIndex, reranker, Code Graph, and Skill Advisor as separate documentation surfaces with separate update rules.

**How it works**: Memory docs get the full provider cascade and local/fallback defaults. CocoIndex docs get its own default model, query prompt, and code-only include behavior. Reranker docs stay reranker-specific; Code Graph and Skill Advisor do not receive embedding-provider updates unless wording claims embedding defaults.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Surface-specific classification** | Prevents false updates and preserves exact defaults. | Requires more explicit audit text. | 9/10 |
| Single EmbeddingGemma update sweep | Faster to explain. | Risks editing Code Graph, reranker, or Skill Advisor docs incorrectly. | 4/10 |
| Defer all classification to follow-on editor | Minimal packet content. | Forces re-audit and increases chance of stale docs persisting. | 3/10 |

**Why this one**: Surface-specific classification is the simplest reliable way to update stale docs without creating new inaccuracies.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Follow-on edits can update memory and CocoIndex docs using correct, separate defaults.
- Non-impact docs have explicit guardrails against unnecessary edits.

**What it costs**:
- The audit packet is more detailed than a simple path list. Mitigation: keep the matrix concise and path-specific.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Follow-on editor ignores surface boundaries | H | ADR and summary repeat the non-impact caveats. |
| Stale old model text remains in root summaries | M | Root catalog/playbook files are listed as P0/P1 update targets. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The docs audit was requested to prevent stale provider/default expectations. |
| 2 | **Beyond Local Maxima?** | PASS | Compared surface-specific update, broad sweep, and full deferral. |
| 3 | **Sufficient?** | PASS | Exact path/action matrix covers the dispatch findings. |
| 4 | **Fits Goal?** | PASS | It directly supports catalog/playbook alignment after local default changes. |
| 5 | **Open Horizons?** | PASS | Future edits can add evidence without changing classification rules. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `spec.md` records source-of-truth defaults and requirements.
- `implementation-summary.md` lists update/review/non-impact targets.
- `plan.md` records affected surfaces and follow-on flow.

**How to roll back**: Revert this child phase folder only. No target catalog/playbook files are touched.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Apply approved documentation follow-ups after audit capture

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-13 |
| **Deciders** | markdown-agent for initial audit, opencode for approved follow-up application |

---

<!-- ANCHOR:adr-002-context -->
### Context

The initial task asked for a Level 3 spec folder that captured audit findings while forbidding modification of target feature catalog and manual testing playbook files. After that packet was created and validated, the user explicitly requested all follow-ups, approving the documentation edits identified by the audit.

### Constraints

- Keep edits documentation-only; do not change runtime code.
- Preserve surface boundaries between memory, CocoIndex, reranker, Code Graph, and Skill Advisor docs.
- Keep all-MiniLM and Voyage references only when framed as alternatives, not current defaults.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Keep the standalone audit packet and apply the approved documentation follow-ups inside the same packet after user approval.

**How it works**: The packet records what to update, review, caveat, and leave untouched, then the approved follow-up edits update only documentation and metadata files. Runtime code remains unchanged.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Audit packet plus approved follow-up edits** | Preserves audit trail and completes alignment after explicit approval. | Requires spec-doc reconciliation. | 10/10 |
| Standalone audit packet only | Meets initial scope and creates a clean handoff. | Leaves stale docs in place after user requested follow-ups. | 5/10 |
| Broad code/runtime sweep | Might find deeper drift. | Exceeds documentation follow-up scope. | 2/10 |

**Why this one**: The user's follow-up instruction changed the appropriate action from handoff-only to apply-and-record, while still limiting changes to documentation.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Scope remains auditable and deterministic.
- Stale documentation defaults are corrected immediately.

**What it costs**:
- The packet needed reconciliation after applying the follow-up. Mitigation: update spec, plan, tasks, checklist, decision record, and summary together.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Stakeholders assume runtime code changed | M | Summary states documentation-only scope. |
| Old default text remains in secondary docs | M | Run targeted stale-default grep after edits. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User requested all follow-ups after audit packet creation. |
| 2 | **Beyond Local Maxima?** | PASS | Compared audit-plus-follow-up, handoff-only, and broad runtime sweep options. |
| 3 | **Sufficient?** | PASS | The packet has exact target paths and applied update guidance. |
| 4 | **Fits Goal?** | PASS | It aligns docs with current local embedding defaults. |
| 5 | **Open Horizons?** | PASS | Future edits can still distinguish defaults from alternatives. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Create/update Level 3 docs and metadata in the child phase folder.
- Apply approved documentation updates to catalog, playbook, README/install, reference, template, and SKILL surfaces.
- Leave runtime code untouched.

**How to roll back**: Revert the child phase folder and the scoped documentation files changed by the follow-up.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Remediate code graph scan refresh loop found during verification

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-13 |
| **Deciders** | opencode |

---

<!-- ANCHOR:adr-003-context -->
### Context

Stored-scope `code_graph_scan` attempts timed out while the status/read path reported stale graph readiness. Inspection showed three compounding issues: explicit scans forced whole-scope reindexing whenever Git HEAD changed, successful incremental scans did not refresh the candidate manifest, and `last_failed_scan` showed `structural_persistence_error` while its stored errors were dominated by parser diagnostics.

### Constraints

- Keep the fix limited to code graph scan behavior and focused tests.
- Preserve the existing scan response shape for callers.
- Do not change embedding provider behavior or CocoIndex behavior.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Preserve incremental scan semantics across Git HEAD drift, refresh the manifest after every promotable scan, and prioritize structural persistence errors in failed-scan metadata.

**How it works**: When callers request incremental scanning, `code_graph_scan` keeps `skipFreshFiles: true` even if stored and current Git HEAD differ. A successful incremental scan records the candidate manifest just like a full scan. Failed-scan metadata places structural persistence errors before parser diagnostics so operators can see the actual promotion blocker.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Honor incremental scan semantics** | Smallest fix, reduces full-scope timeout risk, preserves caller intent. | Requires updating an older test that expected full reindex on any HEAD drift. | 9/10 |
| Raise MCP timeout | Might let large scans finish. | Does not fix unnecessary full scans or hidden structural errors. | 4/10 |
| Force scope-specific exclude globs | Could shrink this workspace scan. | Changes scope fingerprint and risks hiding indexed surfaces. | 3/10 |

**Why this one**: It fixes the refresh loop without broadening scope or weakening stale-read safeguards.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Explicit incremental scans can refresh content-stale files without reparsing the full 9k-file scope.
- Successful incremental scans can clear manifest drift.
- Operators see structural persistence failures first when a scan cannot promote metadata.

**What it costs**:
- The old invariant "any Git HEAD change forces full reindex" is replaced by content-hash incremental semantics for explicit incremental scans.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Running MCP process still has old handler loaded | M | Restart/reload MCP server before rerunning live `code_graph_scan`. |
| Hidden structural error remains unknown until next scan | M | New failed-scan ordering will expose it on the next failed run. |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Live graph refresh was stuck stale/timing out. |
| 2 | **Beyond Local Maxima?** | PASS | Compared code fix, timeout increase, and scope exclusions. |
| 3 | **Sufficient?** | PASS | Fix covers full-scan trigger, manifest freshness, and failed-scan diagnostics. |
| 4 | **Fits Goal?** | PASS | It directly addresses the verification blocker without touching embedding behavior. |
| 5 | **Open Horizons?** | PASS | Next failed scan can reveal any remaining structural persistence root cause. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Update `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts`.
- Update `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts`.

**How to roll back**: Revert the two code graph files and this packet's metadata addendum, then rerun the previous scan test baseline.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
