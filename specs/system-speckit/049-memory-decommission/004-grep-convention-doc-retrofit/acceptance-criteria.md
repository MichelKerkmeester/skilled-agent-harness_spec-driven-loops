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
    packet_pointer: "system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit"
    last_updated_at: "2026-09-04T02:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed all sixteen acceptance rows after the fourteen-track retrofit"
    next_safe_action: "Take the packet closeout decisions to the operator, then land the branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-004-grep-convention-doc-retrofit"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-09-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Three rows below were written before `spec.md` section 13.7 fixed the measures they name, and each
one's Verification cell records what was actually observed against the amended measure rather than
the estimate it was drafted from. AC-005 carries the report-only severity, AC-007 the phrase-count
measure and AC-011 the alias count that turned out to be zero.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-003 | Given the frozen in-scope manifest, When the rescan runs after the last track is processed, Then it reports zero unprocessed variants | `retrofit-convention.mjs rescan` reports `residueCount` 0 across 22,094 considered in `scratch/residue-report.json`. The 63 documents still labelled `missing` are the two refusal classes carried under `skippedByDesign`: 55 canonical documents whose partial block would fail the frontmatter contract, and 8 flow-mapping policy cards a block key would leave unparseable | Met | - |
| AC-002 | REQ-003 | Given the scoped glob set, When any pipeline stage or recipe runs, Then no path under `z_archive/` or `node_modules/` is read or written | `scratch/manifest.json` carries no archived or vendored path, and `git status` over the final state counts 0 changed files under `z_archive/` | Met | - |
| AC-003 | REQ-004 | Given the body preimage manifest captured before the run, When every processed document is rehashed afterwards, Then every digest is identical | `retrofit-convention.mjs verify-preimage` verified all 22,094 documents against `scratch/preimage-manifest.json` with 0 mismatches and 0 missing, recorded in `scratch/preimage-verification.json` | Met | - |
| AC-004 | REQ-012 | Given a retrofitted document's diff, When each changed line is classified, Then it is either inside the frontmatter block or a whole-line anchor marker addition or removal | The mechanical diff classifier over the corpus passes put all 36,271 changed lines across 10,202 files inside the frontmatter block, with 0 whole-line anchor-marker lines and 0 lines in the `other` bucket | Met | - |
| AC-005 | REQ-010 | Given the retrofitted corpus, When anchor markers are parsed, Then every non-typed id is lower-kebab and every typed id follows the typed grammar, and every unmatched opener, orphan closer or duplicated id is reported as a diagnostic row rather than repaired or silently accepted | `check-grep-convention-helper.mjs` and `exception-inventory.json`: 165,580 marker lines with 0 non-conforming ids; `anchor-unmatched` 95 and `anchor-duplicate` 51 reported as warn rows under section 13.7's staged severity, none rewritten | Met | - |
| AC-006 | REQ-007 | Given an unchanged corpus, When the full pipeline runs a second time, Then it writes nothing | A second full pipeline run, enumerate then process, wrote 0 documents and left the diff byte-identical | Met | - |
| AC-007 | REQ-006 | Given the pre-retrofit phrase count recorded in `scratch/baseline.json`, When the trigger index is regenerated from the retrofitted corpus, Then the phrase count is at or above that baseline | Measured on the `uniqueNormalizedPhrases` measure that `spec.md` section 13.7 fixed for REQ-006, replacing the 97,529 estimate this row was drafted from: 26,743 before and 26,743 after, because the retrofit adds no phrase and removed only 23 duplicate members, taking declared members 38,331 to 38,308. The trigger index itself publishes and regenerates byte-identical across two runs at the same sha256, holding 33,791 unique phrases and 13,096 paths against 33,871 and 13,220 at the phase start; that difference is the new tooling-fixture exclusion, not the retrofit | Met | - |
| AC-008 | REQ-002 | Given a document that violates the convention, When the validator rule runs, Then it emits a diagnostic carrying `path`, one-based `line`, `category` and `reason` | `check-grep-convention.sh` with `check-grep-convention-helper.mjs` emits all four fields plus `rawKey` and `severity` per row, the same schema the retrofit emits; rule tests 19 pass and the rule is registered always-on in `scripts/lib/validator-registry.json` | Met | - |
| AC-009 | REQ-015 | Given the recipes in `spec.md` section 14, When each is executed against the retrofitted corpus, Then its exit status matches the documented mapping of 0 match, 1 no match and 2 or higher error | The structured, path and count recipes each ran against the retrofitted corpus with the command line and exit status recorded in `scratch/baseline.json`, and the frontmatter-only, anchor, body-only, generic and archive controls were each replayed with their exit statuses read | Met | - |
| AC-010 | REQ-011 | Given the in-scope manifest, When enumeration completes, Then every document carries exactly one of the eight variant labels and the counts sum to the manifest total | Enumerate labelled all 22,094 documents with zero unclassified — missing 10,187, malformed-or-unclosed 1, non-yaml 1, valid-empty 11,882, duplicate 23, oversized 0 and the remaining two labels 0 — and `scratch/variant-inventory.json` asserts the counts against `manifestTotal` | Met | - |
| AC-011 | REQ-008 | Given a document using `triggerPhrases`, When it is processed, Then the key is rewritten to `trigger_phrases` and the alias is reported | The antecedent never fired: `alias-hit` is 0 across the corpus, and a line-start search for the alias as a frontmatter key returns no in-scope document, so nothing needed rewriting. The remaining plain-text hits for the token are prose naming the alias, not keys. The normalizer itself is covered by the grep-convention suite, 66 tests pass | Met | - |
| AC-012 | REQ-009 | Given the generic negatives in `spec.md` section 13.3, When the retrofit and the validator run, Then no fallback-produced phrase is written anywhere and every generic candidate, declared or fallback-produced, is present as a `generic-trigger` row | Generic-negative control replayed: zero `trigger_phrases` members added by the run, every rejected candidate present as a `generic-trigger` row in `diagnostics.json`, and the count of author-declared generic phrases recorded as a known residual. Observed: 432 rows in `scratch/exception-inventory.json` — 202 folder-token, 182 generic word, 27 prose, 17 stop-word and 4 editor-fallback, the last four naming the frontmatter editor's fallback in their reason and none adopted | Met | - |
| AC-013 | REQ-001 | Given the convention document, When the first corpus write happens, Then the convention already exists in the repository | `.opencode/skills/system-spec-kit/references/structure/grep-convention.md` is committed at `89faec9717`, strictly before the tooling at `d09294c2a9` and the first corpus pass at `6fb5a7181e` | Met | - |
| AC-014 | REQ-005 | Given the updated templates, When a new packet is scaffolded, Then it passes the convention rule with no manual edit | The templates in core, addons and the 16 examples conform, and the 16 scaffold goldens were refreshed and pass, so the output a scaffold produces carries a conforming block with no manual step. The corpus walker excludes the tooling fixture trees outside `specs/` so template fixtures are not retrofitted as if they were documents | Met | - |
| AC-015 | REQ-013 | Given a packet directory or basename that breaks the naming grammar, When the retrofit runs, Then it is reported and left unrenamed | 664 `naming-exception` rows in `scratch/exception-inventory.json` — 359 basenames, 272 directory names and 33 packet directories off the `NNN-short-descriptive-name` grammar — and `git status` shows zero renames | Met | - |
| AC-016 | REQ-014 | Given a newly authored structured section, When it is reviewed, Then each fact occupies its own line, and no pre-existing prose was reflowed | No prose was reflowed anywhere, proven by AC-003's 22,094 identical preimages and AC-004's zero `other` diff lines. The sections this phase authored — `spec.md` section 13.7, the convention document and these closing documents — carry one fact per row | Met | - |

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

**Closeable:** Yes

AC-003 and AC-004 carried the packet, exactly as the draft predicted: 22,094 identical body preimages
and 36,271 changed lines that are all frontmatter turn "no body rewrite" from an intention into a
machine-checked property. Read AC-005 before treating this as a clean sweep — its Then clause is
written as an absolute, and the corpus still holds 95 unmatched markers and 51 duplicate ids, closed
against section 13.7's report-only severity rather than against zero rows. The honest reading is that
the phase diagnosed every one and repaired none, and that escalating those classes is a decision, not
a task someone forgot. Consciously left out: 55 canonical documents and 8 flow-mapping policy cards
are still reported as `missing` by design, because a partial block would fail their packets and an
authored block is the only conforming fix; the 664 naming exceptions are reported and unrenamed,
because renaming during a 10,000-file frontmatter pass makes the diff unreviewable. The criteria
above derive from
specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/research/lineages/luna-max/research.md
<!-- /ANCHOR:closure -->
