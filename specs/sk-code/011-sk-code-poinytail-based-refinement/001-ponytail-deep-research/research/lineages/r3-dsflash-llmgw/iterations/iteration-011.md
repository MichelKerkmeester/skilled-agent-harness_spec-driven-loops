# Iteration 11: Review integration and strengthening proposals (Part 2 close)

## Focus

Part 2's closing slice: how `sk-code-review` integrates with the shared layer and the hub, and the steer's forward question — what would make the review logic stronger. This clears Part 2 before the run moves to Part 3's fresh pass.

## Actions Taken

1. Swept the review packet (excluding `benchmark/` and `changelog/`) for references into the shared layer and the hub.
2. Checked the hub's second-stage map for review-intent rows and the leaf manifest for the ownership of the cross-packet asset the map uses.
3. Confirmed which shared files the review canary pins, and where the mode's doctrine stands on its own.
4. Assembled the strengthening proposals this part's findings support.

## Findings

1. **The review mode's documents never reference the shared layer, while its scripts pin two shared files — so the route carries two authorities for surface identity and no declared fork.** `rg -n "shared/references|\.\./shared|shared/"` over `sk-code-review/` (excluding `benchmark/`, `changelog/`) hits only `scripts/check-rule-copies.js:64,82` and its test — the canary pins `shared/references/universal/code-quality-standards.md` and `shared/references/workflow-verify.md` [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:64] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:82] — while `SKILL.md`, `references/` and `assets/` contain none. Meanwhile the hub claims surface detection "lives once in the hub's `shared/` layer and is consumed by every mode and surface" [SOURCE: .skilled/skills/sk-code/SKILL.md:135], and the review mode implements its own `detect_surface_evidence` instead [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:220]. The behavioural consequence was filed in iteration 6; this is the structural statement: either the mode consumes the shared detection contract, or the packet declares the fork so a future editor of `stack-detection.md` knows it has a second implementer. Reproducing case: `rg -n "shared/references" .skilled/skills/sk-code/sk-code-review/SKILL.md .skilled/skills/sk-code/sk-code-review/references .skilled/skills/sk-code/sk-code-review/assets` exits 1. NEW, P2.
2. **Strengthening proposals for the review logic, ranked by proof value.** (a) Give `check-review-findings.js` a second pattern for the heading shape, so both documented shapes are graded — the observed escape in iteration 10 is the strongest argument. (b) Route the review mode's surface detection through the shared contract, or at minimum derive its marker list from `stack-detection.md` §2 so the two cannot drift. (c) Add the Obsidian token to the output contract and the mode's detection once (b) lands; the hub already bundles the surface. (d) Build a review-output contract fixture — the review analogue of the routing canary — that feeds both checkers the documented good and bad shapes, including the two shapes' examples, so the contract is graded rather than described. (e) Extend the canary's exact-string set with the six `AGENTS.md`-level review floors it currently does not pin. NEW, P2 (proposal set; each item is cheap and independently testable).
3. **The self-containment itself is deliberate, and the canary's shared-file pins are the right shape of coupling.** The hub rule says each mode keeps its own contract [SOURCE: .skilled/skills/sk-code/SKILL.md:137], and the review canary pins load-bearing wording in the shared standard and workflow-verify rather than copying it [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:64]. ALREADY-ADOPTED, P2, no action; recorded so the zero-reference sweep in Finding 1 is not mistaken for a missing contract.

## Questions Answered

- Key question 5's remaining leg and key question 7 are closed: the review mode's agnosticism gaps are mapped, its scripts are exercised, and the strengthening set is proposed. Part 2 is complete at six iterations (6-11).

## Questions Remaining

- Part 3 opens: `sk-code-quality`, `sk-code-webflow`, `sk-code-opencode`, `sk-code-obsidian`, hub files, `benchmark/` and the playbook.

## Ruled Out

- **"File the cross-packet asset load as a defect."** The hub's `CODE_QUALITY` intent loading `sk-code-review/assets/code-quality-checklist.md` is explicitly allowlisted at the router-guard tier, and the leaf manifest types it under the review packet; ownership is declared, not accidental.
- **"Re-file the misrouting as an integration finding."** f-iter006-001 holds the behavioural defect; this iteration files only the structural statement.
- **"Require a shared-layer pointer in every mode."** The hub explicitly keeps mode contracts packet-local; only the detection authority is at stake.

## Dead Ends

- `ROUTER.md` has no review-intent rows; the review mode's second stage is its own `INTENT_SIGNALS`/`RESOURCE_MAP`, which matches the hub pattern used by the mode packets. No finding.
- The `benchmark/` folder inside the review packet is the retired Lane C index; excluded.

## Edge Cases

- Ambiguous input: whether the canary's pins count as the review mode "consuming" the shared layer. Chosen interpretation: they couple invariants, not the mode's runtime doctrine; the surface-detection fork stands.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-review/SKILL.md`
- `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js`
- `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh`
- `.skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js`
- `.skilled/skills/sk-code/SKILL.md`
- `.skilled/skills/sk-code/ROUTER.md`
- `.skilled/skills/sk-code/leaf-manifest.json`
- `.skilled/skills/sk-code/mode-registry.json`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.80 (two fully new findings, one ALREADY-ADOPTED confirmation).
- Questions addressed: key questions 5 and 7 (closing legs).
- Questions answered: key question 5 and key question 7.

## Reflection

- What worked and why: separating "the mode never points at shared" from "the mode's private detector misroutes" produced a structural finding that survives even if the behavioural one is fixed by a marker-list edit.
- What did not work and why: the first sweep counted the scripts' pins as mode references; filtering to the docs showed the zero-reference shape the finding needed.
- What I would do differently: classify each reference by consumer kind (runtime docs, scripts, tests) before drawing an integration conclusion.

## Recommended Next Focus

Part 3 opens with `sk-code-quality`: its SKILL, scripts, README, version claims and the check 5k warnings it inherits.
