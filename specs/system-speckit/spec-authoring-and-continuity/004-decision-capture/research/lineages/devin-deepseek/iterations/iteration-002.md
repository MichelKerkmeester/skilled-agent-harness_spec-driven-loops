# Iteration 2: Scoping the shared decision-capture state folder

## Focus

Gap 2. When a project links this checkout with `doctor:symlink` in whole mode, `.skilled` is one symlink, so `projectDir/.skilled/skills/.state/decision-capture` resolves to the checkout's folder. Every linked project's queue, consumed log and nudge counter then share one directory. This iteration traces every producer and consumer of that path and evaluates the smallest scoping fix.

## Actions Taken

1. Read `capture-core.mjs` path helpers, queue read/write, consumed log and nudge functions.
2. Read the writer's state-dir constant, `consumedLogPath`, `readConsumedRows` and `recordConsumedKeys`.
3. Read the matcher's `stateDir`, `queuePath`, `runScan` and `runRelease`.
4. Read the symlink manifest and the engine's whole/merge plan logic to confirm what `--mode whole` and `--mode auto` link.
5. Read each producer's project-directory source: Claude adapter, OpenCode plugin, Pi extension, Codex/Pi/Devin/transcript sweeps, and the Claude Stop hook.
6. Read the existing per-project state precedent in the completion-evidence hooks.

## Findings

1. Every producer passes a project directory into `capture-core`, and every path is computed as `join(projectDir, '.skilled', 'skills', '.state', 'decision-capture')`. The project directory is the only identity the core receives. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:38] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:238-248]
2. The same four path segments are duplicated in three places: the hook core, the decision-record writer and the matcher. There is no single state-directory resolver today. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:38] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:122] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:39]
3. `doctor:symlink` treats `.skilled` as one directory entry and links it whole in the default `auto` mode; a merged link still mirrors the same child tree. Nothing inside `.skilled` can be per-project when the root is a symlink. [SOURCE: .skilled/commands/doctor/assets/symlink-manifest.json:3] [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:829-870]
4. The queue file itself is per session (`<hex(session-id)>.jsonl`), so answer files do not collide across projects. The shared surfaces are the directory enumeration in `--scan-orphans` and the single `consumed.jsonl`. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:242-248] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:280-310]
5. `--scan-orphans` enumerates every `<hex>.jsonl` in the state folder and prints a count plus the decoded session id, with no project filter. That is exactly how another project's sessions enter a save's orphan list. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:280-310]
6. `consumed.jsonl` rows carry `key`, `packet`, `id` and `at`, never a project, and one log serves every project. A key consumed in one project therefore suppresses the same key in another; the key includes the runtime, session id, tool-use id and question index, so a collision needs a repeated session id rather than ordinary use. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:769-838]
7. All producers already pass a real project directory: `process.cwd()` in the four sweeps, `context.directory` in the OpenCode plugin, `sessionContext.cwd` in the Pi extension, `CLAUDE_PROJECT_DIR || payload.cwd` in the Claude adapter, and a resolved project directory in the Stop hook. The identity needed for scoping is present at every call site. [SOURCE: .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs:54] [SOURCE: .opencode/plugins/decision-capture.js:48] [SOURCE: .skilled/hooks/decision-capture/pi/decision-capture.ts:91] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-transcript.mjs:311]
8. The smallest structural fix is a per-project subdirectory under the existing state folder, keyed by a short hash of the real project path. `capture-core` owns the token and `queueDir`; the writer exports one `stateDirPath`; the matcher delegates to it instead of keeping its own copy. The queue file format and the session-keyed filenames stay unchanged. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:238-248] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:103-112]
9. A 12-character SHA-256 of the real project path is an established local convention, so the token does not invent a new scheme. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs:19-21] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/hook-completion-evidence-stop.vitest.ts:33-35]
10. Migration can be dual-read and single-write: new writes go to the project subdirectory; `readQueue` and `readConsumedKeys` union the legacy root file so a pre-fix session still nudges, matches and shows pending; `--scan-orphans` reads only the project subdirectory, so pre-fix root queues stop appearing as other projects' sessions. The queue filename is session-scoped, so a legacy read cannot pull another project's session unless the session id is the same session. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:305-345]

## Ruled Out

- **Per-row `project` field with read-time filtering only.** It fixes the scan and the consumed log, but it leaves isolation to every present and future reader, and pre-fix rows have no field to filter on. The subdirectory isolates by construction.
- **Changing `doctor:symlink` to merge mode or to leave `.skilled/skills/.state` unmirrored.** It cannot help a whole `.skilled` link, it changes every skill's state folder rather than this feature's, and it is outside 043's goal D1.
- **Moving the queue to a temp directory.** Pending answers must survive a reboot and be found by a later save; a temp path loses them.
- **Keying the folder by project basename.** Two checkouts named `app` would share a folder, which is the same bug with a smaller blast radius.

## Dead Ends

- Looking for an existing project identifier in the queue record: records carry runtime, session and tool ids only.
- Looking for a `realpath` trick that keeps the state under the project: the symlink sits inside the project, so every path under it resolves to the checkout.

## Edge Cases

- **Ambiguous input:** "scoping fix" could mean the state folder or the orphan listing. Chosen interpretation: both, because the consumed log and the scan share the same folder; the fix scopes the folder.
- **Contradictory evidence:** the queue files are already session-scoped, so one could argue no scoping is needed. Resolution: the session id scopes the file, not the project; the directory listing and the consumed log are still shared.
- **Missing dependencies:** none.
- **Partial success:** no live two-project probe was run; the evidence is structural. A temp-directory test with two project roots is the proof the owning packet should add.

## Sources Consulted

- `.skilled/hooks/decision-capture/lib/capture-core.mjs`
- `.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs`
- `.skilled/hooks/decision-capture/bin/sweep-transcript.mjs`
- `.skilled/hooks/decision-capture/bin/sweep-devin.mjs`
- `.skilled/hooks/decision-capture/bin/sweep-codex.mjs`
- `.skilled/hooks/decision-capture/bin/sweep-pi.mjs`
- `.skilled/hooks/decision-capture/pi/decision-capture.ts`
- `.opencode/plugins/decision-capture.js`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts`
- `.skilled/skills/system-spec-kit/runtime/api/index.ts`
- `.skilled/commands/doctor/assets/symlink-manifest.json`
- `.skilled/commands/doctor/scripts/symlink-engine.cjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs`

## Assessment

- New information ratio: 0.86
- Questions addressed: the scoping fix for linked projects.
- Questions answered: the scoping key question.

## Reflection

- What worked and why: reading every producer's project-directory source proved the identity is available everywhere, which is the precondition for any scoping fix.
- What did not work and why: looking for an existing project field in the queue record. There is none, which rules out a filter-only fix for pre-fix data.
- What I would do differently: read the symlink engine's merge recursion before considering a doctor-level fix; the whole-link case makes it a non-starter.

## Recommended Next Focus

Gap 3: what the chat candidate detector produces, how the save step decides whether a candidate answers its question, and which deterministic or cheaper check can reject non-answers without auto-accepting them.
