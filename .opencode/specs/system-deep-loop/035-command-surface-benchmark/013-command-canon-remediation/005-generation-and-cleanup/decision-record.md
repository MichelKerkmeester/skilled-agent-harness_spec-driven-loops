---
title: "Decision Record: generation and cleanup"
description: "Architecture decisions for the G1-G4 + A-W4/A-G2 generation-and-cleanup phase: section-scoped generation over whole-file, a greenfield generator composing three precedents, extending existing validators, shipping G3/G4 heuristics as validator-WARN, and deferring the subaction-router routing_source naming to phase 004."
trigger_phrases:
  - "generation cleanup decisions"
  - "section-scoped generation"
  - "greenfield command generator"
  - "validator-warn heuristics"
  - "routing_source deferral"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation/005-generation-and-cleanup"
    last_updated_at: "2026-07-16T16:00:00Z"
    last_updated_by: "claude"
    recent_action: "Materialized Level-3 doc set for the generation-and-cleanup phase"
    next_safe_action: "Standardize the OWNED ASSETS and EXECUTION TARGETS tables (A-W4) first"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-command/assets/command_contract.json"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
---
# Decision Record: generation and cleanup

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Section-Scoped Generation, Not Whole-File

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-16 |
| **Deciders** | Command-canon remediation lead, AI Assistant (Claude) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The contract must become the single source for the routers, but a router is not purely contract-derived. It also carries rich hand-authored behavioral prose — dispatch gates, autonomous directives, flag documentation — that the contract does not and should not encode. The generation strategy decides whether the generator owns the whole file or only the contract-derivable structure.

### Constraints
- The six authored families carry hand-authored behavioral prose that must survive generation untouched.
- The contract encodes structure (argument-hint, owned assets, execution targets, mode matrix, presentation ownership), not behavioral narrative.
- Whole-file rendering exists as a real pattern, but only for the compiled-stub variant, which the six authored families are not.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: The generator regenerates and diffs only the contract-derivable spans; it never renders the whole file.

**How it works**: `generate-command-routers.cjs` renders exactly five spans — the frontmatter `argument-hint`, the OWNED ASSETS table, the EXECUTION TARGETS table/list, the MODE ROUTING skeleton, and the PRESENTATION BOUNDARY — and diffs only those spans against each conformant router under `--check`. The hand-authored behavioral prose is out of the generator's reach. Whole-file rendering stays reserved for the compiled-stub variant.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Section-scoped generation** | Preserves hand-authored behavioral prose; small, auditable diffs; contract owns only what it should | Requires a section parser and per-span diff; span boundaries must be stable | 9/10 |
| Whole-file rendering | One codepath; nothing hand-edited can drift | Clobbers dispatch gates, directives, and flag docs the contract cannot express; wrong for authored families | 3/10 |
| No generation, lint-only | Zero write risk | Does not make the contract the single source; drift is only detected, never propagated | 4/10 |

**Why this one**: The contract derives the structural skeleton, not the behavioral prose. Section-scoped generation is the only option that makes the contract the single source for structure while leaving the authored behavior intact.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Hand-authored behavioral prose is never rewritten.
- Diffs are confined to five spans, so review and `--check` output are legible.
- The compiled-stub variant's whole-file concern stays cleanly separated.

**What it costs**:
- The generator needs a stable section parser keyed on the router grammar . Mitigation: A-W4 standardizes the tables first, giving a uniform parse target.
- Span boundaries must be maintained if the router grammar evolves . Mitigation: the grammar is locked in `command_router_template.md`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A span boundary is mis-detected and prose is overwritten | H | Section parser keyed on the locked grammar; `--check` diff reviewed before write |
| A future grammar change breaks the parser | M | Grammar is versioned with the contract; parser updated alongside |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The contract is machine-readable but router structure is still hand-copied; drift is real and only detected by eye |
| 2 | **Beyond Local Maxima?** | PASS | Whole-file rendering and lint-only were weighed and rejected in Alternatives |
| 3 | **Sufficient?** | PASS | Five contract-derivable spans are the minimal set that makes the contract the single source without touching behavior |
| 4 | **Fits Goal?** | PASS | On the parent's dependency spine (000 → 001 → 003 → 005) as the command-local cleanup step |
| 5 | **Open Horizons?** | PASS | Section-scoping leaves the compiled-stub whole-file path open without conflicting with it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `generate-command-routers.cjs` (new) renders and diffs the five spans
- The six command families' routers become the generator's parse target

**How to roll back**: Delete `generate-command-routers.cjs`; the routers stay plain hand-edited files with no generator dependency.
<!-- /ANCHOR:adr-001-impl -->

---

<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: Greenfield Generator Composing Three Precedents

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-16 |
| **Deciders** | Command-canon remediation lead, AI Assistant (Claude) |

---

### Context

A generator with a drift gate is new to the command surface, but three of its building blocks already exist in the repo. The decision is whether to write a fresh generator that composes those precedents or to extend an existing renderer.

### Constraints
- The drift-gated `buildExpected → check/write` pattern already exists in `sync-prompts.cjs`.
- The contract field-reads already exist in the `sk-doc-command.cjs` adapter.
- The locked 6-section router grammar already exists in `command_router_template.md`.
- `render-command-contract.cjs` exists but renders a different deep-family runtime artifact, unrelated to authored routers.

---

### Decision

**Summary**: Write a greenfield `generate-command-routers.cjs` that composes the three precedents; do not extend `render-command-contract.cjs`.

**Details**: The generator reuses the drift-gated skeleton of `sync-prompts.cjs` (build the expected output, then either `--check`-diff or write), the contract field-reads already proven in `sk-doc-command.cjs`, and the locked 6-section grammar of `command_router_template.md` as its section map. It lives beside `sync-prompts.cjs` under `.opencode/skills/system-spec-kit/scripts/codex/`.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Greenfield generator composing three precedents** | Reuses proven patterns; no coupling to an unrelated renderer; clear single responsibility | New file to maintain | 9/10 |
| Extend `render-command-contract.cjs` | One fewer file | That renderer targets a different deep-family runtime artifact; coupling two unrelated outputs invites regressions | 3/10 |
| Inline the generation into the adapter | Reuses the adapter's contract reads directly | Conflates validation with generation; muddies the adapter's single job | 4/10 |

**Why Chosen**: The three precedents already carry the hard parts; composing them in a dedicated file gives the generator a single responsibility without coupling it to the unrelated `render-command-contract.cjs` output.

---

### Consequences

**Positive**:
- Proven drift-gate, contract-read, and grammar patterns are reused, not reinvented.
- The generator has one job and no coupling to the deep-family runtime renderer.

**Negative**:
- One new script to own - Mitigation: it mirrors `sync-prompts.cjs`, an already-maintained sibling.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| The three precedents drift apart over time | M | The generator reads the same contract and grammar the adapter and template already use |

---

### Implementation

**Affected Systems**:
- `generate-command-routers.cjs` (new, beside `sync-prompts.cjs`)
- Reads `command_contract.json`; targets the router grammar

**Rollback**: Delete the generator; no other system depends on it.

---

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Extend Existing Validators, No Parallel Lint Engine

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-16 |
| **Deciders** | Command-canon remediation lead, AI Assistant (Claude) |

---

### Context

G3 (hint budget) and G4 (ergonomics) add new prose-level checks. They could ship as a new dedicated lint tool or as extensions of the validators already in the pipeline.

### Constraints
- The pipeline already runs `validate_document.py`, `validate-command-references.cjs`, and the `sk-doc-command.cjs` adapter.
- Prose-level detection (hint length, raw-echo idiom) is lightweight and belongs in the lighter validator layer.
- A parallel engine would duplicate discovery, finding shape, and suppression.

---

### Decision

**Summary**: New G3/G4 checks live inside the existing validators; no parallel lint engine is created.

**Details**: The `argument-hint` budget and the ergonomics checks are added to `validate_document.py` and `validate-command-references.cjs`, and surfaced through the `sk-doc-command.cjs` adapter. Prose-level detection stays in the lighter validator layer where the corpus is already walked.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Extend existing validators** | Reuses corpus walk, finding shape, suppression; one pipeline | The validators grow more checks | 9/10 |
| New parallel lint engine | Isolated | Duplicates discovery and finding plumbing; a second thing to run and keep green | 3/10 |

**Why Chosen**: The existing validators already walk the command corpus and emit findings; extending them keeps one pipeline and reuses the suppression and finding machinery.

---

### Consequences

**Positive**:
- One validation pipeline; no second tool to run or maintain.
- New checks inherit the existing suppression and finding shape.

**Negative**:
- The validators carry more checks - Mitigation: the checks are small and WARN-tier (ADR-004).

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Validator scope creep | L | Checks are prose-level and contained; heavier structural checks stay in the adapter |

---

### Implementation

**Affected Systems**:
- `validate_document.py` (hint budget, ergonomics WARN)
- `validate-command-references.cjs` (ergonomics coverage)
- `sk-doc-command.cjs` (surface the new checks)

**Rollback**: Remove the added checks from the validators.

---

<!-- /ANCHOR:adr-003 -->
---

<!-- ANCHOR:adr-004 -->
## ADR-004: G3/G4 Heuristics Ship As Validator-WARN, Not Hard-Fail

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-16 |
| **Deciders** | Command-canon remediation lead, AI Assistant (Claude) |

---

### Context

The G3 hint budget and the G4 ergonomics checks are heuristics whose false-positive rate is unknown until measured against the real corpus. The decision is whether they block a validation run or merely warn.

### Constraints
- ~20 hints currently exceed the 140-char budget, including `speckit/plan` at 511 chars; the true acceptable set is not yet surveyed.
- Ergonomics heuristics (raw-echo idiom, loader gating) may flag legitimate exceptions.
- A hard-fail on an unmeasured heuristic would block unrelated work.

---

### Decision

**Summary**: G3 and G4 checks emit WARN, never a hard-fail, pending allowlist tuning once noise is measured.

**Details**: The `argument-hint` budget and ergonomics checks raise WARN-tier findings only; they never raise the validation exit code. Once the corpus noise is measured, an allowlist is tuned and the tier can be revisited.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Validator-WARN** | Surfaces the signal without blocking; safe under unknown noise | Warnings can be ignored until tuned | 8/10 |
| Hard-fail immediately | Forces conformance | Blocks unrelated work on unmeasured false positives; erodes trust | 3/10 |
| Off by default | Zero noise | No signal; the backlog item is not actually delivered | 4/10 |

**Why Chosen**: A heuristic with an unmeasured false-positive rate should inform, not block. WARN surfaces the signal safely; the tier is revisited after the allowlist is tuned.

---

### Consequences

**Positive**:
- The checks deliver signal without blocking any conformant work.
- The allowlist can be tuned against measured noise before any hardening.

**Negative**:
- WARN findings may be ignored until tuned - Mitigation: the follow-up to measure noise and tune the allowlist is recorded.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| WARN noise trains authors to ignore warnings | M | Measure noise, tune the allowlist, then revisit the tier |

---

### Implementation

**Affected Systems**:
- `validate_document.py` (WARN tier for hint budget + ergonomics)

**Rollback**: Disable the WARN checks; no run outcome depends on them.

---

<!-- /ANCHOR:adr-004 -->
---

<!-- ANCHOR:adr-005 -->
## ADR-005: Defer the Subaction-Router `routing_source` Naming to Phase 004

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-16 |
| **Deciders** | Command-canon remediation lead, AI Assistant (Claude) |

---

### Context

The G4 ergonomics backlog includes a sub-item: name the subaction-dispatch router via a `routing_source` contract field. But `routing_source` is currently undefined for all families, and phase 004 (census / runtime taxonomy) is the phase that authors it.

### Constraints
- `routing_source` is unset for every family in the current `command_contract.json`.
- Phase 004 owns the census, cross-runtime invocation, topology taxonomy, and the route-manifest variant — the natural home for defining `routing_source`.
- Forcing the sub-item here would define a contract field out of its owning phase and cross the phase boundary.

---

### Decision

**Summary**: The `routing_source` naming sub-item is deferred to phase 004; this phase records the deferral and does not treat it as owed.

**Details**: Phase 005 canonizes the rest of the G4 ergonomics (loader gating, agent-existence, raw-echo deprecation, self-sufficiency) but explicitly excludes naming the subaction-dispatch router via `routing_source`. The deferral is recorded in the spec scope, tasks, and this ADR so it is not mistaken for an unmet obligation.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defer to phase 004** | Keeps the contract field with its owning phase; no cross-boundary field definition | The G4 ergonomics canon is partial until phase 004 lands | 9/10 |
| Define `routing_source` here | G4 fully closed in one phase | Defines a contract field outside its owning phase; duplicates phase-004 taxonomy work; risks a definition that phase 004 must rework | 3/10 |

**Why Chosen**: The `routing_source` field belongs to phase 004's taxonomy work. Defining it here would cross the phase boundary and pre-empt the phase that owns it.

---

### Consequences

**Positive**:
- The phase boundary stays clean; `routing_source` is defined once, by its owning phase.
- The G4 canon this phase does own lands without waiting on the taxonomy.

**Negative**:
- The G4 ergonomics canon is partial until phase 004 defines `routing_source` - Mitigation: the deferral is explicitly recorded, not silent.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| The deferral is read as an unmet phase-005 obligation | L | Recorded in spec scope, tasks (T023), and this ADR |

---

### Implementation

**Affected Systems**:
- `create-command/SKILL.md` G4 ergonomics canon (records the deferral)
- Phase 004 (owns the eventual `routing_source` definition)

**Rollback**: N/A - this is a scope-boundary decision, not a code change.

<!-- /ANCHOR:adr-005 -->

---
