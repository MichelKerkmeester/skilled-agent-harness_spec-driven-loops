---
title: "Acceptance Criteria: Phase 4: grep-convention-doc-retrofit"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/004-grep-convention-doc-retrofit"
    last_updated_at: "2026-09-02T11:04:56Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-049-memory-decommission"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: grep-convention-doc-retrofit

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit
**Level:** 3
**Status:** Draft
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-003 | Given the frozen in-scope manifest, When the rescan runs after the last track is processed, Then it reports zero unprocessed variants | `retrofit-convention.mjs rescan` exits 0 with an empty residue list at `scratch/residue-report.json` | Unmet | - |
| AC-002 | REQ-003 | Given the scoped glob set, When any pipeline stage or recipe runs, Then no path under `z_archive/` or `node_modules/` is read or written | `scratch/manifest.json` contains no such path, and `git status` after the run shows no change under `z_archive/` | Unmet | - |
| AC-003 | REQ-004 | Given the body preimage manifest captured before the run, When every processed document is rehashed afterwards, Then every digest is identical | `retrofit-convention.mjs verify-preimage` reports zero mismatches against `scratch/preimage-manifest.json` | Unmet | - |
| AC-004 | REQ-012 | Given a retrofitted document's diff, When each changed line is classified, Then it is either inside the frontmatter block or a whole-line anchor marker addition or removal | Per-track diff classifier output, zero lines in the `other` bucket | Unmet | - |
| AC-005 | REQ-010 | Given the retrofitted corpus, When anchor markers are parsed, Then every opener has its matching closer, ids are unique per document and non-typed ids are lower-kebab | `check-grep-convention.sh` reports zero `anchor-unmatched` and zero `anchor-duplicate` rows | Unmet | - |
| AC-006 | REQ-007 | Given an unchanged corpus, When the full pipeline runs a second time, Then it writes nothing | `git diff --exit-code specs/` exits 0 after the second run, and the artifacts are byte-identical | Unmet | - |
| AC-007 | REQ-006 | Given the pre-retrofit phrase count recorded in `scratch/baseline.json`, When the trigger index is regenerated from the retrofitted corpus, Then the phrase count is at or above that baseline | Regeneration run output compared against the recorded baseline of 97,529 | Unmet | - |
| AC-008 | REQ-002 | Given a document that violates the convention, When the validator rule runs, Then it emits a diagnostic carrying `path`, one-based `line`, `category` and `reason` | Rule fired against each of the eight variant fixtures, one row per fixture with all four fields populated | Unmet | - |
| AC-009 | REQ-015 | Given the recipes in `spec.md` section 14, When each is executed against the retrofitted corpus, Then its exit status matches the documented mapping of 0 match, 1 no match and 2 or higher error | Recorded command transcript with exit statuses read, covering the frontmatter-only, anchor, body-only, generic and archive controls | Unmet | - |
| AC-010 | REQ-011 | Given the in-scope manifest, When enumeration completes, Then every document carries exactly one of the eight variant labels and the counts sum to the manifest total | `scratch/variant-inventory.json` totals compared against `scratch/manifest.json` | Unmet | - |
| AC-011 | REQ-008 | Given a document using `triggerPhrases`, When it is processed, Then the key is rewritten to `trigger_phrases` and the alias is reported | `alias-hit` row present in `diagnostics.json`, and a corpus-wide `rg` for `triggerPhrases` returns exit 1 afterwards | Unmet | - |
| AC-012 | REQ-009 | Given the generic negatives in `spec.md` section 13.3, When the corpus is searched for `session` as a trigger phrase, Then no `trigger_phrases` field hit is returned | Generic-negative control replayed, zero field hits and every rejected candidate present as a `generic-trigger` row | Unmet | - |
| AC-013 | REQ-001 | Given the convention document, When the first corpus write happens, Then the convention already exists in the repository | `git log` shows the convention commit strictly before the first retrofit commit | Unmet | - |
| AC-014 | REQ-005 | Given the updated templates, When a new packet is scaffolded, Then it passes the convention rule with no manual edit | Scaffold a throwaway packet, run `check-grep-convention.sh`, observe exit 0 | Unmet | - |
| AC-015 | REQ-013 | Given a packet directory or basename that breaks the naming grammar, When the retrofit runs, Then it is reported and left unrenamed | `naming-exception` rows present in `scratch/exception-inventory.json`, and `git status` shows zero renames | Unmet | - |
| AC-016 | REQ-014 | Given a newly authored structured section, When it is reviewed, Then each fact occupies its own line, and no pre-existing prose was reflowed | AC-003 and AC-004 evidence, plus inspection of the sections added by this phase | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

Not closeable. All sixteen criteria are `Unmet` and the retrofit has not run. AC-003 and AC-004 are
the pair that carries the packet, because together they turn "no body rewrite" from an intention into
a machine-checked invariant. The criteria above derive from
specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/research/lineages/luna-max/research.md
<!-- /ANCHOR:closure -->
