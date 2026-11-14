import { describe, expect, it } from 'vitest';

import { attachCommand, typedCommandForTop } from '../../../../../../../../.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts';
import { scoreAdvisorPrompt } from '../../../../../../../../.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts';
import { findAdvisorWorkspaceRoot } from '../../../../../../../../.skilled/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts';

const workspaceRoot = findAdvisorWorkspaceRoot(
  '/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/.skilled/skills/system-skill-advisor/runtime',
);

function passing(prompt: string): Array<{ skill: string; kind: string; command: string | null }> {
  return scoreAdvisorPrompt(prompt, { workspaceRoot }).recommendations
    .filter((recommendation) => recommendation.passes_threshold)
    .slice(0, 5)
    .map((recommendation) => ({
      skill: recommendation.skill,
      kind: recommendation.kind,
      command: recommendation.command ?? null,
    }));
}

describe('review pass four probes', () => {
  it('shows what the scorer passes for a question about a doctor command', () => {
    // Deliberately recorded, not asserted: the probe prints the rows the review
    // needs to decide whether the mention reader reaches this phrasing.
    console.log('is-the-doctor-update-command-safe', JSON.stringify(passing('Is the /doctor:update command safe?')));
    console.log('what-does-doctor-update-do', JSON.stringify(passing('what does /doctor:update do?')));
    console.log('doctor-update-documented', JSON.stringify(passing('The /doctor:update command is documented in the README')));
  });

  it('shows the retired command path for a refusal', () => {
    console.log('retired-refusal-typed', JSON.stringify(typedCommandForTop('sk-doc', 'do not run /create:skill')));
    console.log('retired-refusal-rows', JSON.stringify(passing('do not run /create:skill')));
  });

  it('shows a refusal list naming two commands', () => {
    const prompt = 'do not run /deep:review or /deep:research';
    console.log('refusal-list-rows', JSON.stringify(passing(prompt)));
    console.log('refusal-list-typed', JSON.stringify(typedCommandForTop('system-deep-loop', prompt)));
    console.log('refusal-list-data', JSON.stringify(typedCommandForTop('system-deep-loop', 'do not run /deep:review or /deep:research, I want neither')));
  });

  it('shows the small-edit route result for correction prompts', () => {
    const route = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'sk-create-readme' }] };
    for (const prompt of [
      'fix the typo in the readme and make sure the grammar is right',
      'fix the typo in the readme, add a missing link',
      'fix the typo in the new readme',
      'fix the typo in the README',
    ]) {
      console.log('small-edit', prompt, '=>', attachCommand('sk-doc', route, prompt) ?? 'none');
    }
    expect(true).toBe(true);
  });
});
