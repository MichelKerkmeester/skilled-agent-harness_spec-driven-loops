---
title: "Implementation Summary: Entry-point resolution through a link"
description: "What shipped: the entry-point comparison now canonicalizes both sides, in three copies the build boundaries force apart, with the hand-rolled spellings migrated onto them and both directions covered."
trigger_phrases:
  - "entry point summary"
importance_tier: "supporting"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
# Implementation Summary: Entry-point resolution through a link

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | In Progress |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The comparison now canonicalizes both sides before comparing them, so a module reached through a
link is recognized as the file it is. Resolution failure falls back to the unresolved comparison
rather than raising, because the callers include hooks where a thrown error is worse than a
conservative answer.

It exists in three copies, and the number is forced rather than chosen. The two TypeScript
projects exclude one another's trees, so a shared file cannot be imported across the line: the
composite build refuses it with a listing error, and the first attempt to fix that by adding the
file to the other project's include did nothing, because its exclude already named the whole tree
and exclude wins. The scripts that run before anything is built can import neither. A test asserts
all three answer identically, which is what keeps the duplication honest.

Twenty-one modules that hand-rolled the comparison now call one of them. One guard was left alone:
it matches on a filename rather than comparing paths, so a link cannot displace it.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:verification -->
## 3. VERIFICATION

| Check | Result |
|-------|--------|
| Entry-point cases, in-process and through a spawned child | 7 passed |
| Negative control, both helpers reverted | the two symlink cases fail, the other five pass either way |
| Trigger-index lookup through a symlinked parent | 5757 bytes and byte-identical, against 0 bytes and exit 0 before |
| The generator whose silence started this, through a linked build | writes its output, where it previously wrote nothing and exited 0 |
| Runtime build, CLI build, both typechecks | pass |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 4. KNOWN LIMITATIONS

1. **The logic lives in three places** Each is on the far side of a boundary the code cannot cross,
   and a test asserts they agree, but a fourth consumer arriving in a fourth position would need a
   fourth copy rather than an import.
2. **One script keeps a private copy** It sits in a package below both helpers, so importing either
   would point a lower layer at one that depends on it. It carries the same logic locally and says
   why.
3. **Compiled files sitting beside their own sources are a trap, and only one was stale** Four such
   files are tracked under the CLI workspace. One shadowed the source in the test runner until it
   was refreshed, which is what cost time here. Of the other three, two are deliberate and
   documented as plain-Node copies for runners that cannot load TypeScript, and their export
   surfaces still match their sources exactly; one was orphaned, referenced by nothing and never
   collected by the test globs, and was removed. Its source test still passes, 52 cases.
4. **Nothing guards against the next one going stale** The alignment eval checks that every file in
   a build directory traces back to a source, which is a different question. A tracked copy sitting
   beside its own source is outside what it looks at, so the drift that started this would not be
   caught today either. Closing that is a separate change.
5. **The delegated migration was verified by a command that could not see the failure** The brief
   named the typecheck, which runs with composite mode off and therefore cannot report the
   cross-project listing error. The build caught it afterwards. The brief was wrong, not the work.
<!-- /ANCHOR:limitations -->
