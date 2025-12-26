import re
import html

FILES = ["index.html", "index1.html"]

pattern_comment = re.compile(r"<!--.*?-->", re.S)
pattern_script = re.compile(r"<script[\s\S]*?</script>", re.I)
pattern_style = re.compile(r"<style[\s\S]*?</style>", re.I)
pattern_tag = re.compile(r"<[^>]+>")

for fname in FILES:
    path = fname
    try:
        with open(path, 'r', encoding='utf-8') as f:
            txt = f.read()
    except FileNotFoundError:
        print(f"{fname}: NOT FOUND")
        continue

    # remove comments, scripts, styles
    txt = pattern_comment.sub('', txt)
    txt = pattern_script.sub('', txt)
    txt = pattern_style.sub('', txt)

    # remove tags
    plain = pattern_tag.sub('\n', txt)

    # unescape html
    plain = html.unescape(plain)

    # split lines and filter
    lines = [line.strip() for line in plain.splitlines()]
    phrases = [line for line in lines if len(line) > 10]

    print(f"\n=== {fname} — {len(phrases)} frases relevantes ===")
    for i, p in enumerate(phrases, 1):
        print(f"{i:02d}. ({len(p)} chars) {p}")

print('\nHecho.')
