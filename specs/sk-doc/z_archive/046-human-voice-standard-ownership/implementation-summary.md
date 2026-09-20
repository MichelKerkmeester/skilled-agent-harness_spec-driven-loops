---
title: "Implementation Summary: Human Voice Rules standard ownership and packet template conformance"
description: "The Human Voice Rules moved into the packet that parses them, roughly thirty live consumers were repointed, and the packet's references and assets were brought onto the skill templates."
trigger_phrases:
  - "hvr standard moved into packet"
  - "hvr-rules relocation summary"
  - "hvr scanner path change"
  - "sk-doc shared tier reduction"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/046-human-voice-standard-ownership"
    last_updated_at: "2026-09-01T04:40:00Z"
    last_updated_by: "claude"
    recent_action: "Moved the standard into its packet and repointed every live consumer"
    next_safe_action: "Review the uncommitted diff and commit the paths this packet owns"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md"
      - ".opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py"
      - ".opencode/skills/sk-doc/ROUTER.md"
      - ".opencode/skills/sk-doc/leaf-aliases.json"
      - ".opencode/skills/sk-doc/leaf-manifest.json"
      - ".opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "046-human-voice-standard-ownership"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Did the 641-file reference count block the move? No. 614 were frozen spec documents, leaving roughly ten live consumers."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 046-human-voice-standard-ownership |
| **Completed** | 2026-09-01 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Human Voice Rules now live inside the packet that applies them. The file moved out of
the `sk-doc` shared tier, whose own README states the entry rule this move follows: a
resource earns a place there by having consumers in two or more packets, and a resource
with exactly one consumer belongs inside that packet. Alongside the move, the packet's two
references and its report asset were brought onto the shapes `sk-create-skill` publishes.

### The move and what it touched

The interesting part was never the move. It was the inventory. The standard is read at run
time by a Python scanner that resolves it by walking up from its own file, addressed by a
hub router contract that fails when a declared path does not resolve on disk, projected
into a generated manifest through a declared alias, and named by ten spec-kit templates
whose rendered output a golden snapshot records byte for byte. Miss any one of those and
the failure is either loud in a place nobody looks or silent in a place that matters.

An earlier stream was told not to move the file on a headline count of 641 referencing
files. Measured, 614 of those are frozen spec documents that keep their historical path,
exactly as every other rename this session has left them. That left 64 files outside
`specs/`, of which six are frozen benchmark reports and one released changelog entry. The
live consumer set was 57 files.

### Template conformance

Both references opened on a content section rather than `## 1. OVERVIEW`, and all four
authored documents carried `contextType: reference`, a value the frontmatter contract does
not define. The contract's enum is `planning`, `research`, `implementation` or `general`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-doc/shared/references/hvr-rules.md` | Deleted | Moved. Checksum `7bd3eca2` matched before and after |
| `sk-doc/sk-create-with-human-voice/references/hvr-rules.md` | Created | The standard, in the packet that parses it |
| `sk-create-with-human-voice/scripts/hvr_scan.py` | Modified | `DEFAULT_RULES_PATH` walks `parents[1]` rather than `parents[2]` |
| `sk-create-with-human-voice/SKILL.md` | Modified | Ownership prose, the never-copy rule, the reference section, version `1.1.0.0` |
| `sk-create-with-human-voice/README.md` | Modified | At-a-glance rows, the FAQ answer that argued against the move, related-resource row |
| `sk-create-with-human-voice/references/README.md` | Modified | The standard listed as a routed leaf, prose rewritten, `contextType` |
| `sk-create-with-human-voice/references/scope-and-exemptions.md` | Modified | New `## 1. OVERVIEW`, sections renumbered, `contextType` |
| `sk-create-with-human-voice/references/scoring-and-verification.md` | Modified | Same, plus two section cross-references |
| `sk-create-with-human-voice/assets/voice-report-template.md` | Modified | New `## 1. OVERVIEW` with Purpose and Usage, sections renumbered |
| `sk-create-with-human-voice/scripts/README.md` | Modified | Scanner row path |
| `sk-create-with-human-voice/changelog/v1.1.0.0.md` | Created | Records the reversal. `v1.0.0.0` left untouched |
| `sk-doc/ROUTER.md` | Modified | The `HVR` and `FULL_INVENTORY` resource rows |
| `sk-doc/leaf-aliases.json` | Modified | The `sk-create-quality-control` alias `diskPath` |
| `sk-doc/leaf-manifest.json` | Regenerated | Generated. Byte-drift check green |
| `sk-doc/README.md` | Modified | Related-documents row |
| `sk-doc/shared/README.md` | Modified | The references list, the alias count, and where the standard went |
| `sk-doc/shared/references/evergreen-packet-id-rule.md` | Modified | Sibling link out of the vacated directory |
| `sk-doc/shared/assets/changelog-template.md` | Modified | Two references |
| `sk-doc/manual-testing-playbook/` (3 scenarios) | Modified | Resource path, plus SD-004 and SD-013 re-credited to the owning mode |
| `sk-doc/sk-create-quality-control/` (3 files) | Modified | Consumer links |
| `sk-doc/sk-create-readme/` (7 files) | Modified | Consumer links in SKILL, references and both templates |
| `sk-doc/sk-create-skill/assets/` (2 templates) | Modified | The skill and parent-hub README templates |
| `sk-communication/SKILL.md`, `references/visual-explanation.md` | Modified | Three consumer links |
| `.opencode/commands/create/` (3 files) | Modified | Command doc and both workflow YAML files |
| `.opencode/commands/rewrite/` (2 files) | Modified | Both projection command docs |
| `repo-rules/communication.md` | Modified | The rule-set link |
| `system-spec-kit/templates/` (10 files) | Modified | The `HVR_REFERENCE` line seven templates and three examples emit |
| `system-spec-kit/scripts/test-fixtures/` (6 files) | Modified | Fixture copies of that line |
| `system-spec-kit/scripts/tests/fixtures/phase-creation/` (1 file) | Modified | Same |
| `system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Modified | Eight recorded occurrences |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines first. All four hub gates were captured green before the first edit, along with
the scanner's fixture exits and the full reference inventory.

Then the move, then the repointing in two passes. The repo-root-absolute form is one
substring and was handled in a single scripted pass across 27 files. The relative forms are
not: `./`, `../`, `../../` and `../../../` each resolve differently depending on where the
referencing file sits, so those 24 files were handled with an explicit per-file replacement
whose expected occurrence count was asserted. A blanket substitution would have produced
links that look right and resolve nowhere.

Two negative controls carried the verification. Before regenerating the golden snapshot,
the snapshot test was run against the edited templates and failed on five snapshots, which
proved the gate actually sees this class of change rather than passing vacuously. And the
scanner was run against a standard whose section 6 heading had been renamed, which exits 2
rather than reporting a clean scan from a file it could not parse.

The snapshot was then fixed by substituting the one changed line rather than by rerunning
with `-u`. The failing run had reported three snapshots as obsolete, and `-u` would have
deleted them as a side effect of a change that has nothing to do with them.

The spec-kit scripts test lane needed a real baseline, and the pre-change one had already
been lost to editing. It was reconstructed by inverting the substitution across the four
affected directories, running the lane, and restoring in the same invocation, with a
directory-tree checksum confirming the restore was byte-exact.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Repoint per relative depth rather than one blanket substitution | Five distinct path forms reference the same file. A single swap would have produced links that read correctly and resolve nowhere |
| Substitute the golden snapshot rather than `vitest -u` | The failing run listed three obsolete snapshots. `-u` prunes those, which would fold an unrelated deletion into this diff |
| Re-credit SD-004 and SD-013 to `sk-create-with-human-voice` | Those scenarios assert the typed pair the HVR intent produces for the standard. After the move that pair is the packet's own leaf, not the quality-control alias, so leaving the old mode would have made the gold assert something the router no longer does |
| Leave the `max-load` scenario crediting the quality-control alias | That alias is still a real declared pair, and the scenario's mode set is separately stale in ways this packet did not create |
| Leave `hvr-rules.md` at version `1.8.0.13` | The version tool derives `1.1.0.0` from the new packet anchor with a build count of zero. The zero is an artifact of an uncommitted move that git cannot yet follow as a rename, and a document dropping seven minor versions would misreport its history |
| Leave the released `v1.0.0.0` changelog entry stating the standard would not move | The packet's own rules forbid editing a released changelog entry. A changelog records what was decided at the time, and `v1.1.0.0` records the reversal |
| Leave the 614 frozen spec documents | They record what was true when written, which is the same treatment every other rename this session received |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `package_skill.py sk-create-with-human-voice --check --strict` | PASS. `Result: PASS`, strict mode |
| `parent-skill-check.cjs .opencode/skills/sk-doc` | PASS. 14 modes, 0 warnings, including 10b byte drift and 12a router contract |
| `ci-skill-root-metadata.cjs` | PASS. `checked=14 passed=14 failed=0` |
| `validate-playbook-topology.cjs .opencode/skills/sk-doc` | PASS. `verdict=PASS valid=32 blocked=0 unenrolled=0` |
| `generate-leaf-manifest.cjs --check` | PASS. `587892b9` matches a fresh regeneration |
| Scanner, clean fixture | PASS. `no mechanical findings`, exit 0 |
| Scanner, dirty fixture | PASS. exit 1 |
| Scanner, renamed section 6 (negative control) | PASS. `parsed too thin`, exit 2 |
| Golden snapshot before the fix (negative control) | 5 snapshots failed, which is the gate proving it sees the change |
| Golden snapshot after the fix | PASS. 9 passed, 0 obsolete |
| Spec-kit scripts test lane, baseline (inverted state) | 29 failed files, 51 failed tests, 1230 passed, 5 skipped, of 146 files |
| Spec-kit scripts test lane, final state | Identical: 29 failed files, 51 failed tests, 1230 passed, 5 skipped. Failing file sets diff clean |
| HVR scan over every authored file | 0 hard blockers after fixing four semicolons. One template-pinned semicolon in `plan.md` boilerplate is a recorded exemption |
| Old path outside `specs/` | 6 files, all frozen: 5 compiled-routing benchmark reports and the `v1.0.0.0` changelog entry |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The spec-kit scripts test lane has 29 pre-existing failing files.** They are unrelated
   to this change, span git-dependent manifests, council parity, coverage graphs, session
   isolation and import policy, and no failure message mentions the standard. The
   inverted-state baseline produced the identical failing set, which is the evidence rather
   than the assertion.
2. **The mcp-server test lane was not run to completion.** It is 694 files and ran for over
   forty minutes without finishing. Nothing in this change touches its surface: the edits
   under `system-spec-kit` are confined to `templates/`, `scripts/test-fixtures/`,
   `scripts/tests/fixtures/` and one snapshot, and the lane that reads all four was run to
   completion in both states.
3. **`contextType: reference` survives in eleven sibling files across `sk-doc`.** The value
   is not in the contract's enum. Fixing it is a fleet sweep, and this packet fixed only
   the four files it owns.
4. **The `max-load` routing scenario's declared mode set is stale.** It omits
   `sk-create-repo-rule` and `sk-create-with-human-voice` even though `FULL_INVENTORY`
   loads both. Pre-existing, and the topology gate passes because it checks that asserted
   pairs are a subset rather than that the set is complete.
5. **The spec-kit `plan.md` template carries a semicolon**, which the Human Voice Rules
   treat as a hard blocker. It sits at `templates/core/plan.md.tmpl` line 122 and reaches
   every scaffolded `plan.md` in the repository, including this packet's. Fixing it means
   editing a shared template and regenerating the golden snapshot for a reason unrelated to
   this packet, so it is recorded rather than fixed. Suggested replacement: `Follow the
   ordered tasks in tasks.md, which owns the Setup, Implementation, and Verification phase
   checkboxes and task state.`
6. **380 `specs/**/description.json` files were rewritten by something outside this
   packet.** All 380 writes land in a six-second burst at 05:41:07 to 05:41:12, before this
   packet's first write at 05:42 and before any content edit at 05:57. A
   `system-spec-memory-launcher.cjs` daemon has been running since well before this session
   started, and a repo-wide description refresh is the shape of what it does. That
   attribution is inferred, not confirmed: the daemon's own log would settle it. The files
   were left alone rather than reverted, because reverting them needs a `git restore` the
   run's rules forbid and because a regeneration may well be correct.
7. **Nothing is committed.** The working tree carries every change described here.
<!-- /ANCHOR:limitations -->

---
