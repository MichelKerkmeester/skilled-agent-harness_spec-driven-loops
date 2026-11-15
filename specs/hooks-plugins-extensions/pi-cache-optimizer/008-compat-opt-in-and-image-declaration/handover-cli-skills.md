---
title: "Handover — cli dispatch skills: stale self-dispatch rule and an unrunnable preflight suite"
description: "Investigation handover for the CLI-orchestration dispatch surfaces: four docs assert a cli-pi self-dispatch rule the hook no longer enforces, and the suite that encodes the real rule cannot load under its documented command."
trigger_phrases:
  - "session handover"
  - "cli dispatch doc drift"
  - "cli-pi self-dispatch"
  - "dispatch preflight suite"
  - "authorization contract"
importance_tier: "normal"
contextType: "general"
---

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

# Handover — cli dispatch skills: stale self-dispatch rule and an unrunnable preflight suite

> **Scope note.** This file sits inside packet `hooks/021-compat-opt-in-and-image-declaration` only because that folder was chosen as the drop point — **it is not part of 021.** 021 is `Complete` with a frozen `spec.md` (pi-cache-optimizer DeepSeek compat), and nothing here should be folded into its scope. This is a continuation note for a *different* workstream discovered while using the cli skills. When you turn it into real work, open its own packet (suggested: `specs/cli-external-orchestration/070-cli-dispatch-doc-drift/`) and leave this file where it is.
>
> Written 2026-09-11 from the Pi session that closed 021. Repository: `Development/Code_Environment/Public`, branch `skilled/v4.0.0.0`.

---

## 1. Handover Summary

- **From Session:** 2026-09-11 Pi session (compacted mid-run) — produced packet 021, then audited the cli dispatch skills.
- **To Session:** next agent working `.opencode/hooks/dispatch/**` or `.opencode/skills/cli-external-orchestration/**`.
- **Phase Completed:** INVESTIGATION only. **No fix has been applied.** Everything below is verified findings plus one verified repair recipe, deliberately left unexecuted because the fixes belong to a different packet and the user asked for a handover rather than the fix.
- **Handover Time:** 2026-09-11 ~13:15 local.
- **Recent action:** proved the Pi preflight suite passes **34/34** under an alias-based runner, and traced the stale claim to commit `627d247d1e` (2026-08-05) surviving the removal commit that it should have been swept by.

---

## 2. Why This Came Up (trigger chain — read this to understand the stakes)

1. The user asked me to have my 021 work reviewed by `cli-pi` (GLM-5.3-Flash on `llmgateway`, `--thinking max`) and by `cli-codex` (`gpt-5.6-luna`, effort `max`, fast tier).
2. **Both dispatches were denied** by this repo's own Pi dispatch gate, in this order:
   - `Pi dispatch denied: the command does not prove one direct executor.` — my command shape (`env -u` wrapper + `$PROMPT` variable + heredoc) classified as `ambiguous`.
   - `Pi dispatch denied for cli-pi. Name the matching executor in the user request.` — shape fixed, but the operator's turns said "cli pi with GLM 5.3 flash" and "CLI CODEX", neither of which is the literal token.
3. I probed the authorizer (`review/authorizer-probe.mjs` in this packet) and established the literal-token rule (section 3).
4. The user then said **"check the cli skills"** — that audit is what this handover carries.
5. The audit found that the shipped docs still forbid what the shipped hook now permits, and that the suite encoding the real rule cannot run.

---

## 3. Authoritative Behavior (verified this session — treat as ground truth)

### 3.1 Authorization rule — literal token in the operator's *most recent* turn

Enforced at bash `tool_call` time by `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts`, via the shared inspector `.opencode/hooks/dispatch/lib/dispatch-audit.mjs`.

| Inspector verdict | Pi decision |
|---|---|
| `none` (not a dispatch) | no-op |
| `ambiguous` (variable, heredoc, expansion, unknown wrapper, two dispatch segments) | **deny** — "does not prove one direct executor" |
| `direct`, executor not named in the operator's text | **deny** — "Name the matching executor in the user request" |
| `direct`, operator named the executor | **allow** (subject to the target skill's `hard_rules:` lint) |

Facts that cost real time this session:

- The match is a **literal, case-sensitive, non-quoted, non-expanded token**: `cli-pi`, `cli-codex`. "cli pi" (space), "CLI CODEX" (upper-case), and quoted occurrences all fail **by design**.
- A negation in the same sentence ("don't use cli-pi") prevents authorization.
- **Only the latest operator turn counts.** `captureInitialPiUserInput` overwrites the stored text and keeps only the newest turn, so an executor named two turns ago is gone. This is why my second, correctly shaped dispatch was still denied.
- A `/deep:* ... --executor=cli-X` override authorizes independently of prose.
- Executor shape rules live in the shared inspector: `opencode` needs `run`; `codex` needs `exec` **plus a print flag**, and `-p` is overloaded to mean `--profile` for codex (so `codex exec -p <profile> ...` is the shape the gate recognizes); `claude`/`devin`/`cursor-agent`/`pi` need `-p`/`--print` after the binary.

### 3.2 `cli-pi` self-dispatch: **allowed when named** (the disputed fact)

`shouldDenyPiDispatch` — `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:182-195` — has **no `cli-pi` branch**:

```ts
if (input.inspectionKind === "none") return false;
if (input.inspectionKind === "ambiguous") return true;
if (typeof input.dispatchSkill !== "string" || !input.dispatchSkill) return input.inspectionKind === "direct";
if (input.inspectionKind === "direct" && input.inspectedExecutor !== input.dispatchSkill) return true;
...
return !hasExplicitModeOverride(userText, input.dispatchSkill);   // generic named-executor rule
```

Corroborating surfaces (all agree with the code):

| Surface | Evidence |
|---|---|
| The module's own tests | `dispatch-preflight-lint.test.ts:120-121` — `["cli-pi named by the user", 'pi -p "task"', "use cli-pi", **false**]`, unnamed → `true`; `:179-182` *"allows a named cli-pi dispatch and still denies an unnamed one"* |
| cli-pi packet | `cli-pi/SKILL.md:21` *"**A Pi session MAY dispatch this skill.** Pi has no in-process delegation of its own…"*; `:26` *"this carve-out is Pi's alone"* |
| Hub packet | `cli-external-orchestration/SKILL.md:34` — *"most modes refuse self-dispatch through their own guard… `cli-pi` is the exception and may be dispatched from inside Pi."* |
| The decision that changed it | spec `specs/cli-external-orchestration/066-pi-self-dispatch-and-subagents-retirement/`; removed in commit `5c49586351` (2026-09-08, *"fix(cli): let a pi session dispatch cli-pi and make dead dispatch guards fire"*), an **ancestor of HEAD** |
| My live probe | `shouldDenyPiDispatch` returned ALLOW for `cli-pi` when the request text contained `cli-pi` |

**Do not re-add a denial branch.** That would revert spec 066 and the v1.5.0.0 change.

---

## 4. Defects To Fix

### D1–D2 — `.opencode/hooks/dispatch/README.md` (last touched 2026-08-21, before the removal)

| Line | Current (false) text | Required correction |
|---|---|---|
| `:72` | Pi row: `shouldDenyPiDispatch` authorization (**self-dispatch `cli-pi` always denied**; ambiguous denied; direct-but-unnamed denied unless…) | Delete "self-dispatch `cli-pi` always denied". The remaining clauses are correct: ambiguous denied; direct-but-unnamed denied unless the operator's text names the executor. Add: a named `cli-pi` dispatch is allowed — Pi can dispatch itself, that is the packet's carve-out. |
| `:75` | *"Pi is the only runtime that adds an authorization layer … because a Pi session can dispatch itself (`cli-pi`) and **that must be blocked regardless of the target skill's declared rules**."* | Rewrite the rationale: the layer exists because a direct dispatch must be **authorized by the operator's own request**, not because self-dispatch is banned. Keep "Pi is the only runtime that adds an authorization layer on top of the hard-rule lint" — that part is true. |

### D3 — `feature-catalog/feature-catalog.md:92`

> "…`none` is a no-op, and **a `cli-pi` self-dispatch is never authorized**. The shared inspector suite passes **356/356** and the Pi preflight suite passes **32/32**."

Correction: `cli-pi` is judged by the same named-executor rule as any sibling; the carve-out is intentional. Both pass counts are unreproducible (see D6) — replace with the measured numbers or drop them.

### D4 — `feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md:38`

> "`direct` → deny unless the user's own request names the matching executor (or a `/deep:* --executor=cli-X` override authorizes it); **a `cli-pi` self-dispatch is never authorized**."

Correction: drop the trailing clause; the preceding sentence is complete and correct on its own. Check the packet's overview/contract table in the same file (`:25-45`) for a second statement of the same claim.

### D5 — `manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md` — **the worst one**

This file does not merely repeat the claim; it reports it as **observed test evidence**:

| Line | Stale assertion |
|---|---|
| `:29` | "…and **a `cli-pi` self-dispatch is never authorized**." |
| `:42` | "…`shouldDenyPiDispatch` denies the quote-safe dispatch when the user did not name the executor, allows it when the user named `cli-devin`, and **denies a `cli-pi` self-dispatch**." |
| `:86` | "Step 3: … and the `pi` self-dispatch is **`denied:true`**." |
| `:132` | "…and **a `cli-pi` self-dispatch is denied outright**." |
| `:160` | "The Pi authorization gate … allowed it when the user named `cli-devin`, and **denied the `cli-pi` self-dispatch**. Every JSON line above was written by a real process invocation and read back; no fabricated output was used." |
| `:61`, `:106` | The documented run command for the suite — see D6 |

Correction: the `pi` rows must expect **allow** when the operator named `cli-pi` and **deny** when they did not (that is the real pair, matching the unit suite). The closing sentence at `:160` claiming real-process evidence for a now-false result is the highest-value edit in this whole handover: a playbook that reports a non-reproducible observation poisons every future verification that trusts it.

### D6 — The suite cannot load, and its advertised counts are wrong

**Documented command** (playbook `:61`/`:106`) fails:

```text
npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot
→ Error: Cannot find module '../../.opencode/hooks/shared/hook-flags.mjs'
  imported from …/.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts
  → Test Files 2 failed (2) | Tests no tests
```

Two independent causes:

1. **Import convention.** `dispatch-preflight-lint.ts:7` imports `"../../.opencode/hooks/shared/hook-flags.mjs"`, which only resolves when the module is loaded *through the `.pi/extensions/` symlink* (`.pi/extensions/dispatch-preflight-lint.ts -> ../../.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts`). From the real path it silently becomes `.opencode/hooks/dispatch/.opencode/…`. **This is a fleet-wide convention, not a bug**: 12 files use it, e.g. `sk-vision/hooks/pi/sk-vision.ts:20`. The dynamic imports in the same file (`:197-211`) already carry a `../lib/` fallback for the real path; the static one has none because production never needs it.
2. **Substring path filter + nested worktrees.** Run from the repo root, the filter is a substring match, so it also collects `<Public>/.worktrees/022-012-runtime-enablement-build/.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` (a git worktree *inside* the repo).

**Verified repair recipe** (I ran this; not yet landed). A repo-root vitest config — suggested path `.opencode/hooks/vitest.config.ts`:

```js
const repo = '<absolute path to Public>';

export default {
  root: repo,
  resolve: {
    // Encodes the repo convention: any `(../)+.opencode/…` specifier always means repo-root `.opencode/`.
    alias: [{ find: /^(\.\.\/)+\.opencode\//, replacement: `${repo}/.opencode/` }],
  },
  test: {
    exclude: ['**/node_modules/**', '**/.git/**', '**/.worktrees/**'],
  },
};
```

Observed result with that config (throwaway copy at `/tmp/vitest-preflight-probe.config.mjs`):

```text
npx vitest run --config /tmp/vitest-preflight-probe.config.mjs \
  .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot
→ Test Files 1 passed (1) | Tests 34 passed (34)
```

Also needed:

- Add the suite to `.opencode/hooks/README.md` §5 (VALIDATION, around `:181-186`), which today lists only the `node --test` suites and `dispatch-audit.test.mjs`. That omission is why the breakage went unnoticed. **That file carries another session's uncommitted edits at handover time** — rebase your change onto the working-tree version, do not restore the committed one.
- **Pin the runner.** `npx vitest` at the repo root resolved **v5.0.0**; `.opencode/node_modules/.bin/vitest` is **v4.1.6**. Both ran the suites, but the docs should name one.

**Real counts vs documented:**

| Suite | Documented | Actual today |
|---|---|---|
| Pi preflight (`dispatch-preflight-lint.test.ts`) | "32/32", "33 passed" | **34 pass** (under the alias config) |
| Shared inspector (`lib/dispatch-audit.test.mjs`) | "356/356" | **74 pass** (vitest, `--root .opencode/hooks/dispatch/lib`) |
| Rule checks (`lib/dispatch-rule-checks.test.mjs`) | not stated | **9 pass** (`node --test`) |

The 356/356 and 32/32 figures match no runnable revision of these files. Replace them with reproducible numbers or delete them — an unverifiable count in a verification playbook is worse than no count.

### D7 — `cli-pi/changelog/v1.5.3.0.md:46` — **do not edit silently**

```text
The pi-side turn is an operator step, not a skip: the dispatch-authorization hook denies a
cli-pi self-dispatch from inside a pi session.
```

This file is **untracked, dated 2026-09-11 (three days after the removal)** — another session's in-flight work. The sentence repeats the ghost rule and was used to justify **skipping a live verification** ("operator step, not a skip"). The rule it cites does not exist: that work could have been verified in-session. Coordinate with the operator before touching it; the correct handling is an erratum or a corrected sentence, not a silent rewrite of someone's changelog.

---

## 5. Definition Of Done

1. `grep -rn "self-dispatch.*never authorized\|self-dispatch .cli-pi. always denied\|denies a .cli-pi. self-dispatch" .opencode/ --include=*.md` (excluding `node_modules`, `.worktrees`) returns **nothing**.
2. The preflight suite runs from a command documented in `.opencode/hooks/README.md` §5 and passes (expect 34).
3. `**/.worktrees/**` is excluded from hook-suite collection; the documented command collects exactly one file.
4. **Production is unbroken** — this is the check that matters, because the fix must not touch the import convention:
   ```bash
   pi --offline --approve -p "list your available tools" </dev/null   # exit 0, no extension-load error
   ```
   (`.opencode/hooks/README.md` §5 already names this as the regression check for `.pi/extensions/*.ts` import paths.)
5. The packet you open for the work passes `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh <folder> --strict`.

---

## 6. Traps & Scar Tissue (each one cost me time this session)

| Trap | Activation condition | Load-bearing or defensive? | How to avoid re-paying it |
|---|---|---|---|
| `node --test` on a vitest suite | Any hook suite importing `vitest`. Error is `TypeError: Cannot read properties of undefined (reading 'config')` with **0 pass / 1 fail** and no test names. | load-bearing (misleading) | Check the first import line of a suite before believing a failure. I initially reported two suites as broken on this basis; they were not. `node:test` = `.test.mjs` under `lib/`; vitest = everything importing `vitest`. |
| `--root` + relative path | `npx vitest run --root .opencode/hooks …` run from *inside* `.opencode/` resolves to `.opencode/.opencode/hooks` → "No test files found". | defensive | Run root-relative commands from the repo root, or use `--dir`. |
| Worktree copies collected | Any `npx vitest run <path>` from the repo root; `.worktrees/` lives inside it, and worktree copies of the same file match a substring filter. | load-bearing | Exclude `**/.worktrees/**` (D6) or scope with `--root`. |
| `../../.opencode/…` imports look broken | Importing a `.pi/extensions` hook by its **real** path (any scratch script, any direct test run). | load-bearing — the paths are *correct for production* | Load such modules through `.pi/extensions/<name>.ts`, or use the alias config. Never "fix" the import. |
| `npx vitest` version drift | Running any suite from the repo root. | defensive | Use `.opencode/node_modules/.bin/vitest` (v4.1.6) or pin in the config. |
| Dispatch denial misread as a capability problem | Any `pi -p`/`codex exec -p` composed from a request that names the executor with different spelling/case. | load-bearing | The gate matches literal `cli-pi`/`cli-codex` in the **latest** operator turn. If a dispatch is refused, quote the token back to the operator and re-dispatch — do not reshape the command to slip past the gate. |
| Stale doc believed over code | Reading the feature catalog or the playbook before the hook. | load-bearing | Trust the hook + its unit tests + the packet `SKILL.md`, in that order; the two doc surfaces listed in D3–D5 are known-wrong today. |

---

## 7. Cold-Read Order (a reader who knows nothing)

1. `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` — `shouldDenyPiDispatch` at `:182-195` (the whole rule is 14 lines).
2. `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts:110-190` — the rule's executable contract.
3. `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md:19-30` and `cli-external-orchestration/SKILL.md:34` — the carve-out that the docs contradict.
4. `.opencode/hooks/dispatch/README.md:72,75` — first stale surface.
5. `.opencode/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md:25-45` — the published contract.
6. `specs/cli-external-orchestration/066-pi-self-dispatch-and-subagents-retirement/` (spec + implementation-summary) — why the rule was removed.
7. `git show 5c49586351` — the commit that swept `SKILL.md`/`ROUTER.md`/hub `README.md`/hook/tests and **missed** D1–D5.

---

## 8. Open Questions For The Operator

1. **Is the removal final?** Evidence says yes (spec 066 + v1.5.0.0 + hub `SKILL.md:34` carve-out + the module's tests). If it is, the docs are simply wrong; if a re-prohibition is intended, the hook and packet must change instead. Do not pick silently.
2. **How to handle D7** (another session's untracked changelog): correct the sentence, add an erratum, or leave the changelog as a period record? My recommendation: correct it — it asserts a current capability, and it justified a skipped verification.
3. **Do these doc edits require version bumps?** The hub has a doc-version reconciliation practice (see commit `f97856a9ce`, *"reconcile the hub's doc versions to their skill era"*). The feature-catalog files carry versions (`cli-dispatch-authorization` shows `v1.4.0.1`); confirm whether a claim-level correction bumps them and whether a changelog entry is owed.
4. **Counts:** replace `356/356` / `32/32` with measured values, or drop the numbers entirely?

---

## 9. Session Notes / State At Handover

- **Nothing in this workstream was fixed, and no file outside this packet was touched.** The only writes this session made are: packet 021's docs and evidence (committed by another session as `80576ef8aa`), the two review artifacts in `review/`, and this handover.
- **Pre-existing working-tree state I did not cause and did not touch:** ` M .opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md` (an unrelated goal-feature edit at `:103+`, not the stale line at `:92`), and `?? .opencode/skills/cli-external-orchestration/cli-pi/changelog/v1.5.3.0.md` (the D7 file). The wider tree also carries many more uncommitted edits from other sessions (goal surfaces, speckit command assets, and ` M .opencode/hooks/README.md` — the file D6 asks you to extend).
- **Packet 021 validation:** `validate.sh --strict` on this folder was `Errors: 0  Warnings: 0  RESULT: PASSED` before this file was added; re-run it after, since this handover now lives in that folder.
- **Reviews of 021 were never dispatched.** Both reviewer packets are composed and ready (`review/brief.md`, `review/change-under-review.diff`, `review/authorizer-probe.mjs`, `review/README.md`). Re-issuing them needs an operator turn containing the literal token from section 3.1 (e.g. *"use cli-pi and cli-codex to review"*). The dispatch gate is *supposed* to work this way — the cli skills' documentation of that gate is the thing D1–D5 got wrong.

## 10. Validation Checklist

- [x] No in-progress implementation left mid-flight (investigation only)
- [x] Every claim above carries a file:line, a commit hash, or an observed command output
- [x] The one proposed repair (D6 alias config) was executed and its result recorded verbatim
- [x] Traps recorded with activation conditions rather than page-turning narration
- [ ] Confirm packet 021 still validates `--strict` after this file lands
- [ ] Operator decisions in section 8 before any doc edit begins
