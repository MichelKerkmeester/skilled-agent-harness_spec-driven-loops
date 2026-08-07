# Command-Surface Improvement Research — Cross-Model Synthesis

> **Packet:** `066-command-surface-benchmark/012-command-improvement-research`
> **Run:** deep-research fan-out, 2 lineages × 5 forced iterations (10 total), `stopPolicy: max-iterations` (convergence telemetry-only).
> **Lineages:** `glm52-max` (cli-opencode / `zai-coding-plan/glm-5.2` / max) · `gpt56-sol-high-fast` (cli-codex / `gpt-5.6-sol` / high / fast).
> **Scope:** research + synthesis only. No shipped runtime touched. Every delta is a candidate proposal for a follow-on remediation packet.
> **This document** reconciles the two lineage syntheses (`lineages/*/research.md`): agreements are strengthened, model-unique findings are flagged, disagreements are noted.

---

<!-- ANCHOR:findings -->

## 1. EXECUTIVE SYNTHESIS

Two independent models, forced to five non-converging iterations each, converged on **one architectural diagnosis**:

> The command canon encodes behavioral truth as **prose duplicated across seven surfaces** — a normative skill, two templates, router prose, workflow YAML, runtime code, mirror wrappers, and benchmark adapters — with **no shared machine-readable contract**, and the validator authors actually run (`validate_document.py --type command`) checks section *presence*, not behavioral *invariants*. So a command can be "canon-shaped" and still contract-incorrect, and it passes.

Both models independently reached the same corrective sequence — **schema/contract first, semantic validation second, generation third, command-local cleanup last** — and both explicitly rejected fixing commands one-by-one, because that repairs instances while leaving the regeneration mechanism intact.

GLM located the **smallest first cut** (the mechanism): frontmatter validation lives in a *separate* entrypoint (`quick_validate.py`) that is **not composed into** `--type command`, so every canon frontmatter rule is a dead letter on the path authors validate against (its keystone **C3.6**). GPT located the **larger target** (the destination): a versioned command contract that every prose surface, mirror, validator, benchmark, and generated router consumes (its **P0 contract**). These are complementary — C3.6 is the cheap unblocker; the contract is where it lands.

---

## 2. CROSS-MODEL AGREEMENT MATRIX (HIGH confidence — found independently by both)

| # | Finding | GLM ref | GPT ref | Shared evidence |
|---|---------|---------|---------|-----------------|
| A1 | **Mandatory input-gate is contradictory / omitted at scale.** The skill demands an immediate input gate; the canonical router template declares a required `argument-hint` and omits the gate. 35 of ~37 commands have no inline gate. Fix = **canonize a router-gate alternative** (presentation input-surface + empty-`$ARGUMENTS` mode routing), NOT 35 inline gates. | KF-1 / C2.1 | F01 (gate-contract-contradiction) | `create-command/SKILL.md:219-240` vs `command_router_template.md:42-51` |
| A2 | **`--type command` checks no behavioral invariants.** Section-presence only; frontmatter/behavioral logic is uncomposed (`quick_validate.py`). All canon frontmatter rules are unenforced on the canonical path. | KF-2 / C3.6 | RQ3 (5 missing deterministic checks) | `validate_document.py:417-515` |
| A3 | **The `doctor` family is a route-manifest argv-router the canon never names.** The 3-variant taxonomy misclassifies it as "direct-dispatch, no workflow YAML" while `doctor/update.md` owns `doctor_update.yaml`. Family→variant map is stale. | KF-3 / C1.4 | F03/F04 (thin-router / implicit family-mode) | `command_router_template.md:108-116`, `doctor/_routes.yaml` |
| A4 | **"Three-runtime parity" is two-runtime.** `.codex/prompts` = 38 synced; `.claude/commands` = **0**. Codex mirror flattens the name and forwards only `$ARGUMENTS`; `$1..$N` parity is promised but unbacked by substitution logic. | KF-4 / C4.2 | F08 (cross-runtime-invocation-gap) | `sync-prompts.cjs`, `.claude/commands` (empty) |
| A5 | **Reference-integrity is unchecked → prose drift.** The `066/011` broken-`DEFAULT_RESOURCE` P0 (router fallback → non-existent file) generalizes: canon Step 13 never requires prose-named guide/asset refs to resolve, and `validate-command-references.cjs` hard-codes create/deep/design (omits speckit/memory/doctor). | KF-5 / C5.1 | F06/F10 (reference-coverage / prose-runtime-drift) | `066/011`, `validate-command-references.cjs:39-46` |
| A6 | **Do NOT add `$1..$N` positionals.** Zero commands use positionals; adding them adds complexity and an unmet promise. Prohibit/don't-advertise until implemented. | C4.4 / eliminated | ruled-out | corpus scan (0 occurrences) |
| A7 | **Do NOT fix command-by-command.** Per-command cleanup before canon enforcement preserves the regeneration defect. Both rank this the primary anti-pattern. | eliminated | eliminated | — |

---

## 3. MODEL-UNIQUE FINDINGS (single-lineage — MEDIUM confidence, worth a verify pass)

**GPT-only (structural / runtime):**
- **F05 — comment-derived route-cycle false positives.** Raw-text route inference treats comments as command edges, producing the 3 reported P0 cycles in the benchmark. **Implication: some of 066's P0 cycle findings are false positives.** Fix = schema-aware executable-edge parsing (parse YAML, traverse only declared dispatch fields). *[SOURCE: 004-command-lane-integration/alignment/alignment-report.md:8-26]*
- **F07 — unfrozen command census.** Sync validates discovered-source-count against generated-mirror-count, so both drift together unnoticed. Fix = an explicit census manifest (canonical path, family, topology, mirror name, provenance).
- **F09 — host/leaf executor role ambiguity in fan-out.** The Codex adapter forbids self-invocation, yet the fan-out runtime can hand a Codex process a `cli-codex` lineage prompt. Needs a `lineageHost` vs `leafExecutor` split + route proof of both roles. *(Directly relevant to this very run's transport.)*

**GLM-only (ergonomics / authoring):**
- **argument-hint budget** — ~20 commands over-budget (speckit/plan 511 chars, deep/research ~750); "hint summarizes, EXECUTION TARGETS enumerates" (`doctor/update.md:42-43` is the positive exemplar).
- **`User request: $ARGUMENTS` raw-echo idiom** in 14 files (all create/* + 3 doctor), copied from a seed, undocumented.
- **loader-gating frontmatter** (`<!-- skill_agent -->`) used by 3 doctor commands, undocumented in canon.
- **subaction-dispatch router** (memory family, `ARGS_PRESENT` + first-token classifier) unnamed in canon.
- **template self-sufficiency invariant (REQ-002):** every canon variant must be authorable from its template alone — today violated for the router-gate alternative, route-manifest topology, loader-gating, and subaction-dispatch, forcing sibling-copy (the root cause of the `$ARGUMENTS` echo drift).

---

## 4. RECONCILED PRIORITIZED BACKLOG

Priority = both-model P0 first; single-model or dependent items follow. Each item names targets + an acceptance criterion. `[both]` / `[gpt]` / `[glm]` marks provenance.

### P0 — Enabler + false-positive fix (do first)
| ID | Delta | Targets | Acceptance criterion | Src |
|----|-------|---------|----------------------|-----|
| **K1** | Compose frontmatter validation into the canonical `--type command` path | `validate_document.py`, `template_rules.json` | A command with a 2000-char description or a bare MCP tool **fails** `--type command` (today it passes) | [glm C3.6] |
| **K2** | Establish a versioned command contract (topology, input+gate owner, execution targets, mode matrix, owned assets, loader reqs, presentation owner, destructive policy, runtime invocation aliases) + fix the required-input contradiction and stale template refs | `create-command/SKILL.md`, `command_router_template.md`, `command_template.md`, new schema under `create-command/assets/` | Both templates validate against the schema; a required input is always router- or target-gated; all six family routers carry a complete contract; no numbered-section pointer or hand-maintained family inventory remains normative | [gpt P0] |
| **K3** | Replace raw-text route inference with executable-edge parsing | `deep-alignment/scripts/adapters/sk-doc-command.cjs`, benchmark route fixtures | Comment-only refs yield **zero** route edges; true direct/subaction/workflow cycles still fail with a path of executable fields | [gpt P0] |

### P1 — Wholesale canon + validator + parity
| ID | Delta | Targets | Acceptance criterion | Src |
|----|-------|---------|----------------------|-----|
| **W1** | Canonize the router-gate alternative + a `gate_obligation` check | `SKILL.md` Step 7, `command_router_template.md`, validator | The 35 router commands are gate-compliant via input-surface + empty-`$ARGUMENTS` routing; dropping the input-surface declaration becomes non-compliant | [both] |
| **W2** | Semantic command validation + independent mutation fixtures (input ownership, target resolution, mode matrix, presentation owner, timeout bounds, confirmation, declared assets) across every inventoried family | `validate_document.py`, `validate-command-references.cjs`, command benchmark fixtures | One mutation fixture fails per invariant; reference coverage reports create/design/speckit/memory/doctor/deep with no hard-coded omissions | [both] |
| **W3** | Freeze the command census explicitly | new census manifest under `create-command/assets/`, `sync-prompts.cjs`, `sk-doc-command.cjs` | Source and mirror cannot drift together; every add/delete/rename/topology change requires an explicit manifest delta | [gpt] |
| **W4** | Normalize cross-runtime invocation + split execution roles (one `{command, mode, arguments, runtime}` record; reject conflicting controls; prohibit `$1..$N` until implemented; `lineageHost` ≠ `leafExecutor`) | `sync-prompts.cjs`, deep-loop dispatch runtime + workflow schemas, canon invocation grammar | Equivalent OpenCode/Codex/Claude invocations produce identical normalized records; same-runtime detached fan-out never self-dispatches; route proof records host+leaf | [both]+[gpt F09] |
| **W5** | Shape-based topology taxonomy incl. the route-manifest argv-router variant; reconcile canon variants ↔ 066 4-topology taxonomy | `command_router_template.md` §3, `SKILL.md` Step 4/11, `066/000` contract | A doctor-shaped command classifies canonically under **both** vocabularies without contradiction | [both] |
| **W6** | Mode-resolution completeness check | `SKILL.md` Step 10, validator/adapter | A workflow-YAML router whose hint lists `:auto` but lacks `_auto.yaml` or an `:auto` EXECUTION TARGETS row flags P1 | [glm C4.3] |

### P2 — Generation, ergonomics, command-local, decisions
| ID | Delta | Targets | Acceptance criterion | Src |
|----|-------|---------|----------------------|-----|
| **G1** | Generate thin routers + shared prose from the contract (input gate, mode table, Owned Assets, Presentation Boundary, execution targets); move workflow protocol/display templates out of deep routers; permit bounded typed exceptions | create-command renderer, all six families after P0/P1 | New workflow routers need zero copied family boilerplate; asset kinds/paths cannot disagree with rendered prose | [both] |
| **G2** | Repair command-local contract mismatches | `deep/research.md` (timeout claim), `memory/save.md` (hint/fallback), create ownership `.txt` labels | New semantic + parity checks pass without exceptions for these known mismatches | [both] |
| **G3** | argument-hint budget (≤140 soft) + "hint summarizes, targets enumerate" | `SKILL.md` Step 6, `command_template.md` §7, validator warn | 20 over-budget hints trim; speckit/plan flagged | [glm] |
| **G4** | Canonize loader-gating frontmatter + existence check; name the subaction-dispatch router; document/deprecate the `User request: $ARGUMENTS` echo; hint↔setup-var binding heuristic; template self-sufficiency invariant | `SKILL.md` Steps 6/9/11, create-quality-control gate | Each named variant authors from its template alone; `skill_agent` citable + agent existence checked; 14 echoes reconciled | [glm] |
| **D1** | Decide Claude command parity explicitly | `SKILL.md`, `sync-prompts.cjs` | Either wire a Claude mirror or re-scope canon/benchmark wording to opencode+codex; the "three-runtime" implication is no longer unmet+unsignaled | [both] |

**Dependency spine:** K1 → K2 → (W1, W2, W5, W6) → G1 → (G2, G3, G4). K3 and W3/W4 are independent of the K1→K2 chain and can run in parallel. D1 is a decision gate, not code.

---

## 5. SEQUENCING RECOMMENDATION

1. **Open the first remediation packet on K1 (C3.6) alone.** It composes two existing validators — small, low-risk, and it unblocks the entire semantic-validation tier. Do not attempt W-tier checks before K1 lands; they are unenforceable on the canonical path until then.
2. **Canonize before enforcing.** For the router-gate alternative (W1) and the route-manifest topology (W5), write the canon rule *first*, then the check. Enforcing an unwritten rule is exactly what produced today's drift.
3. **K3 early and independently.** The comment-derived cycle false positives (GPT F05) mean some 066 P0 cycle findings are not real — fix the parser before acting on those P0s.
4. **Respect the 066 ownership boundary.** No parallel command-lint engine; extend `validate_document.py`, `validate-command-references.cjs`, and (for S-tier structural checks) the 066 adapter. Keep prose-level detection in the lighter validator layer per `066/spec.md:158`.
5. **Resolve D1 before W4 wording.** Cross-runtime normalization shouldn't encode a Claude mirror that may never exist.

---

## 6. RUN PROVENANCE (forced non-convergence — verified)

- **Iterations:** both lineages completed **5/5** (`iterations/iteration-001..005.md` in each); 10 total.
- **Stop reason:** `maxIterationsReached` on both — not convergence.
- **Non-convergence proof:** GPT new-info ratios 0.88 → 0.76 → 0.82 → 0.70 → **0.52**, explicitly *"treated as telemetry, not an early-stop condition."* GLM ratios 1.0 → 0.7 → 0.75 → 0.8 → 0.6 (avg 0.77, no early stop).
- **Route proof:** GPT — `target_agent=deep-research, mode=research` on all 5 iteration records; GLM — `mode=research` (smaller-model state schema).
- **Data-quality note:** GLM state records carry cosmetic timestamp anomalies (UTC-labeled local-ish times); a `stall_detected` heartbeat gap on the GPT lineage did not truncate it (5/5 completed). Neither affects findings content.

---

## 7. OPEN QUESTIONS (for the follow-on remediation packet)

- Is the router-gate alternative (W1) a P0 or P1 promotion, given 35 commands rely on the prose form today? (May need a migration window.)
- Is Claude command parity (D1) intended at all, or should the canon formally scope to opencode+codex?
- Should the route-manifest argv-router variant (W5) carry its own blocking core beyond OWNED ASSETS + PRESENTATION BOUNDARY?
- Which P2 heuristic checks (G3/G4) need a curated allowlist before promotion, once K1 surfaces their true noise level?
- **GPT contract-design details remain candidates** until current OpenCode/Claude loaders are tested for tolerated frontmatter placement — a sidecar schema avoids relying on unverified frontmatter behavior.

---

## 8. ASSET LAYER (YAML + `.txt`) — FOCUSED DETAIL

> This section pulls the asset-layer findings into one place. A dedicated second research pass (`014-command-asset-layer-research`, GPT-5.6-Sol xhigh/fast + GLM-5.2 max) deepens these into contract-ready detail.

**What the assets are.** Every workflow-style command owns a triad: `<name>_auto.yaml` (auto-mode workflow) + `<name>_confirm.yaml` (confirm-mode workflow) + `<name>_presentation.txt` (display/menu text). This triad repeats across `create/*`, `deep/*`, `design/*`, `speckit/*`. Two families break it on purpose: `doctor/*` uses `_routes.yaml` + per-route YAMLs (e.g. `doctor_update.yaml`) with no triad; `memory/*` has only `*_presentation.txt` and dispatches by sub-action.

**The strength.** The asset *structure* — the `OWNED ASSETS` + `PRESENTATION BOUNDARY` router sections that declare and fence these files — is the single most consistent layer: present in **35/35** commands, and the one place canon + validator + corpus agree. Build on it; do not rebuild it.

**The six asset-layer defects:**

| # | Defect | Effect | Backlog item |
|---|--------|--------|--------------|
| AL1 | Mode-completeness unchecked | A command can advertise `:auto`, be missing `_auto.yaml`, and pass (adapter checks *reachability*, not *completeness*) | W6 |
| AL2 | Mode-default policy invisible | Legit family differences (create→confirm, design→auto, speckit→explicit) live only in prose | K2 (mode matrix) |
| AL3 | Presentation ownership has no typed form | No way to mark an intentional inline-presentation exception (`memory/search`), so a blunt leak-blocker would wrongly flag it — both models ruled the blunt blocker out | K2 (typed exceptions) |
| AL4 | YAML comments misread as route edges | Raw-text parsing of `_auto.yaml`/`_routes.yaml` treats comments as dispatch → the 3 benchmark "P0 cycles" are likely false | K3 |
| AL5 | doctor route-manifest shape unnamed | Template says doctor is "direct-dispatch, no workflow YAML" while `doctor/update` owns `doctor_update.yaml` | W5 |
| AL6 | Some `.txt` ownership labels wrong | Command-local mislabels of who owns the presentation asset | G2 |

**What changes for these files (nothing deleted):**
1. **K3** — parse the YAMLs structurally so comments stop registering as cycles (no asset edits).
2. **K2** — record, per command, its mode default, owned `_auto`/`_confirm` YAMLs, presentation-`.txt` owner, and any *intentional* presentation exception — moving that truth out of prose into the machine contract.
3. **W6** — new check: every declared mode must have its YAML **and** an EXECUTION TARGETS row, or it fails.
4. **W5** — name doctor's route-manifest YAML shape in the taxonomy so it stops being misclassified.
5. **G1** — later, render the OWNED ASSETS / PRESENTATION BOUNDARY / mode tables *from the contract*, and move overgrown display/workflow blocks out of the `deep/*` routers into their proper asset files.
6. **G2** — fix the mislabeled `.txt` owners.

The `_auto.yaml` / `_confirm.yaml` / `_presentation.txt` triad is the validated-good foundation. The work is: stop *misreading* the YAMLs, start *checking* that declared modes are fully wired, record mode-default + presentation-ownership in the contract instead of prose, and eventually generate the asset tables from that contract so they can't drift.

<!-- /ANCHOR:findings -->
