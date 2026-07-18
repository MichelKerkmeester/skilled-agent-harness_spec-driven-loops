# Motion corpus evidence gate

This maintainer-facing adapter runs the target-owned restraint gate before any
corpus retrieval. A `do-not-move` verdict returns an instant negative baseline
with `queryIssued:false`. A gate-approved request then applies closed,
polarity-aware eligibility before retrieving one purpose/state temporal owner.

Candidates use enum-backed polarity, temporal evidence, purpose, state
archetype, constraint, and evidence label fields. Explicit prohibitions are hard
negatives. Incidental vocabulary and purpose/state mismatches remain valid
`no-corpus-temporal-authority` evidence. Source timing and choreography literals
have no input or output channel, while provenance and rights state travel with
the selected reference.

Run from the repository root:

```bash
node --test .opencode/skills/sk-design/design-motion/corpus/__tests__/*.test.mjs
```
