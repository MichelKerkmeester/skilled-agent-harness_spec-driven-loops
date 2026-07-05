# Iteration 2: code-implement and code-quality asset-level evidence

## Focus
This iteration deepened the evidence for `code-implement` and `code-quality`, including their README files, assets, scripts, delegated checklist assets, and the shared lifecycle/router references. The selected interpretation of the dispatch focus was narrow: assess per-skill usefulness and friction for these two modes only, then compare them against the cross-mode lifecycle. `code-debug` and `code-verify` remain deferred except as lifecycle handoff endpoints.

## Findings
1. `code-implement` is genuinely useful as an orchestration contract rather than as a local evidence store: it defines Phase 0 research, Phase 1 implementation, read-first behavior, baseline/blast-radius capture, restraint-ladder use, and sibling handoff, while its only local files are `SKILL.md` and `README.md`; resource depth is deliberately delegated to shared/surface packets. [SOURCE: .opencode/skills/sk-code/code-implement/SKILL.md:105] [SOURCE: .opencode/skills/sk-code/code-implement/SKILL.md:117] [SOURCE: .opencode/skills/sk-code/code-implement/SKILL.md:126] [SOURCE: .opencode/skills/sk-code/code-implement/README.md:63] [SOURCE: Glob:.opencode/skills/sk-code/code-implement/**/*]
2. `code-implement` has a high-friction wording gap: README quick-start says to load packet-owned `references/webflow/`, `references/opencode/`, and `references/motion_dev/`, but the actual links and globbed directory show those resources live in sibling surface packets (`code-webflow`, `code-opencode`, `code-animation`) rather than under `code-implement`. Upgrade proposal: replace “packet-owned references” wording with “surface-bundled references from sibling evidence packets” and add one explicit path example per surface. [SOURCE: .opencode/skills/sk-code/code-implement/README.md:42] [SOURCE: .opencode/skills/sk-code/code-implement/SKILL.md:64] [SOURCE: .opencode/skills/sk-code/code-implement/SKILL.md:70] [SOURCE: .opencode/skills/sk-code/code-implement/SKILL.md:72] [SOURCE: Glob:.opencode/skills/sk-code/code-implement/**/*]
3. `code-quality` has stronger local operational assets than `code-implement`: it owns a Webflow/general checklist, a comment-hygiene checker, a dist-staleness checker, a hook shim, tests, and README guidance, matching its Phase 1.5 position between implementation and verification. This makes it practically useful as the author-side quality gate. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:73] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:87] [SOURCE: .opencode/skills/sk-code/code-quality/README.md:31] [SOURCE: Glob:.opencode/skills/sk-code/code-quality/**/*]
4. `code-quality` carries stale local-path vocabulary for OpenCode checklists: its body repeatedly says `assets/opencode-checklists/`, but the actual checklist files are under `../code-opencode/assets/checklists/`; its references section sometimes links correctly while preserving the stale display text. Upgrade proposal: standardize display text and routing tables on `../code-opencode/assets/checklists/<name>.md` and reserve `assets/` for `code-quality`'s local Webflow/general checklist and scripts. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:68] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:90] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:103] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:241] [SOURCE: Glob:.opencode/skills/sk-code/code-opencode/assets/checklists/*.md]
5. Cross-mode lifecycle evidence supports a clean handoff model, but the routing references still contain contradictory checklist ownership: `phase_detection.md` puts Code Quality after implementation and before debug/verify, while `smart_routing.md` maps Webflow CODE_QUALITY to `code-review/assets/code_quality_checklist.md`, conflicting with `code-quality`'s local `assets/code_quality_checklist.md`. Upgrade proposal: make `code-quality/assets/code_quality_checklist.md` the author-side gate asset and keep `code-review/assets/code_quality_checklist.md` review-only. [SOURCE: .opencode/skills/sk-code/shared/references/phase_detection.md:46] [SOURCE: .opencode/skills/sk-code/shared/references/phase_detection.md:95] [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:121] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:89] [SOURCE: .opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:42]
6. `code-quality`'s dist-staleness contract is weaker than its P0 model implies: the skill says unchecked generated drift can block completion, but the dist checker “always exits 0” and only prints a warning when stale. Upgrade proposal: document that this script is advisory and require the mode to escalate or hand to `code-verify`/`code-debug` when it prints `STALE DIST WARNING`, rather than treating the script exit code as pass/fail evidence. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:156] [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:7] [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:57]

## Ruled Out
- Full `code-debug` and `code-verify` inspection was deferred because this iteration was scoped to deeper per-skill evidence for `code-implement` and `code-quality`.
- Treating missing local `code-implement/references/` as a missing dependency was ruled out; evidence shows a deliberate surface-packet delegation model, with the real issue being wording clarity.
- Treating `code-quality`'s `assets/opencode-checklists/` phrasing as a broken link everywhere was ruled out; several reference-section links point to the correct `../code-opencode/assets/checklists/` files despite stale display text.

## Dead Ends
- Do not promote “add local references to `code-implement`” as the primary fix; it would duplicate the surface-axis design. Prefer clarifying delegated ownership.
- Do not promote “move OpenCode checklists into `code-quality`” without further design review; current evidence supports read-only surface packet ownership in `code-opencode`.

## Edge Cases
- Ambiguous input: none materially blocking; the dispatch focus was interpreted as `code-implement` + `code-quality` only, with lifecycle comparison limited to shared router/phase evidence.
- Contradictory evidence: `smart_routing.md` maps Webflow CODE_QUALITY to `code-review/assets/code_quality_checklist.md`, while `code-quality` owns the author-side `assets/code_quality_checklist.md`; unresolved as a docs/routing contradiction, not a runtime failure. [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:121] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:89]
- Missing dependencies: no required state missing; `code-implement` lacks local `references/` or `assets/`, but this is treated as delegated surface evidence rather than missing state. [SOURCE: Glob:.opencode/skills/sk-code/code-implement/**/*]
- Partial success: deeper evidence was gathered for the requested two modes, but full ranking across all four workflow sub-skills remains incomplete until `code-debug` and `code-verify` receive the same asset-level pass.

## Sources Consulted
- .opencode/skills/sk-code/code-implement/SKILL.md:105
- .opencode/skills/sk-code/code-implement/SKILL.md:117
- .opencode/skills/sk-code/code-implement/SKILL.md:126
- .opencode/skills/sk-code/code-implement/README.md:42
- .opencode/skills/sk-code/code-quality/SKILL.md:68
- .opencode/skills/sk-code/code-quality/SKILL.md:89
- .opencode/skills/sk-code/code-quality/SKILL.md:156
- .opencode/skills/sk-code/code-quality/README.md:31
- .opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:42
- .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh:145
- .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:7
- .opencode/skills/sk-code/code-opencode/assets/checklists/universal_checklist.md:80
- .opencode/skills/sk-code/code-opencode/assets/checklists/skill_authoring.md:33
- .opencode/skills/sk-code/shared/references/phase_detection.md:46
- .opencode/skills/sk-code/shared/references/smart_routing.md:121
- .opencode/skills/sk-code/mode-registry.json:41

## Assessment
- New information ratio: 0.92
- Questions addressed:
  - What is each workflow sub-skill genuinely useful for in current form?
  - Where do `code-implement`, `code-quality`, `code-debug`, and `code-verify` overlap or contradict each other?
  - What coverage gaps exist across their `SKILL.md`, `references/`, and `assets/`?
  - Which upgrade proposals have the highest leverage and clearest evidence?
- Questions answered:
  - `code-implement` is most useful as a minimal orchestration/handoff contract with delegated surface evidence.
  - `code-quality` is most useful as an operational author-side gate, but needs path vocabulary and review-vs-quality ownership cleanup.

## Reflection
- What worked and why: Reading local file inventories before content clarified that `code-implement` has almost no local assets by design, so the upgrade should clarify delegation instead of adding duplicated resources.
- What did not work and why: The shared router still points to review-side quality assets for CODE_QUALITY, so lifecycle comparison surfaced a contradiction that cannot be fully resolved without inspecting debug/verify and possibly the hub resource map in later iterations.
- What I would do differently: Next pass should start from the same lifecycle seam and inspect `code-debug`/`code-verify` assets/scripts to determine whether stale ownership wording repeats there.

## Recommended Next Focus
Run the same asset-level pass for `code-debug` and `code-verify`, then produce a cross-mode handoff matrix that separates author-side quality, root-cause debugging, non-mutating verification, and findings-first review assets.
