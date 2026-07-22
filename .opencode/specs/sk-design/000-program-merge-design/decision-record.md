---
title: "Decision Record: sk-design 012 Program Merge"
description: "The load-bearing decisions for consolidating sk-design 012–018 into one multi-phased 012 parent: regroup depth (full thematic vs append-only), the fate of this temporary 000 packet, and the theme names/numbering map. Each needs operator sign-off before the SOL-agent execution."
trigger_phrases:
  - "sk-design 012 merge decisions"
  - "regroup depth thematic vs append sk-design"
  - "sk-design program merge ADR"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/000-program-merge-design"
    last_updated_at: "2026-07-22T15:15:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded merge decisions D1-D3"
    next_safe_action: "Operator signs off the decisions"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/000-program-merge-design/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-000-merge-design-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Decision Record: sk-design 012 Program Merge

<!-- ANCHOR:adr-001 -->
## ADR-001: Regroup depth — full thematic regroup (D1)

<!-- ANCHOR:adr-001-context -->
### Context
`012` is already a 10-child phase parent. "Merge all 8 into one multi-phased 012" + "Regroup, rewrite spec
folder names" can mean either a full thematic reorganization of ALL work (incl. `012`'s current 001-010) or
merely appending `013–018` as new `012` children `011+`. The approved plan sketched themed phases (Research /
Style-DB / Interface-Commands / Hallmark / Reviews), i.e. the full regroup.
<!-- /ANCHOR:adr-001-context -->
<!-- ANCHOR:adr-001-decision -->
### Decision
**Full thematic regroup (recommended).** `012` becomes the umbrella; every packet (including current
`012/001-010`) is re-homed into one of 5 themed phases. Themes = the natural groupings already present.
<!-- /ANCHOR:adr-001-decision -->
<!-- ANCHOR:adr-001-alternatives -->
### Alternatives
- **Append-only (low disruption):** keep `012/001-010`; add `013–018` as `012/011+`. Preserves most
  pointers/history, but leaves the interleaving (research/build/review mixed) and produces no coherent
  narrative — fails the "rewrite for historic context" intent. *Offered as the fallback if the operator wants
  to shrink blast radius.*
- **New top-level program folder** (not `012`): rejected — operator fixed the number as `012`.
<!-- /ANCHOR:adr-001-alternatives -->
<!-- ANCHOR:adr-001-consequences -->
### Consequences
Full regroup touches ~40 `packet_pointer`s + many cross-refs (large, mechanical). Mitigated by a
deterministic map, `git mv` (history), and `validate --recursive` + content-diff gates. Delivers the coherent
program narrative + retrospective the operator asked for.
<!-- /ANCHOR:adr-001-consequences -->
<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation
| Check | Assessment |
|-------|-----------|
| Simplicity | Append-only is simpler; full regroup is what the intent ("historic context") requires |
| Systems | Touches only spec-folder paths/metadata/refs — no runtime |
| Bias | Confirm the operator truly wants the disruptive full regroup (this ADR is the confirmation gate) |
| Sustainability | A themed tree is far more navigable long-term than 8 interleaved siblings |
| Scope | Large but bounded + reversible (worktree) |
<!-- /ANCHOR:adr-001-five-checks -->
<!-- ANCHOR:adr-001-impl -->
### Implementation Note
If the operator downgrades to append-only, `tasks.md`'s move map collapses to just re-homing `013–018` under
`012/011+` and skips reorganizing `012/001-010`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Fate of this temporary 000 packet (D2)

<!-- ANCHOR:adr-002-context -->
### Context
The operator called `000` a "temporary" design packet. After the merge executes, it can be deleted or kept
as the merge's design record.
<!-- /ANCHOR:adr-002-context -->
<!-- ANCHOR:adr-002-decision -->
### Decision
**Delete after merge (operator-chosen 2026-07-22).** Once the merged `012` tree validates clean, `git rm -r`
this `000-program-merge-design` packet — its design rationale has served its purpose and the operator prefers
no scratch packet in the final tree. The WHY of the tree is captured in the `012` root narrative +
`retrospective.md`, so no provenance is lost.
<!-- /ANCHOR:adr-002-decision -->
<!-- ANCHOR:adr-002-alternatives -->
### Alternatives
Delete `000` after the merge (cleaner tree, loses the design rationale). Offered if the operator prefers no
scratch packet in the final tree.
<!-- /ANCHOR:adr-002-alternatives -->
<!-- ANCHOR:adr-002-consequences -->
### Consequences
Keeping it adds one small packet; deleting it loses the design provenance. Either is trivial to execute.
<!-- /ANCHOR:adr-002-consequences -->
<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation
| Check | Assessment |
|-------|-----------|
| Simplicity | Delete is simplest; keep adds provenance value |
| Systems | None |
| Bias | — |
| Sustainability | Keeping the rationale helps future readers |
| Scope | Trivial either way |
<!-- /ANCHOR:adr-002-five-checks -->
<!-- ANCHOR:adr-002-impl -->
### Implementation Note
Final step of the merge: `git rm -r` `000-program-merge-design` after the merged tree validates clean (D2 =
delete after merge).
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Theme names, numbering, and the source→target map (D3)

<!-- ANCHOR:adr-003-context -->
### Context
Five themed phases need stable names + numbers, and every source packet needs a target path.
<!-- /ANCHOR:adr-003-context -->
<!-- ANCHOR:adr-003-decision -->
### Decision
Five phases: `001-research`, `002-style-database`, `003-interface-commands`, `004-hallmark-design-system`,
`005-reviews-and-remediation`. Full source→target map in `tasks.md`. Leaf packets keep their descriptive
slugs (renumbered within their phase); the two already-nested phase parents (`012/007`, `015/009`) keep
their sub-children.
<!-- /ANCHOR:adr-003-decision -->
<!-- ANCHOR:adr-003-alternatives -->
### Alternatives
Chronological numbering (preserve original order) vs thematic (chosen — reads better). More or fewer themes
(e.g. split Research into style-db-research vs design-research) — rejected as over-fragmenting.
<!-- /ANCHOR:adr-003-alternatives -->
<!-- ANCHOR:adr-003-consequences -->
### Consequences
Thematic numbering renumbers everything (all pointers change) but yields the clearest narrative. The map in
`tasks.md` is the single source of truth agents follow.
<!-- /ANCHOR:adr-003-consequences -->
<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation
| Check | Assessment |
|-------|-----------|
| Simplicity | Chronological preserves numbers; thematic is clearer for a reader |
| Systems | Pointer/cross-ref churn, all mechanical |
| Bias | Operator may prefer different theme names — D3 is that hook |
| Sustainability | Thematic tree ages well |
| Scope | Bounded by the map |
<!-- /ANCHOR:adr-003-five-checks -->
<!-- ANCHOR:adr-003-impl -->
### Implementation Note
Agents treat `tasks.md`'s map as authoritative; any operator edit to theme names/numbers is applied to the
map before execution.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
