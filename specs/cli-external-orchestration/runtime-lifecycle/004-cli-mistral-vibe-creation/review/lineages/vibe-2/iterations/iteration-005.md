# Review Iteration 005

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Mode: review, execution single_review_iteration, state source externalized files
- Session: `fanout-vibe-2-1794808672532-65xu0h`, generation 1, lineageMode `new`
- Iteration: 5 of 5 (stopPolicy `max-iterations`)
- Dimension: traceability and maintainability
- Operator review focus: correctness, security and fail-open defects, wire-format and payload edge cases, ordering and kill-switch gaps, and parity gaps against the OpenCode plugins. This iteration addresses the focus directly: it compares each ported guard against its OpenCode original, and it tests the wire-format assumptions the `post_tool` payload rests on.
- Sources read: `.vibe/hooks.toml`, `.vibe/plugins/repo-guards/post-edit-quality.mjs`, `dist-freshness.mjs`, `classifier-injection-screen.mjs`, `lib/hook-io.mjs`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`, `.opencode/plugins/env-secret-guard.js`, `system-skill-advisor.js`, `sk-code-post-edit-quality.js`, `system-dist-freshness-guard.js`, `classifier-injection-screen.js`, `.vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md`.

## Files Reviewed

- `.vibe/plugins/repo-guards/post-edit-quality.mjs:39-70`
- `.vibe/plugins/repo-guards/dist-freshness.mjs:50-113`
- `.vibe/plugins/repo-guards/classifier-injection-screen.mjs:35-49`
- `.vibe/plugins/repo-guards/lib/hook-io.mjs:25-27`
- `.vibe/hooks.toml:1-140`
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:31-40,116-150,186-245`
- `.opencode/plugins/env-secret-guard.js:1-140`
- `.opencode/plugins/system-skill-advisor.js:1-130`
- `.opencode/plugins/sk-code-post-edit-quality.js`
- `.opencode/plugins/system-dist-freshness-guard.js`
- `.opencode/plugins/classifier-injection-screen.js`
- `.vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md:1-13`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. R1-P1-001 remains active and is carried forward.

### P2 Findings

1. **Three hooks gate on a `post_tool` field value the reference doc records as unobserved** -- `.vibe/plugins/repo-guards/post-edit-quality.mjs:45`, `.vibe/plugins/repo-guards/dist-freshness.mjs:106`, `.vibe/plugins/repo-guards/classifier-injection-screen.mjs:41` -- all three read `if (payload.tool_status && payload.tool_status !== 'success') return allow();`. The reference doc states that only the `pre_tool` and `post_agent` payloads were captured and that the other five, `post_tool` among them, are "documented rather than observed" (`guards-and-hooks.md:196-198`). The only live evidence for the value is VIB-HK-018, a shell command; no scenario exercises a `write_file` or `edit` result. The OpenCode originals have no equivalent gate — they run on a transform after the result is already in the message stream — so the field is a Vibe-only assumption with no cross-runtime precedent.
   Finding class: matrix/evidence
   Scope proof: the three reads are inside the declared target; the reference doc and the OpenCode originals are cited as the evidence and the parity reference.
   Affected surface hints: `.vibe/plugins/repo-guards/post-edit-quality.mjs`, `.vibe/plugins/repo-guards/dist-freshness.mjs`, `.vibe/plugins/repo-guards/classifier-injection-screen.mjs`, the three `post_tool` bindings in `.vibe/hooks.toml`
   Case: a Vibe build whose `post_tool` payload reports a successful call as `'ok'` or `'completed'` rather than `'success'`. All three hooks return early on every write and edit, so post-edit quality findings, the dist-staleness banner and the injection advisory all stop arriving, with no error and no log line.

2. **`dist-freshness.mjs` re-implements the shared `sessionDirFor` instead of importing it** -- `.vibe/plugins/repo-guards/dist-freshness.mjs:53-55` -- the file defines a local `sessionDirFor` with the same body as the exported one in `lib/hook-io.mjs:25-27`, and imports `toCoreCall` and `REPO_ROOT` from that same module two lines above. The other five guards that need the resolution import it: `env-secret-guard.mjs:12`, `overlay-guard.mjs:14`, `post-edit-quality.mjs:16`, `spec-gate-classify.mjs:20`, `spec-gate.mjs:25`. The local copy is the only one, so a change to the shared rule — the comment at `hook-io.mjs:19-24` explains why a relative cwd resolves against the checkout — reaches five guards and not the sixth.
   Finding class: instance-only
   Scope proof: both files are inside the declared target.
   Affected surface hints: `.vibe/plugins/repo-guards/dist-freshness.mjs`, `.vibe/plugins/repo-guards/lib/hook-io.mjs`
   Case: a maintainer changes `sessionDirFor` to also normalise a `~`-prefixed cwd. Five guards pick it up; `dist-freshness` keeps the old rule, so the dist banner resolves a path the other guards resolve differently.

3. **The port map records a clean hook verdict for two plugins whose tool registrations the port drops** -- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:122,131` -- the `env-secret-guard.js` row says the plugin "registers three value-free dotenv inspection tools" and gives the verdict `hook` with no note that the port cannot carry them; the `system-skill-advisor.js` row says it "exposes the advisor status tool" and likewise records no loss. The same table records exactly this loss for `system-speckit-completion.js` at line 139: "not needed — Vibe has no plugin tool registry". The three registrations are real: `env-secret-guard.js:121-140` registers `env_secret_list_keys`, `env_secret_validate` and `env_secret_fingerprint`, and `system-skill-advisor.js:24` imports the tool helper.
   Finding class: matrix/evidence
   Scope proof: the doc is cited as the traceability surface the review focus names; the OpenCode plugins are read as the parity reference, not reviewed.
   Affected surface hints: `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`, `.opencode/plugins/env-secret-guard.js`, `.opencode/plugins/system-skill-advisor.js`
   Case: an operator reads the port map to decide whether the Vibe guards cover the OpenCode set. The table says `env-secret-guard.js` ports as a hook, so they conclude the dotenv inspection tools are available. They are not, and nothing in the row says so.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | The binding count matches the doc exactly: 18 `[[hooks]]` entries in `.vibe/hooks.toml`, and `guards-and-hooks.md:37` records 18 with the same event split. The `post_tool` field assumption and the two dropped tool registrations do not match. |
| `checklist_evidence` | notApplicable | No checklist document on a hook and plugin surface. |
| `agent_cross_runtime` | partial | The port map classifies all 21 OpenCode plugins (`guards-and-hooks.md:116-139`), and the four `not needed` verdicts each give a reason. Two `hook` rows omit the tool registrations the port drops, which is the gap finding R5-P2-003 records. |
| `playbook_capability` | partial | The playbook's verdict table is the live evidence for each binding, and the doc's own rule is that "a row there counts only when its run postdates the last change to that hook" (`guards-and-hooks.md:37`). VIB-HK-018 covers `tool_status` for a shell call only; no row covers a `write_file` or `edit` result, which is the gap finding R5-P2-001 records. |

## Integration Evidence

- `.vibe/hooks.toml` — 18 `[[hooks]]` entries, matching `guards-and-hooks.md:37`'s count and event split.
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:196-198` — "Only the `pre_tool` and `post_agent` payloads were captured, so the other five are documented rather than observed."
- `.vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md:3` — "`tool_name` is always the qualified name", the premise behind R1-P2-001.
- `.opencode/plugins/env-secret-guard.js:121-140` — the three tool registrations finding R5-P2-003 records as dropped.
- `.opencode/plugins/sk-code-post-edit-quality.js`, `system-dist-freshness-guard.js`, `classifier-injection-screen.js` — none carries a `tool_status` equivalent, so the gate is a Vibe-only assumption.
- `.vibe/plugins/repo-guards/lib/hook-io.mjs:25-27` — the shared `sessionDirFor` that `dist-freshness.mjs:53-55` duplicates.

## Edge Cases

- **The `post_tool` field names are documented, not observed.** `guards-and-hooks.md:196-198` says so explicitly. Finding R5-P2-001 is therefore a traceability finding about an unverified assumption, not a claim that the value is wrong. Its upgrade trigger: capture one `post_tool` payload from a `write_file` call; if `tool_status` is not `'success'`, the finding becomes P1, because three hooks go silent.
- **The port map's completeness was checked and holds.** All 21 rows are present, and the four `not needed` verdicts each name a reason. Only the two `hook` rows in R5-P2-003 omit a loss.
- **The `process_start` and `system_message` upgrade triggers remain open.** Neither was resolved in this iteration; both stay carried forward in the strategy.
- **Prior-finding overlap checked.** None of the three appears in the 29 dispositions. `R2-P2-001--d5b1ccf53ad4` and `R4-P2-001--e3447f5b13ad` were documentation fixes in other files; R5-P2-003 is a different table with a different omission.

## Confirmed-Clean Surfaces

- `.vibe/hooks.toml` — the binding count and event split match the reference doc exactly.
- `guards-and-hooks.md:116-139` — all 21 OpenCode plugins are classified, and each `not needed` verdict names a reason.
- `post-edit-quality.mjs:34-37` and `classifier-injection-screen.mjs:30-33` — both append context rather than denying, so a finding never replaces the tool output the model needs.
- `post-edit-quality.mjs:55` — a file that does not exist after the write is skipped, so a failed write cannot produce findings about content the edit never made.
- `dist-freshness.mjs:20-22,115-117` — the CLI-entry guard keeps the module importable by its test.
- `dist-freshness.mjs:57-66` — the checker runs with a bounded buffer and a 9-second timeout, and a missing `python3` yields an empty string rather than a throw.
- `dist-freshness.mjs:36-44` — the risky-command pattern covers each headless dispatch form the repository documents.
- `classifier-injection-screen.mjs:23-26` — the fetch tool is matched by leaf name, so a namespaced call is recognized.
- `classifier-injection-screen.mjs:41` — a failed fetch is skipped, because its result carries an error message rather than page text.

## Ruled Out

- **A missing binding in `.vibe/hooks.toml`.** The count is 18 and the event split matches the doc.
- **An unclassified OpenCode plugin.** All 21 rows are present.
- **`post-edit-quality` running on a failed write.** The `tool_status` gate at line 45 covers it, and line 55 covers a file that does not exist.
- **`dist-freshness` throwing on a missing `python3`.** `runChecker` returns `String(result.stdout ?? '')`, so a spawn error yields an empty banner.

## Next Focus

- None. This is the fifth and final iteration of the lineage; `maxIterations` is reached and the synthesis phase follows.

Review verdict: CONDITIONAL
