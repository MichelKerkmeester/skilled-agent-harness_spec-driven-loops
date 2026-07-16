---
title: "Decision Record: Document Diff Research Direction"
description: "Accepted product-direction decisions and deliberately deferred architecture choices for the standalone document diff research phase."
trigger_phrases:
  - "document diff decisions"
  - "document comparison architecture decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/033-create-diff-mode/001-research-and-requirements"
    last_updated_at: "2026-07-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded the accepted research direction"
    next_safe_action: "Research the deferred architecture choices"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-research-preparation"
      parent_session_id: null
    completion_pct: 20
    open_questions:
      - "Which concrete runtime, libraries, and canonical representation should implement this direction?"
    answered_questions:
      - "The workflow uses automatic local snapshots with explicit-pair fallback."
      - "The primary report is self-contained local HTML."
      - "The comparison targets semantics and structure."
      - "The deterministic core remains portable outside OpenCode."
---

# Decision Record: Document Diff Research Direction

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Freeze the Product Direction, Research the Implementation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-13 |
| **Deciders** | User and Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

The user needs a Git-style before-and-after view for AI-edited documents that may never live in a Git repository. The product direction must be specific enough to guide research without prematurely choosing a parser, diff library, runtime, or support promise.

### Constraints

- Documents can contain sensitive content and must remain local by default.
- The workflow must work without Git and must not overwrite the source document.
- Format-agnostic intent must become honest, testable support tiers rather than a claim of equal fidelity.
- The deterministic comparison should remain useful outside one agent runtime.
- The HTML artifact must be reviewable offline and must not trust document content.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: automatic local baseline snapshots, semantic and structural comparison, a self-contained local HTML report, and a portable core wrapped by one standalone OpenCode skill.

**How it works**: The skill will eventually capture a baseline before an AI edit, invoke a deterministic portable core after the edit, and surface the generated report. Explicit before-and-after paths remain the fallback. Research must determine the concrete runtime, adapters, canonical model, algorithms, report implementation, retention policy, and validation thresholds.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Portable core plus skill wrapper** | Reusable, testable, runtime-independent deterministic behavior | Requires a clear interface and packaging boundary | 9/10 |
| Skill-only implementation | Fewer visible components | Couples the comparison engine to one runtime and limits reuse | 5/10 |
| Browser-only application | Rich interaction potential | Makes automation, snapshot capture, and headless use harder | 5/10 |
| Explicit file pair only | Simple and predictable | Does not solve the common failure to preserve a baseline before the AI edit | 6/10 |
| Persistent local history | Familiar versioning model | Expands into retention, indexing, restore, and lifecycle complexity beyond the stated need | 4/10 |
| Visual-only comparison | Captures layout changes | Produces rendering noise and does not explain semantic edits well | 4/10 |

**Why this one**: It solves the immediate review problem while keeping the comparison engine portable. It also leaves room for format-specific or visual adapters without making them mandatory for a useful first release.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Users do not need Git knowledge or repository setup to review an AI edit.
- The same deterministic comparison can support OpenCode and other AI workflows.
- The report can expose both meaningful changes and known fidelity gaps.

**What it costs**:

- Automatic snapshots introduce local storage and cleanup obligations. Mitigation: research a bounded, explicit lifecycle with safe defaults.
- Broad format intent introduces adapter and fidelity complexity. Mitigation: publish support tiers and fail honestly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Extraction hides a material change | High | Per-construct capability evidence and visible warnings |
| Snapshot contents accumulate | High | Bounded retention, permissions, cleanup, and user-controlled storage |
| HTML includes active or unsafe content | High | Escaping, stripping, isolation, and adversarial fixtures |
| Portable interface becomes too broad | Medium | Keep one narrow compare contract and optional adapters |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The user identified a recurring inability to review AI edits outside Git. |
| 2 | **Beyond Local Maxima?** | PASS | The charter compares portable, skill-only, browser-only, history, explicit-pair, semantic, and visual directions. |
| 3 | **Sufficient?** | PASS | The decision freezes only product intent and leaves evidence-sensitive architecture choices to research. |
| 4 | **Fits Goal?** | PASS | Every selected property directly supports a before-and-after review workflow. |
| 5 | **Open Horizons?** | PASS | A portable core supports other runtimes and optional future adapters without broadening v1 now. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes now**:

- The research charter treats the accepted direction as a constraint.
- Runtime, library, adapter, diff-model, storage, and exact interface choices remain open until synthesis.

**How to roll back**: Before research starts, remove this newly created packet. After research starts, preserve command-owned artifacts and use the supported restart or archive lifecycle instead of deleting individual state files.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: Surface as the create-diff nested sk-doc mode; rename engine to create-diff

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-13 |
| **Deciders** | User and Codex |

### Context

ADR-001 chose a portable core wrapped by ONE standalone OpenCode skill. The operator re-scoped the surface: the wrapper becomes a **nested `create-diff` child mode of the `sk-doc` parent hub** (sibling to create-skill/create-readme/create-flowchart), and the engine's npm identifier is renamed `document-diff` → `create-diff`.

### Decision

**We supersede only ADR-001's surface decision**: the "one standalone OpenCode skill" clause is replaced with a `create-diff` nested sk-doc mode. The surface is the `create-diff` nested sk-doc mode, registered in `sk-doc/mode-registry.json` + `sk-doc/hub-router.json`, and passing the three canon gates. The engine and mode are both named `create-diff`.

The `research/**` synthesis is left intact as historical evidence; history is not rewritten, and spec-folder slugs stay historical.

### Consequences

The registered mode is advisor-routable once WS-1 lands, so it ships **preview-gated** (`SKILL.md` carries "preview — engine pending core phases 002–005") with conservative, specific aliases to avoid hijacking routing from functional siblings. The portable engine (phases 002–005) is unchanged in substance, only renamed.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The nested sk-doc surface matches the operator's intended product boundary and the engine rename removes the old package identity. |
| 2 | **Beyond Local Maxima?** | PASS | The decision preserves the portable core while comparing the standalone wrapper surface with the parent-hub mode topology. |
| 3 | **Sufficient?** | PASS | Registration files, canon gates, preview gating, and conservative aliases define an implementable surface contract. |
| 4 | **Fits Goal?** | PASS | A `create-diff` mode keeps local before-and-after review available through the sk-doc documentation hub. |
| 5 | **Open Horizons?** | PASS | The portable engine remains reusable outside OpenCode, while future sk-doc siblings and adapters retain room to evolve. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Ship create-diff as a self-contained skill-embedded engine (Python stdlib)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-15 |
| **Deciders** | User and Claude |

### Context

ADR-001 chose a portable npm package (TypeScript/Node) consumed by a thin wrapper; ADR-002 re-surfaced that wrapper as the `create-diff` nested sk-doc mode but kept it **preview-gated**, with the real engine deferred to phases 002–005 as a separately-built package. That package was never built, and the packaging open question — *which repository path should host the npm package?* — stayed unresolved, so the separate-package path was not actionable. The operator asked for a functional mode: templates, references, and scripts so it can actually produce a before/after review.

### Decision

**Embed the comparison engine in the skill as self-contained Python 3 standard-library scripts** (`create-diff/scripts/create_diff.py` + `validate_report.py`), rather than as a separate portable npm package behind a thin wrapper. This supersedes ADR-001's npm-packaging decision and ADR-002's preview-gated / engine-pending consequence for the delivered v1 surface.

Delivered fidelity tiers: plain text and Markdown (`full`), HTML and DOCX (`text`), and text-layer PDF (`text*`, via `pdftotext`/`pypdf`/`pdfplumber` when present). The engine provides deterministic line + inline word diff, a move heuristic, content-addressed baseline snapshots, an explicit-pair fallback, and a self-contained, zero-JavaScript, accessible HTML report.

Language is Python 3 stdlib rather than the design's Node/TypeScript — a deliberate deviation for **self-containment**: `difflib`, `zipfile` (DOCX), and `html.parser` (HTML) are all stdlib, so the mode works with zero install and no bundled `node_modules`; a Node build would require hand-rolling a ZIP reader and diff algorithm or shipping dependencies, defeating the goal. This mirrors the self-contained `create-flowchart` sibling.

The `research/**` synthesis and spec-folder history are left intact.

### Consequences

- The mode is **functional, not preview**: `SKILL.md` no longer says "engine pending", and its former "NEVER reimplement diff/parse/snapshot/render logic in this mode" rule is intentionally lifted for this skill — the skill *is* the engine now.
- Phases 002–005 as a *separately-packaged npm engine* are superseded for v1; their functional intent (core diff + snapshot, HTML/DOCX text, text-PDF) is realized in-skill at the tiers above. A future extraction into a portable package remains possible but is no longer required.
- Richer fidelity (run formatting, tracked changes, layout, side-by-side move mapping) and phase 007 scanned-PDF OCR remain out of scope and are surfaced to users as honest fidelity warnings rather than silently attempted.
- Open questions resolved: npm host path → **none (embedded)**; release-blocker fixture thresholds → an informal runnable fixture ships under `assets/fixtures/` (formal gate deferred); OCR → still **no-go** for v1.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The separate-package path was blocked on an unresolved host-path question; embedding is the only actionable route to a functional mode. |
| 2 | **Beyond Local Maxima?** | PASS | Weighed Node/TS-with-deps and a separate package against stdlib-embedded; stdlib wins on self-containment with no fidelity loss at the delivered tiers. |
| 3 | **Sufficient?** | PASS | Engine + validator + references + fixtures pass the three canon gates and a 27-check cross-format suite; reports are self-contained and accessibility-validated. |
| 4 | **Fits Goal?** | PASS | Local, Git-free before/after document review is now actually available through the sk-doc hub. |
| 5 | **Open Horizons?** | PASS | The engine can still be lifted into a portable package later; richer adapters and OCR retain room to evolve behind the fidelity-tier contract. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003 -->
