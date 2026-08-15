# Iteration 1: Ground-truth the claudish-to-english reference architecture

## Focus

Reverse-engineer the reference plugin with file-and-line evidence: hook registration, per-chunk buffering, context extraction, prompt, provider call, display modes, Markdown mutation, cleanup, and failure paths.

## Actions Taken

- Read `README.md` (requirements, env vars, display modes, privacy/egress, layout).
- Read `hooks/hooks.json` (hook registration and timeouts).
- Read `rewrite.sh` (MessageDisplay display hook, full source).
- Read `rewrite-md.sh` (PostToolUse Markdown hook, full source).
- Read `.claude-plugin/plugin.json` and `marketplace.json` (manifest, version 0.1.1).

## Findings

1. **Hook registration (confirmed)** — `hooks/hooks.json:3` registers `MessageDisplay` -> `rewrite.sh` with `timeout: 60`; `hooks/hooks.json:14` registers `PostToolUse` with matcher `Write|Edit` -> `rewrite-md.sh` with `timeout: 180`. Both are command hooks resolved via `${CLAUDE_PLUGIN_ROOT}` (`hooks/hooks.json:8`). `rewrite.sh` is the display path; `rewrite-md.sh` is a separate, opt-in file-mutation surface.

2. **Chunk model (confirmed)** — Claude Code fires `MessageDisplay` once per streamed chunk; each fire is a separate process carrying `.message_id`, `.index`, `.final`, and `.delta` (a text fragment, not cumulative) (`rewrite.sh:5-10`). The hook buffers each delta to `$mdir/<index>.part` (`rewrite.sh:102-106`) and only calls the LLM on the final chunk (`rewrite.sh:117`). Buffer root is `${TMPDIR:-/tmp}/claudish-to-english` (`rewrite.sh:55`).

3. **Context extraction (confirmed)** — On the final chunk it reads the original user question from `.transcript_path` (`rewrite.sh:93`), selecting the last real (non-meta) user string message truncated to 800 codepoints (`rewrite.sh:154-155`), injected as context only — the model is told never to answer or repeat the question (`rewrite.sh:158`).

4. **Prompt and provider call (confirmed)** — System prompt asks for much simpler plain English while keeping every fact, name, number, and file path, leaving fenced code unchanged (`rewrite.sh:149`). Request is Ollama-native `/api/chat`, `stream:false`, `think:false`, `options.temperature:0.3`, messages `[system, user]` (`rewrite.sh:162-163`). Response content extracted via `.message.content` (`rewrite.sh:168`). `CLAUDISH_STUB=1` provides a deterministic stub for mechanics testing (`rewrite.sh:144-147`).

5. **Display modes (confirmed)** — `append` (default) streams the original then appends a `💬 In plain English:` block (`rewrite.sh:56`, `rewrite.sh:223`); `replace` suppresses intermediate chunks by emitting empty `displayContent` (`rewrite.sh:77-80`, `rewrite.sh:113`) and shows only the rewrite on the final chunk (`rewrite.sh:219`). Emit shape: `{hookSpecificOutput:{hookEventName:"MessageDisplay",displayContent:$dc}}` (`rewrite.sh:69-71`).

6. **Fail-open contract (confirmed)** — On any problem (disabled, missing jq/curl, empty payload, missing message_id, parse error, LLM down, timeout, empty rewrite) it emits nothing and exits 0, leaving Claude's original on screen (`rewrite.sh:62-63`, `rewrite.sh:174-212`). `append` never suppresses; `replace` must re-show the full original on failure (`rewrite.sh:129-137`, `rewrite.sh:209-211`).

7. **Replace-mode risk (confirmed)** — `replace` suppresses streamed chunks before a validated rewrite exists (`rewrite.sh:113`). If the process is killed between a suppressed chunk and the final handler, the screen is blank — the claimed fail-open guarantee does not survive process death mid-message. This is a core weakness the portable design must fix.

8. **Filesystem-safety risk (confirmed)** — Raw `session_id` and `message_id` are interpolated into directory paths (`rewrite.sh:90-91`, `rewrite.sh:102`) and a later recursive deletion target (`rewrite.sh:99`). `find -exec rm -rf` over buffer directories keyed by untrusted identifiers is a path traversal / deletion risk the portable design must not carry forward.

9. **Prose length gate (confirmed)** — Messages shorter than `CLAUDISH_MIN_CHARS` (default 200) non-space prose chars (fenced code stripped) are not rewritten (`rewrite.sh:121-137`).

10. **Markdown file path (confirmed)** — `rewrite-md.sh` is opt-in by `CLAUDISH_MD_DIR` (`rewrite-md.sh:10-13`), does its own file write (not `updatedToolOutput`) to avoid re-triggering PostToolUse (`rewrite-md.sh:7-8`, `:19-20`), splits YAML frontmatter verbatim (`rewrite-md.sh:116-133`), keeps fenced code by prompt instruction (`rewrite-md.sh:159`), writes atomically via temp file + `mv -f` (`rewrite-md.sh:201-213`), and supports sibling (`NAME.plain.md`) or overwrite with idempotency marker (`rewrite-md.sh:60`, `:135-142`, `:202-210`). This is a semantic mutation surface, distinct from display projection.

11. **Assumed limitations (inferred)** — The reference assumes Claude's `MessageDisplay`, exactly one Ollama protocol, serialized chunk delivery, filesystem-safe identifiers, and prompt obedience without a deterministic fidelity validator. None of these hold across six evolving CLIs or arbitrary hosted/local providers.

## Questions Answered

- Q1 (partial): The exact reference architecture is now captured with file-and-line evidence.

## Questions Remaining

- Q1: Fidelity/validation behavior of the reference (there is none — confirmed absence is itself a finding).
- Q2-Q8: unchanged (external surfaces, normalized model, streaming semantics, protected spans, providers, evaluation, downstream phases).

## Next Focus

Establish the safest integration boundary for Claude CLI (`MessageDisplay` + headless `stream-json`) and Codex CLI (App Server JSON-RPC / `codex exec --json`), with primary-source evidence.

## Assessment

- newInfoRatio: 0.95
- noveltyJustification: First pass over the reference; every finding is new to this lineage and backed by file-and-line evidence.
- Confidence: High (primary files read in full; behavior confirmed at exact lines). Inferred items explicitly labeled.

## Reflection

What worked: full-file reads with line-level citation produced precise, verifiable findings.
What failed / ruled out: none yet.
Ruled out: none.
