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
        const response: any = { 
            name: 'vapp',
            capabilities: { rtc: { webhooks: { event_url: { address: 'https://www.sample.com' } } } },
            privacy: { improve_ai: false }
        };
        
        this.checkDependencies(flags.platforms, flags.backend);
        this.cloneVappClients(flags.platforms, flags.backend);

        const output = await this.createApplication(response)
        this.createVonageAppKey(output);

        const appId = this.prepVappBackend(flags.backend);
        const rtcURL = `https://www.${appId}.loca.lt/rtc/events`;

        const updateResponse: any = { 
            name: 'vapp',
            capabilities: { rtc: { webhooks: { event_url: { address: rtcURL } } } },
        };
        await this.updateVonageApplication(appId, updateResponse);

        this.updateClientURL(flags.platforms, appId);
        this.startLocalVappBackend(appId);

        this.exit();
    }

    async catch(error: any) {
        return super.catch(error);
    }
}