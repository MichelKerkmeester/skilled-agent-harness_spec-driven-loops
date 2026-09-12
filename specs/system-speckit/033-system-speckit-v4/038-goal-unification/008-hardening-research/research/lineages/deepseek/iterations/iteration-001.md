---
title: "Iteration 1: Hardening — Where a Bound Session Can Still Be Lied To or Left Silent"
trigger_phrases: []
---
# Iteration 1: Hardening — Where a Bound Session Can Still Be Lied To or Left Silent

## Focus

Charter angle 1. Interrogate the shipped packet-bound goal path for robustness gaps that survive the phase-007 P1 fixes: the extractor boundary across its two implementations, a goal.md rewritten or removed while a surface renders it, a packet reached through a second name, a stale `workspace` in the record, CRLF and non-UTF8 byte handling, and the binding table's escape guard. Every item names the line that misbehaves, the smallest fix, and the test that pins it.

## Actions Taken

1. Read `goal-slice.cjs` end to end — the one extractor both the core and the plugin import.
2. Read the scope, lock, record, packet-binding and log-append regions of `goal-core.cjs` (lines 127–250, 374–450, 500–715, 856–1096).
3. Read the validator's goal rules in `spec-doc-structure.ts` (lines 1017–1078) and compared the two frontmatter/slice implementations line by line against the post-007 runtime.
4. Traced every `workspace` decision in the plugin (`opencode-goal.js:1257`, `:1817`, `:2703`, `:2985`) and the adapters (`pi/goal-context.ts:82,192,197`; `cursor/goal-inject.mjs:67–84`; `devin/goal-inject.mjs:62–70`).
5. Checked the goal template's binding rows (`goal.md.tmpl:72–80`) against the validator's row regex.
6. Confirmed the lock topology: `STATE_SUBDIR` (goal-core.cjs:45), `resolveStateDir` (goal-core.cjs:151–162), packet lock naming (goal-core.cjs:894–896), lock root (goal-core.cjs:541).

## Findings

### F1-H1 — The extractor parity drift has reversed: the validator is now stricter than the runtime

The phase-007 fix made the runtime fence tolerant of trailing whitespace (`[ \t]*` before the newline) in `FRONTMATTER_PATTERN` [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:24], but the validator's copy at [SOURCE: file:.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1028] still requires a bare `---\n` on both fences. For a goal.md whose closing fence is `--- ` (trailing space), every runtime surface strips the frontmatter correctly, while `extractGoalDurableSlice` matches no fence and treats the whole file — YAML included — as the durable slice. The 3,000/4,000 budget is then measured against the wrong text, so a compliant document can fail `SPECDOC_SUFFICIENCY_005` with a character count the author cannot reproduce by looking at the durable slice. ADR-003's "both renderers consume the same slice" is half true: they consume the same slice *format*, not the same *boundary*. **Smallest fix**: give `extractGoalDurableSlice` the runtime's tolerant fence regex verbatim, or better, have both call the same exported pattern from a shared module. **Test**: one fixture with trailing spaces on each fence; assert `splitFrontmatter(...).body` and `extractGoalDurableSlice(...)` agree byte-for-byte, and assert the budget count excludes the YAML.

### F1-H2 — A goal.md saved with bare-CR line endings leaks its frontmatter into chat and CLI output

`splitFrontmatter` normalizes only `\r\n` [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:37]. A file whose line endings are classic-Mac `\r` never matches the fence pattern nor the opener pattern [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:24] [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:25], so it falls to the unguarded return `{ frontmatter: null, body: normalized }` [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:43]. `renderChatSlice` then returns the YAML block, including the continuity `session_id`, to every surface that shows or resends the slice — the single leak the module exists to prevent, reached through an encoding the phase-007 trailing-whitespace fix did not cover. The validator has the same normalization gap [SOURCE: file:.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1027]. **Smallest fix**: normalize `\r\n?` (not just `\r\n`) in both implementations; the opener/fence patterns then match unchanged. **Test**: a CR-only fixture asserting `frontmatter !== null` and that the chat slice contains no `session_id` and no leading `---`.

### F1-H3 — The packet lock is keyed on the lexical path, so one goal.md can hold two locks

`packetLockName` hashes `workspace + packetPath` [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:894], where `packetPath` is the lexical `relative` form returned by `resolvePacketDir` [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:169] — not the realpath that containment is judged on [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:166]. An in-workspace symlinked packet alias is accepted deliberately (containment passes), and it yields a different lock name for the same document. Two sessions bound through the alias and the real path therefore acquire different locks and run `appendGoalLog`'s read-modify-write concurrently over one file [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:1047–1073]: both read the same content, both splice their row, both rename; the later rename wins and the earlier row disappears with no error. The `GOAL_LOG_WRITE_REFUSED` hash guard [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:1070] cannot catch it because each writer only compares against its own pre-read copy. **Smallest fix**: derive the lock name from `realpathSync(packet.goalPath)` (the field is already on the projection, goal-slice.cjs:228). **Test**: two CLI `log` invocations through the alias and the real path with a delay injected between read and write; assert both rows are present.

### F1-H4 — Core and plugin disagree on which workspace wins, so one session can show two directives

The core's `resolvePacketGoal` prefers the caller's live workspace and falls back to `record.workspace` [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:889]; the plugin prefers the record's stored workspace and falls back to the live directory [SOURCE: file:.opencode/plugins/opencode-goal.js:2703]. When the recorded workspace is stale — repo moved on disk, a checkout recreated at a new path, a record copied between checkouts — the plugin keeps reading the packet from the old path (if it still exists) while pi, cursor and devin read the live one [SOURCE: file:.opencode/hooks/goal/pi/goal-context.ts:192] [SOURCE: file:.opencode/hooks/goal/cursor/goal-inject.mjs:80] [SOURCE: file:.opencode/hooks/goal/devin/goal-inject.mjs:67]. The failure is silent and it is exactly the "lied to" class: the OpenCode surface can inject a stale directive that the other three surfaces stopped showing. **Smallest fix**: one resolution order in the shared core — live workspace wins, `record.workspace` only when no live value exists — and have the plugin call it instead of re-deciding. **Test**: record with a fictional `workspace`, live directory holding a different goal.md; assert both surfaces read the live file.

### F1-H5 — `readPacketGoal` can throw where its contract says fail-open

Every caller treats `null` as unbound, and the read is guarded [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:215–219], but the `mtimeMs` stat sits outside that guard [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:236]. A goal.md deleted or recreated between the read and the stat — a `git checkout`, an editor's save-replace, or a cleanup pass — makes `statSync` throw `ENOENT` and the exception escapes into a render path that has no catch for it, turning a render call into a crash instead of the unbound state the module promises. Low likelihood, trivial fix. **Smallest fix**: move the `statSync` inside the existing try block and return `null` on failure. **Test**: unlink the fixture inside a stubbed `readFileSync` wrapper (or between the two calls) and assert `readPacketGoal` returns `null` rather than throwing.

### F1-H6 — The first log append silently destroys a non-UTF8 goal.md

`appendGoalLog` reads the document with `'utf8'` [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:1048]; Node decodes invalid sequences to U+FFFD without throwing, and the routine then writes the decoded text back over the file [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:1073]. A goal.md saved in Latin-1 or any non-UTF8 encoding is byte-corrupted by a routine that is supposed to be the safe, unprompted write, and the hash guard cannot see it because both the before and after hashes are computed over the same lossy string. **Smallest fix**: read the bytes as a `Buffer` for this path and refuse with a named error when `Buffer.from(raw.toString('utf8'), 'utf8').equals(raw)` is false, or append without re-encoding. **Test**: Latin-1 fixture; run `log`; assert either a named refusal or byte-identical content outside the inserted row.

### F1-H7 — A CRLF goal.md gains a mixed-ending row on every append

Same read/split/join path [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:1048–1069]: existing lines keep their `\r` because each split line retains it, and the spliced row carries a bare `\n`, so the file becomes mixed-ending after one append. No renderer breaks, but the file no longer matches its neighbors and every later diff carries the inconsistency. **Smallest fix**: detect the dominant terminator once and reuse it for the inserted row. **Test**: CRLF fixture; after `log`, assert every line ends with the same terminator.

### F1-H8 — The binding table's escape check is lexical and does not mirror the runtime's containment

The validator refuses `..` and absolute targets [SOURCE: file:.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1070], which closes the charter's relative-path case — but it resolves existence with `path.join(folder, target)` under no realpath containment, while the runtime refuses a packet whose realpath escapes the workspace [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:157–168]. A parent binding row may therefore name a child reached through a symlink that leaves the workspace and the validator passes it; the runtime never sees the row because it refuses the packet itself. Two smaller edges ride along: `target.includes('..')` rejects any filename merely containing two dots, and a row written as a markdown link instead of a code span is skipped entirely. **Smallest fix**: realpath both sides and require containment, keep the lexical check as a fast refusal only for `..` path segments. **Test**: symlinked child fixture; assert an error, and assert a `child..detail/goal.md`-style legitimate name does not trip it.

### F1-H9 — The missing-child binding rule can be silently bypassed by notation

The row regex [SOURCE: file:.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1065] only sees backticked targets, matching the template's own rows [SOURCE: file:.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:80]. ADR-006 promises that a binding row naming a child that was never written fails; a row written as `| 003-x | [goal](003-x/goal.md) |` fails nothing and warns nothing. **Smallest fix**: also extract link syntax, or warn when a binding-table row carries no backticked path at all. **Test**: link-notation row naming a missing child asserting an error or a warning.

## Questions Answered

- **Q1** (hardening): answered. The bound path fails correctly for a renamed packet (unbound, no fallback, goal-core.cjs:396–398) and serializes plain same-workspace appends (shared workspace state dir, goal-core.cjs:161 plus packet lock, goal-core.cjs:1047). It still has nine ways to lie or go silent: reverse extractor drift (F1-H1), CR-only frontmatter leak (F1-H2), alias-bypassed packet lock (F1-H3), divergent workspace precedence (F1-H4), a throw where fail-open is promised (F1-H5), destructive non-UTF8 append (F1-H6), mixed-endings append (F1-H7), lexical-only binding containment (F1-H8), and notation-bypassed missing-child rule (F1-H9).

## Ruled Out

- **Two same-workspace sessions interleave log rows in the normal case**: locks live under one workspace state dir (`.opencode/skills/.state/goal`, goal-core.cjs:45,161) and the packet lock is shared, so ordinary concurrent appends serialize. Only the alias case (F1-H3) defeats it.
- **A renamed or deleted packet falls back to the stored objective**: `renderGoalBrief` returns an empty block when the bound document is gone (goal-core.cjs:396–398); the stored objective only returns after an explicit `unbind` (goal-core.cjs:959–971), which is a deliberate state, not a silent fallback.
- **Non-UTF8 input crashes a render**: Node decodes invalid bytes to U+FFFD rather than throwing, so the failure is corruption on write (F1-H6), not a crash on read.
- **A `../` binding row escapes**: refused lexically (spec-doc-structure.ts:1070); only the symlink form survives (F1-H8).
- **Adapters disagree with core on workspace**: pi, cursor and devin all pass the live workspace explicitly (pi:192, cursor:80, devin:67); only the plugin re-decides (F1-H4).

## Dead Ends

- Searching for a second writer of goal.md outside `appendGoalLog` found none: the plugin's `appendGoalBrief` only appends system text to the tool output (opencode-goal.js:2808–2826) and the plugin exposes no `log` action (already filed as F007 in the phase-007 review). The log has exactly one writer, which is why F1-H3 and F1-H6 are the whole surface.

## Edge Cases

- **Long session ids**: capped at 4,096 characters before hashing (goal-core.cjs:50) — no path-length hazard from the session key.
- **Lock timeouts**: 10 s acquisition, 120 s stale reaping, sorted acquisition to avoid deadlock (goal-core.cjs:56–58, 571–583) — the alias case (F1-H3) is not a deadlock, it is two disjoint locks, so it cannot be detected by timeout behavior.
- **A binding anchor present but empty**: caught by the validator's empty-anchor rule (spec-doc-structure.ts:1116–1124) before the row scan.

## Sources Consulted

- `.opencode/hooks/goal/lib/goal-slice.cjs` (whole file; cited :24, :25, :37, :43, :157–169, :215–236)
- `.opencode/hooks/goal/lib/goal-core.cjs` (:45, :50, :56–58, :151–162, :200, :389–448, :507–528, :540–583, :894–896, :924–956, :959–971, :1002–1075)
- `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` (:1017–1078, :1116–1124)
- `.opencode/plugins/opencode-goal.js` (:1257–1264, :1806–1838, :2703–2711, :2808–2826, :2985–2987)
- `.opencode/hooks/goal/pi/goal-context.ts` (:82, :192, :197)
- `.opencode/hooks/goal/cursor/goal-inject.mjs` (:67–84)
- `.opencode/hooks/goal/devin/goal-inject.mjs` (:62–70)
- `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` (:72–80)
- `specs/system-speckit/033-system-speckit-v4/036-goal-unification/002-decisions-and-contract-freeze/decision-record.md` (ADR-001, ADR-003, ADR-006)
- `specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review/review-report.md` (F001, F005, F014 as inputs)

## Assessment

- New information ratio: 1.00
- Novelty justification: first evidence pass; nine hardening defects are new to this lineage, and two of them (F1-H1, F1-H3) are defects the phase-007 review did not file.
- Confidence: high for F1-H1, F1-H2, F1-H3, F1-H6, F1-H7 (read directly from the cited lines); medium for F1-H4, F1-H5, F1-H8, F1-H9 (read from the cited lines, but the failure needs a moved workspace, an unlucky unlink, or an unusual notation to be exercised).
- Marked inferred: F1-H3's lost row assumes both writers complete their rename; F1-H6 assumes the file is genuinely non-UTF8 (Node's replacement decoding is documented behavior, not exercised here).

## Reflection

- What worked and why: reading the two extractor implementations side by side was the highest-yield move; the phase-007 fix changed one side only, and the drift inverted.
- What did not work and why: looking for a second goal.md writer produced nothing — the plugin's brief append is output-only — so the remaining hardening surface narrowed to the single writer plus the extractor boundary.
- What I would do differently: start from the lock *namespace* (what key names the resource) rather than the lock *count*; that is what exposed F1-H3.

## Recommended Next Focus

Iteration 2 — Integration: find where the shipped pieces still do not meet. Priorities from this iteration: the plugin's duplicated resolution and surface logic (F1-H4), the two extractor copies with no parity test (F1-H1), and which of these defects has a caller on a path an operator actually walks.
