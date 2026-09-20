---
title: Official Orca Skill - Computer Use
description: Discovery-stub reference for the official computer-use skill, which drives the GUI of a visible local app window through orca computer, with its command families, verification limits and safety boundaries.
trigger_phrases:
  - "orca computer use"
  - "official orca computer skill"
  - "orca gui control"
  - "desktop app window orca"
  - "orca accessibility tree clicks"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Official Orca Skill - Computer Use

Local reference for the official `computer-use` skill. The upstream file is a discovery stub: it declares when to engage, then loads the version-matched guide from the Orca executable used for the session, because the real flags live in the binary. Snapshot paths cited below resolve under `specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main/`.

---

## 1. OVERVIEW

`computer-use` declares that it drives the GUI of a visible local app window through `orca computer`, covering the accessibility tree, clicks, typing, menus, dialogs and screenshots. It applies to native apps and to external browser windows such as Chrome, Edge or Safari as well as webviews (snapshot: skills/computer-use/SKILL.md, frontmatter).

The stub and guide both state the same priority order: prefer a programmatic path (shell, filesystem, git, HTTP, existing CLIs) whenever it can complete the task, and use this skill only when a visible window needs GUI control those cannot reach (snapshot: skills/computer-use/SKILL.md, frontmatter description). The guide restates this in its opening paragraph (guide: skill-guides/computer-use.md, opening paragraph).

The guide adds the working surface at a high level: command families for capabilities and permissions checks, app and window listing, accessibility-tree state reads, clicks (including modifier chords and right or middle buttons), semantic value setting, typing, single keys and modifier hotkeys, pasting, scrolling and drag. It also covers window-scoped coordinates and screenshot outputs (guide: skill-guides/computer-use.md, Commands, Action Rules and Screenshots sections). The flag detail lives in the version-matched guide loaded from the binary with:

```text
ORCA skills get computer-use
```

Prefer `--json`. Use the resolved executable's `--help` for commands or flags the guide does not cover. Start Orca with `ORCA open --json` and retry if a command reports that Orca is not running (snapshot: skills/computer-use/SKILL.md, Load the version-matched guide before running Orca commands).

The stub resolves one executable for the session in this order: the `ORCA_CLI_COMMAND` environment variable when set, then `orca-dev` in a dev checkout that exposes `ORCA_DEV_REPO_ROOT`, then `orca-ide` on Linux outside an Orca-managed terminal, then `orca`. If the selected executable cannot run, report its exact error and stop rather than falling through to another executable, which could silently target a different Orca build (snapshot: skills/computer-use/SKILL.md, Resolve the CLI for this session).

---

## 2. BOUNDARIES

- This skill is not for Orca's embedded browser. The stub says so directly and hands that surface to `orca-cli` (snapshot: skills/computer-use/SKILL.md, frontmatter description). The orca-cli guide states the split the same way from its side: `orca-cli` covers Orca's embedded pages, while desktop control asked for by name is `ORCA computer ...` and never a browser command (guide: skill-guides/orca-cli.md, browser boundary wording).
- `app selectors` refer to desktop apps, not website names. For a web app such as Gmail, choose the desktop browser app or window that contains it (guide: skill-guides/computer-use.md, Errors section, `app_not_found` entry).
- Coordinates passed to `click`, `scroll` and `drag` are window-local, so use coordinates from the latest screenshot or state for the same target window (guide: skill-guides/computer-use.md, Action Rules).
- Element indexes are short-lived and go stale after delays, navigation, focus changes, scrolling, window changes or app re-rendering. `elementCount` must never be used to infer valid indexes (guide: skill-guides/computer-use.md, Core Loop).

### Safety limits

The guide states these limits (guide: skill-guides/computer-use.md, Preconditions and Action Rules):

- Do not push, submit forms, send messages, buy items, delete data, change account settings or expose secrets unless the user explicitly asked for that action.
- If an app contains sensitive content, read only what the user requested.
- An action's verification is separate from whether its provider call succeeded, and the `unverified` verification states cover accessibility actions without a post-state assertion and synthetic input fired into the void. Never report an unverified action as success. If it could have sent, submitted, bought or deleted something, say the effect is unproven.

---

## 3. HAND OFF CORRECTLY

A correct engagement keeps the order. First, finish the task programmatically when a shell command, a filesystem operation, git, an HTTP call or an existing CLI can do it, and never open this skill for work those paths already cover (guide: skill-guides/computer-use.md, opening paragraph).

Second, call this skill only for the visible app window that nothing else can reach, for example a native app dialog or a desktop browser window that no API exposes (snapshot: skills/computer-use/SKILL.md, frontmatter description). Inside that window, prefer semantic actions such as `set-value` for editable fields and `click` for controls. Use the returned state after every UI-changing action before picking the next element index. Trust the accessibility tree over screenshot pixels when the two disagree (guide: skill-guides/computer-use.md, Action Rules and Screenshots).

Third, escalate when the target is Orca's embedded browser. That surface belongs to `orca-cli`, not to this skill (snapshot: skills/computer-use/SKILL.md, frontmatter description). The iOS emulator guide routes desktop UI outside the simulator to `computer-use` (guide: skill-guides/orca-emulator.md, see-also). The Android emulator guide routes desktop UI outside the emulator the same way (guide: skill-guides/orca-emulator-android.md, see-also).

---

## 4. RELATED RESOURCES

- The official skills index and the boundary matrix: [`overview.md`](overview.md).
- `orca-cli` owns Orca's embedded browser, terminals, worktrees and automations ([`orca-cli.md`](orca-cli.md) once authored, see the routing table in the skill's SKILL.md section 3.6 meanwhile).
- The version-matched guide served by the binary is authoritative for flags: load it with `ORCA skills get computer-use` (snapshot: skills/computer-use/SKILL.md, guide-loading section).
- Verbatim upstream wording: `assets/computer-use.txt`, with release revision and digest in [`assets/PROVENANCE.md`](../../assets/PROVENANCE.md).
