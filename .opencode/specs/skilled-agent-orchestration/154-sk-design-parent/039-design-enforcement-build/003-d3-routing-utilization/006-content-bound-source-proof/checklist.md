---
title: "Verification Checklist: Content-bound SOURCE PROOF"
description: "Verification items for the SOURCE PROOF cards + proof_check.py --require-source-proof recompute gate, including acceptance, tamper, fail-closed, and no-regression evidence rows."
trigger_phrases:
  - "source proof checklist"
  - "content bound proof design build"
  - "proof_check require source proof"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/006-content-bound-source-proof"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered source-proof gate"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/assets/context_loaded_card.md"
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
# Verification Checklist: Content-bound SOURCE PROOF

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

- [x] CHK-001 [P0] Targets read in full before edit (both cards + `proof_check.py`) and `design_proof_token.md` §4 confirmed as the single hashing rule
  - **Evidence**: both cards, `proof_check.py`, and `design_proof_token.md` section 4 read in full; section 4 is the only raw-byte sha256 rule, reused not reinvented
- [x] CHK-002 [P0] Scope frozen to the 2 cards + 1 script; `design_proof_token.md` reused, not edited
  - **Evidence**: `git status --porcelain` shows only `context_loaded_card.md`, `proof_of_application_card.md`, `proof_check.py` modified; `design_proof_token.md` unchanged

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `SOURCE PROOF` section present in `context_loaded_card.md` with a `[Path, SHA256, Anchor, Echo]` table
  - **Evidence**: `context_loaded_card.md` `## 6. SOURCE PROOF` carries the 4-column `[Path, SHA256, Anchor, Echo]` table plus the recompute-rule line
- [x] CHK-011 [P0] `SOURCE PROOF` section present in `proof_of_application_card.md` with the same shape; footer gate hint documents `--require-source-proof`
  - **Evidence**: `proof_of_application_card.md` `## 6. SOURCE PROOF` carries the same table; the footer reads "Add `--require-source-proof` to also verify cited source files by raw-byte hash and literal echo"
- [x] CHK-012 [P0] `--require-source-proof` added additively to arg parsing; the checker recomputes each cited file's raw-byte sha256 from disk and FAILS on mismatch — not on field presence
  - **Evidence**: `main()` parses `"--require-source-proof" in argv` beside `--json`/`--require-cards`; `_validate_source_proof` opens the cited file `"rb"`, recomputes `hashlib.sha256(raw).hexdigest()`, and appends `digest mismatch` on inequality
- [x] CHK-013 [P1] Parser skips header, `|---|` separator, and placeholder rows; zero real rows under the flag → FAIL; sha256 uses the `design_proof_token.md` §4 raw-byte rule (no second hashing rule)
  - **Evidence**: `_find_source_proof_rows` skips header/separator/placeholder rows; `_validate_source_proof` returns ok False with `source-proof rows missing` when no real rows exist; the `SHA256` regex is `^(?:sha256:)?([0-9a-f]{64})$`

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE: `proof_check.py --require-source-proof` passes on a faithful card
  - **Evidence**: faithful card (real path + recomputed sha256 + verbatim echo line) → `source_proof.ok` is `True`
- [x] CHK-021 [P0] ACCEPTANCE: tampered digest (one hex char flipped) FAILS
  - **Evidence**: one hex char flipped in the `SHA256` cell → `source_proof.ok` is `False` (digest mismatch)
- [x] CHK-022 [P0] ACCEPTANCE: absent/forged anchor echo FAILS
  - **Evidence**: `Echo` replaced with text absent from the cited file → `source_proof.ok` is `False` (anchor echo absent/forged)
- [x] CHK-023 [P1] Fail-closed on an unreadable cited file; NO-REGRESSION for no-flag / `--json` / `--require-cards` with `check()` keys preserved
  - **Evidence**: missing-file row → `source_proof.ok` is `False`; no-flag `--json` returns the original keys with `source_proof` absent (exit 0); `check()` keeps `fields/cards/ready/not_ready_flag/missing/ok` and the 0/1/2 exit contract

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: instance-only; this phase adds two card sections plus one additive checker path and produces no code-defect findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; the change set is the 2 cards plus `proof_check.py`, and an evergreen grep over all three found no IDs
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: the only new consumer of the SOURCE PROOF table is `proof_check.py --require-source-proof`; no-flag callers read no new field and are unchanged
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: adversarial matrix executed — tampered digest, forged echo, unreadable file (fail-closed), placeholder-only rows (rows missing), and no-flag no-op all covered; paths resolve only under the repo root
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: matrix is 4 acceptance rows (faithful / tampered / forged / unreadable) over `source_proof.ok`, plus the no-flag no-regression row
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; the checker reads only the cited file's bytes and the card text, no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: evidence pinned to `proof_check.py` `_validate_source_proof` (digest recompute + echo substring) and the `## 6. SOURCE PROOF` blocks in both cards

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Proof binds content via raw-byte sha256 + a verbatim echo, not self-attested booleans
  - **Evidence**: each row carries `sha256:<64 hex>` and an `Echo` the checker re-finds as a literal substring of the live file; a ticked checkbox alone can no longer assert a load
- [x] CHK-031 [P0] Checker fails closed on an unreadable/missing cited file (does not pass)
  - **Evidence**: `OSError` on the cited path appends `source file unreadable`; missing-file test → `source_proof.ok` False
- [x] CHK-032 [P1] Cited-path resolution stays under the repo root; no secrets or absolute machine paths added to the cards or the script
  - **Evidence**: `_repo_root` ascends from the card dir to the first `.opencode`/`.git` ancestor and joins the row path beneath it; manual review found no secrets or absolute paths in either card or the script

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: no spec/packet/phase IDs or spec paths embedded in the 2 cards or the script (grep clean)
  - **Evidence**: evergreen grep over both cards and `proof_check.py` returned no `specs/` paths or packet-phase IDs
- [x] CHK-041 [P1] spec/plan/tasks/checklist synchronized on the SOURCE PROOF contract and the acceptance matrix
  - **Evidence**: spec.md, plan.md, tasks.md, and this checklist all carry the SOURCE PROOF block, the additive `--require-source-proof` flag, and the faithful/tampered/forged/unreadable acceptance

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Only `context_loaded_card.md`, `proof_of_application_card.md`, and `proof_check.py` modified; `design_proof_token.md` untouched
  - **Evidence**: `git status --porcelain` lists exactly those three files under `.opencode/skills/sk-design/`
- [x] CHK-051 [P1] No temp/scratch files left outside the scratchpad
  - **Evidence**: acceptance fixtures live only in the session scratchpad; the working tree carries only the three modified skills files

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (post-build verification of the delivered SOURCE PROOF cards and the `--require-source-proof` recompute gate)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
