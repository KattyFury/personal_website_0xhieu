"""Copy the generated, versioned CSS from the design system checkout."""
from pathlib import Path
import argparse, json, hashlib

parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path, default=Path(__file__).resolve().parents[2] / 'repo_personal_design')
args = parser.parse_args()
raw = (args.source / 'tokens.json').read_bytes()
tokens = json.loads(raw)
css = (args.source / 'web.css').read_text(encoding='utf-8')
if 'sha256 ' + hashlib.sha256(raw).hexdigest() not in css:
    raise SystemExit('Stale web.css: run python export_web.py in the design system repo first.')
target = Path(__file__).resolve().parents[1] / 'design-tokens.css'
target.write_text(css, encoding='utf-8')
print(f'Synchronized design system v{tokens["version"]} -> {target.name}')
