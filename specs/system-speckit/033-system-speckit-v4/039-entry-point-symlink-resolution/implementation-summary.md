---
title: "Implementation Summary: Entry-point resolution through a link"
description: "What shipped: the entry-point comparison now canonicalizes both sides, in three copies the build boundaries force apart, with the hand-rolled spellings migrated onto them and both directions covered."
trigger_phrases:
  - "entry point summary"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/039-entry-point-symlink-resolution"
    last_updated_at: "2026-09-12T21:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Canonicalized the entry-point comparison and migrated its copies"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/cli/lib/esm-entry.ts"
      - ".opencode/skills/system-spec-kit/runtime/lib/esm-entry.ts"
      - ".opencode/skills/system-spec-kit/runtime/cli/lib/esm-entry.mjs"
      - ".opencode/skills/system-spec-kit/runtime/tests/esm-entry-symlink.vitest.ts"
    session_dedup:
      fingerprint: "sha256:35941d0cd968c7e1f697cdb9a6b66c517cda16b19e879d097aec58f4c01c37ae"
      session_id: "2026-09-12-entry-point-symlink-resolution"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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

Twenty-one modules that hand-rolled the comparison now call one of them. One guard was left alone,
`runtime/cli/spec/is-phase-parent.ts:196`: it matches on a filename rather than comparing paths, so
a link cannot displace it.

The three copies are `runtime/cli/lib/esm-entry.ts:26`, `runtime/lib/esm-entry.ts:29` and
`runtime/cli/lib/esm-entry.mjs:29`. Coverage is `runtime/tests/esm-entry-symlink.vitest.ts`, and the
corrected parity case is `runtime/tests/directive-lifecycle-adapter-parity.vitest.ts:128`.
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
3. **Compiled files beside their own sources are gone, except two that are declared** Four were
   tracked under the CLI workspace. One shadowed the source in the test runner until it was
   refreshed, which is what cost time here, and it turned out to be a leftover of an older build
   layout that nothing needed: removing it leaves the tests, both typechecks and both builds
   passing. One was orphaned, referenced by nothing and never collected by the test globs, and was
   removed; its source test still passes, 52 cases. The remaining two are deliberate plain-Node
   copies for runners that cannot load TypeScript, documented beside the fixtures, and their export
   surfaces match their sources exactly.
4. **The next one is now caught rather than discovered** The alignment eval checked only that
   files in a build directory trace back to a source, which is a different question. It now also
   refuses a compiled file sitting beside the source it came from, because that file wins
   resolution for anything not going through the compiler. The two deliberate copies are declared
   with their reason; anything else fails the check. Planting one makes it fail, and removing it
   makes it pass.
5. **One existing test had recorded the defect as the contract** Three hook adapters are mirrored
   into their runtime's own hooks directory as symlinks. Run through those mirrors they produced
   nothing and exited 0, and a parity case asserted exactly that, while asserting the fourth
   adapter answers. The asymmetry had no stated reason: the fourth carries no entry check at all,
   which is why it always answered. Production was never affected, because the registered commands
   invoke the build output by its real path. The case now expects all four to answer, and reverting
   the fix fails it for exactly the three, so it tracks the behaviour rather than restating it.
6. **The delegated migration was verified by a command that could not see the failure** The brief
   named the typecheck, which runs with composite mode off and therefore cannot report the
   cross-project listing error. The build caught it afterwards. The brief was wrong, not the work.
<!-- /ANCHOR:limitations -->
