# Iteration Evidence Log

Research phase: governor-hook usefulness + pi-only subagent dispatch directive.
Protocol: 10 iterations, 3 tracks, no early convergence (spec REQ-001/REQ-002).
All iterations read-only; none modified repo files.

| # | Track | Model / Route | Iteration focus | Verdict RQ1 | Verdict RQ2 |
|---|-------|---------------|-----------------|-------------|-------------|
| A1 | A | GPT-5.6 Luna max / headless pi (native runtime; pi-subagents tool unavailable in parent session) | Capsule vs doctrine vs AGENTS.md overlap | UPDATE (keep thermostat; bridge fallback parity) | Directive draft; inject at prompt-advisor.ts:24-52; advisory not enforcement |
| A2 | A | GPT-5.6 Luna max / headless pi | Injection chain trace (which hook fires per turn) | KEEP + UPDATE (projection of AGENTS.md) | Directive wording v2; unconditional append after context extraction; pi bypasses bridge (imports compiled Claude hook) |
| A3 | A | GPT-5.6 Luna max / headless pi | Proof-over-appearance overlap with Terminal Discipline | KEEP + parity (bridge fallback omits proof) | Sibling extension option proposed (subagent-dispatch-directive.ts); TARGET/SOLVE FAST labels intentionally removed from capsule |
| A4 | A | GPT-5.6 Luna max / headless pi | pi-subagents plugin dispatch surface | KEEP + narrow update | Directive v3 (MUST language); children must not orchestrate; model-visible routing, not hard enforcement |
| A5 | A | GPT-5.6 Luna max / headless pi | Final synthesis of strongest verdict | UPDATE (keep thermostat; fix bridge fallback parity) | Final draft with subagent_wait/intercom; sibling extension `.pi/extensions/pi-subagents-directive.ts`; subagent-blind recursion insight |
| B1 | B | GLM 5.2 (high) / cli-devin (`--model glm-5-2`, accept-edits) | Independent verdict | KEEP (no update — complementary tiers; capsule survives compaction) | Directive wording v4; pi-only extension on input; soft default; preload still applies post-override |
| B2 | B | GLM 5.2 (high) / cli-devin | Directive necessity + wording vs plugin surface | KEEP (sync only if §1 wording drifts) | NEEDED — AGENTS.md §8 omits pi; fable model policy is Claude syntax; advisor recommendations are signals, NOT user requests |
| B3 | B | GLM 5.2 (high) / cli-devin | Guardrail/override stress test (Gate 2 conflict, preload interplay, edge cases) | KEEP (3 load-bearing reasons incl. subagent-blindness + operator visibility) | Soft-default-as-hard-block; skill-invocation vs cli-execution separation dissolves the conflict |
| C1 | C | Grok 4.5 (cursor-grok-4.5-high; "Max" tier substituted per cli-cursor allowlist) / cli-cursor (`--mode ask`) | Independent verdict + light sync check | KEEP (+ light wording sync; injection-contract.md:50-58 stale "Fable-5") | Directive wording v5 (HARD label); pi input transform; pi uniquely operator-visible ([MSG]) |
| C2 | C | Grok 4.5 (cursor-grok-4.5-high) / cli-cursor (`--mode ask`) | Adversarial review of directive design | KEEP (thermostat; replace would lose compaction survival) | Capsule alone too weak — enforce at `tool_call` reusing DISPATCH_SHAPES as pi-default deny; override = machine-checkable cli-* substring |

## Route notes

- Track A dispatched via headless `pi -p --model openai-codex/gpt-5.6-luna --thinking max` (native pi runtime). The pi-subagents `subagent(...)` tool was unavailable in the parent session (tool dropped from the harness mid-session), so the pi-native dispatch replaced plugin-based dispatch; model and thinking level unchanged. Two runs required retry after a 420s hang (900s timeout used thereafter; exit 0).
- Track B: `devin -p` with `--permission-mode auto` rejected read tools in non-interactive mode; retried with `accept-edits` per cli-devin skill (allowed without escalation). exit 0 all three.
- Track C: `cursor-agent -p --mode ask` (read-only per cli-cursor skill) with `cursor-grok-4.5-high`. User said "Grok 4.5 Max"; the cli-cursor enforced allowlist has no `max` id — `cursor-grok-4.5-high` is the documented substitution (per skill rule: never silently substitute; this is the recorded deviation).
