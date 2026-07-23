import { randomUUID } from "node:crypto";
import { lstat, realpath, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

export const AUTHORED_DESIGN_FILENAME = "AUTHORED-DESIGN.md";
export const AUTHORED_TOKENS_FILENAME = "authored-tokens.json";

const AUTHORED_FILENAMES = new Set([
  AUTHORED_DESIGN_FILENAME,
  AUTHORED_TOKENS_FILENAME
]);
const MEASURED_TARGETS = new Set(["DESIGN.md", "tokens.json", "styles"]);
const REQUIRED_DOMAINS = ["palette", "type", "voice"];
const REQUIRED_ATTESTATIONS = [
  "source-provenance-reviewed",
  "measurement-evidence-reviewed",
  "target-conflicts-reviewed",
  "manual-approval-recorded"
];

export function assertAuthoredDestination(artifactPath) {
  if (typeof artifactPath !== "string" || artifactPath.length === 0) {
    throw new TypeError("An authored artifact path is required.");
  }

  const normalized = artifactPath.replaceAll("\\", "/");
  const segments = normalized.split("/").filter(Boolean);
  const basename = segments.at(-1);

  if (MEASURED_TARGETS.has(basename) || segments.includes("styles")) {
    throw new Error(`Authored output refuses measured destination: ${artifactPath}`);
  }
  if (segments.length !== 1 || !AUTHORED_FILENAMES.has(basename)) {
    throw new Error(`Authored output must use ${[...AUTHORED_FILENAMES].join(" or ")}.`);
  }

  return basename;
}

export function validateAuthoredBrand(brand) {
  if (!isRecord(brand) || typeof brand.sourceDescription !== "string" || brand.sourceDescription.trim() === "") {
    throw new TypeError("Authored brand requires a non-empty sourceDescription.");
  }

  for (const domain of REQUIRED_DOMAINS) {
    const values = brand[domain];
    if (!Array.isArray(values) || values.length === 0) {
      throw new TypeError(`Authored brand requires at least one ${domain} value.`);
    }
    for (const value of values) {
      validateAuthoredValue(value, domain, brand.sourceDescription);
    }
  }

  return brand;
}

export async function writeAuthoredArtifact(rootDirectory, artifactPath, content) {
  if (typeof content !== "string") {
    throw new TypeError("Authored artifact content must be a string.");
  }

  const destination = await resolveAuthoredDestination(rootDirectory, artifactPath);
  const staged = createStagedArtifact(destination, content);

  try {
    await writeFile(staged.temporaryPath, staged.content, {
      encoding: "utf8",
      flag: "wx",
      mode: 0o600
    });
    await rename(staged.temporaryPath, destination);
  } catch (error) {
    await rm(staged.temporaryPath, { force: true });
    throw error;
  }

  return destination;
}

export async function refreshAuthoredExports({ rootDirectory, renderedDesign, authoredBrand }) {
  validateAuthoredBrand(authoredBrand);
  validateRenderedAuthoredDesign(renderedDesign);

  const tokenDocument = `${JSON.stringify({
    schema: "sk-design/authored-brand/v1",
    sourceDescription: authoredBrand.sourceDescription,
    palette: authoredBrand.palette,
    type: authoredBrand.type,
    voice: authoredBrand.voice
  }, null, 2)}\n`;

  const destinations = await Promise.all([
    resolveAuthoredDestination(rootDirectory, AUTHORED_DESIGN_FILENAME),
    resolveAuthoredDestination(rootDirectory, AUTHORED_TOKENS_FILENAME)
  ]);
  const stagedArtifacts = [
    createStagedArtifact(destinations[0], renderedDesign),
    createStagedArtifact(destinations[1], tokenDocument)
  ];

  try {
    await Promise.all(stagedArtifacts.map((artifact) => (
      writeFile(artifact.temporaryPath, artifact.content, {
        encoding: "utf8",
        flag: "wx",
        mode: 0o600
      })
    )));
  } catch (error) {
    await cleanupArtifacts(stagedArtifacts.map((artifact) => artifact.temporaryPath));
    throw error;
  }

  await commitStagedArtifacts(stagedArtifacts);
  return destinations;
}

export function assertReviewedConversionArtifact(reviewArtifact) {
  if (!isRecord(reviewArtifact) || reviewArtifact.artifactType !== "reviewed-conversion") {
    throw new TypeError("A reviewed-conversion checklist artifact is required.");
  }
  if (containsKey(reviewArtifact, "verified")) {
    throw new Error("Evidence-free verified flags cannot authorize conversion.");
  }
  for (const field of ["reviewerName", "reviewerRole", "reviewedAt", "reviewerSignature"]) {
    if (typeof reviewArtifact[field] !== "string" || reviewArtifact[field].trim() === "") {
      throw new TypeError(`Reviewed conversion requires ${field}.`);
    }
  }
  if (reviewArtifact.reviewerSignature !== reviewArtifact.reviewerName) {
    throw new Error("Reviewer signature must match the named human reviewer.");
  }
  if (reviewArtifact.sourceArtifact !== AUTHORED_DESIGN_FILENAME) {
    throw new Error(`Reviewed conversion source must be ${AUTHORED_DESIGN_FILENAME}.`);
  }
  if (!Array.isArray(reviewArtifact.attestations)) {
    throw new TypeError("Reviewed conversion requires manual attestations.");
  }
  for (const attestation of REQUIRED_ATTESTATIONS) {
    if (!reviewArtifact.attestations.includes(attestation)) {
      throw new Error(`Reviewed conversion is missing attestation: ${attestation}`);
    }
  }
  if (!Array.isArray(reviewArtifact.selections) || reviewArtifact.selections.length === 0) {
    throw new TypeError("Reviewed conversion requires at least one reviewed selection.");
  }
  for (const selection of reviewArtifact.selections) {
    validateReviewedSelection(selection);
  }

  return reviewArtifact;
}

function validateAuthoredValue(record, domain, sourceDescription) {
  if (!isRecord(record) || typeof record.id !== "string" || record.id.trim() === "") {
    throw new TypeError(`Every ${domain} value requires an id.`);
  }
  if (!Object.hasOwn(record, "value")) {
    throw new TypeError(`Authored value ${record.id} requires a value.`);
  }
  if (record.origin !== "authored") {
    throw new Error(`Authored value ${record.id} must declare origin: authored.`);
  }
  if (!isRecord(record.provenance)) {
    throw new TypeError(`Authored value ${record.id} requires provenance.`);
  }
  if (record.provenance.sourceDescription !== sourceDescription) {
    throw new Error(`Authored value ${record.id} must retain the source description.`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.provenance.authoredAt ?? "")) {
    throw new Error(`Authored value ${record.id} requires an authoredAt date.`);
  }
  if (typeof record.provenance.confidenceNote !== "string" || record.provenance.confidenceNote.trim() === "") {
    throw new Error(`Authored value ${record.id} requires a confidence note.`);
  }
}

function validateReviewedSelection(selection) {
  if (!isRecord(selection)) {
    throw new TypeError("Reviewed selections must be objects.");
  }
  if (typeof selection.authoredValueId !== "string" || selection.authoredValueId.trim() === "") {
    throw new TypeError("Reviewed selection requires authoredValueId.");
  }
  if (!MEASURED_TARGETS.has(selection.targetArtifact)) {
    throw new Error(`Unsupported measured target: ${selection.targetArtifact}`);
  }
  if (selection.decision !== "approved") {
    throw new Error(`Reviewed selection ${selection.authoredValueId} is not approved.`);
  }
  if (!Array.isArray(selection.measurementEvidence) || selection.measurementEvidence.length === 0) {
    throw new Error(`Reviewed selection ${selection.authoredValueId} requires measurement evidence.`);
  }
  if (selection.measurementEvidence.some((evidence) => typeof evidence !== "string" || evidence.trim() === "")) {
    throw new Error(`Reviewed selection ${selection.authoredValueId} contains empty evidence.`);
  }
}

async function resolveAuthoredDestination(rootDirectory, artifactPath) {
  const filename = assertAuthoredDestination(artifactPath);
  if (typeof rootDirectory !== "string" || rootDirectory.length === 0) {
    throw new TypeError("A root directory is required.");
  }

  const root = await realpath(path.resolve(rootDirectory));
  const destination = path.resolve(root, filename);
  if (path.dirname(destination) !== root) {
    throw new Error("Authored output escaped its root directory.");
  }

  const destinationStats = await lstatIfPresent(destination);
  if (destinationStats?.isSymbolicLink()) {
    throw new Error(`Authored output refuses symlink destination: ${artifactPath}`);
  }
  if (destinationStats && !destinationStats.isFile()) {
    throw new Error(`Authored output requires a file destination: ${artifactPath}`);
  }
  if (destinationStats) {
    const resolvedDestination = await realpath(destination);
    const relativeDestination = path.relative(root, resolvedDestination);
    const segments = relativeDestination.replaceAll("\\", "/").split("/").filter(Boolean);
    const escapedRoot = relativeDestination === ".." ||
      relativeDestination.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relativeDestination);
    const landedOnMeasuredPath = segments.includes("styles") ||
      MEASURED_TARGETS.has(segments.at(-1));

    if (escapedRoot || landedOnMeasuredPath) {
      throw new Error(`Authored output refuses resolved destination: ${artifactPath}`);
    }
  }

  return destination;
}

function validateRenderedAuthoredDesign(renderedDesign) {
  if (typeof renderedDesign !== "string") {
    throw new Error(`${AUTHORED_DESIGN_FILENAME} must declare origin: authored.`);
  }

  const frontmatterMatch = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(renderedDesign);
  const origins = frontmatterMatch
    ? [...frontmatterMatch[1].matchAll(/^[ \t]*origin:[ \t]*([^\r\n]+)[ \t]*$/gm)]
    : [];

  if (origins.length !== 1 || origins[0][1].trim() !== "authored") {
    throw new Error(`${AUTHORED_DESIGN_FILENAME} must declare origin: authored.`);
  }
  if (/(?:^|\r?\n)[ \t]*origin:[ \t]*(?:measured|verified)\b[^\r\n]*(?:\r?\n|$)/i.test(renderedDesign)) {
    throw new Error(`${AUTHORED_DESIGN_FILENAME} must not declare measured provenance.`);
  }
}

function createStagedArtifact(destination, content) {
  return {
    content,
    destination,
    temporaryPath: path.join(
      path.dirname(destination),
      `.${path.basename(destination)}.${randomUUID()}.tmp`
    )
  };
}

async function commitStagedArtifacts(stagedArtifacts) {
  const entries = stagedArtifacts.map((artifact) => ({
    ...artifact,
    backupPath: `${artifact.destination}.${randomUUID()}.bak`,
    committed: false,
    hadOriginal: false,
    restored: false
  }));

  try {
    for (const entry of entries) {
      if (await lstatIfPresent(entry.destination)) {
        await rename(entry.destination, entry.backupPath);
        entry.hadOriginal = true;
      }
    }
    for (const entry of entries) {
      await rename(entry.temporaryPath, entry.destination);
      entry.committed = true;
    }
  } catch (error) {
    const rollbackErrors = [];
    for (const entry of [...entries].reverse()) {
      try {
        if (entry.committed) {
          await rm(entry.destination, { force: true });
        }
        if (entry.hadOriginal) {
          await rename(entry.backupPath, entry.destination);
          entry.restored = true;
        }
      } catch (rollbackError) {
        rollbackErrors.push(rollbackError);
      }
    }
    await cleanupArtifacts(entries.flatMap((entry) => {
      const cleanupPaths = [entry.temporaryPath];
      if (!entry.hadOriginal || entry.restored) {
        cleanupPaths.push(entry.backupPath);
      }
      return cleanupPaths;
    }));
    if (rollbackErrors.length > 0) {
      throw new AggregateError([error, ...rollbackErrors], "Authored export commit and rollback failed.");
    }
    throw error;
  }

  await cleanupArtifacts(entries.map((entry) => entry.backupPath));
}

async function cleanupArtifacts(artifactPaths) {
  await Promise.all(artifactPaths.map((artifactPath) => rm(artifactPath, { force: true })));
}

async function lstatIfPresent(targetPath) {
  try {
    return await lstat(targetPath);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function containsKey(value, key) {
  if (Array.isArray(value)) {
    return value.some((item) => containsKey(item, key));
  }
  if (!isRecord(value)) {
    return false;
  }
  return Object.hasOwn(value, key) || Object.values(value).some((item) => containsKey(item, key));
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
