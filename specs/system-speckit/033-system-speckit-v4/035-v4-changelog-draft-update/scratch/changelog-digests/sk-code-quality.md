# sk-code-quality changelog digest

Skill path: `.opencode/skills/sk-code/sk-code-quality/` (changelog at `.opencode/skills/sk-code/sk-code-quality/changelog/`). Versions covered: v1.0.0.0 through v1.0.0.2, oldest to newest. Only two entries exist in the changelog directory, so all of them are digested here. Neither entry carries a date in its frontmatter or body, so no date range can be reported.

---

## Per-version digest, newest first

### v1.0.0.2 (`v1.0.0.2.md`)

A documentation-only release that rewrites the mode README from a tabular reference card into a purpose-first narrative on the refined skill README template. The reader now meets the delivered outcome in an opening one-line pitch, gets a problem-first OVERVIEW section and finds the checklist selection logic presented as a named capability in a Checklist Router table rather than buried in a grid. Every fact the old card carried was preserved, command expectations were cleaned up and links were verified. Sections were renumbered to the template's ALL-CAPS H2 model with `---` dividers. The entry states explicitly under a "Not Changed" heading that the mode contract, `SKILL.md`, the checklists and the scripts all keep their behavior, so no behavior change ships. The README frontmatter version field moved from `1.0.0.1` to `1.0.0.2`.

### v1.0.0.1 (no changelog file)

No `v1.0.0.1.md` exists. The version is referenced only in passing by `v1.0.0.0.md`, whose Notes section says the packet "is currently at 1.0.0.1 following a post-establishment metadata sweep with no behavior change". Treat this as an undocumented metadata bump rather than a release with its own entry.

### v1.0.0.0 (`v1.0.0.0.md`)

The first release of the `quality` workflow mode on the `sk-code` hub. RENAME and moved path: the entry records that the mode was born in the parent-hub refactor that collapsed `sk-code` from eight sub-skills into four surface-primary packets, so the author-side quality gate stopped being loose guidance inside a flat skill and became a single mode child with its own folder. The mode runs after the surface skill (`code-webflow` or `code-opencode`) implements changes and before that surface's verification workflow or done-claim. Shipped in this release: `SKILL.md` as the mode contract (when to run the gate, consuming the parent shared surface router, selecting a checklist by detected surface and target path, applying P0/P1/P2 author-side checks, checking comment hygiene per modified file, fixing gate failures in place and the boundary against `code-review`), `README.md`, `assets/code-quality-checklist.md` as the shared gate checklist, a `scripts/` tree carrying the comment-hygiene checker `check-comment-hygiene.sh` with its test, `check-dist-staleness.sh` and the Claude PostToolUse post-edit hook plus router under `hooks/` and `lib/post-edit-router.cjs`, a `manual-testing-playbook/` holding the `quality-gate` routing scenario and a `benchmark/` carrying the `router-mode-a` and `live-mode-b` baselines. The Notes section fixes the mode's boundaries: it consumes parent surface detection, edits only files the surface skill already changed, creates no new files, dispatches no subagents, leaves findings-only output to `code-review` and leaves spec-folder authoring to `system-spec-kit`.

---

## Facts the v4 draft gets wrong or misses

- **The draft's premise about what `sk-code` was before v4 conflicts with the changelog.** Draft line 300 says "For as long as it existed, `sk-code` was a single flat skill with everything in one place". `v1.0.0.0.md` describes the same refactor as one that "collapsed sk-code from eight sub-skills to four surface-primary packets", which means the starting point was eight sub-skills, not one flat skill. One of the two is wrong about the pre-v4 shape, and the changelog is the closer source.

- **The draft names `sk-code-quality` but never says what it does.** Draft line 306 lists it as one of two "workflow modes that act" and the section says nothing further about it. Nothing in the draft tells a reader that the mode is a post-implementation gate that runs between implementation and verification, applies P0/P1/P2 author-side checks, runs comment hygiene per modified file or selects a checklist by detected surface and target path, all of which `v1.0.0.0.md` states as the mode contract. `sk-code-review` gets a whole subsection at draft line 315 while its sibling workflow mode gets a bullet.

- **The draft misses the mode's tool and blast-radius boundary.** `v1.0.0.0.md` Notes says the mode edits only files the surface skill already changed, creates no new files and dispatches no subagents. That is the kind of guarantee a release note usually states, and the draft carries none of it.

- **The draft misses the shipped tooling.** `v1.0.0.0.md` lists `check-comment-hygiene.sh`, `check-dist-staleness.sh` and a Claude PostToolUse post-edit hook with its router. The draft mentions none of these by name.

- **The draft's hygiene-gate sentence may conflate two different gates.** Draft line 309 says "Every relocated file was repointed, including a pre-commit hygiene gate that had been silently skipped". The hygiene tooling `v1.0.0.0.md` documents for this mode is a PostToolUse post-edit hook, not a pre-commit gate. The two may be separate things, but the draft's wording invites a reader to map its "hygiene gate" onto this mode's hygiene checker, and that mapping would be wrong.

- **The v1.0.0.2 README rewrite is absent from the draft.** `v1.0.0.2.md` is documentation-only and explicitly ships no behavior change, so its absence is defensible. It is listed here for completeness, not as a gap the draft must close.

---

## Current version and identity

- Version in `sk-code-quality/SKILL.md` frontmatter: `1.0.0.1`.
- Note the drift: `sk-code-quality/README.md` frontmatter reads `1.0.0.2` and the newest changelog entry is `v1.0.0.2.md`, so `SKILL.md` is one patch behind both. `v1.0.0.2.md` describes its own version bump as a README frontmatter change, which explains but does not resolve the mismatch.
- Identity: a MODE, not a hub and not standalone. `sk-code-quality/` holds no `mode-registry.json`. Its parent `.opencode/skills/sk-code/` holds `mode-registry.json`, `hub-router.json`, `description.json` and `graph-metadata.json`, which is the parent-hub metadata set. The parent registry lists `sk-code-quality` at line 24 with `"packetKind": "workflow"`, `"backendKind": "surface-router"`, `"mutatesWorkspace": true`, `Write` and `Task` forbidden, and `"advisorRouting": {"routingClass": "metadata"}`, meaning the mode has no advisor entry of its own and is reached only through the hub identity `sk-code`.
