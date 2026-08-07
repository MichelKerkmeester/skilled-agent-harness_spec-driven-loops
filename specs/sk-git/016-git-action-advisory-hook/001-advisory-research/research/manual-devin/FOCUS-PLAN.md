# GLM Pass Focus Plan

Five `glm-5-2` dispatches, each aimed at a surface the fan-out is unlikely to reach on its own.
The fan-out iterates on one thread and tends to deepen; these go wide.

| Pass | Focus | Why it is a gap |
|------|-------|-----------------|
| D1 | Enumerate every mutating git operation; classify each by pre-execution evaluability | The incident list covers five operations; git has dozens |
| D2 | Measure noise against real repository history | Nobody has measured how often a candidate rule would fire |
| D3 | Map every sk-git ALWAYS / NEVER / ESCALATE rule to mechanical, partial, or judgement-only | Determines which prose is even encodable |
| D4 | Prior art, and specifically where its advisories are ignored | The failure mode we most need to avoid is known territory elsewhere |
| D5 | Failure modes with no rule today | The pathspec omission is one instance; find the rest of that class |
