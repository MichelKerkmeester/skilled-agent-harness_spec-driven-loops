---
title: "Acceptance Criteria: Phase 6: verification-and-closeout"
description: "The six criteria that close the packet, each answered by one reproducible sweep over the settled tree: the hub gates, the metadata and connectivity checks, both playbook packages, the 683-test suite, the honest re-pin, and the agreement between the packet's own documents."
trigger_phrases:
  - "final state sweep acceptance"
  - "hub gate exit status evidence"
  - "re-pin preceded by red run"
  - "packet document status agreement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/006-verification-and-closeout"
    last_updated_at: "2026-09-01T08:43:02Z"
    last_updated_by: "implementation"
    recent_action: "Closed all six criteria from one sweep over the settled tree; every gate green"
    next_safe_action: "Proceed to phase 007 (human voice playbook)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt"
      - ".opencode/skills/sk-doc/sk-create-frontmatter/changelog/v1.0.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: verification-and-closeout

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/049-sk-create-frontmatter/006-verification-and-closeout
**Level:** 3
**Status:** Complete
**Date:** 2026-09-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the tree as it finally stands, When every gate any phase could have disturbed is run once, Then all of them pass | One sweep, read in full: five hubs `compiled-serving`; `move-simulation OK: all 5 hubs resolve; 0 reads under .opencode/specs`; five parent-hub canaries exit 0; five `parent-skill-check` gates each `OK: parent-skill-check — all hard invariants passed, 0 warnings` at exit 0; skill-root metadata CI `checked=14 passed=14 failed=0 fixed=0`; packaging gate on the new mode `Result: PASS`; `agent-mirror-sync: 12 agent(s) checked — all mirrors in sync — OK`; alias table 5 entries with an empty `git diff`; corpus frontmatter gate `[gate] 310 files | ok=309 skip-no-frontmatter=1` | Met | - |
| AC-002 | REQ-002 | Given a canary digest that drifted for a legitimate reason, When it is re-pinned, Then a run that proved the pin still fires came first | Three re-pins across the packet, each after a red run. The first named `packets/sk-create-feature-catalog/SKILL.md` and `packets/sk-create-manual-testing-playbook/SKILL.md`, which phase 003 had edited; the second named the hub `SKILL.md` after the packet-count correction; the third named `packets/sk-create-frontmatter/SKILL.md` after a voice pass over the mode's own prose. The four live-topology counts in the same harness were also refreshed, as its own code comment instructs on registering a mode: destinations, projection rows and distinct identity tuples 14 to 15, distinct packets 13 to 14, with the gap they encode unchanged at 1 | Met | - |
| AC-003 | REQ-003 | Given the packet's own documents, When each is read for a completion claim, Then no two of them disagree | The parent `spec.md` phase map lost two duplicated placeholder rows, a second phase 7 row reading `[Phase 7 scope]` and a second handoff row reading `[Criteria TBD] \| [Verification TBD]`, both template residue from when phase 7 was appended. The mode's `changelog/v1.0.0.0.md` was rewritten because its original entry stated the packet held no content and was not registered, claims that stopped being true two phases later. The mode's `README.md` now names its playbook and its two playbook gates | Met | - |
| AC-004 | SC-001 | Given the five hubs and the fleet connectivity gate, When each is read from the final state, Then all five serve, all five canaries exit zero, and connectivity reports no failure | Five hubs `compiled-serving` (cli-external-orchestration, mcp-tooling, sk-code, sk-doc, system-deep-loop); five canaries exit 0; `d5-connectivity` reports `sk-create-frontmatter` score=100 gateFailed=false stageTwoRouted=3 issues=0, `sk-create-with-human-voice` score=100 gateFailed=false stageTwoRouted=5 issues=0, and the hub itself 0 issues. Both playbook packages report `PASS ... violations=0 warnings=0` and are visible to the loader at 11 and 9 scenarios with zero warnings, and the playbook routing-gold topology reports `verdict=PASS valid=32 blocked=0 unenrolled=0 total=32`. Link integrity across the hub is `failures=112`, down from a pre-packet baseline of 113, with frontmatter-related failures at zero | Met | - |
| AC-005 | SC-002 | Given the benchmark suite, When it runs from the final tree, Then no test fails and the count matches the pre-packet baseline | `Test Files 54 passed (54)`, `Tests 683 passed (683)`, unchanged from the pre-packet baseline. No residue afterwards: `runtime/database/council-graph.sqlite` and `specs/descriptions.json` are both clean | Met | - |
| AC-006 | SC-003 | Given the packet's spec documents, When they are validated at strict, Then no content rule reports an error | Every content rule passes across the packet's phase folders. The only rules that report are `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT`, which attest a fingerprint over the documents and therefore re-fire after any spec-doc edit until the generated metadata pair is regenerated. Regenerating that pair is the documented step after authoring, not a defect in the documents | Met | - |

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

All six criteria are Met, and every one of them was answered by the same sweep over the same tree. That is
the property this phase exists to establish: a gate's verdict is only about the tree it read, so the
closeout edits were made first and the sweep was run once afterwards, rather than the other way round.

Three things were found during the sweep and deliberately not fixed. A version-derivation reconcile is owed
after the commit: the two moved documents still carry `1.8.0.19` and `1.8.0.0` from the old shared-tier
anchor, while `frontmatter-version.mjs compute` derives `1.0.0.0` for both under their new packet. That
computed value is an artifact of the uncommitted move, because the new path has zero commits and `--follow`
picks the history back up once the rename is committed, so the standard's own skip-on-differ rule says leave
both alone and reconcile with `frontmatter-version.mjs apply --skill sk-doc --update` afterwards. The
sibling `sk-create-repo-rule` playbook is invisible to the benchmark loader for two independent reasons, a
scenario frontmatter carrying no `id`, `expected_intent` or `expected_resources`, and a root index table
ordered `| ID | Name | Category | File |` with no Yes/No column, so `parseRootIndex` matches nothing and the
loader falls through to a shape where every file is skipped. And the five tooling defects recorded under
phase 005 remain open. Each belongs to the packet that owns the surface, not to this one.
<!-- /ANCHOR:closure -->
