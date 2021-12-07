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
            description: 'The client platforms to bootstrap.',
            required: true
        }),
        'backend': flags.string({
            description: 'Where the backend will be deployed.',
            options: ['local', 'docker' , 'skip'],
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
            await this.startVappBackend(flags.backend);
        }

        this.exit();
    }

    async catch(error: any) {
        return super.catch(error);
    }
}