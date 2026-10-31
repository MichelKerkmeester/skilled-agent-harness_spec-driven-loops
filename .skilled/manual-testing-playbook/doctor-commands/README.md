---
id: doctor-commands-readme
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
version: 2.4.0.0
---

# Doctor Commands

## 1. OVERVIEW

Manual testing scenarios for the `/doctor` command surface, in one central package. This folder holds every doctor scenario file, and each file is the canonical row for its `DOC` ID.

The folder replaces the six skill playbooks the doctor scenarios were spread across, and this document replaces the five category READMEs that used to sit beside them: the system-spec-kit, sk-git, sk-code, mcp-code-mode and system-deep-loop copies. The shared rules, the two test environments and the placement rules are recorded here once instead of five times over.

---

## 2. SCENARIO CONTRACT

Each scenario has a Markdown file named for its topic (`doctor-<short-name>.md`, with no numeric filename prefix) with five numbered sections:

1. Overview
2. Scenario contract
3. Test execution, holding the prompt, the commands, the expected output, the evidence and the pass/fail rule, then the failure triage
4. Source files
5. Source metadata

A scenario is run as written. Its verdict is `PASS`, `FAIL` or `SKIP`, and a `SKIP` names the sandbox or runtime blocker that prevented the run. The root playbook owns the review protocol, the evidence requirements and the release-readiness rule.

---

## 3. SCOPE

| Doctor command | Scenarios | IDs | What the set proves |
|---|---|---|---|
| `/doctor:agents-md` | 4 | DOC-396, DOC-397, DOC-404, DOC-405 | The two claims only a live session can settle, plus the check and the embed-then-restore round trip |
| `/doctor:ci` | 3 | DOC-392, DOC-393, DOC-394 | The read-only report, the scaffold refusals, and the toggle round trip |
| `/doctor:deep-loop` | 4 | DOC-331, DOC-332, DOC-333, DOC-368 | Lazy-init and empty-graph availability, the convergence signal, and scope selection |
| `/doctor:env` | 3 | DOC-354, DOC-355, DOC-356 | Inspecting switches, saving a preference behind a yes, and switches that are never saved |
| `/doctor:git` | 7 | DOC-369 to DOC-374, DOC-384 | Listing gate state, switching one gate, copying the rules once, changing one, refusing an invalid one, the menu and the setup check |
| `/doctor:helper` | 2 | DOC-400, DOC-401 | A read-only pick run in place, and a writing pick handed back with the fallback |
| `/doctor:install` | 1 | DOC-399 | The five ordered steps from `list`, and a guided run that prints the checklist without writing |
| `/doctor:mcp` | 5 | DOC-375 to DOC-378, DOC-380 | Install with an approval per write, a read-only debug, a debug with `--fix`, the menu, and flag refusals |
| `/doctor:runtime-mirrors` | 2 | DOC-352, DOC-353 | Every mirror in sync, and one drifted mirror |
| `/doctor:setup` | 1 | DOC-391 | The target table, the five read-only legs, and the repair command per failing leg |
| `/doctor:sk-code` | 3 | DOC-382, DOC-383, DOC-395 | The setup battery, the battery on a pre-v4 checkout, and the quality config |
| `/doctor:sk-skill` | 2 | DOC-402, DOC-403 | The fleet and single-skill check rows, and the convert plan before any write |
| `/doctor:skill-advisor` | 14 | DOC-348, DOC-362 to DOC-367, DOC-385 to DOC-390, DOC-406 | Rebuild, tune, graph freshness, router reach, budgets, parent hubs, the menu, and the seven routing probes |
| `/doctor:speckit` | 3 | DOC-349, DOC-350, DOC-351 | A healthy trigger index, a stale one, and a target another command owns now |
| `/doctor:symlink` | 1 | DOC-398 | Check, link and unlink against a scratch repo, with the plan, its digest and the printed undo |
| `/doctor:update` | 7 | DOC-357 to DOC-361, DOC-379, DOC-381 | `check`, `align`, `apply`, `rollback`, `record-base`, `compat`, and the fixture build |

The seven routing probes, DOC-385 to DOC-390 and DOC-406, are listed under `/doctor:skill-advisor`: each one runs the advisor hook and reads the doctor line it prints, whichever command that line names.

`DOC` numbers run in one shared series across every doctor scenario in the repository, so a new scenario takes the next free number in the whole series rather than the next number in this folder. The retired ranges are listed in the root playbook's source metadata, and a retired number is never reused.

---

## 4. TEST ENVIRONMENTS

Two long-lived local worktrees take the stateful runs. The root playbook owns their build order, their reset rules and the `update` fixture's unit table; this section is the placement map for the scenarios in this folder.

| Environment | Path | Scenarios |
|---|---|---|
| Current-code | `.worktrees/.doctor-test-environment` | DOC-348, DOC-349, DOC-350, DOC-352 to DOC-356, DOC-362 to DOC-366, DOC-368, DOC-371 to DOC-373, DOC-375 to DOC-377, DOC-382, DOC-384, DOC-392 to DOC-395 |
| Update fixture | `.worktrees/.doctor-update-test-environment` | DOC-357 to DOC-361, DOC-379 |

Rules that hold for both:

- **One scenario at a time.** A second writing run in the same environment invalidates the first one's evidence.
- **Start clean.** Fetch and fast-forward `origin/main`, then require `git status --porcelain` to print nothing.
- **Restore afterwards.** Put every changed file back with `git checkout -- <path>`, remove anything the run added, and require `git status --porcelain` to print nothing before the verdict.
- **Stay local.** Never push either branch, and never push the `v4.0.0.3-fixture` tag.

Runs that do not fit either environment go in a disposable copy, and each file names its own:

- **Any working copy with the runtime built.** Rows that write nothing run where you are: the menus (DOC-367, DOC-369, DOC-374, DOC-378), the flag refusals (DOC-380), the routing probes (DOC-385 to DOC-390 and DOC-406), and the read-only checks.
- **A disposable clone.** DOC-370, because a linked worktree shares the main checkout's `.git/config` and `git config --local` would change the real repository.
- **A throwaway folder, copy or clone.** DOC-331 to DOC-333 for their own graph state, DOC-381 for its v3 fixture, DOC-383 for a `v3.6.0.0` shallow clone, DOC-395 for the scratch repository it creates and deletes, and DOC-396 to DOC-397 for the `adopted` fixture they compose outside the checkout.
- **A live session beside the folder.** DOC-396 needs a Devin session, DOC-397 a Cursor window. Without one, the row records `UNKNOWN` with its reason rather than a default pass.

---

## 5. TEST EXECUTION

Execute each scenario directly against the root playbook's execution policy: run the real command, inspect real files and record a `PASS`, `FAIL` or `SKIP` verdict with its evidence. A run that cannot be graded deterministically is a `SKIP` whose blocker names the limitation.

See [the root playbook](../manual-testing-playbook.md) for the global preconditions, the evidence requirements, the review protocol, the release-readiness rule and the environment build order. See [the doctor command index](../manual-testing-playbook.md#8-doctor-command-index) for the row-by-row list that links every file in this folder.

---

## 6. SOURCE METADATA

### See Also

- Router sources: `.skilled/commands/doctor/`, one router per command
- Route manifest: `.skilled/commands/doctor/_routes.yaml`
- Route assertion: `.skilled/commands/doctor/scripts/route-validate.sh`
- Root playbook: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)

### Provenance

Provenance: manual only - index document

Manual only, index document. Each scenario listed here carries its own line. The scenarios moved here from the system-spec-kit, system-skill-advisor, sk-git, sk-code, mcp-code-mode and system-deep-loop playbooks, and their internal links now point at this package.
