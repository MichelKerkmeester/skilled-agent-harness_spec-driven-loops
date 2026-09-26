# Iteration 4 — RQ3: Scope model — profiles/groups/authorization set vs advisor scoping

Focus: what plays the role of the extension's preferred-search-scope in the advisor (hubs,
compiled routes, workflow modes), and whether scope preference would raise precision.

## Findings

### F4-1 — Preferred scope with bounded global fallback is the transferable core

- **Orchestrator mechanism** [CONFIRMED]: one active scope at a time — all / profile / group
  (`context/pi-skill-orchestrator-main/src/scope.ts:4-7`); a profile scope is the union of skills
  assigned to its groups (`scope.ts:38-45`, `docs/groups-and-profiles.md:103`); search runs the
  active scope first and a zero-match active search performs one bounded global fallback that
  does not change the scope (`context/pi-skill-orchestrator-main/src/index.ts:622-648`, `:666-685`,
  `docs/architecture.md:57-63`). Empty profile ⇒ zero automatic candidates, deliberately no widen
  (`scope.ts:96-100`, `tests/scope.test.mjs:57`); stale group falls back to the profile scope
  (`tests/scope.test.mjs:95`).
- **Advisor counterpart** [CONFIRMED]: nothing session-scoped. The nearest mechanisms are the
  operator denylist of never-route skill ids (`.skilled/skills/system-skill-advisor/runtime/lib/routing/route-exclusions.ts:5-13`,
  fail-safe loading at `:72-80`) and soft hub anchoring inside the explicit lane — e.g. the
  review+write rule pins the code hub so its router picks implement over code-review
  (`.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:93`; hub-routing
  alias refusal at `runtime/lib/scorer/aliases.ts:148`). Workflow modes (implement/review/research)
  resolve downstream of the skill pick, inside each hub's router — the advisor scores skills, not
  modes.
- **Proposed change**: add a *soft* scope-preference signal to fusion — the active hub/mode family
  (e.g. the route the current dispatch already carries: the append gateway's `target_agent`/
  `resolved_route` route-proof fields) biases candidates within a family, while the global pool
  stays open and no candidate is ever removed from it.
- **Benefit**: precision on family-adjacent prompts (sk-code vs sk-doc vs deep-review ties) without
  a hard wall; mirrors the extension's "search here first, fall back bounded" contract.
- **Cost**: one weighting term in fusion plus a session-state read.
- **Risk**: a stale session scope could starve the true skill; the always-open global pool and the
  brief's top-2 ambiguity widening (`.skilled/skills/system-skill-advisor/runtime/lib/render.ts:421-433`)
  bound that risk.
- **Verdict: ADAPT** — adopt preference-with-fallback, not restriction; the advisor is advisory,
  so a hard scope would turn a ranking miss into a silent block.

### F4-2 — The authorization set guards a load gate the advisor does not have

- **Orchestrator mechanism** [CONFIRMED]: `fallbackRootNames` is the authorization set — each new
  global fallback search *replaces* it (`context/pi-skill-orchestrator-main/src/index.ts:602`,
  `:617-620`), scope/profile changes clear it (`index.ts:196`, `:207`), and the `skill` loader
  refuses an outside-scope root that was never surfaced by a fallback search
  (`index.ts:724-735`). Dependencies stay exempt from scoping
  (`docs/groups-and-profiles.md:167-174`).
- **Advisor counterpart**: none [CONFIRMED by absence — the advisor emits a brief
  (`runtime/lib/render.ts:384-441`) and never loads anything; the CLI read path
  (`ARCHITECTURE.md:101`) returns recommendations only].
- **Proposed change**: none for loading; adopt only the state-hygiene half — any session-scope
  state the advisor adds must be *replaced* on scope change and cleared on session lifecycle
  events (the Pi hook already resets its dedup store per session/compact
  (`.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:206-212`), the same pattern).
- **Benefit**: no stale-scope leakage across mode switches.
- **Cost**: trivial.
- **Risk**: none.
- **Verdict: REJECT** (authorization set + load gate) — there is nothing to gate at brief time; the
  replacement semantics, not the gate, is the lesson.

### F4-3 — Empty-scope honesty beats silent widening

- **Orchestrator mechanism** [CONFIRMED]: an empty profile renders "0 lazy skill candidates" and
  the search replies with an explicit no-candidate message instead of silently listing everything
  (`context/pi-skill-orchestrator-main/src/index.ts:687-696`, `scope.ts:104-118`; guarantees at
  `tests/scope.test.mjs:57`, `:84`, `:153`).
- **Advisor counterpart** [PARTIAL]: `no_recommendation` is already reported as an answered
  question, not an outage (`.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:436-445`),
  but the model-visible surface is simply the absence of a brief (`renderAdvisorBrief` returns null
  with no above-threshold match, `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:409-412`).
- **Proposed change**: when a scope preference is active and its family produced no passing
  candidate, say one short line ("Advisor: no in-scope skill matched") instead of emitting nothing,
  so the model knows search space was considered.
- **Benefit**: closes the "did the advisor even run?" ambiguity that the debug line currently
  covers only under `SPECKIT_PI_ADVISOR_DEBUG`
  (`.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:171-191`).
- **Cost**: one template line; bounded by the same token caps.
- **Risk**: brief presence would no longer imply a recommendation — mitigate by wording that
  explicitly carries no route.
- **Verdict: ADOPT** — explicit empty-scope reporting is cheap and removes a real misreading class.

## Ruled out this iteration

- Porting profile/group *management* (the `/skill` manager UI, `~/.pi/agent/skill-profiles`
  storage at `context/pi-skill-orchestrator-main/src/profiles.ts:8`) — configuration UX, not a
  routing mechanism; the advisor's denylist config already covers operator curation.
- Treating the trigger-index/RESOURCE_MAP routers (e.g. `system-spec-kit`'s committed trigger
  index, this skill's `RESOURCE_MAP`) as the advisor's scope model — those are *skill-internal*
  routers invoked after skill load, downstream of the advisor's decision, so they are consumers of
  scope, not producers.

## Claim ledger

| Claim | Status | What would confirm |
|-------|--------|--------------------|
| Profile scope = union of group members; empty profile exposes zero candidates | CONFIRMED | — (`scope.ts:38-45,96-100`, `tests/scope.test.mjs:45,57`) |
| Authorization set replaced per fallback search, cleared on scope change | CONFIRMED | — (`index.ts:602,617-620,196,207`) |
| Advisor has no session/task-scoped preference today | CONFIRMED (absence) | — (scorer lanes carry only prompt-derived evidence; denylist is operator-global) |
| A scope-preference weighting would raise precision on family-adjacent prompts | INFERRED | Offline replay of scored prompts with/without a family prior, measuring top-1/top-2 changes |
| Hub routers select modes downstream of the skill pick | CONFIRMED | — (`advisor-scorer.md:93`, `aliases.ts:148`) |
