# Iteration 5: Ranked upgrade proposal matrix

## Focus

This iteration converted the accumulated usefulness, coverage, overlap, and friction evidence into a ranked upgrade proposal matrix. The selected interpretation was narrow: propose changes with exact target areas and validation expectations, but do not edit the target `sk-code` skills.

## Findings

1. **P0/P1: Repair `code-verify` stack-folder verifier or explicitly retire/re-scope it.** `code-verify` presents `assets/scripts/verify_stack_folders.py` as the conditional stack-folder/surface-router integrity check, but the script still expects an older monolithic `STACK_FOLDERS` declaration in `SKILL.md` and local `references/`/`assets/` surface folders; the current hub is registry-driven and stores surfaces as sibling packets in `mode-registry.json`. This is the highest-ranked proposal because it is a runnable verifier advertised by the verification contract and can create false verifier failure/noise. [SOURCE: .opencode/skills/sk-code/code-verify/SKILL.md:110] [SOURCE: .opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py:2] [SOURCE: .opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py:16] [SOURCE: .opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py:64] [SOURCE: .opencode/skills/sk-code/mode-registry.json:16]
2. **P1: Add a shared cross-mode handoff schema/matrix.** All four workflow modes already name pieces of the lifecycle payload, but the fields are distributed across mode contracts: implement prepares changed scope and targeted checks, quality sends symptoms/outputs/targets to debug and quality evidence to verify, debug sends reproduction plus before/after and risk, and verify reads handoffs and routes failures back without editing. A shared schema would reduce agent guessing while preserving mode ownership: `{changedScope, surface, baseline, qualityEvidence, symptom, reproductionCommand, beforeAfter, acceptedRisks, targetVerificationCommands}`. [SOURCE: .opencode/skills/sk-code/code-implement/SKILL.md:160] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:149] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:130] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:198] [SOURCE: .opencode/skills/sk-code/code-verify/SKILL.md:144] [SOURCE: .opencode/skills/sk-code/code-verify/SKILL.md:181]
3. **P1: Normalize stale path vocabulary to current nested packet paths.** The shared phase reference and mode packets describe the right lifecycle, but still cite older paths such as `references/webflow/implementation/*`, `references/opencode/shared/*`, and `assets/opencode-checklists/*`; the actual current layout delegates OpenCode checklists to `../code-opencode/assets/checklists/` and keeps surface evidence in sibling packets. This ranks above cosmetic cleanup because stale paths are directly embedded in required load steps and success criteria. [SOURCE: .opencode/skills/sk-code/shared/references/phase_detection.md:62] [SOURCE: .opencode/skills/sk-code/shared/references/phase_detection.md:74] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:144] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:209] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:240]
4. **P1/P2: Add parent-vs-packet permission precedence wording.** The parent hub correctly says routing is registry-driven and mode behavior is not flattened, while `mode-registry.json` narrows each mode's tool surface (`quality` forbids `Write`/`Task`, `verify` forbids `Write`/`Edit`/`Task`). A short precedence note should state that after mode resolution, the packet-local registry/tool-surface contract governs execution over any broad parent or runtime tool availability. [SOURCE: .opencode/skills/sk-code/SKILL.md:52] [SOURCE: .opencode/skills/sk-code/SKILL.md:72] [SOURCE: .opencode/skills/sk-code/mode-registry.json:45] [SOURCE: .opencode/skills/sk-code/mode-registry.json:83]
5. **P2: Document intentional checklist overlap as lifecycle reuse, not duplication.** `code-implement` requires OpenCode authoring checklists before first write, while `code-quality` requires the quality checklist and target-path authoring checklist before pass/handoff. This overlap is useful because it separates write-time prevention from author-side enforcement, but it should be explicitly named to prevent future consolidation that weakens either gate. [SOURCE: .opencode/skills/sk-code/code-implement/SKILL.md:157] [SOURCE: .opencode/skills/sk-code/code-implement/SKILL.md:180] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:175] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:177]

## Ruled Out

- Moving lifecycle logic into the parent hub or `hub-router.json`; the hub contract says routing is registry-driven and forbids per-mode implementation, quality, debugging, verification, or review logic in the hub. [SOURCE: .opencode/skills/sk-code/SKILL.md:52] [SOURCE: .opencode/skills/sk-code/SKILL.md:112]
- Adding duplicate local Webflow/OpenCode evidence directories under each workflow packet; the two-axis registry treats surface packets as read-only evidence bundled alongside workflow modes. [SOURCE: .opencode/skills/sk-code/mode-registry.json:16] [SOURCE: .opencode/skills/sk-code/SKILL.md:59]
- Treating `code-verify` as responsible for repairing the broken verifier in-session; verification's own non-mutating boundary requires handback when a verifier is missing or defective. [SOURCE: .opencode/skills/sk-code/code-verify/SKILL.md:179]

## Dead Ends

- Further broad inventory is now low value. The evidence supports a ranked proposal set; the next useful work is either convergence validation against remaining weak sources or implementation planning after the research loop is accepted.
- Re-ranking without testing the exact verifier failure would be weaker than the current finding, but implementation of the verifier repair remains out of scope for this research-only run.

## Edge Cases

- Ambiguous input: none; the dispatch explicitly requested ranked evidence-grounded upgrade proposals.
- Contradictory evidence: the advertised `verify_stack_folders.py` integrity check conflicts with the current registry/sibling-packet architecture; resolved as a high-priority upgrade proposal, not as a completed fix.
- Missing dependencies: none required for proposal ranking; exact code repair validation is intentionally deferred.
- Partial success: none for this iteration's scope; the proposal ranking completed, but the full loop still has a minimum-iteration/convergence policy outside this leaf iteration.

## Sources Consulted

- .opencode/skills/sk-code/SKILL.md:52
- .opencode/skills/sk-code/SKILL.md:59
- .opencode/skills/sk-code/SKILL.md:72
- .opencode/skills/sk-code/SKILL.md:112
- .opencode/skills/sk-code/mode-registry.json:16
- .opencode/skills/sk-code/mode-registry.json:45
- .opencode/skills/sk-code/mode-registry.json:83
- .opencode/skills/sk-code/shared/references/phase_detection.md:62
- .opencode/skills/sk-code/shared/references/phase_detection.md:74
- .opencode/skills/sk-code/code-implement/SKILL.md:157
- .opencode/skills/sk-code/code-quality/SKILL.md:144
- .opencode/skills/sk-code/code-debug/SKILL.md:130
- .opencode/skills/sk-code/code-verify/SKILL.md:110
- .opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py:2

## Assessment

- New information ratio: 0.70
- Questions addressed:
  - Which upgrade proposals have the highest leverage and clearest evidence?
  - What friction do users or agents encounter when routing, loading, applying, or verifying these skills?
  - Where do `code-implement`, `code-quality`, `code-debug`, and `code-verify` overlap or contradict each other?
- Questions answered:
  - The highest-leverage upgrade is to repair or retire/re-scope the advertised stack-folder verifier so it matches the current registry/sibling-packet architecture.
  - The next highest upgrades are a shared handoff schema, path-vocabulary normalization, parent-vs-packet permission precedence, and explicit checklist-overlap semantics.

## Reflection

- What worked and why: Ranking by user friction plus execution risk separated operational defects from documentation polish; the verifier defect outranks wording because it affects a runnable verification path.
- What did not work and why: Reusing only prior synthesis would have hidden the severity difference between stale prose and stale executable assumptions, so exact script and contract rereads were necessary.
- What I would do differently: If another iteration runs, validate the final proposal ordering against any remaining target README or test assets and check whether a resource map should be generated by the orchestrator/reducer rather than this leaf packet.

## Recommended Next Focus

Run a convergence pass over weak/remaining evidence: inspect target READMEs/tests only for contradictions to the five ranked proposals, then synthesize final `research.md` recommendations without editing the target skills.
