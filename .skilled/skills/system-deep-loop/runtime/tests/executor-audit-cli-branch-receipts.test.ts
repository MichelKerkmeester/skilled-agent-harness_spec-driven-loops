// ───────────────────────────────────────────────────────────────────
// MODULE: CLI Branch Receipt Tests
// ───────────────────────────────────────────────────────────────────

// deep_*_auto.yaml CLI-branch routing through the
// audited executor wrapper. One regression cell per CLI branch STYLE
// (copilot positional/@path, claude-code -p, opencode run), asserting both
// (a) identical dispatch behavior (the argv/env the branch builds are forwarded
//     verbatim to the child) and (b) an INTENT + COMPLETION receipt is produced.
//
// The real executors (copilot/claude/opencode) are replaced by a Node recorder
// so the wrapper's forwarding + receipt path is exercised end-to-end without a
// live CLI install. Each cell constructs the SAME argv shape its YAML branch
// builds and drives it through runAuditedExecutorCommand.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  __getRunMasterSecretForTesting,
  __setRunMasterSecretForTesting,
  runAuditedExecutorCommand,
} from '../lib/deep-loop/executor-audit.js';
import { deriveReceiptKey, verifyReceipt } from '../lib/deep-loop/receipt-crypto.js';
import type { ExecutorConfig } from '../lib/deep-loop/executor-config.js';

const NODE = process.execPath;

function cleanGuardEnv(): Record<string, string | undefined> {
  return {
    PATH: process.env.PATH,
    HOME: process.env.HOME,
    TMPDIR: process.env.TMPDIR,
  };
}

// Recorder: emits the forwarded argv (process.argv minus the node exec path) and
// a couple of probed env values as one JSON object on stdout. The wrapper forwards
// child stdout to process.stdout in a single write, so the spy captures it whole.
const RECORDER =
  "process.stdout.write(JSON.stringify({forwardedArgs:process.argv.slice(1),claudeConfigDir:process.env.CLAUDE_CONFIG_DIR??null,leakProbe:process.env.__BRANCH_LEAK_PROBE??null}))";

function captureChildDump(run: () => void): {
  forwardedArgs: string[];
  claudeConfigDir: string | null;
  leakProbe: string | null;
} {
  const writes: string[] = [];
  const spy = vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
    if (typeof chunk === 'string') writes.push(chunk);
    else if (Buffer.isBuffer(chunk)) writes.push(chunk.toString('utf8'));
    return true;
  });
  try {
    run();
  } finally {
    spy.mockRestore();
  }

  const dumpChunk = writes.find((chunk) => chunk.includes('"forwardedArgs"'));
  if (!dumpChunk) {
    throw new Error('recorder dump was not captured on process.stdout');
  }
  const start = dumpChunk.indexOf('{');
  const end = dumpChunk.lastIndexOf('}');
  const parsed = JSON.parse(dumpChunk.slice(start, end + 1)) as {
    forwardedArgs: string[];
    claudeConfigDir: string | null;
    leakProbe: string | null;
  };
  // Tolerate a leading '[eval]' marker if a node build ever inserts one before
  // the forwarded args; the live node build used here does not.
  const forwarded = parsed.forwardedArgs[0] === '[eval]' ? parsed.forwardedArgs.slice(1) : parsed.forwardedArgs;
  return { ...parsed, forwardedArgs: forwarded };
}

function makeBaseExecutor(kind: ExecutorConfig['kind']): ExecutorConfig {
  return {
    kind,
    model: 'test-model',
    configDir: null,
    reasoningEffort: null,
    serviceTier: null,
    sandboxMode: null,
    timeoutSeconds: 30,
    governor: null,
  };
}

describe('deep_*_auto.yaml CLI branches route through the audited wrapper', () => {
  let dir: string;
  let receiptDir: string;
  let stateLogPath: string;

  beforeEach(() => {
    __setRunMasterSecretForTesting(undefined);
    dir = mkdtempSync(join(tmpdir(), 'cli-branch-'));
    receiptDir = join(dir, 'dispatch-receipts');
    stateLogPath = join(dir, 'state.jsonl');
    writeFileSync(stateLogPath, '', 'utf8');
  });

  afterEach(() => {
    __setRunMasterSecretForTesting(undefined);
    rmSync(dir, { recursive: true, force: true });
  });

  function assertReceiptsProduced(dispatchId: string): void {
    const secret = __getRunMasterSecretForTesting();
    const key = deriveReceiptKey(secret, dispatchId);

    const intentPath = join(receiptDir, `dispatch-${dispatchId}.intent.json`);
    const completionPath = join(receiptDir, `dispatch-${dispatchId}.completion.json`);
    expect(existsSync(intentPath)).toBe(true);
    expect(existsSync(completionPath)).toBe(true);

    const intent = JSON.parse(readFileSync(intentPath, 'utf8'));
    const completion = JSON.parse(readFileSync(completionPath, 'utf8'));

    expect(intent.phase).toBe('intent');
    expect(intent.dispatchId).toBe(dispatchId);
    expect(intent.facts.childPid).toBeUndefined();

    expect(completion.phase).toBe('completion');
    expect(completion.dispatchId).toBe(dispatchId);
    expect(completion.facts.childPid).toEqual(expect.any(Number));
    expect(completion.facts.exitStatus).toBe(0);

    // Both receipts re-verify under the derived key (resume re-verify path).
    expect(verifyReceipt(intent, intent.mac, key)).toBe(true);
    expect(verifyReceipt(completion, completion.mac, key)).toBe(true);
  }

  it('copilot branch style (positional + @PROMPT_PATH argv): built.argv forwarded verbatim, full env passthrough, receipts produced', () => {
    const model = 'gpt-5';
    // Mirrors deep_review_auto.yaml baseArgv (positional prompt form).
    const positionalArgv = ['-p', 'TARGET-AUTHORITY-PREAMBLE\n\nPROMPT-BODY', '--model', model, '--allow-all-tools', '--no-ask-user'];
    // Mirrors the large-prompt @PROMPT_PATH rewrite form (bare @path reference).
    const atPathArgv = [`@${join(dir, 'prompt.md')}`, '--model', model, '--allow-all-tools', '--no-ask-user'];

    const cells: Array<{ dispatchId: string; argv: string[] }> = [
      { dispatchId: 'review-i1-copilot-positional', argv: positionalArgv },
      { dispatchId: 'review-i1-copilot-atpath', argv: atPathArgv },
    ];

    for (const { dispatchId, argv } of cells) {
      const dump = captureChildDump(() => {
        runAuditedExecutorCommand({
          command: NODE,
          // `--` tells node to stop option parsing so the branch's own flags
          // (-p / --model / @path) are forwarded verbatim into process.argv
          // instead of being consumed by the recorder's node binary.
          args: ['-e', RECORDER, '--', ...argv],
          cwd: dir,
          timeoutSeconds: 10,
          stateLogPath,
          // copilot has no cli kind in the executor schema; it dispatches as
          // kind:'native' (full env passthrough, no recursion-guard layer).
          executor: { ...makeBaseExecutor('native'), model },
          iteration: 1,
          guardContext: { env: { ...cleanGuardEnv(), CLAUDE_CONFIG_DIR: '/copilot/passthrough' } },
          receiptDir,
          dispatchId,
        });
      });

      // (a) identical dispatch behavior: the exact argv the branch builds is what
      // the child receives, in both the positional and @path forms.
      expect(dump.forwardedArgs).toEqual(argv);
      // native kind => buildExecutorDispatchEnv passes the full parent env through.
      expect(dump.claudeConfigDir).toBe('/copilot/passthrough');
      // (b) a receipt is produced for this dispatch.
      assertReceiptsProduced(dispatchId);
    }
  });

  it('claude-code branch style (-p prompt + flags): argv verbatim, CLAUDE_CONFIG_DIR admitted, leak-probe stripped, receipts produced', () => {
    const model = 'opus';
    const args = [
      '-p',
      'CLAUDE-PROMPT-BODY',
      '--model',
      model,
      '--permission-mode',
      'acceptEdits',
      '--output-format',
      'text',
      '--effort',
      'high',
    ];
    const dispatchId = 'review-i2-claude-code';

    const dump = captureChildDump(() => {
      runAuditedExecutorCommand({
        command: NODE,
        // `--` forwards the branch's own flags (-p / --model / --effort) verbatim.
        args: ['-e', RECORDER, '--', ...args],
        cwd: dir,
        timeoutSeconds: 10,
        stateLogPath,
        executor: { ...makeBaseExecutor('cli-claude-code'), model, reasoningEffort: 'high' },
        iteration: 2,
        guardContext: {
          env: {
            ...cleanGuardEnv(),
            CLAUDE_CONFIG_DIR: '/claude/account',
            __BRANCH_LEAK_PROBE: 'SHOULD-NOT-FORWARD',
          },
          ancestryCmdlines: [],
          statePaths: [],
        },
        receiptDir,
        dispatchId,
      });
    });

    // (a) identical dispatch behavior.
    expect(dump.forwardedArgs).toEqual(args);
    // CLAUDE_ prefix is on the cli-claude-code env allowlist, so configDir rides
    // through guardContext.env (preserving the YAML's CLAUDE_CONFIG_DIR export).
    expect(dump.claudeConfigDir).toBe('/claude/account');
    // A non-allowlisted var is stripped — proves the allowlist (recursion/env
    // sanitization) is active on the routed path, not bypassed.
    expect(dump.leakProbe).toBeNull();
    // (b) receipt produced.
    assertReceiptsProduced(dispatchId);
  });

  it('opencode branch style (run subcommand + positional message, EOF stdin): argv verbatim, receipts produced', () => {
    const model = 'glm-5.2';
    // Mirrors the route-proof preamble + prompt body the YAML assembles.
    const message = 'Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true\n\nPROMPT-BODY';
    const args = [
      'run',
      '--model',
      model,
      '--format',
      'json',
      '--dangerously-skip-permissions',
      '--pure',
      '--dir',
      dir,
      '--variant',
      'high',
      message,
    ];
    const dispatchId = 'review-i3-opencode';

    const dump = captureChildDump(() => {
      runAuditedExecutorCommand({
        command: NODE,
        // `--` forwards the branch's own flags (--model / --format / run) verbatim.
        args: ['-e', RECORDER, '--', ...args],
        cwd: dir,
        timeoutSeconds: 10,
        stateLogPath,
        executor: { ...makeBaseExecutor('cli-opencode'), model, reasoningEffort: 'high' },
        iteration: 3,
        guardContext: {
          env: { ...cleanGuardEnv(), OPENCODE_TEST_FOO: 'bar' },
          ancestryCmdlines: [],
          statePaths: [],
        },
        // empty input => EOF stdin, equivalent to the YAML branch's </dev/null.
        input: '',
        receiptDir,
        dispatchId,
      });
    });

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

  it('refuses a dispatchEnv key off the per-kind list before a receipt exists', () => {
    const dispatchId = 'review-i6-deepseek-harness-env-refused';
    const refusedInput = {
      command: NODE,
      args: ['-e', 'process.stdout.write("must-not-run")'],
      cwd: dir,
      timeoutSeconds: 10,
      stateLogPath,
      receiptDir,
      iteration: 6,
      guardContext: { env: cleanGuardEnv(), ancestryCmdlines: [], statePaths: [] },
    };

    // The harness list admits four keys. PATH is not one of them, even though the
    // common env filter would pass PATH to a child.
    expect(() => runAuditedExecutorCommand({
      ...refusedInput,
      executor: makeBaseExecutor('cli-deepseek-harness'),
      dispatchId,
      dispatchEnv: { DSH_HOME: join(dir, 'dsh-home-c2'), PATH: process.env.PATH ?? '' },
    })).toThrow('dispatchEnv key PATH is not allowed for cli-deepseek-harness');
    expect(existsSync(join(receiptDir, `dispatch-${dispatchId}.intent.json`))).toBe(false);
    expect(existsSync(join(receiptDir, `dispatch-${dispatchId}.completion.json`))).toBe(false);

    // A kind with no entry allows no key at all, so its row refuses even PATH.
    const otherKindId = 'review-i6-codex-env-refused';
    expect(() => runAuditedExecutorCommand({
      ...refusedInput,
      executor: makeBaseExecutor('cli-codex'),
      dispatchId: otherKindId,
      dispatchEnv: { PATH: process.env.PATH ?? '' },
    })).toThrow('dispatchEnv key PATH is not allowed for cli-codex');
    expect(existsSync(join(receiptDir, `dispatch-${otherKindId}.intent.json`))).toBe(false);
    expect(readFileSync(stateLogPath, 'utf8')).toBe('');
  });

  it('counts a large stdout instead of echoing it when echoStdout is false, and still judges the stream', () => {
    const stdoutWrites: string[] = [];
    const stderrWrites: string[] = [];
    let judgedStdout = '';
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      if (typeof chunk === 'string') stdoutWrites.push(chunk);
      else if (Buffer.isBuffer(chunk)) stdoutWrites.push(chunk.toString('utf8'));
      return true;
    });
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation((chunk) => {
      if (typeof chunk === 'string') stderrWrites.push(chunk);
      else if (Buffer.isBuffer(chunk)) stderrWrites.push(chunk.toString('utf8'));
      return true;
    });
    const dispatchId = 'review-i7-deepseek-harness-echo-off';

    try {
      const exitCode = runAuditedExecutorCommand({
        command: NODE,
        args: ['-e', "process.stdout.write('x'.repeat(4096))"],
        cwd: dir,
        timeoutSeconds: 10,
        stateLogPath,
        executor: makeBaseExecutor('cli-deepseek-harness'),
        iteration: 7,
        guardContext: { env: cleanGuardEnv(), ancestryCmdlines: [], statePaths: [] },
        receiptDir,
        dispatchId,
        dispatchEnv: {
          DSH_HOME: join(dir, 'dsh-home-c3'),
          DSH_SPEC_FOLDER: join(dir, 'spec'),
          SYSTEM_SPEC_GATE_DISABLED: '1',
          AI_SESSION_CHILD: '1',
        },
        echoStdout: false,
        completionCheck: (_code, stdout) => {
          judgedStdout = stdout;
          return null;
        },
      });
      expect(exitCode).toBe(0);
    } finally {
      stdoutSpy.mockRestore();
      stderrSpy.mockRestore();
    }

    expect(stdoutWrites.join('')).toBe('');
    expect(stderrWrites.join('')).toContain('[executor-audit] child stdout 4096 bytes, not echoed');
    expect(judgedStdout).toHaveLength(4096);
    assertReceiptsProduced(dispatchId);
  });

  it('logs 0 bytes when echoStdout is false and the child prints nothing', () => {
    const stderrWrites: string[] = [];
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation((chunk) => {
      if (typeof chunk === 'string') stderrWrites.push(chunk);
      else if (Buffer.isBuffer(chunk)) stderrWrites.push(chunk.toString('utf8'));
      return true;
    });
    const dispatchId = 'review-i8-deepseek-harness-echo-off-empty';

    try {
      runAuditedExecutorCommand({
        command: NODE,
        args: ['-e', ''],
        cwd: dir,
        timeoutSeconds: 10,
        stateLogPath,
        executor: makeBaseExecutor('cli-deepseek-harness'),
        iteration: 8,
        guardContext: { env: cleanGuardEnv(), ancestryCmdlines: [], statePaths: [] },
        receiptDir,
        dispatchId,
        echoStdout: false,
      });
    } finally {
      stderrSpy.mockRestore();
    }

    expect(stderrWrites.join('')).toContain('[executor-audit] child stdout 0 bytes, not echoed');
  });
});
