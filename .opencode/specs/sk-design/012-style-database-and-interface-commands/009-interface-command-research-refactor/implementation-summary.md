---
title: "Implementation Summary: Research + Refactor the sk-design /interface:* Design Commands"
description: "Web-informed research then refactor of the five /interface:* commands to conformant thin routers aligned with sk-doc create-command: restored router topology, one @-include per body, refreshed the machine contract to /interface:*. Contract test 8/8; real invocation verified."
trigger_phrases:
  - "interface command refactor done"
  - "thin router create-command aligned summary"
  - "design command benchmark scorecard"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/009-interface-command-research-refactor"
    last_updated_at: "2026-07-22T10:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Thin-router refactor + machine-contract refresh; test 8/8; invocation verified."
    next_safe_action: "Commit + push; deeper useful-content improvements remain as follow-ups."
    blockers: []
    key_files:
      - ".opencode/commands/interface/design.md"
      - ".opencode/skills/sk-doc/create-command/assets/command-contract.json"
      - ".opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-012-009-interface-command-research-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary: Research + Refactor the sk-design /interface:* Design Commands

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-interface-command-research-refactor |
| **Level** | 1 |
| **Status** | COMPLETE — research + thin-router refactor + usefulness improvements applied + verified |
| **Verification** | contract test 8/8; real `/interface:design` invocation routes + expands the `@`-include |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Phase 1 — research.** Two SOL-fast web dispatches (30 webfetch of v0/Lovable/shadcn/Figma/Tokens-Studio
docs + file:line reads) and native Opus-4.8 web research, synthesized in `research.md`. Converged headline:
registry-based grounding is the biggest lever (95% design-system compliance, CHI-2026); commands should be
artifact-first (not the 8-block lifecycle), close the read-only verification gap, self-describe invocation,
and encode brand as constraints.

**Phase 2 — refactor to conformant thin routers** (operator-chosen topology). Restored the five
`/interface:*` commands + their presentation assets + the contract test to the pre-012/008 conformant
router base (`d0e838c73c~1`), added **exactly one `@`-include** of `creation-contract.md` per router, and
refreshed the stale create-command machine contract from the retired `/design:*` surface to the live
`/interface:*` surface.

**Phase 2b — usefulness improvements applied to the presentation assets** (the normative prompts). Each of
the five presentations now carries: **executable owned-system grounding** (a Reuse Report + Violation Scan
inside the Grounding Record — the 95%-compliance lever), **brand constraints** (`must-use`/`must-preserve`/
`must-avoid`), **proof-tier honesty** (label proofs `authored`→`verified`; read-only commands cap at
`validated`, cannot claim `measured`/`verified`; `PROOF_TIER=<level>` surfaced), **artifact-first output**
(lead with the artifact; full envelope behind `--evidence full`), and a **per-mode rule** (design =
contrastive directions + real content/states; foundations = relational token alias chains + theme
matrices; motion = per-interaction timing + reduced-motion; audit = `SCORE=WITHHELD` until per-dimension
evidence; design-reference = complete extraction manifest). All 8 required visible-output blocks preserved.

**Phase 3 — test + benchmark + verify.** Contract test 8/8 (before and after the usefulness edits); a
per-command conformance scorecard; and a real `/interface:design` invocation that routes.

### Benchmark scorecard (per command)

| Command | Router-detected | `@`-include | No command-taste | Modes wired |
|---------|:---:|:---:|:---:|:---:|
| `/interface:design` | ✓ | 1 | ✓ | :auto/:confirm |
| `/interface:foundations` | ✓ | 1 | ✓ | :auto/:confirm |
| `/interface:motion` | ✓ | 1 | ✓ | :auto/:confirm |
| `/interface:audit` | ✓ | 1 | ✓ | :auto/:confirm |
| `/interface:design-reference` | ✓ | 1 | ✓ | :auto/:confirm |

Automated harness: `interface-command-contract.test.mjs` → 8/8. Real invocation: `/interface:design` →
Route Proof + STATUS + `@`-include (creation-contract) expansion, exit 0.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Fresh worktree at the v4 tip. Research ran via direct SOL-fast dispatches after the `/deep:research` loop
was found to group-kill opencode at iteration dispatch (a framework bug, filed as the blocker; the bare
executor works). The refactor was a scoped `git checkout` restore of the conformant router base plus
targeted edits (the `@`-include and the machine-contract refresh), verified against the real test + a real
invocation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Thin-router topology (operator choice) | "Hard-align with create-command" means thin routers; restores the standard's ownership boundary |
| Restore the pre-012/008 base, then layer | The pre-012/008 commands were already conformant routers; restoring is safer than re-authoring |
| Direct SOL-fast dispatches for research | The `/deep:research` loop crashes opencode; the bare executor delivers web-informed research reliably |
| Deeper useful-content improvements deferred | Executable registry-grounding + artifact-first restructure are larger presentation redesigns; recorded as ranked follow-ups in `research.md` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 5 routers router-detected + one `@`-include | PASS — PRESENTATION BOUNDARY=1, @-include=1 each |
| Contract test | PASS — 8/8 |
| Machine contract aligned | PASS — 0 stale `/design`, valid JSON |
| Real invocation routes | PASS — `/interface:design` exit 0, Route Proof + `@`-include expansion |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Usefulness improvements are applied** to the presentation assets (executable grounding, brand
  constraints, proof-tier honesty, artifact-first, per-mode rules — all ranked with sources in
  `research/research.md`). Remaining optional polish: enumerating flag values in the router
  `argument-hint` lines (the router bodies already enumerate lanes in MODE ROUTING) and a deeper
  output-ordering restructure inside the workflow YAML.
- **`/deep:research` framework bug** (opencode group-kill at iteration dispatch) remains open; research was
  delivered via direct dispatches instead.
<!-- /ANCHOR:limitations -->
