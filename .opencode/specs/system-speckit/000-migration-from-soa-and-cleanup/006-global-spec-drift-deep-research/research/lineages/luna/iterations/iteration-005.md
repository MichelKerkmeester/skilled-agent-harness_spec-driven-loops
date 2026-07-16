# Iteration 5: Bounded prevalence and evidence-surface scan

## Focus
Measure the available metadata and evidence surface, while separating packet files from scratch/fixture noise.

## Findings
1. The current corpus has 3,015 `spec.md`, 2,294 `implementation-summary.md`, 1,798 `checklist.md`, 3,033 `graph-metadata.json`, 3,061 `description.json`, and 163 canonical `research/research.md` files. These counts are directional because the corpus includes fixtures, backups, and archives. [SOURCE: bounded `find .opencode/specs ...` scan]
2. A naive “missing graph metadata” scan produces backup and fixture paths, demonstrating that prevalence measurement must classify packet roots before treating missing artifacts as drift. [SOURCE: bounded scan output under `system-speckit/027...` and `system-deep-loop/066...`]
3. Drift work is not isolated to one packet: explicit drift/freshness artifacts appear in `system-speckit/027`, `system-speckit/029`, `system-deep-loop/031`, `system-skill-advisor`, `sk-code`, and archived recursive-loop work. [SOURCE: bounded `find .opencode/specs -type f` filename scan]
4. The evidence surface is skewed toward authored specs and summaries; only a small subset has canonical synthesized research output. That makes a global cleanup plan dependent on packet classification and evidence-quality gates, not file-count parity alone. [INFERENCE: based on the bounded counts and prior validator evidence in iteration 4]

## Ruled Out
Using raw file-count deltas as a defect count is ruled out because archives, backups, and benchmark fixtures are mixed into `.opencode/specs`.

## Dead Ends
The initial missing-metadata sample was contaminated by `.backup-*`, `scratch`, and `fixtures`; it is not a valid packet-level prevalence estimate.

## Edge Cases
- Ambiguous input: “all specs” was interpreted as the repository corpus, with packet-root caveat.
- Contradictory evidence: none; scan limitations are classification limits.
- Missing dependencies: no code graph index; filesystem counts only.
- Partial success: scale and contamination risks measured; clean denominator remains open.

## Sources Consulted
- Bounded `find` counts over `.opencode/specs`
- Bounded filename scan for drift/freshness/context artifacts
- `.opencode/specs/system-speckit/029-memory-search-intelligence/003-spec-data-quality/009-validation-hardening-fixes/implementation-summary.md:84-116`

## Assessment
- New information ratio: 0.43
- Questions addressed: evidence gaps before cleanup; systemic breadth of drift work
- Questions answered: corpus classification is a prerequisite; prevalence remains unquantified

## Reflection
- What worked and why: counts plus filename sampling exposed scale and contamination.
- What did not work and why: directory-wide metadata parity overcounts scratch and backup material.
- What I would do differently: use canonical packet metadata/manifest classification for a trustworthy denominator.

## Recommended Next Focus
Trace how active packet status and canonical metadata are derived, then identify which generated files are authoritative versus derived.
