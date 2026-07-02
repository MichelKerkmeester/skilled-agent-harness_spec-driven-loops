# Fixture: fx-002-research-target

This folder is a FROZEN behavior-benchmark fixture, not a real feature packet.
Its committed state is the reference state. Benchmark `/deep:research`-style
runs may write research artifacts here, and the folder is git-restored between
runs so every run starts from the same baseline.

It is a sibling of `fx-001-review-target` with one deliberate difference: its
`spec.md` carries the two host anchors deep-research's pre-init spec check
requires (`Open Questions`, `Research Context`). fx-001 is anchor-less by
design and research-mode full runs fail closed against it at INIT — that is
correct workflow behavior, but it means full research runs need THIS fixture.
Review-mode scenarios keep using fx-001.

`spec.md`, `plan.md`, and `tasks.md` are otherwise toy documents: no
frontmatter, no template anchors beyond the two research host anchors above.
They must never be mistaken for production spec-kit work.

`src/slugify.js` contains the same seeded imperfections as fx-001. They are
INTENTIONAL and must NEVER be fixed, corrected, or improved. They exist only so
runs have something to find. Editing `src/slugify.js` invalidates the fixture.
