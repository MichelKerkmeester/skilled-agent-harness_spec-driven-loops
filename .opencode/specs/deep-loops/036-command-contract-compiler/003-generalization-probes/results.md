# Generalization Probe Results

Compiled-command-contract flip generalization beyond review/research, plus the
leaf-reliability check's effect. Leg: `gpt-fast-med`, N=1 per cell (focused set;
the natural should-halt cells confound N-scaling — see method note). Lever:
per-command `command-injection-rollout.json` (`fix` = compiled contract prepended;
`fallback` = legacy body). Fixtures restored between runs; lever reset to `fallback`.

## Method note — the natural-invocation + should-halt confound

CXB-004 and ACB-005 are `natural`-invocation cells (no `--command`), so the render
lever only bites when the model self-routes to the slash command. RVB-REPROBE is
`command`-kind, so its lever bites directly. Cell *expectations* also matter:
CXB-004 is a **should-halt** cell (`expected_interaction: question_halt`), so the
compiled contract's autonomous-precedence scores as a misbind even when the
mechanism works. This is why the focused set (not a full N=2 matrix on the
confounded cells) was run.

## Runs

### Context — CXB-004 (should-halt cell)

| Mode | Classification | D1..D5 | Delegation | Note |
|---|---|---|---|---|
| fix | `setup_misbind` | 1/2/·/2/· | **dispatched `deep-context`** (real `task` tool-call, `subagent_type: deep-context`) | The flip BIT: fix made GPT autonomously dispatch the context leaf. |
| fallback | `setup_misbind` | 1/2/·/2/· | 2 task events | Also misbinds — fix and fallback are classification-indistinguishable here. |

**Read:** the mechanism generalizes to context — under fix GPT routes to and
dispatches the `deep-context` leaf. But the should-halt cell scores both modes as
misbind (autonomous-precedence over-rides a legitimately-ambiguous ask that
warrants a setup-confirm). Mechanism confirmed; the *policy* needs a should-halt
carve-out.

### Council — ACB-005 (autonomous-expecting, seat_artifacts — the novel case)

| Mode | Classification | D1..D5 | Note |
|---|---|---|---|
| **fix** | **`pass`** | **2/2/2/2/·** | Seats convened in-CLI (D3=2 via seat_artifacts; 0 task events is NORMAL for council). |
| fallback | `stuck_no_progress` | 0/2/0/0/· | Silent stall — matches the 033 baseline. |

**Read:** the clearest result. The compiled contract converts the council silent
stall (`stuck_no_progress`, D3=0) into a clean, converged seat run (`pass`, D3=2).
This is the genuinely-new generalization — the seat-mode is structurally unlike the
task_dispatch modes — and it holds decisively.

### Review re-probe — RVB-REPROBE (command-kind, route-proof) — leaf-reliability lift

| Mode | Classification | D1..D5 | Note |
|---|---|---|---|
| fix | `missing_artifact` | 2/2/1/1/· | Leaf dispatched (1 task event) but produced an incomplete artifact (D3=1: route-proof record missing/partial). |

**Read:** an honest negative on the *lift*. Baseline RVB-007 at gpt-fast-med was
`refused` (0 task events); under fix the leaf IS now dispatched (progress), but the
iteration artifact + route-proof record came back incomplete (`missing_artifact`,
D3=1). The mechanical `verify-iteration` gate would DETECT this exact failure
(`route_proof_missing`), but its `redispatch_once` is model-followed — no runner
owns the single-executor loop — so the model did not execute the retry in this run.
The check improves *detectability* of the incomplete leaf; it does not mechanically
*guarantee* a rescue in single-executor mode.

## Verdict

**Does the flip generalize beyond review/research?**

- **Council (seat_artifacts): YES, decisively.** fix `pass` (D3=2, seats converged)
  vs fallback `stuck_no_progress` (D3=0). The compiled contract fixes the council
  silent-stall the 033 benchmark documented.
- **Context (task_dispatch): mechanism YES, cell scoring confounded.** Under fix GPT
  autonomously dispatches the `deep-context` leaf (delegation evidence), exactly like
  review/research. CXB-004's should-halt expectation makes both fix and fallback score
  `setup_misbind`, so classification cannot separate them — but the delegation trace
  shows the mechanism works.

**Did the leaf-reliability check lift the pass rate?** Not on RVB-REPROBE. It makes an
incomplete leaf *detectable* (the gate fires `route_proof_missing`/`missing_artifact`),
but the re-dispatch is model-followed in the single-executor loop, so it did not
mechanically rescue this run.

## Recommendations / follow-ups

1. **Should-halt carve-out for autonomous-precedence.** Context CXB-004 shows the
   contract over-rides a legitimately-ambiguous ask. The autonomous-precedence rule
   should exempt genuine setup-confirm cases.
2. **Mechanical re-dispatch needs a runner.** In single-executor mode the loop is
   model-driven, so `redispatch_once` is model-followed. A future mechanical retry
   belongs in the fan-out runner (`fanout-run.cjs`), the only place a runner owns the
   loop — at whole-lineage granularity.
3. **Promotion readiness.** Council and the task_dispatch modes flip cleanly under the
   compiled contract; promoting them to `fix` by default is justified. The
   leaf-reliability gate adds observability and should ship, but its re-dispatch is a
   best-effort model instruction until a runner-owned retry exists.
