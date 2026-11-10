# Iteration 2: UNKNOWN Surface and Portable Core

## Focus

Angle 2 of 10: the UNKNOWN-surface path. What does a quality run do in a repository with no .skilled tree, and what is the smallest portable core?

## Actions Taken

1. Read the run config, state log, strategy, findings registry and iteration 1 before choosing the focus. Confirmed the iteration 2 narrative and delta targets were absent.
2. Compared shared surface detection and the root router's UNKNOWN fallback with the quality mode, its checklist, playbook scenario and checker scripts. No network sources were used.
3. The strategy still names the historical benchmark-path follow-up as its next focus, while this dispatch specifies the UNKNOWN-surface path. I followed the dispatched focus and left the benchmark work open. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:127]

## Findings

- **OBSERVED:** The detector reserves SKILLED for a current directory or changed/target file whose resolved real path lands inside the hub's .skilled directory. A generic root package.json with no .skilled target is UNKNOWN, and the detection table says no standards apply until the surface is clarified. The router asks which surface applies, which paths are changing, which verification command proves the claim and whether a new route should be planned. [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:25] [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:36] [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:89] [SOURCE: .skilled/skills/sk-code/ROUTER.md:182] [SOURCE: .skilled/skills/sk-code/ROUTER.md:193]
- **OBSERVED:** The quality mode consumes the parent router's surface result. Its machine-readable sequence enters UNKNOWN_FALLBACK when no routable target path is available. The documented workflow still requires its general quality checklist, comment-hygiene checks for changed comment-capable files and P0/P1/P2 author checks. Surface-specific checklists load only for listed target families. A repository with no known surface therefore reaches clarification, not a generic stack-specific checklist. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:57] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:87] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:95] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:112] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:161] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:179]
- **OBSERVED:** The comment checker accepts explicit file paths and uses Python standard-library modules. It recognizes TypeScript, JavaScript, Python, shell and JSONC extensions. An unsupported extension returns the skipped status, so that result cannot count as a clean quality pass. The distribution-staleness checker calls a fixed helper under .skilled and derives the repository root from that layout. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:5] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:17] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:35] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:48] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:74] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:85]
- **INFERRED:** The smallest portable core is a surface-neutral P0/P1/P2 baseline, an explicit changed-file list and checkers that receive those paths. Keep host hooks, .skilled path maps, distribution checks and language-specific authoring rules as optional adapters. The current always-loaded checklist identifies JavaScript and CSS standards, so copying it wholesale would not create a general repository core. A later smoke run in a repository with no .skilled tree would confirm whether the intake and portable subset work without hub paths. [INFERENCE: based on the UNKNOWN contract, quality resource map and checker inputs] [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:25] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:87] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:99] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:5] [SOURCE: .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:31]
- **OBSERVED:** The strategy's Next Focus still points to a historical benchmark-path follow-up. This conflicts with the active dispatch focus, so this iteration followed the dispatch and retained benchmark coverage for the next iteration. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:127]

## Questions Answered

The dispatched UNKNOWN-surface question is answered: a generic repository without a .skilled target enters UNKNOWN, the router requests surface and verification details, and the quality mode uses UNKNOWN_FALLBACK when no target path is routable. The portable-core recommendation remains inferred. [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:89] [SOURCE: .skilled/skills/sk-code/ROUTER.md:184] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:168]

No strategy key question is fully closed this iteration. The first open question remains because this pass did not assess benchmark outcomes, quality-gate cost or misses. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:39]

## Questions Remaining

- What does the quality gate catch, cost and miss, judged from its own benchmark reports, playbook scenarios, changelog entries and checker scripts? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:39]
- How should sk-code-quality hand off to verify, debug and sk-code-review, and where should the boundary between the quality and review checklists sit? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:40]
- How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality, and where could a repository keep its own quality configuration without forking the hub? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:41]
- Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:42]

## Next Focus

Angle 3: examine benchmark reports, playbook scenarios, changelog entries and checker scripts to distinguish measured catch rates and costs from stated coverage. Do not treat unmeasured misses as known. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:39]

## Reflection

**INFERRED:** This iteration describes the route documented in the shared router and quality mode. It did not execute a quality run in a separate repository without .skilled. That fixture would confirm how the active orchestration presents the UNKNOWN questions and whether the proposed portable subset runs independently. [INFERENCE: the inspected sources define the fallback and checker inputs, but no separate repository was exercised] [SOURCE: .skilled/skills/sk-code/ROUTER.md:182] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:168] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:5]

## SCOPE VIOLATIONS

- scope_violation: The final strict packet validation reported an enforced source-fingerprint mismatch and generated-description drift in graph-metadata.json. Applying the suggested derived-metadata repair would modify graph-metadata.json, which is outside the allowed iteration write paths, so I did not run it.
