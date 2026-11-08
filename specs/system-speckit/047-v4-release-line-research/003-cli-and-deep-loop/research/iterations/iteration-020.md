# Iteration 020 — Executor hard-rule enforcement sweep (cli-codex, cli-cursor, cli-claude-code, cli-devin, cli-pi)

**Focus (iteration 20 of 20, final):** For each of the five non-dsh executor modes, read the hard rules its `hard-rules.json` sidecar and `SKILL.md` declare, then locate the enforcement (or its absence) in `buildLineageCommand` and the per-kind adapters of `fanout-run.cjs`. Separately mark rules that are prompt-only by design from rules the runtime is said to enforce.

## Actions Taken

1. Enumerated the five packets and confirmed every one ships a `hard-rules.json` sidecar beside its `SKILL.md` (only `cli-deepseek-harness` was covered in the earlier sweep).
2. Read all five sidecars. Twelve rules total: codex 2, cursor 2, claude 2, devin 2, pi 4 — nine at `error`, one at `warn` (`non-interactive-permission-mode-risk`), and the availability probes carry a `check` id distinct from the rule id (`command-v-*-required`).
3. Read the spawn layer that decides whether stdin is subject to the `stdin-redirect-required` rule: `hasInput` is `typeof opts.input === 'string'` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2104] and stdio slot 0 is `hasInput ? 'pipe' : 'ignore'` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2114].
4. Read each adapter's `finalizeLineageCommand` payload to see which stdin mechanism it selects: codex `input: prompt` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2342], claude `input: undefined` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2377], cursor `input: undefined` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2713], devin `input: undefined` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2823], pi `input: ''` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2930].
5. Compared the prose-declared dispatch-critical rules in each `SKILL.md` against the same builders.

## Findings

### F1 — drift, P1. The cli-codex `service_tier` ALWAYS rule is conditional in the runtime, so it is skipped on any config without a tier.
`cli-codex/SKILL.md` states "Always pass `-c service_tier="fast"` explicitly — this routes through the fast tier instead of whatever the caller's `~/.codex/config.toml` defaults to" [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:165]. The builder emits the flag only when a tier is present: `if (lineage.serviceTier) { args.push('-c', \`service_tier=${lineage.serviceTier}\`) }` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2335]. The key is absent from the codex sidecar, which carries only `stdin-redirect-required` and `codex-availability-required`. This run's own config carries `"serviceTier": null`, so every codex lineage from it takes the documented-unwanted default path — the exact failure mode the SKILL.md calls out. Confidence: high (both sides read). Verify: `node -e "const c=require('./specs/system-speckit/047-v4-release-line-research/003-cli-and-deep-loop/research/deep-research-config.json');console.log(c.executor.serviceTier)"` and `grep -n 'service_tier=' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`.

### F2 — drift, P1. The cli-devin `--` prompt separator rule exists only in prose; nothing in the runtime inserts it.
`cli-devin/SKILL.md` makes it a dispatch-critical gotcha: "Use `--` before every print-mode prompt — `devin -p -- "list all TODO comments"` prevents the prompt from being parsed as CLI flags. The prompt must follow the separator" [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:243]. The builder composes `const args = ['-p', prompt, '--model', model]` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2807] — the prompt is argv[2] with no separator, and a repo-wide grep for an inserted `'--'` in this file returns no hit. The devin sidecar carries only `stdin-redirect-required` and `devin-availability-required`, so the shared rule engine cannot catch it either. A prompt whose first token starts with `-` is parsed as flags: the rule is stated, unenforced, and unrepresentable in the machine-readable sidecar. Confidence: high. Verify: `grep -c "'--'" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` → 0.

### F3 — improvement, P2. `stdin-redirect-required` is genuinely enforced for all five, but by two different mechanisms, and the rule text only describes one.
The rule's wording in every sidecar is "MUST close/redirect stdin (`</dev/null`)". Two adapters instead pass `input: undefined`, which drives stdio slot 0 to `'ignore'` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2114] — an equivalent close with no literal `</dev/null` anywhere. Codex is the opposite case: it *must* pipe the prompt into stdin via the trailing `-` arg [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2337], so the literal `</dev/null` the rule demands would break the dispatch. Enforcement outcome is correct in all five; the declared rule text is false for two of the three mechanisms. Confidence: high. Verify: `grep -n "input: undefined\|input: prompt,\|input: ''" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`.

### F4 — drift, P2. The single `warn`-severity rule in the five sidecars is forwarded as a flag and never reported.
`non-interactive-permission-mode-risk` warns that `claude -p` with acceptEdits, no TTY and a Bash-heavy prompt can deadlock on an unanswerable shell-permission prompt, and prescribes `--dangerously-skip-permissions`. The claude builder forwards `--permission-mode resolvedPermission` and never adds the bypass (the three `--dangerously-skip-permissions` sites in this file belong to the native and OpenCode adapters) [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2361]. No warning event, stderr note or lineage event records that the risk was taken, so an operator cannot tell a deadlocked claude leaf from a slow one — the same indistinguishable-hang class `stdin-redirect-required` exists to eliminate. Enforced-rule count for the five packets: 11 of 12 (this is the one), matching the 12-of-13 result for `cli-deepseek-harness`. Confidence: medium-high (absence of a signal is harder to prove than presence of a check).

### F5 — over-engineering / extension, P2. The dispatch rule set is triplicated with no parity check, and the two uncovered copies are where the defects live.
A rule can exist as (a) a `hard-rules.json` entry the shared engine evaluates [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/hard-rules.json:1], (b) a `SKILL.md` ALWAYS/gotcha line, or (c) a hand-coded branch in a builder. F1 and F2 are both cases where (b) exists and (a) and (c) do not; F4 is where (a) exists but (c) is a bare flag forward with no report. What breaks if the sidecar is removed: nothing in the fan-out path — the builder never reads it, so the sidecar's only consumer is the hook preflight. The extension is therefore not a new file but a parity gate: a test that asserts every `hard-rules.json` id has a builder check for its packet, which would have caught F4, plus a sidecar entry for F1/F2 to make the prose rules judgeable. Confidence: high on the diagnosis, medium on the remedy's blast radius.

## Questions Answered

- The question carried since iteration 1 about *executor failure handling* is narrowed again but not closed: the builders fail closed on unavailability at the top of each adapter (`cli-devin executor unavailable` at [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2775]), which is a pre-spawn refusal, not a mid-run quota handling path.
- Which of the five executor packets' declared hard rules are unenforced by the runtime builder: answered for all five (F1–F4).

## Questions Remaining

- Hub canon (v4.0.1.0) `package_skill.py --strict` conformance for the hub and its seven modes — carried to the ceiling, unresolved.
- The three `*-presentation.txt` assets: two still unread.
- Mid-run quota handling (devin `resource_exhausted`) and builder throws: still unread across the whole run; only the pre-spawn refusal path is evidenced.
- `--pure` validity for the installed OpenCode (f-iter018-003); unknown-token `{...}` render policy.

## Next Focus

Ceiling reached (20 of 20). Hand-off order: F1/F2 are one-line builder fixes with a documented rule already in place; F5's parity gate is the durable fix that stops the class.

## SCOPE VIOLATIONS

None. All reads were read-only; writes landed only in the iteration narrative, the delta file and the run directory.
