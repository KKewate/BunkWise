'use strict';

// Build step: validates the frontend and copies it to dist/ with build info.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'public');
const out = path.join(root, 'dist');

if (!fs.existsSync(path.join(src, 'index.html'))) {
  console.error('Build failed: public/index.html is missing');
  process.exit(1);
}

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(src, out, { recursive: true });

const pkg = require('../package.json');
const info = {
  name: pkg.name,
  version: pkg.version,
  commit: process.env.GITHUB_SHA || 'local',
  builtAt: new Date().toISOString(),
};
fs.writeFileSync(path.join(out, 'build-info.json'), JSON.stringify(info, null, 2));

console.log(`Build OK -> dist/ (${info.name}@${info.version}, commit ${info.commit})`);
