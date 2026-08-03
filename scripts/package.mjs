#!/usr/bin/env node

// Builds Saturn and zips it up ready to upload to the Chrome Web Store.
//
// The store requires manifest.json at the root of the archive, so the files are
// staged into build/ and zipped from inside it rather than zipping dist/ itself.

import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  unlinkSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(rootDir, 'dist');
const buildDir = join(rootDir, 'build');

// Everything the extension needs at runtime. Anything webpack emits that is not
// listed here — the dev harness, source maps, license sidecars — stays out of
// the archive.
const extensionFiles = [
  'manifest.json',
  'devtools.html',
  'devtools.js',
  'saturn.html',
  'saturn.js',
  'images',
];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8').replace(/^﻿/, ''));
}

function run(command, args, options = {}) {
  execFileSync(command, args, { stdio: 'inherit', ...options });
}

function formatSize(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// The manifest version is what the Chrome Web Store actually publishes, so it
// names the archive. package.json drifting out of sync is worth a nudge.
const manifest = readJson(join(rootDir, 'src', 'manifest.json'));
const packageJson = readJson(join(rootDir, 'package.json'));
const version = manifest.version;

console.log(`Packaging Saturn v${version}`);

if (packageJson.version !== version) {
  console.warn(
    `Warning: package.json is v${packageJson.version} but src/manifest.json is v${version}. ` +
      `The archive is named after the manifest, since that is the version the store publishes.`,
  );
}

const zipName = `saturn-${version}.zip`;
const zipPath = join(rootDir, zipName);

if (existsSync(buildDir)) {
  console.log('Cleaning build directory...');
  rmSync(buildDir, { recursive: true, force: true });
}

if (existsSync(zipPath)) {
  console.log(`Removing previous ${zipName}...`);
  unlinkSync(zipPath);
}

console.log('Building...');
// shell: true so this also works where yarn is a .cmd shim.
run('yarn', ['build'], { cwd: rootDir, shell: true });

console.log('Staging extension files...');
mkdirSync(buildDir, { recursive: true });

const missing = extensionFiles.filter(
  (name) => !existsSync(join(distDir, name)),
);
if (missing.length > 0) {
  console.error(
    `The build did not produce: ${missing.join(', ')}. Nothing was packaged.`,
  );
  process.exit(1);
}

for (const name of extensionFiles) {
  cpSync(join(distDir, name), join(buildDir, name), { recursive: true });
}
cpSync(join(rootDir, 'LICENSE.md'), join(buildDir, 'LICENSE.md'));

console.log(`Creating ${zipName}...`);
try {
  // -X drops the extra macOS attributes; -x skips dotfiles like .DS_Store.
  run('zip', ['-r', '-q', '-X', zipPath, '.', '-x', '.*'], { cwd: buildDir });
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error(
      'Could not find the `zip` command. Install it and try again.',
    );
    process.exit(1);
  }
  throw error;
}

const contents = readdirSync(buildDir).sort();
console.log(`\n${zipName} (${formatSize(statSync(zipPath).size)})`);
for (const name of contents) {
  console.log(`  ${name}`);
}
console.log('\nReady to upload to the Chrome Web Store.');
