import {JSONFilePreset} from 'lowdb/node'

const defaultData: {mapas: any[]} = {mapas: []}

const serverPath = '/var/backups/mapa-backup.json'
const windowsPath = 'mapa-backup.json'
const db = await JSONFilePreset(serverPath, defaultData)

export async function saveMapaLowDB(data: any){
    await db.update(({mapas})=> mapas.push(data))
}