import BaseCommand from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';
var shell = require('shelljs');

export default abstract class ScaffoldCommand extends BaseCommand {

    static flags: OutputFlags<typeof BaseCommand.flags> = {
        ...BaseCommand.flags
    };

    static args = [
        ...BaseCommand.args
    ];

    async catch(error: any) {
        this.error(error);
    }

    cloneClients(clients: [string]): any {
        if (!shell.which('git', { silent: true })) {
            shell.echo('Git required');
            shell.exit(1);
            return;
        }

        if (!shell.mkdir('vapp')) {
            shell.echo('Folder vapp, already exists');
            shell.exit(1);
            return;
        }
        
        shell.cd('vapp');
        shell.exec('git clone https://github.com/nexmo-community/clientsdk-the-v-app.git . --no-checkout --depth 1', { silent: true });
        
        shell.exec('git sparse-checkout init --cone');
        if (clients.includes('ios')) {
            this.log('Cloning the iOS client');
            shell.exec('git sparse-checkout add client-ios');
        }

        if (clients.includes('android')) {
            this.log('Cloning the Android client');
            shell.exec('git sparse-checkout add client-android');
        }

        if (clients.includes('web')) {
            this.log('Cloning the Web client');
            shell.exec('git sparse-checkout add client-web');
        }

        shell.exec('git checkout main; rm -rf .git .gitignore', { silent: true })
        this.log(`The ${clients} clients are in the vapp folder`);
        shell.exit();
    }
}