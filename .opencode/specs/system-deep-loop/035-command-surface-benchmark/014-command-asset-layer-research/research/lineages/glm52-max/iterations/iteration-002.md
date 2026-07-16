# Iteration 2: RQ2 — Presentation ownership, boundary, and the typed inline-exception

## Focus
Establish who owns `_presentation.txt`, characterize when inline presentation inside a router is a legitimate exception versus a leak, and design how an intentional exception is represented as a typed declaration rather than prose. The crux is `memory/search`: its router inlines a compressed retrieval-result render shape "as a hard render reminder" — a legitimate exception that today has no typed representation, so a blunt leak-blocker would either miss it or wrongly flag it. Ground in 012 AL3 (presentation ownership has no typed form).

## Findings

### F2.1 — Ownership rule is clear and uniform; the `.txt` IS the presentation source of truth
Across all families, `_presentation.txt` is owned BY THE ROUTER and IS the single source of truth for user-facing display. The contract is stated consistently: `create/command.md:42-48` ("The following content lives only in `...create_command_presentation.txt` … The router must not invent visible wording"), `deep/research.md:168-176`, `doctor/update.md:50-57`, and `memory/search.md:137-146`. The presentation asset's own header restates it: `create_command_presentation.txt:3` ("This file is the single source of truth for user-facing presentation … The command router owns asset routing only. The workflow YAML owns execution behavior."). So ownership is NOT ambiguous in the corpus — the gap (AL3) is that this ownership has **no typed carrier**: it lives as a prose sentence repeated 35 times, not as a contract field a tool can read.

[SOURCE: .opencode/commands/create/command.md:42-48]
[SOURCE: .opencode/commands/create/assets/create_command_presentation.txt:3]
[SOURCE: .opencode/commands/memory/search.md:137-146]

**Candidate delta D2.1:** Add a typed `presentation.owner` field to the command contract (D1.5) holding the presentation-asset path, and render the PRESENTATION BOUNDARY section FROM it. The prose "lives only in `<path>`" becomes a projection of `presentation.owner`. Acceptance: the PRESENTATION BOUNDARY path always equals `presentation.owner`; a router that hardcodes a divergent path fails.

### F2.2 — The legitimate inline exception: `memory/search`'s "hard render reminder"
`memory/search.md` is a direct-dispatch command (no workflow YAML) that **inlines** a substantial render contract: the `MEMORY:SEARCH "<query>" …` result block, the five-core-slot mandate, the score mandate ("one score, one scale, one name"), the arg-echo rule, and the verdict-render-slot rules (`memory/search.md:68-95`). This is display/render content sitting inline in the router. It is **intentional and legitimate**, declared in prose: `memory/search.md:139` — *"This router may only inline the compressed retrieval result shape above as a hard render reminder."* The PRESENTATION BOUNDARY section then carves the exception out explicitly (`:137-146`).

Why it is legitimate (not a leak): the render contract is a **machine-emit shape** (a fixed `STATUS=OK RESULTS=<n>` envelope that downstream pipelines parse). Pushing it into a `.txt` that an LLM reads would weaken emit-fidelity — the router must enforce the shape deterministically at the dispatch surface, not via a separately-loaded display asset. This is a qualitatively different case from `deep/research.md` (F5.x, iteration 5), which inlines a *display* box (`⛔ DIRECT INVOCATION REQUIRED`) that genuinely belongs in the `.txt`.

The defect (AL3) is representational: the exception is captured only by the prose phrase "as a hard render reminder" (`:139`). No tool can read that phrase and know the inline block is sanctioned. So a future presentation-leak check has no way to distinguish this from a real leak except by hardcoding `memory/search` — which is exactly the brittle outcome 012 warned against ("a blunt leak-blocker would wrongly flag it").

[SOURCE: .opencode/commands/memory/search.md:68-95,137-146]
[SOURCE: 012/research/research.md:129-131 (AL3)]

**Candidate delta D2.2 (typed exception):** Add a typed `presentation.exceptions[]` list to the contract. Each entry names (a) the inline block anchor/marker in the router, (b) a reason enum ∈ `{render-fidelity, deterministic-dispatch, legacy-bridge}`, and (c) the bounded content signature (e.g. the `MEMORY:SEARCH` envelope). `memory/search` declares one exception: `{ block: "retrieval-render-shape", reason: render-fidelity }`. Acceptance: a presentation-leak check (S5, F2.4) treats any block listed in `presentation.exceptions[]` as sanctioned and flags any inline display block NOT listed; `memory/search` passes; a router that inlines a `⛔` box without an exception entry fails.

### F2.3 — The current S5 leak check is a blunt substring test that cannot see exceptions at all
The adapter's presentation-ownership check (`sk-doc-command.cjs:456-494`) does two things: (1) for each `.txt` execution target, it takes the asset's **trimmed full text** and substring-searches the router for it — if found verbatim, it emits `CMD-S5-PRESENTATION-ASSET-LEAKED` P2 (`:467-478`); (2) it collects `[presentation:<id>]` markers and flags duplication (`:482-492`). Neither branch consults any exception declaration (none exists). The substring test is brittle in both directions: it **misses** paraphrased/compressed leaks (memory/search's inline block is a *compressed* version of the `.txt` content, so the verbatim substring likely does not match — the leak is invisible), and it could **false-flag** a legitimately short shared phrase. The marker-duplication branch is closer to right but depends on authors emitting `[presentation:<id>]` markers, which the corpus does not uniformly do. Net: the single presentation-quality instrument has no concept of ownership intent.

[SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:456-494]
[SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:91 (PRESENTATION_MARKER regex)]

**Candidate delta D2.3 (intent-aware S5):** Refactor `checkPresentationOwnership` to be contract-driven: read `presentation.owner` + `presentation.exceptions[]` (F2.1/F2.2); an inline block is a finding ONLY if (a) it matches display-asset vocabulary AND (b) it is not in `exceptions[]`. Drop the brittle verbatim-substring test in favor of marker-or-vocabulary detection keyed to the typed owner. Acceptance: a fixture router that inlines a dashboard box without an exception entry emits `CMD-S5-PRESENTATION-ASSET-LEAKED`; the same box with a declared `render-fidelity` exception is clean; `memory/search` is clean without a hardcoded allowlist.

### F2.4 — "Who owns the `.txt`" is triply-stated and triply-drift-prone; collapse to one typed owner
The presentation-asset path appears in THREE router sections today: OWNED ASSETS (`create/command.md:22`), EXECUTION TARGETS step 1 (`:33`), and PRESENTATION BOUNDARY (`:44`). Three hand-maintained copies of one path. 012 AL6 ("some `.txt` ownership labels wrong") is the visible symptom of this triplication: when the path drifts between the three rows, the "ownership label" is wrong even though the asset still loads. The `doctor` family compounds it: it owns `doctor_mcp_presentation.txt` / `doctor_speckit_presentation.txt` / `doctor_update_presentation.txt` named **per-route**, not per the `<ns>_<action>_presentation.txt` triad convention, so a naming-convention check has no single rule to apply across families. Collapsing the three copies into one typed `presentation.owner` (D2.1) removes the drift surface entirely; the three sections become rendered projections.

[SOURCE: .opencode/commands/create/command.md:22,33,44]
[SOURCE: .opencode/commands/doctor/mcp.md:22, .opencode/commands/doctor/speckit.md:23, .opencode/commands/doctor/update.md:22]
[SOURCE: 012/research/research.md:129-134 (AL3, AL6)]

**Candidate delta D2.4:** The contract carries exactly one `presentation.owner` path; OWNED ASSETS, EXECUTION TARGETS step 1, and PRESENTATION BOUNDARY all render from it. The naming convention becomes a contract validation (path must resolve + kind=presentation), not a family-specific prose rule. Acceptance: changing the `.txt` path in one place updates all three rendered rows; a router with three divergent paths fails.

### F2.5 — Boundary between "display" (belongs in .txt) and "render contract" (legitimately inline)
RQ2 asks *when* inline is legitimate. The corpus yields a testable distinction:
- **Display content** (belongs in `.txt`): startup questions, dashboards, checkpoint text, success/failure templates, ASCII prompt boxes, next-step suggestions — everything whose job is to be *shown to a human*. `deep/research.md`'s `⛔ DIRECT INVOCATION REQUIRED` ASCII box (`:64-72`) is display content leaking into the router (a real defect, handled in RQ5).
- **Render contract** (legitimately inline): a fixed machine-emit envelope (`MEMORY:SEARCH "<query>" … STATUS=OK RESULTS=<n>`) whose fidelity must be enforced at the deterministic dispatch surface — `memory/search.md:68-95`.

The discriminator is **audience + determinism**: human-audience or templated → `.txt`; machine-parseable fixed envelope enforced pre-dispatch → inline exception. This gives the `reason` enum in F2.2 (`render-fidelity` = machine envelope; `deterministic-dispatch` = argv/router-state binding; `legacy-bridge` = temporary) a principled basis, so authors decide exception-vs-leak from a rule, not taste.

[SOURCE: .opencode/commands/memory/search.md:68-95 vs .opencode/commands/deep/research.md:64-72]

**Candidate delta D2.5 (boundary rule):** Canonize the audience/determinism discriminator in `command_router_template.md` §5 (PRESENTATION BOUNDARY): "Display content (human-audience) lives in the `.txt`; a fixed machine-emit envelope enforced at dispatch may be inlined ONLY under a typed `render-fidelity` exception." Acceptance: an author can classify any inline block via the rule; the deep `⛔` box is correctly classified as a leak (display), the memory envelope as a sanctioned exception (render contract).

## Sources Consulted
- Routers: `memory/search.md` (full), `create/command.md`, `deep/research.md`, `doctor/update.md`, `doctor/mcp.md`, `doctor/speckit.md`.
- Adapter: `sk-doc-command.cjs:456-494` (checkPresentationOwnership), `:91` (PRESENTATION_MARKER).
- Presentation asset: `create_command_presentation.txt:1-30`.
- Grounding: `012/research/research.md:117-143` (AL3, AL6).

## Assessment
- **newInfoRatio: 0.78** — RQ2's core (ownership is clear but untyped) extends 012 AL3; the genuinely new contributions are the typed `exceptions[]` design (F2.2), the contract-driven S5 refactor (F2.3), and the audience/determinism discriminator (F2.5). Some overlap with F1.5's `presentation` field shape (intended convergence).
- **Novelty justification:** Reframes AL3 from "no typed ownership" to a concrete two-field contract (`owner` + `exceptions[]`) with a reason enum and a leak-check that reads intent — turning the `memory/search` exception from a hardcoded special case into a general mechanism. The triple-path drift root-cause for AL6 (F2.4) is newly isolated.
- **Confidence:** high on F2.1/F2.2/F2.4 (directly observed + designed against the corpus); medium-high on F2.3/F2.5 (design proposals; the marker-vs-vocabulary detection heuristic needs the G3 allowlist work from 012).
- **Partial RQ2 answer:** ownership is uniform but needs one typed carrier; the legitimate exception is characterizable and representable; the leak check must become intent-aware. Full close pending RQ3/RQ5 confirming the contract field does not collide with mode-matrix.

## Reflection
- **What worked:** Treating `memory/search` as the *positive* exemplar (sanctioned exception) rather than a violation — inverting the framing exposed the missing typed mechanism instead of a per-command patch.
- **What failed / ruled out:** Considering a hardcoded allowlist of inline-tolerant commands — rejected because it preserves the regeneration defect (012 A7) and rots when a new render-fidelity command appears.
- **Ruled out:** "Block all inline presentation with a regex" — contradicts the legitimate render-contract case and 012's explicit ruling-out of a blunt blocker.
- **Recommended next focus (RQ3):** mode completeness — the contract's `mode_matrix` field, the check that every declared `:auto`/`:confirm` has BOTH its `_<mode>.yaml` AND an EXECUTION TARGETS row, and the per-family default-mode policy encoded without forcing one default.
