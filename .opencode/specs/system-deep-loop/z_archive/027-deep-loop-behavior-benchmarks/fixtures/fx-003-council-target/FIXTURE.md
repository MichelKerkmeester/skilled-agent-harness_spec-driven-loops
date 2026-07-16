# Fixture: fx-003-council-target

FROZEN behavior-benchmark fixture for `/deep:ai-council` scenarios — not a real
feature packet. Its committed state is the reference state.

`spec.md` poses a genuine, multi-option design question (rate-limit strategy)
with real trade-offs, so a council has something to deliberate: distinct seats
should favor different options and converge on a recommendation. The council
persists its output under `ai-council/` (seats, council-report, state); that
directory is run output, git-ignored, and purged by the harness restore between
cells. It must never be committed.

`src/slugify.js` is a toy the council can reference; do not "fix" it.
