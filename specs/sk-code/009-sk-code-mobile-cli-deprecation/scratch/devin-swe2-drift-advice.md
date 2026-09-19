# Router-drift review — Devin SWE-2 (read-only)

Date: 2026-09-19. Method: ran `compiled-route-admission.cjs --all` (2 hubs fail: sk-doc, system-deep-loop, 2 drift each) and reproduced all four engine decisions via `compiledRoute` (`.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`).

## Verdict first

Only **AI-003** is a true defect worth fixing now: the compiled policy scores `model-benchmark` on bare phrasing through two aliases that contradict the hub's own written contract. **SD-015** is miscategorised gold — a one-line correction, cheap. **MO-004** is a real but bounded missing feature in the hub's own router (fixable without a policy re-mint). **SD-H02** has no honest fix — every "fix" destroys the only genuinely decontaminated holdout in the fleet; record or reclassify it.

One fact reframes "leave them recorded": the activation/flip driver gates on `assertAdmissionPasses`, which requires `verdict === 'pass'` (`specs/.../015-router-unification-program/shared/admission-gate.cjs:38-50`, called from `013-live-activation/lib/activate-hub.cjs:306`). A hub in `drift` cannot be re-activated or re-flipped. So recorded drift pins the hub: any future policy change to system-deep-loop must first clear **both** its drifts.

## Per-case findings

### SD-H02 — expectation wrong for the compiled contract (no honest fix)

- Engine returns `defer`; `scoreModes` on the normalized prompt returns `[]` — zero keyword hits (verified by calling `scoreModes` on the live snapshot). `defer` is the designed conservative outcome (`.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:9-11`).
- The scenario is deliberately decontaminated (`.skilled/skills/sk-doc/manual-testing-playbook/holdout/doc-quality-natural.md:33-36`), and its pass bar is "routed intent matches" (`:50`). A lexical router cannot route phrasing that shares no vocabulary — this is the probe working, not the engine failing.
- 19 of 20 fleet holdouts pass, so "holdouts can't pass under compiled routing" is false — but they pass on incidental vocabulary overlap (e.g. SD-H03's "front-page overview" is itself a keyword, `hub-router.json:229`). SD-H02 is the only truly clean one.
- Under compiled serving, `defer` is terminal disambiguation, not a legacy fallback (`.skilled/skills/sk-doc/SKILL.md:58`). Would change my answer: a designed defer→semantic-fallback layer, which does not exist.

### SD-015 — miscategorised gold; engine correct

- Engine `defer` with zero scores (verified). Two authored contracts make the 14-mode gold structurally unreachable: `discoveryClassesContract` — "a prompt naming only the hub… takes the defer outcome instead of fanning out to every authoring mode" (`.skilled/skills/sk-doc/hub-router.json:44-47`); and `selectionPolicy.maximumIntents` = 3, the largest declared bundle (`009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:326`), with `assertComposition` hard-failing any undeclared bundle (`007-sk-doc/lib/router.cjs:244-256`).
- The scenario encodes the **stage-2** `FULL_INVENTORY` leaf intent (`.skilled/skills/sk-doc/ROUTER.md:126-129,163`) as a **stage-1** mode route. Its own frontmatter already admits no single intent applies (`expected_intent: UNKNOWN`, `full_inventory_intent: true` — the latter is only a topology-validator bypass, read by `validate-playbook-topology.cjs:155`, never by the router). Today's stale-gold repair (d5c3d08fdd) fixed leaf attribution but could not fix the category error.

### AI-003 — vocabulary defect; gold correct

- `hub-router.json:61` gives `model-benchmark-aliases` the bare phrases `"model benchmark"`, `"benchmark a model"`; the prompt scores model-benchmark 4 → single route (verified).
- Three authored contracts say bare phrasing must not fire this lane: the same hub's surface router declares `MODEL_BENCHMARK` keywords as **only** `["/deep:model-benchmark"]` (`.skilled/skills/system-deep-loop/ROUTER.md:76`); `mode-registry.json:149` sets `routingClass: "command-bridge"` ("routed by its /deep:* command, not an advisor map entry", `:12`); sibling scenario IL-002's FAIL criterion is "the lane fires from a bare advisor alias" (`improvement-lane-routing/model-benchmark.md:85`). The canary-router was even rewritten to avoid this exact over-route (`002-system-deep-loop/lib/canary-router.cjs:20-22`) — the hub vocabulary it switched to still carries the leak.
- Verified fix in-memory: removing the two bare aliases → AI-003 prompt `defer` (negative gold passes), IL-002's `/deep:model-benchmark` prompt still routes. Only AI-003 and IL-002 mention benchmark phrasing in the playbook; the canary fixture's model-benchmark case uses the command prompt (`fixtures/canary-cases.v1.json:82-95`).

### MO-004 — missing feature in the hub router; gold correct

- `research:` never reaches a decision: `input.explicitMode` is honoured (`canary-router.cjs:283-288`, `explicitModeMatches:229-236`) but nothing parses a `mode:` prefix — the front door passes only `{prompt}` (`014-runtime-engine/lib/compiled-route.cjs:96`). The prompt then near-ties research 4 ("research summary") vs review 4 ("deep review") → `clarify` (verified `scoreModes`).
- The override rule is documented twice (`.skilled/skills/system-deep-loop/SKILL.md:73` and `:89`). Under compiled serving `clarify` is terminal (`SKILL.md:45`) — a real regression vs the prose contract.

## Q2 — provably confined fixes

- **AI-003**: edit `.skilled/skills/system-deep-loop/hub-router.json` (keywords → `["/deep:model-benchmark"]`). Confined: only model-benchmark's scoring class changes; no other scenario/fixture consumes the aliases. Cost: **policy re-mint** — `hub-router.json` is hashed into `provenancePolicy.sourceHashes` (`build-artifacts.cjs:68-74` → `registry-compiler.cjs:617-620`); my in-memory recompile changed `effectivePolicyHash` 839b6f0c…→3f0d9d85…. Re-mint = rebuild child artifacts + re-select the manifest (precedent: 173ce63f59 rewrote sk-code's manifest hash in place, generation unchanged) + `compiled-route-sync.cjs` promotion. Proof: `compiled-route-admission.cjs --hub system-deep-loop` shows AI-003 pass and IL-002 still pass; `compiled-route-guard.cjs` reports fresh.
- **SD-015**: set `expected_workflow_mode: UNKNOWN` in `token-cost-baseline/max-load.md`. Confined to one file; scored as a negative (admission lib:276,288-292) — the leaf list stays inert because the negative branch returns before leaf validation. It still asserts something real: full-toolkit phrasing must defer, not fan out. Proof: admission `--hub sk-doc` → pass.
- **MO-004**: edit the authored `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/002-system-deep-loop/lib/canary-router.cjs` — parse a leading `<token>:` and, only when it resolves to exactly one registered mode, take the `routeSingle` path; otherwise fall through to keyword scoring (so `deep-research:` in AI-002 and prose colons are unaffected). Promote via `compiled-route-sync.cjs`. **No re-mint**: router code is not in `sourceBytes`, so `effectivePolicyHash` is untouched. Proof: admission → MO-004 pass, AI-002 unchanged.
- **SD-H02**: gold → `UNKNOWN` is confined but converts the probe into a fail-safe negative; adding "review bar"/"write-ups" to `create-quality-control-aliases` is confined but contaminates the holdout *and* costs a re-mint. Both defeat its purpose.

## Q3 — shared-engine cases

Strictly, none. Each hub's router is its own module. Two fixes would *become* shared if implemented at the wrong layer: mode-hint parsing in the shared front door (`bin/compiled-route.cjs` / `resolve.cjs`) would give all five hubs `<mode>:` semantics their SKILL.mds never document — wider blast radius, no benefit outside deep-loop. And a *real* full-inventory fan-out for SD-015 would need new detection in `007-sk-doc/lib/router.cjs` plus a declared 14-mode `compositionRules` entry satisfying the shared `assertComposition` gate (`005-decision-evaluator/lib/decision-contract.cjs`) — technically hub files, but it reopens the authored `discoveryClassesContract` by design, not by bug. SD-H02's only true engine fix (a semantic scorer) is a capability the architecture doesn't have — not a patch.

## Q4 — recommendation

**Fix AI-003 now; leave the rest recorded.** It is the only case where the served decision contradicts the hub's own written contract — a bare phrase silently enters a workspace-mutating, command-gated lane. The fix is proven confined and the re-mint ceremony was just exercised for sk-code. Trade-off: it deliberately *reduces* recall — users typing natural benchmark phrasing at the hub get a disambiguation instead of a route. That is the contract's intent, but it is a behaviour change wearing a bugfix's clothes.

Note the coupling the brief misses: the admission gate at activation/flip means system-deep-loop's `drift` verdict (AI-003 **or** MO-004) blocks any future re-mint through `activate-hub.cjs`. Fixing AI-003 alone leaves the gate red — if a deep-loop re-mint is on the horizon, MO-004's no-re-mint router fix is the cheap way to clear the verdict entirely.

## Q5 — if exactly one

AI-003. Change set: (1) drop `"model benchmark"` and `"benchmark a model"` from `vocabularyClasses.model-benchmark-aliases.keywords` in `.skilled/skills/system-deep-loop/hub-router.json`; (2) rebuild the child's artifacts and re-select the manifest (`refreshCanonicalManifest` in `.skilled/bin/lib/compiled-route-manifest.cjs`, authored + promoted copies); (3) `compiled-route-sync.cjs` to re-promote the closure. Single proving check: `node .skilled/bin/compiled-route-admission.cjs --hub system-deep-loop` — AI-003 flips to pass while IL-002 stays pass.

## Q6 — what's wrong or missing in the framing

- The four cases are three different defect classes sharing one label: miscategorised gold (SD-015), vocabulary defect (AI-003), missing hub feature (MO-004), and a category-mismatched probe (SD-H02). The right disposition differs per class.
- "Drift" understates impact: under compiled serving, `defer`/`clarify` is terminal disambiguation (`SKILL.md:45`, `SKILL.md:58`), so MO-004 and SD-H02 are user-visible regressions vs the prose-era contract, not just scorer noise.
- The checker bypasses the serving gate — it calls `compiledRoute` on freshly recompiled authored inputs (`compiled-route-admission.cjs:79-81`, lib comment `:5-7`). "Engine decision" is therefore the *hypothetical* compiled decision; serving adds the manifest identity binding (`resolve.cjs:112-117`). No discrepancy today (manifests fresh), but a source edit appears in admission before it can serve.
- Cheaper than assumed: SD-015 (one scalar; no tooling) and MO-004 (no re-mint — the router file is outside `sourceBytes`). AI-003 is priced about right (re-mint + promotion).
- SD-H02's premise "which side is wrong" has no answer that survives contact: the gold is right about desired routing and unreachable by construction. Reclassify it as a fail-safe negative or leave it as an honest signal — do not "fix" it by teaching the phrases it exists to withhold.
- Interaction the brief doesn't mention: a `model-benchmark:` hint under an MO-004 fix would route a command-bridge lane by prefix. `SKILL.md:89` sanctions improvement-lane hints, so this is documented — but it sits in tension with AI-003's guard and deserves one line in the change's rationale.

UNKNOWN: whether the team re-mints through `activate-hub.cjs` (admission-gated) or the ungated `refreshCanonicalManifest` path — the choice determines whether AI-003's fix must land with MO-004's. Also noted: `.skilled/skills/mcp-tooling/` carries unrelated uncommitted changes; excluded from this analysis.
