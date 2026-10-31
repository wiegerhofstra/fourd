import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdir, mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { test } from 'node:test';

// Exercise the real Astro build against a deterministic CMS, without production credentials.
test('static builds include localized pages and CMS media links, and reject incomplete CMS content', async (t) => {
  // Astro moves prerendered assets with rename(), so output must be on the project filesystem.
  await mkdir('.astro', { recursive: true });
  const output = await mkdtemp(join(process.cwd(), '.astro', 'static-test-'));
  const token = 'synthetic-build-test-token';
  const modelIds = {
    page: 'c14051f7-8f0f-422d-9acf-f568b5c9f1e4',
    service: 'ca392046-8f89-471e-979f-fb1dff75642b',
    menu: '4b7dbfbb-eaab-44d7-bd4a-8ef1b97d6c0f',
  };
  const imageId = '11111111-1111-4111-8111-111111111111';
  const pdfId = '22222222-2222-4222-8222-222222222222';
  const requests = [];
  let failure = null;
  let origin;
  const entry = (id, model, url, data) => ({
    id, modelId: modelIds[model], url, data, status: 'published', pageParentId: null,
    createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z', publishedAt: '2026-01-01T00:00:00Z',
  });
  // Asset url and downloadUrl are the same stable CMS file URL, published as-is in the HTML.
  const fileUrl = (id) => `${origin}/files/${id}?signature=stable`;
  const asset = (id) => ({
    id, mimeType: id === imageId ? 'image/png' : 'application/pdf',
    originalName: id === imageId ? 'example.png' : 'brochure.pdf',
    sizeBytes: 64,
    imageWidth: id === imageId ? 1 : null, imageHeight: id === imageId ? 1 : null,
    url: fileUrl(id),
    downloadUrl: fileUrl(id),
  });
  const server = createServer((req, res) => {
    const url = new URL(req.url, origin);
    requests.push(url.pathname + url.search);
    const json = (data, status = 200) => {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    };
    if (req.headers.authorization !== `Bearer ${token}`) return json({ error: { message: 'Unauthorized' } }, 401);
    const model = /\/models\/(page|service|menu)\/entries$/.exec(url.pathname)?.[1];
    if (!model) return json({ error: { message: 'Unknown request' } }, 404);
    if (failure === 'cms' && model === 'menu') return json({ error: { message: 'CMS unavailable' } }, 503);
    const locale = url.searchParams.get('locale');
    const english = locale === 'en';
    const child = entry('child-page', 'page', english ? '/parent/child' : '/ouder/kind', {
      title: english ? 'Nested English page' : 'Geneste Nederlandse pagina',
      slug: english ? 'child' : 'kind', cover_image: asset(imageId),
      content: { type: 'doc', content: [
        { type: 'asset', attrs: { asset: asset(imageId) } },
        { type: 'asset', attrs: { asset: null } },
        { type: 'paragraph', content: [{ type: 'text', text: 'Download brochure', marks: [
          { type: 'link', attrs: { kind: 'asset', assetId: pdfId, href: fileUrl(pdfId) } },
        ] }] },
      ] },
    });
    const servicePage = entry('service-page', 'page', '/mobile-apps', { title: 'Mobile apps', slug: 'mobile-apps' });
    const menuPage = entry('menu-page', 'page', english ? '/about' : '/over-ons', { title: 'About', slug: 'about' });
    // The collection deliberately excludes the component pages embedded in services and menus.
    const collection = {
      page: url.searchParams.has('cursor') ? [entry('second-page', 'page', '/second', { title: 'Second page' })] : [child],
      service: [entry('service', 'service', null, { title: 'Mobile apps', page: servicePage })],
      menu: [entry('menu', 'menu', null, { items: [menuPage] })],
    };
    json({ data: collection[model], meta: {
      locale, maxDepth: Number(url.searchParams.get('maxDepth')),
      nextCursor: model === 'page' && !url.searchParams.has('cursor') ? 'page-2' : null,
    } });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await rm(output, { recursive: true, force: true });
  });

  async function build(name) {
    const directory = join(output, name);
    const child = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build', '--outDir', directory], {
      env: { ...process.env, CMS_URL: origin, CMS_ACCESS_TOKEN: token, CMS_TENANT_SLUG: 'fourd', PUBLIC_URL: 'https://static.example' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let log = '';
    child.stdout.on('data', (chunk) => { log += chunk; });
    child.stderr.on('data', (chunk) => { log += chunk; });
    const code = await new Promise((resolve, reject) => {
      child.once('error', reject);
      child.once('exit', resolve);
    });
    return { directory, code, log };
  }

  const good = await build('good');
  assert.equal(good.code, 0, good.log);
  for (const file of ['index.html', '404.html', 'en/404/index.html', 'ouder/kind/index.html',
    'en/parent/child/index.html', 'mobile-apps/index.html', 'en/mobile-apps/index.html',
    'over-ons/index.html', 'en/about/index.html', 'second/index.html', 'en/second/index.html']) {
    await readFile(join(good.directory, file));
  }
  const page = await readFile(join(good.directory, 'ouder/kind/index.html'), 'utf8');
  assert.match(page, /Geneste Nederlandse pagina/);
  assert.ok(page.includes('https://static.example/en/parent/child'));
  assert.ok(page.includes(fileUrl(imageId)));
  assert.ok(page.includes(fileUrl(pdfId)));
  const redirect = await readFile(join(good.directory, 'diensten/applicaties/index.html'), 'utf8');
  assert.match(redirect, /http-equiv="refresh"/);
  assert.match(redirect, /url=\/mobile-apps/);
  assert.ok(requests.some((path) => path.includes('cursor=page-2')), 'Pagination must be followed');
  assert.equal(requests.some((path) => path.startsWith('/files/')), false, 'Media is linked, not downloaded');
  for (const file of await readdir(good.directory, { recursive: true, withFileTypes: true })) {
    if (!file.isFile()) continue;
    const body = await readFile(join(file.parentPath, file.name));
    assert.equal(body.includes(Buffer.from(token)), false, `${file.name} contains the CMS token`);
  }
  await assert.rejects(readFile(join(good.directory, 'server/entry.mjs')));
  await assert.rejects(readFile(join(good.directory, 'api/revalidate')));
  await assert.rejects(readdir(join(good.directory, 'media')));

  failure = 'cms';
  const badCms = await build('bad-cms');
  assert.notEqual(badCms.code, 0, 'CMS failures must fail deployment builds');
  assert.match(badCms.log, /CMS unavailable/);
});
