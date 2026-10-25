# Iteration 1: Repo-Bound Inventory

## Focus

Angle 1 of 10: inventory `.skilled/`, `.opencode/` and `.github/` references in the quality packet and classify their portability. The strategy identifies this as the current focus. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:121]

## Actions Taken

1. Read the current run config, state log and strategy before selecting the focus.
2. Read `sk-code-quality/SKILL.md` and its scripts README, then searched the quality packet for `.skilled/`, `.opencode/` and `.github/` references.
3. Traced the comment and distribution checkers’ path resolution and configuration seams.
4. Compared a stored benchmark source map and report record to check whether recorded skill roots relocate.
5. Kept the investigation local; no network sources were used.

## Findings

- **OBSERVED — Host integration paths:** The quality mode maps `.skilled/skills/`, `.skilled/agents/` and `.skilled/commands/` to sibling checklists, and maps `.opencode/specs/` to system-spec-kit. Its live comment enforcement names Claude settings, `.skilled` Git hook installation and a `.github` workflow. These paths are repository and host integrations. Keep them in optional adapters around shared quality rules. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:102] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:105] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:129] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:130] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:131]
- **DERIVED — Relative dependency graph:** Relative links are portable when the linked tree moves with them. The packet links into the sk-code hub, sk-code-skilled, system-spec-kit and shared references; the scripts README points to hook adapters outside the skill folder. A standalone copy therefore needs a declared dependency contract or packaged shared resources. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:287] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:295] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:300] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/README.md:13] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/README.md:26] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/README.md:27]
- **OBSERVED — Checker portability:** The comment checker takes explicit file inputs, but its guidance points into `.skilled`. The dist checker permits `HOOK_FLAGS_CONFIG` to relocate its flags file, while its shared checker path and root discovery still assume the current `.skilled` layout. The first checker has a more portable invocation surface; the second exposes one narrow configuration seam, not a general layout setting. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:5] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:15] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:31] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:74] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:88] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:97]
- **OBSERVED — Historical benchmark path:** A stored benchmark source map and JSON report record an absolute `.opencode/skills/sk-code/code-quality` path from one developer checkout. That output is not relocatable; future benchmark outputs should use a repository-relative path or a root placeholder. [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--live-mode-b--live/source.md:11] [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.json:9]

## Questions Answered

Which repo-bound assumptions does sk-code-quality hold, and how should each be removed, made configurable or isolated so the mode works in a repository without this framework's layout?

**DERIVED:** Treat `.skilled` authoring maps, `.opencode` spec handling, `.github` CI wiring and hook registration as optional host adapters. Keep file-based checks in the portable core; declare or package sibling resources; replace absolute benchmark roots with relative paths. The dist checker has a flags-file override but still assumes the framework layout. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:102] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:129] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:131] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:31] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:74] [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--live-mode-b--live/source.md:11]

## Questions Remaining

- What does the quality gate catch, cost and miss, judged from its own benchmark reports, playbook scenarios, changelog entries and checker scripts?
- How should sk-code-quality hand off to verify, debug and sk-code-review, and where should the boundary between the quality and review checklists sit?
- How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality, and where could a repository keep its own quality configuration without forking the hub?
- Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages?

## Next Focus

Angle 2: assess what the quality gate catches, costs and misses across benchmark reports, playbook scenarios, changelog entries and checker scripts. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:41]

## Reflection

**INFERRED:** The repo-bound behavior comes from co-locating portable file checks with host-specific path maps and hook wiring. A clean confirmation would run the portable checkers and routing probes in a repository without `.skilled/`, `.opencode/` or `.github/`, and verify that optional integrations skip cleanly. This iteration inspected contracts and paths but did not execute checkers or routing probes.
