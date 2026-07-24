---
title: "Post-019 Deep-Loop Angle Backlog"
description: "Candidate /deep:alignment and /deep:research investigations across all 12 skill hubs, surfaced from the sk-doc/019-skill-routing-refactor work. Two independent GPT-5.6-SOL (xhigh) agents, verify-first, evidence-cited."
trigger_phrases:
  - "post-019 angles"
  - "deep-loop angle backlog"
  - "skill routing follow-up investigations"
importance_tier: "normal"
contextType: "research"
---

# Post-019 Deep-Loop Angle Backlog

Candidate deep-loop investigations across all 12 current skill hubs, grounded in the work done in
`sk-doc/019-skill-routing-refactor`. Produced 2026-07-24 by two independent **GPT-5.6-SOL (xhigh,
normal speed)** agents run read-only over the repo, one per lens. Every angle cites file-level evidence
and flags whether it is already covered by an open 019 phase or is genuinely new territory.

## Contents

- [`alignment-loop-angles.md`](./alignment-loop-angles.md) — **11 alignment-loop (conformance/drift) angles**.
  What may have drifted from an authority 019 established (compiled serving contract, scorer, defaultMode
  canon, create-* conformance, doc-quality standards) and is worth a `/deep:alignment` pass.
- [`research-angles.md`](./research-angles.md) — **13 research angles**. Open questions 019 surfaced but
  did not settle (calibration, causal leaf telemetry, two-tier selection, benchmark external validity,
  the never-run TRP decomposition dive, …) worth a `/deep:research` loop.

## Confirmed drift (spot-verified against the live tree, 2026-07-24)

Four of the alignment findings were independently re-checked and hold on the current `skilled/v4.0.0.0` tree —
these are quicker to *fix* than to loop:

1. **Compiled serving false-green** — a hub's activation manifest reports `servingAuthority:"compiled"` while
   `manifestFreshness.fresh:false`; the resolver correctly falls back to legacy, but the status probe does not
   gate its "compiled-serving" claim on freshness.
2. **Fleet-wide doc drift** — all 7 hub `feature-catalog.md` still say compiled routing is "off by default";
   it has been default-on since the cutover.
3. **sk-prompt manifest omission** — a live, indexed model profile is absent from `leaf-manifest.json`.
4. **Metadata/word-cap regressions** — a hub `SKILL.md`/`description.json` version mismatch; a `create-*`
   `SKILL.md` over the 5,000-word hard cap; a `create-diff` fixture missing required frontmatter.

## Run-first recommendation

- **Alignment loop first:** compiled serving-state truthfulness, then design-judgment + transport composition.
- **Research loop first:** the never-run TRP (Threshold/Recovery/Provenance) decomposition falsification,
  then operational advisor calibration.

## Provenance

Two SOL agents, ~530k tokens each, isolated read-only run in a git worktree; neither modified any repo file.
The reports are the agents' verbatim output; the confirmed-drift section above was verified separately.
