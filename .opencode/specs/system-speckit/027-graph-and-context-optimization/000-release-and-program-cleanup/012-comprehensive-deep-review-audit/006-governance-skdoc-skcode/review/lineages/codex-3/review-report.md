# Deep Review Report - Governance, sk-doc, sk-code

Session: `fanout-codex-3-1780595350529-mur2m0`

Verdict: `CONDITIONAL`

The review loop reached full dimension coverage and the final stabilization pass found no new findings. The result is not `PASS` because four active P1 findings remain.

## Findings

### F001 - P1 - Strict spec validation exits before fallback

Location: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1044`

`run_node_orchestrator` is documented to return `1` when shell validators should handle the folder. Because `main` calls it bare under `set -e`, that fallback path exits the script. The observed strict validation run against the target packet returned exit 1 with no diagnostics.

Concrete fix: wrap the orchestrator call in an explicit conditional and fall through to shell validators on fallback-only status.

### F002 - P1 - Level 1 implementation-summary rule drift

Location: `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh:89`

`AGENTS.md:281` and `template-structure.js docs 1` both say Level 1 includes `implementation-summary.md`. The shell file rule says Level 1 is only `spec.md`, `plan.md`, and `tasks.md`, then skips `implementation-summary.md` until completion evidence appears.

Concrete fix: make the rule match the documented Level 1 contract, or change the contract to mark implementation summaries conditional.

### F003 - P1 - Comment hygiene enforcement is bypassable in the authorized owner flow

Location: `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:66`

The rule says two gates check every code comment write and cannot be bypassed by `--no-verify` without explicit override and documentation. The repo also authorizes owner-commanded AIs to push directly to main, while the GitHub workflow runs only on pull requests and local hooks are opt-in/bypassable.

Concrete fix: enforce comment hygiene on direct pushes/main CI, or revise the constitutional text to match the real enforcement boundary.

### F004 - P1 - Target packet is missing required docs and metadata

Location: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:23`

The target packet declares Level 1 but lacks `plan.md`, `tasks.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json`. That conflicts with the Level 1 and mandatory metadata rules in `AGENTS.md:281` and `AGENTS.md:291`.

Concrete fix: generate the Level 1 docs and metadata, or define an explicit fan-out review control-artifact type that the validator recognizes.

### F005 - P2 - sk-code checklist assets fail sk-doc asset validation

Location: `.opencode/skills/sk-code/assets/opencode/checklists/skill_authoring.md:8`

sk-doc's `asset` rules require an `overview` section. Representative sk-code authoring checklist assets start with `## 1. PURPOSE`, and the sk-doc validator reports `missing_required_section: overview`.

Concrete fix: add/rename `Overview` sections in the affected checklists, or add a more specific document type for sk-code authoring checklist assets.

### F006 - P2 - Python scripts named .sh trigger shell verifier warnings

Location: `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:1`

The alignment verifier classifies `.sh` as shell. Two sk-code `.sh` files are Python scripts with Python shebangs, so the shell checklist reports missing bash shebang and strict mode.

Concrete fix: rename the files to `.py` and update callers, or classify by shebang before extension.

## Iteration Summary

| Iteration | Focus | New findings | Verdict |
|---|---|---:|---|
| 001 | Correctness validation gates | 2 | CONDITIONAL |
| 002 | Security/governance enforcement | 1 | CONDITIONAL |
| 003 | Target packet traceability | 1 | CONDITIONAL |
| 004 | sk-doc/sk-code drift | 2 | PASS |
| 005 | Stabilization | 0 | PASS |

## Final State

Active P0: 0

Active P1: 4

Active P2: 2

Release readiness: conditional on resolving or explicitly accepting F001-F004.
