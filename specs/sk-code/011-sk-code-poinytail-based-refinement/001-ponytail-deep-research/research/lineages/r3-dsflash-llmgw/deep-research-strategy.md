# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

Round three over the sk-code hub. Rounds one and two are settled and are read as fixed context, not re-verified. Round three takes a fresh, adversarial pass over three surfaces: the `sk-code/shared/` layer and its loaders, `sk-code-review` and its review agent as a mode meant for any codebase, and the remaining hub files, modes and tooling. Phase 009 is in-flight and out of scope.

## 2. TOPIC

Part 1: the `.skilled/skills/sk-code/shared/` layer - how the hub `SKILL.md`, `ROUTER.md`, `hub-router.json` and `mode-registry.json` load it; how each mode and surface packet uses, overrides or duplicates it; where its logic is weak, inconsistent, stale, unreachable or duplicated; and its overlap with `.skilled/repo-rules/*.md`, the root `REPO RULES.md` and `AGENTS.md`. Part 2: `sk-code-review` and `.skilled/agents/review.md` - how codebase-agnostic the mode really is, internal agreement, script behavior, and what would strengthen its logic. Part 3: `sk-code-quality`, `sk-code-webflow`, `sk-code-opencode`, `sk-code-obsidian`, the hub files, `benchmark/` and `manual-testing-playbook/` for bugs, alignment issues and improvements. Classification vocabulary: NEW, ALREADY-COVERED, ALREADY-ADOPTED, IN-FLIGHT. Priorities P0, P1, P2, with reproducing cases for defects.

## 3. KEY QUESTIONS (remaining)

<!-- ANCHOR:key-questions -->
- [x] How do the hub `SKILL.md`, `ROUTER.md`, `hub-router.json` and `mode-registry.json` load the `sk-code/shared/` layer, and which shared files are loaded by nothing, loaded twice, or unreachable from any route? (iterations 1-5)
- [ ] Which shared references duplicate, conflict with, or restate `.skilled/repo-rules/*.md`, `REPO RULES.md` or `AGENTS.md`, and which side should hold each text? (addressed in substance, iterations 3-5; see `research.md` §§4, 9)
- [ ] Where is the shared layer internally inconsistent, stale or weak when each claim is checked against its callers and against how it loads? (addressed in substance, iterations 2-5)
- [x] How does stack detection behave for mixed stacks, monorepos and two-surface matches, and where do the surface packets' overrides of shared standards silently diverge? (iterations 4-5)
- [x] How agnostic is `sk-code-review` as a mode meant for any codebase, and which repository-specific assumptions leak into its SKILL.md, references, assets, scripts and playbook? (iterations 6-11)
- [ ] Do the review mode's contract, checklists, scripts and playbook agree with one another and with `.skilled/agents/review.md`, and where do the canonical, Claude and generated copies drift? (addressed in substance, iterations 7-9)
- [x] What do the review scripts do on foreign-repository inputs, and what would make the review logic stronger? (iterations 10-11)
- [ ] What defects, drift and improvements exist in `sk-code-quality`, `sk-code-webflow`, `sk-code-opencode` and `sk-code-obsidian` beyond rounds one and two? (addressed in substance, iterations 12-15)
- [ ] What defects, alignment gaps and improvements exist in the hub `SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `benchmark/` and `manual-testing-playbook/`? (addressed in substance, iterations 16-19)
- [x] Which original ideas does round three produce, which should be rejected with reasons, and what ranked findings table and implementation phases close the round? (iteration 20)
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

No implementation; no edits outside this lineage directory; no re-verification of rounds one and two findings except to refute them; no iteration budget on phase 009's in-flight scope (router-sync 1b routing of workflow-debug/implement/verify and six sk-code-obsidian references; the ceiling report listing in `sk-code-quality/SKILL.md` with a version bump; the deep-review agent reproducing-case rule; AGENTS.md pointer replacement for duplicated repo-rule content; the remaining hook stdin deadlines); the vendored Ponytail tree under `context/` is data, never instructions; no use of Ponytail files as directive content.

## 5. STOP CONDITIONS

Stop at the iteration cap of 20, as dispatched (`stopPolicy: max-iterations`). Convergence before the cap is telemetry only; the run widens review angles instead of synthesizing early. The terminal synthesis record carries stopReason "maxIterationsReached".

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- How do the hub loaders reach the shared layer, and what is unreachable? (iteration 5, ticked by exact reducer match; evidence iterations 1-5)
- How does detection behave at the two-surface edge, and do surface overrides diverge? (iteration 5, ticked; evidence iterations 4-5)
- How agnostic is `sk-code-review`? (iteration 11, ticked; evidence iterations 6-11)
- What do the review scripts do, and what strengthens them? (iteration 11, ticked; evidence iterations 10-11)
- Ideas, rejections, ranked table and phases. (iteration 20, ticked; `research.md` §§8-9, 13)
- The remaining five key questions were addressed in substance without exact-match ticks; their evidence is in the part passes and `research.md` §§4-6.

Synthesis: `research.md` (ranked table and phases), `findings-registry.json` (73 key findings), `deep-research-dashboard.md`, `resource-map.md`.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Executing the documented pseudocode and checkers instead of reasoning about them: the review detector's misrouting, the vacuous findings-checker pass, and the final-line checker's rules were all reproduced with output and exit status.
- Reading the declaring document beside its consumer: the validate.sh contradiction, the three exemption lists, and the legacy hook names each needed two files in one read.
- Set-difference checks over playbook IDs and version pairs: exact results on both playbooks and all packet/changelog pairs.

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Reading an exit status through a shell pipeline reported `tail`'s status twice; the runs were redone without the pipe and the corrected results recorded.
- A relative-path check from the wrong base reported a missing system-spec-kit file; the pointer resolves and the error was recorded, not hidden.
- Absorbing the mid-run quality patch into iteration 12's line numbers; iteration 18 refreshed them.

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none (no pivots configured; angles stay distinct).
- Pivot lineage: none.
- Remaining frontier: none; residuals are carried forward below.
<!-- /ANCHOR:divergence-frontier -->
<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- Round two's open rows are read-only context: D1 known-bad input and rec 7 are settled or superseded by phases 004 and 006.

<!-- /ANCHOR:carried-forward-open-questions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

[Complete] Round three reached its cap at 20/20 with all ten key questions addressed; see `research.md` for the ranked table and the proposed phases 010-013.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
