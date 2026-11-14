---
title: "Implementation Plan: Phase 17: dsh-single-executor-loop"
description: "Adds two optional fields to the synchronous audited runner and replaces the dsh refusal branch in both :auto deep-loop YAMLs with a single-lineage dispatch through buildLineageCommand. Nineteen literal search-and-replace edits, each search counted once, were applied to a scratch mirror and proven by tests, typecheck, contract drift and a stub-dsh smoke."
trigger_phrases:
  - "dsh single executor loop plan"
  - "dispatchEnv completionCheck plan"
  - "if_cli_deepseek_harness single lineage edits"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 17: dsh-single-executor-loop

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and CommonJS on Node, run through `tsx`, plus YAML workflow assets |
| **Framework** | The deep-loop runtime under `.skilled/skills/system-deep-loop/runtime` |
| **Storage** | None. The state log, receipts and iteration files are plain files in the artifact directory |
| **Testing** | Vitest 4.1.12 through `runtime/vitest.config.ts`, `tsc` typecheck, `check-contract-drift.cjs` |

### Overview
The synchronous audited runner gains two optional fields, `dispatchEnv` and `completionCheck`. Both `:auto` workflow YAMLs swap the dsh refusal for a dispatch built like `if_cli_pi` that uses those fields. Proof is three new test cells that fail today, the existing cells still passing, a clean typecheck, a clean contract drift check and a stub-dsh smoke of each rendered branch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Each of the 19 search texts below counts 1 in its file with `rg -U -c -F`
- [x] The section 5 baselines reproduce: 10 passed, typecheck exit 0, drift OK for both commands
- [x] `git status --short` shows none of the 10 target files modified before E1

### Definition of Done
- [x] All acceptance criteria met
- [x] From the runtime folder, `npx vitest run --no-coverage tests/executor-audit-cli-branch-receipts.test.ts tests/unit/executor-branch-contract.vitest.ts tests/unit/write-containment-yaml-call-sites.vitest.ts` prints `Tests  13 passed (13)`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Shared builder reuse. The single path calls the same `buildLineageCommand` the fan-out runner calls, and the audited runner carries the two dsh needs it lacked.

### Key Components
- **`runAuditedExecutorCommand`**: Gains `dispatchEnv`, merged after the allowlist, because the allowlist drops every `DSH_` key. Gains `completionCheck`, run on a clean exit, because the runner never hands stdout back.
- **`if_cli_deepseek_harness` in both `:auto` YAMLs**: Builds through `buildLineageCommand` with `lineageDir` set to the artifact directory, creates a temp home, dispatches from the builder's cwd and removes the home in `finally`.

### Data Flow
A `REPOSITORY ROOT` line, then `withAgentPersona` over the rendered prompt pack, give the prompt. `buildLineageCommand` returns `dsh` argv, stdin and a cwd equal to the artifact directory. `runAuditedExecutorCommand` filters the env, adds `DSH_HOME`, `DSH_SPEC_FOLDER`, `SYSTEM_SPEC_GATE_DISABLED` and `AI_SESSION_CHILD`, spawns with a timeout 30 s under the step timeout, writes INTENT and COMPLETION receipts and runs `validateDshCompletion` on a clean exit. Write containment then scans the repository, and the step exits with the runner's code.

### Design Constraints
- `DSH_HOME` goes only in `dispatchEnv`. Set on the workflow process it would trip the state-env recursion guard, which refuses a dsh dispatch when `DSH_HOME` is already set.
- The builder's cwd, not `{repo_root}`, is the dispatch cwd. Headless dsh reads the cwd `.env` file and the repository root holds one.
- The heredoc never uses `dsh` as a bare word. A first prototype with comments such as "starts dsh in the artifact folder" was refused by the ancestry guard (`nested cli-deepseek-harness dispatch refused [recursion-guard-ancestry]`), because the shell that runs the step carries the heredoc text. The reworded branch dispatched.
- Both iteration prompt templates say "All paths are relative to the repo root." (review line 82, research line 24) and call `node .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` by a repo-relative path. The leaf starts in the artifact directory, so `promptBody` opens with `REPOSITORY ROOT: <abs root>. Resolve every relative path in this prompt against it and run every command as cd <root> && <command>.`
- `SYSTEM_SPEC_GATE_DISABLED: '1'` rides in `dispatchEnv` as it does in the fan-out runner. `SYSTEM_SPEC_GATE_ENFORCE=0` alone only stops the deny, and the leaf has no user turn to answer the spec gate.
- The step `timeout_seconds` equals the executor timeout, so the child gets `max(ceil(t/2), t - 30)` seconds. An outer kill while the child still runs would skip the `finally` block and strand the temp home.
- `dispatchEnv` is documented in E1 as for this kind only. Another kind that needs a key widens its allowlist instead.
- `{spec_folder}` is the placeholder in both YAMLs. `path.resolve(repoRoot, '{spec_folder}')` makes it absolute either way.
- The review branch keeps `dispatchId` prefix `review-i{current_iteration}-g{generation}` and the research branch keeps `research-i{current_iteration}-g{config.lineage.generation}`, as their `if_cli_pi` branches do.

### Edits

Apply in order. Each search text was counted with `rg -U -c -F` and with Python `str.count` against the worktree on 2026-11-14, and both printed 1 for all 19. All 19 were then applied to a scratch mirror and every gate in section 5 passed there. Code comments carry the durable reason only.

#### E1

File: `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`

Purpose: Add the optional `dispatchEnv` and `completionCheck` fields to `RunAuditedExecutorCommandInput`.

Search (count 1):

```text
  receiptDir?: string;
  dispatchId?: string;
};
```

Replace:

```text
  receiptDir?: string;
  dispatchId?: string;
  // For the cli-deepseek-harness single-lineage branch only: its fresh harness home and
  // spec-folder marker are keys the per-kind allowlist drops on purpose. They are merged
  // after the filter, so only the values the caller names reach the child, never an
  // inherited one. Another kind that needs a key widens its allowlist instead. Only the
  // synchronous runner reads this field and completionCheck.
  dispatchEnv?: Record<string, string>;
  // A clean exit does not prove a good run for every CLI. When set, it judges the
  // output of a child that exited 0, and a non-null reason is recorded as a crash.
  completionCheck?: (exitCode: number, stdout: string, stderr: string) => string | null;
};
```

#### E2

File: `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`

Purpose: Merge `dispatchEnv` after the allowlist env in the synchronous `spawnSync` call.

Search (count 1):

```text
    timeout: timeoutMs,
    env: buildExecutorDispatchEnv(input.executor, input.guardContext?.env ?? process.env),
```

Replace:

```text
    timeout: timeoutMs,
    env: { ...buildExecutorDispatchEnv(input.executor, input.guardContext?.env ?? process.env), ...input.dispatchEnv },
```

#### E3

File: `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`

Purpose: Run `completionCheck` after a clean exit and record a non-null reason as a `crash` dispatch failure.

Search (count 1):

```text
      `executor terminated by signal ${result.signal}`,
      unavailableMarker,
    );
    return 0;
  }
```

Replace:

```text
      `executor terminated by signal ${result.signal}`,
      unavailableMarker,
    );
    return 0;
  }

  // Some CLIs exit 0 after a failure they report only in their output, such as a
  // plugin that did not load, so the caller's check reads what the child printed.
  if (input.completionCheck && result.status === 0) {
    const completionFailure = input.completionCheck(
      result.status,
      typeof result.stdout === 'string' ? result.stdout : '',
      typeof result.stderr === 'string' ? result.stderr : '',
    );
    if (completionFailure !== null) {
      emitDispatchFailure(
        input.stateLogPath,
        input.executor,
        'crash',
        input.iteration,
        completionFailure,
        unavailableMarker,
      );
      return 0;
    }
  }
```

#### E4

File: `.skilled/commands/deep/assets/deep-review-auto.yaml`

Purpose: Replace the review refusal branch with a single-lineage dsh dispatch modelled on `if_cli_pi`.

Search (count 1):

```text
        if_cli_deepseek_harness:
          command: |
            node --input-type=module <<'EOF'
            console.error('cli-deepseek-harness runs only as a fan-out lineage; rerun with --count=2 or a second --executor group, or choose another executor kind');
            process.exit(2);
            EOF
          working_directory: "{repo_root}"
          wait_for_completion: true
          notes:
            - "Fails closed before any dispatch receipt is written; the pre_dispatch_audit provenance row for the attempted executor remains"
```

Replace:

```text
        if_cli_deepseek_harness:
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
            const promptBody = 'REPOSITORY ROOT: ' + repoRoot + '. Resolve every relative path in this prompt against it and run every command as `cd ' + repoRoot + ' && <command>`.\n\n'
              + withAgentPersona('deep-review', readFileSync('{state_paths.prompt_dir}/iteration-{current_iteration}.md', 'utf8'), repoRoot);
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
            const dispatchId = 'review-i{current_iteration}-g{generation}';
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
                  + '\n' + containment.contestedNote,
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
```

#### E5

File: `.skilled/commands/deep/assets/deep-review-auto.yaml`

Purpose: Rewrite the `if_cli_pi` note that says dsh has no single-executor path.

Search (count 1):

```text
            - "cli-deepseek-harness has no single-executor path: its branch above exits 2, and the kind runs only as a fan-out lineage"
```

Replace:

```text
            - "cli-deepseek-harness has its own single-executor branch, if_cli_deepseek_harness above, built through the same buildLineageCommand. Fan-out also runs the kind"
```

#### E6

File: `.skilled/commands/deep/assets/deep-research-auto.yaml`

Purpose: Replace the research refusal branch with a single-lineage dsh dispatch modelled on `if_cli_pi`.

Search (count 1):

```text
        if_cli_deepseek_harness:
          command: |
            node --input-type=module <<'EOF'
            console.error('cli-deepseek-harness runs only as a fan-out lineage; rerun with --count=2 or a second --executor group, or choose another executor kind');
            process.exit(2);
            EOF
          working_directory: "{repo_root}"
          wait_for_completion: true
          notes:
            - "Fails closed before any dispatch receipt is written; the pre_dispatch_audit provenance row for the attempted executor remains"
```

Replace:

```text
        if_cli_deepseek_harness:
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
            const promptBody = 'REPOSITORY ROOT: ' + repoRoot + '. Resolve every relative path in this prompt against it and run every command as `cd ' + repoRoot + ' && <command>`.\n\n'
              + withAgentPersona('deep-research', readFileSync('{state_paths.prompt_dir}/iteration-{current_iteration}.md', 'utf8'), repoRoot);
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
            const dispatchId = 'research-i{current_iteration}-g{config.lineage.generation}';
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
                  + '\n' + containment.contestedNote,
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
```

#### E7

File: `.skilled/commands/deep/assets/deep-research-auto.yaml`

Purpose: Rewrite the `if_cli_pi` note that says single-executor dsh is refused.

Search (count 1):

```text
            - "Single-executor cli-deepseek-harness is refused by if_cli_deepseek_harness; dsh runs through fan-out"
```

Replace:

```text
            - "cli-deepseek-harness has its own single-executor branch, if_cli_deepseek_harness above, built through the same buildLineageCommand. Fan-out also runs the kind"
```

#### E8

File: `.skilled/commands/deep/assets/deep-review-presentation.txt`

Purpose: Drop "fan-out only" from the review executor-kind list.

Search (count 1):

```text
`cli-deepseek-harness`, the last one fan-out only;
```

Replace:

```text
`cli-deepseek-harness`, the last one a single lineage in `:auto` or a fan-out;
```

#### E9

File: `.skilled/commands/deep/assets/deep-review-presentation.txt`

Purpose: Drop "fan-out only" from the review option H label.

Search (count 1):

```text
(experimental, explicit choice only, fan-out only)
```

Replace:

```text
(experimental, explicit choice only)
```

#### E10

File: `.skilled/commands/deep/assets/deep-review-presentation.txt`

Purpose: Replace the review "exits 2" sentence with the single-lineage shape.

Search (count 1):

```text
a single-executor run exits 2, so give it a fan-out shape such as `--executor=cli-deepseek-harness --model=deepseek-v4.1-flash --count=2`.
```

Replace:

```text
a single lineage such as `--executor=cli-deepseek-harness --model=deepseek-v4.1-flash` runs in `:auto` through the shared fan-out command builder, and a fan-out shape such as `--count=2` also works.
```

#### E11

File: `.skilled/commands/deep/assets/deep-research-presentation.txt`

Purpose: Drop "fan-out only" from the research executor-kind list.

Search (count 1):

```text
`cli-deepseek-harness`, the last one fan-out only;
```

Replace:

```text
`cli-deepseek-harness`, the last one a single lineage in `:auto` or a fan-out;
```

#### E12

File: `.skilled/commands/deep/assets/deep-research-presentation.txt`

Purpose: Drop "fan-out only" from the research option H label.

Search (count 1):

```text
(experimental, explicit choice only, fan-out only)
```

Replace:

```text
(experimental, explicit choice only)
```

#### E13

File: `.skilled/commands/deep/assets/deep-research-presentation.txt`

Purpose: Replace the research "exits 2" sentence with the single-lineage shape.

Search (count 1):

```text
a single-executor run exits 2, so give it a fan-out shape such as `--executor=cli-deepseek-harness --model=deepseek-v4.1-flash --count=2`.
```

Replace:

```text
a single lineage such as `--executor=cli-deepseek-harness --model=deepseek-v4.1-flash` runs in `:auto` through the shared fan-out command builder, and a fan-out shape such as `--count=2` also works.
```

#### E14

File: `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/fanout-executor.md`

Purpose: Bump the reference version for the content change.

Search (count 1):

```text
version: 1.1.2.0
```

Replace:

```text
version: 1.1.3.0
```

#### E15

File: `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/fanout-executor.md`

Purpose: Note that the single-executor `:auto` workflows use the same builder.

Search (count 1):

```text
The runner accepts research and review lineages.
```

Replace:

```text
The runner accepts research and review lineages. The `/deep:review` and `/deep:research` `:auto` workflows also run one dsh lineage without a fan-out, through the same `buildLineageCommand` builder. That branch passes the artifact directory as the lineage directory, so dsh starts there, opens the prompt with a `REPOSITORY ROOT` line, adds a fresh `DSH_HOME`, `DSH_SPEC_FOLDER`, `SYSTEM_SPEC_GATE_DISABLED` and `AI_SESSION_CHILD` after the env filter and judges the run with `validateDshCompletion`. The `:confirm` workflows have no dsh branch.
```

#### E16

File: `.skilled/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts`

Purpose: Import `createRequire` so the receipts test can load `validateDshCompletion`.

Search (count 1):

```text
import { tmpdir } from 'node:os';
```

Replace:

```text
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
```

#### E17

File: `.skilled/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts`

Purpose: Add the `dispatchEnv` and `completionCheck` cells after the opencode cell.

Search (count 1):

```text
    // (a) identical dispatch behavior: the whole message survives as one argv
    // element (spawnSync does not shell-split it).
    expect(dump.forwardedArgs).toEqual(args);
    // (b) receipt produced.
    assertReceiptsProduced(dispatchId);
  });
});
```

Replace:

```text
    // (a) identical dispatch behavior: the whole message survives as one argv
    // element (spawnSync does not shell-split it).
    expect(dump.forwardedArgs).toEqual(args);
    // (b) receipt produced.
    assertReceiptsProduced(dispatchId);
  });

  it('dsh branch style: dispatchEnv reaches the child past the allowlist, an inherited DSH_ key does not', () => {
    // Writes the child's view of the keys to the path given as its last argument.
    const envRecorder =
      "require('node:fs').writeFileSync(process.argv[process.argv.length-1],JSON.stringify({dshHome:process.env.DSH_HOME??null,dshSpecFolder:process.env.DSH_SPEC_FOLDER??null,inheritedProbe:process.env.DSH_INHERITED_PROBE??null,specGateDisabled:process.env.SYSTEM_SPEC_GATE_DISABLED??null,aiSessionChild:process.env.AI_SESSION_CHILD??null}))";
    const envDump = join(dir, 'child-env.json');
    const dshHome = join(dir, 'dsh-home');
    const dispatchId = 'review-i4-deepseek-harness-env';

    const exitCode = runAuditedExecutorCommand({
      command: NODE,
      args: ['-e', envRecorder, '--', envDump],
      cwd: dir,
      timeoutSeconds: 10,
      stateLogPath,
      executor: makeBaseExecutor('cli-deepseek-harness'),
      iteration: 4,
      guardContext: {
        // DSH_HOME stays out of the parent env: the nested-dispatch guard refuses a dsh
        // dispatch whose parent already names a harness home.
        env: { ...cleanGuardEnv(), DSH_SPEC_FOLDER: '/inherited/spec', DSH_INHERITED_PROBE: 'inherited' },
        ancestryCmdlines: [],
        statePaths: [],
      },
      receiptDir,
      dispatchId,
      dispatchEnv: { DSH_HOME: dshHome, DSH_SPEC_FOLDER: '/abs/spec', SYSTEM_SPEC_GATE_DISABLED: '1', AI_SESSION_CHILD: '1' },
    });

    expect(exitCode).toBe(0);
    expect(JSON.parse(readFileSync(envDump, 'utf8'))).toEqual({
      dshHome,
      dshSpecFolder: '/abs/spec',
      inheritedProbe: null,
      specGateDisabled: '1',
      aiSessionChild: '1',
    });
    assertReceiptsProduced(dispatchId);
  });

  it('dsh branch style: a completionCheck reason on a clean exit records a crash dispatch_failure', () => {
    const requireCjs = createRequire(import.meta.url);
    const { validateDshCompletion } = requireCjs('../scripts/fanout-run.cjs') as {
      validateDshCompletion: (exitCode: number, stdout: string, stderr?: string) => string | null;
    };
    const dispatchId = 'review-i5-deepseek-harness-completion';

    const exitCode = runAuditedExecutorCommand({
      command: NODE,
      // Exits 0 after printing the line dsh prints when a plugin fails to load.
      args: ['-e', "process.stderr.write('plugin repo-guards did not activate\\n')"],
      cwd: dir,
      timeoutSeconds: 10,
      stateLogPath,
      executor: makeBaseExecutor('cli-deepseek-harness'),
      iteration: 5,
      guardContext: { env: cleanGuardEnv(), ancestryCmdlines: [], statePaths: [] },
      receiptDir,
      dispatchId,
      completionCheck: validateDshCompletion,
    });

    expect(exitCode).toBe(0);
    const records = readFileSync(stateLogPath, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    expect(records[records.length - 1]).toMatchObject({
      type: 'event',
      event: 'dispatch_failure',
      reason: 'crash',
      iteration: 5,
      detail: 'reported a plugin that did not activate',
    });
    // The completion receipt still records the real clean exit.
    assertReceiptsProduced(dispatchId);
  });
});
```

#### E18

File: `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts`

Purpose: Add the `dshSingleBranchGaps` helper that reads the `if_cli_deepseek_harness` branch body.

Search (count 1):

```text
function readWorkflows(): Map<string, string> {
```

Replace:

```text
const DSH_SINGLE_BRANCH_TOKENS = [
  'buildLineageCommand',
  'DSH_HOME',
  'SYSTEM_SPEC_GATE_DISABLED',
  'REPOSITORY ROOT',
  'validateDshCompletion',
];

// A branch body runs from its key to the next line at the same or a shallower indent.
function dshSingleBranchGaps(yaml: string): string[] {
  const lines = yaml.split(/\r?\n/);
  const start = lines.findIndex((line) => /^\s*if_cli_deepseek_harness:\s*$/.test(line));
  if (start === -1) return ['if_cli_deepseek_harness'];
  const indent = /^\s*/.exec(lines[start])![0].length;
  let end = start + 1;
  while (end < lines.length) {
    const line = lines[end];
    if (line.trim() && /^\s*/.exec(line)![0].length <= indent) break;
    end += 1;
  }
  const body = lines.slice(start + 1, end).join('\n');
  // The ancestry recursion guard reads the parent shell's command line, which carries
  // the heredoc text, so a bare harness binary word there refuses the dispatch as nested.
  const bareBinary = body
    .split(/\s+/)
    .map((token) => token.replace(/^['"]|['"]$/g, ''))
    .some((token) => token.split('/').pop() === 'dsh');
  return [
    ...DSH_SINGLE_BRANCH_TOKENS.filter((token) => !body.includes(token)),
    ...(bareBinary ? ['bare dsh word'] : []),
  ];
}

function readWorkflows(): Map<string, string> {
```

#### E19

File: `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts`

Purpose: Assert neither auto YAML refuses a single dsh run and each dsh branch names the builder, the home and the completion check.

Search (count 1):

```text
    expect(opencodeBranchesMissingBuilder('if_cli_opencode:\n  command: opencode run\n'))
      .toEqual([1]);
  });
});
```

Replace:

```text
    expect(opencodeBranchesMissingBuilder('if_cli_opencode:\n  command: opencode run\n'))
      .toEqual([1]);
  });

  it('runs a single cli-deepseek-harness lineage through the shared builder in both auto workflows', () => {
    for (const file of ['deep-research-auto.yaml', 'deep-review-auto.yaml']) {
      const yaml = workflows.get(file)!;
      expect(yaml).not.toContain('runs only as a fan-out lineage');
      expect(dshSingleBranchGaps(yaml)).toEqual([]);
    }
    expect(dshSingleBranchGaps('if_cli_deepseek_harness:\n  command: dsh\nif_cli_pi:\n  DSH_HOME\n'))
      .toEqual([...DSH_SINGLE_BRANCH_TOKENS, 'bare dsh word']);
  });
});
```

### Generated Step

After E1 to E19, regenerate both compiled contracts from the repository root. Never hand-edit them.

```text
node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/review --write
node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/research --write
```

Each prints the contract path it wrote. The compiler has no check flag. `check-contract-drift.cjs --command <name>` is the check, and it exits 2 with `STALE_SOURCE_DIGEST` until the write runs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

The change touches env precedence and a shared runner, so the inventory below applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runAuditedExecutorCommand` in `executor-audit.ts` | Producer: spawns every non-native single-executor CLI branch | update (E1 to E3) | receipts test cells 4 and 5 |
| `runAuditedExecutorCommandAsync` in `executor-audit.ts` | Shares the input type, used only by its process-group test | unchanged, ignores both fields | `rg -n "runAuditedExecutorCommandAsync\(" .skilled --glob '!node_modules'` lists the definition and one test |
| `if_cli_deepseek_harness` in both `:auto` YAMLs | Consumer: today exits 2 | update (E4, E6) | branch contract test and the stub-dsh smoke |
| `if_cli_pi` and other CLI branches | Consumers of the runner, pass neither field | unchanged | the 3 existing receipts cells and the write-containment test |
| `fanout-run.cjs` | Owns `buildDshLineageCommand` and `validateDshCompletion` | unchanged, reused | `rg -n "validateDshCompletion" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` |
| Presentation files and compiled contracts | Operator-facing text | update (E8 to E13) and regenerate | `rg -n "fan-out only" .skilled/commands/deep/assets` prints nothing |
| `.skilled/skills/system-deep-loop/changelog/v1.6.24.0.md` | Records that the harness was labelled fan-out only | unchanged, it is history | `rg -n "fan-out only" .skilled/skills/system-deep-loop/changelog` prints that one line |
| `:confirm` YAMLs | No dsh branch | not a consumer, out of scope | `rg -c "if_cli_deepseek_harness" .skilled/commands/deep/assets/deep-*-confirm.yaml` prints nothing |

Required inventories:
- Same-class producers: `rg -n "buildExecutorDispatchEnv\(" .skilled/skills/system-deep-loop/runtime/lib` names the sync and async spawn sites and the definition. Only the sync site changes.
- Consumers of changed symbols: `rg -l -w "dispatchEnv|completionCheck" .skilled --glob '*.ts' --glob '*.yaml' --glob '*.cjs' --glob '!node_modules'` lists only `fanout-run.cjs` today, an unrelated local variable. After E19 it adds `executor-audit.ts`, the two `:auto` YAMLs and the receipts test, and nothing else.
- Matrix axes: env source (allowlisted, dropped, `dispatchEnv`) by exit (0 clean, 0 with inactive plugin, non-zero). The two new cells and the stub smoke cover dropped plus `dispatchEnv` and both exit-0 rows. Non-zero exit keeps its existing path.
- Algorithm invariant: the child env equals the allowlist env with `dispatchEnv` keys laid over it, and no other key. Adversarial case: an inherited `DSH_INHERITED_PROBE` must not reach the child.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup reruns the section 5 baselines and the 19 search counts. Implementation applies E1 to E19 and regenerates the two compiled contracts. Verification reruns section 5 and expects 13 passed, typecheck exit 0 and drift OK. The ordered tasks live in `tasks.md`, which owns the phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `dispatchEnv` and `completionCheck` in `runAuditedExecutorCommand`, the dsh branch text in both YAMLs | Vitest |
| Integration | The rendered dsh branch run against a stub `dsh` on `PATH`, clean and with a `did not activate` stderr line | `bash -c` over the YAML `command` text |
| Manual | One keyed single-lineage `/deep:review :auto` iteration with `--executor=cli-deepseek-harness` | dsh 0.2.2-rc.1 and an LLM Gateway key |

### Baselines (run 2026-11-14, before any edit)

Run from `.skilled/skills/system-deep-loop/runtime` unless the line says otherwise. The runtime collects tests only through `vitest.config.ts`.

| Check | Command | Baseline output | Expected after |
|-------|---------|-----------------|----------------|
| Touched tests | `npx vitest run --no-coverage tests/executor-audit-cli-branch-receipts.test.ts tests/unit/executor-branch-contract.vitest.ts tests/unit/write-containment-yaml-call-sites.vitest.ts` | `Test Files  3 passed (3)` and `Tests  10 passed (10)`, exit 0. Per file: receipts 3, branch contract 5, write containment 2 | `Test Files  3 passed (3)` and `Tests  13 passed (13)`, exit 0 |
| Full runtime suite | `npx vitest run --no-coverage` | `Test Files  173 passed (173)` and `Tests  2891 passed \| 8 skipped (2899)`, 240.91 s | `Test Files  173 passed (173)` and `Tests  2894 passed \| 8 skipped (2902)` |
| Typecheck | `npm run typecheck` | exit 0, no diagnostics | exit 0, no diagnostics |
| Contract drift, review | `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs --command deep/review` from the repository root | `[CONTRACT DRIFT] OK commands=1`, exit 0 | the same, after the `--write` step |
| Contract drift, research | the same with `--command deep/research` | `[CONTRACT DRIFT] OK commands=1`, exit 0 | the same, after the `--write` step |
| YAML load | `python3 -c "import yaml,sys; yaml.safe_load(open(sys.argv[1]))" <file>` for both `:auto` YAMLs from the repository root | both load, exit 0 | both load, exit 0 |

### Prototype Evidence

The 19 edits were applied to a scratch mirror of `.skilled` and `.dsh`. There the touched tests printed `Tests  13 passed (13)`, typecheck exited 0, both drift checks printed `OK` after `--write`, both YAMLs loaded and `rg` found no `runs only as a fan-out` or `fan-out only` text. With the original `executor-audit.ts` and YAMLs restored, the three new tests failed (`Tests  3 failed | 8 passed (11)` over the two edited files). A stub-dsh run of each rendered branch exited 0 from the artifact directory with `"gateDisabled": "1"`, `"child": "1"`, `"promptStart": "REPOSITORY ROOT:"`, an absolute `DSH_SPEC_FOLDER` and the temp home removed after the run. With `plugin repo-guards did not activate` on stderr it recorded `{"reason": "crash", "detail": "reported a plugin that did not activate"}`.

The full runtime suite is not provable on the mirror. It failed gateway tests there, and with the original sources restored `deep-review-bookkeeping-emission.vitest.ts` still failed on the mirror, including its `deep-review-confirm.yaml` case that no edit touches, while the same file passed `Tests  3 passed (3)` in the worktree. So the full-suite row above is checked in the worktree after E19 (T014), not before.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `buildLineageCommand`, `withAgentPersona`, `validateDshCompletion` exports of `fanout-run.cjs` | Internal | Green | The dsh branch cannot build or judge a run |
| `tsx` 4.22.4 and Vitest 4.1.12 in the runtime `node_modules` | Internal | Green | The YAML heredoc and the tests cannot load TypeScript |
| `compile-command-contracts.cjs` and `check-contract-drift.cjs` | Internal | Green | The pre-commit contract gate blocks the commit |
| dsh 0.2.2-rc.1 with an LLM Gateway or OpenCode Go key | External | Green | Only the manual keyed run waits. The automated checks use a stub |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: Any existing CLI branch cell fails, typecheck reports a diagnostic, or a keyed single dsh run writes outside the artifact directory or leaves a `dsh-home-*` folder behind.
- **Procedure**: Revert the one commit that carries E1 to E19 and the two regenerated contracts, then rerun the section 5 baselines and expect 10 passed and drift OK.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing | Implementation, because a search count other than 1 means the tree moved |
| Implementation | Setup baselines and counts | Verification |
| Verification | E1 to E19 and the `--write` step | Packet close |
<!-- /ANCHOR:phase-deps -->

---
