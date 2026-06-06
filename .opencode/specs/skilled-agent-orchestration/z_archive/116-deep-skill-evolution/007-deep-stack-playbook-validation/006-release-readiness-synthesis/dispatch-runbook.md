# Dispatch Runbook — Deep-Loop Skills Playbook Validation (030)

Canonical execution methodology for running all 177 deep-loop playbook scenarios via cross-AI
dispatch. This is the single source of execution truth: a fresh session executing any phase
(001-005) follows this document without re-deriving methodology.

**Executors (operator-directed):**
- `cli-devin` SWE-1.6 — deterministic inspection (`rg`/`sed`/`node`/Vitest/`.cjs`+`python3` asserts). Free tier (no Pro quota).
- `cli-codex` GPT-5.5 medium-fast — A/B comparison, failure triage, cross-file reasoning, second opinions.

> **Contract reminder:** Before composing any prompt, `Read` `.opencode/skills/cli-devin/SKILL.md` and `.opencode/skills/cli-codex/SKILL.md`. SWE-1.6 dispatch MUST be composed via `sk-prompt` (RCAF + medium-density pre-planning, bundle-gate language **standard**). Consult `sk-prompt-small-model` for context-budget + verification recipes.

---

## 1. One-time auth pre-flight (before any dispatch)

```bash
devin auth status 2>&1   # expect authenticated; SWE-1.6 is free tier (works even at "Pro 0% remaining")
codex auth status 2>&1   # expect logged in / chatgpt-oauth, OR $OPENAI_API_KEY set
mkdir -p /tmp/qa/{prompts,verdicts,evidence}
```
If either auth is missing → surface `devin auth login` / `codex auth login` to the operator and **abort** (do NOT silently SKIP every scenario). Do not auto-login.

---

## 2. Execution order (dependency-driven, serial)

Single-dispatch discipline makes all CLI runs serial, so "phases" are dependency-ordered, not parallel.

```
001 deep-loop-runtime  →  002 deep-ai-council  →  003 deep-review  →  004 deep-research  →  005 deep-agent-improvement  →  006 synthesis
```

- **Within 001**, run `06--coverage-graph`, `07--script-entry-points`, `08--council` and capture verdicts **before** phase 002's `08--council-graph-integration` (DAC-019..026) and `09--value-comparison` (DAC-027..032). DAC-019..024 exercise `node .opencode/skills/deep-loop-runtime/scripts/{upsert,query,convergence,status}.cjs` — gate them on 001.
- **Sandbox/stress categories run LAST within their phase**: deep-review `07` (CP-052..057), deep-research `07` (CP-046..051), deep-agent-improvement `08` (CP-040..045).
- **Gating rule:** a FAIL in a foundational runtime primitive (e.g. DLR-006 atomic-state, DLR-016 query.cjs) pauses and surfaces to the operator before dependent categories run.

---

## 3. Batching strategy

**Unit = one playbook category per dispatch** (~40 dispatches, not 177). The executor reads every
scenario file in the category, runs each scenario's exact `## 3. TEST EXECUTION` commands from repo
root, and returns one verdict table.

- Sub-split any category with >8 scenarios or whose scenario-file + source-anchor read budget nears
  ~60K tokens (deep-review `03`, deep-research `04`).
- Mandated return format (every batch, both executors):

```
### BATCH VERDICTS: <skill>/<category-dir>
| Scenario ID | Verdict | Decisive command | Evidence excerpt (<=10 lines) | Anchor file:line | Notes |
|---|---|---|---|---|---|
...
### BATCH SUMMARY: <p> PASS / <pa> PARTIAL / <f> FAIL / <s> SKIP
```

Orchestrator collection: capture full stdout to `/tmp/qa/<skill>__<category>.log`; assert one row
per scenario (row count == category scenario count) + a summary line; re-dispatch once if malformed,
else mark the category `NEEDS-MANUAL` and continue.

---

## 4. Executor routing

| Scenario type | Executor |
|---------------|----------|
| Deterministic `rg`/`sed`/`node`/Vitest inspection; `.cjs`+`python3` JSON asserts (deep-agent-improvement) | **cli-devin SWE-1.6** (default) |
| A/B "graph vs no-graph baseline" comparison — deep-ai-council `09` (DAC-027..032) | **cli-codex GPT-5.5 medium-fast** |
| FAIL triage / root-cause from a scenario's Failure-Triage block | **cli-codex** |
| Contested-verdict adjudication, second opinions | **cli-codex** |

### SWE-1.6 dispatch (mandatory contract)
```bash
devin --prompt-file /tmp/qa/prompts/<skill>__<cat>.md \
  --model swe-1.6 --permission-mode auto \
  2>&1 </dev/null > /tmp/qa/<skill>__<cat>.log 2>&1 &
PID=$!
```
The prompt file MUST carry: RCAF role/context/action/format + an explicit **medium-density
pre-planning block** (3-4 ordered steps, each with an acceptance test + a verification command),
the exact scenario file paths, the Execution Policy ("execute for real, not mocked"), and the fixed
verdict-table format. Keep constraint/bundle-gate language **standard** (verbose constraints degrade
small-model output).

### Codex dispatch
```bash
codex exec "<prompt>" \
  --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" \
  --sandbox read-only \
  2>&1 </dev/null > /tmp/qa/<skill>__<cat>.log 2>&1 &
PID=$!
```
Use `--sandbox read-only` for inspection/comparison; `--sandbox workspace-write` only for a
sandbox-writing stress category (§7).

### Example SWE-1.6 prompt (deep-loop-runtime `04--state-safety`)
```
<framework>RCAF</framework>
<role>Deterministic manual-testing executor for deep-loop-runtime. Run exact playbook commands; report PASS/PARTIAL/FAIL/SKIP with reproducible evidence. Execute for real; never mock; SKIP only on a concrete sandbox blocker.</role>
<context>
Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
Category 04--state-safety scenario files (read in full):
  .opencode/skills/deep-loop-runtime/manual_testing_playbook/04--state-safety/atomic-state.md
  .../jsonl-repair.md  .../loop-lock.md  .../permissions-gate.md
Each file has a "## 3. TEST EXECUTION" block with exact bash: commands, Expected, Evidence, Pass/Fail.
Context budget: treat any `[... truncated N tokens]` marker as an intentional boundary; do not invent omitted content.
</context>
<pre-plan>
1. Read all 4 files; extract each scenario's literal commands + pass condition. Acceptance: list them per ID. Verify: re-print the command list before running.
2. Run each scenario's commands in ID order from repo root; capture stdout/stderr + exit code. Verify: echo exit=$? after each.
3. Compare observed output to Expected/Pass-Fail; assign PASS/PARTIAL/FAIL/SKIP; for FAIL re-run the decisive command once. Verify: each verdict cites a command + anchor file:line.
4. Emit the verdict table + summary. Verify: row count == 4.
</pre-plan>
<action>Execute the 4 state-safety scenarios and report verdicts.</action>
<format>Return ONLY the "### BATCH VERDICTS: deep-loop-runtime/04--state-safety" table (one row per DLR-006..009) + "### BATCH SUMMARY". Evidence excerpts <=10 lines. Standard constraints only.</format>
```

### Example Codex dispatch (deep-ai-council `09` A/B comparison)
```bash
codex exec "Council-graph value-comparison adjudicator for deep-ai-council. Repo root /Users/.../Public. For DAC-027..032 under .opencode/skills/deep-ai-council/manual_testing_playbook/09--council-graph-value-comparison/: (1) read each file; (2) run the no-graph baseline as written and record baseline file-read count + operator conclusion; (3) run the with-graph workflow translating tool: runtime query/upsert CLI calls into node .opencode/skills/deep-loop-runtime/scripts/{query,upsert}.cjs with the documented args; (4) judge PASS only if both return the same answer set AND the graph used materially fewer reads (>=10x), else FAIL with the divergence. Return ONLY the BATCH VERDICTS table + BATCH SUMMARY; evidence <=10 lines." \
  --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox read-only \
  2>&1 </dev/null > /tmp/qa/deep-ai-council__09-value-comparison.log 2>&1 &
```

---

## 5. Single-dispatch discipline (hard rule)

One `cli-*` dispatch at a time across the whole family. Per dispatch:
1. dispatch in background, capture `PID`;
2. `wait $PID` (or Monitor until-loop on `kill -0 $PID` — foreground `sleep` is blocked);
3. verify the log has a well-formed verdict table (row count == category count);
4. `pkill -9 -f "devin --print"` (devin) / `pkill -9 -f "codex exec --model"` (codex) + kill orphans;
5. poll until RSS drops; only then launch the next dispatch.

No parallel CLI dispatch without explicit operator authorization.

---

## 6. Spot-verification (anti-fabrication)

The CLI's claim is never the sole basis for a negative verdict. Per batch, the orchestrator
independently re-runs (directly via Bash, from repo root):
- the decisive command for **every FAIL and PARTIAL**, plus **one random PASS per category**;
- a `grep` of each cited anchor `file:line` to confirm the symbol/assertion exists;
- exit-code corroboration for `.cjs`/Vitest scenarios (e.g. IS-001 expects exit 0 and `summary.mirrorSyncStatus == "all-aligned"`).

If a re-run contradicts the claim → mark the scenario `CONTESTED`, record both outputs, escalate that
single scenario to Codex (read-only) for adjudication; **the orchestrator's observed result wins** the
ledger.

---

## 7. Sandbox handling (stress categories)

Applies to deep-review `07` (CP-052..057), deep-research `07` (CP-046..051), deep-agent-improvement
`08` (CP-040..045). Verified: each `setup-cp-sandbox.sh` uses `set -euo pipefail`, `rm -rf`s only its
own `/tmp/cp-*` dir, and rebuilds from repo root — blast radius is confined to `/tmp`.

1. Run these categories **last within their phase**, in their own dispatch.
2. Orchestrator (not the CLI) runs `bash .opencode/skills/<skill>/manual_testing_playbook/07.../setup-cp-sandbox.sh` first.
3. Dispatch pinned to the sandbox dir; SWE-1.6 stays `--permission-mode auto`; Codex uses `--sandbox workspace-write` **only here**.
4. Prompt forbids any path outside the sandbox dir; orchestrator spot re-runs target the sandbox too.
5. `rm -rf /tmp/cp-deep-*-sandbox` after verdicts captured (re-runnable: setup `rm -rf`s at start).

---

## 8. Evidence capture layout (scratch-canonical, in-repo)

**P1 (2026-05-27): evidence is scratch-canonical.** Durable evidence lives in each phase child's
in-repo `scratch/` (retained per CHK-051, never cleaned). `/tmp/qa/` is optional staging only —
nothing authoritative may live solely in `/tmp` (wiped on reboot). Mirrors the `029` predecessor.

| Path (under `<child>/scratch/`) | Contents |
|------|----------|
| `prompts/<TAG>.md` | composed dispatch prompt (devin `--prompt-file`; codex inline prompt mirrored here for audit) |
| `logs/<TAG>.log` | full dispatch stdout/stderr |
| `logs/<TAG>.verdicts.tsv` | parsed verdict table |
| `evidence/<id>.txt` | orchestrator's decisive command + excerpt + anchor for spot-checked scenarios |

Roll parsed rows into the phase child's `checklist.md` verdict ledger (flip `PENDING` → verdict,
add the `scratch/...` evidence path + anchor `file:line` + executor). Ledger Evidence cells MUST
cite in-repo `scratch/` paths, never `/tmp`.

---

## 9. Record + remediate (operator-confirmed model)

On a confirmed FAIL (after spot re-run):
1. Record FAIL + reproducing command + excerpt in the child ledger.
2. Create a remediation child `007+` under the parent (Gate 3 already satisfied by parent spec.md);
   number sequentially after the last existing child (mirrors `029`'s `004-008`).
3. In the remediation child: read → fix in scope → verify (re-run the failed scenario) → strict-validate.
4. Flip the original ledger entry to PASS with fix evidence; record the lineage in
   `release-readiness-matrix.md` (Remediation Lineage table).

---

## 10. Risk / time

- **Dispatch count:** ~40 category batches + ~5-10 Codex triage + ~2-4 re-dispatches ≈ **50-60 CLI dispatches** for 177 scenarios; orchestrator spot re-runs are local Bash (no CLI cost).
- **Time:** serial → multi-hour wall time. Mitigation: category batching, SWE-1.6 (free tier) for the ~50 inspection batches, Codex/Pro quota reserved for `09` + triage.
- **Risks + mitigations:** auth/quota → pre-flight + abort-not-skip; serialization → category batching + strict kill/RSS-drain between dispatches; verdict trust → mandatory spot re-run + anchor grep + exit-code check + CONTESTED escalation; sandbox safety → verified `/tmp`-only setup + run-last + cleanup; cross-skill drift → 001 gates 002's graph categories; small-model format non-compliance → fixed table contract + row-count assert + one re-dispatch + NEEDS-MANUAL fallback.

---

## Source contracts (read before composing prompts)

- `.opencode/skills/cli-devin/SKILL.md` (§3.1/§3.3 SWE-1.6 contract, RCAF, pre-planning, free tier)
- `.opencode/skills/cli-codex/SKILL.md` (§3.1/§3.3 gpt-5.5 medium + service_tier fast, sandbox modes)
- `.opencode/skills/sk-prompt-small-model/SKILL.md` (dispatch matrix, context-budget, verification recipes)
- Each skill's `manual_testing_playbook/manual_testing_playbook.md` (Execution Policy, global preconditions, release rules, wave guidance)
