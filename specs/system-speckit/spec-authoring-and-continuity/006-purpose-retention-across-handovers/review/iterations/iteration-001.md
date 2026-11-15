# Review Iteration 001

## Dispatcher

- Route: `mode=review`, `target_agent=deep-review`, execution `single_review_iteration`.
- Run: session `2026-11-14T11:01:50.956Z`, generation 1, lineage `new`; iteration 1 of 5.
- Dimension: correctness. Operator focus also checked: sk-code/sk-doc alignment and whether a manual-testing playbook, feature catalog, README or the root README needs updating.
- Budget: 12 analysis calls used (configured per-iteration cap 12); the state artifacts below are the required writes, not discovery calls.
- Test execution: out of bounds for this read-only review (the dispatch bars builds/tests). Test evidence is inspection of the changed assertions, not a run.

## Dimension

Correctness (iteration 1). Operator focus in addition: sk-code / sk-doc alignment and whether a manual-testing playbook, feature catalog, README or the root README needs updating.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:1-185`
- `.skilled/hooks/session-relaunch/lib/nudge.cjs:24-36`
- `.skilled/hooks/session-relaunch/tests/nudge.test.cjs:109`
- `.skilled/commands/speckit/handoff.md:132-142`
- `.skilled/commands/speckit/assets/speckit-resume-auto.yaml:136-139`
- `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml:155-158`
- `.skilled/commands/speckit/assets/speckit-resume-presentation.txt:116-128`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:229-252,412-420`
- `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:52-95`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:329-337`
- `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:589-619`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:64-68,163-169,756-770,1077-1082,1133-1145,1226-1255`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts:143-147,213-249`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts:323-334`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1873-1902` (diff)
- `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:64-69`
- `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json:8-14`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Relaunch purpose rule is narrower than the shared hop rule** -- `.skilled/hooks/session-relaunch/lib/nudge.cjs:27-30` -- The relaunch `GOAL_GUIDANCE` tells the model to read the purpose under `### Purpose` or in the `## PROBLEM & PURPOSE` section only, and writes `Parent purpose (<parent folder>)` without defining the folder as repo-relative. The other three hops and the reader cover more:
   - `.skilled/commands/speckit/assets/speckit-resume-auto.yaml:139` and `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml:158` name `## PROBLEM & PURPOSE`, `## PURPOSE` and `## ROOT PURPOSE`, require a repo-relative parent folder, and say to skip an empty, placeholder or scaffold ancestor.
   - `.skilled/commands/speckit/handoff.md:136-137` names all three section shapes and defines `<parent folder>` as that parent's repo-relative folder.
   - `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:42` matches all three heading shapes in code.
   - `.skilled/hooks/session-relaunch/tests/nudge.test.cjs:109` asserts only `### Purpose`, `Parent purpose (`, `Goal objective:` and the scaffold phrase, so the wider shapes and the repo-relative label are untested on this hop.
   - Case: a relaunch of a session bound to a packet whose `spec.md` states its purpose in `## ROOT PURPOSE` (or `## PURPOSE`) with no `### Purpose` heading. The model follows the nudge, finds no enumerated section, and omits the line or falls through to the goal objective, while `/speckit:resume`, the compaction and the continuity save carry it. With an ancestor purpose, the model can also label the parent folder absolutely or by bare name instead of repo-relative.
   - Evidence: `[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:27]` "inside the ## PROBLEM & PURPOSE section"; the sibling rules at `[SOURCE: .skilled/commands/speckit/handoff.md:136]` and `[SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:139]` enumerate all three; `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:42]` is the reader all hops are meant to mirror.
   - User impact: the one-line purpose can disappear after a relaunch for a live spec shape the reader was deliberately widened for (D2), so the next AI no longer sees why the work exists on that hop.
   - Finding class: cross-consumer
   - Scope proof: read all four hop assets plus the shared reader; `rg -n "PROBLEM & PURPOSE|ROOT PURPOSE|PURPOSE section"` over the four assets shows the nudge is the only one missing `## PURPOSE`/`## ROOT PURPOSE`; the nudge test assertion at line 109 covers only the narrower strings.
   - Affected surface hints: ["session-relaunch GOAL_GUIDANCE", "speckit handoff Goal rule", "resume workflow purpose_row", "packet-purpose reader"]
   - Recommendation: make the nudge's heading list and parent-label definition match `handoff.md:136-137` and the resume assets, and add the `## PURPOSE`/`## ROOT PURPOSE` shapes to `nudge.test.cjs`.

   ```json
   {"type":"spec_mismatch","claim":"The relaunch hop's purpose rule enumerates a strict subset of the heading shapes the other three hops and the shared reader support, and drops the repo-relative parent-folder definition.","evidenceRefs":["nudge.cjs:27-30","handoff.md:136-137","speckit-resume-auto.yaml:139","speckit-resume-confirm.yaml:158","packet-purpose.ts:42","nudge.test.cjs:109"],"counterevidenceSought":"Read the final nudge text, its test and the sibling assets; looked for a comment or test declaring the relaunch hop intentionally narrower. None found, and the same change f9f96bdc39 widened the other hops, so the narrower text is an omission rather than a contract.","alternativeExplanation":"A model may open spec.md on its own and find the section, but the nudge explicitly enumerates one heading and a model follows the enumerated path, so the failure is reachable.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"A test or comment stating the relaunch hop intentionally supports only ## PROBLEM & PURPOSE and does not require a repo-relative parent label."}
   ```

2. **Pi compaction skips the nearest-spec.md walk-up the Claude compaction uses** -- `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:80-88` -- Both compaction hooks read the same `lastSpecFolder` state field, but only the Claude hook walks up to the folder that actually holds `spec.md`:
   - `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:236-243]` resolves the folder, refuses a path outside the project, then loops `while (!existsSync(join(folder, 'spec.md')))` to the nearest enclosing folder with `spec.md` before calling the reader. The commit comment names "a track folder or a packet's scratch or research subfolder" as the shapes this handles.
   - `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:80-86]` resolves the folder, refuses a path outside the project, and calls `resolvePacketPurpose(folder)` directly with no walk-up.
   - The shared reader's own ancestor walk does not cover a leaf subfolder: `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:154-162]` only climbs when the parent holds `spec.md` and `isPhaseParent(parent)` is true. A leaf packet is not a phase parent, so `<leaf>/scratch` yields no purpose; the goal fallback reads `<leaf>/scratch/goal.md`, which does not exist.
   - Both hooks read the same field: `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:52-61]` reads the shared hook-state file, and `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:542]` writes `detectedSpec.specFolder`; `detectSpecFolder` now matches any `specs/` path (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:332]`).
   - Case: a Pi session whose recorded `lastSpecFolder` is a packet subfolder (for example `specs/<track>/<leaf>/scratch`) or a track folder without `spec.md`. The Pi compaction injects no `## Packet Purpose` section, while the same state on Claude carries the purpose after compaction.
   - User impact: the purpose line is absent after a Pi compaction for a folder shape the Claude sibling hook was explicitly fixed for; the cross-runtime compaction hop is not at parity.
   - Finding class: cross-consumer
   - Scope proof: read both call sites and the shared reader; the walk-up exists only in `session-prime.ts`; the Pi adapter imports the same reader but not the walk-up; the shared reader only climbs phase parents.
   - Affected surface hints: ["pi session-compact-context", "claude session-prime", "packet-purpose resolvePacketPurpose", "hook-state lastSpecFolder"]
   - Recommendation: share one resolver (a folder-to-packet helper that climbs to the nearest `spec.md`) between the Claude and Pi compaction hooks, or add the same walk-up loop to the Pi hook, with a subfolder fixture in `hook-precompact.vitest.ts`.

   ```json
   {"type":"cross_runtime_parity","claim":"The Pi compaction hook receives the same lastSpecFolder shape as Claude but lacks the nearest-spec.md walk-up, so a subfolder-shaped value loses the purpose on Pi only.","evidenceRefs":["session-compact-context.ts:52-61","session-compact-context.ts:80-86","session-prime.ts:236-243","packet-purpose.ts:154-162","session-stop.ts:542","compact-inject.ts:332"],"counterevidenceSought":"Checked whether resolvePacketPurpose's ancestor walk already covers a leaf subfolder (it only climbs phase parents) and whether Pi reads a different state field (it reads the same lastSpecFolder file). The e129 commit comment itself names the track-folder and scratch/research-subfolder shapes the walk-up was added for.","alternativeExplanation":"The Pi state may in practice hold only proper packet folders, making the gap latent rather than observed; the code path still diverges from the sibling hook on a shape the shared state permits.","finalSeverity":"P1","confidence":"medium-high","downgradeTrigger":"A state-writer guarantee or test proving Pi's lastSpecFolder always holds a folder with spec.md (or a phase parent), or a Pi test showing the hook walks to the packet."}
   ```

### P2 Findings

3. **The 300-character purpose cut can split a surrogate pair** -- `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:113-115` -- `sentence.length` and `sentence.slice(0, MAX_PURPOSE_CHARS - 3)` count UTF-16 code units. A non-BMP character straddling the cut leaves a lone surrogate after the appended `...`.
   - Case: a purpose sentence whose 297th code unit is the high half of an emoji or a CJK extension character. The carried line renders the broken half as U+FFFD and is one code point short of the stated 300-character cap.
   - Evidence: `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:38]` defines the cap and `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:113-115]` applies `length`/`slice` by code unit.
   - User impact: low; a malformed glyph in an otherwise correct purpose line, only when the cap lands inside a non-BMP character.
   - Finding class: instance-only
   - Scope proof: the cap and slice are used at this one site; the other hops copy model-emitted text and are not affected by this code path.
   - Affected surface hints: ["packet-purpose authoredSentence", "formatPacketPurpose consumers"]
   - Recommendation: slice by code points (`Array.from`) or back off one unit when the boundary is a high surrogate before appending `...`.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | fail | D1/D4 hop parity fails on the relaunch guidance (P1-001) and the Pi compaction (P1-002). D2 reader coverage is present (`packet-purpose.ts:42,89-98`); D3 problem-on-compaction-only is present (`formatPacketProblem` imported only by `session-prime.ts:40` and `session-compact-context.ts:73-75`). D5/D6 are outside this target. |
| `checklist_evidence` | partial | Changed assertions were inspected: `save-continuity-write.vitest.ts:323-334` covers the copied parent label and stale-value removal; `nudge.test.cjs:109` does not cover `## PURPOSE`/`## ROOT PURPOSE`. No test run in this read-only review. |
| `skill_agent` | notApplicable | No `SKILL.md` or canonical agent definition is in the 34-file target; `handoff.md` is a command document and keeps its document contract. |
| `agent_cross_runtime` | fail | Claude (`session-prime.ts:236-243`) and Pi (`session-compact-context.ts:80-86`) compaction paths differ on the nearest-`spec.md` walk-up (P1-002). |
| `feature_catalog_code` | pass | `rg -l` over `.skilled/skills/system-spec-kit` docs found one purpose match in `feature-catalog/ux-hooks/goal-opencode-plugin.md`, which documents the goal plugin, not the four hops; no catalog entry describes the touched compaction hooks, so no entry was made stale by this change. |
| `playbook_capability` | notApplicable | The same scoped search found no manual-testing playbook that names the touched hooks or the purpose-carry behavior. |

## Integration Evidence

- Resume surfaces: `.skilled/commands/speckit/assets/speckit-resume-auto.yaml`, `speckit-resume-confirm.yaml` and `speckit-resume-presentation.txt` carry the same three label shapes (`:139`, `:158`, `:126-128`).
- Relaunch surface: `.skilled/hooks/session-relaunch/lib/nudge.cjs` `GOAL_GUIDANCE`, emitted by the session-relaunch adapters; its test is `nudge.test.cjs`.
- Compaction surfaces: Claude `session-prime.ts` (`PreCompact`/session-start compact branch) and Pi `session-compact-context.ts`; both consume `packet-purpose.ts` and `formatPacketProblem`.
- Continuity save surface: `runtime/cli/core/workflow.ts` (`planContinuityWrite`, `:614-615`) through `generate-context.ts`, with `thin-continuity-record.ts` (`packet_purpose` field and validation) and `authored-continuity-snapshot.ts` (preserves the current copy on refresh).
- Template surface: `phase-parent.spec.md.tmpl:64-69` and `create.sh:1873-1902` now leave the purpose and problem as `[YOUR_VALUE_HERE: ...]` placeholders, so an unfilled parent fails a check instead of inheriting the scaffold sentence; `spec-kit-docs.json:8-14` bumps the template version.

## Edge Cases

- Symlink containment (not raised): `session-prime.ts:236-238` and `session-compact-context.ts:80-83` compare resolved paths with `startsWith(root + sep)`, which normalizes `..` but does not resolve symlinks. A repo symlink inside the project pointing outside would pass. No reach is named for an operator session, so this stays a hardening note rather than an active finding.
- Parent-skip wording (not raised): `handoff.md:137` and `nudge.cjs:30` say "the nearest ... phase parent that has a purpose" without the resume assets' explicit "skip an empty, placeholder or scaffold ancestor" sentence. The preceding clause names those texts invalid, so the instruction reads terse rather than wrong; P1-001 already carries the heading-shape gap on the same hop.
- `## PROBLEM AND PURPOSE` (covered): the reader's `AND` alternative (`packet-purpose.ts:42`) also matches, but the nudge names only the ampersand form; this is the same family as P1-001's heading coverage.
- Devin/OpenCode compaction purpose: deferred by D6, not reviewed; recorded in the search ledger as `deferred`.

## Confirmed-Clean Surfaces

- `packet_purpose` is writer-owned and refreshed on every save: `workflow.ts:614-615` recomputes it; `generate-context.ts:188-190` documents that a payload value is ignored; `thin-continuity-record.ts:759-767` drops a non-string or over-512-character value instead of failing the record; `save-continuity-write.vitest.ts:323-334` asserts the copied parent label and the removal of a stale value.
- The problem sentence is carried only by the two compaction hooks: `formatPacketProblem` is imported at `session-prime.ts:40` and `session-compact-context.ts:73-75`, and no resume, relaunch or continuity-save path calls it (D3).
- The three D1 label shapes agree across the resume presentation, both resume YAMLs, and `handoff.md`; the relaunch hop is the one gap (P1-001).
- A path outside the project root is refused before any `spec.md` read in both compaction hooks.

## Ruled Out

- Path traversal from `lastSpecFolder` or the compact brief: both hooks check containment before the read (`session-prime.ts:236-238`, `session-compact-context.ts:80-83`); the residual symlink case is not in reach.
- Continuity save keeping a stale purpose or failing when none is authored: the writer recomputes on every plan, validation drops bad values, and the save test covers copy/removal.
- Multi-line `goal.md` Objective: the live phase goals state `**Objective:**` on one line (`006-.../goal.md:39`, `011-.../goal.md:39`), so the single-line reader at `packet-purpose.ts:101` matches the current shapes.

## Operator Review Focus

- **sk-code:** the runtime changes keep the existing fail-soft style and durable-WHY comments; no artifact labels or tracker ids appear in the new comments. The findings above are the sk-code correctness gaps.
- **sk-doc create-command / create-readme:** the resume YAML assets add one `purpose_row` key without changing the asset schema; `handoff.md` keeps its section contract. The commits updated the local `hooks/claude/README.md`, `hooks/pi/README.md`, `lib/continuity/README.md`, `lib/README.md`, `lib/spec/README.md` and `lib/MODULE-MAP.md`, so the folder docs moved with the code.
- **Manual-testing playbook / feature catalog / root README:** no playbook or catalog entry names the touched compaction hooks (scoped `rg`), and the root `README.md` has no session-prime/compact-inject/purpose-carry inventory. No stale doc surface was found; the one catalog match is the goal-plugin entry, a different feature. No update is required by this change.

## Next Focus

Iteration 2: security. Focus on the trust boundary of `lastSpecFolder` and `pendingCompactPrime.payload` (session-prime, compact-inject, Pi compact context) and the writer-owned continuity fields in `workflow.ts` / `generate-context.ts`; include control-character stripping in the Pi section and the state schema in `hook-state.ts`. Carry forward the two P1s unchanged; do not re-review the relaunch rule or the 300-character cut.

## Next Dimension

Security (iteration 2); focus area: trust boundary of the state/transcript folder and the writer-owned continuity fields; rotation: correctness complete, security next. Carry forward the two P1s; do not re-review the relaunch rule or the 300-character cut.

## Verdict

Conditional: no P0; two P1 correctness/parity gaps (relaunch rule coverage; Pi compaction walk-up) and one P2 boundary cut. The two P1s require a fix or an explicit spec decision before the purpose-carry objective can be called met.

Review verdict: CONDITIONAL
