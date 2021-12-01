import BaseCommand from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';
import { writeFileSync, readFileSync } from 'fs';
const shell = require('shelljs');
const path = require('path');

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

    createVonageAppKey(output: any): any {
        // write vonage.app file
        let vonage_app_file_path = `${process.cwd()}/vonage_app.json`;
        let vonage_private_key_file_path = `${process.cwd()}/vapp_private.key`;

        writeFileSync(vonage_app_file_path, JSON.stringify({
            application_name: output.name,
            application_id: output.id,
            private_key: output.keys.private_key
        }, null, 2))

        writeFileSync(vonage_private_key_file_path, output.keys.private_key)
    }

    createApplication(data: object): any {
        return new Promise((res, rej) => {
            this.vonage.applications.create(data, (error: any, response: any) => {
                if (error) {
                    rej(error)
                } else {
                    res(response)
                }
            })
        })
    }

    updateVonageApplication(id: any, data: any): any {
        return new Promise((res, rej) => {
            this.vonage.applications.update(id, data, (error: any, result: any) => {
                if (error) {
                    rej(error);
                }
                else {
                    res(result);
                }
            });
        })
    }

    updateClientURL(clients: [string], url: string): any {
        if (this.checkPath('vapp')) {
            shell.cd('../', { silent: true });
        }
        if (clients.includes('ios')) {
            const baseUrlFilePath = `${process.cwd()}/vapp/client-ios/TheApp/Helpers/RemoteLoader.swift`
            let baseUrlFileRaw = readFileSync(baseUrlFilePath, 'utf8');
            baseUrlFileRaw = baseUrlFileRaw.replace('VAPP_BASE_URL', `http://localhost:3000`);
            writeFileSync(baseUrlFilePath, baseUrlFileRaw, 'utf8');
        }

        if (clients.includes('android')) {
            const baseUrlFilePath = `${process.cwd()}/vapp/client-android/app/src/main/java/com/vonage/vapp/data/ApiRepository.kt`
            let baseUrlFileRaw = readFileSync(baseUrlFilePath, 'utf8');
            baseUrlFileRaw = baseUrlFileRaw.replace('VAPP_BASE_URL', `http://localhost:3000`);
            writeFileSync(baseUrlFilePath, baseUrlFileRaw, 'utf8');
        }
    }

    prepVappBackend(deployLocation: string): any {
        if (!this.checkPath('vapp')) {
            shell.cd('vapp', { silent: true });
        }
        if (!this.checkPath('backend-node')) {
            shell.cd('backend-node', { silent: true });
        }
        let app_details_raw = readFileSync(path.join(process.cwd(), '/../vonage_app.json'));
        let app_details = (JSON.parse(app_details_raw.toString()));
        
        if (deployLocation === 'local') {
            shell.exec('psql postgres -c "CREATE DATABASE vapp WITH ENCODING \'UTF8\' TEMPLATE template0"');
            shell.exec('psql vapp -f scripts/init.sql')

            shell.exec('cp .env-sample .env')

            let pk = app_details.private_key.replace(/\n/g, '\\n');
            pk = '"'+ pk + '"'
            
            let envFileRaw = readFileSync(`${process.cwd()}/.env`, 'utf8');
            envFileRaw = envFileRaw.replace(/postgresDatabaseUrl=/g, 'postgresDatabaseUrl=postgres://@localhost:5432/vapp');
            envFileRaw = envFileRaw.replace(/vonageAppId=/g, `vonageAppId=${app_details.application_id}`);
            envFileRaw = envFileRaw.replace(/vonageAppPrivateKey=/g, `vonageAppPrivateKey=${pk}`);
            writeFileSync(`${process.cwd()}/.env`, envFileRaw, 'utf8');
            shell.cd('../');
            return app_details.application_id;
        }
    }

    startLocalVappBackend(appId: String): any {
        if (!this.checkPath('vapp')) {
            shell.cd('vapp', { silent: true });
        }
        if (!this.checkPath('backend-node')) {
            shell.cd('backend-node', { silent: true });
        }

        shell.exec('npm start', ({ async: false }))
        // shell.exec(`npx localtunnel -p=3000 --subdomain=${appId}`)
    }

    checkPath(folder: string): boolean {
        const pwd = shell.pwd()
        return pwd.includes(folder)
    }

    checkDependencies(clients: [string], deployLocation: string): any {
        if (!shell.which('git', { silent: true })) {
            this.log('Git required');
            shell.exit(1);
            return;
        }

        if (clients.includes('ios')) {
            if (!shell.which('pod', { silent: true })) {
                this.log('Cocoapods required');
                shell.exit(1);
                return;
            }
        }

        if (clients.includes('web')) {
            if (!shell.which('npm', { silent: true })) {
                this.log('NPM required');
                shell.exit(1);
                return;
            }
        }

        if (deployLocation === 'local') {
            if (!shell.which('postgres', { silent: true })) {
                this.log('Postgres required');
                shell.exit(1);
                return;
            }
        }
    }

    cloneVappClients(clients: [string], deployLocation: string): any {
        if (shell.mkdir('vapp').code !== 0) {
            this.log('Folder vapp, already exists');
            shell.exit(1);
            return;
        }

        shell.cd('vapp');
        this.log('Downloading Vapp');
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

        if (deployLocation !== 'skip') {
            this.log('Cloning the backend server');
            shell.exec('git sparse-checkout add backend-node');
        }

        shell.exec('git checkout main; rm -rf .git .gitignore', { silent: true })
        this.log('Installing the dependencies');

        if (clients.includes('ios')) {
            shell.cd('client-ios');
            shell.exec('pod install', { silent: true });
            shell.cd('../');
        }

        if (clients.includes('web')) {
            shell.cd('client-web');
            shell.exec('npm install', { silent: true });
            shell.cd('../');
        }

        if (deployLocation === 'local') {
            shell.cd('backend-node');
            shell.exec('npm install', { silent: true });
            shell.cd('../');
        }

        this.log(`The client(s) are in the vapp folder`);
    }
}