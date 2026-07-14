---
title: "Decision Record: Forbid ephemeral-artifact references in code comments"
description: "Architectural decisions: the instance-vs-structural comment rule, the aggressive §4 revision, comments-only cleanup scope, and the CLI executor/reviewer division of labor."
trigger_phrases:
  - "comment hygiene decision"
  - "ephemeral reference ADR"
  - "sk-code rule decision"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/097-comment-ref-hygiene/001-rule-and-cleanup"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored decision record"
    next_safe_action: "Author sk-code prevention rule (Part A)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000119"
      session_id: "119-comment-ref-hygiene-init"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Decision Record: Forbid ephemeral-artifact references in code comments

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## ADR-001: The instance-vs-structural comment rule

<!-- ANCHOR:adr-001 -->

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-27 |
| **Deciders** | Owner, Claude |

<!-- ANCHOR:adr-001-context -->
### Context
Comments that name a specific ephemeral artifact (a spec folder, packet/phase number, feature-catalog entry, ADR id, task/checklist id) rot the moment that artifact is renamed or archived. But some references that *look* like spec references are structural — the running code needs them (a `.opencode/specs/` path constant, an index glob). A blanket "no spec references" rule would break the spec engine.

### Constraints
- Must apply to both the OpenCode and Webflow surfaces.
- Must not break functional code that operates on the spec-folder structure.
- Must preserve stable external standards (CWE/RFC/POSIX) in comments.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: forbid references to a specific *instance* of an ephemeral artifact in inline comments, while explicitly allowing (a) the durable WHY, (b) structural path/globs the running code needs, and (c) stable external standards.

**How it works**: a single canonical rule in the sk-code universal layer (`code_style_guide.md` §4) with an allowed-vs-forbidden table, mirrored as a P0 in `code_quality_standards.md`, and pointed to from each surface.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Instance-vs-structural rule (chosen)** | Precise; safe for the engine; covers both surfaces | Requires explaining the distinction | 9/10 |
| Blanket "no spec references" | Simple to state | Would forbid functional path constants → breaks engine | 3/10 |
| Comment-style lint only | Automatable | Misses semantics; high false positives on Bucket B | 5/10 |

**Why this one**: it removes the failure mode without endangering the structural code the spec/memory engine depends on.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Comments stop carrying perishable pointers; the durable WHY survives artifact lifecycle changes.
- One source of truth, inherited by both surfaces.

**What it costs**:
- A conceptual distinction authors must learn. Mitigation: allowed-vs-forbidden table + good/bad examples in the rule.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Authors over-apply and strip functional literals | H | Rule explicitly marks structural path/globs as allowed; cleanup is comments-only |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | ~135 live offenders + sk-code teaching the anti-pattern |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | One canonical rule + surface pointers covers all surfaces |
| 4 | **Fits Goal?** | PASS | Directly addresses the dangling-pointer problem |
| 5 | **Open Horizons?** | PASS | Generalizes to any ephemeral tracker (tickets, ClickUp) |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes
Part A applies this decision: the canonical rule lands in `references/universal/code_style_guide.md` §4 with an allowed-vs-forbidden table, a P0 mirror in `code_quality_standards.md`, the OpenCode §4 revision (ADR-002), and a Webflow §7 pointer. Part B enforces it retroactively via the comments-only cleanup.
<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Aggressive §4 revision (remove T###/REQ-###/CHK-### recommendations)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-27 |
| **Deciders** | Owner, Claude |

### Context
The OpenCode `universal_patterns.md` §4 actively recommends `T###`/`REQ-###`/`CHK-###` comment prefixes whose examples point into spec-folder artifacts. Leaving §4 intact would make sk-code contradict ADR-001.

### Decision
**We chose**: the aggressive variant — remove the `T###`/`REQ-###`/`CHK-###` rows and their supporting subsections from §4, keeping only durable references (`SEC:` with a CWE, durable-tracker `BUG`). Reconcile every echo site that repeats the pattern.

**How it works**: §4 is rewritten to point at ADR-001's canonical rule; §3 examples and §7 "Pattern C" are de-referenced; language style guides and the config quality checklist drop the `REQ-###` recommendations.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Aggressive removal (chosen)** | Removes the failure mode at the source | More edit sites | 9/10 |
| Conservative caveat ("strip before archival") | Keeps in-flight traceability | Relies on a manual step the anti-pattern proves is unreliable | 5/10 |

**Why this one**: the user selected "Broad + revise §4"; a manual strip-before-archival step is exactly the kind of discipline that already failed.

### Consequences

**What improves**: sk-code becomes internally consistent; no file still teaches the anti-pattern.

**What it costs**: loss of in-IDE task traceability comments. Mitigation: the durable WHY replaces the id; task tracking lives in tasks.md, not code.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missed echo site keeps recommending prefixes | M | REQ-002 grep sweep across all sk-code refs |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | §4 directly contradicts ADR-001 |
| 2 | **Beyond Local Maxima?** | PASS | Conservative variant evaluated and rejected |
| 3 | **Sufficient?** | PASS | Removal + echo-site sweep fully reconciles |
| 4 | **Fits Goal?** | PASS | Required for self-consistency (REQ-002) |
| 5 | **Open Horizons?** | PASS | Simpler guidance going forward |

---

## ADR-003: Comments-only cleanup scope (exclude Bucket B/C)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-27 |
| **Deciders** | Owner, Claude |

### Context
The raw survey found ~982 pattern matches, but most are Bucket B (functional string literals the engine executes) or Bucket C (test fixtures). Only ~135 are Bucket A (inline comments).

### Decision
**We chose**: edit Bucket A only. Bucket B (e.g. `index-scope.ts:45` glob, `memory-crud-health.ts:108` path constant, `memory-index-alias.ts` SQL `LIKE`, `shared/embeddings/registry.ts` `notes:` values, `tool-schemas.ts` schema descriptions, `explicit.ts:217` regex) and Bucket C (anything under `tests/`/`*.vitest.ts`/fixtures, incl. test-name strings) are left untouched.

**How it works**: a hard "comments-only" fence in every executor prompt, an explicit DO-NOT-TOUCH list, and a per-chunk compile/test green-gate that catches any stray Bucket-B edit.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Comments only (chosen)** | Safe; the only true stale-pointer surface | Leaves "spec-like" literals in place | 9/10 |
| Comments + fixtures | More thorough | Fake folders cannot go stale; breaks tests | 4/10 |
| Comments + fixtures + assets | Broadest | Highest risk, lowest value | 3/10 |

**Why this one**: a fake test fixture cannot go stale, and a functional path constant is the engine, not a comment.

### Consequences

**What improves**: zero risk to the spec/memory engine and the test suites.

**What it costs**: "spec-like" strings remain in code. Mitigation: they are structural and correct; ADR-001's rule documents them as allowed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Executor edits a Bucket-B literal anyway | H | DO-NOT-TOUCH list + green-gate + Codex audit + per-chunk commits |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Distinguishes stale pointers from engine code |
| 2 | **Beyond Local Maxima?** | PASS | Broader scopes evaluated |
| 3 | **Sufficient?** | PASS | Comments are the only stale-pointer surface |
| 4 | **Fits Goal?** | PASS | Matches the user's "comments only" choice |
| 5 | **Open Horizons?** | PASS | Keeps engine refactors independent |

---

## ADR-004: CLI division of labor (DEVIN executes, CODEX reviews)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-27 |
| **Deciders** | Owner, Claude |

### Context
The user mandated CLI-DEVIN (SWE-1.6) and CLI-CODEX (gpt-5.5 medium fast) for the cleanup. The sk-code rule authoring needs architectural judgment and the §4 reconciliation.

### Decision
**We chose**: Claude authors the sk-code rule; CLI-DEVIN/SWE-1.6 executes the mechanical comment edits chunk-by-chunk under a comments-only fence; CLI-CODEX/gpt-5.5 (read-only sandbox) reviews each chunk's git diff. Strict single-process dispatch — one CLI at a time, verify + SIGKILL between.

**How it works**: per chunk — Devin edits → green-gate → Codex audits diff → fix → commit → next. DEVIN runs on the cognition-free pool (no Pro quota burn).

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **DEVIN executes / CODEX reviews (chosen)** | Uses both mandated CLIs to strengths; independent review | Sequential, slower | 9/10 |
| CLIs do everything incl. rule | Less Claude work | Rule needs judgment + §4 reconciliation small models miss | 4/10 |
| Claude does all, CLIs verify | Fast | Ignores the user's execution mandate | 3/10 |

**Why this one**: matches the user's selection and the canonical executor/reviewer pattern; review by a different model catches scope drift.

### Consequences

**What improves**: independent diff review per chunk; bounded blast radius via per-chunk commits.

**What it costs**: many sequential dispatches. Mitigation: validation phase on tiny skills first to prove the loop.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Small-model scope drift | M | 1–3 files/chunk, allowed-writes list, Codex audit, green-gate |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User mandated the CLIs; review adds safety |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives compared |
| 3 | **Sufficient?** | PASS | Executor + reviewer + green-gate covers the risk |
| 4 | **Fits Goal?** | PASS | Delivers the cleanup safely |
| 5 | **Open Horizons?** | PASS | Reusable pattern for future mechanical sweeps |
