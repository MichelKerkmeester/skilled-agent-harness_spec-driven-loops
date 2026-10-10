---
title: "Research round three: the sk-code shared layer, sk-code-review, and the hub's remaining surfaces"
description: "Third-round deep research over the sk-code hub: the shared layer and its loaders against the repo rules; sk-code-review as a codebase-agnostic mode and its agent; and a fresh pass over the remaining modes, hub files, benchmark and playbooks. Seventy-three findings across twenty iterations, classified NEW, ALREADY-COVERED, ALREADY-ADOPTED or IN-FLIGHT, with a ranked findings table and proposed implementation phases."
trigger_phrases:
  - "sk-code round three research"
  - "shared layer audit"
  - "sk-code-review agnosticism"
  - "hub pointer drift"
  - "r3-dsflash-llmgw synthesis"
importance_tier: "important"
contextType: "research"
---

# Research round three: the sk-code shared layer, sk-code-review, and the hub's remaining surfaces

A detached fan-out lineage (`r3-dsflash-llmgw`, executor `cli-pi`, model `deepseek-v4.1-flash`, effort `max`) ran twenty iterations over rounds one and two as fixed context. The run's premise: rounds one and two settled Ponytail adoption, the agent definitions, the repo rules and the hub vocabulary; round three takes a fresh, adversarial pass over three surfaces instead — the shared layer and its loaders, the review mode and its agent as a codebase-agnostic contract, and every remaining hub file. Phase 009 was in flight and its five items were excluded.

---

## 1. Executive Summary

The machine surfaces of the hub check out. Every guard this run executed passed: the router-sync guard's four wired legs (4/4, exit 0), the Webflow runtime checker on both fixture pairs (4/4 fail and 2/2 pass with true exit codes), the hub's check-5k legs recomputed by hand (aliases, packet names, canary routes), the version parity across all five hub artifacts and every packet-to-changelog pair, and the playbook ID sets of both the hub (31/31) and the review packet (27/27). The three parts' defects live almost entirely in prose that no guard reads.

The eight P1 findings:

1. The shared layer duplicates two Webflow pattern assets with drifted content, and both copies are reachable from the routed map (f-iter001-001).
2. Eight of thirteen shared markdown files route readers through pre-merge directory families that no longer exist (f-iter002-001).
3. `phase-detection.md` describes two surfaces and one verification command where the hub has three surfaces and a three-guard umbrella (f-iter002-002).
4. `workflow-verify.md` carries a `validate.sh` contract that the validating document explicitly refutes (f-iter003-001).
5. The review mode's private detector misroutes generic repositories to the Webflow surface, reproduced on three foreign inputs (f-iter006-001).
6. The review mode has no Obsidian surface anywhere, while the hub bundles Obsidian evidence into reviews (f-iter006-002).
7. The findings checker cannot see the finding shape its own doctrine prescribes, so that shape passes vacuously (f-iter010-001).
8. The quality mode, which owns the comment-hygiene gate, points operators at the legacy hooks — and the shared standard repeats the same names (f-iter012-001).

The cross-cutting result: every cluster this run found is pointer or claim drift from a rename or restructure that updated the machine surfaces and missed the prose citing them. Six stale-path clusters, four rename-miss clusters (21–39 rows per packet), six two-surface prose instances, two hook-name statements, one load-tier overclaim, one dual taxonomy ownership, and a handful of per-file inventory splits. The first original idea below answers the class: a documentation path-, name- and claim-checker, distinct from the router's path checks.

---

## 2. Scope and Method

Three parts, as dispatched:

- **Part 1 — the shared layer.** Every file under `.skilled/skills/sk-code/shared/`, its loaders (`SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`), its use by the modes and surfaces, its consistency, and its relationship to `.skilled/repo-rules/*.md`, `REPO RULES.md` and `AGENTS.md`.
- **Part 2 — sk-code-review.** The mode's agnosticism, its internal agreement, its scripts' behaviour on crafted inputs, its playbook, and `.skilled/agents/review.md` against the mode.
- **Part 3 — the rest.** `sk-code-quality`, `sk-code-webflow`, `sk-code-opencode`, `sk-code-obsidian`, the six hub files, `benchmark/`, `feature-catalog/` and the playbooks.

Method: read rounds one and two first (packet `research/research.md` sections 1–17 and its Round 2 section; the r2 lineage report), treat every phase-009 item as out of scope, then widen each iteration to a focus no earlier iteration covered. Every claim cites `path:line` as the file read at that moment. Every defect carries a reproducing case: a command, an executed pseudocode run, or crafted input with observed output. Defects were reproduced by running the repo's read-only checkers and by re-implementing the documented pseudocode; no repo tooling was invoked that writes, and every artifact this run produced is inside this lineage directory.

---

## 3. Provenance

- **Lineage:** `r3-dsflash-llmgw`, session `fanout-r3-dsflash-llmgw-1791620340322-xkjyb6`.
- **Executor:** `cli-pi`, model `deepseek-v4.1-flash`, reasoning effort `max` (invocation metadata recorded in this directory).
- **Iterations:** 20 of 20, each with an iteration narrative, a delta file and one canonical record through the append gateway. Observed receipts: ledger sequences 2–21, all `ok: true`, projection refreshed each time.
- **Stop policy:** `max-iterations`; convergence never claimed (ratio range 0.70–0.90, mean 0.83, far above the 0.05 threshold).
- **Write boundary:** every artifact under this lineage directory; parent-packet writeback deferred by the detached boundary. No file outside the lineage was created or modified; scratch review outputs for the checker runs live under `scratch/` in this directory.
- **Mid-run change (steer ruling 3):** `sk-code-quality/SKILL.md` moved from 1.0.1.0 to 1.1.0.0 with a matching changelog while this run was live (phase 009 child 002 landing). The affected finding's line numbers were refreshed; the finding itself (legacy hook names) is unchanged.

---

## 4. Part 1 — The Shared Layer and Its Loaders

**How it loads.** The hub routes by `mode-registry.json`; each mode or surface packet loads its own `SKILL.md`; `ROUTER.md` §11 owns the stage-two machine map (`DEFAULT_RESOURCE`, `RESOURCE_MAP`, `SHARED_CONTROL_RESOURCES`); `hub-router.json` owns stage-one vocabulary and the zero-signal `shared/README.md` fallback. The workflow trio is symlinked into all three surfaces — verified as real symlinks, not forks. No shared file is loaded twice on a scored route.

**What is wrong.** (a) The shared `assets/patterns/` copies of `validation-patterns.js` and `wait-patterns.js` duplicate the Webflow packet's copies with drifted bytes, and both READMEs are routed under `IMPLEMENTATION` (f-iter001-001). (b) Eight of the thirteen shared reference files route readers through `references/webflow/…`, `references/opencode/…`, `references/motion_dev/…`, `assets/webflow/…` and `assets/universal/…` families that do not exist anywhere in the hub (f-iter002-001). (c) `phase-detection.md` still describes "both supported surfaces" and names one verification script where the live gate is a three-guard umbrella (f-iter002-002). (d) `workflow-verify.md`'s `validate.sh` warning claim contradicts `validation-rules.md`, the document that owns that meaning and says copies elsewhere go stale (f-iter003-001). (e) The shared workflow trio restates the repo rules' floors with no pointer either way; today they agree in substance, but the same class already diverged once (f-iter003-002). (f) The shared doctrine carries "OpenCode Surface Only" subsections while the hub's purity rule says shared material must not gain them (f-iter003-003). (g) Three overlapping exemption lists disagree about hub-level shared controls (f-iter001-003). (h) The surfaces cap comment quantity at 5 and 3 per ten lines respectively with no universal owner and no checker (f-iter004-001, f-iter005-001).

**What holds.** The seven-rung ladder and its workflow summary agree rung for rung; the precedence order is identical in all three places that state it; the `AGENTS.md` restraint-table pointer and the `ceiling-report.sh` endpoint resolve; the shared-tier cross-links are otherwise clean.

---

## 5. Part 2 — sk-code-review and the Review Agent

**How agnostic it really is.** Not as agnostic as its name. Its `detect_surface_evidence` reads this repository's layout (`.skilled/`, `.opencode/`) and promotes any `package.json` or `src/` path to the Webflow surface, reproduced on three foreign inputs; the shared authority says generic Node stays UNKNOWN (f-iter006-001). It has no Obsidian branch, token or template while the hub routes Obsidian reviews (f-iter006-002). Its M-1 cache writes into a `.skilled/` brand directory inside whatever repo it reviews (f-iter007-001). Its documents never reference the shared layer, leaving two authorities for surface identity, while its canary pins two shared files (f-iter011-001).

**Internal agreement.** The doctrine files and the SKILL agree on the finding schema, numbering, workload note, precedence and M-1/M-2 contracts. The disagreements are: a removal plan that redefines `P0/P1/P2` for removal urgency under the severity tokens (f-iter008-001); two near-identical status vocabularies with a third variant in the canonical README example (f-iter007-003, f-iter019-002); two documents claiming the deep-review taxonomy without a reconciliation rule (f-iter007-002); a playbook ID space that claims a nonexistent CR-019 (f-iter009-001); and a validator that runs the playbook under README rules (f-iter009-002).

**Scripts.** The final-line checker reproduces its documented rules exactly. The findings checker does not: the `review-core.md` heading shape exits "OK: no numbered findings to check", so half the documented format passes vacuously (f-iter010-001); a double space after `Not checked:` is rejected with a message claiming the line is absent (f-iter010-002). The agent, its Claude fork and all generated mirrors agree with the mode.

**Strengthening set.** Give the findings checker the second shape; route detection through the shared contract; add the Obsidian token; build a review-output shape fixture; extend the canary's exact-string set (f-iter011-002).

---

## 6. Part 3 — The Remaining Modes, Hub Files and Tooling

- **sk-code-quality:** names the legacy hooks as the live comment-hygiene gates, and the shared standard repeats them (f-iter012-001); 39 pre-rename rows (f-iter012-002); its README misroutes spec folders to a checklist family that lacks one (f-iter020-001). The ceiling report listed by phase 009 mid-run; all its other resource paths resolve.
- **sk-code-webflow:** shipped templates carry nine legacy-path rows (f-iter013-001); two broken section pointers in the HTML guide (f-iter013-002, f-iter013-003); the D1 fixtures run to their documented verdicts, closing round one's residual.
- **sk-code-opencode:** its SKILL credits the wired leg 1a with the unwired leg 1b's orphan coverage (f-iter014-001); two rename-miss rows (f-iter014-002); the guard, hook paths and version pairing all check out.
- **sk-code-obsidian:** three phantom on-demand assets the packet's own playbook already flags (f-iter015-001); the playbook ID space is exact (27/27) and the version pairing holds.
- **Hub files:** `description.json`'s prose omits Obsidian (f-iter016-001); `ROUTER.md`'s universal-tier load claim overstates what the machine map emits (f-iter016-002); the feature catalog repeats the two-surface prose with old mode names (f-iter017-001); the layout tree omits six existing hub-root artifacts (f-iter017-002); the hub README repeats the two-surface prose against its own five-packet count and lags three versions (f-iter018-001, f-iter018-002). Version parity across the five hub artifacts, check-5k's legs, the canary coverage and the graph's Obsidian entries all hold.
- **Tooling:** `benchmark/README.md` and the CI successor match the restored guard; the root playbook ID space is exact (31/31); the review README's folder convention contradicts its own SKILL (f-iter019-001) and its example uses a third status-token variant (f-iter019-002).

---

## 7. Cross-Cutting Root Cause

Every cluster is pointer or claim drift after a rename or restructure. The machine surfaces — routers, manifests, guards, compiled fixtures — were updated each time and all verify; the prose citing them was not, and no checker reads prose claims. Six stale-path clusters, four rename-miss clusters (21, 39, 21 and 2 rows plus six shared-file headers), six two-surface prose instances, two hook-name statements, one load-tier overclaim, one taxonomy-ownership claim, two broken section pointers, three phantom assets, one wrong version, one layout omission, one wrong folder convention, one wrong validator rule set. The proposal that answers the class is idea (a) below: one documentation path-, name- and claim-checker for skill docs, run like the rule-copy canary.

---

## 8. Original Ideas and Rejected Ideas

### 8.1 Original ideas, ranked by proof value

| # | Idea | Why it ranks here |
|---|---|---|
| 1 | **Documentation path-, name- and claim-checker for skill docs** | Catches all 27+ drift instances this run found in one guard; distinct from the router's path checks; the rule-copy canary already proves the pattern (f-iter020-003) |
| 2 | **One declared shared-controls source** consumed by `ROUTER.md`, the router guard and the `SKILL.md` sentence | Ends the three-list disagreement (f-iter001-003) without inventing an include system |
| 3 | **Review-output shape fixture** feeding both documented finding shapes through both checkers | Turns the vacuous-pass defect into a regression the suite owns (f-iter010-001, f-iter011-002) |
| 4 | **Route the review detector through the shared detection contract** (or derive its markers from §2) | Removes the second authority; enables the Obsidian token fix (f-iter006-001, f-iter011-001) |
| 5 | **One canonical surface-list sentence**, or a lint that flags the two-surface phrasing | Six instances share one fix (f-iter004-003, f-iter016-001, f-iter017-001, f-iter018-001) |
| 6 | **Load-tier claims check** comparing prose tier claims against the machine `RESOURCE_MAP` | Prevents a repeat of the universal-tier overclaim (f-iter016-002) |
| 7 | **Extend hub version parity to the README and packet changelogs** | The README lag and the packet pairs show the pairing is close but not enforced (f-iter018-002) |

### 8.2 Rejected ideas

| Idea | Reason |
|---|---|
| Rename the removal plan's `P0/P1/P2` to a distinct scale | Breaks the shared triage vocabulary the mode's output uses; a disambiguating sentence is enough (f-iter008-001) |
| An include system for the repeated surface prose | Heavier than the lint it replaces; skills are single files by design (f-iter018-001) |
| Per-file playbook validation | Operator decision already recorded; the validator's root-only sweep is the documented contract (f-iter009-002) |
| Reviving the retired Lane C benchmark lane | Round one's rejection stands; the canary corpus is the harness (round one §15) |
| Editing the legacy compatibility hook files | They are documented direct-test helpers, not live gates; the docs naming them are the defect (f-iter012-001) |
| Adding a second plain-English review contract | Repo-wide rules own prose; duplication drifts (round two §6) |
| Accepting both review finding shapes silently without a fixture | The vacuous pass would persist unproven; the fixture is the point (f-iter010-001) |

---

## 9. Ranked Findings Table (grouped by part)

Priority order within each part; classification per the dispatched vocabulary. `N` = NEW, `IF` = IN-FLIGHT, `AA` = ALREADY-ADOPTED (listed separately in §10).

### Part 1 — the shared layer

| # | Finding | Target file | Class | Pri | Rationale |
|---|---|---|---|---|---|
| 1 | Shared duplicates two Webflow pattern assets with drifted bytes; both routed | `shared/assets/patterns/`, `ROUTER.md:382,384` | N | P1 | Two sources for one shipped pattern set; the shared copy lags the Motion reference (f-iter001-001) |
| 2 | Eight of thirteen shared files cite pre-merge directory families that do not exist | shared references (7 files) | N | P1 | Every route that opens these files follows dead pointers (f-iter002-001) |
| 3 | `phase-detection.md` describes two surfaces and one verifier | `shared/references/phase-detection.md` | N | P1 | A DEFAULT_RESOURCE entry that no longer matches the surface set (f-iter002-002) |
| 4 | `workflow-verify.md`'s `validate.sh` warning claim contradicts the owning document | `shared/references/workflow-verify.md:86` | N | P1 | Wrong exit-contract guidance on every OpenCode verify route (f-iter003-001) |
| 5 | Shared workflow floors duplicate repo rules with no pointer, after one divergence | workflow trio ↔ repo rules | N | P2 | Future edits diverge unseen; pointers close the class (f-iter003-002) |
| 6 | Surface-conditioned subsections inside the supposedly surface-agnostic tier | workflow-implement/-verify | N | P2 | Hub purity rule and file content disagree (f-iter003-003) |
| 7 | Comment budget 3-per-10 exists on one surface, 5-per-10 on the other, neither universal | OpenCode + Webflow style guides | N | P2 | Same file shape judged differently by route; no owner, no gate (f-iter004-001, f-iter005-001) |
| 8 | Override inventory close: only the budgets diverge; rest are additions or pointers | Part 1 inventory | N | P2 | Closing statement; prevents re-opening (f-iter005-004) |
| 9 | Three exemption lists disagree about hub-level shared controls | `ROUTER.md:583-596`, guard allowlists | N | P2 | A validator treating the declaration as exhaustive would reject a correct file (f-iter001-003) |
| 10 | `shared/README.md` omits Obsidian and uses pre-rename keys | `shared/README.md:17` | N | P2 | The shared front door's only consumer list is stale (f-iter001-002) |
| 11 | Intra-shared cross-links use three forms for the same directory | shared references | N | P2 | Same resolver class as #2; one link checker catches both (f-iter002-003) |
| 12 | No OBSIDIAN-versus-WEBFLOW collision case in detection tests or the canary | `stack-detection.md` §4, canary fixture | N | P2 | The one precedence decision with no test; a wrong order routes silently (f-iter004-004) |
| 13 | Stale link labels in two surface shared-tier files | Webflow/OpenCode shared refs | N | P2 | Copied labels land outside the skill (f-iter004-005, f-iter005-002) |

### Part 2 — sk-code-review

| # | Finding | Target file | Class | Pri | Rationale |
|---|---|---|---|---|---|
| 1 | Private detector misroutes generic repos to Webflow; reproduced on three inputs | `sk-code-review/SKILL.md:220-230` | N | P1 | The mode's central agnostic claim; foreign repos are the normal input (f-iter006-001) |
| 2 | No Obsidian surface anywhere while the hub bundles it into reviews | review SKILL/references | N | P1 | A whole surface is invisible to the mode and its output contract (f-iter006-002) |
| 3 | Findings checker cannot see `review-core.md`'s own shape; passes vacuously | `scripts/check-review-findings.js` | N | P1 | Half the documented format skips the checker built for it (f-iter010-001) |
| 4 | M-1 cache writes a brand directory into any reviewed repo | review SKILL:491, pr-state-dedup | N | P2 | Documented side effect on foreign repositories (f-iter007-001) |
| 5 | Two documents claim the deep-review taxonomy; no reconciliation rule | `review-core.md:18` ↔ contract YAML | N | P2 | Disagreements have no winner; the contract is an external consumer (f-iter007-002) |
| 6 | Two status vocabularies plus a third variant in the canonical example | UX ref, README:72, SKILL:337 | N | P2 | Exact-string contract with three spellings in live docs (f-iter007-003, f-iter019-002) |
| 7 | Removal plan redefines `P0/P1/P2` for urgency under the severity tokens | `assets/removal-plan.md:36-38` | N | P2 | One report can carry two meanings of `P0` (f-iter008-001) |
| 8 | Playbook ID space claims CR-019, which does not exist | review playbook index:152 | N | P2 | Ledger rows can cite a nonexistent scenario (f-iter009-001) |
| 9 | Playbook validates under README rules, not a playbook rule set | `SKILL.md:473`, validator | N | P2 | The structural gate never applies the playbook model (f-iter009-002) |
| 10 | Double space after `Not checked:` → message claims the line is absent | `check-review-final-line.js:81` | N | P2 | Strictness beyond its README with a misleading failure (f-iter010-002) |
| 11 | Mode docs never reference the shared layer; two authorities for detection | review packet | N | P2 | Structural statement behind the detector defect; declares the fork or removes it (f-iter011-001) |
| 12 | README documents a forbidden playbook folder convention | `sk-code-review/README.md:203` | N | P2 | Operator follows a folder shape the SKILL forbids (f-iter019-001) |
| 13 | README carries 21 pre-rename rows | `sk-code-review/README.md` | N | P2 | Fourth packet in the rename-miss family (f-iter019-003) |
| 14 | Strengthening proposals (checker shape, shared detection, Obsidian token, fixture, canary set) | review packet | N | P2 | The part's forward plan, ranked by proof value (f-iter011-002) |

### Part 3 — the other modes, hub files and tooling

| # | Finding | Target file | Class | Pri | Rationale |
|---|---|---|---|---|---|
| 1 | Quality mode names legacy hooks as the live gates; shared standard repeats it | quality SKILL:132-133, universal standard | N | P1 | The gate that allegedly blocks a commit may not be the gate that runs (f-iter012-001) |
| 2 | 39 pre-rename rows in the quality SKILL | `sk-code-quality/SKILL.md` | N | P2 | Largest rename-miss surface; one sweep fixes all four packets (f-iter012-002) |
| 3 | Nine legacy-path rows in shipped Webflow templates | `sk-code-webflow/assets/templates/` | N | P2 | Dead pointers travel into adopter projects (f-iter013-001) |
| 4 | Two broken section pointers in the HTML style guide | `references/html/style-guide.md:78,103` | N | P2 | Cross-file and renumbered targets after the reference split (f-iter013-002/003) |
| 5 | OpenCode SKILL credits leg 1a with leg 1b's orphan coverage | `sk-code-opencode/SKILL.md:173` | N | P2 | An audit of orphan coverage reads as covered when it is not (f-iter014-001) |
| 6 | Two rename-miss rows in the OpenCode SKILL | `sk-code-opencode/SKILL.md:24,54` | N | P2 | Third packet in the family (f-iter014-002) |
| 7 | Obsidian SKILL lists three phantom assets its own playbook flags | `sk-code-obsidian/SKILL.md:232-235` | N | P2 | On-demand offer that resolves to nothing; manifest already omits them (f-iter015-001) |
| 8 | `description.json` prose omits Obsidian while keywords include it | `description.json:3` | N | P2 | The advisor-visible line is two surfaces behind (f-iter016-001) |
| 9 | `ROUTER.md` universal-tier load claim overstates the machine map | `ROUTER.md:604,111` | N | P2 | Prose tier claims vs emitted entries; a performance route gets one file, not four (f-iter016-002) |
| 10 | Feature catalog repeats two-surface prose with old mode names | `feature-catalog/` | N | P2 | The hub's own capability inventory is stale (f-iter017-001) |
| 11 | Layout tree omits six existing hub-root artifacts | `SKILL.md:144` | N | P2 | `leaf-manifest.json` and the playbooks are load-bearing and invisible in it (f-iter017-002) |
| 12 | Hub README repeats two-surface prose against its own five-packet count | `README.md:23,55,89,105,135` | N | P2 | Self-contradicting front page (f-iter018-001) |
| 13 | Hub README version lags by three increments, unexplained | `README.md:8` | N | P2 | Either include it in the parity set or exempt it (f-iter018-002) |
| 14 | Quality README routes spec folders to a family without one | `sk-code-quality/README.md:50,87,129` | N | P2 | The SKILL routes this target to system-spec-kit; the README does not (f-iter020-001) |

### Cross-cutting

| # | Finding | Target | Class | Pri | Rationale |
|---|---|---|---|---|---|
| 1 | All clusters share pointer/claim drift; no checker reads prose | run-wide | N | P2 | The single root cause behind 27+ instances; idea (a) answers it (f-iter020-003) |
| 2 | Aggregate roll-up: 73 findings, NEW 50 / AA 18 / IF 3 / obs 2; P1 8, P2 65 | lineage deltas | N | P2 | Synthesis input inventory (f-iter020-002) |
| 3 | Original ideas and rejections inventory | run-wide | N | P2 | The ranked idea set and reasoned rejections (f-iter019-004) |

### IN-FLIGHT (phase 009 scope; recorded, no budget spent)

| Finding | Phase 009 item |
|---|---|
| Nine docs unrouted in router-sync leg 1b (workflow-debug/implement/verify + six Obsidian refs) | child 001 (f-iter012-003 context) |
| Quality SKILL ceiling-report listing + version bump | child 002 — observed landed mid-run (f-iter018-003) |
| Deep-review reproducing-case rule | child 003 |
| AGENTS.md pointer replacement | child 004 |
| Remaining hook stdin deadlines | child 005 |

---

## 10. Verified and Adopted (no action)

Eighteen ALREADY-ADOPTED check rows, each an observed or source-verified confirmation, recorded so they are not re-opened: the workflow trio's real symlinks and hub version parity (f-iter001-004); precedence, `AGENTS.md` pointer and ceiling endpoint (f-iter002-004); ladder-summary and repo-rule pair agreement (f-iter003-004); ladder/coverage and round-008 review doctrine (f-iter003-004 context, f-iter006-004); folder/test single-sourcing and P0 restatements (f-iter005-003); reference/contract agreement matrix (f-iter007-004); finding-class vocabulary and agent/fork/mirror parity (f-iter008-002/003); playbook catalog and resource agreement (f-iter009-003); final-line checker against its README (f-iter010-003); self-containment and canary pins (f-iter011-003); quality resource paths (f-iter012-004); Webflow path sweep and D1 fixture verdicts (f-iter013-004); guard pass, hook paths, script counts and packet version pairs (f-iter014-003); Obsidian ID parity and version pairing (f-iter015-002/003); check-5k legs, version parity and graph coverage (f-iter016-003); root-playbook ID parity, CI successor and benchmark rows (f-iter017-003); the mid-run quality landing (f-iter018-003); the refutation pass confirming four earliest premises (f-iter018-004).

---

## 11. Evidence Limits and Confidence

- **High confidence:** every P1 row (each reproduced or source-contradicted with both sides read), the aggregate tallies (computed from the delta files), the guard/checker executions (output and exit status read without a pipeline), and the version/ID set comparisons.
- **Medium:** the review mode's foreign-repository behaviour comes from executing its documented pseudocode, not its native runtime; the party that dispatches reviews may add context the pseudocode does not model.
- **Not verified:** the Obsidian packet's migration counts (they describe the plugin repository, outside readable scope); the live hook selection depends on the reader's `core.hooksPath` (observed locally, but the statement ownership is what is filed).
- **Mid-run movement:** the quality packet changed while the run was live; affected line numbers were refreshed at iteration 18 and the synthesis's cites reflect the latest read where re-read.
- **Unmeasured:** no performance or size claim is made anywhere in this report.

---

## 12. Convergence Report

- **Stop reason:** `maxIterationsReached` — the cap (20/20) governs; convergence was telemetry only.
- **Iterations:** 20 of 20, 73 findings (per-iteration counts 4,4,4,5,4,4,4,3,3,3,3,4,4,4,3,3,3,4,4,3).
- **newInfoRatio:** 0.70–0.90, mean 0.83. Never approached 0.05; no legal stop was claimed at any point.
- **Key questions:** all ten addressed; five ticked by exact reducer match (the loading/inventory question, the detection/override question, the review-agnosticism question, the script-behaviour question, and the closing ideas question), with the remainder answered in substance by the part-level passes and recorded in the strategy's carried-forward notes.
- **Classifications:** NEW 50, ALREADY-ADOPTED 18, IN-FLIGHT 3, observations 2. Severity: P1 8, P2 65.
- **Reducer state:** gateway receipts observed for every iteration (ledger sequences 2–21, all `ok: true` with `projectionRefreshed: true`); strategy, registry and dashboard for this lineage are written by this synthesis and its companions.
- **Write boundary:** every artifact under this lineage; parent-packet writeback deferred by the detached boundary.

---

## 13. Proposed Implementation Phases

Phase numbers continue the parent packet after 009. Each is a child of `specs/sk-code/011-sk-code-poinytail-based-refinement/`.

1. **010: Documentation consistency sweep.** One pass over every cluster in §9: legacy path families (shared tier, Webflow templates, enforcement labels), rename-miss names (four packets), two-surface prose (six instances), hook naming (quality SKILL + universal standard), layout/version/description/folder rows, phantom Obsidian assets, broken section pointers, and review README rows. Adds idea (a) — the documentation path/name/claim checker — as the regression guard, modeled on the rule-copy canary. Exit: the checker passes over the tree; every cited cluster's reproducing case flips.
2. **011: Review contract hardening.** Findings-checker shape coverage; one status-vocabulary source (assessment and final-line) with the README example fixed; detector routed through the shared contract; Obsidian token and branch; the review-output shape fixture; README folder convention. Exit: the fixture grades both documented shapes; the detector passes the foreign-input cases; the canary's exact strings remain green.
3. **012: Shared-layer source-of-truth repairs.** De-duplicate the pattern assets with a pointer; single shared-controls source; fix `workflow-verify.md`'s `validate.sh` paragraph against `validation-rules.md`; align `ROUTER.md`'s load claims with the map or the map with the claims; refresh `phase-detection.md` for three surfaces and the guard umbrella; resolve the comment-budget ownership question. Exit: the shared tier's links resolve; the load-tier claims match the machine map; the ladder and precedence stay green.
4. **013: Guards and claims alignment.** OpenCode SKILL leg-1a/leg-1b wording; the OBSIDIAN-versus-WEBFLOW collision case in the canary; extend version parity to the README and packet changelogs; the load-tier claims check. Exit: each guard's description matches its behaviour; the new cases fail before their fixes and pass after.
5. **Deferred.** Anything requiring the plugin repository or a live runtime (Obsidian migration counts, live review dispatch behaviour); each waits for its consumer.

---

## 14. References

- Round one synthesis: `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md`
- Round two lineage: `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r2-dsflash-llmgw/research.md`
- This lineage's iterations: `iterations/iteration-001.md` … `iteration-020.md`; deltas: `deltas/iter-001.jsonl` … `iter-020.jsonl`
- Lead steer: `steer.md`; config: `deep-research-config.json`; state: `deep-research-state.jsonl`
- Phase 009 scope: `specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/spec.md`
