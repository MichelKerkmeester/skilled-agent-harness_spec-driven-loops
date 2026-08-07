# Fixture: fx-001-review-target

This folder is a FROZEN behavior-benchmark fixture, not a real feature packet.
Its committed state is the reference state. Benchmark `/deep:review`-style runs
may write review artifacts here, and the folder is `git restore`d between runs
so every run starts from the same baseline.

`spec.md`, `plan.md`, and `tasks.md` are toy documents: no frontmatter, no
template anchors. They must never be mistaken for production spec-kit work.

`src/slugify.js` contains seeded imperfections. They are INTENTIONAL and must
NEVER be fixed, corrected, or improved. They exist only so review runs have
something to find. Editing `src/slugify.js` invalidates the fixture.
