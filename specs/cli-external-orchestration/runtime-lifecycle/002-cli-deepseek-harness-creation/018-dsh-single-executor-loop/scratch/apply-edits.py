"""Search-and-replace edits for the single dsh lineage change.

Usage:
  python3 -I edits.py apply <root>   apply every edit to a tree, failing if a search text is not unique
  python3 -I edits.py count <root>   print the count of every search text in a tree
  python3 -I edits.py emit <out.md>  write the plan.md edit blocks
"""
import os
import subprocess
import sys

AUDIT = '.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts'
REVIEW = '.skilled/commands/deep/assets/deep-review-auto.yaml'
RESEARCH = '.skilled/commands/deep/assets/deep-research-auto.yaml'
RPRES = '.skilled/commands/deep/assets/deep-review-presentation.txt'
SPRES = '.skilled/commands/deep/assets/deep-research-presentation.txt'
FDOC = '.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/fanout-executor.md'
RTEST = '.skilled/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts'
CTEST = '.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts'

OLD_DSH_BRANCH = """        if_cli_deepseek_harness:
          command: |
            node --input-type=module <<'EOF'
            console.error('cli-deepseek-harness runs only as a fan-out lineage; rerun with --count=2 or a second --executor group, or choose another executor kind');
            process.exit(2);
            EOF
          working_directory: "{repo_root}"
          wait_for_completion: true
          notes:
            - "Fails closed before any dispatch receipt is written; the pre_dispatch_audit provenance row for the attempted executor remains"
"""


def new_dsh_branch(agent, dispatch_id):
    return """        if_cli_deepseek_harness:
          command: |
            node --import "$(node -p "require.resolve('tsx', { paths: ['.skilled/skills/system-deep-loop/runtime'] })")" --input-type=module <<'EOF'
            import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
            import { createRequire } from 'node:module';
            import os from 'node:os';
            import path from 'node:path';
            import { runAuditedExecutorCommand } from './.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts';
            import { resolveSandboxMode, resolveClaudePermissionMode } from './.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts';
            import {
              snapshotOutOfScopeDirtyPaths,
              enforceWriteContainment,
            } from './.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts';

            // The command builder is the one the fan-out lineage path uses, so the pinned harness
            // release, the model allowlist, the route, lineage and guards patches and the
            // headless write flags stay one source of truth. It throws (fail closed) when the
            // harness binary is absent or off its pinned release, or the model is off the
            // allowlist, so a requested harness executor never becomes native.
            // No line of this heredoc names the harness binary as a bare word. The ancestry
            // recursion guard reads every ancestor command line, the shell running this step
            // carries the heredoc text, and such a word would refuse the dispatch as nested.
            const require = createRequire(import.meta.url);
            const { buildLineageCommand, withAgentPersona, validateDshCompletion } = require('./.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs');

            const kind = '{config.executor.kind}';
            const model = '{config.executor.model}' === 'null' ? null : '{config.executor.model}';
            const timeoutSeconds = Number('{config.executor.timeoutSeconds}');
            // The iteration must write its own iteration file, delta and state record,
            // so the leaf runs workspace-write.
            const sandboxMode = 'workspace-write';
            const reasoningEffort = '{config.executor.reasoningEffort}' === 'null' ? null : '{config.executor.reasoningEffort}';
            const lineage = { kind, model, sandboxMode, reasoningEffort };
            const resolvedSandbox = resolveSandboxMode(sandboxMode);
            const resolvedPermission = resolveClaudePermissionMode(sandboxMode);

            const repoRoot = '{repo_root}';
            const artifactDir = '{artifact_dir}';
            // The prompt pack says every path is relative to the repo root and calls the append
            // gateway by a repo-relative path, but the harness starts in the artifact folder, so
            // the prompt names the root and tells the leaf to run commands from it.
            const promptBody = 'REPOSITORY ROOT: ' + repoRoot + '. Resolve every relative path in this prompt against it and run every command as `cd ' + repoRoot + ' && <command>`.\\n\\n'
              + withAgentPersona('%(agent)s', readFileSync('{state_paths.prompt_dir}/iteration-{current_iteration}.md', 'utf8'), repoRoot);
            // The headless harness reads <cwd>/.env and the repository root holds one, so the
            // builder starts it in the artifact folder and the dispatch runs from the cwd it returns.
            const { command, args, input, cwd } = buildLineageCommand(
              lineage,
              promptBody,
              resolvedSandbox,
              resolvedPermission,
              { env: process.env, cwd: repoRoot, lineageDir: artifactDir, repoRoot },
            );

            const executor = {
              kind,
              model,
              configDir: null,
              reasoningEffort,
              serviceTier: null,
              sandboxMode,
              timeoutSeconds,
              governor: null,
            };
            const dispatchId = '%(dispatch_id)s';
            // The step timeout equals the executor timeout, so the child gets a shorter one. An
            // outer kill while the child still runs would skip the finally block and strand the home.
            const dispatchTimeoutSeconds = Math.max(Math.ceil(timeoutSeconds / 2), timeoutSeconds - 30);
            const preDispatchDirtyPaths = snapshotOutOfScopeDirtyPaths({ repoRoot, artifactDir });
            // The harness writes profiles and an anonymous id into its home, so every run gets
            // a fresh one outside the checkout, removed once the run settles. The env allowlist
            // drops every DSH_ key, so the home and the absolute spec folder the repo-guards goal
            // bridge reads ride in dispatchEnv. DSH_HOME on this process would instead trip the
            // nested-dispatch guard.
            const dshHome = mkdtempSync(path.join(os.tmpdir(), 'dsh-home-'));
            let dispatchExit;
            try {
              dispatchExit = runAuditedExecutorCommand({
                command,
                args,
                cwd,
                timeoutSeconds: dispatchTimeoutSeconds,
                stateLogPath: '{state_paths.state_log}',
                executor,
                iteration: Number('{current_iteration}'),
                input,
                receiptDir: '{state_paths.packet_dir}/dispatch-receipts',
                dispatchId,
                dispatchEnv: {
                  DSH_HOME: dshHome,
                  DSH_SPEC_FOLDER: path.resolve(repoRoot, '{spec_folder}'),
                  // The leaf has no user turn to answer the spec gate, and ENFORCE=0 alone only
                  // stops the deny, so DISABLED makes classify and enforce no-ops, as in fan-out.
                  SYSTEM_SPEC_GATE_DISABLED: '1',
                  AI_SESSION_CHILD: '1',
                },
                // The harness can exit 0 after a guard plugin failed to load, so its event
                // stream and stderr are judged as well as its exit code.
                completionCheck: validateDshCompletion,
              });
            } finally {
              rmSync(dshHome, { recursive: true, force: true });
            }
            const containment = enforceWriteContainment({
              repoRoot,
              artifactDir,
              preDispatchDirtyPaths,
              stateLogPath: '{state_paths.state_log}',
              iteration: Number('{current_iteration}'),
              label: dispatchId,
            });
            if (containment.violations.length > 0) {
              console.error(
                'write-containment advisory: detected ' + containment.violations.length
                  + ' out-of-scope path(s), left on disk: '
                  + containment.violations.map((v) => v.path).join(', '),
              );
            }
            // A path that was already dirty before the dispatch and changed during it is held out of
            // violations. enforceWriteContainment records it in the state log as containment_contested;
            // this prints it so the run's own output says so too.
            if (containment.contested.length > 0) {
              console.error(
                'write-containment contested: ' + containment.contested.length
                  + ' path(s) already dirty before the dispatch changed during it, left on disk: '
                  + containment.contested.map((v) => v.path).join(', ')
                  + '\\n' + containment.contestedNote,
              );
            }
            process.exit(dispatchExit);
            EOF
          working_directory: "{repo_root}"
          timeout_seconds: "{config.executor.timeoutSeconds}"
          wait_for_completion: true
          notes:
            - "cli-deepseek-harness single-executor: builds through the shared fan-out command builder (buildLineageCommand), so the pinned harness release, the model allowlist and the route, lineage and guards patches stay one source of truth. runAuditedExecutorCommand emits INTENT + COMPLETION receipts"
            - "The harness starts in the artifact directory, never the repository root, with a fresh DSH_HOME outside the checkout. DSH_HOME, DSH_SPEC_FOLDER, SYSTEM_SPEC_GATE_DISABLED and AI_SESSION_CHILD reach the child through dispatchEnv, and the home is removed in a finally block"
            - "The prompt opens with a REPOSITORY ROOT line, because the prompt pack's paths and gateway call are repo-relative while the harness starts in the artifact directory"
            - "The child timeout is 30 s under the step timeout (at least half of it), so the finally block removes the home before any outer kill"
            - "validateDshCompletion judges a clean exit, so a plugin that did not activate or a missing final event records a crash dispatch_failure"
            - "Fails closed when the harness binary is absent, off its pinned release or the model is off the allowlist (buildLineageCommand throws, exit non-zero). A requested cli-deepseek-harness executor never degrades to native"
            - "The command text never names the harness binary as a bare word, because the ancestry recursion guard reads the parent shell's command line"
""" %{'agent': agent, 'dispatch_id': dispatch_id}


NEW_DSH_NOTE = '            - "cli-deepseek-harness has its own single-executor branch, if_cli_deepseek_harness above, built through the same buildLineageCommand. Fan-out also runs the kind"\n'

PRES_KIND_OLD = '`cli-deepseek-harness`, the last one fan-out only;'
PRES_KIND_NEW = '`cli-deepseek-harness`, the last one a single lineage in `:auto` or a fan-out;'
PRES_H_OLD = '(experimental, explicit choice only, fan-out only)'
PRES_H_NEW = '(experimental, explicit choice only)'
PRES_SHAPE_OLD = 'a single-executor run exits 2, so give it a fan-out shape such as `--executor=cli-deepseek-harness --model=deepseek-v4.1-flash --count=2`.'
PRES_SHAPE_NEW = 'a single lineage such as `--executor=cli-deepseek-harness --model=deepseek-v4.1-flash` runs in `:auto` through the shared fan-out command builder, and a fan-out shape such as `--count=2` also works.'

EDITS = [
    {
        'id': 'E1', 'file': AUDIT,
        'purpose': 'Add the optional `dispatchEnv` and `completionCheck` fields to `RunAuditedExecutorCommandInput`.',
        'search': "  receiptDir?: string;\n  dispatchId?: string;\n};\n",
        'replace': (
            "  receiptDir?: string;\n"
            "  dispatchId?: string;\n"
            "  // For the cli-deepseek-harness single-lineage branch only: its fresh harness home and\n"
            "  // spec-folder marker are keys the per-kind allowlist drops on purpose. They are merged\n"
            "  // after the filter, so only the values the caller names reach the child, never an\n"
            "  // inherited one. Another kind that needs a key widens its allowlist instead. Only the\n"
            "  // synchronous runner reads this field and completionCheck.\n"
            "  dispatchEnv?: Record<string, string>;\n"
            "  // A clean exit does not prove a good run for every CLI. When set, it judges the\n"
            "  // output of a child that exited 0, and a non-null reason is recorded as a crash.\n"
            "  completionCheck?: (exitCode: number, stdout: string, stderr: string) => string | null;\n"
            "};\n"
        ),
    },
    {
        'id': 'E2', 'file': AUDIT,
        'purpose': 'Merge `dispatchEnv` after the allowlist env in the synchronous `spawnSync` call.',
        'search': "    timeout: timeoutMs,\n    env: buildExecutorDispatchEnv(input.executor, input.guardContext?.env ?? process.env),\n",
        'replace': "    timeout: timeoutMs,\n    env: { ...buildExecutorDispatchEnv(input.executor, input.guardContext?.env ?? process.env), ...input.dispatchEnv },\n",
    },
    {
        'id': 'E3', 'file': AUDIT,
        'purpose': 'Run `completionCheck` after a clean exit and record a non-null reason as a `crash` dispatch failure.',
        'search': "      `executor terminated by signal ${result.signal}`,\n      unavailableMarker,\n    );\n    return 0;\n  }\n",
        'replace': (
            "      `executor terminated by signal ${result.signal}`,\n"
            "      unavailableMarker,\n"
            "    );\n"
            "    return 0;\n"
            "  }\n"
            "\n"
            "  // Some CLIs exit 0 after a failure they report only in their output, such as a\n"
            "  // plugin that did not load, so the caller's check reads what the child printed.\n"
            "  if (input.completionCheck && result.status === 0) {\n"
            "    const completionFailure = input.completionCheck(\n"
            "      result.status,\n"
            "      typeof result.stdout === 'string' ? result.stdout : '',\n"
            "      typeof result.stderr === 'string' ? result.stderr : '',\n"
            "    );\n"
            "    if (completionFailure !== null) {\n"
            "      emitDispatchFailure(\n"
            "        input.stateLogPath,\n"
            "        input.executor,\n"
            "        'crash',\n"
            "        input.iteration,\n"
            "        completionFailure,\n"
            "        unavailableMarker,\n"
            "      );\n"
            "      return 0;\n"
            "    }\n"
            "  }\n"
        ),
    },
    {
        'id': 'E4', 'file': REVIEW,
        'purpose': 'Replace the review refusal branch with a single-lineage dsh dispatch modelled on `if_cli_pi`.',
        'search': OLD_DSH_BRANCH,
        'replace': new_dsh_branch('deep-review', 'review-i{current_iteration}-g{generation}'),
    },
    {
        'id': 'E5', 'file': REVIEW,
        'purpose': 'Rewrite the `if_cli_pi` note that says dsh has no single-executor path.',
        'search': '            - "cli-deepseek-harness has no single-executor path: its branch above exits 2, and the kind runs only as a fan-out lineage"\n',
        'replace': NEW_DSH_NOTE,
    },
    {
        'id': 'E6', 'file': RESEARCH,
        'purpose': 'Replace the research refusal branch with a single-lineage dsh dispatch modelled on `if_cli_pi`.',
        'search': OLD_DSH_BRANCH,
        'replace': new_dsh_branch('deep-research', 'research-i{current_iteration}-g{config.lineage.generation}'),
    },
    {
        'id': 'E7', 'file': RESEARCH,
        'purpose': 'Rewrite the `if_cli_pi` note that says single-executor dsh is refused.',
        'search': '            - "Single-executor cli-deepseek-harness is refused by if_cli_deepseek_harness; dsh runs through fan-out"\n',
        'replace': NEW_DSH_NOTE,
    },
    {'id': 'E8', 'file': RPRES, 'purpose': 'Drop "fan-out only" from the review executor-kind list.', 'search': PRES_KIND_OLD, 'replace': PRES_KIND_NEW},
    {'id': 'E9', 'file': RPRES, 'purpose': 'Drop "fan-out only" from the review option H label.', 'search': PRES_H_OLD, 'replace': PRES_H_NEW},
    {'id': 'E10', 'file': RPRES, 'purpose': 'Replace the review "exits 2" sentence with the single-lineage shape.', 'search': PRES_SHAPE_OLD, 'replace': PRES_SHAPE_NEW},
    {'id': 'E11', 'file': SPRES, 'purpose': 'Drop "fan-out only" from the research executor-kind list.', 'search': PRES_KIND_OLD, 'replace': PRES_KIND_NEW},
    {'id': 'E12', 'file': SPRES, 'purpose': 'Drop "fan-out only" from the research option H label.', 'search': PRES_H_OLD, 'replace': PRES_H_NEW},
    {'id': 'E13', 'file': SPRES, 'purpose': 'Replace the research "exits 2" sentence with the single-lineage shape.', 'search': PRES_SHAPE_OLD, 'replace': PRES_SHAPE_NEW},
    {'id': 'E14', 'file': FDOC, 'purpose': 'Bump the reference version for the content change.', 'search': 'version: 1.1.2.0\n', 'replace': 'version: 1.1.3.0\n'},
    {
        'id': 'E15', 'file': FDOC,
        'purpose': 'Note that the single-executor `:auto` workflows use the same builder.',
        'search': 'The runner accepts research and review lineages.',
        'replace': (
            'The runner accepts research and review lineages. The `/deep:review` and `/deep:research` `:auto` '
            'workflows also run one dsh lineage without a fan-out, through the same `buildLineageCommand` builder. '
            'That branch passes the artifact directory as the lineage directory, so dsh starts there, opens the '
            'prompt with a `REPOSITORY ROOT` line, adds a fresh `DSH_HOME`, `DSH_SPEC_FOLDER`, '
            '`SYSTEM_SPEC_GATE_DISABLED` and `AI_SESSION_CHILD` after the env filter and judges the run with '
            '`validateDshCompletion`. The `:confirm` workflows have no dsh branch.'
        ),
    },
    {
        'id': 'E16', 'file': RTEST,
        'purpose': 'Import `createRequire` so the receipts test can load `validateDshCompletion`.',
        'search': "import { tmpdir } from 'node:os';\n",
        'replace': "import { createRequire } from 'node:module';\nimport { tmpdir } from 'node:os';\n",
    },
    {
        'id': 'E17', 'file': RTEST,
        'purpose': 'Add the `dispatchEnv` and `completionCheck` cells after the opencode cell.',
        'search': (
            "    // (a) identical dispatch behavior: the whole message survives as one argv\n"
            "    // element (spawnSync does not shell-split it).\n"
            "    expect(dump.forwardedArgs).toEqual(args);\n"
            "    // (b) receipt produced.\n"
            "    assertReceiptsProduced(dispatchId);\n"
            "  });\n"
            "});\n"
        ),
        'replace': (
            "    // (a) identical dispatch behavior: the whole message survives as one argv\n"
            "    // element (spawnSync does not shell-split it).\n"
            "    expect(dump.forwardedArgs).toEqual(args);\n"
            "    // (b) receipt produced.\n"
            "    assertReceiptsProduced(dispatchId);\n"
            "  });\n"
            "\n"
            "  it('dsh branch style: dispatchEnv reaches the child past the allowlist, an inherited DSH_ key does not', () => {\n"
            "    // Writes the child's view of the keys to the path given as its last argument.\n"
            "    const envRecorder =\n"
            "      \"require('node:fs').writeFileSync(process.argv[process.argv.length-1],JSON.stringify({dshHome:process.env.DSH_HOME??null,dshSpecFolder:process.env.DSH_SPEC_FOLDER??null,inheritedProbe:process.env.DSH_INHERITED_PROBE??null,specGateDisabled:process.env.SYSTEM_SPEC_GATE_DISABLED??null,aiSessionChild:process.env.AI_SESSION_CHILD??null}))\";\n"
            "    const envDump = join(dir, 'child-env.json');\n"
            "    const dshHome = join(dir, 'dsh-home');\n"
            "    const dispatchId = 'review-i4-deepseek-harness-env';\n"
            "\n"
            "    const exitCode = runAuditedExecutorCommand({\n"
            "      command: NODE,\n"
            "      args: ['-e', envRecorder, '--', envDump],\n"
            "      cwd: dir,\n"
            "      timeoutSeconds: 10,\n"
            "      stateLogPath,\n"
            "      executor: makeBaseExecutor('cli-deepseek-harness'),\n"
            "      iteration: 4,\n"
            "      guardContext: {\n"
            "        // DSH_HOME stays out of the parent env: the nested-dispatch guard refuses a dsh\n"
            "        // dispatch whose parent already names a harness home.\n"
            "        env: { ...cleanGuardEnv(), DSH_SPEC_FOLDER: '/inherited/spec', DSH_INHERITED_PROBE: 'inherited' },\n"
            "        ancestryCmdlines: [],\n"
            "        statePaths: [],\n"
            "      },\n"
            "      receiptDir,\n"
            "      dispatchId,\n"
            "      dispatchEnv: { DSH_HOME: dshHome, DSH_SPEC_FOLDER: '/abs/spec', SYSTEM_SPEC_GATE_DISABLED: '1', AI_SESSION_CHILD: '1' },\n"
            "    });\n"
            "\n"
            "    expect(exitCode).toBe(0);\n"
            "    expect(JSON.parse(readFileSync(envDump, 'utf8'))).toEqual({\n"
            "      dshHome,\n"
            "      dshSpecFolder: '/abs/spec',\n"
            "      inheritedProbe: null,\n"
            "      specGateDisabled: '1',\n"
            "      aiSessionChild: '1',\n"
            "    });\n"
            "    assertReceiptsProduced(dispatchId);\n"
            "  });\n"
            "\n"
            "  it('dsh branch style: a completionCheck reason on a clean exit records a crash dispatch_failure', () => {\n"
            "    const requireCjs = createRequire(import.meta.url);\n"
            "    const { validateDshCompletion } = requireCjs('../scripts/fanout-run.cjs') as {\n"
            "      validateDshCompletion: (exitCode: number, stdout: string, stderr?: string) => string | null;\n"
            "    };\n"
            "    const dispatchId = 'review-i5-deepseek-harness-completion';\n"
            "\n"
            "    const exitCode = runAuditedExecutorCommand({\n"
            "      command: NODE,\n"
            "      // Exits 0 after printing the line dsh prints when a plugin fails to load.\n"
            "      args: ['-e', \"process.stderr.write('plugin repo-guards did not activate\\\\n')\"],\n"
            "      cwd: dir,\n"
            "      timeoutSeconds: 10,\n"
            "      stateLogPath,\n"
            "      executor: makeBaseExecutor('cli-deepseek-harness'),\n"
            "      iteration: 5,\n"
            "      guardContext: { env: cleanGuardEnv(), ancestryCmdlines: [], statePaths: [] },\n"
            "      receiptDir,\n"
            "      dispatchId,\n"
            "      completionCheck: validateDshCompletion,\n"
            "    });\n"
            "\n"
            "    expect(exitCode).toBe(0);\n"
            "    const records = readFileSync(stateLogPath, 'utf8').trim().split('\\n').map((line) => JSON.parse(line));\n"
            "    expect(records[records.length - 1]).toMatchObject({\n"
            "      type: 'event',\n"
            "      event: 'dispatch_failure',\n"
            "      reason: 'crash',\n"
            "      iteration: 5,\n"
            "      detail: 'reported a plugin that did not activate',\n"
            "    });\n"
            "    // The completion receipt still records the real clean exit.\n"
            "    assertReceiptsProduced(dispatchId);\n"
            "  });\n"
            "});\n"
        ),
    },
    {
        'id': 'E18', 'file': CTEST,
        'purpose': 'Add the `dshSingleBranchGaps` helper that reads the `if_cli_deepseek_harness` branch body.',
        'search': "function readWorkflows(): Map<string, string> {\n",
        'replace': (
            "const DSH_SINGLE_BRANCH_TOKENS = [\n"
            "  'buildLineageCommand',\n"
            "  'DSH_HOME',\n"
            "  'SYSTEM_SPEC_GATE_DISABLED',\n"
            "  'REPOSITORY ROOT',\n"
            "  'validateDshCompletion',\n"
            "];\n"
            "\n"
            "// A branch body runs from its key to the next line at the same or a shallower indent.\n"
            "function dshSingleBranchGaps(yaml: string): string[] {\n"
            "  const lines = yaml.split(/\\r?\\n/);\n"
            "  const start = lines.findIndex((line) => /^\\s*if_cli_deepseek_harness:\\s*$/.test(line));\n"
            "  if (start === -1) return ['if_cli_deepseek_harness'];\n"
            "  const indent = /^\\s*/.exec(lines[start])![0].length;\n"
            "  let end = start + 1;\n"
            "  while (end < lines.length) {\n"
            "    const line = lines[end];\n"
            "    if (line.trim() && /^\\s*/.exec(line)![0].length <= indent) break;\n"
            "    end += 1;\n"
            "  }\n"
            "  const body = lines.slice(start + 1, end).join('\\n');\n"
            "  // The ancestry recursion guard reads the parent shell's command line, which carries\n"
            "  // the heredoc text, so a bare harness binary word there refuses the dispatch as nested.\n"
            "  const bareBinary = body\n"
            "    .split(/\\s+/)\n"
            "    .map((token) => token.replace(/^['\"]|['\"]$/g, ''))\n"
            "    .some((token) => token.split('/').pop() === 'dsh');\n"
            "  return [\n"
            "    ...DSH_SINGLE_BRANCH_TOKENS.filter((token) => !body.includes(token)),\n"
            "    ...(bareBinary ? ['bare dsh word'] : []),\n"
            "  ];\n"
            "}\n"
            "\n"
            "function readWorkflows(): Map<string, string> {\n"
        ),
    },
    {
        'id': 'E19', 'file': CTEST,
        'purpose': 'Assert neither auto YAML refuses a single dsh run and each dsh branch names the builder, the home and the completion check.',
        'search': (
            "    expect(opencodeBranchesMissingBuilder('if_cli_opencode:\\n  command: opencode run\\n'))\n"
            "      .toEqual([1]);\n"
            "  });\n"
            "});\n"
        ),
        'replace': (
            "    expect(opencodeBranchesMissingBuilder('if_cli_opencode:\\n  command: opencode run\\n'))\n"
            "      .toEqual([1]);\n"
            "  });\n"
            "\n"
            "  it('runs a single cli-deepseek-harness lineage through the shared builder in both auto workflows', () => {\n"
            "    for (const file of ['deep-research-auto.yaml', 'deep-review-auto.yaml']) {\n"
            "      const yaml = workflows.get(file)!;\n"
            "      expect(yaml).not.toContain('runs only as a fan-out lineage');\n"
            "      expect(dshSingleBranchGaps(yaml)).toEqual([]);\n"
            "    }\n"
            "    expect(dshSingleBranchGaps('if_cli_deepseek_harness:\\n  command: dsh\\nif_cli_pi:\\n  DSH_HOME\\n'))\n"
            "      .toEqual([...DSH_SINGLE_BRANCH_TOKENS, 'bare dsh word']);\n"
            "  });\n"
            "});\n"
        ),
    },
]


def load(root, rel):
    with open(os.path.join(root, rel), encoding='utf-8') as handle:
        return handle.read()


def count(root):
    for edit in EDITS:
        path = os.path.join(root, edit['file'])
        body = load(root, edit['file'])
        pattern = edit['search'].rstrip('\n')
        rg = subprocess.run(['rg', '-U', '-c', '-F', '--', pattern, path], capture_output=True, text=True)
        print(f"{edit['id']} {edit['file']} python_count={body.count(edit['search'])} rg_U_c_F={rg.stdout.strip() or '0'}")


def apply(root):
    for edit in EDITS:
        body = load(root, edit['file'])
        hits = body.count(edit['search'])
        if hits != 1:
            raise SystemExit(f"{edit['id']}: search text found {hits} times in {edit['file']}")
        with open(os.path.join(root, edit['file']), 'w', encoding='utf-8') as handle:
            handle.write(body.replace(edit['search'], edit['replace'], 1))
        print(f"{edit['id']} applied to {edit['file']}")


def fence(text):
    ticks = '````' if '```' in text else '```'
    return f"{ticks}text\n{text.rstrip(chr(10))}\n{ticks}\n"


def emit(out):
    parts = []
    for edit in EDITS:
        parts.append(f"#### {edit['id']}\n\n")
        parts.append(f"File: `{edit['file']}`\n\n")
        parts.append(f"Purpose: {edit['purpose']}\n\n")
        parts.append("Search (count 1):\n\n")
        parts.append(fence(edit['search']))
        parts.append("\nReplace:\n\n")
        parts.append(fence(edit['replace']))
        parts.append("\n")
    with open(out, 'w', encoding='utf-8') as handle:
        handle.write(''.join(parts))
    print(f"wrote {out}")


if __name__ == '__main__':
    mode, target = sys.argv[1], sys.argv[2]
    {'apply': apply, 'count': count, 'emit': emit}[mode](target)
