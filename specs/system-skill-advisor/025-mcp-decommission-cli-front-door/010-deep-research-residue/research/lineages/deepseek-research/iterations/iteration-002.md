# Iteration 2: The detection surface — which checks would have failed, and in what order

## Focus

For each property and each member found in iteration 1, identify the check that would have failed at promotion time, and grade each candidate by the artifact it reads, the failure it produces, and its cost. The packet supplies an unusual amount of material for the grading: three harnesses that existed before the promotion and none of which caught the cluster, plus the one method that did catch a sibling member.

## Findings

### 1. The structural reason the cluster survived: three harnesses, none scoped to the seam

The latent path sat in a *composition* of two components, and every existing harness was scoped to one of them.

| Harness | Subject | Boundary it draws |
|---|---|---|
| 003 parity harness | `bin/skill-advisor.cjs` and `bin/system-skill-advisor-launcher.cjs` (`003-cli-front-door-parity/parity/cli-vs-mcp-parity.cjs:35,40-44`) | CLI binary and MCP/launcher entry |
| Hook suites | `handleClaudeUserPromptSubmit` with a **stubbed producer** — e.g. "emits full fallback context when Python is unavailable" (`runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:209`) | hook logic, producer mocked |
| Fallback envelope test | one case, asserting the *shape* of the normalized envelope (`runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts:9-10`) | the envelope transform |

The path that had never run is the composition the hook suites stubbed out and the parity harness never entered — the hook's helper spawning the CLI. Phase 3's own summary is the cleanest statement of it: "Phase 3 proved the CLI binary, not this helper" (`004-caller-rewire/goal.md:117`).

The generalisation is more useful than the instance: **a fallback lives in a seam by construction, because its trigger is another component's failure.** Component-scoped coverage therefore exhibits a systematic blind spot at exactly the place fallbacks live. Every harness above is *good* and each one passed, which is why their combined green was not evidence about the seam.

### 2. The candidate checks, ordered so the cheapest fails first

| # | Check | Member it catches | Artifact it reads | Cost | Where it belongs |
|---|---|---|---|---|---|
| 1 | **Execution census** — has this path ever returned success? | any member (triage) | run logs / event counters | ~zero | promotion gate |
| 2 | **Derivation equality** — the fallback's resolved value equals the owner's resolved value, for two different inputs | M1 | the owner module's function | unit, no daemon | CI |
| 3 | **Budget floor** — the effective timeout is at least the measured p50 of the call it makes | M2 | one stored latency number | unit + 1 constant | CI |
| 4 | **Negative-path latency bound** — absent socket and refused connection return within a small bound | M4 | no daemon at all | unit | CI |
| 5 | **Degraded-content assertion** — the degraded answer carries the full observable shape, not merely `status ok` | M5 | a captured degraded payload | unit + fixture | CI |
| 6 | **Invocation inversion + byte diff** — run the fallback as the primary and diff the observable against the primary's output | M3, M6 | both versions, one worktree | scratch worktree + harness | promotion commit |
| 7 | **Three-daemon-state proof** — warm, cold, unreachable, each with its expected output | M3, M4, M5 end to end | real daemon lifecycle | daemon control | release gate |

Checks 1-5 are cheap in the strong sense: none of them needs a daemon, a worktree, or another checkout, and each one fails on a single assertion. Check 6 is the only one in the list with a **proven catch in this packet** — it is the method that found F19 — and it is also the only one that needs an artifact the loop must have captured beforehand (the pre-change baseline, `004-caller-rewire/goal.md:105`). Check 7 is what 004 actually ran to close the phase (cold 1975 ms full brief, warm 759-1039 ms, unreachable 403 ms `Advisor: stale; use sk-code 0.95/0.20 pass.`, `004-caller-rewire/goal.md:106,115`); it is the most expensive and the most complete.

### 3. Why check 2 must assert an equality and not a value — the packet contains the counter-example

The defective revision resolved its own socket path (`e8d564ca98^:.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:210-216`):

```
210:  const socketDir = env.SPECKIT_IPC_SOCKET_DIR;
214:  // Hooks do not inherit SPECKIT_IPC_SOCKET_DIR; default to the same short
215:  // /tmp directory the CLI shim uses so the probe targets the live socket.
216:  return join(resolve(socketDir ?? DEFAULT_SOCKET_DIR), SOCKET_FILE_NAME);
```

A test asserting the *literal* value at line 216 would have passed on the defective revision, because that is exactly what the code did. The check that fails is one that compares two independent derivations of the same value for the same input. The owner already has the complementary test — `runtime/tests/launcher-ipc-bridge-probe.vitest.ts:320-321` asserts two different database dirs produce two different socket paths — so the missing half is the cross-seam equality, not the derivation itself.

This packet also contains the general form of the mistake. 003's first frozen input set "carried prose descriptors (`promptLength`, `omitWorkspaceRoot`, `forceUntrusted`) in the args object as if they were real arguments. The harness passes args literally, so those cases tested required-argument errors instead of what they claimed" (`003-cli-front-door-parity/goal.md:38`). Both are one error: **an expectation derived from the implementation cannot catch an implementation error.** It can only catch a regression against the implementation's own belief.

### 4. The pre-flight probe is what made the dead path look careful

The pre-fix helper probed before calling: `probeWarmDaemon` resolved the path and, at line 229, `if (!socketPath.startsWith('tcp://') && !existsSync(socketPath)) return { ok: false, socketPath, reason: 'socket_absent' }` (`e8d564ca98^:...:224-230`). Because the derived path was always the flat one and the real socket was always scoped, `existsSync` was always false, so the fallback returned `socket_absent` before ever spawning the CLI.

This is the sharpest mechanism in the packet, and it is worth stating separately from M1: **the check converting a wrong premise into a guaranteed short-circuit was local.** A pre-flight probe that duplicates the derivation cannot detect its own duplications — it converts a wrong belief into a fast, well-labelled refusal. The corresponding general rule: a pre-flight probe must ask the *owner* (here, the bridge's `getIpcSocketPath`) rather than reimplement it, or it is an amplifier for any premise error.

### 5. The comment was a defect report that got read as documentation

The pre-fix code carried the premise in writing: "Hooks do not inherit SPECKIT_IPC_SOCKET_DIR; default to the same short /tmp directory the CLI shim uses so the probe targets the live socket" (`e8d564ca98^:...:214-215`). The first clause is true, the inference is false, and the sentence was read as an explanation for behaviour rather than as a statement that the path's premise was unverified — which is why 004's own finding reads it as an admission: "Its own comment admits hooks do not inherit the socket-dir variable" (`004-caller-rewire/goal.md:117`).

That yields a cheap reading-based detector for this class, listed separately from the assertion checks because it needs no harness at all: **in a path that only runs on failure, a comment that justifies the path's premise is a place to verify the premise.** Hedging vocabulary — "does not inherit", "assumes", "in practice", "should already" — marks the exact line where the author knew an assumption was load-bearing. Its cost is a targeted read of the fallback, not a full audit, and its yield in this packet would have been immediate.

### 6. What the class's three properties imply about the check set

Mapped against iteration 1's properties, the checks are not interchangeable and none of them alone is sufficient:

| Property | What defeats it | Why nothing weaker works |
|---|---|---|
| Order-gated execution | invocation inversion (6) or a forced-failure env knob | a test that never triggers the path leaves the execution count at zero, which is the property itself |
| Unverified preconditions | derivation equality (2), budget floor (3) | a value assertion re-encodes the premise; only a comparison against the owner is independent |
| Masked failure | degraded-content assertion (5), three-state proof (7) | a status assertion sees the expected degradation and passes |

Check 1 (execution census) sits outside the mapping because it does not defeat a property; it tells you whether the other checks are even testable. Its output in this packet would have been a single line — the helper's recorded outcomes are all `socket_absent` — and that line is enough to know the fallback has never succeeded in the field.

## Sources Consulted

- `../../../../004-caller-rewire/goal.md:103,105,106,113,114,115,116,117,118,119,122` — byte-identical brief check, before-image baseline, three-state proof, F16-F21
- `../../../../003-cli-front-door-parity/goal.md:30-40` — parity run result and the corrected frozen input set
- `../../../../003-cli-front-door-parity/parity/cli-vs-mcp-parity.cjs:25-56,244-262,379` — harness subjects and spawn discipline
- `../../../../003-cli-front-door-parity/parity/verdict.md:24-33` and `parity/report.json:1-6` — 22 cases, 7 matched, 15 allowlisted, 0 differed
- `git show e8d564ca98^:.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:210-216,224-250` — the pre-fix derivation, the premise comment, the `existsSync` pre-flight probe
- `.opencode/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts:9-10` — the single envelope test
- `.opencode/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:99-150,209,225` — hook-suite boundaries and stubbed producer
- `.opencode/skills/system-spec-kit/runtime/tests/launcher-ipc-bridge-probe.vitest.ts:15-16,320-321` — the owner's two-input derivation test
- `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:76,145-158,242-246,307-309` — the fixed form of M2/M3/M5

## Assessment

- **newInfoRatio: 0.75**
- **Novelty justification:** Iteration 1 established the class and the members; this iteration's new content is the seam-scoping explanation for why three good harnesses missed it, the seven-check cost ladder with the member each one catches, the counter-example proving a value assertion would have passed on the defective revision, and the pre-flight-probe amplification mechanism — none of which is in the packet record.
- **Confidence:** High for §1, §2 and §3 (each backed by a file or a quoted line), and for §4 (the pre-fix source is read directly from git). Medium for §5's generalization: the comment is verified, its causal role in the miss is inferred from the fact that the finding itself quotes it as an admission.
- **Evidence gap:** Cost estimates for checks 6 and 7 are structural, not measured — I did not build the inversion harness or drive the daemon through three states, so "expensive" is argued from what each check requires, not from a clock.

## Reflection

- **Worked:** Grading checks by *the artifact they must already have*. That criterion separates the cheap five from the expensive two more honestly than a time estimate, and it explains why the one check with a proven catch (6) is the one that needs a captured before-image.
- **Worked:** Reading the pre-fix revision from git rather than reasoning about what a buggy version would look like. The duplicate derivation, the premise comment and the `existsSync` short-circuit are three separate mechanisms, and none of them is visible in the post-fix file.
- **Failed / ruled out:** Treating the parity harness as a coverage gap that a broader harness would close. Ruled out: the harness's allowlist exists because the two surfaces genuinely differ (`003/goal.md:41` F12), so widening its subject to the hook would have required it to model the seam's semantics, not just add cases. The right instrument is a cross-seam equality assertion, which is smaller than the harness, not larger.
- **Failed / ruled out:** Assuming a test asserting the helper's socket path would have caught M1. Ruled out by §3: the literal in the defective revision is what such a test would have asserted.
- **Method note:** Comparing two *counts* across the phase's own artifacts already shows the record's habit of carrying one fact under two labels — `report.json` says `allowlisted: 15, differed: 0` while `verdict.md` labels the same 15 as "Differing". Held for the record-consistency iteration.

## Recommended Next Focus

Iteration 3: switch from the failure class to the residue side of the question. Build the residue inventory from the phases that produced it — 001's F3 (env blocks outliving their declarations) and F4 (cross-package hardcoded path), 005's deletion blockers and deregistration, 006's rename reference classes and its five recorded decisions to *leave* something, 007's sweep counts and retained-name decision. For each class, name the carrier file and the referent that no longer exists, and separate what the packet found from what it decided to keep. Deliverable: a residue table with a `found by` column naming the instrument (grep, failing test, generator, human reading) so iteration 4 can finish the tooling-versus-reading split.
