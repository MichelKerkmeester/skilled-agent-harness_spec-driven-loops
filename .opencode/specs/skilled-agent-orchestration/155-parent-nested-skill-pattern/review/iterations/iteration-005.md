# Review Iteration 005 — /doctor check script

- **Model**: gpt-5.5-fast xhigh
- **Seat**: r05
- **clean**: False
- **findings**: 3

## Analysis

I’ll treat this as read-only, high-blast because it audits shipped tooling invariants and exit behavior. I’ll load the review/code guidance, inspect only the committed files and route metadata, then spot-run validation without modifying the repo.
SKILL ROUTING: user asked for a formal adversarial code review, so I loaded `sk-code-review`; target paths are under `.opencode/`, so I also loaded `sk-code` as OpenCode surface evidence.
The manifest marks `parent-skill` as `read-only` with no MCP tools. I’m now checking whether the script’s advertised invariant set is actually enforced and whether the router/validator would catch schema drift.
The core script advertises a hard dynamic projection check, but the implementation labels it optional and only compares lexical mappings when Python dumping succeeds. I’m going to verify that with the actual commands before deciding whether it is a reportable defect.
I found two likely non-vacuity gaps in the script logic: it only validates discriminator presence, not allowed values, and its dynamic map check only covers Python lexical mappings. I’ll run the actual checker and route validator now, then use a temporary fixture outside the repo only if needed to confirm the slip.
The live reference passes `parent-skill-check` exit 0 and `route-validate` exit 0; the route validator reports only informational duplicate-flag warnings. The repo is already dirty with unrelated changes; I did not modify files.
I’ll use temporary copies under the approved temp directory to confirm whether the checker passes broken registries. This does not touch the repo files and the temp dirs will be removed in the same command.
The temporary negative tests exposed the non-vacuity problem: all three intentionally broken registries still printed `OK`. The shell cleanup hit zsh’s read-only `$status` variable name, so I’ll remove only those temp dirs I just created and continue.
I have enough for actionable findings. I’ll do one small exit-code sanity check for the missing-target path, then stop tool use and write findings.
Missing-target behavior returns exit 2 as documented. I’ll also confirm a hard invariant break returns exit 1, using a temporary copy with a nested `graph-metadata.json`.
**Findings**

**P0 — Drift cross-check misses the TypeScript alias-fold projection.**  
`.opencode/commands/doctor/scripts/parent-skill-check.cjs:261` only builds the expected projection from `routingClass === 'lexical'`, and `.opencode/commands/doctor/scripts/parent-skill-check.cjs:276` only dumps Python `DEEP_ROUTING_MODE_BY_KEY`. The required TS map includes `deep-improvement -> agent-improvement` at `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:96`, and the drift guard explicitly checks lexical plus alias-fold at `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:86`. I changed the alias-fold mode’s registry `workflowMode` to a broken value in a temp copy, and `parent-skill-check` still printed all PASS/OK. Fix: make the doctor run or replicate the full drift-guard projection checks, including TS lexical+alias-fold and alias/default assertions, and fail hard if the dump/test cannot run.

**P1 — Packet directory validation accepts paths outside the parent skill.**  
The YAML contract says every mode packet resolves to a sub-dir at `.opencode/commands/doctor/assets/doctor_parent-skill.yaml:30`, but the script just does `path.join(target, packet)` and checks that the resulting path is any directory at `.opencode/commands/doctor/scripts/parent-skill-check.cjs:208`. A temp copy with `packet: "../sk-code"` passed all invariants. Fix: resolve the packet path, reject absolute paths and `..`, require `path.dirname(packet) === '.'`, and assert the resolved path is directly under `target`.

**P1 — The “3-tier discriminator” check is mostly presence-only.**  
The registry itself defines constrained values for `runtimeLoopType` and `backendKind` at `.opencode/skills/deep-loop-workflows/mode-registry.json:7`, but the checker only verifies that `workflowMode` and `backendKind` are non-empty strings and that `runtimeLoopType` exists at `.opencode/commands/doctor/scripts/parent-skill-check.cjs:215`. A temp copy with `runtimeLoopType: "nonsense-loop"` and `backendKind: "nonsense-backend"` still passed all invariants. Fix: validate `runtimeLoopType` against the allowed set or null, validate `backendKind` against the declared backend classes, and enforce compatible combinations.

**Verification Notes**

`parent-skill-check` on live `deep-loop-workflows` exited 0. `route-validate.sh` exited 0 with only duplicate-flag warnings, and the `parent-skill` route is declared `read-only` with no MCP tools at `.opencode/commands/doctor/_routes.yaml:157`. Missing target exits 2, and a nested `graph-metadata.json` temp break exits 1.

===REVIEW-JSON===
{"slice":"doctor-parent-skill","findings":[{"severity":"P0","path":".opencode/commands/doctor/scripts/parent-skill-check.cjs:261","issue":"The doctor projection check only covers lexical modes dumped from Python, so TS alias-fold drift such as deep-improvement -> agent-improvement can pass while violating the required registry-to-hardcoded-map invariant.","fix":"Run the drift-guard test directly or implement the full Python lexical plus TypeScript lexical+alias-fold projection comparison, including default/alias assertions, and fail hard when it cannot run.","confidence":"high"},{"severity":"P1","path":".opencode/commands/doctor/scripts/parent-skill-check.cjs:208","issue":"Packet validation accepts escaped paths outside the parent skill; a registry packet like ../sk-code passes even though the route contract requires nested subdirectories.","fix":"Resolve packet paths, reject absolute paths and '..', require a direct child path under the parent, then check that directory exists.","confidence":"high"},{"severity":"P1","path":".opencode/commands/doctor/scripts/parent-skill-check.cjs:215","issue":"The 3-tier discriminator check only verifies presence/non-empty strings, so invalid runtimeLoopType/backendKind values pass despite the registry contract defining allowed values.","fix":"Validate runtimeLoopType and backendKind against the allowed sets and enforce valid combinations per backend class.","confidence":"high"}],"clean":false}
===END===

## Findings (structured)

```json
[
  {
    "severity": "P0",
    "path": ".opencode/commands/doctor/scripts/parent-skill-check.cjs:261",
    "issue": "The doctor projection check only covers lexical modes dumped from Python, so TS alias-fold drift such as deep-improvement -> agent-improvement can pass while violating the required registry-to-hardcoded-map invariant.",
    "fix": "Run the drift-guard test directly or implement the full Python lexical plus TypeScript lexical+alias-fold projection comparison, including default/alias assertions, and fail hard when it cannot run.",
    "confidence": "high"
  },
  {
    "severity": "P1",
    "path": ".opencode/commands/doctor/scripts/parent-skill-check.cjs:208",
    "issue": "Packet validation accepts escaped paths outside the parent skill; a registry packet like ../sk-code passes even though the route contract requires nested subdirectories.",
    "fix": "Resolve packet paths, reject absolute paths and '..', require a direct child path under the parent, then check that directory exists.",
    "confidence": "high"
  },
  {
    "severity": "P1",
    "path": ".opencode/commands/doctor/scripts/parent-skill-check.cjs:215",
    "issue": "The 3-tier discriminator check only verifies presence/non-empty strings, so invalid runtimeLoopType/backendKind values pass despite the registry contract defining allowed values.",
    "fix": "Validate runtimeLoopType and backendKind against the allowed sets and enforce valid combinations per backend class.",
    "confidence": "high"
  }
]
```
