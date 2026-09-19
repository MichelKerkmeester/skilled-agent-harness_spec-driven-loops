# Verification of the SWE-2-max drift review

Dispatch: `devin -p --model swe-2-max --permission-mode dangerous` (read-only brief), 2026-09-19, exit 0.
Brief: `scratch/devin-swe2-drift-brief.md`. Return: `scratch/devin-swe2-drift-advice.md`.

## Scope check — what the delegate wrote

Exactly one file, the return it was authorized to write. It also correctly observed and excluded an
unrelated uncommitted tree: `.skilled/skills/mcp-tooling/` is another session's live work on a new
`mcp-orca-cli` packet (`specs/mcp-tooling/021-mcp-orca-cli/`, writes spanning 13:24–14:25 local, i.e.
still moving while this review ran). No hub file changed as a result of this dispatch.

## Citations opened and confirmed

| Claim | Opened | Result |
|---|---|---|
| `model-benchmark-aliases` carries bare phrases | `system-deep-loop/hub-router.json:62` (key at `:61`) | `["/deep:model-benchmark", "model benchmark", "benchmark a model"]` — confirmed |
| The hub's own surface router narrows it to the command | `system-deep-loop/ROUTER.md:76` | `"MODEL_BENCHMARK": {"weight": 4, "keywords": ["/deep:model-benchmark"]}` — confirmed |
| Registry marks the lane command-routed | `system-deep-loop/mode-registry.json:150` (key at `:149`) | `"routingClass": "command-bridge"` — confirmed |
| Sibling scenario already forbids the bare-alias fire | `improvement-lane-routing/model-benchmark.md:84` | `FAIL: the lane fires from a bare advisor alias` — confirmed |
| This over-route class was seen before | `002-system-deep-loop/lib/canary-router.cjs:18-22` | comment names "over-routing: a command-bridge mode -- model-benchmark -- fired on a bare natural-language registry alias" — confirmed |
| Mode hint is documented, and `clarify`/`defer` are terminal | `system-deep-loop/SKILL.md:45,73,89` | hint overrides classification; `clarify`/`defer` = disambiguate — confirmed |
| `explicitMode` exists but nothing parses a prefix | `002-system-deep-loop/lib/canary-router.cjs:229,283` | `explicitModeMatches` + `input.explicitMode` branch — confirmed |
| sk-doc defers hub-naming prompts by contract | `sk-doc/hub-router.json:45-47` | `discoveryClassesContract`: referenced by NO mode's scoring classes — confirmed |
| The 14-mode fan-out is capped | `007-sk-doc/lib/registry-compiler.cjs:326` | `maximumIntents = max(bundleRules.whenAll.length)` — mechanism confirmed, value 3 not independently computed |
| SD-015 encodes a stage-2 intent as a stage-1 mode | `sk-doc/ROUTER.md:163` (+126-129) | `FULL_INVENTORY` is a stage-2 intent with its own keywords — confirmed |
| `full_inventory_intent` is read by the topology gate | `sk-create-skill/scripts/validate-playbook-topology.cjs:155` | parsed there — confirmed |
| Drift pins activation | `015-router-unification-program/shared/admission-gate.cjs:38-50` | `assertAdmissionPasses` shells the admission checker and requires a pass — confirmed |

## Reproduced independently

`node .skilled/bin/compiled-route-admission.cjs --all --json`: **66 pass, 5 n/a, 4 drift, 0 stale-gold**;
holdouts **19 pass / 1 drift**. The four drifts are exactly SD-H02 and SD-015 (`silent-defer`),
AI-003 (`unsafe-route`), MO-004 (`silent-defer`) — the delegate's counts and each reason are correct.

## Not verified — its claims, to be proven at fix time

The in-memory decision flips (removing the two aliases → AI-003 defers, IL-002 still routes; the
`expected_workflow_mode: UNKNOWN` → SD-015 passes), the `effectivePolicyHash` delta
`839b6f0c…→3f0d9d85…`, the `maximumIntents` value of 3, and every cost estimate. Whether the registry's
own `aliases` (projected as `aliasProjections`, `registry-compiler.cjs:210,634-654`) also reach scoring is
unproven; if they do, the AI-003 fix must touch the registry too.

## Corrections to my own record

- `validate-playbook-topology.cjs` **does** exist, at `sk-create-skill/scripts/`, documented as the
  pre-dispatch typed-gold gate. My earlier session statement that no topology validator gates those gold
  fields was wrong. The SD-015 gold rebuild remains correct, but its rationale ("nothing gates it") was not.
- One lens, not a finding: this is a single model's verdict. My own reading is a second look at the same
  evidence, not a second family. Nothing here closes the question until the operator decides.
