---
title: "L8 True-Solution Investigation — Command Render-Contract Adherence"
description: "Fresh-eyes investigation: the 3/3 envelope failure was a probe-harness artifact (slash text is never expanded by `opencode run`); with the command actually delivered via --command, gpt-5.5 medium renders the envelope 3/3. Winner: fix the dispatch/probe protocol; runner-up: expansion-time mechanical renderer via shell injection."
trigger_phrases:
  - "true solution investigation"
  - "render contract probe harness artifact"
  - "opencode run command flag adherence"
importance_tier: "important"
contextType: "research"
---

# L8 True-Solution Investigation — Command Render-Contract Adherence

Investigator: fresh Fable 5 session, 2026-06-12. No stake in prior attempts. All probes run from repo root on opencode **1.17.4**, model `openai/gpt-5.5`, variant `medium`, per the documented dispatch contract (`</dev/null`, `--dir` pinned, ≤2 concurrent).

**Headline: the empirical gate is already met.** Three of three corrected probes of `/memory:search` on gpt-5.5 medium emitted the exact `MEMORY:SEARCH … STATUS=OK` envelope. The previous 3/3 failure (and my own 4/4 reproduction of it) was a **measurement artifact**: the probe protocol `opencode run "/memory:search …"` does not invoke the command runtime at all — the slash text is passed to the model as a raw string, and the 120-line router with its MUST-contract **never enters the model's context**. Every doc-only fix shipped against this failure was edited into files the probe harness never delivered. When the same files ARE delivered (`opencode run --command memory/search "…"`), the same mid-tier model complies.

---

## 1. Reproduction result — raw probe evidence

### 1a. Documented protocol (slash text in message): 4/4 FAIL, as reported

Three fresh probes (plus one with `--format json` for ground truth), identical form:

```bash
opencode run --model openai/gpt-5.5 --variant medium \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "/memory:search daemon lease heartbeat" </dev/null
```

| Probe | Output shape | `MEMORY:SEARCH` header | `STATUS=` footer | Read presentation asset? |
|-------|-------------|------------------------|------------------|--------------------------|
| 1 (`/tmp/l8-probe1.out`) | free prose ("Running the memory search… retrieval quality was marked weak") | NO | NO | NO — 6 tool calls, all MCP memory tools, zero `Read` |
| 2 (`/tmp/l8-probe2.out`) | free prose, same narrative | NO | NO | NO — 4 MCP tool calls, zero `Read` |
| 3 (`/tmp/l8-probe3.out`) | free prose | NO | NO | NO |
| 4 (`/tmp/l8-probe4-json.out`, JSON stream) | free prose | NO | NO | NO |

This exactly reproduces the disposition's result, including the signature "found a match but retrieval quality was weak → narrate" path. Probe 1 also showed the model fighting the raw MCP surface (empty-string optional `tier` rejected; `cursor` misused three different ways across retries) and then narrating its retry journey — mid-tier tool-ergonomics friction is real and visible.

### 1b. Ground truth: the command was never invoked

Probe 4's session was inspected directly in opencode's session store (`~/.local/share/opencode/opencode.db`). The user message for session `ses_14467e173ffea1B60qf4swvX0C` contains exactly one part:

```
text | 66 bytes | {"type":"text","text":"\"/memory:search daemon lease heartbeat\""}
```

A full-session scan for `MUST emit exactly`, `search_presentation`, or `EXECUTION ORDER` returns **0 rows**. The model never saw `search.md`, its inline MUST-template, or the presentation asset. Its actual trajectory: AGENTS.md Gate 1 (`memory_match_triggers` on the raw string) → Gate 2 (`advisor_recommend`) → loaded the **`system-spec-kit` SKILL** (39 KB) via the skill tool → ran `memory_search`/`memory_quick_search` → narrated. The "command" behavior we have been measuring is the model freestyle-reconstructing intent from AGENTS.md + advisor + tool schemas — with the render contract structurally absent.

`opencode run --help` confirms the mechanism: the `run` message is plain text; running a registered command requires the dedicated flag — `--command  the command to run, use message for args`. Repo commands ARE registered (slash-namespaced): the not-found error for a wrong name listed `memory/search`, `memory/save`, `doctor/speckit`, etc. The operator-facing name `/memory:search` maps to registry name `memory/search`.

### 1c. Corrected protocol (`--command`): 3/3 PASS on gpt-5.5 medium

```bash
opencode run --command memory/search --model openai/gpt-5.5 --variant medium \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "daemon lease heartbeat" </dev/null
```

Session-store verification for the first corrected probe: the injected user message IS the full `search.md` body (frontmatter stripped) with `$ARGUMENTS` substituted by `daemon lease heartbeat`.

| Probe | Result | Evidence file |
|-------|--------|---------------|
| 5 | PASS — envelope exact; two progress lines before the block; score `0.79` | `/tmp/l8-cmdflag3.out` |
| 6 | PASS — **pure envelope, zero narration**; score rendered `79.44` (normalization drift, see §7) | `/tmp/l8-cmdflag4.out` |
| 7 | PASS — envelope exact after two progress lines; score `0.79` | `/tmp/l8-cmdflag5.out` |

Probe 6 verbatim, in full:

```text
MEMORY:SEARCH "daemon lease heartbeat" intent=understand results=1
--------------------------------------------------
016-spec-memory-launcher-ownership-hardening/
  79.44  #9398  Feature Specification: mk-spec-memory launcher-ownership hardening (O6)

STATUS=OK RESULTS=1 INTENT=understand
```

Notable: in probes 5 and 7 the model's first visible act was "Reading the presentation contract first" — the shipped R1–R5 structure (Execution Order step 1, inline MUST-template, Presentation Boundary) demonstrably steers the model **once it is allowed to see it**. The model also hit `memory_context` session-field rejections in all three runs and still recovered to the documented fallback and the envelope.

### 1d. Mechanism proof: expansion-time shell injection is mechanical

A throwaway git project in `/tmp` (outside the repo; deleted after) with a command containing `` !`printf 'INJECT-START args=[%s] INJECT-END' "$ARGUMENTS"` `` was dispatched via `--command`. Session-store ground truth: the **user message already contained the printf output** before the model produced anything — the shell ran at template-expansion time, zero tool calls, and the model echoed the line. Two mechanics caveats discovered: (a) inside `` !`…` `` injections `$ARGUMENTS` expands like `"$@"` (each arg as a separate word — a renderer script must join `argv`), and (b) command files invisible to git (the operator's global gitignore excludes `/.opencode/`; the repo's tracked files are exempt) are also invisible to opencode's command discovery.

---

## 2. Root cause — why "doc-only contracts failed" here

**Primary (the artifact):** `opencode run "<slash text>"` performs no command expansion on opencode 1.17.4. The probe protocol therefore measured a model that had **never received the contract**, then concluded the contract was ineffective. Under this harness, NO amount of editing `search.md` or its presentation asset could ever change the outcome — the files are dead weight on that code path. The conclusion "mid-tier models do not honor exact output envelopes" was unfalsifiable as tested.

**Secondary (the real, smaller adherence story):** when the contract is delivered, gpt-5.5 medium honors it 3/3 — including on the weak-retrieval path that previously triggered narration. What actually remains at the model layer is slot-level looseness (score normalization `79.44` vs `0.79`; optional pre-envelope progress lines) and MCP tool-call friction (schema rejections of empty-string optionals) that pushes executors onto fallback retrieval routes. These are polish items, not contract collapse.

**Why doctor "worked" all along:** partially for the believed reasons (static short fenced blocks need no data-fill, so even a freestyle model that greps the file can copy them), but note that in raw-text probes doctor's YAML never executed either. The prior research program's structural diagnosis (proximity, brevity, fill protocol) is directionally sound and its R1–R5 fixes appear to be doing real work in probes 5/7 — but its evidence base (bare-command transcripts) was captured under the same broken harness, so its negative claims inherit the artifact.

---

## 3. Per-candidate evaluation

| Candidate | Implementable here (files) | Guarantees vs encourages | Blast radius | Maintenance | Generalizes? | Verdict |
|-----------|---------------------------|--------------------------|--------------|-------------|--------------|---------|
| **F. Fix the dispatch/probe protocol** (`--command memory/search`) | `cli-opencode` skill docs (`SKILL.md` §3 + `references/cli_reference.md`), L8 disposition correction, probe script | Guarantees the contract reaches the model — the precondition every other candidate silently assumed | Zero behavior code; doc + protocol only | Trivial; pin to opencode ≥1.17 `--command` semantics | Yes — whole command tree (memory/save, manage, learn, speckit/*, deep/*, doctor/*) | **WINNER** — 3/3 empirical pass with already-shipped doc fixes |
| **A. Mechanical post-processing via expansion-time injection** | `search.md` (+3 lines), new `commands/memory/scripts/render_search_envelope.cjs` (~120 LOC) calling `.opencode/bin/spec-memory.cjs` | **Guarantees** envelope bytes exist in context pre-model (proven §1d); model's job collapses to verbatim copy — the one task class mid-tier models already do reliably | Low — one command file + one new script; fallback marker keeps current flow when daemon cold (exit 75) | Script tracks tool output schema; warm-only policy applies | Read-path commands only (search retrieval, manage stats, analysis dashboards). NOT post-mutation displays (save) — data doesn't exist at expansion time | **RUNNER-UP** — the hardening layer if 3/3 is ever not enough (kills score-drift class too) |
| B. CI golden-fixture lint (R8) | new `scripts/rules/check-render-contracts.cjs` + `.github/workflows/render-contract-sync.yml` (pattern exists: `prompt-card-sync.yml`) | Encourages only — lints that inline template ≡ asset Section 2 and fixtures don't drift; **cannot observe live model behavior**; would NOT have caught this bug (the artifacts were fine; the harness was broken) | None at runtime | Low | Yes, all families | Keep as drift guard; do not call it the adherence fix |
| C. Tool responses that ARE the envelope | `mcp_server/spec-memory-cli.ts` (`renderPayload` is currently generic summary/message extraction — no envelope mode exists) or a per-command renderer (collapses into A) | If model-mediated (MCP result → model → display), still encourages; only the A-style injection makes it mechanical. CLI `--format text` extension is shared-infra surgery (build + `cli-offline-smoke` contract tests) for one command family's display concern | Medium — shared daemon CLI touched | Medium | Awkward — envelope is per-command UI, CLI is shared transport | Fold into A as the data-fetch step; don't put presentation in the shared CLI |
| D. Memory-family YAML workflow assets (R7) | `commands/memory/assets/*_workflow.yaml` ×4 + router edits | Encourages only — YAML steps are still prose instructions to the same executor; in every probe here, no family's YAML influenced raw-text dispatches (it was never loaded), so the doctor-YAML-causes-adherence theory is unsupported by this evidence | Medium | Highest of all options (4 new YAML contracts to keep true) | Yes, by symmetry | DEMOTE — architectural tidiness, not an adherence mechanism. Do later for parity if wanted |
| E. Envelope mandatory at low confidence (STATUS channel for uncertainty) | `search.md` + `search_presentation.txt` Section 2/3 (~10 lines) | Encourages; but the corrected probes show the model already keeps the envelope on weak retrieval once the contract is present | Trivial | Trivial | Yes | Worthwhile 10-line polish (sanctioned `STATUS=OK CONFIDENCE=low` or similar), not the lever |

Blunt negative results: **B and D were the disposition's "real levers" and neither addresses the actual failure.** B lints artifacts that were already mutually consistent; D adds prose-in-YAML for an executor that wasn't receiving prose-in-markdown. Both would have shipped, the broken probe would have re-run, and the result would have been a fourth round of 3/3 "failure".

---

## 4. Ranked recommendation

1. **WINNER — F: correct the invocation/probe protocol and codify it.** The render contract already holds 3/3 on gpt-5.5 medium when the command is actually run. Ship the protocol fix (below), re-mark the L8 disposition as harness-invalidated, and stop treating the contract as "advisory for mid-tier executors" — that claim is now empirically false for the only correctly-measured runs we have.
2. **RUNNER-UP — A: expansion-time mechanical renderer** (`` !`node …/render_search_envelope.cjs $ARGUMENTS` `` + "display the pre-rendered block verbatim; if it shows RENDERER:UNAVAILABLE, follow the retrieval procedure below"). Adopt only if a future gauntlet shows slot drift (e.g. the `79.44` score) is operationally unacceptable, or when running executors weaker than gpt-5.5 medium. It is proven feasible (§1d) and is the only candidate that makes the envelope **bytes-guaranteed** rather than model-honored.

Not recommended as adherence fixes: D (parity only), C-as-shared-CLI-feature (wrong layer), B (drift guard only — still worth having), E (10-line polish, fold into the next doc touch).

---

## 5. Implementation sketch (winner, with runner-up appendix)

**F1 — cli-opencode dispatch contract** (`.opencode/skills/cli-opencode/SKILL.md` §3 "Core Invocation Pattern" + `references/cli_reference.md`; ~15 lines):
- New rule: *Slash-command text in a `run` message is NOT expanded — opencode passes it to the model as raw prose. To execute a registered command non-interactively: `opencode run --command <family>/<name> [flags] "<args>"` (args become `$ARGUMENTS`). Registry names use slash namespacing (`memory/search` for `/memory:search`); list via the not-found error or config.*
- Note the `$ARGUMENTS`-expands-like-`"$@"` behavior inside `` !`…` `` template injections.

**F2 — probe protocol artifact** (`L8-command-adherence/probe.sh`, ~25 LOC): the canonical 3-probe gauntlet from §6 below, with the old raw-text form preserved as a labeled **negative control** so the artifact can't silently return.

**F3 — disposition correction** (`L8-command-adherence/disposition.md`): add a superseding anchor: result re-classified from "doc-only fixes failed on mid-tier" to "probe harness never delivered the command; corrected protocol passes 3/3". Keep the shipped R1–R5 edits (probes 5/7 show them steering).

**F4 — stale-placeholder sweep** (one-line check, optional): `doctor/speckit.md` ends with `User request: {{args}}` — `{{args}}` is not an opencode placeholder and will be injected literally; switch to `$ARGUMENTS` on next doctor touch. Verify no other family router uses `{{…}}` forms.

Total: ~40 lines of docs/scripts, zero behavior code, zero risk to doctor.

**A (runner-up appendix), if/when hardening is wanted:**
- New `.opencode/commands/memory/scripts/render_search_envelope.cjs` (~120 LOC): join `process.argv` → query; empty or analysis-subcommand first token → print nothing (router flow proceeds); else `spawnSync node .opencode/bin/spec-memory.cjs memory_quick_search --json '{"query":…,"limit":10}' --warm-only --format json --timeout-ms 3000`; exit 75/error → print `RENDERER:UNAVAILABLE`; else print the exact envelope (header, divider, leaf-grouped `score #id title` rows with score forced to 2-decimal 0–1, STATUS footer).
- `search.md` +3 lines under RETRIEVAL MODE: the injection line, "if a pre-rendered `MEMORY:SEARCH` block appears above, output it verbatim and stop", and the UNAVAILABLE fallback rule.
- Generalizes to `manage` stats (read-only `memory_stats`) with a sibling script; **not** to `save` (post-mutation data).

---

## 6. Falsifiable acceptance test

Run from repo root, sequentially or ≤2 concurrent, fresh sessions (no `--continue`):

```bash
for i in 1 2 3; do
  opencode run --command memory/search --model openai/gpt-5.5 --variant medium \
    --dir "$PWD" "daemon lease heartbeat" </dev/null > /tmp/l8-gauntlet-$i.out 2>&1
done
```

**PASS criteria — all three outputs must contain, in order:**
1. a line matching `^MEMORY:SEARCH "daemon lease heartbeat" intent=[a-z_]+ results=[0-9]+$`
2. the `--------------------------------------------------` divider
3. at least one leaf-folder group line ending `/` followed by ≥1 result row matching `^  [0-9.]+  #[0-9]+  .+$`
4. a final status line matching `^STATUS=OK RESULTS=[0-9]+ INTENT=[a-z_]+$`

Pre-envelope progress prose is tolerated; missing header or footer in ANY probe = FAIL. If the A-hardening is shipped, additionally require the score field to match `^0\.[0-9]{2}$` and the envelope to equal the renderer's stdout modulo trailing whitespace.

**Negative control (must keep failing, documented):** `opencode run --model openai/gpt-5.5 --variant medium --dir "$PWD" "/memory:search daemon lease heartbeat" </dev/null` — expected to produce prose, because the command runtime is not invoked. If THIS ever starts passing, opencode has changed `run`-message semantics; re-pin the protocol note.

This investigation's own runs of that gauntlet: **3/3 PASS** (raw outputs `/tmp/l8-cmdflag3.out`, `/tmp/l8-cmdflag4.out`, `/tmp/l8-cmdflag5.out`; failing negative controls `/tmp/l8-probe{1,2,3}.out`, `/tmp/l8-probe4-json.out`; session-store ground truth quoted in §1b/§1c).

---

## 7. Open risks

- **TUI parity untested.** Interactive TUI slash invocation presumably uses the same template expansion as `--command`, but this was not verified non-interactively. One manual TUI check recommended; if the TUI also sends raw text in some path, the F-fix scope widens.
- **Version coupling.** `--command` semantics and `!`-injection behavior verified on opencode 1.17.4 only. The cli-opencode skill pins 1.3.17 as baseline elsewhere — the protocol note should record the verified version, and the negative control in §6 doubles as a drift tripwire.
- **Score-slot underspecification.** The contract's `<score>` slot carries no format rule; probe 6 rendered `79.44`. One-line spec fix ("0–1, two decimals") or the A-hardening eliminates the class.
- **MCP tool-call friction for mid-tier executors.** All corrected probes hit `memory_context` rejections on empty-string optional fields before recovering. This costs turns and is the most likely future source of fallback-path weirdness; consider server-side accept-and-strip for empty optional strings (separate packet — touches `mcp_server` validation).
- **Raw-text dispatch remains an open door.** Any external dispatcher that sends `"/memory:search …"` as a plain message re-enters the measured failure mode, and no command-file edit can ever fix that path. Mitigation is the F1 doc rule; a stronger guard (an opencode plugin that detects a leading-slash message matching a registered command and rewrites or warns) is speculative and unvalidated here.
- **Single-query evidence.** All passes used one query against one matching record. The 3-probe gauntlet should occasionally rotate queries (including a zero-result one to exercise the Section-3 empty-result envelope) before declaring family-wide victory.
- **Prior research provenance.** R1–R5's measured "failure" is invalidated, but so is any *positive* claim sourced from the same transcripts (including parts of the doctor-wins narrative). Treat the 006 research packet's behavioral claims as unverified until re-run under `--command`; its structural/static-vs-dynamic analysis stands on its own.

INVESTIGATION: COMPLETE
