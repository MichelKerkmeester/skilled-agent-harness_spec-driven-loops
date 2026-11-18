// Prints the shipped JavaScript rule's output for each parity row.
// Non-ASCII output is escaped so an invisible character shows.
// Usage from the repository root: node <this file> <parity-rows.json>
const { stripLeadingPastedReply } = require(require('node:path').resolve('tmp/p002-briefs/rule.cjs'));
const rows = require(require('node:path').resolve(process.argv[2]));
for (const [id, input] of Object.entries(rows)) console.log('js   ', id.padEnd(27), ascii(JSON.stringify(stripLeadingPastedReply(input))));

function ascii(text) {
  return text.replace(/[\u007f-\uffff]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
}
