import ScaffoldCommand from '../../scaffold_base';
import { flags } from '@oclif/command'
import { OutputFlags, OutputArgs } from '@oclif/parser';

interface CreateFlags {
    platforms: any
    backend: any
}

export default class ScaffoldVapp extends ScaffoldCommand {
    static description = 'Bootstrap the Vapp demo projects'

    static examples = []

    static flags: OutputFlags<typeof ScaffoldCommand.flags> & CreateFlags = {
        ...ScaffoldCommand.flags,
        'platforms': flags.string({
            description: 'Which client platforms to bootstrap',
            required: true
        }),
        'backend': flags.string({
            description: 'Where should the backend be deployed',
            options: ['local', 'skip'],
            required: true
        })
      }
    
    static args = []

    async run() {
        const flags = this.parsedFlags as OutputFlags<typeof ScaffoldCommand.flags> & CreateFlags;
        
        this.checkDependencies(flags.platforms, flags.backend);
        this.cloneVappClients(flags.platforms, flags.backend);

        if (flags.backend !== 'skip') {
            const output = await this.createApplication()
            this.createVonageAppKey(output);

            const appId = this.prepVappBackend(flags.backend);

            await this.updateVonageApplication(appId);

            this.updateClientURL(flags.platforms, appId);
            this.startLocalVappBackend(appId);
        }

        this.exit();
    }

    async catch(error: any) {
        return super.catch(error);
    }
}