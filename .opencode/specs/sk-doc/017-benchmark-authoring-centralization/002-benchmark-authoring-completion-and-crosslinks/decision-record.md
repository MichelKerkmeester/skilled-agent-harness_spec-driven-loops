---
title: "Decision Record: Benchmark Authoring Completion and Cross-Links"
description: "ADRs for completing benchmark-authoring centralization: create-benchmark hosts the authoring GUIDE for every family (amending the Lane A non-goal decision); code-coupled artifacts and measurement contracts stay lane-owned and cross-linked (reaffirming the contracts ruling); the fixtureDir break is a systemic correctness fix."
trigger_phrases:
  - "benchmark authoring completion decisions"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-benchmark-authoring-centralization/002-benchmark-authoring-completion-and-crosslinks"
    last_updated_at: "2026-07-13T14:35:28Z"
    last_updated_by: "claude-code"
    recent_action: "ADRs recorded"
    next_safe_action: "Implement per ADRs"
---
# Decision Record: Benchmark Authoring Completion and Cross-Links

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: create-benchmark hosts an authoring GUIDE for every family; Lane A is no longer a pure non-goal (amends parent ADR-003)

**Status:** Accepted

**Context:** Parent ADR-003 declared Lane A (agent-improvement) a code-owned non-goal, so create-benchmark carried no authoring content for it. Lane A owns a real doc-only authoring surface, and a create-benchmark reader was silently missing one of five families. The operator asked to make create-benchmark the single home for benchmark document-creation guidelines.

**Decision:** create-benchmark hosts an authoring GUIDE for every family, including the new Lane A guide. The guide teaches how to author the doc-only inputs and cross-link the lane-owned artifacts. This amends ADR-003: Lane A is now "authoring-guided here," not a non-goal. Its executable/code-coupled artifacts remain in-lane (see ADR-002).

**Consequences:** The family router in create-benchmark §2 is complete at the guidance layer — five families, one home for "how do I author this." Cost: one family is guide-only here (its fillable templates/configs stay in-lane), an intentional asymmetry recorded in ADR-002.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Measurement contracts and code-coupled artifacts stay lane-owned and cross-linked; nothing is relocated (reaffirms parent ADR-004)

**Status:** Accepted

**Context:** The operator was offered three tiers, including physically relocating scoring/measurement contracts (and the code-read schema/templates/config) into create-benchmark. Audit showed several targets are read by executable code and tests (`packaging_config.schema.json` and the 9 `templates/*.template` by `init_packaging.py`; `loop_contract.md` by a runtime vitest; `improvement_config.json` by `dispatch-model.cjs`), and the four core contracts state verbatim "never copied into create-benchmark." Relocation would break the build and invert run-ownership (a documentation skill owning the runners' measurement truth).

**Decision:** Reaffirm parent ADR-004 and extend it to code-coupled artifacts. No contract, rubric, schema, scorer, runner, or code-read template moves into create-benchmark. create-benchmark achieves "single home" at the authoring-GUIDANCE layer and cross-links the lane authorities bidirectionally.

**Consequences:** No build breakage; run/scoring ownership stays with the lanes that execute. "Single home" means single home for authoring guidance, not physical custody of every artifact. The operator selected this over the two relocation tiers.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The fixtureDir break is a systemic profile correction, not a reviewer-only fix

**Status:** Accepted

**Context:** Parent packet 015 flagged F002 as a single reviewer-profile pointing at a nonexistent hyphenated `benchmark-fixtures` directory. Audit found all 10 model-benchmark profiles carry the same `fixtureDir`, and `run-benchmark.cjs` resolves the path directly with no hyphen->underscore normalization — so the underscore-migration silently broke every profile's default fixture path, not one.

**Decision:** Repoint all 10 profiles and reconcile the profiles README prose in one correction. This is a data/config fix in the deep-improvement lane, touching no run/scoring logic.

**Consequences:** Lane B's shipped default fixture path resolves again for every profile. The fix lives in-lane (the profiles are lane data); create-benchmark is unaffected.
<!-- /ANCHOR:adr-003 -->
