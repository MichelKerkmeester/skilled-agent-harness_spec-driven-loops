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
});
