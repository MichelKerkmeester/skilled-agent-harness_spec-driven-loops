import test from 'node:test';
import assert from 'node:assert/strict';
import { filterSkillRecordsBySearch, rankSkillRecordsBySearch } from '../src/search.ts';

const skills = [
  { name: 'architecture-review', description: 'Review architecture', filePath: '/tmp/a' },
  { name: 'tdd', description: 'Test driven development', filePath: '/tmp/b' },
  { name: 'write-prd', description: 'Write product requirements', filePath: '/tmp/c' },
];

test('skill search filters by name and description', () => {
  assert.deepEqual(
    filterSkillRecordsBySearch(skills, 'review').map((skill) => skill.name),
    ['architecture-review'],
  );
  assert.deepEqual(
    filterSkillRecordsBySearch(skills, 'product requirements').map((skill) => skill.name),
    ['write-prd'],
  );
});

test('clearing skill search restores the complete skill list', () => {
  assert.deepEqual(
    filterSkillRecordsBySearch(skills, '').map((skill) => skill.name),
    ['architecture-review', 'tdd', 'write-prd'],
  );
  assert.deepEqual(
    filterSkillRecordsBySearch(skills, '   ').map((skill) => skill.name),
    ['architecture-review', 'tdd', 'write-prd'],
  );
});


test("ranked lazy search returns only matching metadata from the supplied scope", () => {
  const skills = [
    { name: "film-shot-planner", description: "Plans camera shots and coverage for film scenes", filePath: "/a" },
    { name: "dialogue-editor", description: "Rewrites dialogue and character speech", filePath: "/b" },
    { name: "sound-design", description: "Designs film audio and sound effects", filePath: "/c" },
  ];
  const result = rankSkillRecordsBySearch(skills, "camera shot coverage", 2);
  assert.deepEqual(result.map((skill) => skill.name), ["film-shot-planner"]);
});

test("ranked lazy search never returns more than eight records", () => {
  const skills = Array.from({ length: 20 }, (_, i) => ({
    name: `film-${i}`, description: "film workflow", filePath: `/${i}`,
  }));
  assert.equal(rankSkillRecordsBySearch(skills, "film", 99).length, 8);
});
