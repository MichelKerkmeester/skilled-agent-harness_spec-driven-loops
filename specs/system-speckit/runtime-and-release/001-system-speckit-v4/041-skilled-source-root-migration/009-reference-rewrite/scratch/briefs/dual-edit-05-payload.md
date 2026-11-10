## Edit 1

File: `.skilled/plugins/tests/goal-doc-contract.test.cjs`

OLD:

~~~~text
  // packet or an external file is not this test's business.
  const CITED = /`((?:\.opencode\/(?:hooks|plugins|commands)|\.claude|\.codex|\.cursor|\.devin|\.pi)\/[A-Za-z0-9._/-]+\.(?:cjs|mjs|js|ts|md|json|yaml))`/g;
  const missing = [];
~~~~

NEW:

~~~~text
  // packet or an external file is not this test's business.
  const CITED = /`((?:\.(?:skilled|opencode)\/(?:hooks|plugins|commands)|\.claude|\.codex|\.cursor|\.devin|\.pi)\/[A-Za-z0-9._/-]+\.(?:cjs|mjs|js|ts|md|json|yaml))`/g;
  const missing = [];
~~~~
