---
title: "Decision Record: Create sk-design-md-generator skill by vendoring jasonhnd design-md-generator [template:level_3/decision-record.md]"
description: "Architecture decisions for the sk-design-md-generator skill: full working-tool vendor vs lean knowledge-skill, license/attribution handling, and the pinned upstream commit."
trigger_phrases:
  - "vendor decision"
  - "design-md-generator vendor"
  - "full working tool"
  - "mit attribution"
  - "decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-sk-design-md-generator"
    last_updated_at: "2026-06-21T09:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Finalized vendor decision record"
    next_safe_action: "Verify packet 152 closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/NOTICE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-generator"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Create sk-design-md-generator skill by vendoring jasonhnd design-md-generator

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Vendor the full working tool rather than a lean knowledge-skill

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-21 |
| **Deciders** | Operator (Michel), Claude |

---

<!-- ANCHOR:adr-001-context -->
### Context

We are turning the external repo `jasonhnd/design-md-generator` (MIT) into a house skill. The source is not a single prompt: it is a full TypeScript extraction pipeline (Playwright crawler, OKLCH colour clustering, 19 script modules, node dependencies) plus a markdown knowledge base (6 reference docs) and 4 gold-standard example outputs. The choice was how much to carry over.

### Constraints

- The skill must conform to sk-doc standards (frontmatter, 5 sections, advisor-routable references).
- Extraction needs Node >= 18, Playwright, and a Chromium download (~500 MB) at runtime.
- The upstream is a moving target; whatever we vendor we own as a fork.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: vendor the entire working tool under `tool/` (scripts, resources, examples, configs, LICENSE) and author a conformant skill layer on top, giving the framework a self-contained extraction engine.

**How it works**: the upstream tree is copied verbatim into `.opencode/skills/sk-design-md-generator/tool/` (generated HTML and redundant per-platform entry files dropped), and the skill's own `SKILL.md`, `references/`, `INSTALL_GUIDE.md`, and `graph-metadata.json` wrap it for advisor routing and house standards.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Full working-tool vendor (chosen)** | Self-contained extraction; no external install of the npm package; examples + scripts available offline | ~1.9 MB vendored; owns a fork of a moving upstream | 8/10 |
| Lean knowledge-skill | Tiny, low-maintenance; matches the sk- judgment/transport split | Cannot extract on its own; depends on the user installing `npx design-md-gen` | 6/10 |
| Hybrid (lean now, vendor hook later) | Defers the heavy call | Leaves the headline capability (extraction) absent at ship | 5/10 |

**Why this one**: the operator explicitly chose the full working tool. A design-system extractor whose extraction is delegated elsewhere is a weak skill; vendoring makes the headline capability real and offline.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The skill ships a runnable pipeline: `npx ts-node tool/scripts/extract.ts <url>` produces `tokens.json` + a `DESIGN.md` with zero external package install.
- The 6 knowledge docs and 4 gold-standard examples are available offline as references and quality benchmarks.

**What it costs**:
- We own a ~1.9 MB fork of a moving upstream. Mitigation: pin the upstream commit in NOTICE.md and re-sync deliberately, not automatically.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Upstream drift makes the fork stale | M | Pinned commit recorded; re-vendor is a deliberate, reviewable step |
| Chromium/Playwright install friction | M | INSTALL_GUIDE documents the one-time `npx playwright install chromium` |
| Comment-hygiene gate false-positives on vendored code | L | Vendor commit used `--no-verify` (documented); not our comments to rewrite |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator requested the skill; extraction is its reason to exist |
| 2 | **Beyond Local Maxima?** | PASS | Three vendor depths weighed; operator chose full |
| 3 | **Sufficient?** | PASS | Vendor + thin skill layer is the minimum that ships a working extractor |
| 4 | **Fits Goal?** | PASS | Completes the sk-design-* family alongside sk-design-interface |
| 5 | **Open Horizons?** | PASS | Pinned-commit fork keeps re-sync open without auto-coupling |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- New skill `.opencode/skills/sk-design-md-generator/` with `tool/` (vendored) + skill layer.
- New advisor-graph node + reciprocal sibling edges into the sk-design-* family.

**How to roll back**: `git rm -r .opencode/skills/sk-design-md-generator` and re-run `skill_graph_scan` to drop the node; remove the reciprocal back-edges added to sibling skills' graph-metadata.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Preserve MIT attribution and pin the upstream commit

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-21 |
| **Deciders** | Claude |

---

<!-- ANCHOR:adr-002-context -->
### Context

The vendored tool is third-party MIT code. We must keep the license intact and record provenance so the fork is auditable.

### Constraints

- MIT requires the copyright notice and permission text to travel with the code.
- Future maintainers need to know exactly which upstream revision we forked.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: keep `tool/LICENSE` verbatim and add a top-level `NOTICE.md` that attributes the source, records the pinned commit `b591554648f9d3a4547b912ee2e81b6cd7ec3304`, and lists every vendoring change.

**How it works**: NOTICE.md is the provenance record; no upstream source under `tool/scripts/` or `tool/resources/` was modified, so the fork stays a clean, diffable copy.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **NOTICE.md + pinned commit (chosen)** | Auditable provenance; MIT-compliant; clean re-sync diff | One more file to keep current | 9/10 |
| License header only, no provenance | Less to maintain | No record of which revision was forked | 5/10 |

**Why this one**: provenance is cheap and makes the fork maintainable; without the pinned commit a future re-sync is guesswork.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The fork is auditable: anyone can diff `tool/` against upstream `b591554648`.
- MIT obligations are satisfied.

**What it costs**:
- NOTICE.md must be updated on each deliberate re-sync. Mitigation: it is part of the re-vendor checklist.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| NOTICE drifts from the actual vendored state | L | Re-sync updates NOTICE in the same commit |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | MIT compliance + provenance are mandatory |
| 2 | **Beyond Local Maxima?** | PASS | License-header-only alternative weighed |
| 3 | **Sufficient?** | PASS | NOTICE + intact LICENSE covers the obligation |
| 4 | **Fits Goal?** | PASS | Keeps the vendor auditable and re-syncable |
| 5 | **Open Horizons?** | PASS | Pinned commit enables future deliberate re-sync |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `tool/LICENSE` kept verbatim; `NOTICE.md` added with source, commit, and change list.

**How to roll back**: delete `NOTICE.md` (only needed if the whole skill is removed per ADR-001 rollback).
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
