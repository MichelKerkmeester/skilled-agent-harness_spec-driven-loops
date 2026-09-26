import type { SkillRecord } from "./types.js";

const UNSAFE_SKILL_NAME_CHARS = /[\u0000-\u001F\u007F\u2028\u2029]/;
const UNSAFE_METADATA_CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u2028\u2029]/g;
const MAX_INDEXED_DESCRIPTION_LENGTH = 1024;

function normalizeIndexedDescription(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(UNSAFE_METADATA_CONTROL_CHARS, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_INDEXED_DESCRIPTION_LENGTH);
}

export function isModelVisibleSkill(skill: SkillRecord): boolean {
  return skill.modelVisible !== false;
}

export function toSkillRecords(rawSkills: unknown): SkillRecord[] {
  if (!Array.isArray(rawSkills)) return [];
  const out: SkillRecord[] = [];
  const seen = new Set<string>();
  for (const raw of rawSkills) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const name = typeof r.name === "string" ? r.name.trim() : "";
    const description = normalizeIndexedDescription(r.description);
    const filePath = [r.filePath, r.path, r.skillPath].find((v) => typeof v === "string") as string | undefined;
    if (!name || UNSAFE_SKILL_NAME_CHARS.test(name) || !filePath || seen.has(name)) continue;
    seen.add(name);
    const source = typeof r.source === "string" ? r.source : undefined;
    out.push({
      name,
      description,
      filePath,
      source,
      modelVisible: r.disableModelInvocation !== true,
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export function toSkillRecordsFromCommands(rawCommands: unknown): SkillRecord[] {
  if (!Array.isArray(rawCommands)) return [];
  const out: SkillRecord[] = [];
  const seen = new Set<string>();
  for (const raw of rawCommands) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    if (r.source !== "skill") continue;
    const commandName = typeof r.name === "string" ? r.name.trim() : "";
    const name = commandName.startsWith("skill:") ? commandName.slice("skill:".length).trim() : commandName;
    const description = normalizeIndexedDescription(r.description);
    const sourceInfo = r.sourceInfo && typeof r.sourceInfo === "object"
      ? r.sourceInfo as Record<string, unknown>
      : undefined;
    const filePath = sourceInfo && typeof sourceInfo.path === "string" ? sourceInfo.path : "";
    if (!name || UNSAFE_SKILL_NAME_CHARS.test(name) || !filePath || seen.has(name)) continue;
    seen.add(name);
    // Slash-command metadata deliberately does not claim model visibility. The
    // authoritative visibility flag arrives in before_agent_start via Pi's
    // structured skill records; cached prompt records win during merge.
    out.push({ name, description, filePath, source: "skill-command" });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export function mergeSkillRecords(...sets: SkillRecord[][]): SkillRecord[] {
  const merged = new Map<string, SkillRecord>();
  for (const records of sets) {
    for (const record of records) {
      if (!merged.has(record.name)) merged.set(record.name, record);
    }
  }
  return [...merged.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Find Pi-style <available_skills> catalogue ranges that are safe to strip.
 *
 * We deliberately scan every block instead of assuming the first XML block is
 * Pi's catalogue. Another extension may prepend unrelated XML, and duplicated
 * native catalogues must not leak a second all-skill list into model context.
 */
function nativeSkillCatalogRanges(systemPrompt: string, skills: SkillRecord[]): Array<{ start: number; end: number }> {
  const openTag = "<available_skills>";
  const closeTag = "</available_skills>";
  const preamble = "The following skills provide specialized instructions for specific tasks.";
  const visible = skills.filter(isModelVisibleSkill);
  const ranges: Array<{ start: number; end: number }> = [];

  let cursor = 0;
  while (cursor < systemPrompt.length) {
    const open = systemPrompt.indexOf(openTag, cursor);
    if (open < 0) break;
    const close = systemPrompt.indexOf(closeTag, open + openTag.length);
    if (close < 0) break;

    const end = close + closeTag.length;
    const section = systemPrompt.slice(open, end);
    const knownSkillPresent = visible.some((skill) =>
      section.includes(`<name>${escapeXml(skill.name)}</name>`),
    );

    // Associate Pi's native preamble only with the current XML block. A
    // preamble belonging to an earlier block must not make a later unrelated
    // <available_skills> block look native.
    const previousClose = systemPrompt.lastIndexOf(closeTag, Math.max(0, open - 1));
    const preambleAt = systemPrompt.lastIndexOf(preamble, open);
    const hasAssociatedPreamble = preambleAt >= 0 && preambleAt > previousClose;

    if (knownSkillPresent || hasAssociatedPreamble) {
      let start = hasAssociatedPreamble ? preambleAt : open;
      if (hasAssociatedPreamble) {
        while (start > 0 && systemPrompt[start - 1] === "\n") start -= 1;
      }
      ranges.push({ start, end });
    }

    cursor = end;
  }

  return ranges;
}

/**
 * Remove every safely recognized Pi native skill catalogue and insert exactly
 * one Skill Orchestrator replacement at the first removed position.
 */
export function replaceNativeSkillCatalog(systemPrompt: string, skills: SkillRecord[], replacement: string): string {
  const ranges = nativeSkillCatalogRanges(systemPrompt, skills);
  if (!ranges.length) return systemPrompt;

  let out = "";
  let cursor = 0;
  let inserted = false;
  for (const range of ranges) {
    out += systemPrompt.slice(cursor, range.start);
    if (!inserted) {
      out += `\n\n${replacement}`;
      inserted = true;
    }
    cursor = range.end;
  }
  out += systemPrompt.slice(cursor);
  return out;
}

export function containsKnownNativeSkillCatalog(systemPrompt: string, skills: SkillRecord[]): boolean {
  return nativeSkillCatalogRanges(systemPrompt, skills).length > 0;
}

/**
 * Detect skill metadata that still looks like Pi's eager catalogue after the
 * safe stripping pass. This is intentionally broader than
 * containsKnownNativeSkillCatalog(): it can flag a malformed or future-format
 * catalogue that we refuse to delete blindly, while avoiding warnings for an
 * unrelated <available_skills> block that contains none of Pi's known skills.
 */
export function containsPotentialNativeSkillCatalog(systemPrompt: string, skills: SkillRecord[]): boolean {
  const preamble = "The following skills provide specialized instructions for specific tasks.";
  if (systemPrompt.includes(preamble)) return true;

  const visible = skills.filter(isModelVisibleSkill);
  if (!visible.length) return false;

  const hasAvailableSkillsMarker = /<available_skills(?:\s|>)/i.test(systemPrompt);
  for (const skill of visible) {
    const escapedNameTag = `<name>${escapeXml(skill.name)}</name>`;
    const hasKnownName = systemPrompt.includes(escapedNameTag) || systemPrompt.includes(skill.name);
    const hasKnownPath = !!skill.filePath && systemPrompt.includes(skill.filePath);
    if (hasAvailableSkillsMarker && (hasKnownName || hasKnownPath)) return true;
    // Future Pi formats may stop using <available_skills>. Requiring both the
    // skill name and its exact discovered path keeps this fallback specific
    // enough to warn without treating ordinary prose mentions as a catalogue.
    if (hasKnownName && hasKnownPath) return true;
  }
  return false;
}
