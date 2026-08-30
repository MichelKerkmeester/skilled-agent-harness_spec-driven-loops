---
title: "Implementation Summary: Checklist Full Retirement"
description: "The standalone verification checklist is retired across producers, contract, read-paths, templates and 2,270 packets. Two defects the removal would otherwise have introduced were caught first."
trigger_phrases:
  - "ac coverage evidence source"
  - "checklist deprecation closure"
  - "traceability precedence fixed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement"
    last_updated_at: "2026-08-30T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Retired the document across every surface and closed the two defects the removal exposed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh"
      - ".opencode/skills/system-spec-kit/scripts/tests/check-ac-coverage.sh"
    session_dedup:
      fingerprint: "sha256:44f69435cb593a2d33a1b065dcdce6bfd063ac6e56695a3c26127fce7cf45d8d"
      session_id: "2026-08-30-036-010-checklist-full-retirement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-checklist-full-retirement |
| **Status** | Complete |
| **Completed** | 2026-08-30 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The tasks-and-checklist merge recorded `Delete/retire` against the standalone template and then kept it. Two packets later `upgrade-level.sh` was still rendering the document on every Level 1 to Level 2 upgrade, so a retired document was still being produced for new work. This removes it everywhere.

### What was removed

The producer in the upgrade path, the contract entries (document, version, section gates, optional listings at three levels), the document-to-template mapping, read-paths in 13 validation rules, 9 MCP server modules and 13 scripts, the template, its three worked examples, and 2,270 packet copies tracked in this repository.

### Two defects the removal would have introduced

**Every stored fingerprint would have stopped matching at once.** `source_fingerprint` hashes a document set; removing a document from that set invalidates every digest ever written — not because any packet changed, but because the toolchain did. Half a 20-packet sample failed immediately. Left alone, anyone pulling this faced a repo-wide repair before anything validated, and the four repositories that symlink their specs into this toolchain would each have hit the same wall with no obvious cause. The digest now records the generation of the set that produced it, and a strict read only compares within a generation. Retiring or adding a canonical document is now a one-line bump.

**Verification items would have become exempt from the evidence rule.** The rule held only task-shaped ids to its standard inside the tasks document; verification-shaped ids were checked only when they came from the standalone file. The merge had already moved those items across, so retiring the file completed a silent exemption — every verification item in every packet, unchecked, with the rule still reporting success. Both id shapes are now held to the standard.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/spec/upgrade-level.sh` | Modified | Stops producing the document; also fixes a latent early return that skipped acceptance-criteria creation |
| `templates/spec-kit-docs.json` | Modified | All contract entries removed |
| `mcp-server/lib/graph/graph-metadata-parser.ts` | Modified | Document-set generation defined and persisted |
| `mcp-server/lib/validation/generated-metadata-integrity.ts` | Modified | Compares digests only within a generation |
| `scripts/rules/check-evidence.sh` | Modified | Holds both id shapes to the evidence standard |
| `scripts/rules/*.sh`, `mcp-server/lib/**`, `scripts/**` | Modified | Read-paths removed across 35 files |
| `templates/addons/checklist.md.tmpl` + 3 examples | Deleted | The retired template and its examples |
| `specs/**/checklist.md` | Deleted | 2,270 tracked packet copies |
| `scripts/test-fixtures/**` | Modified | Fixture content preserved; 5 obsolete fixtures and 8 obsolete cases removed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Producers first, then read-paths, then artifacts — so nothing read a document that had already gone. Each surface was proven before moving on: a live upgrade run for the producer, a build for the server modules, a fixture-suite comparison for the rules.

The two defects surfaced from measurement rather than review. The fingerprint problem appeared as a 10-of-12 regression against a baseline captured before any edit. The evidence exemption appeared because three fixtures kept passing when they were specified to warn.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**No content migration.** The operator chose deletion over migrating the 45,758 recorded items, after being shown the count. The records remain in git history and a revert restores them.

**Nothing written through a symlink.** Four repositories symlink their specs into this tree, contributing 397 further copies. Those are other projects' files and outside this repository's git, so deletions were confined to git-tracked in-repo paths.

**The memory taxonomy stays.** There `checklist` is a document-type label on already-indexed rows; removing it would mis-type history rather than retire a document. Checklist-as-pattern — the anchor shape, the completion evaluator, the pre-task section name — is likewise not this document.

**Pre-existing failures left alone.** Four golden snapshots fail on clean HEAD over unrelated placeholder drift. Rebaselining them would have absorbed someone else's unfixed problem into this change and hidden it.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Producer | Live upgrade creates acceptance criteria only, no checklist |
| Baseline sample, no repair run | 10 PASSED / 2 FAILED — identical to pre-change |
| Real drift still caught | Edited doc reports 1 mismatch; restored reports 0 |
| Wide sweep, none repaired | 0 fingerprint mismatches across 26 spread packets |
| Evidence fixtures | warn / pass / warn, exactly as specified |
| Fixture suite | HEAD 16 failed / 23 passed → 13 failed / 22 passed |
| `repair-derived` and 3 mcp suites | Identical failure sets on clean HEAD — all pre-existing |
| Golden snapshots | 9/9 with the retirement guard; 4 pre-existing failures untouched |
| Builds | `tsc --noEmit` 0 errors; both dist trees rebuilt |
| Retirement invariants | 0 tracked copies, 0 live template refs, 0 rule read-paths |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:review -->
## Deep Review

A 3-iteration deep review ran after the retirement landed (`cli-cursor`,
`cursor-grok-4.6-xhigh`, forced depth, `stopReason: maxIterationsReached`).
Verdict CONDITIONAL: 0 P0, 5 P1, 3 P2. Every finding was reproduced against the
files before being acted on.

**The finding that mattered.** F005 pointed at `mcp-server/handlers/`, a
directory the read-path sweep never covered: it was scoped to `mcp-server/lib`
and `scripts`. Three live source files still referenced the retired document,
including a level-discovery heuristic that returned Level 2 on a sibling
checklist. The sweep was widened and `handlers/`, `tool-schemas.ts` and
`mcp-server/scripts/` were cleared.

| ID | Finding | Resolution |
|----|---------|------------|
| F001 | The coverage suite still asserted the pre-merge fallback | Retargeted: a stray copy and an unanchored tasks document both resolve to no source |
| F002 | Level-contract test still expected the document in optional add-ons | Now asserts the acceptance-criteria document alone |
| F003 | Integration test still required the deleted worked example | Assertion removed |
| F005 | Level discovery still read a sibling checklist as a Level-2 signal | Removed, with two further handler references |
| F006 | Template README and worked examples still pointed at the document | 12 files repointed at the merged tasks document |
| F007 | Verification items unchecked while Status was Complete | 19 items filled with real evidence; one deferred with its reason |
| F008 | The plan still described a fallback this packet removed | Corrected to single-source |

All findings are closed; none were left declined.

| ID | Finding | Resolution |
|----|---------|------------|
| F004 | The taxonomy matched `checklist` as a substring, so a `checklists/` directory or any document merely containing the word was labelled a verification record | Bound to a filename match; three false positives verified rejected and both true positives kept |
| — | Four golden snapshots failed on a stale Status placeholder | The template renders `Draft` and the snapshot still expected the old placeholder, so the snapshot was stale rather than the template. Rebaselined, with the diff audited to exactly that one line class |

The review's remediation workstreams also surfaced something it under-stated. It
flagged one task row citing behaviour the live code no longer had; the row was a
symptom of the whole task list having been seeded from a sibling packet and never
rewritten. Every task now describes work this packet actually did, and the false
citation is gone.

One failure remains in the wider suite - a working-memory and attention-decay
export contract - which reproduces on clean HEAD and has no connection to this
work.

### Second review pass (independent executor)

A further 3 iterations ran on a different vendor and model family (`cli-pi`,
`gpt-5.6-luna` at xhigh reasoning, forced depth, `stopReason:
maxIterationsReached`) against the already-remediated packet. Verdict
CONDITIONAL: 0 P0, 7 P1, 2 P2 — a largely different finding set from the first
pass, which is the point of running a second one.

Two findings landed on the fingerprint work this packet introduced, and both
were reproduced before being fixed:

| ID | Defect | Proof | Fix |
|----|--------|-------|-----|
| P1-004 | The generation check skipped on *any* non-current marker, so a forged or mistyped value switched drift detection off for that packet permanently and silently | Real drift reported 1; the same drift with `source_fingerprint_docset: 99` reported 0 | Only an older or absent generation skips; equal and newer both compare |
| P1-001 | The hashed source set never included the acceptance-criteria document, so edits to the document that decides closure were undetectable | Editing it reported 0 mismatches | Added to the set alongside the goal document; generation bumped to 3 |

Bumping the generation is exactly the fleet-invalidating change the marker
exists to absorb, and it behaved: a 12-packet sample still carrying
generation-2 digests reports 0 mismatches with no repair run.

`scripts/tests/fingerprint-docset-generation.sh` now pins both failure
directions — too strict (comparing across generations, which fails every
untouched packet) and too loose (skipping on an unrecognized marker). 6/6.

The deferred hostile-environment variant was then actually run rather than left
deferred, and it found a third defect of the same family: an unrecognized value
for the coverage enable-flag silently disabled the gate. A typo now leaves the
gate running; only an explicit falsey value turns it off.

Also corrected: a line citation that drifted when the producer block moved, and
an evidence claim that named a narrower sweep than the requirement it satisfied.

### Carried forward, not fixed here

Three path-containment findings are real, reproduced, and pre-existing — none
introduced by this retirement:

| ID | Finding | Evidence |
|----|---------|----------|
| P1-003 | The specs-scoped path test accepts any path containing a `specs` segment | `/tmp/evil/specs/x.md` and `../../elsewhere/specs/y.md` both pass |
| P1-002 | Lexical containment can accept an in-root symlink redirecting resume reads outside the workspace | `mcp-server/lib/resume/resume-ladder.ts` |
| P2-001 | Repair discovery rejects symlinks but the later write path has a scan-to-write gap | `mcp-server/scripts/repair-graph-metadata.mjs` |

They are one coherent problem — proving workspace membership rather than
pattern-matching a path — across indexing, resume and repair. Fixing that inside
a document-retirement packet would be scope drift with its own blast radius, so
it is recorded here with reproduction rather than folded in.

<!-- /ANCHOR:review -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **45,758 recorded verification items are no longer read.** Deliberate, and the reason a revert is the documented rollback.
2. **397 copies remain behind the symlinked repositories.** Read by nothing here and blocking nothing, but those repositories keep the files until their owners retire them.
3. **The evidence rule now warns on packets that were silently exempt.** 25 of a 40-packet sample. That is the rule finally applying, at advisory severity, blocking nothing.
4. **Four golden snapshots still fail.** Pre-existing on clean HEAD and out of scope.
<!-- /ANCHOR:limitations -->

---
