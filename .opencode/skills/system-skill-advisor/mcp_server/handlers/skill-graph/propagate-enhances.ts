// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Propagate Enhances Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for skill_graph_propagate_enhances — detects and
// optionally applies missing inbound enhances edges across skills.

import { resolve } from 'node:path';
import type { MCPCallerContext } from '../../lib/context/caller-context.js';
import { requireTrustedCaller } from '../../lib/auth/trusted-caller.js';
import { errorResponse, okResponse, redactDiagnosticText } from './response-envelope.js';
import { propagateInboundEnhances } from '../../lib/cross-skill-edges/index.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface PropagateEnhancesArgs {
  skillsRoot?: string;
  mode?: 'report' | 'propose' | 'apply';
  minConfidence?: number;
  targetSkillIds?: string[];
  sourceSkillIds?: string[];
  applyCandidateIds?: string[];
  applyAllHighConfidence?: boolean;
  dryRun?: boolean;
}

type HandlerResponse = { content: Array<{ type: string; text: string }> };

// ───────────────────────────────────────────────────────────────
// 2. HANDLER
// ───────────────────────────────────────────────────────────────

/** Handle skill_graph_propagate_enhances tool call */
export async function handleSkillGraphPropagateEnhances(
  args: PropagateEnhancesArgs,
  callerContext?: MCPCallerContext | null,
): Promise<HandlerResponse> {
  try {
    const trustedCaller = requireTrustedCaller(callerContext);
    if (!trustedCaller.ok) {
      return errorResponse(trustedCaller.error, trustedCaller.code);
    }

    const cwd = process.cwd();
    const skillsRoot = resolve(cwd, args.skillsRoot ?? '.opencode/skills');

    // Workspace escape guard: resolved path must stay under cwd
    if (!skillsRoot.startsWith(cwd + '/') && skillsRoot !== cwd) {
      return errorResponse(
        `Refusing to scan outside workspace: ${redactDiagnosticText(skillsRoot)} is not under ${redactDiagnosticText(cwd)}`,
      );
    }

    const result = await propagateInboundEnhances({
      skillsRoot,
      mode: args.mode ?? 'report',
      minConfidence: args.minConfidence,
      targetSkillIds: args.targetSkillIds,
      sourceSkillIds: args.sourceSkillIds,
      applyCandidateIds: args.applyCandidateIds,
      applyAllHighConfidence: args.applyAllHighConfidence,
      dryRun: args.dryRun,
      writeIntent: 'automated',
    });

    return okResponse({
      skillsRoot,
      ...result,
    });
  } catch (err: unknown) {
    return errorResponse(
      `Skill graph propagate enhances failed: ${redactDiagnosticText(err instanceof Error ? err.message : String(err))}`,
    );
  }
}
