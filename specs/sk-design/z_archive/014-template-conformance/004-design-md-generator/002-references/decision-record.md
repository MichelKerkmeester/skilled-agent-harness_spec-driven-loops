---
title: "Decision Record: design-md-generator vendor exemplar placement"
description: "ADR-001 decides whether the 4-vendor DESIGN.md exemplar tree under references/examples/ relocates out of references/ or stays under a documented exemption, since the exemplars are output samples, not skill reference docs, yet a mechanical audit flags them either way."
trigger_phrases:
  - "vendor exemplar placement decision"
  - "references examples relocate or exempt"
  - "DESIGN.md exemplar conformance ADR"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/002-references"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Draft ADR-001 for the vendor exemplar placement decision"
    next_safe_action: "Read overview.md + package_skill.py to confirm exemption authority, then decide"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/references/examples/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: design-md-generator vendor exemplar placement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Where do the vendor DESIGN.md exemplars live relative to references/?

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed — not yet decided |
| **Date** | 2026-07-27 |
| **Deciders** | Pending (this child's audit execution) |
| **Supersedes** | n/a (first ADR for this packet) |

---

<!-- ANCHOR:adr-001-context -->
### Context

`references/examples/` holds four vendor subdirectories — `linear/`, `stripe/`, `supabase/`, `vercel/` — each with `DESIGN.md`, `tokens.json`, and `writing-notes.md` (8 markdown files total, plus a top-level `editorial-exemplar.md`). None of the 8 vendor files has a numbered H2, none has an OVERVIEW section, and each declares `contextType: reference`, a value outside the template's allowed enum (`planning` | `research` | `implementation` | `general`). `stripe/DESIGN.md` alone is 618 lines.

These files are not skill reference documentation in the ordinary sense — they are captured, literal output exemplars showing what the `design-md-generator` mode produces when it extracts a real site's design system. Their entire value is fidelity to the generator's actual output format, not conformance to `skill-reference-template.md`. But they live at `references/examples/`, so `package_skill.py` and any template-diff audit see them as reference docs and flag every one of the above as a defect.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Not yet made.** This ADR is a Proposed placeholder recording the decision framework this child's execution must resolve. The two live options are:

1. **Relocate** — move `examples/` out of `references/` to a path that does not carry reference-template conformance expectations (e.g. a packet-root `examples/` sibling to `assets/`/`procedures/`, or nest under `assets/examples/`), then update any cross-reference from `SKILL.md` or `extraction-workflow.md`.
2. **Exempt in place** — keep `examples/` at its current path, and add an explicit, discoverable exemption note (in `references/examples/editorial-exemplar.md` or a new short `references/examples/README.md`) stating these files are generator-output exemplars exempt from `skill-reference-template.md`'s H2/OVERVIEW/`contextType` rules, with the exemption's authority cited.

Whichever option this child executes, the outcome MUST be recorded back into this ADR's Decision section before the child claims completion — a Proposed ADR left unresolved is not a valid completion state.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Relocate out of `references/`** | Removes the false-positive from every future mechanical audit; the folder name stops implying reference-doc conformance | Requires a cross-reference sweep and possibly a path update in `SKILL.md`/`extraction-workflow.md` | Candidate |
| **Exempt in place** | No file movement, no cross-reference risk | The exemption note itself must be maintained and re-discovered by every future auditor; easy to go stale | Candidate |
| **Rewrite exemplars to add H2s/OVERVIEW/valid `contextType`** | Passes every mechanical check with no structural change | Destroys the exemplars' value as literal, unedited output samples — the entire point is to show what the generator actually produces | Rejected |
| **Do nothing, leave flagged forever** | Zero effort | Every future audit re-discovers the same "defect," wasting review cycles on a known non-issue | Rejected |
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- **If relocated:** future template-diff audits of `references/` stop flagging the exemplars; the generator's actual extraction output moves to a path whose purpose (worked examples, not authored reference) is legible from location alone. Any hardcoded path to `references/examples/` elsewhere in the packet must be found and updated.
- **If exempted in place:** the exemplars stay where operators may expect to find them (next to the format doc they demonstrate), but the exemption note becomes a permanent maintenance surface that must survive future doc-quality sweeps without being "corrected" back into a false defect.
- **Either way:** this child's checklist item CHK-022/CHK-023 requires the decision be both recorded and executed, not left as an open question for a future audit to re-litigate.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The exemplars are flagged by every mechanical audit today with no resolution on record |
| 2 | **Beyond Local Maxima?** | PASS | Relocate vs. exempt-in-place vs. rewrite vs. ignore are all named and weighed |
| 3 | **Sufficient?** | PENDING | Awaits execution: cross-reference sweep (relocate) or exemption authoring (exempt) |
| 4 | **Fits Goal?** | PASS | Either candidate resolves the false-positive without destroying the exemplars' value |
| 5 | **Open Horizons?** | PASS | A future sk-design mode adding its own generator-output exemplars can reuse whichever pattern this ADR lands on |

**Checks Summary**: 3/5 PASS, 2 PENDING (decision not yet executed)
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: Pending the decision above — either a `git mv` of `references/examples/` plus a cross-reference update, or a new exemption note authored in place.

**How to roll back**: If relocated, `git mv` back to the original path restores the pre-decision state. If exempted in place, deleting the exemption note restores the pre-decision state. Either rollback is a single-commit revert with no other packet surface touched.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
