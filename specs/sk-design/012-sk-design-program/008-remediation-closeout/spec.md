---
title: "Feature Specification: sk-design remediation closeout"
description: "Plans the five items 007-consolidation-remediation left open: styles SHA-256 verification, design benchmark route-gold regeneration, the 006 validation warning, a shared spec-kit --level flag bug, and an operator-gated AI-tell fixture restoration decision."
trigger_phrases:
  - "sk-design remediation closeout"
  - "styles sha256 verification"
  - "design benchmark regeneration"
  - "generate-description level bug"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/008-remediation-closeout"
    last_updated_at: "2026-07-27T09:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Executed Phases 1-4 (styles, benchmark, 006-warning, --level fix); Phase 5 Planned"
    next_safe_action: "Await operator go/no-go on Phase 5; separately triage pre-existing vitest lock-retry failure"
    blockers:
      - "Phase 5 requires an explicit operator go/no-go before any file is restored"
    key_files:
      - ".opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/scratch/styles.sha256.before"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts"
      - ".opencode/skills/sk-design/manual-testing-playbook/hub-manager-intake/design-mode-pairing-before-run.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-008-remediation-closeout-session"
      parent_session_id: null
    completion_pct: 80
    open_questions:
      - "Restore the eleven AI-tell fixture pairs, ai-fingerprint-registry.json, and the two parity scripts (not the rubric)? Recommendation on record: yes. Awaiting operator go/no-go."
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-design remediation closeout

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Leaf packet |
| **Priority** | P2 |
| **Status** | In Progress — Phases 1-4 executed and verified 2026-07-27; Phase 5 remains Planned, operator-gated |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/012-sk-design-program` |
| **Evidence Base** | `007-consolidation-remediation/checklist.md` CHK-028, CHK-029, CHK-043; `implementation-summary.md` Known Limitations #1-3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`007-consolidation-remediation` shipped nine fixes and reached a full green gate set, but it explicitly recorded five items as deferred rather than dropped: two verification gates were never run (styles SHA-256 equality, the design benchmark), one validator warning on the sibling `006` packet was never diagnosed, and one capability decision (AI-tell fixture restoration) was left for the operator. While authoring this packet, a fifth item surfaced on its own: the `--level` flag on the spec-kit description generator silently drops the value it parses, a bug this very packet's own AFTER AUTHORING step will hit.

None of these five items reopen or correct the nine fixes 007 already shipped. They are the tail 007 named but did not chase.

### Purpose
Plan all five remaining items in one lean packet, ordered cheapest-and-most-confidence-enabling first, so each can be executed and verified independently without reopening 007's scope or inflating this packet beyond the five items it names.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
Five items, planned as five ordered phases in `plan.md` §4:
1. Styles SHA-256 equality check against the frozen `006/scratch/styles.sha256.before` snapshot.
2. Design benchmark route-gold regeneration and re-run against the live 4-mode/3-command topology.
3. Diagnosis and closure of `006`'s `SPEC_DOC_SUFFICIENCY` validation warning.
4. A one-line fix to the shared spec-kit description generator's dropped `--level` flag, plus a rebuild and verification.
5. An operator-gated decision to restore the eleven AI-tell fixture pairs and their parity check (not the rubric).

### Out of Scope
Carried forward from 007, still not re-litigated: restoring `/interface:audit` or `/interface:foundations` in any form; restoring the `/20` rubric, the P0-P3 severity model, report templates, or the evidence worksheet; reopening any of the nine fixes 007 already shipped and verified. Newly excluded by this packet: editing any file under `sk-design/benchmark/{baseline,after-*,compiled-routing}/` (frozen historical run records — provenance, not gold); executing Phase 5 without a recorded operator approval.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `006-design-mode-consolidation/scratch/styles.sha256.before` (read), `sk-design/styles/**` (read) | Verify — **DONE** | Phase 1 — 7,812 files recomputed against the frozen snapshot; 7,811 identical, 1 legitimate delta (`styles/README.md`, deliberately shrunk during 007). See `implementation-summary.md` Verification. |
| `sk-design/manual-testing-playbook/**` (read/audit) | Investigate — **DONE, premise corrected** | Phase 2 — no live route-gold exists to regenerate (`sk-design/benchmark/` holds only dated run records, not gold); the playbook is gold and was already reconciled by 007. One genuine residual fixed: `manual-testing-playbook/hub-manager-intake/design-mode-pairing-before-run.md` corrected to state `routerPolicy.bundleRules` is now `[]` (the `ui-build-bundle` entry it referenced no longer exists). |
| `mcp-server/lib/validation/spec-doc-structure.ts:981-989` (`validateSpecDocSufficiency`), rebuilt `dist/` | Modify — **DONE, shared tooling** | Phase 3 — added a whole-document-body fallback scan (`looksLikeCitation(document.content)`) when a research doc has zero anchors, instead of `parsed.anchors.some(...)` unconditionally returning false. Repo-wide blast radius: removes a false positive for every anchor-less deep-research packet. |
| `mcp-server/lib/search/folder-discovery.ts:247` (`pickIncomingAuthoredOptionalFields`), rebuilt `dist/` | Modify — **DONE, shared tooling** | Phase 4 — added `if (desc.level !== undefined) authored.level = desc.level;`, forwarding a field `description-schema.ts` already declared as known-authored-optional but the picker silently dropped. Repo-wide blast radius: this is the write path for every packet's `description.json`. |
| `sk-design/design-interface/assets/**` (11 fixture pairs), `ai-fingerprint-registry.json`, two parity scripts | Restore (gated) — **PLANNED** | Phase 5 — executes only on operator approval; not executed in this pass |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001** Phase 1's styles corpus check must run against the exact frozen snapshot (`006/scratch/styles.sha256.before`, 7,812 entries) and any mismatch must be escalated as a Logic-Sync conflict, not silently accepted.
- **REQ-002** Phase 2's benchmark regeneration must not modify or delete any file under `sk-design/benchmark/{baseline,after-*,compiled-routing}/`; fresh output lands in a new directory.
- **REQ-003** Phase 3 must bring `006-design-mode-consolidation` to `validate.sh --strict` Warnings 0 without rewriting `research.md`'s content.
- **REQ-004** Phase 4's fix must be verified end-to-end (parser → picker function → write payload → persisted `description.json`) on a real folder, not only at the parsing layer where the value already appeared to be handled correctly.
- **REQ-005** Phase 5 must not execute without an explicit, recorded operator go-ahead, and must not restore the deleted scoring apparatus (rubric, severity model, report templates, evidence worksheet) as a side effect.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **MET.** Styles SHA-256 equality confirmed 7,811/7,812 byte-identical, with the single delta (`styles/README.md`) traced to a deliberate, already-verified 007 edit — not drift.
- **REVISED, MET.** The planned "benchmark re-run" premise was wrong (no live route-gold to regenerate); investigation confirmed `TV-001`/`SR-002` are already correct and fixed one genuine residual (playbook `bundleRules` claim). No fresh benchmark run directory was created because none was needed — every historical run record is untouched.
- **MET.** `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation --strict` reports Errors 0, Warnings 0 (confirmed post-fix).
- **MET.** A folder generated with `--level 2` shows `"level": "2"` in its `description.json` (proven by strip/regenerate test). The system-spec-kit workspace test suite was re-run and shows no regression from this fix; it does carry one pre-existing, unrelated failure (`handler-memory-save.vitest.ts` lock-retry test), confirmed identical with and without the Phase 4 change — recorded as a known issue, not fixed here.
- **NOT MET — PLANNED.** The fixture-restoration decision has not been made; Phase 5 has not executed. Recommendation stands (see §7).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `006/scratch/styles.sha256.before` (7,812-line frozen snapshot) must itself be unmodified since freeze | A drifted baseline makes the Phase 1 comparison meaningless | Check the snapshot file's own git history before trusting it as baseline |
| Risk | Phase 2's live route-gold (`manual-testing-playbook/**` `expected_workflow_mode` frontmatter) was only spot-checked in this planning pass (8 sampled files, no retired-mode values found) | A full audit at execution time could still surface a stale scenario file this sample missed | **RESOLVED** — full audit run at execution; found one genuine residual (`design-mode-pairing-before-run.md` stale `bundleRules` claim), fixed; `TV-001`/`SR-002` confirmed already correct |
| Risk | Phase 4 touches `.opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts`, shared infrastructure consumed by every packet's `description.json` generation repo-wide | A bad fix regresses description generation for the whole repo, not just sk-design | **RESOLVED** — one-line addition to the existing picker function, verified end-to-end on a real folder; full workspace test suite re-run, no new failures introduced |
| Dependency | Phase 5 requires an explicit, recorded operator approval before any file is restored | Executing without it violates the operator-gated framing of this packet | Recorded as a hard blocker in `plan.md` Phase 5 and in this doc's `_memory.continuity.blockers`; **still unresolved** |
| Pre-existing defect (found, not fixed) | `mcp-server/tests/handler-memory-save.vitest.ts` — "retries through a filesystem-backed lock when another process already holds the spec-folder lock" fails (1 failed / 14 passed), confirmed identical with and without the Phase 4 change | Unrelated to this packet's fixes; nobody is currently tracking it | Recorded here as a known issue; recommend triaging separately, outside this packet's scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Restore the eleven `clean.html`/`tell.html` fixture pairs, `ai-fingerprint-registry.json`, `ai-fingerprint-self-defect-card.md`, and the two parity scripts (`ai-fingerprint-fixture-check.mjs`, `ai-fingerprint-registry-check.mjs`) deleted at `b217d74b81`, without restoring the `/20` rubric or severity model? The recommendation already on record (carried from 007) is yes — fixtures are the cheap half and the only half that produces evidence. This packet does not execute that restoration; it records the decision point and waits.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Predecessor packet, source of four of the five items:** `../007-consolidation-remediation/` — see its `checklist.md` CHK-028, CHK-029, CHK-043 and `implementation-summary.md` Known Limitations #1-3.
- **Consolidation packet the deferred items trace back to:** `../006-design-mode-consolidation/`.
- **Deletion commit for the Phase 5 fixtures:** `b217d74b81` ("refactor(sk-design): retire the audit and foundations commands"); all deleted paths recoverable from `b217d74b81^`.
