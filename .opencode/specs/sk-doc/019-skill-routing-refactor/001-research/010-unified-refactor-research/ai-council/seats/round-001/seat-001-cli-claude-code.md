---
round: 1
seat: seat-001
executor: cli-claude-code
lens: "Minimalist / degenerate-case purist"
status: ok
timestamp: 2026-07-18T00:00:00.000Z
simulated: true
---

# seat-001: Minimalist / degenerate-case purist / cli-claude-code (simulated)

## Mandate
Optimize for the degenerate N=1 case. The design is over-built unless `mcp-code-mode` (no modes) is the exact same contract with zero special-casing and near-zero hot-path overhead. Hunt for fields, branches, and machinery that exist only to serve multi-mode hubs and would leak into the singular case.

## Confidence
84 / 100 — high in the reduction proof; lower where I am tempted to cut machinery the hardliner shows is load-bearing.

## Seat Output

### Proposed plan
One schema, and the singular skill is what you get when its collections are empty. Do not model N=1 as a variant, an interface, or a subtype — model it as **partial evaluation of the same `CompiledPolicyV1`**. `candidateCount=1` makes `orderedBundle`/`surfaceBundle` unreachable, so bundle planning constant-folds; `crossTargetEdges=[]` and `handoffEdges=[]` fold the ranking and handoff subgraphs; `(T,R,P)` trivializes to exact-admission / clarify-then-defer / static-provenance. The evaluator walks empty arrays — that is free — so nothing needs an `if skillId == mcp-code-mode`.

The decision algebra must be as small as it can be while still forbidding the dangerous states. Four actions: `route | clarify | defer | reject`. Put `selectionKind` inside `route`. Reject the flat six-value enum — it is not smaller, it is *looser* (it lets a `route` whose reason is `no-match` be typed). Minimalism means the *unrepresentable-bad-state* count is maximized per field, not the field count minimized blindly.

### Reasoning
Every one of the four lineages independently landed the same reduction, which is the strongest possible signal that it is the natural shape and not an accident. The elegance test I apply: can a senior engineer read the singular compile output and see *no singular-specific concept*? Yes — they see one destination, empty edge sets, and the same PREPARE/VERIFY/COMMIT. That is the tell that the fusion is real. If the design needed a `SingularRouter`, a `singularSkillRoute` action, or a synthetic one-item registry, it would be a fake fusion; all three are explicitly eliminated.

### Risks and trade-offs
My instinct is to also delete the leaf-manifest and the route guard at N=1 to hit "near-zero overhead" literally. That is wrong: the manifest is a *correctness* cost (fail-closed on unmapped leaves, drift detection), ~414 bytes, not hot-path overhead, and the single target must still be able to `defer(no-match)` on zero signal — default-to-self is an eliminated alternative that swallows real exclusions. I concede these are retained.

### Assumptions and evidence gaps
- Assumes canonical serialization exists so empty collections hash stably (open question 4).
- Assumes the alias array can be compiled out of the hot card post-dual-read (SOL-B measured it; unverified in a live build).

### Alternative challenged
Rejected the flat six-outcome enum (Idea 6's TL;DR shape). Failure mode it prevents: an authority-bearing "route" that actually means "no destination," which is exactly the `defaultMode` conflation the whole packet exists to kill.
