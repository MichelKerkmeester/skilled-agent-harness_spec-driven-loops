# Review Iteration 002 — Security

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Iteration: 2 of 5, mode `review`, dimension `security`
- Session: `2026-11-14T11:01:50.956Z`, generation 1, lineage `new`
- Target: the 34 non-spec files changed by commits `eaba5ab89e 3d237cd97a f0d8c03036 0837fcd5a2 191ce39bad 43bff36f9d e102ba83be f9f96bdc39 e129af3719 fce8b5d81c`, `specs/` excluded
- Prior state: P0=0 P1=2 P2=1; `correctness` complete; `security` next; path traversal and state transition already swept in iteration 1
- Operator focus for this iteration: sk-code alignment, sk-doc `create-skill` / `create-command` / `create-readme` alignment, and whether a manual-testing playbook, feature catalog, README or the root README needs updating for the purpose-carry feature

## Dimension

Security, read through the trust boundaries the purpose-carry work touches:

1. the `pendingCompactPrime.payload` trust boundary in the Claude compaction path;
2. the new purpose reader as an automatic context-injection path;
3. the writer-owned continuity fields (`packet_purpose`) and their validation;
4. shell and filesystem edges in the relaunch and continuity helpers;
5. the operator-focus documentation surfaces named above.

The iteration does not re-enter the swept path-traversal direction. Evidence for that ruling stands as recorded in iteration 1.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:54-185`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:150-279,410-422`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:263-263,337-337,447-491`
- `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:66-93,177-203`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:759-769,1226-1252`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts:219-239`
- `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:458-544`
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:185-191`
- `.skilled/hooks/session-relaunch/lib/nudge.cjs:20-33`
- `.skilled/hooks/session-relaunch/tests/nudge.test.cjs:596-620`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/README.md:28`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/README.md:20`
- `.skilled/skills/system-spec-kit/runtime/hooks/pi/README.md:47`
- `.skilled/skills/system-spec-kit/runtime/lib/spec/README.md:31`
- `.skilled/skills/system-spec-kit/runtime/lib/MODULE-MAP.md:136`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md:285-305,332`
- `README.md:45-47,522-548`

Read-only cross-reference outside the 34-file target, used only to prove or disprove a code claim:

- `.skilled/skills/system-spec-kit/runtime/hooks/shared-provenance.ts:73-111` (sanitizer and wrapper definitions)
- The three linked hop scenarios: `plugins-and-hooks/session-relaunch-claude.md`, `plugins-and-hooks/compaction-history-recall-conversation.md`, `retrieval/session-recovery-spec-kit-resume.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Two prior P1s remain active and are carried unchanged, not re-adjudicated in this iteration:

- `R1-P1-001` — relaunch purpose rule is narrower than the shared hop rule (`nudge.cjs:27`).
- `R1-P1-002` — Pi compaction skips the nearest-`spec.md` walk-up the Claude compaction uses (`session-compact-context.ts:85`).

### P1/P2 Carried Findings

The carried P1s are the reason this iteration's verdict remains CONDITIONAL. Their evidence and claim packets are unchanged from iteration 1.

### P2 Findings

1. **The purpose line bypasses the recovered-context sanitizer and control-character stripping on the Claude compaction path** -- `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:247]` -- The new `## Packet Purpose` section is built by `buildPacketPurposeSection` and unshifted onto the compact sections after `handleCompact` has already sanitized the cached payload (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:421]`). The shared reader removes comments and collapses whitespace, but its replacement keeps every character that is not matched by `\s` (`[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:109]`). C0 controls other than HT/LF/CR/FF/VT (for example ESC, BEL and NUL) and Unicode format characters survive, and instruction-shaped text is not removed. The Pi adapter strips C0 controls from every section, including the purpose section, before it injects them (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:203]`), so the same packet can produce different context on the two runtimes. The recovered-payload sanitizer itself does remove instruction-shaped lines (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/shared-provenance.ts:73]`), which makes the purpose section the one new automatic section that does not pass through it.
   Finding class: cross-consumer
   Scope proof: both ends are in the 34-file target — the reader is new (`packet-purpose.ts`, 185 added lines) and the Claude consumption is new (`session-prime.ts:228-250,417-421` in the range diff). The sanitizer definition is read-only cross-reference evidence.
   Affected surface hints: Claude SessionStart compact (`session-prime.ts`); Pi `session_compact` (`session-compact-context.ts`); shared purpose reader (`packet-purpose.ts`); the resume/relaunch instruction surfaces that quote the same sentence.
   Case: a packet's `spec.md` purpose sentence contains an ANSI escape sequence or an instruction-shaped line; after a Claude compaction the line is injected verbatim at the top of the recovery context as `Purpose: ...`, while the same packet on Pi has its C0 controls removed. A purpose line can therefore spoof or perturb context on one runtime and not the other, and the injected text is never checked by the recovered-payload sanitizer.
   Downgrade trigger: if repository documents are formally treated as trusted operator input with no clone-from-untrusted-source case, the impact narrows to a cross-runtime consistency advisory.

2. **The operator-facing hop scenarios and root README do not name the new purpose line** -- `[SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md:303]` -- The playbook's table lists the relaunch scenarios (`[SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md:303]`), the compaction scenarios (`[SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md:285]`) and the resume scenario (`[SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md:332]`), but a scoped search of the three linked scenario files for `purpose` returned no match. The root README's resume, compaction and continuity sections describe those hops without mentioning the purpose row (`[SOURCE: README.md:45]`, `[SOURCE: README.md:522]`). The changed local READMEs do document the feature (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/README.md:20]`, `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/README.md:47]`, `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/README.md:28]`), so the gap is at the operator-check and top-level surfaces, not in the module docs.
   Finding class: instance-only
   Scope proof: the operator focus explicitly names the manual-testing playbook, feature catalog, README and root README; these are documentation surfaces, not code findings. The three scenario files and the root README are outside the 34-file code target and are assessed only under that named focus.
   Affected surface hints: `system-spec-kit` manual-testing-playbook hop scenarios; root `README.md` continuity/resume sections; the context-preservation feature-catalog entries for relaunch and compaction history (the existing entries describe the hop but not the purpose row).
   Case: an operator runs the existing session-relaunch, resume or compaction scenario to validate the feature; the scenario passes without ever checking whether `Purpose:` appeared, so a regression that drops or renames the line is not caught outside the unit tests and the goal log.
   Downgrade trigger: if the completion evidence is intentionally limited to the real operator sessions recorded in the goal log, this stays a documentation-completeness advisory.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | D1 label shapes are produced by `formatPacketPurpose` (`[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:173]`); D2's widened headings are present at the section regex (`[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:42]`); D3's problem sentence is consumed only by the compaction paths (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:248]`, `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:89]`). Hop parity still fails on the two carried P1s. |
| `checklist_evidence` | partial | Changed assertions were inspected, not executed (read-only iteration boundary). `packet-purpose.vitest.ts` and `hook-session-start.vitest.ts` exercise label shapes and the compaction section; no assertion covers the sanitizer parity found here. |
| `skill_agent` | notApplicable | No skill definition or canonical agent file is among the 34 changed files. |
| `agent_cross_runtime` | fail | The Pi adapter removes C0 controls from the purpose section (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:203]`); the Claude adapter does not (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:247]`). P1-002 also remains active. |
| `feature_catalog_code` | partial | Entries exist for the relaunch and compaction-history hops; neither entry names the purpose row. The prior pass covered stale entries, not this coverage question. |
| `playbook_capability` | fail | The three linked hop scenarios contain no purpose assertion; this is finding `R2-P2-002`. |

## Integration Evidence

Named surfaces checked, not inferred:

- Claude hook path: `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` (pre-compact cache producer) and `session-prime.ts` (SessionStart compact consumer); the purpose section is added in the consumer at lines 417-421.
- Pi hook path: `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts`, where the purpose section is one of the sections passed through `stripControlCharacters` at line 203.
- Relaunch hop: `.skilled/hooks/session-relaunch/lib/nudge.cjs:24-33`; the hostile `created_at` shell test is at `.skilled/hooks/session-relaunch/tests/nudge.test.cjs:620`.
- Resume hop instructions: `.skilled/commands/speckit/assets/speckit-resume-auto.yaml`, `speckit-resume-confirm.yaml:158`, `speckit-resume-presentation.txt`, and `.skilled/commands/speckit/handoff.md:135-142`. These are model-mediated surfaces, so they inherit the reader's text handling.
- Continuity save: `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:466-474`, `.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:759-769`, and `.skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts:227`.
- Operator-focus docs: the playbook table and the three linked scenarios, the root `README.md` continuity sections, the `system-spec-kit` feature-catalog `context-preservation` entries, and the six changed module README/MODULE-MAP files.

## Edge Cases

- The sanitizer result at `session-prime.ts:176` is not dead code: `wrapRecoveredCompactPayload` calls `sanitizeRecoveredPayload` internally (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/shared-provenance.ts:88]`, `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/shared-provenance.ts:109]`). The local value only feeds the sanitized-length log line. This was a candidate P1 and is ruled out below.
- The purpose reader removes newline injection by collapsing `\s+`, so the remaining injection surface is single-line controls (ESC/BEL/NUL) and instruction-shaped prose, not multi-line delimiters.
- Pi's `stripControlCharacters` covers ESC but not every Unicode format character (for example the bidi overrides); the finding is scoped to the asymmetry it actually proves.
- The root README and playbook are outside the 34-file code target. They are reported only because the operator focus names them; they do not widen the code scope.
- The 300-character cut can split a surrogate pair; that is carried from iteration 1 as `R1-P2-001` and was not re-reviewed here.
- The residual symlink case in the containment check was already ruled out in iteration 1 and is not re-entered.

## Confirmed-Clean Surfaces

- Recovered payload sanitation: the wrapper uses the sanitized payload in the output (`shared-provenance.ts:88,109`); there is no bypass at `session-prime.ts:176-187`.
- Continuity purpose validation: a non-string, empty or over-long value is dropped rather than failing the save (`[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:763]`); the writer owns the copy (`[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:466]`).
- Fail-soft reader: every filesystem read is inside a `try/catch` and returns `null` on failure (`[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:167]`).
- No new shell/eval/child-process sink in the changed purpose code; the relaunch date is shell-quoted and covered by a hostile-input test (`[SOURCE: .skilled/hooks/session-relaunch/tests/nudge.test.cjs:620]`).
- Secret exposure through the continuity purpose copy: the value is a repo-authored sentence; no credential or transcript path reaches it in the reviewed code.
- The changed module READMEs and MODULE-MAP document the new module and field (`[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/README.md:31]`, `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/MODULE-MAP.md:136]`), and no new skill, command folder or agent definition was added, so the sk-doc `create-skill` / `create-command` / `create-readme` surfaces have no missing artifact to review.

## Ruled Out

- **Recovered-payload sanitizer bypass at `session-prime.ts:176-177`.** The wrapper sanitizes internally at `shared-provenance.ts:88` and emits the sanitized value at line 109. The local variable only supplies the log length. Not a finding.
- **Shell injection through the purpose or handoff date.** `nudge.cjs` quotes the date it interpolates and the test drives a hostile `created_at` value (`nudge.test.cjs:620`); the purpose text is not interpolated into a shell command. Not a finding.
- **Secret exposure through `packet_purpose`.** The field is a one-sentence copy of a repo document, refreshed by the writer, and the reviewed readers do not attach transcript or credential data to it. Not a finding.
- **Path traversal from `lastSpecFolder` / the compact brief.** Already swept in iteration 1 with containment evidence at `session-prime.ts:236-238` and `session-compact-context.ts:80-83`; not re-entered.
- **State transition / stale continuity purpose.** Already swept in iteration 1 (`workflow.ts:614-615`, `thin-continuity-record.ts:759-767`); not re-entered.

## Next Focus

- Next dimension: `traceability`.
- Focus: D1/D2/D3 parity across the four hop surfaces, the eleven phase goals and check scripts, and whether the completion-criteria evidence is present and current. Carry `R1-P1-001`, `R1-P1-002`, `R1-P2-001`, `R2-P2-001` and `R2-P2-002`.
- Operator focus: re-check the docs surfaces after the traceability pass; the playbook and root README gap is already recorded, so do not duplicate it unless new evidence appears.
- Do not re-enter: path traversal, recovered-payload sanitizer bypass, shell injection, secret exposure, and the security trust boundaries already covered here.

## Verdict

- FAIL: none; no active P0.
- CONDITIONAL: active P1s remain (`R1-P1-001`, `R1-P1-002`), carried unchanged.
- New this iteration: two P2 findings (`R2-P2-001`, `R2-P2-002`); `hasAdvisories=true`.

Review verdict: CONDITIONAL
