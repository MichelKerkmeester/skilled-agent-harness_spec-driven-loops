import { repositoryFiles } from "../adapters/repository-files.ts";
import { TEST_FILE } from "../domain/config.ts";
import type { ReviewReport } from "../domain/types.ts";
import {
  locateSourceSignal,
  profileSourceFile,
  screenSourceFile,
} from "./codebase-judgments.ts";
import { type Log, runReview } from "./workflow.ts";

export function runCodebaseReview(scope: string, log: Log): Promise<ReviewReport> {
  return runReview(scope, log, {
    mode: "codebase",
    subject: "codebase source",
    context: "repository test",
    discover: (target) => {
      const repository = repositoryFiles(target);
      const contextFiles = repository.filter((file) => TEST_FILE.test(file.path));
      return {
        files: repository.filter((file) => !TEST_FILE.test(file.path)),
        contextFiles,
      };
    },
    screen: screenSourceFile,
    profile: profileSourceFile,
    locate: locateSourceSignal,
  });
}
