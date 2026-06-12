# Presentation-Adherence Research — Synthesis

> **Question:** why did `/memory:search` ignore its parseable render template under a mid-tier model while `/doctor` rendered its menu verbatim and the Gate-3 block rendered perfectly across three different commands — and how do we make adherence the default?
>
> **Program:** 10 read-only research iterations (1–5 MiMo v2.5 Pro high, 6–10 DeepSeek v4 Pro high) over the live command tree, grounded in captured bare-command transcripts. 44 findings; three DeepSeek seats answered in prose and were distilled (their format miss is itself evidence for the diagnosis).

## 1. The convergent diagnosis

Both models, independently, across ten angles, converged on the same five-part explanation:

1. **The memory family is the structural outlier.** It is the only command family without YAML workflow assets, the only one without a `Presentation Boundary` section, and the only one whose router uses advisory phrasing ("use the presentation asset as the display source of truth") where other families use imperative, contrast-framed language (doctor's "not this router").
2. **The render instruction is buried.** In `search.md` the template pointer is step 7 of the retrieval procedure — not a top-level gate, not a first-action "read this asset before responding" step. Models that already have enough inline routing detail to answer never make the hop to the asset.
3. **The template competes and hides.** `search_presentation.md` packs roughly 11 templates into ~243 lines, with the primary render template sitting under ~25 lines of preamble. Selection failure is predictable.
4. **Fenced templates read as examples, not contracts.** A ```text fence with no MUST language is treated as illustrative. The surfaces that render verbatim (doctor menu, Gate-3 A–E block) are short, fenced, repeated across documents, and framed as the literal thing to emit.
5. **Dynamic templates lack a fill protocol.** Static blocks need no data mapping, so they survive. Search/dashboard templates require tool-output-to-slot mapping that nothing specifies — no field-to-slot binding, no filled example output to imitate.

## 2. Why doctor wins

The doctor router pairs a `Presentation Boundary` enumeration (what must render verbatim, and what must NOT come from the router) with short fenced blocks placed immediately where they are used. That combination — boundary contract + proximity + brevity + contrast phrasing — is the portable pattern.

## 3. Ranked recommendations

| # | Recommendation | Cost | Expected gain |
|---|----------------|------|---------------|
| 1 | Add a `Presentation Boundary` section to every command router (memory, speckit, create, deep), mirroring doctor's | small | high — machine-scannable contract both models and CI can check |
| 2 | Inline a compressed (≤10-line) render template into each router at the point of use, marked "MUST emit exactly this shape"; keep the long asset as reference | small | high — removes the asset hop for the common case |
| 3 | Make "read the presentation asset" a numbered first action (Execution Order section), not buried prose | small | medium-high |
| 4 | Add one filled example output + a tool-field→slot table to every dynamic template | medium | high for search/dashboards specifically |
| 5 | Add a self-check line to render contracts ("verify the header and STATUS footer are present before finishing") | trivial | medium |
| 6 | Split `search_presentation.md` so each mode's template stands alone (or anchor-index them) | medium | medium |
| 7 | Give the memory family YAML workflow assets like every other family (architectural parity) | large | medium — removes the family's outlier status |
| 8 | CI adherence lint: golden-output fixtures per command surface, in the spirit of the prompt-quality-card sync guard | medium | durable regression protection |

## 4. Evidence trail

Per-iteration reports: `iterations/iteration-001.md` … `iteration-010.md`; finding rows: `deltas/iter-001.jsonl` … `iter-010.jsonl`. Primary sources cited by the seats include `.opencode/commands/memory/search.md` (the buried step-7 render pointer), `.opencode/commands/memory/assets/search_presentation.md` (the ~243-line multi-template asset), `.opencode/commands/doctor/doctor.md` (the Presentation Boundary pattern that renders verbatim), and the family routers under `.opencode/commands/{speckit,create,deep}/`. The live transcripts that seeded the program are summarized in `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/027-finding-remediation/playbook-report.md`. Models agreed on every structural claim; the only divergence was emphasis (MiMo weighted phrasing/contrast, DeepSeek weighted architecture/fill-protocol).

## 5. Suggested next step

Recommendations 1–5 fit one small implementation phase (touching the five family routers plus `search_presentation.md`), verifiable by re-running the same bare-command probes on gpt-5.5 medium and checking the search output against the parseable contract.
