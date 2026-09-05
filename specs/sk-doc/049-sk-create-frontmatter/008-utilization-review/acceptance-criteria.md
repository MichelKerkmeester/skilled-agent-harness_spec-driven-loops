---
title: "Acceptance Criteria: Phase 8: utilization-review"
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
    packet_pointer: "sk-doc/049-sk-create-frontmatter/008-utilization-review"
    last_updated_at: "2026-09-02T18:55:24Z"
    last_updated_by: "implementation"
    recent_action: "Recorded the measured outcome of every criterion"
    next_safe_action: "Review the two written-up items in implementation-summary.md section 7"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-049-008-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: utilization-review

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/049-sk-create-frontmatter/008-utilization-review
**Level:** 3
**Status:** Complete
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given eleven playbook scenarios that had never been executed, When each is run as written, Then each carries a recorded outcome of passed, failed with evidence, or could not run with the reason | `implementation-summary.md` section 3 records all eleven, 11 PASS | Met | - |
| AC-002 | REQ-001 | Given the playbook package, When the operator contract is checked, Then it reports PASS with a nonzero operator count | `node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook` prints `PASS package=sk-doc/sk-create-frontmatter tier=FAIL_CLOSED scenarios=11 categories=3 operator=11 routing_gold_excluded=0 violations=0 warnings=0`, exit 0 | Met | - |
| AC-003 | REQ-002 | Given eight realistic newcomer prompts, When each is routed through the advisor, Then the reachability of the mode from natural language is measured rather than assumed | `implementation-summary.md` section 4: 6 of 8 return no recommendation, 2 route to the wrong hub | Met | - |
| AC-004 | REQ-002 | Given the seventeen keyword triggers the manifest declares, When each is routed, Then the count that reaches nothing is measured after the routing pass | `implementation-summary.md` section 4: 8 of 17 return no recommendation, matching the pre-pass count | Met | - |
| AC-005 | REQ-003 | Given the four class templates added for readme, feature catalog, testing playbook and agent, When a real document of each class is checked against its template, Then every required field the template names is present | `implementation-summary.md` section 6: 8 real documents across the 4 classes, all conform | Met | - |
| AC-006 | REQ-004 | Given the versioning tool, When it is invoked with a lone `--help`, Then the behavior is observed and its ownership stated | `node .opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs --help --skill sk-vision` prints `Unknown mode: --help` and exits 64. Unscoped it walks git history past 120s first. Owned by the shared tier, not this mode | Met | - |
| AC-007 | REQ-005 | Given the documented 3-5x edit-count inflation, When it is measured over the in-scope corpus, Then the mode's editable documents carry the measured figure | 1,214 docs measured, aggregate 1.06-1.09x, max 2.25x and zero files at 3x. Corrected in `references/frontmatter-versioning.md`, `README.md`, the playbook root and `numstat-gate.md` | Met | - |
| AC-008 | REQ-006 | Given the field reference's rule that spec documents use inline metadata, When a spec document's frontmatter is removed, Then the validator's response settles whether the rule is correct | `validate.sh --strict` reported `SPECDOC_FRONTMATTER_001: malformed YAML frontmatter` and `RESULT: FAILED` at exit 2. Nine sites in `assets/frontmatter-templates.md` corrected | Met | - |
| AC-009 | REQ-006 | Given the `By Document Type` table, When the blockquote interrupting it is moved below the last row, Then all eight class rows sit inside one table | `assets/frontmatter-templates.md` lines 118-128, blockquote now at line 130 | Met | - |
| AC-010 | REQ-007 | Given every file this phase wrote, When the human-voice scanner runs, Then no file gains a hard blocker against its committed baseline | 6 files scanned, deltas 0, 0, 0, 0, 0 and -1, with the asset scanned using `--include-code` | Met | - |
| AC-011 | REQ-007 | Given every file this phase wrote, When `validate_document.py` runs on it, Then it exits 0 | 6 files, all exit 0 | Met | - |
| AC-012 | REQ-007 | Given this phase folder, When the spec validator runs strict, Then it prints `RESULT: PASSED` with rule lines visible | `NODE_PRESERVE_SYMLINKS=1 bash "$(realpath .opencode)/skills/system-spec-kit/scripts/spec/validate.sh" specs/sk-doc/049-sk-create-frontmatter/008-utilization-review --strict` | Met | - |
| AC-013 | REQ-002 | Given the eight declared triggers that reached nothing, When they are added to the hub's stage-one vocabulary, Then each one routes to `sk-doc` | All eight are in `graph-metadata.json` `intent_signals` and `derived.trigger_phrases`. Advisor before: eight of eight returned no recommendation. After: eight of eight return `sk-doc`, four at 0.8777 to 0.8828 and four at the 0.82 floor. Two of three realistic newcomer prompts also moved from nothing to `sk-doc` | Met | - |
| AC-014 | REQ-004 | Given the versioning engine, When it is invoked with a lone `--help`, Then it prints usage and exits 0 without walking git history | `parseArgs` scans argv for the flag before deriving the mode. `--help`, `-h`, `--help --skill sk-vision` and no arguments each print the usage block and exit 0, immediately. `bogus` still reaches `Unknown mode: bogus` at exit 64. Engine tests 23 passed, 0 failed | Met | - |
| AC-015 | REQ-005 | Given `SKILL.md`'s three-to-five-times inflation claim, When it is replaced, Then the text carries the measured figure and the corpus it was measured on | `SKILL.md` now reads 1.06 to 1.09 times in aggregate and 2.25 times at the worst file, across the 1,214 in-scope documents of `sk-doc` and `system-spec-kit` on 2026-09-02 | Met | - |
| AC-016 | REQ-001 | Given `FMB-001` and `FMB-002`, When each is read, Then it names an input document that exists | `assets/fixtures/over-budget-description.md` and `assets/fixtures/under-budget-trim-lost-tokens.md` exist, are named in each scenario's prompt, commands and anchors table, and are registered as leaves. `validate-playbook-package.cjs` prints `PASS ... scenarios=11 categories=3 operator=11 violations=0 warnings=0`, exit 0 | Met | - |
| AC-017 | REQ-003 | Given the index tables in sections 1, 2 and 10, When each is read, Then feature catalog, testing playbook and agent appear alongside the classes already there | Rows added to the section 1 table, to `By Document Type` and to the section 10 matrix. Columns added to the field summary, plus `title` and `trigger_phrases` rows so the three classes' required fields are legible. Values match the section 4 templates | Met | - |
| AC-018 | REQ-007 | Given a hub input edit, When the compiled-routing state is checked, Then the hub reads fresh and the per-hub audit passes | The `SKILL.md` edit made `sk-doc` `stale-manifest`, the observed negative control. After re-minting both the runtime and the authored manifest to `60f98f69...`, `compiled-route-guard.cjs` reports all five hubs fresh at exit 0, `compiled-route-sync.cjs --verify` reports `move-simulation OK`, and `parent-skill-check.cjs .opencode/skills/sk-doc` passes every hard invariant with 0 warnings | Met | - |
| AC-019 | REQ-007 | Given the canary digest pinned to the hub's source bytes, When it is re-pinned for this change, Then the canary passes | Re-pinned after the concurrent session committed its own drifted entry, so both were closed in one pass. `build-artifacts.cjs` regenerated the six compiled and activation artifacts, and the two `AUTHORED_DIGESTS` values were updated. `validate-canary.cjs` returns `"status":"REAL-GREEN"` at exit 0, with 23 of 23 route-gold rows real-green. Sequencing recorded in ADR-001 | Met | - |

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

AC-001 and AC-003 carried the packet. Running the playbook proved the mode answers the questions it claims to, and routing eight newcomer prompts proved almost nobody reaches it by describing their problem. Four documentation defects found on the way were fixed in place. Left out deliberately: the routing repair itself, which lives in hub files this phase was barred from editing, and the `--help` defect in the shared-tier engine, which this mode does not own. Both were then carried out in a follow-up pass, along with the fixtures and the index tables, and AC-013 through AC-018 record what each one produced. Every criterion is met. AC-019, the canary re-pin, was held back while a concurrent session's edit to a sibling packet was still uncommitted, since the pin set regenerates as a whole. That change landed during this session, so both drifted entries were re-pinned in one pass and the canary is green. ADR-001 records the sequencing. The compiled-routing leg that decides whether the hub serves compiled is closed, since both activation manifests are re-minted and the guard reads fresh.
<!-- /ANCHOR:closure -->
