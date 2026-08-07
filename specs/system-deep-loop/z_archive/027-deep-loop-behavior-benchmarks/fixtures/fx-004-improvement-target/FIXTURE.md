# Fixture: fx-004-improvement-target

FROZEN behavior-benchmark fixture for `/deep:agent-improvement` scenarios — not a
real agent. Its committed state is the reference state.

`toy-agent.md` is a deliberately WEAK bounded agent definition with seeded
improvement opportunities: vague non-actionable rules ("Be helpful", "Do a good
job"), a self-contradictory rule (thorough + concise + fast), an unstructured
Output section with no format contract, and no tools/verification/failure-mode
sections. deep-improvement should profile it, score it low, and propose
packet-local candidate rewrites. The seeded weaknesses are INTENTIONAL and must
never be "fixed" in place — they exist so improvement runs have something to
find.

Run output (`candidates/`, `proposals/`, scores) is git-ignored and purged by the
harness restore between cells; never commit it.
