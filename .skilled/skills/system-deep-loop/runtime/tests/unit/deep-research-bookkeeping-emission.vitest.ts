// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Bookkeeping Emission
// ───────────────────────────────────────────────────────────────────
//
// The research workflows declare every state row as an append directive that
// the append gateway is expected to accept. Bookkeeping rows the research
// ledger schema pins to the legacy path (or has no stem for) are refused by
// the gateway with exit 1, so routing them through an append directive turns
// a normal step into a halt. This suite drives the real gateway CLI with a
// rendered minimum of every directive row and holds the two declarations in
// sync: rows routed through the gateway must be accepted, and rows the
// gateway refuses must be declared under state_write_protocol.

import { afterEach, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(here, '..', '..', 'scripts', 'append-mode-event.cjs');
const ASSETS_DIR = resolve(
  here, '..', '..', '..', '..', '..', '..',
  '.skilled', 'commands', 'deep', 'assets',
);

const WORKFLOW_FILES = ['deep-research-auto.yaml', 'deep-research-confirm.yaml'] as const;

type DirectiveKey = 'append_to_jsonl' | 'append_jsonl' | 'bookkeeping_log';

type Directive = {
  line: number;
  key: DirectiveKey;
  event: string | null;
  row: Record<string, unknown>;
};

type CliResult = {
  exitCode: number | null;
  reason: string;
};

const temporaryDirectories: string[] = [];

function createTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), `deep-research-bookkeeping-${prefix}-`));
  temporaryDirectories.push(dir);
  return dir;
}

afterEach(() => {
  while (temporaryDirectories.length > 0) {
    const dir = temporaryDirectories.pop();
    if (!dir) continue;
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      // A leaked temp directory is cleanup noise, not a test result.
    }
  }
});

// A directive template is JSON with `{placeholder}` holes, so it cannot be
// parsed until the holes are filled. The gateway's verdict must describe the
// row shape, not the placeholder text, so values that gate acceptance or feed
// a closed value set get a value the schema accepts. Everything else only
// needs to be JSON.
const ENUM_PLACEHOLDER_VALUES: Record<string, string> = {
  folder_state: 'spec-present',
};

function renderTemplate(template: string): string {
  return template.replace(
    /\{([A-Za-z_][A-Za-z0-9_.]*)\}/g,
    (match: string, token: string, offset: number, whole: string) => {
      let quoteCount = 0;
      for (let i = 0; i < offset; i += 1) {
        if (whole[i] === '"' && whole[i - 1] !== '\\') quoteCount += 1;
      }
      if (quoteCount % 2 === 1) {
        return ENUM_PLACEHOLDER_VALUES[token] ?? `p-${token.replace(/[^A-Za-z0-9_.-]/g, '_')}`;
      }
      if (/(^|\.)generation$|iteration|count$|_raw$|max_iterations|effective_min/.test(token)) return '1';
      if (/_pass$/.test(token)) return 'true';
      if (/score$|sources$/.test(token)) return '0';
      if (/questions$|^answered_count$/.test(token)) return '0';
      if (/_json$/.test(token) || /saturated_directions$/.test(token)) return '[]';
      return 'null';
    },
  );
}

function stripYamlQuotes(value: string): string {
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (value.startsWith('"') && value.endsWith('"')) {
    return JSON.parse(value) as string;
  }
  return value;
}

function extractDirectives(filePath: string): Directive[] {
  const lines = readFileSync(filePath, 'utf8').split('\n');
  const directives: Directive[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(
      /^(\s*)(?:-\s+)?(append_to_jsonl|append_jsonl|bookkeeping_log)\s*:\s*(.*)$/,
    );
    if (!match) continue;
    const line = index + 1;
    const indent = match[1].length;
    const key = match[2] as DirectiveKey;
    let value = match[3].trim();

    // A block scalar keeps its payload on the following indented lines; a
    // directive split that way still routes the same row.
    if (value === '|' || value === '|-' || value === '>' || value === '>-') {
      const block: string[] = [];
      while (index + 1 < lines.length) {
        const next = lines[index + 1];
        const nextIndent = next.match(/^\s*/)?.[0].length ?? 0;
        if (next.trim() !== '' && nextIndent <= indent) break;
        block.push(next.replace(new RegExp(`^\\s{0,${indent + 2}}`), ''));
        index += 1;
      }
      value = block.join(value.startsWith('|') ? '\n' : ' ').trim();
    }

    const row = JSON.parse(renderTemplate(stripYamlQuotes(value))) as Record<string, unknown>;
    directives.push({
      line,
      key,
      event: typeof row.event === 'string' ? row.event : null,
      row,
    });
  }

  return directives;
}

function readPinnedEvents(filePath: string): Set<string> {
  const lines = readFileSync(filePath, 'utf8').split('\n');
  const blockStart = lines.findIndex((line) => /^\s*pinned_bookkeeping\s*:\s*$/.test(line));
  if (blockStart === -1) return new Set();

  for (let index = blockStart + 1; index < lines.length; index += 1) {
    if (/^\S/.test(lines[index]) && lines[index].trim() !== '') break;
    const match = lines[index].match(/^\s*events\s*:\s*\[([^\]]*)\]\s*$/);
    if (!match) continue;
    return new Set(
      match[1].split(',').map((name) => name.trim()).filter(Boolean),
    );
  }
  return new Set();
}

function runGateway(
  runDirectory: string,
  authorityRoot: string,
  row: Record<string, unknown>,
  name: string,
): CliResult {
  const eventPath = join(runDirectory, `${name}.json`);
  writeFileSync(eventPath, JSON.stringify(row), 'utf8');

  const result = spawnSync(process.execPath, [
    CLI_PATH,
    '--mode', 'research',
    '--run-directory', runDirectory,
    '--event-json', eventPath,
  ], {
    encoding: 'utf8',
    env: { ...process.env, DEEP_LOOP_AUTHORITY_ROOT: authorityRoot },
  });

  const lastLine = (result.stdout ?? '').trim().split(/\r?\n/).filter(Boolean).at(-1) ?? '{}';
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(lastLine) as Record<string, unknown>;
  } catch {
    payload = {};
  }

  return {
    exitCode: result.status,
    reason: String(payload.reason ?? payload.code ?? ''),
  };
}

// The gateway opens a research ledger from a legacy config row with stable
// identity, so every directive row is checked against an already-open run.
const RUN_OPEN_ROW: Record<string, unknown> = {
  type: 'config',
  sessionId: 'bookkeeping-emission-session',
  lineageId: 'bookkeeping-emission-lineage',
  generation: 1,
  executor: 'native',
  maxIterations: 3,
};

describe('deep-research bookkeeping emission', () => {
  for (const file of WORKFLOW_FILES) {
    it(`routes only gateway-accepted rows through the append directives in ${file}`, () => {
      const filePath = join(ASSETS_DIR, file);
      const directives = extractDirectives(filePath);
      expect(directives.length).toBeGreaterThan(0);

      const label = file.replace(/[^A-Za-z0-9]+/g, '-');
      const runDirectory = createTempDir(`run-${label}`);
      const authorityRoot = createTempDir(`auth-${label}`);
      const openResult = runGateway(runDirectory, authorityRoot, RUN_OPEN_ROW, 'run-open');
      expect(openResult.exitCode, `run open refused: ${openResult.reason}`).toBe(0);

      const refusedEvents = new Set<string>();
      for (const directive of directives) {
        const result = runGateway(
          runDirectory,
          authorityRoot,
          directive.row,
          `line-${directive.line}`,
        );
        if (result.exitCode === 1 && directive.event) refusedEvents.add(directive.event);

        if (directive.key === 'append_to_jsonl' || directive.key === 'append_jsonl') {
          expect(
            result.exitCode,
            `${file}:${directive.line} ${directive.key} event=${directive.event ?? '-'} `
              + `was refused by the gateway: ${result.reason}`,
          ).toBe(0);
        }
      }

      const pinned = readPinnedEvents(filePath);
      const bookkeepingEvents = [
        ...new Set(
          directives
            .filter((directive) => directive.key === 'bookkeeping_log')
            .map((directive) => directive.event)
            .filter((event): event is string => event !== null),
        ),
      ];

      for (const event of bookkeepingEvents) {
        expect(
          pinned.has(event),
          `${file}: bookkeeping_log event ${event} is missing from `
            + 'state_write_protocol.pinned_bookkeeping.events',
        ).toBe(true);
      }

      for (const event of pinned) {
        expect(
          refusedEvents.has(event),
          `${file}: pinned_bookkeeping event ${event} is not refused by the gateway, `
            + 'so the declaration is stale',
        ).toBe(true);
      }
    }, 240_000);
  }

  it('lists the same pinned events in both workflows for the events they share', () => {
    const perFile = WORKFLOW_FILES.map((file) => {
      const filePath = join(ASSETS_DIR, file);
      const directives = extractDirectives(filePath);
      return {
        file,
        events: new Set(
          directives
            .map((directive) => directive.event)
            .filter((event): event is string => event !== null),
        ),
        pinned: readPinnedEvents(filePath),
      };
    });

    const [first, second] = perFile;
    for (const event of first.events) {
      if (!second.events.has(event)) continue;
      expect(
        second.pinned.has(event),
        `pinned_bookkeeping disagreement for the shared event ${event} `
          + `between ${first.file} and ${second.file}`,
      ).toBe(first.pinned.has(event));
    }
  });
});
