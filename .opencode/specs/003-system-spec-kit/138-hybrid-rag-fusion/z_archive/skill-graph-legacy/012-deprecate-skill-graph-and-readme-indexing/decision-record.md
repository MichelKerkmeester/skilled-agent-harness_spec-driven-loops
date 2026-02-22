# Decision Record: 012 - Skill-Graph and README/Skill-Ref Indexing Deprecation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-documentation/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Remove SGQS Skill-Graph Capability from Memory MCP

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-21 |
| **Deciders** | Phase 012 implementation owner |

### Context

Memory MCP currently exposes SGQS tools and runtime paths that expand feature surface without matching long-term maintenance priorities. Keeping SGQS active requires schema, handler, cache, search, and documentation upkeep across a wide cross-section of files.

### Constraints

- Deprecation must not break core non-SGQS memory capabilities.
- Tool schemas and handler registry must remain internally consistent.
- All in-scope docs must reflect removed capabilities.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: remove SGQS memory tools and runtime dependencies entirely from memory MCP.

**How it works**: SGQS tools are removed from schema and handler registration, SGQS handler/cache runtime paths are deleted or disconnected, and tests/docs are rewritten to assert deprecation rather than usage.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Full removal (chosen)** | Clear contract, less maintenance, lower confusion | Requires broad update across code and docs | 9/10 |
| Feature-flag keepalive | Lower immediate churn | Preserves stale paths and documentation ambiguity | 5/10 |
| Soft deprecation docs-only | Minimal code change | Runtime and schema remain misleading | 3/10 |

**Why this one**: full removal is the only option that eliminates stale runtime surface and keeps documentation truthful.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Memory MCP contract is smaller and easier to maintain.
- Documentation and runtime behavior align with supported capabilities.

**What it costs**:

- Users of SGQS-specific workflows must migrate. Mitigation: explicit deprecation guidance in updated docs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hidden SGQS references remain | M | Run targeted symbol sweeps and tests |
| Consumers rely on removed tools | M | Add migration notes and replacement guidance |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Deprecated SGQS surface is explicitly in-scope for removal |
| 2 | **Beyond Local Maxima?** | PASS | Compared flagging/doc-only alternatives |
| 3 | **Sufficient?** | PASS | Directly solves stale capability problem |
| 4 | **Fits Goal?** | PASS | Matches Phase 012 objective and acceptance criteria |
| 5 | **Open Horizons?** | PASS | Reduces future maintenance and drift risk |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- Remove SGQS tool schema entries and handler exports.
- Remove SGQS handler/cache modules and dependent runtime wiring.
- Update tests and docs to reflect deprecation.

**How to roll back**: revert SGQS deprecation commit set, rerun typecheck/tests, and re-enable schema/handler paths together.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Remove README and workflows-code/sk-code Reference/Assets Indexing from Memory MCP

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-21 |
| **Deciders** | Phase 012 implementation owner |

### Context

README and skill reference/assets indexing introduced broad content ingestion that can dilute retrieval precision and increase maintenance complexity. The phase scope explicitly requires removing these indexing sources while preserving README anchor guidance for generated documentation quality.

### Constraints

- Core memory indexing for memory files, constitutional files, and spec docs must remain stable.
- Command/skill/agent docs must not advertise removed indexing options.
- README generation workflows must enforce paired anchor tags.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: remove README indexing and workflows-code/sk-code `references/` and `assets/` indexing from memory MCP, while strengthening README anchor generation guidance.

**How it works**: memory index and save handlers drop README and skill-reference/assets source acceptance. Related config and schema fields are removed. Documentation generators keep ANCHOR requirements for README structure consistency.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Remove indexing sources + keep anchor guidance (chosen)** | Cleaner retrieval corpus, reduced noise, preserved README structure quality | Requires docs/test migration effort | 9/10 |
| Keep indexing but reduce scoring weights | Less migration effort | Still ingests noisy/non-authoritative sources | 6/10 |
| Keep skill refs only | Partial compatibility | Scope mismatch and continued complexity | 4/10 |

**Why this one**: this directly matches scope and yields the clearest memory-source contract.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- Memory corpus is tighter and more authoritative.
- Indexing behavior is simpler to explain and verify.

**What it costs**:

- Some previously searchable README/reference content is no longer indexed. Mitigation: rely on explicit docs access paths outside memory indexing.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Downstream users still pass removed flags | M | Add clear migration notes in docs |
| Residual tests assume README/skill-ref ingestion | M | Rewrite tests to assert exclusion behavior |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Scope explicitly requires source deprecation |
| 2 | **Beyond Local Maxima?** | PASS | Compared score-only and partial-retention options |
| 3 | **Sufficient?** | PASS | Removes exact noisy sources without adding new systems |
| 4 | **Fits Goal?** | PASS | Aligns with deprecation and docs-truthfulness goals |
| 5 | **Open Horizons?** | PASS | Reduces future source-policy complexity |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:

- Remove README and skill reference/assets indexing options from schemas/config/handlers.
- Update tests for exclusion behavior.
- Update command/skill/agent/root docs and README generation anchor guidance.

**How to roll back**: revert indexing-contract changes and corresponding docs/tests in one commit set to restore previous behavior.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
