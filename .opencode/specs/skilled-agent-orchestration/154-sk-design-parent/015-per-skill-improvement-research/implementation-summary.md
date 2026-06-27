---
title: "Implementation Summary: sk-design per-skill improvement research across the five design modes"
description: "Executed. Ran five parallel GPT-5.5-xhigh deep-research lineages, one per design mode, all converged. The design knowledge already landed in phases 009 and 012, so the leverage is now plumbing: router precision, the shared-register loading contract, handoff cards, and benchmark fixtures. The shared-register loader is the highest-leverage family fix. One real bug: md-generator is missing backend/package.json."
trigger_phrases:
  - "sk-design improvement research synthesis"
  - "design per-skill research outcome"
importance_tier: "important"
contextType: "implementation"
status: executed
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/015-per-skill-improvement-research"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the cross-mode synthesis and the highest-leverage plumbing fixes"
    next_safe_action: "Research synthesis captured pending commit, plumbing fixes route to future build phases"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-015-per-skill-improvement-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The frontier is plumbing, not design theory: phases 009 and 012 already landed the design knowledge"
      - "The shared-register loading contract is the highest-leverage family fix: one shared loader fix repairs motion, audit, and partly interface at once"
---
# Implementation Summary: sk-design per-skill improvement research across the five design modes

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 154-sk-design-parent/015-per-skill-improvement-research |
| **Completed** | Executed: five converged lineages, cross-mode synthesis recorded, decisions captured |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Five parallel GPT-5.5-xhigh deep-research lineages, one per design mode, each investigating how to improve that mode's efficiency, usefulness, UX, and tooling. Each ran ten iterations and converged. The deliverables are the five `research.md` files, preserved as written and referenced by path. This summary records the cross-mode synthesis.

### The five deliverables
- `001-interface/research/lineages/gpt55fast/research.md`
- `002-foundations/research/lineages/gpt55fast/research.md`
- `003-motion/research/lineages/gpt55fast/research.md`
- `004-audit/research/lineages/gpt55fast/research.md`
- `005-md-generator/research/lineages/gpt55fast/research.md`

### Synthesis

- **Meta-finding: the design knowledge already landed in phases 009 and 012.** The leverage now is plumbing, not more design theory. Across all five modes the prior expansion work is present: the shared register, the interface preflight and author-once gates, foundations data-viz and tokens, the motion restraint gate and cards, and the audit evidence and hardening depth. The next improvements are router precision, resource-loading correctness, handoff cards, and benchmark fixtures.

- **Highest-leverage family fix: the shared-register loading contract.** In motion and audit, and partly interface, the router path-guard cannot load the parent `../shared/register.md` that each mode's prose mandates, so it silently degrades correctness on every task. One shared loader fix repairs multiple modes at once, which is why it ranks above any single per-mode improvement.

- **Router and registry wiring lags content in all five.** There are missing aliases (foundations and md-generator), an overloaded grounding branch (interface), and loaders that do not match the documented contract (motion, audit, and the foundations TOKENS path that loads only the token scaffold instead of cross-axis context).

- **No mode has its claimed score backed by checked-in fixtures.** Every lineage noted that its expected `014-routing-benchmark/<mode>` artifact was absent in its own checkout. The fix is to seed a fixture set under `014-routing-benchmark/<mode>` from each mode's manual scenarios. The sibling 014 benchmark run is the first such evidence.

- **A required structured handoff card to sk-code recurs in four of five modes.** Interface wants a design-to-build manifest, audit wants an accepted-findings backlog handoff, foundations wants an explicit final handoff, and motion wants an implementation-mechanism and stack-boundary field. The fix is to standardize one handoff schema across the family.

- **One real bug: md-generator's backend is missing `package.json`.** Only `package-lock.json` is present, which breaks the documented `cd backend && npm install` setup. This is a concrete setup and UX defect to patch first, separate from the larger plumbing program.

### Unanimous do-not list
Do not bulk-import the external corpus, do not split modes into finer children, do not add redundant basics, and do not weaken fidelity or boundaries for UX.

All authored docs are HVR-clean (no em dashes, no semicolons, no Oxford commas). No live sk-design content was changed by this phase.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Five GPT-5.5-xhigh deep-research lineages ran in parallel over opencode, one per design mode, with each lineage bound to its own artifact directory so writes stayed lineage-local. Each lineage read the deep-research contract, the live packet, the sk-design hub and registry, the prior 009 and 012 records, the 014 routing benchmark, the manual playbook, and a targeted external corpus subset, then ran iterations to convergence. The five converged `research.md` deliverables were then read across the family and reconciled into the synthesis above. Every named fix is routed to a future build phase, so this phase records research and decisions and changes no live sk-design content. The findings line up with the sibling 014 benchmark, which independently measured the heavy routing economy in audit and md-generator and confirmed the missing-fixtures gap.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Prioritize plumbing over more design theory | All five lineages found the design knowledge already landed in 009 and 012. Adding more references would bloat the family without fixing the real defects in routing and resource loading |
| Treat the shared-register loading contract as the single highest-leverage fix | It is broken in motion and audit and partly interface, so one shared loader fix repairs multiple modes at once. That beats any per-mode improvement on leverage |
| Standardize one sk-code handoff schema | The same need recurs in four of five modes under different names. One schema is cheaper and more consistent than four bespoke cards |
| Seed benchmark fixtures rather than trust oral scores | No mode had checked-in fixtures, so claimed scores were not reproducible. The 014 run is the first fixture evidence, and each mode should get a seeded fixture set |
| Patch the md-generator backend manifest first | It is a real bug that breaks documented setup, small and isolated, so it is worth fixing ahead of the larger plumbing program |
| Preserve the five research deliverables unchanged | They are the primary evidence. Editing them to fit the wrapper would contaminate the research, so they are referenced by path only |
| Route every fix forward, build nothing here | This is a research phase. Acting on the findings belongs to build phases that can verify each change against the live tree |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Five per-mode `research.md` deliverables present | PASS (interface, foundations, motion, audit, md-generator) |
| Each lineage converged | PASS (each records a converged stop reason, 6 to 10 iterations) |
| Cross-mode synthesis recorded | PASS (plumbing meta-finding, shared-register loader, wiring gaps, fixtures, handoff card, backend bug, do-not list) |
| Highest-leverage fix named | PASS (the shared-register loading contract, one fix repairs motion, audit, and partly interface) |
| md-generator backend bug recorded | PASS (missing `backend/package.json`, only `package-lock.json` present) |
| Binding decisions captured | PASS (recorded in `decision-record.md`) |
| Research deliverables preserved unchanged | PASS (referenced by path, not rewritten or relocated) |
| No live sk-design content changed | PASS (research and decisions only) |
| `validate.sh --strict` on this packet | PASS (0 errors) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This phase produces research and decisions, not fixes.** The shared-register loader, the registry aliases, the handoff schema, the benchmark fixtures, and the md-generator backend manifest are all named and routed forward. None is built here, so the live family still carries these defects until the build phases run.
2. **The lineages ran on a single executor and lineage.** Each mode has one GPT-5.5-xhigh `gpt55fast` lineage. A second lineage or a different executor could surface additional findings. The current synthesis reflects one converged pass per mode.
3. **Some lineages noted local-checkout gaps.** Several lineages reported that the expected benchmark artifact or external corpus path was absent in their own checkout, and treated the operator-supplied scores as context. The 014 benchmark run resolves the benchmark-artifact gap going forward.
4. **The exact loader and handoff shapes are deferred.** The synthesis names the shared-register loader and the single handoff schema as the priorities but leaves their precise shape to the build phases, since those choices need verification against the live tree.
<!-- /ANCHOR:limitations -->
