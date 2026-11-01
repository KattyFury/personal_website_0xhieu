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
version=re.search(r'tokens\.json v(\d+)',css)
digest=re.search(r'sha256 ([a-f0-9]{64})',css)
if not version or not digest:raise SystemExit('Missing generated CSS provenance')
url=f'/design-tokens.css?v={version.group(1)}-{digest.group(1)[:12]}'
if url not in html:raise SystemExit('Missing content-versioned CSS link')
if args.source:
 raw=(args.source/'tokens.json').read_bytes()
 tokens=json.loads(raw)
 canonical=json.dumps(tokens,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode('utf-8')
 if 'sha256 '+hashlib.sha256(canonical).hexdigest() not in css:raise SystemExit('CSS is stale relative to design system tokens')
 if css!=(args.source/'web.css').read_text(encoding='utf-8'):raise SystemExit('Site CSS differs from generated design system export')
 if tokens['products']['0xhieu-xyz']['valuation']['visibleRows']!=8:raise SystemExit('Valuation product constraint changed')
print(f'Design system check passed: {len(definitions)} token definitions, {len(references)} references, no missing aliases.')
