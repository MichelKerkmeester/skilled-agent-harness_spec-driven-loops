# Review Iteration 001

## Dispatcher

- Mode: review, lineage `vibe-2`, session `fanout-vibe-2-1795770902266-zziqbr`, generation 1, lineageMode `new`.
- Target: `research/research.md`, `research/regrade-log.md` and the 40 iteration records under `research/lineages/`.
- Dimension: correctness. Focus: phases 001-004 of `research.md` section 3.
- Iteration 1 of 10. Stop policy `max-iterations`, so convergence is telemetry only.

## Files Reviewed

- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:1-260` (sections 1-3 through phase 004)
- `specs/system-skilled-bots/context/OpenBot-main/shared/routine-firing.ts:1-60`
- `specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:10-30`, `:50-56`, `:118-130`, `:184-192`
- `specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/terminal.rs:30-50`, `:88-105`
- `specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/README.md:53-58`
- `specs/system-skilled-bots/context/openhuman-full.build.log:946-956`
- `specs/system-skilled-bots/context/openhuman-full/Cargo.toml:33-48`
- `specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/Cargo.toml:1-10`
- `specs/system-skilled-bots/context/buzz-main/crates/buzz-acp/src/pool.rs:2245-2295`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-approval/src/engine.rs:655-665`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:14-26`
- `specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:177-181`, `acceptance-criteria.md:59-63`, `tasks.md:78-82`, `design/data-model.md:43-50`, `:63-92`
- `specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:118-122`, `:168-176`, `plan.md:84-88`, `design/state-machines.md:64-72`
- `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/plan.md:66-72`, `005-answer-flow/spec.md:208-216`, `005-answer-flow/design/state-machines.md:36-48`
- `specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:140-150`, `design/fixtures/README.md:50-56`, `design/fixtures/prompt.shared.txt:1-5`
- `specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md:12-18`
- `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:318-326`, `lib/runner.ts:134-142`, `:1110-1125`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The 003 lift row says the full checkout adds a build log, but the log sits outside the checkout** -- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:186` -- The row reads "`openhuman-full` adds only the vendored crate sources, wired in by path, plus a build log that shows the crate compiled". The log is `C/openhuman-full.build.log`, a sibling of the checkout under `specs/system-skilled-bots/context/`, not a file the checkout adds. Section 4 of the same document states the correct fact: "A `diff -rq -x vendor` of the two trees prints one line, `Only in openhuman-full: .git`" (`research.md:479`). A builder who reads the lift row looks for a build log inside the tree and does not find one.
   Finding class: documentation-accuracy
   Scope proof: the claim is in the reviewed file at `research.md:186`; the contradicting statement is in the same file at `research.md:479`; the log's location is `specs/system-skilled-bots/context/openhuman-full.build.log`, confirmed by `sed -n '946,956p'` on that path.
   Affected surface hints: `research/research.md` section 3 phase 003 lift row 1; section 4 opening paragraph.
   Case: a builder opens `specs/system-skilled-bots/context/openhuman-full/` looking for the build log the row says the checkout adds, finds no log, and cannot tell whether the crate was built.

2. **The 002 lift row names `contracts/prompt-sections.md` as the owner of the prompt order, and that file says phase 005 owns it** -- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:196` -- The row reads "The rule belongs in `contracts/prompt-sections.md`, which owns the prompt order [SOURCE: B/contracts/prompt-sections.md:15]". Line 15 of that contract reads "Phase 005 owns the order for the whole packet ... and this file writes down the literal text each phase must emit". The file records the order; it does not own it. The row's own next sentence is right about the file's role ("the lift needs a third entry in the notices file"), so only the ownership clause is wrong.
   Finding class: documentation-accuracy
   Scope proof: the claim is at `research.md:196`; the cited line is `specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md:15`, read directly.
   Affected surface hints: `research/research.md` section 3 phase 002 lift row 1; the firing-frame guard's landing place.
   Case: a builder told the contract owns the order edits `contracts/prompt-sections.md` to add the firing frame and leaves phase 005's order document unchanged, so the two disagree on where the frame sits.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | pass | `research.md:186`, `:196`, `:203`, `:214`, `:222`, `:230`, `:238`; `B/001-activity-and-actor/design/data-model.md:47`, `:67`, `:88`; `B/002-routine-layer/spec.md:172`; `B/003-terminal-screen/005-answer-flow/spec.md:212-213`; `B/004-computer-exposure/spec.md:143` | Every plan-side claim sampled in phases 001-004 resolves to a plan line that says what the row claims. Two rows misdescribe the artefact they point at (P2 findings 1 and 2). |
| `checklist_evidence` | notApplicable | `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/` holds no `checklist.md` | The packet is a Level 1 research packet with no checklist, so there is no checklist evidence to align. |

## Integration Evidence

- `specs/system-skilled-bots/context/OpenBot-main/shared/routine-firing.ts:9-13` holds `FIRING_FRAME` with exactly the three sentences the 002 lift row quotes, and `:21-34` holds the recorded live failure ("FOUND ON A LIVE FIRING, and it recorded `succeeded`"). The row's claim that only the new message is framed is at `:52-54`.
- `specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/terminal.rs:34-47` enables `EnableBracketedPaste` and `:90-103` disables it on restore, so the 003 paste pitfall's reference half holds.
- `specs/system-skilled-bots/context/buzz-main/crates/buzz-acp/src/pool.rs:2284-2289` is `workspace_section(cwd)` emitting `Current working directory: {cwd}` inside a `workspace` section, and `:2251-2258` is the doc comment placing it after the static base for prompt-prefix caching. The 004 lift row's reference half holds.
- `specs/system-skilled-bots/context/openhuman-full.build.log:950` is the `Compiling openhuman-tui v0.64.20` line and `:956` the `Finished` line, so the "built" claim rests on the log as the row says.
- `specs/system-skilled-bots/context/openhuman-full/Cargo.toml:35` is `license = "GPL-3.0-only"` and `crates/openhuman-tui/Cargo.toml:6` is `license.workspace = true`, so the GPL-3.0-only grade on the TUI crate holds.

## Edge Cases

- **Ambiguity in "owns the prompt order".** `contracts/prompt-sections.md:15` gives ownership to phase 005 and the literal text to itself. The review keeps the lower severity (P2) because the row's operative instruction — add the frame where the prompt is built — is still correct; only the ownership clause misleads.
- **The build log is cited from outside the checkout.** `C/openhuman-full.build.log` is a sibling of the checkout, so a `[SOURCE: ...]` tag on it resolves but proves nothing about the tree. Recorded as P2 finding 1 rather than a citation failure, because the tag itself resolves.
- **`crossterm 0.29` versus `0.29.0`.** The plan pins `crossterm 0.29` (`003-terminal-screen/005-answer-flow/plan.md:26`) and the synthesis writes `0.29.0`. Cargo treats `0.29` as a caret range that resolves to the newest `0.29.x`, so the synthesis's `0.29.0` is narrower than the pin. Not raised as a finding: the two crossterm behaviours the row relies on are stable across the `0.29` line, and the row says the citation checker cannot follow them.
- **`openhuman-tui` file counts differ between sections.** Section 3 says 52 `.rs` files and 9,526 lines under `src/`; section 4 says 55 files and 9,601 `.rs` lines for the crate. Both are consistent once `src/` is distinguished from the crate root, and section 9 states both figures together. No finding.

## Confirmed-Clean Surfaces

- 001 differences row 2: `OpenBot-main/docs/routines.md:186-188` says a routine runs as the person who created it with that person's grants, which is what the row claims.
- 001 pitfall row 1: the double-print window is real. `lib/runner.ts:1116-1120` writes the needs-you item and bumps the generation stamp before the parked run's terminal record exists, `data-model.md:67` gives a parked record no row, `data-model.md:88` drops a side file whose run has a record, and `data-model.md:47` reads a needs-you row from the open item.
- 001 pitfall row 2: `B/001-activity-and-actor/spec.md:179`, `acceptance-criteria.md:61` and `tasks.md:80` name `activity-groups.ts` and `activity-rows.ts` as the two lifted files, and `data-model.md:45-53` lists no event-row source, so none of the three `activity-rows.ts` rules has an input.
- 002 differences row 1: `OpenBot-main/docs/routines.md:12` defines a check-in as a routine that only tells you and `:19-20` caps it at once an hour; `B/002-routine-layer/spec.md:172` sets one 900-second floor for every cron start and `:120` defers the check-in cap. The 96-versus-24 arithmetic holds.
- 002 differences rows 2 and 3: `routines.md:53-54` keeps and pauses a goal whose schedule was refused, and `:25-26` puts working rows first.
- 002 differences row 4: `tinysecurity-approval/src/engine.rs:658-661` refuses a Cron external effect outright and `tinysecurity-policy/src/host_tool.rs:17-22` refuses any acting tool on a cron turn "whatever the autonomy tier".
- 002 pitfall row 1: `routines.md:120-128` states the fatigue rule and leaves a busy dispatch to the work queue's attempt count; `lib/runner.ts:136-139` gives `lease-held` and `precheck-silent` a null class; `B/002-routine-layer/design/state-machines.md:68` and `plan.md:86` stop the streak at the first non-failed record.
- 003 pitfall row 1: `openhuman-tui/README.md:55-56` states "Pasting text never sends it automatically"; `B/003-terminal-screen/005-answer-flow/spec.md:212` is NFR-S02 on a pasted escape sequence and `:213` is NFR-S03, "No key denies an item the operator did not name"; `002-architecture-and-contracts/plan.md:70` describes an event source that yields a key, a resize or a closed input and no paste; `005-answer-flow/design/state-machines.md:40` sends on `y` and `:45` sends on Enter.
- 004 lift row 1: the plan-side test shape is at `B/004-computer-exposure/design/fixtures/README.md:53` and the percent-encoded run-folder segment is at `design/fixtures/prompt.shared.txt:3`.
- 004 differences row 1: `B/004-computer-exposure/spec.md:143` is REQ-001 with the null-branch variant.

## Ruled Out

- **The 002 firing-frame lift is a misreading of the reference.** Ruled out: `routine-firing.ts:9-13` is the three-sentence frame verbatim, and the doc comment at `:21-34` records the live failure the row describes.
- **The 003 paste pitfall rests on a crossterm version the plan does not pin.** Ruled out: `003-terminal-screen/005-answer-flow/plan.md:26` pins `crossterm 0.29`, and the synthesis's `0.29.0` is inside that range.
- **The 001 double-print window is closed by an existing dedupe.** Ruled out: `data-model.md:45-53` and `:63-92` hold no `runId` dedupe between the `needs_you` and `working` groups.
- **The 004 lift row's "no notice is needed" is wrong for an Apache-2.0 source.** Ruled out: the row says "Mirror, copy no code, so no notice is needed", and a mirror with no copied text needs no notice under Apache-2.0 section 4.

## Next Focus

- Dimension: correctness
- Focus area: phases 005-008 of `research.md` section 3 -- the memory, approval, per-bot-app and vault rows, read against the reference and plan lines they cite
- Reason: the next contiguous phase group, and the group with the most `confirmed` rows in the document
- Rotation status: second pass of the correctness dimension
- Blocked/productive carry-forward: the plan-side search claims ("searched, no hit") are the productive category; the reference-side reads are the blocked category, because they cannot be rerun without the gitignored checkouts
- Required evidence: the cited reference line and the cited plan line for each row checked

Review verdict: PASS
