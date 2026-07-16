---
title: "Implementation Summary: Deep-Review 017-021 Remediation [027/002/005/006]"
description: "State of the 017-021 remediation packet: authoring step complete (docs + metadata), no fixes applied. Records the finding inventory carried into tasks, the severity-locked P1, and what the later implementation step must deliver."
trigger_phrases:
  - "017-021 remediation summary"
  - "deep review remediation status"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "deep-review-remediation-author"
    recent_action: "Authored remediation packet from 017-021 deep-review syntheses; no fixes applied"
    next_safe_action: "verify c006 renderer then begin per-file remediation"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-deep-review-017-021-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the slash-command renderer substitute $ARGUMENTS raw or shell-quoted?"
    answered_questions: []
---
# Implementation Summary: Deep-Review 017-021 Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation |
| **Status** | In Progress — implementation work pending |
| **Level** | 3 |
| **Created** | 2026-06-17 |
| **Source reviews** | 017 (CONDITIONAL) · 018 / 019 / 020 / 021 (PASS) |
| **Findings carried** | 0 P0 · 1 P1 · ~20 P2 (code + doc + test) |
| **Completion** | 0% — this is the remediation authoring step; the fix step is separate |
<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

This authoring step produced the remediation packet only — no reviewed code or 017-021 phase doc was touched. Delivered:

- **spec.md** — remediation scope, current-state (4 PASS + 017 CONDITIONAL, 0 P0, 1 P1, rest P2/doc-drift), the authoritative target-file manifest, and the open question that gates the P1.
- **plan.md** — eight-workstream sequencing with the severity-lock control flow and the cancellation/marker data flow for fix grounding.
- **tasks.md** — 35 tasks across 8 workstreams, each naming a target file + concrete change, severity-tagged (`[P1]`/`[P2-code]`/`[P2-doc]`/`[P2-test]`/`[P2-opt]`), confidence-tagged (`{confirmed-by-code}` vs `{needs-in-task-verification}`), and traceable to its synthesis finding via `<trace:…>`.
- **checklist.md** — quality gates incl. the `fix-completeness` block keyed to the P1 and per-finding coverage.
- **decision-record.md** — ADR-001 (severity-lock), ADR-002 (honor verdicts), ADR-003 (workstream split), ADR-004 (reconcile-to-impl-summary).
- **description.json** + **graph-metadata.json** — generated metadata (memory/graph visibility).

### Files Changed (this authoring step)

| File | Action | Purpose |
|------|--------|---------|
| `006-…/spec.md` | Created | Remediation scope + target manifest + P1 open question |
| `006-…/plan.md` | Created | Workstream sequencing + severity-lock flow |
| `006-…/tasks.md` | Created | 35 traceable, severity+confidence-tagged tasks |
| `006-…/checklist.md` | Created | Gates incl. fix-completeness |
| `006-…/decision-record.md` | Created | 4 ADRs |
| `006-…/implementation-summary.md` | Created | This file |
| `006-…/description.json` | Generated | Memory index metadata |
| `006-…/graph-metadata.json` | Generated | Graph traversal metadata |
<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Read all five syntheses (017-021) under `027/002/review/synthesis/`.
2. Extracted every CONFIRMED finding (the syntheses re-verified each against cited code); excluded every rejected/refuted/already-resolved item.
3. Classified the packet as **Level 3** (one confirmed P1 + ~6 code files + multiple doc folders + a command template + tests across 5 phases warrants architecture-level docs incl. decision-record).
4. Mapped findings one-to-one into eight workstreams; tagged each task with severity, confidence, and a synthesis trace.
5. Encoded the severity-lock as the first task (T001) so the P1 fix cannot run before the renderer-behavior verification.
6. Authored from the system-spec-kit Level 3 templates; generated description.json + graph-metadata.json; validated with `validate.sh --strict`.
<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Severity-lock the P1 (ADR-001) | Verify renderer `$ARGUMENTS` handling before fixing — correct under both raw and quoted renderers; no dead work, no live-sink risk |
| Honor synthesis verdicts (ADR-002) | Each verdict was checked against code; re-escalating re-introduces verified false-positives (e.g. the atomic-write-throw family) |
| Workstream split, one finding → one task (ADR-003) | Maximal traceability; per-workstream verification gate; surfaces the dominant 017 doc-drift |
| Reconcile docs toward impl-summary (ADR-004) | The impl-summary is the truth source; guard it against bulk regen |
| Carry optional cosmetic nits as `[P2-opt]`, not drop them | Preserves the syntheses' low-value-but-real items without forcing them into scope |
<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Details |
|------|--------|---------|
| Findings extraction | Complete | Every CONFIRMED row across 5 syntheses mapped to a task; refuted items excluded |
| One-to-one mapping (SC-002) | Complete | 35 tasks; no orphan finding, no fabricated finding |
| Severity + confidence tags (SC-003) | Complete | Each task tagged; T001 is the `{needs-in-task-verification}` severity-lock |
| Refuted-exclusion (SC-004) | Complete | 018 mimo-1, 019/020 D6/D7/D8 + foreground-marker, 021 B8/A3 listed Out of Scope + T034 |
| `validate.sh <this-packet> --strict` (SC-005) | See packet validation run | Authored to the Level 3 contract (required docs + anchors + continuity block) |

**The later implementation step still owes**: the actual fixes, each test-gated (baseline→delta) for code and validate.sh-gated for docs. This packet asserts none of that work is done.
<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The P1 severity is unresolved by design** — T001 (renderer `$ARGUMENTS` behavior) must be verified in the implementation step before T002 can be classified as a code fix or a doc-note. This packet deliberately leaves it open.
2. **No fixes applied** — every finding is a pending task; `completion_pct` is 0 and status is `not-started`.
3. **Line numbers may drift** — cited `file:line` values are from the syntheses (commit-time for 021 = `372bb0f2cd`); each code task re-confirms its cite against the live file before editing.
4. **Optional cosmetic nits are deferred** — 017 c001/c005, 019/020 marker dedup/log, 021 backlog singletons are carried as `[P2-opt]` and may be bundled or dropped with documented reason.
5. **Out-of-scope follow-ons remain** — the launcher lease-heartbeat mid-scan re-election and synchronous-path cancellability are the phases' own documented follow-ons, not carried here.
<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:follow-up -->
## Follow-Up Items

- [ ] Implementation step: run T001 (renderer verification) → T002 (P1 close at verified severity)
- [ ] Implementation step: 017 systemic doc-drift reconciliation across 7 children (T003)
- [ ] Implementation step: 018/019/020/021 code + doc + test tasks (T004-T031), each gated
- [ ] Implementation step: close-out — baseline→delta, validate.sh --strict, checklist evidence (T032-T035)
<!-- /ANCHOR:follow-up -->
