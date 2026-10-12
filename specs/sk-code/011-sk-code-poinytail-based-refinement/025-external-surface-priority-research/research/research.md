---
title: "Research: external sk-code surface priority"
description: "Two-lineage synthesis on how a user's own sk-code surface outranks sk-code-opencode once the obsidian and webflow examples are deleted, with the orchestrator's own copy experiments."
trigger_phrases:
  - "external surface priority research synthesis"
  - "sk-code surface order for external users"
importance_tier: "normal"
contextType: "research"
---
# Research: external sk-code surface priority

Merged synthesis of two ten-iteration lineages, `dsflash-devin` (cli-devin, `deepseek-v4-1-flash-max`) and `luna-max-fast` (cli-codex, `gpt-6-luna`, effort max, tier fast), plus the orchestrator's own reads and throwaway-copy runs. Every claim below was reread or rerun by the orchestrator unless its row says it was not. Lineage iteration files are under `research/lineages/<label>/iterations/`.

---

## 1. Verdict

The surface order needs no new field and no second order source. The order lives in one authored list, `hub-router.json:7` `routerPolicy.tieBreak`, which the compiler copies verbatim and the doctor already validates. Read as the operator described it, the shipped list already says the right thing: the native surface (`sk-code-opencode`) sorts ahead of the two examples, which is the operator's order today. What is missing is the rule for a surface the user adds: it must go ahead of `sk-code-opencode`, and nothing writes or documents that today, so an appended surface loses every keyword tie.

The bigger problem is not the order. Deleting the two example surfaces is not a supported operation: it fails the doctor with 113 invariant failures, crashes the sk-code drift guards on a hard-coded `sk-code-webflow` path, and leaves the compiled front door routing to the deleted packets while the guard reports `fresh`. The recommended work is therefore: write the insertion rule where surfaces are added (R1), make the stack-agnostic tooling stop naming the examples (R2), make removal a documented, verified path including the re-mint step the doctor gets wrong today (R3), and mark the two surfaces as examples in the docs (R4).

---

## 2. Method

| Item | Value |
|------|-------|
| Lineage A | `dsflash-devin`: `devin -p --model deepseek-v4-1-flash-max --permission-mode dangerous`, 10 of 10 iterations, every dispatch exit 0 |
| Lineage B | `luna-max-fast`: `codex exec --model gpt-6-luna -c model_reasoning_effort=max -c service_tier=fast --sandbox workspace-write`, 10 of 10 iterations; iterations 4 and 5 hit the 570 s timeout (SIGTERM) after writing all three artifacts, and `verify-iteration.cjs` passed for both |
| Dispatch | One foreground dispatch per lineage per iteration, A then B, through the auto YAML's `buildLineageCommand` (cli-devin) and `if_cli_codex` branch ported to a driver, with `runAuditedExecutorCommand` receipts |
| Focus plan | Same slice per iteration in both lineages so they can be compared: 1 to 3 inventory, 4 delete, 5 add, 6 options, 7 config versus data, 8 doctor and docs, 9 reject and rank, 10 adversarial re-verification |
| Orchestrator checks | Reread every anchor cited below; full-tree throwaway copy (with `specs/`) for a control run, the delete run, a data-removal run and a tie-break reorder plus re-mint run |

---

## 3. Findings

Classes: ORDER encodes the OpenCode, Obsidian, Webflow order; PRESENCE assumes obsidian or webflow is installed; BREAK observed to fail once they are deleted; DOC misleads an external user; OK checked and holds. Lineage `A`, `B`, `both` or `orch` (found or settled by the orchestrator).

### 3.1 Where the order is encoded (Q1)

| F | Class | Claim | Evidence | Severity | Lineage |
|---|-------|-------|----------|----------|---------|
| F1 | ORDER | The only authored precedence list is `tieBreak`: quality, review, opencode, obsidian, webflow | `.skilled/skills/sk-code/hub-router.json:7` | P1 | both |
| F2 | OK | The sk-code compiler copies `tieBreak` verbatim into the bundle rules and the routing model; no code ranks surfaces | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:261`, `:265` | P1 | both |
| F3 | OK | `--surface-hint` is applied after the decision, only reorders surfaces the prompt already matched, and a call without it serves the compiled order | `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:99-107`; `.skilled/skills/sk-code/SKILL.md:63` | P1 | both |
| F4 | OK | The doctor checks `tieBreak` as an exact permutation of registered modes (5e) and already enforces one order rule from data: workflow modes before surfaces (5i) | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1075-1088`, `:1142-1156` | P1 | B, orch |
| F5 | OK | Surface detection order OPENCODE > OBSIDIAN > WEBFLOW is path-based: OPENCODE holds only when the resolved target lies inside the hub's own `.skilled/`. It is a detection rule, not a keyword tie-break, and is correct for external users too | `.skilled/skills/sk-code/shared/references/stack-detection.md:39` | P2 | orch |
| F6 | ORDER | The registry's surface list and several inventories list Webflow, OpenCode, Obsidian; that is declaration order, not precedence | `.skilled/skills/sk-code/mode-registry.json:19`; `.skilled/skills/sk-code/SKILL.md:40` | P2 | both |
| F7 | PRESENCE | The registry, router signals and vocabulary register both examples as installed modes | `.skilled/skills/sk-code/mode-registry.json:61`, `:98`; `.skilled/skills/sk-code/hub-router.json:31`, `:42` | P1 | both |
| F8 | PRESENCE | The sk-code drift guard hard-codes the example names: `SURFACES = ['sk-code-webflow', 'sk-code-opencode']` plus `sk-code-obsidian` | `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:31-32` | P1 | orch |
| F9 | PRESENCE | The surface-hint test and the sk-code canary fixture pin the live order `[sk-code-opencode, sk-code-webflow]` for a Webflow prompt | `.skilled/bin/tests/compiled-route-surface-hint.test.cjs:61-65`; `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:117-120` | P2 | both |
| F10 | PRESENCE | The stage-two `RESOURCE_MAP` is the union of the surface maps; its stack-agnostic intents are mostly Webflow leaves (IMPLEMENTATION 22 Webflow against 9 OpenCode; DEBUGGING, PERFORMANCE, DEPLOYMENT, ACCESSIBILITY Webflow only) | `.skilled/skills/sk-code/ROUTER.md:41`, `:352` | P2 | orch |
| F11 | PRESENCE | sk-code-opencode's runtime vocabulary claims generic language words (`typescript`, `python`, `shell`, `json`, `config`, `rust`, `vitest`), so it is bundled into an external user's generic code prompts by score, not only by tie | `.skilled/skills/sk-code/hub-router.json:83` | P2 | orch |
| F12 | PRESENCE | Stage-one advisor vocabulary for the hub carries example phrases (`webflow`, `obsidian plugin`); it routes the hub identity only and is harmless once the examples are gone | `.skilled/skills/sk-code/graph-metadata.json:126`; `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:39` | P2 | both |
| F13 | OK | No doctor command file names an sk-code surface; the four `obsidian` hits under `.skilled/commands/doctor` are the MCP tool `mcp-obsidian` | `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:80` | P2 | A |

### 3.2 What breaks when the examples are deleted, and when a surface is added (Q2)

All BREAK rows were rerun by the orchestrator in a full-tree copy that includes `specs/`; the control run in the same copy passed every check (parent-skill-check exit 0, guard exit 0, `compiled-route-sync.cjs --check` exit 0, `ci-skill-root-metadata.cjs` 14 of 14).

| F | Class | Claim | Evidence | Severity | Lineage |
|---|-------|-------|----------|----------|---------|
| F14 | BREAK | Deleting only the two packet directories fails the parent-skill doctor: exit 1, 113 invariant failures (3c twice, 5d, 10a `MODE_LEAF_SET_COLLISION`, 12a `RRC-006` 109 times) | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` in the copy; 3c at `.skilled/commands/doctor/scripts/parent-skill-check.cjs:495-497` | P1 | both, orch |
| F15 | BREAK | The guard still reports every hub `fresh` and the front door still routes Obsidian and Webflow prompts to the deleted packets, exit 0; the guard's `inspect()` never checks packet directories | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "build an obsidian plugin settings tab"` returned target `sk-code-obsidian`; `.skilled/bin/compiled-route-guard.cjs:97-116` | P1 | both, orch |
| F16 | BREAK | The sk-code drift guards fail: `verify-router-sync.cjs` check 2 throws `ENOENT ... sk-code-webflow/SKILL.md`, check 1a reports 97 problems, `verify-doc-claims.cjs` reports 258 unresolved doc paths | `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` in the copy, exit 1; cause at `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:197` | P1 | orch |
| F17 | BREAK | Removing the two surfaces from the registry and router JSON is not enough: 112 failures remain (10b stale leaf manifest, 10c, 10d, and the `RESOURCE_MAP` paths in ROUTER.md), and the front door drops to the legacy stub until a re-mint | data-removal run in the copy: `{"servingAuthority":"legacy","hubId":"sk-code"}`; map at `.skilled/skills/sk-code/ROUTER.md:352` | P1 | orch |
| F18 | BREAK | Adding a surface by hand fails five more legs (3d-files, 6b, 5k-alias, 5k-packet, 5k-canary) and widens the leaf-set collision; a packet folder alone is reported unregistered (6a) and its prompts defer | copy runs in `lineages/dsflash-devin/iterations/iteration-005.md:24` and `lineages/luna-max-fast/iterations/iteration-003.md:31`; not rerun by the orchestrator | P1 | both |
| F19 | BREAK | The doctor's documented re-mint repair leaves the guard red: `compiled-route-manifest.cjs refresh` makes the policy fresh, then the guard exits 1 with `authored-drift`, because the served manifest no longer equals its authored copy under `specs/sk-doc/z_archive/`; copying the manifest back makes guard and sync pass | copy run after a `tieBreak` edit; repair text at `.skilled/commands/doctor/assets/doctor-update-apply.yaml:160`; message at `.skilled/bin/compiled-route-sync.cjs:766` | P1 | orch |
| F20 | BREAK | The compiled-routing re-mint depends on the authored closure under `specs/sk-doc/z_archive/019-skill-routing-refactor/`; in a copy without `specs/`, `compiled-route-sync.cjs` dies with ENOENT. An external user who prunes the operator's `specs/` loses the ability to re-mint | `.skilled/bin/compiled-route-sync.cjs:766`; both lineages' specs-less copies; the full copy passes | P2 | both, orch |
| F21 | OK | Reordering `tieBreak` works: with webflow and obsidian moved ahead of opencode, refresh plus the authored copy, the Webflow canary prompt routes `[sk-code-webflow, sk-code-opencode]`, guard and sync exit 0, parent-skill-check exit 0. The only failure is the hint test that pins the old order (F9) | orchestrator copy run; `.skilled/skills/sk-code/hub-router.json:7` | P1 | orch |
| F22 | OK | The advisor is unaffected by deleting or adding a surface; it routes the single `sk-code` identity | `node .skilled/bin/skill-advisor.cjs advisor_recommend` in both lineages' copies, exit 0; `.skilled/skills/sk-code/mode-registry.json:12` | P2 | both |
| F23 | OK | The 5k canary legs stay green after a pure directory deletion, because routerSignals and the canary fixture still agree with each other | `lineages/dsflash-devin/iterations/iteration-004.md:26` corrects that lineage's own iteration 3 inference; `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1075` | P2 | A |

### 3.3 Configuration versus data, and the shipped tree (Q4)

| F | Class | Claim | Evidence | Severity | Lineage |
|---|-------|-------|----------|----------|---------|
| F24 | OK | There is no publish step that strips or swaps files: the public repository is the operator's tree, and consumer projects clone or symlink it | `PUBLIC-RELEASE.md:3` | P1 | orch (B left it UNKNOWN) |
| F25 | OK | `/doctor:update` treats the whole sk-code tree as one release unit; `hub-router.json` and `mode-registry.json` are authored files that align can keep local; leaf manifests and activation manifests are generated | `.skilled/commands/doctor/scripts/release-update.cjs:520`; `.skilled/commands/doctor/update.md:72` | P1 | both |
| F26 | OK | The operator's order is consistent with the operator's own rule once the two surfaces are read as examples: native ahead of examples. So the operator keeps the shipped list unchanged, and an external user who deletes the examples is left with `[quality, review, opencode]` and inserts their surface ahead of opencode | `.skilled/skills/sk-code/hub-router.json:7` | P1 | orch |

### 3.4 Doctor and documentation (Q5)

| F | Class | Claim | Evidence | Severity | Lineage |
|---|-------|-------|----------|----------|---------|
| F27 | DOC | The hub's canonical surface sentence says it has exactly three surfaces with no example marker; every other sk-code doc that counts surfaces points to it | `.skilled/skills/sk-code/SKILL.md:40` | P1 | both |
| F28 | DOC | The root README calls the three surfaces "ready" and tells users to replace all three, including the native sk-code-opencode that serves `.skilled/` itself | `README.md:800`, `README.md:1384`, `README.md:1447` | P1 | both, orch |
| F29 | DOC | The README's adaptation steps say to register packets but name no `tieBreak` position, no leaf-manifest regeneration, no canary cases and no re-mint, and do not point at `/create:skill-parent update --surfaces` | `README.md:1448-1451`; `.skilled/commands/create/skill-parent.md:3` | P1 | both |
| F30 | DOC | The v4.0.0.4 note states the order as true everywhere, with no example caveat | `.skilled/changelog/skilled/v4.0.0.4.md:297` | P2 | both |
| F31 | DOC | The parent-skill scaffold writes `tieBreak` "covering all modes" with no rule for where a new surface goes, and its canonical example is sk-code itself | `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:462`, `:262` | P1 | A, orch |
| F32 | DOC | The new-mode checklist names the `tieBreak` permutation but not its position, the re-mint plus authored copy, the canary cases or the drift guard | `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:224` | P2 | A, orch |
| F33 | DOC | The doctor's missing-packet message (3c) states the mismatch and no repair step | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:496` | P2 | B |

---

## 4. Options for outranking sk-code-opencode (Q3)

| Option | Touches | Cost | Verdict |
|--------|---------|------|---------|
| (a) Insertion rule: a new surface goes ahead of the existing surfaces in `tieBreak` | the scaffold step `create-skill-parent-confirm.yaml:462`, README step `README.md:1448`, checklist `parent-skills-nested-packets.md:224` | wording in three places | Recommended (R1). Observed to work (F21) |
| (b) Rank field per surface in `mode-registry.json`, `tieBreak` derived at mint | registry entries `mode-registry.json:61-114`, compiler `registry-compiler.cjs:261`, `:265`, doctor 5e, fixtures | schema, compiler, doctor and fixture changes | Rejected (X1) |
| (c) `native` or `fallback` flag on opencode | `mode-registry.json:79`, compiler sort rule | schema plus compiler rule | Rejected (X2) |
| (d) Derive `tieBreak` from installed packets at mint | compiler `registry-compiler.cjs:261` | new derivation in a seven-hub compiler family | Rejected (X3) |
| (e) `--surface-hint` as the default | runtime `compiled-route.cjs:99-107` | none | Rejected as the fix (X4); stays the per-session complement |

---

## 5. Where the lineages agree and disagree

**Agree.** Both lineages found the same single order source (F1, F2), the same per-call hint semantics (F3), the same deletion breakage (F14, F15, F18), the same doc gaps (F27 to F30), and both rejected a plugin system, the hint as a default, deriving order from installed packets, deleting the examples from the operator's repository and weakening the doctor.

**Disagree, and how the orchestrator settled each.**

| Topic | Lineage A (dsflash-devin) | Lineage B (luna-max-fast) | Orchestrator ruling |
|-------|---------------------------|---------------------------|---------------------|
| How a user surface outranks opencode | R1: a rank field per surface plus a `tieBreak` derived at mint | Keep `tieBreak` as the only order source and place the user surface ahead of opencode | B. A reorder plus re-mint was observed to work (F21). A's own Q4 table admits the rank field does not separate the operator's order from the external one, so it adds a second order source without closing a gap |
| Where the operator/external split lives | In the one tree's data, with `/doctor:update` keep-local for downstream trees | An example-free starter at a publisher boundary, marked UNKNOWN | Neither. No publisher boundary exists (F24), and no split is needed: the shipped order already ranks native ahead of the examples (F26). Only the insertion position for new surfaces is missing |
| Ship without the examples | R2: drop them from the shipped routing data | Omit them only from a starter payload | Rejected (X5). The shipped tree is the operator's tree, so dropping them removes the operator's surfaces |
| Teach the guard to check packet directories | Option E, proposed | Keep the structural checks fail-closed, no new leg | Rejected for now (X7). parent-skill-check already fails the same state loudly (F14) |
| Re-mint in a shipped tree | Phase 0, unobserved; sync fails for all hubs | Route-sync unproven | Settled (F19, F20): it works in a full tree, but needs the authored copy step the doctor's repair omits |
| 5k canary after deletion | Iteration 3 inferred a failure, iteration 4 observed a pass | Pass | Pass (F23) |

Neither lineage found the hard-coded drift guard (F8, F16), the doctor's re-mint repair gap (F19) or the Webflow-dominated stack-agnostic intents (F10); the orchestrator found them in its own copy runs.

---

## 6. Ranked recommendation

| R | Recommendation | Evidence | Cheaper move and why it fails |
|---|----------------|----------|-------------------------------|
| R1 | Keep `tieBreak` as the one order source and write the insertion rule where surfaces are added: a new surface goes ahead of the existing surfaces, so ahead of `sk-code-opencode`. One line in the scaffold step, one in the README adaptation step, one in the checklist row. The shipped order and the operator's repository stay unchanged | `.skilled/skills/sk-code/hub-router.json:7`; `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:462`; `README.md:1448`; observed in F21 | Build nothing fails: an appended surface sorts after opencode and loses every keyword tie, the same position webflow holds today in `canary-cases.v1.json:117` |
| R2 | Make the stack-agnostic tooling stop naming the examples: `verify-router-sync.cjs` reads the surface list from `mode-registry.json`, and the surface-hint test runs on a fixture hub or the hub's own canary data instead of pinning the live Webflow order | `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:31-32`; `.skilled/bin/tests/compiled-route-surface-hint.test.cjs:61-65` | Documenting the deletion fails: the drift guards crash on ENOENT whatever the docs say (F16) |
| R3 | Make removing a surface a documented and verified path: the inverse of the new-mode checklist (registry, router signals and vocabulary, `tieBreak`, ROUTER.md maps, SKILL.md table, stack-detection, canary cases, leaf-manifest regeneration) plus the full re-mint sequence, and fix the doctor's repair text to copy the re-minted manifest to its authored path. Add the one-line repair pointer to the 3c message | `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:220-232`; `.skilled/commands/doctor/assets/doctor-update-apply.yaml:160`; `.skilled/commands/doctor/scripts/parent-skill-check.cjs:496` | A removal command fails the cost test for one known caller; prose alone fails because the current repair text leaves the guard at exit 1 (F19) |
| R4 | Mark the two surfaces as examples: one sentence at `SKILL.md:40`, README lines 800, 1384 and 1447 (keep OpenCode as the native surface, replace or delete the two examples), the sk-code README surface table, and the rule in the next release note rather than an edit of the shipped v4.0.0.4 note | `.skilled/skills/sk-code/SKILL.md:40`; `README.md:1384`; `.skilled/skills/sk-code/README.md:55`; `.skilled/changelog/skilled/v4.0.0.4.md:297` | A README-only change fails: `SKILL.md:40` is the sentence every other sk-code doc defers to |
| R5 | Operator decision, not built: whether sk-code-opencode's generic language vocabulary should stay, since it bundles opencode into an external user's generic code prompts by score | `.skilled/skills/sk-code/hub-router.json:83` | Narrowing it now fails the restraint bar: no external caller has reported it, and the operator's own repository relies on it |

---

## 7. Rejected ideas

| X | Idea | Evidence | Reason |
|---|------|----------|--------|
| X1 | A rank or priority field per surface in `mode-registry.json`, with `tieBreak` derived at mint | `.skilled/skills/sk-code/mode-registry.json:61`; `registry-compiler.cjs:265` | A second order source the compiler, 5e and the fixtures must reconcile, for a requirement the existing list meets once the insertion rule exists (F21). It also does not split the operator's order from the external one |
| X2 | A `native` or `fallback` flag on sk-code-opencode | `.skilled/skills/sk-code/mode-registry.json:79` | One flag cannot order several user surfaces, and without an example role it would push opencode behind the examples in the operator's repository |
| X3 | Derive the order from the installed packet set at mint | `registry-compiler.cjs:261` | Presence says nothing about preference among several surfaces, and identical authored inputs would mint different manifests in different trees |
| X4 | `--surface-hint` as the shipped default | `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:99-107` | Per call and matched-only; a caller that omits it gets `tieBreak`. It stays the session complement |
| X5 | Ship without the examples, or delete them from the operator's repository | `PUBLIC-RELEASE.md:3`; `.skilled/skills/sk-code/mode-registry.json:61` | The shipped tree is the operator's tree; both remove the operator's surfaces |
| X6 | An operator-versus-external config file, a starter payload or a feature flag for the operator's order | `PUBLIC-RELEASE.md:3`; `.skilled/skills/sk-code/hub-router.json:7` | No consumer reads such a file and no publisher boundary exists; the shipped order already serves both once new surfaces are inserted ahead of opencode |
| X7 | A new guard leg that stats packet directories, or a doctor WARN that downgrades a missing example packet | `.skilled/bin/compiled-route-guard.cjs:97-116`; `.skilled/commands/doctor/scripts/parent-skill-check.cjs:495-497` | parent-skill-check already fails the half-deleted state loudly; a downgrade would hide routes to deleted packets (F15) |
| X8 | A plugin or auto-discovery system for surfaces, or a new surface wizard | `.skilled/commands/create/skill-parent.md:3` | `/create:skill-parent update --surfaces` already exists as the scaffold path |
| X9 | Invert the stack-detection precedence so OPENCODE detects last | `.skilled/skills/sk-code/shared/references/stack-detection.md:39` | Detection is path-based: a target inside `.skilled/` is OpenCode work for every user, so OPENCODE-first is correct there |

---

## 8. Proposed implementation phases

| P | Phase | Scope | Gate |
|---|-------|-------|------|
| P1 | Insertion rule and example markers | R1 and R4: `create-skill-parent-confirm.yaml:462` and its auto twin, `README.md:800`, `:1384`, `:1447-1451`, `SKILL.md:40`, sk-code README table, `parent-skills-nested-packets.md:224`; the next release note states the rule | sk-doc validators on each touched doc; `run-all-drift-guards.sh` exit 0 in the live tree |
| P2 | Example-agnostic tooling | R2: `verify-router-sync.cjs:31-32` reads the registry; the surface-hint test stops pinning the live Webflow order | In a full-tree copy with both examples removed by the P3 recipe, `run-all-drift-guards.sh` and the compiled-route tests exit 0; in the live tree they still exit 0 |
| P3 | Supported removal and re-mint | R3: removal checklist, the re-mint sequence with the authored copy, the corrected repair text at `doctor-update-apply.yaml:160`, the 3c repair pointer | In a full-tree copy: delete both examples by the checklist, then parent-skill-check, `ci-skill-root-metadata.cjs`, guard and `compiled-route-sync.cjs --check` all exit 0 and no prompt routes to a deleted packet; then add a stand-in surface ahead of opencode and confirm it leads a tie |
| P4 | Operator decision | R5: opencode's generic vocabulary at `hub-router.json:83` | Only if the operator asks |

---

## 9. Orchestrator verification and corrections

| Item | Result |
|------|--------|
| Anchors reread | `hub-router.json:7`, `:31-46`, `:83`; `mode-registry.json:19`; `registry-compiler.cjs:255-266`; runtime `compiled-route.cjs:95-110`; `parent-skill-check.cjs:488-500`, `:1072-1090`, `:1140-1158`; `SKILL.md:38-41`, `:63`; `stack-detection.md:39`; `v4.0.0.4.md:293-298`; `README.md:800`, `:1384`, `:1445-1452`; `verify-router-sync.cjs:1-60`; `PUBLIC-RELEASE.md:3`; `skill-parent.md:3`; `create-skill-parent-confirm.yaml` update and tieBreak lines |
| Copy runs | Full-tree copy in the scratchpad, outside the worktree: control green; deletion 113 failures, guard fresh, deleted packets routed; drift guards exit 1 with ENOENT; data removal 112 failures and legacy stub; tieBreak reorder plus refresh plus authored copy routes webflow first with guard, sync and parent check green and the hint test red |
| Correction to A | The rank field's "two real callers" argument does not hold: the operator and external orders do not need different rules once new surfaces go ahead of opencode, and A's own Q4 row says the rank field leaves the operator's order in the same file |
| Correction to B | The publisher boundary B left UNKNOWN does not exist (`PUBLIC-RELEASE.md:3`), so an example-free starter has nowhere to live |
| Correction to B | B cited `system-skill-advisor/graph-metadata.json:25-27` for the `obsidian plugin` phrase; the phrase is in `sk-code/graph-metadata.json:126` and `lexical.ts:39` |
| Not rerun | The add-surface failure list (F18) is carried from both lineages' copy runs |

---

## 10. Open questions

- R5: should sk-code-opencode keep generic language keywords? Operator decision.
- Should the authored compiled-routing closure move out of `specs/sk-doc/z_archive/` so an external user can prune the operator's specs (F20)? Out of this research's scope; it touches every hub.
