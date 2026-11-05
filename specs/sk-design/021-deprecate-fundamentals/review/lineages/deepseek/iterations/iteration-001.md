# Deep Review Iteration 1: Correctness

## Dimension

Correctness. Scope: does the retirement actually hold on disk, in routing, and in the compiled
router contract, and does a value or visual-review request now reach the guidance it needs?

## Review Focus Addressed

Operator focus, first half: the retirement went in this worktree against baseline `10474a9567`.
This iteration checks the hub cut (three modes, no default), dangling references to the deleted
folder, and routing reach for the value and visual-review vocabulary that the deleted mode
published. Lost guidance and chart-citation accuracy are carried to iterations 3 and 5.

## Files Reviewed

- `specs/sk-design/021-deprecate-fundamentals/spec.md` (scope, phase map, handoff criteria)
- `.skilled/skills/sk-design/mode-registry.json` (three modes, no commands on the removed mode)
- `.skilled/skills/sk-design/hub-router.json` (defaultMode null, tie-break, vocabulary classes)
- `.skilled/skills/sk-design/ROUTER.md` (three intents, values and review rows gone)
- `.skilled/skills/sk-design/SKILL.md` (three-mode table, defer-on-no-signal wording)
- `.skilled/skills/sk-design/graph-metadata.json` (top-level and derived signal sets)
- `.skilled/skills/sk-code/hub-router.json` (new `code-frontend-visual` class)
- `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md` (new stage-two intents)
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/fixtures/canary-cases.v1.json`
- `.skilled/agents/design.md` plus the `.claude`, `.codex`, `.pi`, `.hermes` mirrors (spot-checked)
- `specs/sk-design/021-deprecate-fundamentals/review/lineages/deepseek/steer.md` (absent; no lead ruling)

Command evidence used:

- `git diff --stat 10474a9567` (110 files, 46,711 insertions, 52,217 deletions)
- `git status --porcelain` (10 untracked paths, including this packet and the new references)
- `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "<prompt>"` for six prompts
- `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "<prompt>"` for twelve prompts
- `grep -rn "sk-design-fundamentals"` over `.skilled`, `.claude`, `.codex`, `.hermes`, `.pi`,
  `.opencode` and `README.md` (hits remain only in historical changelogs, the dated benchmark
  report, retrieval fixtures, and the untracked packet)

## Findings by Severity

### P0 Findings

None. No destructive or security-critical correctness failure is reachable in this doc-and-routing
change set.

### P1 Findings

1. **Visual-review vocabulary never reaches the frontend surface** -- `.skilled/skills/sk-code/hub-router.json:90` -- The new class documents `design review findings` and `review this screen` as frontend visual-intent phrases, and stage two repeats `design review findings`, but replaying the exact phrases sends a visual-review request to `sk-code-review` alone. The retired `design-review` vocabulary has no working replacement at the hub route.
   Case: a user asks "design review of this pricing page" or "design review findings" after the
   fundamentals mode is removed. `compiled-route --hub sk-code` answers
   `single -> sk-code-review` with no `sk-code-frontend` target, so `web-visual-hierarchy.md`,
   the file that holds the review pass, is not loaded.
   Finding class: cross-consumer
   Scope proof: `grep -n 'design review findings'` hits `.skilled/skills/sk-code/hub-router.json:90`
   and `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md:48`; the replay of "review this screen"
   returns `surfaceBundle [sk-code-review, sk-code-frontend]`, proving the surface can bundle when
   its phrase wins, while the two documented `design review` phrases do not.
   Affected surface hints: ["sk-code hub-router", "sk-code-frontend ROUTER", "compiled-route", "web-visual-hierarchy"]
   Claim adjudication: {"type":"finding","claim":"The documented visual-review phrases do not reach sk-code-frontend; the route resolves to sk-code-review alone.","evidenceRefs":[".skilled/skills/sk-code/hub-router.json:90",".skilled/skills/sk-code/sk-code-frontend/ROUTER.md:48","command:compiled-route --hub sk-code --prompt 'design review findings'","command:compiled-route --hub sk-code --prompt 'design review of this pricing page'"],"counterevidenceSought":"Tried the exact phrase in the frontend ROUTER and the shorter legacy alias, plus a phrase that does bundle ('review this screen'); the bundle works only for the phrase that matches no review-class keyword.","alternativeExplanation":"The tie-break may intentionally prefer the code-review workflow and expect it to load frontend evidence itself. Rejected because the packet contract says a surface is bundled beside review when the request needs visual review, and the compiled decision for the same family ('review this screen') does bundle it.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"Downgrade to P2 if the sk-code-review workflow is shown to load web-visual-hierarchy.md for every UI review regardless of the hub route."}

### P2 Findings

2. **Graph metadata still advertises the retired values vocabulary** -- `.skilled/skills/sk-design/graph-metadata.json:178` -- `derived.intent_signals` keeps ten phrases from the deleted mode (`ui looks off`, `make this look better`, `spacing scale`, `build a color palette`, `visual hierarchy`, `contrast ratio failure`, `focus ring accessibility`, `animation duration`, `accessibility review`, `design review findings`) while the phase summary says the fundamentals and slides/print phrases were removed.
   Case: a metadata consumer, dashboard, or future advisor path reads `derived.intent_signals`
   and treats `sk-design` as the owner of "spacing scale" or "ui looks off". The current advisor
   reads the top-level `intent_signals` (111, clean) and `derived.trigger_phrases`
   (`skill_advisor.py:1358-1366`), so no live route is wrong today.
   Finding class: instance-only
   Scope proof: `grep -n` over the file shows the ten phrases only in `derived.intent_signals`;
   the top-level array has none of them, and `derived.trigger_phrases` has none.
   Affected surface hints: ["sk-design graph metadata", "advisor metadata consumers"]
   Recommendation: rebuild `derived.intent_signals` from the three surviving modes, or drop the
   field if no consumer reads it.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | `spec.md:101` requires the folder deleted and the hub cut to three modes; the folder is gone and `mode-registry.json` lists three modes. The routing half is partial because finding 1 leaves a documented visual-review phrase outside the frontend surface. |
| `checklist_evidence` | core | pending | Acceptance evidence is audited in iteration 2. |
| `skill_agent` | overlay | pass (iteration 1 slice) | `.skilled/agents/design.md:70` routes the decide path to the sk-code-frontend references; mirrors at `.claude/agents/design.md`, `.codex/agents/design.toml`, `.pi/agents/design.md` and `.hermes/skills/agent-design/SKILL.md` carry the same wording. |
| `agent_cross_runtime` | overlay | pass (iteration 1 slice) | The four mirrors' descriptions and decide-path paragraphs match the canonical agent text. |

## Edge Cases

- `sk-design` with no signal now defers instead of falling to a default; the replay returns
  `defer` for "run the deployment pipeline" and for "what padding should this card have". The
  second is correct under the new contract because the frontend hub owns the value, but it means
  a caller that sends a value prompt straight to `compiled-route --hub sk-design` gets no target.
- The dated benchmark report under `sk-design/benchmark/reports/2026-09-27-...` still names the
  retired mode. It is an archived measurement record, explicitly out of scope in `spec.md:90`.
- The retrieval fixtures and `trigger-index.json` still contain fundamentals strings because they
  index historical spec folders; they are generated corpus data, not live routing.

## Confirmed-Clean Surfaces

- `.skilled/skills/sk-design/sk-design-fundamentals/` is absent; `git status` shows the folder's
  files deleted and `.hermes/skills/sk-design-fundamentals/` is absent too.
- `sk-design` `mode-registry.json` has three modes and no default; `hub-router.json` sets
  `defaultMode: null` and the tie-break lists three modes.
- `sk-design` `ROUTER.md` and `SKILL.md` consistently say three intents / three modes, and the
  no-signal outcome is defer.
- `compiled-route --hub sk-design` routes "create a chart of revenue by quarter" to
  `sk-design-chart` and defers value prompts; the canary `out-of-domain-defer` expects `defer`.
- `registry-compiler.cjs` no longer carries `VALUES` or `REVIEW` in `INTENT_MODE_OWNERS`; the
  authored copy under `specs/sk-doc/z_archive/.../009-sk-design/` is byte-identical to the served
  copy.
- `compiled-route --hub sk-code` routes the four value prompts tested this iteration (padding,
  looks amateur, animation duration, design critique) to `sk-code-frontend`.

## Ruled Out

- **A leftover live path to the deleted folder.** Ruled out by a repository-wide grep; remaining
  hits are historical changelogs, the dated benchmark report, retrieval corpus fixtures, and the
  untracked packet.
- **A stale default mode in `sk-design`.** Ruled out by `hub-router.json` (`defaultMode: null`) and
  by the compiled replay, which returns `defer` for a no-signal prompt.
- **A missing compiler change on the authored copy.** Ruled out by a byte comparison of the
  served and archived `registry-compiler.cjs`.

## Next Focus

Dimension: traceability. Check the phase acceptance criteria against the evidence actually
observable in the worktree, including the changelogs, the modified-file tables, the chart rule
groups and the validation claims. Reason: iteration 1 found the routing half of the handoff
criterion only partially met, so the recorded acceptance evidence needs the same scrutiny.

Review verdict: CONDITIONAL
