---
title: "CLI Dispatch Preflight Authorization"
description: "Manual scenario validating the shared dispatch inspector's classification (including quote-safe executor normalization) and the Pi preflight authorization/deny gate."
trigger_phrases:
  - "dispatch preflight authorization"
  - "quoted executor bypass"
  - "shouldDenyPiDispatch"
  - "inspectDispatch classification"
  - "cli-dispatch-preflight-authorization"
id: CE-P04
stage: routing
expected_intent: UNKNOWN
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
version: 1.0.0.0
---

# CLI Dispatch Preflight Authorization

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

The dispatch preflight authorization surface decides, before a Bash tool call runs, whether a command is an external-CLI dispatch and — under Pi — whether that dispatch is authorized. It is built on one shared, runtime-neutral inspector consumed by every dispatch hook:

- Shared inspector: `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` (`inspectDispatch` / `matchDispatchShape`). `inspectDispatch` tokenizes a bounded shell command without evaluating it and returns one of three classifications: `direct` (exactly one proven command-position executor), `ambiguous` (an executor-shaped candidate that cannot be pinned to a single direct executor — variable/alias/substitution/wrapper/multi-segment forms), or `none` (no dispatch evidence).
- Pi authorization gate: `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` (`shouldDenyPiDispatch`, wired via the `tool_call` handler). It maps the inspector's `kind` to an allow/deny decision: `none` → no-op (not a dispatch), `ambiguous` → deny (the command does not prove one direct executor), `direct` → deny unless the user's own request names the matching executor (or a `/deep:* --executor=cli-X` override), and a `cli-pi` self-dispatch is never authorized.
- Cross-runtime consumers: the same shared inspector feeds the Claude, Codex, and Devin dispatch hooks (`dispatch-preflight-lint.mjs` and `dispatch-audit-posttooluse.mjs` under each runtime folder) and the observational audit trail (`matchDispatchShape`, which records only `direct` dispatches). A classification change in the shared inspector therefore changes behavior for all four inspector runtimes at once.

**Quote-safe executor normalization.** A quoted command-position token still names the binary the shell will run, so `"devin" -p x` invokes `devin` exactly as the bare form does. The inspector classifies such a quote-safe executor as `direct` (by exact basename membership), identical to its unquoted twin. Because exact basename membership admits only a real executor name, multi-word quoted prose (`"devin -p task"` as a single token) and a quoted token used as an argument (`echo "devin" -p "hi"`) correctly remain `none`. This closes a path where a quoted executor previously classified as `none`, evading both the Pi authorization gate and the audit trail.

This scenario validates: the shared inspector's unit suite; the Pi preflight suite; live in-process classification of quote-safe, prose, argument, and non-dispatch commands; and the live Pi deny decision for a quote-safe dispatch with and without an explicit user-level executor exemption.

---

## 2. SCENARIO CONTRACT

- Preconditions: `.opencode/hooks/dispatch/lib/dispatch-audit.mjs`, `.opencode/hooks/dispatch/lib/dispatch-audit.test.mjs`, `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts`, and `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` all exist. Node is on `PATH`; `npx vitest` and `npx tsx` are resolvable.
- Real user-facing trigger: an agent under any inspector runtime runs a Bash tool call, or a Pi session issues a `bash` `tool_call`, whose command is (or resembles) an external-CLI dispatch — including forms where the executable token is quoted or path-qualified.
- Expected signals: the shared inspector suite passes in full; the Pi preflight suite passes in full; a quote-safe command-position executor (`"devin" -p "task"`) classifies as `{ kind: "direct", executor: "cli-devin" }` and is recorded by `matchDispatchShape` as `{ skill: "cli-devin" }`; multi-word quoted prose and a quoted argument classify as `none`; and `shouldDenyPiDispatch` denies the quote-safe dispatch when the user did not name the executor, allows it when the user named `cli-devin`, and denies a `cli-pi` self-dispatch.
- Desired user-visible outcome: a concise pass/fail verdict citing exact captured command output, with no fabricated JSON.
- Pass/fail: PASS if both suites pass, the quote-safe executor classifies as a single direct executor (and is audit-visible), the prose/argument/non-dispatch controls stay `none`, and the Pi deny decisions match the authorization contract above. FAIL if a quote-safe executor classifies as `none` (bypass), if a prose/argument control is misclassified as a dispatch (false positive), if the deny decision contradicts the contract, or if any inspector entry throws instead of failing closed to `none`.

---

## 3. TEST EXECUTION

### Commands

1. Run the shared inspector unit suite (covers the `direct`/`ambiguous`/`none` table including the quote-safe rows):

```bash
npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot
```

2. Run the Pi preflight suite (covers `shouldDenyPiDispatch` and the `tool_call` gate):

```bash
npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot
```

3. Live in-process classification + Pi deny decision against the real modules (quote-safe, env-wrapped, unquoted, prose, argument, and self-dispatch cases):

```bash
npx tsx -e '
(async () => {
  const { inspectDispatch, matchDispatchShape } = await import("./.opencode/hooks/dispatch/lib/dispatch-audit.mjs");
  const { shouldDenyPiDispatch } = await import("./.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts");
  const rows = ["\"devin\" -p \"task\"", "env KEY=v \"pi\" --offline -p \"x\"", "devin -p task", "\"devin -p task\"", "echo \"devin\" -p \"hi\""];
  for (const c of rows) { const i = inspectDispatch(c); const s = matchDispatchShape(c); console.log(JSON.stringify({cmd:c, kind:i.kind, executor:i.executor??null, auditSkill:s?.skill??null})); }
  console.log("--- deny ---");
  const deny = (cmd, userText) => { const i = inspectDispatch(cmd); const ds = i.kind==="direct"? i.executor: null; return {cmd, kind:i.kind, dispatchSkill:ds, denied: shouldDenyPiDispatch({runtime:"pi",toolName:"bash",command:cmd,dispatchSkill:ds,inspectedExecutor:ds,inspectionKind:i.kind,userText})}; };
  console.log(JSON.stringify(deny("\"devin\" -p \"task\"", "run the thing")));
  console.log(JSON.stringify(deny("\"devin\" -p \"task\"", "use cli-devin")));
  console.log(JSON.stringify(deny("\"pi\" --offline -p \"x\"", "use cli-pi")));
})();
'
```

### Expected

- Step 1: `Test Files 8 passed (8)`, `Tests 356 passed (356)`, no failures.
- Step 2: `Test Files 1 passed (1)`, `Tests 32 passed (32)`, no failures.
- Step 3: `"devin" -p "task"`, the env-wrapped quoted `pi`, and the unquoted `devin -p task` each classify as a single `direct` executor and carry a matching non-null `auditSkill`; `"devin -p task"` (one quoted token) and `echo "devin" -p "hi"` (quoted argument) classify as `none` with a null `auditSkill`; the quote-safe `devin` dispatch is `denied:true` with no explicit executor mention, `denied:false` when the user names `cli-devin`, and the `pi` self-dispatch is `denied:true`.

---

## 4. EVIDENCE

Shared inspector unit suite:

```bash
npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot
```

```text
 Test Files  8 passed (8)
      Tests  356 passed (356)
```

Pi preflight suite:

```bash
npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot
```

```text
 Test Files  1 passed (1)
      Tests  32 passed (32)
```

Live in-process classification + Pi deny decision (real command run against the real modules, output read back verbatim):

```text
{"cmd":"\"devin\" -p \"task\"","kind":"direct","executor":"cli-devin","auditSkill":"cli-devin"}
{"cmd":"env KEY=v \"pi\" --offline -p \"x\"","kind":"direct","executor":"cli-pi","auditSkill":"cli-pi"}
{"cmd":"devin -p task","kind":"direct","executor":"cli-devin","auditSkill":"cli-devin"}
{"cmd":"\"devin -p task\"","kind":"none","executor":null,"auditSkill":null}
{"cmd":"echo \"devin\" -p \"hi\"","kind":"none","executor":null,"auditSkill":null}
--- deny ---
{"cmd":"\"devin\" -p \"task\"","kind":"direct","dispatchSkill":"cli-devin","denied":true}
{"cmd":"\"devin\" -p \"task\"","kind":"direct","dispatchSkill":"cli-devin","denied":false}
{"cmd":"\"pi\" --offline -p \"x\"","kind":"direct","dispatchSkill":"cli-pi","denied":true}
```

Reading of the evidence:

- The quote-safe executor `"devin" -p "task"` classifies as `direct cli-devin` and is audit-visible (`auditSkill: cli-devin`) — identical to the unquoted `devin -p task`. The env-wrapped quoted `pi` resolves through the `env KEY=v` wrapper to `direct cli-pi`.
- The two controls hold: a single quoted prose token (`"devin -p task"`) and a quoted argument to `echo` both stay `none`, so the normalization does not manufacture false positives.
- At the Pi gate, the now-`direct` quote-safe dispatch is denied when the user did not name the executor (the bypass is closed: an unauthorized quoted CLI can no longer slip through as `none`), allowed when the user explicitly named `cli-devin`, and a `cli-pi` self-dispatch is denied outright.

---

## 5. SOURCE FILES

- Shared inspector core: `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` (`inspectDispatch`, `matchDispatchShape`, `directExecutor`)
- Shared inspector unit suite: `.opencode/hooks/dispatch/lib/dispatch-audit.test.mjs`
- Pi authorization gate: `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` (`shouldDenyPiDispatch`)
- Pi preflight suite: `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts`
- Cross-runtime preflight twins (same shared inspector): `.opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs`, `.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs`, `.opencode/hooks/dispatch/devin/dispatch-preflight-lint.mjs`
- Observational audit twin (records only `direct`): `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` (`recordDispatch`) — see [cli-dispatch-audit-trail.md](../plugins-and-hooks/cli-dispatch-audit-trail.md)

---

## 6. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: cli-dispatch-preflight-authorization
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/cli-dispatch-preflight-authorization.md

---

## 7. PASS/FAIL

**PASS**

The shared inspector suite passed 356/356 and the Pi preflight suite passed 32/32. A live in-process run against the real modules classified the quote-safe executor `"devin" -p "task"` as `direct cli-devin` (audit-visible), resolved the env-wrapped quoted `pi` to `direct cli-pi`, and matched the unquoted `devin -p task` classification exactly — while a single quoted prose token and a quoted `echo` argument both correctly stayed `none`. The Pi authorization gate denied the quote-safe dispatch when the user named no executor, allowed it when the user named `cli-devin`, and denied the `cli-pi` self-dispatch. Every JSON line above was written by a real process invocation and read back; no fabricated output was used.
