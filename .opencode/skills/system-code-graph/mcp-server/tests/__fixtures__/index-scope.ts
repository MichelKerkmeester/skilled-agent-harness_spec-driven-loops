export interface IndexScopePolicy {
  includeSkills: boolean;
  includedSkillsList: string | string[];
  includeAgents?: boolean;
  includeCommands?: boolean;
  includeSpecs?: boolean;
  includePlugins?: boolean;
}

export function shouldIndexForCodeGraph(filePath: string, policy: IndexScopePolicy): boolean {
  if (filePath.includes('.opencode/skills/')) {
    if (policy.includeSkills) {
      if (policy.includedSkillsList === 'all') return true;
      if (Array.isArray(policy.includedSkillsList)) {
        return policy.includedSkillsList.some((skill) => filePath.includes(`/${skill}/`));
      }
    }
    return false;
  }

  if (filePath.includes('.opencode/agents/')) return !!policy.includeAgents;
  if (filePath.includes('.opencode/commands/')) return !!policy.includeCommands;
  if (filePath.includes('.opencode/specs/')) return !!policy.includeSpecs;
  if (filePath.includes('.opencode/plugins/')) return !!policy.includePlugins;

  return true;
}
