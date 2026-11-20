REPOSITORY ROOT: /Users/michelkerkmeester/MEGA/Development/Skilled
Every read and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

This run is READ-ONLY. Write no files. Print the report to stdout. The bound spec folder is:
  specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/021-epic-verification

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

TASK

Verify the skill advisor changes made since tag v4.1.0.0 against the code at HEAD.
Advisor root: .skilled/skills/system-skill-advisor (runtime in runtime/, launcher in
.skilled/bin/system-skill-advisor-launcher.cjs). `git log v4.1.0.0..HEAD -- <path>` and
`git diff v4.1.0.0..HEAD -- <path>` show what changed. Read source, not docs, to decide.

For each claim below, give one verdict: CONFIRMED, PARTIAL or REFUTED, with file:line.

Ollama and the semantic lane:
O1. The semantic_shadow lane's default weight is 0, and at weight 0 no prompt embed is attempted. SPECKIT_ADVISOR_LANE_WEIGHTS_JSON='{"semantic_shadow":0.05}' turns it back on.
O2. The daemon refreshes skill and command vectors after startup and after each watcher reindex. The refresh runs one at a time, a request during a run causes one more pass, it does nothing when coverage is complete, it probes Ollama once for 500 ms, SYSTEM_SKILL_ADVISOR_EMBED_REFRESH=off disables it, and a failed embed keeps the old vector.
O3. When live, the lane scores only when every embeddable skill and command vector is current. The recommend path reads coverage through a read-only handle. A failed prompt embed marks the lane degraded and removes it from the live total.
O4. advisor_status reports current, stale and missing counts and coverageComplete, reports lane_weight_zero and incomplete_skill_vectors, and probes Ollama /api/tags.
O5. The launcher forwards OLLAMA_BASE_URL, OLLAMA_REQUEST_TIMEOUT_MS and SYSTEM_SKILL_ADVISOR_EMBED_REFRESH. The hf model server is off unless SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=1. The embedder pointer resolves without a provider cascade, and the legacy embedding path is gone.
O6. The server exits soon after its launcher dies. The heartbeat starts right after the database opens. The launcher reaps a server whose heartbeat stops, with a 5 minute grace after spawn.

Other changes:
S1. A leading pasted reply (one with an attribution header) is stripped by stripLeadingPastedReply, called in the recommend handler before the cache key, the embed and the scorer, and again at the entry of scoreAdvisorPrompt. The Python scorer strips the same way from a shared fixture. Both marker regexes run in linear time.
S2. Compiled routes, typed commands, the fire gate skippedAdvisorResultFor, the CLI degraded path and the Claude hook's 64 KiB cut all read the stripped task.
S3. When the shared UserPromptSubmit handler throws, its catch returns the outage line and directives, with a nested try that falls back to {}.
S4. Route receipts: the guard suppresses a brief only when all five conditions hold (current receipt, work intent, floored top route, route differs from receipt, weak follow-up). A receipt expires when the lifecycle clock moves or the transcript shrinks, is stored only after the host takes the output, and startup, resume and compact turns pass through. confidenceFloored survives the subprocess parse and the native bridge. Claude, Pi, DSH and Vibe store receipts.

Then list any defect you find in these changes, ranked P0 (wrong routing, crash, lost data, a doc claim that misleads an operator), P1 or P2. Give each one file:line and a concrete failure scenario. A test that matches new text but leaves the behavior unchecked is a finding.

Last, answer in two or three sentences: at the default weight of 0, does the advisor do Ollama work that nothing reads, and is that cost justified?

OUTPUT: one markdown report. Sections: Verdicts (one line per claim), Defects, Ollama cost answer. No preamble.
