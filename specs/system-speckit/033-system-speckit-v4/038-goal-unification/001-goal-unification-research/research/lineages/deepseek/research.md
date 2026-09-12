---
title: "Research Synthesis: Goal unification — packet goal.md as the single source of goal state"
description: "Decision matrix D1-D7, runtime feasibility, risk register, and migration note for rebuilding the cross-runtime goal hook on top of packet goal.md."
trigger_phrases:
  - "goal unification research"
  - "packet goal single source"
  - "goal hook rebuild decision matrix"
importance_tier: important
contextType: research
generated_by: "fanout lineage deepseek (iterations 1-10, cli-pi deepseek-v4.1-flash)"
stop_reason: "maxIterationsReached"
---

# Research Synthesis: Goal unification (fanout lineage `deepseek`, iterations 1-10)

> Scope: research only. Every claim about current behaviour carries a `file:line` citation that resolves in
> this repository. Claims that are design conclusions rather than readings are marked **CLAIM**. Claims that
> could not be confirmed in-repo are marked **UNKNOWN** or **INFERRED** with what would confirm them.
> Iteration narratives: `iterations/iteration-001.md` … `iteration-010.md`; per-iteration deltas:
> `deltas/iter-001.jsonl` … `iter-010.jsonl`; ledger-backed records: `deep-research-state.jsonl`.

---

## 1. Objective and method

Decide how `.opencode/hooks/goal/` and `.opencode/plugins/opencode-goal.js` should be rebuilt so that a
packet `goal.md` under `specs/` is the single source of goal state — nested when a packet is phased,
singular otherwise — while spec-kit keeps the parent goal current and resends it in chat without
frontmatter.

Ten iterations, one angle each, per the charter's allocation table. Average `newInfoRatio` 0.665, declining
(0.90 → 0.50), with a second-pass rebound at iteration 8 (measured budget arithmetic).

---

## 2. Decision matrix

### D1 — Session-to-packet binding

| Option | Mechanism | Verdict |
|--------|-----------|---------|
| O1-A | Conversational only (Gate-3 answer stays in context) | **Rejected** — lost at compaction; two sessions answer independently; a hook has no packet |
| **O1-B** | **Per-session pointer record: `packetPath` written only by an explicit bind** | **CHOSEN** |
| O1-C | Nearest-packet inference from cwd | **Rejected** — the nested phased case is exactly what the repo's own detector calls `ambiguous_transcript` (`.opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:112`) |
| O1-D | Implicit derivation only when a speckit command mutates | **Rejected as sufficient** — the chat resend is not command-mediated |

- **Why O1-B:** the carrier concept already exists cross-runtime (`lastSpecFolder` in
  `<tmpdir>/speckit-claude-hooks/<projectHash>/<sessionHash>.json`, read by Claude, pi, Codex, and Devin —
  `hooks/claude/session-stop.ts:129`, `hooks/pi/completion-evidence.ts:43`,
  `hooks/codex/completion-evidence-stop.cjs:67`, `hooks/devin/post-compaction.cjs:90`), but it is written by
  the *stop* path, so a fresh session's first turn has none. The goal record is already keyed per session
  (`sha256([workspace, runtime, sessionId])`, `.opencode/hooks/goal/lib/goal-core.cjs:191`), so the packet
  path must arrive from outside the key.
- **Enforcement site:** a bind resolver beside `resolveGoalScope` (`goal-core.cjs:174`); the writer is the
  speckit set step, not a hook.
- **Hard constraint:** ADR-001 — "goal selection must never guess"
  (`specs/hooks/009-goal-isolation/decision-record.md:41`); opaque filenames only (`:43`).

### D2 — Legacy store fate

| Option | Verdict |
|--------|---------|
| O3-A Retire outright | **Rejected** — liveness, locks, telemetry, retention have no home; two writers on one tracked file have no lock |
| **O3-B Demote to a per-session index + telemetry** | **CHOSEN** |
| O3-C Keep objective duplicated | **Rejected** — two authors of one truth; the store's copy silently wins at injection |
| O3-D Liveness into `goal.md` frontmatter | **Rejected** — per-session state in a committed shared file is the removed failure |

- **Why:** the record holds fourteen liveness/telemetry fields and only two content fields
  (`buildNewRecord`, `goal-core.cjs:869`); mutations take a lock with a 10 s timeout and 120 s stale takeover
  (`:48`, `:56`, `:57`, `:524`); the plugin owns retention and rotation
  (`.opencode/plugins/opencode-goal.js:37-39`, `:42`). None of that can live in a git-tracked document.
- **Enforcement site:** the read path beside `readGoalRecordForScope` (`goal-core.cjs:622`); the write path
  at `setGoal` (`:897`).
- **Two key schemes already coexist** (`goal-core.cjs:190-191` vs `opencode-goal.js:358`, `:362`) — the
  documented "two implementations drifting" risk is the status quo, not a hypothesis.

### D3 — Frontmatter-strip contract

| Option | Verdict |
|--------|---------|
| O2-A YAML parse as the boundary | **Rejected** — no parser exists in any goal surface (goal-core, plugin, CLI, cursor adapter), and the frontmatter carries a nested `_memory.continuity` block (`.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:16`) |
| **O2-B Explicit marker slice (anchors)** | **CHOSEN** |
| O2-C Drop to the second `---` only | **Rejected** — ships template scaffolding into chat and consumes the objective preview |
| O2-D Materialized slice file | **Rejected** — two files drift; a stale slice resends superseded criteria |

- **Why:** the template already encodes the boundary — `ANCHOR:directive` … `ANCHOR:log`
  (`goal.md.tmpl:48`, `:99`), phase-only binding inside `IF level:phase` (`:65`) — and the two renderers
  (`goal-core.cjs:383`, `opencode-goal.js:2614`) must both consume the same slice.
- **Refinement from iteration 4/10:** a frontmatter regex *does* exist in the CLI validator
  (`continuity-freshness.ts:17`, with `js-yaml` at `:8`), so the extractor is not new logic — but the goal
  surfaces are CommonJS/ESM-split, so the seam must be explicit (a CJS module both can import), with a
  golden comparison against the validator's splitter.
- **Two slices, not one:** the *durable slice* (body to log) feeds resend/injection/`show`; the *objective
  slice* (pointer + binding sentence + criteria copied verbatim) feeds the runtime objective and is already
  frozen as "never a file body" (`.opencode/commands/speckit/assets/speckit-plan.yaml:172`).

### D4 — Resend and reminder mechanics

| Option | Verdict |
|--------|---------|
| **O4-A Edge trigger on the durable-slice hash, deduped per session, key = packet path + hash** | **CHOSEN** |
| O4-B Turn cadence | **Rejected** — fires with nothing changed |
| O4-C `mtime` | **Rejected** — log appends and git operations are explicit non-triggers |
| O4-D In-file `_memory.continuity` fingerprint | **Rejected** — only `implementation-summary.md` is stamped with a real fingerprint (`continuity-freshness.ts:56`); `goal.md` ships a zero placeholder (`goal.md.tmpl:21`) |
| O4-E Manual only | **Rejected** — this is today: the rule is prose with no implementing code |

- **Why:** the rule is precise about its trigger (anything above the log;
  `goal-set-string-playbook.md:74`), its non-trigger (log entries; `:79`), and the child case (in-phase change
  needs no resend; `:77`). Whole-file or mtime predicates violate the non-trigger.
- **Non-blocking:** the reminder rides the injection path; a missing file yields no reminder and no error —
  matching the pi hook's documented fail-open contract (`.opencode/hooks/goal/pi/goal-context.ts:157`).
- **Cache:** the brief cache must key on the hash (`.opencode/plugins/opencode-goal.js:43`), or a stale entry
  suppresses the resend.

### D5 — Per-runtime feasibility

See §3. **Chosen:** ship pi, opencode, cursor (cursor degrades to injection-only per its own adapter
constraints); defer devin (hook surface exists, command surface does not); Claude Code and Codex keep their
native, host-private goal surfaces, with nesting reached through speckit commands or conversation — which is
the frozen operator constraint, now corroborated by what those surfaces actually are.

### D6 — Budget and truncation

| Option | Verdict |
|--------|---------|
| **O8-A Enforce 4000 on the measured durable slice in the TS validator, with a warming tier** | **CHOSEN** |
| O8-B Two-tier (warn 3000 / error 4000) | Folded into O8-A — the frozen number is the error threshold; the playbook's 3000 becomes advice or retires |
| O8-C Enforce nothing | **Rejected** — a 15,028-byte `goal.md` exists today with no rule reporting it (`specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/spec.md:61`) |
| O8-D Consumer-side check only | **Kept as a second guard** — it is the only check that catches the resend-paste failure |

- **Arithmetic (the reason a two-tier rule matters):** objective accepted up to 4000 (`goal-core.cjs:60`),
  prompt 4000 (`:61`), prompt Objective section `max(240, min(1200, 4000-1900)) = 1200` (`:343`, `:67`),
  injected `objective:` line `min(600, floor(4800*0.12)) = 576` (`:370`, `:68`), block 4800 (`:62`). A legal
  4000-char slice is therefore **never** injected in full; the criteria tail is what gets cut first.
- **Enforcement site:** `spec-doc-structure.ts`, which already owns `goal.md` specifics — mandatory
  continuity block (`:207`) and required anchors (`:229`). The old shell checker is gone; the reference to a
  budget rule in `validation-rules.md` (`goal-set-string-playbook.md:137`) is dangling.
- **Cut order reusable verbatim:** log → restated child detail → decision prose → criterion wording never
  count → split the packet (`goal-set-string-playbook.md:57`, `:63`, `:65`).

### D7 — Isolation reconciliation (and authority)

| Option | Verdict |
|--------|---------|
| **Split: shared directive, per-session selection + liveness + telemetry** | **CHOSEN** |
| Per-session copies of the directive | **Rejected** — re-creates drift |
| Inference-based binding | **Rejected** — ADR-001 forbids guessing |
| Auto-rewrite of durable sections (O7-B) | **Rejected** — makes the operator's copy meaningless and triggers a resend per edit |
| Operator-only durable writes (O7-C) | **Rejected** — contradicts the auto-update requirement |

- **What was actually removed:** a process-global singleton `active-goal.json` where the last writer replaced
  every session's record (`specs/hooks/009-goal-isolation/spec.md:48`, `:77`, `:79`). None of that forbids
  sharing *content*; it forbids implicit selection and shared per-session facts.
- **Authority ladder (chosen):** auto-update may touch only the log and `_memory.continuity` bookkeeping;
  durable-slice changes are command-mediated and operator-ratified; a child change that alters a parent
  decision or criterion is applied to the parent first and the parent is resent
  (`goal-set-string-playbook.md:77`, `goal.md.tmpl:60`). The existing per-command tool whitelists are the
  enforcement precedent: plan/implement/complete may set (`opencode_goal`), resume may only read
  (`opencode_goal_status`) — `.opencode/commands/speckit/resume.md:4`.
- **Why now:** the resync rule is declared "agent behavior, not tooling"
  (`specs/system-speckit/033-system-speckit-v4/029-goal-operator-resync-rule/spec.md:72`); the unified design
  is what turns it into tooling, and the write-scope split is what keeps it safe.

---

## 3. Runtime feasibility table

| Runtime | Identity source | Command surface | Hook surface | Injection cap | Verdict |
|---------|-----------------|-----------------|--------------|---------------|---------|
| **pi** | `ctx.sessionManager.getSessionId()`, `ctx.cwd` (`.opencode/hooks/goal/pi/goal-context.ts:70`) | `/goal-pi` (`:178`) + `bin/goal.cjs` scope flags | `input`, `session_start`, `turn_end` (`.opencode/hooks/goal/README.md:96`) | core-enforced 4800 (`goal-core.cjs:62`); host cap **UNKNOWN** | **ship** |
| **opencode** | `ctx.sessionID`/`properties.sessionID` (`.opencode/plugins/opencode-goal.js:334`), `ctx.directory` (`:281`) | native plugin tools + `/goal-opencode` | plugin lifecycle + prompt transform | 4000/4000/4800 (`:29-31`) | **ship** |
| **cursor** | `session_id` → `conversation_id`, `workspace_roots[0]` (`.opencode/hooks/goal/README.md:99`) | `.cursor/commands/goal-cursor.md` (refuses without identity) | `sessionStart` only | `agent_message`; host cap **UNKNOWN** | **ship, degraded** (no refresh, no management) |
| **devin** | hook payload `session_id` (`.opencode/skills/system-spec-kit/runtime/hooks/devin/README.md:42`) | **none found** | `SessionStart`, `UserPromptSubmit` (`.devin/hooks.v1.json`) | **UNKNOWN** | **defer** |
| **claude-code** | host-private: `~/.claude/projects/<project>/memory/goal_*.md` with `originSessionId` (44 such files present) | no `/goal` command; native memory goal | `.claude/hooks/session-prime.js`, `session-stop.js` | **UNKNOWN** | **defer to native**; nesting via speckit/conversation |
| **codex** | host-private `~/.codex/goals_1.sqlite` (+ `sqlite/` copy, WAL/SHM) | `~/.codex/prompts/goal_opencode.md` | `.codex/hooks/completion-evidence-stop.cjs` | **UNKNOWN** | **defer to native**; nesting via speckit/conversation |

**UNKNOWN resolution path:** host injection caps for pi/cursor/devin/claude/codex are not in this repo; the
design must therefore treat the core's own 4800 as the only enforced ceiling and make the slice fit inside
the *smallest* known cap (576-char objective preview) before assuming any host tolerance.

**Devin note:** the charter's frozen "commands ship for devin" cannot be satisfied from this repo's current
state — §009 phase 6 removed the goal adapter and preserved unrelated Devin support byte-unchanged
(`specs/hooks/009-goal-isolation/spec.md:150`,
`.../006-opencode-goal-optimization-and-devin-removal/spec.md:156`).

---

## 4. The unified design (one page)

```text
packet goal.md  ──(extractor: frontmatter split → anchor slice, IF level:phase resolved)
                    │
                    ├── durableSliceHash = sha256(normalize(slice))
                    │
                    ├──► CHAT RESEND  (edge trigger, key = packetPath + hash, pointer first line)
                    ├──► INJECTION    (goal_prompt ← slice projection ≤ block budget; objective: line = operator copy)
                    ├──► OBJECTIVE    (pointer + binding + criteria bullets; never a file body)
                    └──► CLI SHOW     (same projection as injection)

per-session record (store, demoted but alive)
  identity | packetPath · boundAt · boundBy | objective (operator copy) | lastResentSliceHash | status
  telemetry | .locks/ | .archive/
```

**Invariants it preserves** (each traceable to a requirement): no injection without session identity
(REQ-001, `009/spec.md:136`); no auto-claiming of legacy state (REQ-006, `:141`); no fallback to the
singleton (SC-004, `:164`); per-session liveness and locks stay per-session; selection never guessed.

---

## 5. Risk register

| # | Risk | Evidence | Mitigation (enforcement site) |
|---|------|----------|------------------------------|
| R1 | **Shared-state regression** — a packet-shared file re-introduces what 009 removed | `009/spec.md:48`; `decision-record.md:41` | Only *content* is shared; selection, liveness, telemetry, locks stay per-session (D1/D2/D7) |
| R2 | **Concurrent writes** — two sessions editing one directive | iteration 9, F3 | Directive edits are command-mediated and ratified; the log is the only append area and never triggers a resend; git remains the conflict layer |
| R3 | **Two implementations drifting** — plugin does not import the core | `.opencode/hooks/goal/README.md:31`; `goal-core.cjs:383` vs `opencode-goal.js:2614` | One shared slice/hash module + golden test against the validator's splitter; or reduce the plugin to a thin adapter (open decision) |
| R4 | **Resend spam** — repeat or spurious reminders | iteration 4; `goal-set-string-playbook.md:79` | Edge trigger on the slice hash, dedup key includes the packet path, log excluded, never write during a resend |
| R5 | **Frontmatter leak** — `_memory.continuity` reaching chat or the model | `goal.md.tmpl:16`; `goal-core.cjs:370` | Single extractor + seven-assertion leak test (iteration 10, F5) |
| R6 | **Silent truncation** — the criteria tail is cut with no signal | `goal.md.tmpl:39`; `goal-core.cjs:370` | Validator budget rule at 4000 + the projection always putting the pointer first + consumer-side length check on set |
| R7 | **Dangling pointer** — packet renamed/deleted mid-session | iteration 9, F5 | `unbound` state, no injection, no fallback; diagnostic via the CLI |
| R8 | **Stale dedup** — a hash from one packet suppressing another | iteration 9, F4 | Packet-scoped dedup key |
| R9 | **Doc-rule drift** — rules citing files that no longer hold them | `goal-set-string-playbook.md:137` (budget rule absent from `validation-rules.md`); charter's `injection-contract.md` path (real file one level up) | Fix citations in the implementation packet; the charter path is `.opencode/hooks/injection-contract.md` |
| R10 | **Naming collision** — continuity already has a `goal` facet | `.opencode/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:46`, `:211` | Never reuse the word as the channel name; name the new artifact explicitly (e.g. `goalPacketPath`) |

---

## 6. Migration note

| Existing artifact | Behaviour under the chosen design |
|-------------------|-----------------------------------|
| Scoped records `<scopeKey>.json` (`goal-core.cjs:203`) | Read unchanged. Missing `packetPath` → no packet content injected until an explicit bind. **No rekey** |
| Records with an `objective` and no packet | Stay valid operator copies; the next bind attaches a packet; nothing is auto-adopted (REQ-006 semantics) |
| Legacy singleton `active-goal.json` (`goal-core.cjs:45`, path `:218`) | Unchanged tooling: `inspectLegacyGoal` (`:672`), `quarantineLegacySnapshot` (`:746`), `migrateLegacyGoal` (`:774`, scope-bound), `archiveLegacyGoal` (`:839`, scope-free). `legacy-inspect`/`legacy-archive` remain scope-free; `legacy-migrate` stays scope-bound (`bin/goal.cjs:311`) |
| Archived snapshots (`.archive/<scopeKey>/`, `.archive/.legacy/`, `LEGACY_ARCHIVE_SUBDIR` `:47`) | Untouched — history, not state |
| Plugin store (hex session keys `opencode-goal.js:362`, sha256 keys `:358`) | Keys unchanged; the record gains the pointer and dedup fields once the shared module lands (or the plugin is thinned) |
| `goal.md` files with no resync paragraph | Unaffected; the playbook binds the agent regardless (`029/spec.md:116`) |
| `goal.md` files over the budget | New validator rule reports the overrun; the file is not rewritten by tooling |

---

## 7. Confirmed vs inferred vs unknown

**Confirmed by reading the repo:** every `file:line` citation in this document; the 44 Claude
`goal_*.md` files and the Codex goals SQLite are filesystem facts.

**Inferred (state what would confirm):** the per-session record field set (confirm by implementing one
schema and round-tripping it through `setGoal`); the leak-test matrix (confirm by the tests themselves);
host injection caps (confirm with each runtime's documentation or by observing truncation in a live session).

**Unknown:** host caps for pi/cursor/devin/claude/codex; whether the plugin can import a CJS slice module
without a build step (confirm by attempting the import in the plugin's runtime); whether a live packet's
`goal.md` currently exceeds 4000 (this lineage's charter packet was not measured — measuring any packet file
is a read-only action for the implementation packet).

**Errata recorded:** iteration 3 cited five plugin constants one line low (corrected in `deltas/iter-004.jsonl`).

---

## 8. What this lineage did not do

No code edits, no template edits, no validator changes, no writes outside this lineage directory. The
`IF level:phase` trap, the CommonJS/ESM seam, and the host-cap unknowns are handed to the successor lineage
and to the implementation packet as explicit follow-ups.
