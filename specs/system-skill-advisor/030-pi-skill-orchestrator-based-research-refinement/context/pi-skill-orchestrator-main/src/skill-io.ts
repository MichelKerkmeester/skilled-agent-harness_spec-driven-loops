import { promises as fs } from "node:fs";
import type { LoadedSkill, SkillManagerConfig, SkillRecord } from "./types.js";
import { detectDependencies } from "./dependencies.ts";

function safeInlineMetadata(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F\u2028\u2029]+/g, " ").replace(/\s+/g, " ").trim();
}

function escapeXmlAttribute(value: string): string {
  return safeInlineMetadata(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function stripFrontmatter(text: string): string {
  if (!text.startsWith("---")) return text.trim();
  const m = text.match(/^---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n?/);
  return (m ? text.slice(m[0].length) : text).trim();
}

export async function readSkillBody(skill: SkillRecord): Promise<string> {
  const raw = await fs.readFile(skill.filePath, "utf8");
  const body = stripFrontmatter(raw);
  if (!body) throw new Error(`Skill ${skill.name} has no instruction body`);
  return body;
}

export async function loadSkill(
  skill: SkillRecord,
  allSkillNames: Iterable<string>,
  config: SkillManagerConfig,
): Promise<LoadedSkill> {
  const body = await readSkillBody(skill);
  const automaticDependencies = detectDependencies(body, skill.name, allSkillNames);
  return {
    name: skill.name,
    description: skill.description,
    filePath: skill.filePath,
    body,
    automaticDependencies,
    configuredDependencies: config.autoload[skill.name] ?? [],
  };
}

export function renderLoadedBundle(
  roots: string | string[],
  loaded: LoadedSkill[],
  issues: { missing?: string[]; cycles?: string[][] } = {},
): string {
  const rootList = Array.isArray(roots) ? roots : [roots];
  const safeRoots = rootList.map(safeInlineMetadata);
  const chunks = loaded.map((s) => [
    `## Loaded skill: ${safeInlineMetadata(s.name)}`,
    `Source directory: ${safeInlineMetadata(s.filePath.replace(/[/\\]SKILL\.md$/i, ""))}`,
    "",
    s.body,
  ].join("\n"));

  const warnings: string[] = [];
  if (issues.missing?.length) {
    warnings.push(`WARNING: Missing declared dependencies: ${issues.missing.map(safeInlineMetadata).join(", ")}. Continue only where the loaded instructions remain valid without them.`);
  }
  if (issues.cycles?.length) {
    warnings.push(`WARNING: Dependency cycle${issues.cycles.length === 1 ? "" : "s"} detected: ${issues.cycles.map((cycle) => cycle.map(safeInlineMetadata).join(" -> ")).join("; ")}. Each available skill was loaded at most once.`);
  }

  return [
    `<skill-orchestrator roots="${escapeXmlAttribute(rootList.join(", "))}">`,
    `Selected root skill${rootList.length === 1 ? "" : "s"}: ${safeRoots.join(", ")}`,
    "The following skill instructions were loaded in dependency order. Follow them as active instructions for this task. If a loaded skill explicitly invokes another installed skill that is not included below, call the `skill` tool with that exact skill name.",
    ...(warnings.length ? [warnings.join("\n")] : []),
    "",
    ...chunks,
    "</skill-orchestrator>",
  ].join("\n\n");
}
