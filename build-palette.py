"""Generate named dyes from Stain.Color (24-bit RGB)."""
import json,re
from pathlib import Path
root=Path(__file__).resolve().parent
source=json.loads((root/'stains-source.json').read_text(encoding='utf-8-sig'))
rows=[]
for row in source['rows']:
    f=row['fields']
    if row['row_id']==0 or not f['Name'].strip(): continue
    assert 0 <= f['Color'] <= 0xffffff
    name=f['Name'].strip()
    rows.append(dict(id=row['row_id'],name=name,slug=re.sub(r'[^a-z0-9]+','-',name.lower()).strip('-'),hex=f"#{f['Color']:06x}"))
assert len({r['slug'] for r in rows})==len(rows)
palette=dict(source='https://v2.xivapi.com/api/sheet/Stain?limit=500&fields=Name,Color',version=source['version'],retrieved='2026-09-12',rows=rows)
(root/'stains.js').write_text('// Generated from Stain.Color, not UIColor.\nwindow.XIV_STAINS = '+json.dumps(palette,separators=(',',':'))+';\n',encoding='utf-8')
css=['/* FFXIV Stain.Color via XIVAPI; 24-bit RGB. Snapshot '+source['version']+'.','   No Color and unnamed rows excluded. Metallic dyes use their stored flat swatch. */','@layer xiv-palette {','  :root {']
for r in rows:
    css += [f"    --xiv-stain-{r['slug']}: {r['hex']};",f"    --xiv-stain-{r['id']}: {r['hex']};"]
css += ['  }','}']
(root/'ffxiv-colors.css').write_text('\n'.join(css)+'\n',encoding='utf-8')
print(f'Generated {len(rows)} named Stain colors with name and ID aliases.')
