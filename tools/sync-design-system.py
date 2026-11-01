"""Copy the generated, versioned CSS from the design system checkout."""
from pathlib import Path
import argparse, json, hashlib, re

parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path, default=Path(__file__).resolve().parents[2] / 'repo_personal_design')
args = parser.parse_args()
raw = (args.source / 'tokens.json').read_bytes()
tokens = json.loads(raw)
canonical = json.dumps(tokens, sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode('utf-8')
css = (args.source / 'web.css').read_text(encoding='utf-8')
if 'sha256 ' + hashlib.sha256(canonical).hexdigest() not in css:
    raise SystemExit('Stale web.css: run python export_web.py in the design system repo first.')
target = Path(__file__).resolve().parents[1] / 'design-tokens.css'
target.write_text(css, encoding='utf-8')
page = target.parent / 'index.html'
url = f'/design-tokens.css?v={tokens["version"]}-{hashlib.sha256(canonical).hexdigest()[:12]}'
html = page.read_text(encoding='utf-8')
updated, count = re.subn(r'/design-tokens\.css\?v=[^"\s]+', url, html)
if count != 1:
    raise SystemExit('Expected exactly one versioned design-tokens.css link in index.html.')
page.write_text(updated, encoding='utf-8')
print(f'Synchronized design system v{tokens["version"]} -> {target.name}')
