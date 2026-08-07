---
title: "Tasks: sk-design remediation closeout"
description: "Planned task breakdown for the five items 007-consolidation-remediation left open. All tasks unchecked; nothing executed."
trigger_phrases:
  - "sk-design remediation closeout tasks"
  - "styles sha256 verification tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/008-remediation-closeout"
    last_updated_at: "2026-07-27T09:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Executed T001-T016; T017-T019 (Item 5) remain unchecked pending operator approval"
    next_safe_action: "Await operator go/no-go on Phase 5; separately triage pre-existing vitest lock-retry failure"
    blockers:
      - "Phase 5 requires an explicit operator go/no-go before any file is restored"
    key_files:
      - ".opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/scratch/styles.sha256.before"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-008-remediation-closeout-session"
      parent_session_id: null
    completion_pct: 80
    open_questions:
      - "Restore the eleven AI-tell fixture pairs, ai-fingerprint-registry.json, and the two parity scripts (not the rubric)? Recommendation on record: yes. Awaiting operator go/no-go."
    answered_questions: []
---
# Tasks: sk-design remediation closeout

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
## Phase 1: Setup

- [x] T001 Locate `006-design-mode-consolidation/scratch/styles.sha256.before` and confirm its own git history shows no drift since freeze — located, 7,812 entries
- [x] T002 Confirm root causes already isolated during planning for Phase 3 (`spec-doc-structure.ts:981-989`) and Phase 4 (`folder-discovery.ts:238-249`) still hold against the live tree before applying either fix — confirmed at `spec-doc-structure.ts:982` and `folder-discovery.ts:238-249`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Item 1 — Styles Integrity Verification — DONE, PASS
- [x] T003 Re-confirm the current `sk-design/styles/` tree's file count against the snapshot's entry count — 7,812 in both
- [x] T004 Run the SHA-256 equality check and record PASS/FAIL — **7,811/7,812 identical; 1 delta (`styles/README.md`)**
- [x] T005 If FAIL: escalate as a Logic-Sync conflict — not needed; the sole delta is `styles/README.md`, a known, deliberate 007 edit, not drift

### Item 2 — Regenerate The Design Benchmark Route Gold — DONE, PREMISE CORRECTED
- [x] T006 Separate live route-gold from frozen historical run records — **no live route-gold file exists**; `sk-design/benchmark/` holds only dated run-record folders. The playbook is gold and was already reconciled by 007. Historical set confirmed untouched.
- [x] T007 Full-playbook audit of `expected_workflow_mode` frontmatter — run at execution (beyond the 8-file planning sample); `TV-001`/`SR-002` confirmed correct, one residual fixed (`design-mode-pairing-before-run.md` stale `bundleRules` claim)
- [x] T008 Re-run the benchmark driver — **not executed; superseded by T006's finding.** `sk-design/benchmark/` has no live route-gold file to regenerate against, so a fresh run would add nothing the playbook audit didn't already cover.
- [x] T009 Re-check `TV-001.V2`, `TV-001.V3`, `SR-002.P3` by name — confirmed correct via the playbook audit (T007), not a fresh benchmark run

### Item 3 — Clear The 006 Validation Warning — DONE
- [x] T010 Choose fix path: **(a) extended `validateSpecDocSufficiency`** to scan whole-document body when zero anchors are present
- [x] T011 Applied the fix without rewriting `research.md`'s content — root cause was `parsed.anchors.some(...)` at `spec-doc-structure.ts:982` returning `false` unconditionally on zero anchors
- [x] T012 Re-ran `validate.sh 006-design-mode-consolidation --strict` — **Errors 0, Warnings 0**

### Item 4 — Fix The Dead --level Flag — DONE
- [x] T013 Added the missing `level` copy to `pickIncomingAuthoredOptionalFields()` (`folder-discovery.ts:247`)
- [x] T014 Rebuilt dist: `npm run build` in `.opencode/skills/system-spec-kit`
- [x] T015 Verified `--level 2` persists in `description.json` on a real generated folder — stripped, confirmed gone; regenerated, confirmed returned
- [x] T016 Re-ran the system-spec-kit workspace test suite — no new failures from this change; one pre-existing, unrelated failure found (`handler-memory-save.vitest.ts` lock-retry test), confirmed identical with/without the fix

### Item 5 — AI-Tell Fixture Restoration (OPERATOR-GATED)
- [ ] T017 [B] Record the operator's decision against the Open Question in `spec.md` §7 — no further task in this item proceeds without it
- [ ] T018 [B] If approved: restore the 11 fixture pairs, `ai-fingerprint-registry.json`, and `ai-fingerprint-self-defect-card.md` from `b217d74b81^` to their new `design-interface/assets/` landing paths — blocked on T017
- [ ] T019 [B] If approved: restore and repoint the two parity scripts (`ai-fingerprint-fixture-check.mjs`, `ai-fingerprint-registry-check.mjs`) at the restored paths, then re-run them — blocked on T018
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 All five items' verification commands run and recorded (T004, T008-T009, T012, T015-T016, T018-T019 as applicable) — **4/5 items (T004, T007/T009, T012, T015-T016); Item 5 (T018-T019) not applicable pending operator approval**
- [x] T021 No item silently dropped — Item 5 either executed with recorded approval or explicitly left pending — Item 5 explicitly left pending, recorded in `spec.md` §7
- [x] T022 `006 --strict` reaches Warnings 0 — confirmed
- [x] T023 `--level` persistence proven on a real folder, workspace suite green — persistence proven; suite shows no new failures from this fix, carries one pre-existing unrelated failure (see `implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All five items' verification commands run and recorded — **4/5; Item 5 remains Planned, operator-gated**
- [x] No item silently dropped — Item 5 either executed with recorded approval or explicitly left pending
- [x] `006 --strict` reaches Warnings 0
- [x] `--level` persistence proven on a real folder, workspace suite green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
