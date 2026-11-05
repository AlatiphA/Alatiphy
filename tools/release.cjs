// version.json is the release source of truth. No dependencies or build server required.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const check = args.length === 1 && args[0] === '--check';
if (args.length > 1 || (args[0] && !check && !/^\d+\.\d+\.\d+$/.test(args[0]))) {
  console.error('Usage: node tools/release.cjs [MAJOR.MINOR.PATCH | --check]');
  process.exit(1);
}
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
const current = JSON.parse(read('version.json'));
const version = check || !args[0] ? current.version : args[0];
if (typeof version !== 'string' || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
  throw new Error('Release version must use MAJOR.MINOR.PATCH without leading zeros.');
}
function replaceOnce(text, pattern, replacement, label) {
  if (!pattern.test(text)) throw new Error(`Missing version marker in ${label}`);
  return text.replace(pattern, replacement);
}
const manifest = JSON.parse(read('manifest.json'));
manifest.version = version; // App metadata; PWA browsers do not use this for update detection.
const files = {
  'version.json': JSON.stringify({ ...current, version }, null, 2) + '\n',
  'manifest.json': JSON.stringify(manifest, null, 2) + '\n',
  'app.js': replaceOnce(read('app.js'), /const APP_VERSION = "[^"]+";/,
    `const APP_VERSION = "${version}";`, 'app.js'),
  'sw.js': replaceOnce(read('sw.js'), /const APP_VERSION = "[^"]+";/,
    `const APP_VERSION = "${version}";`, 'sw.js'),
  'index.html': replaceOnce(read('index.html'), /(<span id="appVersion">)[^<]*(<\/span>)/,
    `$1v${version}$2`, 'index.html')
};
const stale = Object.entries(files).filter(([file, content]) => read(file) !== content);
if (check && stale.length) {
  console.error('Release files are out of sync: ' + stale.map(([file]) => file).join(', '));
  process.exit(1);
}
if (!check) for (const [file, content] of stale) fs.writeFileSync(path.join(root, file), content);
console.log(`Release ${version}: app, service worker, manifest, HTML and version.json are synchronized.`);
