# Review Iteration 010 — Cross-cutting integration

- **Model**: opus-4.8 (claude2)
- **Seat**: r10
- **clean**: False
- **findings**: 3

## Analysis

I now have everything verified. Let me synthesize.

## Cross-cutting integration review — packet 155 (slice r10/10)

I read the real committed artifacts, ran the keystone tests, and ran the doctor check. Here's what holds and what doesn't.

### What is genuinely solid (verified, not by-construction)

- **routingClass set (4) is consistent across all five surfaces.** `lexical | alias-fold | metadata | command-bridge` matches in `mode-registry.json:11` (advisorRoutingContract), the drift-guard `valid` set (`routing-registry-drift-guard.vitest.ts:68`), `parent-skill-check.cjs:39` (`VALID_ROUTING_CLASSES`), `skill_creation.md:1061/1069-1076`, and the reconciled `research.md:17,45`. No divergence on the enum or the cardinalities (Python = 3 lexical, TS = 4 with the alias-fold).
- **The Phase-3 invariants are actually enforced, not just claimed.** I ran them: drift-guard **5/5 pass**, `routing-parity-deep-{council,skills}` **14/14 pass**, `--dump-routing-maps` emits the 3-key lexical projection, `parent-skill-check.cjs` reports **12/12 PASS exit 0**, exactly one `graph-metadata.json` (`skill_id=deep-loop-workflows`, `family=deep-loop` ∈ allowed). Python/TS hardcoded maps equal the registry projection; alias groups match `SKILL_ALIAS_GROUPS`. The keystone is real.
- Benchmark corpus is real (10 fixture files, gold = `deep-loop-workflows` + correct mode); `@markdown` command-map has 2 hits in each of the 3 mirrors; `doctor_parent-skill.yaml` resolves under `assets/` (route uses basenames like every sibling route).

### The single thing most likely to be wrong + the weakest verification claim

**`/create:parent-skill` was never run end-to-end, and its one-identity "enforcement" is weaker than `/doctor`'s — so the scaffolder can mint a skill that fails the very keystone the epic is built on.**

1. **Over-claim (P1).** `checklist.md:90` marks **CHK-061 [P0] "/create enforces the one-identity invariant as a hard gate" `[x]`**, but its evidence (`checklist.md:91`) is only *"`H4_one_identity` gate in both YAMLs + rogue-identity warning in the doc."* That's declarative YAML prose (`create_parent_skill_auto.yaml:204-206`) for an LLM to follow — not executed enforcement. The whole verification chain for `/create` is by-construction: `implementation-summary.md:89` and CHK-021 (`checklist.md:73`) claim only *"YAMLs parse"*; CHK-022 ran `/doctor` against the **pre-existing hand-built** reference (`checklist.md:75`), never against scaffolder output. The scaffold→doctor round-trip that would prove the formalization works was never run. This is the weakest verification claim in the epic.

2. **The concrete bug the never-run round-trip hides (P1).** The scaffolder is told to *"Create exactly one hub graph-metadata.json"* (`create_parent_skill_auto.yaml:272`, `confirm.yaml:308`), but `template_sources` lists only `hub_skill` + `mode_registry` (`auto.yaml:159-161`) — **there is no graph-metadata.json template**, and neither the YAMLs, the templates, nor `skill_creation.md` §10 enumerate the **closed** allowed-family set `{cli,mcp,sk-code,deep-loop,sk-util,system}` (only `parent-skill-check.cjs:35` and `skill-graph-db.ts` list it; §10 just says "family in the allowed set" at `skill_creation.md:1047,1053`). Worse, the two checkers **diverge**: the scaffolder's self-validation only *counts* files (`auto.yaml:330` "assert exactly 1"), whereas `/doctor` validates count **+ `skill_id==folder` + `family∈ALLOWED`** (`parent-skill-check.cjs:146-155`). So a `/create`'d skill whose family isn't one of the six (the natural case for a *new* skill) passes `/create`'s gate and is **born undiscoverable / fails `/doctor` 1c and `skill-graph-db.ts` throws** — and nobody would catch it because the loop was never executed. `/doctor` was even proven to catch bad family (`checklist.md:78`), but `/create` was never proven not to produce it.

3. **Ephemeral "scorecard" (P2).** The commit message, `implementation-summary.md:60`, and CHK-024 (`checklist.md:79`) all describe *"a routing-precision scorecard (3/3 lexical modes)"* as a deliverable, but no scorecard artifact is committed (`find -iname "*scorecard*"` → nothing in this packet). It's a one-time run result, not re-inspectable; and it scores only 3 of the 5 fixture modes (context + agent-improvement fixtures are committed but not exercised by the precision probe — reasonably deferred to the parity fixtures/drift-guard per the fixture `notes`, but the "5 scenario" corpus is only 3/5 actually scored).

No fabricated findings — the routing/registry/discovery core is sound and well-guarded; the weakness is concentrated entirely on the `/create` deliverable, which is verified only by-construction.

===REVIEW-JSON===
{"slice":"cross-cutting integration + most-likely-wrong","findings":[{"severity":"P1","path":".opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/003-formalize-pattern/checklist.md:90","issue":"CHK-061 [P0] '/create enforces the one-identity invariant as a hard gate' marked [x], but evidence is only declarative YAML prose (create_parent_skill_auto.yaml:204-206) + a doc warning; /create:parent-skill was never run end-to-end (verification + CHK-021 claim only 'YAMLs parse'; CHK-022 ran /doctor on the pre-existing hand-built reference, not scaffolder output). The scaffold->doctor round-trip was never executed; this is the weakest verification claim in the epic.","fix":"Downgrade CHK-061 to declarative-only or actually scaffold a throwaway parent skill via /create:parent-skill and run /doctor:parent-skill on the output (the create->doctor loop) before claiming enforcement.","confidence":"high"},{"severity":"P1","path":".opencode/commands/create/assets/create_parent_skill_auto.yaml:159","issue":"Scaffolder must 'Create exactly one hub graph-metadata.json' (auto.yaml:272) but template_sources has no graph-metadata template and no statement of the closed allowed-family set {cli,mcp,sk-code,deep-loop,sk-util,system}; §10 (skill_creation.md:1047,1053) says 'family in the allowed set' without enumerating it. /create's self-validation only counts files (auto.yaml:330) while /doctor also checks skill_id==folder + family-in-allowed (parent-skill-check.cjs:146-155), so a /create'd skill with a non-listed family passes /create yet fails /doctor 1c and makes the hub undiscoverable (skill-graph-db.ts throws). The two checkers diverge on the keystone.","fix":"Add a graph-metadata.json template under sk-doc/assets/skill/ that fixes skill_id==folder and constrains family to the allowed set, enumerate the 6 families in §10, and make /create's step_5 validation also assert skill_id==folder + family-in-allowed so it matches /doctor.","confidence":"high"},{"severity":"P2","path":".opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/003-formalize-pattern/implementation-summary.md:60","issue":"'routing-precision scorecard (3/3 lexical modes)' is described as a deliverable in the commit, impl-summary, and CHK-024, but no scorecard artifact is committed (find -iname '*scorecard*' returns nothing for this packet) — it is ephemeral run output, not re-inspectable; and it scores only 3 of the 5 committed fixture modes.","fix":"Either commit the generated scorecard artifact (or a reproducible command + expected output) under the benchmark corpus, or reword the deliverable as a one-time run result rather than an artifact.","confidence":"high"}],"clean":false}
===END===

## Findings (structured)

```json
[
  {
    "severity": "P1",
    "path": ".opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/003-formalize-pattern/checklist.md:90",
    "issue": "CHK-061 [P0] '/create enforces the one-identity invariant as a hard gate' marked [x], but evidence is only declarative YAML prose (create_parent_skill_auto.yaml:204-206) + a doc warning; /create:parent-skill was never run end-to-end (verification + CHK-021 claim only 'YAMLs parse'; CHK-022 ran /doctor on the pre-existing hand-built reference, not scaffolder output). The scaffold->doctor round-trip was never executed; this is the weakest verification claim in the epic.",
    "fix": "Downgrade CHK-061 to declarative-only or actually scaffold a throwaway parent skill via /create:parent-skill and run /doctor:parent-skill on the output (the create->doctor loop) before claiming enforcement.",
    "confidence": "high"
  },
  {
    "severity": "P1",
    "path": ".opencode/commands/create/assets/create_parent_skill_auto.yaml:159",
    "issue": "Scaffolder must 'Create exactly one hub graph-metadata.json' (auto.yaml:272) but template_sources has no graph-metadata template and no statement of the closed allowed-family set {cli,mcp,sk-code,deep-loop,sk-util,system}; \u00a710 (skill_creation.md:1047,1053) says 'family in the allowed set' without enumerating it. /create's self-validation only counts files (auto.yaml:330) while /doctor also checks skill_id==folder + family-in-allowed (parent-skill-check.cjs:146-155), so a /create'd skill with a non-listed family passes /create yet fails /doctor 1c and makes the hub undiscoverable (skill-graph-db.ts throws). The two checkers diverge on the keystone.",
    "fix": "Add a graph-metadata.json template under sk-doc/assets/skill/ that fixes skill_id==folder and constrains family to the allowed set, enumerate the 6 families in \u00a710, and make /create's step_5 validation also assert skill_id==folder + family-in-allowed so it matches /doctor.",
    "confidence": "high"
  },
  {
    "severity": "P2",
    "path": ".opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/003-formalize-pattern/implementation-summary.md:60",
    "issue": "'routing-precision scorecard (3/3 lexical modes)' is described as a deliverable in the commit, impl-summary, and CHK-024, but no scorecard artifact is committed (find -iname '*scorecard*' returns nothing for this packet) \u2014 it is ephemeral run output, not re-inspectable; and it scores only 3 of the 5 committed fixture modes.",
    "fix": "Either commit the generated scorecard artifact (or a reproducible command + expected output) under the benchmark corpus, or reword the deliverable as a one-time run result rather than an artifact.",
    "confidence": "high"
  }
]
```
