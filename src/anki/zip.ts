// Why I have to use this one :(
import { Buffer } from '../../node_modules/buffer'
// import { Buffer } from 'buffer'

export namespace Zip {
    type ZipElement = {
        compression: number,
        header_size: number,
        c_size: number,
        filename: string,
        dd_size: number,
        data: Buffer
    }

    type ZipFiles = {
        [key: string]: ZipElement
    }

    export function readZip(buffer: Buffer) {

        function ReadHeader(offset: number): ZipElement | null {
            let magic = buffer.readInt32BE(offset)
            let flags = buffer.readInt16BE(offset + 0x6);
            let compression = buffer.readInt16LE(offset + 0x8);
            let c_size = buffer.readInt32LE(offset + 0x12);
            let filename = buffer.slice(offset + 0x1e, offset + 0x1e + buffer.readInt16LE(offset + 0x1a)).toString()
            if (magic == 0x504b0304) {
                let header_size = 0x1e + buffer.readInt16LE(offset + 0x1a) + buffer.readInt16LE(offset + 0x1c)
                let start_of_data = offset + header_size
                return {
                    compression,
                    header_size,
                    c_size,
                    filename,
                    dd_size: (flags & 0x1000) ? 0xb : 0,
                    data: buffer.slice(start_of_data, start_of_data + c_size)
                };
            }
            return null
        }

        let map: ZipFiles = {}

        let offset = 0;
        while (true) {
            let file = ReadHeader(offset)
            if (file) {
                offset += file.header_size + file.c_size + file.dd_size;
                map[file.filename] = file
            } else {
                break;
            }
        }

        return map

    }
}
