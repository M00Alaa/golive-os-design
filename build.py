#!/usr/bin/env python3
"""Compose html/<name>.html from src/<name>.page  (CSS, then a line '//JS', then the GL.mount({...}) script)."""
import sys, os, glob
root = os.path.dirname(os.path.abspath(__file__))
HEAD = '''<!doctype html>
<html lang="ar" dir="rtl" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GoLive OS</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300..700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/tokens.css">
<link rel="stylesheet" href="assets/app.css">
<link rel="stylesheet" href="assets/screens.css">
<style>
%s
</style>
</head>
<body>
<div id="app"></div>
<script src="assets/icons.js"></script>
<script src="assets/charts.js"></script>
<script src="assets/data.js"></script>
<script src="assets/app.js"></script>
<script src="assets/interact.js"></script>
<script>
%s
</script>
</body>
</html>
'''
names = sys.argv[1:] or [os.path.basename(p)[:-5] for p in glob.glob(root + '/src/*.page')]
for n in names:
    s = open(f'{root}/src/{n}.page').read()
    css, js = s.split('//JS\n', 1)
    open(f'{root}/html/{n}.html', 'w').write(HEAD % (css.strip(), js.strip()))
    print('built', n)
