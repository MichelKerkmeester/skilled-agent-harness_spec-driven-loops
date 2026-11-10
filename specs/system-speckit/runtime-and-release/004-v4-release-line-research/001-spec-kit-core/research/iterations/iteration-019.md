# Iteration 19 — Shared package and session hooks: the spec-gate enforce path

## Focus

New ground, as directed: `.skilled/skills/system-spec-kit/shared` beyond `gate-3-classifier.ts`, and the spec-kit hook entry points the runtimes load — looking specifically for (a) a hook that swallows its own failure, (b) an env switch documented under a different name/grammar than the code reads, and (c) a shared helper whose behaviour differs between its TS source and the compiled file a hook loads.

The hooks in play are the two named in `.claude/settings.json` under `PreToolUse`: `runtime/hooks/claude/spec-gate-classify.mjs` and `runtime/hooks/claude/spec-gate-enforce.mjs`, both thin adapters over `runtime/hooks/lib/spec-gate/spec-gate-core.mjs` (89 KB, the single implementation for every runtime).

## Actions Taken

1. Enumerated `shared/` (27 entries) and the hook tree (`hooks/claude|codex|cursor|devin|dsh|lib|opencode|pi`), then read the two adapter entry points in full and the `runClassifyGate` / `runEnforceGate` / `evaluateMutation` bodies in `spec-gate-core.mjs`.
2. Audited the disable/enforce env surface: constant declarations, every read site, and the second resolver in `.skilled/hooks/shared/hook-flags.cjs` + `env-aliases.cjs`.
3. Executed the two readers against `1` / `true` / `yes` / `off` / `0` / `""` for both the canonical and alias name (read-only, no repo writes).
4. Piped four sample JSON payloads into `spec-gate-enforce.mjs` on stdin with `AI_SESSION_CHILD`, `SYSTEM_SPEC_GATE_ENFORCE` and `SYSTEM_SPEC_GATE_DISABLED` unset, and recorded stdout/exit for each.
5. Measured the `ENV-REFERENCE.md` drift guard's coverage by re-implementing its own collectors (`ENV_READ_RE`, `collectRuntimeTsFiles`, `collectFeatureRuntimeTokens`) over the runtime tree.
6. Checked the TS-source-vs-compiled-output limb on `shared/`: full body diff of `utils/path-containment`, plus an mtime sweep of all 34 compiled pairs.
7. Attributed every claim with `git log -1` on the file/line that carries it.

## Findings

### F1 — The documented truthy grammar for `SYSTEM_SPEC_GATE_DISABLED` is honoured by a second module, not by the gate

**Type** drift · **Severity** P2 · **Release** v4.0.0.10 (ENV-REFERENCE row added in `ce3d7d0b29`, 2026-10-09; confirmed inside `v4.0.0.10`) · **Confidence** 0.85

`ENV-REFERENCE.md` states the gate kill-switch is a "truthy disable flag" and, in the generated-table section, spells the grammar out: "When set to a truthy value (`1`, `true`, `yes` or `on`), the gate is a complete fail-open no-op" [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:248], repeating the same claim in the hook kill-switch table [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:76].

The gate itself does not read a truthy value. It declares the name once [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:83] and then compares against the exact string `'1'` at every site: the emission guard [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:400], the delivery-marker path, the deferral relay and both entrypoints [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1624] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1769]. `true`/`yes`/`on` therefore only disable the gate through the second clause of those same conditions, `specGateConcernDisabled()`, which reaches `isHookEnabled('spec-gate')` in the separate hooks hub [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:112] via a six-level `createRequire`:

```js
const { isHookEnabled } = specGateGuardRequire(
  fileURLToPath(new URL('../../../../../../hooks/shared/hook-flags.cjs', import.meta.url)),
);
return typeof isHookEnabled === 'function' && isHookEnabled('spec-gate') === false;
} catch {
return false;
```

[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:118]

`isHookEnabled` is the reader that accepts the documented grammar [SOURCE: .skilled/hooks/shared/hook-flags.cjs:129] — its list is `1 | true | yes | on`. So one documented variable has two readers with two grammars, and the wider grammar is the one behind an optional module whose failure mode is `return false` (i.e. "not disabled"). An install that ships the gate but not the hooks hub keeps only `1`.

**Verify**

```bash
node -e "const {isHookEnabled}=require('./.skilled/hooks/shared/hook-flags.cjs');
for (const v of ['1','true','yes','off','0','']) { process.env.SYSTEM_SPEC_GATE_DISABLED=v;
  console.log(JSON.stringify(v), isHookEnabled('spec-gate')); }"
```

Observed: `false` for `1`/`true`/`yes`, `true` for `off`/`0`/`""` — the hub side agrees with the doc; the inline side does not.

### F2 — The documented `SPECKIT_SPEC_GATE_DISABLED` alias has no reader in the package that documents it

**Type** drift · **Severity** P2 · **Release** v4.0.0.10 (same row) · **Confidence** 0.9

The same row names an alias: "Alias: `SPECKIT_SPEC_GATE_DISABLED`" [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:76], and names the reader as `hooks/lib/spec-gate/spec-gate-core.mjs`. That file never mentions the alias. The repo's env-prefix bridge does not supply it either, because it only rewrites `MK_` keys:

```js
function newNameFor(key) {
  if (!key.startsWith("MK_")) return null;
```

[SOURCE: .skilled/hooks/shared/env-aliases.cjs:34]

The alias works only because it is listed in the concern's legacy set [SOURCE: .skilled/hooks/shared/hook-flags.cjs:86], which is read by `hook-flags.cjs`, not by the file the doc names. `SPECKIT_SPEC_GATE_DISABLED=1` and `SPECKIT_SPEC_GATE_DISABLED=true` both disable (measured), but only for as long as the hub module resolves — coupling F1's failure mode to the alias as well.

A second, smaller path error sits in the same document: row 76 names the plugin `.opencode/plugins/system-spec-gate.js` while the generated table names it `plugins/system-spec-gate.js` [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:250]. Only the `.opencode/` path exists (14,739 bytes); the other row's path is not resolvable from the repo root.

**Verify**

```bash
grep -rn "SPECKIT_SPEC_GATE_DISABLED" .skilled/skills/system-spec-kit/runtime/hooks/lib/ ; # no hits
ls -la .opencode/plugins/system-spec-gate.js ; ls -la plugins/system-spec-gate.js
```

### F3 — The gate's only deny is destructible by its own telemetry write

**Type** bug · **Severity** P1 · **Release** v4.0.2.0 window (`spec-gate-core.mjs` last touched `e1567e280f`, 2026-11-07) · **Confidence** 0.8

`evaluateMutation` builds its state directory behind a fallback and inside a `try`:

```js
const dir = projectDir || process.cwd();
const { stateDir } = resolveGuardPaths(dir);
```

[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1777]

`runEnforceGate` runs the same resolution a second time, with no fallback and outside any `try`, after the decision is already in hand:

```js
if (result && result.decision !== 'allow') {
  const { stateDir } = resolveGuardPaths(projectDir);
  appendWarningLog(stateDir, formatSpecGateEvent({
```

[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1876]

`appendWarningLog` is itself defended (its body opens with `try` at line 978 and swallows at 984), but the resolution one line above it is not. Any throw there propagates out of `runEnforceGate`, and the adapter's terminal handler converts the whole call into an approval:

```js
main().catch((error) => {
  process.stderr.write(`spec-gate-enforce: ${...}\n`);
  approve();
});
```

[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs:58]

So a computed `deny` (the only deny branch is `denyCapable && enforceOn`, core line 1803) becomes an allow whenever the warning-log write fails, with a stderr line as the sole trace. This inverts the module's own doctrine: every other `catch` in the file fails toward *allowing* because the gate is advisory-by-default; here the same direction silently disarms the one path that is not advisory.

**Repro (executed, read-only)** — four payloads piped into the adapter with the session env unset:

```bash
P='{"tool_name":"Write","session_id":"probe","cwd":"/nonexistent/dir","tool_input":{"file_path":"/nonexistent/dir/x.md"}}'
printf '%s' "$P" | env -u AI_SESSION_CHILD -u SYSTEM_SPEC_GATE_ENFORCE -u SYSTEM_SPEC_GATE_DISABLED \
  node .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs; echo "exit=$?"
```

Observed for all four payloads (valid-with-unreadable-cwd, `not json at all`, empty, `Bash`): `exit=0`, empty stdout, empty stderr, no state directory created. Empty output with exit 0 is the observable signature of the swallowing path; nothing distinguishes "gate allowed this" from "gate never ran".

### F4 — The warning log cannot distinguish an enforced denial from an advisory

**Type** ux · **Severity** P2 · **Release** v4.0.2.0 window · **Confidence** 0.9

The log row's `decision` field is derived from `wouldDeny`, not from the decision that was returned:

```js
decision: result.wouldDeny ? 'would-deny' : 'advise',
```

[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1882]

`wouldDeny` is set to `denyCapable` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1794], which is true for every `Write`/`Edit` regardless of whether enforcement is on. An `advise` on a `Write` and a real `deny` on a `Write` therefore both append `decision=would-deny`. The operator reading `spec-gate-warnings.log` — the only durable record the gate writes — cannot tell whether the gate has ever actually blocked a mutation, and the word "would" asserts the opposite of what happened in the enforced case.

**Verify**: run the gate twice with the same `Write` payload, once with `SYSTEM_SPEC_GATE_ENFORCE=1` and once unset, after opening a gate state; compare the two appended lines in `.skilled/skills/.state/spec-gate/spec-gate-warnings.log`. `formatSpecGateEvent` maps the field verbatim into the line.

### F5 — The ENV-REFERENCE drift guard cannot see 133 of the 251 names the document carries

**Type** misalignment · **Severity** P2 · **Release** v4.0.2.0 window (guard last touched `e0c627e377`, 2026-11-08) · **Confidence** 0.85

The document makes a two-way promise: "Every spec-kit-owned name must have a verified reader in its source" [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:36]. The guard that is supposed to hold that promise enforces one direction only, and only for one prefix. Its matcher requires the literal `SPECKIT_` prefix:

```js
const ENV_READ_RE =
  /(?:process\.env|[A-Za-z_]*[eE]nv)(?:\.(SPECKIT_[A-Z0-9_]+)|\[\s*['"](SPECKIT_[A-Z0-9_]+)['"]\s*\])/g;
```

[SOURCE: .skilled/skills/system-spec-kit/runtime/tests/env-reference-drift.vitest.ts:63]

Its collector takes `.ts` files only, skipping `dist/`, `tests/` and `stress-test/` [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/env-reference-drift.vitest.ts:80], so every `runtime/hooks/**/*.mjs` reader — including the file F1/F2 name as the reader — is out of scope. The broader extension scan that does accept `.mjs|.cjs|.sh` is scoped to `runtime/cli` [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/env-reference-drift.vitest.ts:131], a different subtree. And the assertion only ever fires on a `SPECKIT_*` token found in a scanned file [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/env-reference-drift.vitest.ts:242].

Measured against the document's own backticked names in table rows (251 unique) with the guard's collectors re-implemented: 133 are non-`SPECKIT_` and structurally unreachable by the assertion; 191 have no reader text anywhere inside `runtime/` at all, because their readers live in `.skilled/hooks/shared/*.cjs`, `.skilled/bin/*.sh` and `.skilled/skills/system-skill-advisor/**` — outside the tree the document sits in. The `SPECKIT_SPEC_GATE_DISABLED` case above (F2) is exactly the class the guard cannot catch: a documented alias whose reader sits one directory tree over.

Neither direction catches it: the doc→code direction is absent entirely, and the code→doc direction is prefix- and extension-limited.

**Verify**

```bash
npx vitest run .skilled/skills/system-spec-kit/runtime/tests/env-reference-drift.vitest.ts   # passes today
grep -c "^|" .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md
```

A green run here is a statement about `SPECKIT_*` reads in `.ts` files, not about the document.

### F6 — The kill switch fails toward "still armed"

**Type** improvement · **Severity** P3 · **Release** pre-v4.0.0.0 (function predates the release line) · **Confidence** 0.75

`specGateConcernDisabled()` returns `false` from its `catch` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:118], and its callers read that as "the operator has not disabled me". Every other defensive branch in the file fails in the permissive direction (allow / no notice / no state); this one fails in the restrictive direction, so a broken hooks hub silently re-arms a hook the operator turned off. The module documents that choice as deliberate for the *hook*: taking no environment keeps a saved kill switch honoured [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:110]. But a load failure and an unset switch are indistinguishable at the call site, so the operator gets no signal that the switch stopped being read.

**Concrete extension**: have `specGateConcernDisabled` return a tri-state (`on | off | unknown`) and, on `unknown`, append one line to the same warning log the gate already owns, naming the module that failed to resolve. That turns a silent re-arm into a diagnosable event without changing the default.

## Questions Answered

None of the two remaining strategy key questions were closed this iteration; the focus was new ground. The iteration does retire two carried residuals and adds three new ones (below).

**Residuals closed**

- "a hook that reads an env switch documented under a different name" — confirmed, twice over: F1 (same name, narrower grammar, second reader) and F2 (alias with no reader in the named file).
- "a shared helper whose behaviour differs between its TS source and the compiled file a hook loads" — **ruled out** for `shared/`. `utils/path-containment.ts` vs `dist/utils/path-containment.js` differ only by type annotations, brace style and blank lines (full-body diff); the compiled set is complete (34 `.js` for 34 non-test `.ts`, no orphans) and no `.ts` is newer than its `.js` (mtime sweep, 0 pairs).
- The related `isChildSession` grammar question is also **ruled out**: documented as flag `"1"` [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:250] and read as exact `'1'` with an explicit safe default [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:104] — doc and code agree.

## Questions Remaining

- **Q6 `/doctor:update`** — `align`, `apply`, `rollback`, `compat` still unrun. Twelfth iteration carrying it; nothing blocked it here, the budget went to the hook surface.
- **Q7 `create.sh` + level templates** — unchanged: the scaffold-versus-`--strict` half needs a scratch repo and a real scaffold, and the fill-note comparison against sk-doc canon is untouched.
- **Q3/Q4/Q5/Q8/Q9/Q10/Q11/Q12** — carried unchanged.
- **New from F3**: whether any adapter passes `projectDir` as `undefined` in practice. `evaluateMutation` defends against it (line 1777) and `runEnforceGate` does not (line 1876), so the two disagree about whether the parameter can be absent; if no adapter can omit it, F3's destructive path needs a different trigger (unwritable state dir, `ENOTDIR` on the way to `.state`).
- **New from F1/F2**: whether a *project* install (as opposed to this repo) always ships `.skilled/hooks/shared/hook-flags.cjs`. If doctor can align the gate without the hub, then three of the four documented disable values and the whole documented alias are inert in that project.
- **New from F5**: whether `runtime/ENV-REFERENCE.md` is the right home for names whose readers are all outside `runtime/`. The measured 191/251 mismatch is a placement question as much as a guard question, and the answer decides whether the fix is a wider guard or a split document.

## Next Focus

Iteration 20: close the oldest open item rather than opening more ground. Run the `/doctor:update` non-`check` paths end to end in dry-run (`align --dry-run`, `apply --dry-run`, `rollback --dry-run`, `compat --dry-run`) against a scratch repo under `/tmp`, and record the exit status plus the diff of what each dry-run claims it would do versus what `check` reports. Floor as usual: 12 `[SOURCE:]` tags from code and scripts read that iteration, every finding's repro actually executed.
