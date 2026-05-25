// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Index Scope Policy
// ───────────────────────────────────────────────────────────────

const SEGMENT_BOUNDARY = '(^|/)';

function compileSegmentPattern(segment: string): RegExp {
  return new RegExp(`${SEGMENT_BOUNDARY}${segment}(/|$)`, 'i');
}

function normalizeIndexScopePath(filePath: string | null | undefined): string {
  if (!filePath || typeof filePath !== 'string') return '';
  return filePath.replace(/\\/g, '/').replace(/\/+/g, '/');
}

function matchesAnyPattern(filePath: string, patterns: readonly RegExp[]): boolean {
  const normalizedPath = normalizeIndexScopePath(filePath);
  return patterns.some(pattern => pattern.test(normalizedPath));
}

function getOpencodeSegment(filePath: string, segment: string): string | null {
  const normalizedPath = normalizeIndexScopePath(filePath);
  const match = normalizedPath.match(new RegExp(`(^|/)\\.opencode/${segment}/([^/]+)(/|$)`, 'i'));
  return match?.[2] ?? null;
}

function isAllowedByBooleanScope(filePath: string, segment: string, enabled: unknown): boolean {
  return getOpencodeSegment(filePath, segment) === null || enabled === true;
}

function isAllowedSkill(filePath: string, policy: Record<string, unknown>): boolean {
  const skillName = getOpencodeSegment(filePath, 'skills');
  if (!skillName) {
    return true;
  }

  const includedSkillsList = policy.includedSkillsList;
  if (includedSkillsList === 'all') {
    return true;
  }
  if (Array.isArray(includedSkillsList)) {
    return includedSkillsList.includes(skillName);
  }
  return false;
}

export const EXCLUDED_FOR_CODE_GRAPH = [
  compileSegmentPattern('external'),
  compileSegmentPattern('node_modules'),
  compileSegmentPattern('\\.git'),
  compileSegmentPattern('dist'),
  compileSegmentPattern('vendor'),
  compileSegmentPattern('z_future'),
  compileSegmentPattern('z_archive'),
] as const;

export function shouldIndexForCodeGraph(
  absolutePath: string,
  policyInput?: unknown,
): boolean {
  if (matchesAnyPattern(absolutePath, EXCLUDED_FOR_CODE_GRAPH)) {
    return false;
  }

  if (!policyInput || typeof policyInput !== 'object') {
    return true;
  }

  const policy = policyInput as Record<string, unknown>;
  return isAllowedSkill(absolutePath, policy)
    && isAllowedByBooleanScope(absolutePath, 'agents', policy.includeAgents)
    && isAllowedByBooleanScope(absolutePath, 'commands', policy.includeCommands)
    && isAllowedByBooleanScope(absolutePath, 'specs', policy.includeSpecs)
    && isAllowedByBooleanScope(absolutePath, 'plugins', policy.includePlugins);
}
