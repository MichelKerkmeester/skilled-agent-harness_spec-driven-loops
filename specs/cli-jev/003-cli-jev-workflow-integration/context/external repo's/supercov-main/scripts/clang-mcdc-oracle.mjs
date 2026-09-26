#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

function command(name, args, options = {}) {
  const result = spawnSync(name, args, { encoding: "utf8", ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      `${name} ${args.join(" ")} failed (${result.status}):\n${result.stderr}\n${result.stdout}`,
    );
  }
  return result.stdout;
}

function tool(name) {
  if (process.platform === "darwin")
    return command("xcrun", ["--find", name]).trim();
  return name;
}

const clang = process.env.CLANG ?? tool("clang");
const llvmProfdata = process.env.LLVM_PROFDATA ?? tool("llvm-profdata");
const llvmCov = process.env.LLVM_COV ?? tool("llvm-cov");
const sdkRoot =
  process.platform === "darwin"
    ? command("xcrun", ["--sdk", "macosx", "--show-sdk-path"]).trim()
    : undefined;
const golden = JSON.parse(
  readFileSync(resolve("tests/fixtures/clang-mcdc/oracle.json"), "utf8"),
);
const temporary = mkdtempSync(resolve(tmpdir(), "supercov-clang-mcdc-"));

try {
  for (const oracleCase of golden.cases) {
    const source = resolve(temporary, `${oracleCase.name}.c`);
    const inputs = oracleCase.inputIndexes.map((index) => golden.inputs[index]);
    const cVectors = inputs
      .map((values) => `{${values.map((value) => (value ? "true" : "false")).join(",")}}`)
      .join(",\n");
    const expectedTrue = oracleCase.inputIndexes.filter(
      (index) => golden.outcomes[index],
    ).length;
    writeFileSync(
      source,
      `#include <stdbool.h>\n` +
        `static int decide(bool a,bool b,bool c){if(${golden.expression})return 1;return 0;}\n` +
        `int main(void){const bool vectors[][3]={${cVectors}};int total=0;` +
        `for(unsigned i=0;i<sizeof(vectors)/sizeof(vectors[0]);i++)` +
        `total+=decide(vectors[i][0],vectors[i][1],vectors[i][2]);` +
        `return total==${expectedTrue}?0:1;}\n`,
    );
    const binary = resolve(temporary, oracleCase.name);
    const rawProfile = resolve(temporary, `${oracleCase.name}.profraw`);
    const profile = resolve(temporary, `${oracleCase.name}.profdata`);
    command(clang, [
      "-O0",
      "-fprofile-instr-generate",
      "-fcoverage-mapping",
      "-fcoverage-mcdc",
      source,
      "-o",
      binary,
    ], { env: { ...process.env, ...(sdkRoot ? { SDKROOT: sdkRoot } : {}) } });
    command(binary, [], { env: { ...process.env, LLVM_PROFILE_FILE: rawProfile } });
    command(llvmProfdata, ["merge", "-sparse", rawProfile, "-o", profile]);
    const report = command(llvmCov, [
      "report",
      binary,
      `-instr-profile=${profile}`,
      "--show-mcdc-summary",
      source,
    ]);
    const sourceLine = report
      .split("\n")
      .find((line) => line.includes(`${oracleCase.name}.c`));
    if (!sourceLine) throw new Error(`Clang MC/DC row was not found:\n${report}`);
    const percentages = [...sourceLine.matchAll(/(\d+(?:\.\d+)?)%/g)].map((match) =>
      Number(match[1]),
    );
    const mcdc = percentages.at(-1);
    const expected = (oracleCase.coveredConditions / golden.conditions) * 100;
    if (mcdc === undefined || Math.abs(mcdc - expected) > 0.01)
      throw new Error(
        `Clang reported ${mcdc}% MC/DC for ${oracleCase.name}; expected ${expected.toFixed(2)}%:\n${report}`,
      );
    console.log(
      `[clang-mcdc] ${oracleCase.name}: ${mcdc}% (${oracleCase.coveredConditions}/${golden.conditions} conditions)`,
    );
  }
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
