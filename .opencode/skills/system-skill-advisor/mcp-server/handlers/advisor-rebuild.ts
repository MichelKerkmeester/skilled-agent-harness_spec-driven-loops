// ───────────────────────────────────────────────────────────────
// MODULE: advisor_rebuild Handler
// ───────────────────────────────────────────────────────────────

import { resolve } from 'node:path';

import { indexSkillMetadata } from '../lib/skill-graph/skill-graph-db.js';
import { requireTrustedCaller } from '../lib/auth/trusted-caller.js';
import { computeAdvisorSourceSignature } from '../lib/freshness.js';
import { publishSkillGraphGeneration } from '../lib/freshness/generation.js';
import {
  AdvisorRebuildInputSchema,
  AdvisorRebuildOutputSchema,
} from '../schemas/advisor-tool-schemas.js';
import { readAdvisorStatus } from './advisor-status.js';

import type { MCPCallerContext } from '../lib/context/caller-context.js';
import type { SkillGraphIndexResult } from '../lib/skill-graph/skill-graph-db.js';
import type {
  AdvisorFreshness,
  AdvisorRebuildInput,
  AdvisorRebuildOutput,
  AdvisorStatusOutput,
} from '../schemas/advisor-tool-schemas.js';

type HandlerResponse = { content: Array<{ type: string; text: string }> };

interface AdvisorRebuildDependencies {
  readonly readStatus?: (input: { workspaceRoot: string }) => AdvisorStatusOutput;
  readonly indexSkills?: (skillsRoot: string) => SkillGraphIndexResult;
  readonly publishGeneration?: typeof publishSkillGraphGeneration;
  readonly sourceSignature?: typeof computeAdvisorSourceSignature;
  readonly workspaceRoot?: string;
}

type RebuildReason = AdvisorRebuildOutput['reason'];

function reasonFor(freshness: AdvisorFreshness, force: boolean): RebuildReason {
  if (force) {
    return 'force';
  }
  if (freshness === 'live') {
    return 'status-live';
  }
  return freshness;
}

function shouldSkipRebuild(before: AdvisorStatusOutput, force: boolean): boolean {
  return before.freshness === 'live'
    && before.trustState.state !== 'absent'
    && !force;
}

/** Rebuild the advisor skill graph on explicit operator request.
 *
 * `advisor_status` is diagnostic-only and never repairs stale state. Use this
 * function through the `advisor_rebuild` MCP tool when `advisor_status`
 * reports `stale`, `absent`, or `unavailable`, or pass `force: true` to rebuild
 * even when the current status is live.
 */
export function rebuildAdvisorIndex(
  input: AdvisorRebuildInput,
  dependencies: AdvisorRebuildDependencies = {},
): AdvisorRebuildOutput {
  const args = AdvisorRebuildInputSchema.parse(input);
  const workspaceRoot = resolve(args.workspaceRoot ?? dependencies.workspaceRoot ?? process.cwd());
  const readStatus = dependencies.readStatus ?? readAdvisorStatus;
  // Opt into the artifact integrity probe so a corrupt-on-disk SQLite reads as
  // stale and is repaired here rather than skipped on a 'live' generation.
  const before = readStatus({ workspaceRoot, checkArtifactIntegrity: true });
  const reason = reasonFor(before.freshness, args.force === true);

  if (shouldSkipRebuild(before, args.force === true)) {
    return AdvisorRebuildOutputSchema.parse({
      rebuilt: false,
      skipped: true,
      reason: 'status-live',
      freshnessBefore: before.freshness,
      freshnessAfter: before.freshness,
      generationBefore: before.generation,
      generationAfter: before.generation,
      skillCount: before.skillCount,
      summary: null,
      diagnostics: ['advisor_rebuild skipped because advisor_status is live; pass force:true to rebuild anyway'],
    });
  }

  const skillsRoot = resolve(workspaceRoot, '.opencode', 'skills');
  const summary = (dependencies.indexSkills ?? indexSkillMetadata)(skillsRoot);
  (dependencies.publishGeneration ?? publishSkillGraphGeneration)({
    workspaceRoot,
    changedPaths: [skillsRoot],
    reason: 'advisor_rebuild',
    state: 'live',
    sourceSignature: (dependencies.sourceSignature ?? computeAdvisorSourceSignature)(workspaceRoot),
  });
  const after = readStatus({ workspaceRoot });

  return AdvisorRebuildOutputSchema.parse({
    rebuilt: true,
    skipped: false,
    reason,
    freshnessBefore: before.freshness,
    freshnessAfter: after.freshness,
    generationBefore: before.generation,
    generationAfter: after.generation,
    skillCount: after.skillCount,
    summary,
    diagnostics: summary.warnings,
  });
}

/** Handle the advisor_rebuild MCP tool request.
 *
 * Rebuild mutates the shared skill graph, so it requires a trusted caller
 * just like skill_graph_scan; untrusted callers are rejected before any
 * status read or index write happens.
 */
export async function handleAdvisorRebuild(
  args: unknown,
  callerContext?: MCPCallerContext | null,
): Promise<HandlerResponse> {
  const trustedCaller = requireTrustedCaller(callerContext, 'advisor_rebuild');
  if (!trustedCaller.ok) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          error: 'advisor_rebuild requires trusted caller context',
          code: trustedCaller.code,
        }),
      }],
    };
  }

  const data = rebuildAdvisorIndex(AdvisorRebuildInputSchema.parse(args));
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data }, null, 2),
    }],
  };
}

/** Backward-compatible snake_case MCP handler alias. */
export const handle_advisor_rebuild = handleAdvisorRebuild;
