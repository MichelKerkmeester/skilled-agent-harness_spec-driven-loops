---
title: "Decision Record: deep-context reference-architecture alignment"
description: "Decisions for aligning the deep-context reference layout and smart-router to its mature siblings: a full mirror that moves the two flat references into subfolders, mirroring deep-research's four-subfolder layout over deep-ai-council's, and keeping the new references lean and cross-linked to the existing feature_catalog rather than duplicating it."
trigger_phrases:
  - "reference alignment decision"
  - "move flat references"
  - "deep-research layout mirror"
  - "lean cross-linked references"
  - "feature catalog no duplication"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/010-deep-context-gathering/004-reference-architecture-alignment"
    last_updated_at: "2026-06-07T09:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored 3 ADRs for the reference-architecture-alignment phase"
    next_safe_action: "Execute the reference move + 8 new refs + router rewrite + citation sweep"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/SKILL.md"
      - ".opencode/skills/deep-context/references/convergence.md"
    session_dedup:
      fingerprint: "sha256:db845e0d74e2f0decc7e374fefdc3ca128789fc7e931a977111fcaf95099955f"
      session_id: "dc-134-004-20260607"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions:
      - "Full mirror MOVES the two flat files; siblings carry no root-level reference file"
      - "Mirror deep-research's 4-subfolder layout, not deep-ai-council's"
      - "Keep references lean and cross-linked to the feature_catalog, no duplication"
---
# Decision Record: deep-context reference-architecture alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Full mirror that moves the two flat references into subfolders

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-07 |
| **Deciders** | deep-context owner, deep-loop maintainer |

---

<!-- ANCHOR:adr-001-context -->
### Context

deep-context shipped its reference layer as two flat files at the `references/` root (`convergence.md`, `loop_protocol.md`). Its three mature siblings store references in subfolders and carry no root-level reference file: `deep-research` uses `convergence/ guides/ protocol/ state/`, and `deep-review` and `deep-ai-council` are likewise subfoldered. To align, we had to decide whether to add subfolders additively (keeping the two flat files where they are and adding new files beside them) or to fully mirror the siblings by moving the two flat files into subfolders so the root holds no reference file.

### Constraints

- The siblings have no root-level reference file; a true mirror cannot leave deep-context with flat files at the root.
- The two moved files have roughly 62 inbound citations across the skill, command, workflow, and agent surfaces; whichever option is chosen, the citation graph must stay internally consistent.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Fully mirror the sibling layout by MOVING `references/convergence.md` to `references/convergence/convergence.md` and `references/loop_protocol.md` to `references/protocol/loop_protocol.md`, leaving no reference file at the `references/` root, and then sweeping every citation to the new paths.

**How it works**: The two files are moved content-preserving (their in-file headings and anchors are unchanged, so only the path prefix shifts). The new references are authored beside the moved ones inside `convergence/`, `state/`, and `guides/`. A single citation sweep repaths all inbound references across `feature_catalog/**`, `manual_testing_playbook/**`, the command doc, the two workflow YAMLs, and the agent doc, and a zero-hit grep gate confirms no flat path survives.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Full mirror + move the two files (chosen)** | Exact peer of the siblings; one canonical location per reference; no flat/subfolder ambiguity | One large citation sweep; a missed citation breaks a link | 9/10 |
| Additive subfolders, keep the flat copies | No citation sweep for the two existing files | Leaves two locations for the same reference; diverges from siblings that carry no root file; confuses future authors | 3/10 |
| Keep flat, add no subfolders | Zero churn | Fails the entire alignment goal; deep-context stays the structural outlier | 1/10 |

**Why this one**: The siblings define the target, and none of them keeps a root-level reference file. Only a move produces a true mirror with a single canonical location per reference; the citation-sweep cost is bounded and gated by a zero-hit completeness check.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- deep-context's reference tree reads as a true peer of deep-research, with one canonical path per reference and room to grow inside each subfolder.
- The router, README, and every cross-link point at one location, so there is no flat/subfolder drift to maintain.

**What it costs**:
- Roughly 62 citations must be repathed in one sweep. Mitigation: a single coordinated sweep plus a zero-hit grep gate before any completion claim.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A missed citation leaves a dangling flat-path link | M | Citation-completeness is a P0 gate: `rg` for the two flat paths must return zero in the sweep scope |
| An in-file anchor reference breaks | L | The move preserves in-file headings/anchors; only the path prefix changes |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The siblings carry no root-level reference file, so a true mirror requires moving the two flat files |
| 2 | **Beyond Local Maxima?** | PASS | Additive-keep-flat and no-change alternatives evaluated and scored |
| 3 | **Sufficient?** | PASS | Move + new references + citation sweep yields the full subfoldered mirror |
| 4 | **Fits Goal?** | PASS | Produces the exact sibling layout, which is the alignment goal |
| 5 | **Open Horizons?** | PASS | Each subfolder can grow new references the same way the siblings do |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `references/convergence.md` → `references/convergence/convergence.md`; `references/loop_protocol.md` → `references/protocol/loop_protocol.md`.
- The router `RESOURCE_MAP`, the README structure, the workflow `references_map`, and every `feature_catalog`/`manual_testing_playbook`/command/agent citation are repathed to the new locations.

**How to roll back**: Move the two files back to the `references/` root, delete the new subfolders' files, and revert the citation sweep and the router/README path changes. No `.cjs` or runtime file is touched.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Mirror deep-research's four-subfolder layout, not deep-ai-council's

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-07 |
| **Deciders** | deep-context owner, deep-loop maintainer |

---

<!-- ANCHOR:adr-002-context -->
### Context

Two sibling layouts were available as the mirror target. `deep-research` organizes references into `convergence/ guides/ protocol/ state/`. `deep-ai-council` organizes them into `patterns/ scoring/ structure` (plus `convergence/` and `integration/`). deep-context had to adopt one shape, and the choice determines which subfolders exist and how the eight new references are grouped.

### Constraints

- deep-context is a gather loop: it sweeps a shared scope in parallel, merges by agreement, and converges on coverage signals - the same shape as deep-research's iterate-and-converge research loop.
- deep-ai-council's `patterns/ scoring/ structure` layout is built around multi-seat deliberation, strategy scoring, and seat structure, which are concepts deep-context does not have.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Mirror `deep-research`'s four-subfolder layout - `convergence/`, `guides/`, `protocol/`, `state/` - and group the eight new references into `convergence/` (signals, recovery, graph), `state/` (format, jsonl, outputs, reducer-registry), and `guides/` (quick_reference).

**How it works**: deep-context maps cleanly onto the research layout. Its stop contract, five signals, recovery, and coverage-graph stop path live in `convergence/`; its packet files, JSONL records, markdown outputs, and reducer ownership live in `state/`; its iteration protocol lives in `protocol/`; and its operator cheat sheet lives in `guides/`. The deep-ai-council-only subfolders (`patterns/`, `scoring/`, `structure/`) are not created because deep-context has no deliberation/scoring/seat-structure surface to fill them.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Mirror deep-research's convergence/guides/protocol/state (chosen)** | deep-context is a gather/converge loop like research; references map 1:1 onto these subfolders | None material; it is the natural fit | 9/10 |
| Mirror deep-ai-council's patterns/scoring/structure | Reuses another sibling's shape | Built for deliberation/scoring/seat-structure that deep-context lacks; subfolders would be empty or forced | 2/10 |
| Invent a bespoke layout | Tailored to deep-context | Defeats the alignment goal; no sibling to mirror; future drift | 2/10 |

**Why this one**: deep-context and deep-research are both iterate-and-converge loops, so the research subfolders fit deep-context's references without forcing or leaving empty folders, which is exactly what the deep-ai-council layout would do.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The eight new references group naturally, and a maintainer who knows deep-research's layout immediately knows deep-context's.
- The router's `RESOURCE_MAP` keys (convergence, state, protocol, guides) line up with the same intent families the research router uses.

**What it costs**:
- deep-context does not adopt deep-research's extra references (`convergence_reference_only.md`, `guides/capability_matrix.md`, `protocol/spec_check_protocol.md`). Mitigation: those serve research-only needs; deep-context authors only the eight in scope and the router lists only what exists.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future reader expects the full deep-research reference set | L | The scope explicitly excludes the research-only extras; the README and router list only the eight references that exist |
| The two layouts drift over time | L | Both follow the shared sk-doc smart-router template; structural drift surfaces in the router pattern, not the subfolder names |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A mirror target must be chosen before the references can be grouped into subfolders |
| 2 | **Beyond Local Maxima?** | PASS | The deep-ai-council layout and a bespoke layout were evaluated and rejected |
| 3 | **Sufficient?** | PASS | The four research subfolders hold all eight new references plus the two moved files |
| 4 | **Fits Goal?** | PASS | deep-context is a gather/converge loop, the same shape the research layout serves |
| 5 | **Open Horizons?** | PASS | The shared sk-doc router template keeps both loops aligned as they grow |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Subfolders created: `references/convergence/` (4 files), `references/protocol/` (1 file), `references/state/` (4 files), `references/guides/` (1 file).
- The router `RESOURCE_MAP` and `LOADING_LEVELS` key on these subfolder families, matching the research router's structure.

**How to roll back**: Not applicable independently of ADR-001; reverting the move and the new references collapses the layout back to the flat files.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Keep the new references lean and cross-linked to the feature_catalog, not duplicated

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-07 |
| **Deciders** | deep-context owner, deep-loop maintainer |

---

<!-- ANCHOR:adr-003-context -->
### Context

deep-context uniquely ships a `feature_catalog/` that the siblings lack: a per-feature inventory under `01--frontier-seeding` through `07--runtime-robustness` that already documents the implementation reality (the five convergence signals, the coverage-graph node kinds and relations, the reducer's dedup/agreement/validation behavior, and the runtime-robustness mechanisms) with source-file and test anchors. The eight new references cover the same subject areas. We had to decide whether each new reference should restate that detail or stay lean and point to the catalog.

### Constraints

- The `feature_catalog/` is the implementation-reality source of truth and is actively maintained; a second full copy of its detail would drift.
- The references must still be useful on their own as the router's loadable resources, so they cannot be empty stubs.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Author each new reference lean - enough to be a self-contained router resource for its topic - and cross-link it to its `feature_catalog/0N` counterpart for the full implementation and test detail, rather than copying that detail into the reference.

**How it works**: Each new reference carries the contract-level summary a reader needs at routing time (for example, `convergence_signals.md` names the five signals, the composite weights, and the thresholds), then links to the matching `feature_catalog` entry (`04--convergence-detection/`, `06--coverage-graph-schema/`, `03--agreement-merge/`, `05--context-report-synthesis/`, `07--runtime-robustness/`) for the per-feature current-reality and source anchors. The reference is the routing surface; the catalog remains the deep source.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Lean references cross-linked to the feature_catalog (chosen)** | Single source of implementation truth; references stay loadable and small; no drift | A reader may need to follow one link for full depth | 9/10 |
| Duplicate the catalog detail into each reference | Each reference is self-complete | Two copies of the same detail drift; doubles maintenance; bloats router loads | 2/10 |
| Skip the references, point the router straight at the catalog | No new files | Breaks the sibling mirror (siblings have references, not a catalog router); loses the canonical subfolder layout | 2/10 |

**Why this one**: deep-context's catalog already owns the implementation detail, so the references add the most value as lean, loadable routing surfaces that defer depth to the catalog, keeping one source of truth and the sibling-aligned layout.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- One source of implementation truth (the catalog) and one routing surface (the references), with no duplicated detail to keep in sync.
- Router loads stay small because each `ALWAYS`/`ON_DEMAND` reference is lean.

**What it costs**:
- A reader who wants full depth follows one cross-link to the catalog. Mitigation: every reference names its counterpart explicitly, and a no-duplication review item confirms the references carry no copied prose.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reference and its catalog entry drift | M | The reference holds only contract-level summary and links out; depth lives only in the catalog |
| A reference is too thin to route on | L | Each reference carries the named signals/records/contracts a router decision needs, verified by the sk-doc structure validator |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The new references overlap the existing catalog, so the duplication question must be settled |
| 2 | **Beyond Local Maxima?** | PASS | Duplicate-detail and skip-references alternatives evaluated and rejected |
| 3 | **Sufficient?** | PASS | Lean references plus catalog cross-links cover both routing and deep-detail needs |
| 4 | **Fits Goal?** | PASS | Keeps the catalog as the single source of truth while delivering the sibling-aligned references |
| 5 | **Open Horizons?** | PASS | New features add a catalog entry and a lean reference, without copying detail |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Each new reference is authored lean with a contract-level summary and an explicit cross-link to its `feature_catalog/0N` counterpart.
- No implementation prose is copied from the catalog into the references; a no-duplication review confirms it.

**How to roll back**: Delete the new references; the `feature_catalog/` is untouched and remains the implementation source of truth.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 decision record - 3 ADRs for the reference-architecture-alignment phase
Each ADR: Metadata, Context+Constraints, Decision, Alternatives, Consequences, Five Checks, Implementation
-->
