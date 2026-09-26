import test from "node:test";
import assert from "node:assert/strict";
import { createSkillGroup } from "../src/config.ts";

test("createSkillGroup persists name, description, shortcut and next order", () => {
  const existing = [
    { id: "review", name: "Review", description: "Review work", shortcutEnabled: true, order: 10 },
    { id: "dev", name: "Dev", description: "Development", shortcutEnabled: false, order: 20 },
  ];

  const group = createSkillGroup(
    "  Planning & Specs  ",
    "  PRDs, technical specs, and tickets  ",
    false,
    existing,
  );

  assert.deepEqual(group, {
    id: "planning-specs",
    name: "Planning & Specs",
    description: "PRDs, technical specs, and tickets",
    shortcutEnabled: false,
    order: 30,
  });
});

test("createSkillGroup allocates a unique id", () => {
  const existing = [
    { id: "dev", name: "Development", description: "", shortcutEnabled: true, order: 10 },
  ];
  const group = createSkillGroup("Dev", "Second development group", true, existing);
  assert.equal(group.id, "dev-2");
  assert.equal(group.description, "Second development group");
});

test("createSkillGroup rejects a blank group name", () => {
  assert.throws(() => createSkillGroup("   ", "description", true, []), /Group name is required/);
});


test("createSkillGroup rejects shortcut-normalized duplicate names", () => {
  const existing = [{ id: "dev", name: "Dev Tools", description: "", shortcutEnabled: true, order: 10 }];
  assert.throws(() => createSkillGroup("Dev & Tools", "", true, existing), /conflicts/i);
});

test("createSkillGroup rejects punctuation-only names", () => {
  assert.throws(() => createSkillGroup("!!!", "", true, []), /at least one/i);
});
