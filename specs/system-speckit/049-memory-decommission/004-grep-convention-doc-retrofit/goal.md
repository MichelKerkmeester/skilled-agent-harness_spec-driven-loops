---
title: "Goal: Phase 4: grep-convention-doc-retrofit"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit"
    last_updated_at: "2026-09-02T20:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Criteria re-baselined against the ripgrep research"
    next_safe_action: "Write and commit the convention before touching any document"
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
# Goal: Phase 4: grep-convention-doc-retrofit

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Define a grep-optimized spec-doc convention, enforce it in templates and validate.sh, and retrofit it across every active spec document without changing any document body.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Retrofit all active documents, not new-only; z_archive is excluded |
| D2 | The convention governs canonical frontmatter keys and aliases, an author-controlled trigger allowlist with generic negatives, exact anchor grammar, one-fact-per-line for new structured sections only, and naming rules; prose is never reflowed |
| D3 | The body-preservation invariant is an exact preimage rule: the protected region is the body with whole-line anchor markers removed, hashed before and after |
| D4 | The convention is written and committed before any document is modified |
| D5 | The retrofit is mechanical and idempotent: enumerate every variant, dry-run, process, rescan for residue |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] The convention document exists and predates the first retrofitted file in git history
- [ ] `validate.sh` fails a fixture document that violates the convention
- [ ] Templates produce a conforming document with no manual step
- [ ] The retrofit residue rescan reports zero unresolved variants and no z_archive document was processed
- [ ] A second retrofit run produces no diff
- [ ] Every retrofitted document's body preimage hash is unchanged
- [ ] The trigger index regenerates cleanly with a phrase count at or above the pre-retrofit baseline
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Research input | Done | `../005-ripgrep-retrieval-research/research/lineages/luna-max/research.md` sections 6.3, 8, 12 and 16 |
| Spec, plan, tasks and acceptance amended | Done | convention contract sections 13 to 15, REQ-008 to REQ-015, T011 to T028, AC-001 to AC-016; validate --strict 0 errors |
| Build | Pending | - |

### Deviations and findings

| Item | Note |
|------|------|
| Marker retrofit versus no body rewrite resolved | The preimage excludes whole-line anchor markers, so marker retrofit sits outside the protected region by construction |
<!-- /ANCHOR:log -->
