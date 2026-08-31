---
title: "Implementation Summary: sk-create-with-human-voice"
description: "The Human Voice Rules now have something that runs them. A new sk-doc mode carries the scope gate, the scanner, the judgment pass and the re-scan, while the standard itself stays exactly where hundreds of files already point."
trigger_phrases:
  - "implementation"
  - "summary"
  - "human voice mode"
  - "hvr scanner"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/039-create-with-human-voice"
    last_updated_at: "2026-08-31T22:20:00Z"
    last_updated_by: "stream-1"
    recent_action: "Shipped the packet, wired ten section 7 surfaces, ran all three gates green"
    next_safe_action: "Hand the recorded cross-owner proposals to streams 2, 4 and 5"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-with-human-voice/SKILL.md"
      - ".opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py"
      - ".opencode/skills/sk-doc/mode-registry.json"
      - ".opencode/skills/sk-doc/ROUTER.md"
      - ".opencode/commands/create/with-human-voice.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "stream-1-039-create-with-human-voice"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should hvr-rules.md move into the new packet? No, and the packet says why."
      - "Should the mode carry a slash command? Yes."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 039-create-with-human-voice |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Human Voice Rules have sat in `sk-doc/shared/references/` for a long time with hundreds
of files pointing at them, and nothing ran them. `sk-doc` now has a thirteenth workflow
packet that does. You get a scope gate that decides what a voice edit may touch, a scanner
that reads the standard at run time instead of carrying a copy of it, an explicit judgment
pass for everything a scanner cannot settle, and a re-scan that proves the rewrite landed.

### The scope gate

This is the part the standard never had, and the part that stops a voice pass doing damage.
Before any finding is read, the gate classifies the target: text you are carrying rather
than writing is out, text something else pins is out, and text that is about the banned
words is out. That last class is the one that makes an automated voice pass look broken.
`hvr-rules.md` lists every blocked term, so scoring it against itself reports dozens of
hard blockers in a document that is entirely correct.

### The scanner

`hvr_scan.py` parses four families out of the standard on every run: the punctuation rows
that forbid a mark, the hard blocker words, the phrase blockers and the soft deductions.
The packet holds no term list, so editing the standard changes the scan with nothing else
to update.

It keys on section titles rather than section numbers, so renumbering the standard is
survived and a rename is not, which is the asymmetry you want: a rename empties a list, and
an empty list would otherwise report a clean document. Declared floors catch that and stop
the run with exit 2.

It masks frontmatter, fenced blocks and inline code spans before it looks, replacing them
with spaces so every reported line and column still matches the source file.

It over-reports on purpose. Scanning `sk-create-repo-rule/README.md`, a document written to
this standard and reviewed before it shipped, finds two hard blockers, both the noun
`harness` meaning the AI runtime. That is the literal sense the standard permits, so the
right outcome is two recorded exemptions and no edit. A scanner that guessed at word sense
would start hiding real findings instead.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-doc/sk-create-with-human-voice/SKILL.md` | Created | The apply and score orderings, the always and never rules, the router |
| `sk-doc/sk-create-with-human-voice/README.md` | Created | What the mode does, why it over-reports, four verification controls |
| `sk-doc/sk-create-with-human-voice/references/README.md` | Created | Reference router |
| `sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md` | Created | What the standard governs and what it never touches |
| `sk-doc/sk-create-with-human-voice/references/scoring-and-verification.md` | Created | Pass order, precedence arithmetic, bands, the re-scan |
| `sk-doc/sk-create-with-human-voice/assets/voice-report-template.md` | Created | The result shape |
| `sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` | Created | The mechanical pass |
| `sk-doc/sk-create-with-human-voice/scripts/README.md` | Created | Script usage and coverage boundary |
| `sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-dirty.md` | Created | One finding of each mechanical class, plus masked repeats |
| `sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-clean.md` | Created | The zero-finding control |
| `sk-doc/sk-create-with-human-voice/changelog/v1.0.0.0.md` | Created | Release notes |
| `sk-doc/mode-registry.json` | Modified | Surface 1: the mode, ten unique aliases, `metadata` routing |
| `sk-doc/hub-router.json` | Modified | Surfaces 2 and 3: signal, vocabulary class, tie-break |
| `sk-doc/ROUTER.md` | Modified | Surfaces 4 and 5, plus a corrected gloss |
| `sk-doc/SKILL.md` | Modified | Surface 7: mode table, counts, layout, fallback checklist |
| `sk-doc/description.json` | Modified | Surface 8: doctor description and keywords |
| `sk-doc/graph-metadata.json` | Modified | Surface 6: advisor vocabulary |
| `sk-doc/leaf-manifest.json` | Regenerated | Surface 9 |
| `sk-doc/README.md` | Modified | Hub overview, command list, document map |
| `sk-doc/command-metadata.json` | Modified | One entry for the new command |
| `.opencode/commands/create/with-human-voice.md` | Created | Thin command router |
| `.opencode/commands/create/assets/create-with-human-voice-{presentation.txt,auto.yaml,confirm.yaml}` | Created | Presentation contract and both workflows |
| `.claude/commands/`, `.cursor/commands/`, `.codex/prompts/`, `.pi/prompts/` | Generated | Surface 11: four runtime mirrors |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines first, before any edit: `parent-skill-check` at 13 modes and zero warnings, and
the pre-existing red in `.opencode/commands/create/assets/tests` at two failures plus one
error. Both are captured in `scratch/` so the after-state means something.

The packet was built before the hub was wired, because the hub-root files name its files
and a manifest regeneration would have failed on leaves that did not exist yet. Wiring
followed section 7 in order, and each surface was re-checked as it landed rather than at
the end, which is how `6b`, `10b` and `10d` were caught and closed individually.

The scanner's gate was proved by breaking it. A copy of the standard with one section
heading renamed makes the run exit 2 with `parsed too thin on hardWords` instead of
reporting a clean scan. A copy with the same section renumbered leaves the result identical.
Both controls are documented in the packet README so the next change to the parser has to
re-run them.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The standard stays at `shared/references/hvr-rules.md` | `grep -rl` finds hundreds of files carrying the path, the large majority under `specs/`, plus a spec-kit golden snapshot. Moving it falsifies shipped history and breaks a test suite for a tidier folder |
| The scanner parses the standard rather than embedding it | Two copies of a 120-term list drift, and the drifted one wins whichever it happens to be. Parsing means there is nothing to drift |
| Parse by section title, not section number | Renumbering is a benign edit and should not change results. A rename should stop the run, and the floors make it do so |
| The mode carries a slash command | Every sibling has one and section 7 row 11 exists for it. `/doc:quality` is registered with no command on disk, which is a defect recorded for its owner rather than a pattern to copy |
| `HVR` and `human voice` stay on `sk-create-quality-control` | Those aliases live in a sibling packet whose `SKILL.md` keyword line is its own source of truth. Moving them needs a file this packet does not own, so it is a recorded proposal |
| No leaf alias added for the standard | `resolveSharedAlias` returns the first alias matching a disk path, so a second alias for the same file would silently re-point every existing reference to it |
| No advisor command-bridge regeneration | `derive-command-bridges.cjs` rewrites `skill_advisor.py` and `projection.ts`, which a concurrent stream needs byte-stable. `/create:repo-rule` shipped without one, so this matches the precedent |
| Scoring switches to density past roughly 400 lines | The standard's 100-point scale assumes a piece of writing. A long reference goes negative on soft deductions alone, and a negative absolute score is a number nobody can act on |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `parent-skill-check.cjs .opencode/skills/sk-doc` | PASS. 14 modes, all hard invariants, 0 warnings. Baseline was 13 modes, 0 warnings |
| `package_skill.py <packet> --check --strict` | PASS with no warnings |
| `validate.sh specs/sk-doc/039-create-with-human-voice --strict` | RESULT: PASSED |
| `validate_document.py .opencode/commands/create/with-human-voice.md --type command` | VALID, 0 issues |
| Dirty fixture | 6 hard blockers, exit 1, and zero findings from the fenced block or the inline code span |
| Clean fixture | `no mechanical findings`, exit 0 |
| Renamed section in the standard | `parsed too thin on hardWords`, exit 2 |
| Renumbered section in the standard | Identical result to the real standard |
| Empty input on stdin | No findings, exit 0 |
| `router-replay.cjs`, seven phrasings | The mode's own phrasings return `intents: [sk-create-with-human-voice]`, `surfaceIntents: [HVR]`, four leaves, none missing. `add a repo rule` and `create a readme` unchanged |
| `skill_advisor.py`, two voice phrasings | `sk-doc` at confidence 0.95, citing the new signals and keywords |
| `sync-runtime-mirrors.cjs --check` | PASS, 171 mirrors across 8 trees. Baseline was 169, and 2 were added with 0 removed |
| `sync-prompts.cjs --check`, `sync-prompts-pi.cjs --check` | PASS, 36 prompts each |
| `.opencode/commands/create/assets/tests` | 2 failures plus 1 error, identical to the captured baseline. Pre-existing, from a stale kebab-migration fixture, and not touched |
| Scanner run over this packet's own seven authored documents | 0 hard blockers after two self-inflicted findings were fixed: three banned semicolons in the command router, and one banned phrase quoted in prose that needed a code span |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A code span broken across a line break is not masked.** The masking runs line by line, so `` `in today's digital\nlandscape` `` reports the word on the second line. Documented in `scoring-and-verification.md` section 2, where it was found by running the scanner over this packet's own documents.
2. **The scanner covers the mechanical subset only.** Structure, rhythm, synonym cycling, significance inflation and personality all need a reader. It prints that list on every run so a clean scan is never mistaken for a clean document, but nothing enforces that the reader actually looked.
3. **The vague-verb list produces high-volume findings.** `do`, `get`, `make`, `take` and `put` are in the standard at one point each and appear constantly in ordinary prose. The report groups by term with counts rather than listing every occurrence, which makes the volume legible, and the mode tells you to read density rather than the raw count.
4. **`hvr` on its own still routes to `sk-create-quality-control`.** That alias belongs to the sibling packet, and moving it needs a file this packet does not own. Stage two loads this mode's leaves for that phrasing either way, so the workflow content still reaches the agent. The proposal is recorded in `spec.md` section 6.
5. **No manual-testing playbook.** Optional at packet level. The four controls in the packet README cover the scanner, and an operator playbook for the judgment pass would mostly restate the standard.
6. **The advisor command bridge does not include `/create:with-human-voice`.** Deliberate, and it matches `/create:repo-rule`, which is also absent. Regenerating touches two files a concurrent stream needs byte-stable.
<!-- /ANCHOR:limitations -->

---
