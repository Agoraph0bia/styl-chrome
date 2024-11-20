import Dexie, { type EntityTable } from 'dexie';

export interface styl {
  id: number;
  name: string;
  url_match: string;
  match_fragments?: string[];
  css_content: string;
  auto_apply: boolean;
}

const db = new Dexie('styldb') as Dexie & {
  styls: EntityTable<
    styl,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  styls: `++id, 
          name, 
          url_match,
          match_fragments,
          css_content, 
          auto_apply`, // primary key "id" (for the runtime!)
});

// Add hooks that will index "url_match" for full-text search:
db.styls.hook('creating', (primKey, obj, trans) => {
  obj.match_fragments = obj.url_match?.split('*');
});
db.styls.hook('updating', (mods: any, primKey, styl, trans) => {
  return { match_fragments: mods.url_match?.split('*') };
});

db.styls.add({
  name: 'test',
  url_match: 'https://google.com*',
  css_content: 'body { background: red; }',
  auto_apply: true,
});

export { db };
