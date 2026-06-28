---
title: "Tasks: Content-bound SOURCE PROOF"
description: "Ordered implementer items to add SOURCE PROOF to both proof cards and a recompute-based proof_check.py --require-source-proof flag, with tamper + no-regression verification."
trigger_phrases:
  - "source proof tasks"
  - "content bound proof design build"
  - "proof_check require source proof"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
# Tasks: Content-bound SOURCE PROOF

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Prep + Cards (40m)

- [ ] T001 Re-read targets fully + `design_proof_token.md` §4 to confirm the single raw-byte sha256 rule (`context_loaded_card.md`, `proof_of_application_card.md`, `proof_check.py`, `../../references/design_proof_token.md`) [10m]
- [ ] T002 Add a `SOURCE PROOF` section to `context_loaded_card.md`: recompute-rule line + 4-column table `[Path, SHA256, Anchor, Echo]` with placeholder rows; place as the new last numbered section (`.opencode/skills/sk-design/shared/assets/context_loaded_card.md`) [15m]
- [ ] T003 Add the same `SOURCE PROOF` section to `proof_of_application_card.md`, and extend the footer gate hint to document the stricter `--require-source-proof` mode (`.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`) [15m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Checker (2h)

### Arg parsing (additive)
- [ ] T004 [P] Add `--require-source-proof` token to arg parsing beside `--json` / `--require-cards`; keep `paths` filtering on `--` prefix intact (`.opencode/skills/sk-design/shared/scripts/proof_check.py`) [15m]

### SOURCE PROOF parsing
- [ ] T005 Implement a parser that locates the `/SOURCE PROOF/i` heading, reads the first markdown table beneath it (until next heading), extracts 4-cell rows in fixed order `[Path, SHA256, Anchor, Echo]`, and skips the header, the `|---|` separator, and placeholder rows (underscores/whitespace/empty) (`proof_check.py`) [30m]

### Recompute + echo
- [ ] T006 Implement repo-root resolution (ascend from the card dir to the first ancestor with `.opencode/` or `.git/`, fall back to cwd) and resolve each `Path` to an absolute path (`proof_check.py`) [20m]
- [ ] T007 Implement raw-byte sha256 recompute: `open(path, "rb")` → `hashlib.sha256(bytes).hexdigest()`; compare to the declared digest (lowercased, `sha256:` prefix tolerant) per `design_proof_token.md` §4; FAIL on mismatch (`proof_check.py`) [20m]
- [ ] T008 Implement echo verbatim verification: decode the cited file (utf-8) and require the `Echo` string as a literal substring; FAIL on empty/placeholder/absent echo; FAIL closed on unreadable cited file (`proof_check.py`) [20m]

### Integration (no-regression safe)
- [ ] T009 Thread the source-proof result into the `check()` return as a new key and fold failures into `missing`/`ok` ONLY when `--require-source-proof` is set; leave existing keys (`fields`, `cards`, `ready`, `not_ready_flag`, `missing`, `ok`) and the 0/1/2 exit contract unchanged (`proof_check.py`) [15m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification (1h)

### Acceptance
- [ ] T010 Build a faithful sample card (real path, correct recomputed sha256, real echo quote) and confirm `proof_check.py --require-source-proof <card>` exits 0 [15m]
- [ ] T011 Tamper test (digest): flip one hex char in a `SHA256` cell; confirm exit 1 with a digest-mismatch reason [10m]
- [ ] T012 Tamper test (echo): replace the `Echo` cell with text absent from the cited file; confirm exit 1 with an anchor-absent/forged reason [10m]

### No-regression
- [ ] T013 Run `proof_check.py <card>`, `proof_check.py --json <card>`, `proof_check.py --require-cards <card>` and confirm output + exit code are identical to the pre-change baseline [15m]
- [ ] T014 Fail-closed check: point a SOURCE PROOF row at a missing/unreadable file; confirm exit 1 (does not pass) [5m]

### Audits
- [ ] T015 Evergreen audit: grep the 2 cards + script for spec/packet/phase IDs and spec paths; confirm none present [5m]
- [ ] T016 Scope-lock audit: confirm only `context_loaded_card.md`, `proof_of_application_card.md`, `proof_check.py` are modified (no edit to `design_proof_token.md`) [5m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Faithful card passes; tampered digest and forged/absent echo both fail
- [ ] No-regression confirmed for no-flag / `--json` / `--require-cards`
- [ ] Evergreen + scope-lock audits pass
- [ ] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Reused contract**: `../../references/design_proof_token.md` §4 (raw-byte sha256 + canonicalization)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates, explicit verification + tamper tasks)
-->
