#!/usr/bin/env python3
"""Local finalization helper: captures real Vitest output and checker results.
Does not create fake evidence, commit, push or submit on your behalf.
"""
from pathlib import Path
import subprocess, re, json
root = Path(__file__).resolve().parent
app = root / 'app'

def run(cmd, cwd):
    print('\n$ ' + ' '.join(cmd), flush=True)
    p = subprocess.run(cmd, cwd=cwd, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    print(p.stdout)
    return p

vitest = run(['npx', 'vitest', 'run'], app)
if vitest.returncode:
    raise SystemExit('Vitest failed: fix the tests before submitting. Report unchanged.')
build = run(['npm', 'run', 'build'], app)
if build.returncode:
    raise SystemExit('Build failed: fix it before submitting. Report unchanged.')
report = root / 'report.md'
t = report.read_text()
start = t.index('### 6.3 Final run')
end = t.index('## 7. Quality evaluation', start)
t = t[:start] + '### 6.3 Final run\n\nActual final `npx vitest run` output from the local app:\n\n```text\n' + vitest.stdout.strip() + '\n```\n\nProduction build also succeeded via `npm run build`.\n\n' + t[end:]
m = re.search(r'Tests\s+(\d+) passed \((\d+)\)', vitest.stdout)
if not m: raise SystemExit('Cannot parse Vitest count; inspect output manually')
passed, total = map(int, m.groups())
t = t.replace('26/26 last confirmed; 28 tests pending final run', f'{passed}/{total}').replace('Original is the actual §1.1 baseline; 26/26 is the user\'s last actual Vitest run; updated final count is from `tests/check_sis.py`, not yet a passed run.', 'Original is the actual §1.1 baseline; final is the real Vitest output in §6.3 from this local run.')
t = re.sub(r'\n\*\*Pending verification:\*\* Update the final test fraction from the real final run before submission\. The current 26/26 figure describes the previous verified version, not the modified 28-test bundle\.', '', t)
report.write_text(t)
check = run(['python3','tests/check_sis.py','--json'], root)
try: data = json.loads(check.stdout)
except ValueError: raise SystemExit('Cannot parse checker JSON')
counts=data['counts']; fails=[r['id'] for r in data['rows'] if r['verdict']!='PASS']
print('Checker:', counts, 'Outstanding:', fails)
# Update known fails and counts, leaving personal fields for the user.
yml = root/'submission.yml'
y=yml.read_text()
for key,val in [('pass',counts['PASS']),('fail',counts['FAIL']),('error',counts['ERROR'])]:
    y=re.sub(r'(?m)^(  '+key+r':)\s*[^\n]*$', rf'\g<1> {val}', y)
y=re.sub(r'(?m)^(  known_fails:)\s*[^\n]*$',r'\g<1> ['+', '.join(fails)+']',y)
yml.write_text(y)
# Update report §9 with current checker failures.
t=report.read_text(); a=t.index('## 9. Checker results and known fails'); b=t.index('## 10. AI reflection',a)
rows='\n'.join('| '+r['id']+' | '+r['message'].replace('|','/')+' |' for r in data['rows'] if r['verdict']!='PASS')
if not rows: rows='| none | All 33 checker items passed on this run. |'
t=t[:a]+'## 9. Checker results and known fails\n\nChecker output after the local final test run: '+str(counts)+'.\n\n| Check | Why it still fails |\n| --- | --- |\n'+rows+'\n\n'+t[b:]
report.write_text(t)
print('\nUpdated report.md and submission.yml with real local results. Fill student fields, capture screenshots, run this helper again, then validate_submission.py.')
