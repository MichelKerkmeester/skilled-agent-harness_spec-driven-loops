# Iteration 002 — Profiles/groups scope model, dependency bundle rendering, persistence robustness

## Focus

How profiles and groups are authored and persisted, how the dependency bundle is
rendered into model context, and the robustness patterns in config/state writes.
Orchestrator side of RQ3, RQ4, RQ7.

## Actions Taken

- Read `src/profiles.ts` (502 lines) — SkillProfileStore, manifest, atomic writes.
- Read `src/skill-io.ts` (79 lines) — body read, frontmatter strip, bundle renderer.
- Read `docs/groups-and-profiles.md` (176 lines) — semantics of scopes.
- Read `docs/dependencies.md` (68 lines) — dependency rules.

## Findings

### F7 — Profiles are authored workspaces; groups are preferred scopes [CONFIRMED]

A profile is a complete saved setup: groups, memberships, configured autoload deps,
auto-dep suppressions, and `catalogDescriptionMax` (`docs/groups-and-profiles.md:31-40`).
Profile scope resolves as the union of its groups' memberships
(`src/scope.ts:38-45` `profileMemberRecords`); an empty profile yields ZERO automatic
candidates and does not silently widen to the whole catalog (`src/scope.ts:90-101`,
`docs/groups-and-profiles.md:105`). Groups are "preferred scopes, not hard walls"
(`docs/groups-and-profiles.md:77-99`): the model searches the scope first, then may pull
a bounded global fallback. Exactly one scope is active; switching replaces, never
appends (`docs/architecture.md:29-41`; `activateProfileScope` clears `fallbackRootNames`,
`src/index.ts:195-202`).

### F8 — Scope authoring is operator-driven, not derived [CONFIRMED]

Groups/memberships are manually curated in a TUI manager (`docs/groups-and-profiles.md:109-147`);
profiles persist to `~/.pi/agent/skill-profiles/*.json` with a versioned manifest
(`src/profiles.ts:8,17-20,72-74`). There is no automatic clustering: scope quality is a
human responsibility, and the prompt stub merely reports the count.

### F9 — Dependency bundle is a structured envelope, deps-first order [CONFIRMED]

`renderLoadedBundle` emits `<skill-orchestrator roots="...">`, a selected-roots line, an
instruction to follow loaded skills and to call `skill` for any missing referenced skill,
warnings for missing deps and cycles, then `## Loaded skill:` chunks in dependency order
(`src/skill-io.ts:48-79`). Missing deps and cycles are WARNING text in context, not hard
errors (`src/skill-io.ts:62-68`; `src/dependencies.ts:63-72` collects them rather than
throwing). Bodies are frontmatter-stripped (`src/skill-io.ts:18-29`). Metadata is
control-char-stripped (`src/skill-io.ts:5-7`) and roots are XML-attribute-escaped
(`src/skill-io.ts:9-16`).

### F10 — Dependency edges: regex detection + configured autoload − suppressions [CONFIRMED]

`effectiveDependencies` = (autoDetected − `ignoreAutoDetected`) ∪ `autoload`
(`src/dependencies.ts:40-48`). Auto-detection only ever names installed,
model-visible skills (`src/dependencies.ts:81-82`); manual-only skills load via explicit
`/skill:<name>` or user-configured autoload (`docs/dependencies.md:52-60`).

### F11 — Persistence robustness is layered [CONFIRMED]

- `atomicWriteJson`: temp file `tmp-{pid}-{uuid}` → `renameSync` → best-effort cleanup
  (`src/profiles.ts:61-70`).
- Profile files must be regular files, not symlinks (`src/profiles.ts:184-196`);
  legacy backup destination likewise (`src/profiles.ts:261-268`).
- Profile ids are strict slugs (`assertSafeProfileId`, `src/profiles.ts:43-49`); a file's
  declared id must match its filename or it is skipped (`src/profiles.ts:191-194, 217`).
- Corrupt profile files are never overwritten just because they cannot be parsed —
  `occupiedProfileIds` reserves their stems (`src/profiles.ts:227-245, 319-325`).
- `writableState()` refuses any mutation while persisted config is invalid
  (`src/profiles.ts:352-358`); a failed load falls back to safe in-memory defaults with a
  user-visible error and does NOT write (`src/profiles.ts:341-349`, `src/index.ts:262-268`).
- v1→v2 manifest migration keeps a `.legacy-v1.json` backup (`src/profiles.ts:247-283`).
- Delete-active-profile moves the manifest first, then unlinks, with best-effort
  rollback (`src/profiles.ts:456-483`).

## Questions Answered

- RQ3 (orchestrator side): scope model = curated profile→groups→memberships, single
  active scope, bounded global fallback, authorization set replaces per search.
- RQ4 (orchestrator side): dependency bundle = DFS closure rendered as one envelope;
  edges are regex-detected + configured, minus suppressions; missing/cycles reported.
- RQ7 (partial): atomic writes, symlink guards, slug ids, corrupt-file protection,
  refuse-on-invalid-config, manifest versioning — all present.

## Questions Remaining

- Token Saver internals (`src/token-saver.ts`) only where they bear on brief-size ideas
  for the advisor — defer detail reading unless needed.
- Advisor side of every question — iterations 3 and 4.

## Ruled Out

- `tests/` deep-read deferred to verification pass (iteration 5); behavior already pinned
  by source + docs read here. `pi-compatibility.test.mjs` remains on the RQ7 list.
- Token Saver as a tool-output compressor — explicitly out of scope per spec §3 except
  where it informs advisor output bounds.

## Next Focus

Iteration 3: advisor core — `ARCHITECTURE.md`, `runtime/handlers/advisor-recommend.ts`,
`runtime/lib/scorer/fusion.ts`, `runtime/lib/scorer/lanes/`, `runtime/lib/skill-advisor-brief.ts`,
`runtime/lib/render.ts` — map advisor counterparts (RQ1, RQ5, RQ6 advisor side).
