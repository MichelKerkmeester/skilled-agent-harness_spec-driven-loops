import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(TEST_DIR, '../../../../../../../');
const SKILL_ROOT = join(REPO_ROOT, '.opencode/skills/system-deep-loop');
const ROLLOUT_ROOT = join(
  REPO_ROOT,
  '.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop',
);
const require = createRequire(import.meta.url);
const { compileRegistry } = require(join(ROLLOUT_ROOT, 'lib/registry-compiler.cjs')) as {
  compileRegistry: (input: Record<string, unknown>) => unknown;
};
const { sourceBytes } = require(join(ROLLOUT_ROOT, 'harness/build-artifacts.cjs')) as {
  sourceBytes: () => Record<string, Buffer>;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function baseInput(): Record<string, unknown> {
  const bytes = sourceBytes();
  return {
    activationGeneration: 1,
    hubRouter: JSON.parse(bytes['hub-router.json'].toString('utf8')),
    leafManifest: JSON.parse(bytes['leaf-manifest.json'].toString('utf8')),
    registry: JSON.parse(bytes['mode-registry.json'].toString('utf8')),
    skillMarkdown: bytes['SKILL.md'].toString('utf8'),
    skillRoot: SKILL_ROOT,
    smartRoutingMarkdown: bytes['smart-routing.md'].toString('utf8'),
    sourceBytes: bytes,
  };
}

function replaceSourceJson(input: Record<string, unknown>, sourceId: string, value: unknown): void {
  const bytes = input.sourceBytes as Record<string, Buffer>;
  bytes[sourceId] = Buffer.from(`${JSON.stringify(value)}\n`, 'utf8');
}

describe('deep-loop registry compiler identity resolution', () => {
  it('rejects a registry packet that does not resolve on disk', () => {
    const input = baseInput();
    const registry = clone(input.registry) as { modes: Array<{ packet: string }> };
    const leafManifest = clone(input.leafManifest) as {
      modes: Array<{ workflowMode: string; packet: string }>;
    };
    registry.modes[0].packet = 'deep-ghost';
    leafManifest.modes.find((entry) => entry.workflowMode === 'research')!.packet = 'deep-ghost';
    input.registry = registry;
    input.leafManifest = leafManifest;
    replaceSourceJson(input, 'mode-registry.json', registry);
    replaceSourceJson(input, 'leaf-manifest.json', leafManifest);

    expect(() => compileRegistry(input)).toThrowError(
      expect.objectContaining({ code: 'PACKET_NOT_FOUND' }),
    );
  });

  it('rejects a manifest leaf that does not resolve inside its packet', () => {
    const input = baseInput();
    const leafManifest = clone(input.leafManifest) as {
      modes: Array<{ workflowMode: string; leaves: string[] }>;
    };
    const mode = leafManifest.modes.find((entry) => entry.workflowMode === 'agent-improvement');
    expect(mode).toBeDefined();
    mode!.leaves.push('references/protocol/__missing__.md');
    input.leafManifest = leafManifest;
    replaceSourceJson(input, 'leaf-manifest.json', leafManifest);

    expect(() => compileRegistry(input)).toThrowError(
      expect.objectContaining({ code: 'LEAF_NOT_FOUND' }),
    );
  });

  it('reports the first unresolved identity when a packet and leaf are both invalid', () => {
    const input = baseInput();
    const registry = clone(input.registry) as { modes: Array<{ packet: string }> };
    const leafManifest = clone(input.leafManifest) as {
      modes: Array<{ workflowMode: string; packet: string; leaves: string[] }>;
    };
    const research = leafManifest.modes.find((entry) => entry.workflowMode === 'research');
    expect(research).toBeDefined();
    registry.modes[0].packet = 'deep-ghost';
    research!.packet = 'deep-ghost';
    research!.leaves = ['references/protocol/__missing__.md'];
    input.registry = registry;
    input.leafManifest = leafManifest;
    replaceSourceJson(input, 'mode-registry.json', registry);
    replaceSourceJson(input, 'leaf-manifest.json', leafManifest);

    expect(() => compileRegistry(input)).toThrowError(
      expect.objectContaining({
        code: 'PACKET_NOT_FOUND',
        message: expect.stringContaining('deep-ghost'),
      }),
    );
  });

  it('keeps the command benchmark in its own benchmark vocabulary', () => {
    const hubRouter = JSON.parse(
      readFileSync(join(SKILL_ROOT, 'hub-router.json'), 'utf8'),
    ) as {
      vocabularyClasses: Record<string, { keywords?: string[] }>;
    };
    expect(hubRouter.vocabularyClasses['command-benchmark-aliases']?.keywords)
      .toContain('/deep:command-benchmark');
    expect(hubRouter.vocabularyClasses['alignment-aliases']?.keywords)
      .not.toContain('/deep:command-benchmark');

    const compiled = compileRegistry(baseInput()) as {
      routingModel: {
        launcherVocabularies: Array<{ className: string; keywords: string[] }>;
      };
    };
    expect(compiled.routingModel.launcherVocabularies).toEqual([
      {
        className: 'command-benchmark-aliases',
        keywords: ['/deep:command-benchmark'],
      },
    ]);
  });

  it('preserves the three shared-packet improvement identities', () => {
    const compiled = compileRegistry(baseInput()) as {
      manifestResources: Array<{ workflowMode: string; resource: string }>;
      routeLeafSelections: Array<{
        workflowMode: string;
        leafPairs: Array<{ workflowMode: string; leafResourceId: string }>;
      }>;
    };
    const improvementModes = ['agent-improvement', 'model-benchmark', 'skill-benchmark'];
    const manifestModes = new Set(
      compiled.manifestResources
        .filter((entry) => improvementModes.includes(entry.workflowMode))
        .map((entry) => entry.workflowMode),
    );
    expect(manifestModes).toEqual(new Set(improvementModes));

    const selectedModes = compiled.routeLeafSelections
      .filter((selection) => improvementModes.includes(selection.workflowMode))
      .map((selection) => selection.workflowMode);
    expect(selectedModes).toEqual(improvementModes);
    for (const selection of compiled.routeLeafSelections.filter((entry) => improvementModes.includes(entry.workflowMode))) {
      expect(selection.leafPairs.length).toBeGreaterThan(0);
      expect(selection.leafPairs.every((pair) => pair.workflowMode === selection.workflowMode)).toBe(true);
    }
  });
});
