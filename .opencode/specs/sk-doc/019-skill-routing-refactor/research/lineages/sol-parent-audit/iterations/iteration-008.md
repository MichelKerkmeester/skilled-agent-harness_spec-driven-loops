# Iteration 008 — Lifecycle status-authority reconciliation

## Focus

Compare parent phase-row status with child spec, implementation summary, and graph metadata.

## Findings

1. **P1 — status truth is split across four lifecycle surfaces.** Root rows `015` and `018` say in progress while their child specs and graphs remain planned; `019` is research-complete in parent/spec but graph metadata remains in progress. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:110] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/graph-metadata.json:42] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:113] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/018-system-deep-loop-routing-research/graph-metadata.json:42] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/graph-metadata.json:42]
2. **P1 — nested programs are active in prose but planned in their graph roots.** Parent rows `020` and `021` say active/in progress; both child-parent graphs say planned even though descendants record shipped or ongoing work. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:115] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/graph-metadata.json:41] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/021-documentation-quality-program/graph-metadata.json:45]
3. **P2 — the transition rule implies serial execution despite the live parallel topology.** “Each phase” must pass before “the next phase begins,” but D, E, and F contain concurrent active work. Without workstream qualification, the rule misstates how the packet has actually progressed. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:118] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:110]

## Ruled Out

- Parent narrative labels were not automatically treated as wrong; descendant evidence often makes them fresher than graph status.

## Sources Consulted

- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:94]
- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/graph-metadata.json:41]

## Assessment

- New information ratio: 0.48
- Novelty: consolidated dispersed status conflicts into a resume-impact finding.

## Reflection

No single lifecycle surface is documented as authoritative, so the audit preserves the conflict rather than guessing.

## Recommended Next Focus

Structural continuity and topology visibility for resume.
