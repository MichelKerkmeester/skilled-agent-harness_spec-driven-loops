# Edits for unit agent-checker-fix

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs`

OLD:

~~~~text
// A changed path counts as an agent definition only when it sits directly inside
// one of the two runtime agent directories.
const AGENT_PATH_RE = /(?:^|\/)\.(?:opencode|claude)\/agents\/[^/]+$/;
~~~~

NEW:

~~~~text
// A changed path counts as an agent definition only when it sits directly inside
// the authored agent directory, under either source root, or the Claude mirror.
const AGENT_PATH_RE = /(?:^|\/)\.(?:opencode|skilled|claude)\/agents\/[^/]+$/;
~~~~
