<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Research — F7 — Rich Content Blocks

> First sub-phase of the `006-rich-content-blocks` feature. This is a **lean spec-kit phase**: it
> records the research phase in the packet's phase graph. The research **artifacts**
> live in the deep-loop-aligned folder [`../research/`](../research/), not here.

## Summary

Research-first: no build sub-phase starts until this feature's research is synthesized
into a build-ready decision. The synthesized decision is [`../research/research.md`](../research/research.md).

## Deliverable (in ../research/)

- [`../research/research.md`](../research/research.md) — the build-ready synthesized decision (canonical).
- `../research/iterations/iteration-NNN.md` — the 10 independent, cited passes.
- [`../research/deep-research-config.json`](../research/deep-research-config.json) — the run manifest (executors, counts, status).
- [`../research/PROVENANCE.md`](../research/PROVENANCE.md) — how the research was run and which canonical artifacts are intentionally absent.

## Acceptance criteria

- `../research/research.md` exists and states a single build-ready decision.
- `../research/iterations/` holds every planned pass, each headed with its source executor.
- The decision stays within the frozen ink-on-parchment design system and the
  read-only-by-default security posture; any security-crossing implication is flagged
  for the build phases to design security-first.

## Security & Redaction

Read-only research: markdown only, no application-code / protocol / relay change.

## Dependencies & affected areas

None inbound. Outbound: `../research/research.md` is the input to this feature's
`spec.md`, `implementation-phases.md`, and every build sub-phase.
