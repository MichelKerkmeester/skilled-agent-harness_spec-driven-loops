// ============================================================================
// Design Command Surface Check Tests
// ============================================================================

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import {
  commandSetForModes,
  expectedChoreographyDrift,
  parseInterfaceIntentSignalKeys,
  readRegistryAliasesByMode,
  readWorkflowModes,
  validateDiscriminator,
  validateInterfaceIntentSignalKeys,
  validateMetadata
} from "./design-command-surface-check.mjs";

const scriptUrl = new URL(import.meta.url);
const skillRootUrl = new URL("../../", scriptUrl);
const opencodeRootUrl = new URL("../../", skillRootUrl);
const assetsRootUrl = new URL("commands/design/assets/", opencodeRootUrl);

const [metadata, registry, interfaceSkillSource] = await Promise.all([
  readJson(new URL("command-metadata.json", skillRootUrl)),
  readJson(new URL("mode-registry.json", skillRootUrl)),
  readFile(new URL("design-interface/SKILL.md", skillRootUrl), "utf8")
]);

const workflowModes = readWorkflowModes(registry);
const registryAliasesByMode = readRegistryAliasesByMode(registry);
const interfaceIntentLanes = parseInterfaceIntentSignalKeys(interfaceSkillSource);
const surfacesByCommand = new Map(
  await Promise.all(
    metadata.map(async (record) => {
      const name = record.command.replace("/design:", "");
      const [auto, confirm] = await Promise.all([
        readFile(new URL(`design_${name}_auto.yaml`, assetsRootUrl), "utf8"),
        readFile(new URL(`design_${name}_confirm.yaml`, assetsRootUrl), "utf8")
      ]);
      return [record.command, { auto, confirm }];
    })
  )
);

test("current live metadata and choreography assets pass", () => {
  const allowedSiblingTokens = commandSetForModes(workflowModes, registry);
  const invalid = [
    ...validateInterfaceIntentSignalKeys(interfaceIntentLanes),
    ...validateMetadata(
      metadata,
      workflowModes,
      interfaceIntentLanes,
      registryAliasesByMode,
      registry
    )
  ];
  const drift = metadata.flatMap((record) =>
    expectedChoreographyDrift(record, surfacesByCommand.get(record.command))
  );

  assert.deepEqual(
    [...allowedSiblingTokens].sort(),
    [
      "/design:audit",
      "/design:foundations",
      "/design:interface",
      "/design:md-generator",
      "/design:motion",
      "design-mcp-open-design"
    ]
  );
  assert.equal(allowedSiblingTokens.has("/design:design-mcp-open-design"), false);
  assert.equal(invalid.length, 0, invalid.join("\n"));
  assert.equal(drift.length, 0, JSON.stringify(drift, null, 2));
});

test("mistyped real-command sibling fails exact-token validation", () => {
  const record = cloneRecord(findRecord("/design:foundations"));
  record.discriminator.preferSiblingWhen[0].sibling = "/design:auditt";

  const errors = validateDiscriminator(record, record.command, workflowModes, registry);

  assert.ok(errors.some((error) => error.includes("sibling token must be one of")), errors.join("\n"));

  record.discriminator.preferSiblingWhen[0].sibling = "/design:audit (not allowed)";
  const trailingNoteErrors = validateDiscriminator(record, record.command, workflowModes, registry);
  assert.ok(
    trailingNoteErrors.some((error) => error.includes("only a no-command token may add one parenthetical note")),
    trailingNoteErrors.join("\n")
  );
});

test("renamed transport token fails exact-token validation", () => {
  const record = cloneRecord(findRecord("/design:audit"));
  const transport = record.discriminator.preferSiblingWhen.find((entry) =>
    entry.sibling.startsWith("design-mcp-open-design")
  );
  transport.sibling = "design-mcp-opendesign (no standalone command)";

  const errors = validateDiscriminator(record, record.command, workflowModes, registry);

  assert.ok(errors.some((error) => error.includes("sibling token must be one of")), errors.join("\n"));
});

test("renamed YAML step_N key fails structural validation", () => {
  const record = findRecord("/design:audit");
  const surface = cloneSurface(record.command);
  surface.auto = replaceRequired(surface.auto, "  step_2_load_mode:", "  stage_2_load_mode:");

  const drift = expectedChoreographyDrift(record, surface);

  assert.ok(
    drift.some((item) => String(item.actual).includes("workflow key stage_2_load_mode must match step_N_<name>")),
    JSON.stringify(drift, null, 2)
  );
});

test("auto and confirm business-step drift fails parity validation", () => {
  const record = findRecord("/design:foundations");
  const surface = cloneSurface(record.command);
  surface.confirm = replaceRequired(
    surface.confirm,
    "  step_3_set_register:",
    "  step_3_set_register_variant:"
  );

  const drift = expectedChoreographyDrift(record, surface);

  assert.ok(
    drift.some((item) => String(item.expected).startsWith("confirm business steps")),
    JSON.stringify(drift, null, 2)
  );
});

test("choreography resource and action mutations fail exact structural validation", () => {
  const liveRecord = findRecord("/design:audit");
  const resourceRecord = cloneRecord(liveRecord);
  resourceRecord.choreography[0].resource = ".opencode/skills/sk-design/missing-hub/SKILL.md";
  const resourceDrift = expectedChoreographyDrift(resourceRecord, cloneSurface(liveRecord.command));

  assert.ok(
    resourceDrift.some((item) => item.expected === resourceRecord.choreography[0].resource),
    JSON.stringify(resourceDrift, null, 2)
  );

  const actionRecord = cloneRecord(liveRecord);
  actionRecord.choreography[0].action = "perform unrelated work";
  const actionDrift = expectedChoreographyDrift(actionRecord, cloneSurface(liveRecord.command));

  assert.ok(
    actionDrift.some((item) => item.expected === actionRecord.choreography[0].action),
    JSON.stringify(actionDrift, null, 2)
  );
});

test("confirm-only step_0_show_prompt is accepted", () => {
  const record = findRecord("/design:motion");
  const surface = cloneSurface(record.command);

  assert.match(surface.confirm, /^  step_0_show_prompt:$/m);
  assert.doesNotMatch(surface.auto, /^  step_0_show_prompt:$/m);
  assert.deepEqual(expectedChoreographyDrift(record, surface), []);
});

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

function findRecord(command) {
  const record = metadata.find((entry) => entry.command === command);
  assert.ok(record, `missing live metadata record ${command}`);
  return record;
}

function cloneRecord(record) {
  return structuredClone(record);
}

function cloneSurface(command) {
  const surface = surfacesByCommand.get(command);
  assert.ok(surface, `missing live surface ${command}`);
  return { ...surface };
}

function replaceRequired(source, before, after) {
  const updated = source.replace(before, after);
  assert.notEqual(updated, source, `fixture mutation did not find ${before}`);
  return updated;
}
