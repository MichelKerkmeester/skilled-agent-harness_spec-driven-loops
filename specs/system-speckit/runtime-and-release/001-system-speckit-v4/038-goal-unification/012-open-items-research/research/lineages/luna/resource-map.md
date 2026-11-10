---
title: "Adversarial second-lens evidence map"
session_id: "fanout-luna-1789202042622-4x183m"
lineage: "luna"
---

# Resource Map

This map treats the first report at `research/research.md:37-49,71-217` as a hypothesis. The
audited source is the repository file named in each row; line ranges are the evidence boundary for
claims about current behavior. Iteration records contain the reasoning and alternatives, but do not
replace the source files.

| Open item | First-report hypothesis | Audited authority | Evidence disposition |
|---|---|---|---|
| Prose line width | Retire the 100-character concept at zero cost (`research/research.md:71-97`) | `.opencode/skills/sk-code/shared/references/universal/code-style-guide.md:196-200`; `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:599-601`; `.opencode/scripts/git-hooks/commit-msg:164-168`; `.opencode/skills/system-spec-kit/references/structure/grep-convention.md:142-148` | No blocking prose gate is supported; wholesale retirement is underspecified because several narrower width contracts remain. |
| Unowned surfaces | Keep copies, add runtime-label documentation, relocate the checker (`research/research.md:101-126`) | `.opencode/hooks/shared/hook-flags.cjs:34-52`; `.opencode/hooks/shared/hook-flags.sh:42-47`; `.opencode/hooks/shared/README.md:29-44`; `.opencode/hooks/goal/cursor/goal-inject.mjs:76-89`; `.opencode/hooks/goal/devin/goal-inject.mjs:64-79`; `.opencode/hooks/goal/pi/goal-context.ts:186-214`; `.opencode/hooks/goal/bin/goal.cjs:385-396`; `.env.example:289-307`; `.opencode/hooks/goal/README.md:126-137`; `recursive-child-manifest.vitest.ts:65-93` | Flag ownership and runtime-label gap are real. Resend wording is event-triggered, and relocation remains conditional because tested callers pass explicit paths. |
| Root README goal section | Add it to generic `DOCS` and add three assertions (`research/research.md:130-155`) | `README.md:859-866`; `.opencode/plugins/tests/goal-doc-contract.test.cjs:23-45`; `.opencode/hooks/goal/cursor/goal-inject.mjs:1-12`; `.cursor/hooks.json:79-87`; `.cursor/SYNC.md:81-81`; `corpus.mjs:19-31`; `retrieval-conventions.md:276-284` | Test the section semantically, keep it out of retrieval, and retain a negative control for Cursor registration versus delivery. |
| The word `goal` | Rename a review manifest and checker (`research/research.md:159-182`) | `.opencode/commands/deep/assets/deep-review-auto.yaml:369-378`; six current manifest headers at `iteration-002.md:156-163`; `check-goal-file-manifest.sh:4-40`; `recursive-child-manifest.vitest.ts:10-23,65-93` | The basename is used for six goal-touch provenance ledgers; a global rename changes an accepted workflow input and is not justified without ownership or an incident. |
| Machine checks | Add one blocking CLI Vitest file with four checks (`research/research.md:186-217`) | `.opencode/plugins/opencode-goal.js:45-51,68-80,239-247`; `.env.example:289-307`; `.opencode/hooks/shared/hook-flags.test.cjs:35-71`; `.opencode/plugins/tests/goal-doc-contract.test.cjs:20-45`; `.github/workflows/spec-kit-check.yml:94-106`; `.github/workflows/advisory-checks.yml:26-35` | Check owner-specific executable contracts and negative controls; do not add shallow roster, basename, prose, or historical-citation scans. |

## Provenance and termination

- `iterations/iteration-001.md:232-267` records the first pass's claim disposition and sources.
- `iterations/iteration-002.md:11-239` records one direct recommendation per open item, the exact
  difference from the first report, cost/blast-radius analysis, and the condition under which the
  first answer would win.
- `deltas/iter-001.jsonl` and `deltas/iter-002.jsonl` carry the iteration records and finding
  records; `deep-research-state.jsonl` carries the route-proof records and terminal completion
  record.
- The configured cap was reached after two iterations. The terminal reason is recorded as
  `stopReason: maxIterationsReached` in `convergence-report.md`, `deep-research-config.json`, and
  the terminal state record.
