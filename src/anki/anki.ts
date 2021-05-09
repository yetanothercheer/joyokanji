import { Zip } from './zip'

// Angular " Can't resolve 'fs' in ~ " の対処法
// https://qiita.com/SideSpoilenm/items/d0975324c08bc20dedf7
import initSqlJs from 'sql.js'

declare module 'pako' { }
import * as pako from 'pako'

import { Buffer } from '../../node_modules/buffer'

export async function readAnkiFile(file: ArrayBuffer) {
    let files = Zip.readZip(Buffer.from(file))

    const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
    });

    let j = pako.inflateRaw(files['media'].data, { to: 'string' })
    let media = JSON.parse(j);
    // media: string(name in files) -> string(name in database)

    let raw_db_compressed = files['collection.anki2'].data;
    let raw_db = pako.inflateRaw(raw_db_compressed)
    let db = new SQL.Database(raw_db);


    let query = (sql: string) => {
        let ret = []
        let stmt = db.prepare(sql)
        while (stmt.step()) {
            ret.push(stmt.getAsObject())
        }
        return ret
    }

    let col = query("SELECT * from col")[0];

    let models = JSON.parse(col['models'] as string)
    let decks = JSON.parse(col['decks'] as string)

    let cards = query('SELECT * from cards ORDER BY due')

    let notes = query('select * from notes')

    return cards.map(i => {
        let note = query(`SELECT flds, tags from notes where id=${i.nid}`);
        let tags = note[0].tags
        let fields = (note[0].flds as string).split("\x1f")
        return {
            kanji: fields[0],
            imi: fields[1],
            gorei: fields[2],
            onyomi: fields[3],
            kunyomi: fields[4],
            sankou: fields[7],
            tags
        }
    })
}

