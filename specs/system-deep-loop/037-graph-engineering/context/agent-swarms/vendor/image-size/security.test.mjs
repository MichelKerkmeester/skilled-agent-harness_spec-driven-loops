import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const packageDirectory = fileURLToPath(new URL(".", import.meta.url));

function put32(buffer, offset, value) {
  new DataView(buffer.buffer).setUint32(offset, value, false);
}

function putText(buffer, offset, value) {
  buffer.set(Buffer.from(value, "ascii"), offset);
}

function makeIcns() {
  const input = new Uint8Array(16);
  putText(input, 0, "icns");
  put32(input, 4, 16);
  putText(input, 8, "is32");
  put32(input, 12, 0);
  return input;
}

function makeJxl() {
  const input = new Uint8Array(40);
  put32(input, 0, 12);
  putText(input, 4, "JXL ");
  input.set([13, 10, 135, 10], 8);
  put32(input, 12, 20);
  putText(input, 16, "ftyp");
  putText(input, 20, "jxl ");
  put32(input, 32, 0);
  putText(input, 36, "jxlp");
  return input;
}

function makeHeif() {
  const input = new Uint8Array(64);
  put32(input, 0, 16);
  putText(input, 4, "ftyp");
  putText(input, 8, "avif");
  put32(input, 16, 48);
  putText(input, 20, "meta");
  put32(input, 28, 36);
  putText(input, 32, "iprp");
  put32(input, 36, 28);
  putText(input, 40, "ipco");
  put32(input, 44, 0);
  putText(input, 48, "ispe");
  put32(input, 56, 640);
  put32(input, 60, 480);
  return input;
}

const malformedImages = [
  ["ICNS", makeIcns()],
  ["JXL", makeJxl()],
  ["HEIF", makeHeif()],
];

for (const [format, input] of malformedImages) {
  test(`${format} zero-length container cannot stall parsing`, () => {
    const encodedInput = Buffer.from(input).toString("base64");
    const source = `
      import { imageSize } from "./dist/index.mjs";
      const input = Buffer.from("${encodedInput}", "base64");
      try { imageSize(input); } catch {}
    `;
    const result = spawnSync(process.execPath, ["--input-type=module", "-e", source], {
      cwd: packageDirectory,
      encoding: "utf8",
      timeout: 1000,
    });

    assert.equal(result.error?.code, undefined, `${format} parser timed out`);
    assert.equal(result.status, 0, result.stderr || `${format} parser failed`);
  });
}
