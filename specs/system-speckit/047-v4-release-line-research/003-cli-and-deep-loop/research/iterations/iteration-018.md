# Iteration 018 — Confirm-mode workflows (`deep-research-confirm.yaml`, `deep-review-confirm.yaml`)

## Focus

Read the two confirm-mode assets under `.skilled/commands/deep/assets/` and test each
defect already recorded for the auto twins against them: `config.executor.type` vs
`.kind` gates, the bare `{generation}` token, `if_cli_opencode` passing `--pure` with a
hardcoded `opencode` binary and an unguarded model, a missing `if_cli_deepseek_harness`
branch, and the lock acquired without `--owner-pid`. Then report what is unique to
confirm mode: an approval gate that cannot be satisfied, or a step the auto twin has
and confirm lacks.

Read-only: nothing written into the repository outside this packet.

## Actions Taken

1. Censused the assets directory — `deep-research-confirm.yaml` (1936 lines) and
   `deep-review-confirm.yaml` (2149 lines), both dated Oct 28, while their auto twins
   are dated Nov 7. The confirm pair is **stale against its own twins** by ten days.
2. Grepped executor-gate predicates in both confirm files and found the two siblings
   disagree with each other on the field name.
3. Read the full `if_cli_*` dispatch block in `deep-research-confirm.yaml` (1176–1290)
   and the matching `--pure` argv line in both files.
4. Grepped every `{generation}` and `{config.lineage.generation}` occurrence across all
   four assets.
5. Read `loop-lock.cjs` `acquire` (162–191) and `resolveOwnerPid` (92–101) to test the
   carried `--owner-pid` defect, then grepped the refresh/release call sites in confirm.
6. Read the `confirm_parity` block (`deep-research-confirm.yaml:1911–1936`) and the
   pre-iteration approval gate (1105–1130).
7. Read the live run config's `executor` object to settle which field name is canonical.

## Findings

### f-iter018-001 — `deep-research-confirm.yaml` gates on a field the config does not carry (P0, bug)

The two confirm twins disagree on the executor discriminator:

- `deep-research-confirm.yaml` — `.type` at 1177, 1183, 1362, 1366
- `deep-review-confirm.yaml` — `.kind` at 1304, 1310, 1499, 1503

Only one can be right, and the live config settles it: the executor object in
`specs/system-speckit/047-v4-release-line-research/003-cli-and-deep-loop/research/deep-research-config.json`
has keys `[kind, model, reasoningEffort, sandboxMode, serviceTier, timeoutSeconds]` —
`kind` present, `type` absent. `.skilled/commands/deep/research.md:121` states the flag
as `--executor=TYPE` but describes it as selecting "the executor **kind**", so the
doc phrasing feeds the confusion while `kind` remains the persisted field.

Consequences in `deep-research-confirm.yaml`, all from that one missing field:

- `skip_when: "config.executor.type == 'native' or dry_run == true"` at 1177 is never
  true, so `pre_dispatch_audit` runs even for a native dispatch that has no CLI
  executor to audit.
- `branch_on: "config.executor.type"` at 1183 resolves to `undefined`. The branch keys
  are `if_native`, `if_cli_copilot`, `if_cli_claude_code`, `if_cli_opencode`; no key
  matches an undefined value, and no key matches the literal string either. **The
  iteration dispatch node selects no branch at all** — under either reading of an
  unknown `branch_on` (undefined, or literal passthrough), nothing dispatches and no
  error is raised.

`deep-review-confirm.yaml` carries the correct field, so this is a single-file defect,
not a family-wide one — which is exactly why it survives: review works, research
silently does not.

[SOURCE: .skilled/commands/deep/assets/deep-research-confirm.yaml:1183]
[SOURCE: .skilled/commands/deep/assets/deep-review-confirm.yaml:1310]

Verify: `grep -n 'executor\.type\|executor\.kind' .skilled/commands/deep/assets/deep-research-confirm.yaml .skilled/commands/deep/assets/deep-review-confirm.yaml`
and compare with `python3 -c "import json;print(sorted(json.load(open('specs/system-speckit/047-v4-release-line-research/003-cli-and-deep-loop/research/deep-research-config.json'))['executor']))"`.

### f-iter018-002 — no `if_cli_<kind>` branch exists for the kind the run config selects (P1, bug)

Both confirm files offer exactly four branches: `if_native`, `if_cli_copilot`,
`if_cli_claude_code`, `if_cli_opencode`. The live config selects
`executor.kind = "cli-pi"`, for which no branch exists — the same gap the earlier
iterations recorded as a missing `if_cli_deepseek_harness`.

This run evidently dispatched anyway, so some fallback to native exists. That fallback
is nowhere in the YAML. An operator therefore cannot predict, from the contract, which
of `cli-pi`, `cli-deepseek-harness` or any future kind will dispatch externally and
which will silently run in-process — the file enumerates kinds and relies on an
off-file default for every kind it does not enumerate. The fix is a terminal
`if_else`/`if_unknown` branch that fails loudly, not another named kind.

[SOURCE: .skilled/commands/deep/assets/deep-research-confirm.yaml:1184]
[SOURCE: .skilled/commands/deep/assets/deep-research-confirm.yaml:1190]

Verify: `grep -n '^        if_' .skilled/commands/deep/assets/deep-research-confirm.yaml` (four keys), then
`grep -n '"kind"' specs/system-speckit/047-v4-release-line-research/003-cli-and-deep-loop/research/deep-research-config.json`.

### f-iter018-003 — `--pure` on a hardcoded `opencode` with an unguarded model, byte-identical in both confirm files (P1, bug)

`deep-research-confirm.yaml:1259` and `deep-review-confirm.yaml:1386` are the same line:

```
const args = ['run', '--model', executor.model, '--format', 'json', '--dangerously-skip-permissions', '--pure', '--dir', '{repo_root}'];
```

Two defects ride on it, and the surrounding lines prove the file knows better:

- **Unguarded model.** Line 1244 guards the `'null'` literal for `reasoningEffort`
  (`'{config.executor.reasoningEffort}' === 'null' ? null : ...`) but `model` at 1247 is
  interpolated raw. A null model reaches argv as the string `null`, so the executor is
  asked for a model literally named `null`. The asymmetry — one field guarded, its
  neighbour not — is the evidence that the guard was intended and forgotten, not
  deliberately omitted.
- **Hardcoded binary.** `runAuditedExecutorCommand({ command: 'opencode', ... })` at
  1275 hardcodes the executable while every other field is config-derived, so a config
  `configDir`/wrapper/alias is unreachable from this branch.

The `--pure` question carried from iteration 17 stays open: whether the installed
OpenCode accepts `--pure` is not answerable from the YAML, and no comment here explains
what `--pure` suppresses.

[SOURCE: .skilled/commands/deep/assets/deep-research-confirm.yaml:1259]
[SOURCE: .skilled/commands/deep/assets/deep-review-confirm.yaml:1386]

Verify: `grep -n "dangerously-skip-permissions" .skilled/commands/deep/assets/deep-*-confirm.yaml`
and read `deep-research-confirm.yaml:1244-1247` for the guard asymmetry.

### f-iter018-004 — the carried `--owner-pid` defect is **refuted**; the real defect is the TTL against interactive gates (P1, bug + UX)

`acquire` is invoked without `--owner-pid` at `deep-research-confirm.yaml:304` and
`deep-review-confirm.yaml:304` — the same call the auto twins make. Earlier iterations
recorded this as an acquired lock with a wrong owner. `loop-lock.cjs` says otherwise:

- `resolveOwnerPid` (92–101) returns `process.pid` when the flag is absent — so the
  lock does carry an owner.
- `acquire` then sets `lockData.ownerKind = 'transient'` (185–187) with the comment "A
  lock acquired through a short-lived CLI process has no owner pid that outlives the
  command, so it is marked transient and expires on heartbeat age instead of pid
  liveness."

That is a deliberate design, and the `on_acquire` hook (`:305`) captures
`lock.ownerPid` and `lock.acquireNonce` and reuses both for refresh and release. The
chain is coherent. **This finding is ruled out.**

What the design leaves open is confirm-specific. Staleness for a transient lock is
"heartbeat older than twice its TTL" (`:306`), and the TTL is `--ttl-ms 1800000` — so
sixty minutes. The only refresh is `step_refresh_lock` (`:631–634`), which runs at the
*top* of `phase_loop`, i.e. **after** the operator has responded at
`gate_pre_iteration` (`:1109`) and after `gate_iteration_result` (`:1494`). Confirm mode
exists precisely so a human may sit at those gates for an arbitrary time. An operator
who leaves a gate open for an hour lets a second run reclaim the lock and open the same
packet while the first is still live, and `:306` explicitly declines to ask: "No
confirmation step exists in either mode: log a `reclaimed` holder and continue." The
single-writer guarantee therefore lapses exactly at the surface confirm mode was built
for, and the lapse is by design in the unattended case and by oversight in the
interactive one.

[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:185]
[SOURCE: .skilled/commands/deep/assets/deep-research-confirm.yaml:631]

Verify: `sed -n '92,101p;162,191p' .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs`
against `grep -n 'loop-lock.cjs refresh' .skilled/commands/deep/assets/deep-research-confirm.yaml`.

### f-iter018-005 — confirm mode both defers and performs the spec writeback (P2, drift)

`deep-research-confirm.yaml` carries two mutually exclusive-looking outcomes for the
same post-synthesis mutation:

- `:1735` appends `spec_synthesis_deferred` with `reason:"confirm_mode_deferred_writeback"`
  — a reason string whose name asserts that confirm mode *always* defers.
- `:1757` appends the ordinary `spec_mutation` with `diff_summary:"Replaced generated
  deep-research findings fence from research/research.md."`

Neither step states the condition that routes to the other. The auto twin has only the
conditional form: `:2287` says "Emit `spec_synthesis_deferred` instead of partial output
when synthesis cannot safely write back", scoped to an unsafe write, not to the mode.
So the confirm file has re-purposed a safety fallback as a mode behaviour without
saying when. An operator reading the contract cannot tell whether a confirm-mode run
leaves findings in `spec.md` or only in the packet.

[SOURCE: .skilled/commands/deep/assets/deep-research-confirm.yaml:1735]
[SOURCE: .skilled/commands/deep/assets/deep-research-confirm.yaml:1757]

Verify: `grep -n 'spec_synthesis_deferred\|"event":"spec_mutation"' .skilled/commands/deep/assets/deep-research-confirm.yaml .skilled/commands/deep/assets/deep-research-auto.yaml`

### f-iter018-006 — the bare `{generation}` token is present in both confirm files, and `deep-research-confirm.yaml` uses both spellings (P2, drift)

Carried into confirm unchanged. `deep-research-confirm.yaml` uses the bare token at
`:183` (a filename pattern), `:340`, `:350` and `g{generation}` inside `dispatchId` at
`:1392`-equivalent positions, while every state-log event in the same file uses
`{config.lineage.generation}` (`:684`, `:694`, `:717`, `:796`, `:807`, `:1016`, …).
`deep-review-confirm.yaml` uses the bare token in ~18 places and never the qualified
form — so unlike research it is internally consistent, while research is split.

The split matters beyond cosmetics: the synthesis snapshot filename (`:183`) is
`{artifact_dir}/synthesis-v{generation}.md`, so if the bare token renders empty the
first synthesis writes `synthesis-v.md` and every later generation overwrites it,
silently collapsing lineage generations on disk.

[SOURCE: .skilled/commands/deep/assets/deep-research-confirm.yaml:183]
[SOURCE: .skilled/commands/deep/assets/deep-review-confirm.yaml:1392]

Verify: `grep -c '{generation}' .skilled/commands/deep/assets/deep-research-confirm.yaml .skilled/commands/deep/assets/deep-review-confirm.yaml`
against `grep -c 'config.lineage.generation' .skilled/commands/deep/assets/deep-research-confirm.yaml`.

### f-iter018-007 — `confirm_parity` is genuinely good design, and it is unenforced (P2, improvement → extension)

`deep-research-confirm.yaml:1915–1933` declares that every auto step is either present
in confirm or listed under `omitted_steps` with the interactive reason it is absent, and
it names eleven omissions plus a `gateway_wiring.auto_only_sites` list. This is the one
place in the cluster where the auto/confirm gap is stated rather than left implicit, and
it directly answers the "a step the auto YAML has and confirm lacks" question: within
`deep-research-confirm.yaml`, the omission is documented, not silent.

It is also prosaic and unenforced. Nothing compares the auto twin's step inventory
against the confirm twin's `steps` plus `omitted_steps`, so a step added to the auto
file after Oct 28 lands absent from confirm with no census entry — and the confirm files
being ten days stale against their auto twins is exactly that failure in progress.
`deep-review-confirm.yaml` has no `confirm_parity` block at all, so the review pair's
gap is unrecorded entirely.

Extension: generate the parity block, do not hand-maintain it — a script that extracts
`step_*` ids from each auto/confirm pair and fails when an auto id is neither in confirm
nor in `omitted_steps`. That closes the class for both mode pairs, and gives review the
census research already has.

[SOURCE: .skilled/commands/deep/assets/deep-research-confirm.yaml:1915]

Verify: `grep -c 'step_' .skilled/commands/deep/assets/deep-research-auto.yaml` vs `grep -c 'omitted_steps' .skilled/commands/deep/assets/deep-review-confirm.yaml` (0).

## Questions Answered

None ticked this iteration. The three open strategy questions each remain partly open —
see Questions Remaining. f-iter018-001 does close the long-carried sub-question "is
there any normaliser that maps `executor.kind` onto `executor.type`", negatively and
with the live config as evidence.

## Questions Remaining

- **Executor failure handling** (v4.0.0.3, v4.0.0.16) — fourteenth carry. Still unread:
  what a single-executor run records for a devin `resource_exhausted` or a builder
  throw. f-iter018-002 now sharpens it: if no branch matches, the failure to record is
  not a quota error but a silent native fallback.
- **Hub canon** (v4.0.1.0): `package_skill.py --strict` conformance across the hub and
  its modes — still unproven.
- **UX**: two of the three `*-presentation.txt` assets remain unread.
- **New**: does the branch engine resolve `branch_on` to `if_<value>`, and what does it
  do with an undefined value — skip silently or surface an error? f-iter018-001 is safe
  under either reading, but the answer decides whether the defect is "no dispatch" or
  "no dispatch and no signal".
- **New**: `deep-review-confirm.yaml` has ~18 bare `{generation}` tokens and no
  qualified form; `deep-research-confirm.yaml` has both. Which file is newer, and was
  the qualified spelling a migration that stopped half-way?
- **Carried**: whether the installed OpenCode accepts `--pure` (f-iter018-003).
- **Staleness signal**: both confirm assets are dated Oct 28 and both auto assets Nov 7.
  A per-pair mtime/step-count diff would quantify how far every confirm surface has
  drifted from its auto twin — the general form of this iteration's largest finding.

## Next Focus

Read the branch/substitution engine that evaluates `branch_on` and `skip_when`, to
convert f-iter018-001 and f-iter018-002 from "the predicate cannot match as written"
into "and here is what the engine then does". That single read settles the last unknown
shared by both findings and, incidentally, the unknown-token policy carried since
iteration 8.

## SCOPE VIOLATIONS

None. Every read was in the researched surface; every write landed under this packet's
research directory.
