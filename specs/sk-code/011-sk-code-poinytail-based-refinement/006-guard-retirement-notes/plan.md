---
title: "Implementation Plan: Phase 6: guard-retirement-notes"
description: "Rewrites the retired router-sync note in the sk-code drift-guard umbrella script, points the three code-opencode docs that describe that suite at the same note, and adds a successor note to the retired Lane C benchmark index. Every note names what the old check covered, what partly covers it now, the gap and its owner (sk-code), as comment and prose edits only."
trigger_phrases:
  - "guard retirement notes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: guard-retirement-notes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash script comments, Markdown prose, and Python-syntax comments inside a Markdown router block |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `run-all-drift-guards.sh` before and after, `bash -n`, `shellcheck`, sk-doc `validate_document.py`, `verify_alignment_drift.py --check-router`, `compiled-route-guard.cjs`, the leaf-manifest and derived-metadata freshness gates, `rg` content checks |

### Overview
sk-code has two retired guards. The router-sync suite is recorded as missing in `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:50-53`, with no successor, gap list or owner. The Lane C router-mode benchmark was "the CI gate" (`.skilled/skills/sk-code/benchmark/README.md:25`), and its retirement callout (`README.md:14`) names no successor. Three code-opencode docs also describe the router-sync suite without saying what covers it now: `scripts/README.md:12` and `:20`, `SKILL.md:55-59` and `:173`, and `references/shared/alignment-verification-automation.md:58-61` and `:123-126`.

This phase writes one retirement note for each retired guard and points every doc that describes the router-sync suite at the same facts. Each note covers what the check did, what partly covers it now, the gap, and the owner. No executable line changes.

What the deleted suite checked, read from the file before it was deleted (`git show b45ea54cea3^:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts`, describe blocks at lines 86, 162, 281 and 383):
1. Machine router against the filesystem and prose: every router path exists on disk, every routable reference or asset doc is routed, and every full path the prose maps name is routed.
2. The parent surface RESOURCE_MAP equals the union of the surface children's maps plus the parent tier.
3. A bijection through `qualifiedIdToLeaf`: compiled route-gold destinations, `leaf-manifest.json` and the code-opencode RESOURCE_MAP agree.
4. Every playbook routing scenario's `expected_resource` is emitted by the surface router, and every scenario prompt selects an intent.

The current note at `run-all-drift-guards.sh:51-52` says only that the suite "checked that this surface's router stayed in step with the compiled routing snapshot". That describes part of check 3. The other docs describe only check 2 (`SKILL.md:55-57`, `alignment-verification-automation.md:58-61`). All of them get the four-check description.

What covers each check now:

| Check | Coverage now | Evidence |
|---|---|---|
| 1, dead paths | `verify_alignment_drift.py --check-router`, run locally by the umbrella script | `run-all-drift-guards.sh:44-45`; `ROUTER-DEAD-PATH` at `alignment-verification-automation.md:104` |
| 1, orphans and prose paths | None | No script in the umbrella or the workflow checks them |
| 2, parent equals union | None | `alignment-verification-automation.md:58-61`; `SKILL.md:55-57` |
| 3, compiled side | `routing-registry-drift.yml`, CI only: the compiled-serving admission step, warn-only, and the leaf-manifest freshness step | `routing-registry-drift.yml:169-176` and `:196`; the admission library loads `qualifiedIdToLeaf` at `.skilled/bin/lib/compiled-route-admission.cjs:363` |
| 3, RESOURCE_MAP to manifest | None | `rg -l RESOURCE_MAP` over every script the workflow job calls returns nothing |
| 4, compiled side | The same admission step scores compiled decisions against playbook routing gold, warn-only | `routing-registry-drift.yml:170-173` |
| 4, surface router | None | The surface-router replay was deleted with the lane |

Workflow limits: it runs only in CI, on pushes to `main` and `skilled/v*` and on pull requests to `main` (`routing-registry-drift.yml:20-23`, `66-67`), behind path filters. The filter `.skilled/skills/*/manual-testing-playbook/**` (`:53`) does not match the playbooks nested under `sk-code/sk-code-*/`.

Gap owner: sk-code, confirmed by the coordinator. It matches research.md Section 11, item 7.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place documentation. The umbrella script comment is the full record for the router-sync suite. The alignment reference carries the same facts as a table, and the other docs summarize or point at them.

### Key Components
- **Umbrella script note** (`scripts/run-all-drift-guards.sh:50-53`): the full retirement note for the router-sync suite, with four checks, partial successors, the gap and the owner.
- **Alignment reference** (`references/shared/alignment-verification-automation.md`): the "What it does not check" text (`:58-61`) points to a new subsection, "Retired router-sync suite", placed before "Severity model" (`:71`). The subsection carries the four checks and the coverage table. The Doc pointer item (`:123-126`) is reworded to match.
- **code-opencode `SKILL.md`**: the router-block comment (`:55-59`) keeps its equality focus, states that nothing checks it, and points at the script note. The verification-gate bullet (`:173`) carries the four checks in prose.
- **Scripts README** (`scripts/README.md:12` and `:20`): the overview sentence and the contents row stop saying "no replacement yet" and "recorded as missing", and carry the four checks in prose.
- **Lane C index callout** (`benchmark/README.md:14`): a "Successor" blockquote right after the "Retired lane" one.

### Data Flow
None at runtime. Every edit is a comment or prose. One indirect path exists. `sk-code-opencode/SKILL.md` is a compiled-routing input for the sk-code hub: the pre-commit `gate:route-remint` watches `.skilled/skills/$ROUTE_HUB/*/SKILL.md` (`.skilled/scripts/git-hooks/pre-commit:443`). So the build checks hub freshness after that edit.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Baselines below were taken at planning time, 2026-10-09. The build recaptures them, because the working tree changes.

- **Umbrella script.** It exited 1. The alignment-drift guard failed on one unrelated error, `specs/hooks/022-smart-rule-injection/graph-metadata.json:1 [JSON-PARSE] [ERROR]`, in a file the working tree already had modified. The stack-folders guard passed with 6 folders. REQ-002 therefore compares the after run to the baseline captured at build time: same exit code and same `PASS:`/`FAIL:` lines. It does not require exit 0.
- **Comment-only proof.** The script diff must add or remove only `#` lines. The `SKILL.md` diff inside the router block must touch only `#` lines, with no change to `DEFAULT_RESOURCE` or `RESOURCE_MAP` entries.
- **Script static checks.** `bash -n` and `shellcheck` both exited 0.
- **Docs.** `validate_document.py --blocking-only` printed `VALID`, 0 issues, exit 0 on all four Markdown targets. Each must still pass.
- **Router block still parses.** `verify_alignment_drift.py --root .skilled/skills/sk-code --check-router` exited 0 with Errors 0, Warnings 0 and no `ROUTER-DEAD-PATH`.
- **Compiled-routing freshness.** `node .skilled/bin/compiled-route-guard.cjs` exited 0 with sk-code `fresh`. `ci-leaf-manifest-freshness.cjs` reported `checked=14 fresh=14 failed=0` and `ci-skill-derived-freshness.cjs` reported `checked=14 fresh=14 stale=0 errored=0`. If sk-code reports stale after the `SKILL.md` edit, the build records it and does not re-mint. A re-mint writes files outside this phase's scope, and the pre-commit `gate:route-remint` re-mints at commit time.
- **Content checks.** `rg` for the workflow path, the four checks, the gap wording and the owner in every target.
- **Gap.** No existing command checks that a retirement note names a successor or an owner, so REQ-001 and SC-001 are proved with `rg` and by reading the result. This plan does not add a checker, because the spec does not ask for one.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- No dependency on phases 002 to 005. None of them lists any of this phase's five files in its Files to Change.
- **Compiled-routing re-mint.** The `SKILL.md` edit can stale the sk-code compiled-routing manifest. A re-mint, if needed, belongs to the commit step (`gate:route-remint`) or to the orchestrator, not to this phase.
- **Changelog.** The spec's Phase Context asks for a changelog refresh in `../changelog/` when the phase closes. That folder does not exist under the parent packet, and it is outside this phase's five files, so the orchestrator handles it at close. The same applies to any `sk-code-opencode/changelog/` entry for the doc edits.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every edit is comment or prose only. To roll back, restore the five files to HEAD: `git restore .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh .skilled/skills/sk-code/benchmark/README.md .skilled/skills/sk-code/sk-code-opencode/scripts/README.md .skilled/skills/sk-code/sk-code-opencode/SKILL.md .skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md`. If a commit already re-minted the sk-code manifest for the `SKILL.md` edit, the next commit of the restored `SKILL.md` re-mints it back through the same gate.
<!-- /ANCHOR:rollback -->

---
