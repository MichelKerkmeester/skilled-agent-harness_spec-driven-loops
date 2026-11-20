const R = '.skilled/skills/system-deep-loop/runtime/';
const S = 'specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/';
const f = (label, sources) => ({ label, sources });
module.exports = {
  iteration: 5,
  newInfoRatio: 0.79,
  noveltyJustification: '5 of 7 findings are new adapter-level differences; the stream-json switch and the adapter contract extend iteration 3 (0.5 each).',
  keyNodes: ['F-2-006'],
  answeredNodes: ['F-2-006'],
  ruledOut: ['agent mirrors as a source of fan-out divergence'],
  focusTrack: 'cross-cli-contract',
  toolsUsed: ['Read', 'Bash', 'Write'],
  sourcesQueried: [R + 'scripts/fanout-run.cjs:3610', R + 'scripts/fanout-run.cjs:2702', R + 'scripts/fanout-run.cjs:2664', R + 'scripts/fanout-run.cjs:175', R + 'scripts/dispatch-iteration.cjs:368', R + 'scripts/dispatch-iteration.cjs:414', R + 'scripts/dispatch-iteration.cjs:921', R + 'scripts/fanout-salvage.cjs:41', '.claude/agents/deep-research.md:11', '.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs'],
  findings: [
    f('Only cli-opencode (--format json) and cli-deepseek-harness (--json) write event logs; claude and cursor use --output-format text, codex exec has no --json, devin and pi have no format flag and vibe writes an export dir. Change: per-adapter logFormat and switch claude, codex and cursor to their JSON stream modes (H/M/M).', [R + 'scripts/fanout-run.cjs']),
    f('Prompt channel differs: argv for claude, cursor, devin, pi and opencode (opencode also passes empty stdin), stdin for codex and dsh, a file for vibe. Change: adapters return promptChannel, the preview prints it, prefer stdin (M/S/L).', [R + 'scripts/fanout-run.cjs', S + 'scratch/dogfood-research-gen3.md']),
    f('Unset effort means three things: codex invents medium, claude omits the flag, opencode and pi pin flash models to max and pi throws on unmapped values, cursor bakes effort in the model id, devin has none. Change: never invent an unset effort and report effortApplied (M/S/L).', [R + 'scripts/fanout-run.cjs']),
    f('No adapter passes a CLI resume or session flag, so every attempt is a fresh CLI session and resume is state-file only; pin that as a contract clause and test (L-M/S/L).', [R + 'scripts/fanout-run.cjs']),
    f('Row 13 is half built: runLineageBuiltin already routes cursor, devin and pi through buildLineageCommand, but runClaude and runCodex keep hand-built twins and runCodex lacks the --search flag the fan-out codex builder adds for live web. Change: route both through runLineageBuiltin and delete the twins (H/S-M/M).', [R + 'scripts/dispatch-iteration.cjs', R + 'scripts/fanout-run.cjs']),
    f('Single adapter contract: each LINEAGE_COMMAND_ADAPTERS entry returns command, args, promptChannel, logFormat, effective {permission, sandboxEnforcement, effortApplied, webSearch}, parseLog and classifyFailure, with one table-driven conformance test over fixture logs per kind (H/M/M).', [R + 'scripts/fanout-run.cjs', R + 'scripts/fanout-salvage.cjs', 'https://inspect.aisi.org.uk/extensions-model-api.html']),
    f('Agent mirrors cannot affect a fan-out lineage because the canonical .skilled persona is inlined into every prompt; the roster check passes but bodies are not compared (the .claude body differs only in its Path Convention line). Change: compare bodies modulo that line and frontmatter (M/S/L).', [R + 'scripts/fanout-run.cjs', '.claude/agents/deep-research.md', '.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs']),
  ],
};
