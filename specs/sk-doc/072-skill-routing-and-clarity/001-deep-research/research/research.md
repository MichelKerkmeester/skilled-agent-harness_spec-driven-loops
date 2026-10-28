# Skill Routing Shape and Doc Clarity: Merged Research

Ten iterations across two fan-out lineages, both DeepSeek V4.1 Flash at max reasoning: `pi` (cli-pi, `llmgateway/deepseek-v4.1-flash-1017`, `--thinking max`) and `devin` (cli-devin, `deepseek-v4-1-flash-max`), five iterations each, `stopPolicy: max-iterations`. Lineage reports: `lineages/pi/research.md`, `lineages/devin/research.md`.

Every finding below carries a verification mark from the orchestrator. **Confirmed** means the orchestrator read the cited line or ran the cited command after the run. **Unconfirmed** means only a lineage read it.

---

## 1. Executive Summary

The answer is the advisor's hybrid, with one change for standalone skills. JSON decides the mode, one hub-root `ROUTER.md` decides the first leaf slice, and script resolvers decide the rest. No skill gets a per-mode `ROUTER.md`. Standalone skills keep a short inline router, because the class contract forbids hub files for them.

The problem is not too many kinds of routing. Each decision is written down in two to five places, nothing generates one copy from another, and some copies are read by no code at all. The plan therefore cuts restatements and names one authored source per decision. It does not introduce a new shape.

Two lineages, working on disjoint halves of the fleet, reached the same verdict independently. Each also found correctness defects that a prose pass would hide. Those defects go first.

---

## 2. Research Charter

- **Question:** which routing shape fits each skill type, what pins the current shape, where the docs read poorly, and in what order to change them.
- **Scope:** all 14 roots under `.skilled/skills/`, plus the command and agent docs that teach routing.
- **Split:** `pi` took sk-code, sk-doc, sk-design, system-deep-loop and their checks. `devin` took cli-external-orchestration, mcp-tooling, cli-classifier, the seven standalone skills, the commands, agents and mirrors.
- **Non-goal:** no change outside `specs/` in this phase.

---

## 3. Method

Each lineage read the files and cited `path:line`. Neither lineage ran the enforcement scripts except `compiled-route-guard.cjs --json` (pi). After the run, the orchestrator re-read every cited line used in a verdict or the phase plan, and ran `compiled-route-guard.cjs --json` and a code search for `Keyword triggers` readers.

---

## 4. Fleet Classes

| Class | Discriminator | Roots |
|---|---|---|
| H, packet hub | declares both `mode-registry.json` and `hub-router.json` | cli-classifier, cli-external-orchestration, mcp-tooling, sk-code, sk-design, sk-doc, system-deep-loop |
| S, standalone | declares neither | cli-orca, mcp-code-mode, sk-git, sk-prompt, sk-vision, system-skill-advisor, system-spec-kit |

The class contract defines H and S by those two files and keeps `ROUTER.md` outside classification as a hub-root companion. **Confirmed** at `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:38-48` and `:60`. Every hub root carries one `ROUTER.md`, and no packet carries one. **Confirmed** by `find .skilled/skills -name ROUTER.md`, which lists only the seven hub roots.

---

## 5. Routing Mechanisms and Restatements (question a)

| Decision | Live authority | Restated in |
|---|---|---|
| D1 which skill | `graph-metadata.json` `intent_signals` and `derived.trigger_phrases` | SKILL.md keyword comments, `description.json` keywords, `ROUTER.md` frontmatter |
| D2 which mode | `hub-router.json` classes, compiled into `compiled-route.cjs` | `mode-registry.json` aliases, hub SKILL.md `route()` pseudocode, `ROUTER.md` `INTENT_SIGNALS`, packet `Keyword triggers:` lines |
| D3 which surface (sk-code only) | `stack-detection.md` plus `--surface-hint` | registry `surfaceDetection`, review `surface_evidence()` pseudocode |
| D4 which leaves | hub `ROUTER.md` §3 and §9 | packet `INTENT_SIGNALS` / `RESOURCE_MAP` / loading tables |
| D5 which checklists (sk-code only) | `quality-gate.cjs --explain` | quality SKILL.md table, skilled §5 table, ROUTER.md overlay |

### Drift, by finding

1. **sk-code `ROUTER.md` §2 and §9 disagree in both directions.** §2 lists `TESTING` and `LANGUAGE_STANDARDS` with no §9 key. §9 lists `JAVASCRIPT`, `TYPESCRIPT`, `PYTHON`, `SHELL` and `RUST` with no §2 row. The file calls §9 "the byte-for-byte source a deterministic router parses". **Confirmed** at `.skilled/skills/sk-code/ROUTER.md:57`, `:60`, `:223`, `:241-252`.
2. **sk-code names three different routing authorities.** The hub says "`mode-registry.json` is the single source of truth" (`.skilled/skills/sk-code/SKILL.md:54`). Review says "Keep Section 2 (`SMART ROUTING`) as the authoritative routing source" (`.skilled/skills/sk-code/sk-code-review/SKILL.md:612`). ROUTER.md claims its §9 (`:223`). **Confirmed.**
3. **The advisor report undercounted sk-code aliases.** The registry holds 83 aliases (quality 13, review 10, skilled 5, ci 55), not about 59. **Confirmed** by parsing `.skilled/skills/sk-code/mode-registry.json`.
4. **sk-doc declares a source of truth that no code reads.** `sk-doc/SKILL.md:53` makes each packet's `Keyword triggers:` line the source and the two JSON files "synchronized projections". **Confirmed** at that line. A code search for `Keyword triggers` across `.cjs`, `.js`, `.mjs`, `.ts` and `.py` files returns nothing. **Confirmed.** The lineage's count of 17 trigger terms missing from `hub-router.json` is **unconfirmed**.
5. **sk-doc already runs most packets with no machine router.** Nine of 14 packets carry no `INTENT_SIGNALS` or `RESOURCE_MAP` (agent, changelog, command, diff, feature-catalog, goal, manual-testing-playbook, quality-control, readme). The hub `ROUTER.md` names their leaves, and the hub passes. **Confirmed** by grep across `.skilled/skills/sk-doc/*/SKILL.md`. The advisor report missed this. It is the strongest evidence that a per-packet machine block is optional where the hub names the leaves.
6. **The "machine block stays out of SKILL.md" rationale is copied into several hubs.** **Confirmed** at `.skilled/skills/sk-doc/SKILL.md:65`. The verbatim copies at `system-deep-loop/SKILL.md:50`, `cli-external-orchestration/SKILL.md:78` and the paraphrase at `sk-design/SKILL.md:74` are **unconfirmed**.
7. **The no-match outcome has three names:** `defer`, `UNKNOWN_FALLBACK` and "UNKNOWN fallback". **Unconfirmed** beyond the sk-code `UNKNOWN_FALLBACK` marker, which `package_skill.py` requires.
8. **Executor vocabulary drifts between registry and `ROUTER.md` in cli-external-orchestration and mcp-tooling.** For example, `mcp-tooling/hub-router.json` class `obsidian-aliases` routes `health` and `health-md` to `mcp-obsidian`, while the `ROUTER.md` `OBSIDIAN` intent carries neither, so stage one can select a mode that stage two cannot serve. **Confirmed** for the health terms (`.skilled/skills/mcp-tooling/ROUTER.md:97`, `hub-router.json` `obsidian-aliases`). The per-executor drift counts are **unconfirmed**.
9. **cli-devin's first leaf slice is stated three ways** (hub `ROUTER.md`, the packet ALWAYS table, the packet GENERATION map). **Unconfirmed.**

### Correctness defects found along the way

10. **system-skill-advisor's resource discovery roots do not match its directories.** `RESOURCE_BASES` lists `feature_catalog` and `manual_testing_playbook` with underscores and omits `hooks`. The directories are `feature-catalog/`, `manual-testing-playbook/` and `hooks/`. **Confirmed** at `.skilled/skills/system-skill-advisor/SKILL.md:105-108` and by `ls`.
11. **system-skill-advisor maps an intent to a leaf missing from its own manifest.** `"HOOK": ["hooks/skill-advisor-hook.md"]` at `SKILL.md:183`, while the comment at `:163-164` promises every value is in `leaf-manifest.json`. `leaf-manifest.json` has no `hooks/` entry. **Confirmed.**
12. **`shared-smart-router.md` still says six cli siblings** and omits cli-hermes. **Confirmed** at `.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md:17`.
13. **cli-external-orchestration advertises a retired benchmark.** Its `benchmark/README.md:16` records that the Lane C harness, runner and scoring contract were removed. **Confirmed.** The cited advertising sentence at `SKILL.md:76` is **unconfirmed**.

---

## 6. What Pins the Current Shape (question b)

| Mechanism | Pins | What breaks it | Mark |
|---|---|---|---|
| `router-replay-lib.cjs` `parseRouter` | reads the whole SKILL.md text inline first, then falls back to a referenced `references/*.md` doc | a packet-root `ROUTER.md` is invisible; a block moved to an appendix of the same file is still read | **Confirmed** `:397-410`, `:374` |
| `verify-router-sync.cjs` leg 2 | hub map equals the union of surface maps plus `SHARED_CONTROL_RESOURCES` | an empty `SHARED_CONTROL_RESOURCES`, including a legitimate stage1-only hub | **Confirmed** `:196-200` |
| `root-router-contract.cjs` | codes RRC-001 to RRC-009, including `MISSING_ROOT_ROUTER` and `MISSING_PROSE_SECTION` | deleting a hub `ROUTER.md` (JSON-only) | **Confirmed** `:125-136` |
| `package_skill.py` | an H2 named `SMART ROUTING` plus the markers `discover_markdown_resources`, `_guard_in_skill`, `UNKNOWN_FALLBACK` | shrinking §2 without the markers | **Confirmed** `:69`, `:181-185` |
| `doctor-router-reach.yaml` | stage-one vocabulary from `.skilled/skills/*/graph-metadata.json`, stage-two from `.skilled/skills/*/ROUTER.md` | deleting a hub `ROUTER.md`; a nested router is outside the glob | **Confirmed** `:64-65` |
| compiled routing (`build-artifacts.cjs`, `compiled-route-guard.cjs`) | hashes hub `SKILL.md`, `hub-router.json`, `mode-registry.json` | any hub SKILL.md edit without a re-mint drops that hub to the legacy router | **Confirmed** `build-artifacts.cjs:44-60`; guard reports all 7 hubs fresh today |
| `check-rule-copies.js` | the review Extension Floors lines, byte for byte | any reflow of those lines | **Unconfirmed** in this run (advisor report) |
| `parent-skill-check.cjs` | root ROUTER.md (12a), alias subset (5k), hub `allowed-tools` equals the union of modes (3j) | merging vocab with duplicate aliases; narrowing hub tools | **Unconfirmed** line numbers |
| Hermes mirror | `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` writes text copies of every SKILL.md | any SKILL.md edit without a re-sync | **Confirmed** the script exists; the advisor's UNKNOWN is answered |
| Other runtime mirrors | `.opencode/skills` is a symlink to `.skilled/skills` | nothing; symlinks follow | **Confirmed** by `ls -la` |

**Correction to lineage `pi`:** it claimed the compiler reads a separate `.opencode` mirror that must be edited and re-minted alongside `.skilled`, and listed the mirror's generator as UNKNOWN. `.opencode/skills` is a symlink to `.skilled/skills`, so the two cannot diverge. The re-mint requirement still holds.

**The useful asymmetry:** packet SKILL.md files sit outside the compiler hash and outside the reach glob. Hub files sit inside both. Packet-level changes are revert-only. Hub-level changes need a re-mint, and their failure is silent except for the guard.

---

## 7. Verdict per Skill Type (question c)

**Hubs (7): keep one hub-root `ROUTER.md`, with JSON for stage one and script resolvers for the rest. This is the advisor's hybrid.**
- Per-mode `ROUTER.md`: rejected. `parseRouter`'s fallback accepts only `references/*.md`, the reach check globs only hub roots, and the canon puts the router at the hub root (`parent-skill-root-router-template.md:19-20`, per the advisor report).
- JSON-only: rejected. RRC-001 and RRC-009 fail, the reach check loses its stage-two input, and the compiled router emits packets, not leaves.
- The work inside the hybrid: name one authored source per decision and generate or delete the copies. `hub-router.json` becomes the authored mode vocabulary. `ROUTER.md` §2 is generated from §9, or §2 shrinks to prose that points at §9. The hub `route()` pseudocode gives way to a short statement that points at `compiled-route.cjs`.

**Mode packets (25): no router file. Keep §2 to 8 to 12 lines, then a final `## MACHINE ROUTER` appendix, or no block at all where the hub names the leaves.**
- Moving the block within the file is free for `parseRouter`, which reads the whole text first. **Confirmed.** Whether `package_skill.py` checks section order is still **unconfirmed**. Phase 003 tests it on one packet before any rollout.
- Keep the packet's task-intent map where it decides something the hub does not. cli packets score task intent inside one executor, while the hub scores executor identity (devin lineage, **unconfirmed** at line level). Delete only the copies that restate the hub's first leaf slice.
- §2 keeps the `SMART ROUTING` H2 and the three marker words.

**Standalone skills (7): a short inline router, generated leaf manifest and aliases, and no `ROUTER.md`.**
- The class contract forbids `mode-registry.json` and `hub-router.json` for Class S, so there is nowhere for JSON-only mode routing to live, and no hub `ROUTER.md` to move stage two into. **Confirmed** at `skill-root-metadata-contract.md:38-48`.
- The Python block stays only where it chooses among leaves. It can shrink where it does not, for example sk-vision, which loads one corpus (**unconfirmed** at line level).

JSON-only is already the operative shape for leaf identity everywhere, through `leaf-manifest.json` and `leaf-aliases.json`. It is not viable for leaf choice, because no runtime script makes that choice.

---

## 8. Readability (question d)

Routing share of each file, as measured by the lineages (**unconfirmed** counts): sk-code-review about 50 percent, sk-code-skilled 54, sk-code-quality 37, system-spec-kit 60, system-skill-advisor 59, sk-prompt 41, cli-orca 38, mcp-code-mode 33, sk-git 29, sk-vision 25, cli-classifier 23, cli-external-orchestration 20, mcp-tooling 11. mcp-tooling's two-stage statement at `SKILL.md:50-53` is the model to copy.

Quoted passages (each read by a lineage, and spot-checked by the orchestrator where marked):
- "`quality` is the author-side quality gate MODE child of the `sk-code` family. It runs after the acting agent applying `workflow-implement.md` changes the code…" (`sk-code/sk-code-quality/SKILL.md:15`). **Confirmed** by the advisor report and lineage pi.
- "One skill, two axes, one shared surface-detection router, and one advisor identity." (`sk-code/SKILL.md:15`). Jargon before definition.
- `sk-doc/SKILL.md:53` is one paragraph that defines both stages, the advisor handoff and the source-of-truth rule. **Confirmed** by the orchestrator's read.
- "Keep one authoritative Smart Router Pseudocode block in this section… Do NOT duplicate routing logic in separate lookup tables." (`sk-prompt/SKILL.md:56-57`), followed by three duplicated leaf lists.
- "**Typed leaf projection (fleet routing standard).** system-spec-kit is a normal, registry-less single-mode skill…" (`system-spec-kit/SKILL.md:95`), one 1,988-character line.
- `sk-git/SKILL.md:307` is one 2,195-character line.

Cross-cutting problems:
1. Instructions come after routing apparatus in most mode packets.
2. Terms such as "Class S", "typed leaf", "MODE child", "fallback-only" and "orderedBundle" appear before any definition.
3. Project history and retired machinery sit inside instructions. Examples: the "retired" replay at `sk-code-quality/SKILL.md:154` while sk-code-skilled documents it as live, and the retired benchmark claim.
4. Some single lines run 1,000 to 2,200 characters.

---

## 9. Phased Plan (question e)

The two lineages proposed the same order with different labels. Merged:

| Phase | Work | Risk | Rollback |
|---|---|---|---|
| 002 | Baseline every gate. Fix the correctness defects with no shape change: system-skill-advisor roots and HOOK leaf, sk-code ROUTER.md §2/§9 drift, the mcp-obsidian stage gap, cli-jev default semantics, `shared-smart-router.md` six to seven, the retired benchmark claim | Low | Revert per file, regenerate the leaf manifest |
| 003 | Canon and tooling: the packet §2 plus `## MACHINE ROUTER` appendix in the create-skill and parent-skill templates; prove on one packet that `parseRouter`, `verify-router-sync`, `package_skill.py` and `parent-skill-check` stay green; one no-match name; one glossary per hub | Medium | Revert templates and tooling together |
| 004 | One authored vocabulary per hub: `hub-router.json` authored, registry aliases and `ROUTER.md` keywords generated or checked; decide sk-doc's `Keyword triggers:` authority; graph a superset of advertised `ROUTER.md` phrases | High (changes live routing) | Revert the generator commit and re-mint the compiled route |
| 005 | sk-code hub and its four packets, review last; Extension Floors lines byte-identical | Medium | Revert per packet; re-mint if the hub SKILL.md changed |
| 006 | sk-doc hub and 14 packets | Medium | Same |
| 007 | sk-design and system-deep-loop | Medium | Same |
| 008 | cli-external-orchestration, cli-classifier, mcp-tooling | Medium | Same |
| 009 | The seven standalone skills | Low to medium | Revert per skill; regenerate manifest and aliases |
| 010 | Prose-clarity pass over every skill doc and the command and agent docs that teach routing, with the clarity rules from the advisor report | Low | Revert per file |
| 011 | Regenerate every mirror (Hermes, prompt stubs, leaf manifests, compiled routes), run the full gate against the 002 baseline, bump versions and changelogs | Medium | Revert the regeneration commit |

---

## 10. Corrections to the Starting Hypothesis

| Advisor claim | Status |
|---|---|
| "`mode-registry.json`, about 59 aliases" | Wrong: 83. **Confirmed** |
| ROUTER.md §2 has intents §9 lacks | Right, but the drift runs both ways. **Confirmed** |
| `system-deep-loop` reports a stale compiled manifest | Does not reproduce: all 7 hubs fresh. **Confirmed** |
| Hermes generator UNKNOWN | `sync-skills-hermes.cjs`. **Confirmed** |
| No ROUTER.md per mode anywhere | Right. **Confirmed** |
| Remove the per-packet loading tables | Too broad: delete restatements of the hub's first slice, keep task-intent maps that decide something. **Unconfirmed** at line level |
| Missed | sk-doc already runs 9 of 14 packets with no machine block. **Confirmed** |

---

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence |
|---|---|---|
| One `ROUTER.md` per mode packet | Invisible to `parseRouter` and the reach glob; against the canon | `router-replay-lib.cjs:374`, `doctor-router-reach.yaml:65` |
| JSON-only for hubs | Fails RRC-001 and RRC-009, empties the reach check's stage two, and no script chooses leaves | `root-router-contract.cjs:127`, `:135`; `doctor-router-reach.yaml:65` |
| JSON-only mode routing for standalone skills | The class contract forbids the hub JSON files there | `skill-root-metadata-contract.md:38-48` |
| Declaring `Keyword triggers:` authoritative as-is | No code reads it | code search, zero hits |
| Deleting every packet task-intent map | Some decide within-mode intent the hub does not | devin lineage, iteration 1 |
| Treating `leaf-manifest.json` as a router | Generated identity only; no router consumer | pi lineage, iteration 1 |

## Divergence Map

No divergent pivots ran (`convergenceMode: default`). The two lineages covered disjoint halves and converged on the same verdict without seeing each other's work. Remaining frontier: whether `package_skill.py` checks section order; the per-executor vocabulary drift counts; and the router-reach result against the live advisor, which nobody ran.

---

## 12. Open Questions

1. Does `package_skill.py --strict` accept a `SMART ROUTING` section followed by a final `## MACHINE ROUTER` appendix? Phase 003 answers this on one packet.
2. Should sk-doc's packet `Keyword triggers:` lines become generated from `hub-router.json`, or should a generator build the JSON from them? Phase 004 decides.
3. Which `router-reach` phrases are reachable today? Phase 002's baseline answers this.
4. Should `shared-smart-router.md` stay a routed leaf of system-spec-kit?

---

## References

- Lineage reports and iterations: `lineages/pi/`, `lineages/devin/`.
- Merged registry: `findings-registry.json`; attribution: `fanout-attribution.md`; resource map: `resource-map.md`.
- Starting hypothesis: `../scratch/sk-code-advisor-report.md`.

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 10 (pi 5, devin 5)
- Questions answered: 5 / 5
- Convergence threshold: 0.05, telemetry only under `stopPolicy: max-iterations`
- Last iteration ratios: pi 0.50, 0.66, 0.48; devin 0.80, 0.90, 0.55
- Divergence summary: no divergent pivots recorded
- Run integrity: lineage `devin`'s resource-map step wrote `research/resource-map.md` at the parent level, outside its lineage. The fan-out flagged it as a containment advisory. The orchestrator deleted that file and regenerated the parent resource map with the reducer.
