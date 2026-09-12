# Iteration 4: A4 — Resend trigger predicate, cadence, dedup, non-blocking semantics (D4)

## Focus

Decide what may trigger a chat resend, at what cadence, how duplicates are suppressed, and how the reminder
stays non-blocking. Angle A4 / decision D4 (charter `../../deep-research-strategy.md`:53).

## Actions Taken

1. Read the playbook's §4 cut order and §5 resync rule verbatim.
2. Searched the whole runtime for any code implementing resend/resync (negative result).
3. Read the existing continuity-freshness validator: its frontmatter regex, staleness threshold, and
   fingerprint helper.
4. Read the plugin's cache/cooldown constants as the existing dedup precedent.

## Findings

### F0. Errata from iteration 3 (recorded, not silently fixed)

Individual plugin constants were cited one line low: retention is
`DEFAULT_ARCHIVE_RETENTION_DAYS` at `[SOURCE: .opencode/plugins/opencode-goal.js:37]`,
`DEFAULT_ACTIVE_RETENTION_DAYS` at `[SOURCE: .../opencode-goal.js:38]`,
`DEFAULT_SWEEP_INTERVAL_MS` at `[SOURCE: .../opencode-goal.js:39]`, JSONL cap at
`[SOURCE: .../opencode-goal.js:42]`, brief cache at `[SOURCE: .../opencode-goal.js:43]`. The iteration-3
narrative's `:41` for the JSONL cap is wrong; the substance (retention/rotation is plugin-owned) is
unaffected because the README independently documents it (`[SOURCE: .opencode/skills/.state/goal/README.md:36]`).

### F1. The resend rule is prose only — no code path implements it

A search for `resend`/`resync` across `.opencode` (excluding markdown) returns only trigger-index hits:
the rule exists as the packet `029-goal-operator-resync-rule` and as playbook/template prose. The rule:
resend the full text of the parent `goal.md` **unprompted** whenever anything above the log changes
(`[SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:74]`); a child
change that alters a parent decision or criterion is applied to the parent first, then the parent is
resent, while a child change inside its own phase needs no resend
(`[SOURCE: .../goal-set-string-playbook.md:77]`); "Log entries never trigger a resend"
(`[SOURCE: .../goal-set-string-playbook.md:79]`). The cut order when the slice will not fit is log first,
then restated child detail, then decision prose, and "criterion wording, never criterion count"
(`[SOURCE: .../goal-set-string-playbook.md:57]`, `[SOURCE: .../goal-set-string-playbook.md:63]`).

F1's designer-facing consequence: the trigger predicate is *specified in prose and implemented nowhere*,
so D4 is a new mechanism, not a repair.

### F2. A frontmatter splitter and a content fingerprint already exist in the CLI layer

`FRONTMATTER_RE` (`[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:17]`)
tolerates a BOM and leading HTML comments before `---`, and `buildContinuityFingerprint(content)` computes
"the sha256 continuity fingerprint of normalized content"
(`[SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:648]`, exported
through `@spec-kit/runtime/api`). This refines iteration 2: the *strip* has a reusable precedent in the
TS/CLI layer even though the hook surfaces have none. It does **not** make whole-file hashing a viable
predicate (F3).

### F3. Whole-file hashing as the predicate violates the rule the predicate exists to serve

`buildContinuityFingerprint` hashes normalized *content*, so a log append — explicitly a non-trigger
(`playbook.md:79`) — changes it. The same objection kills mtime: every log edit and every git checkout
bumps it. The predicate must therefore hash **the durable slice only** (frontmatter and log excluded),
which is the same slice D3 defines. D3 and D4 are one pipeline, not two features.

### F4. The continuity fingerprint field in `goal.md` cannot carry the dedup state

`continuity-freshness.ts` documents that a completion claim binds to exactly one attestation point —
`implementation-summary.md`'s `_memory.continuity.session_dedup.fingerprint` — "because that is the only
document the continuity writer ever stamps with a real fingerprint"
(`[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:56]`), with
`zero_fingerprint` and `missing_fingerprint` as first-class codes
(`[SOURCE: .../continuity-freshness.ts:44]`). The template's goal.md ships a zero placeholder
(`[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:21]`). Dedup state therefore
belongs in the per-session carrier (iteration 1's pointer record, iteration 3's demoted store), not in the
shared file.

### F5. Dedup and non-blocking precedents already exist in the plugin and the pi hook

- Continuation cooldown `DEFAULT_CONTINUATION_COOLDOWN_MS = 1500`
  (`[SOURCE: .opencode/plugins/opencode-goal.js:35]`), wall clock `30 * 60 * 1000`
  (`[SOURCE: .../opencode-goal.js:36]`), auto-turn cap 8 (`[SOURCE: .../opencode-goal.js:34]`), and a
  brief cache keyed per session (512 entries, `[SOURCE: .../opencode-goal.js:43]`) — the cache key must
  grow the slice hash under any file-backed design, or a resend will be suppressed by a stale cache entry.
- Quiet reasons exist as a set (`QUIET_CONTINUATION_REASONS`, `[SOURCE: .../opencode-goal.js:68]`).
- The pi hook's three lifecycle points fail open on any error "so a goal-state bug can never block a Pi
  turn or session" (`[SOURCE: .opencode/hooks/goal/pi/goal-context.ts:157]`) — the non-blocking contract
  D4 needs is already the house rule.
- The CLI's continuity staleness threshold is 10 minutes
  (`[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:16]`) — the
  only existing time-based freshness cadence, and it is a *warning* threshold, not a resend timer.

## Trigger-predicate options (D4)

| Option | Predicate | Cost today | What fails | Enforcement site |
|--------|-----------|-----------|------------|------------------|
| **O4-A** | Edge-triggered **durable-slice hash** vs a per-session `lastSupersededHash` | One hash per evaluation; both D3 slice and D4 state already exist | Must never write on resend (a write that bumped the hash would loop); needs the slice extractor to be deterministic | evaluation at injection (`renderGoalBrief` path) and at command time; state in the per-session record |
| **O4-B** | Turn cadence (every N turns) | Trivial | Fires with nothing changed (spam) and misses a change made at turn N+1; contradicts "unprompted but on change" | n/a |
| **O4-C** | `mtime` newer than last-seen | Trivial | Log appends and git operations bump mtime — the rule's explicit non-trigger | n/a |
| **O4-D** | Compare `_memory.continuity.fingerprint` in the file | No hashing | Not stamped for goal.md (F4): zero placeholder → either never fires or always fires | n/a |
| **O4-E** | Manual only (agent decides) | Zero mechanism | This is today's state; the rule is unimplemented and the operator's copy drifts | n/a |

**Cadence/dedup for the chosen option:** emit once per distinct durable-slice hash per session (edge
trigger, no timer); suppress re-emission while the hash is unchanged; a change made in another session or
by a command in the same session must invalidate the cache entry (hash is part of the cache key).
**Non-blocking:** the reminder rides the existing injection path, never a blocking prompt; a missing
`goal.md` yields no reminder, not an error — matching the pi hook's fail-open contract.

## Assessment

- `newInfoRatio`: 0.68 — the resend rule being unimplemented, the existing frontmatter regex/fingerprint
  helper, the "only implementation-summary is stamped" attestation rule, and the cache-key implication are
  new; the rule's wording and the plugin constants were in Known Context.
- Confidence: high on F1-F5; F0 is a self-audit. The claim "trigger predicate is implemented nowhere" rests
  on a repo-wide text search, recorded as a strong negative rather than a proof.
- One sentence: the resend must be edge-triggered on the durable-slice hash (never mtime, never the
  in-file fingerprint), dedup state lives per session, and it rides the non-blocking injection path.

## Reflection

- What worked: reading the *validator* layer instead of the hook layer — it already contains both a
  frontmatter regex and a content fingerprint, which turned D3's "no parser" finding into a narrower,
  correct statement (no parser *in the goal surfaces*).
- What failed: my first predicate candidate (reuse the continuity fingerprint) died on the attestation
  comment inside the validator itself — a good example of the repo documenting its own limits.
- Ruled out: mtime (O4-C), turn cadence (O4-B), in-file fingerprint (O4-D), manual-only (O4-E).

## Sources Consulted

- `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` (57, 63, 74, 77, 79)
- `.opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts` (16, 17, 44, 56)
- `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` (204, 229, 648)
- `.opencode/plugins/opencode-goal.js` (34-39, 42, 43, 68)
- `.opencode/hooks/goal/pi/goal-context.ts` (157)
- `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` (21)

## Recommended Next Focus

Iteration 5 (A5 / KQ5 / D5): runtime-by-runtime command and hook surface plus session identity, including
whether Claude Code and Codex expose a native goal command.
