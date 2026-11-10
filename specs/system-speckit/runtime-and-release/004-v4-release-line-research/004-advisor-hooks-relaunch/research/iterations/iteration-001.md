# Iteration 001 — Advisor transport and parity

## Focus

Advisor transport and parity: (1) any advisor MCP server or tool registration left behind, (2) the CI script that compares the Python advisor with the Node advisor and whether it still runs, (3) the daemon start and lock code — how two launchers share one daemon and what degraded mode returns.

## Actions Taken

1. Scanned `.utcp_config.json` and `opencode.json` for advisor MCP entries, then swept `.skilled`, `.claude`, `.codex`, `.opencode`, `.pi` and `.dsh` for advisor-named MCP servers and tool registrations. Enumerated the `system-skill-advisor` file tree (76 files).
2. Located the Python advisor (`runtime/scripts/skill_advisor.py`, 242 KB) and searched the whole tree for parity wiring. Read `.github/workflows/skill-advisor-stress.yml` in full and `.github/workflows/routing-registry-drift.yml` in full.
3. Read the launcher (`system-skill-advisor-launcher.cjs`) env bootstrap and lease/lock surface, and diffed `.skilled/bin/skill-advisor.cjs` against its `.opencode` twin.
4. Read `feature-catalog/python-compat/cli-shim.md`, `feature-catalog/cli-surface/compat-entrypoint.md` and `tests/compat/python-compat.vitest.ts` to see what "compatibility" actually asserts.
5. Ran a live four-prompt comparison of the two front doors, then re-ran prompt 3 through `--force-native` and through the approved-divergence ledger to separate a real parity defect from a degraded-scoring artifact.

## Findings

### f-iter001-001 — P1, bug: the two front doors disagree on the same prompt, and the divergence is not in the approved ledger

`node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "add a changelog for this packet"` ranks **sk-doc** first. `python3 …/scripts/skill_advisor.py --force-native "add a changelog for this packet"` ranks **system-spec-kit** first. `--force-native` exits 2 when the native advisor is unavailable, so the Python result came from the native path, not from its local scorer — a fallback artifact is ruled out. The approved-divergence ledger contains zero occurrences of "changelog", so this is an unledgered divergence of exactly the kind v4.0.0.7 claims CI now catches.

The prompt is the one case v4.0.0.16 calls out by name ("a request such as 'write a changelog for this packet' … the skill advisor now ranks sk-doc's changelog mode first"). The Node front door honors that rule; the Python front door does not. Three of the four prompts I ran agreed (sk-code/sk-code, sk-doc/sk-doc, sk-code/sk-code), so the disagreement is confined to the redirect/precedence layer rather than the base scorer.

Introduced: the gap is as old as the shim's native bridge, and the specific routing expectation dates from v4.0.0.16.
Confidence: high that the divergence is real and reproducible; medium on root cause (the CLI handler applies a post-scoring redirect/priority that `recommend_with_native_advisor()` in the shim does not reach).
Sources: [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5590], [SOURCE: .skilled/bin/skill-advisor.cjs:26], `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json`, [SOURCE: .skilled/changelog/skilled/v4.0.0.16.md:238]
Verify:

```
node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "add a changelog for this packet" --format json | head -30
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-native "add a changelog for this packet" | head -30
```

### f-iter001-002 — P1, bug (gate gap): the CI parity ratchet is wired, but it cannot see a front-door divergence

The v4.0.0.7 pledge holds structurally: `routing-registry-drift.yml` runs a blocking step, "Local-vs-native divergence ratchet", which fails on any divergence missing from the approved ledger or any ledger entry that no longer matches. It is enrolled under `SKILLED_CI_TESTS` and path-filtered on `runtime/**`, so it is not orphaned.

What it compares is the **local Python scorer** against the **in-process native scorer**, top-1 per prompt. Both sides of that comparison are internal scorer functions. Neither side is a front door, so a divergence created *above* the scorer — between the CLI handler's native call and the shim's native call — is invisible to the gate by construction. That is the shape of f-iter001-001, and it is why a P1 defect reaches a green CI.

A second, weaker gate carries the "Python compatibility" name: `tests/compat/python-compat.vitest.ts` spawns the Python suite and asserts only `fail=0` from its own stdout. It never compares an output to the Node advisor, so its name promises more than it checks.

Introduced: v4.0.0.7 (the ratchet), with the front-door blind spot present from the start.
Confidence: high (workflow and test bodies read in full).
Sources: [SOURCE: .github/workflows/routing-registry-drift.yml:297], [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/compat/python-compat.vitest.ts:19]
Verify: `rg -n "local-native-divergence-ratchet" .github/workflows/routing-registry-drift.yml` and read what the two sides of the comparison import.

### f-iter001-003 — P2, over-engineering / inconsistent policy surface: two front doors, one applies repo policy defaults

`system-skill-advisor-launcher.cjs` sets `SPECKIT_ADVISOR_DOC_TRIGGERS=true` and `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT=trusted` when the environment is silent, and documents that these are repo policy rather than code policy. `.skilled/bin/skill-advisor.cjs` — the binary v4.0.0.0 names as "the front door" — applies neither; it only defaults `SPECKIT_IPC_SOCKET_DIR`, and its `.opencode` twin is byte-identical. So the documented front door scores with doc triggers off and trust untrusted unless the operator exports the variables, while a launcher-started session scores with both on. Two of my four probes (`--trusted` versus no flag) returned different ranking content for the same prompt, which shows the env values are load-bearing rather than cosmetic.

This is the over-engineering read: two entry paths, one policy table. Consolidating the `REPO_ENV_DEFAULTS` block into a module both entry points require would remove the divergence and break nothing — the launcher keeps its behavior, and the CLI gains the policy the repo already declared. What breaks if left alone: any routing rule gated on trust stays unreachable through the Python shim too, which has no `--trusted` flag at all (its usage line offers `--force-local`, `--force-native`, `--threshold` and nothing trust-related).

Introduced: v4.0.0.0 (the CLI-only cutover), policy block added later.
Confidence: medium-high.
Sources: [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:83], [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:145], [SOURCE: .skilled/bin/skill-advisor.cjs:26], [SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:46]
Verify: `env -u SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT -u SPECKIT_ADVISOR_DOC_TRIGGERS node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "add a changelog for this packet" --format json` versus the same through the launcher.

### f-iter001-004 — P2, canon misalignment: a comment-hygiene violation survives the comment-hygiene gate

`python-compat.vitest.ts` carries `// drift: verified against shipped behavior during Unit H` — an ephemeral unit label in a code comment, which the repository's Comment Hygiene hard block forbids outright (the durable WHY belongs there, the unit tag does not). `.github/workflows/comment-hygiene.yml` exists and would be expected to catch this class; it evidently does not, either because "Unit H" is outside its pattern set or because this file is outside its glob.

Second-order drift from the same file: it resolves its target path as the literal `.skilled/skills/…/tests/python/test_skill_advisor.py` and asserts on `Summary: pass=` / `fail=0` — a string match on a summary line, which is the least durable contract available.

Introduced: pre-v4 (the file predates the release line); the gate that should have caught it landed with the v4 line.
Confidence: high on the violation, medium on which gate should own it.
Sources: [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/compat/python-compat.vitest.ts:19]
Verify: `rg -n "Unit H" .skilled/skills/system-skill-advisor/runtime/tests/`

### f-iter001-005 — P2, drift (release note vs code)

v4.0.0.7 states: "The Python advisor also stays on the native scorer after the advisor daemon idles out, where it used to fall back to a local scorer without these rules." The control flow does not support that as written. `should_try_native = not args.force_local` is followed by a probe; **if the probe reports unavailable and `--force-native` was not passed**, the code emits `_warn_native_fallback(probe)` to stderr and then calls `analyze_prompt(...)`, the local scorer. A daemon that has idled out is precisely a probe-unavailable state, so the local-fallback path the note says is gone is still the live branch.

`feature-catalog/python-compat/cli-shim.md` still documents that path as current ("falls back to the local Python scorer when native routing is unavailable"), so the feature catalog and the code agree with each other and the **release note is the outlier**.

Introduced: v4.0.0.7.
Confidence: medium — the note may intend a narrower claim (that doc/idf rules reach the local scorer too), which the wording does not convey. Recording it rather than resolving it.
Sources: [SOURCE: .skilled/changelog/skilled/v4.0.0.7.md:71], [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5590]
Verify: stop the advisor daemon, then `python3 …/scripts/skill_advisor.py "add a changelog for this packet" 2>&1 >/dev/null` and observe the fallback warning.

### Negative result (recorded so a later iteration does not repeat it)

The v4.0.0.0 claim "Its MCP transport is gone" holds where I checked: `.utcp_config.json` and `opencode.json` contain no advisor entry, and no advisor-named MCP server or tool registration survives in `.skilled`, `.claude`, `.codex`, `.opencode`, `.pi` or `.dsh`. The `mcp_server/` directories that still exist are inside `barter/ai-speckit` scratch and backup trees, not live surfaces.

## Questions Answered

- **Advisor parity (v4.0.0.7): is the Python vs Node advisor parity check still wired into CI, and do the two advisors disagree on any prompt today?** Yes to both. The blocking local-vs-native ratchet is in `routing-registry-drift.yml`'s `golden-prompt-gate` job and is path-enrolled, and the two front doors disagree on "add a changelog for this packet" (sk-doc vs system-spec-kit) with no ledger entry covering it.

## Questions Remaining

- **Advisor transport (v4.0.0.0, v4.0.0.16)** stays open on its second half. MCP removal is confirmed. The degraded-mode and shared-daemon behavior is *not*: I read the launcher's lease and lock-dir surface but never exercised the daemon-down path or the two-simultaneous-launchers race, so "behaves as documented" is untested rather than confirmed.
- Which layer drops the redirect: is it the CLI handler's post-scoring step, the shim's `recommend_with_native_advisor()` options, or the trust default of f-iter001-003? A root-cause pass on `handlers/advisor-recommend.ts` against `lib/compat/` would close f-iter001-001.
- Whether the top-ranked recommendation carrying a *lower* score than the runner-up (sk-doc 0.347 above system-spec-kit 0.579 under `--trusted`) is intended precedence or a sort defect. Recorded as an observation, not a finding, because I cannot establish intent from output order alone.

## Next Focus

Run the daemon-down and two-launcher-concurrent probes the transport question still needs, then root-cause the redirect divergence in the native handler path.

## SCOPE VIOLATIONS

None. All writes landed in this iteration's narrative and delta file plus the append gateway.
