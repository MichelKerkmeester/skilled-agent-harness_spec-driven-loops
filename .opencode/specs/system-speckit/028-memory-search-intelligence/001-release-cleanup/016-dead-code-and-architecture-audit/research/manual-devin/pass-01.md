All four audits complete and verified. Synthesizing the consolidated report below — overlapping findings merged, global renumbering, organized by hub.

---

# Domain Skill Hub Audit — sk-code / sk-doc / sk-git / sk-prompt

Read-only audit. No files were modified, moved, renamed, or deleted. Findings merged where subagents reported the same underlying defect from different angles (noted inline). All paths verified to exist on disk; `UNKNOWN` used where the finding is about an absent path.

## sk-code hub

### F1 — CAT-2: Superseded benchmark runs kept alongside canonical current runs

**Path:** `.opencode/skills/sk-code/benchmark/{after,baseline,full,live,live-remediated}/`
**Evidence:** `benchmark/README.md:95-107` explicitly labels these as "superseded" development runs; canonical current runs are `router-final/` and `live-final/`.
**Verify:** `rg -nE "(superseded|current|sidecar|frozen)" .opencode/skills/sk-code/benchmark/README.md`
**Blast radius:** Low — historical reports. Archive to `benchmark-archive/` outside the active tree.

### F2 — CAT-2: Legacy synthetic fixtures superseded by playbook corpus

**Path:** `.opencode/skills/sk-code/benchmark/fixtures/sk-code/`
**Evidence:** `benchmark/README.md:89-90,107` marks status "legacy — superseded by the playbook corpus".
**Verify:** `rg -nA2 "fixtures/sk-code" .opencode/skills/sk-code/benchmark/README.md`
**Blast radius:** Low — unused fixtures; remove or archive.

### F3 — CAT-2: Pre-v4.0.0.0 changelog entries describe superseded flat architecture

**Path:** `.opencode/skills/sk-code/changelog/v3.0.0.0.md` … `v3.5.0.0.md` (8 files)
**Evidence:** `changelog/v4.0.0.0.md:6-8` states "sk-code converted from a flat two-axis skill into a nested parent hub"; `v4.1.0.0.md` further restructured to 2 workflow modes + 2 surface packets, making all v3.x entries describe a dead architecture.
**Verify:** `rg -nE "(flat|nested parent hub|two-axis)" .opencode/skills/sk-code/changelog/v4.0.0.0.md .opencode/skills/sk-code/changelog/v4.1.0.0.md`
**Blast radius:** Low — historical docs. Consolidate into a single `changelog-archive/v3.x.md` summary.

### F4 — CAT-2: v4.0.0.0 scaffold-phase changelog superseded by v4.1.0.0

**Path:** `.opencode/skills/sk-code/changelog/v4.0.0.0.md`
**Evidence:** `:8` states "Scaffold phase - packets are skeletons; content relocation follows." — a transitional state completed by v4.1.0.0.
**Verify:** `rg -ni "scaffold" .opencode/skills/sk-code/changelog/v4.0.0.0.md`
**Blast radius:** Low — fold into v4.1.0.0 as a subsection or archive.

### F5 — CAT-5: Changelog v4.1.0.0 contradicts mode-registry.json on surface count

**Path:** `.opencode/skills/sk-code/changelog/v4.1.0.0.md:12-13` vs `.opencode/skills/sk-code/mode-registry.json:19`
**Evidence:** Changelog lists 3 surfaces (`webflow`, `opencode`, `animation`); registry and SKILL.md:34-35 list only 2 (`code-webflow`, `code-opencode`). The "animation" surface was either planned-but-unimplemented or folded into code-webflow.
**Verify:** `rg -nA2 "Surface axis" .opencode/skills/sk-code/changelog/v4.1.0.0.md && rg -nA2 "surfaces" .opencode/skills/sk-code/mode-registry.json`
**Blast radius:** Medium — documentation contradiction; correct the changelog to match the registry.

### F6 — CAT-5: Duplicated benchmark responsibility between hub and code-opencode packet

**Path:** `.opencode/skills/sk-code/benchmark/` and `.opencode/skills/sk-code/code-opencode/benchmark/`
**Evidence:** Both hold benchmark reports — hub has `router-final/`, `live-final/`, etc.; `code-opencode/benchmark/` has `live-mode-b/`, `router-mode-a/` (sidecar variants of the hub runs). No documented ownership split.
**Verify:** `ls .opencode/skills/sk-code/benchmark/ && ls .opencode/skills/sk-code/code-opencode/benchmark/`
**Blast radius:** Medium — unclear ownership. Consolidate under `sk-code/benchmark/` with surface-tagged subfolders.

### F7 — CAT-6: Over-engineered benchmark folder structure with 12+ dated sidecar runs

**Path:** `.opencode/skills/sk-code/benchmark/` (12 dated subfolders + nested `compiled-routing/` with 3 more)
**Evidence:** `benchmark/README.md:95-107` maintains a run-label index with current/sidecar/superseded/frozen/legacy tiers. The `compiled-routing/` subfolder adds 3 more dated runs beneath it.
**Verify:** `find .opencode/skills/sk-code/benchmark -maxdepth 2 -type d | wc -l`
**Blast radius:** Medium — maintenance burden.
**Proposed simpler shape:** Collapse to `current/` (merge router-final + live-final + d4r-live) and `archive/` (everything else); flatten `compiled-routing/` artifacts into `archive/compiled-routing/`.

### F8 — CAT-2: v4.0.1.0 changelog subsumed by v4.1.0.0 restructure

**Path:** `.opencode/skills/sk-code/changelog/v4.0.1.0.md`
**Evidence:** `:8` describes relocating spec-folder authoring docs to system-spec-kit; `v4.1.0.0.md:19` then consolidated surface evidence into surface packets, making v4.0.1.0 a transitional patch now subsumed.
**Verify:** `rg -nE "(spec-folder|system-spec-kit)" .opencode/skills/sk-code/changelog/v4.0.1.0.md .opencode/skills/sk-code/changelog/v4.1.0.0.md`
**Blast radius:** Low — merge into v4.1.0.0 or archive with v3.x.

## sk-doc hub

### F9 — CAT-3: Dated benchmark output folders committed to repository

**Path:** `.opencode/skills/sk-doc/benchmark/compiled-routing/` (5 dated subfolders: `luna-high-acceptance-1784596615522/`, `luna-high-real-20260721-073315/`, `luna-high-verify-20260721-120348/`, `playbook-verify-sonnet-20260721-132527/`, `r3-benchmark-sweep-20260721-131432/`)
**Evidence:** `benchmark/README.md:31` states "No Lane C skill-benchmark run has been archived for sk-doc yet" — yet these dated output folders with Jul-2026 timestamps are present.
**Verify:** `ls -la .opencode/skills/sk-doc/benchmark/compiled-routing/`
**Blast radius:** Low — output artifacts; move out of version control or gitignore.

### F10 — CAT-1: scripts/README.md documents 10 scripts that do not exist at that location

**Path:** `.opencode/skills/sk-doc/scripts/README.md:69-78`
**Evidence:** README lists 10 scripts for `scripts/`; the directory actually contains only `tests/` and `validate-doc-model-refs.js`. The listed scripts live elsewhere (`audit_readmes.py` → `create-readme/scripts/`, `init_skill.py` → `create-skill/scripts/`, `quick_validate.py` → `shared/scripts/`, etc.).
**Verify:** `ls .opencode/skills/sk-doc/scripts/ && rg --files .opencode/skills/sk-doc/scripts | grep -v tests`
**Blast radius:** Medium — documentation mismatch confuses operators. Remove or rewrite the README to reflect actual contents.

### F11 — CAT-1: validate-doc-model-refs.js has no reachable callers

**Path:** `.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js`
**Evidence:** Only referenced in `scripts/README.md:76` (itself misleading, see F10). No references in any `.md`/`.json`/`.yaml`/`.py`/`.cjs`/`.js` across the hub; not in CI or package.json.
**Verify:** `rg "validate-doc-model-refs" .opencode/skills/sk-doc --type md --type json --type yaml --type py --type cjs --type js`
**Blast radius:** Low — single dead script; remove or document its intended manual use.

### F12 — CAT-5: SKILL.md says "eleven packets" but mode-registry.json lists twelve modes

**Path:** `.opencode/skills/sk-doc/SKILL.md:3` vs `.opencode/skills/sk-doc/mode-registry.json:17-162`
**Evidence:** SKILL.md describes 11 workflow packets; `mode-registry.json` lists 12 modes including `create-skill-parent` (a second mode over the `create-skill` packet, lines 30-41). SKILL.md never mentions `create-skill-parent`.
**Verify:** `jq '.modes | length' .opencode/skills/sk-doc/mode-registry.json && rg "create-skill-parent" .opencode/skills/sk-doc/SKILL.md`
**Blast radius:** Low — clarify "11 packets, 12 modes (create-skill-parent is a second mode over create-skill)".

### F13 — CAT-4: feature-catalog/ at hub root not documented in SKILL.md layout

**Path:** `.opencode/skills/sk-doc/feature-catalog/`
**Evidence:** `SKILL.md:128-131` layout section lists `changelog/ manual-testing-playbook/ benchmark/` as top-level dirs but omits `feature-catalog/`, which exists with `feature-catalog.md` and subdirectories.
**Verify:** `ls .opencode/skills/sk-doc/ | rg -E "(changelog|manual-testing-playbook|benchmark|feature-catalog)" && rg "feature-catalog/" .opencode/skills/sk-doc/SKILL.md`
**Blast radius:** Low — legitimate artifact; add it to the §3 Layout section.

## sk-git hub

### F14 — CAT-5: SKILL.md claims to "route" to git-worktrees/git-commit/git-finish but no routing infrastructure or packet dirs exist

**Path:** `.opencode/skills/sk-git/SKILL.md:3,252,258,264` and `.opencode/skills/sk-git/references/quick-reference.md:3,17,41`
*(merges sk-git subagent F1 + F2 + F8 — all three report the same underlying false-hub claim)*
**Evidence:**
- SKILL.md:3 description: "routes git-worktrees/git-commit/git-finish"
- SKILL.md:39-202 contains a 149-line Python "Smart Router" pseudocode routing to a RESOURCE_MAP
- No `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `description.json` exist (all sibling hubs have them)
- No `git-worktrees/`, `git-commit/`, `git-finish/` directories exist anywhere under `.opencode/skills/`
- The "routing" is actually conditional resource loading within a single skill, not multi-packet routing
**Verify:** `ls .opencode/skills/sk-git/{mode-registry.json,hub-router.json,leaf-manifest.json,description.json,git-worktrees,git-commit,git-finish} 2>&1; find .opencode/skills -name "git-worktrees" -o -name "git-commit" -o -name "git-finish"`
**Blast radius:** Medium — description and architecture are misleading. Either (a) reframe SKILL.md as a single orchestrator with phase-based resource loading, or (b) actually split into a hub with three packet dirs.

### F15 — CAT-3: Committed benchmark reports unreferenced by any docs

**Path:** `.opencode/skills/sk-git/benchmark/{live-glm-5.2-high,live-kimi-2.7}/`
**Evidence:** `benchmark/live-glm-5.2-high/skill-benchmark-report.json` (2282 lines) + `.md`; same for `live-kimi-2.7/`. Not referenced in SKILL.md, README.md, or `references/*.md` (the only `benchmark` mention is `references/finish-workflows.md:691` in an unrelated example). No `.gitignore` excludes `benchmark/`.
**Verify:** `ls .opencode/skills/sk-git/benchmark/ && rg -l "benchmark" .opencode/skills/sk-git/{SKILL.md,README.md,references/*.md}`
**Blast radius:** Low — report artifacts; gitignore or relocate.

### F16 — CAT-1: `validate-remote-allowlist` CLI subcommand has no external caller

**Path:** `.opencode/skills/sk-git/scripts/worktree-naming.sh:402,427`
**Evidence:** `:402` documents the subcommand; `:427` implements CLI dispatch. Grep across `.opencode/` finds references only in `worktree-naming.sh` itself, `scripts/README.md:60`, and spec docs under `specs/sk-git/015-remote-branch-policy/`. The underlying function `is_remote_push_allowlisted` IS used by the pre-push hook (sourced directly, not via the CLI wrapper) — but the CLI wrapper itself is never invoked.
**Verify:** `rg "validate-remote-allowlist" .opencode --type sh -g '!**/specs/**'` then `rg "worktree-naming\.sh.*validate-remote-allowlist" .opencode`
**Blast radius:** Low — dead CLI wrapper; the function it wraps is alive. Remove the CLI dispatch arm.

### F17 — CAT-1: `skill-ids` CLI subcommand has no external caller

**Path:** `.opencode/skills/sk-git/scripts/worktree-naming.sh:394,411`
**Evidence:** `:394` documents `skill-ids`; `:411` dispatches to `load_skill_ids`. Referenced in `scripts/README.md:60` and `changelog/v1.2.0.0.md:16`. `load_skill_ids` is only used internally by `is_valid_owner`; no external caller of the CLI form.
**Verify:** `rg "worktree-naming\.sh skill-ids" .opencode && rg "bash.*worktree-naming.*skill-ids" .opencode`
**Blast radius:** Low — diagnostic convenience command, unused. Remove.

### F18 — CAT-4: Changelog documents `.github/workflows/` and `.github/hooks/scripts/` READMEs that do not exist

**Path:** UNKNOWN — `.github/` does not exist under `sk-git/`
**Evidence:** `changelog/v1.3.2.0.md:16` states "Four code READMEs added for `scripts/`, `scripts/tests/`, `.github/workflows/` and `.github/hooks/scripts/`". `scripts/` and `scripts/tests/` READMEs exist; `.github/` does not.
**Verify:** `ls .opencode/skills/sk-git/.github 2>&1; find .opencode/skills/sk-git -name ".github"`
**Blast radius:** Low — changelog accuracy error; correct the entry.

### F19 — CAT-6: 149-line Python pseudocode router for 5-intent conditional loading

**Path:** `.opencode/skills/sk-git/SKILL.md:54-202`
**Evidence:** §2 contains 149 lines of Python pseudocode (keyword boundary matching, weighted scoring, adaptive intent selection, ambiguity handling) for 5 intents (WORKSPACE_SETUP, COMMIT, FINISH, GITKRAKEN_MCP, SHARED_PATTERNS). No actual Python exists — this is documentation-only. Sibling skills (sk-doc, sk-prompt) describe equivalent routing far more simply.
**Verify:** `wc -l .opencode/skills/sk-git/SKILL.md` (613 total; router is lines 54-202)
**Blast radius:** Low — documentation only.
**Proposed simpler shape:** Replace with a ~10-line routing table:

```
| Intent          | Keywords                                  | Resources                                                              |
|-----------------|-------------------------------------------|------------------------------------------------------------------------|
| WORKSPACE_SETUP | worktree, numbered worktree               | references/worktree-workflows.md, assets/worktree-checklist.md         |
| COMMIT          | commit, staged, conventional commit       | references/commit-workflows.md, assets/commit-message-template.md      |
| FINISH          | finish, merge, pr, pull request           | references/finish-workflows.md, assets/pr-template.md                  |
| GITKRAKEN_MCP   | gitkraken, gitlens, launchpad             | references/gitkraken-mcp-integration.md                                |
| SHARED_PATTERNS | convention, pattern, branch naming        | references/shared-patterns.md                                          |
```

## sk-prompt hub

### F20 — CAT-1 + CAT-4: Dead `shared/references/smart-routing.md` undocumented in hub layout

**Path:** `.opencode/skills/sk-prompt/shared/references/smart-routing.md`
*(merges sk-prompt subagent F1 + F3 — same file, both dead-reference and layout-omission)*
**Evidence:**
- File exists (`:1-125`); SKILL.md §3 layout (`:98-108`) does not document any `shared/` directory
- No reference to `shared/` or `smart-routing.md` in `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`
- Hub-wide grep finds no references except in benchmark stderr output (model output, not code)
**Verify:** `rg "shared/references/smart-routing" .opencode/skills/sk-prompt --type md --type json && rg "shared" .opencode/skills/sk-prompt/{SKILL.md,mode-registry.json,hub-router.json,leaf-manifest.json}`
**Blast radius:** Low — legacy surface-router artifact superseded by hub-router.json + mode-registry.json. Remove the file (and the orphan `shared/` dir), or document it.

### F21 — CAT-3 + CAT-6: Broken benchmark packages 001 and 002 with non-existent dependency paths

**Path:** `.opencode/skills/sk-prompt/prompt-models/benchmarks/001-swe-1.6-eval-loop/` and `.../002-swe-1.6-extraction-rerun/`
*(merges sk-prompt subagent F2 + F6 — same packages, both broken-paths and over-engineered)*
**Evidence:**
- `001/.../scripts/README.md:35` states: "This command currently fails before running any iteration. `loop.cjs` and `score-variant.cjs` resolve their rig dependency to a sibling `../002-eval-rig` directory, which does not exist at that path anymore (the shared eval-rig now lives at `003-minimax-prompt-framework/eval-rig/`)."
- `002/.../scripts/README.md:34` states: "This command currently fails before dispatching anything. `confirm-variant.cjs` resolves its eval-loop and rig dependencies to sibling `../003-eval-loop` and `../002-eval-rig` directories, and neither exists at those paths anymore."
- 001 contains 9 .cjs scripts (loop, dispatch-swe16, mutate, render-variant, score-variant, converge, seed-fixtures, synthesize, + check.cjs in fixtures); 002 contains 7. Neither is integrated into current hub routing.
**Verify:** `ls .opencode/skills/sk-prompt/prompt-models/benchmarks/002-eval-rig 2>&1; ls .opencode/skills/sk-prompt/prompt-models/benchmarks/003-minimax-prompt-framework/eval-rig; rg "currently fails" .opencode/skills/sk-prompt/prompt-models/benchmarks/001-swe-1.6-eval-loop/scripts/README.md`
**Blast radius:** Medium — non-functional historical packages consuming space and creating confusion.
**Proposed simpler shape:** Remove 001 and 002 entirely (their own READMEs declare them broken). Keep 003-minimax-prompt-framework and 004-mimo-prompt-framework which have working eval-rig infrastructure. Preserve synthesis.md results as historical docs if needed, outside `benchmarks/`.

### F22 — CAT-5: Executable scripts in a packet whose contract forbids Bash

**Path:** `.opencode/skills/sk-prompt/prompt-models/benchmarks/` (40+ .cjs/.js files)
**Evidence:**
- `mode-registry.json:30-41` defines `prompt-models` with `toolSurface: { allowed: ["Read","Grep","Glob"], forbidden: ["Write","Edit","Task","Bash"], mutatesWorkspace: false }`
- `prompt-models/SKILL.md:4` confirms `allowed-tools: [Read, Grep, Glob]`
- `prompt-models/SKILL.md:51-52` states: "Adding new runtime logic — this skill carries prompt-craft prose + an index, never shell commands or scripts."
- Yet `benchmarks/` contains 40+ executable .cjs/.js files (loop.cjs, dispatch-swe16.cjs, dry-run.cjs, mutate.cjs, score-variant.cjs, etc.)
**Verify:** `find .opencode/skills/sk-prompt/prompt-models/benchmarks -name "*.cjs" -o -name "*.js" | wc -l && rg "allowed-tools" .opencode/skills/sk-prompt/prompt-models/SKILL.md && rg "forbidden.*Bash" .opencode/skills/sk-prompt/mode-registry.json`
**Blast radius:** Medium — contract violation. Either (a) move the benchmarks out of `prompt-models/` to a sibling `prompt-models-benchmarks/` packet with Bash allowed, or (b) delete the broken ones (see F21) and relocate any working eval-rig to a hub-level `benchmark/` dir.

### F23 — CAT-5: composer-2.5.md references non-existent `cli-cursor` executor

**Path:** `.opencode/skills/sk-prompt/prompt-models/references/models/composer-2.5.md:17,45,141`
**Evidence:**
- `:17` "Executor MECHANICS … live in [`cli-cursor`](../../../../cli-external-orchestration/cli-cursor/SKILL.md) — not here."
- `:45` "Primary executor: `cli-cursor` → `cursor-agent -p --model composer-2.5`"
- `:141` "Full invocation wrappers stay in [`cli-cursor`](../../../../cli-external-orchestration/cli-cursor/SKILL.md)"
- `cli-external-orchestration/` contains `cli-opencode/`, `cli-claude-code/`, etc. but NO `cli-cursor/` directory. The relative path resolves to a non-existent file.
**Verify:** `ls .opencode/skills/cli-external-orchestration/cli-cursor 2>&1; find .opencode/skills/cli-external-orchestration -name "cli-cursor" -o -name "cursor"; rg "cli-cursor" .opencode/skills/sk-prompt/prompt-models/references/models/composer-2.5.md`
**Blast radius:** Medium — broken external contract; dispatch instructions are non-functional. Either create the `cli-cursor` packet or rewrite composer-2.5.md to drop the references and inline the executor mechanics.

---

## Summary by category

| CAT | Count | Findings |
|-----|-------|----------|
| CAT-1 dead code | 5 | F10, F11, F16, F17, F20 |
| CAT-2 legacy/superseded | 6 | F1, F2, F3, F4, F8, (F21 partial) |
| CAT-3 backup/scratch residue | 3 | F9, F15, (F21 partial) |
| CAT-4 misplaced/undocumented layout | 2 | F13, F18, (F20 partial) |
| CAT-5 architecture problems | 5 | F5, F6, F14, F22, F23, (F12 partial) |
| CAT-6 over-engineering | 2 | F7, F19, (F21 partial) |

**Highest-blast-radius items to address first:** F14 (sk-git false-hub claim, Medium), F22 (prompt-models contract violation, Medium), F23 (broken cli-cursor external ref, Medium), F5 (sk-code changelog/registry contradiction, Medium), F6 (duplicated benchmark ownership, Medium).

**Remediation is a separate approved phase** — no files were modified in this pass. Ready for the next pass or for a remediation spec when you are.
