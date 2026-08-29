# Iteration 3: Deeper Evidence for `code-debug` and `code-verify`

## Focus

This iteration investigated deeper per-skill evidence for `code-debug` and `code-verify`, including each `SKILL.md`, available local `assets/`, scripts, README navigation, and handoff/friction with `code-implement` and `code-quality`. Fixes were intentionally not implemented.

## Findings

1. `code-debug` is useful as the Phase 2 root-cause mode: reproduce or characterize a concrete symptom, capture exact evidence, localize symptom to source cause, apply one-cause fixes, rerun the original reproduction, then return through `code-quality` before final evidence in `code-verify`. [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:123] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:128] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:130] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:131]
2. `code-debug` has a strong local universal checklist, but its checklist still contains older path vocabulary (`references/webflow/...`, `references/opencode/shared/...`, `assets/universal/checklists/...`) that conflicts with the current surface-axis layout. [SOURCE: .opencode/skills/sk-code/code-debug/assets/universal-debugging_checklist.md:69] [SOURCE: .opencode/skills/sk-code/code-debug/assets/universal-debugging_checklist.md:70] [SOURCE: .opencode/skills/sk-code/code-debug/assets/universal-debugging_checklist.md:90] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:227]
3. `code-debug`'s `SKILL.md` has local-vs-delegated resource drift: Resource Domains list local-looking `assets/webflow-debugging_checklist.md` and `references/webflow-debugging/*`, while References and README point to delegated `../code-webflow/...` paths. [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:89] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:91] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:227] [SOURCE: .opencode/skills/sk-code/code-debug/README.md:48]
4. `code-verify` is useful as the non-mutating Phase 3 evidence gate: the registry marks it read/Bash/Grep/Glob only, its contract forbids edits and subagents, and it requires fresh command evidence plus baseline/current/delta/claim-scope reporting before completion claims. [SOURCE: .opencode/skills/sk-code/mode-registry.json:80] [SOURCE: .opencode/skills/sk-code/mode-registry.json:83] [SOURCE: .opencode/skills/sk-code/code-verify/SKILL.md:124] [SOURCE: .opencode/skills/sk-code/code-verify/SKILL.md:152] [SOURCE: .opencode/skills/sk-code/code-verify/SKILL.md:179]
5. `code-verify` has strong operational assets: universal pre-claim checklist, performance-loading checklist, alignment-drift verifier with tests, and stack-folder verifier. Direct execution showed the alignment verifier passes against `code-verify`. [SOURCE: .opencode/skills/sk-code/code-verify/assets/universal-verification_checklist.md:30] [SOURCE: .opencode/skills/sk-code/code-verify/assets/performance_loading_checklist.md:46] [SOURCE: .opencode/skills/sk-code/code-verify/assets/scripts/README.md:68] [SOURCE: bash:python3 .opencode/skills/sk-code/code-verify/assets/scripts/verify_alignment_drift.py --root .opencode/skills/sk-code/code-verify]
6. `code-verify` exposes the highest-priority concrete friction found this iteration: `verify_stack_folders.py` is documented as a stack-folder/surface-router integrity checker, but from its actual location it resolves `SK_CODE` to `code-verify` and fails because `code-verify/SKILL.md` has no `STACK_FOLDERS` dict. [SOURCE: .opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py:16] [SOURCE: .opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py:18] [SOURCE: .opencode/skills/sk-code/mode-registry.json:16] [SOURCE: bash:python3 .opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py]

## Ruled Out

- Treating missing local Webflow debug/verify assets as a hard dependency was ruled out because README and References sections point to delegated `code-webflow` assets. [SOURCE: .opencode/skills/sk-code/code-debug/README.md:48] [SOURCE: .opencode/skills/sk-code/code-verify/README.md:99]
- Treating `verify_stack_folders.py` as currently healthy was ruled out by direct non-mutating execution. [SOURCE: bash:python3 .opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py]
- Re-inspecting `code-implement` and `code-quality` deeply was deferred because iteration 2 covered them and this iteration was scoped to debug/verify. [SOURCE: research/iterations/iteration-002.md]

## Dead Ends

- A local `code-debug/references/` or `code-verify/references/` inspection path is a dead end for current evidence gathering: inventory showed no local references directories under either packet, and both packets rely on delegated sibling/shared references instead. [SOURCE: Glob:.opencode/skills/sk-code/code-{debug,verify}/**/*]
- The stack-folder verifier should be treated as a proposal candidate, not a verifier to trust in its current location. [SOURCE: bash:python3 .opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py]

## Edge Cases

- Ambiguous input: none; the user explicitly named `code-debug` and `code-verify` plus the target packet.
- Contradictory evidence: local Resource Domains names imply local Webflow debug/verify files, while README/References and inventory show delegated `code-webflow` files; unresolved as documentation wording drift, not capability loss. [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:89] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:227] [SOURCE: .opencode/skills/sk-code/code-verify/SKILL.md:93] [SOURCE: .opencode/skills/sk-code/code-verify/README.md:99]
- Missing dependencies: no required state was missing; optional local `references/` directories for debug/verify were absent and replaced by delegated sibling/shared references.
- Partial success: none; the scoped debug/verify evidence was gathered, while fixes were intentionally not implemented.

## Sources Consulted

- .opencode/skills/sk-code/code-debug/SKILL.md:123
- .opencode/skills/sk-code/code-debug/assets/universal-debugging_checklist.md:69
- .opencode/skills/sk-code/code-debug/README.md:48
- .opencode/skills/sk-code/code-verify/SKILL.md:124
- .opencode/skills/sk-code/code-verify/assets/universal-verification_checklist.md:30
- .opencode/skills/sk-code/code-verify/assets/performance_loading_checklist.md:46
- .opencode/skills/sk-code/code-verify/assets/scripts/README.md:68
- .opencode/skills/sk-code/code-verify/assets/scripts/verify_alignment_drift.py:6
- .opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py:16
- .opencode/skills/sk-code/mode-registry.json:80
- bash: `python3 .opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py`
- bash: `python3 .opencode/skills/sk-code/code-verify/assets/scripts/verify_alignment_drift.py --root .opencode/skills/sk-code/code-verify`

## Assessment

- New information ratio: 0.92
- Questions addressed: usefulness, overlap/contradiction, coverage gaps, handoff friction, and proposal ranking for `code-debug`/`code-verify`.
- Questions answered: `code-debug` usefulness and delegated-resource friction; `code-verify` usefulness, local assets/scripts, non-mutating boundary, and stack-folder verifier defect.

## Reflection

- What worked and why: Pairing file reads with direct non-mutating script execution separated documentation drift from operational failure.
- What did not work and why: Broad grep over brace-like paths returned extra Webflow matches; only directly tied debug/verify evidence was retained.
- What I would do differently: Next iteration should rank proposals across all four workflow modes instead of continuing per-skill inventory.

## Recommended Next Focus

Rank upgrade proposals across all four workflow modes by severity, confidence, and implementation effort. Highest candidates: repair or relocate `verify_stack_folders.py`; normalize stale debug/verify Resource Domains and checklist path vocabulary; add a compact cross-mode handoff matrix.
