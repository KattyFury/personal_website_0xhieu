"""Validate the checked-in CSS export and every --ds-* reference in this site."""
from pathlib import Path
import re,hashlib,json,argparse

parser=argparse.ArgumentParser()
parser.add_argument('--source',type=Path)
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
css=(root/'design-tokens.css').read_text(encoding='utf-8')
html=(root/'index.html').read_text(encoding='utf-8-sig')
definitions=set(re.findall(r'(--ds-[\w-]+)\s*:',css))
references=set(re.findall(r'var\((--ds-[\w-]+)',html+css))
missing=references-definitions
if missing:raise SystemExit('Missing design tokens: '+', '.join(sorted(missing)))
if '/design-tokens.css?v=3' not in html:raise SystemExit('Missing versioned CSS link')
if args.source:
 raw=(args.source/'tokens.json').read_bytes()
 tokens=json.loads(raw)
 if 'sha256 '+hashlib.sha256(raw).hexdigest() not in css:raise SystemExit('CSS is stale relative to design system tokens')
 if css!=(args.source/'web.css').read_text(encoding='utf-8'):raise SystemExit('Site CSS differs from generated design system export')
 if tokens['products']['0xhieu-xyz']['valuation']['visibleRows']!=8:raise SystemExit('Valuation product constraint changed')
print(f'Design system check passed: {len(definitions)} token definitions, {len(references)} references, no missing aliases.')
