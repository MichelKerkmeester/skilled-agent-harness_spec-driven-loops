import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { randomUUID } from "node:crypto";
import { DEFAULT_CONFIG, GLOBAL_CONFIG_PATH, normalizeConfig, normalizeScopeDescription, slugifyGroupId, validateScopeDisplayName } from "./config.ts";
import type { SkillManagerConfig } from "./types.js";

export const PROFILES_DIR = path.join(os.homedir(), ".pi", "agent", "skill-profiles");

export interface SkillProfileSummary {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

interface ProfileManifestV2 {
  version: 2;
  activeProfileId: string;
}

interface SkillProfileDocument extends SkillManagerConfig {
  profileId: string;
  profileName: string;
  profileDescription: string;
}

export interface LoadedProfileState {
  config: SkillManagerConfig;
  activeProfile: SkillProfileSummary;
  profiles: SkillProfileSummary[];
  error?: string;
}

export type ProfileMutationResult =
  | { ok: true; config: SkillManagerConfig; profile: SkillProfileSummary; profiles: SkillProfileSummary[] }
  | { ok: false; error: string };

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function assertSafeProfileId(id: string): string {
  const normalized = id.trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    throw new Error(`Invalid Skill Orchestrator profile id: ${id}`);
  }
  return normalized;
}

function pathEntryExists(filePath: string): boolean {
  try {
    fs.lstatSync(filePath);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

function atomicWriteJson(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmp = `${filePath}.tmp-${process.pid}-${randomUUID()}`;
  try {
    fs.writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    fs.renameSync(tmp, filePath);
  } finally {
    try { fs.rmSync(tmp, { force: true }); } catch {}
  }
}

function profilePath(id: string, profilesDir = PROFILES_DIR): string {
  return path.join(profilesDir, `${assertSafeProfileId(id)}.json`);
}

function normalizeProfileDocument(raw: unknown): SkillProfileDocument {
  if (!isObject(raw)) throw new Error("Profile must be a JSON object");
  const profileId = typeof raw.profileId === "string" ? assertSafeProfileId(raw.profileId) : "";
  const profileName = typeof raw.profileName === "string" ? validateScopeDisplayName(raw.profileName, "Profile") : "";
  const profileDescription = normalizeScopeDescription(raw.profileDescription);
  if (!profileId) throw new Error("Profile is missing profileId");
  if (!profileName) throw new Error("Profile is missing profileName");
  if (!profileShortcutName(profileName)) throw new Error(`Profile "${profileName}" does not produce a usable /skill-profile: token`);
  return {
    ...normalizeConfig(raw),
    profileId,
    profileName,
    profileDescription,
  };
}

function makeProfileDocument(id: string, name: string, description: string, config: SkillManagerConfig): SkillProfileDocument {
  const profileId = assertSafeProfileId(id);
  const profileName = validateScopeDisplayName(name, "Profile");
  if (!profileShortcutName(profileName)) throw new Error("Profile name must contain at least one letter, number, dot, dash, or underscore");
  return {
    ...normalizeConfig(config),
    profileId,
    profileName,
    profileDescription: normalizeScopeDescription(description),
  };
}

function summaryFromDocument(doc: SkillProfileDocument, activeProfileId: string): SkillProfileSummary {
  return {
    id: doc.profileId,
    name: doc.profileName,
    description: doc.profileDescription,
    active: doc.profileId === activeProfileId,
  };
}

function assertUniqueProfileTokens(docs: SkillProfileDocument[]): void {
  const seen = new Map<string, string>();
  for (const doc of docs) {
    const token = profileShortcutName(doc.profileName).toLowerCase();
    const existing = seen.get(token);
    if (existing) {
      throw new Error(`Profiles "${existing}" and "${doc.profileName}" map to the same /skill-profile: token`);
    }
    seen.set(token, doc.profileName);
  }
}

function uniqueProfileDisplayName(base: string, docs: SkillProfileDocument[]): string {
  const used = new Set(docs.map((doc) => profileShortcutName(doc.profileName).toLowerCase()));
  let candidate = validateScopeDisplayName(base, "Profile");
  let n = 2;
  while (used.has(profileShortcutName(candidate).toLowerCase())) {
    candidate = `${base} ${n++}`;
  }
  return candidate;
}

function makeDefaultProfile(): SkillProfileDocument {
  return makeProfileDocument("default", "Default", "", structuredClone(DEFAULT_CONFIG));
}

export function profileShortcutName(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^A-Za-z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function buildProfileCompletionItems(profiles: SkillProfileSummary[], prefix: string) {
  const q = prefix.trim().toLowerCase();
  return profiles
    .filter((profile) => {
      const token = profileShortcutName(profile.name);
      return !q || profile.name.toLowerCase().includes(q) || token.toLowerCase().includes(q);
    })
    .map((profile) => ({
      value: profileShortcutName(profile.name),
      label: profile.name,
      description: `${profile.active ? "ACTIVE · " : ""}${profile.description.replace(/\s+/g, " ").trim() || "Skill Orchestrator profile"}`,
    }));
}

export class SkillProfileStore {
  private managerPath: string;
  private profilesDir: string;

  constructor(managerPath = GLOBAL_CONFIG_PATH, profilesDir = PROFILES_DIR) {
    this.managerPath = managerPath;
    this.profilesDir = profilesDir;
  }

  private readManifest(): ProfileManifestV2 | null {
    if (!fs.existsSync(this.managerPath)) return null;
    const raw = JSON.parse(fs.readFileSync(this.managerPath, "utf8"));
    if (!isObject(raw)) throw new Error("Skill Orchestrator manager file must be a JSON object");
    if (raw.version === 2) {
      const activeProfileId = typeof raw.activeProfileId === "string" ? assertSafeProfileId(raw.activeProfileId) : "";
      if (!activeProfileId) throw new Error("Skill Orchestrator manager file is missing activeProfileId");
      return { version: 2, activeProfileId };
    }
    if (raw.version === 1) return null;
    throw new Error(`Unsupported Skill Orchestrator manager version: ${String(raw.version)}`);
  }

  private readProfile(id: string): SkillProfileDocument {
    const safeId = assertSafeProfileId(id);
    const filePath = profilePath(safeId, this.profilesDir);
    const stat = fs.lstatSync(filePath);
    if (!stat.isFile() || stat.isSymbolicLink()) {
      throw new Error(`Profile ${safeId}.json must be a regular file, not a symlink or special file`);
    }
    const doc = normalizeProfileDocument(JSON.parse(fs.readFileSync(filePath, "utf8")));
    if (doc.profileId !== safeId) {
      throw new Error(`Profile id mismatch in ${safeId}.json: found ${doc.profileId}`);
    }
    return doc;
  }

  private writeProfile(doc: SkillProfileDocument): void {
    atomicWriteJson(profilePath(doc.profileId, this.profilesDir), doc);
  }

  private writeManifest(activeProfileId: string): void {
    const safeId = assertSafeProfileId(activeProfileId);
    atomicWriteJson(this.managerPath, { version: 2, activeProfileId: safeId } satisfies ProfileManifestV2);
  }

  private listDocuments(): SkillProfileDocument[] {
    if (!fs.existsSync(this.profilesDir)) return [];
    const docs: SkillProfileDocument[] = [];
    for (const entry of fs.readdirSync(this.profilesDir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      const stem = entry.name.slice(0, -".json".length);
      try {
        const safeStem = assertSafeProfileId(stem);
        const doc = normalizeProfileDocument(JSON.parse(fs.readFileSync(path.join(this.profilesDir, entry.name), "utf8")));
        // A file cannot alias another profile by declaring a different id.
        if (doc.profileId !== safeStem) continue;
        docs.push(doc);
      } catch {
        // Invalid non-active profile files are omitted from the picker. If the
        // manifest points to one, readProfile() below surfaces the error.
      }
    }
    return docs.sort((a, b) => a.profileName.localeCompare(b.profileName));
  }

  /**
   * Return every safe profile filename stem, including corrupt/unreadable
   * documents. New profiles must never overwrite an existing file merely
   * because that file could not be parsed.
   */
  private occupiedProfileIds(): string[] {
    if (!fs.existsSync(this.profilesDir)) return [];
    const ids: string[] = [];
    for (const entry of fs.readdirSync(this.profilesDir, { withFileTypes: true })) {
      if ((!entry.isFile() && !entry.isSymbolicLink()) || !entry.name.endsWith(".json")) continue;
      const stem = entry.name.slice(0, -".json".length);
      try {
        ids.push(assertSafeProfileId(stem));
      } catch {
        // Unsafe filenames are ignored rather than ever being used as paths.
      }
    }
    return [...new Set(ids)];
  }

  private migrateLegacyConfig(raw: unknown): LoadedProfileState {
    const legacyConfig = normalizeConfig(raw);
    fs.mkdirSync(this.profilesDir, { recursive: true });
    const existing = this.listDocuments();
    assertUniqueProfileTokens(existing);
    const id = slugifyGroupId("default", this.occupiedProfileIds());
    const profileName = uniqueProfileDisplayName(existing.length ? "Imported Default" : "Default", existing);
    const doc = makeProfileDocument(id, profileName, "", legacyConfig);

    const backupPath = `${this.managerPath}.legacy-v1.json`;
    // Use lstat semantics for the destination: existsSync() reports false for
    // a dangling symlink, and copyFileSync() would otherwise follow that link
    // and write outside Skill Orchestrator's state directory. Existing backups
    // must therefore be ordinary files before migration is allowed to proceed.
    if (pathEntryExists(backupPath)) {
      const backupStat = fs.lstatSync(backupPath);
      if (!backupStat.isFile() || backupStat.isSymbolicLink()) {
        throw new Error(`Legacy backup path must be a regular file: ${backupPath}`);
      }
    } else if (fs.existsSync(this.managerPath)) {
      fs.copyFileSync(this.managerPath, backupPath);
    }

    let wroteProfile = false;
    try {
      this.writeProfile(doc);
      wroteProfile = true;
      this.writeManifest(id);
    } catch (error) {
      if (wroteProfile) {
        try { fs.unlinkSync(profilePath(id, this.profilesDir)); } catch {}
      }
      throw error;
    }
    const profiles = this.listDocuments().map((item) => summaryFromDocument(item, id));
    return { config: legacyConfig, activeProfile: summaryFromDocument(doc, id), profiles };
  }

  load(): LoadedProfileState {
    try {
      if (fs.existsSync(this.managerPath)) {
        const raw = JSON.parse(fs.readFileSync(this.managerPath, "utf8"));
        if (isObject(raw) && (raw.version === 1 || (raw.version === undefined && !("activeProfileId" in raw)))) {
          return this.migrateLegacyConfig(raw);
        }
      }

      const manifest = this.readManifest();
      if (manifest) {
        // Existing v2 state is read-only during load. Missing/corrupt active
        // profile state must surface as an error rather than silently changing
        // the user's active profile or overwriting the manager file.
        const active = this.readProfile(manifest.activeProfileId);
        const docs = this.listDocuments();
        assertUniqueProfileTokens(docs);
        const profiles = docs.map((doc) => summaryFromDocument(doc, active.profileId));
        return {
          config: normalizeConfig(active),
          activeProfile: summaryFromDocument(active, active.profileId),
          profiles: profiles.some((profile) => profile.id === active.profileId)
            ? profiles
            : [summaryFromDocument(active, active.profileId), ...profiles],
        };
      }

      // First-run initialization (or a profiles directory with no manager) is
      // the only non-migration load path allowed to create state.
      fs.mkdirSync(this.profilesDir, { recursive: true });
      let docs = this.listDocuments();
      assertUniqueProfileTokens(docs);
      let createdProfileId: string | undefined;
      if (docs.length === 0) {
        // A corrupt/unreadable profile file still owns its filename. Never
        // overwrite it just because listDocuments() cannot parse it.
        const id = slugifyGroupId("default", this.occupiedProfileIds());
        const doc = makeProfileDocument(id, "Default", "", structuredClone(DEFAULT_CONFIG));
        this.writeProfile(doc);
        createdProfileId = id;
        docs = [doc];
      }
      const active = docs[0];
      try {
        this.writeManifest(active.profileId);
      } catch (error) {
        if (createdProfileId) {
          try { fs.unlinkSync(profilePath(createdProfileId, this.profilesDir)); } catch {}
        }
        throw error;
      }
      return {
        config: normalizeConfig(active),
        activeProfile: summaryFromDocument(active, active.profileId),
        profiles: docs.map((doc) => summaryFromDocument(doc, active.profileId)),
      };
    } catch (error) {
      const fallback = makeDefaultProfile();
      return {
        config: structuredClone(DEFAULT_CONFIG),
        activeProfile: summaryFromDocument(fallback, fallback.profileId),
        profiles: [summaryFromDocument(fallback, fallback.profileId)],
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private writableState(): LoadedProfileState {
    const state = this.load();
    if (state.error) {
      throw new Error(`Refusing to modify Skill Orchestrator configuration while it is invalid: ${state.error}`);
    }
    return state;
  }

  listProfiles(): SkillProfileSummary[] {
    return this.load().profiles;
  }

  saveActiveConfig(config: SkillManagerConfig): ProfileMutationResult {
    try {
      const state = this.writableState();
      const doc = this.readProfile(state.activeProfile.id);
      const next = makeProfileDocument(doc.profileId, doc.profileName, doc.profileDescription, config);
      this.writeProfile(next);
      const profiles = this.listDocuments().map((item) => summaryFromDocument(item, next.profileId));
      return { ok: true, config: normalizeConfig(next), profile: summaryFromDocument(next, next.profileId), profiles };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  createProfile(name: string, description: string): ProfileMutationResult {
    try {
      this.writableState();
      const trimmedName = validateScopeDisplayName(name, "Profile");
      const token = profileShortcutName(trimmedName);
      if (!token) throw new Error("Profile name must contain at least one letter, number, dot, dash, or underscore");
      const docs = this.listDocuments();
      if (docs.some((doc) => profileShortcutName(doc.profileName).toLowerCase() === token.toLowerCase())) {
        throw new Error(`A profile named "${trimmedName}" already exists`);
      }
      const id = slugifyGroupId(trimmedName, this.occupiedProfileIds());
      const doc = makeProfileDocument(id, trimmedName, description, structuredClone(DEFAULT_CONFIG));
      let wroteProfile = false;
      try {
        this.writeProfile(doc);
        wroteProfile = true;
        this.writeManifest(id);
      } catch (error) {
        if (wroteProfile) {
          try { fs.unlinkSync(profilePath(id, this.profilesDir)); } catch {}
        }
        throw error;
      }
      const profiles = this.listDocuments().map((item) => summaryFromDocument(item, id));
      return { ok: true, config: structuredClone(DEFAULT_CONFIG), profile: summaryFromDocument(doc, id), profiles };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  switchProfile(identifier: string): ProfileMutationResult {
    try {
      this.writableState();
      const docs = this.listDocuments();
      const normalized = identifier.trim().toLowerCase();
      const token = profileShortcutName(identifier).toLowerCase();
      const doc = docs.find((item) =>
        item.profileId.toLowerCase() === normalized
        || item.profileName.toLowerCase() === normalized
        || profileShortcutName(item.profileName).toLowerCase() === token,
      );
      if (!doc) throw new Error(`Unknown skill profile: ${identifier}`);
      this.writeManifest(doc.profileId);
      const profiles = docs.map((item) => summaryFromDocument(item, doc.profileId));
      return { ok: true, config: normalizeConfig(doc), profile: summaryFromDocument(doc, doc.profileId), profiles };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  updateProfile(id: string, name: string, description: string): ProfileMutationResult {
    try {
      const state = this.writableState();
      const safeId = assertSafeProfileId(id);
      const trimmedName = validateScopeDisplayName(name, "Profile");
      const token = profileShortcutName(trimmedName);
      if (!token) throw new Error("Profile name must contain at least one letter, number, dot, dash, or underscore");
      const docs = this.listDocuments();
      if (docs.some((doc) => doc.profileId !== safeId && profileShortcutName(doc.profileName).toLowerCase() === token.toLowerCase())) {
        throw new Error(`A profile named "${trimmedName}" already exists`);
      }
      const doc = docs.find((item) => item.profileId === safeId);
      if (!doc) throw new Error(`Unknown skill profile: ${safeId}`);
      const next = makeProfileDocument(doc.profileId, trimmedName, description, normalizeConfig(doc));
      this.writeProfile(next);
      const activeId = state.activeProfile.id;
      const profiles = this.listDocuments().map((item) => summaryFromDocument(item, activeId));
      const activeDoc = activeId === safeId ? next : this.readProfile(activeId);
      return {
        ok: true,
        config: normalizeConfig(activeDoc),
        profile: summaryFromDocument(activeDoc, activeId),
        profiles,
      };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  deleteProfile(id: string): ProfileMutationResult {
    try {
      const state = this.writableState();
      const safeId = assertSafeProfileId(id);
      const docs = this.listDocuments();
      if (docs.length <= 1) throw new Error("The last remaining profile cannot be deleted");
      const target = docs.find((doc) => doc.profileId === safeId);
      if (!target) throw new Error(`Unknown skill profile: ${safeId}`);
      const previousActiveId = state.activeProfile.id;
      let activeId = previousActiveId;
      const remaining = docs.filter((doc) => doc.profileId !== safeId);
      const deletingActive = activeId === safeId;
      if (deletingActive) {
        activeId = remaining[0].profileId;
        // Move the manifest first so a delete failure can never leave it
        // pointing at a profile file that has already been removed. If the
        // unlink itself fails, best-effort rollback restores the prior active
        // profile so a failed operation does not silently change selection.
        this.writeManifest(activeId);
      }
      try {
        fs.unlinkSync(profilePath(safeId, this.profilesDir));
      } catch (error) {
        if (deletingActive) {
          try {
            this.writeManifest(previousActiveId);
          } catch (rollbackError) {
            const primary = error instanceof Error ? error.message : String(error);
            const rollback = rollbackError instanceof Error ? rollbackError.message : String(rollbackError);
            throw new Error(`Could not delete profile and could not restore the previous active profile: ${primary}; rollback failed: ${rollback}`);
          }
        }
        throw error;
      }
      const activeDoc = remaining.find((doc) => doc.profileId === activeId) ?? remaining[0];
      const profiles = remaining.map((doc) => summaryFromDocument(doc, activeId));
      return {
        ok: true,
        config: normalizeConfig(activeDoc),
        profile: summaryFromDocument(activeDoc, activeId),
        profiles,
      };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }
}
