---
title: "Implementation Summary: documentation matches what ships"
description: "What shipped in this phase, the evidence behind each claim, and what was left undone or unverified."
trigger_phrases:
  - "implementation summary"
  - "phase outcome"
  - "verification evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/006-reconcile-extension-documentation"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the shipped outcome and its evidence"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-006-reconcile-extension-documentation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: documentation matches what ships

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Status** | Complete |
| **Completed** | 2026-09-08 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Reconciled the documents describing the Pi extension surface against the shipped tree, recorded a
decision on the root README, and closed two residue defects the reconciliation surfaced.

- `.pi/PLUGINS.md` — roster reconciled entry-for-entry against the ten packages in
  `.pi/settings.json`; the intro's package count and its "carrying the same set" claim were false
  against installed state and were corrected.
- `.pi/extensions/pi-cache-optimizer/README.md` — the Fork section's reference to the retired
  extension removed. The edit also cleared a pre-existing validator failure: the file was missing
  its required `overview` section and had been invalid before this phase.
- `spec.md` §7 and `_memory.answered_questions` — the root-README question answered and marked
  RESOLVED rather than left to drift.
- `.gitignore` and the index — `.pi/deep-pi-stats.json` untracked and the protective ignore rule
  `.pi/deep-pi-stats.json*` restored. Phase 005 had deleted that rule and committed the 1,609-line
  data file it guarded.
- `baseline-readme-verdicts.json` — rebuilt through the script's own `--write` path, 1024 rows to
  1016, dropping eight rows for READMEs the removal deleted.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dispatched to `deepseek-v4-flash-max` through cli-devin, per the parent directive. The phase ran
last, after 001-005 shipped and were tested, so the documents describe measured behavior rather
than intent.

Every claim the dispatch made was re-verified here independently before being accepted. Two of its
statements were corrected in the process: the dispatch brief asserted the cache-optimizer README
"does not describe capabilities 2-4 at all", which is false against the committed tree, and an
initial reading of the sk-doc baseline as carrying stale deep-pi keys was wrong — the stale rows
were in `results`, not in the top-level keys.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**The root README stays silent, deliberately.** It is a public template inventorying the reusable
framework surface — skills, commands, MCP servers, the spec workflow. Pi extensions are operator
install state, already inventoried where the runtime lives (`.pi/PLUGINS.md`, `.pi/SYNC.md`,
`.pi/extensions/README.md`). A section there would duplicate that inventory in the most-read file
in the repo, and a fork of this template would inherit a description of install state it does not
carry.

**Historical records keep naming the retired extension.** A baked run transcript in the cli-pi
dispatch playbook and the fork's `CHANGES-FROM-UPSTREAM.md` both mention it, and both record what
was true when written. Editing them would turn a true record false.

**A protective ignore rule is not a reference.** The residue sweep in phase 005 treated the
`.gitignore` entry as a mention of a dead extension and removed it. It was the fix for a real bug:
a committed statistics lock made every fresh checkout fail at session start with a lock timeout.
Restoring the rule and untracking the data file closes that regression.

**The local npm manifests are left alone.** Both npm scopes still physically hold the retired
package, but they are gitignored install state and `.pi/settings.json` governs what loads. Removing
them is a change to the operator's machine, not to this repository.

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command / source | Result |
|-------|------------------|--------|
| Document validator, roster | `validate_document.py .pi/PLUGINS.md --type readme` | VALID, 0 issues |
| Document validator, extension README | `validate_document.py .pi/extensions/pi-cache-optimizer/README.md --type readme` | VALID, 0 issues (previously 1 blocking error: missing `overview`) |
| README verdict parity | `test_readme_verdict_parity.py` | PASS, `diff_entries=0` over 1016 tracked READMEs |
| Retrieval index guard | `vitest run cli/tests/trigger-index.vitest.ts` | 49/49 passed |
| Roster matches enabled set | `.pi/PLUGINS.md` vs `.pi/settings.json` | all 10 entries named |
| Extension absent from tree | `git ls-files .pi/extensions/deep-pi` | 0 tracked files; absent from disk |
| Stats file untracked | `git check-ignore .pi/deep-pi-stats.json` | ignored; retained on disk |
| Residue over live tracked files | `git grep -ln` excluding `specs/` | only the playbook transcript and the fork provenance record, both historical |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The root README carries no prose change; this phase records a decision about it, which is the
deliverable rather than a substitute for one.

Both npm scopes still physically hold `@arter/deep-pi`, and the project scope additionally carries
packages absent from `.pi/settings.json`. Nothing loads them, because the settings file governs
what Pi enables, but a `pi update --extensions` will keep refreshing them. Clearing that is
operator install-state work and was left for the operator deliberately.

Two claims remain operator-verifiable only: that live `pi list` output matches the reconciled
roster, and whether the stale npm-scope packages should be removed at all.

<!-- /ANCHOR:limitations -->
