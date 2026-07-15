---
title: "Decision Record: Benchmark Authoring Centralization"
description: "ADRs governing where benchmark-document templates and standards live: create-benchmark owns authored-family templates+guides; deep-loop lanes own run/scoring logic and measurement contracts; the Lane C report stays renderer-owned; code-owned families are named non-goals."
trigger_phrases:
  - "016 decision record benchmark centralization"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-benchmark-authoring-centralization"
    last_updated_at: "2026-07-12T11:38:53Z"
    last_updated_by: "claude-code"
    recent_action: "ADRs recorded for the centralization boundaries"
    next_safe_action: "Implement per ADRs; run terminal gates"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Benchmark Authoring Centralization

---

<!-- ANCHOR:adr-001 -->
## ADR-001: create-benchmark owns benchmark-document templates and standards; deep-loop modes consume

**Status:** Accepted

**Context:** Benchmark-document templates and authoring standards were scattered inside the deep-improvement lanes, duplicating conventions per lane. The behavior family already demonstrated a cleaner split: the normative measurement contract stays in `system-deep-loop/shared/`, while the fillable templates + authoring guide live in `sk-doc/create-benchmark`.

**Decision:** Generalize that precedent. create-benchmark is the single home for benchmark-document TEMPLATES and authoring STANDARDS across families. The deep-loop modes keep run/scoring logic and measurement contracts and consume the templates by pointer.

**Consequences:** One place to look for "how do I author a benchmark document." Lane docs shrink to run mechanics + a pointer. create-benchmark's section 1 becomes a family router. Cost: the templates and the contracts they instantiate live in two trees, linked rather than co-located.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The Lane C skill-benchmark report .md stays renderer-owned — never templated

**Status:** Accepted

**Context:** The skill-benchmark `skill-benchmark-report.md` is not hand-authored; it is a deterministic projection rendered from `skill-benchmark-report.json` by `build-report.cjs` as an anti-drift measure. A naive "move all templates to create-benchmark" reading would add a fill-in report template.

**Decision:** create-benchmark templates only the INPUTS and the hub `benchmark/README` index for the skill-benchmark family. It explicitly does NOT provide a report `.md` template, and its skill-benchmark standard states the report is renderer-owned and must never be hand-authored or hand-edited.

**Consequences:** The anti-drift guarantee is preserved. Authors get storage-convention guidance without a foot-gun template. The D1-D5 scoring contract remains the lane's authority, linked from the standard.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Lane A (agent-improvement) is a code-owned non-goal

**Status:** Accepted

**Context:** Lane A emits spec-folder-local 5-dimension JSON scored by the lane. Its artifacts are code-driven and live in-lane, not authored as standalone documents.

**Decision:** create-benchmark's family table NAMES Lane A so the router can disambiguate "which benchmark family," but marks it code-owned with in-lane artifacts — a documented non-goal for create-benchmark authoring. No templates are authored for it here.

**Consequences:** The family router names the code-owned family without claiming authoring ownership, while create-benchmark avoids owning artifacts that are really code outputs.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Measurement contracts stay lane-local; create-benchmark links, never copies

**Status:** Accepted

**Context:** `reviewer_schema.md`, the model-benchmark evaluator contracts, and the skill-benchmark `scoring_contract.md` are run/scoring authorities owned by deep-improvement. Copying them into create-benchmark would fork the source of truth.

**Decision:** create-benchmark authors fixture/profile INPUT templates and cross-links the lane-local contracts as the authorities. It never copies or moves a scoring/evaluator/reviewer contract.

**Consequences:** Single source of truth for measurement stays in the lane. Authoring guidance in create-benchmark stays a thin, linked layer over the contracts.
<!-- /ANCHOR:adr-004 -->
