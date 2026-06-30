---
title: "Decision Record: Create sk-design-md-generator skill with an embedded extraction pipeline [template:level_3/decision-record.md]"
description: "Architecture decisions for the sk-design-md-generator skill: embed a full working tool vs a lean knowledge-skill, and trim generated artifacts to keep the skill lean."
trigger_phrases:
  - "embed decision"
  - "design-md-generator tool"
  - "full working tool"
  - "trim generated artifacts"
  - "decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/006-sk-design-md-generator"
    last_updated_at: "2026-06-21T11:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Finalized decision record"
    next_safe_action: "Verify packet 152 closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-generator"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Create sk-design-md-generator skill with an embedded extraction pipeline

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Embed a full working tool rather than a lean knowledge-skill

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-21 |
| **Deciders** | Operator (Michel), Claude |

---

<!-- ANCHOR:adr-001-context -->
### Context

The skill needs a real extraction capability, not just guidance. The source material is a full TypeScript extraction pipeline (Playwright crawler, OKLCH colour clustering, 19 script modules, node dependencies) plus a markdown knowledge base and gold-standard example outputs. The choice was how much to carry into the skill.

### Constraints

- The skill must conform to sk-doc standards (frontmatter, 5 sections, advisor-routable references).
- Extraction needs Node >= 18, Playwright, and a Chromium download (~500 MB) at runtime.
- The skill should read as a self-contained first-party capability.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: embed the entire working tool under `tool/` (scripts, resources, examples, configs) and author a conformant skill layer on top, giving the framework a self-contained extraction engine.

**How it works**: the runnable tree lives at `.opencode/skills/sk-design-md-generator/tool/`, and the skill's own `SKILL.md`, `references/`, `assets/`, `INSTALL_GUIDE.md`, and `graph-metadata.json` wrap it for advisor routing and house standards.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Embed the full working tool (chosen)** | Self-contained extraction; scripts + examples available offline | ~1.9 MB embedded under `tool/` | 8/10 |
| Lean knowledge-skill | Tiny, low-maintenance; matches the sk- judgment/transport split | Cannot extract on its own; depends on an external install | 6/10 |
| Hybrid (lean now, embed later) | Defers the heavy call | Leaves the headline capability (extraction) absent at ship | 5/10 |

**Why this one**: the operator chose the full working tool. A design-system extractor whose extraction is delegated elsewhere is a weak skill; embedding makes the headline capability real and offline.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The skill ships a runnable pipeline: `npx ts-node tool/scripts/extract.ts <url>` produces `tokens.json` + a `DESIGN.md` with no external package install.
- The knowledge docs and gold-standard examples are available offline as references and quality benchmarks.

**What it costs**:
- ~1.9 MB of embedded code lives under `tool/`. Mitigation: it is isolated under `tool/` and gitignored at the `node_modules`/`output` level.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Chromium/Playwright install friction | M | INSTALL_GUIDE documents the one-time `npx playwright install chromium` |
| Embedded code drifts from the skill docs | L | References point at `tool/resources/`; docs verified against the real CLI |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator requested the skill; extraction is its reason to exist |
| 2 | **Beyond Local Maxima?** | PASS | Three depths weighed; operator chose full |
| 3 | **Sufficient?** | PASS | Embed + thin skill layer is the minimum that ships a working extractor |
| 4 | **Fits Goal?** | PASS | Completes the sk-design-* family alongside sk-design-interface |
| 5 | **Open Horizons?** | PASS | Isolated `tool/` keeps the engine swappable |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- New skill `.opencode/skills/sk-design-md-generator/` with `tool/` (embedded) + skill layer.
- New advisor-graph node + reciprocal sibling edges into the sk-design-* family.

**How to roll back**: `git rm -r .opencode/skills/sk-design-md-generator` and re-run `skill_graph_scan` to drop the node; remove the reciprocal back-edges added to sibling skills' graph-metadata.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Trim generated artifacts and redundant docs to keep the skill lean

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-21 |
| **Deciders** | Claude |

---

<!-- ANCHOR:adr-002-context -->
### Context

The source tree carried generated HTML reports (~2 MB of embedded-image HTML per example), redundant per-platform entry files, and a verbose workflow doc that duplicates the skill's own `SKILL.md` and `tool/resources/`. Carrying all of it would bloat the skill and create two sources of truth.

### Constraints

- The skill should stay scannable and not duplicate guidance.
- Anything dropped must be regenerable or genuinely redundant.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: keep only the runnable code, the knowledge docs, and the gold-standard `DESIGN.md` + `tokens.json` + `writing-notes.md` per example; drop the generated HTML reports, the per-platform entry files, and the redundant verbose workflow doc.

**How it works**: `tool/` holds `scripts/`, `resources/`, trimmed `examples/`, and configs. The skill's `SKILL.md` + `references/` + `assets/` are the single source of operating guidance.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Trim generated + redundant (chosen)** | Lean skill; one source of truth | The HTML reports must be regenerated on demand | 9/10 |
| Carry everything verbatim | Nothing to regenerate | ~2 MB of regenerable HTML + duplicated guidance | 5/10 |

**Why this one**: the dropped files are regenerable outputs or duplicate the skill's own docs; keeping them adds weight without adding capability.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The skill is ~2 MB lighter and has a single source of operating guidance.
- `report-gen.ts` / `preview-gen.ts` regenerate the visual artifacts when needed.

**What it costs**:
- The example HTML reports are not shipped. Mitigation: they regenerate from the kept `tokens.json` + `DESIGN.md` pairs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A consumer expects the prebuilt HTML reports | L | Documented as regenerable in the workflow reference |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Avoids ~2 MB of bloat and a duplicate source of truth |
| 2 | **Beyond Local Maxima?** | PASS | Carry-everything alternative weighed |
| 3 | **Sufficient?** | PASS | Kept content covers reference + benchmark needs |
| 4 | **Fits Goal?** | PASS | Keeps the skill lean and scannable |
| 5 | **Open Horizons?** | PASS | Visual artifacts regenerate on demand |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `tool/` keeps `scripts/`, `resources/`, trimmed `examples/`, configs; HTML reports, platform-entry files, and the verbose workflow doc are dropped.

**How to roll back**: regenerate visual artifacts with `report-gen.ts` / `preview-gen.ts`; the dropped docs were redundant and need no restore.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
