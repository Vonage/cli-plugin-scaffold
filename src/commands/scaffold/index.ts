import ScaffoldCommand from '../../scaffold_base';
import { OutputFlags, OutputArgs } from '@oclif/parser';

export class Scaffold extends ScaffoldCommand {
    static description = "scaffold vonage demo projects"

    async run() {
        this.exit();
    }
}