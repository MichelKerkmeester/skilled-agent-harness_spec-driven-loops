import { isModelVisibleSkill } from "./catalog.ts";
import type { DependencyResolution, SkillManagerConfig, SkillRecord } from "./types.js";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isNegatedReference(body: string, index: number): boolean {
  const prefix = body.slice(Math.max(0, index - 64), index).toLowerCase();
  return /\b(?:do\s+not|don't|never|avoid)\b(?:\s+[a-z0-9_-]+){0,3}\s*$/.test(prefix);
}

function hasPositiveMatch(body: string, pattern: RegExp): boolean {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const global = new RegExp(pattern.source, flags);
  for (let match = global.exec(body); match; match = global.exec(body)) {
    if (!isNegatedReference(body, match.index)) return true;
    if (match[0].length === 0) global.lastIndex += 1;
  }
  return false;
}

export function detectDependencies(body: string, currentSkill: string, names: Iterable<string>): string[] {
  const found = new Set<string>();
  for (const name of names) {
    if (name === currentSkill) continue;
    const n = escapeRegex(name);
    const patterns = [
      new RegExp("\\/skill:" + n + "(?=\\s|$)", "i"),
      new RegExp("\\bskill\\s*\\(\\s*[\"\']" + n + "[\"\']\\s*\\)", "i"),
      new RegExp("\\b(?:invoke|call|load|use|run)\\s+(?:the\\s+)?[`\"\']?" + n + "[`\"\']?(?:\\s+skill)?\\b", "i"),
      new RegExp("\\b" + n + "\\s+skill\\b", "i"),
      new RegExp("(?:^|[\\s(])\\.\\.\\/" + n + "\\/SKILL\\.md\\b", "i"),
    ];
    if (patterns.some((p) => hasPositiveMatch(body, p))) found.add(name);
  }
  return [...found].sort();
}

export function effectiveDependencies(
  skill: string,
  autoDetected: Iterable<string>,
  config: SkillManagerConfig,
): string[] {
  const ignored = new Set(config.ignoreAutoDetected[skill] ?? []);
  const configured = config.autoload[skill] ?? [];
  return [...new Set([...autoDetected].filter((n) => !ignored.has(n)).concat(configured))].sort();
}

export async function resolveDependencyGraph(
  root: string,
  skills: Map<string, SkillRecord>,
  config: SkillManagerConfig,
  readBody: (skill: SkillRecord) => Promise<string>,
): Promise<DependencyResolution> {
  const order: string[] = [];
  const missing = new Set<string>();
  const cycles: string[][] = [];
  const edges: Record<string, string[]> = {};
  const permanent = new Set<string>();
  const active: string[] = [];

  const visit = async (name: string): Promise<void> => {
    if (permanent.has(name)) return;
    const cycleAt = active.indexOf(name);
    if (cycleAt >= 0) {
      cycles.push([...active.slice(cycleAt), name]);
      return;
    }
    const record = skills.get(name);
    if (!record) {
      missing.add(name);
      return;
    }
    active.push(name);
    const body = await readBody(record);
    // Respect Pi's disable-model-invocation contract for automatic edges.
    // A manual-only skill may still be explicitly selected by the user or
    // deliberately configured in autoload, but merely mentioning it in a
    // model-invokable skill must not cause autonomous loading.
    const autoCandidates = [...skills.values()].filter(isModelVisibleSkill).map((skill) => skill.name);
    const auto = detectDependencies(body, name, autoCandidates);
    const deps = effectiveDependencies(name, auto, config);
    edges[name] = deps;
    for (const dep of deps) await visit(dep);
    active.pop();
    permanent.add(name);
    order.push(name);
  };

  await visit(root);
  return { root, order, edges, missing: [...missing].sort(), cycles };
}
