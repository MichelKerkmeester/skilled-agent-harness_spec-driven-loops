# Iteration 005 — `pinnedSha256` scope, layout-link repair, and `capture` bodies

## Focus

Close the three carried residuals from iteration 3:

1. `pinnedSha256` scope validation for multi-output entries.
2. Whether `apply` repairs layout links.
3. `capture` bodies for `json-entry` and `skill-root`.

## Actions Taken

1. Read the plan-layer signatures in `overlay-engine.cjs` (`acceptedHashFor`, `planFileOverlay`, `planDirectoryOverlay`, `planMarkedSectionOverlay`, `planJsonOverlay`, `planSkillRootOverlay`, `planRemoveRootOverlay`) to establish which scopes receive `acceptedSha256` and which read `entry.pinnedSha256`.
2. Read `planLayoutLinks`, `applyLayoutLink`, and the `analyze` / `runCheck` / `applyUnderLock` call sites to establish whether layout links are planned, reported and repaired.
3. Read `captureCandidates`, `captureRecordForPath` and `captureUnderLock` end to end to establish what `capture` accepts and what it writes for `json-entry` and `skill-root`.
4. Searched every `*.md` in the repo for `pinnedSha256` to test whether the field is documented for external-repo maintainers.

## Findings

### F1 — `pinnedSha256` is enforced only for `scope: "file"`; every other scope accepts it and silently ignores it (P2)

The field is read in exactly five places in the engine, all of them on the single-file path or the shared classifier:

- `planFileOverlay` consults it when the destination is missing (`upstream removed …; rebase the overlay`) [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:995], when the entry declares no pin it copies unconditionally [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1003], and when comparing the live hash [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1007].
- `classifyDestination` uses it to decide that a destination holding the pinned bytes is `overlay-edited` rather than `upstream-moved` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1798] and again in the applied-hash branch [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1804].

The multi-output planners never receive the accepted-hash map and never read the field: `planDirectoryOverlay(entry, ctx, problems)` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1022], `planSkillRootOverlay(entry, ctx, problems)` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1193], and `planRemoveRootOverlay(entry, ctx, problems)` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1292]. `planMarkedSectionOverlay` and `planJsonOverlay` do take `acceptedSha256`, but neither references `pinnedSha256` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1075] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1126].

Consequence: an author who writes `pinnedSha256` on a `directory` or `skill-root` row gets no drift guard at all, with no warning. The manifest loads and the row behaves as if the field were absent.

Unverified, and the confirmation step: I did not read `loadManifest`'s body [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:426], so I cannot say whether it rejects the field on non-`file` scopes. What is confirmed is that no planner other than `planFileOverlay` ever reads it, so even a permissive loader leaves the field inert.

Recommendation: reject `pinnedSha256` on every scope except `file` at load time with a message naming the scope, or (weaker) document it as file-only. Silent acceptance is the worst option.

### F2 — `capture` cannot absorb a file that exists only in the live tree (P2)

`captureRecordForPath` returns a record for any candidate under a `directory` destination [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2231] and for a candidate under a `skill-root` `replace` prefix [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2237]. But `captureUnderLock` then looks the path up in the analysis records and refuses when it is absent:

- `const classified = analysis.records.find((item) => item.key === record.key)` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2310]
- `if (!classified) { console.log('refuse: path is not an overlay destination: ' + inputPath); return EXIT_ERROR; }` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2311]

A file the user just created in the live tree has no plan record, because plans are built source-to-destination, not destination-to-source. So the natural workflow — add a file in the overlaid directory, then `capture` it — fails with "path is not an overlay destination", the same message used for a path no overlay owns. The earlier ownership check already proved the opposite.

Recommendation: for `directory` and `skill-root` scopes, write the new live file into the overlay source and record its hash, or at minimum say "new files are not capturable; create them in <overlay source>" so the message does not contradict the ownership result.

### F3 — `capture` on a `json-entry` refuses before checking whether anything changed (P3)

The `json-entry` refusal is emitted before the `in-sync` / `live-edited` classification:

- `if (record.entry.scope === 'json-entry') { console.log('refuse: edit … instead'); return EXIT_ERROR; }` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2291]
- the `nothing to capture` branch is later [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2315]

So `capture` on an unchanged `json-entry` destination prints a refusal rather than "nothing to capture". Low impact, but a user testing whether their edit landed sees a refusal for a no-op. The message also names the overlay source without naming the JSON key the row owns, so the user still has to open the file to find the entry.

### F4 — `apply` does repair layout links; the residual is answered, with one fail-closed nuance (P3)

`analyze` appends records for missing layout links [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1885], `runCheck` reports them as `layout:` problems [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2013], and `applyUnderLock` partitions them out and repairs each one before regeneration:

- `const layoutRecords = analysis.records.filter((record) => record.layout);` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2128]
- `applyLayoutLink(root, record.link);` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2136]

`applyLayoutLink` re-checks the replaced link before unlinking, so a link that changed since planning is not deleted [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1470].

Nuance: `applyUnderLock` returns `EXIT_CONFLICT` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2124] before the layout repair loop runs. A missing link therefore stays missing while any unrelated entry is in conflict, and `status` keeps showing it as `overlay-edited` with the fix `overlay apply` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1891]. The behaviour is fail-closed and defensible; the message is not, because the printed conflict list does not say that layout links are also outstanding. Recommendation: when apply exits on conflict, append the outstanding layout links to the report.

### F5 — `pinnedSha256` is invisible in operator-facing documentation (P2)

A `**/*.md` search for `pinnedSha256` returns only the research packet itself (strategy, dashboard, iteration narratives, prompts). No operator-facing markdown — `overlays.md`, `INSTALL-SKILLED.md`, or the doctor command docs — mentions the field.

So the one field that protects a `file` overlay against upstream drift is undocumented for the external-repo maintainer who authors `.skilled-overlays.json`. This is a direct Q5 data point: the code has a safety feature the docs never surface. Recommendation: document `pinnedSha256` next to `scope: file`, including the exact refusal semantics (`upstream changed <path>; rebase the overlay` and `upstream removed <path>; rebase the overlay`) and the fact that it is file-scope only.

### F6 — `skill-root` capture refusals do not explain why a file is ineligible (P3)

`captureRecordForPath` only offers a `skill-root` file when it sits under `replace` and not under the retained paths [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2240]. Any other file under the skill root — an upstream-owned copy — falls through to the generic "path is not an overlay destination" refusal [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2280]. That is factually wrong from the user's point of view: the path *is* inside an overlay destination; it is just not overlay-owned. Recommendation: distinguish "upstream-owned, edit upstream" from "no overlay owns this path".

## Questions Answered

Carried residuals, not strategy key questions:

- `pinnedSha256` scope validation for multi-output entries: **no validation exists**, and the field is inert on every scope except `file` (F1).
- Does `apply` repair layout links: **yes**, before regeneration, with a re-check on the replaced link (F4).
- `capture` bodies for `json-entry` and `skill-root`: `json-entry` is refused by design and points at the overlay source (F3); `skill-root` captures only files under a `replace` prefix that are not retained (F6), and cannot absorb a new live file (F2).

## Questions Remaining

- Q2: Which `/doctor` command messages, prompts and outputs confuse an external-repo user or leave them without a next step? Still open as a whole. This iteration adds three message-level data points (F2, F3, F6) but does not survey the install/symlink/setup/helper surface.
- Q5: Where do `INSTALL-SKILLED.md`, `overlays.md`, the doctor command docs and the skill README disagree with the code? Still open as a whole. This iteration contributes one confirmed disagreement (F5: an enforced field with no documentation) and one partial (F1: an accepted-but-inert field with no documentation of its scope).
- New residual: whether `loadManifest` rejects `pinnedSha256` on non-`file` scopes, and whether it rejects unknown keys at all. Confirming this decides whether F1 is "silently inert" or "silently inert plus a missing validation".

## Next Focus

Run is at its iteration ceiling (5 of 5, stop policy `max-iterations`). If a further segment is opened, it should survey the operator-visible text of `/doctor:install`, `/doctor:symlink`, `/doctor:setup` and `/doctor:helper` against Q2, and diff `overlays.md` / `INSTALL-SKILLED.md` against the engine's actual refusals against Q5.
