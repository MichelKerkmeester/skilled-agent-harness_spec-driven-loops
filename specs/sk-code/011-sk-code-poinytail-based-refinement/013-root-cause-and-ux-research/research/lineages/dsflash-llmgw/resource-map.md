---
title: "Resource Map — Root causes and external-user experience (dsflash-llmgw lineage)"
description: "Evidence-derived resource map for the detached dsflash-llmgw lineage: packet records, tree code, changelogs and the read-only commands run."
trigger_phrases: []
---
# Resource Map

## Summary

- Scope: process errors (a)-(g), the eight named product issues, and the external-user path from clone to recovery.
- Generated from: ten iterations whose per-iteration sources are recorded in `iterations/iteration-NNN.md` and `deltas/iter-NNN.jsonl`.
- Primary local authorities: the packet children 001-011 records, the running tree under `.skilled/`, `README.md`, and the system-spec-kit / deep-loop-runtime changelogs.
- Resource status is an evidence snapshot of the tree as read on 2026-10-10; `.skilled/` can change while other agents edit it, so lines are cited as they read at read time.

## Packet Records

| Resource | Action | Status | Evidence use |
|---|---|---|---|
| `011-round-four-remediation/goal.md` | Read | OK | D4 builder/orchestrator split; child progress and orchestrator step log |
| `011-round-four-remediation/00N-*/goal.md` (all) | Read | OK | PENDING-ORCHESTRATOR blocks, review results, per-child deviations |
| `011-round-four-remediation/005-doc-claims-hardening/{goal.md,tasks.md,scratch/fix-chain.json,scratch/check-units.cjs}` | Read | OK | The `$'` trigger, the repair record, the pre-edit occurrence check |
| `011-round-four-remediation/006-deep-loop-findings-parser/scratch/{reducer-yield-*.txt,probe/*}` | Read | OK | 146/0/43 measurement; over-drop and same-id correction |
| `011-round-four-remediation/007-hook-deadline-margins/implementation-summary.md` | Read | OK | Late-write loss and the two compounding limitations |
| `002-surface-contract-alignment/{goal.md,implementation-summary.md,scratch/after-sa001.tsv}` | Read | OK | Battery aggregate 13/17 and 2/5; baseline 11/15 |
| `001-ponytail-deep-research/research/research.md` | Read | OK | Rounds one to three synthesis and lineage disagreements |
| `013-root-cause-and-ux-research/{spec.md,goal.md}` | Read | OK | Deliverable contract and completion criteria |
| All child `implementation-summary.md` Known Limitations | Read | OK | Iteration 9 sweep: resolved exclusions vs current residuals |

## Tree Code and Documents

| Resource | Action | Status | Evidence use |
|---|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts` | Read | OK | Replacer-function fix; absent version-uniqueness check |
| `.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` | Read | OK | Code-span/fence blanking and known-bad rows |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Read | OK | Link-repoint code-span guard |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` | Read | OK | Anchor parser code-span blanking; binding-row notations |
| `.skilled/skills/system-spec-kit/runtime/scripts/reduce-state.cjs` | Read | OK | Yield rule at 1002-1004 |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs` | Read | OK | One-shape parser and left-margin rule |
| `.skilled/bin/tests/compiled-route-{admission,manifest,front-door,surface-hint}.test.cjs` | Read; admission run | OK | The three red-suite mechanisms; hint test surface |
| `.skilled/bin/compiled-route{,-guard,-sync,-admission,-manifest}.cjs` | Read | OK | Front-door flags, guard message, 7-entry HUBS, admission loader |
| `.skilled/bin/lib/compiled-routing/**` (fixtures, harnesses, engine) | Read; evaluation re-run in memory | OK | jev case defer; route-gold case counts; applySurfaceHint |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | Read | OK | Unpassed `--surface-hint` at the spawn |
| `.skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md` | Read | OK | Pass rule; triage naming the path-owner pull |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Read; refusal observed live | OK | Ambiguous-branch message gap |
| `.skilled/scripts/git-hooks/{pre-commit,tests}` | Read | OK | Trust block and silent no-op; hook test suite |
| `.skilled/skills/system-spec-kit/runtime/hooks/**` | Read | OK | Deadline constants, consumers, deadline test |
| `README.md` | Read | OK | Quick Start, hooks, doctor routes, recovery, FAQ |

## Commands Run (read-only in repository terms)

| Command | Result |
|---|---|
| `node .skilled/bin/.../append-mode-event.cjs --mode research ...` (11 calls) | Every iteration and init recorded; `deep-research-state.jsonl` refreshed from the ledger |
| `node --test .skilled/bin/tests/compiled-route-admission.test.cjs` | `tests 29`, `pass 28`, `fail 1` (`actual: 86, expected: 80`) |
| In-memory `compileRegistry` + `evaluateRoute` on the cli-external fixture | `jev-transport-single` -> action defer, expected route |
| `python3 hvr_scan.py .skilled/skills/sk-code/SKILL.md` | `x27` semicolons, `x9` em dashes, `hard blockers: 36` |
| Admission gold-corpus count per hub via its own loader | 86 total across `DEFAULT_ON_HUBS` |
| Case counts: archived `route-gold.typed.json` vs live fixture | 9 vs 18 |
| `grep -c '"type":"iteration"' deep-research-state.jsonl` | 10 (after the tenth append) |

## Changelogs Consulted

| Resource | Evidence use |
|---|---|
| `.skilled/skills/system-spec-kit/changelog/v2.1.3.0.md` | The `$'`/`$&` replacement-pattern incident and fix |
| `.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md` | Upgrade reversibility, before-images, refusal recording |
| `.skilled/skills/system-spec-kit/changelog/v2.7.2.0.md` | Deadline rounds and the version collision note |
| `.skilled/skills/system-deep-loop/runtime/changelog/v1.9.4.0.md` | Parser/shape and reducer yield change |

## Gaps

- The three UNKNOWN incidents ((b), (c), (d)) have no surviving run record; the settling artifacts are named in `findings-registry.json` `unknowns`.
- The manifest suite and the git-hooks suite were not run in this lineage because their sandboxes write outside the write boundary; the phases name them as proving commands.
- No host write latency measurement exists anywhere in the tree; the deadline values remain judgments.
