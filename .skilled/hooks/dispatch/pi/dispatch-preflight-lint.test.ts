// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Dispatch Preflight Tests
// ───────────────────────────────────────────────────────────────────

import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { inspectDispatch } from '../lib/dispatch-audit.mjs';
import promptAdvisor from '../../../skills/system-skill-advisor/hooks/pi/prompt-advisor';
import dispatchPreflightLint, {
  captureRawPiUserInput,
  resetRawPiUserInputCapture,
  shouldDenyPiDispatch,
} from './dispatch-preflight-lint';

import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

type Handler = (event: any, ctx: any) => unknown;

type FactoryInvocation = {
  result: any;
  transformedTexts: string[];
};

type FakeContext = {
  cwd: string;
  sessionManager: {
    getSessionId: () => string;
  };
};

const REPO_ROOT = new URL('../../../../', import.meta.url).pathname;

function denied(command: string, userText: string, options: Record<string, unknown> = {}): boolean {
  const inspection = inspectDispatch(command);
  return shouldDenyPiDispatch({
    runtime: options.runtime ?? 'pi',
    toolName: options.toolName ?? 'bash',
    command,
    dispatchSkill: inspection.kind === 'direct' ? inspection.executor : null,
    inspectedExecutor: inspection.kind === 'direct' ? inspection.executor : null,
    inspectionKind: inspection.kind,
    userText,
  });
}

function makeExtensionApi(): {
  api: ExtensionAPI;
  handlers: Map<string, Handler[]>;
} {
  const handlers = new Map<string, Handler[]>();
  const api = {
    on(event: string, handler: Handler) {
      const registered = handlers.get(event) ?? [];
      registered.push(handler);
      handlers.set(event, registered);
    },
  } as unknown as ExtensionAPI;
  return { api, handlers };
}

function context(sessionId = 'session-a'): FakeContext {
  return {
    cwd: REPO_ROOT,
    sessionManager: { getSessionId: () => sessionId },
  };
}

function registerInjectedInput(api: ExtensionAPI, suffix = 'Advisor: injected cli-devin example') {
  api.on('input', ((event: any, ctx: FakeContext) => {
    captureRawPiUserInput(event.text, ctx.sessionManager.getSessionId());
    return {
      action: 'transform',
      text: `${event.text}\n\n${suffix}`,
    };
  }) as any);
}

async function invokeFactory(
  rawText: string,
  command: string,
  options: { transformFirst?: boolean; inputSession?: string; toolSession?: string } = {},
): Promise<FactoryInvocation> {
  resetRawPiUserInputCapture();
  const { api, handlers } = makeExtensionApi();
  if (options.transformFirst) {
    registerInjectedInput(api);
    dispatchPreflightLint(api);
  } else {
    dispatchPreflightLint(api);
    registerInjectedInput(api);
  }

  const transformedTexts: string[] = [];
  const inputHandlers = handlers.get('input') ?? [];
  const inputContext = context(options.inputSession ?? 'session-a');
  let inputEvent: any = { type: 'input', source: 'interactive', text: rawText };
  for (const handler of inputHandlers) {
    const output = await handler(inputEvent, inputContext);
    const transformed = output as { action?: unknown; text?: unknown };
    if (transformed?.action === 'transform' && typeof transformed.text === 'string') {
      transformedTexts.push(transformed.text);
      inputEvent = { ...inputEvent, text: transformed.text };
    }
  }

  const toolHandler = handlers.get('tool_call')?.[0];
  if (!toolHandler) throw new Error('tool_call handler was not registered');
  const result = await toolHandler({
    type: 'tool_call',
    toolCallId: 'call-1',
    toolName: 'bash',
    input: { command },
  }, context(options.toolSession ?? options.inputSession ?? 'session-a'));
  return { result, transformedTexts };
}

describe('Pi dispatch deny matrix', () => {
  it.each([
    ['devin -p shape', 'devin -p "task"', 'run the task', true],
    ['cursor-agent -p shape', 'cursor-agent -p "task"', 'run the task', true],
    ['matching cli mode override', 'devin -p "task"', 'dispatch via cli-devin', false],
    ['deep-loop executor', 'opencode run "task"', '/deep:review --executor cli-opencode', false],
    ['deep-loop executor mismatch', 'devin -p "task"', '/deep:review --executor cli-opencode', true],
    ['deep-loop executor equals', 'devin -p "task"', '/deep:review --executor cli-devin', false],
    ['negated deep-loop executor', 'devin -p "task"', 'do not run /deep:review --executor cli-devin', true],
    ['bare not before a deep-loop executor', 'devin -p "task"', 'not /deep:review --executor cli-devin', true],
    ['negation of a different executor before a comma', 'devin -p "task"', 'not opencode, use cli-devin', false],
    ['negation of a different executor before but', 'devin -p "task"', 'not opencode but cli-devin', false],
    ['negation in the same clause as a deep-loop executor', 'devin -p "task"', 'please, not /deep:review --executor cli-devin', true],
    ['negation across a parenthetical', 'devin -p "task"', 'do not, under any circumstances, use cli-devin', true],
    ['negation across a parenthetical before a deep-loop executor', 'devin -p "task"', 'do not, under any circumstances, run /deep:review --executor cli-devin', true],
    ['never, ever before the mention', 'devin -p "task"', 'never, ever, use cli-devin', true],
    ['negation across nested parentheticals', 'devin -p "task"', 'do not, for any reason, at any point, use cli-devin', true],
    ['dont across a parenthetical', 'devin -p "task"', 'dont, whatever happens, use cli-devin', true],
    ['upper-case NOT across a parenthetical', 'devin -p "task"', 'do NOT, even once, use cli-devin', true],
    ['avoid across a parenthetical', 'devin -p "task"', 'avoid, if possible, cli-devin', true],
    ['without across a parenthetical', 'devin -p "task"', 'run it without, of course, cli-devin', true],
    ['negated list of executors', 'devin -p "task"', 'do not use opencode, codex, or cli-devin', true],
    ['negated list of cli names', 'devin -p "task"', 'never use cli-opencode, cli-codex, cli-devin', true],
    ['negation across a parenthetical into a list', 'devin -p "task"', 'do not, please, use opencode or cli-devin', true],
    ['negated executor then a new imperative (policy deny)', 'devin -p "task"', 'do not use opencode, use cli-devin', true],
    ['never one executor then run another (policy deny)', 'devin -p "task"', 'never use codex, run cli-devin', true],
    ["don't one executor then try another (policy deny)", 'devin -p "task"', "don't use cli-opencode, try cli-devin", true],
    ['never one executor then launch another (policy deny)', 'devin -p "task"', 'never use codex, launch cli-devin', true],
    ['avoid one executor then prefer another (policy deny)', 'devin -p "task"', 'avoid opencode, prefer cli-devin', true],
    ['quoted deep-loop executor', 'devin -p "task"', 'say "run /deep:review --executor cli-devin"', true],
    ['backtick deep-loop executor', 'devin -p "task"', 'the form is `run /deep:review --executor cli-devin`', true],
    ['negation in an earlier sentence (policy deny)', 'devin -p "task"', 'never mind. /deep:review --executor cli-devin', true],
    ['cli-pi named by the user', 'pi -p "task"', 'use cli-pi', false],
    ['cli-pi without an override', 'pi -p "task"', 'run the task', true],
    ['negated mode mention', 'devin -p "task"', 'do not use cli-devin', true],
    ['quoted mode mention', 'devin -p "task"', 'use "cli-devin"', true],
    ['history mode mention is not current authorization', 'devin -p "task"', '[user] dispatch via cli-devin [assistant] done [user] run the task', true],
    ['history deep-loop mention is not current authorization', 'devin -p "task"', '[user] /deep:review --executor cli-devin [assistant] done [user] run the task', true],
    ['spec-gate question is not authorization', 'devin -p "task"', 'run the task\n\nSPEC FOLDER QUESTION: this turn looks like it will mutate a file. Before any Write/Edit, pick one:\nA) Use an existing spec folder', true],
    ['injected capsule is not an override', 'devin -p "task"', 'run the task\n\nAdvisor: live; use cli-devin 0.95/0.20 pass.', true],
    ['printf payload is not a dispatch', 'printf "devin -p task"', 'run the task', false],
    ['ambiguous variable command', '$CLI -p task', 'use cli-devin', true],
    ['non-bash tool is not a dispatch', 'devin -p "task"', 'run the task', false],
    ['non-dispatch bash', 'npm test', 'run the tests', false],
    ['non-Pi runtime', 'devin -p "task"', 'run the task', false],
  ])('%s', (name, command, userText, expected) => {
    const options = name === 'non-bash tool is not a dispatch'
      ? { toolName: 'read' }
      : name === 'non-Pi runtime'
        ? { runtime: 'claude' }
        : {};
    expect(denied(command, userText, options)).toBe(expected);
  });
});

describe('Pi refusal phrasings', () => {
  it.each([
    // A list joined past the comma keeps the negation open instead of reading the last item
    // as a fresh imperative.
    ['do not use opencode, use codex, or use cli-devin', true],
    ['do not use opencode, use codex, and use cli-devin', true],
    ['never run codex, run opencode, or run cli-devin', true],
    ['you cannot use opencode, codex, or cli-devin', true],
    // Every refusal word reads as a negation.
    ['cannot use cli-devin', true],
    ["can't use cli-devin", true],
    ['can not use cli-devin', true],
    ["mustn't use cli-devin", true],
    ['must not use cli-devin', true],
    ["shouldn't use cli-devin", true],
    ['should not use cli-devin', true],
    ["won't use cli-devin", true],
    ['will not use cli-devin', true],
    // A directive refusal before the mention withdraws authority just as a negated verb does.
    ['stop using cli-devin', true],
    ['skip cli-devin', true],
    ['refuse to use cli-devin', true],
    ['ban cli-devin', true],
    ['drop cli-devin', true],
    ['forget cli-devin', true],
    ['exclude cli-devin', true],
    ['nobody should use cli-devin', true],
    ['no one may run cli-devin', true],
    // A curly apostrophe spells the same contraction, so it negates the same way.
    ['don’t use cli-devin', true],
    ['can’t use cli-devin', true],
    ['mustn’t use cli-devin', true],
    ['shouldn’t use cli-devin', true],
    ['won’t use cli-devin', true],
    // A curly or low quote delimits the same span a straight one does, so a quoted mention is not
    // a request, and a pair that mixes the two forms still encloses it.
    ['use “cli-devin”', true],
    ['use ‘cli-devin’', true],
    ['say “run /deep:review --executor cli-devin”', true],
    ['use “cli-devin"', true],
    ['use ”cli-devin“', true],
    ['use „cli-devin“', true],
    // Nesting is counted, not guessed from the last pair of brackets, so a closed inner
    // substitution cannot hide the outer one still open around the mention.
    ['$(echo $(true) cli-devin)', true],
    ['$(echo $(echo $(true)) cli-devin)', true],
    ['$(a $(b) $(c) cli-devin)', true],
    ['$(echo (1) cli-devin)', true],
    // A substitution that closed before the mention leaves it in plain text.
    ['$(true) and then use cli-devin', false],
    // A quoted word that closes before the mention is a quotation, not an enclosure.
    ['the “fast” path: use cli-devin', false],
    ['you cannot, under any circumstances, use cli-devin', true],
    ["you mustn't, ever, run /deep:review --executor cli-devin", true],
    ['cannot run /deep:review --executor cli-devin', true],
    ['no, no, no, use cli-devin', true],
    // A refusal stated after the mention withholds authority as well.
    ['cli-devin is not allowed', true],
    ['cli-devin is forbidden', true],
    ['cli-devin is banned here', true],
    ['cli-devin must not be used', true],
    ['cli-devin must never be used', true],
    ['cli-devin should never run', true],
    ["cli-devin isn't allowed", true],
    ['using cli-devin is prohibited', true],
    ['cli-devin is off-limits', true],
    ['cli-devin is disallowed', true],
    ['/deep:review --executor cli-devin is forbidden', true],
    // A refusal on either side of the mention refuses the sentence it sits in.
    ['You are forbidden from using cli-devin', true],
    ['cli-devin, do not use it', true],
    // Fail-closed deny accepted by policy: the operator states the request in its own sentence.
    ['Use cli-devin, it is not forbidden', true],
    // An exclusion phrase right before the mention names it as the thing to avoid.
    ['use anything instead of cli-devin', true],
    ['rather than cli-devin, do it by hand', true],
    ['instead of /deep:review --executor cli-devin, do it by hand', true],
    ['use any executor except cli-devin', true],
    ['use all executors except for cli-devin', true],
    ['no cli-devin', true],
    ['no cli-devin please', true],
    ['anything but cli-devin', true],
    ['use something other than cli-devin', true],
    ['use any tool apart from cli-devin', true],
    ['run it with everything excluding cli-devin', true],
    ['not even cli-devin', true],
    // Every inflection of each refusal verb refuses the sentence, as a whole word.
    ['forbid cli-devin', true],
    ['we forbid cli-devin here', true],
    ['prohibit cli-devin', true],
    ['disallow cli-devin', true],
    ['block cli-devin', true],
    ['prevent cli-devin from running', true],
    ['reject cli-devin', true],
    ['veto cli-devin', true],
    ['quit using cli-devin', true],
    // A semicolon, a line break or an abbreviation period leaves the refusal sentence open.
    ['not opencode; use cli-devin', true],
    ['never use codex; use cli-devin', true],
    ['do not use cli-devin\nuse cli-devin', true],
    ['not opencode\r\nuse cli-devin', true],
    ['never use it, e.g. cli-devin', true],
    ['avoid these, etc. cli-devin', true],
    ['skip the rest, i.e. cli-devin', true],
    // A later sentence, or a sentence with no refusal word in it, still leaves the mention a request.
    ['not opencode, use cli-devin', false],
    // Policy deny: a refusal anywhere in the sentence refuses it, list item or not.
    ["don't use codex, use cli-devin and opencode", true],
    // Policy deny: a second refusal after the mention refuses the whole sentence.
    ['not opencode, use cli-devin, not codex', true],
    ['go with cli-devin', false],
    ['not opencode but cli-devin', false],
    // Policy deny: the refusal after the mention refuses the sentence with it.
    ['use cli-devin, not opencode', true],
    // Policy deny: an exclusion phrase refuses the mention, before or after it.
    ['use cli-devin instead of opencode', true],
    // Policy deny: an exclusion phrase refuses the mention, before or after it.
    ['use cli-devin rather than codex', true],
    ['dispatch via cli-devin please', false],
    ['cli-devin is allowed here', false],
    // Policy deny: `do not` opens the sentence, so the sentence is not a reset form.
    ['do not use opencode, use cli-devin', true],
    // Policy deny: a lowercase follow-on phrase stays inside the refusal sentence.
    ['never use codex. use cli-devin', true],
    // A terminator followed by a capital starts a new sentence, so the earlier refusal no longer applies.
    ['Never use codex. Use cli-devin', false],
    ['Skip the tests! Run cli-devin', false],
    ["it's fine to use cli-devin", false],
  ])('%s', (userText, expected) => {
    expect(denied('devin -p "task"', userText)).toBe(expected);
  });
});

describe('Pi reset forms across executor aliases', () => {
  // A reset names a different executor; two spellings of one executor are that one executor,
  // so refusing `claude` must not authorize `cli-claude-code`.
  it.each([
    ['claude -p "task"', 'not claude, use cli-claude-code', true],
    ['codex exec "task"', 'not codex, use cli-codex', true],
    ['opencode run "task"', 'not opencode, use cli-opencode', true],
    ['opencode run "task"', 'not opencode2, use cli-opencode', true],
    ['devin -p "task"', 'not devin, use cli-devin', true],
    ['devin -p "task"', 'not Devin, use cli-devin', true],
    ['pi -p "task"', 'not pi, use cli-pi', true],
    ['cursor-agent -p "task"', 'not cursor-agent, use cli-cursor', true],
    ['cursor-agent -p "task"', 'not cursor but cli-cursor', true],
    ['devin -p "task"', 'not cli-devin but cli-devin', true],
    ['devin -p "task"', 'not opencode, use cli-devin', false],
    ['claude -p "task"', 'not codex, use cli-claude-code', false],
  ])('%s', (command, userText, expected) => {
    expect(denied(command, userText)).toBe(expected);
  });
});

describe('registered Pi extension boundary', () => {
  // The tool_call path runs every hard rule, the binary availability checks included, and
  // those read PATH. A CI runner has no devin or pi, so a dispatch these tests allow would
  // be refused for the machine instead of the command. Stub binaries keep the verdict about
  // the command alone.
  let stubDir = '';
  let savedPath: string | undefined;
  beforeAll(() => {
    stubDir = mkdtempSync(join(tmpdir(), 'pi-preflight-bin-'));
    for (const name of ['devin', 'pi']) {
      const file = join(stubDir, name);
      writeFileSync(file, '#!/bin/sh\nexit 0\n');
      chmodSync(file, 0o755);
    }
    savedPath = process.env.PATH;
    process.env.PATH = `${stubDir}${delimiter}${savedPath ?? ''}`;
  });
  afterAll(() => {
    if (savedPath === undefined) delete process.env.PATH;
    else process.env.PATH = savedPath;
    rmSync(stubDir, { recursive: true, force: true });
  });

  it('registers input and tool_call callbacks on the default factory', () => {
    const { api, handlers } = makeExtensionApi();
    dispatchPreflightLint(api);
    expect(handlers.get('input')).toHaveLength(1);
    expect(handlers.get('tool_call')).toHaveLength(1);
  });

  it.each([false, true])('keeps raw authorization stable across transform order: %s', async (transformFirst) => {
    const { result, transformedTexts } = await invokeFactory('run the task', 'devin -p "task"', { transformFirst });
    expect(transformedTexts[0]).toContain('Advisor: injected cli-devin example');
    expect(result?.block).toBe(true);
  });

  it('allows a positive raw user override for the inspected executor', async () => {
    const { result } = await invokeFactory('dispatch via cli-devin', 'devin -p "task" </dev/null');
    expect(result).toBeUndefined();
  });

  // A wrapped payload with escaped quotes is read whole, so a named dispatch is allowed
  // rather than cut at the first escaped quote and denied as ambiguous.
  it('allows a named dispatch wrapped in bash -c with escaped quotes', async () => {
    const { result } = await invokeFactory(
      'dispatch via cli-devin',
      String.raw`bash -c "devin -p \"task\" </dev/null"`,
    );
    expect(result).toBeUndefined();
  });

  // An authorized executor is still bound by its skill's hard rules: a dispatch
  // without `</dev/null` can hang on inherited stdin, so the rule blocks it.
  it('blocks a permitted dispatch that omits the stdin redirect', async () => {
    const { result } = await invokeFactory('dispatch via cli-devin', 'devin -p "task"');
    expect(result?.block).toBe(true);
    expect(result?.reason).toContain('[stdin-redirect-required]');
  });

  // A wrapper word hides the executor from the command-word classifier, so these dispatches
  // reached neither authorization nor the hard rules. Both now follow the resolved packet.
  it.each([
    'command codex exec task </dev/null',
    'nohup opencode run -m p/m "task" </dev/null',
    'timeout 60 devin -p "task" </dev/null',
    String.raw`perl -e 'alarm 60; exec @ARGV' -- pi --offline -m p/m -p "task" </dev/null`,
  ])('denies a wrapped dispatch: %s', async (command) => {
    const { result } = await invokeFactory('run the task', command);
    expect(result?.block).toBe(true);
  });

  // Naming the executor authorizes a wrapped dispatch exactly as it authorizes the bare form.
  it('allows a named dispatch behind an exec wrapper', async () => {
    const { result } = await invokeFactory(
      'dispatch via cli-opencode',
      'nohup opencode run -m p/m "task" </dev/null',
    );
    expect(result).toBeUndefined();
  });

  // Authorization is not exemption: the wrapped dispatch still answers to its packet's rules,
  // and a run without the stdin redirect can hang on inherited stdin.
  it('blocks a named wrapper dispatch that omits the stdin redirect', async () => {
    const { result } = await invokeFactory('dispatch via cli-opencode', 'nohup opencode run -m p/m "task"');
    expect(result?.block).toBe(true);
    expect(result?.reason).toContain('[stdin-redirect-required]');
  });

  // A variable executor stays unproven no matter how the dispatch is named: the request
  // authorizes a skill, it does not turn an unreadable command into a known one.
  it('keeps an ambiguous dispatch denied even when it is named', async () => {
    const { result } = await invokeFactory('dispatch via cli-devin', 'devin -p "$TASK" </dev/null');
    expect(result?.block).toBe(true);
  });

  // A heredoc fed to a shell runs its body, so a dispatch in that body is a dispatch even
  // though the command word belongs to the shell.
  it('denies a dispatch in a heredoc a shell runs', async () => {
    const { result } = await invokeFactory('run the task', 'bash <<\'EOF\'\ndevin -p "task" </dev/null\nEOF');
    expect(result?.block).toBe(true);
  });

  // Allowed is not the same as silent: a warn-severity rule earns an advisory,
  // and an advisory must never read as a denial.
  it('advises without blocking when a permitted dispatch trips a warn-severity rule', async () => {
    const { result } = await invokeFactory(
      'dispatch via cli-opencode',
      'opencode run --model openai/gpt-5.5 --share "task" </dev/null',
    );
    expect(result?.block).not.toBe(true);
    expect(result?.reason).toContain('Dispatch advisory for cli-opencode');
    expect(result?.reason).toContain('[share-requires-confirmation]');
  });

  it.each([
    ['negated mention', 'devin -p "task"', 'do not use cli-devin'],
    ['quoted mention', 'devin -p "task"', 'use "cli-devin"'],
    ['variable executor', '$CLI -p task', 'dispatch via cli-devin'],
    ['alias executor', 'alias d=devin; d -p task', 'dispatch via cli-devin'],
    ['bash -c wrapped executor', 'bash -c \'devin -p task\'', 'run the task'],
  ])('denies %s through the registered tool_call boundary', async (_name, command, rawText) => {
    const { result } = await invokeFactory(rawText, command);
    expect(result?.block).toBe(true);
  });

  it('tells the caller what an ambiguous command must look like', async () => {
    const { result } = await invokeFactory('dispatch via cli-devin', '$CLI -p task');
    expect(result?.block).toBe(true);
    expect(result?.reason).toContain('Call one executor by its literal name');
    // A path-qualified executor such as `~/bin/pi -p` is direct, so the advice must not forbid paths.
    expect(result?.reason).not.toContain('path');
  });

  // Pi has no in-process delegation of its own, so a named cli-pi dispatch is judged by the
  // same override rule as any sibling executor rather than refused for being Pi.
  it('allows a named cli-pi dispatch and still denies an unnamed one', async () => {
    const { result: named } = await invokeFactory('use cli-pi', 'pi --offline -p "task" </dev/null');
    expect(named).toBeUndefined();

    const { result: unnamed } = await invokeFactory('run the task', 'pi --offline -p "task" </dev/null');
    expect(unnamed?.block).toBe(true);
  });

  it('denies an executor mismatch and a mismatched deep-loop executor', async () => {
    const { result: directMismatch } = await invokeFactory('dispatch via cli-cursor', 'devin -p "task"');
    const { result: deepMismatch } = await invokeFactory('/deep:review --executor cli-opencode', 'devin -p "task"');
    expect(directMismatch?.block).toBe(true);
    expect(deepMismatch?.block).toBe(true);
  });

  it('denies a missing or mismatched session capture', async () => {
    const { result } = await invokeFactory('dispatch via cli-devin', 'devin -p "task"', {
      inputSession: 'session-a',
      toolSession: 'session-b',
    });
    expect(result?.block).toBe(true);
  });

  it('replaces the raw capture for each new turn', async () => {
    resetRawPiUserInputCapture();
    const { api, handlers } = makeExtensionApi();
    dispatchPreflightLint(api);
    const inputHandler = handlers.get('input')?.[0];
    const toolHandler = handlers.get('tool_call')?.[0];
    if (!inputHandler || !toolHandler) throw new Error('factory handlers missing');
    const ctx = context('session-a');
    await inputHandler({ type: 'input', source: 'interactive', text: 'dispatch via cli-devin' }, ctx);
    await inputHandler({ type: 'input', source: 'interactive', text: 'run the task' }, ctx);
    const result = await toolHandler({
      type: 'tool_call',
      toolCallId: 'call-2',
      toolName: 'bash',
      input: { command: 'devin -p "task"' },
    }, ctx);
    expect(result?.block).toBe(true);
  });

  it('captures before the real advisor transform when the advisor is registered first', async () => {
    resetRawPiUserInputCapture();
    const { api, handlers } = makeExtensionApi();
    promptAdvisor(api);
    dispatchPreflightLint(api);
    const ctx = context();
    const transformedTexts: string[] = [];
    let inputEvent: any = { type: 'input', source: 'interactive', text: 'run the task' };
    for (const handler of handlers.get('input') ?? []) {
      const output = await handler(inputEvent, ctx);
      const transformed = output as { action?: unknown; text?: unknown };
      if (transformed?.action === 'transform' && typeof transformed.text === 'string') {
        transformedTexts.push(transformed.text);
        inputEvent = { ...inputEvent, text: transformed.text };
      }
    }
    // The visible prompt must no longer carry the removed dispatch directive.
    expect(transformedTexts.at(-1) ?? '').not.toContain('Pi subagent dispatch');
    const toolHandler = handlers.get('tool_call')?.[0];
    if (!toolHandler) throw new Error('factory handler missing');
    const result = await toolHandler({
      type: 'tool_call',
      toolCallId: 'call-advisor',
      toolName: 'bash',
      input: { command: 'devin -p "task"' },
    }, ctx);
    expect(result?.block).toBe(true);
  });

  it('does not evaluate non-bash tools', async () => {
    resetRawPiUserInputCapture();
    const { api, handlers } = makeExtensionApi();
    dispatchPreflightLint(api);
    const toolHandler = handlers.get('tool_call')?.[0];
    if (!toolHandler) throw new Error('factory handler missing');
    const result = await toolHandler({
      type: 'tool_call',
      toolCallId: 'call-3',
      toolName: 'read',
      input: { command: 'devin -p "task"' },
    }, context());
    expect(result).toBeUndefined();
  });
});
