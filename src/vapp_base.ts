import BaseCommand from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';

export default abstract class VappCommand extends BaseCommand {

    static flags: OutputFlags<typeof BaseCommand.flags> = {
        ...BaseCommand.flags
    };

    static args = [
        ...BaseCommand.args
    ];

    async catch(error: any) {
        this.error(error);
    }

    bootstrap(): any {
        return "hi";
    }
}