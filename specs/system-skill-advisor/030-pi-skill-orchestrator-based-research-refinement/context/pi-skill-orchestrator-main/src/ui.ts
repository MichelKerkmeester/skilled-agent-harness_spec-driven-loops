import {
  Input,
  Key,
  matchesKey,
  truncateToWidth,
  visibleWidth,
  wrapTextWithAnsi,
} from "@earendil-works/pi-tui";
import type { Theme } from "@earendil-works/pi-coding-agent";
import type { SkillManagerConfig, SkillRecord } from "./types.js";
import type { ProfileMutationResult, SkillProfileSummary } from "./profiles.js";
import { createSkillGroup, normalizeScopeDescription, validateGroupName } from "./config.js";
import { shortcutName } from "./shortcuts.js";
import { filterSkillRecordsBySearch } from "./search.js";

export type UiResult =
  | { action: "cancel"; config: SkillManagerConfig }
  | { action: "scope"; groupId: string | null; label: string; config: SkillManagerConfig }
  | { action: "load"; skills: string[]; label: string; config: SkillManagerConfig };

export type UiSaveResult =
  | { ok: true }
  | { ok: false; error: string };

export interface UiProfileActions {
  listProfiles: () => SkillProfileSummary[];
  getActiveProfile: () => SkillProfileSummary;
  createProfile: (name: string, description: string) => ProfileMutationResult;
  switchProfile: (id: string) => ProfileMutationResult;
  updateProfile: (id: string, name: string, description: string) => ProfileMutationResult;
  deleteProfile: (id: string) => ProfileMutationResult;
}

type Pane = "groups" | "skills";
type Mode =
  | "browse"
  | "new-group"
  | "edit-group"
  | "search"
  | "autoload"
  | "help"
  | "confirm-delete"
  | "profiles"
  | "new-profile"
  | "edit-profile"
  | "confirm-delete-profile";
type HelpReturnMode = "browse" | "autoload";

function cloneConfig(c: SkillManagerConfig): SkillManagerConfig {
  return JSON.parse(JSON.stringify(c));
}

/** ANSI- and wide-character-aware fixed-width cell. */
function fitVisible(text: string, width: number): string {
  const clipped = truncateToWidth(text, Math.max(0, width), "");
  return clipped + " ".repeat(Math.max(0, width - visibleWidth(clipped)));
}

function uniq(values: Iterable<string>): string[] {
  return [...new Set(values)];
}

export class SkillManagerOverlay {
  private config: SkillManagerConfig;
  private pane: Pane = "groups";
  private mode: Mode = "browse";
  private helpReturnMode: HelpReturnMode = "browse";
  private groupIndex = 0;
  private skillIndex = 0;
  private depIndex = 0;
  private profileIndex = 0;
  private search = "";
  private editor = new Input();
  private descriptionEditor = new Input();
  private editField: "name" | "description" | "shortcut" = "name";
  private editShortcutEnabled = true;
  private width = 88;
  private dirty = false;
  private statusMessage = "";
  private statusKind: "success" | "error" | "info" = "info";

  constructor(
    private theme: Theme,
    private skills: SkillRecord[],
    config: SkillManagerConfig,
    private autoDeps: Record<string, string[]>,
    private done: (result: UiResult) => void,
    private requestRender: () => void,
    private saveConfigNow: (config: SkillManagerConfig) => UiSaveResult,
    private profileActions: UiProfileActions,
  ) {
    this.config = cloneConfig(config);
  }

  invalidate(): void {
    this.editor.invalidate();
    this.descriptionEditor.invalidate();
  }

  dispose(): void {}

  private groups() {
    return [
      { id: "__all", name: "All Skills", description: "All skills currently discovered by Pi.", shortcutEnabled: false, order: -1 },
      ...this.config.groups.slice().sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    ];
  }

  private selectedGroup() {
    const groups = this.groups();
    return groups[Math.max(0, Math.min(this.groupIndex, groups.length - 1))];
  }

  private selectedSkill(): SkillRecord | undefined {
    return this.browsableSkills()[this.skillIndex];
  }

  /**
   * Groups are membership editors, not filters. Always show all skills so an
   * empty/new group can actually have members added with Space.
   */
  private browsableSkills(): SkillRecord[] {
    return filterSkillRecordsBySearch(this.skills, this.search);
  }

  private groupMemberSkills(groupId: string): SkillRecord[] {
    if (groupId === "__all") return [...this.skills];
    return this.skills.filter((s) => (this.config.memberships[s.name] ?? []).includes(groupId));
  }

  private groupMemberCount(groupId: string): number {
    return this.groupMemberSkills(groupId).length;
  }

  private membershipNames(skillName: string): string[] {
    const ids = new Set(this.config.memberships[skillName] ?? []);
    return this.config.groups
      .filter((g) => ids.has(g.id))
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
      .map((g) => g.name);
  }

  private profiles(): SkillProfileSummary[] {
    return this.profileActions.listProfiles();
  }

  private selectedProfile(): SkillProfileSummary | undefined {
    const profiles = this.profiles();
    this.profileIndex = Math.max(0, Math.min(this.profileIndex, Math.max(0, profiles.length - 1)));
    return profiles[this.profileIndex];
  }

  private applyProfileResult(result: ProfileMutationResult, message: string): boolean {
    if (result.ok === false) {
      this.statusKind = "error";
      this.statusMessage = result.error;
      return false;
    }
    this.config = cloneConfig(result.config);
    this.groupIndex = 0;
    this.skillIndex = 0;
    this.depIndex = 0;
    this.search = "";
    this.dirty = false;
    this.statusKind = "success";
    this.statusMessage = message;
    const profiles = this.profiles();
    this.profileIndex = Math.max(0, profiles.findIndex((profile) => profile.id === result.profile.id));
    return true;
  }

  private resetProfileEditors(): void {
    this.editor.setValue("");
    this.descriptionEditor.setValue("");
    this.editField = "name";
  }

  private ensureAutosaved(): boolean {
    if (!this.dirty) return true;
    const result = this.saveConfigNow(cloneConfig(this.config));
    if (result.ok === true) {
      this.dirty = false;
      this.statusKind = "success";
      this.statusMessage = "";
      return true;
    }
    this.statusKind = "error";
    this.statusMessage = `Autosave failed: ${result.error}`;
    return false;
  }

  render(width: number): string[] {
    this.width = Math.max(62, Math.min(94, width));

    if (this.mode === "autoload") return this.renderAutoload();
    if (this.mode === "help") return this.renderHelp();
    if (["profiles", "new-profile", "edit-profile", "confirm-delete-profile"].includes(this.mode)) return this.renderProfiles();

    const inner = this.width - 4;
    const leftW = Math.min(29, Math.max(22, Math.floor(inner * 0.34)));
    const rightW = inner - leftW - 3;
    const groups = this.groups();
    const skills = this.browsableSkills();

    this.groupIndex = Math.min(this.groupIndex, Math.max(0, groups.length - 1));
    this.skillIndex = Math.min(this.skillIndex, Math.max(0, skills.length - 1));

    const lines: string[] = [];
    const activeProfile = this.profileActions.getActiveProfile();
    lines.push(this.borderTop(`Skill Orchestrator · ${activeProfile.name}`));

    const subtitle = this.dirty
      ? this.theme.fg("error", this.theme.bold("● autosave failed — changes not safely persisted"))
      : this.statusMessage
        ? this.theme.fg(this.statusKind === "error" ? "error" : this.statusKind === "success" ? "success" : "muted", this.statusMessage)
        : this.theme.fg("muted", activeProfile.description || `autosave enabled  ·  lazy loading  ·  token saver ${this.config.tokenSaverEnabled ? "ON" : "OFF"}  ·  groups  ·  autoload dependencies`);
    lines.push(this.rowCentered(subtitle));
    lines.push(this.separator());

    const selectedGroupForHeader = this.selectedGroup();
    const selectedCount = selectedGroupForHeader ? this.groupMemberCount(selectedGroupForHeader.id) : 0;
    const groupHeader = this.theme.fg("accent", this.theme.bold("Groups"));
    const skillHeaderLabel = selectedGroupForHeader?.id === "__all"
      ? `Skills (${this.skills.length} total)`
      : `Skills (${selectedCount} selected / ${this.skills.length})`;
    const skillHeader = this.theme.fg("accent", this.theme.bold(skillHeaderLabel));
    lines.push(this.row(`${fitVisible(groupHeader, leftW)} ${this.vSep()} ${fitVisible(skillHeader, rightW)}`));

    const rows = Math.max(10, Math.min(15, Math.max(groups.length, skills.length)));
    const gStart = Math.max(0, Math.min(this.groupIndex - Math.floor(rows / 2), Math.max(0, groups.length - rows)));
    const sStart = Math.max(0, Math.min(this.skillIndex - Math.floor(rows / 2), Math.max(0, skills.length - rows)));
    const selectedGroup = this.selectedGroup();

    for (let i = 0; i < rows; i++) {
      const gi = gStart + i;
      const si = sStart + i;

      let leftCell = "";
      let rightCell = "";

      if (gi < groups.length) {
        const group = groups[gi];
        const focused = gi === this.groupIndex && this.pane === "groups";
        const selected = gi === this.groupIndex;
        const pointer = focused ? this.theme.fg("accent", "›") : " ";
        const name = selected
          ? this.theme.fg("accent", focused ? this.theme.bold(group.name) : group.name)
          : this.theme.fg("text", group.name);
        const count = this.theme.fg("warning", String(this.groupMemberCount(group.id)).padStart(3));
        // Budget: pointer(1) + space(1) + name + space(1) + count(3).
        // The old -5 budget was one column too wide and clipped the last digit
        // from counts such as 14 -> 1.
        const nameWidth = Math.max(1, leftW - 6);
        leftCell = `${pointer} ${fitVisible(name, nameWidth)} ${count}`;
      }

      if (si < skills.length) {
        const skill = skills[si];
        const focused = si === this.skillIndex && this.pane === "skills";
        const inGroup = selectedGroup?.id !== "__all"
          && (this.config.memberships[skill.name] ?? []).includes(selectedGroup.id);

        const pointer = focused ? this.theme.fg("accent", "›") : " ";
        const marker = selectedGroup?.id === "__all"
          ? this.theme.fg("dim", "•")
          : inGroup
            ? this.theme.fg("success", "✓")
            : this.theme.fg("dim", "·");
        const name = focused
          ? this.theme.fg("accent", this.theme.bold(skill.name))
          : inGroup
            ? this.theme.fg("success", skill.name)
            : this.theme.fg("text", skill.name);

        rightCell = `${pointer} [${marker}] ${name}`;
      }

      lines.push(this.row(`${fitVisible(leftCell, leftW)} ${this.vSep()} ${fitVisible(rightCell, rightW)}`));
    }

    lines.push(this.separator());
    this.renderDetails(lines, inner);
    lines.push(this.separator());
    this.renderBottomArea(lines);
    lines.push(this.borderBottom());
    return lines;
  }

  private renderDetails(lines: string[], inner: number): void {
    if (this.pane === "groups") {
      const group = this.selectedGroup();
      if (!group) {
        lines.push(this.row(this.theme.fg("muted", "No group selected.")));
        lines.push(this.row(""));
        lines.push(this.row(""));
        lines.push(this.row(""));
        return;
      }

      lines.push(this.row(this.theme.fg("accent", this.theme.bold(group.name))));
      const description = group.description || (group.id === "__all"
        ? "All skills currently discovered by Pi."
        : "(no group description — press R to rename/edit this group)");
      const wrapped = wrapTextWithAnsi(this.theme.fg("text", description), inner);
      lines.push(this.row(wrapped[0] ?? ""));
      lines.push(this.row(wrapped[1] ?? ""));
      const shortcutEnabled = group.id !== "__all" && group.shortcutEnabled !== false;
      const shortcut = group.id === "__all"
        ? "—"
        : shortcutEnabled
          ? `/${shortcutName(group.name)} (enabled)`
          : "disabled";
      lines.push(this.row(
        `${this.theme.fg("muted", "members:")} ${this.theme.fg("success", String(this.groupMemberCount(group.id)))}`
        + this.theme.fg("dim", "   ·   ")
        + `${this.theme.fg("muted", "group shortcut:")} ${this.theme.fg(shortcutEnabled ? "warning" : "dim", shortcut)}`,
      ));
      return;
    }

    const selected = this.selectedSkill();
    if (!selected) {
      lines.push(this.row(this.theme.fg("muted", "No matching skill.")));
      lines.push(this.row(""));
      lines.push(this.row(""));
      lines.push(this.row(""));
      return;
    }

    lines.push(this.row(this.theme.fg("accent", this.theme.bold(selected.name))));

    const wrapped = wrapTextWithAnsi(this.theme.fg("text", selected.description || "(no description)"), inner);
    lines.push(this.row(wrapped[0] ?? ""));
    lines.push(this.row(wrapped[1] ?? ""));

    const groups = this.membershipNames(selected.name);
    const auto = (this.autoDeps[selected.name] ?? []).filter(
      (name) => !(this.config.ignoreAutoDetected[selected.name] ?? []).includes(name),
    );
    const manual = this.config.autoload[selected.name] ?? [];
    const effective = uniq([...auto, ...manual]);

    const groupText = groups.length ? groups.join(", ") : "none";
    const depText = effective.length ? effective.join(", ") : "none";
    lines.push(this.row(
      `${this.theme.fg("muted", "groups:")} ${this.theme.fg(groups.length ? "success" : "dim", truncateToWidth(groupText, Math.floor(inner * 0.42), "…"))}`
      + this.theme.fg("dim", "   ·   ")
      + `${this.theme.fg("muted", "autoload:")} ${this.theme.fg(effective.length ? "warning" : "dim", truncateToWidth(depText, Math.floor(inner * 0.42), "…"))}`,
    ));
  }

  private renderBottomArea(lines: string[]): void {
    if (this.mode === "search") {
      const input = `${this.theme.fg("accent", this.theme.bold("Search:"))} ${this.theme.fg("text", this.editor.getValue())}${this.theme.fg("accent", "▌")}`;
      lines.push(this.row(input));
      lines.push(this.row(`${this.key("Enter")} ${this.hintText("done")}   ${this.key("Backspace")} ${this.hintText("delete to clear")}   ${this.key("Esc")} ${this.hintText("close search")}`));
      return;
    }

    if (this.mode === "new-group") {
      const nameActive = this.editField === "name";
      const descActive = this.editField === "description";
      const shortcutActive = this.editField === "shortcut";
      const nameValue = this.editor.getValue();
      const descValue = this.descriptionEditor.getValue();
      lines.push(this.row(this.theme.fg("accent", this.theme.bold("Create Group"))));
      lines.push(this.row(
        `${this.theme.fg(nameActive ? "accent" : "muted", this.theme.bold("Name:"))} `
        + `${this.theme.fg("text", nameValue)}${nameActive ? this.theme.fg("accent", "▌") : ""}`,
      ));
      lines.push(this.row(
        `${this.theme.fg(descActive ? "accent" : "muted", this.theme.bold("Description:"))} `
        + `${this.theme.fg("text", descValue)}${descActive ? this.theme.fg("accent", "▌") : ""}`,
      ));
      const check = this.editShortcutEnabled
        ? this.theme.fg("success", "[✓]")
        : this.theme.fg("dim", "[ ]");
      const shortcutPointer = shortcutActive ? this.theme.fg("accent", "›") : " ";
      const shortcutText = shortcutActive
        ? this.theme.fg("accent", this.theme.bold("Enable group shortcut command"))
        : this.theme.fg("text", "Enable group shortcut command");
      lines.push(this.row(`${shortcutPointer} ${check} ${shortcutText}`));
      const preview = nameValue.trim() ? `/${shortcutName(nameValue)}` : "—";
      lines.push(this.row(
        `${this.theme.fg("muted", "Shortcut:")} ${this.theme.fg(this.editShortcutEnabled ? "warning" : "dim", this.editShortcutEnabled ? preview : "disabled")}`,
      ));
      lines.push(this.row(`${this.key("Tab")} ${this.hintText("field")}   ${this.key("Space")} ${this.hintText("toggle shortcut")}   ${this.key("Enter")} ${this.hintText("create")}   ${this.key("Esc")} ${this.hintText("cancel")}`));
      return;
    }

    if (this.mode === "edit-group") {
      const nameActive = this.editField === "name";
      const descActive = this.editField === "description";
      const shortcutActive = this.editField === "shortcut";
      const nameValue = this.editor.getValue();
      const descValue = this.descriptionEditor.getValue();
      lines.push(this.row(
        `${this.theme.fg(nameActive ? "accent" : "muted", this.theme.bold("Name:"))} `
        + `${this.theme.fg("text", nameValue)}${nameActive ? this.theme.fg("accent", "▌") : ""}`,
      ));
      lines.push(this.row(
        `${this.theme.fg(descActive ? "accent" : "muted", this.theme.bold("Description:"))} `
        + `${this.theme.fg("text", descValue)}${descActive ? this.theme.fg("accent", "▌") : ""}`,
      ));
      const check = this.editShortcutEnabled
        ? this.theme.fg("success", "[✓]")
        : this.theme.fg("dim", "[ ]");
      const shortcutPointer = shortcutActive ? this.theme.fg("accent", "›") : " ";
      const shortcutText = shortcutActive
        ? this.theme.fg("accent", this.theme.bold("Enable group shortcut command"))
        : this.theme.fg("text", "Enable group shortcut command");
      lines.push(this.row(`${shortcutPointer} ${check} ${shortcutText}`));
      const preview = this.editor.getValue().trim() ? `/${shortcutName(this.editor.getValue())}` : "—";
      lines.push(this.row(
        `${this.theme.fg("muted", "Shortcut:")} ${this.theme.fg(this.editShortcutEnabled ? "warning" : "dim", this.editShortcutEnabled ? preview : "disabled")}`,
      ));
      lines.push(this.row(`${this.key("Tab")} ${this.hintText("field")}   ${this.key("Space")} ${this.hintText("toggle shortcut")}   ${this.key("Enter")} ${this.hintText("apply")}   ${this.key("Esc")} ${this.hintText("cancel")}`));
      return;
    }

    if (this.mode === "confirm-delete") {
      const group = this.selectedGroup();
      lines.push(this.row(
        `${this.theme.fg("warning", this.theme.bold(`Delete group "${group?.name ?? ""}"?`))} `
        + this.theme.fg("muted", "Skills are not deleted."),
      ));
      lines.push(this.row(`${this.key("Y")} ${this.hintText("delete")}   ${this.key("N/Esc")} ${this.hintText("cancel")}`));
      return;
    }

    const membershipAction = this.selectedGroup()?.id === "__all" ? "membership (choose group)" : "membership";
    const loadAction = this.pane === "groups" ? "activate group" : "load skill";
    lines.push(this.row(
      `${this.key("Tab")} ${this.hintText("pane")}   ${this.key("↑↓")} ${this.hintText("move")}   ${this.key("Enter")} ${this.hintText(loadAction)}   ${this.key("Space")} ${this.hintText(membershipAction)}`,
    ));
    lines.push(this.row(
      `${this.key("A")} ${this.hintText("autoload")}   ${this.key("N")} ${this.hintText("new")}   ${this.key("R")} ${this.hintText("rename/edit")}   ${this.key("D")} ${this.hintText("delete")}   ${this.key("/")} ${this.hintText("search")}`,
    ));
    lines.push(this.row(
      `${this.key("T")} ${this.hintText(`token saver ${this.config.tokenSaverEnabled ? "ON" : "OFF"}`)}   ${this.key("?")} ${this.hintText("help")}   ${this.key("P")} ${this.hintText("new profile")}   ${this.key("L")} ${this.hintText("profiles")}   ${this.key("Esc")} ${this.hintText("close")}`,
    ));
  }

  private renderAutoload(): string[] {
    const root = this.selectedSkill();
    if (!root) {
      this.mode = "browse";
      return this.render(this.width);
    }

    const all = this.skills.filter((s) => s.name !== root.name);
    this.depIndex = Math.min(this.depIndex, Math.max(0, all.length - 1));
    const auto = new Set(this.autoDeps[root.name] ?? []);
    const manual = new Set(this.config.autoload[root.name] ?? []);
    const ignored = new Set(this.config.ignoreAutoDetected[root.name] ?? []);

    const lines: string[] = [];
    lines.push(this.borderTop(`Autoload · ${root.name}`));
    lines.push(this.rowCentered(this.theme.fg("muted", "automatic detection + your explicit dependency overrides")));
    lines.push(this.separator());

    const rows = 15;
    const start = Math.max(0, Math.min(this.depIndex - Math.floor(rows / 2), Math.max(0, all.length - rows)));
    for (let i = 0; i < rows; i++) {
      const idx = start + i;
      if (idx >= all.length) {
        lines.push(this.row(""));
        continue;
      }

      const skill = all[idx];
      const isAuto = auto.has(skill.name);
      const isManual = manual.has(skill.name);
      const isIgnored = ignored.has(skill.name);
      const selected = idx === this.depIndex;

      const pointer = selected ? this.theme.fg("accent", "›") : " ";
      const manualMark = isManual ? this.theme.fg("success", "✓") : this.theme.fg("dim", "·");
      const name = selected
        ? this.theme.fg("accent", this.theme.bold(skill.name))
        : this.theme.fg("text", skill.name);

      let status: string;
      if (isManual && isAuto && !isIgnored) status = `${this.theme.fg("success", "USER")} + ${this.theme.fg("accent", "AUTO")}`;
      else if (isManual) status = this.theme.fg("success", "USER");
      else if (isAuto && isIgnored) status = this.theme.fg("warning", "AUTO IGNORED");
      else if (isAuto) status = this.theme.fg("accent", "AUTO");
      else status = this.theme.fg("dim", "—");

      const nameCell = fitVisible(`${pointer} [${manualMark}] ${name}`, Math.max(20, this.width - 28));
      lines.push(this.row(`${nameCell} ${status}`));
    }

    lines.push(this.separator());
    lines.push(this.row(
      `${this.key("↑↓")} ${this.hintText("navigate")}   ${this.key("Space")} ${this.hintText("toggle user autoload")}   ${this.key("I")} ${this.hintText("ignore/restore AUTO")}`,
    ));
    lines.push(this.row(
      `${this.key("Enter/Esc")} ${this.hintText("back")}   ${this.key("?")} ${this.hintText("help")}`,
    ));
    lines.push(this.borderBottom());
    return lines;
  }

  private renderProfiles(): string[] {
    const profiles = this.profiles();
    this.profileIndex = Math.max(0, Math.min(this.profileIndex, Math.max(0, profiles.length - 1)));
    const lines: string[] = [];

    if (this.mode === "new-profile" || this.mode === "edit-profile") {
      const editing = this.mode === "edit-profile";
      const title = editing ? "Edit Skill Profile" : "New Skill Profile";
      const nameActive = this.editField === "name";
      const descActive = this.editField === "description";
      lines.push(this.borderTop(title));
      lines.push(this.rowCentered(this.theme.fg("muted", editing
        ? "Edit the profile name and description; group/skill settings remain unchanged."
        : "Creates a completely fresh profile with no groups, memberships, or autoload selections.")));
      lines.push(this.separator());
      lines.push(this.row(
        `${this.theme.fg(nameActive ? "accent" : "muted", this.theme.bold("Name:"))} `
        + `${this.theme.fg("text", this.editor.getValue())}${nameActive ? this.theme.fg("accent", "▌") : ""}`,
      ));
      lines.push(this.row(
        `${this.theme.fg(descActive ? "accent" : "muted", this.theme.bold("Description:"))} `
        + `${this.theme.fg("text", this.descriptionEditor.getValue())}${descActive ? this.theme.fg("accent", "▌") : ""}`,
      ));
      lines.push(this.row(""));
      if (this.statusMessage) {
        lines.push(this.row(this.theme.fg(this.statusKind === "error" ? "error" : "success", this.statusMessage)));
      } else {
        lines.push(this.row(""));
      }
      lines.push(this.separator());
      const deleteHint = editing ? `   ${this.key("D")} ${this.hintText("delete profile")}` : "";
      lines.push(this.row(
        `${this.key("Tab")} ${this.hintText("field")}   ${this.key("Enter")} ${this.hintText(editing ? "save profile" : "create profile")}${deleteHint}   ${this.key("Esc")} ${this.hintText("cancel")}`,
      ));
      lines.push(this.borderBottom());
      return lines;
    }

    if (this.mode === "confirm-delete-profile") {
      const profile = this.selectedProfile();
      lines.push(this.borderTop("Delete Skill Profile"));
      lines.push(this.rowCentered(this.theme.fg("warning", this.theme.bold(`Delete profile "${profile?.name ?? ""}"?`))));
      lines.push(this.rowCentered(this.theme.fg("muted", "Groups, memberships, and autoload settings stored in this profile will be deleted.")));
      lines.push(this.separator());
      lines.push(this.rowCentered(`${this.key("Y")} ${this.hintText("delete profile")}   ${this.key("N/Esc")} ${this.hintText("cancel")}`));
      lines.push(this.borderBottom());
      return lines;
    }

    lines.push(this.borderTop("Skill Profiles"));
    lines.push(this.rowCentered(this.theme.fg("muted", "Enter activates a profile scope; skill bodies remain lazy and configuration changes are autosaved.")));
    lines.push(this.separator());
    lines.push(this.row(
      `${fitVisible(this.theme.fg("accent", this.theme.bold("Profile")), 30)} `
      + `${fitVisible(this.theme.fg("accent", this.theme.bold("Description")), Math.max(20, this.width - 39))} `
      + this.theme.fg("accent", this.theme.bold("State")),
    ));

    const rows = Math.max(8, Math.min(15, profiles.length || 1));
    const start = Math.max(0, Math.min(this.profileIndex - Math.floor(rows / 2), Math.max(0, profiles.length - rows)));
    for (let i = 0; i < rows; i++) {
      const index = start + i;
      if (index >= profiles.length) {
        lines.push(this.row(""));
        continue;
      }
      const profile = profiles[index];
      const selected = index === this.profileIndex;
      const pointer = selected ? this.theme.fg("accent", "›") : " ";
      const name = selected
        ? this.theme.fg("accent", this.theme.bold(profile.name))
        : this.theme.fg("text", profile.name);
      const description = profile.description || this.theme.fg("dim", "(no description)");
      const state = profile.active ? this.theme.fg("success", "ACTIVE") : this.theme.fg("dim", "saved");
      lines.push(this.row(
        `${fitVisible(`${pointer} ${name}`, 30)} `
        + `${fitVisible(description, Math.max(20, this.width - 39))} `
        + state,
      ));
    }

    lines.push(this.separator());
    if (this.statusMessage) {
      lines.push(this.row(this.theme.fg(this.statusKind === "error" ? "error" : this.statusKind === "success" ? "success" : "muted", this.statusMessage)));
    } else {
      const active = this.profileActions.getActiveProfile();
      lines.push(this.row(`${this.theme.fg("muted", "Active profile:")} ${this.theme.fg("success", active.name)}`));
    }
    lines.push(this.row(
      `${this.key("↑↓")} ${this.hintText("move")}   ${this.key("Enter")} ${this.hintText("activate profile")}   ${this.key("N")} ${this.hintText("new profile")}   ${this.key("R")} ${this.hintText("edit name/description")}`,
    ));
    lines.push(this.row(
      `${this.key("D")} ${this.hintText("delete profile")}   ${this.key("Esc")} ${this.hintText("back")}`,
    ));
    lines.push(this.borderBottom());
    return lines;
  }

  private renderHelp(): string[] {
    const lines: string[] = [];
    lines.push(this.borderTop("Skill Orchestrator Help"));
    lines.push(this.rowCentered(this.theme.fg("muted", "All colors come from your active Pi theme")));
    lines.push(this.separator());

    this.helpSection(lines, "Navigation", [
      ["Tab", "switch Groups / Skills panes"],
      ["↑↓", "move through the focused pane"],
      ["Enter", "Skills pane: lazy-load selected skill; Groups pane: activate that group as the lazy candidate scope"],
      ["/", "live-search skills by name/description; delete the field to clear the filter"],
    ]);

    this.helpSection(lines, "Groups", [
      ["N", "create a group with its name, description, and shortcut setting in one form"],
      ["R", "edit group name, description, and whether its /Group_Name shortcut is enabled"],
      ["D", "delete the selected group; skills are never deleted"],
      ["Space", "add/remove the selected skill from the selected group"],
    ]);

    this.helpSection(lines, "Text-input shortcuts", [
      ["/skill:Skill_Name", "load one skill plus recursive dependencies"],
      ["/skill:Group_Name", "activate a group as the lazy candidate skill scope"],
      ["/Group_Name", "activate the same lazy group scope through its enabled shortcut"],
      ["/Group_Name:skill", "load one member through an enabled group shortcut"],
      ["/skill-profile", "open the saved-profile selector"],
      ["/skill-profile:Profile_Name", "switch directly to a saved profile"],
    ]);

    this.helpSection(lines, "Autocomplete", [
      ["/", "show Pi commands plus enabled short group aliases"],
      ["/skill:", "show Pi skills plus enabled group shortcuts"],
      ["/Group_Name:", "show only skills assigned to that enabled group"],
      ["/skill-profile:", "show saved profile names and descriptions"],
    ]);

    this.helpSection(lines, "Autoload dependencies", [
      ["A", "edit dependencies for the selected skill"],
      ["Space", "toggle a user-defined autoload dependency"],
      ["I", "ignore/restore an automatically detected dependency"],
    ]);

    this.helpSection(lines, "Token Saver", [
      ["T", "toggle the optional reversible tool-output token saver for the active profile"],
      ["/token-saver", "toggle the same profile setting from Pi's command line"],
    ]);

    this.helpSection(lines, "Profiles & persistence", [
      ["P", "create a new fresh profile with a name and description"],
      ["L", "open saved profiles; Enter activates, R edits name/description, D deletes"],
      ["Esc", "close; normal configuration changes are autosaved"],
    ]);

    lines.push(this.separator());
    lines.push(this.rowCentered(`${this.key("?")} ${this.hintText("or")} ${this.key("Esc")} ${this.hintText("back")}`));
    lines.push(this.borderBottom());
    return lines;
  }

  private helpSection(lines: string[], title: string, entries: Array<[string, string]>): void {
    lines.push(this.row(this.theme.fg("accent", this.theme.bold(title))));
    for (const [key, label] of entries) {
      lines.push(this.row(`  ${fitVisible(this.key(key), 12)} ${this.theme.fg("text", label)}`));
    }
  }

  handleInput(data: string): void {
    if (this.mode === "help") {
      if (matchesKey(data, Key.escape) || data === "?") {
        this.mode = this.helpReturnMode;
        this.requestRender();
      }
      return;
    }

    if (this.mode === "profiles") {
      const profiles = this.profiles();
      if (matchesKey(data, Key.escape)) {
        this.mode = "browse";
        this.requestRender();
        return;
      }
      if (matchesKey(data, Key.up)) {
        this.profileIndex = this.profileIndex === 0 ? Math.max(0, profiles.length - 1) : this.profileIndex - 1;
        this.requestRender();
        return;
      }
      if (matchesKey(data, Key.down)) {
        this.profileIndex = this.profileIndex >= profiles.length - 1 ? 0 : this.profileIndex + 1;
        this.requestRender();
        return;
      }
      if (matchesKey(data, Key.enter)) {
        if (!this.ensureAutosaved()) { this.requestRender(); return; }
        const profile = this.selectedProfile();
        if (profile && this.applyProfileResult(this.profileActions.switchProfile(profile.id), `✓ activated profile ${profile.name}`)) {
          this.mode = "browse";
        }
        this.requestRender();
        return;
      }
      if (data === "n" || data === "N") {
        this.resetProfileEditors();
        this.statusMessage = "";
        this.mode = "new-profile";
        this.requestRender();
        return;
      }
      if (data === "r" || data === "R") {
        const profile = this.selectedProfile();
        if (profile) {
          this.editor.setValue(profile.name);
          this.descriptionEditor.setValue(profile.description);
          this.editField = "name";
          this.statusMessage = "";
          this.mode = "edit-profile";
          this.requestRender();
        }
        return;
      }
      if (data === "d" || data === "D") {
        if (this.selectedProfile()) {
          this.mode = "confirm-delete-profile";
          this.requestRender();
        }
        return;
      }
      return;
    }

    if (this.mode === "new-profile" || this.mode === "edit-profile") {
      const editing = this.mode === "edit-profile";
      if (matchesKey(data, Key.escape)) {
        this.resetProfileEditors();
        this.statusMessage = "";
        this.mode = editing ? "profiles" : "browse";
        this.requestRender();
        return;
      }
      if (matchesKey(data, Key.tab)) {
        this.editField = this.editField === "name" ? "description" : "name";
        this.requestRender();
        return;
      }
      if (editing && (data === "d" || data === "D")) {
        const profile = this.selectedProfile();
        if (profile) {
          this.mode = "confirm-delete-profile";
          this.requestRender();
        }
        return;
      }
      if (matchesKey(data, Key.enter)) {
        if (!editing && !this.ensureAutosaved()) { this.requestRender(); return; }
        const name = this.editor.getValue().trim();
        const description = this.descriptionEditor.getValue().trim();
        if (!name) {
          this.statusKind = "error";
          this.statusMessage = "Profile name is required.";
          this.requestRender();
          return;
        }
        if (editing) {
          const profile = this.selectedProfile();
          if (profile && this.applyProfileResult(this.profileActions.updateProfile(profile.id, name, description), `✓ saved profile ${name}`)) {
            const updatedProfiles = this.profiles();
            const updatedIndex = updatedProfiles.findIndex((candidate) => candidate.id === profile.id);
            if (updatedIndex >= 0) this.profileIndex = updatedIndex;
            this.mode = "profiles";
            this.resetProfileEditors();
          }
        } else if (this.applyProfileResult(this.profileActions.createProfile(name, description), `✓ created profile ${name}`)) {
          this.mode = "browse";
          this.resetProfileEditors();
        }
        this.requestRender();
        return;
      }
      const active = this.editField === "name" ? this.editor : this.descriptionEditor;
      active.handleInput(data);
      this.requestRender();
      return;
    }

    if (this.mode === "confirm-delete-profile") {
      if (matchesKey(data, Key.escape) || data === "n" || data === "N") {
        this.mode = "profiles";
        this.requestRender();
        return;
      }
      if (data === "y" || data === "Y") {
        const profile = this.selectedProfile();
        if (profile && this.applyProfileResult(this.profileActions.deleteProfile(profile.id), `✓ deleted profile ${profile.name}`)) {
          this.mode = "profiles";
          this.profileIndex = Math.max(0, Math.min(this.profileIndex, this.profiles().length - 1));
        }
        this.requestRender();
      }
      return;
    }

    if (this.mode === "confirm-delete") {
      if (matchesKey(data, Key.escape) || data === "n" || data === "N") {
        this.mode = "browse";
        this.requestRender();
        return;
      }
      if (data === "y" || data === "Y") {
        this.deleteSelectedGroup();
        this.mode = "browse";
        this.requestRender();
      }
      return;
    }

    if (this.mode === "edit-group") {
      if (matchesKey(data, Key.escape)) {
        this.mode = "browse";
        this.editor.setValue("");
        this.descriptionEditor.setValue("");
        this.editField = "name";
        this.editShortcutEnabled = true;
        this.requestRender();
        return;
      }
      if (matchesKey(data, Key.tab)) {
        this.editField = this.editField === "name"
          ? "description"
          : this.editField === "description"
            ? "shortcut"
            : "name";
        this.requestRender();
        return;
      }
      if (data === " " && this.editField === "shortcut") {
        this.editShortcutEnabled = !this.editShortcutEnabled;
        this.requestRender();
        return;
      }
      if (matchesKey(data, Key.enter)) {
        const group = this.selectedGroup();
        const name = this.editor.getValue().trim();
        const description = this.descriptionEditor.getValue().trim();
        if (group && group.id !== "__all") {
          try {
            const validatedName = validateGroupName(name, this.config.groups, group.id);
            const real = this.config.groups.find((g) => g.id === group.id);
            if (real && (real.name !== validatedName || real.description !== description || real.shortcutEnabled !== this.editShortcutEnabled)) {
              real.name = validatedName;
              real.description = description;
              real.shortcutEnabled = this.editShortcutEnabled;
              this.markDirty();
            }
          } catch (error) {
            this.statusKind = "error";
            this.statusMessage = error instanceof Error ? error.message : String(error);
            this.requestRender();
            return;
          }
        }
        this.mode = "browse";
        this.editor.setValue("");
        this.descriptionEditor.setValue("");
        this.editField = "name";
        this.editShortcutEnabled = true;
        this.requestRender();
        return;
      }
      if (this.editField !== "shortcut") {
        const active = this.editField === "name" ? this.editor : this.descriptionEditor;
        active.handleInput(data);
        this.requestRender();
      }
      return;
    }

    if (this.mode === "search") {
      if (matchesKey(data, Key.escape)) {
        this.skillIndex = 0;
        this.mode = "browse";
        this.editor.setValue("");
        this.requestRender();
        return;
      }

      if (matchesKey(data, Key.enter)) {
        this.search = this.editor.getValue().trim();
        this.skillIndex = 0;
        this.editor.setValue("");
        this.mode = "browse";
        this.requestRender();
        return;
      }

      this.editor.handleInput(data);
      // Search is live while the field is being edited. Deleting the field
      // back to empty therefore clears the filter immediately; the user does
      // not need to close/reopen the orchestrator.
      this.search = this.editor.getValue().trim();
      this.skillIndex = 0;
      this.requestRender();
      return;
    }

    if (this.mode === "new-group") {
      if (matchesKey(data, Key.escape)) {
        this.mode = "browse";
        this.editor.setValue("");
        this.descriptionEditor.setValue("");
        this.editField = "name";
        this.editShortcutEnabled = true;
        this.requestRender();
        return;
      }
      if (matchesKey(data, Key.tab)) {
        this.editField = this.editField === "name"
          ? "description"
          : this.editField === "description"
            ? "shortcut"
            : "name";
        this.requestRender();
        return;
      }
      if (data === " " && this.editField === "shortcut") {
        this.editShortcutEnabled = !this.editShortcutEnabled;
        this.requestRender();
        return;
      }
      if (matchesKey(data, Key.enter)) {
        const name = this.editor.getValue().trim();
        if (name) {
          try {
            const group = createSkillGroup(
              name,
              this.descriptionEditor.getValue(),
              this.editShortcutEnabled,
              this.config.groups,
            );
            this.config.groups.push(group);
            this.groupIndex = this.groups().findIndex((candidate) => candidate.id === group.id);
            this.skillIndex = 0;
            // The next useful action after creating a group is assigning members.
            this.pane = "skills";
            this.markDirty();
            this.mode = "browse";
            this.editor.setValue("");
            this.descriptionEditor.setValue("");
            this.editField = "name";
            this.editShortcutEnabled = true;
            this.requestRender();
          } catch (error) {
            this.statusKind = "error";
            this.statusMessage = error instanceof Error ? error.message : String(error);
            this.requestRender();
          }
        } else {
          this.statusKind = "error";
          this.statusMessage = "Group name is required.";
          this.requestRender();
        }
        return;
      }

      const active = this.editField === "name" ? this.editor : this.descriptionEditor;
      if (this.editField !== "shortcut") active.handleInput(data);
      this.requestRender();
      return;
    }

    if (this.mode === "autoload") {
      const root = this.selectedSkill();
      const list = this.skills.filter((s) => s.name !== root?.name);

      if (data === "?") {
        this.helpReturnMode = "autoload";
        this.mode = "help";
        this.requestRender();
        return;
      }
      if (matchesKey(data, Key.escape) || matchesKey(data, Key.enter)) {
        this.mode = "browse";
        this.requestRender();
        return;
      }
      if (matchesKey(data, Key.up)) {
        this.depIndex = this.depIndex === 0 ? Math.max(0, list.length - 1) : this.depIndex - 1;
      } else if (matchesKey(data, Key.down)) {
        this.depIndex = this.depIndex === list.length - 1 ? 0 : this.depIndex + 1;
      } else if (data === " " && root && list[this.depIndex]) {
        const name = list[this.depIndex].name;
        const deps = new Set(this.config.autoload[root.name] ?? []);
        deps.has(name) ? deps.delete(name) : deps.add(name);
        if (deps.size) this.config.autoload[root.name] = [...deps].sort();
        else delete this.config.autoload[root.name];
        this.markDirty();
      } else if (
        (data === "i" || data === "I")
        && root
        && list[this.depIndex]
        && (this.autoDeps[root.name] ?? []).includes(list[this.depIndex].name)
      ) {
        const name = list[this.depIndex].name;
        const ignored = new Set(this.config.ignoreAutoDetected[root.name] ?? []);
        ignored.has(name) ? ignored.delete(name) : ignored.add(name);
        if (ignored.size) this.config.ignoreAutoDetected[root.name] = [...ignored].sort();
        else delete this.config.ignoreAutoDetected[root.name];
        this.markDirty();
      }

      this.requestRender();
      return;
    }

    if (matchesKey(data, Key.escape)) {
      const result = this.saveConfigNow(cloneConfig(this.config));
      if (result.ok === false) {
        this.dirty = true;
        this.statusKind = "error";
        this.statusMessage = `Autosave failed: ${result.error}`;
        this.requestRender();
        return;
      }
      this.dirty = false;
      this.done({ action: "cancel", config: this.config });
      return;
    }
    if (data === "?") {
      this.helpReturnMode = "browse";
      this.mode = "help";
      this.requestRender();
      return;
    }
    if (matchesKey(data, Key.tab)) {
      this.pane = this.pane === "groups" ? "skills" : "groups";
      this.requestRender();
      return;
    }
    if (matchesKey(data, Key.up)) {
      if (this.pane === "groups") {
        this.groupIndex = this.groupIndex === 0 ? this.groups().length - 1 : this.groupIndex - 1;
      } else {
        const count = this.browsableSkills().length;
        this.skillIndex = this.skillIndex === 0 ? Math.max(0, count - 1) : this.skillIndex - 1;
      }
      this.skillIndex = Math.min(this.skillIndex, Math.max(0, this.browsableSkills().length - 1));
      this.requestRender();
      return;
    }
    if (matchesKey(data, Key.down)) {
      if (this.pane === "groups") {
        this.groupIndex = this.groupIndex === this.groups().length - 1 ? 0 : this.groupIndex + 1;
      } else {
        const count = this.browsableSkills().length;
        this.skillIndex = this.skillIndex === count - 1 ? 0 : this.skillIndex + 1;
      }
      this.skillIndex = Math.min(this.skillIndex, Math.max(0, this.browsableSkills().length - 1));
      this.requestRender();
      return;
    }
    if (matchesKey(data, Key.enter)) {
      if (this.pane === "groups") {
        const group = this.selectedGroup();
        if (!group) return;
        if (group.id === "__all") {
          if (!this.ensureAutosaved()) { this.requestRender(); return; }
          this.done({ action: "scope", groupId: null, label: "all installed skills", config: this.config });
          return;
        }
        const members = this.groupMemberSkills(group.id).map((s) => s.name);
        if (members.length === 0) {
          this.statusKind = "info";
          this.statusMessage = `Group \"${group.name}\" has no skills yet.`;
          this.requestRender();
          return;
        }
        if (!this.ensureAutosaved()) { this.requestRender(); return; }
        this.done({ action: "scope", groupId: group.id, label: `group \"${group.name}\"`, config: this.config });
        return;
      }

      const skill = this.selectedSkill();
      if (skill) {
        if (!this.ensureAutosaved()) { this.requestRender(); return; }
        this.done({ action: "load", skills: [skill.name], label: skill.name, config: this.config });
      }
      return;
    }
    if (data === " ") {
      // Membership changes are meaningful only while working in the skill pane.
      if (this.pane === "groups") {
        this.pane = "skills";
        this.requestRender();
        return;
      }
      const group = this.selectedGroup();
      const skill = this.selectedSkill();
      if (group && skill && group.id !== "__all") {
        const memberships = new Set(this.config.memberships[skill.name] ?? []);
        memberships.has(group.id) ? memberships.delete(group.id) : memberships.add(group.id);
        if (memberships.size) this.config.memberships[skill.name] = [...memberships];
        else delete this.config.memberships[skill.name];
        this.markDirty();
        this.requestRender();
      }
      return;
    }
    if (data === "a" || data === "A") {
      if (this.selectedSkill()) {
        this.mode = "autoload";
        this.depIndex = 0;
        this.requestRender();
      }
      return;
    }
    if (data === "n" || data === "N") {
      this.mode = "new-group";
      this.editField = "name";
      this.editor.setValue("");
      this.descriptionEditor.setValue("");
      this.editShortcutEnabled = true;
      this.requestRender();
      return;
    }
    if (data === "r" || data === "R") {
      const group = this.selectedGroup();
      if (group && group.id !== "__all") {
        this.mode = "edit-group";
        this.editField = "name";
        this.editor.setValue(group.name);
        this.descriptionEditor.setValue(group.description ?? "");
        this.editShortcutEnabled = group.shortcutEnabled !== false;
        this.requestRender();
      }
      return;
    }
    if (data === "d" || data === "D") {
      const group = this.selectedGroup();
      if (group && group.id !== "__all") {
        this.mode = "confirm-delete";
        this.requestRender();
      }
      return;
    }
    if (data === "/") {
      this.mode = "search";
      this.editor.setValue(this.search);
      this.requestRender();
      return;
    }
    if (data === "t" || data === "T") {
      this.config.tokenSaverEnabled = !this.config.tokenSaverEnabled;
      this.markDirty();
      if (!this.dirty) {
        this.statusKind = "success";
        this.statusMessage = `Token Saver ${this.config.tokenSaverEnabled ? "ON" : "OFF"} for this profile.`;
      }
      this.requestRender();
      return;
    }
    if (data === "p" || data === "P") {
      if (!this.ensureAutosaved()) { this.requestRender(); return; }
      this.resetProfileEditors();
      this.statusMessage = "";
      this.mode = "new-profile";
      this.requestRender();
      return;
    }
    if (data === "l" || data === "L") {
      if (!this.ensureAutosaved()) { this.requestRender(); return; }
      const active = this.profileActions.getActiveProfile();
      const profiles = this.profiles();
      this.profileIndex = Math.max(0, profiles.findIndex((profile) => profile.id === active.id));
      this.statusMessage = "";
      this.mode = "profiles";
      this.requestRender();
      return;
    }
  }


  private markDirty(): void {
    this.dirty = true;
    const result = this.saveConfigNow(cloneConfig(this.config));
    if (result.ok === true) {
      this.dirty = false;
      this.statusKind = "success";
      this.statusMessage = "";
    } else {
      this.statusKind = "error";
      this.statusMessage = `Autosave failed: ${result.error}`;
    }
  }

  private deleteSelectedGroup(): void {
    const group = this.selectedGroup();
    if (!group || group.id === "__all") return;

    this.config.groups = this.config.groups.filter((g) => g.id !== group.id);
    for (const [skill, groupIds] of Object.entries(this.config.memberships)) {
      const next = groupIds.filter((id) => id !== group.id);
      if (next.length) this.config.memberships[skill] = next;
      else delete this.config.memberships[skill];
    }
    this.groupIndex = Math.max(0, this.groupIndex - 1);
    this.markDirty();
  }

  private key(label: string): string {
    return this.theme.fg("accent", this.theme.bold(`[${label}]`));
  }

  private hintText(text: string): string {
    return this.theme.fg("muted", text);
  }

  private vSep(): string {
    return this.theme.fg("borderMuted", "│");
  }

  private borderTop(title = ""): string {
    const raw = ` ${title.trim()} `;
    const remain = Math.max(0, this.width - 2 - visibleWidth(raw));
    const left = Math.floor(remain / 2);
    const right = remain - left;
    return this.theme.fg("borderAccent", `╭${"─".repeat(left)}${raw}${"─".repeat(right)}╮`);
  }

  private borderBottom(): string {
    return this.theme.fg("borderAccent", `╰${"─".repeat(this.width - 2)}╯`);
  }

  private separator(): string {
    return this.theme.fg("borderMuted", `├${"─".repeat(this.width - 2)}┤`);
  }

  private row(content: string): string {
    const max = this.width - 4;
    const clipped = truncateToWidth(content, max, "");
    const padding = " ".repeat(Math.max(0, max - visibleWidth(clipped)));
    return `${this.theme.fg("borderMuted", "│")} ${clipped}${padding} ${this.theme.fg("borderMuted", "│")}`;
  }

  private rowCentered(content: string): string {
    const max = this.width - 4;
    const clipped = truncateToWidth(content, max, "");
    const left = Math.max(0, Math.floor((max - visibleWidth(clipped)) / 2));
    return this.row(`${" ".repeat(left)}${clipped}`);
  }
}
