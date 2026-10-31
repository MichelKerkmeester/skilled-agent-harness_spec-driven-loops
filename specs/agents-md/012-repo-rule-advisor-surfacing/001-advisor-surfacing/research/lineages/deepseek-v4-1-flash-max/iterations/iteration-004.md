# Iteration 004 — Candidates (c) and (d), portability, and the cross-candidate comparison

- Status: complete
- newInfoRatio: 0.7 (candidate (c) mechanics are new; (d) and the comparison consolidate earlier findings)
- Focus: The action-keyed PreToolUse advisory, the no-new-surface case, the portability comparison across all candidates, and the evidence matrix that synthesis will compile.

---

## 1. CANDIDATE (C): ACTION-KEYED PreToolUse ADVISORY

### What it would emit
On a matched tool call, an advisory naming the rule file(s) the action triggers, e.g. "REPO RULES: this action matches [row]; load [file] before proceeding." — delivered as ordinary tool-time context (`additionalContext` on Claude/Cursor/Devin/Codex/Pi; a bounded system-transform append on OpenCode, per the tool-time channel table, `injection-contract.md:143-172`). It automates Gate 5's step 2 ("match the action against the trigger table") at the moment the action exists.

### The precedent proves the delivery machinery, not the matching
`spec-gate-enforce.mjs` is structurally identical: it fires on `Write|Edit` (`settings.json:98-102`), classifies, and delivers a once-per-session notice with re-arm at boundaries. The shared core carries the pattern: `MUTATING_TOOLS`/`DENY_CAPABLE_TOOLS` tool-name sets (`spec-gate-core.mjs:140-142`), `recordGate3NoticeDelivered`/`rearmGate3NoticeDelivery`/`shouldDeliverGate3Deferral` (`:404-452`), lifecycle epochs (`:296-314`), kill switches (`:80-82`), child-session exemption (`:100`). A rules advisory would reuse this shape: tool-name matcher → action classification → deliver-once notice → re-arm.
What does NOT exist today is the mapping from tool-call data to `REPO RULES.md` rows. The trigger table's rows are natural-language action descriptions (`REPO RULES.md:40-52`); a classifier would heuristically map e.g. `Bash` command shapes (force-push, delete, migrate) and `Write|Edit` shapes (new file, dependency add, config/auth touch) onto rows. Feasibility is high for delivery, medium for matching quality.

### Silence condition
No row match → nothing. Plus once-per-session delivery per matched rule with re-arm on lifecycle boundaries — the spec-gate template (`injection-contract.md:79-80`: "once per session — never appended to a write-intent turn"; `recordGate3NoticeDelivered` persists the marker).

### Per-tool-call cost (measured from the wiring)
Each wired hook spawns a `node` process per matched event (the `settings.json` command pattern, e.g. `:43-62` already runs four adapters on `Bash`). The advisory text itself is a line naming 1-3 files (~100-200 bytes) delivered only on first match per session per rule. Honest basis per 022's rule (F7): the delivery frequency is bounded by the dedup design (first matching action per session per rule + boundaries); the real rate must be read from the hook's log after build — it cannot be pre-measured from a log that does not exist yet.

### Matching semantics
**Action** — the router's own key (`REPO RULES.md:12`, `AGENTS.md:96`). The only candidate of the four that matches the action about to be taken rather than the prompt or a standing reminder. It is also the only candidate that addresses later-in-session actions: rules loaded at first write are never re-matched unless the model does it unprompted; a per-action advisory re-matches mechanically.

### Portability
The core lives once under `.skilled/hooks/` and travels by symlink into siblings (F9); it reads the repo-root `REPO RULES.md` of whichever repo it fires in (per-repo router, `REPO RULES.md:3-6`). The wiring is per-runtime: `.claude/settings.json` is one of six adapters (the contract's channel table shows tool-time injection on every runtime, `injection-contract.md:143-202`), so cost scales with runtime count, exactly as spec-gate and dispatch-lint already pay.

## 2. CANDIDATE (D): NO NEW SURFACE

### The status-quo defense
- Gate 5 plus the §8 static reply-rules line already cover the two binding moments the system trusts: first write (rules load) and replies (five rules named in the always-loaded doc, `AGENTS.md:261`).
- Every candidate carries costs: (a) adds bytes to a capsule whose two predecessors were retired for restating dispositions (F6/F18); (b) reverses a documented decision and adds rule frontmatter to a fail-closed artifact (F25/F26); (c) adds a classifier whose false positives surface rules the model does not need and whose per-tool-call process spawn joins five existing PreToolUse hooks.
- 022 refused eighteen prompt-time candidates under a bar this corpus's rules do not clear as dispositions (F6).

### What would flip it
A measured miss: a log or reproduction showing a rule that should have bound an action did not, with cost. Today's evidence base contains the structural gap (read-only turns, unprompted re-consultation, `spec.md` problem statement; `AGENTS.md:93-94`) but no measured miss. Under 022's own standard — "an event's frequency must be read from the log, never reasoned about" (F7) — the absence of a measured miss is the honest state, and it is also the reason (d) cannot be dismissed: none of the candidates has a measured win either. The deciding evidence in this packet is structural fit (action matching, gate enforcement), not frequency.

### Evidence against (d)
The three structural gaps are real and named by the packet's own problem statement: Gate 5 fires once per session at first write; read-only turns never load rules; later actions depend on unprompted re-consultation. (c) addresses the third mechanically and the first by construction.

## 3. CROSS-CANDIDATE COMPARISON

| Axis | (a) advisor pointer | (b) trigger-index root | (c) PreToolUse advisory | (d) no new surface |
|---|---|---|---|---|
| Emits | Fixed pointer line in the Directives capsule | Lookup rows surfacing rule files as context candidates | Row-matched advisory naming rule file(s) to load | Nothing |
| Silence | Dedup suppression; no-brief conditions; unconditional (no repo signal) | Exit 1 no-hit; scoring-only drops score-0 | No row match; once-per-session dedup | Always |
| Cost | +162B ≈ +40 tokens on full-delivery turns; 0 deduped; +0 for build (3 sites + mirror + tests) | Est. +10-25KB index (0.76% phrases); sub-ms/lookup; rule files read on hits | Process spawn per matched event + ~100-200B advisory; classifier build | 0 |
| Matching | None (standing reminder; prompt-time) | Prompt topic (empirically 0.880 when vocabulary overlaps) | **Action** (tool-call data; the router's key) | n/a |
| Portability | Hooks shared by symlink; pointer must say `REPO RULES.md` | Shared index via symlink; root-name trade-off; sibling-local rules uncovered | Core shared; per-runtime wiring; reads per-repo router | n/a |
| 022 bar | Fails (disposition restatement; no gate-enforced prohibition) | Not an injection; but the decision-against stands and must be overturned | Closest fit (automates a gate; names load targets, not dispositions) | n/a |
| Prior-work status | Not previously decided | Explicitly decided against (`retrieval-conventions.md:284`) | Machinery precedented; no prior decision on this use | Standing default |

**Verdict inputs for synthesis.** Only (c) matches on action, which is the router's own contract; (a) fails the corpus's own admission bar; (b) reverses a documented decision and matches topic, not action; (d) has no measured miss to defend the status quo and no measured win for the alternatives. The strongest in-repo precedent chain (spec-gate: tool-name matcher → classify → deliver-once → re-arm) supports (c) as buildable; its open risk is classifier quality, not delivery.

## 4. PORTABILITY SUMMARY (all candidates)

- All three candidate surfaces would live in `.skilled/` and travel to siblings by symlink (F9).
- (a) and (c) read the per-repo router at `REPO RULES.md`; both survive the sibling's layout.
- (b) reads a shared committed index; sibling lookups resolve through the shared `.skilled` symlink; the sibling's 3 local rules are outside any static root (F24).
- The corpus path itself must never be embedded in emitted text (F17); only the router is portable.

## 5. RULED OUT / CONSTRAINTS RECORDED

- A row-matching classifier is the new work in (c); nothing in the repo maps tool calls to trigger rows today (checked: no such module exists; `spec-gate` classifies spec-folder intent, not rule rows).
- No candidate grows the rule set; 010's constraint (F10) is respected by all four.

## 6. NEXT FOCUS

Phase synthesis: compile `research.md` with the verdict, silence conditions, per-turn costs, ruled-out directions, convergence report, and the citations index; refresh registry/strategy/dashboard; emit the resource map; append the terminal synthesis event with `stopReason: maxIterationsReached`.
