// scripts/pre-commit-nix-sync.ts — Cross-platform pre-commit hook for nix sync
//
// This script is called from .husky/pre-commit to handle bun.lock changes.
// It works on Windows, macOS, and Linux.
//
// What it does:
//   1. Checks if bun.lock is staged for commit
//   2. If yes, regenerates .nix/bun.nix (if bun2nix is available)
//   3. Updates .nix/bun-lock-hash with the new hash
//   4. Stages the updated nix files

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";

const root = resolve(import.meta.dirname, "..");
const nixDir = join(root, ".nix");
const lockFile = join(root, "bun.lock");
const hashFile = join(nixDir, "bun-lock-hash");
const nixFile = join(nixDir, "bun.nix");

// Check if bun.lock is staged for commit
function isBunLockStaged(): boolean {
  const result = Bun.spawnSync(["git", "diff", "--cached", "--name-only"], {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });

  if (result.exitCode !== 0) {
    console.warn("[pre-commit-nix-sync] Failed to check staged files");
    return false;
  }

  const stagedFiles = result.stdout.toString().trim().split("\n");
  return stagedFiles.some((f) => f === "bun.lock" || f.endsWith("/bun.lock"));
}

// Compute SHA256 of bun.lock
function computeHash(): string {
  const content = readFileSync(lockFile);
  return new Bun.CryptoHasher("sha256").update(content).digest("hex");
}

// Try to regenerate bun.nix (only works on systems with bun2nix)
function regenerateBunNix(): boolean {
  // On Windows, bun2nix typically doesn't work (requires Nix)
  if (process.platform === "win32") {
    console.log("[pre-commit-nix-sync] Skipping bun.nix generation on Windows");
    return false;
  }

  const result = Bun.spawnSync(["bunx", "bun2nix", "-o", nixFile], {
    cwd: root,
    stdio: ["inherit", "inherit", "inherit"],
  });

  return result.exitCode === 0;
}

// Main logic
async function main() {
  if (!existsSync(lockFile)) {
    console.log("[pre-commit-nix-sync] No bun.lock found, skipping");
    process.exit(0);
  }

  if (!isBunLockStaged()) {
    console.log("[pre-commit-nix-sync] bun.lock not staged, skipping");
    process.exit(0);
  }

  console.log("[pre-commit-nix-sync] bun.lock is staged, syncing nix files...");

  // Try to regenerate bun.nix (may fail on Windows, that's OK)
  const nixGenerated = regenerateBunNix();
  if (!nixGenerated && process.platform !== "win32") {
    console.warn("[pre-commit-nix-sync] Warning: bun2nix failed");
  }

  // Always update the hash file (cross-platform)
  const hash = computeHash();
  writeFileSync(hashFile, hash + "\n");
  console.log(`[pre-commit-nix-sync] Updated ${hashFile}`);

  // Stage the updated files
  const filesToStage = [hashFile];
  if (existsSync(nixFile)) {
    filesToStage.push(nixFile);
  }

  const addResult = Bun.spawnSync(["git", "add", ...filesToStage], {
    cwd: root,
    stdio: "inherit",
  });

  if (addResult.exitCode !== 0) {
    console.error("[pre-commit-nix-sync] Failed to stage updated nix files");
    process.exit(1);
  }

  console.log("[pre-commit-nix-sync] Done");
}

main();
