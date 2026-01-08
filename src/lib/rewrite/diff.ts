import { diff_match_patch, Diff } from "diff-match-patch";
import { DiffToken } from "./types";

export function generateDiff(text1: string, text2: string): DiffToken[] {
  const dmp = new diff_match_patch();
  const diffs: Diff[] = dmp.diff_main(text1, text2);
  dmp.diff_cleanupSemantic(diffs);

  return diffs.map(([type, text]) => ({
    type: type === 0 ? "equal" : type === 1 ? "insert" : "delete",
    text,
  }));
}
