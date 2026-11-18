// Runs the four new boundary cases through the shipped rule's scratch copy.
// Usage from the repository root: node <this file>
const { resolve } = require('node:path');
const { stripLeadingPastedReply } = require(resolve('tmp/p002-briefs/rule.cjs'));
const cases = [
  '> Keep the public API backward compatible.\nTask: Refactor the session store module to remove duplicated locking code.',
  'Earlier you replied: The report is done. Task: Create a README with sk-doc. Now: Refactor the session store module to remove duplicated locking code.',
  'Assistant response: I updated the README with sk-doc conventions and committed it with sk-git. Task: Refactor the session store module to remove duplicated locking code.',
  'Earlier you replied: Done. Task: Refactor the session store module. Now: also update its tests.',
];
for (const input of cases) console.log(JSON.stringify(stripLeadingPastedReply(input)));
