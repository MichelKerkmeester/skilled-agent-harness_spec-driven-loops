# Iteration 014 — `sk-code-ci` registration contract, advisor route evidence, protected set

**Focus:** Verify iteration 13's two inferred findings (advisor routing for doctor routes, ownership split), close the `sk-code-ci` key question, and replace the "protected set is judgement" placeholder with a rule derived from evidence. Read-only: no workflow, script, registry or code was modified.

**Mode:** research · **Iteration:** 14 of 20 · **Question closed:** *What should an sk-code-ci mode contain, and what does registering a new sk-code mode require?*

---

## 1. FOCUS

Iteration 13 specified the `/doctor:ci` surface completely enough that re-running it would have produced no new information. Its two weakest joints were labelled `inferred`: F8 (advisor routing requires one bridge per target) and F9 (ownership splits doctor from `sk-code-ci`). Both are decidable from the advisor's activation registry and the `sk-code` hub's own registration contract, and the second was blocked on the `sk-code-ci` key question — which answers whether a new mode is a *surface* or a *workflow* packet, and therefore whether `/doctor:ci scaffold` may own a template at all.

## 2. ACTIONS TAKEN

1. Read `.skilled/skills/sk-code/mode-registry.json` in full — the two-axis discriminator, the `advisorRoutingContract`, and the five `modes[]` entries with their `toolSurface` and `mutatesWorkspace` values [SOURCE: .skilled/skills/sk-code/mode-registry.json:14-20].
2. Read `.skilled/skills/sk-code/hub-router.json` in full — `tieBreak`, the five `routerSignals` (each `weight: 4` with named scoring classes), and the `vocabularyClasses` keyword bank [SOURCE: .skilled/skills/sk-code/hub-router.json:3-12].
3. Dumped `.skilled/skills/sk-code/leaf-manifest.json`'s shape: `modes[]` of `{leaves, packet, workflowMode}`, one entry per mode, each listing that packet's files [SOURCE: .skilled/skills/sk-code/leaf-manifest.json:1-3].
4. Grepped the `sk-code` docs for the prose that counts modes and surfaces, and for the documented add/remove procedures [SOURCE: .skilled/skills/sk-code/SKILL.md:40] [SOURCE: .skilled/skills/sk-code/README.md:122].
5. Enumerated every `command-doctor-*` id in the advisor's activation registry, for both platform lists, and every entry whose keywords or description carry CI or workflow vocabulary [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:1-1].
6. Read the workflow README's guard-entrypoint inventory and the `trigger-index-rebuild` description to derive the protected-set rule [SOURCE: .github/workflows/README.md:35-58].

A first pass at step 5 iterated the registry's entry *dicts* as if they were strings and returned zero doctor ids. That result was an artifact of the filter, not of the registry; it was re-run before anything was recorded. Recorded here because it is the exact failure mode the framework's "finding = hypothesis" standard names — a uniform "none found" is as suspicious as a hit.

## 3. FINDINGS

### F1 — Doctor advisor routing is one bridge per **route**, not per command file — **confirmed**

The activation registry carries 18 `command-doctor-*` ids in the TypeScript list and the same 18 in the Python list [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:1-1]. Mapping them back to command files shows the ids are per route, not per file: `sk-code.md` yields one (`command-doctor-sk-code`), `git.md` yields three (`-git-hooks`, `-git-setup`, `-git-standards`), `skill-advisor.md` yields six (`-skill-budget`, `-tune`, `-rebuild`, `-parent-skill`, `-skill-graph-freshness`, `-router-reach`), `mcp.md` yields two (`-mcp-debug`, `-mcp-install`).

**Consequence:** iteration 13's F8 is correct in mechanism and now has its count. `/doctor:ci`'s five routes cost **five ids × two platform lists = ten activation entries** plus five derived bridges — not one entry for "ci". A phase plan that registers a single `command-doctor-ci` id would activate nothing for `toggle` or `scaffold`, which is the failure mode `_routes.yaml` warns about in its own words: "A bridge without one stays inactive" [SOURCE: .skilled/commands/doctor/_routes.yaml:38-43].

### F2 — "workflow" is already spec-kit's vocabulary, so a CI route needs leading `ci` signals — **confirmed (occupancy) / inferred (scoring effect)**

The two spec-kit workflow bridges are keyed on the same word a CI prompt will carry: `command-spec-kit-plan` is described as "Run the SpecKit 8-step planning workflow" and `command-spec-kit-implement` as "Run the SpecKit 9-step implementation workflow" [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:1-1]. No existing bridge names GitHub Actions, workflows-as-CI or continuous integration: the only CI-adjacent substring matches in either list resolve to spec-kit entries.

**Consequence:** a prompt such as "plan the workflow changes" or "review the workflow YAML" carries vocabulary already owned by spec-kit, and `/doctor:ci` must not rely on the bare word `workflow` in its `trigger_phrases`. Its signals have to lead with `ci`, `github actions`, `pipeline` and `workflow file` as compounds. **What would confirm the scoring half:** a `sk_advisor_recommend` run on three CI prompts today, recording whether `command-spec-kit-plan` or `-implement` appears in the candidate set; occupancy is confirmed, the misroute is not.

### F3 — Registering a new `sk-code` mode is five JSON surfaces plus prose plus fixtures — **confirmed**

`mode-registry.json` supplies the entry contract: `workflowMode`, `packetKind`, `backendKind`, a `toolSurface` with `allowed`/`forbidden`/`mutatesWorkspace`/`bashAllowlist`, `packet`, `packetSkillName`, `grandfatheredFolderMismatch`, `aliases`, and `advisorRouting.routingClass` [SOURCE: .skilled/skills/sk-code/mode-registry.json:48-70]. `hub-router.json` supplies three more: the mode must appear in `routerPolicy.tieBreak`, must own a `routerSignals` entry (`weight`, `classes`, `resources`), and must have its `vocabularyClasses` written into the keyword bank [SOURCE: .skilled/skills/sk-code/hub-router.json:5-8] [SOURCE: .skilled/skills/sk-code/hub-router.json:56-92]. `leaf-manifest.json` supplies the fifth: a `modes[]` entry whose `leaves` array enumerates every file in the packet [SOURCE: .skilled/skills/sk-code/leaf-manifest.json:1-3].

The hub documents the inverse direction as the authoritative checklist, and it names the same surfaces: "In `.skilled/skills/sk-code/mode-registry.json`, delete the mode's `modes` entry and its name in `extensions.surface-axis.surfaces`. In `.skilled/skills/sk-code/hub-router.json`, delete it from `routerPolicy.tieBreak`, delete its `routerSignals` entry and delete the two `vocabularyClasses` that entry names" [SOURCE: .skilled/skills/sk-code/README.md:122].

**Consequence:** the phase-002 diff for `sk-code-ci` is **five JSON files, one SKILL.md sentence, one README block, one feature-catalog entry, one manual-testing-playbook scenario and its row, one compiled-route test case, and one canary fixture plus its authored twin under `specs/`** [SOURCE: .skilled/skills/sk-code/README.md:126]. Registering the mode without the fixture twin leaves the canary corpus out of step with the authored copy — the README states the copy direction explicitly.

### F4 — `sk-code-ci` is a **surface** packet, not a workflow mode — **confirmed by the hub's own discriminator**

The registry defines its surface axis as "read-only domain-evidence packets (`backendKind:'evidence-base'`, `routingClass:'metadata'`, `mutatesWorkspace:false`) bundled alongside a workflow mode via `routerPolicy.outcomes.surfaceBundle`. They bundle stack knowledge plus the workflow doctrine as read-only evidence; the acting agent applies it — the surface never executes the process itself" [SOURCE: .skilled/skills/sk-code/mode-registry.json:14-18]. The SKILL.md restates the same contract: "Surface packets are advisor-invisible … the advisor still routes the single identity `sk-code`, and the hub bundles zero-or-more surfaces as evidence via `routerPolicy.outcomes.surfaceBundle` (workflow mode ordered first, surfaces after)" [SOURCE: .skilled/skills/sk-code/SKILL.md:74].

Workflow YAML standards are precisely "stack knowledge" for a platform, consumed by two different acting modes — authoring under `sk-code-skilled`, review under `sk-code-review`. That is the surface shape, and it is what the topic asks for when it says `sk-code-review` applies the standards.

**Consequence — and this is the one that changes a design decision from iteration 13:** a surface packet's `toolSurface` forbids `Write` and `Edit` (`mutatesWorkspace: false` in every one of the three existing surfaces) [SOURCE: .skilled/skills/sk-code/mode-registry.json:100-108]. `sk-code-ci` therefore **cannot be the thing that writes a scaffolded workflow**. Its templates are read-only assets — `sk-code-ci/assets/<kind>-workflow.yml.tmpl` — and `/doctor:ci scaffold` reads and fills them. That is the same read-the-reference-don't-copy-it relationship `env` already has with `.env.example` [SOURCE: .skilled/commands/doctor/env.md:54], now with a mechanical reason: the owning packet has no write capability at all.

### F5 — Leaving `sk-code-ci` out of `tieBreak` or the surface count silently staleness two documents — **documented (prose) / inferred (placement)**

`SKILL.md` declares itself the single source of truth for the count: "The hub has exactly three surfaces … It also has two workflow modes … Any other sk-code doc that counts surfaces points to this sentence" [SOURCE: .skilled/skills/sk-code/SKILL.md:40]. Adding a fourth surface makes that sentence false, and two README passages repeat the same count independently, so they go stale in the same commit unless edited [SOURCE: .skilled/skills/sk-code/README.md:23] [SOURCE: .skilled/skills/sk-code/README.md:90].

Placement has its own rule: workflow modes keep first place in a bundle and surfaces follow the `tieBreak` order SKILLED > OBSIDIAN > WEBFLOW [SOURCE: .skilled/skills/sk-code/SKILL.md:63-74]. CI evidence is subordinate to language-surface evidence, so `sk-code-ci` belongs immediately after `sk-code-skilled`. The README adds a doctor constraint for hand-edited placement — a surface placed after `sk-code-skilled` fails the doctor's check 5l — but that sentence is written about *user* surfaces claiming a keyword tie, and whether check 5l applies to a built-in surface is **inferred, not read**. **What would confirm it:** the 5l implementation in the `/doctor:sk-code` route; if 5l is a user-surface rule it needs an exemption for `sk-code-ci`, and if it is general the placement above is already compliant.

### F6 — The protected set can be defined by function, which is better than by list — **confirmed (workflow roles) / inferred (the rule)**

Iteration 13 wrote the protected set as five filenames and marked the membership judgement. The README supplies a functional basis instead. Three workflow classes carry an invariant that nothing else enforces:

1. **Sole-enforcer gates.** `gate-inputs.yml` runs the checker's own tests, then the real-tree check, then every hook suite — "A workflow whose guard script is missing fails that step instead of skipping it" [SOURCE: .github/workflows/README.md:83].
2. **Write-token split workflows.** `trigger-index-rebuild.yml` deliberately isolates the write token: "`rebuild` holds no secret and no write scope … `push` runs on a fresh runner … the write token reaches only that job's push step, and the job runs no repository code" [SOURCE: .github/workflows/README.md:58]. Any edit here is a privilege-boundary edit.
3. **Guards other workflows' correctness depends on** — the dispatch reachability guard and the naming guard [SOURCE: .github/workflows/README.md:35-40].

**Proposed definition for `/doctor:ci`:** a workflow is **protected** when editing it can change whether another workflow is allowed to run or whether a credential is exposed — operationally, when it (a) is the sole enforcer of an invariant with no local gate, (b) holds a token-eligibility split, or (c) is a guard whose failure invalidates other workflows' inputs. Protection means *a second, named confirmation that restates the workflow's role*, not immutability — a protected workflow still gets edited, by `/doctor:ci customize` only, and never by `toggle`. The list lives in `sk-code-ci` data so review and scaffolding read the same set, per iteration 13's seam.

### F7 — Ownership: the split is forced by `mutatesWorkspace`, not by taste — **confirmed**

`sk-code-ci` has no write capability (F4). `/doctor:ci`'s `toggle` writes repository variables and `customize` writes workflow files — both are workspace mutations the doctor family already does in `env` [SOURCE: .skilled/commands/doctor/env.md:52-58]. `sk-git` is not an alternative: its doctor surface is three routes, `hooks`, `setup` and `standards`, scoped to `.sk-git/` conventions [SOURCE: .skilled/commands/doctor/_routes.yaml:242-266], and no git route exists for CI; putting workflow-YAML standards there would make a git skill the authority on GitHub Actions. Combined with F2, where "workflow" already belongs to spec-kit, the `ci` identity must be its own.

**Consequence — the ruling:** doctor owns `list`, `check`, `toggle`, `customize`; `sk-code-ci` owns the standards, the check battery's rule data, the protected set and the templates; `scaffold` is the seam — a doctor route that writes, filling a read-only `sk-code-ci` template.

## 4. SPECIFICATION — `sk-code-ci` packet (proposed)

`packetKind: surface` · `backendKind: evidence-base` · `routingClass: metadata` · `toolSurface.allowed: [Read, Bash, Grep, Glob]` · `mutatesWorkspace: false` · `tieBreak` position immediately after `sk-code-skilled` · two `vocabularyClasses` (`code-ci-aliases`, `code-ci-yaml-doctrine`) whose keywords avoid the bare word `workflow`.

Contents: `SKILL.md`; `references/workflow-yaml-standards.md` (SHA pinning with trailing version comment, `permissions` least privilege, `timeout-minutes`, `concurrency`, `set -euo pipefail`, matrix and fail-fast, caching, fork and secret safety, `pull_request_target` prohibitions); `references/gate-inputs-parity.md` (sentinel `root` selection, dual-root path filters, the `\.opencode/` escape rule); `references/protected-workflows.md` (the F6 rule plus the resulting list); `assets/*.yml.tmpl` for the three scaffold kinds; a checklist that `sk-code-review` cites when reviewing YAML.

## 5. QUESTIONS ANSWERED

- **What should an sk-code-ci mode contain, and what does registering a new sk-code mode require?** — Answered. It is a **surface** packet, because the hub's discriminator defines surfaces as read-only domain evidence applied by an acting mode, and because the topic's own requirement is that `sk-code-review` applies it (F4). Registration is five JSON surfaces — `modes[]`, `extensions.surface-axis.surfaces`, `tieBreak`, `routerSignals`, `vocabularyClasses`, `leaf-manifest.modes[]` — plus a SKILL.md count sentence, two README passages, a feature-catalog entry, a playbook scenario, a compiled-route test case, and a canary fixture with its authored twin under `specs/` (F3, F5). The packet cannot write, which settles the `scaffold` seam: templates are read-only assets (F4).

## 6. QUESTIONS REMAINING

- **How do the ranked recommendations group into ordered implementation phases 002 and later?** Now fully constrained by dependency order: `check` before `scaffold` (13 F5), `sk-code-ci` before `scaffold` (13 F9, 14 F4), and the ten activation entries per `/doctor:ci` route before any route is usable (14 F1).
- **Blocking phase 002, unchanged:** does a job skipped by `if:` satisfy a required status check? Two fetch attempts returned 404 (iteration 11, F6). Unresolved and the highest-risk unknown in the whole on/off design.
- **New:** does `/doctor:sk-code` check 5l exempt a built-in surface placed after `sk-code-skilled`, or does it fail it? (F5 — inferred, one file read away.)
- **Carried forward:** which jobs duplicate pre-commit hooks? (iterations 5/7/9/11/12)
- **Carried forward:** what are the include globs of `.skilled/hooks/vitest.config.ts`?
- **Carried forward:** are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and does `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` set it?

## 7. NEXT FOCUS

Phase grouping (the last open key question). Sequence the recommendations into 002+ by measured saving, risk and the dependency chain above, and mark which phase each blocking unknown gates.

## 8. SCOPE VIOLATIONS

None. All reads; no workflow, script, registry or code was modified.
