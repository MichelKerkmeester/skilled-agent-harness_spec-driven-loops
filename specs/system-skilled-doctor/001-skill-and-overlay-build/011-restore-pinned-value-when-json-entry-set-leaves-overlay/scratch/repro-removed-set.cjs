'use strict';
// Shows what apply does to a live JSON file after a set leaves the entry set.
const path = require('node:path');
const engine = require(path.resolve(process.argv[2], '.skilled/commands/doctor/scripts/overlay-engine.cjs'));

const pinned = JSON.stringify({ rows: { a: { top: 'sk-code' } } }, null, 2) + '\n';
const options = { canReplaceExisting: true, recordedItems: [], readUpstreamText: () => pinned };
const none = { operations: [] };

const replaced = engine.applyJsonOperations(pinned, { operations: [{ op: 'set', path: ['rows', 'a', 'top'], value: 'sk-doc' }] }, options);
console.log('pin value: sk-code');
console.log('after apply with the set: ' + JSON.parse(replaced).rows.a.top);
const afterRemoval = engine.applyJsonOperations(replaced, none, options);
console.log('after apply with the set removed: ' + JSON.parse(afterRemoval).rows.a.top + ' (text unchanged: ' + (afterRemoval === replaced) + ')');

const inserted = engine.applyJsonOperations(pinned, { operations: [{ op: 'set', path: ['rows', 'a', 'extra'], value: 1 }] }, options);
const afterInsertRemoval = engine.applyJsonOperations(inserted, none, options);
console.log('key the set added, after the set is removed: ' + JSON.stringify(JSON.parse(afterInsertRemoval).rows.a));
