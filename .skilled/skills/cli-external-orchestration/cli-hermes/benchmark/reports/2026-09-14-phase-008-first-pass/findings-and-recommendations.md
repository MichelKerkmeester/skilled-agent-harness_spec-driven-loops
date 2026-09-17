# Findings And Recommendations

_Derived after the fact from this run's stored record, not written at run time._

> cli-hermes · live · claude · glm-5.3-flash (llmgateway, --reasoning none) · phase-008-first-pass

Two FAIL verdicts and three boundaries came out of this pass. None of the four items below is owned by the playbook package; each names the surface that owns it.

## 1. A Hermes run can exit 0 with an empty response (blocking)

- **Behavior**: `HERMES-009`
- **Observation**: two consecutive runs of the same template dispatch exited 0 with zero bytes on stdout. The agent log shows the loop failing repeatedly on `'read_file' is not a deferrable tool` and ending with a pending tool result.
- **Why it matters beyond this scenario**: a caller that treats exit 0 as success will record a silent empty answer as a completed dispatch. The packet's exit-code table currently reads exit 0 as "completed turn with a response".
- **Recommendation**: add a non-empty-stdout check to the dispatch contract alongside the exit code, and test whether including `file` in `-t` promotes `read_file` out of the deferred catalog. Owner: the `cli-hermes` packet's CLI reference and the fan-out builder, not this package.

## 2. The git preflight advisory does not reach a Hermes session (blocking)

- **Behavior**: `HERMES-014`
- **Observation**: the plugin loads and its `pre_tool_call` runs, but the core it shells out to emits nothing for git-shaped commands, and the plugin forwards only a `deny` decision.
- **Recommendation**: either wire the sk-git advisory core into `pre_tool_call` alongside the dispatch preflight and forward non-deny output as an advisory string, or correct the claim. `.hermes/SYNC.md` §6 and the playbook category description both state the advisory reaches the session; the playbook root now states the observed behavior instead. Owner: `.hermes/plugins/repo-guards/__init__.py` and `.hermes/SYNC.md`.

## 3. The session-context section carries no packet or goal content (boundary)

- **Behavior**: `HERMES-015`
- **Observation**: the section is delivered and quotable, at 303 characters, but its body is generic: `Session context received. Current state: - Continuity: recover on demand from the packet docs`. A Hermes session does not learn which packet it is working.
- **Recorded as**: a PASS for delivery with the content boundary documented, not a delivery failure.
- **Recommendation**: decide whether the shared session-start core should carry packet identity into a non-OpenCode runtime at all; if yes, that is a change to the core, not to the plugin. Owner: the session-start hook core.

## 4. `--ignore-rules` and `-s <skill>` are mutually defeating (boundary)

- **Behavior**: `HERMES-016`
- **Observation**: `--ignore-rules` suppresses preloaded-skill injection along with the rules files, so a dispatch cannot both follow the sanctioned shape and preload a project skill.
- **Recorded as**: a documented constraint; the scenario departs from the sanctioned shape in exactly that one flag and says so.
- **Recommendation**: state the exception explicitly in the packet's hard-rule wording for `ignore-rules-required`, so a future dispatch that needs `-s` is not read as a rule violation. Owner: the `cli-hermes` `SKILL.md`.

## Contradictions of the packet's prior wording, now observed

- `--yolo` is not the general write switch: `HERMES-006` wrote a file without it. Read-only comes from the `-t` list, which `HERMES-007` proves.
- `--resume` is no longer untested: `HERMES-011` resumed a captured id, recalled the prior turn, and re-emitted the same session id.
- `hermes status` reports `Model: (not set)` and `Provider: Auto` on this correctly configured machine, because it does not display custom provider blocks. It is not a usable provider preflight; `HERMES-001` is.
