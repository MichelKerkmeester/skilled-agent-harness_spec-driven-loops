---
title: "Verification Checklist: Application-witness (loaded-determinative)"
description: "Verification items for the APPLICATION WITNESS card section + proof_check.py --require-application-witness classifier gate, including acceptance (determinative/inert/none/malformed), no-regression, py_compile, evergreen, and scope-lock evidence rows."
trigger_phrases:
  - "application witness checklist"
  - "loaded determinative design build"
  - "proof_check require application witness"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/010-application-witness"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered witness section and classifier flag"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/assets/proof_of_application_card.md"
      - ".opencode/skills/sk-design/shared/scripts/proof_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Application-witness (loaded-determinative)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Targets read in full before edit (`proof_of_application_card.md` + `proof_check.py`) and the `--require-source-proof` scaffolding confirmed as the additive pattern to mirror
  - **Evidence**: both files read in full; the witness flag follows the same shape as `--require-source-proof` (new argv token `--require-application-witness` + heading-scoped `_find_application_witness_rows` + the new `application_witness` `check()` key)
- [x] CHK-002 [P0] Scope frozen to the 1 card + 1 script; `context_loaded_card.md` is NOT touched
  - **Evidence**: the build edited only `proof_of_application_card.md` and `proof_check.py`; `context_loaded_card.md` untouched; this phase folder authored docs only

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `## 7. APPLICATION WITNESS` section present in `proof_of_application_card.md` with a `[Output choice, Loaded rule source, Classification, Counterfactual]` table and the `not-loaded` / `loaded-inert` / `loaded-determinative` classifier line
  - **Evidence**: the section carries the 4-column table plus the classifier + honest-scope line, placed after `SOURCE PROOF`
- [x] CHK-011 [P0] Footer gate hint documents the stricter `--require-application-witness` mode
  - **Evidence**: the card footer names `--require-application-witness` ("require a well-formed `loaded-determinative` witness naming both the output choice and the loaded rule source") beside the existing `--require-source-proof` hint
- [x] CHK-012 [P0] `--require-application-witness` added additively; the checker classifies each witness row and requires ≥1 well-formed `loaded-determinative` witness — failing on `loaded-inert`-only / no witness, not on field presence alone
  - **Evidence**: `main()` parses `"--require-application-witness" in argv` beside `--json` / `--require-cards` / `--require-source-proof`; `_validate_application_witness` returns `ok` only when a well-formed determinative row exists (verified: inert-only → `no loaded-determinative witness`)
- [x] CHK-013 [P1] Parser skips header, `|---|` separator, and placeholder rows (mirrors `_find_source_proof_rows`); classification uses checked `[x]` detection; a `loaded-determinative` row needs a non-placeholder output choice AND rule source
  - **Evidence**: `_find_application_witness_rows` skips header/separator/placeholder rows; `_application_classification` checked-`[x]` regexes distinguish the three classes; a malformed determinative row yields `witness not well-formed` (verified)

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE: `--require-application-witness` passes on a card with a well-formed `loaded-determinative` witness
  - **Evidence**: a card naming a real output choice + the loaded rule that drove it, marked `[x] loaded-determinative`, yields `application_witness.ok` `True` (exit 0) — verified by orchestrator
- [x] CHK-021 [P0] ACCEPTANCE: a card whose only witness row is `loaded-inert` FAILS
  - **Evidence**: an inert-only card → `application_witness.ok` `False`, `missing = ['no loaded-determinative witness']` (exit 1) — verified
- [x] CHK-022 [P0] ACCEPTANCE: no witness rows FAILS, and a malformed determinative row FAILS
  - **Evidence**: placeholder-only rows → `application-witness rows missing`; a `[x] loaded-determinative` row missing output choice or rule source → `witness not well-formed` (exit 1 both) — verified
- [x] CHK-023 [P0] NO-REGRESSION + COMPILE: `--require-source-proof` and no-flag / `--json` / `--require-cards` identical to baseline; `python3 -m py_compile` exits 0; `check()` keys preserved
  - **Evidence**: a no-flag/`--json` run carries NEITHER `source_proof` NOR `application_witness` (original keys `fields/cards/ready/not_ready_flag/missing/ok`); `--require-source-proof` emits `source_proof` only; `py_compile` exit 0 — verified

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned: the loaded-but-inert gap is `class-of-bug` (a verification-floor gap — any "loaded" claim could pass without proof the rule shaped the output)
  - **Evidence**: the fix generalizes the floor from "loaded" to "loaded-determinative" through a reusable classifier (`_validate_application_witness`), not a one-off card edit; any future card is gated the same way
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: `proof_check.py` `check()` is the single verdict producer over the application proof card; the witness is the only new lane
  - **Evidence**: `check()` is the sole verdict assembler; the `application_witness` key is the only addition and folds into the existing `missing`/`ok` aggregation
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the new field (`application_witness`): only `check()` (folds into `missing`/`ok`) and `main()` (the `--require-application-witness` print branch) read it
  - **Evidence**: grep confirms no other reader of `application_witness`; the key is absent unless the flag is set
- [x] CHK-FIX-004 [P0] Adversarial table tests executed: determinative pass, inert-only, placeholder-only (none), malformed determinative, plus the no-flag no-op
  - **Evidence**: determinative → `ok True` (exit 0); inert-only → `no loaded-determinative witness`; placeholder-only → `application-witness rows missing`; malformed → `witness not well-formed`; no-flag → NEITHER `source_proof` NOR `application_witness` key
- [x] CHK-FIX-005 [P1] Matrix axes listed: classification (not-loaded / loaded-inert / loaded-determinative) × well-formedness (named choice+source / placeholder) × flag (set / unset)
  - **Evidence**: determinative+well-formed → pass; inert-only → no determinative; placeholder → rows missing; determinative+placeholder → not well-formed; flag unset → no-op (byte-stable result shape)

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The witness binds an output choice to a named loaded rule + a checked classification, not a self-attested boolean; a ready-claim cannot pass on "loaded" alone
  - **Evidence**: a ticked load checkbox no longer satisfies the gate — `_validate_application_witness` requires a well-formed `loaded-determinative` row (named choice + named rule); a malformed determinative row fails `witness not well-formed`
- [x] CHK-031 [P1] HONEST scope recorded: the witness proves an observable effect on ONE named choice, NOT that the design is good — taste stays advisory
  - **Evidence**: the "observable effect on one named output choice, not taste" framing appears in the card section, `spec.md` (NFR-H01 + OPEN QUESTIONS), and `implementation-summary.md`; the gate enforces the load-bearing link only, never quality

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: no spec/packet/phase IDs or spec paths embedded in the card or the script (grep clean)
  - **Evidence**: an evergreen grep over `proof_of_application_card.md` and `proof_check.py` returned no `specs/` paths or packet-phase IDs
- [x] CHK-041 [P1] spec/plan/tasks/checklist synchronized on the witness contract, the three-way classification, and the acceptance matrix
  - **Evidence**: spec.md, plan.md, tasks.md, and this checklist all carry the APPLICATION WITNESS block, the additive `--require-application-witness` flag, and the determinative/inert/none/malformed acceptance

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Only `proof_of_application_card.md` and `proof_check.py` modified; `context_loaded_card.md` untouched
  - **Evidence**: the build edited exactly those two files under `.opencode/skills/sk-design/`; `context_loaded_card.md` untouched
- [x] CHK-051 [P1] No temp/scratch files left outside the scratchpad
  - **Evidence**: acceptance fixtures live only in the session scratchpad; the working tree carries only the two modified skills files plus this phase folder's docs

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (post-build verification of the delivered APPLICATION WITNESS section and the additive `--require-application-witness` classifier flag)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
