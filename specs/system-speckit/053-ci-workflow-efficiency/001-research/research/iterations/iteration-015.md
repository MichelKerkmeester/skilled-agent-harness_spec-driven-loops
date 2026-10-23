# Iteration 015 — Enforcement map for the seven workflow-authoring rules

**Focus:** Populate `sk-code-ci`'s standards doc with *who enforces each rule today*. For each of the seven rules the topic names — SHA pinning, `.skilled/`/`.opencode/` path parity, a README row per workflow, `set -euo pipefail`, timeouts, least-privilege `permissions`, fork/secret safety — find the enforcing script or the documenting sentence, or establish that neither exists. Read-only: no workflow, script, registry or code was modified.

**Mode:** research · **Iteration:** 15 of 20 · **Questions closed:** none (the single open strategy question, phase grouping, is untouched)

---

## 1. FOCUS

Iteration 14 settled *where* `sk-code-ci` lives and what files it holds. Its `references/workflow-yaml-standards.md` was specified by listing seven rule names, which is a table of contents, not a standard: a rule with an enforcer is written one way (cite it), a rule with only a convention is written another way (assert it, and say nothing catches you). The difference decides whether the standards doc is a checklist or a second copy of a checker. This iteration resolves each of the seven to *enforced* or *convention*, with counts.

## 2. ACTIONS TAKEN

1. Inventoried the entire enforcement surface for workflow YAML: `.github/scripts/` holds exactly two entries — `check-gate-inputs.sh` and `tests/` — so the repository has **one** CI-adjacent checker, and it is path parity.
2. Read `check-gate-inputs.sh`'s own rule declaration, which names five rules and their scope [SOURCE: .github/scripts/check-gate-inputs.sh:11-29].
3. Read the workflow scan loop, which is what makes the checker cover every workflow file rather than a list [SOURCE: .github/scripts/check-gate-inputs.sh:481-485].
4. Counted the four convention rules across the 33 workflows on disk: `permissions:`, `timeout-minutes`, `concurrency:`, `set -euo pipefail`, and SHA-shaped `uses:`.
5. Diffed the README's workflow-name rows against the files on disk, both directions.
6. Grepped the executable surfaces (`.skilled/hooks/`, `.skilled/bin/`, `.opencode/`, `.github/`, pre-commit) for `actionlint`, `yamllint`, `pinned`, `permissions`, `timeout-minutes` and `README row` — the last grep is the one that returned nothing, and a uniform empty result is exactly the outcome that needs a second look, so it was re-run across `.github/scripts/*.sh`, `*.cjs` and `*.mjs` and the pre-commit hook separately.
7. Grepped all 33 workflows for `pull_request_target` and `secrets.` to size the fork/secret surface rather than assert it.

## 3. FINDINGS

### F1 — Exactly one workflow rule is machine-enforced: path parity — **confirmed**

`check-gate-inputs.sh` declares five rules in its header, and four of them govern workflows [SOURCE: .github/scripts/check-gate-inputs.sh:11-29]:

- `gate-files` — every hook and hook library exists under `.opencode/` or `.skilled/` [SOURCE: .github/scripts/check-gate-inputs.sh:12-13].
- `workflow-inputs` — every literal `.opencode/<path>` a workflow runs resolves, every glob matches something, and the directory that installs a `node_modules`/`dist` path exists [SOURCE: .github/scripts/check-gate-inputs.sh:18-22].
- `filter-twins` — every workflow path filter, negated or not, that names one root also names the other, *within the same filter* [SOURCE: .github/scripts/check-gate-inputs.sh:23-25].
- `parser-miss` — a filter or command shape the parsers do not recognize **fails** rather than passing unread [SOURCE: .github/scripts/check-gate-inputs.sh:26-29].

The checker enumerates workflows by glob, so a new file is covered the moment it lands, with no registry to update [SOURCE: .github/scripts/check-gate-inputs.sh:481-485]. `gate-inputs.yml` runs its fixture test first, then the real-tree check [SOURCE: .github/workflows/gate-inputs.yml:20].

**Consequence:** path parity is not a convention to be restated in `sk-code-ci` — it is a gate with an owner, a fixture suite and a fail-closed parser. The standards doc must **cite** it, in one line, and never re-derive the twin rule; a second prose copy is the drift class `sk-code-review/scripts/check-rule-copies.test.sh` already exists to catch [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh:1].

### F2 — The README row rule is 100% satisfied and 0% enforced — **confirmed**

The README carries a "Push versus pull-request coverage" table whose first column is the workflow filename [SOURCE: .github/workflows/README.md:64]. Diffing that column against `.github/workflows/*.yml` in both directions yields **33 rows and 33 files, with no file missing a row and no row naming a missing file**.

No script reads it. `rg -l 'workflows/README'` across the repository returns only `specs/` research artifacts — zero hits under `.github/`, `.skilled/hooks/`, `.skilled/bin/` or `.opencode/`. The table's own guidance is editorial, not enforced: it explains *why* a workflow runs on push or pull request, and the reason a gate that runs only on pull requests is unsafe here is that "the repository's documented flow pushes release lines directly" [SOURCE: .github/workflows/README.md:62].

**Consequence:** the rule is real, uniformly followed and silently breakable. A new workflow with no row passes every gate. This is the highest-value thing `/doctor:ci check` can add, because it is a *cheap* check (parse one markdown table, compare one column) over a surface that is currently perfect — a clean baseline that stays clean only if something watches it.

### F3 — SHA pinning is 100% satisfied, unenforced, and its only written statement is a dependabot comment — **confirmed**

Every `uses:` in `.github/workflows/` and `.github/actions/` resolves to a full commit SHA with a trailing version comment — the grep for `@v<n>`, `@main` or `@master` returns **zero** hits. The pinning *policy* is stated in one place, and it is a YAML comment rather than a rule file: "Workflow actions are pinned to commit SHAs, which never move on their own; this keeps them current without giving up the pin" [SOURCE: .github/dependabot.yml:31-32]. The `github-actions` ecosystem entry is what keeps the pins current [SOURCE: .github/dependabot.yml:33-40].

**Consequence:** the invariant is maintained by the dependabot group plus habit, and it holds. A standards doc that asserts it adds nothing operationally; a *check* that the `uses:` value is 40 hex characters is ~5 lines and would make the invariant survive a contributor who pastes `@v4`. Recommend the check, keep the prose to one line, cite dependabot as the updater.

### F4 — `set -euo pipefail` is a shell doctrine already owned elsewhere; 29/33 workflows carry it — **confirmed**

The rule exists as authored doctrine in `sk-code`'s own shell checklist, at line 63 of a file whose whole job is shell review [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/shell-checklist.md:63]. In the workflows, 29 of 33 `run:` blocks carry it; the four that do not are `advisory-checks.yml`, `dependabot-auto-merge.yml`, `sk-code-script-tests.yml` and `sk-git-script-tests.yml`.

**Consequence:** `sk-code-ci` must **not** hold a second copy of the shell rule. `shell-checklist.md` is the authority and `sk-code-skilled` already applies it. `sk-code-ci`'s job is the narrower claim that *a workflow `run:` block is shell* and therefore inherits that checklist — one sentence plus a pointer. That is also the answer to whether `sk-code-ci` should carry a shell section at all: no, it should carry a **routing** sentence.

### F5 — Timeouts, least-privilege `permissions` and `concurrency` are the three rules the repo largely does not follow — **confirmed**

Counted over the 33 workflow files:

| Rule | Files carrying it | Files missing it |
|---|---|---|
| `timeout-minutes` | 6 | **27** |
| top-level `permissions:` | 21 | **12** |
| `concurrency:` | 1 | **32** |

The 12 with no `permissions:` block have none at job level either — all twelve report zero at both scopes: `advisory-checks.yml`, `agent-mirror-sync.yml`, `chart-corpus.yml`, `comment-hygiene.yml`, `diagram-corpus.yml`, `markdown-link-integrity.yml`, `playbook-operator-contract.yml`, `prompt-card-sync.yml`, `repo-rules-corpus.yml`, `rule-canary-sync.yml`, `runtime-no-spec-import.yml`, `skill-doc-frontmatter.yml`. They inherit the repository default token scope, which is strictly wider than `contents: read` — and the workflows that *do* set it set exactly that [SOURCE: .github/workflows/gate-inputs.yml:8-9].

The six with timeouts are sized generously rather than tightly: 45 minutes for `deep-loop-runtime` [SOURCE: .github/workflows/deep-loop-runtime.yml:36], 30 for each of `opencode-dual-version`'s two jobs [SOURCE: .github/workflows/opencode-dual-version.yml:74], 30 for `sk-doc-rename-harness`, 20 for `hooks-node-tests`, `opencode-plugin-tests` and `skill-advisor-stress`. The single `concurrency:` block is `trigger-index-rebuild`, and it deliberately does **not** cancel in progress [SOURCE: .github/workflows/trigger-index-rebuild.yml:21-23] — correct for a commit-producing job, and the reason it cannot be copied as a default.

**Consequence — the shape of the phase-002 work:** these three are a **scaffold** problem first and a retrofit second. A template that emits `permissions: contents: read`, a `timeout-minutes` sized to the job and a per-ref `concurrency` group makes every *new* workflow compliant for free. Retrofitting the 27/12/32 is a separate `customize` sweep with 71 edits across 33 files, which is the largest mechanical diff in the whole programme and the one that needs the most care, not the most cleverness.

### F6 — Fork and secret safety is a small, clean surface today — **confirmed**

`pull_request_target` appears **zero** times in `.github/workflows/`. `secrets.` appears three times, in two files: `dependabot-auto-merge.yml` uses `secrets.GITHUB_TOKEN` for the merge action and as `GH_TOKEN` [SOURCE: .github/workflows/dependabot-auto-merge.yml:24], and `trigger-index-rebuild.yml` reads `secrets.TRIGGER_INDEX_PUSH_TOKEN || github.token`, falling back to the default token [SOURCE: .github/workflows/trigger-index-rebuild.yml:274] — the token-eligibility split iteration 14 recorded as making that workflow protected.

**Consequence:** the fork/secret rule in the standards doc is a **prohibition**, not a remediation: no `pull_request_target` with a checkout of the head ref, no secret in a job whose trigger is fork-reachable, and the two existing secret reads are the whole allowlist. A doc that lists them is enforceable by `rg`, which makes it the cheapest check in the battery.

### F7 — The enforcement map, as the standards doc will hold it — **confirmed (counts and enforcers) / inferred (the doc's wording)**

| Rule | Enforcer | Status |
|---|---|---|
| `.skilled/`↔`.opencode/` path parity | `check-gate-inputs.sh` `filter-twins` | **enforced** — cite, do not restate |
| Workflow run inputs resolve | same, `workflow-inputs` | **enforced** |
| Unparseable shapes fail | same, `parser-miss` | **enforced** |
| README row per workflow | none | convention, 33/33 today |
| SHA-pinned `uses:` | none (dependabot maintains) | convention, 100% today |
| `set -euo pipefail` | `shell-checklist.md:63`, applied by `sk-code-skilled` | doctrine, owned elsewhere — route |
| `timeout-minutes` | none | convention, 6/33 |
| least-privilege `permissions` | none | convention, 21/33 |
| `concurrency` | none | convention, 1/33 |
| fork/secret safety | none | prohibition, 0 violations |

**The rule this yields for authoring the doc:** each entry states the rule, then names its enforcer *or* says "nothing enforces this; `check` adds it". An entry that neither cites an enforcer nor admits the absence is the failure mode — it reads like a gate and behaves like a suggestion.

## 4. QUESTIONS ANSWERED

None from the strategy's open list. The one remaining boxed question — *how the ranked recommendations group into ordered implementation phases 002 and later* — needs the phase boundaries, which now have their first hard input from F5 (the 71-edit retrofit is its own phase, separable from the scaffold work).

## 5. QUESTIONS REMAINING

- **Open:** How do the ranked recommendations group into ordered implementation phases 002 and later? *(the only unticked strategy question)*
- **Carried, blocked:** does a job skipped by `if:` satisfy a required status check? Two fetch attempts, both 404.
- **Carried:** which jobs duplicate pre-commit hooks? The advisory half is partly closed by iteration 11's F8; the pre-commit duplicate half is not.
- **Carried:** are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and does `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` set it?
- **Carried:** what are the include globs of `.skilled/hooks/vitest.config.ts`?
- **Carried:** three components of the measured saving are inferred, not measured (iteration 12).

## 6. NEXT FOCUS

Phase grouping — the last unticked question — now that the enforcement map fixes the phase boundary that matters most: **scaffold-and-new-workflow compliance** is separable from the **71-edit retrofit** of `permissions`/`timeouts`/`concurrency`, and the retrofit should not block the scaffold. Confirm the count 71 = 12 permissions + 27 timeouts + 32 concurrency, then rank the recommendations with saving/risk/effort against that split.
