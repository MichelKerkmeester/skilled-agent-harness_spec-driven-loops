# Iteration 6: Audit/QA/hardening child — and the corpus's explicit HUB precedent

## Focus
Deep-read the audit/QA/hardening cluster (audit, harden, fixing-accessibility, with critique/optimize context) to bound the cross-cutting audit/QA child and confirm the shared review contract — and capture any structural-model evidence.

## Findings

### F23 — STRUCTURAL KEY: `audit.md` proves impeccable is a HUB with shared loaded context + in-hub routing
Two decisive lines:
1. Anti-pattern check #5 says: "Check against ALL the **DON'T** guidelines from the **parent impeccable skill (already loaded in this context)**." → The verb-skills run *inside the parent's loaded context*; impeccable supplies the shared anti-slop DON'T base to every child. This is a **single-hub-with-shared-runtime-context** architecture, stated in the corpus.
2. audit's "Recommended Actions" emits `{{command_prefix}}command-name` calls chosen from `{{available_commands}}`, mapping each finding to the right sibling verb and ending every run with `{{command_prefix}}impeccable polish`. → audit is an **in-hub router/dispatcher** over the other modes. [SOURCE: external/audit.md:60-64], [SOURCE: external/audit.md:117-131]

### F24 — The audit/QA child has a clear, shared review contract (severity + 5 dimensions)
`audit.md` defines the family's QA contract: 5 scored dimensions (Accessibility, Performance, Theming, Responsive, Anti-Patterns), 0–4 per dimension → /20 health score with rating bands, and P0–P3 severity tagging with location/impact/standard/recommendation/suggested-command. The audit-format leaf skills (`fixing-accessibility`, `fixing-motion-performance`, `12-principles`, `mastering-animate-presence`, `pseudo-elements`) all share the lighter "violations / why / fix + priority categories + tool boundaries" sub-contract. This is one cohesive **audit/QA/hardening** child. [SOURCE: external/audit.md:12-105], [SOURCE: external/fixing-accessibility.md:14-46]

### F25 — `harden` and `optimize` are production-resilience refiners; `fixing-accessibility` is an audit leaf
- `harden.md` builds resilience: extreme inputs, i18n (text expansion, RTL logical properties, Intl APIs, pluralization), error handling (status-code-specific), empty/loading/permission states, validation. It *implements* fixes (build/refine), ending with `impeccable polish`. [SOURCE: external/harden.md:40-354]
- `fixing-accessibility.md` is an audit leaf: `/fixing-accessibility <file>` → violations/why/fix across accessible-names, keyboard, focus/dialogs, semantics, forms, announcements, contrast, media/motion, with explicit "tool boundaries" (minimal changes, native-before-aria, no library migration). [SOURCE: external/fixing-accessibility.md:33-136]
→ The audit/QA child spans both review (audit/critique/fixing-*) and hardening (harden/optimize) — i.e. "make it correct, resilient, and shippable."

### F26 — The corpus now exhibits THREE structural-model exemplars (the KQ6 decision space)
1. **HUB** — `impeccable`: one parent loads shared DON'T context; verb-modes reference "the parent impeccable skill"; `audit` routes among modes; shared `{{command_prefix}}` + `reference/live.md`. Tight coupling, shared runtime, single identity. [SOURCE: external/audit.md:60-64], [SOURCE: external/layout.md:148-168]
2. **UMBRELLA/MARKETPLACE** — `designer-skills`: independently-installable sibling plugins, no shared runtime, "installing more doesn't slow things down," each its own door. Loose coupling, lazy per-child load, marketplace identity. [SOURCE: external/designer-skills-main/README.md:29-35], [SOURCE: external/designer-skills-main/README.md:200]
3. **ROUTER/SELECTOR** — `ui-skills-root`: a pre-step that "select[s] the smallest useful UI Skills context through the ui-skills CLI." A discovery/loader layer that can front either model. [SOURCE: external/ui-skills-root.md]
→ The choice for sk-design is a coupling question: a LARGE shared base (anti-slop taste DON'Ts, command prefix, live params — present across taste/stitch/baseline/audit/animate) favors the HUB; large independently-used children (oklch color science, full audit) favor the UMBRELLA. The likely best fit is a **hub-leaning hybrid**: one parent identity + shared anti-slop/token base loaded once, with children as lazily-loaded nested mode packets and an audit-style in-hub router.

## Sources Consulted
- `external/audit.md` (full), `external/harden.md` (full), `external/fixing-accessibility.md` (full).
- `external/critique.md`, `external/optimize.md`, `external/polish.md` (front-matter + role from iter 1).

## Assessment
- **newInfoRatio: 0.55** — F23 (impeccable as an explicit shared-context hub + audit-as-router) and F26 (three model exemplars framing the KQ6 decision) are new and decisive; the QA dimension content partly overlapped baseline/audit references seen earlier.
- **Novelty justification:** Converts the abstract hub-vs-umbrella question into three concrete in-corpus exemplars with their coupling tradeoffs — directly answers the evidence half of KQ6.
- **Confidence:** High — the hub claim is a direct quote from audit.md ("parent impeccable skill already loaded in this context").

## Reflection
- **Worked:** Reading audit.md exposed the explicit parent/child runtime relationship that front-matter never showed.
- **Insight:** The same corpus ships both a hub (impeccable) and an umbrella (designer-skills) — so the decision is about *our* children's coupling, not about which model is "correct."
- **Ruled out:** Treating audit/critique/harden/optimize/fixing-* as separate peer children — they share one review contract and belong in one audit/QA child.

## Recommended Next Focus
Iteration 7: Deep-read the interface/taste core (taste-skill, impeccable, make-interfaces-feel-better, design-lab) to lock the flagship "interface/taste" child and confirm what impeccable, as the corpus hub, actually owns vs delegates.
