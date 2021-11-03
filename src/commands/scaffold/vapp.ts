import ScaffoldCommand from '../../scaffold_base';
import { flags } from '@oclif/command'
import { OutputFlags, OutputArgs } from '@oclif/parser';

interface CreateFlags {
    platforms: any
}

export default class ScaffoldVapp extends ScaffoldCommand {
    static description = 'Bootstrap the Vapp demo projects'

    static examples = []

    static flags: OutputFlags<typeof ScaffoldCommand.flags> & CreateFlags = {
        ...ScaffoldCommand.flags,
        'platforms': flags.string({
            description: 'Which client platforms to bootstrap',
            required: true
        })
      }
    
    static args = []

    async run() {
        const flags = this.parsedFlags as OutputFlags<typeof ScaffoldCommand.flags> & CreateFlags;
        this.cloneClients(flags.platforms);
        this.exit();
    }

    async catch(error: any) {
        return super.catch(error);
    }
}