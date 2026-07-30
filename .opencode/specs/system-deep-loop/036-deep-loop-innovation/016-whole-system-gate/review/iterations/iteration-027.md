# Iteration 027 — traceability

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T08:16:42.342Z
- New findings: 2 (of 2 reported; prior total 106)
- Coverage: {"filesExamined":30,"keyPaths":[".opencode/skills/system-deep-loop/mode-registry.json",".opencode/skills/system-deep-loop/hub-router.json",".opencode/skills/system-deep-loop/leaf-manifest.json",".opencode/skills/system-deep-loop/shared/references/smart-routing.md",".opencode/skills/system-deep-loop/SKILL.md",".opencode/skills/system-deep-loop/command-metadata.json",".opencode/commands/deep/command-benchmark.md",".opencode/skills/system-deep-loop/deep-alignment/SKILL.md",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs",".opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs",".opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/harness/build-artifacts.cjs",".opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/canary-router.cjs",".opencode/commands/doctor/scripts/parent-skill-check.cjs"]}

## Summary
Current seven registry modes resolve to existing packets, commands, agents, and manifest leaves, and the structural checker passes. The supported `/deep:command-benchmark` alias is declared by the registry and alignment packet but is absent from hub vocabulary, so legacy replay and compiled routing defer it. The compiled registry compiler validates resource strings without resolving packet SKILL files or leaf paths; in-memory probes compiled nonexistent packet and leaf targets. No known finding was refuted in this iteration.

## Findings
- [P1] F-027-01 Supported command alias is absent from the hub route vocabulary @ .opencode/skills/system-deep-loop/hub-router.json:72
  - evidence: `mode-registry.json:192` declares `/deep:command-benchmark` as an alignment alias, while `deep-alignment/SKILL.md:35,356` and `command-metadata.json:332-376` treat it as a supported launcher. `hub-router.json:71-73` omits the command, and the compiler derives live vocabulary only from hub-router classes. The read-only vocabulary check reports the alias as orphaned; replay and compiled canary both defer the exact command prompt.
  - recommendation: Add the specialized command to the typed alignment routing projection, or model it as an explicit command subworkflow with an alignment owner, then regenerate and verify both routing paths.
- [P1] F-027-02 Compiled routing accepts packet and leaf identities without resolving them on disk @ .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs:349
  - evidence: `compileManifestResources()` only checks leaf values with `assertString` at lines 349-353 and constructs `${mode.packet}/${leafResourceId}` at lines 362-365; `compileRegistry()` invokes it at lines 538-543. The build harness supplies registry, router, manifest, and smart-routing bytes but no packet SKILL bytes. An in-memory probe replacing the research packet with nonexistent `deep-ghost` and a leaf with `references/protocol/__missing__.md` still compiled, producing a nonexistent packet destination and missing leaf.
  - recommendation: Require every registry packet SKILL file and selected packet-relative leaf to exist and pass safe-path validation before compilation; bind their bytes or digests into source identity.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 27,
  "dimension": "traceability",
  "summary": "Current seven registry modes resolve to existing packets, commands, agents, and manifest leaves, and the structural checker passes. The supported `/deep:command-benchmark` alias is declared by the registry and alignment packet but is absent from hub vocabulary, so legacy replay and compiled routing defer it. The compiled registry compiler validates resource strings without resolving packet SKILL files or leaf paths; in-memory probes compiled nonexistent packet and leaf targets. No known finding was refuted in this iteration.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Supported command alias is absent from the hub route vocabulary",
      "file": ".opencode/skills/system-deep-loop/hub-router.json",
      "line": 72,
      "evidence": "`mode-registry.json:192` declares `/deep:command-benchmark` as an alignment alias, while `deep-alignment/SKILL.md:35,356` and `command-metadata.json:332-376` treat it as a supported launcher. `hub-router.json:71-73` omits the command, and the compiler derives live vocabulary only from hub-router classes. The read-only vocabulary check reports the alias as orphaned; replay and compiled canary both defer the exact command prompt.",
      "recommendation": "Add the specialized command to the typed alignment routing projection, or model it as an explicit command subworkflow with an alignment owner, then regenerate and verify both routing paths."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Compiled routing accepts packet and leaf identities without resolving them on disk",
      "file": ".opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs",
      "line": 349,
      "evidence": "`compileManifestResources()` only checks leaf values with `assertString` at lines 349-353 and constructs `${mode.packet}/${leafResourceId}` at lines 362-365; `compileRegistry()` invokes it at lines 538-543. The build harness supplies registry, router, manifest, and smart-routing bytes but no packet SKILL bytes. An in-memory probe replacing the research packet with nonexistent `deep-ghost` and a leaf with `references/protocol/__missing__.md` still compiled, producing a nonexistent packet destination and missing leaf.",
      "recommendation": "Require every registry packet SKILL file and selected packet-relative leaf to exist and pass safe-path validation before compilation; bind their bytes or digests into source identity."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 30,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/mode-registry.json",
      ".opencode/skills/system-deep-loop/hub-router.json",
      ".opencode/skills/system-deep-loop/leaf-manifest.json",
      ".opencode/skills/system-deep-loop/shared/references/smart-routing.md",
      ".opencode/skills/system-deep-loop/SKILL.md",
      ".opencode/skills/system-deep-loop/command-metadata.json",
      ".opencode/commands/deep/command-benchmark.md",
      ".opencode/skills/system-deep-loop/deep-alignment/SKILL.md",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs",
      ".opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs",
      ".opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/harness/build-artifacts.cjs",
      ".opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/canary-router.cjs",
      ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
    ]
  }
}
```