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

    cloneVappClients(clients: [string]): any {
        if (!shell.which('git', { silent: true })) {
            this.log('Git required');
            shell.exit(1);
            return;
        }

        if (shell.mkdir('vapp').code !== 0) {
            this.log('Folder vapp, already exists');
            shell.exit(1);
            return;
        }

        shell.cd('vapp'); // entering the vapp folder
        this.log('Downloading the clients');
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
        shell.cd('..'); // leaving the vapp folder

        this.log('Installing the dependencies');

        if (clients.includes('ios')) {
            shell.cd('vapp/client-ios');
            if (!shell.which('pod', { silent: true })) {
                this.log('Cocoapods required');
                shell.exit(1);
                return;
            }
            shell.exec('pod install', { silent: true });
            shell.cd('../');
        }

        if (clients.includes('web')) {
            shell.cd('vapp/client-web');
            if (!shell.which('npm', { silent: true })) {
                this.log('NPM required');
                shell.exit(1);
                return;
            }
            shell.exec('npm install', { silent: true });
            shell.cd('../');
        }

        this.log(`The client(s) are in the vapp folder`);
        shell.exit();
    }
}