# Iteration 003 - Traceability

Focus: resource map and packet cross-reference coverage.

Files reviewed:

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md`

## Findings

### P1-003: Parent resource-map is stale and excludes newer active child phases

The parent `resource-map.md` says it has 27 references and is focused on renumbered metadata plus peck-derived work [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:30]. Its spec rows list the parent and peck child paths only [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:72]. The parent spec now includes broader children, including `000-release-cleanup`, `010-mcp-to-cli-tool-transition`, and other phases [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:127], while graph metadata also includes `011-command-presentation-workflow-separation` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:17].

Impact: because `resource-map.md` is present, deep-review treats it as a first-class coverage input. A stale map can make coverage look narrower than the actual packet.

Recommendation: regenerate or manually update the parent resource map so all current children are represented, with any intentionally excluded entries marked `expected-by-scope`.

### P2-002: context-index still says peck T1 remains deferred after phase 001 adopted the AC coverage gate

The context index says peck placement covers T3/T4/T2 and that T1 remains deferred [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:27]. The current peck phase-parent lists `007-acceptance-coverage-gate` as a spec-scaffolded child [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/spec.md:120], and its open-questions section says T1 coverage is now adoptable as phase 007 [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/spec.md:146].

Impact: wayfinding prose contradicts the current child phase map.

Recommendation: update the migration bridge text to distinguish historical deferral from current adoption.

## Verdict Rationale

This iteration found an active P1 finding, so the canonical iteration verdict is conditional.

Review verdict: CONDITIONAL
