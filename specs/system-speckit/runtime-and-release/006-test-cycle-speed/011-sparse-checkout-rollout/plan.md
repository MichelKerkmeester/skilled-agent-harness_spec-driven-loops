---
title: "Implementation Plan: Phase 11: sparse-checkout-rollout"
description: "Add a sparse cone to seven workflows whose steps read a named path set outside specs/. Prove each cone parses, covers every path the steps name, and shortens the checkout step after a push."
trigger_phrases:
  - "sparse checkout rollout plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: sparse-checkout-rollout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML, `actions/checkout` v7.0.1 |
| **Framework** | None |
| **Storage** | None |
| **Testing** | PyYAML 6.0.3 parse and coverage check, `gh run view` step timings |

### Overview
Add the sparse cone already used by `rule-canary-sync.yml` to seven workflows whose steps read a named path set outside `specs/`. Each cone names every path its steps read, including the `.opencode/skills` symlink where a step calls through it. Prove the change with a YAML parse, a path-coverage check and the post-push checkout duration.
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
- [ ] The coverage check prints `OK` for all seven edited files
- [ ] The post-push comparison prints `ALL LOWER`
- [ ] The sk-code post-push log reports a nonzero test count
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-workflow sparse cone.

### Key Components
- **`actions/checkout` step**: fetches blobs only for the cone instead of all 134,068 tracked files.
- **Read-set inventory**: names every path each included workflow reads, so the cone is written from evidence rather than from a guess.
- **Coverage check**: parses the YAML, extracts the `.skilled`, `.opencode` and `.pi` paths its steps name, and fails when one sits outside the cone.

### Data Flow
The checkout reads its `sparse-checkout` patterns with `sparse-checkout-cone-mode: false`, materializes those paths and the tracked symlinks among them, and every later step runs against that partial tree. Most steps fail on a path the cone omitted. The sk-code `node --test` globs are the exception: they exit 0 with 0 tests, which is why that file also gets a post-push test count.

### Read-Set Inventory

All 32 workflow YAMLs were read at the step level. Seven get the cone. One already has it. The other 24 are excluded for the reason in the last column.

**Included**

| Workflow | Cone entries |
|----------|--------------|
| `prompt-card-sync.yml` | `/.opencode/skills`, `/.skilled/skills/system-skill-advisor/runtime/scripts/`, `/.skilled/skills/sk-prompt/`, `/.skilled/skills/cli-external-orchestration/` |
| `repo-rules-corpus.yml` | `/REPO RULES.md`, `/.skilled/repo-rules/`, `/.skilled/skills/sk-doc/sk-create-repo-rule/scripts/`, `/.skilled/skills/sk-doc/shared/scripts/`, `/.skilled/hooks/shared/` |
| `runtime-no-spec-import.yml` | `/.skilled/bin/` |
| `chart-corpus.yml` | `/.opencode/skills`, `/.skilled/skills/sk-design/sk-design-chart/` |
| `diagram-corpus.yml` | `/.opencode/skills`, `/.skilled/skills/sk-design/sk-design-diagram/` |
| `pi-extension-tests.yml` | `/.pi/extensions/` in both checkout steps |
| `sk-code-script-tests.yml` | `/AGENTS.md`, `/.npmrc`, `/.skilled/skills/sk-code/`, `/.skilled/bin/lib/compiled-routing/003-contract-schemas/`, `/.skilled/bin/lib/compiled-routing/004-compiler-n1-shadow/`, `/.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/`, `/.skilled/skills/system-spec-kit/`, `/.skilled/skills/sk-doc/sk-create-skill/scripts/lib/` |

The indirect reads behind each cone:

- `prompt-card-sync.yml` calls the guard through `.opencode/skills`, and the guard reads the canonical card under `sk-prompt` plus seven `cli-*` cards and `SKILL.md` files under `cli-external-orchestration`.
- `repo-rules-corpus.yml` reads `REPO RULES.md`, the rule bodies and cards under `.skilled/repo-rules/`, the checker and its card builder, and `hook-flags.cjs`, which the validation switch loads.
- `runtime-no-spec-import.yml` scans `.skilled/bin` and the positive and negative fixtures under `.skilled/bin/tests/fixtures/no-spec-import/`.
- `chart-corpus.yml` runs `check-corpus.cjs` and the mutation suite inside `sk-design-chart`, and the checker reads only its own package root.
- `diagram-corpus.yml` runs `check-diagram-corpus.cjs`, both applicators and the mutation suite inside `sk-design-diagram`, and the checker reads only its own package root.
- `pi-extension-tests.yml` finds every `package.json` under `.pi/extensions` and runs each extension's test script from its own directory.
- `sk-code-script-tests.yml` runs the sk-code suites, reads `AGENTS.md` through the rule canary, loads the three compiled-routing folders the runner tests require, installs `.skilled/skills/system-spec-kit` so the freshness library resolves its workspace, and reads the sk-doc leaf contract that `verify-router-sync.test.cjs` compares against.

**Reference**

| Workflow | Decision | Why |
|----------|----------|-----|
| `rule-canary-sync.yml` | Keep as is | It already carries the cone this phase copies |

**Excluded**

| Workflow | Decision | Why |
|----------|----------|-----|
| `advisory-checks.yml` | Leave out | `run-node-tests.mjs` walks `.skilled/skills`, `.skilled/scripts`, `.opencode/plugins`, `.skilled/bin` and `.skilled/hooks`, and the trigger index check walks the corpus |
| `agent-mirror-sync.yml` | Leave out | `fetch-depth: 0`, and its checker reads each changed agent file from disk. A cone that omits an agent root makes the canonical and its mirror both absent, and the checker skips that name and exits 0 |
| `changed-packet-validation.yml` | Leave out | Reads `specs/` and needs full history for its base comparison |
| `command-tree-parity.yml` | Leave out | Compares the command and agent trees across the OpenCode, Claude, Cursor and DSH roots, and the DSH sync scripts read the whole generated skill tree |
| `comment-hygiene.yml` | Leave out | `fetch-depth: 0`, and it diffs every changed file in the repository then skips a file that is absent from disk. A cone that omits one makes the `-f` test skip it and the job exit 0 |
| `deep-loop-runtime.yml` | Leave out | `fetch-depth: 2` for mode-event suites that bind a run to a commit and its parent. Their file reads were not enumerated |
| `dependabot-auto-merge.yml` | Leave out | Has no checkout step |
| `dispatch-enforcement-guard.yml` | Leave out | The hooks job collects every vitest suite under `.skilled/hooks`, and those suites read `.skilled/skills`, `.skilled/bin` and `.skilled/generated` |
| `gate-inputs.yml` | Leave out | ADR-010 records that gate-inputs needs the whole tree |
| `markdown-link-integrity.yml` | Leave out | The checker walks the whole repository for broken links |
| `message-contract.yml` | Leave out | `fetch-depth: 0` and `--rev-list` over pushed commits |
| `naming-standard-guard.yml` | Leave out | `fetch-depth: 0` and `--changed-since` over every changed path |
| `opencode-dual-version.yml` | Leave out | Provisions the whole list in `worktree-provision-paths.txt` and runs installed binaries |
| `opencode-plugin-tests.yml` | Leave out | The same provision list plus the plugin suites, which read the skill, command and Pi files the plugins cite |
| `playbook-operator-contract.yml` | Leave out | Validates cross-tree citations, and its header says a rename far outside any playbook directory can break hundreds of scenarios |
| `routing-registry-drift.yml` | Leave out | Reads `specs/system-deep-loop/loop-architecture/003-deprecate-improvement-modes/013-drift-guard-repairs/baseline/routing-baseline.json` |
| `sk-doc-rename-harness.yml` | Leave out | Runs the sk-doc script runner, whose fixture read set was not enumerated |
| `sk-doc-script-tests.yml` | Leave out | Its header says two tests walk the whole repository |
| `sk-git-script-tests.yml` | Leave out | `worktree-naming.test.sh` checks every tracked `package.json` against the provisioning list |
| `skill-advisor-stress.yml` | Leave out | The skill-graph scan walks the whole `.skilled/skills` tree |
| `skill-doc-frontmatter.yml` | Leave out | Coverage mode walks every skill doc, and the version job needs `fetch-depth: 0` |
| `spec-kit-check.yml` | Leave out | Runs the CLI, legacy and runtime test projects plus the mirror scripts. Their read set was not enumerated, and a missed fixture could fail or silently skip inside a 51-minute job |
| `strict-pass-freshness-report.yml` | Leave out | Sweeps `--roots specs` |
| `trigger-index-rebuild.yml` | Leave out | The generator walks the corpus across skills, commands and agents, then writes the index |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup confirms the reference cone in `rule-canary-sync.yml` and records each edited workflow's latest checkout duration. Implementation adds the `with:` block to the seven workflows named in section 3. Verification parses each edited file, runs the coverage check, and compares the post-push checkout duration with the recorded baseline. It also reads the sk-code job log for a nonzero test count, because that file's `node --test` globs pass with 0 tests on a missing path.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The coverage check parses the file and proves every literal path its steps name sits under a cone entry. It prints `OK` plus the entry count, or `MISSING:` and the paths outside the cone. The inventory in section 3 is the evidence for the indirect reads a checker or test performs after the step starts.

```text
python3 -c 'import re,sys,yaml;w=yaml.safe_load(open(sys.argv[1]));e=[x.strip().lstrip("/") for j in w["jobs"].values() for s in j["steps"] for x in ((s.get("with") or {}).get("sparse-checkout") or "").splitlines() if x.strip()];t=[v for j in w["jobs"].values() for s in j["steps"] for v in [s.get("run"),s.get("name"),s.get("working-directory"),*((s.get("with") or {}).values())] if isinstance(v,str)];p={m for v in t for m in re.findall(r"(?<![\w./-])((?:\.skilled|\.opencode|\.pi)/[A-Za-z0-9._/*-]+)",v)};b=[x for x in sorted(p) if not any(x==q.rstrip("/") or x.startswith(q.rstrip("/")+"/") for q in e)];print("MISSING: "+", ".join(b) if b else "OK "+str(len(e))+" entries")' <workflow file>
```

Expected for `rule-canary-sync.yml`: `OK 3 entries`. Expected for each edited file: `OK` plus one entry for each checkout step it holds, so `pi-extension-tests.yml` prints `OK 2 entries` after both of its steps carry the cone.

The post-push comparison reads the two timing files and prints `ALL LOWER` only when every workflow's after figure is below its before figure.

```text
python3 -c 'import re,sys;f=lambda p:{m[0]:int(m[1]) for m in re.findall(r"([a-z-]+\.yml)[^\d\n]*(\d+) s",open(p).read())};a=f(sys.argv[1]);b=f(sys.argv[2]);bad=[k for k in a if b.get(k,10**9)>=a[k]];print("REGRESSED: "+", ".join(bad) if bad else "ALL LOWER")' scratch/checkout-baseline.md scratch/checkout-after.md
```

The sk-code job needs its own check because `node --test 'path/*.test.cjs'` prints `tests 0` and exits 0 when the path is absent. `gh run view <run id> --log | rg -c 'tests [1-9][0-9]*'` must print at least 1.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1` (`v7.0.1`), already pinned in every edited workflow.
- `PyYAML 6.0.3`, confirmed installed locally with `python3 -c 'import yaml'`.
- `gh`, confirmed authenticated by the `gh run list` calls quoted in `spec.md`.
- The operator's go-ahead for the push, because the push is outside a child worker's authority.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: after the push, an edited workflow fails on a path the cone omitted, or its checkout duration is not below the pre-change figure.

Procedure: revert the one file with `git revert <sha>`, or delete its `with:` block and keep its trigger filters and steps. No state is created, and the other six stay in place. Re-run the coverage check on the reverted file, then run the comparison again once a fresh run completes.
<!-- /ANCHOR:rollback -->

---
