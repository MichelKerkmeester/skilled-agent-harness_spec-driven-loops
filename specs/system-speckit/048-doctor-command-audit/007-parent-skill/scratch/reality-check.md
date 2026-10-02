# Reality check: /doctor:speckit parent-skill

## Result

All route assets, declared scripts, and named reference paths checked below are present. No moved or missing path was observed. The route's fleet metadata gate and the parent-skill audit both passed on this checkout. Their full output is in doctor-run.log:1-75.

The workflow description is behind the checker: the run reports nested description checks and current manifest, root metadata, router contract, and version checks that the YAML does not describe. The checker also accepts transport packets while the YAML lists only workflow and surface. Evidence is in doctor-run.log:30 and 64-71, with the source comparison in doctor-parent-skill.yaml:28-52 and parent-skill-check.cjs:414-416, 1206-1234, 1316-1338, 1358-1386, 1490-1532.

## Route assets and invocations

| Item | Status | Command and observed result |
|---|---|---|
| Router command file: .skilled/commands/doctor/speckit.md | Present | ls -ld .skilled/commands/doctor/speckit.md returned the file, exit 0. The router names the shared presentation file at speckit.md:24-25, 59, 74. |
| Route manifest: .skilled/commands/doctor/_routes.yaml | Present | ls -ld .skilled/commands/doctor/_routes.yaml returned the file, exit 0. The parent-skill entry is at _routes.yaml:118-130. |
| Workflow: .skilled/commands/doctor/assets/doctor-parent-skill.yaml | Present | ls -ld .skilled/commands/doctor/assets/doctor-parent-skill.yaml returned the file, exit 0. The router binds this workflow at speckit.md:52-53. |
| Presentation contract: .skilled/commands/doctor/assets/doctor-speckit-presentation.txt | Present, shared | ls -ld .skilled/commands/doctor/assets/doctor-speckit-presentation.txt returned the file, exit 0. The router identifies this as the single source of user-facing wording at speckit.md:24-25 and 74-80. No target-specific presentation path is named. |
| Fleet metadata gate: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs | Present and ran | ls -ld .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs returned the file, exit 0. Its route invocation and order are in _routes.yaml:125-130. The run reports checked=14, passed=14, failed=0, fixed=0 at doctor-run.log:1-19. |
| Parent audit: .skilled/commands/doctor/scripts/parent-skill-check.cjs | Present and ran | ls -ld .skilled/commands/doctor/scripts/parent-skill-check.cjs returned the file, exit 0. The route invocation is _routes.yaml:130. The run reports all hard invariants passed and 0 warnings at doctor-run.log:20-75. |
| Default parent-skill directory: .skilled/skills/system-deep-loop | Present | ls -ld .skilled/skills/system-deep-loop returned the directory, exit 0. The workflow defaults to it at doctor-parent-skill.yaml:74-80, and the audit resolved it at doctor-run.log:22-23. |
| Workflow reference document: .skilled/skills/sk-doc/sk-create-skill/references/README.md | Present | ls -ld .skilled/skills/sk-doc/sk-create-skill/references/README.md returned the file, exit 0. The workflow names it at doctor-parent-skill.yaml:57-61. |
| Router validation script: .skilled/commands/doctor/scripts/route-validate.sh | Present and ran in normal mode | ls -ld .skilled/commands/doctor/scripts/route-validate.sh returned the file, exit 0. The shared presentation names it at doctor-speckit-presentation.txt:200. The normal run validated 10 routes and exited 0 with two informational duplicate-flag warnings at doctor-run.log:76-103. |
| Router validation implementation: .skilled/commands/doctor/scripts/route-validate.py | Present | ls -ld .skilled/commands/doctor/scripts/route-validate.py returned the file, exit 0. route-validate.sh delegates to it at route-validate.sh:159-164. |

The router document says target resolution is target-first, flags are checked against that target, and the workflow YAML is executed after setup at speckit.md:31-38 and 59-68. The parent-skill target is present in the menu mapping, help row, and subsystem table at doctor-speckit-presentation.txt:18, 36, 60, and 100. The route validator passed target-set parity at doctor-run.log:98-99.

## Script dependencies and tools

| Item | Status | Command and observed result |
|---|---|---|
| Bash, used by the workflow and shared route validator | Present | bash --version \| sed -n "1p" returned GNU bash 3.2.57, exit 0. The YAML names Bash at doctor-parent-skill.yaml:99-101. |
| Node.js, used by both route invocations | Present | node --version returned v26.8.2, exit 0. Both node commands completed with exit 0 at doctor-run.log:1-19 and 20-75. |
| Python 3, used by the parent audit and route validator | Present | python3 --version returned Python 3.9.6, exit 0. The parent audit calls skill_advisor.py with --dump-routing-maps at parent-skill-check.cjs:783-788; its successful cross-check is doctor-run.log:44-45. route-validate.sh also requires Python with PyYAML at route-validate.sh:20-38 and completed at doctor-run.log:76-103. |
| Advisor drift-guard test: .skilled/skills/system-skill-advisor/runtime/tests/routing-registry-drift-guard.vitest.ts | Present | ls -ld .skilled/skills/system-skill-advisor/runtime/tests/routing-registry-drift-guard.vitest.ts returned the file, exit 0. The checker names it at parent-skill-check.cjs:82-86 and reports it present at doctor-run.log:44. |
| Advisor CLI source: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | Present | ls -ld .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py returned the file, exit 0. The checker names it at parent-skill-check.cjs:88-92 and reports the routing-map comparison passed at doctor-run.log:45. |
| Skill-root metadata contract: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs | Present | ls -ld .skilled/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs returned the file, exit 0. The checker resolves and loads this contract at parent-skill-check.cjs:1316-1338; its result passed at doctor-run.log:68. |
| Root-router contract: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs | Present | ls -ld .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs returned the file, exit 0. The checker resolves and loads this contract at parent-skill-check.cjs:1369-1386; its result passed at doctor-run.log:69. |
| Leaf-manifest generator: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs | Present | ls -ld .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs returned the file, exit 0. The parent checker regenerated the manifest in memory and reported a byte match at doctor-run.log:64-67. |
| Fleet-check support contracts: leaf-resource-contract.cjs and command-metadata-schema.cjs under .skilled/skills/sk-doc/sk-create-skill/scripts/lib | Present | Each ls -ld command returned its file, exit 0. The fleet checker imports them at ci-skill-root-metadata.cjs:49-55 and completed with 14 passes at doctor-run.log:18-19. |

The route entry has no cli_commands field and sets mcp_tools to an empty list, so this target declares no MCP tool or advisor CLI command. The entry and its two script invocations are at _routes.yaml:118-130; route validation confirms the MCP tool subset at doctor-run.log:94-95.

## Flags, inputs, and environment

| Item | Status | Command and observed result |
|---|---|---|
| Target flag --dir=<path> | Present in route declaration | nl -ba .skilled/commands/doctor/_routes.yaml \| sed -n "118,138p" shows it at line 121. route-validate.sh accepted the manifest and emitted only an informational duplicate --dir warning at doctor-run.log:79, 86-103. The workflow maps parent_skill_dir to the audit script's first positional argument at doctor-parent-skill.yaml:79-80. The shell run exercised that positional mapping, not the slash-command flag parser. |
| Router controls list, ?, --list, and --target=<name> | Present in the router contract | nl -ba .skilled/commands/doctor/speckit.md \| sed -n "59,68p" shows the controls at line 61. Their slash-command parsing is documented, not separately executable in this shell audit. |
| execution_mode | Present as a workflow input, not an environment variable | nl -ba .skilled/commands/doctor/assets/doctor-parent-skill.yaml \| sed -n "66,80p" shows INTERACTIVE and the directory mapping. The router independently states that execution_mode is always INTERACTIVE at speckit.md:31-35. |
| parent_skill_dir | Present as a workflow input, not an environment variable | The default directory exists and the positional argument was passed in the actual command at doctor-run.log:20-23. The input and default are at doctor-parent-skill.yaml:66-80. |
| PARENT_HUB_CHECK_STRICT | Present and read by the checker | The checker reads it at parent-skill-check.cjs:102-106 and routes advisory findings through softFail at lines 133-137. The workflow describes only a checks 5-9 override at doctor-parent-skill.yaml:42-52, which is narrower than the code. The exact command printenv PARENT_HUB_CHECK_STRICT returned no output and exit 1. The actual run therefore reported the strict default at doctor-run.log:24. |
| MCP tools | None declared | nl -ba .skilled/commands/doctor/_routes.yaml \| sed -n "118,138p" shows mcp_tools: [] at line 124. No MCP command was run because the route names none. |

AI_SESSION_CHILD and SYSTEM_SPEC_GATE_ENFORCE do not appear in the route entry, workflow YAML, or shared presentation. The exact command rg -n "AI_SESSION_CHILD|SYSTEM_SPEC_GATE_ENFORCE" .skilled/commands/doctor/_routes.yaml .skilled/commands/doctor/assets/doctor-parent-skill.yaml .skilled/commands/doctor/assets/doctor-speckit-presentation.txt returned no matches, exit 1.

## Checks against the default parent skill

The exact command for these checks is node .skilled/commands/doctor/scripts/parent-skill-check.cjs ".skilled/skills/system-deep-loop"; it is recorded at doctor-run.log:20. Each named condition below passed on that command:

| Named paths or invariant | Observed result |
|---|---|
| Root graph-metadata.json identity and no nested graph-metadata.json | PASS at doctor-run.log:26-29. |
| No nested description.json, mode-registry.json, registered packet directories, packet SKILL.md and README.md files, packet changelog directories, and mode fields | PASS at doctor-run.log:30-40. The target declares five modes and no surface packets at doctor-run.log:32 and 41; all five mode entries use packetKind workflow in system-deep-loop/mode-registry.json:35, 59, 83, 107, and 133. |
| Advisor routing drift guard and live routing-map command | PASS at doctor-run.log:44-45. |
| hub-router.json, vocabulary classes, resource paths, tie-break order, bundle rules, and default mode | PASS at doctor-run.log:46-55. |
| Registered child directories, hub mode table, hub changelog, and description.json | PASS at doctor-run.log:56-61. |
| manual-testing-playbook/ and benchmark/ baseline | PASS at doctor-run.log:62-63. |
| leaf-manifest.json source, byte freshness, collision checks, and registry reachability | PASS at doctor-run.log:64-67. |
| Root metadata class, root ROUTER.md contract, and routing-artifact versions against SKILL.md and changelog | PASS at doctor-run.log:68-71. |

The workflow YAML names only the first set of these checks through the playbook and benchmark conditions at doctor-parent-skill.yaml:28-48. The later manifest, root metadata, ROUTER.md, and version checks are observed in the current run at doctor-run.log:64-71. The checker source implements those checks at parent-skill-check.cjs:1206-1234, 1316-1338, 1358-1386, and 1490-1532.

## Run-log handling

doctor-run.log contains the complete, untrimmed output and exit code for both route-declared invocations, followed by the normal-mode route validator command and its full output. No script was run with --fix, --write, or --self-test. The fleet checker documents that --fix writes generated manifests at ci-skill-root-metadata.cjs:28-43, while the executed command omits it at doctor-run.log:1. The route validator's temporary fixture writes belong only to --self-test at route-validate.sh:42-50; the executed command has no such flag at doctor-run.log:76.
