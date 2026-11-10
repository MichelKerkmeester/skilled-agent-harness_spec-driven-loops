# Iteration 9: User-authored modes (Q9)

## Focus

Answer the strategy's Q9 about what a user-authored workflow or surface mode needs from review, what review needs from it, and which of the eleven integration rows carries that exchange. [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-strategy.md:35] `Q9 User-authored modes`

## Actions Taken

- Read the parent-skill guidance for workflow versus surface packets and its eleven integration rows.
- Compared the hub routing rule, the sk-code mode registry, router and leaf manifest with sk-code-review's surface and output contracts.
- Did not run a live route replay because the checked-in registry describes only the built-in modes and has no external user-mode scenario.

## Findings

1. [OBSERVED] Classify a user-authored security capability by what it adds. Use a workflow packet when it changes the review lifecycle, output contract, tool permissions, or primary routing. Use a surface packet when it provides read-only security rules or checklists for an existing review workflow to load as evidence. If a capability needs both, register its workflow first and attach the surface evidence. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:182] `Choose a workflow packet when`; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:191] `Choose a surface packet when`; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:196] `A workflow mode remains primary`; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:207] `register the workflow first and attach surfaces`.

2. [INFERRED] A security surface should give review bounded, domain-specific checks or evidence and clear scope hints. The surface itself is read-only, so it does not need review output. A separate user workflow that consumes review results should accept the existing findings contract, including a concrete case, risk, finding class, scope proof, and one fixed final status. The current review report labels surface evidence only as SKILLED or UNKNOWN and documents no arbitrary user-mode payload, so this exchange needs an explicit contract and a live route plus review scenario to confirm it. [SOURCE: .skilled/skills/sk-code/mode-registry.json:18] `read-only domain-evidence packets`; [SOURCE: .skilled/skills/sk-code/hub-router.json:11] `one workflow mode primary plus zero-or-more surface packets`; [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:312] `Baseline security/correctness minimums always apply`; [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:350] `Surface evidence used: [SKILLED | UNKNOWN]`; [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:356] `A finding with no case is not reported`; [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:360] `grep/test evidence proving class coverage`; [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:380] `Every review MUST end with exactly one`.

3. [DERIVED] No row in the eleven-row integration list defines the semantic data handoff between a user-authored mode and review. Rows 1–4 make a mode selectable and routable, and row 9 inventories its leaves. Rows 6–8 cover advisor, human-facing, and doctor discovery. For review to load a security surface, rows 4 and 9 are the closest content path; row 7 makes the mode visible to an agent. Row 5 applies only where a hub has FULL_INVENTORY, row 10 only to non-metadata routing, and row 11 when command mirrors are owned. None defines the two-way payload. The checked-in registry describes the built-in quality/review workflows and skilled/CI surfaces, so live reachability for an external mode remains unverified. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:223] `Nothing routes at all`; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:224] `The hub never selects the mode`; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:225] `exact permutation of the registry`; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:226] `mode is selected but loads no leaves`; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:227] `The full-toolkit intent silently omits the mode`; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:228] `The advisor never surfaces the hub`; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:229] `An agent that loads the hub`; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:230] `missing from the hub's advertised surface`; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:231] `Regenerate rather than hand-edit`; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:232] `A metadata mode needs none of this`; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:233] `The command is unreachable from those runtimes`; [SOURCE: .skilled/skills/sk-code/mode-registry.json:5] `The WORKFLOW axis (sk-code-quality/sk-code-review) is process`; [SOURCE: .skilled/skills/sk-code/mode-registry.json:5] `SURFACE axis (sk-code-ci/sk-code-skilled) is read-only domain evidence`.

## Questions Answered

- Q9 User-authored modes: what does a user's workflow or surface mode (for example a security-only reviewer) need from review, what does review need from it, and which of the eleven integration rows carries it? **Answer:** A security checklist or ruleset belongs in a read-only surface packet when it only supplies evidence; a distinct review lifecycle belongs in a workflow packet. Review needs scoped, domain-specific evidence from a surface while retaining its security/correctness baseline. A downstream user workflow needs the stable review finding and final-status contract if it consumes review output. No integration row defines that semantic handoff. Rows 4 and 9 are closest for loading the surface, row 7 provides human-facing discovery, and the remaining applicable rows provide registration, advisor/router and runtime discoverability.

## Questions Remaining

- Q10 Repo-local policy and floors remains for iteration 10.
- Whether a real user-authored mode can route into review and exchange its evidence or findings remains UNKNOWN. Confirm with a route replay through both routing stages and a focused review scenario after such a mode exists.

## Next Focus

Angle 10: Repo-local policy and floors (Q10), following the frozen iteration schedule.

## Sources Consulted

- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`, sections 6 and 7.
- `.skilled/repo-rules/skill-hub-routing.md`, sections 1 and 2.
- `.skilled/skills/sk-code/mode-registry.json`, `hub-router.json`, and `leaf-manifest.json`.
- `.skilled/skills/sk-code/sk-code-review/SKILL.md`, surface alignment and output contract.
- `.skilled/skills/sk-code/ROUTER.md`, surface-first and intent-second routing.

## Assessment

- `newInfoRatio`: 1.0. Q9 was unchecked, and this is the first focused answer mapping mode type to review exchange and hub integration rows.
- Status: complete for the structural question. Actual external-mode reachability is not verified.
- Evidence confidence: packet classification and route rows are observed; the proposed two-way payload is inferred and needs a live mode scenario.

## Reflection

- The packet taxonomy and integration table answered which route surfaces carry the mode.
- The sources do not define a semantic payload contract between custom modes and review; a live scenario would confirm whether the inferred exchange is sufficient.
- For the next angle, keep repo-local policy separate from mode routing and preserve the stated review floors.

## Recommended Next Focus

Investigate Q10's repo-local policy location, non-relaxable review floors, and proof path through both routing stages.
