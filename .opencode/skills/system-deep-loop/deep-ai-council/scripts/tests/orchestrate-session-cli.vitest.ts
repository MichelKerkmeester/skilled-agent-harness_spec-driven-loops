import { describe, expect, it, vi } from 'vitest';

import { EventEmitter } from 'node:events';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { createSessionState, createRoundState } = require('../../../runtime/lib/council/session-state-hierarchy.cjs') as {
  createSessionState: (input?: Record<string, unknown>) => Record<string, unknown>;
  createRoundState: (input?: Record<string, unknown>) => Record<string, unknown>;
};
const { readRoundStateRecords } = require('../../../runtime/lib/council/round-state-jsonl.cjs') as {
  readRoundStateRecords: (path: string) => Record<string, unknown>[];
};
const { parseStateLog } = require('../lib/persist-artifacts.cjs') as {
  parseStateLog: (jsonl: string) => Record<string, unknown>[];
};
const { main, sessionStatePath } = require('../orchestrate-session.cjs') as {
  main: (argv?: string[], options?: Record<string, unknown>) => Promise<number>;
  sessionStatePath: (packetSpecFolder: string) => string;
};

function withTempPacket(run: (packetSpecFolder: string) => Promise<void>): Promise<void> {
  const tempDir = mkdtempSync(join(tmpdir(), 'council-orchestrate-session-cli-'));
  return run(tempDir).finally(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });
}

function sessionState(packetSpecFolder: string, seats: Array<Record<string, unknown>> = [{ id: 'seat-001' }]): Record<string, unknown> {
  return createSessionState({
    sessionId: 'council-cli-session-test',
    specFolder: packetSpecFolder,
    maxTopicsPerSession: 1,
    maxRoundsPerTopic: 1,
    topics: [{ title: 'Runner Entry Point', max_rounds_per_topic: 1 }],
    round: createRoundState({
      roundNumber: 1,
      seats,
    }),
  });
}

function inlineArgs(state: Record<string, unknown>, executorConfig: Record<string, unknown>, packetSpecFolder?: string): string[] {
  const args = [
    '--session-state',
    JSON.stringify(state),
    '--executor-config',
    JSON.stringify(executorConfig),
  ];
  if (packetSpecFolder) args.push('--packet-spec-folder', packetSpecFolder);
  return args;
}

function bufferedStream() {
  let text = '';
  return {
    write: (chunk: string) => {
      text += chunk;
    },
    text: () => text,
  };
}

function inertInterval() {
  const token = { unref: vi.fn() };
  const clear = vi.fn();
  return {
    setInterval: vi.fn(() => token),
    clearInterval: clear,
    token,
  };
}

describe('deep-ai-council session CLI runner', () => {
  it('loads inline JSON session state and executor config', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const stdout = bufferedStream();
      const stderr = bufferedStream();
      const timers = inertInterval();
      const state = sessionState(packetSpecFolder);
      const executorConfig = { executor: { model: 'test-model' }, cost_guards: { max_topics_per_session: 1 } };
      let seen: Record<string, unknown> | null = null;

      const exitCode = await main(inlineArgs(state, executorConfig), {
        stdout,
        stderr,
        setInterval: timers.setInterval,
        clearInterval: timers.clearInterval,
        orchestrateSession: async (input: Record<string, unknown>) => {
          seen = input;
          return {
            session_id: 'council-cli-session-test',
            topics_completed: 0,
            topic_results: [],
            skipped_topic_ids: [],
            stop_reason: 'test',
            session_state_path: sessionStatePath(packetSpecFolder),
          };
        },
      });

      expect(exitCode).toBe(0);
      expect(stderr.text()).toBe('');
      expect(JSON.parse(stdout.text())).toMatchObject({ session_id: 'council-cli-session-test', stop_reason: 'test' });
      expect((seen!.session_state as Record<string, unknown>)).toMatchObject({ session: { session_id: 'council-cli-session-test' } });
      const seenConfig = seen!.executor_config as Record<string, unknown>;
      expect(seenConfig.packet_spec_folder).toBe(packetSpecFolder);
      expect(typeof seenConfig.dispatchSeat).toBe('function');
      expect(timers.clearInterval).toHaveBeenCalledWith(timers.token);
    });
  });

  it('writes heartbeat progress records during a slow session and clears the timer', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const stdout = bufferedStream();
      const stderr = bufferedStream();
      const state = sessionState(packetSpecFolder);
      const intervalToken = { unref: vi.fn() };
      let heartbeat: (() => void) | null = null;
      const clearInterval = vi.fn();

      const exitCode = await main(inlineArgs(state, { executor: { model: 'test-model' } }), {
        stdout,
        stderr,
        setInterval: vi.fn((callback: () => void) => {
          heartbeat = callback;
          return intervalToken;
        }),
        clearInterval,
        orchestrateSession: async () => {
          heartbeat!();
          return {
            session_id: 'council-cli-session-test',
            topics_completed: 0,
            topic_results: [],
            skipped_topic_ids: [],
            stop_reason: 'slow-test',
            session_state_path: sessionStatePath(packetSpecFolder),
          };
        },
      });

      expect(exitCode).toBe(0);
      expect(clearInterval).toHaveBeenCalledWith(intervalToken);
      const records = readRoundStateRecords(sessionStatePath(packetSpecFolder));
      expect(records.filter((record) => record.event === 'session_heartbeat')).toHaveLength(1);
      expect(records[0]).toMatchObject({ type: 'progress_record', progress_delta: 0 });
    });
  });

  it('dispatches seats through a fake subprocess and persists stepwise seat artifacts', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const stdout = bufferedStream();
      const stderr = bufferedStream();
      const timers = inertInterval();
      const seats = [{ id: 'seat-001', lens: 'Analytical', role: 'Implementation realist', vantage: 'cli-opencode' }];
      const state = sessionState(packetSpecFolder, seats);
      const spawns: Array<{ command: string; args: string[] }> = [];
      const fakeSpawn = vi.fn((command: string, args: string[]) => {
        spawns.push({ command, args });
        const child = new EventEmitter() as EventEmitter & { stdout: EventEmitter; stderr: EventEmitter; kill: ReturnType<typeof vi.fn> };
        child.stdout = new EventEmitter();
        child.stderr = new EventEmitter();
        child.kill = vi.fn();
        queueMicrotask(() => {
          child.stdout.emit('data', Buffer.from('## Seat Recommendation\nUse the real runner.\n\nCouncil seat verdict: SUPPORT\n'));
          child.emit('close', 0, null);
        });
        return child;
      });

      const exitCode = await main(inlineArgs(state, {
        executor: { model: 'test-model' },
        cost_guards: { max_topics_per_session: 1, max_rounds_per_topic: 1 },
        seats,
      }), {
        stdout,
        stderr,
        spawn: fakeSpawn,
        setInterval: timers.setInterval,
        clearInterval: timers.clearInterval,
      });

      expect(exitCode).toBe(0);
      expect(stderr.text()).toBe('');
      expect(fakeSpawn).toHaveBeenCalledTimes(1);
      expect(spawns[0].command).toBe('opencode');
      expect(spawns[0].args.slice(0, 5)).toEqual(['run', '--agent', 'plan', '--model', 'test-model']);
      expect(spawns[0].args).not.toContain('--dangerously-skip-permissions');
      const seatPrompt = spawns[0].args[5];
      expect(seatPrompt).toContain('You are seat-001, a Analytical council seat');
      expect(seatPrompt).toContain('## Resolved Route');
      expect(seatPrompt).toContain('"mode": "ai-council"');
      expect(seatPrompt).toContain('Runner Entry Point');

      const seatDir = join(packetSpecFolder, 'ai-council', 'seats', 'round-001');
      expect(existsSync(seatDir)).toBe(true);
      const seatFiles = readdirSync(seatDir).filter((name) => name.endsWith('.md'));
      expect(seatFiles).toHaveLength(1);
      const seatArtifact = readFileSync(join(seatDir, seatFiles[0]), 'utf8');
      expect(seatArtifact).toContain('Council seat verdict: SUPPORT');

      const stateLog = readFileSync(join(packetSpecFolder, 'ai-council', 'ai-council-state.jsonl'), 'utf8');
      const records = parseStateLog(stateLog);
      const started = records.filter((record) => record.event === 'progress_record' && record.status === 'started');
      const completed = records.filter((record) => record.event === 'progress_record' && record.status === 'completed');
      expect(started).toHaveLength(1);
      expect(completed).toHaveLength(1);
      expect(completed[0]).toMatchObject({ seat_id: 'seat-001', progress_delta: 1 });
    });
  });
});
