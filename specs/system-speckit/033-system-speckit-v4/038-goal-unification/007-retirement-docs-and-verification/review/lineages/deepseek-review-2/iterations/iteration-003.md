---
iteration: 3
focus: "traceability — the speckit YAML packet_goal blocks as executable instructions, and the Devin adapter chain"
dimensions: [traceability, correctness]
started_at: "2026-09-11T11:06:00Z"
status: complete
---

# Iteration 003 — traceability: YAML instructions and the Devin hook chain

## Scope

The review scope names "the speckit YAML `packet_goal` blocks as executable instructions" and "the devin adapter". This iteration reads the YAML blocks as if a fresh executor follows them literally, checks each runtime row against the surface it names, and reads `.devin/hooks.v1.json` against both Devin adapters that share one event.

## Findings

### F104 — P2 — The speckit YAML sanctions a direct table-row append, the one write path the core serializes and guards

**Dimension**: traceability | **Bears on**: ADR-004 and the hook README's log contract

**Evidence** (read at the cited lines):

- The identical instruction appears in three command contracts: `.opencode/commands/speckit/assets/speckit-plan.yaml:195`, `.opencode/commands/speckit/assets/speckit-implement.yaml:160`, `.opencode/commands/speckit/assets/speckit-complete.yaml:253` — "…through the goal command's log action **or a direct table-row append**; never into the directive."
- The core's log action is the only path that takes the per-packet lock and re-checks the durable slice: `.opencode/hooks/goal/lib/goal-core.cjs:1050` (lock) and `:1069-1073` (refuse a write that changes the durable slice). `.opencode/hooks/goal/README.md:60` states the same contract ("appends one row … under a per-packet lock and refuses any write that would alter the durable slice").
- The primary runtime exposes no log action at all, so on OpenCode the sanctioned direct append is the *only* path: `.opencode/plugins/opencode-goal.js:168` — `GOAL_ACTIONS` contains `set, bind, resent, packet, show, clear, complete, pause, history, resume, doctor, health` and no `log` or `unbind`. The `/goal-opencode` router mirrors that list (`.opencode/commands/goal-opencode.md:3,34`).
- The pass-1 follow-up list recorded the missing plugin `log` (F007) as a known limitation, but the YAML was left instructing the unlocked alternative, so the two documents disagree about what a safe append is.

**Impact**: an agent following the YAML literally writes a table row with no lock and no guard, races a CLI `log` append from another session (the failure F101 reproduces), and can leave a file whose durable slice moved without the refusal that exists to catch it. Trigger requires following the YAML's second option on a runtime without the first; P2.

**Recommendation**: drop the direct-append clause, or scope it to "when the goal command exposes no log action, and edit only below the log anchor". Report only; no fix in this review.

### F107 — P2 — Two Devin hooks write the same `additionalContext` field on `UserPromptSubmit`, and nothing in the repository settles which one survives

**Dimension**: traceability | **Bears on**: ADR-005 (Devin regains an injection-only adapter)

**Evidence** (read at the cited lines):

- `.devin/hooks.v1.json:50` runs `spec-gate-classify.mjs`, and `:55` runs `goal-inject.mjs`, in the same `UserPromptSubmit` chain (goal-inject is also registered on `SessionStart` at `:33`).
- `spec-gate-classify.mjs:19-21` emits `hookSpecificOutput.additionalContext = question`.
- `goal-inject.mjs:70-74` emits `hookSpecificOutput.additionalContext = brief + reminder` for `UserPromptSubmit` as well (its own header comment at `:7` records that both events accept that field).
- The repository has no evidence of the host's merge semantics for two hooks writing one envelope key: the goal adapter's fallback brace (`|| { … "{}" }`) and the spec-gate test (`spec-gate-devin.test.mjs`) cover each hook alone, and the packet's own Known Limitations admit "Host injection caps outside OpenCode remain unknown".

**Impact**: if Devin keeps one output per event, the packet goal brief or the spec-gate question is silently dropped on a store the packet claims as a supported goal runtime — the user-visible outcome is the packet's durable slice never reaching the model on Devin while the docs claim it does. This is a host-behavior risk, not a proven drop; P2 with an explicit uncertainty.

**Recommendation**: confirm the host's merge rule with a two-hook smoke test and record the outcome in `goal-plugin.md`'s runtime matrix, or move the goal injection to a hook event the spec gate does not share. Report only; no fix in this review.

## Ruled out

- `--runtime Pi` capitalization rejected by the namespace validator: ruled out. `normalizeRuntimeNamespace` lowercases before matching `RUNTIME_NAMESPACE_PATTERN` (`.opencode/hooks/goal/lib/goal-core.cjs:164-170`), and the `bind` path with explicit scope flags succeeded through the CLI in iteration 1.
- The pi bind command in the YAML being unimplementable: ruled out as read. `bin/goal.cjs` parses `--runtime`, `--session` and `--workspace` from anywhere in argv (`bin/goal.cjs:37-70`, `:72-80`), requires them for scope-bearing actions (`:379-386`), and the fixture bind ran with exactly those flags.
- Resume surfaces binding or mutating a packet: ruled out. `.opencode/commands/speckit/assets/speckit-resume-auto.yaml:36-45` and `speckit-resume-confirm.yaml:45` state "resume never mutates it and never binds" and call no goal tool.
- The Cursor row claiming a management surface: ruled out. `.cursor/commands/goal-cursor.md:2-3` now advertises `packet <packet-path>` only, matching the contract's fail-closed rule at `:17-19`.

## Coverage

| Item | Value |
|---|---|
| Dimensions touched | traceability, correctness |
| Files reviewed | `speckit-plan.yaml:177-200`, `speckit-implement.yaml:142-165`, `speckit-complete.yaml:235-258`, `speckit-resume-auto.yaml:36-45`, `speckit-resume-confirm.yaml:45`, `goal-opencode.md:3,34`, `goal-cursor.md:2-3,17-19`, `bin/goal.cjs:25-100,367-414`, `goal-core.cjs:164-170`, `opencode-goal.js:168`, `.devin/hooks.v1.json:33,50,55`, `devin/goal-inject.mjs:7,70-74`, `spec-gate-classify.mjs:19-21`, `README.md:60` |
| New findings | 2 (P2, P2) |
| Reproduction fidelity | instruction read as written and compared with the executing surface; the pi flag path executed in iteration 1 |

Review verdict: PASS
