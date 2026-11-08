# Iteration 7 — Over-engineering across hooks, plugins and the advisor

**Segment:** 1 · **Iteration:** 7 of 10 · **Mode:** research (`@deep-research`, native)
**Focus:** Name the release that added each surface, count live production callers, and produce a cut list with evidence: (a) per-runtime hook copies vs the mirrored runtime dirs, (b) the Python advisor vs the Node scorer, (c) `dist-freshness` and `hook-flags.env` vs `.example`, (d) `leaf-manifest.json` / `leaf-aliases.json` / `leaf-scopes.json`.

**Stakes read:** low blast, read-only. Four candidate duplications, all measurable by counting files, symlinks and callers. No writes outside the run directory.

---

## FOCUS

The pivot for this iteration is deliberate. Six iterations have treated each hook surface as a *correctness* problem. This one treats the whole set as an *inventory* problem: for each suspected duplicate, is it a real second implementation, a symlink, a generated artifact, or a shim forced by a module system? The output the operator asked for is a **cut list** — and a cut list that names something harmless is worse than no cut list, so the first job is to kill the candidates that turn out to be symlinks.

---

## ACTIONS TAKEN

1. Enumerated every concern directory under `.skilled/hooks/` and listed which of the seven runtime adapter dirs each carries; listed the six mirror roots (`.claude/hooks`, `.codex/hooks`, `.cursor/hooks`, `.devin/hooks`, `.opencode/plugins`, `.pi/extensions`). Counted adapter sources: **181** files under `.skilled/hooks/*/{claude,codex,cursor,devin,dsh,opencode,pi}/`, excluding READMEs, tests and fixtures.
2. Tested the "byte-identical copies" hypothesis directly with `find -type l` / `-type f` and a dangling-symlink sweep over all six mirror roots plus `.skilled/hooks`. **Hypothesis falsified** — see f-iter007-001.
3. Counted shared-helper adoption: `rg -l hook-adapter-shared` over `.skilled/hooks` (non-test) = **49** files, and read the helper's export list.
4. Traced the Python advisor's live callers with `rg` over `.skilled`, `.opencode`, `.claude`, `.codex`, `.pi`, `.devin`, `.cursor`, excluding `changelog/`, `benchmark/`, `tests/` and `*.md`.
5. Diffed the flag **names** between `.skilled/hooks/hook-flags.env` and `.skilled/hooks/hook-flags.env.example`, then checked tracking status with `git ls-files --error-unmatch` and `git check-ignore -v`.
6. Mapped four introduction commits to their earliest release tags with `git tag --contains <sha> | sort -V | head -2`.
7. Followed the one carried hook-safety thread that this inventory work made cheap: which hook sources bypass the shared stdin reader.

**Correction inside this iteration:** step 7's first pattern (`readFileSync\(0\)`) returned a count of 1 and pointed at the shared helper itself. The pattern was wrong — `readFileSync(0, 'utf8')` has a comma after the `0`. Re-running with `readFileSync\(0,` found the two real bypass sites. The first count is discarded; the number reported below is the corrected one.

---

## FINDINGS

### f-iter007-001 — The runtime "mirrored copies" are symlinks. There is nothing to cut and no sync check is owed.
**Type:** over-engineering (negative result) · **Severity:** P2 · **Release:** pre-v4 line (`.skilled` move, `330427cf30`, first tag `v4.0.0.0`) · **Confidence:** high

`.claude/hooks` holds **30 symlinks and exactly 1 regular file** (`README.md`). Every adapter entry resolves into the authored tree — e.g. [SOURCE: .claude/hooks/ask-surface-stop.cjs:1] `-> ../../.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs`. The `.js`/`.ts` pairs that looked like duplicated committed output are symlinks too: [SOURCE: .skilled/hooks/session-lifecycle/claude/compact-inject.js:1] `-> ../../../skills/system-spec-kit/runtime/dist/hooks/claude/compact-inject.js` sitting beside [SOURCE: .skilled/hooks/session-lifecycle/claude/compact-inject.ts:1] `-> .../runtime/hooks/claude/compact-inject.ts`. The dangling sweep over `.claude`, `.codex`, `.cursor`, `.devin`, `.pi`, `.opencode` and `.skilled/hooks` returned **zero** broken links.

Consequence for the cut list: a symlink cannot drift by content (there is one content), and a rename shows up as a dangling link, which the sweep says does not currently exist. No sync check is missing, because there is nothing to synchronise. **Rejected cut candidate: the mirror layer.**

**Verify:** `find .claude/hooks -maxdepth 1 -type l | wc -l` → 30; `find .claude/hooks -maxdepth 1 -type f | wc -l` → 1; `find .claude .codex .cursor .devin .pi .opencode .skilled/hooks -type l ! -exec test -e {} \; -print` → empty.

### f-iter007-002 — 181 per-runtime adapters share one module that exports two functions.
**Type:** over-engineering · **Severity:** P1 · **Release:** the shared adapter arrived with the stdin-deadline fix (`c33f9d1984`, first tag `v4.0.0.4`); the adapter set accumulated across the whole v4 line · **Confidence:** medium-high on the counts, medium on the "copy-paste" characterisation

[SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:85] exports exactly `{ readStdin, parseJsonFailOpen }`. **49** non-test files reference it; the other **132** of the 181 adapter sources do not. The two functions cover the two things every runtime does identically; everything else — settings-JSON shape, hook event names, the decision JSON each runtime expects, exit-code conventions — is re-implemented per adapter.

What breaks if the adapters are collapsed into one file: **the feature**. Claude's `Stop`/`PreToolUse` payloads, Codex's settings shape, Devin's permission-request contract and dsh's `message.source?.kind` provenance are genuinely different protocols; a single adapter cannot serve them. So the honest cut is narrower than the candidate: extend the shared module to own the runtime-agnostic half (stdin, flag resolution, exit-code mapping) instead of 132 hand-kept readers. The measurable cost today is that a single fix — the 3-second stdin deadline — had to be re-landed per surface, and f-iter007-003 shows it still is not landed everywhere.

**Verify:** `find .skilled/hooks -mindepth 3 -maxdepth 3 \( -path '*/claude/*' -o -path '*/codex/*' -o -path '*/cursor/*' -o -path '*/devin/*' -o -path '*/dsh/*' -o -path '*/opencode/*' -o -path '*/pi/*' \) | grep -vE 'README|test|fixtures|\.md$' | wc -l` → 181; `rg -l hook-adapter-shared .skilled/hooks --glob '!**/*.test.*' | wc -l` → 49.

### f-iter007-003 — Two hook sources bypass the shared stdin deadline with a blocking read, and one of them is the newest surface in the release line.
**Type:** bug (hook safety) · **Severity:** P2 · **Release:** `ask-surface-stop.cjs` `a8cedfbfb0`, first tag **`v4.0.2.0`** · **Confidence:** high on the code, medium on runtime impact

[SOURCE: .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs:83] reads `readFileSync(0, 'utf8')` with no deadline, on the Claude turn-end path. The same bypass exists at [SOURCE: .skilled/hooks/ask-surface-guard/lib/advisory-stop.cjs:44]. The deadline the rest of the hook set uses is [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:29] `readStdin({ timeoutMs = 3000, maxBytes })`. So the guarantee is real, documented, tested (`hook-stdin-deadline.test.mjs`, `c33f9d1984`) — and defeated on exactly the surface added last.

Impact is bounded by the runtime: if Claude always closes stdin at turn end, the blocking read returns and nothing hangs. The deadline exists because some runtimes do not, which is why this is P2 and not P1. It is also the concrete continuation of the carried hook-safety question — the failure mode is a hung turn end, not a wrong decision.

**Verify:** `timeout 5 bash -c 'sleep 60 | node .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs'` — exit 124 demonstrates no deadline; a sub-second exit with a fail-open result demonstrates one. (Not run this iteration; the command is stated, not executed.)

### f-iter007-004 — `hook-flags` is one implementation plus shims, not four copies. Only the shell variant is a genuine second implementation, and it is the drift risk.
**Type:** over-engineering (mostly refuted) · **Severity:** P2 · **Release:** the shell variant predates the v4 line; `.mjs`/`.ts` shims landed `Oct 25` · **Confidence:** high

Measured rather than assumed: `hook-flags.cjs` is 302 lines and is the engine ([SOURCE: .skilled/hooks/shared/hook-flags.cjs:286] `module.exports = {`). `hook-flags.mjs` is **25 lines** and re-exports it line by line ([SOURCE: .skilled/hooks/shared/hook-flags.mjs:14] `export const isHookEnabled = flags.isHookEnabled;`), so it is a module-format adapter, not a second table. `hook-flags.ts` is 55 lines of the same shape. Only [SOURCE: .skilled/hooks/shared/hook-flags.sh:1] (113 lines, executable) re-implements the flag table in shell.

Cut list entry: the two JS shims are **justified** (CJS, ESM and TS consumers cannot import each other without one) and should stay. The shell file is the one real duplication, and the risk it carries is asymmetric — a shell hook that reads a stale table silently disagrees with every JS hook about whether a concern is enabled, with no test comparing the two tables. That is the cut: make `hook-flags.sh` read the resolved value from `hook-flags.cjs` (one node spawn) or generate its table, rather than maintaining a parallel list.

Adjacent question closed (carried since iteration 5): `hook-flags.env` is **gitignored**, not tracked — [SOURCE: .gitignore:389] `.skilled/hooks/hook-flags.env`. Its divergence from the example is therefore by design: the live file has 5 flag names active (`SYSTEM_SESSION_RELAUNCH_ENABLED=1`, `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0`, `SESSION_RELAUNCH_NOTIFY_HOPS=1`, plus the two validation-skip flags) where the example leaves everything commented, and the live file does **not** mention `SYSTEM_ASK_SURFACE_DISABLED` at all — the flag appears only, commented, at [SOURCE: .skilled/hooks/hook-flags.env.example:26]. So the ask-surface guard is **enabled** on this machine, and f-iter006-001 is reachable rather than dead.

**Verify:** `wc -l .skilled/hooks/shared/hook-flags.{cjs,mjs,ts,sh}`; `git ls-files --error-unmatch .skilled/hooks/hook-flags.env` → pathspec error; `git check-ignore -v .skilled/hooks/hook-flags.env` → `.gitignore:389`.

### f-iter007-005 — The 5,637-line Python advisor is not vestigial: three production surfaces still call it, so "delete Python" breaks the OpenCode plugin, the doctor and `create:skill-parent`.
**Type:** over-engineering (candidate refuted) + drift · **Severity:** P2 · **Release:** the MCP removal is v4.0.0.0/v4.0.0.16; these callers survived it · **Confidence:** high on the callers, medium on the "two scorers" framing

Live, non-test, non-doc callers of `runtime/scripts/skill_advisor.py`:

| Caller | Site |
|---|---|
| OpenCode advisor plugin | [SOURCE: .opencode/plugins/system-skill-advisor.js:153] |
| Doctor hub check | [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:130] |
| Doctor skill surface | [SOURCE: .skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs:73] (and its `error` paths at `:972`, `:983`) |
| `create:skill-parent` projection emit | [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:240] `--emit-routing-projection` |

So the cut is **rejected**: removing the Python scorer removes the OpenCode advisor, the doctor's hub-gap rows and the projection emit. What remains true is that canon still names Python as the lexical scorer — [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:12] defines `routingClass: 'lexical'` as "weighted-regex scoring in skill_advisor.py **and** present in both projection maps" — while the same skill ships a Node CLI (`skill-advisor-cli.ts`, `handlers/`, `dist/`). Two scorers under one name is the over-engineering; the fix is to make one authoritative and have the other delegate, not to delete either. I did not read the Node handler this iteration, so "they compute the same thing" is inference, not observation.

**Verify:** the `rg` in Actions step 4, re-run with the four exclusions.

### f-iter007-006 — `leaf-scopes.json` for a single-mode skill restates roots the config already declares. Candidate, not a confirmed cut.
**Type:** over-engineering · **Severity:** P2 · **Release:** `47f91f9135`, first tag **`v4.0.1.0`** · **Confidence:** medium — the consumer was read, its optionality was not

[SOURCE: .skilled/skills/system-skill-advisor/leaf-manifest.config.json:4] already declares `"leafRoots": ["references", "assets", "feature-catalog", "manual-testing-playbook", "hooks"]` for the single mode `system-skill-advisor`, and [SOURCE: .skilled/skills/system-skill-advisor/leaf-scopes.json:1] then lists 8 packet-relative paths for that same one mode. The consumer is real — [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:346] reads `leaf-scopes.json`, and the pre-commit gate regenerates and validates the manifest ([SOURCE: .skilled/scripts/git-hooks/pre-commit:495]). What I did **not** read is whether the generator treats the file as optional for a single-mode skill; `leaf-manifest.config.json` line 4 vs the `leaf-scopes.json` entry is a second place to say one thing, which is the definition of the cost, but "removing it breaks nothing" needs that optionality check before it becomes a cut.

**Verify:** `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/system-skill-advisor` after temporarily unsetting `leaf-scopes.json` in a scratch copy.

---

## QUESTIONS ANSWERED

- **Over-engineering: which per-runtime hook copies, mirrors and generated artifacts could collapse into one source, and what would break if each were removed?** — Answered for all four candidates, with three rejected and one narrowed:
  - **Mirrors**: not copies, they are symlinks (30 of 31 entries); nothing to collapse, nothing breaks if left alone (f-iter007-001).
  - **`hook-flags` family**: one engine plus two format shims plus one shell re-implementation; only the shell table can collapse (f-iter007-004).
  - **Python advisor**: cannot be removed — four live callers (f-iter007-005).
  - **`leaf-scopes.json`**: a genuine restatement for a single-mode skill, pending one optionality check (f-iter007-006).
  - **The one cut that survives unqualified**: the per-adapter stdin/flag re-implementation (f-iter007-002), evidenced by a deadline fix that had to be re-landed and still is not universal (f-iter007-003).

## QUESTIONS REMAINING

- **Advisor transport (v4.0.0.0, v4.0.0.16)** — degraded local scoring and the shared daemon lease/race are still unexercised. Carried **five** iterations now. This is the largest untested claim in the run.
- **Which layer drops the advisor redirect** (CLI handler vs the shim's `recommend_with_native_advisor()`) — carried unchanged.
- **New:** does `hook-flags.sh`'s 113-line table actually disagree with `hook-flags.cjs` today? A one-shot differential (resolve every flag through both, diff) would turn f-iter007-004's drift *risk* into a yes/no, and is cheap.
- **New:** is `leaf-scopes.json` optional for a single-mode skill (f-iter007-006)? One generator run settles it.
- **New:** which of the 132 non-shared adapters import the flag module vs hand-roll their own env reads? That is the pre-condition for sizing f-iter007-002's cut.
- **f-iter007-003** needs one live Claude turn-end hang, or the `timeout` repro run, to settle P1-vs-P2.
- **Hook safety (v4.0.0.8, v4.0.0.16)** — the *git-call* time limit half is still unexamined; the stdin half is now measured and has one gap.
- **Advisor follow-ups from generation 1** — the sk-doc `sk-create-skill-parent` shared-packet entry and duplicate `package_skill.py`. Touched only tangentially via `create-skill-parent-auto.yaml:240`; not assessed.
- **UX and extension** — never reached, seventh iteration running.

## SCOPE VIOLATIONS

None. All reads; writes confined to `research/iterations/iteration-007.md`, `research/deltas/iter-007.jsonl` and the gateway's own state-log write. The `timeout` repro in f-iter007-003 was stated as a verify command and deliberately not executed, since running a turn-end hook against a live session is outside read-only research.

## NEXT FOCUS

The run has three iterations left and two of its own key questions have never been opened: **UX/extension** and **advisor transport**. Iteration 8 should take advisor transport, because it is the oldest unexercised claim (five iterations) and the only one that can still overturn a shipped design statement rather than add to an inventory. Concretely: kill the daemon and score a prompt on the degraded path; start two launchers concurrently and read the lease; compare what the output says against `system-skill-advisor/SKILL.md` and `ARCHITECTURE.md`. If transport closes early, the `hook-flags.sh` differential (cheap, converts f-iter007-004 to yes/no) is the natural filler, leaving iteration 9-10 for UX/extension.
