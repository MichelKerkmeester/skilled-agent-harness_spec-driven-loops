import type { SkillRecord } from "./types.js";

export function filterSkillRecordsBySearch(skills: SkillRecord[], search: string): SkillRecord[] {
  const q = search.trim().toLowerCase();
  if (!q) return skills;
  return skills.filter((skill) => `${skill.name} ${skill.description}`.toLowerCase().includes(q));
}


function normalizedTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((token) => token.length >= 2);
}

function scoreSkillRecord(skill: SkillRecord, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const name = skill.name.toLowerCase();
  const description = skill.description.toLowerCase();
  const haystack = `${name} ${description}`;
  let score = 0;

  if (name === q) score += 200;
  if (name.startsWith(q)) score += 80;
  if (name.includes(q)) score += 60;
  if (description.includes(q)) score += 35;

  for (const token of [...new Set(normalizedTokens(q))]) {
    if (name === token) score += 45;
    else if (name.includes(token)) score += 24;
    if (description.includes(token)) score += 8;
    if (haystack.split(/[^a-z0-9]+/).includes(token)) score += 4;
  }
  return score;
}

export function rankSkillRecordsBySearch(
  skills: SkillRecord[],
  query: string,
  limit = 5,
): SkillRecord[] {
  const boundedLimit = Math.max(1, Math.min(8, Math.trunc(limit) || 5));
  return skills
    .map((skill) => ({ skill, score: scoreSkillRecord(skill, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.skill.name.localeCompare(b.skill.name))
    .slice(0, boundedLimit)
    .map(({ skill }) => skill);
}
