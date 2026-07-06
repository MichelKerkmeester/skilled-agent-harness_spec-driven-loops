---
title: "Decision Record: Phase 006 — Parent-Skill Canon Verification & Procedures Pattern Formalization"
description: "Accepted decision keeping the procedures/ companion-directory pattern and proceduresPath registry field an sk-design-local convention rather than sk-doc canon."
trigger_phrases:
  - "procedures pattern decision"
  - "sk-design-local convention"
  - "companion file policy formalization"
  - "three hubs extension matrix"
  - "rule of three"
importance_tier: "high"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/006-parent-skill-canon-verification"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Re-confirmed ADR-001 grounding with fresh Phase 006 execution evidence and accepted the decision."
    next_safe_action: "Phase 007 designs an sk-design-local procedure-card template (Path B), not a new sk-doc-wide template family."
---
# Decision Record: Phase 006 — Parent-Skill Canon Verification & Procedures Pattern Formalization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep `procedures/` + `proceduresPath` as an sk-design-Local Convention

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-06 |
| **Deciders** | Phase packet owner, user-provided task scope; accepted after fresh Phase 006 execution re-confirmed the grounding evidence |

---

<!-- ANCHOR:adr-001-context -->
### Context

Phase 003 introduced `procedures/` companion directories inside all five `sk-design` workflow-mode packets (`design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`) plus `shared/procedures/`, holding 14 private procedure cards total, and added a `proceduresPath` field per mode in `mode-registry.json` pointing at each mode's directory (for example, `"proceduresPath": "design-interface/procedures"`).

Grounding evidence re-confirmed fresh during Phase 006 execution:
- `parent-skill-check.cjs .opencode/skills/sk-design` was re-run fresh this phase and exited 0 with `OK: parent-skill-check — all hard invariants passed, 0 warnings` (22 PASS rows, 0 FAIL, 0 warnings) — the checker's directory-reverse-consistency check (6a) only reconciles hub-ROOT child directories against registered packets and an allowlist, and it never descends into a packet to look for `procedures/`; its companion-file checks (7-9) only inspect hub-root `changelog/`, `description.json`, `manual_testing_playbook/`, and `benchmark/`. Neither check path can see or verify `procedures/`.
- `parent_skills_nested_packets.md` §4 (Three Hubs Extension Matrix) documents `sk-code`, `sk-design`, and `deep-loop-workflows`. The `sk-design` row's Notes column reads "Transform-verbs example with five mode packets and required hub-router vocabulary" — no mention of `procedures/` or `proceduresPath`.
- `parent_skills_nested_packets.md` §6 (Companion file policy) states: "Every packet has `README.md`, `SKILL.md`, and `changelog/`. Surface packets also carry `references/` and `assets/` when they need evidence material." No mention of `procedures/`.
- A fresh `grep -rl "proceduresPath\|procedures/"` search under `.opencode/skills/sk-code` and `.opencode/skills/deep-loop-workflows` returned no matches, consistent with those being the other two hubs the reference doc documents and neither using the pattern. Rule-of-Three adoption is confirmed at 1 of 3 documented hubs.

The pattern is real, schema-visible (`proceduresPath` is a live field on every workflow mode), and useful: it lets each mode select private process guidance without bloating `SKILL.md` prose or exposing 14 public skills. But it is currently invisible to both the canon reference doc and the canon checker, and (per the grounding evidence above) has exactly one adopter.

### Constraints

- Preserve the single public `sk-design` advisor identity and its five public modes; this decision does not touch either, regardless of outcome.
- Any canon-doc promotion must not force `sk-code` or `deep-loop-workflows` to adopt a pattern they do not use.
- A canon-doc claim without checker enforcement creates an unverifiable documentation surface; a canon-doc claim should not outrun a real second adopter.
- Phase 007 (`procedure-card-template-alignment`) needs an unambiguous answer before it can scope its own template work.

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We decided**: Keep `procedures/` + `proceduresPath` as a deliberate sk-design-local convention. Do not add it to `parent_skills_nested_packets.md`'s Companion file policy (§6) as a universal companion-directory requirement, and do not add a new named extension (alongside `surface-axis`, `runtime-loop`, `advisor-projection`, `transform-verbs`, `deprecated-modes`) for it in §3.

We separately recommend, as narrow, purely descriptive future work that this phase does **not** perform itself: adding one factual sentence to sk-design's existing row in the §4 Three Hubs Extension Matrix Notes column, noting the `procedures/`/`proceduresPath` pattern as current behavior. That matrix's own stated purpose is "to describe current hub behavior without copying one hub's special machinery into another" — recording an accurate fact in an existing table is a documentation-accuracy fix, not a new canon pattern, and it is out of scope for Phase 006 to perform (this phase plans zero `sk-doc` edits).

**How it works**: Phase 007 designs and aligns an **sk-design-local** procedure-card template — most likely formalizing `procedure_card_schema.md` further, or extracting a template asset under `.opencode/skills/sk-design/shared/` — rather than contributing a new template family to `sk-doc`'s `assets/skill/` or a new canon section to `parent_skills_nested_packets.md`.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep sk-design-local (proposed)** | No premature abstraction; matches the Rule of Three; the canon checker stays honest about what it actually verifies | The pattern stays canon-checker-blind until a second hub adopts it | 8/10 |
| Formalize into §6 Companion file policy now | Gives future skills a documented, reusable pattern immediately | Promotes a one-hub pattern to a universal requirement before proof it generalizes; the canon checker still would not enforce it, creating doc/checker drift | 4/10 |
| Add a new named extension (e.g., `procedure-cards`) in §3 now | Matches the existing extension mechanism cleanly | Same one-adopter problem as above, plus adds a new extension keyword no hub-agnostic tooling reads yet | 4/10 |
| Formalize AND extend the checker in the same phase | Closes the doc/checker gap immediately | Out of scope for a verification-only phase; conflates a documentation decision with a checker-code change; belongs to a dedicated remediation phase if ever approved | 3/10 |

**Why this one**: The checker's own architecture already embodies the Rule of Three — named `extensions` in `mode-registry.json` "activate" fields only when a hub declares them, per `parent_skills_nested_packets.md` §3, specifically to avoid copying one hub's special machinery into another. Keeping `procedures/` local respects that same discipline until a second hub genuinely needs it.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Phase 007 has an unambiguous scope: sk-design-local template work, not `sk-doc` canon authoring.
- `sk-doc`'s canon reference stays accurate — it does not claim a pattern the checker cannot verify.

**What it costs**:
- A real, working, already-schema-visible pattern (`proceduresPath`) stays outside the canon reference for now. Mitigation: the Three Hubs Extension Matrix Notes-column update recommended above (as future, out-of-phase work) keeps it descriptively visible without promoting it to a requirement.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A second hub independently reinvents a similar pattern with different field names | M | Revisit this ADR the moment a second hub proposes a companion-directory pattern; converge on shared naming before either hub locks it in |
| `sk-doc`'s canon reference silently drifts from what `sk-design` actually does | L | Recommend (not perform) the descriptive Notes-column update to the existing Three Hubs Extension Matrix |
| Phase 007 misreads this decision and edits `sk-doc` anyway | M | This decision record and the `spec.md` handoff section both state the sk-design-local scope explicitly |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Phase 007 cannot scope its own template work without this decision |
| 2 | Beyond Local Maxima? | PASS | Compared local-only, full formalization, new-extension, and formalize-plus-checker-change options |
| 3 | Sufficient? | PASS | A documentation-only ADR is exactly the scope this phase needs; it does not overreach into checker code or card content |
| 4 | Fits Goal? | PASS | Directly answers the phase brief's stated second job (formalize-or-local) with an explicit, evidence-based answer |
| 5 | Open Horizons? | PASS | Names a concrete reconsideration trigger (a second hub adopting the pattern) rather than closing the door permanently |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: Nothing in `.opencode/skills/sk-design/**` or `.opencode/skills/sk-doc/**` changes as a result of this ADR. Phase 006's own docs record the accepted decision and its consequences for Phase 007. Acceptance follows Phase 006's own execution, which re-confirmed the grounding evidence in this record (a fresh checker run, a fresh canon-doc read, and a fresh Rule-of-Three check) before this ADR moved to Accepted.

**How to roll back**: If the repository owner disagrees with the recommendation once Phase 006 executes, revise this decision record's Decision section to Rejected/Superseded and record the alternative decision before Phase 007 begins. No file outside this phase folder needs to be touched to roll back a decision that made zero external edits.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
