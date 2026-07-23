# Iteration 009 — Structural continuity and resume topology

## Focus

Test whether a resuming operator can distinguish nested phase parents, the duplicate `012`, and the two `015` identities.

## Findings

1. **P1 — the parent bridge omits both high-risk nested topology facts.** `context-index.md` accurately describes direct groups and says Group E has seven children, but it does not mention that `020/007` contains two `012` siblings or that its child `015` is itself a phase parent. Those are precisely the facts most likely to produce a wrong path selection. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:42] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/spec.md:50]
2. **P1 — the unqualified phrase “015 being a phase-parent” is ambiguous at root.** Root `015-sk-code-router-alignment` has no children; nested `020/007/015-routing-coverage-activation-verification` has fourteen. Parent docs never disambiguate the two identities for resume. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/graph-metadata.json:6] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/graph-metadata.json:6]
3. **P2 — the direct map is accurate but insufficient as a resume map.** It deliberately flattens A–F exposition and delegates E/F resume to nested parents, while root metadata has no active-child pointer. A reader must manually rediscover the nested active lineage. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:92] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:122] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:123]

## Ruled Out

- No direct child is omitted or mis-grouped.
- Group E’s seven-child and Group F’s eleven-child counts are correct. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:53]

## Sources Consulted

- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:42]
- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/spec.md:50]

## Assessment

- New information ratio: 0.42
- Novelty: topology facts were known individually; the new result is their omission from the parent continuity bridge.

## Reflection

The parent is correct as a direct map but incomplete as a resume map.

## Recommended Next Focus

Adversarial residual verification and deduplication.
