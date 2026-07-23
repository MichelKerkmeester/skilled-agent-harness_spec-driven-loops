---
title: Deep Alignment Report
description: Auto-generated reducer view over the alignment packet. Never manually edited.
---

# Deep Alignment Report

- Target: sk-design hallmark conformance
- Lanes: 2 (2 applicable)
- Overall verdict: FAIL
- Result state: SEALED (authoritative -- the loop reached synthesis)
- Findings: P0 5 / P1 5 / P2 7
- Composite score: 82

## Lane: sk-doc / docs / .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/001-surgical-fixes/, .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/002-evidence-envelopes/, .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/003-authored-cards/, .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/004-brand-first-lane/, .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/, .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md, .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/handover.md, .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/goal.md, .opencode/skills/sk-design/shared/evidence-envelopes/, .opencode/skills/sk-design/shared/references/structural-fingerprint-cards/, .opencode/skills/sk-design/shared/references/brand-first-lane.md, .opencode/skills/sk-design/design-audit/references/, .opencode/skills/sk-design/design-interface/references/design-process/

- Verdict: FAIL
- Iterations run: 12
- Artifacts checked: 60
- Findings: P0 5 / P1 2 / P2 0
- Composite score: 60

### P0

- **missing_required_section** (deterministic) — `.opencode/skills/sk-design/shared/evidence-envelopes/owned-asset-manifest.md` — Missing required section: overview
- **h2_not_uppercase** (deterministic) — `unknown-artifact` — 
- **missing_required_section** (deterministic) — `unknown-artifact` — 
- **missing_required_section** (deterministic) — `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/card-reciprocal-frame.md` — 
- **h2_not_uppercase** (deterministic) — `.opencode/skills/sk-design/design-audit/references/anti-patterns-production.md` — 

### P1

- **finding** (unlabeled) — `unknown-artifact` — 
- **non_sequential_numbering** (deterministic) — `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/spec.md` — 

## Lane: sk-code / code / .opencode/skills/sk-design/design-md-generator/backend/scripts/, .opencode/skills/sk-design/styles/lib/database/, .opencode/skills/sk-design/shared/authored-brand/, .opencode/skills/sk-design/shared/scripts/brand-first-boundary.test.mjs

- Verdict: CONDITIONAL
- Iterations run: 8
- Artifacts checked: 39
- Findings: P0 0 / P1 3 / P2 7
- Composite score: 22

### P1

- **finding** (unlabeled) — `unknown-artifact` — 
- **architectural-pattern-conformance** (reasoning-agent) — `unknown-artifact` — 
- **type-safety** (deterministic) — `unknown-artifact` — 

### P2

- **cross-file-consistency** (reasoning-agent) — `unknown-artifact` — 
- **comment-hygiene-beyond-simple-patterns** (reasoning-agent) — `unknown-artifact` — 
- **architectural-pattern-conformance** (reasoning-agent) — `unknown-artifact` — 
- **cross-file-consistency** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/interaction-capture.ts` — interaction-capture.ts has non-sequential and duplicated numbered sections.
- **architectural-pattern-conformance** (reasoning-agent) — `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts` — preview-gen.ts violates the sk-code four-group import ordering.
- **section-organization** (reasoning-agent) — `unknown-artifact` — 
- **exported-function-documentation** (reasoning-agent) — `unknown-artifact` — 
