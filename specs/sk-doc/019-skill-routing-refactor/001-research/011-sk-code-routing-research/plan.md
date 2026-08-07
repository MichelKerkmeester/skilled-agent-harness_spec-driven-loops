---
title: "Implementation Plan: sk-code Typed-Pair Routing and Leaf Recall Research"
description: "Research method and completion gates for the eight-iteration sk-code routing deep-research: separate hub/surface from leaf routing, attribute benchmark scoring, characterize the universal-preamble identity, and deliver anti-gamed leaf-recall candidates."
trigger_phrases:
  - "sk-code routing research plan"
  - "sk-code leaf recall research method"
importance_tier: "important"
contextType: "research"
---
# Implementation Plan: sk-code Typed-Pair Routing and Leaf Recall Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

An eight-iteration deep-research loop that separates sk-code hub/surface routing from leaf-resource
routing and evaluates typed-pair recall honestly. Each iteration reads the current router inputs,
scorer chain, and benchmark evidence directly, pins every claim to file-level evidence, and records a
canonical synthesis under `research/`. The deliverable is findings plus a dependency-ordered set of
anti-gamed leaf-recall candidates; implementation is out of scope and hands off to
`../014-sk-code-router-alignment/`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Every research question is answered with file-level evidence in `research/research.md`.
- Each proposed leaf-recall candidate is implementable and validated against gaming (no change that
  inflates the benchmark score without improving real recall).
- No source, manifest, fixture, or scorer file is modified by this research packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Deep-research over the sk-code routing surface: the hub/surface router inputs, the index-table leaf
authoring shape, the shared benchmark replay + scorer chain, the universal `DEFAULT_RESOURCE` preamble,
and the available live leaf-read evidence. Findings are synthesized into `research/research.md` with a
supporting dashboard, strategy, and append-only iteration/delta state. No runtime component is changed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Setup** — bind the research topic, freeze same-revision baselines, and enumerate the sk-code
   router inputs and scorer chain to read.
2. **Investigation** — run the deep-research iterations: separate hub/surface from leaf routing,
   attribute benchmark scoring, characterize the preamble identity, and bound the live-read evidence.
3. **Synthesis** — consolidate findings into `research/research.md` with anti-gamed, dependency-ordered
   leaf-recall candidates, and record the handoff to the sk-code implementation phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No runtime tests — this is a research packet. Verification is that every research question is answered
with file-level evidence in `research/research.md`, and that each leaf-recall candidate is validated
against gaming before hand-off.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The current sk-code router inputs, index-table leaf shape, and shared benchmark replay/scorer chain (read-only).
- `../014-sk-code-router-alignment/`, the sk-code measurement/implementation phase that consumes these findings.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

None required — this research packet changes no source, manifest, fixture, or runtime file. Any file
would revert with a plain checkout.
<!-- /ANCHOR:rollback -->
