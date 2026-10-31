# Iteration 002 — glm-02: The smallest `cli-classifier` hub

- **Lineage:** `glm` · session `fanout-glm-1790490452777-942a1f` · 2026-09-27
- **Wave:** W2 (cross-read, then push past) · **Maps to:** G, A · **Timestamp (research):** 2026-09-27T06:52:00Z

## Focus

Angle `glm-02` (research-angles.md:518-532): the parent requires a `cli-classifier` hub holding `cli-jev` (moved) and `cli-deem` (new) — what is the least it must contain to pass the parent-hub checks (counted), which sibling proposals exceed it, is moving `cli-jev` worth the blast radius now, which sibling proposal is a wrapper that only forwards arguments, and what shape would I ship with its kill criterion. Section 7 refinement (research-angles.md:898) applies where a named sibling angle has not landed.

## STEER

Still no `steer.md` in this lineage (verified again this iteration). Section 7 refinements for this angle: the `glm-03, glm-04` row does not bind here; `glm (all)` (Q7/Q9/Q10/Q12) was stated in it.001. Angle/refinement conflict: none.

## Sibling check (every named file; missing targets recorded)

- `grok/iterations/iteration-010.md` (their it.10, newest) — read: their one-phase verdict (R19's census, "not a judgment arm and not a new client"), their dispute with swe-01's build-now (timing, not packaging), their deemed-ctl finding "no pin and no hold… a 6-hourly update can change the commit under a threshold" (:36). **Agree, with my own it.1 evidence**: I opened deem-ctl:163,167 (:79-81) and the plist:12-13 myself in it.001 — their mechanism reading is mine too.
- `grok/iterations/iteration-007.md` (the question-G owner, targeted read) — their route table (a) patch-jev-cli (40-70 LOC, fork-divergence, 60 s call timeout, :44) / (c) own client; N-grok-07-1: `cli-deem` beside `cli-jev`, posts `options`/`levels`, no bearer, translates keys out, refuses `stub`, stores the `deem-ctl status` commit pair, **"does not mark it build-now"** (:126); their calibration-omission finding: none of `/health`, `/v1/models`, or the startup line names a calibration file (:36); their kill criterion: stub-fidelity case or a caller count that stays 0 (:68). **Contested below (F5): their calibration gate waits on a vendor artifact that does not exist for this checkpoint.**
- `deepseek/iterations/iteration-005.md` (newest) — F1's frozen contracts: advisor 2,500 ms SIGKILL + 2,200 ms env budget (asserted in 3 test files); `enrichCompiledRoutes()` shells out **per eligible hub** (`advisor-recommend.md:33, :47`); "a classifier form may sit beside [the deterministic surfaces] as an advisory or an offline census; it must not become the picker inside the hook" (F3); F5: the connect+call vs spawn-included distinction. **Adopted into the cost side of my verdict** — the F2/F4 facts are theirs, quoted; I re-opened none of their 3 test pins (marked as quoted).
- `deepseek/iterations/iteration-002.md` (the lifecycle owner, targeted) — F2: deem-ctl's health "parses `backend` but does not pin the model id… a server started with `--model-id anything` and a torch backend passes deem-ctl today"; F9: "Nothing in the server exposes the served commit… the probe cannot supply it and the server should not be patched for it" + their rule: *every measured number stores the `deem-ctl status` commit pair beside it*. **Corrections to my own it.1 extracted below (F4).**
- `mimo/iterations/iteration-001.md` (newest, their only file) — the counted baseline: 93 transcripts, 856,226 records; fresh-input p50 = **2 tokens**, cache_read p50 = **384,219** (their `res:13-17`). Quoted as theirs; my arithmetic on their numbers marked below.
- `swe/iterations/iteration-002.md` (newest) — their check map; decisive for me: their row "kind coupling: `mode-registry.json` XOR `hub-router.json` fails explicitly; parents also run `check_compiled_routing_state` + `parent-skill-check.cjs`" citing `validate_skill_package.py:213-232, :259-284`. **I opened :210-232 and :255-290 myself** — the coupling is `has_registry != has_router → 'unclassified'` + explicit partial error (:210-232), and parents additionally run the compiled-routing readiness check (:259-280) and `parent-skill-check.cjs` from `.skilled/commands/doctor/scripts/` (:262-276).
- `swe/iterations/iteration-001.md` (targeted) — N-swe-01-1: `deem-call.mjs`, ~170 LOC + ~140 test LOC, build-now, translates `value`→`noul`, `level`→`score`, `choice`→`choice` (the one agreed field, their :32); their :34: "`run` is the clean pass"; their own N-swe-01-2 (the ~70-LOC passthrough wrapper) "rejected as the only slice, kept as a documented fallback" (:58).
- **Missing (named angles not yet landed, recorded per the refinement):** deepseek-06 (field settlement — superseded: my it.1 opened both sides), deepseek-07 (the move's blast radius — counted below, my own), mimo-07 (operator's two-backend UX), swe-07 (`cli-classifier` as files), swe-08 (shared vs duplicated probe), mimo-03 (calibration comparison vs Jev). For these, the newest landed sibling *on this question* is grok-07, critiqued below; BASE2 and Planned phases 002/003/005/006 were checked too (F2): the four Planned phases mention hub/classifier/deem **zero** times (counted this iteration: `rg -c "cli-classifier|cli-deem|hub"` over each phase's spec+goal+plan → 002:0, 003:0, 005:0, 006:0; 004:1, 001:116 — both its own research prose).

## Actions Taken (reads only)

1. Sibling reads (above: 7 files, 2 of them targeted); nobody's numbers re-derived unless marked.
2. `validate_skill_package.py:210-232, :255-290` — the coupling, the compiled-routing readiness check, the parent-skill-check invocation.
3. `.skilled/commands/doctor/scripts/parent-skill-check.cjs` (1,551 lines; head + grep) — 1a: exactly one `graph-metadata.json` at the hub root else fail (:271-274); modes[] with a required `packetKind` discriminator (workflow|surface|transport) (:14-16); toolSurface whitelist (:71); the drift-guard for lexical/alias-fold modes (:82, 34 references — their conditionality on those classes only partially traced, marked); `description.json` enforced (18 references in this checker; none in `validate_skill_package.py` or `quick_validate.py`).
4. `mode-registry.json` (cli-jev's, :1-30) — the required per-mode fields: `workflowMode`, `packetKind`, `backendKind`, `toolSurface{allowed,forbidden,mutatesWorkspace,bashAllowlist}`, `advisorRoutingContract.routingClass` ("Surface packets and transports use metadata"), `packetSkillName`, `grandfatheredFolderMismatch` ("Required on every mode"), `driftGuard` (only for lexical/alias-fold).
5. `skill-hub-routing.md:26-42` — the two stages: the advisor scores the **hub** via `graph-metadata.json`; metadata-class modes have "no advisor entry of their own"; "a second skill-shaped `graph-metadata.json` below the root is rejected".
6. cli-jev's four control files + sizes: `SKILL.md` 6,700 B (one identity, `packetKind: "transport"`, "holds no packet-local logic", :1-9), `mode-registry.json` 3,583 B, `hub-router.json` 1,396 B (`defaultMode: null`, one signal class, "orderedBundle: unreachable while the hub registers one mode", :8-11), `ROUTER.md` 3,291 B, `router_state: stage1-only`, all four machine collections empty (:7-11, :21-23) — 8,270 B of routing machinery for ONE mode; `graph-metadata.json` 3,193 B; total hub machinery 18,163 B.
7. 002's frozen instrument, my own eyes this time (it.1 marked it not-opened): `002-advisor-jev-tiebreak-arm/spec.md:85-115` — the power line, the `--jev` arm, "Out of Scope: … A shared Jev client helper, a global Jev switch, a new command or a `cli-jev` mode. This script is the only caller and `--jev` is its own switch" (:98); "Any live, served or hook-time **Jev** call in the advisor" (:92); Files-to-Change: `score-jev-tiebreak.mjs` (~330-530 LOC, ~180 census) + its vitest + read-only `routing-accuracy/labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl` (24 rows, "the Gate 3 labels and the frozen tau 0.03 slice") + hash-pinned `scorer-eval-baseline.json:5-7`.
8. Reference counts for the move: `rg -c "cli-jev"` → `.skilled` 638 hits/83 files; `.claude` 4/2; `.pi` 4/2; `.hermes` 18/5; `.codex` 4/2; `.opencode`/.cursor/.devin 0; `specs` 2,372/467 (mostly historical research prose). Advisor-side pins exist: `system-skill-advisor/runtime/database/.skill-advisor-owner.json`, `runtime/scripts/skill-graph.json`, `runtime/tests/parity/fixtures/local-native-approved-divergences.json` (paths listed, not opened — the load-bearing subset, marked inferred: these are the indexes a move must re-pin; the exact edit count inside them is UNKNOWN until the mint).

## Findings

### F1 — The least the hub must contain, counted and enforcement-backed (answers question 1; maps G, A)

Six hub-root files, each pinned to the check that demands it, plus two member skills:

| # | File | Enforced by |
|---|---|---|
| 1 | `SKILL.md` — hub identity; frontmatter (name, description, allowed-tools, 4-part version) + the compiled-routing directive markers | `quick_validate.py:143-269` (swe-002's map, their :50 row) + `check_compiled_routing_state` (`validate_skill_package.py:82-96`: missing markers → exit 1) |
| 2 | `graph-metadata.json` — exactly ONE, at the hub root | `parent-skill-check.cjs:271-274` (1a: "no discoverable identity" / "expected exactly one…found N"); and it is the *only* advisor surface for metadata-class modes (skill-hub-routing.md:28-31) |
| 3 | `mode-registry.json` — ≥2 modes, each with `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, `routingClass: "metadata"`, `packetSkillName`, `grandfatheredFolderMismatch: false` (~15-20 lines/mode; cli-jev's own entry :26-34 is the template) | the coupling: `has_registry != has_router → 'unclassified'` + explicit error (`validate_skill_package.py:210-232`) |
| 4 | `hub-router.json` — the coupled twin; policy+signals for 2 modes | same coupling (:210-232); one-mode precedent: "orderedBundle: **unreachable while the hub registers one mode**" (cli-jev's hub-router:8-11) |
| 5 | `ROUTER.md` — may ship `router_state: stage1-only` with empty maps (cli-jev's precedent, ROUTER.md:7-11: "Promote to `active` only when the maps carry concrete, resolvable leaf paths") | validated for coherence; the stage1-only state is itself the shipped precedent |
| 6 | `description.json` | the doctor enforces it (18 references in `parent-skill-check.cjs`; 0 in the other two checkers — it is the *doctor's* requirement, not the package validator's) |
| + | 2 member skills, each independently valid; hub-root `benchmark/`/`changelog/`/`manual-testing-playbook/` NOT in the minimum (the 34 checker references condition on lexical/alias-fold modes — neither of mine would be; conditionality partially traced, marked) | member-level: swe-002's whole check map; `leaf-manifest.json` opt-in (parent-skill-check.cjs:26-27), `command-metadata.json` only when the hub owns slash commands |

Size, counted from cli-jev's own parts: mode-registry (2 modes ~50-60 lines) + hub-router (2 signals, ~70-90 lines) + ROUTER.md (69 lines, stage1-only) + graph-metadata (~3 KB, now carrying **both** modes' vocabularies — the metadata-class modes' keywords reach the advisor only through this one file, skill-hub-routing.md:31) + description.json (~1 KB) + SKILL.md (~120-150 lines) ≈ **18-20 KB**, i.e. the same ballpark as cli-jev's current 18,163 B — the hub does not shrink anything; it re-locates and MERGES the vocabulary.

### F2 — Nobody planned for the hub: the four Planned phases mention it zero times (maps G, H)

`rg -c "cli-classifier|cli-deem|hub"` over each Planned phase's spec+goal+plan: **002: 0, 003: 0, 005: 0, 006: 0** (004: 1, 001: 116 — both their own research prose). D2 lives only in the parent's goal.md:50 and this packet. Meanwhile 002's own Out of Scope has already decided the hub question for its phase without saying so: "A shared Jev client helper, a global Jev switch, a new command or a `cli-jev` mode. **This script is the only caller and `--jev` is its own switch**" (002 spec.md:98) — the census, the only near-term Deem caller (my it.1 F1), needs NO hub and even *forbids* the shared-helper shape the hub would suggest. **Agreement, pushed past**: grok-010 said the one phase that ships is "not a judgment arm and not a new client" — right, and the hub is the third thing that doesn't ship: nobody'sphase would mint it.

### F3 — The move's blast radius, counted; the mint's cost, counted (answers question 3; maps G, H)

- **Text references today:** 638/83 in `.skilled` + 30 across four runtimes + 2,372/467 in specs (mostly research prose that breaks nothing). The load-bearing subset: the advisor's `skill-graph.json`, `.skill-advisor-owner.json`, one parity fixture, and the four runtime mirrors ≈ **dozens of precise edits** (the in-index counts marked UNKNOWN until a mint).
- **The identity, not the text, is the cost:** cli-jev is *already a hub* (its own words: "Typed-Judgment Transport Hub… One public skill identity", SKILL.md:1-9). Moving it under a parent kills its routing sovereignty: its `mode-registry.json`+`hub-router.json`+`ROUTER.md` (8,270 B) and its own `graph-metadata.json` (3,193 B) — "a second skill-shaped `graph-metadata.json` below the root is rejected" (skill-hub-routing.md:29-31) — are **deleted**, its vocabulary merges into the parent's, and every today-direct advisor hit on "cli-jev" becomes a two-step through `cli-classifier`.
- **The hop cost, counted:** today, a judgment = advisor → cli-jev (hub) → cli-usage (packet): the SKILL.md hop chain is 2. After the mint: advisor → cli-classifier → cli-jev (packet) → cli-usage: **3 hops**, one more SKILL.md-class load. Against mimo-001's counted baseline (their res:13-17: fresh input p50 2 tokens, carried context p50 384,219), the extra hop's SKILL.md-class load (~1.5-2 KB ≈ ~1,700-2,000 tokens by the 4-B/token rule of thumb — **arithmetic on my byte-count + their baseline, marked**) is ~0.4-0.5 % of the carried window per judgment pass: cheap per use, and it buys *nothing* while the second transport has zero callers.
- **Net surface delta of minting now:** +18-20 KB (parent) − 8.3 KB (cli-jev's dead control files) + ~1.7-2 KB (the extra hop) ≈ **+10-12 KB of permanent routing surface** and one identity re-mint, to serve `cli-deem` — which, by it.1's F1 and grok-010's verdict, is not a phase yet.

### F4 — Two corrections to my own it.1, from deepseek-002's F9 + the endpoints (maps A)

1. **`/health` alone is NOT provenance.** Its `model` field is the *model id* (`deem-0.8-v1` — update-invariant), not the weights: deem_server.py:772-777 (my it.1 cite) + deepseek-002 F2 (the id is unpinned *and* unchanging across updates). The weights signal is the `models/current` readlink (deem-ctl:97-98, which I opened in it.1) — one `readlink`, no network — plus the source sha only `deem-ctl status` can assemble (:195-202). My it.1's F4.1 "caller reads `/health`" survives **only** as the *backend/model-id* half; the **commit-pair** half needs the readlink (+`status` at measurement time). deepseek-002's stored-pair rule (their F9) is the stronger, cheaper answer; my amendment N-glm-01-2 is hereby theirs-plus-readlink, and the server-side variant stays the fallback.
2. **The calibration vigilance is a red herring for THIS decision.** grok-07-1 gates thresholding on "a calibration file that names the served commit" (their :56) — but no calibration file exists for this checkpoint anywhere: LOCAL:27 ("No calibration file in the repo is published for this checkpoint") and grok-07's own :36 (none of the three endpoints names one). Their gate waits on a vendor artifact with no announced existence. The measured aggregate flip ≤ 0.10 (BASE2 C1) **subsumes** calibration for the keep/kill decision: you do not need to know the temperature when you measured the flip rate. → Cut: the calibration-waiting thread; replace with the printed F1 number. (grok-07's *commit-pair* storage stands — that part of their idea survives its own gate's discount.)

### F5 — Which sibling proposal is a wrapper that only forwards arguments (answers question 4)

Two, and one of them its own author already dropped:

- **N-swe-01-2** (swe-001:58-66, ~70 LOC): `cli-deem` shells `jev --provider custom --endpoint $DEEM_ENDPOINT` with a placeholder `JEV_API_KEY` in the child env. It forwards arguments *and* pays Jev's key ceremony (ALL-8: the Python jev-cli "always sends a bearer key and exits 3 without one") to reach an authless server (deem_server.py:809-811). The author's own verdict: "rejected as the only slice" — **confirmed dead**; the addition: it dies specifically as a *wrapper*, the red flag my lens exists to catch (digest: "A wrapper that only forwards arguments. Call the thing directly", :98).
- **grok-07's route (a)** (their :44): patch `question_request`/`primary_value` inside the installed wheel — 40-70 LOC, but "the installed wheel and the vendored tree diverge" and `call` still times out at 60 s (JEVSRC:288, their cite). A fork you maintain to save a file you would own: the same failure at higher cost. Their kill criterion (a stub run + `pip show` proving no local edit) stands; my addition: **route (c) needs no `jev` dependency at all** — it is the only route that makes ALL-8's key question vanish instead of answered.

### F6 — The shape I would ship, and its kill criterion (answers question 2 and 5; maps G, H)

**Amend D2 into a ledger clause, not a build phase** (the amendment, not a drop — D2 is the parent's):

> *D2.1 — `cli-classifier` is a name, not a phase. Until its second member earns a second *live* caller, `cli-jev` stands alone and the Deem scorer lives inside the 002 census script (whose own rules already say so: 002 spec.md:98). Mint the 6-file hub (F1's table) exactly when BOTH: (1) 002's census printed keep or kill, and (2) exactly one more live caller exists in one more file. At mint, neither member may have 0 callers — a one-mode hub is the Cli-jev precedent's own "unreachable" case (hub-router:8-11) — that is the kill criterion, printed as the caller count: `mint allowed: cli-jev callers=N¹>0, cli-deem callers=N²>0`.*

Per-idea records:

#### N-glm-02-1 — D2.1: the ledger-clause amendment (hub-when-second-caller)

| Field | Value |
|---|---|
| **Idea** | `N-glm-02-1`: no `cli-classifier` phase. D2.1's ledger clause; the 6-file/2-skill mint on the double condition. Type: not a judgment — an ordering rule |
| **Question** | G (the hub's shape), H (order), A (cli-deem's placement) |
| **Builds on** | D2 (`goal.md:50`); it.1 F1 (the 0.8B earns no wiring yet); 002 spec.md:98 (the census's own-helper rule); grok-010's "not a new client"; F2 (zero phase mentions) |
| **Value** | Nobody: mints +10-12 KB and an identity re-mint before the second caller exists; the ~30 load-bearing pins and the 2,372 prose references stay untouched until they mean something |
| **Seam** | The parent's `goal.md:50` (D2's wording) + this packet's synthesis (the proposer of phases); 002 spec.md:98 is the precedent that the census-internal scorer needs no hub |
| **Metric, baseline, harness** | Metric: live-caller count per member, counted by `rg` over the phase outputs when they exist (ALL-6's counting, not running); baseline today: **cli-jev: UNKNOWN-but-≥1 (this packet's 007/003 work references it; the honest count is a separate rg — marked UNKNOWN), cli-deem: 0** (it.1: no caller; grok's it.7 count, theirs, quoted). Harness: the mint checklist = F1's 6-row table, each row citing its enforcement |
| **Savings** | Context tokens: ~10-12 KB of routing surface not minted now (my count, F3) + one hop (~1,700-2,000 tokens/judgment pass, arithmetic, marked). Minutes: the mint's own work (~1-2 h, estimate, marked). AI passes: 0 |
| **Cost, latency, privacy** | The clause itself: 0. The *future* mint: as F3. Neither backend touched; nothing leaves the machine |
| **Two-backend gate** | The clause IS gate-shaped: with neither member in use, behavior is exactly today's (no hub, no new surface). It does not touch either backend's detection (that is each feature's own, per D1) |
| **Rough LOC** | 0 now; the mint: the 6 files ≈ 300-400 LOC-equivalent (the parents' own precedents: cli-jev's 8,270 B + 3,193 B) + the ~30 pin edits + the reference sweep. Estimate, marked — the pin-edit count inside the advisor indexes is the UNKNOWN |
| **Verdict** | **build-now (the clause), the mint: next** — writing one paragraph into D2.1 costs nothing and binds the future; minting the hub now buys a 0-caller second transport |
| **Confidence** | Confirmed: the 6-file minimum (each row's enforcement), the reference counts, the phases' 0-mentions, the coupling, the hop cost's byte basis. Inferred: the advisor-index pin edits' exact count (UNKNOWN until a mint; the method: open the 3 advisor files + 4 mirrors and count); the 1-2 h mint estimate |

#### N-glm-02-2 — the 002 amendment: one word + the census-internal scorer

| Field | Value |
|---|---|
| **Idea** | `N-glm-02-2`: amend 002 spec.md:92 "Any live, served or hook-time **Jev** call" → "…**Jev or Deem** call", and let the census's 0.8B scorer (N-glm-01-1) be the script's own second switch — exactly the pattern :98 already demands ("This script is the only caller and `--jev` is its own switch") |
| **Question** | A (where the 0.8B's first measurement lives), H (the amendment's size IS the argument) |
| **Builds on** | it.1 N-glm-01-1 (whose "insertion point UNKNOWN" this resolves); 002's Files-to-Change (score-jev-tiebreak.mjs, ~330-530 LOC of which ~180 census — the scorer rides *that* script, ~30-60 LOC) |
| **Value** | The 0.8B's agreement number is produced by the instrument that already owns the deck, the labels (`routing-accuracy/ambiguity-prompts.jsonl` — the 24-row set my it.1 could not locate: **resolved, it lives here**), and the C1/C3 thresholds; no new artifact, no hub, no client |
| **Seam** | `002-advisor-jev-tiebreak-arm/spec.md:92` (the one word), `:98` (the exclusivity precedent), the Files-to-Change row for `score-jev-tiebreak.mjs` |
| **Metric, baseline, harness** | The printed F1 line of it.1, now sourced: agreement + flip over the census's decided universe (C2), labels: the routing-accuracy sets; the 0.8B's answers enter as the second scorer's picks, keyed row-by-row. The vitest gains the stub-Deem cases (the mirror of 002's own stub-`jev` tests) |
| **Savings** | vs the alternatives: vs a hub-hosted scorer (F3's +10-12 KB + re-mint, bought for the same 30-60 LOC); vs a standalone `deem-call.mjs` now (swe-001's 170+140 LOC — its own author's build-now: my verdict **later**, because the second caller does not exist: it.1 F1 + grok-010's timing argument, which I hereby join) |
| **Cost, latency, privacy** | +1 word; +30-60 LOC inside a file 002 already creates; the 0.8B calls are local, 60 ms, no key (LOCAL:36-38, :51). The 002 budget: the ~10 s of model time over the whole deck (it.1's arithmetic) — inside a census that already runs to minutes |
| **Two-backend gate** | The scorer's switch is the script's own flag (the :98 pattern); Deem detected by the parsed-`backend`+model-id health check (ALL-4 + deepseek-01's pin, their wording); Jev's `--jev` unchanged; neither → the census runs exactly today's behavior, byte-identical (002's own contract, :87-112); a malformed 0.8B answer → the row `unmeasured`, the fused order stands (BASE2 C5) |
| **Rough LOC** | 1 (the word) + 30-60 (the scorer + the print) + 1-2 vitest cases. The 30-60: my it.1 estimate, now anchored to a file whose ~180-LOC census and ~330-530 total are 002's own lineage estimates (the Files-to-Change row) — my delta rides inside their budget, it does not add a file |
| **Verdict** | **build-now** — the smallest complete slice in this whole question: one word, one function, one printed number, zero new surfaces (Q5: the smallest thing that solves the stated problem) |
| **Confidence** | Confirmed: 002's :92/:98 (opened this iteration), the Files-to-Change target, the labels' location. Inferred: that the scorer function's ~30-60 LOC fits their 330-530 budget without touching the pinned baseline (`scorer-eval-baseline.json:5-7` is read-only to 002 anyway) — what confirms: 002's own implementation, a later phase's business |

## Questions Answered

- **G1:** The least the hub must contain: **6 files + 2 member skills, each row enforcement-pinned (F1's table).** The routing machinery alone ≈ 18-20 KB — the "least" is not small, because the vocabulary of *both* transports must merge into ONE `graph-metadata.json` (the metadata-class rule) — the hub's true marginal cost.
- **G2:** Move-now vs start-with-cli-deem: **neither — the ledger clause.** A 1-mode hub replicates cli-jev's own "unreachable" case (hub-router:8-11); the census needs no hub (002:98); the +1-hop/~10-12 KB/identity-re-mint costs are counted (F3). Mint on the double condition, kill when either member is 0-caller.
- **A (partial):** cli-deem's shape, answered *by subtraction*: the only near-term caller is the census, which forbids the shared-helper shape (:98) — so cli-deem-the-ARTIFACT waits for its second caller; the wrapper convictions (F5) settle what it will NOT be.

## Questions Remaining

- C1/C2: the context-reduction checklist run (glm-03, next; mimo-001's counted baseline is the yardstick — fresh-input p50 2, carried p50 384,219, their res:13-17).
- D/E/F: the validator/sk-prompt/sk-design residue (glm-04; swe-002's check map is the D-side inventory, quoted).
- H1/H2: the round-3 drop list (numbered from 73) and the smallest remaining program (glm-05).
- G (residual): the honest live-caller count of cli-jev TODAY (marked UNKNOWN, method: one rg over the phase outputs + the advisor's usage records when they exist) — the F1/N-glm-02-1 baseline.

## Next Focus

`glm-03: Against context-reduction features` (W2, research-angles.md:534-544). Read the newest sibling iteration of each other lineage first, then the question-C owners' files: mimo-01 (their counted baseline — the yardstick), mimo-04, deepseek-04, swe-03, swe-04, grok-03 (whichever exist). Then: run every question-C proposal through Q1-Q15 + the red flags; separate counts from estimates; propose the below-threshold kill; find the cheaper no-model fix. Carry: the fresh-input-p50-2 fact (any "saves context tokens" claim must beat a 2-token marginal, not the 384,219 carried window — the baselines are DIFFERENT numbers); and this iteration's hub result (a context-reduction feature does not need the hub either — 002:98's exclusivity precedent generalizes).

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence or restated | Evidence |
|---|---|---|
| The four Planned phases mention the hub zero times; 002's own rules already answered the hub question for its phase | **new** (D2's blindness to its own downstream, counted) | F2; `rg -c` over 002/003/005/006 spec+goal+plan (0/0/0/0) |
| The 6-file/2-skill minimum, each row enforcement-pinned; the vocabulary-merge as the true marginal cost | **new** (nobody counted the "least"; the metadata-class vocabulary rule makes it bigger than "a SKILL.md and a registry") | F1; validate_skill_package.py:210-232,255-290; parent-skill-check.cjs:271-274; skill-hub-routing.md:26-42 |
| A 1-mode hub is air (cli-jev's own "unreachable" clause) — the arithmetic for minting ON the second caller, not before | **new** (the clause generalizes cli-jev's own precedent into D2.1's kill criterion) | F3, F6; hub-router:8-11 |
| `/health`'s model id is update-invariant: my it.1 provenance was half-right; the readlink+status commit pair is the weights signal; the calibration-wait gates on a vendor artifact that does not exist for this checkpoint | **new** (a correction of my own it.1, from deepseek-002's F9 + my deem-ctl:97-98 + LOCAL:27) | F4 |
| swe-001's N-swe-01-2 (the 70-LOC passthrough) is dead as a wrapper; grok-07's route (a) dies of fork-divergence; route (c) is the only one that makes ALL-8's key question vanish | **confirms BASE with new evidence** (both their authors' conclusions, one new *reason*: the key ceremony paid for nothing) | F5; swe-001:58-66; grok-007:44,56; ALL-8 |
| 002's census: the 0.8B's first measurement rides it as its own switch, for one word + 30-60 LOC | **confirms BASE with new evidence** (it.1's N-glm-01-1, now with its insertion point, its one-word amendment, and the labels' location) | 002 spec.md:85-115 |

## SCOPE VIOLATIONS

None. Reads only outside the lineage; writes: this file, `deltas/iter-002.jsonl`, the state record, and the lineage's reducer-owned state files.

## Hand-off

- **glm-03**: the C-question yardsticks are DIFFERENT numbers — any "saves context" claim beats fresh-input (p50 = 2 tokens, mimo-001's res:13-17), not the 384,219 carried window; a proposal that saves 500 tokens/turn saves 0.13 % of the carried window. Also: no question-C feature needs the hub (002:98's exclusivity precedent) — a proposal that mints infrastructure for its savings pays twice.
- The labels my it.1 could not locate are at `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/ambiguity-prompts.jsonl` (002's Files-to-Change) — whoever touches question A's quality clause uses them, not the 24-row blind recreations.
- The UNKNOWNS carried: cli-jev's live-caller count TODAY (the mint checklist's N¹; one rg, when the phase outputs exist); the advisor-index pin-edit count (UNKNOWN until a mint); the conditionality of parent-skill-check's 34 benchmark/changelog/playbook references (partial: :82's comment conditions them on lexical/alias-fold; neither of my 2 modes would be one — traced far enough for THIS verdict, not for a mint's prep).
- grok-07's calibration question is ANSWERED-CUT (F4.2): the flip rate subsumes calibration for keep/kill; their commit-pair storage stands. If their lineage's steer disagrees, the disagreement is theirs to note — the printed number settles it either way.
