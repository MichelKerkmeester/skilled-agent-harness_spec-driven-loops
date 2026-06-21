# Research Synthesis (lineage dq-skilldoc-cmd-ctx): Granular Per-Surface DQ Automation for SKILL DOCS, COMMANDS, and CONTEXT-ENGINEERING

<!-- ANCHOR:dq-skilldoc-cmd-ctx-index -->
Fan-out lineage `dq-skilldoc-cmd-ctx` under packet 005-spec-data-quality. The parent converged on the **truncation law** over spec docs + JSONs + retrieval code. `dq-deep` found the **automation asymmetry** and named two keystones (extend the live default-ON `quality-loop.ts`; a standing scheduled DQ sweep with guarded auto-fix). `dq-probe` found the **bifurcation** and named one headline (wire the sk-doc DQI scorer into a gate). This lineage takes those as the settled FLOOR and drills **below** them into granular, file:line-grounded per-surface primitives for the three surfaces the operator emphasized. It converges six iterations. The unit is a verdict, not a build.

## 1. Executive Verdict

The organizing finding is the **timing-tier topology with one empty slot**.

Reconciling every per-surface gap against what actually ships reveals DQ enforcement runs in exactly three timing tiers, and the gaps are far more surgical than "wire it up":

1. **on-write (pre-commit)** — 5 blocking gates (`.git/hooks/pre-commit:4-112`: doc-model-refs, comment-hygiene, prompt-card-sync, MCP-mutation-class, tool-ownership). Instant, staged-file-scoped.
2. **PR-time (CI)** — **8 GitHub Actions**, every one `on: pull_request` with `paths:` filters (`.github/workflows/*.yml`): skill-doc-frontmatter, routing-registry-drift, markdown-link-integrity, prompt-card-sync, comment-hygiene, agent-mirror-sync, rule-canary-sync, isolation-check.
3. **scheduled (cron)** — **ZERO** (`grep "schedule:|cron:" .github/workflows` → empty).

This **corrects dq-deep B1's premise** ("no scheduled/hook invocation exists today; all retroactive tools are operator-run") — a rich PR-time CI tier demonstrably exists — while **validating and sharpening dq-deep B1's conclusion**: the *scheduled* tier specifically is the one slot with zero coverage, and it is the multiplier. Every shipped gate is **change-triggered** (pre-commit on staged files; CI on PR-changed `paths`), so three classes of defect escape: (a) a path the CI filter never matches — e.g. `skill-doc-frontmatter.yml` watches only `references/**`+`assets/**`, so a **SKILL.md hub** edit is never frontmatter-checked; (b) latent defects in files untouched since a rule shipped (the backfill blind spot); (c) cross-surface coherence spanning multiple `paths` roots that no single-root PR triggers.

The decisive consequence: the "most automated" layer is a **standing scheduled corpus sweep** whose payload is this lineage's specific per-surface detectors — none of which any of the three tiers covers today. Under the inherited truncation law, every detector below is write-time/adherence/logic class: it **bypasses the 3-result floor** and ships on cost. Exactly one item (telemetry→refine) is retrieval-class and inherits the parent's prod-mode completeRecall@3 unblock condition.

## 2. The Granular Per-Surface Feature Set

Reader tags: R retrieval, A adherence, L logic. Timing: on-write (pre-commit), PR-time (CI), or scheduled. Floor: **bypass** (ships on cost) vs **pays** (needs prod-mode @3 proof). Every row is grounded to file:line and is more granular than — and non-overlapping with — the sibling lineages.

### Surface 1 — SKILL DOCS (22 skills' SKILL.md + references + assets)

| # | Feature | Reader | Timing | Floor | Grounding (reuse-first basis) |
|---|---------|--------|--------|-------|-------------------------------|
| S1 | **Extend the CI frontmatter coverage gate to the SKILL.md HUB.** Today `skill-doc-frontmatter.yml` watches only `references/**`+`assets/**` (355/355 conformant 2026-06-11); the hub is excluded by path filter. Add the hub + a **`version` grammar check** (live corpus carries 2 grammars: 4-part `3.5.0.0` vs 3-part `1.0.0`/`0.6.0`) and a **required-field uniformity** assertion (only 1/20 skills carries `argument-hint`). | A, L | on-write + PR-time | bypass | `check-skill-doc-frontmatter.sh --coverage` already exists; widen path scope (`skill-doc-frontmatter.yml:6-7`; grep `^version:` → 20 hits/2 grammars) |
| S2 | **Skill-graph content-drift gate.** The advisor's `skill-graph.json` (generated 2026-06-05) derives `families`/`adjacency`/`signals`/`conflicts`/`topology_warnings` from SKILL.md keywords; `routing-registry-drift.yml` guards only registry↔advisor-map parity, NOT keyword↔graph drift. On hub keyword/edit, run `advisor_rebuild`→`advisor_validate` and assert zero net-new `topology_warnings`. | R, L | on-write + scheduled | bypass | `advisor_rebuild`/`advisor_validate` are live MCP tools; `skill-graph.json` topology_warnings/conflicts slots exist |
| S3 | **Cross-skill signal-collision gate.** Routing ambiguity is a LIVE measured phenomenon (this session: `deep-loop-workflows 0.95/0.16 vs sk-code 0.92/0.16`) yet `conflicts:[]` is empty (ungated, not clean). On keyword change, recompute the advisor signal set and fail on a new high-confidence near-tie, persisting it to `conflicts`. | R, A | on-write + scheduled | bypass | advisor ambiguity scoring + `conflicts` slot + `advisor_validate` all shipped (skill-graph.json `conflicts:[]`) |
| S4 | **Three-surface keyword coherence.** A skill's routing identity spans `<!-- Keywords: -->` (17/20 skills; `deep-loop-runtime` lacks it), frontmatter `trigger_phrases`, and advisor `signals` — no gate asserts subset/superset coherence or flags a missing Keywords comment. | R | on-write + scheduled | bypass | grep `<!-- Keywords:` → 17/20; advisor `signals` slot |
| S5 | **enhances-edge reciprocity gate.** Run `skill_graph_propagate_enhances` in **detect mode** on any `enhances`/`depends_on` edit; assert zero missing inbound edges (graph stays reciprocal). | L | on-write | bypass | `propagate_enhances.md:1-30`; handler ships, report-first |

> Negative knowledge: the skill `[[wikilink]]` validator is **already built AND CI-wired** (`check-links.sh:5,25` fence-aware + `markdown-link-integrity.yml`). dq-probe F5's "build it" framing is wrong; only the **pre-commit (instant) timing** is missing. Do not re-spec it.

### Surface 2 — COMMANDS (28 command docs + ~30 workflow YAMLs)

| # | Feature | Reader | Timing | Floor | Grounding |
|---|---------|--------|--------|-------|-----------|
| C1 | **KEYSTONE: generalize `route-validate.py`'s 8 assertions beyond `/doctor`.** It already does (A) YAML+schema_version, (B) required keys, (C) no dup targets, (D) **owned YAML asset exists**, (E) **mutation_class ∈ {read-only,add-only,mutates}**, (F) **`mcp_tools` ⊆ frontmatter allowed-tools**, (G) ≥1 trigger phrase, (H) flag collisions — but only `/doctor` has a `_routes.yaml`; 27/28 command docs get none. Ship a `command-router-contract.yml` running D/E/F corpus-wide. | A, L | on-write + PR-time | bypass | `route-validate.py:1-22`; `find _routes.yaml` → 1 hit |
| C2 | **Argument-grammar parser.** `argument-hint` is unparsed prose (`speckit/plan.md:2-3` declares 4 modes + ~14 flags in one line). Parse it; assert each declared `:mode` has a matching owned-asset YAML (the create family ships `*_auto.yaml`/`*_confirm.yaml` pairs), no orphan asset, no flag/mode token collision. | A, L | on-write | bypass | `speckit/plan.md:2-3`; `create/assets/` auto/confirm pairing |
| C3 | **Workflow-YAML schema gate.** ~30 YAMLs own dispatch/steps/artifacts; no schema validator exists (route-validate D checks only that the asset *exists*). Add a zod/JSON-schema gate (the command-surface analogue of the spec-kit graph-metadata/description schemas) asserting required keys, resolvable step refs, and mode↔filename-suffix agreement. | A, L | on-write + PR-time | bypass | grep workflow-schema validator → 0 hits; `speckit/plan.md:11-13` (YAML owns behavior) |
| C4 | **Corpus-wide mutation_class lint.** Machine-checked today on exactly two narrow surfaces (`check-mcp-mutation-class.sh` for the MCP manifest; route-validate E for doctor). Extend the enum check to every command's route/mode table so the Gate-3 read-only/add-only/mutates classification is enforced corpus-wide. | A, gov | on-write + scheduled | bypass | `check-mcp-mutation-class.sh:73-83`; route-validate E |

### Surface 3 — CONTEXT-ENGINEERING (per-turn assembly: prompt assets, injection, hooks, advisor briefs, resource-map)

| # | Feature | Reader | Timing | Floor | Grounding |
|---|---------|--------|--------|-------|-----------|
| X1 | **KEYSTONE: triple-copy trigger-vocabulary coherence.** The intent vocabulary that decides *what context to assemble each turn* exists in three hand-synced copies: CLAUDE.md prose Gate-3 triggers, `gate-3-classifier.ts` `FILE_WRITE_TRIGGERS` (`:67-72`, comment `:9` confirms prose are "human-readable references"), and advisor `prompt-policy.json` `WORK_INTENT_VERBS`. They diverge by design (gate-3 omits `analyze`; policy includes it, `:149-151`) but nothing asserts which divergences are sanctioned. Extend the **shipped `rule-canary-sync` cross-copy pattern** to these three lists with an allow-list for sanctioned deltas. | A, L | on-write + scheduled | bypass | `gate-3-classifier.ts:9,67-72,149-151`; `prompt-policy.json` WORK_INTENT_VERBS; `rule-canary-sync.yml` (proven mechanism) |
| X2 | **Automate the hook-validation playbook.** `skill_advisor_hook_validation.md` is explicitly a *manual* playbook (render parity, threshold-semantics, prompt-safe telemetry, disable-flag rollback). Promote its mechanical assertions to an on-write contract test fired when the hook brief / shared render / threshold contract changes. | A, gov | on-write | bypass | `skill_advisor_hook_validation.md:1-40` |
| X3 | **Template↔renderer placeholder parity.** `renderPromptPack` renders `.md.tmpl` assets; `prompt-pack.vitest.ts` tests the *renderer*, not the *asset content*. Assert every `{placeholder}` in a template is supplied by the renderer and vice-versa, so a renamed placeholder fails on-write, not at runtime. | A, L | on-write | bypass | `deep-loop-runtime/lib/deep-loop/prompt-pack.ts`; `prompt-pack.vitest.ts` |
| X4 | **Resource-map corpus freshness.** `resource_map_present`/coverage is a per-research-packet concept only; no corpus-level check asserts a packet's `resource-map.md` still matches on-disk files. | gov, L | scheduled | bypass | grep `resource_map_present` → packet scope only |
| X5 | **Telemetry→refine loop (the one retrieval-class item).** Feed truncation/never-matched-signal telemetry back as queued doc-refinement actions. Inherits the parent's exact unblock: only a **prod-mode completeRecall@3** read can promote it. | R | scheduled | **pays** | parent truncation law; `confidence-truncation.ts:35` |

> Negative knowledge: `prompt-card-sync.yml` already gates the prompt-craft card layer (sk-prompt / sk-prompt-small-model / cli-*: table inlining, Tier-3 escalation drift, registry/profile completeness). Context-engineering is NOT ungated wholesale; the surgical gaps are X1–X4 only.

## 3. The Most-Automated Architecture

The multiplier is **one standing scheduled corpus sweep** (cron / `workflow_dispatch` / post-merge) — the empirically-empty third tier — running every S/C/X detector in **report → guarded-fix** mode, paired with **pre-commit fast-fail** for the cheap deterministic subset and **CI path-gates** for change-scoped enforcement. This is dq-deep B1+B2 instantiated with this lineage's concrete payload (hub-frontmatter grammar, skill-graph collision, command-router contract, workflow-YAML schema, trigger-vocabulary coherence). The destructive-auto-fix rail carries unchanged: on the authored surface, content-removing fixes stay report-only.

## 4. Cross-Cutting Findings

**The empty cron tier is the spine.** Three timing tiers exist; the scheduled one is empty; it is the only tier that can catch path-filter escapes, backfill blind spots, and cross-surface coherence at once.

**Reuse-first, again — and even more so.** Every keystone is an *extension of shipped machinery*: widen `check-skill-doc-frontmatter.sh` to the hub (S1), generalize `route-validate.py` (C1), extend `rule-canary-sync` to the trigger vocab (X1), run `propagate_enhances`/`advisor_validate` in detect mode (S2/S3/S5). The work is path-scope-widening and target-set extension, not green-field building.

**"Already built but mis-scoped" is the dominant defect shape.** Not "missing" but "scoped to one surface": the frontmatter gate skips the hub; route-validate is doctor-only; rule-canary-sync skips the trigger vocab; the wikilink validator lacks only the instant tier. Each is a one-line scope widening, not a build.

**Two prior-lineage corrections (negative knowledge).** dq-deep B1's "no retroactive automation" premise is false (8 CI workflows). dq-probe F5's "build a skill wikilink validator" is false (already built + CI-wired). Both narrow the program.

## 5. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration |
|----------|-------------------|----------|-----------|
| Treat the DQI scorer as cross-skill-aware | Strictly single-file/single-type by construction | `extract_structure.py:949-972` | 1 |
| Re-spec a skill `[[wikilink]]` validator (dq-probe F5) | Already built, fence-aware, exit-coded, AND CI-wired | `check-links.sh:5,25`; `markdown-link-integrity.yml` | 2, 6 |
| Read `conflicts:[]` empty as no-collision-risk | Ambiguity measured live (0.95 vs 0.92), unpersisted; empty = ungated | `skill-graph.json conflicts:[]`; session hook | 2 |
| Assume command routing is broadly validated | route-validate is doctor-only; 27/28 ungated | `find _routes.yaml` → 1 | 3 |
| Expect a workflow-YAML schema gate | None exists; only asset-existence is checked | empty grep | 3 |
| Assume the three trigger vocabularies auto-sync | Classifier comment confirms prose are hand-maintained | `gate-3-classifier.ts:9` | 4 |
| Treat existing vitest as authored-asset DQ | Tests renderer/profile code, not `.md.tmpl`/policy content | `prompt-pack.vitest.ts` | 4 |
| dq-deep B1 premise: no retroactive automation exists | 8 PR-time CI workflows exist | `.github/workflows/` (8 files, all `on: pull_request`) | 5 |
| Add one monolithic DQ gate | Existing topology proves per-surface path-scoped detectors are the idiom | 8 path-filtered workflows | 5 |
| Treat `rule-canary-sync` as already covering trigger vocab | Covers rule wording; trigger-vocab lists in no workflow/hook | grep `WORK_INTENT_VERBS`/`FILE_WRITE_TRIGGERS` → empty | 6 |
| Treat context-engineering as ungated wholesale | `prompt-card-sync.yml` already gates the prompt-craft card layer | `prompt-card-sync.yml` | 6 |
| Promote X5 telemetry→refine on eval-mode evidence | Retrieval-class; pays the 3-result floor; needs prod-mode @3 | parent truncation law | 5, 6 |

## 6. Prove-First Caveats

This is a research deliverable; nothing is shipped.

**Confirmed by file:line.** The three timing tiers and the empty cron tier; the hub-exclusion of the frontmatter CI gate; route-validate's doctor-only scope; the triple-copy trigger vocabulary and its hand-sync comment; the two prior-lineage corrections — all confirmed against current files.

**Asserted, not counted.** The "version grammar divergence" is a 20-file census (counted), but the full corpus-wide failure counts for each detector (how many SKILL.md hubs fail grammar, how many commands fail D/E/F, how many trigger-vocab deltas are unsanctioned) are a Stage-0 baseline deferred to a build. Land each detector as a default-off warn-only report first to measure the real band before promoting to blocking.

**Hypothesis-until-prod-measured.** S1–S5, C1–C4, X1–X4 are write-time/adherence/logic and ship on cost. X5 (telemetry→refine) is the sole retrieval-class item and inherits the parent's discipline: a release reviewer reads the prod-mode completeRecall@3 column, never eval-mode at K, before promoting it.

## 7. Convergence Report
- **Stop reason:** converged / all_questions_answered (KQ1–KQ5 resolved with file:line grounding; adversarial pass complete; all findings survived, two sharpened).
- **Total iterations:** 6.
- **Questions answered:** 5/5.
- **newInfoRatio trend:** 0.85 → 0.80 → 0.75 → 0.78 → 0.70 (insight) → 0.30 (verification); rolling-avg last-3 0.59; stop is all-questions-answered, not rolling-average.
- **Quality guards:** source diversity PASS (pre-commit hook, 8 CI workflows, advisor skill-graph + prompt-policy, route-validate, gate-3-classifier, DQI scorer, check-links — independent file:line sources); focus alignment PASS; no-single-weak-source PASS.

## References
- Parent synthesis: `../../research.md` (truncation law); siblings `../dq-deep/research.md` (automation asymmetry), `../dq-probe/research.md` (bifurcation)
- `.git/hooks/pre-commit`; `.github/workflows/{skill-doc-frontmatter,routing-registry-drift,markdown-link-integrity,prompt-card-sync,rule-canary-sync}.yml`
- `.opencode/skills/sk-doc/scripts/extract_structure.py`; `.opencode/skills/system-spec-kit/scripts/rules/check-links.sh`
- `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.json`; `.../data/prompt-policy.default.json`; `.../references/graph/propagate_enhances.md`
- `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts`; `.../references/hooks/skill_advisor_hook_validation.md`
- `.opencode/commands/doctor/scripts/route-validate.py`; `.../scripts/check-mcp-mutation-class.sh`; `.opencode/commands/speckit/plan.md`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/prompt-pack.ts`

(`resource-map.md` not present at init; no coverage gate cited.)
<!-- /ANCHOR:dq-skilldoc-cmd-ctx-index -->
