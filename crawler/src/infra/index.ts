process.env.TZ = 'America/Sao_Paulo';
import "dotenv/config"
import { addAlias } from 'module-alias'
import { resolve } from 'path'

addAlias('@', resolve(__dirname, '..'))
