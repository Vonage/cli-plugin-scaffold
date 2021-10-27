import VappCommand from '../../vapp_base';
import { OutputFlags, OutputArgs } from '@oclif/parser';

export class Vapp extends VappCommand {
    static description = "bootstrap the vapp demo projects"

    async run() {
        this.exit();
    }
}