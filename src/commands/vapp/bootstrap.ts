import VappCommand from '../../vapp_base';
import { OutputFlags, OutputArgs } from '@oclif/parser';

export default class VappBootstrap extends VappCommand {
    static description = 'Bootstrap the Vapp demo projects'

    static examples = []

    static flags: OutputFlags<typeof VappCommand.flags> = {
        ...VappCommand.flags,
      }
    
    static args = []

    async run() {
        this.bootstrap();
    }

    async catch(error: any) {
        return super.catch(error);
    }
}