export interface SkillRecord {
  name: string;
  description: string;
  filePath: string;
  source?: string;
  /** false when Pi marks the skill disable-model-invocation; undefined means visibility is not known yet. */
  modelVisible?: boolean;
}

export interface SkillGroup {
  id: string;
  name: string;
  description: string;
  shortcutEnabled: boolean;
  order: number;
}

export interface SkillManagerConfig {
  version: 1;
  groups: SkillGroup[];
  memberships: Record<string, string[]>;
  autoload: Record<string, string[]>;
  ignoreAutoDetected: Record<string, string[]>;
  catalogDescriptionMax: number;
  /** Optional Headroom/RTK-style tool-output token saver. Off by default. */
  tokenSaverEnabled: boolean;
}

export interface DependencyResolution {
  root: string;
  order: string[];
  edges: Record<string, string[]>;
  missing: string[];
  cycles: string[][];
}

export interface LoadedSkill {
  name: string;
  description: string;
  filePath: string;
  body: string;
  automaticDependencies: string[];
  configuredDependencies: string[];
}
