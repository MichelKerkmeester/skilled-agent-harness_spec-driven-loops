# Iteration 005 - Target Resource Map Accuracy

## Focus

The 027 packet's own `resource-map.md`, reviewed as a target file.

## Finding

### F004 - P2 - 027 resource map overstates renumbered metadata readiness

The 027 resource map reports `Missing on disk: 0` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:32] and says the parent control doc, description, graph metadata, and peck child metadata are updated and OK [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:72] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:78].

That is too strong. The peck child `description.json` still reports `"specId": "008"` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json:33], and F002 records additional stale phase labels in other child metadata. The map is therefore useful as a path ledger but not reliable as readiness evidence.

Impact: future operators may trust the map as proof that renumbered metadata is clean. Fix by refreshing the resource map after metadata regeneration, and have it record stale metadata checks explicitly rather than only disk existence.

## Verdict Rationale

Only a P2 advisory was found in this iteration. No P0 or P1 findings were introduced.

Review verdict: PASS
